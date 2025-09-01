'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, AlertTriangle, TrendingUp, MessageSquare, Filter, Eye, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { generateExtendedCustomerFeedback } from '@/lib/mockData'
import CustomerReviewsTab from '@/components/ecommerce-analysis/CustomerReviewsTab'
import ProductSuggestionsModule from '@/components/ecommerce-analysis/ProductSuggestionsModule'
import { formatDateTime, delay } from '@/lib/utils'
import { CustomerFeedback, FeedbackAnalysis } from '@/types'

export default function EcommerceAnalysisPage() {
  const [feedbackData, setFeedbackData] = useState<CustomerFeedback[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews' | 'feedback'>('dashboard')
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState('全部')
  const [selectedSentiment, setSelectedSentiment] = useState('全部')
  const [selectedUrgency, setSelectedUrgency] = useState('全部')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [wordCloudData, setWordCloudData] = useState<Array<{text: string, value: number}>>([])
  const [processedFeedback, setProcessedFeedback] = useState<{[key: string]: string}>({})

  // 初始化数据
  useEffect(() => {
    const extendedData = generateExtendedCustomerFeedback()
    setFeedbackData(extendedData)
  }, [])

  const platforms = ['全部', '天猫', '京东', '拼多多', '淘宝', '抖音商城']
  const sentiments = ['全部', 'positive', 'neutral', 'negative']
  const urgencyLevels = ['全部', 'high', 'medium', 'low']

  const sentimentColors = {
    positive: '#10b981',
    neutral: '#f59e0b',
    negative: '#ef4444'
  }

  const urgencyColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  }

  // 模拟AI分析
  const performAIAnalysis = async (data: CustomerFeedback[]) => {
    setIsAnalyzing(true)
    await delay(2500)

    const totalCount = data.length
    const sentimentDistribution = {
      positive: data.filter(f => f.sentiment === 'positive').length,
      neutral: data.filter(f => f.sentiment === 'neutral').length,
      negative: data.filter(f => f.sentiment === 'negative').length
    }

    // 统计问题类型
    const issueCount: { [key: string]: number } = {}
    data.forEach(feedback => {
      feedback.issues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1
      })
    })

    const topIssues = Object.entries(issueCount)
      .map(([issue, count]) => ({
        issue,
        count,
        percentage: Math.round((count / totalCount) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const urgentCount = data.filter(f => f.urgency === 'high').length

    setAnalysis({
      totalCount,
      sentimentDistribution,
      topIssues,
      urgentCount
    })

    // 生成词云数据
    const mockWordCloud = [
      { text: '包装', value: 45 },
      { text: '质量', value: 38 },
      { text: '物流', value: 32 },
      { text: '客服', value: 28 },
      { text: '新鲜', value: 25 },
      { text: '异物', value: 22 },
      { text: '破损', value: 20 },
      { text: '漏气', value: 18 },
      { text: '口感', value: 15 },
      { text: '价格', value: 12 }
    ]
    setWordCloudData(mockWordCloud)

    setIsAnalyzing(false)
  }

  // 处理负面反馈
  const handleProcessFeedback = (feedbackId: string, processDetails: string) => {
    setFeedbackData(prev => prev.map(item =>
      item.id === feedbackId
        ? {
            ...item,
            status: 'resolved' as const,
            processedBy: '当前用户',
            processedAt: new Date().toISOString()
          }
        : item
    ))
    setProcessedFeedback(prev => ({ ...prev, [feedbackId]: processDetails }))
  }

  // 筛选数据
  const filteredData = feedbackData.filter(item => {
    const platformMatch = selectedPlatform === '全部' || item.platform === selectedPlatform
    const sentimentMatch = selectedSentiment === '全部' || item.sentiment === selectedSentiment
    const urgencyMatch = selectedUrgency === '全部' || item.urgency === selectedUrgency
    return platformMatch && sentimentMatch && urgencyMatch
  })

  // 获取情感标签样式
  const getSentimentStyle = (sentiment: string) => {
    const styles = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-yellow-100 text-yellow-800',
      negative: 'bg-red-100 text-red-800'
    }
    return styles[sentiment as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  // 获取紧急程度样式
  const getUrgencyStyle = (urgency: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return styles[urgency as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  // 初始化分析
  useEffect(() => {
    if (feedbackData.length > 0) {
      performAIAnalysis(feedbackData)
    }
  }, [feedbackData.length])

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-primary-600" />
            电商平台数据分析
          </h1>
          <p className="text-gray-600 mt-1">多平台客户反馈智能分析与舆情监控</p>
        </div>
        <button
          onClick={() => performAIAnalysis(feedbackData)}
          disabled={isAnalyzing}
          className="btn-primary flex items-center"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {isAnalyzing ? '分析中...' : '重新分析'}
        </button>
      </div>

      {/* 数据概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总反馈数</p>
              <p className="text-2xl font-bold text-gray-900">{analysis?.totalCount || 0}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">正面反馈</p>
              <p className="text-2xl font-bold text-green-600">{analysis?.sentimentDistribution.positive || 0}</p>
              <p className="text-xs text-gray-500">
                {analysis ? Math.round((analysis.sentimentDistribution.positive / analysis.totalCount) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">负面反馈</p>
              <p className="text-2xl font-bold text-red-600">{analysis?.sentimentDistribution.negative || 0}</p>
              <p className="text-xs text-gray-500">
                {analysis ? Math.round((analysis.sentimentDistribution.negative / analysis.totalCount) * 100) : 0}%
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">紧急处理</p>
              <p className="text-2xl font-bold text-orange-600">{analysis?.urgentCount || 0}</p>
              <p className="text-xs text-gray-500">需要立即关注</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 简单内容 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">数据分析</h3>
        <p className="text-gray-600">
          当前共有 {feedbackData.length} 条客户反馈数据，正在进行智能分析...
        </p>
      </div>
    </div>
  )
}
