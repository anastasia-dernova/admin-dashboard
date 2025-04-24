import 'next-auth';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image?: string; 
    avatar?: string;
    lastActive?: string;
    status?: 'online' | 'offline' | 'disabled';
    role?: string;
    suspiciousActivity?: boolean; 
    suspiciousActivityReason?: string;
}
  
export interface LoginEntry {
    id: number;
    date: string;
    device: string;
    browser: string;
    ip: string;
}
  
export interface UserDetail extends User {
    loginHistory: LoginEntry[];
}
  
export interface LoginStats {
    lastThirtyDays: number;
    lastThreeDays: number;
    lastLogin: string;
    dailyLogins: { date: string; count: number }[];
}
  
declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        role?: string | null;
        image?: string | null;
      };
    }
}
  

export interface SuspiciousActivityCriteria {
    highFrequencyDays: number;
    highFrequencyThreshold: number;
    averageMultiplier: number;
}

export interface PageParams {
    params: {
      id: string;
    };
  }
  