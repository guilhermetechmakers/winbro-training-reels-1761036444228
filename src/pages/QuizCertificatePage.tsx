import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  RotateCcw,
  Download,
  Share2,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { 
  QuizCertificatePageData, 
  ScoreSummary, 
  QuestionFeedback, 
  CertificateInfo 
} from '@/types/quiz-certificate';

// Mock data for development
const mockQuizCertificateData: QuizCertificatePageData = {
  quiz_attempt: {
    id: '1',
    user_id: 'user-1',
    quiz_id: 'quiz-1',
    course_id: 'course-1',
    attempt_number: 1,
    answers: [],
    score: 85,
    max_score: 100,
    passed: true,
    passing_threshold: 70,
    started_at: '2024-12-13T10:00:00Z',
    completed_at: '2024-12-13T10:15:00Z',
    time_spent_seconds: 900,
    status: 'completed',
    created_at: '2024-12-13T10:00:00Z',
    updated_at: '2024-12-13T10:15:00Z'
  },
  certificate: {
    id: 'cert-1',
    user_id: 'user-1',
    quiz_attempt_id: '1',
    course_id: 'course-1',
    certificate_number: 'CERT-2024-000001',
    title: 'CNC Machine Safety Certification',
    description: 'Successfully completed CNC Machine Safety training and assessment',
    verification_token: 'abc123def456',
    verification_url: 'https://winbro.com/verify/cert-1',
    qr_code_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    status: 'issued',
    issued_at: '2024-12-13T10:15:00Z',
    expires_at: '2025-12-13T10:15:00Z',
    metadata: {},
    created_at: '2024-12-13T10:15:00Z',
    updated_at: '2024-12-13T10:15:00Z'
  },
  feedback: [
    {
      id: 'feedback-1',
      quiz_attempt_id: '1',
      question_id: 'q1',
      question_text: 'What is the first step before starting any CNC operation?',
      question_type: 'multiple_choice',
      user_answer: {
        question_id: 'q1',
        answer_type: 'multiple_choice',
        value: 2,
        selected_options: [2]
      },
      correct_answer: {
        question_id: 'q1',
        answer_type: 'multiple_choice',
        value: 2,
        selected_options: [2]
      },
      is_correct: true,
      explanation: 'Safety lockout procedure must always be performed first to ensure the machine is properly secured.',
      remediation_clip_id: 'clip-1',
      points_awarded: 1,
      max_points: 1,
      created_at: '2024-12-13T10:15:00Z',
      updated_at: '2024-12-13T10:15:00Z'
      },
    {
      id: 'feedback-2',
      quiz_attempt_id: '1',
      question_id: 'q2',
      question_text: 'What personal protective equipment is required when operating a CNC machine?',
      question_type: 'multiple_choice',
      user_answer: {
        question_id: 'q2',
        answer_type: 'multiple_choice',
        value: 1,
        selected_options: [1]
      },
      correct_answer: {
        question_id: 'q2',
        answer_type: 'multiple_choice',
        value: 2,
        selected_options: [2]
      },
      is_correct: false,
      explanation: 'All three items (safety glasses, hearing protection, and steel-toed shoes) are required for safe CNC machine operation.',
      remediation_clip_id: 'clip-2',
      points_awarded: 0,
      max_points: 1,
      created_at: '2024-12-13T10:15:00Z',
      updated_at: '2024-12-13T10:15:00Z'
    }
  ],
  quiz: {
    id: 'quiz-1',
    title: 'CNC Machine Safety Quiz',
    description: 'Test your knowledge of CNC machine safety procedures',
    course_id: 'course-1',
    questions: [
      {
        id: 'q1',
        question_text: 'What is the first step before starting any CNC operation?',
        question_type: 'multiple_choice',
        options: [
          'Check tool sharpness',
          'Verify workpiece dimensions',
          'Perform safety lockout procedure',
          'Set cutting speed'
        ],
        correct_answer: {
          question_id: 'q1',
          answer_type: 'multiple_choice',
          value: 2,
          selected_options: [2]
        },
        explanation: 'Safety lockout procedure must always be performed first to ensure the machine is properly secured.',
        points: 1,
        remediation_clip_id: 'clip-1'
      },
      {
        id: 'q2',
        question_text: 'What personal protective equipment is required when operating a CNC machine?',
        question_type: 'multiple_choice',
        options: [
          'Safety glasses only',
          'Safety glasses and hearing protection',
          'Safety glasses, hearing protection, and steel-toed shoes',
          'No special equipment required'
        ],
        correct_answer: {
          question_id: 'q2',
          answer_type: 'multiple_choice',
          value: 2,
          selected_options: [2]
        },
        explanation: 'All three items are required for safe CNC machine operation.',
        points: 1,
        remediation_clip_id: 'clip-2'
      }
    ],
    passing_threshold: 70,
    max_attempts: 3,
    time_limit_minutes: 15,
    status: 'published',
    created_at: '2024-12-13T09:00:00Z',
    updated_at: '2024-12-13T09:00:00Z'
  },
  can_retake: true,
  max_attempts: 3,
  remaining_attempts: 2
};

export default function QuizCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRetaking, setIsRetaking] = useState(false);

  // Mock query - replace with actual API call
  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz-certificate', id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockQuizCertificateData;
    },
    enabled: !!id
  });

  const handleRetake = () => {
    setIsRetaking(true);
    // Navigate to quiz page for retake
    navigate(`/dashboard/quiz/${data?.quiz_attempt.quiz_id}`);
  };

  const handleDownloadCertificate = () => {
    // Implement certificate download
    console.log('Downloading certificate...');
  };

  const handleShareCertificate = () => {
    // Implement certificate sharing
    console.log('Sharing certificate...');
  };

  const handleVerifyCertificate = () => {
    // Open verification URL in new tab
    if (data?.certificate?.verification_url) {
      window.open(data.certificate.verification_url, '_blank');
    }
  };

  const handleBackToCourse = () => {
    if (data?.quiz_attempt.course_id) {
      navigate(`/dashboard/course/${data.quiz_attempt.course_id}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Results</h2>
        <p className="text-muted-foreground mb-4">
          {error ? 'Failed to load quiz results' : 'Quiz results not found'}
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { quiz_attempt, certificate, feedback, quiz, can_retake, remaining_attempts } = data;

  // Calculate score summary
  const scoreSummary: ScoreSummary = {
    score: quiz_attempt.score,
    max_score: quiz_attempt.max_score,
    percentage: Math.round((quiz_attempt.score / quiz_attempt.max_score) * 100),
    passed: quiz_attempt.passed,
    attempts_used: quiz_attempt.attempt_number,
    max_attempts: quiz.max_attempts || 3,
    remaining_attempts,
    time_spent_seconds: quiz_attempt.time_spent_seconds
  };

  // Prepare question feedbacks
  const questionFeedbacks: QuestionFeedback[] = feedback.map(fb => {
    const question = quiz.questions.find(q => q.id === fb.question_id);
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

  // Prepare certificate info
  const certificateInfo: CertificateInfo | null = certificate ? {
    certificate,
    verification_url: certificate.verification_url,
    download_url: `/api/certificates/${certificate.id}/download`,
    share_url: `/certificates/${certificate.id}`,
    qr_code_data: certificate.qr_code_data,
    issued_at: certificate.issued_at,
    expires_at: certificate.expires_at,
    status: certificate.status
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">{quiz.title}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToCourse}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </div>
      </div>

      {/* Score Summary */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Status Icon */}
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              {scoreSummary.passed ? (
                <CheckCircle className="h-12 w-12 text-winbro-success" />
              ) : (
                <XCircle className="h-12 w-12 text-destructive" />
              )}
            </div>
            
            {/* Result Message */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {scoreSummary.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-muted-foreground">
                You scored {scoreSummary.percentage}% on this quiz
              </p>
            </div>

            {/* Score Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-winbro-teal">{scoreSummary.percentage}%</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-winbro-success">
                  {feedback.filter(f => f.is_correct).length}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {feedback.filter(f => !f.is_correct).length}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect Answers</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {quiz_attempt.time_spent_seconds && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(quiz_attempt.time_spent_seconds / 60)}m {quiz_attempt.time_spent_seconds % 60}s
                </div>
              )}
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Attempt {quiz_attempt.attempt_number} of {quiz.max_attempts || 3}
              </div>
              {remaining_attempts > 0 && (
                <div className="flex items-center">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {remaining_attempts} attempts remaining
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Section */}
      {certificateInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-winbro-amber" />
              Certificate of Completion
            </CardTitle>
            <CardDescription>
              Your achievement has been recorded and verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{certificateInfo.certificate.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificate #{certificateInfo.certificate.certificate_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Issued on {new Date(certificateInfo.certificate.issued_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="bg-winbro-success/10 text-winbro-success border-winbro-success/20">
                  {certificateInfo.certificate.status.toUpperCase()}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownloadCertificate} className="flex-1 min-w-0">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handleShareCertificate} className="flex-1 min-w-0">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleVerifyCertificate} className="flex-1 min-w-0">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Question Review
          </CardTitle>
          <CardDescription>
            Review your answers and explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionFeedbacks.map((qf, index) => (
              <div key={qf.question.id} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                    qf.is_correct ? 'bg-winbro-success text-white' : 'bg-destructive text-white'
                  )}>
                    {qf.is_correct ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{qf.question.question_text}</h4>
                    <div className="mt-2 space-y-1">
                      {qf.question.options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={cn(
                            "p-2 rounded text-sm",
                            optionIndex === qf.correct_answer.value
                              ? 'bg-winbro-success/10 border border-winbro-success/20'
                              : optionIndex === qf.user_answer.value && !qf.is_correct
                                ? 'bg-destructive/10 border border-destructive/20'
                                : 'bg-muted/50'
                          )}
                        >
                          {option}
                          {optionIndex === qf.correct_answer.value && (
                            <span className="ml-2 text-winbro-success font-medium">(Correct)</span>
                          )}
                          {optionIndex === qf.user_answer.value && !qf.is_correct && (
                            <span className="ml-2 text-destructive font-medium">(Your Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {qf.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Explanation:</strong> {qf.explanation}
                      </p>
                    )}
                    {qf.remediation_clip_id && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Review Remediation Clip
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Retake Section */}
      {can_retake && remaining_attempts > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Want to improve your score?</h3>
              <p className="text-muted-foreground">
                You have {remaining_attempts} attempt{remaining_attempts !== 1 ? 's' : ''} remaining
              </p>
              <Button onClick={handleRetake} className="bg-winbro-teal hover:bg-winbro-teal/90">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
