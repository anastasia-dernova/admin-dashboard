'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface SuspiciousUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  reason: string;
  lastActive: string;
}

export default function SuspiciousUsers() {
  const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousUser[]>([]);
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
        setSuspiciousUsers(result.suspiciousUsers || []);
      } catch (err) {
        setError('Error loading suspicious users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Suspicious Users
          </CardTitle>
          <CardDescription>Users with unusual login patterns</CardDescription>
        </div>
        <Link 
          href="#" 
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading suspicious users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : suspiciousUsers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No suspicious activity detected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suspiciousUsers.map((user) => (
              <div key={user.id} className="flex items-start p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/20">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link href={`/users/${user.id}`} className="font-medium hover:underline">
                      {user.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatLastActive(user.lastActive)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{user.email}</p>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {user.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}