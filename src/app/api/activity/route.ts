import { NextResponse } from 'next/server';
import { generateDailyLoginStats } from '@/lib/mockData';

export async function GET() {
  try {
    //here is mock login activity data for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyLogins = generateDailyLoginStats(30);
    
    //total logins for the last 30 days
    const totalLogins = dailyLogins.reduce((sum, day) => sum + day.count, 0);
    
    //most recent logins (last 5 users)
    const recentLogins = await getRecentLogins(5);
    
    // suspicious users based on login patterns
    const suspiciousUsers = await identifySuspiciousUsers();
    
    return NextResponse.json({
      dailyLogins,
      totalLogins,
      recentLogins,
      suspiciousUsers
    });
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}
async function getRecentLogins(count: number) {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=10');

    const data = await response.json();
    
    return data.users.slice(0, count).map((user: any, index: number) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      avatar: user.image || `/api/placeholder/40/40?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
      timestamp: new Date(Date.now() - index * 1000 * 60 * Math.floor(Math.random() * 60)).toISOString(),
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error('Error generating recent logins:', error);
    return [];
  }
}

async function identifySuspiciousUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=20');
    const data = await response.json();
    
    // rules for suspicious user entries for every 5th user
    return data.users
      .filter((_: any, index: number) => index % 5 === 0)
      .map((user: any) => {
        const highLoginDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
        const averageLogins = Math.floor(Math.random() * 3) + 2; // 2-4 logins
        const spikeLogins = Math.floor(Math.random() * 10) + 15; // 15-24 logins
        
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: user.image || `/api/placeholder/40/40?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
          reason: Math.random() > 0.5
            ? `High frequency logins on ${highLoginDays} days`
            : `Unusual spike in activity (avg: ${averageLogins}/day, spike: ${spikeLogins})`,
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        };
      });
  } catch (error) {
    console.error('Error identifying suspicious users:', error);
    return [];
  }
}