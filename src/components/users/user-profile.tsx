'use client';

import { FC, useState } from 'react';
import { UserDetail } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfileProps {
  user: UserDetail;
  suspiciousActivity: boolean;
  suspiciousReason?: string;
}

const UserProfile: FC<UserProfileProps> = ({ user, suspiciousActivity, suspiciousReason }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDisableAccountOpen, setIsDisableAccountOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role || 'user'
  });
  const [currentStatus, setCurrentStatus] = useState<'online' | 'offline' | 'disabled'>(user.status || 'offline');
  const router = useRouter();

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setUpdatedUser(prev => ({ ...prev, role: value }));
  };

  // const handleSaveProfile = async () => {
  //   try {
  //     const response = await fetch(`/api/users/${user.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedUser),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update user');
  //     }
  //     setIsEditProfileOpen(false);
  //     router.refresh();
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //   }
  // };
  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      setIsEditProfileOpen(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToggleAccountStatus = async () => {
    const newStatus = currentStatus === 'disabled' ? 'offline' : 'disabled';
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      setCurrentStatus(newStatus);
      setIsDisableAccountOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>
            View and manage user details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                <img
                  src={user.avatar || `/api/placeholder/128/128?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <UserIcon className="mr-1 h-4 w-4" />
                  <span className="capitalize">{user.role || 'User'}</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Mail className="mr-1 h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center">
                <div
                  className={`mr-2 h-3 w-3 rounded-full ${
                    currentStatus === 'online' 
                      ? 'bg-green-500' 
                      : currentStatus === 'disabled' 
                        ? 'bg-red-500' 
                        : 'bg-slate-300'
                  }`}
                />
                <span
                  className={
                    currentStatus === 'online'
                      ? 'text-green-600 dark:text-green-400'
                      : currentStatus === 'disabled'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-muted-foreground'
                  }
                >
                  {currentStatus === 'online' 
                    ? 'Currently Online' 
                    : currentStatus === 'disabled' 
                      ? 'Account Disabled' 
                      : 'Currently Offline'}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Last active: </span>
                <span>{formatDate(user.lastActive)}</span>
              </div>
              
              {suspiciousActivity && (
                <Alert variant="destructive" className="mt-4 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200 dark:border-amber-900">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Suspicious Activity Detected</AlertTitle>
                  <AlertDescription>
                    {suspiciousReason || 'Unusual login patterns have been detected for this user.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>Edit Profile</Button>
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/20"
                  onClick={() => setIsDisableAccountOpen(true)}
                >
                  {currentStatus === 'disabled' ? 'Enable Account' : 'Disable Account'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to the user profile here
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={updatedUser.firstName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={updatedUser.lastName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={updatedUser.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDisableAccountOpen} onOpenChange={setIsDisableAccountOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentStatus === 'disabled' ? 'Enable Account' : 'Disable Account'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStatus === 'disabled' 
                ? 'This will enable the user account, allowing them to log in and use the system.'
                : 'This will disable the user account, preventing them from logging in or using the system.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleAccountStatus}
              className={currentStatus === 'disabled' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {currentStatus === 'disabled' ? 'Enable Account' : 'Disable Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserProfile;