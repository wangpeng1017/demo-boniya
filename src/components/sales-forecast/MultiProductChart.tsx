'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockProducts } from '@/lib/mockData'

interface ForecastData {
  date: string
  actual: number
  predicted: number
  confidence: number
}

interface MultiProductChartProps {
  forecastData: { [productId: string]: ForecastData[] }
  selectedProducts: string[]
  chartColors: string[]
}

export default function MultiProductChart({ forecastData, selectedProducts, chartColors }: MultiProductChartProps) {
  // 合并所有商品的数据到一个数组中
  const mergedData = () => {
    if (selectedProducts.length === 0) return []
    
    // 获取所有日期
    const allDates = new Set<string>()
    Object.values(forecastData).forEach(productData => {
      productData.forEach(item => allDates.add(item.date))
    })
    
    const sortedDates = Array.from(allDates).sort()
    
    // 为每个日期创建数据点
    return sortedDates.map(date => {
      const dataPoint: any = { date }
      
      selectedProducts.forEach(productId => {
        const productData = forecastData[productId] || []
        const dayData = productData.find(item => item.date === date)
        
        if (dayData) {
          dataPoint[`predicted_${productId}`] = dayData.predicted
          dataPoint[`actual_${productId}`] = dayData.actual
        }
      })
      
      return dataPoint
    })
  }

  const chartData = mergedData()

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('zh-CN')}
          </p>
          {payload.map((entry: any, index: number) => {
            const productId = entry.dataKey.split('_')[1]
            const product = mockProducts.find(p => p.id === productId)
            const type = entry.dataKey.includes('predicted') ? '预测' : '历史'
            
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {product?.name} ({type}): {entry.value?.toFixed(2)} 千克
              </p>
            )
          })}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <Tooltip content={customTooltip} />
        <Legend 
          formatter={(value: string) => {
            const productId = value.split('_')[1]
            const product = mockProducts.find(p => p.id === productId)
            const type = value.includes('predicted') ? '预测' : '历史'
            return `${product?.name} (${type})`
          }}
        />
        
        {/* 为每个商品生成线条 */}
        {selectedProducts.map((productId, index) => {
          const color = chartColors[index % chartColors.length]
          
          return (
            <g key={productId}>
              {/* 预测线 - 虚线 */}
              <Line
                type="monotone"
                dataKey={`predicted_${productId}`}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
              {/* 历史线 - 实线 */}
              <Line
                type="monotone"
                dataKey={`actual_${productId}`}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </g>
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}
