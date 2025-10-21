import { supabase } from '@/lib/supabase';
import type { 
  QuizCertificatePageData, 
  QuizAttempt, 
  Certificate, 
  QuizFeedback,
  QuizCertificatePageResponse,
  CertificateVerificationResponse
} from '@/types/quiz-certificate';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// =====================================================
// QUIZ CERTIFICATE PAGE API
// =====================================================

export async function getQuizCertificatePage(quizAttemptId: string): Promise<QuizCertificatePageData> {
  try {
    // Get quiz attempt with related data
    const { data: quizAttempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quizzes!inner(*),
        certificates(*)
      `)
      .eq('id', quizAttemptId)
      .single();

    if (attemptError) {
      throw new Error(`Failed to fetch quiz attempt: ${attemptError.message}`);
    }

    // Get quiz feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('quiz_feedback')
      .select('*')
      .eq('quiz_attempt_id', quizAttemptId)
      .order('created_at');

    if (feedbackError) {
      throw new Error(`Failed to fetch quiz feedback: ${feedbackError.message}`);
    }

    // Get quiz questions for the quiz
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizAttempt.quiz_id)
      .order('sort_order');

    if (questionsError) {
      throw new Error(`Failed to fetch quiz questions: ${questionsError.message}`);
    }

    // Calculate remaining attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('quiz_id', quizAttempt.quiz_id)
      .eq('user_id', quizAttempt.user_id);

    if (attemptsError) {
      throw new Error(`Failed to fetch attempts: ${attemptsError.message}`);
    }

    const remainingAttempts = Math.max(0, quizAttempt.quizzes.max_attempts - attempts.length);
    const canRetake = remainingAttempts > 0;

    // Transform the data to match the expected format
    const quizCertificateData: QuizCertificatePageData = {
      quiz_attempt: {
        id: quizAttempt.id,
        user_id: quizAttempt.user_id,
        quiz_id: quizAttempt.quiz_id,
        course_id: quizAttempt.course_id,
        attempt_number: quizAttempt.attempt_number,
        answers: quizAttempt.answers,
        score: quizAttempt.score,
        max_score: quizAttempt.max_score,
        passed: quizAttempt.passed,
        passing_threshold: quizAttempt.passing_threshold,
        started_at: quizAttempt.started_at,
        completed_at: quizAttempt.completed_at,
        time_spent_seconds: quizAttempt.time_spent_seconds,
        status: quizAttempt.status,
        created_at: quizAttempt.created_at,
        updated_at: quizAttempt.updated_at
      },
      certificate: quizAttempt.certificates?.[0] || null,
      feedback: feedback || [],
      quiz: {
        id: quizAttempt.quizzes.id,
        title: quizAttempt.quizzes.title,
        description: quizAttempt.quizzes.description,
        course_id: quizAttempt.quizzes.course_id,
        questions: questions || [],
        passing_threshold: quizAttempt.quizzes.passing_threshold,
        max_attempts: quizAttempt.quizzes.max_attempts,
        time_limit_minutes: quizAttempt.quizzes.time_limit_minutes,
        status: quizAttempt.quizzes.status,
        created_at: quizAttempt.quizzes.created_at,
        updated_at: quizAttempt.quizzes.updated_at
      },
      can_retake: canRetake,
      max_attempts: quizAttempt.quizzes.max_attempts,
      remaining_attempts: remainingAttempts
    };

    return quizCertificateData;
  } catch (error) {
    console.error('Error fetching quiz certificate page:', error);
    throw error;
  }
}

// =====================================================
// QUIZ ATTEMPTS API
// =====================================================

export async function getQuizAttempt(quizAttemptId: string): Promise<QuizAttempt> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('id', quizAttemptId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch quiz attempt: ${error.message}`);
  }

  return data;
}

export async function getQuizAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch quiz attempts: ${error.message}`);
  }

  return data || [];
}

export async function createQuizAttempt(quizId: string, courseId?: string): Promise<QuizAttempt> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get quiz details to determine attempt number
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('max_attempts, passing_threshold')
    .eq('id', quizId)
    .single();

  if (quizError) {
    throw new Error(`Failed to fetch quiz: ${quizError.message}`);
  }

  // Get existing attempts for this user and quiz
  const { data: existingAttempts, error: attemptsError } = await supabase
    .from('quiz_attempts')
    .select('attempt_number')
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)
    .order('attempt_number', { ascending: false });

  if (attemptsError) {
    throw new Error(`Failed to fetch existing attempts: ${attemptsError.message}`);
  }

  const nextAttemptNumber = (existingAttempts?.[0]?.attempt_number || 0) + 1;

  // Create new attempt
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      course_id: courseId,
      attempt_number: nextAttemptNumber,
      passing_threshold: quiz.passing_threshold,
      status: 'in_progress'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create quiz attempt: ${error.message}`);
  }

  return data;
}

export async function updateQuizAttempt(
  quizAttemptId: string, 
  updates: Partial<QuizAttempt>
): Promise<QuizAttempt> {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .update(updates)
    .eq('id', quizAttemptId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update quiz attempt: ${error.message}`);
  }

  return data;
}

export async function submitQuizAttempt(
  quizAttemptId: string, 
  answers: any[]
): Promise<QuizAttempt> {
  // Get quiz attempt and quiz details
  const { data: quizAttempt, error: attemptError } = await supabase
    .from('quiz_attempts')
    .select(`
      *,
      quizzes!inner(*)
    `)
    .eq('id', quizAttemptId)
    .single();

  if (attemptError) {
    throw new Error(`Failed to fetch quiz attempt: ${attemptError.message}`);
  }

  // Get quiz questions
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizAttempt.quiz_id)
    .order('sort_order');

  if (questionsError) {
    throw new Error(`Failed to fetch quiz questions: ${questionsError.message}`);
  }

  // Calculate score
  let totalScore = 0;
  let maxScore = 0;
  const feedbackData = [];

  for (const question of questions) {
    const userAnswer = answers.find(a => a.question_id === question.id);
    const isCorrect = userAnswer && 
      JSON.stringify(userAnswer) === JSON.stringify(question.correct_answer);
    
    const pointsAwarded = isCorrect ? question.points : 0;
    totalScore += pointsAwarded;
    maxScore += question.points;

    // Create feedback record
    feedbackData.push({
      quiz_attempt_id: quizAttemptId,
      question_id: question.id,
      question_text: question.question_text,
      question_type: question.question_type,
      user_answer: userAnswer || {},
      correct_answer: question.correct_answer,
      is_correct: isCorrect,
      explanation: question.explanation,
      remediation_clip_id: question.remediation_clip_id,
      points_awarded: pointsAwarded,
      max_points: question.points
    });
  }

  const passed = (totalScore / maxScore) * 100 >= quizAttempt.passing_threshold;

  // Update quiz attempt
  const { data: updatedAttempt, error: updateError } = await supabase
    .from('quiz_attempts')
    .update({
      answers,
      score: totalScore,
      max_score: maxScore,
      passed,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', quizAttemptId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update quiz attempt: ${updateError.message}`);
  }

  // Insert feedback records
  if (feedbackData.length > 0) {
    const { error: feedbackError } = await supabase
      .from('quiz_feedback')
      .insert(feedbackData);

    if (feedbackError) {
      console.error('Failed to insert feedback:', feedbackError);
      // Don't throw error here as the attempt was already updated
    }
  }

  return updatedAttempt;
}

// =====================================================
// CERTIFICATES API
// =====================================================

export async function getCertificate(certificateId: string): Promise<Certificate> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', certificateId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch certificate: ${error.message}`);
  }

  return data;
}

export async function getCertificatesByUser(): Promise<Certificate[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch certificates: ${error.message}`);
  }

  return data || [];
}

export async function downloadCertificate(certificateId: string): Promise<Blob> {
  // For now, return a mock PDF blob
  // In a real implementation, this would generate a PDF from the certificate data
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', certificateId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch certificate: ${error.message}`);
  }

  // Create a mock PDF blob (in real implementation, use a PDF generation library)
  const pdfContent = `Certificate: ${certificate.title}\nCertificate Number: ${certificate.certificate_number}\nIssued: ${certificate.issued_at}`;
  return new Blob([pdfContent], { type: 'application/pdf' });
}

export async function shareCertificate(certificateId: string): Promise<{ shareUrl: string }> {
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('verification_url')
    .eq('id', certificateId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch certificate: ${error.message}`);
  }

  return {
    shareUrl: certificate.verification_url
  };
}

// =====================================================
// CERTIFICATE VERIFICATION API
// =====================================================

export async function verifyCertificate(verificationToken: string): Promise<CertificateVerificationResponse> {
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('verification_token', verificationToken)
    .eq('status', 'issued')
    .single();

  if (error) {
    return {
      valid: false,
      error: 'Certificate not found or invalid'
    };
  }

  // Check if certificate is expired
  if (certificate.expires_at && new Date(certificate.expires_at) < new Date()) {
    return {
      valid: false,
      error: 'Certificate has expired'
    };
  }

  return {
    valid: true,
    certificate
  };
}

// =====================================================
// QUIZ FEEDBACK API
// =====================================================

export async function getQuizFeedback(quizAttemptId: string): Promise<QuizFeedback[]> {
  const { data, error } = await supabase
    .from('quiz_feedback')
    .select('*')
    .eq('quiz_attempt_id', quizAttemptId)
    .order('created_at');

  if (error) {
    throw new Error(`Failed to fetch quiz feedback: ${error.message}`);
  }

  return data || [];
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function formatTimeSpent(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function formatScore(score: number, maxScore: number): string {
  const percentage = Math.round((score / maxScore) * 100);
  return `${score}/${maxScore} (${percentage}%)`;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 90) return 'text-winbro-success';
  if (percentage >= 70) return 'text-winbro-amber';
  return 'text-destructive';
}

export function getPassStatus(score: number, passingThreshold: number): {
  passed: boolean;
  color: string;
  message: string;
} {
  const passed = score >= passingThreshold;
  return {
    passed,
    color: passed ? 'text-winbro-success' : 'text-destructive',
    message: passed ? 'Passed' : 'Failed'
  };
}
