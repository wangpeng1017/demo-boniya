'use client'

import { useState, useRef } from 'react'
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { CompetitorPrice } from '@/types'
import { delay } from '@/lib/utils'

interface FileImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: Partial<CompetitorPrice>[]) => void
  type: 'our-products' | 'competitor-products'
  title: string
}

interface ImportData {
  brand: string
  productName: string
  specifications: string
  price: number
  location: string
  [key: string]: any
}

export default function FileImportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  type,
  title 
}: FileImportModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewData, setPreviewData] = useState<ImportData[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件拖拽
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // 处理文件放置
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // 处理文件选择
  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors(['请选择Excel文件(.xlsx, .xls)或CSV文件(.csv)'])
      return
    }
    
    setFile(selectedFile)
    setErrors([])
    processFile(selectedFile)
  }

  // 处理文件内容
  const processFile = async (file: File) => {
    setIsProcessing(true)
    setErrors([])
    
    try {
      await delay(2000) // 模拟文件处理延迟
      
      // 模拟解析文件内容
      const mockData: ImportData[] = [
        {
          brand: type === 'our-products' ? '喜旺' : '双汇',
          productName: type === 'our-products' ? '维也纳香肠' : '王中王火腿肠',
          specifications: '340g',
          price: type === 'our-products' ? 19.9 : 22.5,
          location: '青岛办事处'
        },
        {
          brand: type === 'our-products' ? '喜旺' : '金锣',
          productName: type === 'our-products' ? '蒜味烤肠' : '肉粒多香肠',
          specifications: '160g',
          price: type === 'our-products' ? 7.9 : 12.5,
          location: '济南办事处'
        },
        {
          brand: type === 'our-products' ? '喜旺' : '双汇',
          productName: type === 'our-products' ? '猪头肉' : '玉米热狗肠',
          specifications: '500g',
          price: type === 'our-products' ? 42.0 : 18.9,
          location: '烟台办事处'
        }
      ]
      
      // 数据验证
      const validationErrors: string[] = []
      mockData.forEach((item, index) => {
        if (!item.brand) validationErrors.push(`第${index + 1}行：品牌名称不能为空`)
        if (!item.productName) validationErrors.push(`第${index + 1}行：商品名称不能为空`)
        if (!item.specifications) validationErrors.push(`第${index + 1}行：规格不能为空`)
        if (!item.price || item.price <= 0) validationErrors.push(`第${index + 1}行：价格必须大于0`)
        if (!item.location) validationErrors.push(`第${index + 1}行：地点不能为空`)
      })
      
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setIsProcessing(false)
        return
      }
      
      setPreviewData(mockData)
      setStep('preview')
      
    } catch (error) {
      setErrors(['文件处理失败，请检查文件格式'])
    } finally {
      setIsProcessing(false)
    }
  }

  // 确认导入
  const handleConfirmImport = async () => {
    setIsProcessing(true)
    
    try {
      const importData: Partial<CompetitorPrice>[] = previewData.map(item => ({
        id: `import-${Date.now()}-${Math.random()}`,
        brand: item.brand,
        productName: item.productName,
        specifications: item.specifications,
        price: item.price,
        location: item.location,
        captureDate: new Date().toISOString(),
        sourceType: 'import' as const,
        uploadedBy: '当前用户',
        editedAt: new Date().toISOString()
      }))
      
      await delay(1000)
      onImport(importData)
      setStep('complete')
      
    } catch (error) {
      setErrors(['导入失败，请重试'])
    } finally {
      setIsProcessing(false)
    }
  }

  // 重置状态
  const handleClose = () => {
    setFile(null)
    setPreviewData([])
    setErrors([])
    setStep('upload')
    setIsProcessing(false)
    onClose()
  }

  // 下载模板
  const downloadTemplate = () => {
    const csvContent = [
      ['品牌名称', '商品名称', '规格/包装', '价格', '采集地点'].join(','),
      ['示例品牌', '示例商品', '340g', '19.90', '青岛办事处'].join(',')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${type === 'our-products' ? '本品' : '竞品'}价格导入模板.csv`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-4">
              {/* 下载模板 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">下载导入模板</h4>
                    <p className="text-sm text-blue-700">请按照模板格式准备数据</p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="btn-secondary text-sm flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载模板
                  </button>
                </div>
              </div>

              {/* 文件上传区域 */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {dragActive ? '放置文件到这里' : '拖拽文件到这里，或点击选择文件'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                  disabled={isProcessing}
                >
                  选择文件
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* 选中的文件 */}
              {file && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-500 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {isProcessing && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    )}
                  </div>
                </div>
              )}

              {/* 错误信息 */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-900 mb-1">导入错误</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">数据预览</h4>
                <span className="text-sm text-gray-500">共 {previewData.length} 条记录</span>
              </div>

              {/* 预览表格 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">品牌</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名称</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">规格</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">地点</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.brand}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.specifications}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">¥{item.price}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 确认按钮 */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  重新选择
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      导入中...
                    </>
                  ) : (
                    '确认导入'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h4 className="text-lg font-medium text-gray-900">导入成功</h4>
              <p className="text-sm text-gray-600">
                已成功导入 {previewData.length} 条数据
              </p>
              <button
                onClick={handleClose}
                className="btn-primary"
              >
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
