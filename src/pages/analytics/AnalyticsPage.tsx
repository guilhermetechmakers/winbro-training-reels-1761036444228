import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Video, 
  Eye, 
  Award,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
];

const mockData = {
  views: [
    { date: '2024-01-01', views: 120 },
    { date: '2024-01-02', views: 150 },
    { date: '2024-01-03', views: 180 },
    { date: '2024-01-04', views: 200 },
    { date: '2024-01-05', views: 160 },
    { date: '2024-01-06', views: 220 },
    { date: '2024-01-07', views: 190 }
  ],
  topContent: [
    { name: 'CNC Machine Setup', views: 1234, completion: 85 },
    { name: 'Safety Procedures', views: 987, completion: 92 },
    { name: 'Quality Control', views: 756, completion: 78 },
    { name: 'Tool Change', views: 634, completion: 88 },
    { name: 'Maintenance', views: 523, completion: 75 }
  ],
  userEngagement: [
    { name: 'Jan', activeUsers: 120, newUsers: 25 },
    { name: 'Feb', activeUsers: 135, newUsers: 30 },
    { name: 'Mar', activeUsers: 150, newUsers: 35 },
    { name: 'Apr', activeUsers: 165, newUsers: 40 },
    { name: 'May', activeUsers: 180, newUsers: 45 },
    { name: 'Jun', activeUsers: 195, newUsers: 50 }
  ],
  completionRates: [
    { name: 'Beginner', value: 85, color: '#0B6B6F' },
    { name: 'Intermediate', value: 78, color: '#F3A712' },
    { name: 'Advanced', value: 92, color: '#2E8B57' }
  ]
};

const stats = [
  { name: 'Total Views', value: '45,678', change: '+23%', icon: Eye, color: 'text-winbro-teal' },
  { name: 'Active Users', value: '1,234', change: '+12%', icon: Users, color: 'text-winbro-amber' },
  { name: 'Content Clips', value: '8,234', change: '+8%', icon: Video, color: 'text-winbro-info' },
  { name: 'Completion Rate', value: '87%', change: '+5%', icon: Award, color: 'text-winbro-success' },
];

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Views Over Time
            </CardTitle>
            <CardDescription>
              Daily content views for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.views}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#0B6B6F" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Engagement
            </CardTitle>
            <CardDescription>
              Active users and new registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.userEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activeUsers" fill="#0B6B6F" />
                <Bar dataKey="newUsers" fill="#F3A712" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>
            Most viewed clips and their completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.topContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{content.name}</h4>
                    <p className="text-sm text-muted-foreground">{content.views} views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{content.completion}% completion</p>
                    <div className="w-20 bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-winbro-teal h-2 rounded-full"
                        style={{ width: `${content.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rates by Skill Level */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Rates by Skill Level</CardTitle>
            <CardDescription>
              How different skill levels perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.completionRates}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockData.completionRates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user actions and content updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-winbro-teal rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New clip uploaded: CNC Safety</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-winbro-amber rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Course completed: Advanced Manufacturing</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-winbro-success rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Certificate issued: Safety Training</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-winbro-info rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered: Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}