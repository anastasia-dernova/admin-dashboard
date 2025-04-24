import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold tracking-tight mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The resource you're looking for doesn't exist.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/users">View All Users</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}