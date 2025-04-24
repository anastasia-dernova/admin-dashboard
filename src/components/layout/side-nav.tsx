'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, LogOut, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

const SideNav: FC<SideNavProps> = ({ open, onClose }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:w-64 md:flex-shrink-0`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b md:h-20">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            <Link href="/dashboard" passHref>
              <Button 
                variant={isActive('/dashboard') ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/users" passHref>
              <Button 
                variant={isActive('/users') ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Button>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;