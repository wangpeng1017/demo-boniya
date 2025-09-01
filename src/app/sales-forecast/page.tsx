'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Calendar, Store, Package, Download, Sparkles, List } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { mockStores, mockProducts, generateMockSalesData } from '@/lib/mockData'
import { formatCurrency, formatNumber, delay } from '@/lib/utils'
import ForecastListView from '@/components/sales-forecast/ForecastListView'
import MultiProductChart from '@/components/sales-forecast/MultiProductChart'

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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([mockProducts[0].id])
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '2025-09-01', end: '2025-09-07' })
  const [forecastData, setForecastData] = useState<{ [productId: string]: ForecastData[] }>({})
  const [aiReport, setAiReport] = useState<AIReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // 商品筛选相关函数
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  )

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAllProducts = () => {
    setSelectedProducts(filteredProducts.map(p => p.id))
  }

  const handleClearAllProducts = () => {
    setSelectedProducts([])
  }

  const toggleProductSelector = () => {
    setIsProductSelectorOpen(!isProductSelectorOpen)
  }

  const closeProductSelector = () => {
    setIsProductSelectorOpen(false)
  }

  // 获取已选择商品的摘要信息
  const getSelectedProductsSummary = () => {
    if (selectedProducts.length === 0) {
      return '请选择商品'
    }
    if (selectedProducts.length === 1) {
      const product = mockProducts.find(p => p.id === selectedProducts[0])
      return product?.name || '未知商品'
    }
    return `已选择 ${selectedProducts.length} 个商品`
  }

  // 图表颜色配置
  const chartColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
  ]

  // 模拟预测数据生成
  const generateForecastData = async () => {
    if (selectedProducts.length === 0) {
      setForecastData({})
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    await delay(1500) // 模拟API调用延迟

    const allData: { [productId: string]: ForecastData[] } = {}
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    // 为每个选中的商品生成数据
    selectedProducts.forEach(productId => {
      const product = mockProducts.find(p => p.id === productId)
      if (!product) return

      const data: ForecastData[] = []

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

        // 基础销量根据商品类别调整
        const categoryMultiplier = product.category === '烤肠类' ? 1.2 : 0.8
        const baseQuantity = (20 + Math.random() * 30) * categoryMultiplier
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

      allData[productId] = data
    })

    console.log('Generated forecast data:', allData)
    setForecastData(allData)
    setIsLoading(false)
  }

  // 模拟AI报告生成
  const generateAIReport = async () => {
    if (selectedProducts.length === 0) return

    setIsGeneratingReport(true)
    await delay(2000) // 模拟Gemini API调用延迟

    const selectedProductNames = selectedProducts.map(id =>
      mockProducts.find(p => p.id === id)?.name || ''
    ).filter(name => name)

    const selectedStoreName = mockStores.find(s => s.id === selectedStore)?.name || ''

    let report: AIReport

    if (selectedProducts.length === 1) {
      // 单商品分析
      const productName = selectedProductNames[0]
      const productData = Object.values(forecastData)[0] || []
      const totalPredicted = productData.reduce((sum, item) => sum + item.predicted, 0)

      report = {
        summary: `基于历史销售数据和外部因素分析，${productName}在${selectedStoreName}的本周预测销量呈现稳中有升的趋势。周末销量预计较工作日增长40%左右，整体预测准确率达到94.2%。`,
        keyInsights: [
          '周六、周日销量显著高于工作日，建议增加周末备货',
          '该产品受天气影响较小，销量相对稳定',
          '与去年同期相比，销量增长12.5%，显示良好的市场表现',
          '客户复购率较高，品牌忠诚度良好'
        ],
        recommendations: [
          `建议本周总备货量：${Math.round(totalPredicted)}千克`,
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
    } else {
      // 多商品分析
      const totalPredicted = Object.values(forecastData).reduce((sum, productData) =>
        sum + productData.reduce((pSum, item) => pSum + item.predicted, 0), 0
      )

      const categories = Array.from(new Set(selectedProducts.map(id =>
        mockProducts.find(p => p.id === id)?.category || ''
      ))).filter(cat => cat)

      report = {
        summary: `基于多商品组合分析，${selectedProductNames.join('、')}等${selectedProducts.length}个商品在${selectedStoreName}的本周预测总销量为${Math.round(totalPredicted)}千克。商品间存在良好的互补效应，建议采用组合销售策略。`,
        keyInsights: [
          `选中的${selectedProducts.length}个商品覆盖${categories.length}个品类，产品组合多样化`,
          '烤肠类商品销量普遍高于酱卤类，建议重点推广',
          '商品间存在交叉销售机会，客户购买其中一种时倾向于购买其他商品',
          '周末所有商品销量均有显著提升，呈现一致的消费模式'
        ],
        recommendations: [
          `建议本周总备货量：${Math.round(totalPredicted * 1.1)}千克（含10%安全库存）`,
          '实施商品组合促销，提高客单价和销量',
          '优化商品陈列，将互补商品放置在相邻位置',
          '建立商品销量预警机制，及时调整各商品库存比例'
        ],
        riskFactors: [
          '多商品管理复杂度增加，需要精细化库存控制',
          '某个商品缺货可能影响整体组合销售效果',
          '不同商品的保质期差异需要特别关注',
          '竞品促销对不同商品的影响程度可能不同'
        ]
      }
    }

    setAiReport(report)
    setIsGeneratingReport(false)
  }

  useEffect(() => {
    generateForecastData()
  }, [selectedStore, selectedProducts, dateRange])

  // 点击外部关闭商品选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isProductSelectorOpen && !target.closest('.product-selector')) {
        setIsProductSelectorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProductSelectorOpen])

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
          
          <div className="relative product-selector">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              选择商品
            </label>

            {/* 商品选择器触发器 */}
            <div
              onClick={toggleProductSelector}
              className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500"
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm ${selectedProducts.length === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
                  {getSelectedProductsSummary()}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isProductSelectorOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 下拉面板 */}
            {isProductSelectorOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {/* 搜索框 */}
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="搜索商品名称..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* 批量操作按钮 */}
                <div className="flex gap-2 p-3 border-b border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectAllProducts()
                    }}
                    className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100"
                  >
                    全选
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClearAllProducts()
                    }}
                    className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    清除
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeProductSelector()
                    }}
                    className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 ml-auto"
                  >
                    完成
                  </button>
                </div>

                {/* 商品复选框列表 */}
                <div className="max-h-48 overflow-y-auto p-2">
                  {filteredProducts.map(product => (
                    <label
                      key={product.id}
                      className="flex items-center space-x-2 text-sm hover:bg-gray-50 p-2 rounded cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="flex-1">{product.name}</span>
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </label>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      未找到匹配的商品
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 性能提醒 */}
            {selectedProducts.length > 5 && (
              <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                ⚠️ 选择商品较多，图表加载可能较慢
              </div>
            )}
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
          <h3 className="text-lg font-semibold text-gray-900">
            销量预测趋势
            {selectedProducts.length > 1 && (
              <span className="text-sm text-gray-500 ml-2">（{selectedProducts.length}个商品对比）</span>
            )}
          </h3>
        </div>

        {selectedProducts.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>请选择至少一个商品查看预测趋势</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">正在生成预测数据...</span>
          </div>
        ) : (
          <MultiProductChart
            forecastData={forecastData}
            selectedProducts={selectedProducts}
            chartColors={chartColors}
          />
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
