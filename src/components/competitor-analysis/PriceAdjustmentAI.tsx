'use client'

import { useState } from 'react'
import { X, Brain, TrendingUp, AlertTriangle, CheckCircle, Download, Calculator } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface AdjustRow {
  id: number
  product: string
  region: string
  ourName: string
  ourPricePerKg: number
  adjustTo?: number
  rivalName: string
  rivalPricePerKg: number
  cost: number
}

interface PriceAdjustmentAIProps {
  isOpen: boolean
  onClose: () => void
  data: AdjustRow[]
  selectedLocation: string
}

interface AIRecommendation {
  id: number
  product: string
  region: string
  currentPrice: number
  rivalPrice: number
  cost: number
  suggestedPrice: number
  adjustment: number
  adjustmentPercent: number
  reasoning: string
  riskLevel: 'low' | 'medium' | 'high'
  profitMargin: {
    current: number
    suggested: number
    change: number
  }
  competitiveIndex: number
}

export default function PriceAdjustmentAI({ isOpen, onClose, data, selectedLocation }: PriceAdjustmentAIProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])

  // 生成AI调价建议
  const generateRecommendations = async () => {
    setIsGenerating(true)
    
    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiRecommendations: AIRecommendation[] = data.map((row) => {
      const priceDiff = row.ourPricePerKg - row.rivalPricePerKg
      const priceDiffPercent = (priceDiff / row.rivalPricePerKg) * 100
      
      let suggestedPrice = row.ourPricePerKg
      let reasoning = "当前价格合理，暂不建议调整"
      let riskLevel: 'low' | 'medium' | 'high' = 'low'
      
      // AI调价逻辑
      if (priceDiffPercent > 10) {
        // 价格显著高于竞品
        suggestedPrice = Math.round((row.rivalPricePerKg * 1.05) * 10) / 10  // 比竞品高5%
        reasoning = `当前价格比竞品高${Math.round(priceDiffPercent)}%，建议适度调低以提升竞争力`
        riskLevel = 'high'
      } else if (priceDiffPercent > 5) {
        // 价格略高于竞品
        suggestedPrice = Math.round((row.rivalPricePerKg * 1.02) * 10) / 10  // 比竞品高2%
        reasoning = `价格略高于竞品，建议小幅调整保持竞争优势`
        riskLevel = 'medium'
      } else if (priceDiffPercent < -5) {
        // 价格显著低于竞品，可能有提价空间
        suggestedPrice = Math.round((row.rivalPricePerKg * 0.98) * 10) / 10  // 比竞品低2%
        reasoning = `当前价格偏低，建议适度提价提升利润空间`
        riskLevel = 'medium'
      }
      
      const adjustment = suggestedPrice - row.ourPricePerKg
      const adjustmentPercent = (adjustment / row.ourPricePerKg) * 100
      
      // 计算利润率
      const currentMargin = ((row.ourPricePerKg - row.cost) / row.ourPricePerKg) * 100
      const suggestedMargin = ((suggestedPrice - row.cost) / suggestedPrice) * 100
      const marginChange = suggestedMargin - currentMargin
      
      // 竞争力指数 (0-100，越高越有竞争力)
      const competitiveIndex = Math.min(100, Math.max(0, 100 - Math.abs(priceDiffPercent) * 3))
      
      return {
        id: row.id,
        product: row.product,
        region: row.region,
        currentPrice: row.ourPricePerKg,
        rivalPrice: row.rivalPricePerKg,
        cost: row.cost,
        suggestedPrice,
        adjustment,
        adjustmentPercent,
        reasoning,
        riskLevel,
        profitMargin: {
          current: Math.round(currentMargin * 10) / 10,
          suggested: Math.round(suggestedMargin * 10) / 10,
          change: Math.round(marginChange * 10) / 10
        },
        competitiveIndex: Math.round(competitiveIndex)
      }
    })
    
    setRecommendations(aiRecommendations)
    setIsGenerating(false)
  }

  // 导出建议
  const exportRecommendations = () => {
    if (recommendations.length === 0) return
    
    const csvContent = [
      ['区域', '产品', '当前价格', '竞品价格', '建议价格', '调价幅度', '调价理由', '风险等级', '当前利润率', '建议利润率'].join(','),
      ...recommendations.map(rec => [
        rec.region,
        rec.product,
        rec.currentPrice,
        rec.rivalPrice,
        rec.suggestedPrice,
        `${rec.adjustmentPercent > 0 ? '+' : ''}${rec.adjustmentPercent.toFixed(1)}%`,
        rec.reasoning,
        rec.riskLevel === 'high' ? '高' : rec.riskLevel === 'medium' ? '中' : '低',
        `${rec.profitMargin.current}%`,
        `${rec.profitMargin.suggested}%`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `AI调价建议_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI调价建议</h2>
            {selectedLocation !== '全部' && (
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {selectedLocation}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {recommendations.length > 0 && (
              <button
                onClick={exportRecommendations}
                className="btn-secondary text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                导出建议
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
          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              {!isGenerating ? (
                <div>
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">生成AI调价建议</h3>
                  <p className="text-gray-600 mb-6">
                    基于竞品价格对比和成本分析，生成智能调价建议
                  </p>
                  <button
                    onClick={generateRecommendations}
                    className="btn-primary flex items-center mx-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    开始分析
                  </button>
                </div>
              ) : (
                <div>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI正在分析中...</h3>
                  <p className="text-gray-600">
                    正在分析价格数据和市场竞争情况，请稍候...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* 统计概览 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">分析概览</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
                    <div className="text-sm text-gray-600">分析产品数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {recommendations.filter(r => r.riskLevel === 'high').length}
                    </div>
                    <div className="text-sm text-gray-600">高风险调价</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {recommendations.filter(r => r.riskLevel === 'medium').length}
                    </div>
                    <div className="text-sm text-gray-600">中风险调价</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendations.filter(r => Math.abs(r.adjustmentPercent) < 1).length}
                    </div>
                    <div className="text-sm text-gray-600">价格合理</div>
                  </div>
                </div>
              </div>

              {/* 调价建议列表 */}
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{rec.product}</h4>
                        <p className="text-sm text-gray-600">{rec.region}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">竞争力指数</div>
                        <div className={`text-2xl font-bold ${
                          rec.competitiveIndex >= 80 ? 'text-green-600' :
                          rec.competitiveIndex >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {rec.competitiveIndex}/100
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-sm text-gray-600">当前价格</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(rec.currentPrice)}/kg
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded p-3">
                        <div className="text-sm text-gray-600">竞品价格</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {formatCurrency(rec.rivalPrice)}/kg
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded p-3">
                        <div className="text-sm text-gray-600">建议价格</div>
                        <div className="text-lg font-semibold text-purple-600">
                          {formatCurrency(rec.suggestedPrice)}/kg
                        </div>
                      </div>
                      <div className={`rounded p-3 ${
                        rec.adjustmentPercent > 0 ? 'bg-green-50' : rec.adjustmentPercent < 0 ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        <div className="text-sm text-gray-600">调价幅度</div>
                        <div className={`text-lg font-semibold ${
                          rec.adjustmentPercent > 0 ? 'text-green-600' : rec.adjustmentPercent < 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {rec.adjustmentPercent > 0 ? '+' : ''}{rec.adjustmentPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">当前利润率</div>
                        <div className="text-lg font-medium text-gray-900">
                          {rec.profitMargin.current}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">建议利润率</div>
                        <div className="text-lg font-medium text-purple-600">
                          {rec.profitMargin.suggested}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">利润率变化</div>
                        <div className={`text-lg font-medium ${
                          rec.profitMargin.change > 0 ? 'text-green-600' : rec.profitMargin.change < 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {rec.profitMargin.change > 0 ? '+' : ''}{rec.profitMargin.change}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">AI建议理由</div>
                        <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                          {rec.reasoning}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rec.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          rec.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.riskLevel === 'high' ? (
                            <><AlertTriangle className="w-3 h-3 mr-1" />高风险</>
                          ) : rec.riskLevel === 'medium' ? (
                            <><TrendingUp className="w-3 h-3 mr-1" />中风险</>
                          ) : (
                            <><CheckCircle className="w-3 h-3 mr-1" />低风险</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
