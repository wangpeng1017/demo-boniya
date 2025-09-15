'use client'

import { useState, useMemo, useRef } from 'react'
import { Upload, Headphones, Play, Pause, FilePlus2, ChevronDown, ChevronUp, User, AlertCircle, Target, DollarSign, CheckCircle } from 'lucide-react'
import { delay, formatDateTime } from '@/lib/utils'

interface RecordingItem {
  id: string
  fileName: string
  size: string
  source?: string
  url?: string
  transcript?: string
  aiSummary?: string
  uploadTime: Date
}

const SAMPLE_TRANSCRIPT = `客服: 孙女士。
客户: 你好。
客服: 嗯，是这样，就是我们是给一个单位供货的，就是他偶尔会要咱们家的产品。
客服: 嗯。
客户: 但是我...我不知道咱们是去哪个渠道可以直接买到咱厂家的东西，因为他早晨都要的很早。
客服: 嗯。
客户: 嗯。
客服: 所以...早上要的很早是吧？您是...您什么意思？就是说如果要的话，直接给您送过去，是这个意思吗？
客户: 不，我可以找个地方去拿，他只要他开门就行。
客服: 哦，开门...您大概几点...您是在哪个区？
客户: 我在市北区。
客服: 市北是吧？
客户: 嗯，就离着浮山后批发市场就不远。
客服: 浮山后批发市场附近是吧？他那边开门...您是...他那边开门是不是有点晚，您去拿？
客户: 我不知道你...我都不知道你店在哪有。
客服: 哦...我知道市场上是有一个，市场上有一个...但是具体在哪，我这个我还真不是...不太清楚，因为我知道浮山后市场是有一个门店。这样，我把那个浮山后市场那边的一个负责业务，我把他电话给您，呃，然后...然后到时候让他跟您说哪个店能行，因为...
客户: 因为...对，因为他就是...因为我说白了，我不可能是我去零售买这些给给它送去，那不合适，这个价格...
客服: 啊，对。
客户: 这个价格是跟你们厂家有什么区别吗？
客服: 呃，我这边还真没有价格。
客户: 哦...就是...我的意思就是，你给我这个店，它跟...基本从厂家或者从哪儿买，它肯定不能跟我零售买一个价，是这意思吧？
客服: 对，肯定是，应该是吧，因为我们厂家...厂家他...他会给你这个电话吧，是...您不是离着浮山后市场近嘛。
客户: 嗯。
客服: 嗯，这是一个业务的电话，然后业务您看业务到时候，您跟他说一下您这边的需求，然后看他给您...您就说要要一个便宜点的嘛，看他那边能不能找一个，因为他们谁家便宜了，谁家贵，或者是怎么回事，这个我这边还真不太清楚。
客户: 行，行，那你给我电话吧，好好。
客服: 啊，行，您稍等一下，我给您查。
客户: 呃...你得跟我说我记是吧？
客服: 啊，您记一下。
客户: 你说吧，嗯。
客服: 嗯...178
客户: 178
客服: 6029
客户: 6029
客服: 4850
客户: 4850，是吧？
客服: 啊对，他姓杨。
客户: 好嘞，好嘞。
客服: 啊，您问一下他。
客户: 好，谢谢啊。
客服: 啊不客气，好，再见。
客户: 嗯，好。`

const SAMPLE_SUMMARY = `客户情绪
客户情绪平和、清晰。他的沟通方式直接且有礼貌，主要目的是为了解决一个具体的业务问题，整个通话过程是合作和高效的。
关键点
客户身份与需求：
客户是B2B供应商，需要为他的一个单位客户采购该公司的产品。
核心需求是清晨提货（“早晨都要的很早”），常规零售店的营业时间可能无法满足。
核心问题：
客户不清楚应该通过哪个渠道购买才能满足他的业务需求（时间和价格）。
他希望找到一个能直接对接厂家或提供批发价的购买点，而不是普通的零售店。
客户位于市北区，希望提货点在浮山后批发市场附近。
价格诉求：
客户明确表示，他不能以零售价购买后再供给他的客户（“那不合适”）。
他需要一个比零售价更优惠的价格（“要一个便宜点的”），以保证其业务的合理性。
解决方案与结果：
客服虽然不清楚门店的具体位置和价格体系，但提供了一个有效的解决方案。
客服将负责浮山后市场区域的业务员（杨先生）的电话提供给了客户。
客服建议客户直接联系该业务员，说明自己的具体需求（清晨提货、批发价格等），由业务员进行协调和安排。
客户接受了这个解决方案，并对客服表示感谢，通话在友好氛围中结束。`

// AI总结展示组件
function AISummaryDisplay({ summary }: { summary: string }) {
  // 解析AI总结内容
  const sections = summary.split('\n').reduce((acc, line) => {
    if (line.includes('客户情绪')) {
      acc.currentSection = '客户情绪'
      acc.sections[acc.currentSection] = []
    } else if (line.includes('关键点')) {
      acc.currentSection = '关键点'
      acc.sections[acc.currentSection] = []
    } else if (line.includes('客户身份与需求：')) {
      acc.currentSubSection = '客户身份与需求'
    } else if (line.includes('核心问题：')) {
      acc.currentSubSection = '核心问题'
    } else if (line.includes('价格诉求：')) {
      acc.currentSubSection = '价格诉求'
    } else if (line.includes('解决方案与结果：')) {
      acc.currentSubSection = '解决方案与结果'
    } else if (line.trim() && acc.currentSection) {
      if (!acc.sections[acc.currentSection]) acc.sections[acc.currentSection] = []
      acc.sections[acc.currentSection].push({ subSection: acc.currentSubSection, content: line.trim() })
    }
    return acc
  }, { sections: {}, currentSection: '', currentSubSection: '' } as any)

  return (
    <div className="space-y-4">
      {/* 客户情绪 */}
      {sections.sections['客户情绪'] && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-base font-semibold text-blue-900 mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            客户情绪
          </h4>
          <p className="text-sm text-gray-700">
            {sections.sections['客户情绪'].map((item: any) => item.content).join(' ')}
          </p>
        </div>
      )}

      {/* 关键点 */}
      {sections.sections['关键点'] && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            关键点
          </h4>
          <div className="space-y-3">
            {/* 客户身份与需求 */}
            {sections.sections['关键点'].filter((item: any) => item.subSection === '客户身份与需求').length > 0 && (
              <div className="pl-4 border-l-2 border-primary-300">
                <h5 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  客户身份与需求
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {sections.sections['关键点']
                    .filter((item: any) => item.subSection === '客户身份与需求')
                    .map((item: any, idx: number) => (
                      <li key={idx} className="pl-4">• {item.content}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* 核心问题 */}
            {sections.sections['关键点'].filter((item: any) => item.subSection === '核心问题').length > 0 && (
              <div className="pl-4 border-l-2 border-yellow-300">
                <h5 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
                  核心问题
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {sections.sections['关键点']
                    .filter((item: any) => item.subSection === '核心问题')
                    .map((item: any, idx: number) => (
                      <li key={idx} className="pl-4">• {item.content}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* 价格诉求 */}
            {sections.sections['关键点'].filter((item: any) => item.subSection === '价格诉求').length > 0 && (
              <div className="pl-4 border-l-2 border-green-300">
                <h5 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                  价格诉求
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {sections.sections['关键点']
                    .filter((item: any) => item.subSection === '价格诉求')
                    .map((item: any, idx: number) => (
                      <li key={idx} className="pl-4">• {item.content}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* 解决方案与结果 */}
            {sections.sections['关键点'].filter((item: any) => item.subSection === '解决方案与结果').length > 0 && (
              <div className="pl-4 border-l-2 border-blue-300">
                <h5 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-blue-600" />
                  解决方案与结果
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {sections.sections['关键点']
                    .filter((item: any) => item.subSection === '解决方案与结果')
                    .map((item: any, idx: number) => (
                      <li key={idx} className="pl-4">• {item.content}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function After400Page() {
  const [list, setList] = useState<RecordingItem[]>([
    { id: 'r1', fileName: '163637.mp3', size: '1.4M', source: '微信电脑版', transcript: SAMPLE_TRANSCRIPT, aiSummary: SAMPLE_SUMMARY, uploadTime: new Date(Date.now() - 2 * 3600000) },
    { id: 'r2', fileName: '162806.mp3', size: '1.2M', source: '微信电脑版', uploadTime: new Date(Date.now() - 5 * 3600000) },
    { id: 'r3', fileName: '165609.mp3', size: '1.1M', source: '微信电脑版', uploadTime: new Date(Date.now() - 24 * 3600000) },
    { id: 'r4', fileName: '163110.mp3', size: '363K', source: '微信电脑版', uploadTime: new Date(Date.now() - 48 * 3600000) },
  ])
  const [selected, setSelected] = useState<RecordingItem | null>(list[0])
  const [playing, setPlaying] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 按上传时间排序，最新的在前
  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime())
  }, [list])

  const onFiles = async (files: FileList) => {
    const arr: RecordingItem[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      arr.push({ 
        id: `up-${Date.now()}-${i}`, 
        fileName: f.name, 
        size: `${Math.round(f.size/1024)}K`, 
        source: '本地上传',
        uploadTime: new Date()
      })
    }
    await delay(200)
    setList(prev => [...arr, ...prev])
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Headphones className="w-6 h-6 mr-2 text-primary-600" />
          400售后分析
        </h1>
        <p className="text-gray-600 mt-1">400客服录音分析与智能转写</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧列表 */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">录音列表</h3>
            <button onClick={()=>fileInputRef.current?.click()} className="text-sm flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              <Upload className="w-4 h-4 mr-1"/> 批量上传
            </button>
            <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={(e)=> e.target.files && onFiles(e.target.files)} />
          </div>
          <div className="p-4 space-y-2 max-h-[70vh] overflow-auto">
            {sortedList.map(item => (
              <button key={item.id} onClick={()=>{ setSelected(item); setShowFull(false); }}
                      className={`w-full text-left p-3 border rounded-md hover:bg-gray-50 ${selected?.id===item.id?'border-primary-300 bg-primary-50':''}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900">{item.fileName}</div>
                  <div className="text-xs text-gray-500">{item.size}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">{item.source || ''}</div>
                  <div className="text-xs text-gray-400">{formatDateTime(item.uploadTime)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧详情 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {!selected ? (
            <div className="p-6 text-gray-500 text-center">请选择左侧录音查看详情</div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                <div>
                  <div className="font-semibold text-gray-900">{selected.fileName}</div>
                  <div className="text-xs text-gray-500">大小 {selected.size} · 来源 {selected.source || '—'} · {formatDateTime(selected.uploadTime)}</div>
                </div>
                <button onClick={()=>setPlaying(p=>!p)} className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm flex items-center hover:bg-primary-700">
                  {playing ? (<><Pause className="w-4 h-4 mr-1"/>暂停</>) : (<><Play className="w-4 h-4 mr-1"/>播放</>)}
                </button>
              </div>

              {/* 录音原文（折叠） */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">录音原文</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-md p-4">
                  {showFull ? (selected.transcript || '暂无转写') : (selected.transcript ? selected.transcript.slice(0, 200) + (selected.transcript.length>200?'...':'') : '暂无转写')}
                </div>
                {selected.transcript && selected.transcript.length > 200 && (
                  <button onClick={()=>setShowFull(s=>!s)} className="mt-2 text-primary-600 text-sm flex items-center hover:text-primary-700">
                    {showFull ? (<><ChevronUp className="w-4 h-4 mr-1"/>收起</>) : (<><ChevronDown className="w-4 h-4 mr-1"/>查看更多</>)}
                  </button>
                )}
              </div>

              {/* AI总结 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI总结</h3>
                {selected.aiSummary ? (
                  <AISummaryDisplay summary={selected.aiSummary} />
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-4">
                    点击"语音转文字/分析"后将展示AI总结
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

