import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// 订单状态类型
export type OrderStatus = 'pending_checkin' | 'completed' | 'cancelled_free' | 'cancelled_partial';

// 接入类型
export type AccessType = 'API' | 'PAAS' | 'link';

// 订单明细
export interface OrderDetail {
  orderId: string;
  supplierCost: number; // 订单底价（供应商底价）
  distributionPrice: number; // 分销价 = 订单底价 × 1.02
  markupRate: number; // 加价率（针对API/PAAS）
  orderAmount: number; // 订单金额
  commission: number; // 佣金
  profit: number; // 订单利润
  channel: string; // 渠道（小B名称）
  accessType: AccessType; // 接入类型
  linkCommissionRate?: number; // 链接分销佣金率（仅链接分销模式使用）
  status: OrderStatus;
  checkInDate: string;
  checkOutDate: string;
  hotelName: string;
}

interface OrderDetailsTableProps {
  orders: OrderDetail[];
}

export function OrderDetailsTable({ orders }: OrderDetailsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      pending_checkin: { label: '待入住', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      completed: { label: '已完结', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled_free: { label: '已免费取消', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      cancelled_partial: { label: '已部分取消', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getAccessTypeBadge = (type: AccessType) => {
    const config = {
      API: { label: 'API', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      PAAS: { label: 'PAAS', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      link: { label: '链接分销', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.hotelName.includes(searchQuery) ||
      order.channel.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>订单明细</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索订单号、酒店、渠道..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending_checkin">待入住</SelectItem>
                <SelectItem value="completed">已完结</SelectItem>
                <SelectItem value="cancelled_free">已免费取消</SelectItem>
                <SelectItem value="cancelled_partial">已部分取消</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>酒店名称</TableHead>
                <TableHead>渠道</TableHead>
                <TableHead>接入类型</TableHead>
                <TableHead className="text-right">订单底价</TableHead>
                <TableHead className="text-right">分销价</TableHead>
                <TableHead className="text-right">加价率</TableHead>
                <TableHead className="text-right">佣金率</TableHead>
                <TableHead className="text-right">订单金额</TableHead>
                <TableHead className="text-right">佣金</TableHead>
                <TableHead className="text-right">订单利润</TableHead>
                <TableHead>入住日期</TableHead>
                <TableHead>离店日期</TableHead>
                <TableHead>订单状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-12 text-gray-500">
                    暂无订单数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                    <TableCell>{order.hotelName}</TableCell>
                    <TableCell>{order.channel}</TableCell>
                    <TableCell>{getAccessTypeBadge(order.accessType)}</TableCell>
                    <TableCell className="text-right text-purple-600">
                      ¥{order.supplierCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      ¥{order.distributionPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.markupRate > 0 ? `${order.markupRate}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.linkCommissionRate ? `${order.linkCommissionRate}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{order.orderAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      ¥{order.commission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      ¥{order.profit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {order.checkInDate}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {order.checkOutDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredOrders.length} 条订单
          </div>
        )}
      </CardContent>
    </Card>
  );
}

