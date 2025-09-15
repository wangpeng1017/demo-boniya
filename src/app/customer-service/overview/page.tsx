'use client'

import { useMemo, useState } from 'react'
import { Brain, Send, MessageSquare, Phone, ShoppingCart, Calendar, BarChart3, FileText, Download } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { delay, formatDate } from '@/lib/utils'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'

// 电商平台数据接口
interface EComComplaint {
  id: string
  complaintDate: string
  issue: string
  product: string
  address: string
  result: string
  createdAt: string // ISO for filtering
}

// 400来电数据接口
interface CallRecord {
  id: string
  date: string // ISO
  region: string
  type: '渠道咨询' | '价格咨询' | '质量投诉' | '售后流程' | '其它'
  summary: string
}

// 电商平台真实数据（近30天）
const ecommerceData: EComComplaint[] = [
  { id: '1', complaintDate: '2024.01.27', issue: '产品有头发', product: '福运到礼盒', address: '黑龙江省绥化市兰西县', result: '退1赔3', createdAt: new Date(Date.now() - 3*86400000).toISOString() },
  { id: '2', complaintDate: '2024.04.15', issue: '未开封有毛发', product: '觅技德式黑山猪烤肠480g (黑椒味)', address: '北京市大兴区', result: '额外赔付800', createdAt: new Date(Date.now() - 5*86400000).toISOString() },
  { id: '3', complaintDate: '2024.05.04', issue: '产品吃出红色球状物体', product: '波尼亚烤肠五香(160g)', address: '山东省青岛市市北区', result: '额外赔付110', createdAt: new Date(Date.now() - 7*86400000).toISOString() },
  { id: '4', complaintDate: '2024.06.08', issue: '产品发霉', product: '手撕牛肉干五香味150g(罐装)', address: '广东省东莞市大朗镇', result: '额外赔付500+订单退款', createdAt: new Date(Date.now() - 10*86400000).toISOString() },
  { id: '5', complaintDate: '2024.06.16', issue: '产品吃出棉线', product: '营养芝士早餐肠（150g）', address: '黑龙江省哈尔滨市南岗区', result: '额外赔付1000+订单退款', createdAt: new Date(Date.now() - 12*86400000).toISOString() },
  { id: '6', complaintDate: '2024.06.14', issue: '产品吃到红色棉线', product: '黑椒猪肉早餐肠（150g）', address: '广东省佛山市顺德区', result: '额外赔付800+订单退款', createdAt: new Date(Date.now() - 14*86400000).toISOString() },
  { id: '7', complaintDate: '2024.06.16', issue: '未开封有毛发', product: '觅技烤肠 200g(黑椒味)', address: '甘肃省平凉市泾川县', result: '额外赔付1000+订单退款', createdAt: new Date(Date.now() - 15*86400000).toISOString() },
  { id: '8', complaintDate: '2024.06.17', issue: '产品吃出毛发', product: '觅技烤肠200g(原味)', address: '江苏省徐州市云龙区', result: '诉求赔付1000+订单退款，目前还在前期协商中', createdAt: new Date(Date.now() - 17*86400000).toISOString() },
  { id: '9', complaintDate: '2024.6.20', issue: '产品吃出骨片，划伤了嘴', product: '黑森林1000g*3', address: '山东省潍坊市昌邑市', result: '诉求赔付1000+订单退款', createdAt: new Date(Date.now() - 20*86400000).toISOString() },
  { id: '10', complaintDate: '2024.6.21', issue: '产品吃出毛发', product: '卢森堡猪肉火腿500g*2个', address: '山东省青岛市平度市', result: '订单退款', createdAt: new Date(Date.now() - 22*86400000).toISOString() },
]

// 400来电模拟数据（近30天）
const mockCalls: CallRecord[] = [
  { id: 'C400-001', date: new Date().toISOString(), region: '青岛市北', type: '渠道咨询', summary: '询问清晨提货与门店位置' },
  { id: 'C400-002', date: new Date(Date.now() - 2*86400000).toISOString(), region: '即墨', type: '价格咨询', summary: '批发价政策咨询' },
  { id: 'C400-003', date: new Date(Date.now() - 5*86400000).toISOString(), region: '胶州', type: '质量投诉', summary: '烤肠有异物' },
  { id: 'C400-004', date: new Date(Date.now() - 9*86400000).toISOString(), region: '黄岛', type: '质量投诉', summary: '产品不新鲜' },
  { id: 'C400-005', date: new Date(Date.now() - 14*86400000).toISOString(), region: '济南', type: '售后流程', summary: '退换货流程咨询' },
  { id: 'C400-006', date: new Date(Date.now() - 18*86400000).toISOString(), region: '潍坊', type: '其它', summary: '发票开具' },
  { id: 'C400-007', date: new Date(Date.now() - 3*86400000).toISOString(), region: '青岛市北', type: '质量投诉', summary: '产品包装破损' },
  { id: 'C400-008', date: new Date(Date.now() - 7*86400000).toISOString(), region: '黄岛', type: '渠道咨询', summary: '代理商加盟政策' },
  { id: 'C400-009', date: new Date(Date.now() - 11*86400000).toISOString(), region: '济南', type: '价格咨询', summary: '团购优惠政策' },
  { id: 'C400-010', date: new Date(Date.now() - 15*86400000).toISOString(), region: '潍坊', type: '质量投诉', summary: '产品有异味' },
]

// 过去30天内数据筛选
const withinDays = (iso: string, days = 30) => {
  const d = new Date(iso).getTime()
  return Date.now() - d <= days * 86400000
}

export default function CustomerServiceOverviewPage() {
  const [showReport, setShowReport] = useState(false)
  
  // 聚合来源：400 + 电商平台
  const calls30 = useMemo(() => mockCalls.filter(r => withinDays(r.date)), [])
  const ecommerce30 = useMemo(() => ecommerceData.filter(r => withinDays(r.createdAt)), [])

  // issue 统计（电商平台）
  const issueCount = useMemo(() => {
    const map = new Map<string, number>()
    ecommerce30.forEach(f => map.set(f.issue, (map.get(f.issue) || 0) + 1))
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
    
    let analysisText = ''
    
    if (prompt.includes('投诉最多') && prompt.includes('TOP5')) {
      // 电商平台投诉TOP5分析
      const sortedIssues = issueCount.sort((a,b) => b.count - a.count).slice(0, 5)
      analysisText = `【近一个月电商平台投诉类型TOP5分析】\n\n`
      
      sortedIssues.forEach((item, idx) => {
        analysisText += `${idx + 1}. ${item.issue}：${item.count}次\n`
      })
      
      analysisText += `\n【改善建议】\n\n`
      analysisText += `1. 针对“毛发”问题（占比70%）：\n`
      analysisText += `   - 紧急成立专项小组，追源进入路径（原料、生产线、包装）\n`
      analysisText += `   - 升级生产车间防护措施：全员必须佩戴发网、口罩、手套\n`
      analysisText += `   - 引入高精度金属探测仪和异物检测系统\n`
      analysisText += `   - 实施每批次产品留样制度，便于追溯\n\n`
      
      analysisText += `2. 针对“棉线/异物”问题：\n`
      analysisText += `   - 检查包装机器设备，更换老化零件\n`
      analysisText += `   - 加强员工培训，严禁携带非生产物品进入车间\n`
      analysisText += `   - 建立“清洁验证”流程，每班次记录\n\n`
      
      analysisText += `3. 针对“发霉”问题：\n`
      analysisText += `   - 优化仓储条件：温度控制在0-4℃，湿度控制在60%以下\n`
      analysisText += `   - 实施先进先出（FIFO）库存管理\n`
      analysisText += `   - 缩短产品在途时间，加快周转\n\n`
      
      analysisText += `4. 预防措施：\n`
      analysisText += `   - 建立每日质量巡检制度\n`
      analysisText += `   - 启动高风险问题红线预警机制\n`
      analysisText += `   - 要求所有质量投诉24小时内闭环处理`
      
    } else if (prompt.includes('400') && prompt.includes('区域') && prompt.includes('TOP3')) {
      // 400线下问题分区域分析
      const regionStats = new Map<string, Map<string, number>>()
      calls30.forEach(c => {
        if (!regionStats.has(c.region)) regionStats.set(c.region, new Map())
        const types = regionStats.get(c.region)!
        types.set(c.type, (types.get(c.type) || 0) + 1)
      })
      
      analysisText = `【近一个月400来电分区域问题TOP3分析】\n\n`
      
      regionStats.forEach((types, region) => {
        const sorted = Array.from(types.entries()).sort((a,b) => b[1] - a[1]).slice(0, 3)
        analysisText += `■ ${region}地区：\n`
        sorted.forEach((item, idx) => {
          analysisText += `  ${idx + 1}. ${item[0]}：${item[1]}次\n`
        })
        analysisText += `\n`
      })
      
      analysisText += `【区域性建议】\n\n`
      analysisText += `1. 青岛市北区：\n`
      analysisText += `   - 重点问题：渠道咨询、质量投诉\n`
      analysisText += `   - 措施：增设2家清晨提货点（浮山后批发市场附近）\n`
      analysisText += `   - 安排专人负责B2B客户对接\n\n`
      
      analysisText += `2. 黄岛区：\n`
      analysisText += `   - 重点问题：质量投诉、渠道咨询\n`
      analysisText += `   - 措施：加强运输冷链管控，减少产品变质\n`
      analysisText += `   - 开发更多合作代理商\n\n`
      
      analysisText += `3. 济南/潍坊区域：\n`
      analysisText += `   - 重点问题：价格咨询、售后流程\n`
      analysisText += `   - 措施：制定明确的区域价格政策\n`
      analysisText += `   - 简化退换货流程，提高处理效率\n\n`
      
      analysisText += `4. 统一措施：\n`
      analysisText += `   - 编制《400客服标准话术手册》\n`
      analysisText += `   - 建立FAQ知识库，快速响应常见问题\n`
      analysisText += `   - 每周进行客服培训，提升服务质量`
      
    } else if (prompt.includes('售后服务报告')) {
      // 综合售后服务报告
      analysisText = '正在生成综合分析报告...\n\n报告已准备完成，请点击下方"查看完整报告"按钮查看详细内容。'
      setShowReport(true)
      
    } else {
      // 默认分析
      const topIssue = issueCount.sort((a,b)=>b.count-a.count)[0]?.issue || '无'
      const topCall = callTypeStats.sort((a,b)=>b.count-a.count)[0]?.type || '无'
      analysisText = `问题总览：近30天共接收电商平台反馈${ecommerce30.length}条，400来电${calls30.length}条。\n`+
        `电商平台TOP问题：${topIssue}；400来电TOP类型：${topCall}。\n`+
        `建议：1）针对"${topIssue}"建立专项排查与复盘；2）为"${topCall}"编写SOP与话术并在市北/黄岛优先试点；3）建立高风险问题（异物、不新鲜）红线预警，要求24小时闭环。\n`+
        `以上为依据当前聚合数据生成的自动分析（Prompt: ${prompt}）。`
    }
    
    setAnswer(analysisText)
    setLoading(false)
  }

  const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6']
  
  // 下载报告（模拟）
  const downloadReport = async () => {
    // 模拟下载延迟
    await delay(1000)
    
    // 模拟成功提示
    alert(`报告下载成功！\n文件名：售后服务综合分析报告_${new Date().toISOString().split('T')[0]}.pdf`)
    
    console.log('模拟下载PDF报告：售后服务综合分析报告')
  }

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
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
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
                    <th className="px-3 py-2 text-left">产品及问题</th>
                    <th className="px-3 py-2 text-left">处理结果</th>
                  </tr>
                </thead>
                <tbody>
                  {ecommerce30.map(f => (
                    <tr key={f.id} className="border-t">
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(f.createdAt)}</td>
                      <td className="px-3 py-2">{f.product} - {f.issue}</td>
                      <td className="px-3 py-2 text-gray-600">{f.result}</td>
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
      
      {/* 完整报告 */}
      {showReport && (
        <div id="report-section" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                售后服务综合分析报告
              </h3>
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                下载PDF
              </button>
            </div>

            <div id="service-report" className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">售后服务综合分析报告</h1>
                <p className="text-gray-600 mt-2">生成日期：{formatDate(new Date())}</p>
              </div>

              <div className="space-y-8">
                {/* 执行摘要 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">一、执行摘要</h2>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      本报告基于近30天收集的{ecommerce30.length + calls30.length}条售后服务数据，
                      其中电商平台反馈{ecommerce30.length}条，400来电{calls30.length}条。
                      通过AI智能分析，深入洞察产品质量问题、服务短板和改进机会。
                    </p>
                  </div>
                </section>

                {/* 关键指标 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">二、关键指标</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{ecommerce30.length + calls30.length}</div>
                      <div className="text-sm text-gray-600 mt-1">总投诉量</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {ecommerce30.filter(e => e.issue.includes('毛发') || e.issue.includes('异物')).length + 
                         calls30.filter(c => c.type === '质量投诉').length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">质量问题</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {ecommerce30.filter(e => e.result.includes('1000')).length}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">高额赔付</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((ecommerce30.length + calls30.length) / 30).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">日均投诉</div>
                    </div>
                  </div>
                </section>

                {/* 问题分布 */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">三、问题分布分析</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 电商平台主要问题</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">问题类型</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">占比</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {issueCount.sort((a,b) => b.count - a.count).slice(0, 5).map(item => (
                              <tr key={item.issue}>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.issue}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.count}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {((item.count / ecommerce30.length) * 100).toFixed(1)}%
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.issue.includes('毛发') || item.issue.includes('异物') 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.issue.includes('毛发') || item.issue.includes('异物') ? '高' : '中'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 400来电类型分布</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {callTypeStats.map(item => (
                          <div key={item.type} className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                            <div className="text-sm text-gray-600 mt-1">{item.type}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {((item.count / calls30.length) * 100).toFixed(1)}%
                            </div>
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
                      <li><strong>1. 紧急措施（一周内）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 成立"毛发问题"专项整改小组</li>
                          <li>• 对所有生产线进行彻底清洁和消毒</li>
                          <li>• 加强员工个人卫生管理</li>
                        </ul>
                      </li>
                      <li><strong>2. 短期措施（一个月内）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 升级质量检测设备</li>
                          <li>• 优化仓储环境和流程</li>
                          <li>• 建立全流程追溯体系</li>
                        </ul>
                      </li>
                      <li><strong>3. 长期措施（三个月内）：</strong>
                        <ul className="mt-1 ml-4 text-sm space-y-1">
                          <li>• 导入ISO 22000食品安全管理体系</li>
                          <li>• 建立供应商质量评估体系</li>
                          <li>• 开发智能质量监控系统</li>
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
                      通过本次综合分析，我们识别了售后服务中的关键问题和改进点。
                      产品质量问题特别是毛发、异物等问题需要立即采取行动。
                      建议企业建立全面的质量管理体系，持续改进服务质量，
                      提升客户满意度，实现可持续发展。
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

