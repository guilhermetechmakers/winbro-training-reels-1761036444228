import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of Winbro Training Reels',
    icon: BookOpen,
    articles: 12,
    color: 'text-winbro-teal'
  },
  {
    id: 'uploading-content',
    name: 'Uploading Content',
    description: 'How to upload and manage your training clips',
    icon: Video,
    articles: 8,
    color: 'text-winbro-amber'
  },
  {
    id: 'course-building',
    name: 'Course Building',
    description: 'Create structured training courses',
    icon: FileText,
    articles: 15,
    color: 'text-winbro-info'
  },
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: MessageCircle,
    articles: 6,
    color: 'text-winbro-success'
  }
];

const popularArticles = [
  {
    id: 1,
    title: 'How to upload your first training clip',
    category: 'Uploading Content',
    readTime: '5 min read',
    views: 1234
  },
  {
    id: 2,
    title: 'Creating effective course structures',
    category: 'Course Building',
    readTime: '8 min read',
    views: 987
  },
  {
    id: 3,
    title: 'Setting up user roles and permissions',
    category: 'User Management',
    readTime: '6 min read',
    views: 756
  },
  {
    id: 4,
    title: 'Best practices for video recording',
    category: 'Uploading Content',
    readTime: '10 min read',
    views: 634
  },
  {
    id: 5,
    title: 'Understanding analytics and reporting',
    category: 'Getting Started',
    readTime: '7 min read',
    views: 523
  }
];

const faqs = [
  {
    question: 'How do I upload a training video?',
    answer: 'To upload a training video, go to the Upload Content page, drag and drop your video file, fill in the metadata, and publish. Videos should be 20-30 seconds for optimal learning retention.'
  },
  {
    question: 'What video formats are supported?',
    answer: 'We support MP4, MOV, AVI, MKV, and WebM formats. The maximum file size is 100MB per video.'
  },
  {
    question: 'How do I create a course?',
    answer: 'Use the Course Builder to create structured training courses. Add clips, insert quizzes, set passing criteria, and publish your course for learners.'
  },
  {
    question: 'Can I customize the platform for my organization?',
    answer: 'Yes! Enterprise plans include custom branding, SSO integration, and SCIM provisioning for seamless user management.'
  },
  {
    question: 'How do I track learner progress?',
    answer: 'Use the Analytics page to view detailed reports on learner progress, course completion rates, and content performance metrics.'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Find answers, guides, and support for Winbro Training Reels
        </p>
      </div>

      {/* Search */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-winbro-teal mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-muted-foreground mb-4">
              Get instant help from our support team
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-winbro-amber mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-4">
              Send us a detailed message
            </p>
            <Button variant="outline" className="w-full">Send Email</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Phone className="h-12 w-12 text-winbro-info mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
            <p className="text-muted-foreground mb-4">
              Call us for urgent issues
            </p>
            <Button variant="outline" className="w-full">Call Now</Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Button variant="ghost" className="w-full justify-between">
                  Browse Articles
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Popular Articles</h2>
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-8 w-8 text-winbro-teal" />
                <div>
                  <h3 className="font-semibold">User Guide</h3>
                  <p className="text-sm text-muted-foreground">Complete platform guide</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Video className="h-8 w-8 text-winbro-amber" />
                <div>
                  <h3 className="font-semibold">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step video guides</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch Videos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="h-8 w-8 text-winbro-info" />
                <div>
                  <h3 className="font-semibold">Community Forum</h3>
                  <p className="text-sm text-muted-foreground">Connect with other users</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <Card className="bg-winbro-teal/5 border-winbro-teal/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you get the most out of Winbro Training Reels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}