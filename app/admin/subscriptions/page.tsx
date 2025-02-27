'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Search, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: string;
  activatedAt: string;
  user: {
    name: string;
    email: string;
  };
}

function ViewInvoiceButton({ subscriptionId }: { subscriptionId: string }) {
  const handleClick = () => {
    window.open(`/api/subscriptions/${subscriptionId}/invoice`, '_blank');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleClick}
      className="text-blue-600 hover:text-blue-800"
    >
      <FileText className="h-4 w-4 mr-2" />
      View Invoice
    </Button>
  );
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/admin/subscriptions');
      const data = await res.json();
      setSubscriptions(data.subscriptions);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
    sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
    sub.planId.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={fetchSubscriptions}>Refresh</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{subscription.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {subscription.user.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">{subscription.planId}</TableCell>
              <TableCell>
                <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {subscription.status.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(subscription.activatedAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <ViewInvoiceButton subscriptionId={subscription.id} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(subscription.id, 'ACTIVE')}
                      >
                        Mark Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(subscription.id, 'CANCELLED')}
                        className="text-red-600"
                      >
                        Cancel Subscription
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
