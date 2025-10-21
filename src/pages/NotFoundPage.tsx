import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  Search, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-winbro-teal hover:bg-winbro-teal/90">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Helpful Links */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Popular Pages</h3>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-sm text-winbro-teal hover:text-winbro-teal/80 transition-colors">
                Dashboard
              </Link>
              <Link to="/dashboard/library" className="block text-sm text-winbro-teal hover:text-winbro-teal/80 transition-colors">
                Content Library
              </Link>
              <Link to="/dashboard/upload" className="block text-sm text-winbro-teal hover:text-winbro-teal/80 transition-colors">
                Upload Content
              </Link>
              <Link to="/help" className="block text-sm text-winbro-teal hover:text-winbro-teal/80 transition-colors">
                Help Center
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Search Suggestion */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Looking for something specific?
          </p>
          <Link to="/dashboard/library">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}