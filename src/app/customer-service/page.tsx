'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Phone, Mail, Clock, User, AlertTriangle, CheckCircle, Play } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { formatDateTime, delay } from '@/lib/utils'

interface CustomerTicket {
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
  audioUrl?: string
  transcription?: string
}

const mockTickets: CustomerTicket[] = [
  {
    id: 'T001',
    customerId: 'C001',
    customerName: '张女士',
    channel: '电话',
    subject: '产品质量问题',
    description: '购买的火腿肠中发现异物，要求退换货',
    status: 'open',
    priority: 'high',
    createdAt: '2025-08-31T09:30:00Z',
    updatedAt: '2025-08-31T09:30:00Z',
    audioUrl: '/audio/call-001.mp3'
  },
  {
    id: 'T002',
    customerId: 'C002',
    customerName: '李先生',
    channel: '在线客服',
    subject: '物流配送延迟',
    description: '订单已下单3天，但物流信息显示仍未发货',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: '客服小王',
    createdAt: '2025-08-30T14:20:00Z',
    updatedAt: '2025-08-31T08:15:00Z'
  },
  {
    id: 'T003',
    customerId: 'C003',
    customerName: '王女士',
    channel: '微信',
    subject: '产品咨询',
    description: '想了解新品的营养成分和保质期信息',
    status: 'resolved',
    priority: 'low',
    assignedTo: '客服小李',
    createdAt: '2025-08-30T10:45:00Z',
    updatedAt: '2025-08-30T16:30:00Z',
    resolvedAt: '2025-08-30T16:30:00Z'
  }
]

export default function CustomerServicePage() {
  const [tickets, setTickets] = useState<CustomerTicket[]>(mockTickets)
  const [selectedStatus, setSelectedStatus] = useState('全部')
  const [selectedPriority, setSelectedPriority] = useState('全部')
  const [selectedChannel, setSelectedChannel] = useState('全部')
  const [isTranscribing, setIsTranscribing] = useState<string | null>(null)

  const statusOptions = ['全部', 'open', 'in_progress', 'resolved', 'closed']
  const priorityOptions = ['全部', 'low', 'medium', 'high', 'urgent']
  const channelOptions = ['全部', '电话', '在线客服', '微信', '邮件']

  const statusColors = {
    open: '#ef4444',
    in_progress: '#f59e0b',
    resolved: '#10b981',
    closed: '#6b7280'
  }

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626'
  }

  // 模拟语音转文字
  const transcribeAudio = async (ticketId: string) => {
    setIsTranscribing(ticketId)
    await delay(3000) // 模拟转录延迟

    const mockTranscription = "客户反映购买的火腿肠中发现了一根头发，感到非常不满，要求退货并赔偿。客户情绪比较激动，需要耐心处理。"
    
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, transcription: mockTranscription }
        : ticket
    ))
    
    setIsTranscribing(null)
  }

  // 筛选工单
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = selectedStatus === '全部' || ticket.status === selectedStatus
    const priorityMatch = selectedPriority === '全部' || ticket.priority === selectedPriority
    const channelMatch = selectedChannel === '全部' || ticket.channel === selectedChannel
    return statusMatch && priorityMatch && channelMatch
  })

  // 统计数据
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length
  }

  const statusData = [
    { name: '待处理', value: stats.open, color: statusColors.open },
    { name: '处理中', value: stats.inProgress, color: statusColors.in_progress },
    { name: '已解决', value: stats.resolved, color: statusColors.resolved },
    { name: '已关闭', value: tickets.filter(t => t.status === 'closed').length, color: statusColors.closed }
  ]

  const channelData = [
    { name: '电话', value: tickets.filter(t => t.channel === '电话').length },
    { name: '在线客服', value: tickets.filter(t => t.channel === '在线客服').length },
    { name: '微信', value: tickets.filter(t => t.channel === '微信').length },
    { name: '邮件', value: tickets.filter(t => t.channel === '邮件').length }
  ]

  const getStatusStyle = (status: string) => {
    const styles = {
      open: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityStyle = (priority: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      urgent: 'bg-red-200 text-red-900'
    }
    return styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      open: '待处理',
      in_progress: '处理中',
      resolved: '已解决',
      closed: '已关闭'
    }
    return texts[status as keyof typeof texts] || status
  }

  const getPriorityText = (priority: string) => {
    const texts = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '紧急'
    }
    return texts[priority as keyof typeof texts] || priority
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-primary-600" />
          智能客服管理
        </h1>
        <p className="text-gray-600 mt-1">统一客服工单管理与智能分析系统</p>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总工单数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">处理中</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已解决</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">紧急工单</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* 图表分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">工单状态分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">渠道分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">工单筛选</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === '全部' ? '全部' : getStatusText(status)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>
                  {priority === '全部' ? '全部' : getPriorityText(priority)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">渠道</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {channelOptions.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 工单列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">工单列表</h3>
          <p className="text-sm text-gray-600">共 {filteredTickets.length} 个工单</p>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">#{ticket.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ticket.channel}
                    </span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                  <p className="text-gray-600 mb-2">{ticket.description}</p>
                  
                  {/* 语音转录功能 */}
                  {ticket.audioUrl && (
                    <div className="bg-blue-50 rounded-md p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">📞 通话录音</span>
                        <button
                          onClick={() => transcribeAudio(ticket.id)}
                          disabled={isTranscribing === ticket.id}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {isTranscribing === ticket.id ? '转录中...' : '语音转文字'}
                        </button>
                      </div>
                      {isTranscribing === ticket.id && (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          AI正在转录语音内容...
                        </div>
                      )}
                      {ticket.transcription && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <p className="text-sm text-gray-700">
                            <strong>转录内容：</strong>{ticket.transcription}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ticket.customerName}
                    </span>
                    <span>创建时间：{formatDateTime(ticket.createdAt)}</span>
                    {ticket.assignedTo && (
                      <span>负责人：{ticket.assignedTo}</span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <button className="btn-primary text-sm">
                    处理工单
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
