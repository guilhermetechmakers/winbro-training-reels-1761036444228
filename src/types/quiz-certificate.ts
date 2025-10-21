/**
 * Database types for quiz certificate functionality
 * Generated: 2024-12-13T12:00:00Z
 */

// =====================================================
// QUIZ ATTEMPTS
// =====================================================

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  course_id?: string;
  
  // Attempt details
  attempt_number: number;
  answers: QuizAnswer[];
  score: number;
  max_score: number;
  passed: boolean;
  passing_threshold: number;
  
  // Timing
  started_at: string;
  completed_at?: string;
  time_spent_seconds?: number;
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface QuizAttemptInsert {
  id?: string;
  user_id: string;
  quiz_id: string;
  course_id?: string;
  attempt_number?: number;
  answers?: QuizAnswer[];
  score?: number;
  max_score?: number;
  passed?: boolean;
  passing_threshold?: number;
  started_at?: string;
  completed_at?: string;
  time_spent_seconds?: number;
  status?: 'in_progress' | 'completed' | 'abandoned';
}

export interface QuizAttemptUpdate {
  answers?: QuizAnswer[];
  score?: number;
  passed?: boolean;
  completed_at?: string;
  time_spent_seconds?: number;
  status?: 'in_progress' | 'completed' | 'abandoned';
}

// =====================================================
// CERTIFICATES
// =====================================================

export interface Certificate {
  id: string;
  user_id: string;
  quiz_attempt_id: string;
  course_id?: string;
  
  // Certificate details
  certificate_number: string;
  title: string;
  description?: string;
  
  // Verification
  verification_token: string;
  verification_url: string;
  qr_code_data?: string;
  
  // Status
  status: 'issued' | 'revoked' | 'expired';
  issued_at: string;
  expires_at?: string;
  
  // Metadata
  metadata: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CertificateInsert {
  id?: string;
  user_id: string;
  quiz_attempt_id: string;
  course_id?: string;
  certificate_number: string;
  title: string;
  description?: string;
  verification_token: string;
  verification_url: string;
  qr_code_data?: string;
  status?: 'issued' | 'revoked' | 'expired';
  issued_at?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface CertificateUpdate {
  status?: 'issued' | 'revoked' | 'expired';
  expires_at?: string;
  metadata?: Record<string, any>;
}

// =====================================================
// QUIZ FEEDBACK
// =====================================================

export interface QuizFeedback {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  
  // Question details
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'true_false';
  
  // User response
  user_answer: QuizAnswer;
  correct_answer: QuizAnswer;
  
  // Feedback
  is_correct: boolean;
  explanation?: string;
  remediation_clip_id?: string;
  points_awarded: number;
  max_points: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface QuizFeedbackInsert {
  id?: string;
  quiz_attempt_id: string;
  question_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'true_false';
  user_answer: QuizAnswer;
  correct_answer: QuizAnswer;
  is_correct: boolean;
  explanation?: string;
  remediation_clip_id?: string;
  points_awarded?: number;
  max_points?: number;
}

export interface QuizFeedbackUpdate {
  explanation?: string;
  remediation_clip_id?: string;
  points_awarded?: number;
  max_points?: number;
}

// =====================================================
// QUIZ ANSWER TYPES
// =====================================================

export interface QuizAnswer {
  question_id: string;
  answer_type: 'multiple_choice' | 'short_answer' | 'true_false';
  value: string | number | boolean | string[];
  text?: string; // For short answers
  selected_options?: number[]; // For multiple choice
  is_correct?: boolean; // For true/false
}

// =====================================================
// QUIZ DEFINITION TYPES
// =====================================================

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer' | 'true_false';
  options?: string[]; // For multiple choice
  correct_answer: QuizAnswer;
  explanation?: string;
  points: number;
  remediation_clip_id?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  questions: QuizQuestion[];
  passing_threshold: number;
  max_attempts?: number;
  time_limit_minutes?: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// =====================================================
// QUIZ CERTIFICATE PAGE TYPES
// =====================================================

export interface QuizCertificatePageData {
  quiz_attempt: QuizAttempt;
  certificate?: Certificate;
  feedback: QuizFeedback[];
  quiz: Quiz;
  can_retake: boolean;
  max_attempts: number;
  remaining_attempts: number;
}

export interface ScoreSummary {
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  attempts_used: number;
  max_attempts: number;
  remaining_attempts: number;
  time_spent_seconds?: number;
}

export interface QuestionFeedback {
  question: QuizQuestion;
  feedback: QuizFeedback;
  user_answer: QuizAnswer;
  correct_answer: QuizAnswer;
  is_correct: boolean;
  explanation?: string;
  remediation_clip_id?: string;
  points_awarded: number;
  max_points: number;
}

export interface CertificateInfo {
  certificate: Certificate;
  verification_url: string;
  download_url: string;
  share_url: string;
  qr_code_data?: string;
  issued_at: string;
  expires_at?: string;
  status: 'issued' | 'revoked' | 'expired';
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface QuizCertificatePageResponse {
  data: QuizCertificatePageData;
  success: boolean;
  message?: string;
}

export interface CertificateVerificationResponse {
  valid: boolean;
  certificate?: Certificate;
  error?: string;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface RetakeQuizForm {
  confirm_retake: boolean;
}

// =====================================================
// COMPONENT PROPS TYPES
// =====================================================

export interface ScoreSummaryProps {
  scoreSummary: ScoreSummary;
  className?: string;
}

export interface FeedbackPerQuestionProps {
  questionFeedbacks: QuestionFeedback[];
  className?: string;
}

export interface CertificateCardProps {
  certificateInfo: CertificateInfo;
  onDownload?: () => void;
  onShare?: () => void;
  onVerify?: () => void;
  className?: string;
}

export interface RetakeCTAProps {
  canRetake: boolean;
  remainingAttempts: number;
  onRetake: () => void;
  className?: string;
}

// =====================================================
// SUPABASE QUERY RESULT TYPES
// =====================================================

export type QuizAttemptRow = QuizAttempt;
export type CertificateRow = Certificate;
export type QuizFeedbackRow = QuizFeedback;
