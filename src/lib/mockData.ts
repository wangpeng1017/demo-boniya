import { SalesData, SalesForecast, Store, Product, CompetitorPrice, CustomerFeedback } from '@/types'

// 门店数据
export const mockStores: Store[] = [
  { id: '1', name: '青岛市城阳区利客来城阳直营专柜', address: '青岛市城阳区', region: '青岛办事处', status: 'active' },
  { id: '2', name: '青岛市市北区家乐福专柜', address: '青岛市市北区', region: '青岛办事处', status: 'active' },
  { id: '3', name: '济南市历下区银座专柜', address: '济南市历下区', region: '济南办事处', status: 'active' },
  { id: '4', name: '烟台市芝罘区大润发专柜', address: '烟台市芝罘区', region: '烟台办事处', status: 'active' },
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
