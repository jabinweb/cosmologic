'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenIcon, Plus, Trash } from "lucide-react";
import { EditPlanDialog } from "@/components/admin/edit-plan-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plan, EditPlanFormData } from "@/types";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      setPlans(data.plans);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (planData: EditPlanFormData) => {
    try {
      const url = planData.id 
        ? `/api/admin/plans/${planData.id}`
        : '/api/admin/plans';
      
      // Convert arrays to JSON strings before sending
      const processedData = {
        ...planData,
        features: JSON.stringify(planData.features),
        perks: JSON.stringify(planData.perks)
      };

      const res = await fetch(url, {
        method: planData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (!res.ok) throw new Error('Failed to save plan');

      toast({
        title: "Success",
        description: `Plan ${planData.id ? 'updated' : 'created'} successfully`,
      });

      fetchPlans();
      setEditingPlan(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const res = await fetch(`/api/admin/plans/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete plan');

      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });

      fetchPlans();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pricing Plans</h1>
        <Button onClick={() => setEditingPlan({} as Plan)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>₹{plan.price.toLocaleString()}</TableCell>
              <TableCell>{plan.features.length} features</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  plan.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <PenIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditPlanDialog
        plan={editingPlan}
        open={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={handleSave}
      />
    </div>
  );
}
