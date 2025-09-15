'use client'

import { useMemo, useState } from 'react'
import { MapPin, List, Ruler, PackageOpen, Send, Calendar, User } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface MeterPriceRow {
  id: number
  region: string
  ourName: string
  ourPricePerKg: number
  rivalName: string
  rivalPricePerKg: number
  uploadedBy: string
  uploadedAt: string
}

interface PackPriceRow {
  id: number
  region: string
  ourName: string
  ourPrice: number
  rivalName?: string
  rivalPrice?: number
  uploadedBy: string
  uploadedAt: string
}

const meterData: MeterPriceRow[] = [
  { id:1, region:'青岛办事处', ourName:'老汤牛肉', ourPricePerKg:179.8, rivalName:'老汤牛肉', rivalPricePerKg:179.8, uploadedBy:'张三', uploadedAt:'2024-01-15T09:30:00Z' },
  { id:2, region:'青岛办事处', ourName:'猪头肉', ourPricePerKg:109.8, rivalName:'喜旺烧肉', rivalPricePerKg:109.8, uploadedBy:'李四', uploadedAt:'2024-01-15T10:15:00Z' },
  { id:3, region:'青岛办事处', ourName:'珍味肠', ourPricePerKg:27.8, rivalName:'精肉烤肠', rivalPricePerKg:21.8, uploadedBy:'王五', uploadedAt:'2024-01-16T14:20:00Z' },
  { id:4, region:'青岛办事处', ourName:'蒜味烤肠', ourPricePerKg:69.8, rivalName:'大块肉烤肠', rivalPricePerKg:77.8, uploadedBy:'赵六', uploadedAt:'2024-01-16T15:45:00Z' },
  { id:5, region:'青岛办事处', ourName:'烤肠', ourPricePerKg:69.8, rivalName:'大块肉烤肠', rivalPricePerKg:79.8, uploadedBy:'张三', uploadedAt:'2024-01-17T11:30:00Z' },
  { id:6, region:'青岛办事处', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8, uploadedBy:'李四', uploadedAt:'2024-01-17T16:10:00Z' },
  { id:7, region:'青岛办事处', ourName:'酱猪肝', ourPricePerKg:99.8, rivalName:'酱猪肝', rivalPricePerKg:99.8, uploadedBy:'王五', uploadedAt:'2024-01-18T13:25:00Z' },
  { id:8, region:'青岛办事处', ourName:'维也纳香肠', ourPricePerKg:71.8, rivalName:'维也纳香肠', rivalPricePerKg:71.8, uploadedBy:'赵六', uploadedAt:'2024-01-18T14:40:00Z' },
  { id:9, region:'青岛办事处', ourName:'招牌精肉烤肠', ourPricePerKg:79.8, rivalName:'喜旺大块肉烤肠', rivalPricePerKg:79.8, uploadedBy:'张三', uploadedAt:'2024-01-19T09:15:00Z' },
  { id:10, region:'青岛办事处', ourName:'脱骨猪蹄', ourPricePerKg:119.8, rivalName:'猪蹄', rivalPricePerKg:131.8, uploadedBy:'李四', uploadedAt:'2024-01-19T10:50:00Z' },
  { id:11, region:'青岛办事处', ourName:'烤肉串', ourPricePerKg:95.8, rivalName:'烤肉串', rivalPricePerKg:95.8, uploadedBy:'王五', uploadedAt:'2024-01-20T12:30:00Z' },
  { id:12, region:'青岛办事处', ourName:'纯肉火腿', ourPricePerKg:87.8, rivalName:'大火腿', rivalPricePerKg:87.8, uploadedBy:'赵六', uploadedAt:'2024-01-20T15:20:00Z' },
  { id:13, region:'青岛办事处', ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8, uploadedBy:'张三', uploadedAt:'2024-01-21T08:45:00Z' },
  { id:14, region:'青岛办事处', ourName:'虎皮鸡爪', ourPricePerKg:87.8, rivalName:'喜旺虎皮鸡爪', rivalPricePerKg:87.8, uploadedBy:'李四', uploadedAt:'2024-01-21T11:15:00Z' },
  { id:15, region:'青岛办事处', ourName:'烧烤肠', ourPricePerKg:37.8, rivalName:'小烤肠', rivalPricePerKg:37.8, uploadedBy:'王五', uploadedAt:'2024-01-22T14:00:00Z' },
]

const packData: PackPriceRow[] = [
  { id:1, region:'青岛办事处', ourName:'经全19031900果木烤火腿(350g)', ourPrice:19.9, rivalName:'手掉肉老火腿340g', rivalPrice:22.9, uploadedBy:'张三', uploadedAt:'2024-01-15T09:30:00Z' },
  { id:2, region:'青岛办事处', ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9, uploadedBy:'李四', uploadedAt:'2024-01-15T10:15:00Z' },
  { id:3, region:'青岛办事处', ourName:'经典1903果木烤青岛老火腿500g', ourPrice:29.9, uploadedBy:'王五', uploadedAt:'2024-01-16T14:20:00Z' },
  { id:4, region:'青岛办事处', ourName:'经典1903果木烤火腿片(150g)', ourPrice:15.9, rivalName:'美澳莱火腿切片低脂150g', rivalPrice:16.9, uploadedBy:'赵六', uploadedAt:'2024-01-16T15:45:00Z' },
  { id:5, region:'青岛办事处', ourName:'无淀粉大肉块火腿(300g)', ourPrice:18.9, uploadedBy:'张三', uploadedAt:'2024-01-17T11:30:00Z' },
  { id:6, region:'青岛办事处', ourName:'波尼亚烤肠五香(160g)', ourPrice:7.9, rivalName:'喜旺烤肠160g', rivalPrice:7.9, uploadedBy:'李四', uploadedAt:'2024-01-17T16:10:00Z' },
  { id:7, region:'青岛办事处', ourName:'青岛果木蒜肠', ourPrice:9.9, uploadedBy:'王五', uploadedAt:'2024-01-18T13:25:00Z' },
  { id:8, region:'青岛办事处', ourName:'小牛仔香肠原味(10*50g冷藏)', ourPrice:15, rivalName:'呱呱肠（袋装）500g', rivalPrice:16.9, uploadedBy:'赵六', uploadedAt:'2024-01-18T14:40:00Z' },
  { id:9, region:'青岛办事处', ourName:'波尼亚烤肠蒜香(160g)', ourPrice:7.9, rivalName:'喜旺烤肠蒜香160g', rivalPrice:7.9, uploadedBy:'张三', uploadedAt:'2024-01-19T09:15:00Z' },
  { id:10, region:'青岛办事处', ourName:'金质猪肉枣香肠(160g)', ourPrice:7.9, rivalName:'玫瑰肉枣130g', rivalPrice:12.9, uploadedBy:'李四', uploadedAt:'2024-01-19T10:50:00Z' },
  { id:11, region:'青岛办事处', ourName:'青岛圆火腿(350g)', ourPrice:13.9, uploadedBy:'王五', uploadedAt:'2024-01-20T12:30:00Z' },
  { id:12, region:'青岛办事处', ourName:'五香肉串170g(袋装）', ourPrice:15.9, rivalName:'五香肉串170g', rivalPrice:16.9, uploadedBy:'赵六', uploadedAt:'2024-01-20T15:20:00Z' },
  { id:13, region:'青岛办事处', ourName:'老式大红肠(375g)', ourPrice:19.9, rivalName:'老式大红肠360g', rivalPrice:19.9, uploadedBy:'张三', uploadedAt:'2024-01-21T08:45:00Z' },
  { id:14, region:'青岛办事处', ourName:'经典1906青岛老火腿(轻盐)320g', ourPrice:19.9, uploadedBy:'李四', uploadedAt:'2024-01-21T11:15:00Z' },
  { id:15, region:'青岛办事处', ourName:'DHA加钙肉枣烤肠(84g冷藏)', ourPrice:5.5, rivalName:'Q儿加钙儿童肠90g', rivalPrice:5.5, uploadedBy:'王五', uploadedAt:'2024-01-22T14:00:00Z' },
]

export default function RegionCompetitorPage() {
  const [region, setRegion] = useState('青岛办事处')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  // 筛选数据（按区域和时间范围）
  const meterRows = meterData.filter(r => {
    const matchRegion = r.region === region
    const uploadDate = new Date(r.uploadedAt)
    const matchDate = uploadDate >= new Date(startDate) && uploadDate <= new Date(endDate + 'T23:59:59')
    return matchRegion && matchDate
  })
  
  const packRows = packData.filter(r => {
    const matchRegion = r.region === region
    const uploadDate = new Date(r.uploadedAt)
    const matchDate = uploadDate >= new Date(startDate) && uploadDate <= new Date(endDate + 'T23:59:59')
    return matchRegion && matchDate
  })

  // 显示通知
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // 提交至集团
  const handleSubmitToGroup = () => {
    const totalRows = meterRows.length + packRows.length
    if (totalRows === 0) {
      showNotification('error', '没有符合条件的数据可提交')
      return
    }
    
    // 模拟提交
    setTimeout(() => {
      showNotification('success', `成功提交${totalRows}条数据至集团，待集团审核`)
      setSubmitModalOpen(false)
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <List className="w-6 h-6 mr-2 text-primary-600" />
          区域竞品数据
        </h1>
        <p className="text-gray-600 mt-1">包含计量零售价（元/kg）与定量零售价（元）两类对比数据</p>
      </div>

      {/* 筛选条件和操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />区域
            </label>
            <select value={region} onChange={(e)=>setRegion(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
              {['青岛办事处'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />时间范围
            </label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
        
        <button 
          onClick={() => setSubmitModalOpen(true)}
          disabled={meterRows.length + packRows.length === 0}
          className={`px-4 py-2 rounded-md flex items-center text-sm ${
            meterRows.length + packRows.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4 mr-1" />
          提交至集团 ({meterRows.length + packRows.length})
        </button>
      </div>

      {/* 计量零售价 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Ruler className="w-4 h-4 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">计量零售价（元/kg，非促销价）</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">序号</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">区域</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品名称</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品零售价</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺名称</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺零售价</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">上传人</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">上传时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meterRows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{row.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{row.region}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourPricePerKg}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalPricePerKg}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-gray-400" />
                      {row.uploadedBy}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">{formatDateTime(row.uploadedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 定量零售价 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <PackageOpen className="w-4 h-4 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">定量零售价（元，非促销价）</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">序号</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">区域</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品名称</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">本品零售价</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺名称</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">喜旺零售价</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">上传人</th>
                <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">上传时间</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packRows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{row.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{row.region}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourPrice.toFixed(1)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalName || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalPrice?.toFixed(1) || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-gray-400" />
                      {row.uploadedBy}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">{formatDateTime(row.uploadedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 提交确认模态框 */}
      {submitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">确认提交至集团</h3>
              <p className="text-gray-600 mb-6">
                您将提交 <span className="font-semibold text-primary-600">{meterRows.length + packRows.length}</span> 条数据至集团审核，包括：
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">计量零售价数据：</span>
                  <span className="font-semibold">{meterRows.length} 条</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">定量零售价数据：</span>
                  <span className="font-semibold">{packRows.length} 条</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSubmitModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitToGroup}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-1" />
                  确认提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 通知组件 */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

