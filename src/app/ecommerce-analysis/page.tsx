'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, AlertTriangle, TrendingUp, MessageSquare, Brain } from 'lucide-react'
import { generateExtendedCustomerFeedback } from '@/lib/mockData'
import CustomerReviewsTab from '@/components/ecommerce-analysis/CustomerReviewsTab'
import ProductSuggestionsModule from '@/components/ecommerce-analysis/ProductSuggestionsModule'
import AIInsightModal from '@/components/ecommerce-analysis/AIInsightModal'
import { delay } from '@/lib/utils'
import { CustomerFeedback, FeedbackAnalysis } from '@/types'

export default function EcommerceAnalysisPage() {
  const [feedbackData, setFeedbackData] = useState<CustomerFeedback[]>([])
  const [activeTab, setActiveTab] = useState<'reviews' | 'feedback' | 'suggestions'>('reviews')
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
    // 获取当前筛选的负面反馈数据
    const filteredFeedback = feedbackData.filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high')
    setSelectedFeedback(null) // 设置为null表示批量分析
    setBatchFeedbackList(filteredFeedback) // 设置批量分析的数据
    setAiInsightModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-primary-600" />
            产品售后数据分析
          </h1>
          <p className="text-gray-600 mt-1">多平台客户反馈智能分析与舆情监控</p>
        </div>
      </div>



      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              客户评论
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              客户反馈详情
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
              产品建议库
            </button>
          </nav>
        </div>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'reviews' && (
        <CustomerReviewsTab feedbackData={feedbackData} />
      )}

      {activeTab === 'feedback' && (
        <FeedbackTab
          feedbackData={feedbackData}
          handleProcessFeedback={handleProcessFeedback}
          getUrgencyStyle={getUrgencyStyle}
          handleBatchAiInsight={handleBatchAiInsight}
        />
      )}

      {activeTab === 'suggestions' && (
        <ProductSuggestionsModule />
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



// 反馈处理标签页组件
function FeedbackTab({ feedbackData, handleProcessFeedback, getUrgencyStyle, handleBatchAiInsight }: any) {
  return (
    <div className="space-y-6">
      {/* 客户反馈详情 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">客户反馈详情</h3>
            <p className="text-sm text-gray-600 mt-1">负面评论自动转入此列表，需要及时处理</p>
          </div>
          <button
            onClick={handleBatchAiInsight}
            className="btn-primary flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI洞察
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">反馈ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平台</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">问题摘要</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">紧急程度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbackData
                .filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high')
                .map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={item.summary}>
                      {item.summary}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyStyle(item.urgency)}`}>
                      {item.urgency === 'high' ? '高' : item.urgency === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status === 'pending' ? '待处理' :
                       item.status === 'in_progress' ? '处理中' : '已处理'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => {
                          const details = prompt('请输入处理详情:')
                          if (details) {
                            handleProcessFeedback(item.id, details)
                          }
                        }}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        待处理
                      </button>
                    )}
                    {item.status === 'resolved' && (
                      <span className="text-green-600 font-medium">已完成</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
