'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3, TrendingUp, Users, ShoppingCart, AlertTriangle, CheckCircle,
  Eye, Brain, Shield, Scan, Store, MessageSquare, Clock, Target,
  ArrowUpRight, ArrowDownRight, Activity, Zap, Calendar, Bell
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

// 模拟数据
const salesData = [
  { name: '周一', value: 120, target: 110 },
  { name: '周二', value: 150, target: 140 },
  { name: '周三', value: 180, target: 170 },
  { name: '周四', value: 160, target: 165 },
  { name: '周五', value: 200, target: 190 },
  { name: '周六', value: 250, target: 240 },
  { name: '周日', value: 220, target: 210 },
]

const pieData = [
  { name: '正面反馈', value: 65, color: '#10b981' },
  { name: '中性反馈', value: 25, color: '#f59e0b' },
  { name: '负面反馈', value: 10, color: '#ef4444' },
]

const storePerformanceData = [
  { name: '城阳店', sales: 85, efficiency: 92, satisfaction: 88 },
  { name: '市北店', sales: 78, efficiency: 85, satisfaction: 91 },
  { name: '李沧店', sales: 92, efficiency: 88, satisfaction: 85 },
  { name: '崂山店', sales: 88, efficiency: 90, satisfaction: 89 },
  { name: '黄岛店', sales: 82, efficiency: 87, satisfaction: 86 },
]

const recentActivities = [
  { id: 1, type: 'alert', message: '城阳店库存预警：维也纳香肠库存不足', time: '5分钟前', urgent: true },
  { id: 2, type: 'success', message: 'AI预测报告已生成：本周销量预计增长8%', time: '15分钟前', urgent: false },
  { id: 3, type: 'info', message: '竞品价格更新：检测到3个产品价格变动', time: '30分钟前', urgent: false },
  { id: 4, type: 'warning', message: '客服工单积压：待处理工单超过20个', time: '1小时前', urgent: true },
  { id: 5, type: 'success', message: '门店巡检完成：所有门店标准化执行良好', time: '2小时前', urgent: false },
]

const moduleStats = [
  { name: '销售预测', icon: BarChart3, value: '94.2%', label: '预测准确率', trend: '+2.1%', color: 'blue' },
  { name: '竞品分析', icon: TrendingUp, value: '156', label: '监控产品', trend: '+12', color: 'green' },
  { name: '客服管理', icon: MessageSquare, value: '23', label: '待处理工单', trend: '-5', color: 'orange' },
  { name: '门店管理', icon: Store, value: '98.5%', label: '合规率', trend: '+1.2%', color: 'purple' },
  { name: '品质控制', icon: Shield, value: '99.1%', label: '检测准确率', trend: '+0.3%', color: 'red' },
  { name: '商品识别', icon: Scan, value: '97.8%', label: '识别准确率', trend: '+1.5%', color: 'indigo' },
]

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRealTimeMode, setIsRealTimeMode] = useState(true)

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 获取颜色样式
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50',
      red: 'text-red-600 bg-red-50',
      indigo: 'text-indigo-600 bg-indigo-50',
    }
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  // 获取活动图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <Clock className="w-4 h-4 text-orange-500" />
      case 'info': return <Activity className="w-4 h-4 text-blue-500" />
      default: return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和实时状态 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">波尼亚AI平台</h1>
            <p className="text-gray-600">智能化销售预测、竞品分析、客服管理等一体化解决方案</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Activity className={`w-4 h-4 mr-1 ${isRealTimeMode ? 'text-green-500' : 'text-gray-400'}`} />
              {isRealTimeMode ? '实时监控中' : '离线模式'}
            </div>
            <div className="text-lg font-mono text-gray-900">
              {currentTime.toLocaleTimeString('zh-CN')}
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 核心KPI卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">今日销售额</p>
              <p className="text-3xl font-bold">¥89,456</p>
              <p className="text-blue-100 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                较昨日 +12.5%
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">AI预测准确率</p>
              <p className="text-3xl font-bold">94.2%</p>
              <p className="text-green-100 flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                本周 +2.1%
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Brain className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">在线门店</p>
              <p className="text-3xl font-bold">156/156</p>
              <p className="text-purple-100 flex items-center mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                100% 在线
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Store className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">紧急工单</p>
              <p className="text-3xl font-bold">5</p>
              <p className="text-orange-100 flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 mr-1" />
                需立即处理
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* 模块状态概览 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          模块运行状态
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleStats.map((module, index) => (
            <Link
              key={index}
              href={`/${module.name === '销售预测' ? 'sales-forecast' :
                      module.name === '竞品分析' ? 'competitor-analysis' :
                      module.name === '客服管理' ? 'customer-service' :
                      module.name === '门店管理' ? 'store-management' :
                      module.name === '品质控制' ? 'quality-control' :
                      'product-recognition'}`}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getColorClasses(module.color)}`}>
                  <module.icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{module.value}</div>
                  <div className={`text-xs font-medium ${
                    module.trend.startsWith('+') ? 'text-green-600' :
                    module.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {module.trend}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {module.name}
                </div>
                <div className="text-sm text-gray-600">{module.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 数据分析区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 销售趋势图 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">销售趋势对比</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">实际销量</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">预测目标</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorActual)"
                strokeWidth={2}
                name="实际销量"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorTarget)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="预测目标"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 客户反馈分析 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">客户反馈分析</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 门店表现排行 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          门店表现排行
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={storePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" name="销售指数" />
            <Bar dataKey="efficiency" fill="#10b981" name="运营效率" />
            <Bar dataKey="satisfaction" fill="#f59e0b" name="客户满意度" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 实时活动和快速操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时活动动态 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              实时活动
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              实时更新
            </div>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border-l-4 ${
                  activity.urgent
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  {activity.urgent && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      紧急
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            快速操作
          </h3>
          <div className="space-y-4">
            <Link
              href="/sales-forecast"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      生成销售预测报告
                    </h4>
                    <p className="text-sm text-gray-600">基于最新数据生成本周预测</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>

            <Link
              href="/competitor-analysis"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                      查看竞品分析
                    </h4>
                    <p className="text-sm text-gray-600">最新竞品价格对比分析</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </Link>

            <Link
              href="/customer-service"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                      处理客服工单
                    </h4>
                    <p className="text-sm text-gray-600">5个紧急工单需要立即处理</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    5个紧急
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </div>
            </Link>

            <Link
              href="/ecommerce-analysis"
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-purple-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      AI洞察分析
                    </h4>
                    <p className="text-sm text-gray-600">查看最新的客户反馈AI分析</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
