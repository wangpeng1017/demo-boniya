# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 项目概述

波尼亚AI平台是一个基于Next.js 14的智能化销售预测、竞品分析、客服管理一体化解决方案，专为食品行业打造。项目使用TypeScript开发，采用现代化的React App Router架构。

## 开发环境设置

### 环境要求
- Node.js 18.0 或更高版本
- Windows系统（当前部署环境）
- PowerShell 7.5+

### 常用开发命令

```bash
# 安装依赖
npm install

# 开发模式运行（默认端口3000）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查和修复
npm run lint

# 单独运行特定模块的开发
# 由于项目使用App Router，访问具体路由进行模块开发：
# http://localhost:3000/sales-forecast - 销售预测模块
# http://localhost:3000/competitor-analysis - 竞品分析模块
# http://localhost:3000/ecommerce-analysis - 电商分析模块
```

## 项目架构

### 技术栈核心组件
- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript (严格模式)
- **样式框架**: Tailwind CSS + 自定义主题颜色
- **UI组件**: 自定义组件 + Lucide React图标
- **图表库**: Recharts
- **表单处理**: React Hook Form
- **工具库**: clsx, tailwind-merge

### 目录结构规律
```
src/
├── app/                    # Next.js App Router页面
│   ├── layout.tsx         # 全局布局（左侧边栏+右侧内容）
│   ├── page.tsx           # 首页（综合仪表板）
│   ├── [module-name]/     # 各业务模块页面
│   │   └── page.tsx       # 模块主页面
├── components/            # 可复用组件
│   ├── layout/           # 布局相关组件
│   └── [module-name]/    # 模块专用组件
├── lib/                  # 核心工具和模拟数据
│   ├── utils.ts          # 通用工具函数
│   ├── mockData.ts       # 模拟业务数据
│   └── aiSimulation.ts   # AI功能模拟器
└── types/                # TypeScript类型定义
    └── index.ts          # 所有业务类型定义
```

### 关键架构模式

#### 1. 统一布局系统
- 左侧导航栏：固定宽度，可折叠，包含7个主要功能模块
- 右侧内容区：动态渲染各模块页面
- 响应式设计：完美适配桌面端和移动端

#### 2. 模块化业务设计
项目按业务功能分为7大核心模块：
1. **门店销售数量预测** (`/sales-forecast`)
2. **竞品价格分析** (`/competitor-analysis`)
3. **电商平台数据分析** (`/ecommerce-analysis`)
4. **智能客服管理** (`/customer-service`)
5. **门店运营标准化管理** (`/store-management`)
6. **产品品质智能控制** (`/quality-control`)
7. **称重商品自动识别** (`/product-recognition`)

#### 3. 数据模拟架构
- **完全模拟的数据层**：所有数据来自`src/lib/mockData.ts`
- **AI功能模拟器**：`src/lib/aiSimulation.ts`模拟Gemini AI分析
- **真实交互体验**：模拟API延迟、动态数据更新、交互反馈

## 开发指导

### 新增功能模块流程
1. 在`src/app/`下创建新的路由目录
2. 在`src/components/`下创建对应的组件目录
3. 在`src/types/index.ts`中定义相关TypeScript类型
4. 在`src/lib/mockData.ts`中添加模拟数据
5. 更新`src/components/layout/Sidebar.tsx`添加导航项

### 样式开发规范
- **主色调**: 使用预定义的`primary`和`secondary`颜色系列
- **图标**: 统一使用Lucide React图标库
- **间距**: 遵循Tailwind的标准间距系统
- **响应式**: 使用`md:`、`lg:`等断点前缀确保移动端适配

### AI功能开发指导
项目设计支持未来集成真实的Gemini AI服务：

#### 销售预测AI集成点
- 特征工程：`/api/forecast/extract-features`
- 报告生成：`/api/forecast/generate-report`
- 预期输入：历史销售数据 + 外部因素（天气、促销等）
- 预期输出：数值预测 + 自然语言分析报告

#### 竞品分析AI集成点
- 数据结构化：`/api/competitor-price/process-raw-data`
- 支持OCR图片识别和语音转文字
- 预期输入：原始文本（来自OCR或STT）
- 预期输出：结构化的品牌、产品、价格信息

#### 客户反馈AI集成点
- 多维分析：`/api/feedback/analyze`
- 预期输入：原始客户评论文本
- 预期输出：情感分析、问题分类、紧急程度、摘要

### 数据类型系统
所有业务数据类型在`src/types/index.ts`中统一定义，包括：
- 销售相关：`SalesData`、`SalesForecast`、`Store`、`Product`
- 竞品相关：`CompetitorPrice`、`CompetitorBrand`
- 反馈相关：`CustomerFeedback`、`FeedbackAnalysis`
- 工单相关：`CustomerTicket`
- 质检相关：`QualityCheck`、`StoreInspection`

### 工具函数指导
`src/lib/utils.ts`提供常用工具函数：
- `formatCurrency()`: 人民币格式化
- `formatDate()`/`formatDateTime()`: 中文日期格式化
- `delay()`: API调用延迟模拟
- `generateId()`: 随机ID生成
- `calculatePercentageChange()`: 百分比变化计算

### 数据可视化指导
- **图表库**: 使用Recharts，已集成响应式容器
- **图表类型**: 支持AreaChart、BarChart、LineChart、PieChart
- **颜色主题**: 使用Tailwind预定义颜色，确保视觉一致性
- **交互体验**: 添加Tooltip、Legend等交互元素

## 部署配置

### Vercel部署（推荐）
项目已优化用于Vercel部署：
- `vercel.json`配置文件已就位
- 支持Vercel Postgres数据库集成
- 支持Vercel Blob文件存储

### 环境变量配置
```env
# API集成（将来使用）
NEXT_PUBLIC_API_BASE_URL=your_api_url
GEMINI_API_KEY=your_gemini_api_key
```

## 重要开发注意事项

### 中文本地化
- 所有UI文本使用简体中文
- 日期时间格式遵循中国标准
- 数字和货币格式使用中文习惯

### 食品行业业务逻辑
- 产品单位统一使用"千克"
- 门店管理按"办事处"区域划分
- 竞品主要关注"喜旺"、"双汇"、"金锣"三大品牌
- 销售预测考虑天气、促销、节假日等因素

### 模拟数据的真实性
- 使用真实的产品编码（如B2102-026）
- 地址信息基于实际青岛地区门店分布
- 价格和销量数据反映真实市场情况的合理范围

### 性能优化建议
- 图表组件较多，注意使用React.memo优化重渲染
- 大量列表数据考虑虚拟化或分页处理
- 图片上传功能预留压缩和格式转换处理

这个项目展现了现代AI+零售业务系统的完整架构，模拟数据系统设计精良，为真实AI服务集成预留了清晰的接口。开发时重点关注业务逻辑的正确性和用户体验的流畅性。
