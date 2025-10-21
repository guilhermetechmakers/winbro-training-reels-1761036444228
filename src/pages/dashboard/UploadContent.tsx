import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileVideo, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Settings,
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Scissors,
  Image as ImageIcon,
  Tag,
  User,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const machineModels = [
  'HAAS VF-2',
  'Bridgeport Mill',
  'CNC Lathe',
  'Electrical Panel',
  'Inspection Station',
  'Forklift',
  'Other'
];

const processes = [
  'Setup',
  'Safety',
  'Quality Control',
  'Material Handling',
  'Maintenance',
  'Troubleshooting',
  'Other'
];

const skillLevels = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

const commonTags = [
  'Safety',
  'Maintenance',
  'Setup',
  'Calibration',
  'Troubleshooting',
  'Quality Control',
  'Tooling',
  'Precision',
  'Electrical',
  'Mechanical'
];

export default function UploadContent() {
  const [uploadStep, setUploadStep] = useState<'upload' | 'metadata' | 'transcript' | 'preview'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptComplete, setTranscriptComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    machineModel: '',
    process: '',
    skillLevel: '',
    customerAssignments: [] as string[],
    publishStatus: 'draft' as 'draft' | 'review' | 'publish'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploadStep('metadata');
      // Simulate upload progress
      setIsUploading(true);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleStartTranscription = () => {
    setIsTranscribing(true);
    // Simulate transcription process
    setTimeout(() => {
      setIsTranscribing(false);
      setTranscriptComplete(true);
    }, 3000);
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handlePlayPause = () => {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateThumbnails = () => {
    // In a real app, this would generate thumbnails from the video
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      time: (duration / 6) * i,
      url: `/api/placeholder/200/120?t=${i}`
    }));
  };

  const thumbnails = generateThumbnails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upload Content</h1>
        <p className="text-muted-foreground mt-1">
          Upload and configure your training clips
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[
          { key: 'upload', label: 'Upload', icon: Upload },
          { key: 'metadata', label: 'Metadata', icon: Tag },
          { key: 'transcript', label: 'Transcript', icon: FileVideo },
          { key: 'preview', label: 'Preview', icon: Eye }
        ].map((step, index) => {
          const isActive = uploadStep === step.key;
          const isCompleted = ['upload', 'metadata', 'transcript', 'preview'].indexOf(uploadStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isActive ? 'bg-winbro-teal text-white' : 
                isCompleted ? 'bg-winbro-success text-white' : 
                'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-winbro-teal' : 
                isCompleted ? 'text-winbro-success' : 
                'text-muted-foreground'
              }`}>
                {step.label}
              </span>
              {index < 3 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  isCompleted ? 'bg-winbro-success' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Step */}
      {uploadStep === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload your training video. Supported formats: MP4, MOV, AVI, MKV, WebM (max 100MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-winbro-teal bg-winbro-teal/5' 
                  : 'border-muted-foreground/25 hover:border-winbro-teal/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragActive ? 'Drop the video here' : 'Drag & drop your video here'}
              </p>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">
                Choose File
              </Button>
            </div>
            
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metadata Step */}
      {uploadStep === 'metadata' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Information</CardTitle>
              <CardDescription>
                Provide details about your training clip
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter clip title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this clip covers"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machineModel">Machine Model</Label>
                  <Select value={formData.machineModel} onValueChange={(value) => handleInputChange('machineModel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine" />
                    </SelectTrigger>
                    <SelectContent>
                      {machineModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="process">Process</Label>
                  <Select value={formData.process} onValueChange={(value) => handleInputChange('process', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((process) => (
                        <SelectItem key={process} value={process}>{process}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange('skillLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags & Classification</CardTitle>
              <CardDescription>
                Add tags to help users find your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customTag">Add Custom Tag</Label>
                <div className="flex space-x-2">
                  <Input
                    id="customTag"
                    placeholder="Enter custom tag"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  />
                  <Button onClick={handleAddCustomTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Publish Status</Label>
                <Select value={formData.publishStatus} onValueChange={(value) => handleInputChange('publishStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                    <SelectItem value="review">Submit for Review</SelectItem>
                    <SelectItem value="publish">Publish Immediately</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Duration Limit:</strong> Training clips should be 20-30 seconds for optimal learning retention.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transcript Step */}
      {uploadStep === 'transcript' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
              <CardDescription>
                Review your video and generate transcript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={uploadedFile ? URL.createObjectURL(uploadedFile) : ''} type="video/mp4" />
                </video>
                
                {/* Video Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="space-y-2">
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-winbro-teal h-1 rounded-full transition-all duration-200"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <span className="text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                          >
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={handleStartTranscription}
                  disabled={isTranscribing}
                  className="w-full"
                >
                  {isTranscribing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Transcript...
                    </>
                  ) : (
                    <>
                      <FileVideo className="h-4 w-4 mr-2" />
                      Generate Transcript
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Selection</CardTitle>
              <CardDescription>
                Choose a thumbnail for your video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={thumb.id}
                    className={`relative aspect-video bg-muted rounded cursor-pointer border-2 transition-colors ${
                      selectedThumbnail === index ? 'border-winbro-teal' : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedThumbnail(index)}
                  >
                    <img
                      src={thumb.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                      {formatTime(thumb.time)}
                    </div>
                    {selectedThumbnail === index && (
                      <div className="absolute inset-0 bg-winbro-teal/20 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-winbro-teal" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview Step */}
      {uploadStep === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Publish</CardTitle>
            <CardDescription>
              Review your clip before publishing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{formData.title}</h3>
                  <p className="text-muted-foreground mb-4">{formData.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Machine Model:</span>
                      <span>{formData.machineModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Process:</span>
                      <span>{formData.process}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skill Level:</span>
                      <span>{formData.skillLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={thumbnails[selectedThumbnail]?.url}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setUploadStep('transcript')}>
                  Back
                </Button>
                <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
                  {formData.publishStatus === 'draft' ? 'Save as Draft' : 
                   formData.publishStatus === 'review' ? 'Submit for Review' : 
                   'Publish Now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {uploadStep !== 'upload' && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              const steps = ['upload', 'metadata', 'transcript', 'preview'];
              const currentIndex = steps.indexOf(uploadStep);
              if (currentIndex > 0) {
                setUploadStep(steps[currentIndex - 1] as any);
              }
            }}
          >
            Previous
          </Button>
          <Button 
            onClick={() => {
              const steps = ['upload', 'metadata', 'transcript', 'preview'];
              const currentIndex = steps.indexOf(uploadStep);
              if (currentIndex < steps.length - 1) {
                setUploadStep(steps[currentIndex + 1] as any);
              }
            }}
            disabled={uploadStep === 'metadata' && (!formData.title || !formData.machineModel || !formData.process)}
          >
            {uploadStep === 'preview' ? 'Finish' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
