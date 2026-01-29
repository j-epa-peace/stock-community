'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'

export async function signup(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: '이미 가입된 이메일 주소입니다' }
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email })
    cookies().set('auth-token', token, {
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
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { error: 'Invalid email or password' }
    }

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email })
    cookies().set('auth-token', token, {
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
  cookies().delete('auth-token')
  redirect('/')
}