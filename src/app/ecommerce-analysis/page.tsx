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
  }, [feedbackData.length]) // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* 标签页导航 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              数据仪表板
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
          </nav>
        </div>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onAnalyze={() => performAIAnalysis(feedbackData)}
          feedbackData={feedbackData}
          filteredData={filteredData}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedSentiment={selectedSentiment}
          setSelectedSentiment={setSelectedSentiment}
          selectedUrgency={selectedUrgency}
          setSelectedUrgency={setSelectedUrgency}
          platforms={platforms}
          sentiments={sentiments}
          urgencyLevels={urgencyLevels}
          getSentimentStyle={getSentimentStyle}
          getUrgencyStyle={getUrgencyStyle}
          wordCloudData={wordCloudData}
        />
      )}

      {activeTab === 'reviews' && (
        <CustomerReviewsTab feedbackData={feedbackData} />
      )}

      {activeTab === 'feedback' && (
        <FeedbackTab
          feedbackData={feedbackData}
          handleProcessFeedback={handleProcessFeedback}
          getUrgencyStyle={getUrgencyStyle}
        />
      )}
    </div>
  )
}

// 仪表板标签页组件
function DashboardTab({
  analysis,
  isAnalyzing,
  onAnalyze,
  feedbackData,
  filteredData,
  selectedPlatform,
  setSelectedPlatform,
  selectedSentiment,
  setSelectedSentiment,
  selectedUrgency,
  setSelectedUrgency,
  platforms,
  sentiments,
  urgencyLevels,
  getSentimentStyle,
  getUrgencyStyle,
  wordCloudData
}: any) {
  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {platforms.map((platform: string) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">情感</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {sentiments.map((sentiment: string) => (
                <option key={sentiment} value={sentiment}>
                  {sentiment === '全部' ? '全部' :
                   sentiment === 'positive' ? '正面' :
                   sentiment === 'negative' ? '负面' : '中性'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">紧急程度</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {urgencyLevels.map((urgency: string) => (
                <option key={urgency} value={urgency}>
                  {urgency === '全部' ? '全部' :
                   urgency === 'high' ? '高' :
                   urgency === 'medium' ? '中' : '低'}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="btn-primary flex items-center"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {isAnalyzing ? '分析中...' : '重新分析'}
        </button>
      </div>

      {/* 分析结果展示 */}
      {analysis && (
        <div className="space-y-6">
          {/* 情感分析饼图 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">情感分析分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '正面', value: analysis.sentimentDistribution.positive, fill: '#10b981' },
                      { name: '中性', value: analysis.sentimentDistribution.neutral, fill: '#f59e0b' },
                      { name: '负面', value: analysis.sentimentDistribution.negative, fill: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 问题分类统计 */}
          {analysis.topIssues.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">主要问题分类</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.topIssues}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="issue" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 反馈列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">客户反馈列表</h3>
          <p className="text-sm text-gray-600 mt-1">
            显示 {filteredData.length} 条反馈，共 {feedbackData.length} 条
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平台</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">摘要</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">情感</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">紧急程度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.slice(0, 10).map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentStyle(item.sentiment)}`}>
                      {item.sentiment === 'positive' ? '正面' :
                       item.sentiment === 'negative' ? '负面' : '中性'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyStyle(item.urgency)}`}>
                      {item.urgency === 'high' ? '高' :
                       item.urgency === 'medium' ? '中' : '低'}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// 反馈处理标签页组件
function FeedbackTab({ feedbackData, handleProcessFeedback, getUrgencyStyle }: any) {
  return (
    <div className="space-y-6">
      {/* 客户反馈详情 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">客户反馈详情</h3>
          <p className="text-sm text-gray-600 mt-1">负面评论自动转入此列表，需要及时处理</p>
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

      {/* 产品建议库 */}
      <ProductSuggestionsModule suggestions={[]} />
    </div>
  )
}
