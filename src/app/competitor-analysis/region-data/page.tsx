'use client'

import { useMemo, useState } from 'react'
import { Table as ReactTable } from 'react-table'
import { MapPin, List, Ruler, PackageOpen } from 'lucide-react'

interface MeterPriceRow {
  id: number
  region: string
  ourName: string
  ourPricePerKg: number
  rivalName: string
  rivalPricePerKg: number
}

interface PackPriceRow {
  id: number
  region: string
  ourName: string
  ourPrice: number
  rivalName?: string
  rivalPrice?: number
}

const meterData: MeterPriceRow[] = [
  { id:1, region:'青岛办事处', ourName:'老汤牛肉', ourPricePerKg:179.8, rivalName:'老汤牛肉', rivalPricePerKg:179.8 },
  { id:2, region:'青岛办事处', ourName:'猪头肉', ourPricePerKg:109.8, rivalName:'喜旺烧肉', rivalPricePerKg:109.8 },
  { id:3, region:'青岛办事处', ourName:'珍味肠', ourPricePerKg:27.8, rivalName:'精肉烤肠', rivalPricePerKg:21.8 },
  { id:4, region:'青岛办事处', ourName:'蒜味烤肠', ourPricePerKg:69.8, rivalName:'大块肉烤肠', rivalPricePerKg:77.8 },
  { id:5, region:'青岛办事处', ourName:'烤肠', ourPricePerKg:69.8, rivalName:'大块肉烤肠', rivalPricePerKg:79.8 },
  { id:6, region:'青岛办事处', ourName:'酱猪耳', ourPricePerKg:159.8, rivalName:'酱猪耳', rivalPricePerKg:149.8 },
  { id:7, region:'青岛办事处', ourName:'酱猪肝', ourPricePerKg:99.8, rivalName:'酱猪肝', rivalPricePerKg:99.8 },
  { id:8, region:'青岛办事处', ourName:'维也纳香肠', ourPricePerKg:71.8, rivalName:'维也纳香肠', rivalPricePerKg:71.8 },
  { id:9, region:'青岛办事处', ourName:'招牌精肉烤肠', ourPricePerKg:79.8, rivalName:'喜旺大块肉烤肠', rivalPricePerKg:79.8 },
  { id:10, region:'青岛办事处', ourName:'脱骨猪蹄', ourPricePerKg:119.8, rivalName:'猪蹄', rivalPricePerKg:131.8 },
  { id:11, region:'青岛办事处', ourName:'烤肉串', ourPricePerKg:95.8, rivalName:'烤肉串', rivalPricePerKg:95.8 },
  { id:12, region:'青岛办事处', ourName:'纯肉火腿', ourPricePerKg:87.8, rivalName:'大火腿', rivalPricePerKg:87.8 },
  { id:13, region:'青岛办事处', ourName:'波尼亚鸡爪', ourPricePerKg:87.8, rivalName:'喜旺鸡爪', rivalPricePerKg:87.8 },
  { id:14, region:'青岛办事处', ourName:'虎皮鸡爪', ourPricePerKg:87.8, rivalName:'喜旺虎皮鸡爪', rivalPricePerKg:87.8 },
  { id:15, region:'青岛办事处', ourName:'烧烤肠', ourPricePerKg:37.8, rivalName:'小烤肠', rivalPricePerKg:37.8 },
]

const packData: PackPriceRow[] = [
  { id:1, region:'青岛办事处', ourName:'经典1903果木烤火腿(350g)', ourPrice:19.9, rivalName:'手掰肉老火腿340g', rivalPrice:22.9 },
  { id:2, region:'青岛办事处', ourName:'1981青岛老火腿(300g)', ourPrice:29.9, rivalName:'无淀粉大肉块火腿340g', rivalPrice:26.9 },
  { id:3, region:'青岛办事处', ourName:'经典1903果木烤青岛老火腿500g', ourPrice:29.9 },
  { id:4, region:'青岛办事处', ourName:'经典1903果木烤火腿片(150g)', ourPrice:15.9, rivalName:'美澳莱火腿切片低脂150g', rivalPrice:16.9 },
  { id:5, region:'青岛办事处', ourName:'无淀粉大肉块火腿(300g)', ourPrice:18.9 },
  { id:6, region:'青岛办事处', ourName:'波尼亚烤肠五香(160g)', ourPrice:7.9, rivalName:'喜旺烤肠160g', rivalPrice:7.9 },
  { id:7, region:'青岛办事处', ourName:'青岛果木蒜肠', ourPrice:9.9 },
  { id:8, region:'青岛办事处', ourName:'小牛仔香肠原味(10*50g冷藏)', ourPrice:15, rivalName:'呱呱肠（袋装）500g', rivalPrice:16.9 },
  { id:9, region:'青岛办事处', ourName:'波尼亚烤肠蒜香(160g)', ourPrice:7.9, rivalName:'喜旺烤肠蒜香160g', rivalPrice:7.9 },
  { id:10, region:'青岛办事处', ourName:'金质猪肉枣香肠(160g)', ourPrice:7.9, rivalName:'玫瑰肉枣130g', rivalPrice:12.9 },
  { id:11, region:'青岛办事处', ourName:'青岛圆火腿(350g)', ourPrice:13.9 },
  { id:12, region:'青岛办事处', ourName:'五香肉串170g(袋装）', ourPrice:15.9, rivalName:'五香肉串170g', rivalPrice:16.9 },
  { id:13, region:'青岛办事处', ourName:'老式大红肠(375g)', ourPrice:19.9, rivalName:'老式大红肠360g', rivalPrice:19.9 },
  { id:14, region:'青岛办事处', ourName:'经典1906青岛老火腿(轻盐)320g', ourPrice:19.9 },
  { id:15, region:'青岛办事处', ourName:'DHA加钙肉枣烤肠(84g冷藏)', ourPrice:5.5, rivalName:'Q儿加钙儿童肠90g', rivalPrice:5.5 },
]

export default function RegionCompetitorPage() {
  const [region, setRegion] = useState('青岛办事处')

  const meterRows = meterData.filter(r => r.region === region)
  const packRows = packData.filter(r => r.region === region)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <List className="w-6 h-6 mr-2 text-primary-600" />
          区域竞品数据
        </h1>
        <p className="text-gray-600 mt-1">包含计量零售价（元/kg）与定量零售价（元）两类对比数据</p>
      </div>

      {/* 区域选择 */}
      <div className="flex items-center space-x-3">
        <label className="text-sm text-gray-700 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />区域
        </label>
        <select value={region} onChange={(e)=>setRegion(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
          {['青岛办事处'].map(r => <option key={r}>{r}</option>)}
        </select>
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

