import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

const mockQuiz = {
  id: 1,
  title: 'CNC Machine Safety Quiz',
  description: 'Test your knowledge of CNC machine safety procedures',
  timeLimit: 10, // minutes
  questions: [
    {
      id: 1,
      question: 'What is the first step before starting any CNC operation?',
      options: [
        'Check tool sharpness',
        'Verify workpiece dimensions',
        'Perform safety lockout procedure',
        'Set cutting speed'
      ],
      correctAnswer: 2,
      explanation: 'Safety lockout procedure must always be performed first to ensure the machine is properly secured.'
    },
    {
      id: 2,
      question: 'What personal protective equipment is required when operating a CNC machine?',
      options: [
        'Safety glasses only',
        'Safety glasses and hearing protection',
        'Safety glasses, hearing protection, and steel-toed shoes',
        'No special equipment required'
      ],
      correctAnswer: 2,
      explanation: 'All three items are required for safe CNC machine operation.'
    },
    {
      id: 3,
      question: 'What should you do if you notice unusual vibrations during operation?',
      options: [
        'Continue operation and monitor',
        'Increase cutting speed',
        'Stop the machine immediately and investigate',
        'Adjust the workpiece position'
      ],
      correctAnswer: 2,
      explanation: 'Unusual vibrations can indicate a serious problem and the machine should be stopped immediately.'
    }
  ]
};

export default function QuizPage() {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(mockQuiz.timeLimit * 60); // seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQ = mockQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === mockQuiz.questions[index].correctAnswer
    ).length;
    const calculatedScore = Math.round((correctAnswers / mockQuiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsSubmitted(false);
    setShowResults(false);
    setTimeRemaining(mockQuiz.timeLimit * 60);
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">{mockQuiz.title}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                {score >= 70 ? (
                  <CheckCircle className="h-12 w-12 text-winbro-success" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive" />
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {score >= 70 ? 'Congratulations!' : 'Keep Learning!'}
                </h2>
                <p className="text-muted-foreground">
                  You scored {score}% on this quiz
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-winbro-teal">{score}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-winbro-success">
                      {answers.filter((answer, index) => 
                        answer === mockQuiz.questions[index].correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">
                      {answers.filter((answer, index) => 
                        answer !== mockQuiz.questions[index].correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleRetake} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button className="w-full bg-winbro-teal hover:bg-winbro-teal/90">
                  Continue Learning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review your answers and explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockQuiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCorrect ? 'bg-winbro-success text-white' : 'bg-destructive text-white'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{question.question}</h4>
                        <div className="mt-2 space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-2 rounded text-sm ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-winbro-success/10 border border-winbro-success/20'
                                  : optionIndex === userAnswer && !isCorrect
                                    ? 'bg-destructive/10 border border-destructive/20'
                                    : 'bg-muted/50'
                              }`}
                            >
                              {option}
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-2 text-winbro-success font-medium">(Correct)</span>
                              )}
                              {optionIndex === userAnswer && !isCorrect && (
                                <span className="ml-2 text-destructive font-medium">(Your Answer)</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mockQuiz.title}</h1>
          <p className="text-muted-foreground mt-1">{mockQuiz.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {mockQuiz.questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentQuestion === mockQuiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-winbro-teal hover:bg-winbro-teal/90"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}