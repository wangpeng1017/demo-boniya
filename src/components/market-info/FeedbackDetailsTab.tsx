'use client'

import { Brain } from 'lucide-react'
import { CustomerFeedback } from '@/types'
import { formatDateTime } from '@/lib/utils'

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
            <p className="text-sm text-gray-600 mt-1">AI标签分类、建议详情、AI建议与提交信息</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">反馈ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI标签</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议详情</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">建议摘要</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI建议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">提交地点</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">提交时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbackData
                .filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high')
                .map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(item.aiTags || []).length > 0 ? (
                        item.aiTags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{tag}</span>
                        ))
                      ) : (
                        <span className="text-gray-400">未标注</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                    <div className="truncate" title={item.detailedContent || item.originalComment}>
                      {item.detailedContent || item.originalComment}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-sm">
                    <div className="truncate" title={item.summary}>
                      {item.summary}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-sm">
                    <div className="truncate" title={item.aiSuggestion || ''}>
                      {item.aiSuggestion || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.submitLocation || '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(item.submitTime || item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {feedbackData.filter((item: any) => item.sentiment === 'negative' || item.urgency === 'high').length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">暂无需要展示的线下信息反馈</p>
          </div>
        )}
      </div>
    </div>
  )
}
