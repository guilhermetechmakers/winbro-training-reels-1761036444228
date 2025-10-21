import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RetakeCTAProps } from '@/types/quiz-certificate';

export default function RetakeCTA({ 
  canRetake, 
  remainingAttempts, 
  onRetake, 
  className 
}: RetakeCTAProps) {
  if (!canRetake || remainingAttempts <= 0) {
    return null;
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Want to improve your score?
            </h3>
            <p className="text-muted-foreground">
              You have {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
            </p>
          </div>

          {/* Attempts Remaining Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="bg-winbro-amber/10 text-winbro-amber border-winbro-amber/20"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {remainingAttempts} Attempt{remainingAttempts !== 1 ? 's' : ''} Left
            </Badge>
          </div>

          {/* Retake Button */}
          <Button 
            onClick={onRetake} 
            className="bg-winbro-teal hover:bg-winbro-teal/90 w-full sm:w-auto"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Your previous attempts will be saved</p>
            <p>• You can retake as many times as allowed</p>
            <p>• Only your best score will be recorded</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
