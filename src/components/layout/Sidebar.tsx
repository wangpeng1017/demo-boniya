'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare, 
  Store, 
  Shield, 
  Scan,
  Home,
  ChevronLeft,
  ChevronRight,
  Database,
  HeadphonesIcon,
  Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '市场信息管理', href: '/market-info', icon: Database },
  { name: '竞品价格分析', href: '/competitor-analysis', icon: TrendingUp },
  { name: '售后服务管理', href: '/customer-service', icon: HeadphonesIcon },
  { name: '门店销售数量预测', href: '/sales-forecast', icon: BarChart3 },
  { name: '门店运营标准化管理', href: '/store-management', icon: Store },
  { name: '产品品质智能控制', href: '/quality-control', icon: Shield },
  { name: '称重商品自动识别', href: '/product-recognition', icon: Scan },
]

const bottomNavigation = [
  { name: '消息通知', href: '/notifications', icon: Bell, badge: 3 },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo 区域 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">波</span>
              </div>
              <span className="font-semibold text-gray-900">波尼亚AI平台</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn(
                "flex-shrink-0",
                collapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                isActive ? "text-primary-600" : "text-gray-400"
              )} />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* 底部导航 */}
      <nav className="p-4 border-t border-gray-200 space-y-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                isActive
                  ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={collapsed ? item.name : undefined}
            >
              <div className="relative">
                <item.icon className={cn(
                  "flex-shrink-0",
                  collapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                  isActive ? "text-primary-600" : "text-gray-400"
                )} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
              {!collapsed && item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* 底部信息 */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>版本 v1.0.0</p>
            <p className="mt-1">© 2025 波尼亚食品</p>
          </div>
        </div>
      )}
    </div>
  )
}
