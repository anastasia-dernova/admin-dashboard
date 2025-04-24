import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://dummyjson.com/users?limit=10');
    const data = await response.json();
    
    const usersWithCustomData = data.users.map((user: any) => ({
      ...user,
      avatar: user.image || `/api/placeholder/40/40?text=${user.firstName.charAt(0)}${user.lastName.charAt(0)}`,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
      status: Math.random() > 0.7 ? 'online' : 'offline',
      role: Math.random() > 0.8 ? 'admin' : 'user',
    }));
    
    const additionalUsers = [
      {
        id: 100,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: `/api/placeholder/40/40?text=JD`,
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        status: "online",
        role: "user",
      },
      {
        id: 101,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        avatar: `/api/placeholder/40/40?text=JS`,
        lastActive: new Date(Date.now() - 7200000).toISOString(),
        status: "offline",
        role: "user",
      },
      {
        id: 102,
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex.johnson@example.com",
        avatar: `/api/placeholder/40/40?text=AJ`,
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        status: "offline",
        role: "admin",
      }
    ];
    
    const allUsers = [...usersWithCustomData, ...additionalUsers];
    
    return NextResponse.json({ 
      users: allUsers,
      total: allUsers.length,
      limit: 10 + additionalUsers.length,
      skip: 0
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newUser = {
      id: Date.now(),
      ...body,
      avatar: `/api/placeholder/40/40?text=${body.firstName.charAt(0)}${body.lastName.charAt(0)}`,
      lastActive: new Date().toISOString(),
      status: 'offline',
      role: body.role || 'user',
    };
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}