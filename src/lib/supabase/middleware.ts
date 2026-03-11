import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const authRoutes = ['/login', '/register', '/auth']
  const protectedRoutes = ['/fptcolearn', '/profile', '/settings', '/write']
  const adminRoutes = ['/admin']

  const isAuthRoute = authRoutes.some(path => url.pathname.startsWith(path))
  const isProtectedRoute = protectedRoutes.some(path => url.pathname.startsWith(path))
  const isAdminRoute = adminRoutes.some(path => url.pathname.startsWith(path))

  if (!user) {
    if (isProtectedRoute || isAdminRoute) {
      url.pathname = '/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  if (user) {
    if (isAuthRoute) {
      url.pathname = '/fptcolearn'
      return NextResponse.redirect(url)
    }

    if (isAdminRoute) {
      const role = user.user_metadata?.role || 'member'
      if (role !== 'admin') {
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}
