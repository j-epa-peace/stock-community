import { Flame } from 'lucide-react'

interface HotStockLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function HotStockLogo({ size = 'md', showText = true }: HotStockLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-5 h-5',
      text: 'text-lg',
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-xl',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-3xl',
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className="flex items-center gap-2 group cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all duration-500" />

        {/* Core Flame */}
        <div className="relative animate-float">
          <Flame
            className={`${currentSize.icon} text-orange-500 fill-orange-500 animate-flame filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]`}
            strokeWidth={2.5}
          />
          {/* Inner Spark */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-200 rounded-full blur-[1px] animate-pulse" />
        </div>
      </div>

      {showText && (
        <span className={`${currentSize.text} font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent group-hover:to-pink-500 transition-all duration-300`}>
          HotStock
        </span>
      )}
    </div>
  )
}
