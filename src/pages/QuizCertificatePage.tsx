import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useQuizCertificateData, useDownloadCertificate, useShareCertificate } from '@/hooks/useQuizCertificate';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import ScoreSummaryComponent from '@/components/quiz-certificate-page/ScoreSummary';
import FeedbackPerQuestion from '@/components/quiz-certificate-page/FeedbackPerQuestion';
import CertificateCard from '@/components/quiz-certificate-page/CertificateCard';
import RetakeCTA from '@/components/quiz-certificate-page/RetakeCTA';
import type { 
  ScoreSummary, 
  QuestionFeedback, 
  CertificateInfo 
} from '@/types/quiz-certificate';

export default function QuizCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isRetaking, setIsRetaking] = useState(false);

  // Use the enhanced hook with Supabase integration
  const { data, isLoading, error } = useQuizCertificateData(id || '');
  const downloadCertificate = useDownloadCertificate();
  const shareCertificate = useShareCertificate();

  const handleRetake = () => {
    setIsRetaking(true);
    // Navigate to quiz page for retake
    navigate(`/dashboard/quiz/${data?.quiz_attempt.quiz_id}`);
  };

  const handleDownloadCertificate = async () => {
    if (!data?.certificate) return;
    
    try {
      await downloadCertificate.mutateAsync(data.certificate.id);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.error('Failed to download certificate');
      console.error('Download error:', error);
    }
  };

  const handleShareCertificate = async () => {
    if (!data?.certificate) return;
    
    try {
      await shareCertificate.mutateAsync(data.certificate.id);
      toast.success('Certificate link copied to clipboard');
    } catch (error) {
      toast.error('Failed to share certificate');
      console.error('Share error:', error);
    }
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
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="h-8 bg-muted rounded w-1/3 shimmer"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div 
          className="h-32 bg-muted rounded shimmer"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="h-64 bg-muted rounded shimmer"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
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

  const { quiz_attempt, certificate, feedback, quiz, can_retake, remaining_attempts, scoreSummary, questionFeedbacks, certificateInfo } = data;

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
        <ScoreSummaryComponent scoreSummary={scoreSummary} />

        {/* Certificate Section */}
        {certificateInfo && (
          <CertificateCard 
            certificateInfo={certificateInfo}
            onDownload={handleDownloadCertificate}
            onShare={handleShareCertificate}
            onVerify={handleVerifyCertificate}
          />
        )}

        {/* Question Review */}
        <FeedbackPerQuestion questionFeedbacks={questionFeedbacks} />

        {/* Retake Section */}
        <RetakeCTA 
          canRetake={can_retake}
          remainingAttempts={remaining_attempts}
          onRetake={handleRetake}
        />
      </div>
    </div>
  );
}
