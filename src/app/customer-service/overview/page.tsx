'use client'

import { useMemo, useState } from 'react'
import { Brain, Send, MessageSquare, Phone, ShoppingCart, Calendar, BarChart3 } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { delay, formatDate } from '@/lib/utils'
import { mockCustomerFeedback } from '@/lib/mockData'

// 简单的400来电模拟数据（近30天）
interface CallRecord {
  id: string
  date: string // ISO
  region: string
  type: '渠道咨询' | '价格咨询' | '质量投诉' | '售后流程' | '其它'
  summary: string
}

const mockCalls: CallRecord[] = [
  { id: 'C400-001', date: new Date().toISOString(), region: '青岛市北', type: '渠道咨询', summary: '询问清晨提货与门店位置' },
  { id: 'C400-002', date: new Date(Date.now() - 2*86400000).toISOString(), region: '即墨', type: '价格咨询', summary: '批发价政策咨询' },
  { id: 'C400-003', date: new Date(Date.now() - 5*86400000).toISOString(), region: '胶州', type: '质量投诉', summary: '烤肠有异物' },
  { id: 'C400-004', date: new Date(Date.now() - 9*86400000).toISOString(), region: '黄岛', type: '质量投诉', summary: '产品不新鲜' },
  { id: 'C400-005', date: new Date(Date.now() - 14*86400000).toISOString(), region: '济南', type: '售后流程', summary: '退换货流程咨询' },
  { id: 'C400-006', date: new Date(Date.now() - 18*86400000).toISOString(), region: '潍坊', type: '其它', summary: '发票开具' },
]

// 过去30天内数据筛选
const withinDays = (iso: string, days = 30) => {
  const d = new Date(iso).getTime()
  return Date.now() - d <= days * 86400000
}

export default function CustomerServiceOverviewPage() {
  // 聚合来源：400 + 电商平台
  const calls30 = useMemo(() => mockCalls.filter(r => withinDays(r.date)), [])
  const ecommerce30 = useMemo(() => mockCustomerFeedback.filter(r => withinDays(r.createdAt)), [])

  // issue 统计（电商平台）
  const issueCount = useMemo(() => {
    const map = new Map<string, number>()
    ecommerce30.forEach(f => f.issues.forEach(i => map.set(i, (map.get(i) || 0) + 1)))
    return Array.from(map.entries()).map(([issue, count]) => ({ issue, count }))
  }, [ecommerce30])

  // 400类型统计
  const callTypeStats = useMemo(() => {
    const map = new Map<string, number>()
    calls30.forEach(c => map.set(c.type, (map.get(c.type) || 0) + 1))
    return Array.from(map.entries()).map(([type, count]) => ({ type, count }))
  }, [calls30])

  // AI 对话
  const [input, setInput] = useState('')
  const [answer, setAnswer] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const suggestedPrompts = [
    '近一个月什么类型的投诉最多？请按问题标签输出TOP5并给出改善建议',
    '近一个月线下（400）什么类型的问题最多？请分区域给出TOP3与建议',
    '分析近一个月的售后服务数据，生成售后服务报告（包含关键指标、问题分布、区域热点、改进建议、下周行动清单）',
  ]

  const runAnalysis = async (prompt: string) => {
    setLoading(true)
    setAnswer('')
    await delay(900)
    // 生成一个基于聚合数据的简单分析文本（模拟AI）
    const topIssue = issueCount.sort((a,b)=>b.count-a.count)[0]?.issue || '无'
    const topCall = callTypeStats.sort((a,b)=>b.count-a.count)[0]?.type || '无'
    const txt = `问题总览：近30天共接收电商平台反馈${ecommerce30.length}条，400来电${calls30.length}条。\n`+
      `电商平台TOP问题：${topIssue}；400来电TOP类型：${topCall}。\n`+
      `建议：1）针对“${topIssue}”建立专项排查与复盘；2）为“${topCall}”编写SOP与话术并在市北/黄岛优先试点；3）建立高风险问题（异物、不新鲜）红线预警，要求24小时闭环。\n`+
      `以上为依据当前聚合数据生成的自动分析（Prompt: ${prompt}）。`
    setAnswer(txt)
    setLoading(false)
  }

  const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6']

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center"><BarChart3 className="w-6 h-6 mr-2 text-primary-600"/>综合数据分析</h1>
          <p className="text-gray-600">汇聚400与电商平台售后数据，提供AI洞察与改进建议</p>
        </div>
      </div>

      {/* AI 对话区 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="mb-3 text-sm text-gray-600 flex items-center"><Brain className="w-4 h-4 mr-2 text-purple-600"/>建议的Prompt：</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedPrompts.map((p, i) => (
            <button key={i} onClick={()=>setInput(p)} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">{p}</button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input value={input} onChange={(e)=>setInput(e.target.value)}
                 placeholder="输入分析问题，例如：近一个月什么类型的投诉最多？"
                 className="flex-1 border rounded-md px-3 py-2" />
          <button onClick={()=>runAnalysis(input)} disabled={!input || loading}
                  className="px-4 py-2 btn-primary flex items-center disabled:opacity-50"><Send className="w-4 h-4 mr-1"/>分析</button>
        </div>
        {loading && (
          <div className="mt-3 text-blue-600 text-sm">AI正在分析，请稍候...</div>
        )}
        {!!answer && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md whitespace-pre-wrap text-sm text-blue-900">{answer}</div>
        )}
      </div>

      {/* 指标总览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">电商平台反馈（30天）</div>
          <div className="text-3xl font-bold text-gray-900">{ecommerce30.length}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">400来电（30天）</div>
          <div className="text-3xl font-bold text-gray-900">{calls30.length}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-600">问题标签总数（电商）</div>
          <div className="text-3xl font-bold text-gray-900">{issueCount.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 电商问题TOP图 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><ShoppingCart className="w-5 h-5 mr-2 text-green-600"/>电商平台问题TOP</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueCount.sort((a,b)=>b.count-a.count).slice(0,8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="issue" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 400类型图 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Phone className="w-5 h-5 mr-2 text-blue-600"/>400来电类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={callTypeStats} cx="50%" cy="50%" dataKey="count" nameKey="type" label>
                {callTypeStats.map((_, i)=> <Cell key={i} fill={colors[i%colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 明细（电商 + 400） */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center"><Calendar className="w-5 h-5 mr-2 text-purple-600"/>近30天明细</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">电商平台</h4>
            <div className="max-h-72 overflow-auto border rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">时间</th>
                    <th className="px-3 py-2 text-left">问题摘要</th>
                    <th className="px-3 py-2 text-left">标签</th>
                  </tr>
                </thead>
                <tbody>
                  {ecommerce30.map(f => (
                    <tr key={f.id} className="border-t">
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(f.createdAt)}</td>
                      <td className="px-3 py-2">{f.summary}</td>
                      <td className="px-3 py-2 text-gray-600">{f.issues.join('、')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">400来电</h4>
            <div className="max-h-72 overflow-auto border rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">时间</th>
                    <th className="px-3 py-2 text-left">区域</th>
                    <th className="px-3 py-2 text-left">类型</th>
                    <th className="px-3 py-2 text-left">摘要</th>
                  </tr>
                </thead>
                <tbody>
                  {calls30.map(c => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(c.date)}</td>
                      <td className="px-3 py-2">{c.region}</td>
                      <td className="px-3 py-2">{c.type}</td>
                      <td className="px-3 py-2">{c.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

