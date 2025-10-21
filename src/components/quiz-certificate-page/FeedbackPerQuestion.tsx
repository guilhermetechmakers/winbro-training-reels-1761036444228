import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, XCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedbackPerQuestionProps } from '@/types/quiz-certificate';

export default function FeedbackPerQuestion({ questionFeedbacks, className }: FeedbackPerQuestionProps) {
  return (
    <Card className={cn("shadow-elevation-100 border border-border hover:shadow-elevation-200 transition-shadow duration-300", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-heading">
          <BookOpen className="h-6 w-6 mr-3" />
          Question Review
        </CardTitle>
        <CardDescription className="text-base">
          Review your answers and explanations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {questionFeedbacks.map((qf, index) => (
            <div key={qf.question.id} className="space-y-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm",
                  qf.is_correct ? 'bg-winbro-success text-white' : 'bg-destructive text-white'
                )}>
                  {qf.is_correct ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <h4 className="font-semibold text-foreground text-lg leading-relaxed">
                    {qf.question.question_text}
                  </h4>
                  
                  {/* Points Badge */}
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {qf.points_awarded}/{qf.max_points} points
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {qf.question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={cn(
                          "p-4 rounded-lg text-sm transition-all duration-200 hover:shadow-sm",
                          optionIndex === qf.correct_answer.value
                            ? 'bg-winbro-success/10 border-2 border-winbro-success/30 shadow-sm'
                            : optionIndex === qf.user_answer.value && !qf.is_correct
                              ? 'bg-destructive/10 border-2 border-destructive/30 shadow-sm'
                              : 'bg-muted/30 border border-muted/50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{option}</span>
                          <div className="flex items-center space-x-2 ml-4">
                            {optionIndex === qf.correct_answer.value && (
                              <Badge className="bg-winbro-success text-white text-xs">
                                Correct
                              </Badge>
                            )}
                            {optionIndex === qf.user_answer.value && !qf.is_correct && (
                              <Badge className="bg-destructive text-white text-xs">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {qf.explanation && (
                    <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-winbro-teal">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Explanation:</strong> {qf.explanation}
                      </p>
                    </div>
                  )}
                  
                  {qf.remediation_clip_id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => {
                        // Navigate to remediation clip
                        console.log('Navigate to clip:', qf.remediation_clip_id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Review Remediation Clip
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
