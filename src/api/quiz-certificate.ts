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
  const response = await fetch(`${API_BASE_URL}/quiz-certificate/${quizAttemptId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz certificate page: ${response.statusText}`);
  }

  const data: QuizCertificatePageResponse = await response.json();
  return data.data;
}

// =====================================================
// QUIZ ATTEMPTS API
// =====================================================

export async function getQuizAttempt(quizAttemptId: string): Promise<QuizAttempt> {
  const response = await fetch(`${API_BASE_URL}/quiz-attempts/${quizAttemptId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz attempt: ${response.statusText}`);
  }

  return response.json();
}

export async function getQuizAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
  const response = await fetch(`${API_BASE_URL}/quiz-attempts?quiz_id=${quizId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz attempts: ${response.statusText}`);
  }

  return response.json();
}

export async function createQuizAttempt(quizId: string, courseId?: string): Promise<QuizAttempt> {
  const response = await fetch(`${API_BASE_URL}/quiz-attempts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      quiz_id: quizId,
      course_id: courseId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create quiz attempt: ${response.statusText}`);
  }

  return response.json();
}

export async function updateQuizAttempt(
  quizAttemptId: string, 
  updates: Partial<QuizAttempt>
): Promise<QuizAttempt> {
  const response = await fetch(`${API_BASE_URL}/quiz-attempts/${quizAttemptId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update quiz attempt: ${response.statusText}`);
  }

  return response.json();
}

export async function submitQuizAttempt(
  quizAttemptId: string, 
  answers: any[]
): Promise<QuizAttempt> {
  const response = await fetch(`${API_BASE_URL}/quiz-attempts/${quizAttemptId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit quiz attempt: ${response.statusText}`);
  }

  return response.json();
}

// =====================================================
// CERTIFICATES API
// =====================================================

export async function getCertificate(certificateId: string): Promise<Certificate> {
  const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch certificate: ${response.statusText}`);
  }

  return response.json();
}

export async function getCertificatesByUser(): Promise<Certificate[]> {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch certificates: ${response.statusText}`);
  }

  return response.json();
}

export async function downloadCertificate(certificateId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/download`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to download certificate: ${response.statusText}`);
  }

  return response.blob();
}

export async function shareCertificate(certificateId: string): Promise<{ shareUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to share certificate: ${response.statusText}`);
  }

  return response.json();
}

// =====================================================
// CERTIFICATE VERIFICATION API
// =====================================================

export async function verifyCertificate(verificationToken: string): Promise<CertificateVerificationResponse> {
  const response = await fetch(`${API_BASE_URL}/certificates/verify/${verificationToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return {
      valid: false,
      error: error.message || 'Certificate verification failed'
    };
  }

  return response.json();
}

// =====================================================
// QUIZ FEEDBACK API
// =====================================================

export async function getQuizFeedback(quizAttemptId: string): Promise<QuizFeedback[]> {
  const response = await fetch(`${API_BASE_URL}/quiz-feedback?quiz_attempt_id=${quizAttemptId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz feedback: ${response.statusText}`);
  }

  return response.json();
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
