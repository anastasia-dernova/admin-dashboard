'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface RecentLogin {
  id: number;
  name: string;
  email: string;
  avatar: string;
  timestamp: string;
  device: string;
  browser: string;
}

export default function RecentLogins() {
  const [recentLogins, setRecentLogins] = useState<RecentLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }
        const result = await response.json();
        setRecentLogins(result.recentLogins || []);
      } catch (err) {
        setError('Error loading recent logins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logins</CardTitle>
        <CardDescription>The most recent user login activities</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading recent logins...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recentLogins.length === 0 ? (
          <p>No recent login activity found.</p>
        ) : (
          <div className="space-y-6">
            {recentLogins.map((login) => (
              <div key={`${login.id}-${login.timestamp}`} className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={login.avatar}
                    alt={login.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/users/${login.id}`} className="text-sm font-medium hover:underline">
                    {login.name}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{login.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {getDeviceIcon(login.device)}
                    <span className="ml-1">{login.browser}</span>
                  </div>
                  <p className="text-xs">{formatTime(login.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}