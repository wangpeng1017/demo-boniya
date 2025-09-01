'use client'

import { useState, useMemo } from 'react'
import { Lightbulb, Filter, Download, Calendar, CheckCircle, Clock, X } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface ProductSuggestion {
  id: string
  platform: string
  relatedProduct: string
  suggestionContent: string
  submittedAt: string
  adoptionStatus: 'pending' | 'under_review' | 'adopted' | 'rejected'
  submittedBy?: string
  reviewedBy?: string
  reviewedAt?: string
}

interface ProductSuggestionsModuleProps {
  suggestions?: ProductSuggestion[]
}

// 模拟产品建议数据
const mockSuggestions: ProductSuggestion[] = [
  {
    id: 'PS001',
    platform: '天猫',
    relatedProduct: '维也纳香肠',
    suggestionContent: '建议推出小包装规格，适合单身人群消费',
    submittedAt: '2025-01-08T14:30:00Z',
    adoptionStatus: 'under_review',
    submittedBy: '用户张三',
    reviewedBy: '产品经理李四'
  },
  {
    id: 'PS002',
    platform: '京东',
    relatedProduct: '猪头肉',
    suggestionContent: '希望能增加无添加剂版本，更健康',
    submittedAt: '2025-01-07T16:20:00Z',
    adoptionStatus: 'adopted',
    submittedBy: '用户王五',
    reviewedBy: '产品经理李四',
    reviewedAt: '2025-01-08T10:00:00Z'
  },
  {
    id: 'PS003',
    platform: '拼多多',
    relatedProduct: '蒜味烤肠',
    suggestionContent: '建议推出微辣版本，满足不同口味需求',
    submittedAt: '2025-01-06T11:15:00Z',
    adoptionStatus: 'pending',
    submittedBy: '用户赵六'
  },
  {
    id: 'PS004',
    platform: '淘宝',
    relatedProduct: '火腿肠',
    suggestionContent: '包装设计可以更年轻化，吸引年轻消费者',
    submittedAt: '2025-01-05T09:45:00Z',
    adoptionStatus: 'rejected',
    submittedBy: '用户孙七',
    reviewedBy: '产品经理李四',
    reviewedAt: '2025-01-06T15:30:00Z'
  },
  {
    id: 'PS005',
    platform: '抖音商城',
    relatedProduct: '酱猪耳',
    suggestionContent: '建议开发即食包装，方便办公室食用',
    submittedAt: '2025-01-04T13:20:00Z',
    adoptionStatus: 'under_review',
    submittedBy: '用户周八'
  },
  {
    id: 'PS006',
    platform: '天猫',
    relatedProduct: '培根',
    suggestionContent: '建议推出低盐版本，适合老年人和高血压人群',
    submittedAt: '2025-01-03T10:15:00Z',
    adoptionStatus: 'adopted',
    submittedBy: '用户李明',
    reviewedBy: '产品经理张华',
    reviewedAt: '2025-01-04T14:20:00Z'
  },
  {
    id: 'PS007',
    platform: '京东',
    relatedProduct: '肉枣肠',
    suggestionContent: '包装上增加营养成分表，方便消费者了解产品信息',
    submittedAt: '2025-01-02T15:45:00Z',
    adoptionStatus: 'under_review',
    submittedBy: '用户陈红',
    reviewedBy: '产品经理王强'
  },
  {
    id: 'PS008',
    platform: '拼多多',
    relatedProduct: '维也纳香肠',
    suggestionContent: '建议开发儿童版本，口味更温和，包装更卡通',
    submittedAt: '2025-01-01T12:30:00Z',
    adoptionStatus: 'pending',
    submittedBy: '用户刘芳'
  },
  {
    id: 'PS009',
    platform: '淘宝',
    relatedProduct: '蒜味烤肠',
    suggestionContent: '建议推出礼盒装，适合节日送礼',
    submittedAt: '2024-12-31T16:10:00Z',
    adoptionStatus: 'adopted',
    submittedBy: '用户黄伟',
    reviewedBy: '产品经理李四',
    reviewedAt: '2025-01-02T09:30:00Z'
  },
  {
    id: 'PS010',
    platform: '抖音商城',
    relatedProduct: '火腿肠',
    suggestionContent: '建议增加素食版本，满足素食主义者需求',
    submittedAt: '2024-12-30T11:25:00Z',
    adoptionStatus: 'under_review',
    submittedBy: '用户马丽',
    reviewedBy: '产品经理张华'
  },
  {
    id: 'PS011',
    platform: '天猫',
    relatedProduct: '酱猪耳',
    suggestionContent: '建议推出真空包装版本，延长保质期',
    submittedAt: '2024-12-29T14:50:00Z',
    adoptionStatus: 'rejected',
    submittedBy: '用户吴强',
    reviewedBy: '产品经理王强',
    reviewedAt: '2024-12-30T16:15:00Z'
  },
  {
    id: 'PS012',
    platform: '京东',
    relatedProduct: '猪头肉',
    suggestionContent: '建议开发分装版本，一次一份，避免浪费',
    submittedAt: '2024-12-28T09:40:00Z',
    adoptionStatus: 'pending',
    submittedBy: '用户郑敏'
  },
  {
    id: 'PS013',
    platform: '拼多多',
    relatedProduct: '培根',
    suggestionContent: '建议推出烟熏味和原味两种选择',
    submittedAt: '2024-12-27T13:15:00Z',
    adoptionStatus: 'adopted',
    submittedBy: '用户林涛',
    reviewedBy: '产品经理张华',
    reviewedAt: '2024-12-28T11:20:00Z'
  },
  {
    id: 'PS014',
    platform: '淘宝',
    relatedProduct: '肉枣肠',
    suggestionContent: '建议增加辣味版本，满足喜欢吃辣的消费者',
    submittedAt: '2024-12-26T17:35:00Z',
    adoptionStatus: 'under_review',
    submittedBy: '用户何静',
    reviewedBy: '产品经理李四'
  },
  {
    id: 'PS015',
    platform: '抖音商城',
    relatedProduct: '维也纳香肠',
    suggestionContent: '建议推出有机版本，迎合健康饮食趋势',
    submittedAt: '2024-12-25T08:20:00Z',
    adoptionStatus: 'pending',
    submittedBy: '用户谢亮'
  }
]

export default function ProductSuggestionsModule({ suggestions }: ProductSuggestionsModuleProps) {
  const actualSuggestions = suggestions || mockSuggestions
  const [platformFilter, setPlatformFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  // 获取筛选选项
  const filterOptions = useMemo(() => {
    const platforms = Array.from(new Set(actualSuggestions.map(item => item.platform))).sort()
    return { platforms }
  }, [actualSuggestions])

  // 应用筛选
  const filteredSuggestions = useMemo(() => {
    let filtered = actualSuggestions

    if (platformFilter !== '全部') {
      filtered = filtered.filter(item => item.platform === platformFilter)
    }

    if (statusFilter !== '全部') {
      filtered = filtered.filter(item => item.adoptionStatus === statusFilter)
    }

    if (dateRange.start) {
      filtered = filtered.filter(item => 
        new Date(item.submittedAt) >= new Date(dateRange.start)
      )
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => 
        new Date(item.submittedAt) <= new Date(dateRange.end + 'T23:59:59')
      )
    }

    return filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [actualSuggestions, platformFilter, statusFilter, dateRange])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'adopted':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />
      case 'under_review':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'adopted': return '已采纳'
      case 'rejected': return '已拒绝'
      case 'under_review': return '评审中'
      default: return '待处理'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adopted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['建议ID', '来源平台', '相关商品', '建议内容', '提出时间', '采纳状态', '提出人', '审核人', '审核时间'].join(','),
      ...filteredSuggestions.map(item => [
        item.id,
        item.platform,
        item.relatedProduct,
        `"${item.suggestionContent.replace(/"/g, '""')}"`,
        formatDateTime(item.submittedAt),
        getStatusText(item.adoptionStatus),
        item.submittedBy || '',
        item.reviewedBy || '',
        item.reviewedAt ? formatDateTime(item.reviewedAt) : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `产品建议库_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标题 */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">产品建议库</h3>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredSuggestions.length} 条建议)
            </span>
          </div>
          <button
            onClick={handleExport}
            className="btn-secondary text-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            导出Excel
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 平台筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部平台</option>
              {filterOptions.platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          {/* 状态筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">采纳状态</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="全部">全部状态</option>
              <option value="pending">待处理</option>
              <option value="under_review">评审中</option>
              <option value="adopted">已采纳</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>

          {/* 日期筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* 建议列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建议ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                来源平台
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                相关商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建议内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                提出时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                采纳状态
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSuggestions.map((suggestion) => (
              <tr key={suggestion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {suggestion.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {suggestion.platform}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {suggestion.relatedProduct}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={suggestion.suggestionContent}>
                    {suggestion.suggestionContent}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(suggestion.submittedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(suggestion.adoptionStatus)}
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(suggestion.adoptionStatus)}`}>
                      {getStatusText(suggestion.adoptionStatus)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无产品建议数据</p>
        </div>
      )}
    </div>
  )
}
