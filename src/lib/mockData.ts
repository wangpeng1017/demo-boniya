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
  { id: '8', name: '大润发历城专柜', address: '济南市历城区', region: '济南办事处', status: 'active' },
  { id: '9', name: '家乐福莱山专柜', address: '烟台市莱山区', region: '烟台办事处', status: 'active' },
  { id: '10', name: '华联福山专柜', address: '烟台市福山区', region: '烟台办事处', status: 'active' },
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
export const mockCompetitorPrices: CompetitorPrice[] = [
  {
    id: '1',
    captureDate: '2025-08-30',
    location: '青岛办事处',
    brand: '喜旺',
    productName: '手掰肉老火腿 340g',
    specifications: '340g',
    price: 22.9,
    sourceType: 'ocr',
    rawText: '喜旺手掰肉老火腿340g 22.9元'
  },
  {
    id: '2',
    captureDate: '2025-08-30',
    location: '青岛办事处',
    brand: '喜旺',
    productName: '无淀粉大肉块火腿 340g',
    specifications: '340g',
    price: 26.9,
    sourceType: 'ocr'
  },
  {
    id: '3',
    captureDate: '2025-08-30',
    location: '青岛办事处',
    brand: '喜旺',
    productName: '喜旺烤肠 160g',
    specifications: '160g',
    price: 7.9,
    sourceType: 'manual'
  }
]

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
    createdAt: '2025-08-30T14:30:00Z'
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
    createdAt: '2025-08-30T16:20:00Z'
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
    createdAt: '2025-08-30T18:45:00Z'
  }
]

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
