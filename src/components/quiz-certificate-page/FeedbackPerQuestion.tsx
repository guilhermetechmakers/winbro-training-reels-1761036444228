import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, XCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedbackPerQuestionProps } from '@/types/quiz-certificate';

export default function FeedbackPerQuestion({ questionFeedbacks, className }: FeedbackPerQuestionProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Question Review
        </CardTitle>
        <CardDescription>
          Review your answers and explanations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questionFeedbacks.map((qf, index) => (
            <div key={qf.question.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                  qf.is_correct ? 'bg-winbro-success text-white' : 'bg-destructive text-white'
                )}>
                  {qf.is_correct ? '✓' : '✗'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground">{qf.question.question_text}</h4>
                  
                  {/* Points */}
                  <div className="mt-1 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {qf.points_awarded}/{qf.max_points} points
                    </Badge>
                  </div>

                  {/* Answer Options */}
                  <div className="mt-2 space-y-1">
                    {qf.question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={cn(
                          "p-3 rounded text-sm transition-colors",
                          optionIndex === qf.correct_answer.value
                            ? 'bg-winbro-success/10 border border-winbro-success/20'
                            : optionIndex === qf.user_answer.value && !qf.is_correct
                              ? 'bg-destructive/10 border border-destructive/20'
                              : 'bg-muted/50 border border-transparent'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex-1">{option}</span>
                          <div className="flex items-center space-x-2 ml-2">
                            {optionIndex === qf.correct_answer.value && (
                              <Badge variant="outline" className="bg-winbro-success/10 text-winbro-success border-winbro-success/20 text-xs">
                                Correct
                              </Badge>
                            )}
                            {optionIndex === qf.user_answer.value && !qf.is_correct && (
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {qf.explanation && (
                    <div className="mt-3 p-3 bg-muted/30 rounded border-l-4 border-l-winbro-teal">
                      <p className="text-sm text-muted-foreground">
                        <strong>Explanation:</strong> {qf.explanation}
                      </p>
                    </div>
                  )}

                  {/* Remediation Clip */}
                  {qf.remediation_clip_id && (
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          // Navigate to remediation clip
                          console.log('Navigate to clip:', qf.remediation_clip_id);
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Review Remediation Clip
                      </Button>
                    </div>
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
