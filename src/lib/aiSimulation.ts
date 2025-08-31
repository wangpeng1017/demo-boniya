import { delay } from './utils'

// 模拟Gemini AI分析功能
export class GeminiSimulator {
  
  // 模拟销售预测AI分析
  static async generateSalesForecastReport(data: {
    productName: string
    storeName: string
    forecastData: Array<{ date: string; predicted: number }>
    externalFactors?: string[]
  }): Promise<{
    summary: string
    keyInsights: string[]
    recommendations: string[]
    riskFactors: string[]
  }> {
    await delay(2000 + Math.random() * 1000) // 模拟API调用延迟

    const totalPredicted = data.forecastData.reduce((sum, item) => sum + item.predicted, 0)
    const avgDaily = Math.round(totalPredicted / data.forecastData.length * 100) / 100

    return {
      summary: `基于历史销售数据和AI算法分析，${data.productName}在${data.storeName}的预测销量呈现${avgDaily > 30 ? '稳中有升' : '平稳'}的趋势。本周预计总销量${Math.round(totalPredicted)}千克，日均销量${avgDaily}千克，预测准确率达到94.2%。`,
      keyInsights: [
        `周末销量预计较工作日增长${Math.round(20 + Math.random() * 20)}%`,
        `该产品受天气影响${Math.random() > 0.5 ? '较小' : '中等'}，销量相对稳定`,
        `与去年同期相比，销量增长${Math.round(8 + Math.random() * 10)}%`,
        `客户复购率较高，品牌忠诚度${Math.random() > 0.3 ? '良好' : '一般'}`
      ],
      recommendations: [
        `建议本周总备货量：${Math.round(totalPredicted * 1.1)}千克`,
        '重点关注周五下午和周六上午的补货时机',
        Math.random() > 0.5 ? '可考虑在周末推出小幅促销活动' : '建议保持现有价格策略',
        '建议与供应商协调，确保周末前货源充足'
      ],
      riskFactors: [
        '如遇恶劣天气，销量可能下降15-20%',
        '附近竞争对手促销活动可能影响销量',
        '节假日前后消费习惯变化需要关注',
        '原材料价格波动可能影响成本控制'
      ]
    }
  }

  // 模拟竞品价格数据结构化
  static async structureCompetitorData(rawText: string): Promise<{
    brand: string
    productName: string
    specifications: string
    price: number
  } | null> {
    await delay(1500 + Math.random() * 500)

    // 简单的文本解析模拟
    const brands = ['喜旺', '双汇', '金锣']
    const detectedBrand = brands.find(brand => rawText.includes(brand)) || '其他'
    
    // 提取价格（简单正则）
    const priceMatch = rawText.match(/(\d+\.?\d*)[元块]/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : Math.round((Math.random() * 30 + 10) * 100) / 100

    // 提取规格
    const specMatch = rawText.match(/(\d+[克g])/);
    const specifications = specMatch ? specMatch[1] : '未知规格'

    // 提取产品名称（简化处理）
    let productName = '未知产品'
    if (rawText.includes('火腿')) productName = '火腿'
    else if (rawText.includes('烤肠')) productName = '烤肠'
    else if (rawText.includes('香肠')) productName = '香肠'

    return {
      brand: detectedBrand,
      productName: `${detectedBrand}${productName}`,
      specifications,
      price
    }
  }

  // 模拟客户反馈多维度分析
  static async analyzeFeedback(comment: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    issues: string[]
    urgency: 'high' | 'medium' | 'low'
    summary: string
  }> {
    await delay(1000 + Math.random() * 1000)

    // 简单的情感分析
    const negativeWords = ['不好', '差', '坏', '臭', '恶心', '不满', '投诉', '退货', '问题']
    const positiveWords = ['好', '不错', '满意', '喜欢', '推荐', '赞', '棒', '优秀']
    
    const hasNegative = negativeWords.some(word => comment.includes(word))
    const hasPositive = positiveWords.some(word => comment.includes(word))
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (hasNegative && !hasPositive) sentiment = 'negative'
    else if (hasPositive && !hasNegative) sentiment = 'positive'

    // 问题分类
    const issues: string[] = []
    if (comment.includes('包装') && (comment.includes('破') || comment.includes('漏'))) {
      issues.push('包装问题-破损')
    }
    if (comment.includes('异物') || comment.includes('头发') || comment.includes('毛发')) {
      issues.push('产品质量-异物')
    }
    if (comment.includes('不新鲜') || comment.includes('变质') || comment.includes('过期')) {
      issues.push('产品质量-不新鲜')
    }
    if (comment.includes('物流') || comment.includes('配送') || comment.includes('慢')) {
      issues.push('物流问题-速度慢')
    }
    if (comment.includes('客服') || comment.includes('服务')) {
      issues.push('客服问题')
    }

    // 紧急程度
    let urgency: 'high' | 'medium' | 'low' = 'low'
    if (issues.some(issue => issue.includes('异物') || issue.includes('不新鲜')) || 
        comment.includes('食品安全')) {
      urgency = 'high'
    } else if (sentiment === 'negative') {
      urgency = 'medium'
    }

    // 生成摘要
    let summary = ''
    if (sentiment === 'positive') {
      summary = '客户对产品和服务表示满意'
    } else if (sentiment === 'negative') {
      if (issues.length > 0) {
        summary = `客户反映${issues[0].split('-')[1] || issues[0]}问题，需要及时处理`
      } else {
        summary = '客户表达不满情绪，需要关注'
      }
    } else {
      summary = '客户反馈中性，建议跟进了解详情'
    }

    return {
      sentiment,
      issues,
      urgency,
      summary
    }
  }

  // 模拟语音转文字
  static async transcribeAudio(audioUrl: string): Promise<string> {
    await delay(3000 + Math.random() * 2000)

    const mockTranscriptions = [
      "客户反映购买的火腿肠中发现了一根头发，感到非常不满，要求退货并赔偿。客户情绪比较激动，需要耐心处理。",
      "客户咨询新产品的营养成分和保质期信息，态度友好，表示对品牌很信任。",
      "客户投诉物流配送延迟，订单已下单三天但仍未收到货物，要求尽快处理。",
      "客户对产品质量表示满意，但建议改进包装设计，使其更加环保。"
    ]

    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
  }

  // 模拟OCR文字识别
  static async performOCR(imageUrl: string): Promise<string> {
    await delay(2000 + Math.random() * 1000)

    const mockOCRResults = [
      "喜旺手掰肉老火腿340g 22.9元",
      "双汇王中王火腿肠 30g*8支 15.8元",
      "金锣肉粒多香肠 240g 12.5元",
      "喜旺烤肠160g 7.9元",
      "双汇玉米热狗肠 40g*10支 18.9元"
    ]

    return mockOCRResults[Math.floor(Math.random() * mockOCRResults.length)]
  }

  // 模拟产品识别
  static async recognizeProduct(imageUrl: string): Promise<{
    productId: string
    productName: string
    confidence: number
  }[]> {
    await delay(2500 + Math.random() * 1500)

    const mockProducts = [
      { productId: 'P001', productName: '维也纳香肠', confidence: 0.92 + Math.random() * 0.06 },
      { productId: 'P002', productName: '猪头肉', confidence: 0.88 + Math.random() * 0.08 },
      { productId: 'P003', productName: '酱猪耳', confidence: 0.85 + Math.random() * 0.10 },
      { productId: 'P004', productName: '蒜味烤肠', confidence: 0.90 + Math.random() * 0.08 }
    ]

    // 返回1-2个识别结果
    const numResults = Math.random() > 0.7 ? 2 : 1
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numResults).sort((a, b) => b.confidence - a.confidence)
  }

  // 模拟质量检测
  static async performQualityCheck(imageUrl: string, checkType: string): Promise<{
    result: 'pass' | 'fail' | 'warning'
    defects: string[]
    confidence: number
    notes?: string
  }> {
    await delay(3000 + Math.random() * 2000)

    const possibleDefects = [
      '异物-毛发',
      '异物-塑料',
      '包装破损',
      '标签偏移',
      '颜色异常',
      '形状不规则',
      '表面污渍'
    ]

    const passRate = 0.8 // 80%通过率
    const warningRate = 0.15 // 15%警告率
    
    const random = Math.random()
    let result: 'pass' | 'fail' | 'warning'
    let defects: string[] = []
    let notes: string | undefined

    if (random < passRate) {
      result = 'pass'
    } else if (random < passRate + warningRate) {
      result = 'warning'
      defects = [possibleDefects[Math.floor(Math.random() * possibleDefects.length)]]
      notes = '发现轻微问题，建议关注'
    } else {
      result = 'fail'
      const numDefects = Math.random() > 0.7 ? 2 : 1
      defects = possibleDefects.sort(() => 0.5 - Math.random()).slice(0, numDefects)
      notes = '发现严重质量问题，需要立即处理'
    }

    return {
      result,
      defects,
      confidence: 0.85 + Math.random() * 0.12,
      notes
    }
  }
}

// 导出一些常用的模拟函数
export const simulateApiCall = async <T>(data: T, minDelay = 1000, maxDelay = 3000): Promise<T> => {
  await delay(minDelay + Math.random() * (maxDelay - minDelay))
  return data
}

export const generateMockId = (prefix = 'ID'): string => {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export const simulateError = (probability = 0.1): boolean => {
  return Math.random() < probability
}
