'use client'

import { useState, useEffect } from 'react'
import { X, Save, AlertCircle } from 'lucide-react'
import { CompetitorPrice } from '@/types'

interface DataEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<CompetitorPrice>) => void
  initialData?: Partial<CompetitorPrice>
  title?: string
}

interface FormData {
  brand: string
  productName: string
  specifications: string
  price: string
  location: string
}

interface FormErrors {
  brand?: string
  productName?: string
  specifications?: string
  price?: string
  location?: string
}

export default function DataEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  title = "编辑数据"
}: DataEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    productName: '',
    specifications: '',
    price: '',
    location: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 当模态框打开或初始数据变化时，重置表单
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        brand: initialData.brand || '',
        productName: initialData.productName || '',
        specifications: initialData.specifications || '',
        price: initialData.price?.toString() || '',
        location: initialData.location || ''
      })
      setErrors({})
    }
  }, [isOpen, initialData])

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.brand.trim()) {
      newErrors.brand = '品牌名称不能为空'
    }

    if (!formData.productName.trim()) {
      newErrors.productName = '商品名称不能为空'
    }

    if (!formData.specifications.trim()) {
      newErrors.specifications = '规格/包装不能为空'
    }

    if (!formData.price.trim()) {
      newErrors.price = '价格不能为空'
    } else {
      const priceNum = parseFloat(formData.price)
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = '请输入有效的价格'
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = '地点不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const submitData: Partial<CompetitorPrice> = {
        ...initialData,
        brand: formData.brand.trim(),
        productName: formData.productName.trim(),
        specifications: formData.specifications.trim(),
        price: parseFloat(formData.price),
        location: formData.location.trim(),
        editedAt: new Date().toISOString(),
        editedBy: '当前用户' // 实际应用中应该从用户上下文获取
      }

      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // 处理取消
  const handleCancel = () => {
    setFormData({
      brand: '',
      productName: '',
      specifications: '',
      price: '',
      location: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 品牌名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              品牌名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.brand ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入品牌名称"
            />
            {errors.brand && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.brand}
              </div>
            )}
          </div>

          {/* 商品名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              商品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.productName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入商品名称"
            />
            {errors.productName && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.productName}
              </div>
            )}
          </div>

          {/* 规格/包装 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              规格/包装 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.specifications}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.specifications ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="如：340g、500ml等"
            />
            {errors.specifications && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.specifications}
              </div>
            )}
          </div>

          {/* 价格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              价格（元） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入价格"
            />
            {errors.price && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.price}
              </div>
            )}
          </div>

          {/* 地点 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              采集地点 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">请选择地点</option>
              <option value="青岛办事处">青岛办事处</option>
              <option value="济南办事处">济南办事处</option>
              <option value="烟台办事处">烟台办事处</option>
              <option value="城阳即墨">城阳即墨</option>
            </select>
            {errors.location && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.location}
              </div>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  确认并保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
