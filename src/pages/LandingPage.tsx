import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Search, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  Shield,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Play className="h-8 w-8 text-winbro-teal" />,
      title: "Short Videos",
      description: "20-30 second microlearning clips for quick knowledge transfer"
    },
    {
      icon: <Search className="h-8 w-8 text-winbro-teal" />,
      title: "Searchable Library",
      description: "Find exactly what you need with intelligent search and filtering"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-winbro-teal" />,
      title: "Course Builder",
      description: "Create structured training paths with quizzes and assessments"
    },
    {
      icon: <Award className="h-8 w-8 text-winbro-teal" />,
      title: "Certification",
      description: "Issue verified certificates with QR codes and digital verification"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Capture",
      description: "Record 20-30 second clips of machine operations and processes"
    },
    {
      number: "02", 
      title: "Curate",
      description: "Organize clips with metadata, transcripts, and searchable tags"
    },
    {
      number: "03",
      title: "Deliver",
      description: "Distribute through courses, certificates, and searchable libraries"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Training Manager",
      company: "Manufacturing Corp",
      content: "Winbro has revolutionized our training. New operators can learn complex procedures in minutes, not hours.",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Operations Director", 
      company: "Industrial Solutions",
      content: "The searchable library saves us hours every week. No more hunting through paper manuals.",
      avatar: "MC"
    },
    {
      name: "Lisa Rodriguez",
      role: "Safety Coordinator",
      company: "Precision Manufacturing",
      content: "Certification tracking is seamless. We can prove compliance instantly with QR codes.",
      avatar: "LR"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-winbro-teal">Winbro</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/help" className="text-foreground hover:text-winbro-teal px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Help
                </Link>
                <Link to="/login" className="text-foreground hover:text-winbro-teal px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/signup">
                  <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-winbro-amber/10 text-winbro-amber border-winbro-amber/20">
                  Manufacturing Training Revolution
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Replace Paper Manuals with
                  <span className="text-winbro-teal"> Smart Video Training</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Capture, curate, and deliver 20-30 second microlearning videos tied to manufacturing machines, processes, and tooling. 
                  Transform tribal knowledge into searchable, verified training content.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-winbro-teal hover:bg-winbro-teal/90 text-lg px-8 py-4">
                    Request Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Watch Demo
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-winbro-success mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-winbro-success mr-2" />
                  No credit card required
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-winbro-teal/20 to-winbro-amber/20 flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-winbro-teal"
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-winbro-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything You Need for Modern Manufacturing Training
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From capturing tribal knowledge to delivering structured learning paths, 
              Winbro provides the complete training platform for manufacturing teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your manufacturing training in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-winbro-teal text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border transform translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-winbro-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-winbro-amber">Training Clips</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-winbro-amber">Manufacturing Companies</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50,000+</div>
              <div className="text-winbro-amber">Trained Operators</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-winbro-amber">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Trusted by Manufacturing Leaders
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers say about Winbro Training Reels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-winbro-teal text-white rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ready to Transform Your Training?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of manufacturing companies already using Winbro to modernize their training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-winbro-teal hover:bg-winbro-teal/90 text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-winbro-teal">Winbro</h3>
              <p className="text-muted-foreground">
                Modernizing manufacturing training with smart video technology.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Winbro Training Reels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}