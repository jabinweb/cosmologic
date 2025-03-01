import { Loader2 } from "lucide-react";

export default function LoadingHub() {
  return (
    <div className="container py-8 flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
