'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Calendar, Filter } from 'lucide-react'
import { CompetitorPrice } from '@/types'

interface PriceTrendData {
  date: string
  ourPrice: number
  competitorAvg: number
  competitor1: number
  competitor2: number
  competitor3: number
  marketShare: number
}

interface PriceTrendChartProps {
  selectedProduct: string
  selectedLocation: string
  competitorData: CompetitorPrice[]
}

export default function PriceTrendChart({ selectedProduct, selectedLocation, competitorData }: PriceTrendChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [showMarketShare, setShowMarketShare] = useState(false)

  // 生成模拟价格趋势数据
  const generateTrendData = (): PriceTrendData[] => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data: PriceTrendData[] = []
    
    // 基础价格
    const baseOurPrice = 25.0
    const baseCompetitor1 = 23.5
    const baseCompetitor2 = 24.2
    const baseCompetitor3 = 22.8
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // 添加一些随机波动和趋势
      const trendFactor = (days - i) / days * 0.1 // 轻微上升趋势
      const randomFactor = (Math.random() - 0.5) * 0.05 // ±2.5% 随机波动
      
      const ourPrice = baseOurPrice * (1 + trendFactor + randomFactor)
      const competitor1 = baseCompetitor1 * (1 + trendFactor * 0.8 + randomFactor * 0.8)
      const competitor2 = baseCompetitor2 * (1 + trendFactor * 1.2 + randomFactor * 0.6)
      const competitor3 = baseCompetitor3 * (1 + trendFactor * 0.6 + randomFactor * 1.2)
      
      const competitorAvg = (competitor1 + competitor2 + competitor3) / 3
      
      // 模拟市场份额（价格越低，份额可能越高）
      const priceRank = [ourPrice, competitor1, competitor2, competitor3]
        .sort((a, b) => a - b)
        .indexOf(ourPrice) + 1
      const marketShare = Math.max(15, 40 - (priceRank - 1) * 8 + Math.random() * 10)
      
      data.push({
        date: date.toISOString().split('T')[0],
        ourPrice: Math.round(ourPrice * 100) / 100,
        competitorAvg: Math.round(competitorAvg * 100) / 100,
        competitor1: Math.round(competitor1 * 100) / 100,
        competitor2: Math.round(competitor2 * 100) / 100,
        competitor3: Math.round(competitor3 * 100) / 100,
        marketShare: Math.round(marketShare * 10) / 10
      })
    }
    
    return data
  }

  const trendData = generateTrendData()

  // 计算价格变化趋势
  const calculateTrend = (data: PriceTrendData[], key: keyof PriceTrendData) => {
    if (data.length < 2) return { trend: 'stable', change: 0 }
    
    const firstValue = data[0][key] as number
    const lastValue = data[data.length - 1][key] as number
    const change = ((lastValue - firstValue) / firstValue) * 100
    
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (Math.abs(change) > 1) {
      trend = change > 0 ? 'up' : 'down'
    }
    
    return { trend, change: Math.round(change * 100) / 100 }
  }

  const ourPriceTrend = calculateTrend(trendData, 'ourPrice')
  const competitorTrend = calculateTrend(trendData, 'competitorAvg')
  const marketShareTrend = calculateTrend(trendData, 'marketShare')

  // 自定义Tooltip
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('zh-CN')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('份额') ? `${entry.value}%` : `¥${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  // 获取趋势颜色
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            价格趋势分析
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectedProduct} - {selectedLocation} 的价格变化趋势
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showMarketShare}
                onChange={(e) => setShowMarketShare(e.target.checked)}
                className="mr-2"
              />
              显示市场份额
            </label>
          </div>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 趋势统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">我方价格趋势</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(ourPriceTrend.trend)}
                <span className={`ml-1 font-bold ${getTrendColor(ourPriceTrend.trend)}`}>
                  {ourPriceTrend.change > 0 ? '+' : ''}{ourPriceTrend.change}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-900">
                ¥{trendData[trendData.length - 1]?.ourPrice.toFixed(2)}
              </p>
              <p className="text-xs text-blue-600">当前价格</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">竞品均价趋势</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(competitorTrend.trend)}
                <span className={`ml-1 font-bold ${getTrendColor(competitorTrend.trend)}`}>
                  {competitorTrend.change > 0 ? '+' : ''}{competitorTrend.change}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-900">
                ¥{trendData[trendData.length - 1]?.competitorAvg.toFixed(2)}
              </p>
              <p className="text-xs text-orange-600">竞品均价</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">市场份额趋势</p>
              <div className="flex items-center mt-1">
                {getTrendIcon(marketShareTrend.trend)}
                <span className={`ml-1 font-bold ${getTrendColor(marketShareTrend.trend)}`}>
                  {marketShareTrend.change > 0 ? '+' : ''}{marketShareTrend.change}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-900">
                {trendData[trendData.length - 1]?.marketShare.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">当前份额</p>
            </div>
          </div>
        </div>
      </div>

      {/* 价格趋势图表 */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          {showMarketShare ? (
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              />
              <YAxis yAxisId="price" orientation="left" />
              <YAxis yAxisId="share" orientation="right" />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="ourPrice" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="我方价格"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="competitorAvg" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="竞品均价"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              />
              <Line 
                yAxisId="share"
                type="monotone" 
                dataKey="marketShare" 
                stroke="#10b981" 
                strokeWidth={2}
                name="市场份额"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompetitor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip content={customTooltip} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="ourPrice" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorOur)"
                strokeWidth={3}
                name="我方价格"
              />
              <Area 
                type="monotone" 
                dataKey="competitorAvg" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorCompetitor)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="竞品均价"
              />
              <Line 
                type="monotone" 
                dataKey="competitor1" 
                stroke="#ef4444" 
                strokeWidth={1}
                strokeDasharray="2 2"
                name="竞品A"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="competitor2" 
                stroke="#8b5cf6" 
                strokeWidth={1}
                strokeDasharray="2 2"
                name="竞品B"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="competitor3" 
                stroke="#06b6d4" 
                strokeWidth={1}
                strokeDasharray="2 2"
                name="竞品C"
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 趋势洞察 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          趋势洞察
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-900 mb-2">价格竞争态势:</p>
            <ul className="space-y-1">
              <li>• 我方价格{ourPriceTrend.trend === 'up' ? '上升' : ourPriceTrend.trend === 'down' ? '下降' : '稳定'}趋势，变化幅度{Math.abs(ourPriceTrend.change)}%</li>
              <li>• 竞品均价{competitorTrend.trend === 'up' ? '上升' : competitorTrend.trend === 'down' ? '下降' : '稳定'}，市场整体价格{competitorTrend.change > 0 ? '上涨' : competitorTrend.change < 0 ? '下跌' : '平稳'}</li>
              <li>• 价格差距{Math.abs(trendData[trendData.length - 1]?.ourPrice - trendData[trendData.length - 1]?.competitorAvg).toFixed(2)}元</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">市场表现:</p>
            <ul className="space-y-1">
              <li>• 当前市场份额{trendData[trendData.length - 1]?.marketShare.toFixed(1)}%</li>
              <li>• 份额变化趋势{marketShareTrend.change > 0 ? '向好' : marketShareTrend.change < 0 ? '下滑' : '稳定'}</li>
              <li>• 价格策略{ourPriceTrend.change > competitorTrend.change ? '相对激进' : '相对保守'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
