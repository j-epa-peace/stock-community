import MarketIndices from '@/components/MarketIndices'
import MarketMap from '@/components/MarketMap'
import WatchlistSection from '@/components/WatchlistSection'
import TrendingSection from '@/components/TrendingSection'
import NewsSection from '@/components/NewsSection'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-20 md:pt-4 md:pb-8">
      <MarketIndices />
      <MarketMap />
      <TrendingSection />
      <WatchlistSection />
      <NewsSection />
    </div>
  )
}