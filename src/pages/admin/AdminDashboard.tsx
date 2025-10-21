import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Video, 
  Eye, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '2,456', change: '+12%', icon: Users, color: 'text-winbro-teal' },
  { name: 'Total Clips', value: '8,234', change: '+8%', icon: Video, color: 'text-winbro-amber' },
  { name: 'Total Views', value: '45,678', change: '+23%', icon: Eye, color: 'text-winbro-info' },
  { name: 'Certificates Issued', value: '1,234', change: '+15%', icon: Award, color: 'text-winbro-success' },
];

const recentActivity = [
  {
    id: 1,
    type: 'user_registered',
    message: 'New user registered: Sarah Johnson',
    timestamp: '2 minutes ago',
    icon: Users,
    color: 'text-winbro-teal'
  },
  {
    id: 2,
    type: 'clip_uploaded',
    message: 'New clip uploaded: CNC Safety Procedure',
    timestamp: '15 minutes ago',
    icon: Video,
    color: 'text-winbro-amber'
  },
  {
    id: 3,
    type: 'course_completed',
    message: 'Course completed: Advanced Manufacturing',
    timestamp: '1 hour ago',
    icon: Award,
    color: 'text-winbro-success'
  },
  {
    id: 4,
    type: 'content_flagged',
    message: 'Content flagged for review: Machine Setup',
    timestamp: '2 hours ago',
    icon: AlertTriangle,
    color: 'text-destructive'
  },
];

const pendingReviews = [
  {
    id: 1,
    title: 'CNC Machine Calibration',
    author: 'John Smith',
    submittedAt: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Safety Lockout Procedure',
    author: 'Sarah Johnson',
    submittedAt: '4 hours ago',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Quality Control Process',
    author: 'Mike Chen',
    submittedAt: '6 hours ago',
    status: 'pending'
  },
];

const topContent = [
  {
    id: 1,
    title: 'CNC Machine Setup',
    views: 1234,
    rating: 4.8,
    author: 'John Smith'
  },
  {
    id: 2,
    title: 'Safety Procedures',
    views: 987,
    rating: 4.9,
    author: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'Quality Control',
    views: 756,
    rating: 4.7,
    author: 'Mike Chen'
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform activity and management tools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest platform activities and events
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
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Review Content
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Handle Reports
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Status</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-winbro-success mr-1" />
                    <span className="text-sm text-winbro-success">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-winbro-success mr-1" />
                    <span className="text-sm text-winbro-success">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Video Processing</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-winbro-success mr-1" />
                    <span className="text-sm text-winbro-success">Running</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search Index</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-warning mr-1" />
                    <span className="text-sm text-warning">Updating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Content waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{review.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    By {review.author} • Submitted {review.submittedAt}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-warning">
                    Pending
                  </Badge>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>
            Most viewed clips this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{content.title}</h4>
                    <p className="text-sm text-muted-foreground">By {content.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{content.views} views</p>
                    <p className="text-xs text-muted-foreground">Rating: {content.rating}</p>
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