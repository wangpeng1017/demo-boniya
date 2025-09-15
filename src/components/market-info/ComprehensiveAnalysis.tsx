'use client'

import { useState, useMemo } from 'react'
import { Brain, Send, TrendingUp, MessageSquare, FileText, Download, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { delay, formatDate } from '@/lib/utils'
import { CustomerFeedback } from '@/types'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

interface ComprehensiveAnalysisProps {
  feedbackData: CustomerFeedback[]
  reviewsData?: any[] // 电商评论数据
}

export default function ComprehensiveAnalysis({ feedbackData, reviewsData = [] }: ComprehensiveAnalysisProps) {
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReport, setShowReport] = useState(false)

  // 建议的Prompt
  const suggestedPrompts = [
    '近一个月什么类型的反馈最多？',
    '近一个月电商什么类型的好评最多？',
    '分析近一个月的线下信息数据生成报告'
  ]

  // 数据分析
  const analysisData = useMemo(() => {
    // 常用电商平台关键字
    const ecommerceKeywords = ['天猫','京东','淘宝','拼多多','抖音','抖音商城','小红书','快手','美团','饿了么','电商']
    const isEcommerce = (p?: string) => {
      const v = (p || '').toLowerCase()
      return ecommerceKeywords.some(k => v.includes(k.toLowerCase()))
    }

    // 线下反馈类型统计（基于 AI 标签）
    const feedbackTypes = feedbackData.reduce((acc, item) => {
      item.aiTags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // 电商评论情感统计
    const sentimentStats = feedbackData.reduce((acc, item) => {
      if (isEcommerce(item.platform)) {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // 按时间统计
    const last30Days = feedbackData.filter(item => {
      const date = new Date(item.createdAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return date >= thirtyDaysAgo
    })

    // 按来源统计（线下 vs 平台）
    const sourceStats = feedbackData.reduce((acc, item) => {
      const source = item.submitLocation ? '线下反馈' : (item.platform || '未知')
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      feedbackTypes,
      sentimentStats,
      last30Days,
      sourceStats,
      total: feedbackData.length
    }
  }, [feedbackData])

  // 运行AI分析
  const runAnalysis = async (prompt: string) => {
    setLoading(true)
    setAnswer('')
    await delay(1500)

    let analysisText = ''
    
    if (prompt.includes('反馈最多')) {
      // 分析反馈类型
      const sortedTypes = Object.entries(analysisData.feedbackTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
      
      analysisText = `【近一个月线下反馈类型分析】\n\n`
      analysisText += `总反馈数量：${analysisData.last30Days.length}条\n\n`
      analysisText += `反馈类型TOP5：\n`
      sortedTypes.forEach(([type, count], idx) => {
        const percentage = ((count / analysisData.last30Days.length) * 100).toFixed(1)
        analysisText += `${idx + 1}. ${type}：${count}次（占比${percentage}%）\n`
      })
      
      analysisText += `\n【洞察与建议】\n`
      const topType = sortedTypes[0]?.[0] || '重点问题'
      analysisText += `1. ${topType}是目前最受关注的问题，建议优先改进\n`
      analysisText += `2. 建立常态化反馈收集机制，持续跟踪改进效果\n`
      analysisText += `3. 针对高频问题制定专项改进计划`
      
    } else if (prompt.includes('好评最多')) {
      // 分析电商好评
      const ecommerceKeywords = ['天猫','京东','淘宝','拼多多','抖音','抖音商城','小红书','快手','美团','饿了么','电商']
      const isEcommerce = (p?: string) => {
        const v = (p || '').toLowerCase()
        return ecommerceKeywords.some(k => v.includes(k.toLowerCase()))
      }
      const positiveReviews = feedbackData.filter(item => 
        isEcommerce(item.platform) && item.sentiment === 'positive'
      )
      
      analysisText = `【近一个月电商好评分析】\n\n`
      analysisText += `总好评数量：${positiveReviews.length}条\n\n`
      
      // 按产品分类
      const productStats = positiveReviews.reduce((acc, item) => {
        const product = item.productName || '其他产品'
        acc[product] = (acc[product] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const sortedProducts = Object.entries(productStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
      
      analysisText += `好评产品TOP5：\n`
      sortedProducts.forEach(([product, count], idx) => {
        analysisText += `${idx + 1}. ${product}：${count}条好评\n`
      })
      
      analysisText += `\n【营销建议】\n`
      const topProduct = sortedProducts[0]?.[0] || '重点产品'
      analysisText += `1. 重点推广${topProduct}，利用好评口碑效应\n`
      analysisText += `2. 提取好评关键词用于营销文案\n`
      analysisText += `3. 邀请满意客户参与案例分享和推荐`
      
    } else if (prompt.includes('生成报告')) {
      analysisText = '正在生成综合分析报告...\n\n报告已准备完成，请点击下方"查看完整报告"按钮查看详细内容。'
      setShowReport(true)
    } else {
      analysisText = `根据您的问题"${prompt}"，我进行了以下分析：\n\n`
      analysisText += `当前共有${analysisData.total}条市场反馈数据，其中近30天内有${analysisData.last30Days.length}条。\n`
      analysisText += `建议您可以尝试以上推荐的分析维度，获取更详细的洞察。`
    }
    
    setAnswer(analysisText)
    setLoading(false)
  }

  // 图表颜色
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

  // 下载报告（模拟）
  const downloadReport = async () => {
    // 模拟下载延迟
    await delay(1000)
    
    // 模拟成功提示
    alert(`报告下载成功！\n文件名：市场信息综合分析报告_${new Date().toISOString().split('T')[0]}.pdf`)
    
    console.log('模拟下载PDF报告：市场信息综合分析报告')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* AI对话区 */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-3">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI智能分析助手
          </h3>
          <div className="mb-3 text-sm text-gray-600">建议的分析：</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && input && runAnalysis(input)}
              placeholder="输入您想了解的问题..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={() => runAnalysis(input)}
              disabled={!input || loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              <Send className="w-4 h-4 mr-1" />
              分析
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 text-blue-600 text-sm">AI正在分析，请稍候...</div>
        )}

        {answer && !loading && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-blue-900 font-sans">{answer}</pre>
            {showReport && (
              <button
                onClick={() => document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                查看完整报告
              </button>
            )}
          </div>
        )}
      </div>

      {/* 数据概览 */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
          数据概览
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 反馈类型分布 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">反馈类型分布</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analysisData.feedbackTypes).map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 情感分析 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-3">电商评论情感分析</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(analysisData.sentimentStats).map(([name, value]) => ({ 
                    name: name === 'positive' ? '正面' : name === 'negative' ? '负面' : '中性', 
                    value 
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(analysisData.sentimentStats).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 完整报告 */}
      {showReport && (
        <div id="report-section" className="border-t border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                市场信息综合分析报告
              </h3>
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                下载PDF
              </button>
            </div>

            <div id="comprehensive-report" className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">市场信息综合分析报告</h1>
                <p className="text-gray-600 mt-2">生成日期：{formatDate(new Date())}</p>
              </div>

              <div className="space-y-8">
                {/* 执行摘要 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">一、执行摘要</h2>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      本报告基于近30天收集的{analysisData.last30Days.length}条市场反馈数据，
                      通过AI智能分析，深入洞察客户需求、产品问题和市场机会。
                      数据显示，产品质量和服务态度是客户最关注的两大方面，
                      电商平台好评率达到{((analysisData.sentimentStats.positive || 0) / Object.values(analysisData.sentimentStats).reduce((a, b) => a + b, 0) * 100).toFixed(1)}%。
                    </p>
                  </div>
                </section>

                {/* 关键发现 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">二、关键发现</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-2">优势领域</h3>
                      <ul className="space-y-1 text-sm text-green-800">
                        <li>• 产品口味获得广泛认可</li>
                        <li>• 包装设计受到年轻消费者喜爱</li>
                        <li>• 配送服务及时性得到好评</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="font-medium text-red-900 mb-2">改进机会</h3>
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• 部分产品存在质量一致性问题</li>
                        <li>• 客服响应速度有待提升</li>
                        <li>• 价格竞争力需要加强</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 详细分析 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">三、详细分析</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 反馈类型分析</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">反馈类型</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">占比</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">趋势</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(analysisData.feedbackTypes)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 5)
                              .map(([type, count]) => (
                                <tr key={type}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{type}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{count}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">
                                    {((count / analysisData.total) * 100).toFixed(1)}%
                                  </td>
                                  <td className="px-4 py-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 渠道分析</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(analysisData.sourceStats).map(([source, count]) => (
                          <div key={source} className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{count}</div>
                            <div className="text-sm text-gray-600 mt-1">{source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 行动建议 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">四、行动建议</h2>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <ol className="space-y-2 text-gray-700">
                      <li><strong>1. 短期措施（1-2周）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 成立质量改进小组，解决高频投诉问题</li>
                          <li>• 优化客服流程，提升响应速度</li>
                          <li>• 开展满意度回访，收集改进反馈</li>
                        </ul>
                      </li>
                      <li><strong>2. 中期计划（1-3月）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 建立常态化市场反馈机制</li>
                          <li>• 优化产品配方和生产工艺</li>
                          <li>• 加强员工培训，提升服务质量</li>
                        </ul>
                      </li>
                      <li><strong>3. 长期战略（3-6月）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 构建数字化客户体验管理体系</li>
                          <li>• 开发新产品线，满足细分市场需求</li>
                          <li>• 建立品牌忠诚度计划</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </section>

                {/* 结论 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">五、结论</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      通过本次综合分析，我们识别了产品和服务的关键改进点。
                      建议企业聚焦于提升产品质量一致性和优化客户服务体验，
                      同时利用正面反馈强化品牌优势。持续的市场信息收集和分析
                      将帮助企业保持竞争优势，实现可持续增长。
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                <p>本报告由AI智能分析系统自动生成</p>
                <p>© 2024 波尼亚智能营销平台</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
