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

// 结算状态类型（简化为三种状态）
export type SettlementStatus = 'unsettled' | 'settled' | 'cancelled';

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
  
  // 供应商信息
  supplierName?: string; // 供应商名称
  
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
      unsettled: { label: '未结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled: { label: '已取消', className: 'bg-gray-50 text-gray-700 border-gray-300' },
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
                  <SelectItem value="unsettled">未结算</SelectItem>
                  <SelectItem value="settled">已结算</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">下单日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">离店日期</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">订单售价</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">大B出资金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">退款金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">实付金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">实收金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">订单底价</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">供应商名称</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">供应商价</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">应付大B金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">应付供应商金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">利润</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-4 py-10 text-center text-gray-500">
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

                  // 应付大B金额
                  const payableToBigB =
                    (order.p2_orderAmount - order.totalRefund) -
                    (order.p1_distributionPrice - refundP1Part) -
                    (order.bigBDiscountContribution || 0);

                  // 应付供应商金额
                  const payableToSupplier = order.p0_supplierCost - refundP0Part;

                  // 利润计算公式：订单底价 - 供应商价 - 支付手续费
                  const paymentFee = order.actualAmount * 0.0025;
                  const profit = order.p1_distributionPrice - order.p0_supplierCost - paymentFee;

                  // 计算加价率：(订单售价 - 订单底价) / 订单底价 * 100%
                  const markupRate = order.p1_distributionPrice > 0
                    ? ((order.p2_orderAmount - order.p1_distributionPrice) / order.p1_distributionPrice * 100)
                    : 0;

                  // 实收金额 = 实付金额 × (1 - 0.0025)，即扣除千分之2.5的手续费
                  const actualReceivedAmount = order.actualAmount * (1 - 0.0025);

                  return (
                    <tr key={order.orderId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{order.orderId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.checkInDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.checkOutDate}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="font-medium text-gray-900">¥{order.p2_orderAmount.toLocaleString()}</div>
                        <div className="text-xs text-blue-600 mt-0.5">加价率: {markupRate.toFixed(2)}%</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        {order.bigBDiscountContribution > 0 ? `¥${order.bigBDiscountContribution.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        {order.totalRefund > 0 ? `¥${order.totalRefund.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">¥{order.actualAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-indigo-600">¥{actualReceivedAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600">
                        <div>¥{order.p1_distributionPrice.toLocaleString()}</div>
                        {refundP1Part > 0 && (
                          <div className="text-xs text-red-500 mt-0.5">已退款¥{refundP1Part.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.supplierName || '道旅'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-purple-600">
                        <div>¥{order.p0_supplierCost.toLocaleString()}</div>
                        {refundP0Part > 0 && (
                          <div className="text-xs text-red-500 mt-0.5">已退款¥{refundP0Part.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-orange-600">¥{Math.max(0, payableToBigB).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">¥{Math.max(0, payableToSupplier).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-green-600">¥{profit.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{getSettlementStatusBadge(order.settlementStatus)}</td>
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

