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

import After400View from '@/components/customer-service/After400View'
import EcommerceView from '@/components/customer-service/EcommerceView'
import OverviewView from '@/components/customer-service/OverviewView'

export default function CustomerServicePage() {
  const [subTab, setSubTab] = useState<'after400'|'ecommerce'|'overview'>('after400')
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
          售后服务管理
        </h1>
        <p className="text-gray-600 mt-1">售后服务数据分析与智能处理系统</p>
        {/* 子菜单切换（同页内Tab） */}
        <div className="mt-3 flex items-center space-x-6 text-sm">
          <button onClick={() => setSubTab('after400')} className={`pb-1 border-b-2 ${subTab==='after400'?'border-primary-500 text-primary-600':'border-transparent text-gray-600 hover:text-gray-900'}`}>400售后分析</button>
          <button onClick={() => setSubTab('ecommerce')} className={`pb-1 border-b-2 ${subTab==='ecommerce'?'border-primary-500 text-primary-600':'border-transparent text-gray-600 hover:text-gray-900'}`}>电商平台售后分析</button>
          <button onClick={() => setSubTab('overview')} className={`pb-1 border-b-2 ${subTab==='overview'?'border-primary-500 text-primary-600':'border-transparent text-gray-600 hover:text-gray-900'}`}>综合数据分析</button>
        </div>
      </div>


      {subTab==='after400' && (
        <div className="mt-4">
          <After400View />
        </div>
      )}

      {subTab==='ecommerce' && (
        <div className="mt-4">
          <EcommerceView />
        </div>
      )}

      {subTab==='overview' && (
        <div className="mt-4">
          <OverviewView />
        </div>
      )}
    </div>
  )
}
