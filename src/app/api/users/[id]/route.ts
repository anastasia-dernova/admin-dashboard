import { NextRequest, NextResponse } from 'next/server';
import { generateMockLoginHistory } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    let userData;
    
    // special cases for our additional mock users
    if (['100', '101', '102'].includes(userId)) {
      const mockUserMap: Record<string, any> = {
        '100': {
          id: 100,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          avatar: `/api/placeholder/40/40?text=JD`,
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          status: "online",
          role: "user",
        },
        '101': {
          id: 101,
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          avatar: `/api/placeholder/40/40?text=JS`,
          lastActive: new Date(Date.now() - 7200000).toISOString(),
          status: "offline",
          role: "user",
        },
        '102': {
          id: 102,
          firstName: "Alex",
          lastName: "Johnson",
          email: "alex.johnson@example.com",
          avatar: `/api/placeholder/40/40?text=AJ`,
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          status: "offline",
          role: "admin",
        }
      };
      
      userData = mockUserMap[userId];
    } else {
      const response = await fetch(`https://dummyjson.com/users/${userId}`);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const user = await response.json();
      
      userData = {
        ...user,
        avatar: user.image || `/api/placeholder/40/40?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
        status: Math.random() > 0.7 ? 'online' : 'offline',
        role: Math.random() > 0.8 ? 'admin' : 'user',
      };
    }
    
    const isSuspicious = Number(userId) % 5 === 0; // every 5th user is suspicious
    const loginHistory = generateMockLoginHistory(30, isSuspicious);
    
    return NextResponse.json({
      ...userData,
      loginHistory
    });
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
//to update users
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    return NextResponse.json({
      id: Number(userId),
      ...body,
      lastActive: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    return NextResponse.json({
      id: Number(params.id),
      deleted: true,
      message: 'User successfully deleted'
    });
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}