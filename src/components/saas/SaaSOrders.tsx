import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TrendingUp, ShoppingCart, DollarSign, Calendar, Download, Search, Filter } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Order {
  id: string;
  orderNo: string;
  hotelName: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  cost: number;
  commission: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD20251031001',
    hotelName: '北京希尔顿酒店',
    guestName: '张三',
    guestPhone: '13800138001',
    checkIn: '2025-11-05',
    checkOut: '2025-11-07',
    amount: 2180,
    cost: 1800,
    commission: 380,
    status: 'confirmed',
    createdAt: '2025-10-31 10:30',
  },
  {
    id: '2',
    orderNo: 'ORD20251030002',
    hotelName: '上海万豪酒店',
    guestName: '李四',
    guestPhone: '13900139002',
    checkIn: '2025-11-10',
    checkOut: '2025-11-12',
    amount: 3420,
    cost: 2850,
    commission: 570,
    status: 'confirmed',
    createdAt: '2025-10-30 15:22',
  },
  {
    id: '3',
    orderNo: 'ORD20251029003',
    hotelName: '深圳洲际酒店',
    guestName: '王五',
    guestPhone: '13700137003',
    checkIn: '2025-10-28',
    checkOut: '2025-10-30',
    amount: 4150,
    cost: 3500,
    commission: 650,
    status: 'completed',
    createdAt: '2025-10-29 09:15',
  },
];

export function SaaSOrders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    // 搜索筛选
    const matchesSearch = searchQuery === '' || 
      order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.guestName.includes(searchQuery) ||
      order.guestPhone.includes(searchQuery);
    
    // 状态筛选
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const calculateTotals = () => {
    return {
      totalRevenue: filteredOrders.reduce((sum, o) => sum + o.amount, 0),
      totalCost: filteredOrders.reduce((sum, o) => sum + o.cost, 0),
      totalCommission: filteredOrders.reduce((sum, o) => sum + o.commission, 0),
    };
  };

  const totals = calculateTotals();

  const exportFinancialReport = () => {
    toast.success('财务报表导出中，请稍候...');
    setTimeout(() => {
      toast.success('报表已导出到下载文件夹');
    }, 1500);
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      confirmed: { label: '已确认', variant: 'default' as const },
      completed: { label: '已完成', variant: 'secondary' as const },
      cancelled: { label: '已取消', variant: 'destructive' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>订单管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              总销售额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">¥{totals.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">客户支付总额</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              总成本
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">¥{totals.totalCost.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">平台采购成本</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              总佣金
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                ¥{totals.totalCommission.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">您的利润收入</p>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>订单列表</CardTitle>
              <CardDescription className="mt-2">
                查看所有订单详情和财务信息
              </CardDescription>
            </div>
            <Button onClick={exportFinancialReport}>
              <Download className="w-4 h-4 mr-2" />
              导出报表
            </Button>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索订单号、入住人姓名或手机号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all' ? '没有找到匹配的订单' : '暂无订单数据'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>酒店名称</TableHead>
                  <TableHead>入住人</TableHead>
                  <TableHead>入离日期</TableHead>
                  <TableHead>C端支付总额</TableHead>
                  <TableHead>我的预估利润</TableHead>
                  <TableHead>订单状态</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                    <TableCell className="font-medium">{order.hotelName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.guestName}</p>
                        <p className="text-xs text-gray-500">{order.guestPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.checkIn}</p>
                        <p className="text-gray-500">{order.checkOut}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">¥{order.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-green-600">
                      ¥{order.commission.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{order.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 财务说明 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-3">财务说明</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">销售额：</span>
              <span>客户实际支付的金额（包含您的加价）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">成本：</span>
              <span>平台采购价格（供应商报价）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">佣金：</span>
              <span>销售额 - 成本 = 您的利润收入</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[80px]">结算周期：</span>
              <span>订单完成后次月5日结算到您的账户</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
