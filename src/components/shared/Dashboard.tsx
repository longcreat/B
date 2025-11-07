// 通用首页看板组件
// 支持大B和小B客户，根据用户类型显示不同的数据

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  ShoppingCart, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Partner } from '../../data/mockPartners';
import { getMockOrders } from '../../data/mockOrders';
import { filterOrdersByUserType, calculateOrderCommission } from '../../utils/orderUtils';
import { formatCurrency } from '../../utils/format';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

interface DashboardProps {
  currentPartner: Partner | null;
  userType: 'bigb' | 'smallb';
}

export function Dashboard({ currentPartner, userType }: DashboardProps) {
  const allOrders = getMockOrders();
  
  // 根据用户类型过滤订单
  const orders = useMemo(() => {
    if (!currentPartner) return [];
    return filterOrdersByUserType(allOrders, currentPartner, userType);
  }, [allOrders, currentPartner, userType]);

  // 计算统计数据
  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.orderStatus === 'completed');
    
    if (userType === 'bigb') {
      // 大B统计：总利润、订单数、小B数量
      const totalProfit = completedOrders.reduce((sum, order) => {
        const commission = calculateOrderCommission(order, currentPartner!);
        return sum + commission.bigBProfit;
      }, 0);
      
      const smallBCount = currentPartner ? 1 : 0; // 简化：实际应该从数据中获取
      
      return {
        totalProfit,
        orderCount: completedOrders.length,
        smallBCount,
        todayProfit: totalProfit * 0.05, // 模拟今日利润
        monthlyProfit: totalProfit,
      };
    } else {
      // 小B统计：总佣金、订单数、平均佣金
      const totalCommission = completedOrders.reduce((sum, order) => {
        const commission = calculateOrderCommission(order, currentPartner!);
        return sum + commission.smallBCommission;
      }, 0);
      
      const avgCommission = completedOrders.length > 0 
        ? totalCommission / completedOrders.length 
        : 0;
      
      return {
        totalCommission,
        orderCount: completedOrders.length,
        avgCommission,
        todayCommission: totalCommission * 0.05, // 模拟今日佣金
        monthlyCommission: totalCommission,
      };
    }
  }, [orders, currentPartner, userType]);

  // 模拟趋势数据
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: `10-${String(i + 1).padStart(2, '0')}`,
    value: userType === 'bigb' 
      ? (stats.totalProfit || 0) * (0.8 + Math.random() * 0.4) / 30
      : (stats.totalCommission || 0) * (0.8 + Math.random() * 0.4) / 30,
  }));

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>首页看板</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* KPI 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userType === 'bigb' ? (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  今日预估利润
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(stats.todayProfit || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600" />
                  较昨日增长 5.3%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  本月累计利润
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(stats.monthlyProfit || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  共 {stats.orderCount} 笔订单
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  小B客户数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {stats.smallBCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  活跃小B客户
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  订单总数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {stats.orderCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  已完成订单
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  今日预估佣金
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatCurrency(stats.todayCommission || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-green-600" />
                  较昨日增长 3.2%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  本月累计佣金
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(stats.monthlyCommission || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  共 {stats.orderCount} 笔订单
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <Wallet className="w-4 h-4" />
                  平均佣金
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatCurrency(stats.avgCommission || 0)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  每笔订单平均
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
                  <ShoppingCart className="w-4 h-4" />
                  订单总数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {stats.orderCount}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  已完成订单
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
            <Activity className="w-5 h-5" />
            {userType === 'bigb' ? '利润趋势（近30天）' : '佣金趋势（近30天）'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
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
                formatter={(value: number) => [formatCurrency(value), userType === 'bigb' ? '利润' : '佣金']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={userType === 'bigb' ? '#f97316' : '#6366f1'} 
                strokeWidth={2}
                dot={{ fill: userType === 'bigb' ? '#f97316' : '#6366f1', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 最近订单 */}
      <Card>
        <CardHeader>
          <CardTitle>最近订单</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无订单数据
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => {
                const commission = calculateOrderCommission(order, currentPartner!);
                return (
                  <div key={order.orderId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.hotelName}</span>
                        <Badge variant="outline">{order.orderStatus}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.checkInDate} - {order.checkOutDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {userType === 'bigb' 
                          ? formatCurrency(commission.bigBProfit)
                          : formatCurrency(commission.smallBCommission)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userType === 'bigb' ? '利润' : '佣金'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

