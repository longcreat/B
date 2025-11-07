import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MousePointerClick, ShoppingCart, Percent, DollarSign, TrendingUp, Filter, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Order {
  id: string;
  orderNo: string;
  orderDate: string;
  amount: number;
  points: number;
  status: 'frozen' | 'settled' | 'cancelled' | 'refunded';
  campaign?: string;
}

const mockOrders: Order[] = [
  { id: '1', orderNo: 'ORD****1001', orderDate: '2025-10-31', amount: 2180, points: 218, status: 'frozen', campaign: 'wechat_group_1' },
  { id: '2', orderNo: 'ORD****1002', orderDate: '2025-10-30', amount: 3420, points: 342, status: 'settled', campaign: 'xiaohongshu_article_a' },
  { id: '3', orderNo: 'ORD****1003', orderDate: '2025-10-29', amount: 4150, points: 415, status: 'settled' },
  { id: '4', orderNo: 'ORD****1004', orderDate: '2025-10-28', amount: 1890, points: 0, status: 'cancelled', campaign: 'wechat_group_1' },
  { id: '5', orderNo: 'ORD****1005', orderDate: '2025-10-27', amount: 2650, points: -265, status: 'refunded' },
];

const performanceData = [
  { date: '10-25', clicks: 120, orders: 8, conversion: 6.67, commission: 680 },
  { date: '10-26', clicks: 145, orders: 10, conversion: 6.90, commission: 850 },
  { date: '10-27', clicks: 98, orders: 6, conversion: 6.12, commission: 520 },
  { date: '10-28', clicks: 168, orders: 12, conversion: 7.14, commission: 1020 },
  { date: '10-29', clicks: 152, orders: 11, conversion: 7.24, commission: 950 },
  { date: '10-30', clicks: 189, orders: 14, conversion: 7.41, commission: 1180 },
  { date: '10-31', clicks: 203, orders: 16, conversion: 7.88, commission: 1360 },
];

export function AffiliateData() {
  const [dateRange, setDateRange] = useState('7');
  const [orders] = useState<Order[]>(mockOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [isDataInfoOpen, setIsDataInfoOpen] = useState(false);

  const getDataByRange = () => {
    const days = parseInt(dateRange);
    return performanceData.slice(-days);
  };

  const calculateMetrics = () => {
    const data = getDataByRange();
    return {
      totalClicks: data.reduce((sum, d) => sum + d.clicks, 0),
      totalOrders: data.reduce((sum, d) => sum + d.orders, 0),
      totalCommission: data.reduce((sum, d) => sum + d.commission, 0),
      avgConversion: (data.reduce((sum, d) => sum + d.conversion, 0) / data.length).toFixed(2),
    };
  };

  const metrics = calculateMetrics();

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCampaign = campaignFilter === 'all' || order.campaign === campaignFilter;
    return matchesStatus && matchesCampaign;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      frozen: { label: '冻结中', variant: 'default' as const, color: 'text-orange-600' },
      settled: { label: '已到账', variant: 'secondary' as const, color: 'text-green-600' },
      cancelled: { label: '已取消', variant: 'outline' as const, color: 'text-gray-600' },
      refunded: { label: '已退款', variant: 'destructive' as const, color: 'text-red-600' },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusDescription = (status: Order['status']) => {
    const descriptions = {
      frozen: '客人已离店，在安全期内',
      settled: '已过安全期，积分已计入可用余额',
      cancelled: '订单已取消，无收益',
      refunded: '客诉追索，积分已扣除',
    };
    return descriptions[status];
  };

  const uniqueCampaigns = Array.from(new Set(orders.filter(o => o.campaign).map(o => o.campaign)));

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


      <div className="flex items-center justify-between">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">昨日</SelectItem>
            <SelectItem value="7">近7日</SelectItem>
            <SelectItem value="30">近30日</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" />
              总点击量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{metrics.totalClicks}</span>
              <span className="text-sm text-gray-500">次</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              成交订单
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">{metrics.totalOrders}</span>
              <span className="text-sm text-gray-500">单</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Percent className="w-4 h-4" />
              平均转化率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{metrics.avgConversion}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              累计佣金
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                ¥{metrics.totalCommission.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 趋势图表 */}
      <Card>
        <CardHeader>
          <CardTitle>推广效果趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={getDataByRange()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                fill="#93c5fd" 
                name="点击量"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#22c55e" 
                fill="#86efac" 
                name="订单数"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 转化率图表 */}
      <Card>
        <CardHeader>
          <CardTitle>转化率分析</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={getDataByRange()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                domain={[0, 10]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [`${value}%`, '转化率']}
              />
              <Area 
                type="monotone" 
                dataKey="conversion" 
                stroke="#8b5cf6" 
                fill="#c4b5fd" 
                name="转化率 (%)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 订单明细列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>订单明细</CardTitle>
              <CardDescription className="mt-2">
                实时展示每一笔通过您的链接产生的订单
              </CardDescription>
            </div>
          </div>
          
          {/* 筛选器 */}
          <div className="flex items-center gap-3">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="frozen">冻结中</SelectItem>
                  <SelectItem value="settled">已到账</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {uniqueCampaigns.length > 0 && (
              <div className="w-48">
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="按活动筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部活动</SelectItem>
                    {uniqueCampaigns.map(campaign => (
                      <SelectItem key={campaign} value={campaign!}>{campaign}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">没有找到匹配的订单</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单日期</TableHead>
                  <TableHead>订单号</TableHead>
                  <TableHead>C端支付金额</TableHead>
                  <TableHead>积分收益</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>活动来源</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell className="font-mono text-xs">{order.orderNo}</TableCell>
                    <TableCell className="font-medium">¥{order.amount.toLocaleString()}</TableCell>
                    <TableCell className={`font-bold ${
                      order.points > 0 ? 'text-green-600' : 
                      order.points < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {order.points > 0 ? '+' : ''}{order.points || '-'}
                    </TableCell>
                    <TableCell>
                      <div>
                        {getStatusBadge(order.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {getStatusDescription(order.status)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.campaign ? (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{order.campaign}</code>
                      ) : (
                        <span className="text-gray-400 text-xs">默认链接</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 数据说明 - 可折叠 */}
      <Collapsible open={isDataInfoOpen} onOpenChange={setIsDataInfoOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">数据说明</span>
                </div>
                {isDataInfoOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p className="font-medium mb-1">点击量</p>
                  <p className="text-blue-700">用户点击您的推广链接的次数</p>
                </div>
                <div>
                  <p className="font-medium mb-1">成交订单</p>
                  <p className="text-blue-700">通过您的链接成功预订的订单数量</p>
                </div>
                <div>
                  <p className="font-medium mb-1">转化率</p>
                  <p className="text-blue-700">成交订单数 ÷ 点击量 × 100%</p>
                </div>
                <div>
                  <p className="font-medium mb-1">累计佣金</p>
                  <p className="text-blue-700">所选时间范围内获得的佣金总额</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
