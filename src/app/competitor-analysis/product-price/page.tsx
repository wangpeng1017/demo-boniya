'use client'

import { useState } from 'react'
import { ListOrdered, Ruler, PackageOpen, MapPin } from 'lucide-react'

interface MeterRow {
  id: number
  region: string
  ourName: string
  ourPricePerKg: number
  rivalName?: string
  rivalPricePerKg?: number
}

interface PackRow {
  id: number
  region: string
  ourName: string
  ourPrice: number
  rivalName?: string
  rivalPrice?: number
}

const meterRowsData: MeterRow[] = [
  { id:1, region:'青岛办事处', ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:2, region:'城阳即墨',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:3, region:'平度莱西',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8 },
  { id:4, region:'胶州区域',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:5, region:'胶南区域',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:6, region:'黄岛区域',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:7, region:'泰安区域',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:8, region:'济南区域',   ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:9, region:'潍坊',       ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:10, region:'荣成石岛',  ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:11, region:'威海市区',  ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:12, region:'烟台',      ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'鸡爪', rivalPricePerKg:87.8 },
  { id:13, region:'东营',      ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'波尼亚鸡爪', rivalPricePerKg:87.8 },
  { id:14, region:'淄博',      ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'波尼亚鸡爪', rivalPricePerKg:87.8 },
  { id:15, region:'青岛办事处', ourName:'纯肉火腿',  ourPricePerKg:87.8, rivalName:'大火腿', rivalPricePerKg:87.8 },
]

const packRowsData: PackRow[] = [
  { id:1, region:'青岛办事处', ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:2, region:'城阳即墨',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:3, region:'平度莱西',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'喜旺老式火腿', rivalPrice:19.9 },
  { id:4, region:'胶州区域',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:5, region:'胶南区域',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:6, region:'黄岛区域',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:7, region:'泰安区域',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:8, region:'济南区域',   ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:9, region:'潍坊',       ourName:'1981青岛老火腿(300g)', ourPrice:29.9 },
  { id:10, region:'荣成石岛',  ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:11, region:'威海市区',  ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:12, region:'烟台',      ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:13, region:'东营',      ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:14, region:'淄博',      ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:19.9 },
  { id:15, region:'青岛办事处', ourName:'DHA加钙肉枣烤肠(84g冷藏)', ourPrice:5.5, rivalName:'Q儿加钙儿童肠90g', rivalPrice:5.5 },
]

export default function ProductPriceAnalysisPage() {
  const [regionFilter, setRegionFilter] = useState<string>('全部')

  const regions = Array.from(new Set([...meterRowsData.map(r=>r.region), ...packRowsData.map(r=>r.region)]))

  const meterRows = meterRowsData.filter(r => regionFilter==='全部' || r.region===regionFilter)
  const packRows = packRowsData.filter(r => regionFilter==='全部' || r.region===regionFilter)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ListOrdered className="w-6 h-6 mr-2 text-primary-600" />
          产品价格分析
        </h1>
        <p className="text-gray-600 mt-1">按产品维度汇总各区域竞品价格对比</p>
      </div>

      <div className="flex items-center space-x-3">
        <label className="text-sm text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1"/>区域</label>
        <select value={regionFilter} onChange={(e)=>setRegionFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          <option value="全部">全部</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* 计量零售价分析 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <Ruler className="w-4 h-4 text-blue-600 mr-2"/>
          <h3 className="text-lg font-semibold text-gray-900">计量零售价分析（元/kg，非促销价）</h3>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meterRows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{row.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{row.region}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourName}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.ourPricePerKg}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalName || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{row.rivalPricePerKg ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 定量零售价分析 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <PackageOpen className="w-4 h-4 text-green-600 mr-2"/>
          <h3 className="text-lg font-semibold text-gray-900">定量零售价分析（元，非促销价）</h3>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

