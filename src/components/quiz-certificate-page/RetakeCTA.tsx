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
    <Card className={cn("shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-shadow duration-300", className)}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground font-heading">
              Want to improve your score?
            </h3>
            <p className="text-muted-foreground text-lg">
              You have <span className="font-semibold text-winbro-amber">{remainingAttempts}</span> attempt{remainingAttempts !== 1 ? 's' : ''} remaining
            </p>
          </div>

          {/* Attempts Remaining Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="bg-winbro-amber/10 text-winbro-amber border-winbro-amber/20 px-4 py-2 text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {remainingAttempts} Attempt{remainingAttempts !== 1 ? 's' : ''} Left
            </Badge>
          </div>

          {/* Retake Button */}
          <Button 
            onClick={onRetake} 
            className="bg-winbro-teal hover:bg-winbro-teal/90 hover:scale-105 transition-all duration-200 px-8 py-3 text-lg font-semibold w-full sm:w-auto"
            size="lg"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake Quiz
          </Button>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground space-y-1 max-w-md mx-auto">
            <p>• Your previous attempts will be saved</p>
            <p>• You can retake as many times as allowed</p>
            <p>• Only your best score will be recorded</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
