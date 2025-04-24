'use client';

import { FC } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface TopNavProps {
  onMenuButtonClick: () => void;
  user?: User;
}

const TopNav: FC<TopNavProps> = ({ onMenuButtonClick, user }) => {
  return (
    <div className="h-16 md:h-20 border-b flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-800">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuButtonClick} 
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        
        <div className="flex items-center space-x-2">
          {user?.image ? (
            <img 
              src={user.image}
              alt={user.name || 'User'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          )}
          <div className="hidden md:block">
            <div className="text-sm font-medium">{user?.name || 'Admin User'}</div>
            <div className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;