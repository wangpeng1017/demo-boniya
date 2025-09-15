'use client'

import { useState } from 'react'
import { Camera, Upload, CheckCircle, Edit, Save, History, MapPin } from 'lucide-react'
import DataEditModal from '@/components/competitor-analysis/DataEditModal'
import { delay } from '@/lib/utils'
import { CompetitorPrice } from '@/types'

interface RecognizedItem {
  id: string
  imageUrl: string
  items: Array<{
    brand: string
    productName: string
    specifications: string
    price: number
  }>
  location: string
  time: string
}

const sampleLines = [
  '五香肉串170g — 7.90',
  '喜旺手掰肉老火腿340g — 19.90',
  '喜旺手掰风干小肠240g — 19.90',
  '喜旺玉米热狗肠400g — 11.90',
  '喜旺迷你玉米热狗肠200g — 5.50',
  '喜旺固肉快手王原味400g — 11.90',
]

function parseLine(line: string) {
  // 解析形如：品牌+名称+规格g — 价格
  const parts = line.replace(/\s+/g, ' ').split('—')
  if (parts.length < 2) return null
  const left = parts[0].trim()
  const price = parseFloat(parts[1])
  const specMatch = left.match(/(\d+\s*(g|G|克))/)
  const specifications = specMatch ? specMatch[0].replace(/\s*/g, '') : '未知规格'
  const namePart = left.replace(specifications, '').trim()
  // 粗略检测品牌
  const brandCandidates = ['喜旺', '双汇', '金锣', '雨润', '得利斯', '春都', '美好', '龙大']
  const brand = brandCandidates.find(b => namePart.startsWith(b)) || '其他'
  const productName = brand === '其他' ? namePart : namePart.replace(brand, '')
  return { brand, productName, specifications, price: isNaN(price) ? 0 : price }
}

export default function CapturePage() {
  const [location, setLocation] = useState('青岛办事处')
  const [recognized, setRecognized] = useState<RecognizedItem | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editingData, setEditingData] = useState<Partial<CompetitorPrice> | null>(null)
  const [historyList, setHistoryList] = useState<RecognizedItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setIsProcessing(true)
    await delay(1200)
    const items = sampleLines.map(l => parseLine(l)).filter(Boolean) as any
    const rec: RecognizedItem = {
      id: `rec-${Date.now()}`,
      imageUrl,
      items,
      location,
      time: new Date().toISOString(),
    }
    setRecognized(rec)
    setIsProcessing(false)
  }

  const handleEditItem = (idx: number) => {
    if (!recognized) return
    const item = recognized.items[idx]
    setEditingData({
      brand: item.brand,
      productName: item.productName,
      specifications: item.specifications,
      price: item.price,
      location,
    })
    setEditOpen(true)
  }

  const handleSaveEdit = async (data: Partial<CompetitorPrice>) => {
    if (!recognized) return
    const idx = recognized.items.findIndex(i => i.productName === editingData?.productName && i.specifications === editingData?.specifications)
    if (idx >= 0) {
      const newItems = [...recognized.items]
      newItems[idx] = {
        brand: data.brand || newItems[idx].brand,
        productName: data.productName || newItems[idx].productName,
        specifications: data.specifications || newItems[idx].specifications,
        price: typeof data.price === 'number' ? data.price : newItems[idx].price,
      }
      setRecognized({ ...recognized, items: newItems })
    }
  }

  const handleSubmit = async () => {
    if (!recognized) return
    // 模拟上传
    setIsProcessing(true)
    await delay(800)
    setHistoryList(prev => [{ ...recognized }, ...prev])
    setRecognized(null)
    setIsProcessing(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2 flex items-center"><Camera className="w-5 h-5 mr-2 text-primary-600"/>拍照识别（移动端）</h1>
      <p className="text-gray-600 mb-4">上传一张图片，自动识别下方列表，可修改后提交。</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1"><MapPin className="w-4 h-4 inline mr-1"/>采集地点</label>
        <select
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          {['青岛办事处','济南办事处','烟台办事处','城阳即墨'].map(loc=> (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 上传控件 */}
      <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer mb-4">
        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2"/>
        <span className="text-sm text-gray-700">点击选择或拖拽图片到此</span>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {isProcessing && (
        <div className="text-blue-600 flex items-center mb-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          正在识别图片...
        </div>
      )}

      {/* 识别结果 */}
      {recognized && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={recognized.imageUrl} alt="预览" className="w-full max-h-60 object-contain bg-black/5" />
          <div className="p-4 space-y-3">
            <div className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1"/>识别完成，可点编辑修改</div>
            <ul className="divide-y">
              {recognized.items.map((it, idx)=> (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{it.brand}{it.productName}{it.specifications}</div>
                    <div className="text-red-600 font-semibold">¥{it.price.toFixed(2)}</div>
                  </div>
                  <button onClick={()=>handleEditItem(idx)} className="px-3 py-1 text-sm border rounded-md flex items-center">
                    <Edit className="w-4 h-4 mr-1"/>编辑
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={handleSubmit} className="w-full btn-primary flex items-center justify-center"><Save className="w-4 h-4 mr-2"/>确认上传</button>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center"><History className="w-4 h-4 mr-1"/>历史上传</h2>
        {historyList.length === 0 ? (
          <div className="text-gray-500 text-sm">暂无历史数据</div>
        ) : (
          <div className="space-y-3">
            {historyList.map(h => (
              <div key={h.id} className="border border-gray-200 rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2">{new Date(h.time).toLocaleString('zh-CN')} · {h.location}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.imageUrl} alt="历史" className="w-full max-h-40 object-contain bg-black/5 rounded" />
                <ul className="mt-2 text-sm text-gray-800 space-y-1">
                  {h.items.map((it, idx)=> (
                    <li key={idx}>{it.brand}{it.productName}{it.specifications} — {it.price.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <DataEditModal
        isOpen={editOpen}
        onClose={()=>setEditOpen(false)}
        onSave={handleSaveEdit}
        initialData={editingData || undefined}
        title="编辑识别数据"
      />
    </div>
  )
}

