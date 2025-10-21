import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Target, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScoreSummaryProps } from '@/types/quiz-certificate';

export default function ScoreSummary({ scoreSummary, className }: ScoreSummaryProps) {
  const { 
    score, 
    max_score, 
    percentage, 
    passed, 
    attempts_used, 
    max_attempts, 
    remaining_attempts, 
    time_spent_seconds 
  } = scoreSummary;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Status Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            {passed ? (
              <CheckCircle className="h-12 w-12 text-winbro-success" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          
          {/* Result Message */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-muted-foreground">
              You scored {percentage}% on this quiz
            </p>
          </div>

          {/* Score Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-winbro-teal">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-winbro-success">
                {score}
              </div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {max_score}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {time_spent_seconds && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(time_spent_seconds / 60)}m {time_spent_seconds % 60}s
              </div>
            )}
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Attempt {attempts_used} of {max_attempts}
            </div>
            {remaining_attempts > 0 && (
              <div className="flex items-center">
                <RotateCcw className="h-4 w-4 mr-1" />
                {remaining_attempts} attempts remaining
              </div>
            )}
          </div>

          {/* Pass/Fail Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className={cn(
                "text-lg px-4 py-2",
                passed 
                  ? "bg-winbro-success/10 text-winbro-success border-winbro-success/20" 
                  : "bg-destructive/10 text-destructive border-destructive/20"
              )}
            >
              {passed ? 'PASSED' : 'FAILED'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
