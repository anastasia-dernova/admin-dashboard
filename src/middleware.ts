import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const protectedPaths = ['/dashboard', '/users'];
  const isProtectedPath = protectedPaths.some((prefix) => 
    path === prefix || path.startsWith(`${prefix}/`));
    
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request });
  
  if (!token && isProtectedPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/login']
};