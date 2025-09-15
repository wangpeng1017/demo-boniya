'use client'

import { useState, useEffect } from 'react'
import { Camera, MapPin, Upload, Search, Filter, TrendingUp, AlertCircle, CheckCircle, Edit, Download, FileSpreadsheet, Plus, Eye, BarChart3 } from 'lucide-react'
import { mockCompetitorPrices } from '@/lib/mockData'
import { formatCurrency, delay, formatDateTime } from '@/lib/utils'
import { CompetitorPrice } from '@/types'
import DataEditModal from '@/components/competitor-analysis/DataEditModal'
import FileImportModal from '@/components/competitor-analysis/FileImportModal'
import AIAnalysisReport from '@/components/competitor-analysis/AIAnalysisReport'
import PriceTrendChart from '@/components/competitor-analysis/PriceTrendChart'

interface OCRResult {
  id: string
  imageUrl: string
  rawText: string
  extractedData: {
    brand: string
    productName: string
    specifications: string
    price: number
  } | null
  status: 'processing' | 'completed' | 'error'
  processedAt?: string
}

import RegionDataView from '@/components/competitor-analysis/RegionDataView'
import ProductPriceView from '@/components/competitor-analysis/ProductPriceView'
import MeasureAdjustView from '@/components/competitor-analysis/MeasureAdjustView'

export default function CompetitorAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'collect' | 'region' | 'product' | 'measure'>('collect')
  const [competitorData, setCompetitorData] = useState<CompetitorPrice[]>(mockCompetitorPrices)
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('青岛办事处')
  const [selectedBrand, setSelectedBrand] = useState('全部')

  // 新增状态
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingData, setEditingData] = useState<Partial<CompetitorPrice> | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importType, setImportType] = useState<'our-products' | 'competitor-products'>('our-products')
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [aiReportOpen, setAiReportOpen] = useState(false)

  const locations = ['全部', '青岛办事处', '济南办事处', '烟台办事处', '城阳即墨']
  const brands = ['全部', '喜旺', '双汇', '金锣', '其他']

  // 模拟拍照上传和OCR处理
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsProcessing(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageUrl = URL.createObjectURL(file)
      
      const newResult: OCRResult = {
        id: `ocr-${Date.now()}-${i}`,
        imageUrl,
        rawText: '',
        extractedData: null,
        status: 'processing'
      }
      
      setOcrResults(prev => [...prev, newResult])
      
      // 模拟OCR处理延迟
      await delay(2000)
      
      // 模拟OCR结果
      const mockRawText = '喜旺手掰肉老火腿340g 22.9元'
      const mockExtractedData = {
        brand: '喜旺',
        productName: '手掰肉老火腿',
        specifications: '340g',
        price: 22.9
      }
      
      setOcrResults(prev => prev.map(result => 
        result.id === newResult.id 
          ? {
              ...result,
              rawText: mockRawText,
              extractedData: mockExtractedData,
              status: 'completed',
              processedAt: new Date().toISOString()
            }
          : result
      ))
    }
    
    setIsProcessing(false)
  }

  // 确认OCR结果并添加到数据库
  const confirmOCRResult = (ocrResult: OCRResult) => {
    if (!ocrResult.extractedData) return

    const newCompetitorPrice: CompetitorPrice = {
      id: `comp-${Date.now()}`,
      captureDate: new Date().toISOString(),
      location: selectedLocation,
      brand: ocrResult.extractedData.brand,
      productName: ocrResult.extractedData.productName,
      specifications: ocrResult.extractedData.specifications,
      price: ocrResult.extractedData.price,
      rawText: ocrResult.rawText,
      sourceType: 'ocr',
      uploadedBy: '当前用户',
      editedAt: new Date().toISOString()
    }

    setCompetitorData(prev => [newCompetitorPrice, ...prev])
    setOcrResults(prev => prev.filter(r => r.id !== ocrResult.id))
    showNotification('success', 'OCR数据已成功添加')
  }

  // 新增处理函数
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleEditData = (data: CompetitorPrice) => {
    setEditingData(data)
    setEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedData: Partial<CompetitorPrice>) => {
    try {
      await delay(500) // 模拟保存延迟

      setCompetitorData(prev => prev.map(item =>
        item.id === updatedData.id ? { ...item, ...updatedData } : item
      ))

      showNotification('success', '数据已成功更新')
    } catch (error) {
      showNotification('error', '保存失败，请重试')
    }
  }

  const handleImportData = async (importedData: Partial<CompetitorPrice>[]) => {
    try {
      const newData = importedData.map(item => ({
        ...item,
        id: item.id || `import-${Date.now()}-${Math.random()}`,
        captureDate: item.captureDate || new Date().toISOString(),
        uploadedBy: '当前用户',
        editedAt: new Date().toISOString()
      })) as CompetitorPrice[]

      setCompetitorData(prev => [...newData, ...prev])
      showNotification('success', `成功导入 ${importedData.length} 条数据`)
    } catch (error) {
      showNotification('error', '导入失败，请重试')
    }
  }

  const handleExportData = () => {
    const csvContent = [
      ['品牌', '商品名称', '规格', '价格', '地点', '采集时间', '上传人', '编辑时间'].join(','),
      ...filteredData.map(item => [
        item.brand,
        item.productName,
        item.specifications,
        item.price,
        item.location,
        formatDateTime(item.captureDate),
        item.uploadedBy || '',
        item.editedAt ? formatDateTime(item.editedAt) : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `竞品价格数据_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    showNotification('success', '数据导出成功')
  }

  // 筛选数据
  const filteredData = competitorData.filter(item => {
    const locationMatch = selectedLocation === '全部' || item.location === selectedLocation
    const brandMatch = selectedBrand === '全部' || item.brand === selectedBrand
    return locationMatch && brandMatch
  })

  // 价格对比分析
  const getPriceComparison = (competitorPrice: number, category: string) => {
    // 模拟本品价格
    const ourPrices: { [key: string]: number } = {
      '火腿': 19.9,
      '烤肠': 7.9,
      '香肠': 8.5
    }
    
    const ourPrice = ourPrices[category] || 20
    const difference = competitorPrice - ourPrice
    const percentage = ((difference / ourPrice) * 100).toFixed(1)
    
    return {
      ourPrice,
      difference,
      percentage: parseFloat(percentage),
      isHigher: difference > 0
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
          竞品价格分析
        </h1>
        <p className="text-gray-600 mt-1">智能化竞品价格采集与多维度对比分析</p>
      </div>

      {/* 标签页切换 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('collect')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'collect'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              数据采集
            </button>
            <button
              onClick={() => setActiveTab('region')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'region'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              区域竞品数据
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'product'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              产品价格分析
            </button>
            <button
              onClick={() => setActiveTab('measure')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'measure'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              计量价格调整
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'collect' && (
            <div className="space-y-6">
              {/* 快捷入口到两个移动端页面 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/competitor-analysis/capture" className="block p-4 border rounded-lg hover:shadow">
                  <div className="text-sm text-gray-600">拍照识别（移动端）</div>
                  <div className="text-xs text-gray-500">上传一张图片，识别并可编辑上传，支持历史记录</div>
                </a>
                <a href="/competitor-analysis/voice" className="block p-4 border rounded-lg hover:shadow">
                  <div className="text-sm text-gray-600">语音识别（移动端）</div>
                  <div className="text-xs text-gray-500">语音输入自动结构化，可编辑上传，支持历史记录</div>
                </a>
              </div>
              {/* 移动端优化的数据采集界面 */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 移动端数据采集</h3>
                <p className="text-gray-600 mb-4">
                  使用手机拍摄竞品价格标签，系统将自动识别并提取价格信息
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      采集地点
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Camera className="w-4 h-4 inline mr-1" />
                      上传图片
                    </label>
                    <label className="flex items-center justify-center w-full h-10 border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary-500">
                      <Upload className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">选择图片文件</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {isProcessing && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      <span className="text-yellow-800">正在处理OCR识别...</span>
                    </div>
                  </div>
                )}
                
                {ocrResults.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <h4 className="font-medium text-gray-900">识别结果</h4>
                    {ocrResults.map(result => (
                      <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={result.imageUrl}
                            alt="OCR Image"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-2">
                              状态: {result.status === 'processing' && '处理中...'}
                              {result.status === 'completed' && '已完成'}
                              {result.status === 'error' && '处理失败'}
                            </div>
                            {result.status === 'completed' && result.extractedData && (
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">品牌:</span> {result.extractedData.brand}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">商品名称:</span> {result.extractedData.productName}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">规格:</span> {result.extractedData.specifications}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">价格:</span> {formatCurrency(result.extractedData.price)}
                                </div>
                                <div className="flex space-x-2 mt-3">
                                  <button
                                    onClick={() => {
                                      const data = {
                                        ...result.extractedData,
                                        location: selectedLocation,
                                        captureDate: new Date().toISOString()
                                      } as Partial<CompetitorPrice>
                                      setEditingData(data)
                                      setEditModalOpen(true)
                                    }}
                                    className="btn-secondary text-sm flex items-center"
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    编辑
                                  </button>
                                  <button
                                    onClick={() => confirmOCRResult(result)}
                                    className="btn-primary text-sm"
                                  >
                                    确认并保存
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


          {activeTab === 'region' && (
            <div>
              <RegionDataView />
            </div>
          )}

          {activeTab === 'product' && (
            <div>
              <ProductPriceView />
            </div>
          )}

          {activeTab === 'measure' && (
            <div>
              <MeasureAdjustView />
            </div>
          )}
        </div>
      </div>

      {/* 数据编辑模态框 */}
      <DataEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditingData(null)
        }}
        onSave={handleSaveEdit}
        initialData={editingData || undefined}
        title={editingData ? "编辑数据" : "添加数据"}
      />

      {/* 文件导入模态框 */}
      <FileImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportData}
        type={importType}
        title={importType === 'our-products' ? '导入本品价格' : '导入竞品价格'}
      />

      {/* AI分析报告模态框 */}
      <AIAnalysisReport
        isOpen={aiReportOpen}
        onClose={() => setAiReportOpen(false)}
        data={competitorData}
        selectedLocation={selectedLocation}
        selectedBrand={selectedBrand}
      />

      {/* 通知组件 */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {notification.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
