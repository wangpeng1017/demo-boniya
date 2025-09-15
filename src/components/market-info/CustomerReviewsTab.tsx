'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Calendar, Download, MessageSquare, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import { CustomerFeedback } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface CustomerReviewsTabProps {
  feedbackData: CustomerFeedback[]
}

interface FilterState {
  platform: string
  product: string
  sentiment: string
  dateRange: {
    start: string
    end: string
  }
  searchTerm: string
}

export default function CustomerReviewsTab({ feedbackData }: CustomerReviewsTabProps) {
  const [filters, setFilters] = useState<FilterState>({
    platform: '全部',
    product: '全部',
    sentiment: '全部',
    dateRange: {
      start: '',
      end: ''
    },
    searchTerm: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  // 获取筛选选项
  const filterOptions = useMemo(() => {
    const platforms = Array.from(new Set(feedbackData.map(item => item.platform))).sort()
    const products = Array.from(new Set(feedbackData.map(item => item.productName).filter(Boolean))).sort()
    
    return { platforms, products }
  }, [feedbackData])

  // 应用筛选
  const filteredData = useMemo(() => {
    let filtered = feedbackData

    // 平台筛选
    if (filters.platform !== '全部') {
      filtered = filtered.filter(item => item.platform === filters.platform)
    }

    // 商品筛选
    if (filters.product !== '全部') {
      filtered = filtered.filter(item => item.productName === filters.product)
    }

    // 情感筛选
    if (filters.sentiment !== '全部') {
      filtered = filtered.filter(item => item.sentiment === filters.sentiment)
    }

    // 日期筛选
    if (filters.dateRange.start) {
      filtered = filtered.filter(item => 
        new Date(item.commentTime) >= new Date(filters.dateRange.start)
      )
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(item => 
        new Date(item.commentTime) <= new Date(filters.dateRange.end + 'T23:59:59')
      )
    }

    // 搜索筛选
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.originalComment.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.orderId?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.productName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => new Date(b.commentTime).getTime() - new Date(a.commentTime).getTime())
  }, [feedbackData, filters])

  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  // 重置分页
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '正面'
      case 'negative': return '负面'
      default: return '中性'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'negative': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['评论ID', '平台', '商品名称', '评论内容', '评论时间', '情感分析', '处理状态'].join(','),
      ...filteredData.map(item => [
        item.id,
        item.platform,
        item.productName || '',
        `"${item.originalComment.replace(/"/g, '""')}"`,
        formatDateTime(item.commentTime),
        getSentimentText(item.sentiment),
        item.status === 'pending' ? '待处理' : item.status === 'in_progress' ? '处理中' : '已处理'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `客户评论数据_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* 平台筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部平台</option>
              {filterOptions.platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          {/* 商品筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品</label>
            <select
              value={filters.product}
              onChange={(e) => setFilters(prev => ({ ...prev, product: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部商品</option>
              {filterOptions.products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          {/* 情感筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">情感分析</label>
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部情感</option>
              <option value="positive">正面</option>
              <option value="neutral">中性</option>
              <option value="negative">负面</option>
            </select>
          </div>

          {/* 日期筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* 搜索框和导出按钮 */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索评论内容、订单号、商品名称..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">总评论数：</span>
              <span className="font-semibold text-gray-900">{filteredData.length}</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-600">正面：</span>
              <span className="font-semibold text-green-600">
                {filteredData.filter(item => item.sentiment === 'positive').length}
              </span>
            </div>
            <div className="flex items-center">
              <ThumbsDown className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-gray-600">负面：</span>
              <span className="font-semibold text-red-600">
                {filteredData.filter(item => item.sentiment === 'negative').length}
              </span>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} 条
          </span>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评论ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平台
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评论内容
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评论时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  情感分析
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  处理状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.productName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={item.originalComment}>
                      {item.originalComment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(item.commentTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getSentimentIcon(item.sentiment)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                        {getSentimentText(item.sentiment)}
                      </span>
                    </div>
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

        {/* 分页 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * pageSize >= filteredData.length}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredData.length)}
                </span>{' '}
                条，共 <span className="font-medium">{filteredData.length}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  第 {currentPage} 页，共 {Math.ceil(filteredData.length / pageSize)} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= filteredData.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
