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
import { useQuizCertificateData } from '@/hooks/useQuizCertificate';
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

  // Use the enhanced hook with Supabase integration
  const { data, isLoading, error } = useQuizCertificateData(id || '');

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
        <div className="h-8 bg-muted rounded w-1/3 shimmer"></div>
        <div className="h-32 bg-muted rounded shimmer"></div>
        <div className="h-64 bg-muted rounded shimmer"></div>
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-heading">
              Quiz Results
            </h1>
            <p className="text-muted-foreground text-lg">{quiz.title}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleBackToCourse}
              className="hover:bg-muted/50 transition-all duration-200 hover-scale"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </div>
        </div>

        {/* Score Summary */}
        <Card className="overflow-hidden shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-all duration-300 hover-lift">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              {/* Status Icon */}
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-inner animate-bounce-in">
                {scoreSummary.passed ? (
                  <CheckCircle className="h-12 w-12 text-winbro-success animate-scale-in" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive animate-scale-in" />
                )}
              </div>
              
              {/* Result Message */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground font-heading">
                  {scoreSummary.passed ? 'Congratulations!' : 'Keep Learning!'}
                </h2>
                <p className="text-muted-foreground text-lg">
                  You scored <span className="font-semibold text-winbro-teal">{scoreSummary.percentage}%</span> on this quiz
                </p>
              </div>

              {/* Score Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-winbro-teal animate-fade-in-up">
                    {scoreSummary.percentage}%
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Final Score</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-winbro-success animate-fade-in-up">
                    {feedback.filter(f => f.is_correct).length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Correct Answers</div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-destructive animate-fade-in-up">
                    {feedback.filter(f => !f.is_correct).length}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Incorrect Answers</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                {quiz_attempt.time_spent_seconds && (
                  <div className="flex items-center space-x-1 bg-muted/30 px-3 py-2 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {Math.floor(quiz_attempt.time_spent_seconds / 60)}m {quiz_attempt.time_spent_seconds % 60}s
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1 bg-muted/30 px-3 py-2 rounded-full">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">
                    Attempt {quiz_attempt.attempt_number} of {quiz.max_attempts || 3}
                  </span>
                </div>
                {remaining_attempts > 0 && (
                  <div className="flex items-center space-x-1 bg-winbro-amber/10 text-winbro-amber px-3 py-2 rounded-full">
                    <RotateCcw className="h-4 w-4" />
                    <span className="font-medium">
                      {remaining_attempts} attempts remaining
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Section */}
        {certificateInfo && (
          <Card className="shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-all duration-300 hover-lift animate-fade-in-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl font-heading">
                <Award className="h-6 w-6 mr-3 text-winbro-amber" />
                Certificate of Completion
              </CardTitle>
              <CardDescription className="text-base">
                Your achievement has been recorded and verified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">
                      {certificateInfo.certificate.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Certificate #{certificateInfo.certificate.certificate_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Issued on {new Date(certificateInfo.certificate.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-winbro-success/10 text-winbro-success border-winbro-success/20 px-3 py-1 text-sm font-medium"
                  >
                    {certificateInfo.certificate.status.toUpperCase()}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button 
                    onClick={handleDownloadCertificate} 
                    className="w-full hover:scale-105 transition-all duration-200 hover-glow"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleShareCertificate} 
                    className="w-full hover:scale-105 transition-all duration-200 hover-scale"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleVerifyCertificate} 
                    className="w-full hover:scale-105 transition-all duration-200 hover-scale"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Review */}
        <Card className="shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-all duration-300 hover-lift animate-fade-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl font-heading">
              <BookOpen className="h-6 w-6 mr-3" />
              Question Review
            </CardTitle>
            <CardDescription className="text-base">
              Review your answers and explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {questionFeedbacks.map((qf, index) => (
                <div key={qf.question.id} className="space-y-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm",
                      qf.is_correct ? 'bg-winbro-success text-white' : 'bg-destructive text-white'
                    )}>
                      {qf.is_correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-4">
                      <h4 className="font-semibold text-foreground text-lg leading-relaxed">
                        {qf.question.question_text}
                      </h4>
                      
                      {/* Points Badge */}
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {qf.points_awarded}/{qf.max_points} points
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {qf.question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={cn(
                              "p-4 rounded-lg text-sm transition-all duration-200 hover:shadow-sm",
                              optionIndex === qf.correct_answer.value
                                ? 'bg-winbro-success/10 border-2 border-winbro-success/30 shadow-sm'
                                : optionIndex === qf.user_answer.value && !qf.is_correct
                                  ? 'bg-destructive/10 border-2 border-destructive/30 shadow-sm'
                                  : 'bg-muted/30 border border-muted/50'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex-1">{option}</span>
                              <div className="flex items-center space-x-2 ml-4">
                                {optionIndex === qf.correct_answer.value && (
                                  <Badge className="bg-winbro-success text-white text-xs">
                                    Correct
                                  </Badge>
                                )}
                                {optionIndex === qf.user_answer.value && !qf.is_correct && (
                                  <Badge className="bg-destructive text-white text-xs">
                                    Your Answer
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {qf.explanation && (
                        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-winbro-teal">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Explanation:</strong> {qf.explanation}
                          </p>
                        </div>
                      )}
                      
                      {qf.remediation_clip_id && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-muted/50 transition-colors duration-200"
                        >
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
          <Card className="shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-all duration-300 hover-lift animate-fade-in-up">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground font-heading">
                    Want to improve your score?
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    You have <span className="font-semibold text-winbro-amber">{remaining_attempts}</span> attempt{remaining_attempts !== 1 ? 's' : ''} remaining
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Badge 
                    variant="outline" 
                    className="bg-winbro-amber/10 text-winbro-amber border-winbro-amber/20 px-4 py-2 text-sm font-medium"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {remaining_attempts} Attempt{remaining_attempts !== 1 ? 's' : ''} Left
                  </Badge>
                </div>
                
                <Button 
                  onClick={handleRetake} 
                  className="bg-winbro-teal hover:bg-winbro-teal/90 hover:scale-105 transition-all duration-200 hover-glow px-8 py-3 text-lg font-semibold"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Retake Quiz
                </Button>
                
                <div className="text-xs text-muted-foreground space-y-1 max-w-md mx-auto">
                  <p>• Your previous attempts will be saved</p>
                  <p>• You can retake as many times as allowed</p>
                  <p>• Only your best score will be recorded</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
