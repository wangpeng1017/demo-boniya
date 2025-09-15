'use client'

import { useState, useEffect } from 'react'
import { Database, AlertTriangle, TrendingUp, MessageSquare, Brain, BarChart3 } from 'lucide-react'
import { generateExtendedCustomerFeedback } from '@/lib/mockData'
import CustomerReviewsTab from '@/components/market-info/CustomerReviewsTab'
import ComprehensiveAnalysis from '@/components/market-info/ComprehensiveAnalysis'
import FeedbackDetailsTab from '@/components/market-info/FeedbackDetailsTab'
import AIInsightModal from '@/components/market-info/AIInsightModal'
import { delay } from '@/lib/utils'
import { CustomerFeedback, FeedbackAnalysis } from '@/types'

export default function MarketInfoPage() {
  const [feedbackData, setFeedbackData] = useState<CustomerFeedback[]>([])
  const [activeTab, setActiveTab] = useState<'feedback' | 'reviews' | 'suggestions'>('feedback')
  const [processedFeedback, setProcessedFeedback] = useState<{[key: string]: string}>({})
  const [aiInsightModalOpen, setAiInsightModalOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null)
  const [batchFeedbackList, setBatchFeedbackList] = useState<CustomerFeedback[]>([])

  // 初始化数据
  useEffect(() => {
    const extendedData = generateExtendedCustomerFeedback()
    setFeedbackData(extendedData)
  }, [])

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

  // 获取紧急程度样式
  const getUrgencyStyle = (urgency: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return styles[urgency as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  // 处理批量AI洞察
  const handleBatchAiInsight = () => {
    const filteredFeedback = feedbackData.filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high')
    setSelectedFeedback(null)
    setBatchFeedbackList(filteredFeedback)
    setAiInsightModalOpen(true)
  }

  // 计算统计数据
  const feedbackStats = {
    total: feedbackData.length,
    negative: feedbackData.filter(item => item.sentiment === 'negative').length,
    urgent: feedbackData.filter(item => item.urgency === 'high').length,
    pending: feedbackData.filter(item => item.status === 'pending').length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="w-6 h-6 mr-2 text-primary-600" />
            市场信息管理
          </h1>
          <p className="text-gray-600 mt-1">多渠道市场信息收集、分析与管理</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">总反馈数</p>
              <p className="text-3xl font-bold">{feedbackStats.total}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">负面反馈</p>
              <p className="text-3xl font-bold">{feedbackStats.negative}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">紧急处理</p>
              <p className="text-3xl font-bold">{feedbackStats.urgent}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">待处理</p>
              <p className="text-3xl font-bold">{feedbackStats.pending}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              线下信息反馈
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              电商评论数据
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'suggestions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              信息综合分析
            </button>
          </nav>
        </div>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'feedback' && (
        <FeedbackDetailsTab
          feedbackData={feedbackData}
          handleProcessFeedback={handleProcessFeedback}
          getUrgencyStyle={getUrgencyStyle}
          handleBatchAiInsight={handleBatchAiInsight}
        />
      )}

      {activeTab === 'reviews' && (
        <CustomerReviewsTab feedbackData={feedbackData} />
      )}

      {activeTab === 'suggestions' && (
        <ComprehensiveAnalysis feedbackData={feedbackData} />
      )}

      {/* AI洞察模态框 */}
      <AIInsightModal
        isOpen={aiInsightModalOpen}
        onClose={() => {
          setAiInsightModalOpen(false)
          setBatchFeedbackList([])
        }}
        feedback={selectedFeedback}
        feedbackList={batchFeedbackList}
      />
    </div>
  )
}
