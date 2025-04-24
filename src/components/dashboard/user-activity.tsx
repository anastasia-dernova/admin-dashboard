'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityData {
  dailyLogins: { date: string; count: number }[];
  totalLogins: number;
}

export default function UserActivity() {
  const [data, setData] = useState<ActivityData | null>(null);
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
        setData(result);
      } catch (err) {
        setError('Error loading activity data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formattedData = data?.dailyLogins.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Login activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p>Loading activity data...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="h-[300px]">
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
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">{data?.totalLogins}</p>
              <p className="text-sm text-muted-foreground">Total logins in the last 30 days</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}