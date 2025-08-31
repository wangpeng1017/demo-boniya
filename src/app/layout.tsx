import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '波尼亚AI平台',
  description: '波尼亚AI平台 - 智能化销售预测、竞品分析、客服管理等一体化解决方案',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* 左侧导航栏 */}
          <Sidebar />
          
          {/* 右侧内容区 */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
