'use client'

import { useState, useEffect } from 'react'
import { Scan, Camera, Upload, Settings, TrendingUp, Package, Eye, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatDateTime, delay } from '@/lib/utils'

interface ProductRecognition {
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
  actualProduct?: string
  isCorrect?: boolean
}

interface ProductSKU {
  id: string
  code: string
  name: string
  category: string
  price: number
  images: string[]
  trainingImages: number
  lastUpdated: string
}

const mockRecognitions: ProductRecognition[] = [
  {
    id: 'PR001',
    imageUrl: '/images/recognition-1.jpg',
    recognizedProducts: [
      {
        productId: 'P001',
        productName: '维也纳香肠',
        confidence: 0.96
      }
    ],
    processedAt: '2025-08-31T10:30:00Z',
    accuracy: 96,
    actualProduct: '维也纳香肠',
    isCorrect: true
  },
  {
    id: 'PR002',
    imageUrl: '/images/recognition-2.jpg',
    recognizedProducts: [
      {
        productId: 'P002',
        productName: '猪头肉',
        confidence: 0.89
      },
      {
        productId: 'P003',
        productName: '酱猪耳',
        confidence: 0.12
      }
    ],
    processedAt: '2025-08-31T11:15:00Z',
    accuracy: 89,
    actualProduct: '猪头肉',
    isCorrect: true
  },
  {
    id: 'PR003',
    imageUrl: '/images/recognition-3.jpg',
    recognizedProducts: [
      {
        productId: 'P004',
        productName: '蒜味烤肠',
        confidence: 0.78
      }
    ],
    processedAt: '2025-08-31T12:00:00Z',
    accuracy: 78,
    actualProduct: '肉枣肠',
    isCorrect: false
  }
]

const mockProductSKUs: ProductSKU[] = [
  {
    id: 'P001',
    code: 'B2102-025',
    name: '维也纳香肠',
    category: '烤肠类',
    price: 35.0,
    images: ['/images/product-1-1.jpg', '/images/product-1-2.jpg'],
    trainingImages: 156,
    lastUpdated: '2025-08-30T16:20:00Z'
  },
  {
    id: 'P002',
    code: 'B2103-021',
    name: '猪头肉',
    category: '酱卤类',
    price: 42.0,
    images: ['/images/product-2-1.jpg', '/images/product-2-2.jpg'],
    trainingImages: 203,
    lastUpdated: '2025-08-30T15:45:00Z'
  },
  {
    id: 'P003',
    code: 'B2103-022',
    name: '酱猪耳',
    category: '酱卤类',
    price: 45.0,
    images: ['/images/product-3-1.jpg'],
    trainingImages: 89,
    lastUpdated: '2025-08-29T14:30:00Z'
  }
]

export default function ProductRecognitionPage() {
  const [recognitions, setRecognitions] = useState<ProductRecognition[]>(mockRecognitions)
  const [productSKUs, setProductSKUs] = useState<ProductSKU[]>(mockProductSKUs)
  const [activeTab, setActiveTab] = useState<'overview' | 'recognition' | 'training'>('overview')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const categories = ['全部', '烤肠类', '酱卤类', '火腿类']

  // 统计数据
  const stats = {
    totalRecognitions: recognitions.length,
    averageAccuracy: Math.round(recognitions.reduce((sum, r) => sum + (r.accuracy || 0), 0) / recognitions.length),
    correctCount: recognitions.filter(r => r.isCorrect).length,
    totalSKUs: productSKUs.length,
    totalTrainingImages: productSKUs.reduce((sum, p) => sum + p.trainingImages, 0)
  }

  // 图表数据
  const accuracyTrend = [
    { date: '08-25', accuracy: 89 },
    { date: '08-26', accuracy: 91 },
    { date: '08-27', accuracy: 88 },
    { date: '08-28', accuracy: 93 },
    { date: '08-29', accuracy: 90 },
    { date: '08-30', accuracy: 95 },
    { date: '08-31', accuracy: 92 }
  ]

  const categoryAccuracy = [
    { category: '烤肠类', accuracy: 94 },
    { category: '酱卤类', accuracy: 89 },
    { category: '火腿类', accuracy: 91 }
  ]

  // 模拟图像识别
  const processImage = async (imageFile: File) => {
    setIsProcessing(true)
    await delay(3000) // 模拟AI处理时间

    const imageUrl = URL.createObjectURL(imageFile)
    const mockResult: ProductRecognition = {
      id: `PR${Date.now()}`,
      imageUrl,
      recognizedProducts: [
        {
          productId: 'P001',
          productName: '维也纳香肠',
          confidence: 0.92 + Math.random() * 0.06
        }
      ],
      processedAt: new Date().toISOString(),
      accuracy: Math.round((0.92 + Math.random() * 0.06) * 100)
    }

    setRecognitions(prev => [mockResult, ...prev])
    setIsProcessing(false)
  }

  // 上传训练图片
  const handleTrainingUpload = async (productId: string, files: FileList) => {
    const product = productSKUs.find(p => p.id === productId)
    if (!product) return

    // 模拟上传处理
    await delay(1000)
    
    setProductSKUs(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, trainingImages: p.trainingImages + files.length, lastUpdated: new Date().toISOString() }
        : p
    ))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      processImage(files[0])
    }
  }

  const filteredSKUs = productSKUs.filter(sku => 
    selectedCategory === '全部' || sku.category === selectedCategory
  )

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Scan className="w-6 h-6 mr-2 text-primary-600" />
            称重商品自动识别
          </h1>
          <p className="text-gray-600 mt-1">AI视觉识别系统自动识别散装商品</p>
        </div>
        <div className="flex space-x-3">
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            上传图片识别
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <button className="btn-primary">
            <Settings className="w-4 h-4 mr-2" />
            系统配置
          </button>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">识别次数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecognitions}</p>
            </div>
            <Scan className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均准确率</p>
              <p className="text-2xl font-bold text-green-600">{stats.averageAccuracy}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">识别正确</p>
              <p className="text-2xl font-bold text-primary-600">{stats.correctCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">商品SKU</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSKUs}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">训练图片</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalTrainingImages}</p>
            </div>
            <Camera className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* 处理中提示 */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">AI正在识别图片中的商品，请稍候...</span>
          </div>
        </div>
      )}

      {/* 标签页 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              数据分析
            </button>
            <button
              onClick={() => setActiveTab('recognition')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recognition'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Scan className="w-4 h-4 inline mr-2" />
              识别记录
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'training'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              商品管理
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 图表区域 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">识别准确率趋势</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={accuracyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">各类别识别准确率</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryAccuracy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 系统状态 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">系统运行正常</span>
                  <span className="text-green-600 ml-2">• 已与MOP收银系统成功对接</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recognition' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">识别记录</h3>
              
              <div className="space-y-4">
                {recognitions.map(recognition => (
                  <div key={recognition.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">识别ID: {recognition.id}</span>
                          {recognition.isCorrect !== undefined && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              recognition.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {recognition.isCorrect ? '识别正确' : '识别错误'}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            处理时间：{formatDateTime(recognition.processedAt)}
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-700">识别结果：</span>
                            {recognition.recognizedProducts.map((product, index) => (
                              <div key={index} className="inline-flex items-center ml-2 px-3 py-1 bg-blue-50 rounded-md">
                                <span className="text-sm text-blue-900">{product.productName}</span>
                                <span className="text-xs text-blue-600 ml-2">
                                  {Math.round(product.confidence * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          {recognition.actualProduct && (
                            <div className="text-sm text-gray-600">
                              实际商品：{recognition.actualProduct}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                          {recognition.accuracy}%
                        </div>
                        <div className="text-sm text-gray-500">准确率</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">商品SKU管理</h3>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <button className="btn-primary">
                    <Package className="w-4 h-4 mr-2" />
                    添加商品
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSKUs.map(sku => (
                  <div key={sku.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{sku.name}</h4>
                      <span className="text-sm text-gray-500">{sku.code}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {sku.images.slice(0, 2).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>类别：</span>
                        <span>{sku.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>价格：</span>
                        <span>¥{sku.price}/千克</span>
                      </div>
                      <div className="flex justify-between">
                        <span>训练图片：</span>
                        <span className="font-medium">{sku.trainingImages}张</span>
                      </div>
                      <div className="flex justify-between">
                        <span>更新时间：</span>
                        <span>{formatDateTime(sku.lastUpdated)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <label className="flex-1 btn-secondary text-center cursor-pointer">
                        <Upload className="w-4 h-4 mr-1" />
                        上传图片
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleTrainingUpload(sku.id, e.target.files)}
                          className="hidden"
                        />
                      </label>
                      <button className="btn-primary">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
