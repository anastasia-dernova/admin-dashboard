import { Metadata } from 'next';
import DashboardHeader from '@/components/dashboard/header';
import UserActivity from '@/components/dashboard/user-activity';
import RecentLogins from '@/components/dashboard/recent-logins';
import SuspiciousUsers from '@/components/dashboard/suspicious-users';
import DashboardLayout from '@/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard for user management and activity analysis',
};

export default async function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <DashboardHeader title="Dashboard" description="Overview of user activity and suspicious login detection" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UserActivity />
          <div className="md:col-span-2">
            <SuspiciousUsers />
          </div>
        </div>
        <div className="mt-4">
          <RecentLogins />
        </div>
      </div>
    </DashboardLayout>
  );
}