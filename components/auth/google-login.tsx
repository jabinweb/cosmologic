"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import { LoaderIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { useState } from "react";

interface GoogleLoginProps {
  mode: "login" | "register";
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function GoogleLogin({ mode, onSuccess, onError, className }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      window.location.href = `/api/auth/google/signin?mode=${mode}`;
    } catch (error) {
      onError?.('Failed to initialize Google Sign-In');
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      {isLoading ? "Connecting..." : "Continue with Google"}
    </Button>
  );
}