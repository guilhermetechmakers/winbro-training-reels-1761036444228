import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Play, 
  BookOpen, 
  Settings, 
  Eye,
  Save,
  Send
} from 'lucide-react';

export default function CourseBuilder() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Introduction',
      clips: [
        { id: 1, title: 'Welcome to CNC Training', duration: '0:28', type: 'clip' },
        { id: 2, title: 'Safety Overview', duration: '0:22', type: 'clip' }
      ]
    },
    {
      id: 2,
      title: 'Basic Operations',
      clips: [
        { id: 3, title: 'Machine Setup', duration: '0:31', type: 'clip' },
        { id: 4, title: 'Tool Selection Quiz', duration: '0:00', type: 'quiz' }
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create structured training courses with clips and quizzes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Course Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title</label>
              <Input
                placeholder="Enter course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the course"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score</label>
              <Input type="number" placeholder="80" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Attempts</label>
              <Input type="number" placeholder="3" />
            </div>
          </CardContent>
        </Card>

        {/* Course Canvas */}
        <div className="lg:col-span-2 space-y-4">
          {modules.map((module, moduleIndex) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.clips.map((clip, clipIndex) => (
                    <div
                      key={clip.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          {clip.type === 'clip' ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{clip.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {clip.type === 'clip' ? 'Video Clip' : 'Quiz'} • {clip.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {clipIndex + 1}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>
    </div>
  );
}