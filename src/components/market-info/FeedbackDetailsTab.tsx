'use client'

import { Brain } from 'lucide-react'
import { CustomerFeedback } from '@/types'

interface FeedbackDetailsTabProps {
  feedbackData: CustomerFeedback[]
  handleProcessFeedback: (feedbackId: string, processDetails: string) => void
  getUrgencyStyle: (urgency: string) => string
  handleBatchAiInsight: () => void
}

export default function FeedbackDetailsTab({ 
  feedbackData, 
  handleProcessFeedback, 
  getUrgencyStyle, 
  handleBatchAiInsight 
}: FeedbackDetailsTabProps) {
  return (
    <div className="space-y-6">
      {/* 线下信息反馈详情 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">线下信息反馈详情</h3>
            <p className="text-sm text-gray-600 mt-1">负面反馈和紧急问题需要及时处理</p>
          </div>
          <button
            onClick={handleBatchAiInsight}
            className="btn-primary flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI洞察分析
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">反馈ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平台来源</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">问题摘要</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">紧急程度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">处理状态</th>
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
                        处理
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

        {feedbackData.filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high').length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">暂无需要紧急处理的反馈信息</p>
          </div>
        )}
      </div>
    </div>
  )
}
