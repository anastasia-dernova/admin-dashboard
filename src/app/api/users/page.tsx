import { Metadata } from 'next';
import DashboardHeader from '@/components/dashboard/header';
import DashboardLayout from '@/components/layout/dashboard-layout';
import UsersList from '@/components/users/users-list';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage users and view their activity',
};

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5">
        <DashboardHeader 
          title="User Management" 
          description="View and manage all users in the system" 
        />
        <UsersList />
      </div>
    </DashboardLayout>
  );
}