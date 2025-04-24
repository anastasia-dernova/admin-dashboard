// import { notFound } from 'next/navigation';
// import DashboardHeader from '@/components/dashboard/header';
// import DashboardLayout from '@/components/layout/dashboard-layout';
// import UserProfile from '@/components/users/user-profile';
// import UserActivityStats from '@/components/users/user-activity-stats';
// import UserLoginHistory from '@/components/users/user-login-history';
// import { UserDetail } from '@/types';

// async function getUserData(userId: string): Promise<UserDetail | null> {
//   try {
//     const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
//     const response = await fetch(`${baseUrl}/api/users/${userId}`, {
//       cache: 'no-store'
//     });
    
//     if (!response.ok) {
//       return null;
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return null;
//   }
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
//   const userData = await getUserData(params.id);
  
//   if (!userData) {
//     return {
//       title: 'User Not Found',
//     };
//   }
  
//   return {
//     title: `${userData.firstName} ${userData.lastName} | User Profile`,
//     description: `User profile and activity for ${userData.firstName} ${userData.lastName}`,
//   };
// }

// export default async function UserDetailPage({
//   params,
// }: {
//   params: { id: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }) {
//   const userData = await getUserData(params.id);
  
//   if (!userData) {
//     notFound();
//   }

//   const suspiciousActivity = userData.loginHistory.length > 0 && 
//     userData.id % 5 === 0; // rule for demo purposes
  
//   let suspiciousReason = '';
//   if (suspiciousActivity) {
//     suspiciousReason = 'Unusual login patterns detected';
//   }
  
//   return (
//     <DashboardLayout>
//       <div className="flex flex-col gap-6">
//         <DashboardHeader
//           title={`${userData.firstName} ${userData.lastName}`}
//           description="User profile and login activity"
//         />
        
//         <UserProfile 
//           user={userData} 
//           suspiciousActivity={suspiciousActivity}
//           suspiciousReason={suspiciousReason}
//         />
        
//         <div className="grid gap-6 md:grid-cols-2">
//           <UserActivityStats 
//             loginHistory={userData.loginHistory} 
//           />
//           <UserLoginHistory 
//             loginHistory={userData.loginHistory.slice(0, 5)} 
//             userId={userData.id}
//           />
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

import { notFound } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import DashboardLayout from '@/components/layout/dashboard-layout';
import UserProfile from '@/components/users/user-profile';
import UserActivityStats from '@/components/users/user-activity-stats';
import UserLoginHistory from '@/components/users/user-login-history';
import { UserDetail } from '@/types';

async function getUserData(userId: string): Promise<UserDetail | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: any) {
  const userData = await getUserData(params.id);
  
  if (!userData) {
    return {
      title: 'User Not Found',
    };
  }
  
  return {
    title: `${userData.firstName} ${userData.lastName} | User Profile`,
    description: `User profile and activity for ${userData.firstName} ${userData.lastName}`,
  };
}

export default async function UserDetailPage({ params }: any) {
  const userId = params.id;
  const userData = await getUserData(userId);
  
  if (!userData) {
    notFound();
  }

  const suspiciousActivity = userData.loginHistory.length > 0 && 
    userData.id % 5 === 0; // rule for demo purposes
  
  let suspiciousReason = '';
  if (suspiciousActivity) {
    suspiciousReason = 'Unusual login patterns detected';
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title={`${userData.firstName} ${userData.lastName}`}
          description="User profile and login activity"
        />
        
        <UserProfile 
          user={userData} 
          suspiciousActivity={suspiciousActivity}
          suspiciousReason={suspiciousReason}
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <UserActivityStats 
            loginHistory={userData.loginHistory} 
          />
          <UserLoginHistory 
            loginHistory={userData.loginHistory.slice(0, 5)} 
            userId={userData.id}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}