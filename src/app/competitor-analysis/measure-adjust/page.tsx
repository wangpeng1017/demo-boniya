'use client'

import { useMemo, useState } from 'react'
import { Send, Ruler, MapPin, Brain, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import PriceAdjustmentAI from '@/components/competitor-analysis/PriceAdjustmentAI'

interface AdjustRow {
  id: number
  product: string
  region: string
  ourName: string
  ourPricePerKg: number
  adjustTo?: number
  rivalName: string
  rivalPricePerKg: number
  cost: number
}

const baseRows: AdjustRow[] = [
  { id:1, product:'酱猪耳', region:'青岛办事处', ourName:'酱猪耳', ourPricePerKg:159.8, adjustTo:149.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:2, product:'酱猪耳', region:'城阳即墨', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:3, product:'酱猪耳', region:'胶州区域', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'喜旺酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:4, product:'酱猪耳', region:'胶南区域', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'耳朵', rivalPricePerKg:149.8, cost:89.7 },
  { id:5, product:'酱猪耳', region:'黄岛区域', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'耳朵', rivalPricePerKg:149.8, cost:89.7 },
  { id:6, product:'酱猪耳', region:'泰安区域', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:7, product:'酱猪耳', region:'济南区域', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:8, product:'酱猪耳', region:'潍坊', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:9, product:'酱猪耳', region:'荣成石岛', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'猪耳朵', rivalPricePerKg:149.8, cost:89.7 },
  { id:10, product:'酱猪耳', region:'威海市区', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'猪耳朵', rivalPricePerKg:149.8, cost:89.7 },
  { id:11, product:'酱猪耳', region:'烟台', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:147.8, cost:89.7 },
  { id:12, product:'酱猪耳', region:'东营', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
  { id:13, product:'酱猪耳', region:'淄博', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, cost:89.7 },
]

export default function MeasureAdjustPage() {
  const [rows, setRows] = useState<AdjustRow[]>(baseRows)
  const [regionFilter, setRegionFilter] = useState<string>('全部')
  const [aiReportOpen, setAiReportOpen] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  const regions = Array.from(new Set(rows.map(r => r.region)))

  const filtered = rows.filter(r => regionFilter==='全部' || r.region===regionFilter)

  const canPush = filtered.some(r => typeof r.adjustTo === 'number' && r.adjustTo! > 0)

  const handleAdjustChange = (id: number, value: string) => {
    const n = value === '' ? undefined : parseFloat(value)
    setRows(prev => prev.map(r => r.id === id ? { ...r, adjustTo: isNaN(n as any) ? undefined : n } : r))
  }

  // 显示通知
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handlePushToBPM = () => {
    // 模拟推送
    const adjustCount = filtered.filter(r => r.adjustTo).length
    showNotification('success', `已将${adjustCount}条调价方案推送至BPM，待审批`)
  }


  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Ruler className="w-6 h-6 mr-2 text-primary-600" />
            计量价格调整
          </h1>
          <p className="text-gray-600 mt-1">按区域对比竞品，填写“调价到价格（元/kg）”，右上角推送审批。</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAiReportOpen(true)} className="px-4 py-2 rounded-md flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
            <Brain className="w-4 h-4 mr-2"/> AI调价建议
          </button>
          <button onClick={handlePushToBPM} disabled={!canPush} className={`px-4 py-2 rounded-md flex items-center ${canPush? 'bg-primary-600 text-white hover:bg-primary-700':'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>
            <Send className="w-4 h-4 mr-2"/> 推送至BPM
          </button>
        </div>
      </div>

      {/* 过滤 */}
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1"/>区域</label>
        <select value={regionFilter} onChange={(e)=>setRegionFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="全部">全部</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">序号</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">区域</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品名称</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品零售价(元/kg)</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">调价到价格(元/kg)</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺名称</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺零售价(元/kg)</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">成本</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((row, idx) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{row.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{row.region}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{row.ourName}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{row.ourPricePerKg}</td>
                <td className="px-4 py-2 text-sm">
                  <input
                    type="number"
                    step="0.1"
                    className="w-28 border border-gray-300 rounded-md px-2 py-1"
                    value={row.adjustTo ?? ''}
                    onChange={(e)=>handleAdjustChange(row.id, e.target.value)}
                    placeholder="填写"
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{row.rivalName}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{row.rivalPricePerKg}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI调价建议模态框 */}
      <PriceAdjustmentAI
        isOpen={aiReportOpen}
        onClose={() => setAiReportOpen(false)}
        data={filtered}
        selectedLocation={regionFilter}
      />

      {/* 通知组件 */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} rounded-lg p-4 shadow-lg`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className={`${notification.type === 'success' ? 'text-green-800' : 'text-red-800'} text-sm font-medium`}>
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
