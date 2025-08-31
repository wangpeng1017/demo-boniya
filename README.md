# 波尼亚AI平台

波尼亚AI平台是一个智能化的销售预测、竞品分析、客服管理等一体化解决方案，专为食品行业打造。

## 🚀 功能特性

### 核心模块

1. **门店销售数量预测**
   - 基于AI算法的精准销量预测
   - 智能分析报告生成
   - 建议订单自动生成
   - 多维度数据可视化

2. **竞品价格分析**
   - 移动端优化的数据采集
   - OCR自动识别价格信息
   - 智能价格对比分析
   - 实时市场动态监控

3. **电商平台数据分析**
   - 多平台客户反馈整合
   - AI情感分析和问题分类
   - 智能预警系统
   - 词云和趋势分析

4. **智能客服管理**
   - 统一工单管理系统
   - 语音转文字功能
   - NLP深度分析
   - 自动回访机器人

5. **门店运营标准化管理**
   - AI视觉监控系统
   - 实时违规预警
   - 标准化执行报告
   - 摄像头管理界面

6. **产品品质智能控制**
   - 工业AI视觉检测
   - 来货/生产/出货全流程监控
   - 缺陷样本管理
   - 模型训练平台

7. **称重商品自动识别**
   - AI视觉识别散装商品
   - 与MOP收银系统对接
   - 商品SKU管理
   - 识别准确率监控

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **图表库**: Recharts
- **图标库**: Lucide React
- **表单处理**: React Hook Form
- **工具库**: clsx, tailwind-merge

## 📦 安装和运行

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产环境构建

```bash
npm run build
npm start
```

## 🚀 部署到Vercel

### 方法一：通过Vercel CLI

1. 安装Vercel CLI
```bash
npm i -g vercel
```

2. 登录Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel
```

### 方法二：通过Git集成

1. 将代码推送到GitHub仓库
2. 在Vercel控制台导入项目
3. 配置构建设置（通常自动检测）
4. 点击部署

### 环境变量配置

在Vercel控制台或本地`.env.local`文件中配置以下环境变量：

```env
# 如果需要连接真实API
NEXT_PUBLIC_API_BASE_URL=your_api_url
GEMINI_API_KEY=your_gemini_api_key
```

## 📱 功能演示

### 销售预测模块
- 支持多门店、多商品的销量预测
- AI生成详细的分析报告
- 可视化图表展示趋势
- 智能订货建议

### 竞品分析模块
- 移动端友好的拍照上传界面
- OCR自动识别商品信息
- 价格对比和差异分析
- 支持多品牌数据管理

### 电商分析模块
- 多平台反馈数据整合
- 情感分析和问题分类
- 紧急反馈预警系统
- 数据可视化展示

## 🎨 界面特性

- **响应式设计**: 完美适配桌面端和移动端
- **现代化UI**: 采用简洁的设计风格
- **交互友好**: 流畅的用户体验
- **数据可视化**: 丰富的图表和统计展示
- **实时更新**: 模拟真实的数据更新

## 🔧 开发说明

### 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── sales-forecast/    # 销售预测模块
│   ├── competitor-analysis/ # 竞品分析模块
│   ├── ecommerce-analysis/ # 电商分析模块
│   ├── customer-service/  # 客服管理模块
│   ├── store-management/  # 门店管理模块
│   ├── quality-control/   # 品质控制模块
│   └── product-recognition/ # 商品识别模块
├── components/            # 共用组件
│   └── layout/           # 布局组件
├── lib/                  # 工具函数和模拟数据
│   ├── utils.ts          # 通用工具函数
│   ├── mockData.ts       # 模拟数据
│   └── aiSimulation.ts   # AI功能模拟
└── types/                # TypeScript类型定义
```

### 模拟数据说明

项目使用完全模拟的数据和AI功能：
- 所有API调用都有模拟延迟
- AI分析结果基于规则生成
- 图表数据动态生成
- 支持交互式操作

### 自定义配置

可以通过修改以下文件来自定义应用：
- `tailwind.config.js` - 样式主题配置
- `src/lib/mockData.ts` - 模拟数据配置
- `src/lib/aiSimulation.ts` - AI功能模拟配置

## 📄 许可证

本项目仅用于演示目的。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📞 联系方式

如有问题或建议，请联系开发团队。

---

**注意**: 这是一个演示项目，所有数据和AI功能都是模拟的，不连接真实的后端服务。
