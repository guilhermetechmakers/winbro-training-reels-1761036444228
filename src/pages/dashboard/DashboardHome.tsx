import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Clock, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Video, 
  Search,
  ArrowRight,
  Star,
  Eye,
  Download,
  Plus
} from 'lucide-react';

const quickStats = [
  { name: 'Total Clips', value: '1,234', icon: Video, change: '+12%', color: 'text-winbro-teal' },
  { name: 'Views Today', value: '456', icon: Eye, change: '+8%', color: 'text-winbro-amber' },
  { name: 'Certificates', value: '89', icon: Award, change: '+23%', color: 'text-winbro-success' },
  { name: 'Learning Time', value: '2.4h', icon: Clock, change: '+15%', color: 'text-winbro-info' },
];

const recentActivity = [
  {
    id: 1,
    type: 'clip_viewed',
    title: 'Machine Setup Procedure',
    description: 'Viewed by John Smith',
    time: '2 minutes ago',
    icon: Play,
    color: 'text-winbro-teal'
  },
  {
    id: 2,
    type: 'course_completed',
    title: 'Safety Training Course',
    description: 'Completed by Sarah Johnson',
    time: '15 minutes ago',
    icon: Award,
    color: 'text-winbro-success'
  },
  {
    id: 3,
    type: 'clip_uploaded',
    title: 'New clip uploaded',
    description: 'Quality Control Process by Mike Chen',
    time: '1 hour ago',
    icon: Video,
    color: 'text-winbro-amber'
  },
  {
    id: 4,
    type: 'certificate_issued',
    title: 'Certificate issued',
    description: 'Advanced Manufacturing for Lisa Rodriguez',
    time: '2 hours ago',
    icon: Award,
    color: 'text-winbro-info'
  },
];

const recommendedClips = [
  {
    id: 1,
    title: 'CNC Machine Calibration',
    duration: '0:28',
    thumbnail: '/api/placeholder/300/200',
    views: 234,
    rating: 4.8,
    tags: ['CNC', 'Calibration', 'Maintenance'],
    author: 'John Smith'
  },
  {
    id: 2,
    title: 'Safety Lockout Procedure',
    duration: '0:22',
    thumbnail: '/api/placeholder/300/200',
    views: 189,
    rating: 4.9,
    tags: ['Safety', 'Lockout', 'Procedure'],
    author: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'Quality Inspection Checklist',
    duration: '0:31',
    thumbnail: '/api/placeholder/300/200',
    views: 156,
    rating: 4.7,
    tags: ['Quality', 'Inspection', 'Checklist'],
    author: 'Mike Chen'
  },
];

const pinnedLibraries = [
  {
    id: 1,
    name: 'CNC Operations',
    clipCount: 45,
    lastUpdated: '2 days ago',
    color: 'bg-winbro-teal/10 text-winbro-teal'
  },
  {
    id: 2,
    name: 'Safety Procedures',
    clipCount: 32,
    lastUpdated: '1 week ago',
    color: 'bg-winbro-amber/10 text-winbro-amber'
  },
  {
    id: 3,
    name: 'Quality Control',
    clipCount: 28,
    lastUpdated: '3 days ago',
    color: 'bg-winbro-success/10 text-winbro-success'
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Review pending clips',
    description: '3 clips waiting for approval',
    priority: 'high',
    dueDate: 'Today'
  },
  {
    id: 2,
    title: 'Update safety training',
    description: 'Refresh safety procedures content',
    priority: 'medium',
    dueDate: 'Tomorrow'
  },
  {
    id: 3,
    title: 'Certificate renewal',
    description: '15 certificates expiring soon',
    priority: 'low',
    dueDate: 'Next week'
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your training content today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/dashboard/upload">
            <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
              <Plus className="h-4 w-4 mr-2" />
              Upload Clip
            </Button>
          </Link>
          <Link to="/dashboard/course-builder">
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-winbro-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from your training content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/dashboard/library">
                  <Button variant="outline" className="w-full">
                    View All Activity
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Pinned Libraries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Pinned Libraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pinnedLibraries.map((library) => (
                  <div key={library.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{library.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {library.clipCount} clips • Updated {library.lastUpdated}
                      </p>
                    </div>
                    <Badge className={library.color}>
                      {library.clipCount}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/dashboard/library">
                  <Button variant="outline" className="w-full">
                    Browse All Libraries
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Due: {task.dueDate}</p>
                      </div>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Clips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Recommended for You
            </div>
            <Link to="/dashboard/library">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>
            Popular clips based on your learning history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedClips.map((clip) => (
              <div key={clip.id} className="group cursor-pointer">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      {clip.duration}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground group-hover:text-winbro-teal transition-colors">
                    {clip.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {clip.author}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-winbro-amber mr-1" />
                        {clip.rating}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {clip.views}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clip.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}