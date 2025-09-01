'use client'

import { useState } from 'react'
import { X, Download, Brain, TrendingUp, Calendar, Cloud, Thermometer } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface AILLMPredictionProps {
  isOpen: boolean
  onClose: () => void
  selectedStore: string
  selectedProduct: string
  storeName: string
  productName: string
}

interface WeatherData {
  date: string
  weather: string
  temperature: string
  humidity: string
}

interface HistoricalData {
  date: string
  sales: number
  dayOfWeek: string
  weather: string
  temperature: string
}

interface AIPredictionResult {
  date: string
  predictedSales: number
  confidence: number
  reasoning: string
  weatherFactor: string
  dayOfWeekFactor: string
}

interface AIAnalysisReport {
  summary: string
  totalPredicted: number
  avgConfidence: number
  keyFactors: string[]
  recommendations: string[]
  predictions: AIPredictionResult[]
}

export default function AILLMPrediction({ 
  isOpen, 
  onClose, 
  selectedStore, 
  selectedProduct, 
  storeName, 
  productName 
}: AILLMPredictionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisReport | null>(null)

  // 生成模拟历史销售数据
  const generateHistoricalData = (): HistoricalData[] => {
    const data: HistoricalData[] = []
    const today = new Date()
    const weatherOptions = ['晴', '多云', '阴', '小雨', '中雨']
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    // 生成过去30天的历史数据
    for (let i = 30; i >= 1; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
      const temperature = Math.round(15 + Math.random() * 20) // 15-35度
      
      // 基础销量：周末更高，天气好更高
      let baseSales = 25 + Math.random() * 15
      if (isWeekend) baseSales *= 1.3
      if (weather === '晴') baseSales *= 1.1
      if (weather === '中雨') baseSales *= 0.8
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.round(baseSales * 100) / 100,
        dayOfWeek: dayNames[dayOfWeek],
        weather,
        temperature: `${temperature}°C`
      })
    }
    
    return data
  }

  // 生成未来6天天气预报
  const generateWeatherForecast = (): WeatherData[] => {
    const forecast: WeatherData[] = []
    const today = new Date()
    const weatherOptions = ['晴', '多云', '阴', '小雨']
    
    for (let i = 1; i <= 6; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      
      const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
      const temperature = Math.round(18 + Math.random() * 15) // 18-33度
      const humidity = Math.round(40 + Math.random() * 40) // 40-80%
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        weather,
        temperature: `${temperature}°C`,
        humidity: `${humidity}%`
      })
    }
    
    return forecast
  }

  // 生成AI预测分析
  const generateAIPrediction = async () => {
    setIsGenerating(true)
    
    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 4000))
    
    const historicalData = generateHistoricalData()
    const weatherForecast = generateWeatherForecast()
    const today = new Date()
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    // 计算历史平均销量
    const avgSales = historicalData.reduce((sum, item) => sum + item.sales, 0) / historicalData.length
    const weekendAvg = historicalData.filter(item => 
      item.dayOfWeek === '周六' || item.dayOfWeek === '周日'
    ).reduce((sum, item) => sum + item.sales, 0) / historicalData.filter(item => 
      item.dayOfWeek === '周六' || item.dayOfWeek === '周日'
    ).length
    
    const weekdayAvg = historicalData.filter(item => 
      item.dayOfWeek !== '周六' && item.dayOfWeek !== '周日'
    ).reduce((sum, item) => sum + item.sales, 0) / historicalData.filter(item => 
      item.dayOfWeek !== '周六' && item.dayOfWeek !== '周日'
    ).length

    // 生成未来7天预测
    const predictions: AIPredictionResult[] = []
    let totalPredicted = 0
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dayOfWeek = date.getDay()
      const dayName = dayNames[dayOfWeek]
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // 获取对应的天气预报（前6天有预报，第7天使用估计）
      const weather = i <= 6 ? weatherForecast[i-1].weather : '多云'
      const temperature = i <= 6 ? weatherForecast[i-1].temperature : '25°C'
      
      // 基于历史数据和天气预测销量
      let predictedSales = isWeekend ? weekendAvg : weekdayAvg
      
      // 天气影响因子
      let weatherMultiplier = 1.0
      let weatherFactor = ''
      if (weather === '晴') {
        weatherMultiplier = 1.1
        weatherFactor = '晴天促进销量增长10%'
      } else if (weather === '小雨') {
        weatherMultiplier = 0.9
        weatherFactor = '小雨天气略微影响销量，下降10%'
      } else if (weather === '中雨') {
        weatherMultiplier = 0.8
        weatherFactor = '雨天显著影响客流，销量下降20%'
      } else {
        weatherFactor = '多云/阴天对销量影响较小'
      }
      
      predictedSales *= weatherMultiplier
      
      // 添加一些随机波动
      predictedSales *= (0.95 + Math.random() * 0.1)
      predictedSales = Math.round(predictedSales * 100) / 100
      
      const confidence = 0.82 + Math.random() * 0.15 // 82-97%的置信度
      
      const dayOfWeekFactor = isWeekend ? 
        `周末销量通常比工作日高${Math.round((weekendAvg/weekdayAvg - 1) * 100)}%` :
        '工作日销量相对稳定'
      
      const reasoning = `基于历史${dayName}平均销量${Math.round(isWeekend ? weekendAvg : weekdayAvg)}kg，考虑${weather}天气影响和季节性因素，预测销量为${predictedSales}kg`
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predictedSales,
        confidence: Math.round(confidence * 100) / 100,
        reasoning,
        weatherFactor,
        dayOfWeekFactor
      })
      
      totalPredicted += predictedSales
    }
    
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
    
    const result: AIAnalysisReport = {
      summary: `基于${storeName}的${productName}历史30天销售数据分析，结合未来7天天气预报和消费模式，AI大语言模型预测未来一周总销量为${Math.round(totalPredicted)}kg。模型识别出周末销量显著高于工作日，天气状况对销量有明显影响。`,
      totalPredicted: Math.round(totalPredicted * 100) / 100,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      keyFactors: [
        `历史数据显示周末销量比工作日高${Math.round((weekendAvg/weekdayAvg - 1) * 100)}%`,
        '晴天销量通常增长10%，雨天销量下降10-20%',
        '该商品销量与气温呈正相关，温度适宜时销量更佳',
        '近期销量趋势稳定，无明显异常波动'
      ],
      recommendations: [
        `建议本周总备货量：${Math.round(totalPredicted * 1.15)}kg（含15%安全库存）`,
        '重点关注周末备货，建议周五下午补货到位',
        '雨天可适当减少备货，晴天可增加10%库存',
        '建议与天气预报保持同步，及时调整每日备货计划'
      ],
      predictions
    }
    
    setAnalysisResult(result)
    setIsGenerating(false)
  }

  // 导出预测结果
  const exportPrediction = () => {
    if (!analysisResult) return

    const csvContent = [
      ['日期', '预测销量(kg)', '置信度(%)', '天气因素', '星期因素', '预测依据'].join(','),
      ...analysisResult.predictions.map(pred => [
        pred.date,
        pred.predictedSales,
        Math.round(pred.confidence * 100),
        pred.weatherFactor,
        pred.dayOfWeekFactor,
        pred.reasoning
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `AI预测报告_${storeName}_${productName}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">AI大语言模型预测</h2>
          </div>
          <div className="flex items-center space-x-2">
            {analysisResult && (
              <button
                onClick={exportPrediction}
                className="btn-secondary text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                导出预测
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!analysisResult ? (
            <div className="text-center py-12">
              {!isGenerating ? (
                <div>
                  <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI大语言模型预测分析</h3>
                  <div className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    <p className="mb-4">
                      <strong>分析对象：</strong>{storeName} - {productName}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg text-left">
                      <h4 className="font-medium mb-2">分析模板：</h4>
                      <p className="text-sm">
                        你是一位专业的食品零售数据分析师。根据'{storeName}'的'{productName}'历史销售数据
                        （包含日期、销量、星期、天气等维度），以及未来6天的天气预报数据。
                        请基于这些数据预测未来七天的每日销量，并提供详细的分析依据。
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={generateAIPrediction}
                    className="btn-primary flex items-center mx-auto"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    开始AI预测分析
                  </button>
                </div>
              ) : (
                <div>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI正在分析中...</h3>
                  <p className="text-gray-600">
                    正在分析历史销售数据、天气模式和消费趋势，生成智能预测报告...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 预测摘要 */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  AI预测摘要
                </h3>
                <p className="text-gray-700 mb-4">{analysisResult.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(analysisResult.totalPredicted)}kg
                    </div>
                    <div className="text-sm text-gray-600">预测总销量</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(analysisResult.avgConfidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">平均置信度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">7天</div>
                    <div className="text-sm text-gray-600">预测周期</div>
                  </div>
                </div>
              </div>

              {/* 关键因素分析 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">关键影响因素</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.keyFactors.map((factor, index) => (
                    <div key={index} className="flex items-start p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 详细预测结果 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">未来7天详细预测</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          日期
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          预测销量
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          置信度
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          天气影响
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          预测依据
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analysisResult.predictions.map((pred, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {new Date(pred.date).toLocaleDateString('zh-CN', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  weekday: 'short'
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {pred.predictedSales}kg
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              pred.confidence >= 0.9 ? 'bg-green-100 text-green-800' :
                              pred.confidence >= 0.8 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(pred.confidence * 100)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Cloud className="w-4 h-4 mr-1" />
                              <span className="truncate max-w-xs">{pred.weatherFactor}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 truncate max-w-xs block">
                              {pred.reasoning}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 行动建议 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI建议</h3>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                      <div className="w-4 h-4 bg-blue-600 rounded-full mr-3 mt-0.5 flex-shrink-0"></div>
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
