import { useState } from "react";
import { Plan, PlanType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditPlanFormData } from "@/types";

interface EditPlanDialogProps {
  plan: Partial<Plan> | null;
  open: boolean;
  onClose: () => void;
  onSave: (plan: EditPlanFormData) => Promise<void>;
}

export function EditPlanDialog({ plan, open, onClose, onSave }: EditPlanDialogProps) {
  const defaultValues: EditPlanFormData = {
    name: 'basic' as PlanType,
    type: 'basic',
    displayName: '',
    description: '',
    price: 0,
    features: [],
    perks: [],
    isFeatured: false,
    isActive: true,
    color: 'bg-blue-500',
    order: 0,
  };

  const [formData, setFormData] = useState<EditPlanFormData>({
    ...defaultValues,
    ...plan
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {plan?.id ? 'Edit Plan' : 'Create New Plan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Internal Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., basic_plan"
              />
            </div>
            <div>
              <Label>Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="e.g., Basic Plan"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the plan"
            />
          </div>

          <div>
            <Label>Plan Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: PlanType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price (in INR)</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>

          <div>
            <Label>Features (one per line)</Label>
            <Textarea
              value={formData.features.join('\n')}
              onChange={(e) => setFormData({ 
                ...formData, 
                features: e.target.value.split('\n').filter(Boolean)
              })}
              rows={4}
              placeholder="Each line will be a feature point"
            />
          </div>

          <div>
            <Label>Perks/Benefits (one per line)</Label>
            <Textarea
              value={formData.perks.join('\n')}
              onChange={(e) => setFormData({ 
                ...formData, 
                perks: e.target.value.split('\n').filter(Boolean)
              })}
              rows={4}
              placeholder="Additional benefits of this plan"
            />
          </div>

          <div>
            <Label>Color Class</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-blue-500">Blue</SelectItem>
                <SelectItem value="bg-purple-500">Purple</SelectItem>
                <SelectItem value="bg-amber-500">Amber</SelectItem>
                <SelectItem value="bg-green-500">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label>Featured Plan</Label>
            </div>
          </div>

          <div>
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              min="0"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
