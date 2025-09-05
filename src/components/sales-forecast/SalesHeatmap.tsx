'use client'

import { useState } from 'react'
import { Calendar, TrendingUp, Clock } from 'lucide-react'

interface HeatmapData {
  hour: number
  day: string
  value: number
  sales: number
}

interface SalesHeatmapProps {
  storeName: string
  productName: string
}

export default function SalesHeatmap({ storeName, productName }: SalesHeatmapProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

  // 生成模拟热力图数据
  const generateHeatmapData = (): HeatmapData[] => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const data: HeatmapData[] = []

    days.forEach(day => {
      hours.forEach(hour => {
        let baseSales = 0
        
        // 营业时间内的销售模式
        if (hour >= 7 && hour <= 22) {
          // 早高峰 (7-9)
          if (hour >= 7 && hour <= 9) {
            baseSales = 15 + Math.random() * 10
          }
          // 午高峰 (11-13)
          else if (hour >= 11 && hour <= 13) {
            baseSales = 25 + Math.random() * 15
          }
          // 晚高峰 (17-20)
          else if (hour >= 17 && hour <= 20) {
            baseSales = 30 + Math.random() * 20
          }
          // 其他营业时间
          else {
            baseSales = 8 + Math.random() * 12
          }

          // 周末加成
          if (day === '周六' || day === '周日') {
            baseSales *= 1.3
          }
          
          // 周五晚上加成
          if (day === '周五' && hour >= 18 && hour <= 21) {
            baseSales *= 1.2
          }
        }

        const value = Math.min(Math.max(baseSales / 50, 0), 1) // 归一化到0-1
        
        data.push({
          hour,
          day,
          value,
          sales: Math.round(baseSales * 10) / 10
        })
      })
    })

    return data
  }

  const heatmapData = generateHeatmapData()

  // 获取颜色强度
  const getColorIntensity = (value: number): string => {
    if (value === 0) return 'bg-gray-100'
    if (value <= 0.2) return 'bg-blue-100'
    if (value <= 0.4) return 'bg-blue-200'
    if (value <= 0.6) return 'bg-blue-300'
    if (value <= 0.8) return 'bg-blue-400'
    return 'bg-blue-500'
  }

  // 获取时间段描述
  const getTimeDescription = (hour: number): string => {
    if (hour >= 6 && hour <= 10) return '早高峰'
    if (hour >= 11 && hour <= 14) return '午高峰'
    if (hour >= 17 && hour <= 21) return '晚高峰'
    if (hour >= 22 || hour <= 5) return '夜间'
    return '平峰'
  }

  // 计算统计数据
  const stats = {
    peakHour: heatmapData.reduce((max, current) => 
      current.sales > max.sales ? current : max
    ),
    totalSales: heatmapData.reduce((sum, item) => sum + item.sales, 0),
    avgSales: heatmapData.reduce((sum, item) => sum + item.sales, 0) / heatmapData.length,
    weekendBoost: (() => {
      const weekendSales = heatmapData
        .filter(item => item.day === '周六' || item.day === '周日')
        .reduce((sum, item) => sum + item.sales, 0)
      const weekdaySales = heatmapData
        .filter(item => !['周六', '周日'].includes(item.day))
        .reduce((sum, item) => sum + item.sales, 0)
      return Math.round(((weekendSales / 48) / (weekdaySales / 120) - 1) * 100)
    })()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            销售热力图分析
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {storeName} - {productName} 的时段销售热度分布
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            本月
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">销售高峰</p>
              <p className="text-lg font-bold text-blue-900">
                {stats.peakHour.day} {stats.peakHour.hour}:00
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">峰值销量</p>
              <p className="text-lg font-bold text-green-900">
                {stats.peakHour.sales.toFixed(1)}kg
              </p>
            </div>
            <Clock className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">平均销量</p>
              <p className="text-lg font-bold text-purple-900">
                {stats.avgSales.toFixed(1)}kg/h
              </p>
            </div>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">周末提升</p>
              <p className="text-lg font-bold text-orange-900">
                +{stats.weekendBoost}%
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 热力图 */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* 时间轴标题 */}
          <div className="flex mb-2">
            <div className="w-16"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="w-8 text-xs text-center text-gray-600">
                {i}
              </div>
            ))}
          </div>

          {/* 热力图主体 */}
          <div className="space-y-1">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
              <div key={day} className="flex items-center">
                <div className="w-16 text-sm font-medium text-gray-700 text-right pr-2">
                  {day}
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour)
                    return (
                      <div
                        key={hour}
                        className={`w-8 h-8 rounded ${getColorIntensity(dataPoint?.value || 0)} 
                          border border-gray-200 cursor-pointer transition-all duration-200 
                          hover:scale-110 hover:border-blue-400 relative group`}
                        title={`${day} ${hour}:00 - ${dataPoint?.sales.toFixed(1)}kg`}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            <div>{day} {hour}:00</div>
                            <div>{dataPoint?.sales.toFixed(1)}kg</div>
                            <div className="text-gray-300">{getTimeDescription(hour)}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center mt-4 space-x-4">
            <span className="text-sm text-gray-600">销量强度:</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">低</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-200 border border-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-400 border border-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-blue-500 border border-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">高</span>
            </div>
          </div>
        </div>
      </div>

      {/* 洞察分析 */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">📊 热力图洞察</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-medium text-gray-900 mb-1">销售高峰时段:</p>
            <ul className="space-y-1">
              <li>• 晚高峰 (17:00-20:00) 销量最高</li>
              <li>• 午高峰 (11:00-13:00) 次之</li>
              <li>• 早高峰 (7:00-9:00) 相对较低</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">周期性规律:</p>
            <ul className="space-y-1">
              <li>• 周末销量比工作日高 {stats.weekendBoost}%</li>
              <li>• 周五晚上销量显著增长</li>
              <li>• 周一上午销量相对较低</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
