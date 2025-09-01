// 销售预测相关类型
export interface SalesData {
  id: string
  date: string
  storeId: string
  storeName: string
  productId: string
  productName: string
  actualQuantity: number
  predictedQuantity?: number
  unit: string
}

export interface SalesForecast {
  id: string
  productId: string
  storeId: string
  forecastDate: string
  predictedQuantity: number
  confidence: number
  geminiReport?: string
  createdAt: string
}

export interface Store {
  id: string
  name: string
  address: string
  region: string
  status: 'active' | 'inactive'
}

export interface Product {
  id: string
  code: string
  name: string
  category: string
  unit: string
  price: number
}

// 竞品分析相关类型
export interface CompetitorPrice {
  id: string
  captureDate: string
  location: string
  brand: string
  productName: string
  specifications: string
  price: number
  rawText?: string
  sourceType: 'ocr' | 'manual' | 'import'
  salespersonId?: string
  uploadedBy?: string  // 上传人
  editedAt?: string    // 编辑时间
  editedBy?: string    // 编辑人
}

export interface CompetitorBrand {
  id: string
  name: string
  color: string
}

// 电商反馈相关类型
export interface CustomerFeedback {
  id: string
  platform: string
  orderId?: string
  originalComment: string
  commentTime: string
  sentiment: 'positive' | 'neutral' | 'negative'
  issues: string[]
  urgency: 'high' | 'medium' | 'low'
  summary: string
  status: 'pending' | 'in_progress' | 'resolved'
  processedBy?: string
  processedAt?: string
  createdAt: string
}

export interface FeedbackAnalysis {
  totalCount: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  topIssues: Array<{
    issue: string
    count: number
    percentage: number
  }>
  urgentCount: number
}

// 客服工单相关类型
export interface CustomerTicket {
  id: string
  customerId: string
  customerName: string
  channel: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

// 门店管理相关类型
export interface StoreInspection {
  id: string
  storeId: string
  inspectionDate: string
  inspectorId: string
  categories: Array<{
    name: string
    score: number
    maxScore: number
    issues: string[]
  }>
  overallScore: number
  status: 'passed' | 'failed' | 'needs_improvement'
  notes?: string
}

// 品质控制相关类型
export interface QualityCheck {
  id: string
  productBatch: string
  checkDate: string
  checkType: 'incoming' | 'production' | 'outgoing'
  result: 'pass' | 'fail' | 'warning'
  defects: string[]
  inspector: string
  notes?: string
}

// 商品识别相关类型
export interface ProductRecognition {
  id: string
  imageUrl: string
  recognizedProducts: Array<{
    productId: string
    productName: string
    confidence: number
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  processedAt: string
  accuracy?: number
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 筛选器类型
export interface DateRangeFilter {
  startDate: string
  endDate: string
}

export interface StoreFilter {
  storeIds: string[]
  regions: string[]
}

export interface ProductFilter {
  productIds: string[]
  categories: string[]
}
