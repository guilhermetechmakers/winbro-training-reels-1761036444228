import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          course_id: string | null;
          passing_threshold: number;
          max_attempts: number;
          time_limit_minutes: number | null;
          status: 'draft' | 'published' | 'archived';
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          course_id?: string | null;
          passing_threshold?: number;
          max_attempts?: number;
          time_limit_minutes?: number | null;
          status?: 'draft' | 'published' | 'archived';
          metadata?: Record<string, any>;
        };
        Update: {
          title?: string;
          description?: string | null;
          course_id?: string | null;
          passing_threshold?: number;
          max_attempts?: number;
          time_limit_minutes?: number | null;
          status?: 'draft' | 'published' | 'archived';
          metadata?: Record<string, any>;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          question_type: 'multiple_choice' | 'short_answer' | 'true_false';
          options: string[] | null;
          correct_answer: Record<string, any>;
          explanation: string | null;
          points: number;
          remediation_clip_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question_text: string;
          question_type?: 'multiple_choice' | 'short_answer' | 'true_false';
          options?: string[] | null;
          correct_answer: Record<string, any>;
          explanation?: string | null;
          points?: number;
          remediation_clip_id?: string | null;
          sort_order?: number;
        };
        Update: {
          question_text?: string;
          question_type?: 'multiple_choice' | 'short_answer' | 'true_false';
          options?: string[] | null;
          correct_answer?: Record<string, any>;
          explanation?: string | null;
          points?: number;
          remediation_clip_id?: string | null;
          sort_order?: number;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          course_id: string | null;
          attempt_number: number;
          answers: Record<string, any>[];
          score: number;
          max_score: number;
          passed: boolean;
          passing_threshold: number;
          started_at: string;
          completed_at: string | null;
          time_spent_seconds: number | null;
          status: 'in_progress' | 'completed' | 'abandoned';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          course_id?: string | null;
          attempt_number?: number;
          answers?: Record<string, any>[];
          score?: number;
          max_score?: number;
          passed?: boolean;
          passing_threshold?: number;
          started_at?: string;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          status?: 'in_progress' | 'completed' | 'abandoned';
        };
        Update: {
          answers?: Record<string, any>[];
          score?: number;
          max_score?: number;
          passed?: boolean;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          status?: 'in_progress' | 'completed' | 'abandoned';
        };
      };
      quiz_feedback: {
        Row: {
          id: string;
          quiz_attempt_id: string;
          question_id: string;
          question_text: string;
          question_type: 'multiple_choice' | 'short_answer' | 'true_false';
          user_answer: Record<string, any>;
          correct_answer: Record<string, any>;
          is_correct: boolean;
          explanation: string | null;
          remediation_clip_id: string | null;
          points_awarded: number;
          max_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quiz_attempt_id: string;
          question_id: string;
          question_text: string;
          question_type: 'multiple_choice' | 'short_answer' | 'true_false';
          user_answer: Record<string, any>;
          correct_answer: Record<string, any>;
          is_correct: boolean;
          explanation?: string | null;
          remediation_clip_id?: string | null;
          points_awarded?: number;
          max_points?: number;
        };
        Update: {
          explanation?: string | null;
          remediation_clip_id?: string | null;
          points_awarded?: number;
          max_points?: number;
        };
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          quiz_attempt_id: string;
          course_id: string | null;
          certificate_number: string;
          title: string;
          description: string | null;
          verification_token: string;
          verification_url: string;
          qr_code_data: string | null;
          status: 'issued' | 'revoked' | 'expired';
          issued_at: string;
          expires_at: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_attempt_id: string;
          course_id?: string | null;
          certificate_number: string;
          title: string;
          description?: string | null;
          verification_token: string;
          verification_url: string;
          qr_code_data?: string | null;
          status?: 'issued' | 'revoked' | 'expired';
          issued_at?: string;
          expires_at?: string | null;
          metadata?: Record<string, any>;
        };
        Update: {
          status?: 'issued' | 'revoked' | 'expired';
          expires_at?: string | null;
          metadata?: Record<string, any>;
        };
      };
    };
  };
};

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Specific table types
export type Quiz = Tables<'quizzes'>;
export type QuizInsert = TablesInsert<'quizzes'>;
export type QuizUpdate = TablesUpdate<'quizzes'>;

export type QuizQuestion = Tables<'quiz_questions'>;
export type QuizQuestionInsert = TablesInsert<'quiz_questions'>;
export type QuizQuestionUpdate = TablesUpdate<'quiz_questions'>;

export type QuizAttempt = Tables<'quiz_attempts'>;
export type QuizAttemptInsert = TablesInsert<'quiz_attempts'>;
export type QuizAttemptUpdate = TablesUpdate<'quiz_attempts'>;

export type QuizFeedback = Tables<'quiz_feedback'>;
export type QuizFeedbackInsert = TablesInsert<'quiz_feedback'>;
export type QuizFeedbackUpdate = TablesUpdate<'quiz_feedback'>;

export type Certificate = Tables<'certificates'>;
export type CertificateInsert = TablesInsert<'certificates'>;
export type CertificateUpdate = TablesUpdate<'certificates'>;
