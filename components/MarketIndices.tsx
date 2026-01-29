'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { marketIndices } from '@/lib/mock-data'

export default function MarketIndices() {
  const [animationProgress, setAnimationProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    // 각 차트의 애니메이션 진행도 초기화
    const initialProgress: Record<string, number> = {}
    marketIndices.forEach(index => {
      initialProgress[index.name] = 0
    })
    setAnimationProgress(initialProgress)

    // 조금 더 천천히 애니메이션 진행 (150ms 간격)
    marketIndices.forEach(index => {
      let currentStep = 0
      const totalSteps = index.data.length
      
      const interval = setInterval(() => {
        currentStep++
        setAnimationProgress(prev => ({
          ...prev,
          [index.name]: currentStep / totalSteps
        }))
        
        if (currentStep >= totalSteps) {
          clearInterval(interval)
        }
      }, 150) // 150ms로 조금 더 천천히
    })
  }, [])

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">시장 지수</h2>
        <span className="text-xs text-gray-400">모든 시간은 한국 시간(KST) 기준</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketIndices.map((index) => {
          // 각 차트별 Y축 범위 계산 (고정)
          const values = index.data.map(d => d.value)
          const minValue = Math.min(...values)
          const maxValue = Math.max(...values)
          const padding = (maxValue - minValue) * 0.1
          const yAxisMin = minValue - padding
          const yAxisMax = maxValue + padding

          // 현재 진행도에 따른 데이터
          const progress = animationProgress[index.name] || 0
          const currentDataLength = Math.floor(progress * index.data.length)
          const currentData = index.data.slice(0, currentDataLength)

          return (
            <div key={index.name} className="border border-gray-600 rounded-lg p-4 bg-gray-750 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">{index.name}</h3>
                  <p className="text-2xl font-bold text-white">
                    {index.value.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    index.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                  </p>
                  <p className={`text-sm ${
                    index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
              
              <div className="h-24 mb-3 relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={index.data}> {/* 전체 데이터로 고정된 축 */}
                    <XAxis 
                      dataKey="time" 
                      hide 
                    />
                    <YAxis 
                      hide 
                      domain={[yAxisMin, yAxisMax]} // 고정된 Y축
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={index.change >= 0 ? '#4ade80' : '#f87171'}
                      strokeWidth={2.5}
                      dot={false}
                      animationDuration={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                {/* 진행 오버레이 - 오른쪽에서 왼쪽으로 마스킹 */}
                <div 
                  className="absolute top-0 right-0 h-full bg-gray-750 transition-all duration-150 ease-linear"
                  style={{ 
                    width: `${(1 - progress) * 100}%`
                  }}
                />
              </div>
              
              {/* 타임라인 표시 */}
              <div className="flex justify-between text-xs text-gray-400">
                {index.name.includes('KOSPI') || index.name.includes('KOSDAQ') ? (
                  <>
                    <span>09:00</span>
                    <span>11:00</span>
                    <span>13:00</span>
                    <span>15:00</span>
                  </>
                ) : (
                  <>
                    <span>23:30</span>
                    <span>01:00</span>
                    <span>02:30</span>
                    <span>04:30</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}