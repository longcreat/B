// 通用数据报表组件
// 支持大B和小B客户，根据用户类型显示不同的报表内容

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  MousePointerClick,
  Percent,
  Filter
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Partner } from '../../data/mockPartners';
import { getMockOrders } from '../../data/mockOrders';
import { filterOrdersByUserType, calculateOrderCommission } from '../../utils/orderUtils';
import { formatCurrency } from '../../utils/format';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

interface ReportsProps {
  currentPartner: Partner | null;
  userType: 'bigb' | 'smallb';
}

export function Reports({ currentPartner, userType }: ReportsProps) {
  const [dateRange, setDateRange] = useState('30');
  const allOrders = getMockOrders();
  
  // 根据用户类型过滤订单
  const orders = filterOrdersByUserType(allOrders, currentPartner, userType);
  
  // 模拟报表数据
  const getReportData = () => {
    const days = parseInt(dateRange);
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (userType === 'bigb') {
        // 大B数据：利润、订单数、小B数量
        data.push({
          date: dateStr,
          profit: Math.floor(Math.random() * 5000) + 2000,
          orders: Math.floor(Math.random() * 20) + 5,
          smallBCount: Math.floor(Math.random() * 5) + 1,
        });
      } else {
        // 小B数据：佣金、订单数、点击量、转化率
        data.push({
          date: dateStr,
          commission: Math.floor(Math.random() * 2000) + 500,
          orders: Math.floor(Math.random() * 15) + 2,
          clicks: Math.floor(Math.random() * 200) + 50,
          conversion: (Math.random() * 5 + 3).toFixed(2),
        });
      }
    }
    return data;
  };

  const reportData = getReportData();

  // 计算汇总数据
  const summary = userType === 'bigb' 
    ? {
        totalProfit: reportData.reduce((sum, d) => sum + d.profit, 0),
        totalOrders: reportData.reduce((sum, d) => sum + d.orders, 0),
        avgDailyProfit: reportData.length > 0 ? reportData.reduce((sum, d) => sum + d.profit, 0) / reportData.length : 0,
        avgDailyOrders: reportData.length > 0 ? reportData.reduce((sum, d) => sum + d.orders, 0) / reportData.length : 0,
      }
    : {
        totalCommission: reportData.reduce((sum, d) => sum + d.commission, 0),
        totalOrders: reportData.reduce((sum, d) => sum + d.orders, 0),
        totalClicks: reportData.reduce((sum, d) => sum + d.clicks, 0),
        avgConversion: reportData.length > 0 
          ? (reportData.reduce((sum, d) => sum + parseFloat(d.conversion), 0) / reportData.length).toFixed(2)
          : '0.00',
      };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>数据报表</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 时间范围选择 */}
      <div className="flex items-center justify-end">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">近7天</SelectItem>
            <SelectItem value="30">近30天</SelectItem>
            <SelectItem value="90">近90天</SelectItem>
            <SelectItem value="365">近一年</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 汇总指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userType === 'bigb' ? (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  累计利润
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalProfit)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  平均每日 {formatCurrency(summary.avgDailyProfit)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  累计订单
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {summary.totalOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  平均每日 {summary.avgDailyOrders.toFixed(1)} 单
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  活跃小B
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {reportData[reportData.length - 1]?.smallBCount || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  当前活跃小B客户数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  利润率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {summary.totalOrders > 0 ? ((summary.totalProfit / (summary.totalProfit * 1.2)) * 100).toFixed(1) : '0.0'}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  利润占销售额比例
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  累计佣金
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalCommission)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  近{dateRange}天累计
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  累计订单
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {summary.totalOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  成功转化订单数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <MousePointerClick className="w-4 h-4" />
                  累计点击
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {summary.totalClicks}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  推广链接点击量
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <Percent className="w-4 h-4" />
                  平均转化率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {summary.avgConversion}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  点击到订单转化率
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 趋势图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {userType === 'bigb' ? '利润趋势' : '佣金趋势'}
          </CardTitle>
          <CardDescription>
            近{dateRange}天的{userType === 'bigb' ? '利润' : '佣金'}变化趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [
                  userType === 'bigb' ? formatCurrency(value) : formatCurrency(value),
                  userType === 'bigb' ? '利润' : '佣金'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey={userType === 'bigb' ? 'profit' : 'commission'} 
                stroke={userType === 'bigb' ? '#f97316' : '#6366f1'} 
                fill={userType === 'bigb' ? '#f97316' : '#6366f1'}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 订单趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            订单趋势
          </CardTitle>
          <CardDescription>
            近{dateRange}天的订单数量变化
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value} 单`, '订单数']}
              />
              <Bar 
                dataKey="orders" 
                fill={userType === 'bigb' ? '#3b82f6' : '#8b5cf6'} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 小B特有：点击和转化率 */}
      {userType === 'smallb' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5" />
              点击与转化分析
            </CardTitle>
            <CardDescription>
              近{dateRange}天的点击量和转化率趋势
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="点击量"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="conversion" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="转化率(%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

