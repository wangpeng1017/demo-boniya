'use client'

import { useState, useEffect } from 'react'
import { X, Brain, Tag, Key, Search, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { CustomerFeedback } from '@/types'
import { GeminiSimulator } from '@/lib/aiSimulation'

interface AIInsightModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: CustomerFeedback | null
  feedbackList?: CustomerFeedback[] // 用于批量分析
}

interface AIInsightResult {
  intelligentCategorization: {
    primaryCategory: string
    secondaryCategories: string[]
    confidence: number
  }
  keywordExtraction: {
    keywords: string[]
    phrases: string[]
    emotions: string[]
  }
  deepAnalysis: {
    rootCause: string
    impactAssessment: string
    recommendedActions: string[]
    similarCases: number
    urgencyReason: string
  }
}

interface BatchInsightResult {
  overallSentiment: {
    positive: number
    neutral: number
    negative: number
    totalCount: number
  }
  issueStatistics: {
    category: string
    count: number
    percentage: number
    trend: 'increasing' | 'stable' | 'decreasing'
  }[]
  urgentIssues: {
    summary: string
    count: number
    topIssues: string[]
    affectedPlatforms: string[]
  }
  trendAnalysis: {
    weeklyTrend: string
    platformComparison: {
      platform: string
      negativeRate: number
      mainIssues: string[]
    }[]
    recommendations: string[]
  }
  keyInsights: string[]
}

interface BatchInsightResult {
  overallSentiment: {
    positive: number
    neutral: number
    negative: number
    totalCount: number
  }
  issueStatistics: {
    category: string
    count: number
    percentage: number
    trend: 'increasing' | 'stable' | 'decreasing'
  }[]
  urgentIssues: {
    summary: string
    count: number
    topIssues: string[]
    affectedPlatforms: string[]
  }
  trendAnalysis: {
    weeklyTrend: string
    platformComparison: {
      platform: string
      negativeRate: number
      mainIssues: string[]
    }[]
    recommendations: string[]
  }
  keyInsights: string[]
}

export default function AIInsightModal({ isOpen, onClose, feedback, feedbackList }: AIInsightModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIInsightResult | null>(null)
  const [batchAnalysisResult, setBatchAnalysisResult] = useState<BatchInsightResult | null>(null)

  // 判断是否为批量分析模式
  const isBatchMode = feedback === null && feedbackList && feedbackList.length > 0

  // 当模态框打开时，根据模式开始分析
  useEffect(() => {
    if (isOpen && !isAnalyzing) {
      if (isBatchMode && !batchAnalysisResult) {
        performBatchAnalysis()
      } else if (feedback && !analysisResult) {
        performAIAnalysis()
      }
    }
  }, [isOpen, feedback, feedbackList])

  // 执行单个反馈AI分析
  const performAIAnalysis = async () => {
    if (!feedback) return

    setIsAnalyzing(true)
    try {
      const result = await GeminiSimulator.generateAIInsights(feedback)
      setAnalysisResult(result)
    } catch (error) {
      console.error('AI分析失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 执行批量分析
  const performBatchAnalysis = async () => {
    if (!feedbackList || feedbackList.length === 0) return

    setIsAnalyzing(true)
    try {
      const result = await GeminiSimulator.generateBatchInsights(feedbackList)
      setBatchAnalysisResult(result)
    } catch (error) {
      console.error('批量AI分析失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 关闭模态框
  const handleClose = () => {
    setAnalysisResult(null)
    setBatchAnalysisResult(null)
    onClose()
  }

  // 获取紧急程度颜色
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // 获取情感颜色
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      case 'neutral': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isBatchMode ? 'AI批量洞察分析' : 'AI洞察分析'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 反馈信息概览 */}
          {feedback && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-3">反馈信息概览</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">反馈ID:</span>
                  <span className="text-sm font-medium text-gray-900">{feedback.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">平台:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {feedback.platform}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">情感:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment === 'positive' ? '正面' : feedback.sentiment === 'negative' ? '负面' : '中性'}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <span className="text-sm text-gray-600 mr-2">紧急程度:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(feedback.urgency)}`}>
                  {feedback.urgency === 'high' ? '高' : feedback.urgency === 'medium' ? '中' : '低'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">原始评论:</span>
                <p className="text-sm text-gray-900 mt-1 p-3 bg-white rounded border">{feedback.originalComment}</p>
              </div>
            </div>
          )}

          {/* 分析结果 */}
          <div className="p-6">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                <span className="text-gray-600">
                  {isBatchMode ? 'AI正在批量分析中...' : 'AI正在深度分析中...'}
                </span>
              </div>
            ) : batchAnalysisResult ? (
              <div className="space-y-6">
                {/* 批量分析结果 */}
                {/* 整体情感分布 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">整体情感分布</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{batchAnalysisResult.overallSentiment.totalCount}</div>
                      <div className="text-sm text-gray-600">总反馈数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{batchAnalysisResult.overallSentiment.positive}</div>
                      <div className="text-sm text-gray-600">正面反馈</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{batchAnalysisResult.overallSentiment.negative}</div>
                      <div className="text-sm text-gray-600">负面反馈</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{batchAnalysisResult.overallSentiment.neutral}</div>
                      <div className="text-sm text-gray-600">中性反馈</div>
                    </div>
                  </div>
                </div>

                {/* 问题类型统计 */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">主要问题类型统计</h4>
                  </div>
                  <div className="space-y-3">
                    {batchAnalysisResult.issueStatistics.slice(0, 6).map((issue, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{issue.category}</span>
                          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            issue.trend === 'increasing' ? 'bg-red-100 text-red-800' :
                            issue.trend === 'decreasing' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.trend === 'increasing' ? '↗ 上升' :
                             issue.trend === 'decreasing' ? '↘ 下降' : '→ 稳定'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">{issue.count}次</span>
                          <span className="text-sm font-medium text-gray-900">{issue.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 紧急问题汇总 */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">紧急问题汇总</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{batchAnalysisResult.urgentIssues.summary}</p>
                    <div>
                      <span className="text-sm text-gray-600">主要紧急问题:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {batchAnalysisResult.urgentIssues.topIssues.map((issue, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">涉及平台:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {batchAnalysisResult.urgentIssues.affectedPlatforms.map((platform, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 平台对比分析 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">平台对比分析</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{batchAnalysisResult.trendAnalysis.weeklyTrend}</p>
                    <div className="space-y-2">
                      {batchAnalysisResult.trendAnalysis.platformComparison.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{platform.platform}</span>
                            <div className="text-xs text-gray-600">
                              主要问题: {platform.mainIssues.join('、')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              platform.negativeRate > 20 ? 'text-red-600' :
                              platform.negativeRate > 10 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {platform.negativeRate}%
                            </div>
                            <div className="text-xs text-gray-600">负面率</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 关键洞察 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">关键洞察</h4>
                  </div>
                  <ul className="space-y-2">
                    {batchAnalysisResult.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 行动建议 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">行动建议</h4>
                  </div>
                  <ul className="space-y-2">
                    {batchAnalysisResult.trendAnalysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                {/* 智能分类 */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Tag className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">智能分类</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">主要分类:</span>
                      <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {analysisResult.intelligentCategorization.primaryCategory}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">次要分类:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {analysisResult.intelligentCategorization.secondaryCategories.map((category, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">置信度:</span>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {(analysisResult.intelligentCategorization.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 关键词提取 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Key className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">关键词提取</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">关键词:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {analysisResult.keywordExtraction.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">关键短语:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {analysisResult.keywordExtraction.phrases.map((phrase, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">情感词汇:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {analysisResult.keywordExtraction.emotions.map((emotion, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 深度分析 */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Search className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">深度分析</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                        根本原因分析
                      </h5>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                        {analysisResult.deepAnalysis.rootCause}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                        影响评估
                      </h5>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                        {analysisResult.deepAnalysis.impactAssessment}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        建议行动
                      </h5>
                      <ul className="space-y-2">
                        {analysisResult.deepAnalysis.recommendedActions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                          紧急原因
                        </h5>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                          {analysisResult.deepAnalysis.urgencyReason}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">相似案例</h5>
                        <div className="bg-white p-3 rounded border">
                          <span className="text-2xl font-bold text-purple-600">{analysisResult.deepAnalysis.similarCases}</span>
                          <span className="text-sm text-gray-600 ml-2">个相似案例</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">点击开始AI分析</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="btn-secondary mr-3"
          >
            关闭
          </button>
          {!isAnalyzing && (
            <>
              {isBatchMode && !batchAnalysisResult && (
                <button
                  onClick={performBatchAnalysis}
                  className="btn-primary flex items-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  开始批量分析
                </button>
              )}
              {!isBatchMode && !analysisResult && feedback && (
                <button
                  onClick={performAIAnalysis}
                  className="btn-primary flex items-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  开始AI分析
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
