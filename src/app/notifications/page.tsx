'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, Clock, Smartphone, TrendingUp, MapPin, Calendar, Eye, MoreVertical } from 'lucide-react'
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

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-primary-600" />
            消息通知
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">实时接收系统推送和业务通知</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-secondary text-sm flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            标记全部已读
          </button>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">总通知数</p>
              <p className="text-3xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">未读消息</p>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">调价建议</p>
              <p className="text-3xl font-bold">
                {notifications.filter(n => n.type === 'price-adjustment').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">移动端推送</p>
              <p className="text-3xl font-bold">
                {notifications.filter(n => n.source === 'mobile').length}
              </p>
            </div>
            <Smartphone className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* 筛选选项 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部通知 ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            未读消息 ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('price-adjustment')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'price-adjustment' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            调价建议 ({notifications.filter(n => n.type === 'price-adjustment').length})
          </button>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
            <p className="text-gray-600">没有找到符合条件的通知消息</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type)
            return (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id)
                  setSelectedNotification(notification)
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'price-adjustment' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <TypeIcon className={`w-5 h-5 ${
                      notification.type === 'price-adjustment' ? 'text-green-600' :
                      notification.type === 'warning' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`mt-1 text-sm ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* 调价建议的具体数据 */}
                        {notification.type === 'price-adjustment' && notification.data && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <span className="text-gray-500">区域：</span>
                                <span className="font-medium">{notification.data.region}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">产品：</span>
                                <span className="font-medium">{notification.data.product}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">当前价格：</span>
                                <span className="font-medium">{notification.data.currentPrice}元/kg</span>
                              </div>
                              <div>
                                <span className="text-gray-500">建议价格：</span>
                                <span className="font-medium text-green-600">{notification.data.suggestedPrice}元/kg</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyle(notification.priority)}`}>
                          {notification.priority === 'high' ? '高' : notification.priority === 'medium' ? '中' : '低'}优先级
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDateTime(notification.timestamp)}
                      </div>
                      <div className="flex items-center">
                        <Smartphone className="w-3 h-3 mr-1" />
                        {notification.source === 'mobile' ? '移动端' : notification.source === 'web' ? 'Web端' : '系统'}
                      </div>
                      <div className="flex items-center">
                        <span>{notification.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 通知详情模态框 */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">通知详情</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedNotification.title}</h3>
                  <p className="mt-2 text-gray-700">{selectedNotification.message}</p>
                </div>
                
                {selectedNotification.type === 'price-adjustment' && selectedNotification.data && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">调价建议详情</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">区域</div>
                        <div className="font-medium">{selectedNotification.data.region}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">产品</div>
                        <div className="font-medium">{selectedNotification.data.product}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">当前价格</div>
                        <div className="font-medium">{selectedNotification.data.currentPrice}元/kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">建议价格</div>
                        <div className="font-medium text-green-600">{selectedNotification.data.suggestedPrice}元/kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">竞品价格</div>
                        <div className="font-medium">{selectedNotification.data.rivalPrice}元/kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">调价理由</div>
                        <div className="font-medium">{selectedNotification.data.reasoning}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  推送时间：{formatDateTime(selectedNotification.timestamp)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
