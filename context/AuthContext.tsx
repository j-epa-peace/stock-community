'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { logout as logoutAction } from '@/app/actions/auth'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void> // Added refreshUser
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    refreshUser: async () => { }, // Added refreshUser
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me')
            const data = await res.json()
            if (data.user) {
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const logout = async () => {
        await logoutAction()
        setUser(null)
        window.location.href = '/'
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
