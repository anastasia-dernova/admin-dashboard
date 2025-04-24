import { FC } from 'react';
import { LoginEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface UserLoginHistoryProps {
  loginHistory: LoginEntry[];
  userId: number;
}

const UserLoginHistory: FC<UserLoginHistoryProps> = ({ loginHistory, userId }) => {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4 text-slate-400" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-slate-400" />;
      case 'tablet':
        return <Tablet className="h-4 w-4 text-slate-400" />;
      default:
        return <Monitor className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Logins</CardTitle>
          <CardDescription>Last {loginHistory.length} login sessions</CardDescription>
        </div>
        <Link href={`/users/${userId}/activity`} passHref>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loginHistory.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No login history available</p>
        ) : (
          <div className="space-y-4">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border">
                <div className="flex-shrink-0 flex items-center">
                  {getDeviceIcon(entry.device)}
                  <span className="ml-2 font-medium">{entry.browser}</span>
                  <span className="text-xs text-muted-foreground ml-2">({entry.device})</span>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-slate-700 sm:hidden my-2"></div>
                <div className="flex-1 flex flex-col sm:items-end text-xs">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTime(entry.date)}</span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-slate-700 sm:hidden my-2"></div>
                <div className="text-xs text-muted-foreground">
                  IP: {entry.ip}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserLoginHistory;