import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Search, Download, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type OrderStatus = 'pending_checkin' | 'completed' | 'cancelled_free' | 'cancelled_partial';

// 结算状态类型
export type SettlementStatus = 'pending' | 'settleable' | 'processing' | 'settled';

// 订单明细（按PRD要求的财务字段）
export interface OrderDetail {
  orderId: string;
  merchantName: string; // 商户名称（订单来源大B/挂载大B）
  hotelName: string; // 酒店名称
  checkInDate: string; // 入住日期
  checkOutDate: string; // 离店日期
  settlementStatus: SettlementStatus; // 结算状态
  orderStatus?: OrderStatus; // 订单状态（用于统计）
  orderType?: 'bigB' | 'smallB'; // 订单归属类型
  
  // 价格信息
  p0_supplierCost: number; // 订单总底价P0
  p1_distributionPrice: number; // 订单总分销价P1
  p2_orderAmount: number; // 订单总金额P2
  totalDiscount: number; // 订单总优惠金额
  actualAmount: number; // 订单实付总金额
  totalRefund: number; // 订单总退款金额
  
  // 优惠出资信息
  platformDiscountContribution: number; // 平台出资优惠
  bigBDiscountContribution: number; // 大B出资优惠
  
  // 利润与佣金
  totalCommission: number; // 订单总佣金
  commissionRate?: number; // 佣金比例（仅小B展示）
  markupRate?: number; // 加价比例（仅大B展示）
  platformProfit?: number; // 平台总利润（可选，由计算逻辑生成）
  payableToBigB?: number; // 应付账款（大B）（可选，由计算逻辑生成）
  payableToSupplier?: number; // 应付账款（供应商）（可选，由计算逻辑生成）
}

interface OrderDetailsTableProps {
  orders: OrderDetail[];
}

export function OrderDetailsTable({ orders }: OrderDetailsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [merchantNameFilter, setMerchantNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const getSettlementStatusBadge = (status: SettlementStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      settleable: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      processing: { label: '处理中', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedQuery = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderId.toLowerCase().includes(normalizedQuery) ||
        order.merchantName.includes(searchQuery) ||
        order.hotelName.includes(searchQuery);

      const matchesSettlementStatus =
        settlementStatusFilter === 'all' || order.settlementStatus === settlementStatusFilter;

      const matchesMerchantName =
        !merchantNameFilter || order.merchantName.includes(merchantNameFilter);

      const matchesDateRange =
        (!startDate || order.checkInDate >= startDate) &&
        (!endDate || order.checkOutDate <= endDate);

      const matchesAmountRange =
        (!minAmount || order.p2_orderAmount >= parseFloat(minAmount)) &&
        (!maxAmount || order.p2_orderAmount <= parseFloat(maxAmount));

      return (
        matchesSearch &&
        matchesSettlementStatus &&
        matchesMerchantName &&
        matchesDateRange &&
        matchesAmountRange
      );
    });
  }, [orders, searchQuery, settlementStatusFilter, merchantNameFilter, startDate, endDate, minAmount, maxAmount]);

  const hasActiveFilters =
    merchantNameFilter !== '' ||
    startDate !== '' ||
    endDate !== '' ||
    minAmount !== '' ||
    maxAmount !== '';

  const renderCommissionRate = (order: OrderDetail) => {
    if (order.orderType === 'smallB') {
      if (typeof order.commissionRate === 'number') {
        return `${order.commissionRate.toFixed(2)}%`;
      }
      return '-';
    }
    return '-';
  };

  const renderMarkupRate = (order: OrderDetail) => {
    if (order.orderType === 'bigB') {
      if (typeof order.markupRate === 'number') {
        return `${order.markupRate.toFixed(2)}%`;
      }
      return '-';
    }
    return '-';
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">订单明细</CardTitle>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="relative w-64 min-w-[16rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索订单号、商户名称、酒店..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={settlementStatusFilter}
                onValueChange={(value: SettlementStatus | 'all') => setSettlementStatusFilter(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="结算状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待结算</SelectItem>
                  <SelectItem value="settleable">可结算</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="settled">已结算</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">商户名称</Label>
                  <Input
                    placeholder="输入商户名称"
                    value={merchantNameFilter}
                    onChange={(e) => setMerchantNameFilter(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">开始日期</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结束日期</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">最小金额</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">最大金额</Label>
                  <Input
                    type="number"
                    placeholder="999999"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMerchantNameFilter('');
                      setStartDate('');
                      setEndDate('');
                      setMinAmount('');
                      setMaxAmount('');
                    }}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={showFilters ? 'py-4' : 'py-3'}>
        <style>{`
          .order-table-container table {
            table-layout: auto;
            min-width: 100%;
            width: max-content;
          }
          .order-table-container table td:last-child,
          .order-table-container table th:last-child {
            position: sticky;
            right: 0;
            background: white;
            z-index: 10;
            box-shadow: -2px 0 4px rgba(0, 0, 0, 0.06);
          }
          .order-table-container table td,
          .order-table-container table th {
            white-space: nowrap;
          }
        `}</style>
        <div className="order-table-container overflow-x-auto border rounded-lg">
          <table className="border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">商户名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">酒店名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">入住日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">离店日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">订单金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">优惠金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">实付金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">退款金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">分销价</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">底价</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">平台出资</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">大B出资</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">佣金比例</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">佣金</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">平台利润</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">加价比例</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">应付大B</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">应付供应商</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={21} className="px-4 py-10 text-center text-gray-500">
                    暂无订单数据
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const refundP0Part = order.p2_orderAmount > 0
                    ? (order.totalRefund * order.p0_supplierCost) / order.p2_orderAmount
                    : 0;
                  const refundP1Part = order.p2_orderAmount > 0
                    ? (order.totalRefund * order.p1_distributionPrice) / order.p2_orderAmount
                    : 0;
                  const refundProfit = order.p2_orderAmount > 0
                    ? (order.totalRefund * (order.p1_distributionPrice - order.p0_supplierCost)) / order.p2_orderAmount
                    : 0;

                  const platformProfit =
                    order.p1_distributionPrice -
                    order.p0_supplierCost -
                    refundProfit -
                    (order.platformDiscountContribution || 0);

                  const payableToBigB =
                    (order.p2_orderAmount - order.totalRefund) -
                    (order.p1_distributionPrice - refundP1Part) -
                    (order.bigBDiscountContribution || 0);

                  const payableToSupplier = order.p0_supplierCost - refundP0Part;

                  // 佣金计算：需扣除退款对应的佣金部分
                  const refundCommissionPart = order.commissionRate && order.totalRefund > 0
                    ? order.totalRefund * (order.commissionRate / 100)
                    : 0;
                  const actualCommission = order.totalCommission - refundCommissionPart;

                  return (
                    <tr key={order.orderId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{order.orderId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.merchantName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.hotelName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.checkInDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.checkOutDate}</td>
                      <td className="px-4 py-3 text-sm">{getSettlementStatusBadge(order.settlementStatus)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">¥{order.p2_orderAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-orange-600">
                        {order.totalDiscount > 0 ? `¥${order.totalDiscount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">¥{order.actualAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        {order.totalRefund > 0 ? `¥${order.totalRefund.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600">¥{order.p1_distributionPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-purple-600">¥{order.p0_supplierCost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600">
                        {order.platformDiscountContribution > 0 ? `¥${order.platformDiscountContribution.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        {order.bigBDiscountContribution > 0 ? `¥${order.bigBDiscountContribution.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{renderCommissionRate(order)}</td>
                      <td className="px-4 py-3 text-sm text-right text-purple-600">
                        {actualCommission > 0 ? `¥${actualCommission.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-green-600">¥{platformProfit.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">{renderMarkupRate(order)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-orange-600">¥{Math.max(0, payableToBigB).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">¥{Math.max(0, payableToSupplier).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => window.location.href = `/admin/orders/${order.orderId}`}
                        >
                          查看详情
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredOrders.length} 条订单 | 订单总金额：¥
            {filteredOrders.reduce((sum, order) => sum + order.p2_orderAmount, 0).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

