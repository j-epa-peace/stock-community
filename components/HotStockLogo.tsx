import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'

interface HotStockLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  animated?: boolean
}

export default function HotStockLogo({ size = 'md', showText = true, animated = true }: HotStockLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 20,
      container: 'w-5 h-5',
      text: 'text-lg',
    },
    md: {
      icon: 24,
      container: 'w-6 h-6',
      text: 'text-xl',
    },
    lg: {
      icon: 40,
      container: 'w-10 h-10',
      text: 'text-3xl',
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className="flex items-center gap-2 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        {/* Outer Glow - Pulsing */}
        <motion.div
          animate={animated ? {
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-orange-500/40 rounded-full blur-xl"
        />

        {/* Core Flame */}
        <div className="relative z-10">
          <motion.div
            animate={animated ? {
              scale: [1, 1.1, 0.95, 1.05, 1],
              rotate: [0, 2, -2, 1, 0],
              filter: [
                'brightness(1)',
                'brightness(1.2)',
                'brightness(1.1)',
                'brightness(1)'
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
            className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
          >
            <Flame
              size={currentSize.icon}
              fill="currentColor"
              strokeWidth={2.5}
            />
          </motion.div>

          {/* Inner Core Spark - Intense heat center */}
          <motion.div
            animate={animated ? {
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px]"
          />
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
