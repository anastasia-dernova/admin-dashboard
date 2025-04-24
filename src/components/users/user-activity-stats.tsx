'use client';

import { FC, useEffect, useState } from 'react';
import { LoginEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateLoginStats } from '@/lib/mockData';

interface UserActivityStatsProps {
  loginHistory: LoginEntry[];
}

const UserActivityStats: FC<UserActivityStatsProps> = ({ loginHistory }) => {
    const [stats, setStats] = useState({
        lastThirtyDays: 0,
        lastThreeDays: 0,
        lastLogin: '' as string | null,
        dailyLogins: [] as { date: string; count: number }[]
    });

  useEffect(() => {
    const calculatedStats = calculateLoginStats(loginHistory);
    setStats(calculatedStats);
  }, [loginHistory]);

  const formattedData = stats.dailyLogins.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const formatLastLogin = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity</CardTitle>
        <CardDescription>User login frequency over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-muted-foreground text-sm">Last 30 Days</p>
            <p className="text-3xl font-bold mt-1">{stats.lastThirtyDays}</p>
            <p className="text-xs text-muted-foreground">total logins</p>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-muted-foreground text-sm">Last 3 Days</p>
            <p className="text-3xl font-bold mt-1">{stats.lastThreeDays}</p>
            <p className="text-xs text-muted-foreground">total logins</p>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mb-6">
          <p className="text-muted-foreground text-sm mb-1">Last Login</p>
          <p className="font-medium">{formatLastLogin(stats.lastLogin)}</p>
        </div>
        
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="displayDate" 
                tickFormatter={(value) => value}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                minTickGap={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                name="Logins"
                stroke="#2563eb"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityStats;