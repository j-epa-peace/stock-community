'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'

export async function signup(formData: FormData) {
  const username = formData.get('id') as string // Use 'id' input for username
  const name = formData.get('name') as string
  const email = formData.get('email') as string || null // Optional
  const password = formData.get('password') as string

  if (!username || !name || !password) {
    return { error: 'ID, 이름, 비밀번호는 필수 입력항목입니다' }
  }

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return { error: '이미 사용 중인 아이디입니다' }
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword
      }
    })

    // Generate token and set cookie
    // Use username in token payload if needed, or stick to userId
    const token = generateToken({ userId: user.id, email: user.email || '' })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Failed to create account' }
  }
}

export async function login(formData: FormData) {
  const username = formData.get('id') as string // Use 'id' input
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: '아이디와 비밀번호를 입력해주세요' }
  }

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { error: '존재하지 않는 아이디입니다' }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { error: '비밀번호가 올바르지 않습니다' }
    }

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email || '' })
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Failed to login' }
  }
}

export async function logout() {
  (await cookies()).delete('auth-token')
  redirect('/')
}