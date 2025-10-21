import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Eye,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';

const mockOrders = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    amount: 79.00,
    status: 'paid',
    plan: 'Professional',
    period: 'Monthly',
    description: 'Professional Plan - Monthly Subscription'
  },
  {
    id: 'INV-2024-002',
    date: '2024-01-01',
    amount: 948.00,
    status: 'paid',
    plan: 'Professional',
    period: 'Yearly',
    description: 'Professional Plan - Yearly Subscription (20% discount)'
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-15',
    amount: 79.00,
    status: 'paid',
    plan: 'Professional',
    period: 'Monthly',
    description: 'Professional Plan - Monthly Subscription'
  },
  {
    id: 'INV-2023-011',
    date: '2023-11-15',
    amount: 79.00,
    status: 'paid',
    plan: 'Professional',
    period: 'Monthly',
    description: 'Professional Plan - Monthly Subscription'
  },
  {
    id: 'INV-2023-010',
    date: '2023-10-15',
    amount: 29.00,
    status: 'paid',
    plan: 'Starter',
    period: 'Monthly',
    description: 'Starter Plan - Monthly Subscription'
  }
];

export default function OrderHistory() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-winbro-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'failed':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground mt-1">
            View and download your invoices and receipts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.description}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(order.date)}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      {order.plan} - {order.period}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(order.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.period} billing
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">No orders found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? 'Try adjusting your search criteria.' : 'You haven\'t made any purchases yet.'}
                </p>
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{filteredOrders.length}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.amount, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.amount, 0) / filteredOrders.length || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Average Order</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}