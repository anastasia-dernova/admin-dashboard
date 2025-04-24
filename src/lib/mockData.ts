import { LoginEntry } from '@/types';

// just random login history for a user
export function generateMockLoginHistory(days: number, suspicious: boolean = false): LoginEntry[] {
  const loginHistory: LoginEntry[] = [];
  const now = new Date();
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  
  const baseFrequency = suspicious ? 4 : 2;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    let loginCount = Math.max(1, Math.floor(Math.random() * baseFrequency * 2));

    if (suspicious && (i % 5 === 0 || i % 7 === 0)) {
      loginCount = Math.floor(Math.random() * 10) + 15; 
    }
    
    for (let j = 0; j < loginCount; j++) {
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      const loginDate = new Date(date);
      loginDate.setHours(hours, minutes, seconds);
      
      loginHistory.push({
        id: loginHistory.length + 1,
        date: loginDate.toISOString(),
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      });
    }
  }
  
  return loginHistory.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateDailyLoginStats(days: number) {
  const stats = [];
  const now = new Date();
  
  const baseTrend = Array(days).fill(0).map((_, i) => 
    Math.floor(50 + i * 0.7 + Math.random() * 20 - 10));
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));
    
    const dayOfWeek = date.getDay(); 
    let count = baseTrend[i];
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count = Math.floor(count * 0.7); 
    } else if (dayOfWeek === 1 || dayOfWeek === 5) {
      count = Math.floor(count * 1.1); 
    } else {
      count = Math.floor(count * 1.2);
    }
    
    stats.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  
  return stats;
}

export function detectSuspiciousActivity(loginHistory: LoginEntry[]) {

  const loginsByDay = loginHistory.reduce((acc, login) => {
    const day = login.date.split('T')[0];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(login);
    return acc;
  }, {} as Record<string, LoginEntry[]>);
  
  const highFrequencyDays = Object.values(loginsByDay)
    .filter(dayLogins => dayLogins.length > 10)
    .length;
  
  const averageLoginsPerDay = loginHistory.length / Object.keys(loginsByDay).length;
  
  const maxLoginsInDay = Math.max(...Object.values(loginsByDay).map(day => day.length));
  
  const isSuspicious = 
    highFrequencyDays >= 3 ||
    maxLoginsInDay >= averageLoginsPerDay * 5;
  
  let reason = '';
  if (isSuspicious) {
    if (highFrequencyDays >= 3) {
      reason = `High frequency logins on ${highFrequencyDays} days`;
    } else {
      reason = `Unusual spike in activity (avg: ${averageLoginsPerDay.toFixed(1)}/day, max: ${maxLoginsInDay})`;
    }
  }
  
  return {
    isSuspicious,
    reason,
    stats: {
      highFrequencyDays,
      averageLoginsPerDay,
      maxLoginsInDay,
      totalDays: Object.keys(loginsByDay).length,
      totalLogins: loginHistory.length
    }
  };
}

export function calculateLoginStats(loginHistory: LoginEntry[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const last30DaysLogins = loginHistory.filter(login => 
    new Date(login.date) >= thirtyDaysAgo);
  
  const last3DaysLogins = loginHistory.filter(login => 
    new Date(login.date) >= threeDaysAgo);

  const lastLogin = loginHistory.length > 0 ? loginHistory[0].date : null;
  
  const loginsByDay: Record<string, number> = {};
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    loginsByDay[dateString] = 0;
  }
  
  last30DaysLogins.forEach(login => {
    const day = login.date.split('T')[0];
    loginsByDay[day] = (loginsByDay[day] || 0) + 1;
  });
  
  const dailyLogins = Object.entries(loginsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date)); 
  
  return {
    lastThirtyDays: last30DaysLogins.length,
    lastThreeDays: last3DaysLogins.length,
    lastLogin,
    dailyLogins
  };
}