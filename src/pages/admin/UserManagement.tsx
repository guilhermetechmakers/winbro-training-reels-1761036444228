import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Mail,
  UserPlus,
  Download,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Training Manager',
    status: 'active',
    lastLogin: '2 hours ago',
    avatar: '/api/placeholder/40/40',
    organization: 'Manufacturing Corp'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Trainer',
    status: 'active',
    lastLogin: '1 day ago',
    avatar: '/api/placeholder/40/40',
    organization: 'Manufacturing Corp'
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Learner',
    status: 'inactive',
    lastLogin: '1 week ago',
    avatar: '/api/placeholder/40/40',
    organization: 'Industrial Solutions'
  },
  {
    id: 4,
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '30 minutes ago',
    avatar: '/api/placeholder/40/40',
    organization: 'Precision Manufacturing'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'Learner',
    status: 'pending',
    lastLogin: 'Never',
    avatar: '/api/placeholder/40/40',
    organization: 'Manufacturing Corp'
  }
];

const roles = ['All', 'Admin', 'Training Manager', 'Trainer', 'Learner'];
const statuses = ['All', 'Active', 'Inactive', 'Pending'];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && user.status === 'active') ||
      (selectedStatus === 'Inactive' && user.status === 'inactive') ||
      (selectedStatus === 'Pending' && user.status === 'pending');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-winbro-success text-white';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-destructive text-white';
      case 'Training Manager':
        return 'bg-winbro-teal text-white';
      case 'Trainer':
        return 'bg-winbro-amber text-white';
      case 'Learner':
        return 'bg-winbro-info text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{user.name}</h4>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.organization} • Last login: {user.lastLogin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No users found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search criteria or invite new users.
                </p>
              </div>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('All');
                  setSelectedStatus('All');
                }}>
                  Clear Filters
                </Button>
                <Button className="bg-winbro-teal hover:bg-winbro-teal/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}