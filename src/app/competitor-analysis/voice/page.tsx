'use client'

import { useState } from 'react'
import { Mic, StopCircle, Save, History, MapPin } from 'lucide-react'
import DataEditModal from '@/components/competitor-analysis/DataEditModal'
import { delay } from '@/lib/utils'
import { CompetitorPrice } from '@/types'

interface VoiceRecord {
  id: string
  text: string
  items: Array<{
    brand: string
    productName: string
    specifications: string
    price: number
  }>
  location: string
  time: string
}

function parseSentence(text: string) {
  // 支持一句包含一个商品，如：喜旺手掰肉老火腿340g — 19.90
  const match = text.match(/([\u4e00-\u9fa5A-Za-z]+)([\u4e00-\u9fa5A-Za-z]+)(\d+\s*(g|G|克))\s*[—-]\s*(\d+\.?\d*)/)
  if (!match) return null
  const brand = match[1]
  const productName = match[2]
  const specifications = match[3].replace(/\s*/g,'')
  const price = parseFloat(match[5])
  return { brand, productName, specifications, price }
}

export default function VoicePage() {
  const [recording, setRecording] = useState(false)
  const [location, setLocation] = useState('青岛办事处')
  const [text, setText] = useState('')
  const [items, setItems] = useState<VoiceRecord['items']>([])
  const [historyList, setHistoryList] = useState<VoiceRecord[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editingData, setEditingData] = useState<Partial<CompetitorPrice> | null>(null)

  const mockRecognize = async () => {
    // 模拟语音转文字
    setRecording(false)
    await delay(800)
    const sample = '喜旺手掰肉老火腿340g — 19.90'
    setText(sample)
    const parsed = parseSentence(sample)
    if (parsed) setItems([parsed])
  }

  const handleAddFromText = () => {
    const parsed = parseSentence(text)
    if (parsed) setItems(prev => [...prev, parsed])
  }

  const handleEdit = (idx: number) => {
    const it = items[idx]
    setEditingData({
      brand: it.brand,
      productName: it.productName,
      specifications: it.specifications,
      price: it.price,
      location,
    })
    setEditOpen(true)
  }

  const handleSaveEdit = async (data: Partial<CompetitorPrice>) => {
    const idx = items.findIndex(i => i.productName === editingData?.productName && i.specifications === editingData?.specifications)
    if (idx >= 0) {
      const newItems = [...items]
      newItems[idx] = {
        brand: data.brand || newItems[idx].brand,
        productName: data.productName || newItems[idx].productName,
        specifications: data.specifications || newItems[idx].specifications,
        price: typeof data.price === 'number' ? data.price : newItems[idx].price,
      }
      setItems(newItems)
    }
  }

  const handleSubmit = async () => {
    const rec: VoiceRecord = {
      id: `voice-${Date.now()}`,
      text,
      items,
      location,
      time: new Date().toISOString(),
    }
    await delay(500)
    setHistoryList(prev => [rec, ...prev])
    setText('')
    setItems([])
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2 flex items-center"><Mic className="w-5 h-5 mr-2 text-primary-600"/>语音识别采集（移动端）</h1>
      <p className="text-gray-600 mb-4">按住说出一条商品与价格，或在下方输入框编辑。</p>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1"><MapPin className="w-4 h-4 inline mr-1"/>采集地点</label>
        <select value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
          {['青岛办事处','济南办事处','烟台办事处','城阳即墨'].map(loc=> <option key={loc}>{loc}</option>)}
        </select>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        {!recording ? (
          <button onClick={()=>{ setRecording(true); mockRecognize(); }} className="flex-1 btn-primary flex items-center justify-center"><Mic className="w-4 h-4 mr-2"/>开始录音</button>
        ) : (
          <button onClick={()=>setRecording(false)} className="flex-1 px-4 py-2 border rounded-md flex items-center justify-center"><StopCircle className="w-4 h-4 mr-2"/>停止</button>
        )}
      </div>

      <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2" placeholder="示例：喜旺手掰肉老火腿340g — 19.90"></textarea>
      <button onClick={handleAddFromText} className="w-full px-4 py-2 border rounded-md mb-4">从文本解析一条</button>

      {items.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
          {items.map((it, idx)=> (
            <div key={idx} className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{it.brand}{it.productName}{it.specifications}</div>
                <div className="text-red-600 font-semibold">¥{it.price.toFixed(2)}</div>
              </div>
              <button onClick={()=>handleEdit(idx)} className="px-3 py-1 text-sm border rounded-md">编辑</button>
            </div>
          ))}
          <button onClick={handleSubmit} className="w-full btn-primary flex items-center justify-center"><Save className="w-4 h-4 mr-2"/>确认上传</button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center"><History className="w-4 h-4 mr-1"/>历史上传</h2>
        {historyList.length === 0 ? (
          <div className="text-gray-500 text-sm">暂无历史数据</div>
        ) : (
          <div className="space-y-3">
            {historyList.map(h => (
              <div key={h.id} className="border border-gray-200 rounded-md p-3">
                <div className="text-xs text-gray-500 mb-1">{new Date(h.time).toLocaleString('zh-CN')} · {h.location}</div>
                <ul className="text-sm text-gray-800 space-y-1">
                  {h.items.map((it, idx)=> <li key={idx}>{it.brand}{it.productName}{it.specifications} — {it.price.toFixed(2)}</li>)}
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

