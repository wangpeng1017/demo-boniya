'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Download, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateForecastListData, ForecastListItem, mockStores, mockProducts } from '@/lib/mockData'
import { formatNumber, delay } from '@/lib/utils'

interface FilterState {
  cities: string[]
  districts: string[]
  stores: string[]
  products: string[]
  categories: string[]
}

interface SortConfig {
  key: keyof ForecastListItem | null
  direction: 'asc' | 'desc'
}

export default function ForecastListView() {
  const [data, setData] = useState<ForecastListItem[]>([])
  const [filteredData, setFilteredData] = useState<ForecastListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(50)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    districts: [],
    stores: [],
    products: [],
    categories: []
  })

  // 获取筛选选项
  const filterOptions = useMemo(() => {
    const cities = [...new Set(data.map(item => item.city))].sort()
    const districts = [...new Set(data.map(item => item.district))].sort()
    const stores = [...new Set(data.map(item => item.storeName))].sort()
    const products = [...new Set(data.map(item => item.productName))].sort()
    const categories = [...new Set(data.map(item => item.productCategory))].sort()
    
    return { cities, districts, stores, products, categories }
  }, [data])

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await delay(1000) // 模拟加载延迟
      const forecastData = generateForecastListData()
      setData(forecastData)
      setFilteredData(forecastData)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // 应用筛选和搜索
  useEffect(() => {
    let filtered = data

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 条件筛选
    if (filters.cities.length > 0) {
      filtered = filtered.filter(item => filters.cities.includes(item.city))
    }
    if (filters.districts.length > 0) {
      filtered = filtered.filter(item => filters.districts.includes(item.district))
    }
    if (filters.stores.length > 0) {
      filtered = filtered.filter(item => filters.stores.includes(item.storeName))
    }
    if (filters.products.length > 0) {
      filtered = filtered.filter(item => filters.products.includes(item.productName))
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.productCategory))
    }

    setFilteredData(filtered)
    setCurrentPage(1) // 重置到第一页
  }, [data, searchTerm, filters])

  // 排序
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      
      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
      }
    })
  }, [filteredData, sortConfig])

  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  // 统计数据
  const statistics = useMemo(() => {
    const totalStores = new Set(filteredData.map(item => item.storeName)).size
    const totalProducts = new Set(filteredData.map(item => item.productName)).size
    const totalT1 = filteredData.reduce((sum, item) => sum + item.t1, 0)
    const totalT7 = filteredData.reduce((sum, item) => sum + item.t7, 0)
    
    return {
      totalStores,
      totalProducts,
      totalRecords: filteredData.length,
      totalT1: Math.round(totalT1 * 100) / 100,
      totalT7: Math.round(totalT7 * 100) / 100,
      avgConfidence: Math.round(filteredData.reduce((sum, item) => sum + item.confidence, 0) / filteredData.length * 100)
    }
  }, [filteredData])

  const handleSort = (key: keyof ForecastListItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (type: keyof FilterState, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(item => item !== value)
    }))
  }

  const clearFilters = () => {
    setFilters({
      cities: [],
      districts: [],
      stores: [],
      products: [],
      categories: []
    })
    setSearchTerm('')
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const exportToExcel = () => {
    // 模拟导出功能
    const csvContent = [
      ['城市', '区域', '门店名称', '商品名称', 'T+1', 'T+2', 'T+3', 'T+4', 'T+5', 'T+6', 'T+7', '趋势', '置信度'].join(','),
      ...filteredData.map(item => [
        item.city,
        item.district,
        item.storeName,
        item.productName,
        item.t1,
        item.t2,
        item.t3,
        item.t4,
        item.t5,
        item.t6,
        item.t7,
        item.trend,
        Math.round(item.confidence * 100) + '%'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `销量预测数据_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">正在加载预测数据...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600">总门店数</div>
          <div className="text-2xl font-bold text-blue-900">{statistics.totalStores}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600">总商品数</div>
          <div className="text-2xl font-bold text-green-900">{statistics.totalProducts}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600">总记录数</div>
          <div className="text-2xl font-bold text-purple-900">{statistics.totalRecords}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600">T+1总量</div>
          <div className="text-2xl font-bold text-orange-900">{formatNumber(statistics.totalT1)}kg</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-600">T+7总量</div>
          <div className="text-2xl font-bold text-red-900">{formatNumber(statistics.totalT7)}kg</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">平均置信度</div>
          <div className="text-2xl font-bold text-gray-900">{statistics.avgConfidence}%</div>
        </div>
      </div>

      {/* 搜索和筛选工具栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索门店、商品、城市..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </button>
            {(Object.values(filters).some(arr => arr.length > 0) || searchTerm) && (
              <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-800">
                清除筛选
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={exportToExcel} className="btn-primary flex items-center">
              <Download className="w-4 h-4 mr-2" />
              导出Excel
            </button>
          </div>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* 城市筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filterOptions.cities.map(city => (
                    <label key={city} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.cities.includes(city)}
                        onChange={(e) => handleFilterChange('cities', city, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 区域筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">区域</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filterOptions.districts.map(district => (
                    <label key={district} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.districts.includes(district)}
                        onChange={(e) => handleFilterChange('districts', district, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{district}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 商品类别筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品类别</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filterOptions.categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => handleFilterChange('categories', category, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 门店筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">门店</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filterOptions.stores.slice(0, 10).map(store => (
                    <label key={store} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.stores.includes(store)}
                        onChange={(e) => handleFilterChange('stores', store, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{store}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 商品筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">商品</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {filterOptions.products.map(product => (
                    <label key={product} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.products.includes(product)}
                        onChange={(e) => handleFilterChange('products', product, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{product}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('city')}
                >
                  城市 {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('district')}
                >
                  区域 {sortConfig.key === 'district' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('storeName')}
                >
                  门店名称 {sortConfig.key === 'storeName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('productName')}
                >
                  商品名称 {sortConfig.key === 'productName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t1')}
                >
                  T+1 {sortConfig.key === 't1' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t2')}
                >
                  T+2 {sortConfig.key === 't2' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t3')}
                >
                  T+3 {sortConfig.key === 't3' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t4')}
                >
                  T+4 {sortConfig.key === 't4' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t5')}
                >
                  T+5 {sortConfig.key === 't5' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t6')}
                >
                  T+6 {sortConfig.key === 't6' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('t7')}
                >
                  T+7 {sortConfig.key === 't7' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  趋势
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('confidence')}
                >
                  置信度 {sortConfig.key === 'confidence' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.storeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.productName}</div>
                    <div className="text-xs text-gray-500">{item.productCategory}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t1}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t2}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t3}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t4}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t5}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t6}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${getTrendColor(item.trend)}`}>
                    {item.t7}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getTrendIcon(item.trend)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {Math.round(item.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * pageSize >= sortedData.length}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, sortedData.length)}
                </span>{' '}
                条，共 <span className="font-medium">{sortedData.length}</span> 条记录
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  第 {currentPage} 页，共 {Math.ceil(sortedData.length / pageSize)} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= sortedData.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 数据更新时间 */}
      <div className="text-center text-sm text-gray-500">
        数据更新时间：{new Date().toLocaleString('zh-CN')}
      </div>
    </div>
  )
}
