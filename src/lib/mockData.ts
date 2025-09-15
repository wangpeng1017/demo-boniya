import { SalesData, SalesForecast, Store, Product, CompetitorPrice, CustomerFeedback } from '@/types'

// 门店数据
export const mockStores: Store[] = [
  { id: '1', name: '利客来城阳直营专柜', address: '青岛市城阳区', region: '青岛办事处', status: 'active' },
  { id: '2', name: '家乐福市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '3', name: '银座历下专柜', address: '济南市历下区', region: '济南办事处', status: 'active' },
  { id: '4', name: '大润发芝罘专柜', address: '烟台市芝罘区', region: '烟台办事处', status: 'active' },
  { id: '5', name: '华联即墨专柜', address: '青岛市即墨区', region: '青岛办事处', status: 'active' },
  { id: '6', name: '沃尔玛李沧专柜', address: '青岛市李沧区', region: '青岛办事处', status: 'active' },
  { id: '7', name: '银座槐荫专柜', address: '济南市槐荫区', region: '济南办事处', status: 'active' },
  { id: '8', name: '大润发市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '9', name: '家乐福市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '10', name: '华联市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '11', name: '银座市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '12', name: '沃尔玛市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '13', name: '大润发市北二店', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '14', name: '华润万家市北专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
]

// 产品数据
export const mockProducts: Product[] = [
  { id: '1', code: 'B2102-026', name: '肉枣肠', category: '烤肠类', unit: '千克', price: 28.5 },
  { id: '2', code: 'B2103-022', name: '酱猪耳', category: '酱卤类', unit: '千克', price: 45.0 },
  { id: '3', code: 'B2103-025', name: '酱猪肝', category: '酱卤类', unit: '千克', price: 38.0 },
  { id: '4', code: 'B2102-022', name: '蒜味烤肠', category: '烤肠类', unit: '千克', price: 32.0 },
  { id: '5', code: 'B2102-025', name: '维也纳香肠', category: '烤肠类', unit: '千克', price: 35.0 },
  { id: '6', code: 'B2103-021', name: '猪头肉', category: '酱卤类', unit: '千克', price: 42.0 },
  { id: '7', code: 'B2102-030', name: '珍味肠', category: '烤肠类', unit: '千克', price: 30.0 },
]

// 历史销售数据
export const mockSalesData: SalesData[] = [
  { id: '1', date: '2025-08-25', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '1', productName: '肉枣肠', actualQuantity: 0.902, unit: '千克' },
  { id: '2', date: '2025-08-25', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '2', productName: '酱猪耳', actualQuantity: 0.414, unit: '千克' },
  { id: '3', date: '2025-08-25', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '3', productName: '酱猪肝', actualQuantity: 1.74, unit: '千克' },
  { id: '4', date: '2025-08-24', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '4', productName: '蒜味烤肠', actualQuantity: 24.996, unit: '千克' },
  { id: '5', date: '2025-08-24', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '5', productName: '维也纳香肠', actualQuantity: 29.776, unit: '千克' },
  { id: '6', date: '2025-08-23', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '6', productName: '猪头肉', actualQuantity: 25.85, unit: '千克' },
  { id: '7', date: '2025-08-22', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '5', productName: '维也纳香肠', actualQuantity: 30.142, unit: '千克' },
  { id: '8', date: '2025-08-21', storeId: '1', storeName: '青岛市城阳区利客来城阳直营专柜', productId: '7', productName: '珍味肠', actualQuantity: 5.564, unit: '千克' },
]

// 销售预测数据
export const mockSalesForecasts: SalesForecast[] = [
  {
    id: '1',
    productId: '1',
    storeId: '1',
    forecastDate: '2025-09-01',
    predictedQuantity: 25.2,
    confidence: 0.94,
    geminiReport: '根据历史数据分析，肉枣肠在周一的销量预计为25.2千克。考虑到天气晴朗且无特殊活动，预测准确度较高。建议按预测量备货，并关注实际销售情况。',
    createdAt: '2025-08-31T10:00:00Z'
  },
  {
    id: '2',
    productId: '5',
    storeId: '1',
    forecastDate: '2025-09-01',
    predictedQuantity: 32.8,
    confidence: 0.91,
    geminiReport: '维也纳香肠作为热销产品，周一预测销量32.8千克。由于该产品受天气影响较小，且客户接受度高，建议适当增加备货量以防断货。',
    createdAt: '2025-08-31T10:00:00Z'
  }
]

// 竞品价格数据
// 生成扩展的竞品价格数据
export function generateExtendedCompetitorPrices(): CompetitorPrice[] {
  const locations = ['青岛办事处', '济南办事处', '烟台办事处', '城阳即墨']
  const brands = ['喜旺', '双汇', '金锣', '雨润', '得利斯', '春都', '美好', '龙大']
  const products = [
    { name: '手掰肉老火腿', specs: '340g', basePrice: 22.9 },
    { name: '无淀粉大肉块火腿', specs: '340g', basePrice: 26.9 },
    { name: '烤肠', specs: '160g', basePrice: 7.9 },
    { name: '维也纳香肠', specs: '340g', basePrice: 19.9 },
    { name: '猪头肉', specs: '500g', basePrice: 42.0 },
    { name: '酱猪耳', specs: '200g', basePrice: 15.8 },
    { name: '蒜味烤肠', specs: '160g', basePrice: 8.5 },
    { name: '肉枣肠', specs: '240g', basePrice: 12.9 },
    { name: '培根', specs: '200g', basePrice: 18.5 },
    { name: '火腿肠', specs: '30g*10', basePrice: 9.9 },
    { name: '玉米热狗肠', specs: '240g', basePrice: 13.8 },
    { name: '鸡肉肠', specs: '160g', basePrice: 6.9 }
  ]

  const extendedData: CompetitorPrice[] = []

  // 生成30条数据
  for (let i = 0; i < 30; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const product = products[Math.floor(Math.random() * products.length)]

    // 价格波动 ±20%
    const priceVariation = (Math.random() - 0.5) * 0.4 + 1
    const finalPrice = Math.round(product.basePrice * priceVariation * 10) / 10

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 15)) // 最近15天内

    extendedData.push({
      id: (i + 1).toString(),
      captureDate: date.toISOString().split('T')[0],
      location,
      brand,
      productName: `${product.name} ${product.specs}`,
      specifications: product.specs,
      price: finalPrice,
      sourceType: Math.random() > 0.7 ? 'ocr' : 'manual',
      rawText: Math.random() > 0.7 ? `${brand}${product.name}${product.specs} ${finalPrice}元` : undefined,
      uploadedBy: ['采集员小王', '采集员小李', '采集员小张', '采集员小赵'][Math.floor(Math.random() * 4)],
      editedAt: date.toISOString()
    })
  }

  return extendedData
}

export const mockCompetitorPrices: CompetitorPrice[] = generateExtendedCompetitorPrices()

// 客户反馈数据
export const mockCustomerFeedback: CustomerFeedback[] = [
  {
    id: '1',
    platform: '天猫',
    orderId: 'TM202508301001',
    originalComment: '第二次买了，但是这次的包装是坏的，里面的火腿肠都黏糊糊的了，不敢吃，联系客服半天了也没人回！',
    commentTime: '2025-08-30T14:30:00Z',
    sentiment: 'negative',
    issues: ['包装问题-破损', '产品质量-不新鲜', '客服问题'],
    urgency: 'high',
    summary: '包装破损导致产品变质，客服响应不及时',
    status: 'pending',
    createdAt: '2025-08-30T14:30:00Z',
    // 新增字段
    aiTags: ['产品质量', '服务态度'],
    detailedContent: '客户反馈在第二次购买后发现产品包装破损，导致内装火腿肠出现变质现象，同时客服响应速度过慢，影响客户体验。',
    aiSuggestion: '1.立即对客户进行退款补偿；2.检查产品包装流程，加强质量控制；3.培训客服团队，提高响应速度。',
    submitLocation: '利客来城阳门店',
    submitTime: '2025-08-30T14:30:00Z'
  },
  {
    id: '2',
    platform: '京东',
    orderId: 'JD202508301002',
    originalComment: '味道不错，包装也很好，物流很快，会回购的',
    commentTime: '2025-08-30T16:20:00Z',
    sentiment: 'positive',
    issues: [],
    urgency: 'low',
    summary: '客户对产品和服务满意，有回购意愿',
    status: 'resolved',
    createdAt: '2025-08-30T16:20:00Z',
    // 新增字段
    aiTags: ['产品质量', '服务态度'],
    detailedContent: '客户对产品口感、包装质量以及物流服务都表示满意，并明确表示会继续购买。',
    aiSuggestion: '继续保持产品质量和服务水平，可向该客户推送相关产品促销活动，提高客户粘性。',
    submitLocation: '家乐福市北门店',
    submitTime: '2025-08-30T16:20:00Z'
  },
  {
    id: '3',
    platform: '拼多多',
    orderId: 'PDD202508301003',
    originalComment: '火腿肠里面有根头发，太恶心了，以后不会再买了',
    commentTime: '2025-08-30T18:45:00Z',
    sentiment: 'negative',
    issues: ['产品质量-异物'],
    urgency: 'high',
    summary: '产品中发现异物（头发），严重影响食品安全',
    status: 'in_progress',
    processedBy: '客服小王',
    createdAt: '2025-08-30T18:45:00Z',
    // 新增字段
    aiTags: ['产品质量'],
    detailedContent: '客户在产品中发现异物（头发），严重影响食品安全和食用体验，客户表示不会再次购买。',
    aiSuggestion: '1.立即启动食品安全事件应急预案；2.对相关批次产品进行全面检查；3.加强生产环境卫生管理；4.主动联系客户道歉并进行补偿。',
    submitLocation: '大润发芝罘门店',
    submitTime: '2025-08-30T18:45:00Z'
  }
]

// 生成扩展的客户反馈数据
export function generateExtendedCustomerFeedback(): CustomerFeedback[] {
  const platforms = ['天猫', '京东', '拼多多', '淘宝', '抖音商城']
  const products = ['维也纳香肠', '猪头肉', '酱猪耳', '蒜味烤肠', '肉枣肠', '火腿肠', '培根']

  const positiveComments = [
    '味道很好，包装也很精美，物流很快，会回购的',
    '质量不错，孩子很喜欢吃，价格也合理',
    '老品牌了，一直很信赖，这次购买依然满意',
    '口感很棒，肉质鲜美，包装密封性很好',
    '发货速度很快，包装完整，产品新鲜',
    '家人都很喜欢，会推荐给朋友',
    '性价比很高，比超市便宜，质量一样好',
    '客服态度很好，解答很耐心，产品也满意',
    '包装很用心，产品保质期很新，很放心',
    '多次购买了，品质稳定，值得信赖'
  ]

  const neutralComments = [
    '产品还可以，包装一般，价格合适',
    '味道还行，没有特别惊喜，也没有失望',
    '物流速度一般，产品质量还可以',
    '包装简单了点，但产品本身没问题',
    '价格稍微有点贵，但质量还是可以的',
    '第一次买，感觉还行，下次再看看',
    '产品符合预期，没有特别的亮点',
    '包装可以再改进一下，产品本身不错'
  ]

  const negativeComments = [
    '包装破损，里面的产品都变质了，太失望了',
    '发现里面有头发，太恶心了，食品安全堪忧',
    '味道很奇怪，感觉不新鲜，不敢吃',
    '客服态度很差，问题迟迟不解决',
    '物流太慢了，等了一个星期才到',
    '包装漏气，产品都坏了，要求退货',
    '价格虚高，质量一般，不值这个价',
    '产品过期了还在卖，太不负责任了',
    '包装上的生产日期模糊不清，怀疑是假货',
    '多次联系客服都没有回复，服务太差了'
  ]

  const issues = [
    ['包装问题-破损'],
    ['产品质量-异物'],
    ['产品质量-不新鲜'],
    ['客服问题'],
    ['物流问题-速度慢'],
    ['包装问题-漏气'],
    ['价格问题'],
    ['产品质量-过期'],
    ['产品质量-标识不清'],
    ['客服问题', '物流问题-速度慢']
  ]

  const extendedData: CustomerFeedback[] = []

  // 生成120条数据，按比例分配：正面80%、中性12%、负面8%
  for (let i = 0; i < 120; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const product = products[Math.floor(Math.random() * products.length)]

    let sentiment: 'positive' | 'neutral' | 'negative'
    let comment: string
    let feedbackIssues: string[]
    let urgency: 'high' | 'medium' | 'low'
    let status: 'pending' | 'in_progress' | 'resolved'

    // 按比例分配情感
    const rand = Math.random()
    if (rand < 0.8) {
      sentiment = 'positive'
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)]
      feedbackIssues = []
      urgency = 'low'
      status = 'resolved'
    } else if (rand < 0.92) {
      sentiment = 'neutral'
      comment = neutralComments[Math.floor(Math.random() * neutralComments.length)]
      feedbackIssues = Math.random() > 0.7 ? [issues[Math.floor(Math.random() * issues.length)][0]] : []
      urgency = 'medium'
      status = Math.random() > 0.5 ? 'resolved' : 'in_progress'
    } else {
      sentiment = 'negative'
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)]
      feedbackIssues = issues[Math.floor(Math.random() * issues.length)]
      urgency = Math.random() > 0.5 ? 'high' : 'medium'
      status = Math.random() > 0.3 ? 'pending' : 'in_progress'
    }

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)) // 最近30天内

    // 生成AI标签
    const aiTagsPool = ['产品质量', '产品价格', '服务态度', '其他建议']
    const generateAiTags = () => {
      const count = Math.floor(Math.random() * 3) + 1 // 1-3个标签
      const shuffled = [...aiTagsPool].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count) as ('产品质量' | '产品价格' | '服务态度' | '其他建议')[]
    }

    // 生成建议详情
    const generateDetailedContent = (comment: string, sentiment: string, product: string) => {
      if (sentiment === 'positive') {
        return `客户对${product}表示满意，对产品质量、服务体验等给出正面评价。`
      } else if (sentiment === 'negative') {
        return `客户对${product}反馈了问题，主要问题包括：${comment.slice(0, 50)}...需要及时处理和改进。`
      } else {
        return `客户对${product}的反馈表现中立，有一定的改进空间。`
      }
    }

    // 生成AI建议
    const generateAiSuggestion = (sentiment: string, tags: string[]) => {
      if (sentiment === 'positive') {
        return '继续保持产品质量和服务水平，可向该客户推送相关产品促销活动。'
      } else if (sentiment === 'negative') {
        const suggestions = []
        if (tags.includes('产品质量')) suggestions.push('加强产品质量检查和控制')
        if (tags.includes('产品价格')) suggestions.push('重新评估产品定价策略')
        if (tags.includes('服务态度')) suggestions.push('加强客服培训，提高服务响应速度')
        return suggestions.length > 0 ? suggestions.join('；') : '立即联系客户处理问题，并进行适当补偿'
      } else {
        return '持续关注客户反馈，主动改进产品和服务质量。'
      }
    }

    // 地点池
    const locations = ['利客来城阳门店', '家乐福市北门店', '大润发芝罘门店', '银座历下门店', '华联即墨门店', '沃尔玛李沧门店', '華润万家市北门店']

    const currentAiTags = generateAiTags()
    const detailedContent = generateDetailedContent(comment, sentiment, product)
    const aiSuggestion = generateAiSuggestion(sentiment, currentAiTags)

    extendedData.push({
      id: (i + 100).toString(),
      platform,
      orderId: `${platform.substring(0, 2).toUpperCase()}${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(i + 1000).padStart(4, '0')}`,
      originalComment: comment,
      commentTime: date.toISOString(),
      sentiment,
      issues: feedbackIssues,
      urgency,
      summary: `${product}相关反馈`,
      status,
      processedBy: status !== 'pending' ? ['客服小王', '客服小李', '客服小张'][Math.floor(Math.random() * 3)] : undefined,
      createdAt: date.toISOString(),
      productName: product,
      // 新增字段
      aiTags: currentAiTags,
      detailedContent,
      aiSuggestion,
      submitLocation: locations[Math.floor(Math.random() * locations.length)],
      submitTime: date.toISOString()
    })
  }

  return [...mockCustomerFeedback, ...extendedData]
}

// 生成更多模拟数据的函数
export function generateMockSalesData(days: number = 30): SalesData[] {
  const data: SalesData[] = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    mockProducts.forEach(product => {
      mockStores.forEach(store => {
        // 随机生成销量数据
        const baseQuantity = Math.random() * 50 + 10
        const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1
        const quantity = Math.round((baseQuantity * weekendMultiplier) * 1000) / 1000
        
        data.push({
          id: `${date.toISOString().split('T')[0]}-${store.id}-${product.id}`,
          date: date.toISOString().split('T')[0],
          storeId: store.id,
          storeName: store.name,
          productId: product.id,
          productName: product.name,
          actualQuantity: quantity,
          unit: product.unit
        })
      })
    })
  }
  
  return data
}

// 预测列表数据接口
export interface ForecastListItem {
  id: string
  city: string
  district: string
  storeName: string
  productName: string
  productCategory: string
  t1: number  // T+1 明天
  t2: number  // T+2 后天
  t3: number  // T+3
  t4: number  // T+4
  t5: number  // T+5
  t6: number  // T+6
  t7: number  // T+7
  trend: 'up' | 'down' | 'stable'  // 趋势
  confidence: number  // 置信度
  lastUpdated: string
}

// 生成预测列表数据
export function generateForecastListData(): ForecastListItem[] {
  const data: ForecastListItem[] = []

  mockStores.forEach(store => {
    // 解析城市和区域
    const addressParts = store.address.split(/[市区]/)
    const city = addressParts[0] + '市'
    const district = addressParts[1] + '区'

    mockProducts.forEach(product => {
      // 基础销量（根据产品类别调整）
      const baseQuantity = product.category === '烤肠类' ? 25 : 15
      const variation = 0.2 // 20%的变化幅度

      // 生成7天的预测数据
      const forecasts: number[] = []
      let currentBase = baseQuantity + (Math.random() - 0.5) * baseQuantity * variation

      for (let i = 0; i < 7; i++) {
        // 模拟趋势变化
        const trendFactor = 1 + (Math.random() - 0.5) * 0.1 // ±5%的日变化
        const weekendBoost = (i === 5 || i === 6) ? 1.3 : 1 // 周末销量提升
        const seasonalFactor = 1 + Math.sin(i * 0.5) * 0.05 // 微小的季节性变化

        currentBase *= trendFactor
        const dailyForecast = currentBase * weekendBoost * seasonalFactor
        forecasts.push(Math.round(dailyForecast * 100) / 100)
      }

      // 计算趋势
      const firstHalf = (forecasts[0] + forecasts[1] + forecasts[2]) / 3
      const secondHalf = (forecasts[4] + forecasts[5] + forecasts[6]) / 3
      let trend: 'up' | 'down' | 'stable' = 'stable'

      if (secondHalf > firstHalf * 1.05) trend = 'up'
      else if (secondHalf < firstHalf * 0.95) trend = 'down'

      data.push({
        id: `${store.id}-${product.id}`,
        city,
        district,
        storeName: store.name,
        productName: product.name,
        productCategory: product.category,
        t1: forecasts[0],
        t2: forecasts[1],
        t3: forecasts[2],
        t4: forecasts[3],
        t5: forecasts[4],
        t6: forecasts[5],
        t7: forecasts[6],
        trend,
        confidence: 0.85 + Math.random() * 0.12,
        lastUpdated: new Date().toISOString()
      })
    })
  })

  return data
}
