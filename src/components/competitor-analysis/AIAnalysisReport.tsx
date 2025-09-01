'use client'

import { useState } from 'react'
import { X, Download, FileText, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'
import { CompetitorPrice } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface AIAnalysisReportProps {
  isOpen: boolean
  onClose: () => void
  data: CompetitorPrice[]
  selectedLocation: string
  selectedBrand: string
}

interface AnalysisResult {
  summary: {
    totalProducts: number
    avgCompetitorPrice: number
    avgOurPrice: number
    priceAdvantageCount: number
    priceDisadvantageCount: number
  }
  priceComparison: {
    brand: string
    avgPrice: number
    priceGap: number
    percentage: number
    advantage: 'higher' | 'lower' | 'similar'
  }[]
  marketPosition: {
    position: 'premium' | 'mid-range' | 'budget'
    description: string
    competitiveness: number
  }
  recommendations: {
    category: 'pricing' | 'positioning' | 'strategy'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }[]
}

export default function AIAnalysisReport({ isOpen, onClose, data, selectedLocation, selectedBrand }: AIAnalysisReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  // 生成AI分析报告
  const generateAnalysis = async () => {
    setIsGenerating(true)
    
    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟分析结果
    const filteredData = data.filter(item => {
      const locationMatch = selectedLocation === '全部' || item.location === selectedLocation
      const brandMatch = selectedBrand === '全部' || item.brand === selectedBrand
      return locationMatch && brandMatch
    })

    // 计算价格对比数据
    const ourPrices: { [key: string]: number } = {
      '火腿': 19.9,
      '烤肠': 7.9,
      '香肠': 8.5
    }

    const brandAnalysis = new Map<string, { prices: number[], count: number }>()
    
    filteredData.forEach(item => {
      if (!brandAnalysis.has(item.brand)) {
        brandAnalysis.set(item.brand, { prices: [], count: 0 })
      }
      brandAnalysis.get(item.brand)!.prices.push(item.price)
      brandAnalysis.get(item.brand)!.count++
    })

    const avgCompetitorPrice = filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length
    const avgOurPrice = Object.values(ourPrices).reduce((sum, price) => sum + price, 0) / Object.values(ourPrices).length

    const priceComparison = Array.from(brandAnalysis.entries()).map(([brand, data]) => {
      const avgPrice = data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length
      const priceGap = avgPrice - avgOurPrice
      const percentage = (priceGap / avgOurPrice) * 100
      
      return {
        brand,
        avgPrice,
        priceGap,
        percentage,
        advantage: Math.abs(percentage) < 5 ? 'similar' as const : 
                  percentage > 0 ? 'higher' as const : 'lower' as const
      }
    })

    const priceAdvantageCount = filteredData.filter(item => item.price > avgOurPrice).length
    const priceDisadvantageCount = filteredData.filter(item => item.price < avgOurPrice).length

    // 确定市场定位
    let position: 'premium' | 'mid-range' | 'budget' = 'mid-range'
    let competitiveness = 75
    
    if (avgOurPrice > avgCompetitorPrice * 1.2) {
      position = 'premium'
      competitiveness = 65
    } else if (avgOurPrice < avgCompetitorPrice * 0.8) {
      position = 'budget'
      competitiveness = 85
    }

    const result: AnalysisResult = {
      summary: {
        totalProducts: filteredData.length,
        avgCompetitorPrice,
        avgOurPrice,
        priceAdvantageCount,
        priceDisadvantageCount
      },
      priceComparison,
      marketPosition: {
        position,
        description: position === 'premium' ? '高端定位，注重品质和品牌价值' :
                    position === 'budget' ? '性价比定位，价格优势明显' :
                    '中端定位，平衡价格与品质',
        competitiveness
      },
      recommendations: [
        {
          category: 'pricing',
          title: '价格策略优化',
          description: position === 'premium' ? 
            '建议强化产品差异化，突出品质优势，维持价格竞争力' :
            '建议适度调整价格，提升市场竞争力',
          priority: 'high'
        },
        {
          category: 'positioning',
          title: '市场定位调整',
          description: `当前${position === 'premium' ? '高端' : position === 'budget' ? '低端' : '中端'}定位，建议${
            competitiveness < 70 ? '重新评估定位策略' : '保持当前定位并优化'
          }`,
          priority: competitiveness < 70 ? 'high' : 'medium'
        },
        {
          category: 'strategy',
          title: '竞争策略建议',
          description: '建议加强产品创新，提升品牌影响力，建立差异化竞争优势',
          priority: 'medium'
        }
      ]
    }

    setAnalysisResult(result)
    setIsGenerating(false)
  }

  // 导出报告
  const exportReport = () => {
    if (!analysisResult) return

    const reportContent = `
竞品价格分析报告
生成时间: ${new Date().toLocaleString()}
分析范围: ${selectedLocation === '全部' ? '全部地区' : selectedLocation} - ${selectedBrand === '全部' ? '全部品牌' : selectedBrand}

一、数据概览
- 分析产品数量: ${analysisResult.summary.totalProducts}
- 竞品平均价格: ${formatCurrency(analysisResult.summary.avgCompetitorPrice)}
- 本品平均价格: ${formatCurrency(analysisResult.summary.avgOurPrice)}
- 价格优势产品: ${analysisResult.summary.priceAdvantageCount}个
- 价格劣势产品: ${analysisResult.summary.priceDisadvantageCount}个

二、品牌价格对比
${analysisResult.priceComparison.map(item => 
  `- ${item.brand}: 平均价格${formatCurrency(item.avgPrice)}, 价格差异${item.percentage > 0 ? '+' : ''}${item.percentage.toFixed(1)}%`
).join('\n')}

三、市场定位分析
- 定位类型: ${analysisResult.marketPosition.position === 'premium' ? '高端' : 
              analysisResult.marketPosition.position === 'budget' ? '低端' : '中端'}
- 竞争力评分: ${analysisResult.marketPosition.competitiveness}/100
- 定位描述: ${analysisResult.marketPosition.description}

四、策略建议
${analysisResult.recommendations.map((rec, index) => 
  `${index + 1}. ${rec.title} (${rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}优先级)\n   ${rec.description}`
).join('\n\n')}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `AI分析报告_${new Date().toISOString().split('T')[0]}.txt`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI分析报告</h2>
          </div>
          <div className="flex items-center space-x-2">
            {analysisResult && (
              <button
                onClick={exportReport}
                className="btn-secondary text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                导出报告
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!analysisResult ? (
            <div className="text-center py-12">
              {!isGenerating ? (
                <div>
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">生成AI分析报告</h3>
                  <p className="text-gray-600 mb-6">
                    基于当前筛选的价格数据，生成智能分析报告
                  </p>
                  <button
                    onClick={generateAnalysis}
                    className="btn-primary flex items-center mx-auto"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    开始分析
                  </button>
                </div>
              ) : (
                <div>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI正在分析中...</h3>
                  <p className="text-gray-600">
                    正在分析价格数据，生成智能报告，请稍候...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 数据概览 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  数据概览
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysisResult.summary.totalProducts}</div>
                    <div className="text-sm text-gray-600">分析产品数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(analysisResult.summary.avgCompetitorPrice)}
                    </div>
                    <div className="text-sm text-gray-600">竞品均价</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(analysisResult.summary.avgOurPrice)}
                    </div>
                    <div className="text-sm text-gray-600">本品均价</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{analysisResult.summary.priceAdvantageCount}</div>
                    <div className="text-sm text-gray-600">价格优势</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analysisResult.summary.priceDisadvantageCount}</div>
                    <div className="text-sm text-gray-600">价格劣势</div>
                  </div>
                </div>
              </div>

              {/* 品牌价格对比 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌价格对比</h3>
                <div className="space-y-3">
                  {analysisResult.priceComparison.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{item.brand}</span>
                        <span className="ml-2 text-sm text-gray-600">
                          平均价格: {formatCurrency(item.avgPrice)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.advantage === 'higher' ? 'bg-red-100 text-red-800' :
                          item.advantage === 'lower' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.advantage === 'higher' ? '↑' : item.advantage === 'lower' ? '↓' : '≈'} 
                          {Math.abs(item.percentage).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 市场定位分析 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">市场定位分析</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-600">当前定位:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        analysisResult.marketPosition.position === 'premium' ? 'bg-purple-100 text-purple-800' :
                        analysisResult.marketPosition.position === 'budget' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {analysisResult.marketPosition.position === 'premium' ? '高端定位' :
                         analysisResult.marketPosition.position === 'budget' ? '性价比定位' : '中端定位'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">竞争力评分</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {analysisResult.marketPosition.competitiveness}/100
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{analysisResult.marketPosition.description}</p>
                </div>
              </div>

              {/* 策略建议 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">策略建议</h3>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {rec.priority === 'high' ? (
                              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                            ) : rec.priority === 'medium' ? (
                              <CheckCircle className="w-4 h-4 text-yellow-500 mr-2" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            )}
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                          </div>
                          <p className="text-gray-700 text-sm">{rec.description}</p>
                        </div>
                        <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority === 'high' ? '高优先级' : 
                           rec.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
