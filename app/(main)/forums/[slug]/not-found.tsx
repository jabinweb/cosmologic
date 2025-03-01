import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForumNotFound() {
  return (
    <div className="container py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Forum Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The forum you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/forums">
          Return to Forums
        </Link>
      </Button>
    </div>
  );
}
