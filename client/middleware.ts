import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authApi } from '@/lib/api'




const publicPaths = ['/books', '/','/how-it-works']
const authPaths = ['/auth/login', '/auth/register']
const ownerPaths = ['/owner']
const seekerPaths = ['/seeker']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }
  
  const isAuthPath = authPaths.some(path => pathname === path)
  const token = request.cookies.get('userId')?.value
  console.log('Token:', token)
  
  if (!token) {
    if (isAuthPath) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const { success, user } = await authApi.verifyToken(token)

    if (!success || !user) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('userId')
      return response
    }

    const isOwnerPath = ownerPaths.some(path => pathname.startsWith(path))
    const isSeekerPath = seekerPaths.some(path => pathname.startsWith(path))

    if (isOwnerPath && user.role !== 'owner') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isSeekerPath && user.role !== 'seeker') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (isAuthPath) {
      if (user.role === 'owner') {
        return NextResponse.redirect(new URL('/owner/dashboard', request.url))
      } else if (user.role === 'seeker') {
        return NextResponse.redirect(new URL('/seeker/dashboard', request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in middleware:', error)
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    response.cookies.delete('userId')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|sitemap.xml|robots.txt|images|fonts|assets).*)',
  ],
}