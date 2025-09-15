'use client'

import { useMemo, useRef, useState } from 'react'
import { Upload, FileText, Filter, Download } from 'lucide-react'
import { delay } from '@/lib/utils'

interface EComRow {
  id: string
  complaintDate: string
  orderNo: string
  purchaseDate: string
  product: string
  amount: number
  issue: string
  result: string
  address: string
  payer?: string
  orderImg?: string
  mfgImg?: string
  foreignImg?: string
  receiptImg?: string
  transferImg?: string
}

// 按您提供的数据固化几条示例
const seed: EComRow[] = [
  { id:'1', complaintDate:'2024.01.27', orderNo:'240122-201615031962354', purchaseDate:'04.01.22', product:'福运到礼盒', amount:139, issue:'产品有头发', result:'退1赔3', address:'黑龙江省绥化市兰西县 兰西镇。荣耀尚品', payer:'女士[3051] 15784443359' },
  { id:'2', complaintDate:'2024.04.15', orderNo:'240412-504642999870826', purchaseDate:'4.12', product:'觅技德式黑山猪烤肠480g (黑椒味)', amount:92.9, issue:'未开封有毛发', result:'额外赔付800', address:'北京 北京市 大兴区', payer:'6226630208608603 兰文杰' },
  { id:'3', complaintDate:'2024.05.04', orderNo:'240428-196812501882593', purchaseDate:'4.28', product:'波尼亚烤肠五香(160g)', amount:85.49, issue:'产品吃出红色球状物体', result:'额外赔付110', address:'山东省 青岛市 市北区 福州北路169-25.26号', payer:'6228480269066532970 战桂丽' },
]

export default function EcommerceAfterSalesPage(){
  const [rows, setRows] = useState<EComRow[]>(seed)
  const [q, setQ] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(()=>{
    if(!q.trim()) return rows
    return rows.filter(r => [r.orderNo, r.product, r.issue, r.address].some(x => x?.includes(q)))
  }, [rows, q])

  const onImport = async (files: FileList) => {
    // 模拟导入，将文件名写入备注行
    const arr: EComRow[] = []
    for(let i=0;i<files.length;i++){
      const f = files[i]
      arr.push({ id:`imp-${Date.now()}-${i}`, complaintDate:'2024.06.30', orderNo:`导入-${i}`, purchaseDate:'—', product:f.name, amount:0, issue:'—', result:'—', address:'—' })
    }
    await delay(500)
    setRows(prev => [...arr, ...prev])
  }

  const exportCSV = () => {
    const header = ['投诉日期','订单编号','购买日期','产品','订单金额','问题描述','处理结果','地址','赔付账户']
    const lines = filtered.map(r => [r.complaintDate,r.orderNo,r.purchaseDate,r.product,r.amount,r.issue,r.result,r.address,r.payer].join(','))
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '电商平台售后数据.csv'
    a.click()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">电商平台售后分析</h1>
        <div className="flex items-center space-x-2">
          <button onClick={()=>fileInputRef.current?.click()} className="px-3 py-2 border rounded-md flex items-center text-sm"><Upload className="w-4 h-4 mr-1"/>批量导入</button>
          <button onClick={exportCSV} className="px-3 py-2 border rounded-md flex items-center text-sm"><Download className="w-4 h-4 mr-1"/>导出CSV</button>
          <input ref={fileInputRef} type="file" multiple accept=".xlsx,.xls,.csv" className="hidden" onChange={(e)=> e.target.files && onImport(e.target.files)} />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <div className="flex items-center mb-3">
          <Filter className="w-4 h-4 text-gray-500 mr-2"/>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="搜索 订单号/产品/问题/地址" className="flex-1 border rounded-md px-3 py-2"/>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">投诉日期</th>
                <th className="px-3 py-2 text-left">订单编号</th>
                <th className="px-3 py-2 text-left">购买日期</th>
                <th className="px-3 py-2 text-left">产品</th>
                <th className="px-3 py-2 text-left">订单金额</th>
                <th className="px-3 py-2 text-left">问题描述</th>
                <th className="px-3 py-2 text-left">处理结果</th>
                <th className="px-3 py-2 text-left">地址</th>
                <th className="px-3 py-2 text-left">赔付账户、实名</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap">{r.complaintDate}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.orderNo}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.purchaseDate}</td>
                  <td className="px-3 py-2">{r.product}</td>
                  <td className="px-3 py-2">{r.amount}</td>
                  <td className="px-3 py-2">{r.issue}</td>
                  <td className="px-3 py-2">{r.result}</td>
                  <td className="px-3 py-2">{r.address}</td>
                  <td className="px-3 py-2">{r.payer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

