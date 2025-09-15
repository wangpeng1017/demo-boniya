'use client'

import { useMemo, useRef, useState } from 'react'
import { Upload, FileText, Filter, Download, Image as ImageIcon, Eye } from 'lucide-react'
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
  payerAccount: string
  orderScreenshot?: string
  productionDateImg?: string
  foreignObjectImg?: string
  receiptImg?: string
  paymentScreenshot?: string
}

// 按您提供的数据固化完整示例
const seed: EComRow[] = [
  {
    id: '1',
    complaintDate: '2024.01.27',
    orderNo: '240122-201615031962354',
    purchaseDate: '04.01.22',
    product: '福运到礼盒',
    amount: 139,
    issue: '产品有头发',
    result: '退1赔3',
    address: '女士[3051] 15784443359 黑龙江省绥化市兰西县 兰西镇。荣耀尚品[3051]',
    payerAccount: '',
    orderScreenshot: 'ID_8D12BE73398540CC9CAF0B12F5065DC8',
    productionDateImg: 'ID_9D1783669CAA46C68B15D0745068362D',
    foreignObjectImg: 'ID_8D12BE73398540CC9CAF0B12F5065DC8',
    receiptImg: 'ID_18413E932C9F4DF5A68BA7FBF18CC9AD',
    paymentScreenshot: ''
  },
  {
    id: '2',
    complaintDate: '2024.04.15',
    orderNo: '240412-504642999870826',
    purchaseDate: '4.12',
    product: '觅技德式黑山猪烤肠480g (黑椒味)',
    amount: 92.9,
    issue: '未开封有毛发',
    result: '额外赔付800',
    address: '北京 北京市 大兴区',
    payerAccount: '6226630208608603 兰文杰',
    orderScreenshot: 'ID_BC8CBE79C7F1435191C9D3099B450911',
    productionDateImg: 'ID_44DE549D347447A68EF294A8C11EBBDB',
    foreignObjectImg: 'ID_A2A8EE93CE3F4AC5B71D75D2DB2BCEDB',
    receiptImg: 'ID_B48F979D1ADD4A2FA8310A9E70DAA089',
    paymentScreenshot: 'ID_F7B8BED1DCB144FDADE612DFA072C09D'
  },
  {
    id: '3',
    complaintDate: '2024.05.04',
    orderNo: '240428-196812501882593',
    purchaseDate: '4.28',
    product: '波尼亚烤肠五香(160g)',
    amount: 85.49,
    issue: '产品吃出红色球状物体',
    result: '额外赔付110',
    address: '海哥[5795] 17284439018 山东省 青岛市 市北区 福州北路169-25.26号京东便利店地下一层[5795]',
    payerAccount: '6228480269066532970 战桂丽',
    orderScreenshot: 'ID_28870AF23A764CD78BAA71D922AC7124',
    productionDateImg: 'ID_BB86ADFFA1FD4243910E0C3C2DBD7983',
    foreignObjectImg: 'ID_04ED5624C328498D892854F6F80494D3',
    receiptImg: 'ID_5170E8B5FD324561BF9597995684486D',
    paymentScreenshot: 'ID_F1854C6F4077448FB0381EA46AC57A4A'
  },
  {
    id: '4',
    complaintDate: '2024.06.08',
    orderNo: '240606-421150103222822',
    purchaseDate: '6.6',
    product: '手撕牛肉干五香味150g(罐装)',
    amount: 76.4,
    issue: '产品发霉',
    result: '额外赔付500+订单退款',
    address: '广东省 东莞市 大朗镇',
    payerAccount: '6217003090017566235 林志辉',
    orderScreenshot: 'ID_23B3161C7EC642BDA34A2FB74A6AD4DC',
    productionDateImg: 'ID_29CBDCD01C6D4C619958079AFB9EAA83',
    foreignObjectImg: 'ID_E91A706BADC544A79C4A1CC236A9C8C2',
    receiptImg: 'ID_62EFE1F4885A4917941707300596543B',
    paymentScreenshot: 'ID_9A7DA5EF73714FDF86C166F896B90185'
  },
  {
    id: '5',
    complaintDate: '2024.06.16',
    orderNo: '240613-252130127430312',
    purchaseDate: '6.13',
    product: '营养芝士早餐肠（150g）',
    amount: 214.4,
    issue: '产品吃出棉线',
    result: '额外赔付1000+订单退款',
    address: '天青[0812] 17281548947 黑龙江省哈尔滨市南岗区 民建路华鸿金色纽约7号楼1单元丰巢快递柜。[0812]',
    payerAccount: '6217982610000434078 王关玲',
    orderScreenshot: 'ID_3614FB06476343EA87B797A3E1CBD66B',
    productionDateImg: 'ID_706A4AFE3E294BB38DD7CD39ABE4D96C',
    foreignObjectImg: 'ID_C670B02027E84F469F21094038559F3A',
    receiptImg: 'ID_4DE7E75C11D54081A1BAE272F47537CB',
    paymentScreenshot: 'ID_3C8520E80534425DB680C612EB00D806'
  },
  {
    id: '6',
    complaintDate: '2024.06.14',
    orderNo: '240605-462605586722884',
    purchaseDate: '6.5',
    product: '黑椒猪肉早餐肠（150g）',
    amount: 19.5,
    issue: '产品吃到红色棉线',
    result: '额外赔付800+订单退款',
    address: 'kk[3038] 18466631468 广东省 佛山市 顺德区 大南路51号惠家生活超市(大南路店)[3038]',
    payerAccount: '卓炎兰 6228481456838019878',
    orderScreenshot: 'ID_EC4C9BF706EE4C7BA6E2E2A0FDA0FD78',
    productionDateImg: 'ID_403439F5CE284BB2B792F34DAE0028FB',
    foreignObjectImg: 'ID_2F9CDBDF54CD40EEAB471A06BB5914D3',
    receiptImg: 'ID_8514073E4F224732952C8B9D4B8D2CEA',
    paymentScreenshot: 'ID_E76AFC533A59431C9B6CEFC8A9138C08'
  },
  {
    id: '7',
    complaintDate: '2024.06.16',
    orderNo: '240612-101827275010467',
    purchaseDate: '6.12',
    product: '觅技烤肠 200g(黑椒味)',
    amount: 83.9,
    issue: '未开封有毛发',
    result: '额外赔付1000+订单退款',
    address: '王雅浇[9679] 17284257861 甘肃省 平凉市 泾川县 玉都镇街道[9679]',
    payerAccount: '6212823442505593172 王雅浇',
    orderScreenshot: 'ID_9F06B70233994242B5D46B81205EEB2C',
    productionDateImg: 'ID_9308793888EE48D5A69F05C4FC1D9990',
    foreignObjectImg: 'ID_A08FC469EB53456493D01A44497A6999',
    receiptImg: 'ID_69A17FCFE711487786BD5548F1D92319',
    paymentScreenshot: 'ID_11D069ED91D24C93901D2F27532933D1'
  },
  {
    id: '8',
    complaintDate: '2024.06.17',
    orderNo: '240609-068188977291121',
    purchaseDate: '6.9',
    product: '觅技烤肠200g(原味)',
    amount: 77.5,
    issue: '产品吃出毛发',
    result: '诉求赔付1000+订单退款，目前还在前期协商中',
    address: '王嗯嗯[2580]---18466694640---江苏省 徐州市 云龙区 云苑路华润橡树湾4期[2580]',
    payerAccount: '',
    orderScreenshot: 'ID_9FCBB77DC76C4101B07EA77E014CD64F',
    productionDateImg: 'ID_AAC88649EBED459E8177A7336B5A74CA',
    foreignObjectImg: 'ID_1C611B2D1491491C9A05D6A8DE0E51CC',
    receiptImg: '',
    paymentScreenshot: ''
  },
  {
    id: '9',
    complaintDate: '2024.6.20',
    orderNo: '240618-638016602330471',
    purchaseDate: '6.18',
    product: '黑森林1000g*3',
    amount: 196.56,
    issue: '产品吃出骨片，划伤了嘴',
    result: '诉求赔付1000+订单退款',
    address: '李小小[9628]--15053619628 19592447544 山东省潍坊市昌邑市 富昌街蔚蓝海岸小区心甜智能柜[9628]',
    payerAccount: '622908 376625 218910 侯英杰',
    orderScreenshot: 'ID_A3BA0D5241FC4553B552C4E7F195E33B',
    productionDateImg: 'ID_F1D8BBE56AB1413884F60DE6483E670E',
    foreignObjectImg: 'ID_90EC949C455C445EBC271776D090D41D',
    receiptImg: 'ID_9BD71E09286D41B38FCECC7B000BF610',
    paymentScreenshot: 'ID_E99142D8DCDF41FCB75EC85DEC0912C6'
  },
  {
    id: '10',
    complaintDate: '2024.6.21',
    orderNo: '240615-281678988830107',
    purchaseDate: '6.15',
    product: '卢森堡猪肉火腿500g*2个',
    amount: 58.75,
    issue: '产品吃出毛发',
    result: '订单退款',
    address: '徐女士[0639] 17283402442 山东省青岛市平度市 南京路28号2号楼4单元[0639]',
    payerAccount: '/',
    orderScreenshot: 'ID_98485B748B87435D93FA1C32F45B3CBB',
    productionDateImg: '',
    foreignObjectImg: 'ID_F7432D94CB594A3BBF871DB371844FD0',
    receiptImg: '',
    paymentScreenshot: ''
  },
  {
    id: '11',
    complaintDate: '2024.6.22',
    orderNo: '240619-682654493072839',
    purchaseDate: '6.19',
    product: '1号青岛老火腿定量（385g/根）*3',
    amount: 101.4,
    issue: '产品吃出塑料纸',
    result: '诉求赔付305+订单退款',
    address: '谢[9625] 18412643859 山东省淄博市张店区 共青团西路南六巷[9625]',
    payerAccount: 'ID_C8A657C4508D4B6295AE57FCB66715FB',
    orderScreenshot: 'ID_8353467C670E420783DE72E8248955C9',
    productionDateImg: 'ID_18382E2462464FCCBFE03D19B3DD29C4',
    foreignObjectImg: 'ID_5547DC5703AD41308C4A2D16B9B001A2',
    receiptImg: 'ID_D8180985D5984A1E97C29CB46729A402',
    paymentScreenshot: 'ID_8229F2B22DE94685B2DB086839F7B5C2'
  }
]

export default function EcommerceAfterSalesPage(){
  const [rows, setRows] = useState<EComRow[]>(seed)
  const [q, setQ] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filtered = useMemo(()=>{
    if(!q.trim()) return rows
    return rows.filter(r => [r.orderNo, r.product, r.issue, r.address, r.payerAccount].some(x => x?.includes(q)))
  }, [rows, q])

  const onImport = async (files: FileList) => {
    // 模拟导入，将文件名写入备注行
    const arr: EComRow[] = []
    for(let i=0;i<files.length;i++){
      const f = files[i]
      arr.push({ 
        id:`imp-${Date.now()}-${i}`, 
        complaintDate:'2024.06.30', 
        orderNo:`导入-${i}`, 
        purchaseDate:'—', 
        product:f.name, 
        amount:0, 
        issue:'—', 
        result:'—', 
        address:'—', 
        payerAccount: '—' 
      })
    }
    await delay(500)
    setRows(prev => [...arr, ...prev])
  }

  const exportCSV = () => {
    const header = ['投诉日期','订单编号','购买日期','产品','订单金额','问题描述','处理结果','地址','赔付账户、实名','订单截图','生产日期图片','异物图片','收条','打款截图']
    const lines = filtered.map(r => [r.complaintDate,r.orderNo,r.purchaseDate,r.product,r.amount,r.issue,r.result,r.address,r.payerAccount,r.orderScreenshot||'',r.productionDateImg||'',r.foreignObjectImg||'',r.receiptImg||'',r.paymentScreenshot||''].join(','))
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '电商平台售后数据.csv'
    a.click()
  }

  // 图片展示组件
  const ImageCell = ({ imageId }: { imageId?: string }) => {
    if (!imageId) return <span className="text-gray-400 text-xs">无</span>
    return (
      <button
        onClick={() => setSelectedImage(imageId)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
      >
        <ImageIcon className="w-3 h-3 mr-1" />
        查看
      </button>
    )
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
                <th className="px-2 py-2 text-left min-w-[80px]">投诉日期</th>
                <th className="px-2 py-2 text-left min-w-[150px]">订单编号</th>
                <th className="px-2 py-2 text-left min-w-[70px]">购买日期</th>
                <th className="px-2 py-2 text-left min-w-[200px]">产品</th>
                <th className="px-2 py-2 text-left min-w-[80px]">订单金额</th>
                <th className="px-2 py-2 text-left min-w-[150px]">问题描述</th>
                <th className="px-2 py-2 text-left min-w-[200px]">处理结果</th>
                <th className="px-2 py-2 text-left min-w-[300px]">地址</th>
                <th className="px-2 py-2 text-left min-w-[150px]">赔付账户、实名</th>
                <th className="px-2 py-2 text-left min-w-[80px]">订单截图</th>
                <th className="px-2 py-2 text-left min-w-[80px]">生产日期图片</th>
                <th className="px-2 py-2 text-left min-w-[80px]">异物图片</th>
                <th className="px-2 py-2 text-left min-w-[60px]">收条</th>
                <th className="px-2 py-2 text-left min-w-[80px]">打款截图</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap text-xs">{r.complaintDate}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs font-mono">{r.orderNo}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs">{r.purchaseDate}</td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[200px] truncate" title={r.product}>
                      {r.product}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs font-medium">￥{r.amount}</td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[150px] truncate" title={r.issue}>
                      {r.issue}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[200px] truncate" title={r.result}>
                      {r.result}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[300px] truncate" title={r.address}>
                      {r.address}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[150px] truncate" title={r.payerAccount}>
                      {r.payerAccount || '无'}
                    </div>
                  </td>
                  <td className="px-2 py-2"><ImageCell imageId={r.orderScreenshot} /></td>
                  <td className="px-2 py-2"><ImageCell imageId={r.productionDateImg} /></td>
                  <td className="px-2 py-2"><ImageCell imageId={r.foreignObjectImg} /></td>
                  <td className="px-2 py-2"><ImageCell imageId={r.receiptImg} /></td>
                  <td className="px-2 py-2"><ImageCell imageId={r.paymentScreenshot} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">图片预览</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-4 text-center">
              <div className="bg-gray-100 rounded-lg p-8">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">图片ID: {selectedImage}</p>
                <p className="text-sm text-gray-500">
                  实际应用中，这里会显示对应的图片内容
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

