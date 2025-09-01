'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Calendar, Store, Package, Download, Sparkles, List } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { mockStores, mockProducts, generateMockSalesData } from '@/lib/mockData'
import { formatCurrency, formatNumber, delay } from '@/lib/utils'
import ForecastListView from '@/components/sales-forecast/ForecastListView'

interface ForecastData {
  date: string
  actual: number
  predicted: number
  confidence: number
}

interface AIReport {
  summary: string
  keyInsights: string[]
  recommendations: string[]
  riskFactors: string[]
}

export default function SalesForecastPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'list'>('analysis')
  const [selectedStore, setSelectedStore] = useState(mockStores[0].id)
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0].id)
  const [dateRange, setDateRange] = useState({ start: '2025-09-01', end: '2025-09-07' })
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [aiReport, setAiReport] = useState<AIReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // 模拟预测数据生成
  const generateForecastData = async () => {
    setIsLoading(true)
    await delay(1500) // 模拟API调用延迟
    
    const data: ForecastData[] = []
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // 基础销量 + 周末加成
      const baseQuantity = 20 + Math.random() * 30
      const weekendMultiplier = isWeekend ? 1.4 : 1
      const actual = Math.round(baseQuantity * weekendMultiplier * 100) / 100
      const predicted = Math.round((actual + (Math.random() - 0.5) * 5) * 100) / 100
      const confidence = 0.85 + Math.random() * 0.1
      
      data.push({
        date: d.toISOString().split('T')[0],
        actual: actual,
        predicted: predicted,
        confidence: Math.round(confidence * 100) / 100
      })
    }
    
    setForecastData(data)
    setIsLoading(false)
  }

  // 模拟AI报告生成
  const generateAIReport = async () => {
    setIsGeneratingReport(true)
    await delay(2000) // 模拟Gemini API调用延迟
    
    const selectedProductName = mockProducts.find(p => p.id === selectedProduct)?.name || ''
    const selectedStoreName = mockStores.find(s => s.id === selectedStore)?.name || ''
    
    const report: AIReport = {
      summary: `基于历史销售数据和外部因素分析，${selectedProductName}在${selectedStoreName}的本周预测销量呈现稳中有升的趋势。周末销量预计较工作日增长40%左右，整体预测准确率达到94.2%。`,
      keyInsights: [
        '周六、周日销量显著高于工作日，建议增加周末备货',
        '该产品受天气影响较小，销量相对稳定',
        '与去年同期相比，销量增长12.5%，显示良好的市场表现',
        '客户复购率较高，品牌忠诚度良好'
      ],
      recommendations: [
        `建议本周总备货量：${Math.round(forecastData.reduce((sum, item) => sum + item.predicted, 0))}千克`,
        '重点关注周五下午和周六上午的补货时机',
        '可考虑在周末推出小幅促销活动以进一步提升销量',
        '建议与供应商协调，确保周末前货源充足'
      ],
      riskFactors: [
        '如遇恶劣天气，销量可能下降15-20%',
        '附近竞争对手促销活动可能影响销量',
        '节假日前后消费习惯变化需要关注',
        '原材料价格波动可能影响成本控制'
      ]
    }
    
    setAiReport(report)
    setIsGeneratingReport(false)
  }

  useEffect(() => {
    generateForecastData()
  }, [selectedStore, selectedProduct, dateRange])

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-primary-600" />
            门店销售数量预测
          </h1>
          <p className="text-gray-600 mt-1">基于AI算法的精准销量预测与智能分析</p>
        </div>
        {activeTab === 'analysis' && (
          <button
            onClick={generateAIReport}
            disabled={isGeneratingReport}
            className="btn-primary flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGeneratingReport ? '生成中...' : '生成AI分析报告'}
          </button>
        )}
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              趋势分析
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              预测列表
            </button>
          </nav>
        </div>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'analysis' && (
        <>
          {/* 筛选器 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">预测参数设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Store className="w-4 h-4 inline mr-1" />
              选择门店
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {mockStores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              选择商品
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {mockProducts.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              开始日期
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* 预测图表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">销量预测趋势</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>预测销量</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>历史销量</span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">正在生成预测数据...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('zh-CN')}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)} 千克`,
                  name === 'predicted' ? '预测销量' : '历史销量'
                ]}
              />
              <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} name="predicted" />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="actual" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI分析报告 */}
      {aiReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI智能分析报告</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 预测摘要</h4>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-md">{aiReport.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">💡 关键洞察</h4>
              <ul className="space-y-2">
                {aiReport.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 行动建议</h4>
              <ul className="space-y-2">
                {aiReport.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-4 h-4 bg-primary-600 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⚠️ 风险提示</h4>
              <ul className="space-y-2">
                {aiReport.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {isGeneratingReport && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">AI正在分析数据并生成报告...</span>
          </div>
        </div>
      )}
        </>
      )}

      {/* 预测列表视图 */}
      {activeTab === 'list' && (
        <ForecastListView />
      )}
    </div>
  )
}
