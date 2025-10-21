-- =====================================================
-- Migration: Create Quiz Certificate Tables
-- Created: 2024-12-13T12:00:00Z
-- Tables: quiz_attempts, certificates, quiz_feedback, quizzes, quiz_questions
-- Purpose: Enable quiz functionality with certificates and detailed feedback
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: quizzes
-- Purpose: Store quiz definitions and metadata
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core quiz fields
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID, -- References courses table when implemented
  
  -- Quiz settings
  passing_threshold INTEGER DEFAULT 70 CHECK (passing_threshold >= 0 AND passing_threshold <= 100),
  max_attempts INTEGER DEFAULT 3 CHECK (max_attempts > 0),
  time_limit_minutes INTEGER CHECK (time_limit_minutes > 0),
  
  -- Status and metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT quizzes_title_not_empty CHECK (length(trim(title)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quizzes_user_id_idx ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS quizzes_course_id_idx ON quizzes(course_id) WHERE course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS quizzes_created_at_idx ON quizzes(created_at DESC);
CREATE INDEX IF NOT EXISTS quizzes_status_idx ON quizzes(status) WHERE status != 'archived';

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "quizzes_select_own"
  ON quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quizzes_insert_own"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quizzes_update_own"
  ON quizzes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quizzes_delete_own"
  ON quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: quiz_questions
-- Purpose: Store individual quiz questions and answers
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  
  -- Question details
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false')),
  options JSONB, -- Array of options for multiple choice questions
  correct_answer JSONB NOT NULL, -- Structured answer data
  explanation TEXT,
  points INTEGER DEFAULT 1 CHECK (points > 0),
  remediation_clip_id UUID, -- References clips table when implemented
  
  -- Ordering
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT quiz_questions_text_not_empty CHECK (length(trim(question_text)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS quiz_questions_sort_order_idx ON quiz_questions(quiz_id, sort_order);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_quiz_questions_updated_at ON quiz_questions;
CREATE TRIGGER update_quiz_questions_updated_at
  BEFORE UPDATE ON quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access questions for their own quizzes
CREATE POLICY "quiz_questions_select_own"
  ON quiz_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  ));

CREATE POLICY "quiz_questions_insert_own"
  ON quiz_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  ));

CREATE POLICY "quiz_questions_update_own"
  ON quiz_questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  ));

CREATE POLICY "quiz_questions_delete_own"
  ON quiz_questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  ));

-- =====================================================
-- TABLE: quiz_attempts
-- Purpose: Store user quiz attempts and results
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  course_id UUID, -- References courses table when implemented
  
  -- Attempt details
  attempt_number INTEGER DEFAULT 1 CHECK (attempt_number > 0),
  answers JSONB DEFAULT '[]'::jsonb, -- Array of user answers
  score INTEGER DEFAULT 0 CHECK (score >= 0),
  max_score INTEGER DEFAULT 0 CHECK (max_score >= 0),
  passed BOOLEAN DEFAULT FALSE,
  passing_threshold INTEGER DEFAULT 70 CHECK (passing_threshold >= 0 AND passing_threshold <= 100),
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER CHECK (time_spent_seconds >= 0),
  
  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quiz_attempts_user_id_idx ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_id_idx ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_course_id_idx ON quiz_attempts(course_id) WHERE course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS quiz_attempts_created_at_idx ON quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS quiz_attempts_status_idx ON quiz_attempts(status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts;
CREATE TRIGGER update_quiz_attempts_updated_at
  BEFORE UPDATE ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own attempts
CREATE POLICY "quiz_attempts_select_own"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_insert_own"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_update_own"
  ON quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_delete_own"
  ON quiz_attempts FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABLE: quiz_feedback
-- Purpose: Store detailed feedback for each question in an attempt
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- Question details (denormalized for performance)
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'short_answer', 'true_false')),
  
  -- User and correct answers
  user_answer JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  
  -- Feedback details
  is_correct BOOLEAN NOT NULL,
  explanation TEXT,
  remediation_clip_id UUID, -- References clips table when implemented
  points_awarded INTEGER DEFAULT 0 CHECK (points_awarded >= 0),
  max_points INTEGER DEFAULT 1 CHECK (max_points > 0),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quiz_feedback_attempt_id_idx ON quiz_feedback(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS quiz_feedback_question_id_idx ON quiz_feedback(question_id);
CREATE INDEX IF NOT EXISTS quiz_feedback_created_at_idx ON quiz_feedback(created_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_quiz_feedback_updated_at ON quiz_feedback;
CREATE TRIGGER update_quiz_feedback_updated_at
  BEFORE UPDATE ON quiz_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE quiz_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access feedback for their own attempts
CREATE POLICY "quiz_feedback_select_own"
  ON quiz_feedback FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quiz_attempts 
    WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id 
    AND quiz_attempts.user_id = auth.uid()
  ));

CREATE POLICY "quiz_feedback_insert_own"
  ON quiz_feedback FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM quiz_attempts 
    WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id 
    AND quiz_attempts.user_id = auth.uid()
  ));

CREATE POLICY "quiz_feedback_update_own"
  ON quiz_feedback FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM quiz_attempts 
    WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id 
    AND quiz_attempts.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM quiz_attempts 
    WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id 
    AND quiz_attempts.user_id = auth.uid()
  ));

CREATE POLICY "quiz_feedback_delete_own"
  ON quiz_feedback FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM quiz_attempts 
    WHERE quiz_attempts.id = quiz_feedback.quiz_attempt_id 
    AND quiz_attempts.user_id = auth.uid()
  ));

-- =====================================================
-- TABLE: certificates
-- Purpose: Store issued certificates for completed quizzes
-- =====================================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  course_id UUID, -- References courses table when implemented
  
  -- Certificate details
  certificate_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Verification
  verification_token TEXT NOT NULL UNIQUE,
  verification_url TEXT NOT NULL,
  qr_code_data TEXT, -- Base64 encoded QR code image
  
  -- Status and dates
  status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'revoked', 'expired')),
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT certificates_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT certificates_number_not_empty CHECK (length(trim(certificate_number)) > 0),
  CONSTRAINT certificates_token_not_empty CHECK (length(trim(verification_token)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON certificates(user_id);
CREATE INDEX IF NOT EXISTS certificates_quiz_attempt_id_idx ON certificates(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS certificates_course_id_idx ON certificates(course_id) WHERE course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS certificates_verification_token_idx ON certificates(verification_token);
CREATE INDEX IF NOT EXISTS certificates_certificate_number_idx ON certificates(certificate_number);
CREATE INDEX IF NOT EXISTS certificates_created_at_idx ON certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS certificates_status_idx ON certificates(status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own certificates
CREATE POLICY "certificates_select_own"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "certificates_insert_own"
  ON certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "certificates_update_own"
  ON certificates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "certificates_delete_own"
  ON certificates FOR DELETE
  USING (auth.uid() = user_id);

-- Public verification policy (no auth required)
CREATE POLICY "certificates_verify_public"
  ON certificates FOR SELECT
  USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  cert_number TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Get next sequence number for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(certificate_number FROM 'CERT-' || year_part || '-(\d+)') AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM certificates
  WHERE certificate_number LIKE 'CERT-' || year_part || '-%';
  
  cert_number := 'CERT-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN cert_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate verification token
CREATE OR REPLACE FUNCTION generate_verification_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC CERTIFICATE GENERATION
-- =====================================================

-- Function to create certificate when quiz is passed
CREATE OR REPLACE FUNCTION create_certificate_on_quiz_completion()
RETURNS TRIGGER AS $$
DECLARE
  cert_number TEXT;
  verification_token TEXT;
  verification_url TEXT;
BEGIN
  -- Only create certificate if quiz was just completed and passed
  IF NEW.status = 'completed' AND NEW.passed = TRUE AND OLD.status != 'completed' THEN
    -- Generate certificate details
    cert_number := generate_certificate_number();
    verification_token := generate_verification_token();
    verification_url := 'https://winbro.com/verify/' || verification_token;
    
    -- Insert certificate
    INSERT INTO certificates (
      user_id,
      quiz_attempt_id,
      course_id,
      certificate_number,
      title,
      description,
      verification_token,
      verification_url,
      status,
      issued_at
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.course_id,
      cert_number,
      'Quiz Completion Certificate',
      'Successfully completed quiz with passing score',
      verification_token,
      verification_url,
      'issued',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic certificate generation
DROP TRIGGER IF EXISTS trigger_create_certificate ON quiz_attempts;
CREATE TRIGGER trigger_create_certificate
  AFTER UPDATE ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION create_certificate_on_quiz_completion();

-- =====================================================
-- DOCUMENTATION
-- =====================================================

COMMENT ON TABLE quizzes IS 'Quiz definitions and metadata';
COMMENT ON COLUMN quizzes.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN quizzes.user_id IS 'Owner of this quiz (references auth.users)';
COMMENT ON COLUMN quizzes.passing_threshold IS 'Minimum percentage score required to pass (0-100)';
COMMENT ON COLUMN quizzes.max_attempts IS 'Maximum number of attempts allowed';
COMMENT ON COLUMN quizzes.time_limit_minutes IS 'Time limit in minutes (optional)';

COMMENT ON TABLE quiz_questions IS 'Individual questions within quizzes';
COMMENT ON COLUMN quiz_questions.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN quiz_questions.quiz_id IS 'Parent quiz (references quizzes)';
COMMENT ON COLUMN quiz_questions.options IS 'JSON array of answer options for multiple choice';
COMMENT ON COLUMN quiz_questions.correct_answer IS 'JSON object containing correct answer data';
COMMENT ON COLUMN quiz_questions.remediation_clip_id IS 'Optional clip ID for additional learning';

COMMENT ON TABLE quiz_attempts IS 'User attempts at taking quizzes';
COMMENT ON COLUMN quiz_attempts.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN quiz_attempts.user_id IS 'User who took the quiz (references auth.users)';
COMMENT ON COLUMN quiz_attempts.quiz_id IS 'Quiz being attempted (references quizzes)';
COMMENT ON COLUMN quiz_attempts.answers IS 'JSON array of user answers';
COMMENT ON COLUMN quiz_attempts.score IS 'Points earned by user';
COMMENT ON COLUMN quiz_attempts.max_score IS 'Maximum possible points';
COMMENT ON COLUMN quiz_attempts.passed IS 'Whether user passed the quiz';

COMMENT ON TABLE quiz_feedback IS 'Detailed feedback for each question in an attempt';
COMMENT ON COLUMN quiz_feedback.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN quiz_feedback.quiz_attempt_id IS 'Quiz attempt (references quiz_attempts)';
COMMENT ON COLUMN quiz_feedback.question_id IS 'Question (references quiz_questions)';
COMMENT ON COLUMN quiz_feedback.user_answer IS 'JSON object containing user answer';
COMMENT ON COLUMN quiz_feedback.correct_answer IS 'JSON object containing correct answer';
COMMENT ON COLUMN quiz_feedback.is_correct IS 'Whether user answer was correct';

COMMENT ON TABLE certificates IS 'Certificates issued for completed quizzes';
COMMENT ON COLUMN certificates.id IS 'Primary key (UUID v4)';
COMMENT ON COLUMN certificates.user_id IS 'User who earned certificate (references auth.users)';
COMMENT ON COLUMN certificates.quiz_attempt_id IS 'Quiz attempt that earned certificate (references quiz_attempts)';
COMMENT ON COLUMN certificates.certificate_number IS 'Unique certificate number (e.g., CERT-2024-000001)';
COMMENT ON COLUMN certificates.verification_token IS 'Unique token for verification';
COMMENT ON COLUMN certificates.verification_url IS 'Public URL for certificate verification';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TRIGGER IF EXISTS trigger_create_certificate ON quiz_attempts;
-- DROP FUNCTION IF EXISTS create_certificate_on_quiz_completion();
-- DROP FUNCTION IF EXISTS generate_certificate_number();
-- DROP FUNCTION IF EXISTS generate_verification_token();
-- DROP TABLE IF EXISTS certificates CASCADE;
-- DROP TABLE IF EXISTS quiz_feedback CASCADE;
-- DROP TABLE IF EXISTS quiz_attempts CASCADE;
-- DROP TABLE IF EXISTS quiz_questions CASCADE;
-- DROP TABLE IF EXISTS quizzes CASCADE;
