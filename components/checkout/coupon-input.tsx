"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CouponInputProps {
  onApply: (discount: number) => void;
}

export function CouponInput({ onApply }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code) return;
    setLoading(true);

    try {
      const res = await fetch("/api/coupon/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      onApply(data.discount);
      toast({
        title: "Coupon applied!",
        description: `${data.discount}% discount applied to your order.`,
      });
    } catch (error) {
      toast({
        title: "Invalid coupon",
        description: "This coupon code is invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter coupon code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="uppercase"
      />
      <Button 
        onClick={handleApply} 
        disabled={loading || !code}
        variant="outline"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
      </Button>
    </div>
  );
}
