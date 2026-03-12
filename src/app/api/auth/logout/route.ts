import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logout berhasil' })
    
    // Clear the session cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    })
    
    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    })
    
    response.cookies.set('next-auth.csrf-token', '', {
      expires: new Date(0),
      path: '/',
    })
    
    return response
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal logout' },
      { status: 500 }
    )
  }
}
