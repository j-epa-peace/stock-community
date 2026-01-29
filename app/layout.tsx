import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '주식 커뮤니티 MVP',
  description: '관심 종목을 추적하고 시장 동향을 확인하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-950">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}