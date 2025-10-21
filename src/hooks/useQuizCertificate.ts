import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getQuizCertificatePage, 
  getQuizAttempt, 
  getQuizAttemptsByQuiz,
  createQuizAttempt,
  updateQuizAttempt,
  submitQuizAttempt,
  getCertificate,
  getCertificatesByUser,
  downloadCertificate,
  shareCertificate,
  verifyCertificate,
  getQuizFeedback
} from '@/api/quiz-certificate';
import type { 
  QuizCertificatePageData, 
  QuizAttempt, 
  Certificate, 
  QuizFeedback,
  QuizAttemptInsert,
  QuizAttemptUpdate
} from '@/types/quiz-certificate';

// =====================================================
// QUIZ CERTIFICATE PAGE HOOKS
// =====================================================

export function useQuizCertificatePage(quizAttemptId: string) {
  return useQuery({
    queryKey: ['quiz-certificate-page', quizAttemptId],
    queryFn: () => getQuizCertificatePage(quizAttemptId),
    enabled: !!quizAttemptId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// =====================================================
// QUIZ ATTEMPTS HOOKS
// =====================================================

export function useQuizAttempt(quizAttemptId: string) {
  return useQuery({
    queryKey: ['quiz-attempt', quizAttemptId],
    queryFn: () => getQuizAttempt(quizAttemptId),
    enabled: !!quizAttemptId,
  });
}

export function useQuizAttemptsByQuiz(quizId: string) {
  return useQuery({
    queryKey: ['quiz-attempts', quizId],
    queryFn: () => getQuizAttemptsByQuiz(quizId),
    enabled: !!quizId,
  });
}

export function useCreateQuizAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizId, courseId }: { quizId: string; courseId?: string }) => 
      createQuizAttempt(quizId, courseId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', data.quiz_id] });
      queryClient.invalidateQueries({ queryKey: ['quiz-certificate-page'] });
    },
  });
}

export function useUpdateQuizAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizAttemptId, updates }: { quizAttemptId: string; updates: QuizAttemptUpdate }) => 
      updateQuizAttempt(quizAttemptId, updates),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt', data.id] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', data.quiz_id] });
      queryClient.invalidateQueries({ queryKey: ['quiz-certificate-page'] });
    },
  });
}

export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ quizAttemptId, answers }: { quizAttemptId: string; answers: any[] }) => 
      submitQuizAttempt(quizAttemptId, answers),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt', data.id] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', data.quiz_id] });
      queryClient.invalidateQueries({ queryKey: ['quiz-certificate-page'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-feedback'] });
    },
  });
}

// =====================================================
// CERTIFICATES HOOKS
// =====================================================

export function useCertificate(certificateId: string) {
  return useQuery({
    queryKey: ['certificate', certificateId],
    queryFn: () => getCertificate(certificateId),
    enabled: !!certificateId,
  });
}

export function useCertificatesByUser() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: getCertificatesByUser,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useDownloadCertificate() {
  return useMutation({
    mutationFn: downloadCertificate,
    onSuccess: (blob, certificateId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useShareCertificate() {
  return useMutation({
    mutationFn: shareCertificate,
    onSuccess: (data) => {
      // Copy share URL to clipboard
      navigator.clipboard.writeText(data.shareUrl);
    },
  });
}

export function useVerifyCertificate() {
  return useMutation({
    mutationFn: verifyCertificate,
  });
}

// =====================================================
// QUIZ FEEDBACK HOOKS
// =====================================================

export function useQuizFeedback(quizAttemptId: string) {
  return useQuery({
    queryKey: ['quiz-feedback', quizAttemptId],
    queryFn: () => getQuizFeedback(quizAttemptId),
    enabled: !!quizAttemptId,
  });
}

// =====================================================
// UTILITY HOOKS
// =====================================================

export function useQuizCertificateData(quizAttemptId: string) {
  const { data, isLoading, error } = useQuizCertificatePage(quizAttemptId);
  
  if (!data) {
    return { data: null, isLoading, error };
  }

  // Calculate derived data
  const scoreSummary = {
    score: data.quiz_attempt.score,
    max_score: data.quiz_attempt.max_score,
    percentage: Math.round((data.quiz_attempt.score / data.quiz_attempt.max_score) * 100),
    passed: data.quiz_attempt.passed,
    attempts_used: data.quiz_attempt.attempt_number,
    max_attempts: data.quiz.max_attempts || 3,
    remaining_attempts: data.remaining_attempts,
    time_spent_seconds: data.quiz_attempt.time_spent_seconds
  };

  const questionFeedbacks = data.feedback.map(fb => {
    const question = data.quiz.questions.find(q => q.id === fb.question_id);
    return {
      question: question!,
      feedback: fb,
      user_answer: fb.user_answer,
      correct_answer: fb.correct_answer,
      is_correct: fb.is_correct,
      explanation: fb.explanation,
      remediation_clip_id: fb.remediation_clip_id,
      points_awarded: fb.points_awarded,
      max_points: fb.max_points
    };
  });

  const certificateInfo = data.certificate ? {
    certificate: data.certificate,
    verification_url: data.certificate.verification_url,
    download_url: `/api/certificates/${data.certificate.id}/download`,
    share_url: `/certificates/${data.certificate.id}`,
    qr_code_data: data.certificate.qr_code_data,
    issued_at: data.certificate.issued_at,
    expires_at: data.certificate.expires_at,
    status: data.certificate.status
  } : null;

  return {
    data: {
      ...data,
      scoreSummary,
      questionFeedbacks,
      certificateInfo
    },
    isLoading,
    error
  };
}
