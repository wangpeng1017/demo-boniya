'use client'

import { useState, useEffect } from 'react'
import { Store, Camera, AlertTriangle, CheckCircle, Eye, Settings, Users, Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatDateTime, delay } from '@/lib/utils'

interface StoreInspection {
  id: string
  storeId: string
  storeName: string
  inspectionDate: string
  inspectorId: string
  inspectorName: string
  categories: Array<{
    name: string
    score: number
    maxScore: number
    issues: string[]
  }>
  overallScore: number
  status: 'passed' | 'failed' | 'needs_improvement'
  notes?: string
  violations: Array<{
    type: string
    description: string
    severity: 'low' | 'medium' | 'high'
    timestamp: string
    imageUrl?: string
  }>
}

interface CameraFeed {
  id: string
  storeId: string
  storeName: string
  location: string
  status: 'online' | 'offline'
  lastUpdate: string
  violations: number
}

const mockInspections: StoreInspection[] = [
  {
    id: 'INS001',
    storeId: 'ST001',
    storeName: '青岛市城阳区利客来城阳直营专柜',
    inspectionDate: '2025-08-31T09:00:00Z',
    inspectorId: 'AI001',
    inspectorName: 'AI视觉系统',
    categories: [
      { name: '员工着装', score: 85, maxScore: 100, issues: ['部分员工未佩戴帽子'] },
      { name: '商品陈列', score: 92, maxScore: 100, issues: [] },
      { name: '卫生状况', score: 88, maxScore: 100, issues: ['地面有少量积水'] },
      { name: '在岗情况', score: 95, maxScore: 100, issues: [] }
    ],
    overallScore: 90,
    status: 'needs_improvement',
    violations: [
      {
        type: '着装不规范',
        description: '员工未按规定佩戴工作帽',
        severity: 'medium',
        timestamp: '2025-08-31T09:15:00Z',
        imageUrl: '/images/violation-1.jpg'
      }
    ]
  },
  {
    id: 'INS002',
    storeId: 'ST002',
    storeName: '青岛市市北区家乐福专柜',
    inspectionDate: '2025-08-31T10:30:00Z',
    inspectorId: 'AI001',
    inspectorName: 'AI视觉系统',
    categories: [
      { name: '员工着装', score: 98, maxScore: 100, issues: [] },
      { name: '商品陈列', score: 95, maxScore: 100, issues: [] },
      { name: '卫生状况', score: 90, maxScore: 100, issues: ['需要清理展示柜'] },
      { name: '在岗情况', score: 100, maxScore: 100, issues: [] }
    ],
    overallScore: 96,
    status: 'passed',
    violations: []
  }
]

const mockCameraFeeds: CameraFeed[] = [
  {
    id: 'CAM001',
    storeId: 'ST001',
    storeName: '青岛市城阳区利客来城阳直营专柜',
    location: '收银台区域',
    status: 'online',
    lastUpdate: '2025-08-31T11:30:00Z',
    violations: 2
  },
  {
    id: 'CAM002',
    storeId: 'ST001',
    storeName: '青岛市城阳区利客来城阳直营专柜',
    location: '商品展示区',
    status: 'online',
    lastUpdate: '2025-08-31T11:29:00Z',
    violations: 0
  },
  {
    id: 'CAM003',
    storeId: 'ST002',
    storeName: '青岛市市北区家乐福专柜',
    location: '收银台区域',
    status: 'online',
    lastUpdate: '2025-08-31T11:28:00Z',
    violations: 0
  }
]

export default function StoreManagementPage() {
  const [inspections, setInspections] = useState<StoreInspection[]>(mockInspections)
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(mockCameraFeeds)
  const [selectedStore, setSelectedStore] = useState('全部')
  const [activeTab, setActiveTab] = useState<'overview' | 'cameras' | 'inspections'>('overview')
  const [isMonitoring, setIsMonitoring] = useState(true)

  const stores = ['全部', '青岛市城阳区利客来城阳直营专柜', '青岛市市北区家乐福专柜']

  // 统计数据
  const stats = {
    totalStores: new Set(inspections.map(i => i.storeId)).size,
    onlineCameras: cameraFeeds.filter(c => c.status === 'online').length,
    totalViolations: cameraFeeds.reduce((sum, c) => sum + c.violations, 0),
    averageScore: Math.round(inspections.reduce((sum, i) => sum + i.overallScore, 0) / inspections.length)
  }

  // 趋势数据（模拟）
  const trendData = [
    { date: '08-25', score: 88 },
    { date: '08-26', score: 90 },
    { date: '08-27', score: 87 },
    { date: '08-28', score: 92 },
    { date: '08-29', score: 89 },
    { date: '08-30', score: 94 },
    { date: '08-31', score: 93 }
  ]

  const getStatusStyle = (status: string) => {
    const styles = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      needs_improvement: 'bg-yellow-100 text-yellow-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      passed: '合格',
      failed: '不合格',
      needs_improvement: '需改进'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getSeverityStyle = (severity: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return styles[severity as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityText = (severity: string) => {
    const texts = {
      low: '轻微',
      medium: '中等',
      high: '严重'
    }
    return texts[severity as keyof typeof texts] || severity
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Store className="w-6 h-6 mr-2 text-primary-600" />
            门店运营标准化管理
          </h1>
          <p className="text-gray-600 mt-1">AI智能监控门店标准化执行情况</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isMonitoring ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isMonitoring ? '监控中' : '已停止'}
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="btn-primary"
          >
            {isMonitoring ? '停止监控' : '开始监控'}
          </button>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">监控门店</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
            </div>
            <Store className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">在线摄像头</p>
              <p className="text-2xl font-bold text-green-600">{stats.onlineCameras}</p>
            </div>
            <Camera className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">违规事件</p>
              <p className="text-2xl font-bold text-red-600">{stats.totalViolations}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">平均得分</p>
              <p className="text-2xl font-bold text-primary-600">{stats.averageScore}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary-600" />
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
              <CheckCircle className="w-4 h-4 inline mr-2" />
              总览
            </button>
            <button
              onClick={() => setActiveTab('cameras')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cameras'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              摄像头监控
            </button>
            <button
              onClick={() => setActiveTab('inspections')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inspections'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              检查报告
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 趋势图表 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">标准化执行趋势</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">各项目得分</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: '员工着装', score: 91 },
                      { name: '商品陈列', score: 94 },
                      { name: '卫生状况', score: 89 },
                      { name: '在岗情况', score: 98 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 实时违规预警 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">实时违规预警</h3>
                <div className="space-y-3">
                  {inspections.flatMap(inspection => 
                    inspection.violations.map(violation => (
                      <div key={`${inspection.id}-${violation.timestamp}`} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-900">{violation.type}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityStyle(violation.severity)}`}>
                                {getSeverityText(violation.severity)}
                              </span>
                            </div>
                            <p className="text-red-800 mb-1">{violation.description}</p>
                            <p className="text-sm text-red-600">
                              {inspection.storeName} • {formatDateTime(violation.timestamp)}
                            </p>
                          </div>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            查看详情
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cameras' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">摄像头监控状态</h3>
                <button className="btn-secondary flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  配置摄像头
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameraFeeds.map(camera => (
                  <div key={camera.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{camera.location}</span>
                      </div>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        camera.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${
                          camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        {camera.status === 'online' ? '在线' : '离线'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center mb-3">
                      <span className="text-gray-500">实时画面</span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>门店：</span>
                        <span className="text-gray-900">{camera.storeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>违规次数：</span>
                        <span className={camera.violations > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {camera.violations}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>最后更新：</span>
                        <span>{formatDateTime(camera.lastUpdate)}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-3 btn-secondary text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      查看详情
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'inspections' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">检查报告</h3>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {stores.map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {inspections.map(inspection => (
                  <div key={inspection.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{inspection.storeName}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(inspection.status)}`}>
                            {getStatusText(inspection.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          检查时间：{formatDateTime(inspection.inspectionDate)} • 检查员：{inspection.inspectorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">{inspection.overallScore}</div>
                        <div className="text-sm text-gray-500">总分</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {inspection.categories.map((category, index) => (
                        <div key={index} className="bg-gray-50 rounded-md p-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                            <span className="text-sm font-bold text-gray-900">
                              {category.score}/{category.maxScore}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                            ></div>
                          </div>
                          {category.issues.length > 0 && (
                            <div className="mt-2">
                              {category.issues.map((issue, issueIndex) => (
                                <span key={issueIndex} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                  {issue}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {inspection.notes && (
                      <div className="bg-blue-50 rounded-md p-3">
                        <p className="text-sm text-blue-800">
                          <strong>备注：</strong>{inspection.notes}
                        </p>
                      </div>
                    )}
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
