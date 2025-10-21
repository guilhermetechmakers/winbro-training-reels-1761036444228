import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Lock,
  Award,
  Clock,
  BookOpen
} from 'lucide-react';

const mockCourse = {
  id: 1,
  title: 'CNC Machine Operations',
  description: 'Complete training course covering CNC machine setup, operation, and maintenance.',
  totalModules: 4,
  completedModules: 1,
  totalClips: 8,
  completedClips: 3,
  currentModule: 2,
  currentClip: 1,
  modules: [
    {
      id: 1,
      title: 'Introduction',
      completed: true,
      clips: [
        { id: 1, title: 'Welcome to CNC Training', duration: '0:28', completed: true, type: 'clip' },
        { id: 2, title: 'Safety Overview', duration: '0:22', completed: true, type: 'clip' }
      ]
    },
    {
      id: 2,
      title: 'Basic Operations',
      completed: false,
      clips: [
        { id: 3, title: 'Machine Setup', duration: '0:31', completed: false, type: 'clip', current: true },
        { id: 4, title: 'Tool Selection Quiz', duration: '0:00', completed: false, type: 'quiz' }
      ]
    },
    {
      id: 3,
      title: 'Advanced Techniques',
      completed: false,
      clips: [
        { id: 5, title: 'Precision Machining', duration: '0:35', completed: false, type: 'clip' },
        { id: 6, title: 'Quality Control', duration: '0:28', completed: false, type: 'clip' }
      ]
    },
    {
      id: 4,
      title: 'Maintenance',
      completed: false,
      clips: [
        { id: 7, title: 'Daily Maintenance', duration: '0:25', completed: false, type: 'clip' },
        { id: 8, title: 'Troubleshooting', duration: '0:30', completed: false, type: 'clip' }
      ]
    }
  ]
};

export default function LearningPlayer() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(28);
  const [showQuiz, setShowQuiz] = useState(false);

  const overallProgress = (mockCourse.completedClips / mockCourse.totalClips) * 100;
  const currentModule = mockCourse.modules.find(m => m.id === mockCourse.currentModule);
  const currentClip = currentModule?.clips.find(c => c.current);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    // Navigate to next clip
    console.log('Next clip');
  };

  const handlePrevious = () => {
    // Navigate to previous clip
    console.log('Previous clip');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{mockCourse.title}</h1>
          <p className="text-muted-foreground mt-1">{mockCourse.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {mockCourse.completedClips} of {mockCourse.totalClips} clips completed
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Course Progress</h3>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-winbro-teal">{mockCourse.completedModules}</div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-winbro-amber">{mockCourse.completedClips}</div>
                <div className="text-sm text-muted-foreground">Clips Watched</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-winbro-success">2.4h</div>
                <div className="text-sm text-muted-foreground">Learning Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-winbro-teal/20 to-winbro-amber/20 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-winbro-teal"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/70 text-white">
                  {currentClip?.title}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {formatTime(duration)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentClip?.title}</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                Module {mockCourse.currentModule}: {currentModule?.title}
              </p>
            </CardContent>
          </Card>

          {/* Quiz Modal */}
          {showQuiz && (
            <Card>
              <CardHeader>
                <CardTitle>Tool Selection Quiz</CardTitle>
                <CardDescription>
                  Test your knowledge of CNC tool selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">What is the primary consideration when selecting a cutting tool?</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="quiz" value="a" />
                        <span>Tool material</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="quiz" value="b" />
                        <span>Workpiece material</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="quiz" value="c" />
                        <span>Cutting speed</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" name="quiz" value="d" />
                        <span>Machine capacity</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Skip</Button>
                    <Button className="bg-winbro-teal hover:bg-winbro-teal/90">Submit Answer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Outline */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Outline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCourse.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{module.title}</h4>
                      {module.completed ? (
                        <CheckCircle className="h-5 w-5 text-winbro-success" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1 ml-4">
                      {module.clips.map((clip, clipIndex) => (
                        <div
                          key={clip.id}
                          className={`flex items-center justify-between p-2 rounded text-sm ${
                            clip.current 
                              ? 'bg-winbro-teal/10 border border-winbro-teal/20' 
                              : clip.completed 
                                ? 'bg-winbro-success/10' 
                                : 'bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {clip.type === 'quiz' ? (
                              <BookOpen className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            <span className={clip.completed ? 'line-through text-muted-foreground' : ''}>
                              {clip.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{clip.duration}</span>
                            {clip.completed && <CheckCircle className="h-3 w-3 text-winbro-success" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completion Certificate */}
          {overallProgress === 100 && (
            <Card className="border-winbro-success">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-winbro-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-winbro-success mb-2">
                  Course Completed!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Congratulations! You've completed the CNC Machine Operations course.
                </p>
                <Button className="bg-winbro-success hover:bg-winbro-success/90">
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}