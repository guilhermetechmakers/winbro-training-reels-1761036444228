import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  Bookmark, 
  Share2, 
  Download, 
  Flag,
  Clock,
  User,
  Tag,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const mockClip = {
  id: 1,
  title: 'CNC Machine Calibration Process',
  description: 'Step-by-step guide for calibrating CNC machines including safety checks and precision measurements. This comprehensive tutorial covers all aspects of machine calibration from initial setup to final verification.',
  duration: 28,
  thumbnail: '/api/placeholder/800/450',
  videoUrl: '/api/video/sample.mp4',
  views: 1234,
  rating: 4.8,
  tags: ['CNC', 'Calibration', 'Maintenance', 'Safety', 'Precision'],
  author: {
    id: 1,
    name: 'John Smith',
    avatar: '/api/placeholder/40/40',
    role: 'Senior Technician'
  },
  machineModel: 'HAAS VF-2',
  process: 'Setup',
  skillLevel: 'Intermediate',
  createdAt: '2024-01-15',
  status: 'published',
  transcript: [
    { time: 0, text: 'Welcome to the CNC machine calibration process.' },
    { time: 3, text: 'First, ensure all safety protocols are in place.' },
    { time: 6, text: 'Check that the machine is properly powered down.' },
    { time: 9, text: 'Remove any tools or workpieces from the spindle.' },
    { time: 12, text: 'Open the control panel and access the calibration menu.' },
    { time: 15, text: 'Select the axis you want to calibrate first.' },
    { time: 18, text: 'Follow the on-screen prompts carefully.' },
    { time: 21, text: 'Verify the calibration readings are within tolerance.' },
    { time: 24, text: 'Repeat the process for all remaining axes.' },
    { time: 27, text: 'Document all calibration values for future reference.' }
  ],
  relatedClips: [
    {
      id: 2,
      title: 'CNC Tool Change Procedure',
      duration: '0:22',
      thumbnail: '/api/placeholder/200/120',
      views: 456,
      rating: 4.6
    },
    {
      id: 3,
      title: 'CNC Safety Checklist',
      duration: '0:18',
      thumbnail: '/api/placeholder/200/120',
      views: 789,
      rating: 4.9
    },
    {
      id: 4,
      title: 'CNC Maintenance Schedule',
      duration: '0:35',
      thumbnail: '/api/placeholder/200/120',
      views: 234,
      rating: 4.7
    }
  ]
};

const comments = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: '/api/placeholder/32/32',
    content: 'Great explanation! This saved me hours of troubleshooting.',
    timestamp: '2 hours ago',
    likes: 5
  },
  {
    id: 2,
    author: 'Mike Chen',
    avatar: '/api/placeholder/32/32',
    content: 'Could you add more detail about the tolerance values?',
    timestamp: '4 hours ago',
    likes: 2
  },
  {
    id: 3,
    author: 'Lisa Rodriguez',
    avatar: '/api/placeholder/32/32',
    content: 'Perfect timing! I was just about to calibrate our VF-2.',
    timestamp: '1 day ago',
    likes: 8
  }
];

export default function ClipViewer() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTranscriptTime, setActiveTranscriptTime] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
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
    const video = videoRef.current;
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (video) {
      if (isMuted) {
        video.volume = volume;
        setIsMuted(false);
      } else {
        video.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!isFullscreen) {
        video.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscriptClick = (time: number) => {
    handleSeek(time);
    setActiveTranscriptTime(time);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would submit the comment
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard/library">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{mockClip.title}</h1>
          <p className="text-muted-foreground">By {mockClip.author.name} • {mockClip.views} views</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                poster={mockClip.thumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={mockClip.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-winbro-teal h-1 rounded-full transition-all duration-200"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    
                    {/* Controls */}
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
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMuteToggle}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={playbackRate}
                          onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                          className="bg-black/50 text-white text-sm rounded px-2 py-1"
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleFullscreen}
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
          </Card>

          {/* Video Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{mockClip.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(mockClip.duration)}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {mockClip.author.name}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {mockClip.rating}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{mockClip.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {mockClip.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Machine Model:</span>
                  <p className="text-muted-foreground">{mockClip.machineModel}</p>
                </div>
                <div>
                  <span className="font-medium">Process:</span>
                  <p className="text-muted-foreground">{mockClip.process}</p>
                </div>
                <div>
                  <span className="font-medium">Skill Level:</span>
                  <p className="text-muted-foreground">{mockClip.skillLevel}</p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">{mockClip.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Transcript */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transcript</CardTitle>
              <CardDescription>
                Click on any line to jump to that time in the video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockClip.transcript.map((segment, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      Math.abs(segment.time - currentTime) < 1
                        ? 'bg-winbro-teal/10 border-l-2 border-winbro-teal'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleTranscriptClick(segment.time)}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-xs text-muted-foreground font-mono min-w-0 flex-shrink-0">
                        {formatTime(segment.time)}
                      </span>
                      <span className="text-sm">{segment.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add Comment */}
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">
                      Post Comment
                    </Button>
                  </div>
                </form>
                
                <Separator />
                
                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Clips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Clips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockClip.relatedClips.map((clip) => (
                  <div key={clip.id} className="flex space-x-3 cursor-pointer group">
                    <div className="relative w-20 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <Play className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1">
                        {clip.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground group-hover:text-winbro-teal transition-colors line-clamp-2">
                        {clip.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <span>{clip.views} views</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {clip.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}