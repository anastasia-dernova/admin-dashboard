import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserX } from 'lucide-react';

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-6 flex items-center justify-center">
          <UserX className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">User Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The user you're looking for doesn't exist or has been removed from the system.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/users">View All Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}