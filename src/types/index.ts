// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'admin' | 'trainer' | 'learner' | 'customer_admin' | 'reviewer';
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
}

// Auth types
export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface SignInInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  organizationName?: string;
}

// Clip types
export interface Clip {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  videoUrl: string;
  hlsUrl?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  machineModel: string;
  process: string;
  tooling: string[];
  tags: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  authorId: string;
  author: User;
  status: 'draft' | 'review' | 'published' | 'archived';
  customerAssignments: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number;
}

export interface CreateClipInput {
  title: string;
  description: string;
  machineModel: string;
  process: string;
  tooling: string[];
  tags: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  customerAssignments: string[];
  file: File;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
  passingThreshold: number;
  maxAttempts: number;
  certificateTemplate?: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  author: User;
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  nodes: CourseNode[];
}

export interface CourseNode {
  id: string;
  type: 'clip' | 'quiz';
  order: number;
  clipId?: string;
  clip?: Clip;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  remediationClipId?: string;
}

// Learning types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed';
  progress: number; // percentage
  currentModuleId?: string;
  currentNodeId?: string;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quiz: Quiz;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number; // in seconds
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  certificateUrl: string;
  verificationUrl: string;
  qrCode: string;
  issuedAt: string;
  expiresAt?: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
  ssoEnabled: boolean;
  ssoProvider?: 'saml' | 'oauth';
  ssoMetadata?: string;
  scimEnabled: boolean;
  libraryAllocations: LibraryAllocation[];
  subscription: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryAllocation {
  id: string;
  machineModel: string;
  clipCount: number;
  maxClips: number;
  assignedAt: string;
}

export interface Subscription {
  id: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  seats: number;
  usedSeats: number;
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  organizationId: string;
  eventType: 'clip.view' | 'search.query' | 'course.start' | 'course.complete' | 'quiz.attempt' | 'certificate.issued';
  entityType: 'clip' | 'course' | 'quiz' | 'search';
  entityId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

// Search types
export interface SearchFilters {
  machineModel?: string[];
  process?: string[];
  tags?: string[];
  skillLevel?: string[];
  authorId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SearchResult {
  clips: Clip[];
  total: number;
  page: number;
  limit: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  machineModels: { value: string; count: number }[];
  processes: { value: string; count: number }[];
  tags: { value: string; count: number }[];
  skillLevels: { value: string; count: number }[];
  authors: { value: string; count: number }[];
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, any>;
}