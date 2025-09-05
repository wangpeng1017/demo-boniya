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

  // 模拟AI深度洞察分析
  static async generateAIInsights(feedback: {
    id: string
    originalComment: string
    platform: string
    sentiment: 'positive' | 'neutral' | 'negative'
    issues: string[]
    urgency: 'high' | 'medium' | 'low'
    productName?: string
  }): Promise<{
    intelligentCategorization: {
      primaryCategory: string
      secondaryCategories: string[]
      confidence: number
    }
    keywordExtraction: {
      keywords: string[]
      phrases: string[]
      emotions: string[]
    }
    deepAnalysis: {
      rootCause: string
      impactAssessment: string
      recommendedActions: string[]
      similarCases: number
      urgencyReason: string
    }
  }> {
    await delay(1500 + Math.random() * 1000)

    const comment = feedback.originalComment

    // 智能分类
    let primaryCategory = '产品质量问题'
    let secondaryCategories: string[] = []

    if (comment.includes('包装') || comment.includes('破损') || comment.includes('漏')) {
      primaryCategory = '包装问题'
      secondaryCategories = ['包装破损', '密封不良', '外观缺陷']
    } else if (comment.includes('异物') || comment.includes('头发') || comment.includes('毛发') || comment.includes('脏')) {
      primaryCategory = '食品安全问题'
      secondaryCategories = ['异物污染', '卫生问题', '生产环境']
    } else if (comment.includes('不新鲜') || comment.includes('变质') || comment.includes('过期') || comment.includes('臭')) {
      primaryCategory = '产品质量问题'
      secondaryCategories = ['新鲜度问题', '保质期管理', '储存条件']
    } else if (comment.includes('物流') || comment.includes('配送') || comment.includes('慢') || comment.includes('快递')) {
      primaryCategory = '物流服务问题'
      secondaryCategories = ['配送延迟', '物流损坏', '服务态度']
    } else if (comment.includes('客服') || comment.includes('服务') || comment.includes('态度')) {
      primaryCategory = '客户服务问题'
      secondaryCategories = ['响应速度', '服务态度', '专业能力']
    } else if (comment.includes('价格') || comment.includes('贵') || comment.includes('便宜')) {
      primaryCategory = '价格问题'
      secondaryCategories = ['性价比', '定价策略', '促销活动']
    }

    // 关键词提取
    const keywords: string[] = []
    const phrases: string[] = []
    const emotions: string[] = []

    // 提取关键词
    const keywordPatterns = [
      '包装', '破损', '异物', '头发', '不新鲜', '变质', '过期', '物流', '配送', '客服', '服务', '价格', '质量', '味道', '新鲜'
    ]
    keywordPatterns.forEach(pattern => {
      if (comment.includes(pattern)) {
        keywords.push(pattern)
      }
    })

    // 提取短语
    const phrasePatterns = [
      '包装破损', '食品安全', '不新鲜', '客服态度', '物流速度', '产品质量', '服务态度', '配送延迟'
    ]
    phrasePatterns.forEach(pattern => {
      if (comment.includes(pattern.split('').join('.*'))) {
        phrases.push(pattern)
      }
    })

    // 情感词汇
    const emotionPatterns = [
      { words: ['失望', '不满', '愤怒', '生气'], emotion: '负面情绪' },
      { words: ['满意', '开心', '喜欢', '不错'], emotion: '正面情绪' },
      { words: ['担心', '害怕', '恶心', '恐惧'], emotion: '恐惧担忧' },
      { words: ['希望', '期待', '建议'], emotion: '期望建议' }
    ]
    emotionPatterns.forEach(({ words, emotion }) => {
      if (words.some(word => comment.includes(word))) {
        emotions.push(emotion)
      }
    })

    // 深度分析
    let rootCause = ''
    let impactAssessment = ''
    let recommendedActions: string[] = []
    let urgencyReason = ''

    if (primaryCategory === '食品安全问题') {
      rootCause = '生产过程中的卫生控制不严格，可能存在生产环境污染或操作不规范'
      impactAssessment = '高风险：食品安全问题可能影响品牌声誉，需要立即处理以避免更大范围的负面影响'
      recommendedActions = [
        '立即联系客户进行产品召回和退换',
        '启动内部质量调查，检查生产环节',
        '加强生产线卫生管理和员工培训',
        '考虑发布公开声明说明改进措施'
      ]
      urgencyReason = '食品安全问题涉及消费者健康，可能引发监管关注和媒体报道'
    } else if (primaryCategory === '包装问题') {
      rootCause = '包装材料质量不达标或运输过程中的保护措施不足'
      impactAssessment = '中等风险：影响产品外观和消费体验，可能导致客户流失'
      recommendedActions = [
        '检查包装供应商的质量标准',
        '优化物流包装保护措施',
        '为客户提供免费换货服务',
        '建立包装质量监控机制'
      ]
      urgencyReason = '包装问题直接影响产品完整性，需要及时处理避免客户不满'
    } else if (primaryCategory === '产品质量问题') {
      rootCause = '产品储存条件不当或供应链管理存在漏洞'
      impactAssessment = '高风险：产品质量直接关系到品牌信誉和客户忠诚度'
      recommendedActions = [
        '检查产品储存和运输的温度控制',
        '审查供应商的质量管理体系',
        '加强产品保质期管理',
        '建立产品质量追溯系统'
      ]
      urgencyReason = '产品质量问题可能影响消费者健康和品牌形象'
    } else {
      rootCause = '服务流程不完善或员工培训不足'
      impactAssessment = '中等风险：影响客户满意度和服务体验'
      recommendedActions = [
        '加强员工服务培训',
        '优化服务流程和响应机制',
        '建立客户反馈快速处理通道',
        '定期进行服务质量评估'
      ]
      urgencyReason = '服务问题影响客户体验，需要及时改进'
    }

    // 模拟相似案例数量
    const similarCases = Math.floor(Math.random() * 20) + 1

    return {
      intelligentCategorization: {
        primaryCategory,
        secondaryCategories,
        confidence: 0.85 + Math.random() * 0.12
      },
      keywordExtraction: {
        keywords: keywords.slice(0, 5), // 最多5个关键词
        phrases: phrases.slice(0, 3),   // 最多3个短语
        emotions: emotions.slice(0, 2)  // 最多2个情感
      },
      deepAnalysis: {
        rootCause,
        impactAssessment,
        recommendedActions,
        similarCases,
        urgencyReason
      }
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

  // 模拟批量AI洞察分析
  static async generateBatchInsights(feedbackList: Array<{
    id: string
    originalComment: string
    platform: string
    sentiment: 'positive' | 'neutral' | 'negative'
    issues: string[]
    urgency: 'high' | 'medium' | 'low'
    productName?: string
    commentTime: string
  }>): Promise<{
    overallSentiment: {
      positive: number
      neutral: number
      negative: number
      totalCount: number
    }
    issueStatistics: {
      category: string
      count: number
      percentage: number
      trend: 'increasing' | 'stable' | 'decreasing'
    }[]
    urgentIssues: {
      summary: string
      count: number
      topIssues: string[]
      affectedPlatforms: string[]
    }
    trendAnalysis: {
      weeklyTrend: string
      platformComparison: {
        platform: string
        negativeRate: number
        mainIssues: string[]
      }[]
      recommendations: string[]
    }
    keyInsights: string[]
  }> {
    await delay(2000 + Math.random() * 1000)

    const totalCount = feedbackList.length

    // 整体情感分布
    const sentimentCounts = feedbackList.reduce((acc, item) => {
      acc[item.sentiment]++
      return acc
    }, { positive: 0, neutral: 0, negative: 0 })

    // 问题类型统计
    const issueMap = new Map<string, number>()
    feedbackList.forEach(item => {
      item.issues.forEach(issue => {
        const category = issue.split('-')[0] || issue
        issueMap.set(category, (issueMap.get(category) || 0) + 1)
      })
    })

    const issueStatistics = Array.from(issueMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalCount) * 100),
        trend: Math.random() > 0.6 ? 'increasing' as const :
               Math.random() > 0.3 ? 'stable' as const : 'decreasing' as const
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // 取前8个主要问题

    // 紧急问题汇总
    const urgentFeedback = feedbackList.filter(item => item.urgency === 'high')
    const urgentIssueMap = new Map<string, number>()
    urgentFeedback.forEach(item => {
      item.issues.forEach(issue => {
        urgentIssueMap.set(issue, (urgentIssueMap.get(issue) || 0) + 1)
      })
    })

    const topUrgentIssues = Array.from(urgentIssueMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue]) => issue)

    const affectedPlatforms = Array.from(new Set(urgentFeedback.map(item => item.platform)))

    // 平台对比分析
    const platformMap = new Map<string, { total: number, negative: number, issues: string[] }>()
    feedbackList.forEach(item => {
      if (!platformMap.has(item.platform)) {
        platformMap.set(item.platform, { total: 0, negative: 0, issues: [] })
      }
      const platformData = platformMap.get(item.platform)!
      platformData.total++
      if (item.sentiment === 'negative') {
        platformData.negative++
      }
      platformData.issues.push(...item.issues)
    })

    const platformComparison = Array.from(platformMap.entries()).map(([platform, data]) => {
      const negativeRate = Math.round((data.negative / data.total) * 100)
      const issueCount = new Map<string, number>()
      data.issues.forEach(issue => {
        const category = issue.split('-')[0] || issue
        issueCount.set(category, (issueCount.get(category) || 0) + 1)
      })
      const mainIssues = Array.from(issueCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([issue]) => issue)

      return {
        platform,
        negativeRate,
        mainIssues
      }
    })

    // 生成关键洞察
    const keyInsights = [
      `共分析${totalCount}条客户反馈，负面反馈占比${Math.round((sentimentCounts.negative / totalCount) * 100)}%`,
      `主要问题集中在${issueStatistics.slice(0, 3).map(item => item.category).join('、')}方面`,
      `${urgentFeedback.length}条反馈被标记为高紧急度，需要优先处理`,
      `${platformComparison.find(p => p.negativeRate === Math.max(...platformComparison.map(p => p.negativeRate)))?.platform}平台负面反馈率最高`,
      issueStatistics.some(item => item.trend === 'increasing') ?
        `${issueStatistics.filter(item => item.trend === 'increasing').map(item => item.category).join('、')}问题呈上升趋势，需要重点关注` :
        '各类问题趋势相对稳定，但仍需持续监控'
    ]

    // 生成建议
    const recommendations = [
      '建议优先处理食品安全和产品质量相关的高紧急度反馈',
      '加强与负面反馈率较高平台的沟通协调，改善服务质量',
      '针对主要问题类型制定专项改进计划',
      '建立客户反馈快速响应机制，提升处理效率',
      '定期分析反馈趋势，预防问题扩大化'
    ]

    return {
      overallSentiment: {
        positive: sentimentCounts.positive,
        neutral: sentimentCounts.neutral,
        negative: sentimentCounts.negative,
        totalCount
      },
      issueStatistics,
      urgentIssues: {
        summary: `发现${urgentFeedback.length}条高紧急度反馈，主要涉及${topUrgentIssues.slice(0, 2).join('、')}等问题`,
        count: urgentFeedback.length,
        topIssues: topUrgentIssues,
        affectedPlatforms
      },
      trendAnalysis: {
        weeklyTrend: totalCount > 50 ? '本周反馈量较上周增长15%，需要关注问题趋势' : '本周反馈量正常，整体情况稳定',
        platformComparison,
        recommendations
      },
      keyInsights
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
