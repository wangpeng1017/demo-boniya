'use client'

import { useState, useEffect } from 'react'
import { Shield, Camera, AlertTriangle, CheckCircle, Upload, Eye, Filter, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { formatDateTime, delay } from '@/lib/utils'

interface QualityCheck {
  id: string
  productBatch: string
  checkDate: string
  checkType: 'incoming' | 'production' | 'outgoing'
  result: 'pass' | 'fail' | 'warning'
  defects: string[]
  inspector: string
  notes?: string
  images?: string[]
  confidence?: number
}

interface DefectSample {
  id: string
  name: string
  category: string
  imageUrl: string
  description: string
  severity: 'low' | 'medium' | 'high'
  uploadedAt: string
}

const mockQualityChecks: QualityCheck[] = [
  {
    id: 'QC001',
    productBatch: 'B2025083101',
    checkDate: '2025-08-31T08:30:00Z',
    checkType: 'incoming',
    result: 'pass',
    defects: [],
    inspector: 'AI视觉系统',
    confidence: 0.96
  },
  {
    id: 'QC002',
    productBatch: 'B2025083102',
    checkDate: '2025-08-31T09:15:00Z',
    checkType: 'production',
    result: 'fail',
    defects: ['异物-毛发', '包装破损'],
    inspector: 'AI视觉系统',
    notes: '发现毛发异物，已停止生产线进行清理',
    confidence: 0.94,
    images: ['/images/defect-hair.jpg', '/images/defect-package.jpg']
  },
  {
    id: 'QC003',
    productBatch: 'B2025083103',
    checkDate: '2025-08-31T10:45:00Z',
    checkType: 'outgoing',
    result: 'warning',
    defects: ['标签偏移'],
    inspector: 'AI视觉系统',
    confidence: 0.89
  }
]

const mockDefectSamples: DefectSample[] = [
  {
    id: 'DS001',
    name: '毛发异物',
    category: '异物检测',
    imageUrl: '/images/sample-hair.jpg',
    description: '产品中发现毛发类异物',
    severity: 'high',
    uploadedAt: '2025-08-30T14:20:00Z'
  },
  {
    id: 'DS002',
    name: '包装破损',
    category: '包装检测',
    imageUrl: '/images/sample-package-damage.jpg',
    description: '包装袋出现破损或漏气',
    severity: 'medium',
    uploadedAt: '2025-08-30T15:10:00Z'
  },
  {
    id: 'DS003',
    name: '标签错位',
    category: '标签检测',
    imageUrl: '/images/sample-label-misalign.jpg',
    description: '产品标签位置偏移或倾斜',
    severity: 'low',
    uploadedAt: '2025-08-30T16:30:00Z'
  }
]

export default function QualityControlPage() {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(mockQualityChecks)
  const [defectSamples, setDefectSamples] = useState<DefectSample[]>(mockDefectSamples)
  const [activeTab, setActiveTab] = useState<'overview' | 'checks' | 'training'>('overview')
  const [selectedCheckType, setSelectedCheckType] = useState('全部')
  const [selectedResult, setSelectedResult] = useState('全部')
  const [isTraining, setIsTraining] = useState(false)

  const checkTypes = ['全部', 'incoming', 'production', 'outgoing']
  const results = ['全部', 'pass', 'fail', 'warning']

  const checkTypeText = {
    incoming: '来货检验',
    production: '生产检验',
    outgoing: '出货检验'
  }

  const resultText = {
    pass: '合格',
    fail: '不合格',
    warning: '警告'
  }

  const resultColors = {
    pass: '#10b981',
    fail: '#ef4444',
    warning: '#f59e0b'
  }

  // 统计数据
  const stats = {
    totalChecks: qualityChecks.length,
    passRate: Math.round((qualityChecks.filter(c => c.result === 'pass').length / qualityChecks.length) * 100),
    failCount: qualityChecks.filter(c => c.result === 'fail').length,
    warningCount: qualityChecks.filter(c => c.result === 'warning').length,
    avgConfidence: Math.round(qualityChecks.reduce((sum, c) => sum + (c.confidence || 0), 0) / qualityChecks.length * 100)
  }

  // 图表数据
  const resultData = [
    { name: '合格', value: qualityChecks.filter(c => c.result === 'pass').length, color: resultColors.pass },
    { name: '不合格', value: qualityChecks.filter(c => c.result === 'fail').length, color: resultColors.fail },
    { name: '警告', value: qualityChecks.filter(c => c.result === 'warning').length, color: resultColors.warning }
  ]

  const trendData = [
    { date: '08-25', passRate: 94 },
    { date: '08-26', passRate: 96 },
    { date: '08-27', passRate: 92 },
    { date: '08-28', passRate: 95 },
    { date: '08-29', passRate: 93 },
    { date: '08-30', passRate: 97 },
    { date: '08-31', passRate: 94 }
  ]

  const defectTypeData = [
    { name: '异物', count: 8 },
    { name: '包装破损', count: 5 },
    { name: '标签问题', count: 3 },
    { name: '变色', count: 2 },
    { name: '变形', count: 1 }
  ]

  // 模拟模型训练
  const trainModel = async () => {
    setIsTraining(true)
    await delay(5000) // 模拟训练时间
    setIsTraining(false)
    // 这里可以添加训练完成的提示
  }

  // 上传缺陷样本
  const handleSampleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageUrl = URL.createObjectURL(file)
      
      const newSample: DefectSample = {
        id: `DS${Date.now()}-${i}`,
        name: `新缺陷样本-${i + 1}`,
        category: '待分类',
        imageUrl,
        description: '待AI分析识别',
        severity: 'medium',
        uploadedAt: new Date().toISOString()
      }
      
      setDefectSamples(prev => [newSample, ...prev])
    }
  }

  const getResultStyle = (result: string) => {
    const styles = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    }
    return styles[result as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityStyle = (severity: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return styles[severity as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const filteredChecks = qualityChecks.filter(check => {
    const typeMatch = selectedCheckType === '全部' || check.checkType === selectedCheckType
    const resultMatch = selectedResult === '全部' || check.result === selectedResult
    return typeMatch && resultMatch
  })

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-primary-600" />
          产品品质智能控制
        </h1>
        <p className="text-gray-600 mt-1">AI视觉检测系统实时监控产品质量</p>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总检测数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalChecks}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">合格率</p>
              <p className="text-2xl font-bold text-green-600">{stats.passRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">不合格</p>
              <p className="text-2xl font-bold text-red-600">{stats.failCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">警告</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.warningCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI准确率</p>
              <p className="text-2xl font-bold text-primary-600">{stats.avgConfidence}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </div>

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
              onClick={() => setActiveTab('checks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checks'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              检测记录
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'training'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              模型训练
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 图表区域 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">检测结果分布</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={resultData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {resultData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">合格率趋势</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[90, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">缺陷类型统计</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={defectTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checks' && (
            <div className="space-y-6">
              {/* 筛选器 */}
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">检测类型</label>
                  <select
                    value={selectedCheckType}
                    onChange={(e) => setSelectedCheckType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {checkTypes.map(type => (
                      <option key={type} value={type}>
                        {type === '全部' ? '全部' : checkTypeText[type as keyof typeof checkTypeText]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">检测结果</label>
                  <select
                    value={selectedResult}
                    onChange={(e) => setSelectedResult(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {results.map(result => (
                      <option key={result} value={result}>
                        {result === '全部' ? '全部' : resultText[result as keyof typeof resultText]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 检测记录列表 */}
              <div className="space-y-4">
                {filteredChecks.map(check => (
                  <div key={check.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">批次号：{check.productBatch}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultStyle(check.result)}`}>
                            {resultText[check.result as keyof typeof resultText]}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {checkTypeText[check.checkType as keyof typeof checkTypeText]}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>检测时间：{formatDateTime(check.checkDate)}</div>
                          <div>检测员：{check.inspector}</div>
                          {check.confidence && (
                            <div>AI置信度：{Math.round(check.confidence * 100)}%</div>
                          )}
                        </div>

                        {check.defects.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700 mr-2">发现缺陷：</span>
                            <div className="flex flex-wrap gap-1">
                              {check.defects.map((defect, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-700">
                                  {defect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {check.notes && (
                          <div className="bg-yellow-50 rounded-md p-3 mb-3">
                            <p className="text-sm text-yellow-800">
                              <strong>备注：</strong>{check.notes}
                            </p>
                          </div>
                        )}

                        {check.images && check.images.length > 0 && (
                          <div className="flex space-x-2">
                            {check.images.map((image, index) => (
                              <div key={index} className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                                <Camera className="w-6 h-6 text-gray-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        <Eye className="w-4 h-4 inline mr-1" />
                        查看详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">AI模型训练管理</h3>
                <div className="flex space-x-3">
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    上传样本
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleSampleUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={trainModel}
                    disabled={isTraining}
                    className="btn-primary"
                  >
                    {isTraining ? '训练中...' : '开始训练'}
                  </button>
                </div>
              </div>

              {isTraining && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-blue-800">AI模型正在训练中，预计需要5-10分钟...</span>
                  </div>
                </div>
              )}

              {/* 缺陷样本库 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">缺陷样本库</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {defectSamples.map(sample => (
                    <div key={sample.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="w-full h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{sample.name}</h5>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityStyle(sample.severity)}`}>
                            {sample.severity === 'low' ? '轻微' : sample.severity === 'medium' ? '中等' : '严重'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{sample.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{sample.category}</span>
                          <span>{formatDateTime(sample.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
