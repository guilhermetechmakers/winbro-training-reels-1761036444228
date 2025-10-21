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
    <Card className={cn("overflow-hidden shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-shadow duration-300", className)}>
      <CardContent className="p-8">
        <div className="text-center space-y-8">
          {/* Status Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-inner animate-bounce-in">
            {passed ? (
              <CheckCircle className="h-12 w-12 text-winbro-success animate-scale-in" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive animate-scale-in" />
            )}
          </div>
          
          {/* Result Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground font-heading">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-muted-foreground text-lg">
              You scored <span className="font-semibold text-winbro-teal">{percentage}%</span> on this quiz
            </p>
          </div>

          {/* Score Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-winbro-teal animate-fade-in-up">
                {percentage}%
              </div>
              <div className="text-sm text-muted-foreground font-medium">Final Score</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-winbro-success animate-fade-in-up">
                {score}
              </div>
              <div className="text-sm text-muted-foreground font-medium">Points Earned</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-muted-foreground animate-fade-in-up">
                {max_score}
              </div>
              <div className="text-sm text-muted-foreground font-medium">Total Points</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {time_spent_seconds && (
              <div className="flex items-center space-x-1 bg-muted/30 px-3 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {Math.floor(time_spent_seconds / 60)}m {time_spent_seconds % 60}s
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1 bg-muted/30 px-3 py-2 rounded-full">
              <Target className="h-4 w-4" />
              <span className="font-medium">
                Attempt {attempts_used} of {max_attempts}
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

          {/* Pass/Fail Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className={cn(
                "text-lg px-6 py-3 font-semibold",
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
