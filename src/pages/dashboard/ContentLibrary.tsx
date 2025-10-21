import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Play, 
  Star, 
  Eye, 
  Download, 
  Bookmark,
  MoreVertical,
  Clock,
  User,
  Tag,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockClips = [
  {
    id: 1,
    title: 'CNC Machine Calibration Process',
    description: 'Step-by-step guide for calibrating CNC machines including safety checks and precision measurements.',
    duration: '0:28',
    thumbnail: '/api/placeholder/300/200',
    views: 1234,
    rating: 4.8,
    tags: ['CNC', 'Calibration', 'Maintenance', 'Safety'],
    author: 'John Smith',
    machineModel: 'HAAS VF-2',
    process: 'Setup',
    skillLevel: 'Intermediate',
    createdAt: '2024-01-15',
    status: 'published'
  },
  {
    id: 2,
    title: 'Safety Lockout Procedure',
    description: 'Complete lockout/tagout procedure for electrical equipment maintenance.',
    duration: '0:22',
    thumbnail: '/api/placeholder/300/200',
    views: 892,
    rating: 4.9,
    tags: ['Safety', 'Lockout', 'Electrical', 'Maintenance'],
    author: 'Sarah Johnson',
    machineModel: 'Electrical Panel',
    process: 'Safety',
    skillLevel: 'Beginner',
    createdAt: '2024-01-12',
    status: 'published'
  },
  {
    id: 3,
    title: 'Quality Inspection Checklist',
    description: 'Comprehensive quality control inspection process for manufactured parts.',
    duration: '0:31',
    thumbnail: '/api/placeholder/300/200',
    views: 756,
    rating: 4.7,
    tags: ['Quality', 'Inspection', 'Checklist', 'Control'],
    author: 'Mike Chen',
    machineModel: 'Inspection Station',
    process: 'Quality Control',
    skillLevel: 'Advanced',
    createdAt: '2024-01-10',
    status: 'published'
  },
  {
    id: 4,
    title: 'Tool Change Procedure',
    description: 'Safe and efficient tool changing process for milling operations.',
    duration: '0:25',
    thumbnail: '/api/placeholder/300/200',
    views: 634,
    rating: 4.6,
    tags: ['Tooling', 'Milling', 'Setup', 'Efficiency'],
    author: 'Lisa Rodriguez',
    machineModel: 'Bridgeport Mill',
    process: 'Setup',
    skillLevel: 'Intermediate',
    createdAt: '2024-01-08',
    status: 'published'
  },
  {
    id: 5,
    title: 'Material Handling Safety',
    description: 'Proper techniques for handling heavy materials and equipment.',
    duration: '0:19',
    thumbnail: '/api/placeholder/300/200',
    views: 445,
    rating: 4.5,
    tags: ['Safety', 'Material Handling', 'Heavy Equipment'],
    author: 'David Wilson',
    machineModel: 'Forklift',
    process: 'Material Handling',
    skillLevel: 'Beginner',
    createdAt: '2024-01-05',
    status: 'published'
  },
  {
    id: 6,
    title: 'Preventive Maintenance Schedule',
    description: 'Weekly and monthly maintenance tasks to keep equipment running smoothly.',
    duration: '0:35',
    thumbnail: '/api/placeholder/300/200',
    views: 567,
    rating: 4.8,
    tags: ['Maintenance', 'Preventive', 'Schedule', 'Equipment'],
    author: 'John Smith',
    machineModel: 'Various',
    process: 'Maintenance',
    skillLevel: 'Advanced',
    createdAt: '2024-01-03',
    status: 'published'
  },
];

const machineModels = ['All', 'HAAS VF-2', 'Bridgeport Mill', 'Electrical Panel', 'Inspection Station', 'Forklift'];
const processes = ['All', 'Setup', 'Safety', 'Quality Control', 'Material Handling', 'Maintenance'];
const skillLevels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Newest', 'Oldest', 'Most Viewed', 'Highest Rated', 'Alphabetical'];

export default function ContentLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClips, setSelectedClips] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    machineModel: 'All',
    process: 'All',
    skillLevel: 'All',
    sortBy: 'Newest'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClipSelect = (clipId: number) => {
    setSelectedClips(prev => 
      prev.includes(clipId) 
        ? prev.filter(id => id !== clipId)
        : [...prev, clipId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClips.length === mockClips.length) {
      setSelectedClips([]);
    } else {
      setSelectedClips(mockClips.map(clip => clip.id));
    }
  };

  const filteredClips = mockClips.filter(clip => {
    const matchesSearch = !filters.search || 
      clip.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      clip.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      clip.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesMachine = filters.machineModel === 'All' || clip.machineModel === filters.machineModel;
    const matchesProcess = filters.process === 'All' || clip.process === filters.process;
    const matchesSkill = filters.skillLevel === 'All' || clip.skillLevel === filters.skillLevel;

    return matchesSearch && matchesMachine && matchesProcess && matchesSkill;
  });

  const sortedClips = [...filteredClips].sort((a, b) => {
    switch (filters.sortBy) {
      case 'Newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'Oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'Most Viewed':
        return b.views - a.views;
      case 'Highest Rated':
        return b.rating - a.rating;
      case 'Alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your training clips and courses
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/dashboard/upload">
            <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
              Upload Clip
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clips, courses, and more..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.machineModel} onValueChange={(value) => handleFilterChange('machineModel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Machine Model" />
                </SelectTrigger>
                <SelectContent>
                  {machineModels.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.process} onValueChange={(value) => handleFilterChange('process', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Process" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map((process) => (
                    <SelectItem key={process} value={process}>{process}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.skillLevel} onValueChange={(value) => handleFilterChange('skillLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            {sortedClips.length} clips found
          </p>
          {selectedClips.length > 0 && (
            <Badge variant="secondary">
              {selectedClips.length} selected
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedClips.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedClips.length === mockClips.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedClips.length} clips selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Add to Course
                </Button>
                <Button variant="outline" size="sm">
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  Archive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedClips.map((clip) => (
            <Card key={clip.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
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
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedClips.includes(clip.id)}
                      onCheckedChange={() => handleClipSelect(clip.id)}
                      className="bg-white/90"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground group-hover:text-winbro-teal transition-colors line-clamp-2">
                      {clip.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {clip.description}
                    </p>
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
                      {clip.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {clip.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{clip.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary" className="text-xs">
                        {clip.skillLevel}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Bookmark className="h-4 w-4 mr-2" />
                            Bookmark
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Add to Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedClips.map((clip) => (
            <Card key={clip.id} className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={clip.thumbnail}
                      alt={clip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-1 right-1">
                      <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                        {clip.duration}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-winbro-teal transition-colors">
                          {clip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {clip.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {clip.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {clip.createdAt}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {clip.views} views
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-winbro-amber mr-1" />
                            {clip.rating}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {clip.machineModel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {clip.process}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {clip.skillLevel}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Checkbox
                          checked={selectedClips.includes(clip.id)}
                          onCheckedChange={() => handleClipSelect(clip.id)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Bookmark
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Add to Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedClips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No clips found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search criteria or upload new content.
                </p>
              </div>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => setFilters({ ...filters, search: '' })}>
                  Clear Filters
                </Button>
                <Link to="/dashboard/upload">
                  <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
                    Upload Clip
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}