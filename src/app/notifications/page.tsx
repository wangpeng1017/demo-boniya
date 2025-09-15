'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, Clock, Smartphone, TrendingUp, MapPin, Calendar, Eye, MoreVertical, ChevronLeft, Search, Filter, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Notification {
  id: string
  type: 'price-adjustment' | 'system' | 'warning'
  title: string
  message: string
  data?: any
  timestamp: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  source: 'mobile' | 'web' | 'system'
  category: string
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'price-adjustment',
    title: '【到区域的调价建议】实时推送到企业微信',
    message: '青岛办事处-酱猪耳价格建议调整：当前159.8元/kg，建议调至149.8元/kg，与竞品持平提升竞争力',
    data: {
      region: '青岛办事处',
      product: '酱猪耳',
      currentPrice: 159.8,
      suggestedPrice: 149.8,
      rivalPrice: 149.8,
      reasoning: '价格比竞品高7%，建议适度调低以提升竞争力'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    read: false,
    priority: 'high',
    source: 'mobile',
    category: '计量价格调整'
  },
  {
    id: '2',
    type: 'price-adjustment',
    title: '【到区域的调价建议】实时推送到企业微信',
    message: '济南区域-酱猪耳价格建议调整：当前159.8元/kg，建议调至149.8元/kg，与竞品持平提升竞争力',
    data: {
      region: '济南区域',
      product: '酱猪耳',
      currentPrice: 159.8,
      suggestedPrice: 149.8,
      rivalPrice: 149.8,
      reasoning: '价格比竞品高7%，建议适度调低以提升竞争力'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45分钟前
    read: false,
    priority: 'high',
    source: 'mobile',
    category: '计量价格调整'
  },
  {
    id: '3',
    type: 'price-adjustment',
    title: '【到区域的调价建议】实时推送到企业微信',
    message: '泰安区域-酱猪耳价格建议保持：当前159.8元/kg，与竞品价差在合理范围内',
    data: {
      region: '泰安区域',
      product: '酱猪耳',
      currentPrice: 159.8,
      suggestedPrice: 159.8,
      rivalPrice: 149.8,
      reasoning: '当前价格合理，暂不建议调整'
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
    read: true,
    priority: 'medium',
    source: 'mobile',
    category: '计量价格调整'
  },
  {
    id: '4',
    type: 'system',
    title: '系统维护通知',
    message: '系统将于今晚23:00-24:00进行例行维护，期间可能影响部分功能使用',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
    read: true,
    priority: 'low',
    source: 'system',
    category: '系统通知'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'price-adjustment'>('all')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  // 标记为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  // 标记全部为已读
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  // 筛选通知
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'price-adjustment') return notif.type === 'price-adjustment'
    return true
  })

  const unreadCount = notifications.filter(notif => !notif.read).length

  // 获取优先级样式
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price-adjustment': return TrendingUp
      case 'warning': return AlertTriangle
      case 'system': return Bell
      default: return Bell
    }
  }

  // 处理点击消息
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) markAsRead(notification.id)
    setSelectedNotification(notification)
    setShowDetail(true)
  }

  // 移动端列表页面
  if (!showDetail) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* 移动端头部 */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">企业微信消息</h1>
            <div className="flex items-center space-x-3">
              <button className="text-gray-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-600">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 筛选标签 */}
          <div className="px-4 pb-3 flex space-x-3 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'all' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              全部 {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'unread' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              未读
            </button>
            <button
              onClick={() => setFilter('price-adjustment')}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === 'price-adjustment' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              调价建议
            </button>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="bg-white">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">暂无消息</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const TypeIcon = getTypeIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className="flex items-start p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* 左侧图标 */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notification.type === 'price-adjustment' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <TypeIcon className={`w-6 h-6 ${
                          notification.type === 'price-adjustment' ? 'text-green-600' :
                          notification.type === 'warning' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    
                    {/* 中间内容 */}
                    <div className="flex-1 ml-3 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-medium truncate pr-2 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          价格建议通知
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(notification.timestamp).toLocaleTimeString('zh-CN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 line-clamp-2 ${
                        !notification.read ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {/* 标签 */}
                      {notification.type === 'price-adjustment' && notification.data && (
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {notification.data.region}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            建议调整
                          </span>
                          {notification.priority === 'high' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              紧急
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* 未读标记 */}
                    {!notification.read && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }


  // 移动端详情页面
  if (showDetail && selectedNotification) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* 详情页头部 */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center">
            <button 
              onClick={() => setShowDetail(false)}
              className="mr-3"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 flex-1">消息详情</h1>
            <button className="text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 详情内容 */}
        <div className="bg-white mt-2">
          {/* 消息头部 */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedNotification.type === 'price-adjustment' ? 'bg-green-100' :
                selectedNotification.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {getTypeIcon(selectedNotification.type) === TrendingUp && <TrendingUp className="w-6 h-6 text-green-600" />}
                {getTypeIcon(selectedNotification.type) === AlertTriangle && <AlertTriangle className="w-6 h-6 text-red-600" />}
                {getTypeIcon(selectedNotification.type) === Bell && <Bell className="w-6 h-6 text-blue-600" />}
              </div>
              <div className="ml-3 flex-1">
                <h2 className="text-lg font-semibold text-gray-900">价格建议通知</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDateTime(selectedNotification.timestamp)}
                </p>
              </div>
            </div>
          </div>

          {/* 消息内容 */}
          <div className="p-4">
            <div className="text-gray-800 leading-relaxed">
              {selectedNotification.message}
            </div>

            {/* 调价建议详情 */}
            {selectedNotification.type === 'price-adjustment' && selectedNotification.data && (
              <div className="mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">调价建议详情</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">区域</span>
                      <span className="font-medium text-gray-900">{selectedNotification.data.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">产品</span>
                      <span className="font-medium text-gray-900">{selectedNotification.data.product}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">当前价格</span>
                      <span className="font-medium text-gray-900">{selectedNotification.data.currentPrice}元/kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">建议价格</span>
                      <span className="font-medium text-green-600 text-lg">{selectedNotification.data.suggestedPrice}元/kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">竞品价格</span>
                      <span className="font-medium text-gray-900">{selectedNotification.data.rivalPrice}元/kg</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">调价理由</p>
                        <p className="text-sm text-gray-600">{selectedNotification.data.reasoning}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 active:bg-green-700">
                    立即调整价格
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 active:bg-gray-400">
                    稍后处理
                  </button>
                </div>
              </div>
            )}

            {/* 其他信息 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">消息来源</span>
                <span className="text-gray-700">
                  {selectedNotification.source === 'mobile' ? '移动端推送' : 
                   selectedNotification.source === 'web' ? 'Web端' : '系统'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-gray-500">优先级</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedNotification.priority === 'high' ? 'bg-red-100 text-red-700' :
                  selectedNotification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedNotification.priority === 'high' ? '高' : 
                   selectedNotification.priority === 'medium' ? '中' : '低'}优先级
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
