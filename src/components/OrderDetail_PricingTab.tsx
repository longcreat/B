// 价格与利润Tab的重构版本
import React from 'react';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { type Order } from '../data/mockOrders';

interface PricingTabProps {
  order: Order;
}

export function PricingTab({ order }: PricingTabProps) {
  // 计算汇总数据
  const nightlyRates = order.nightlyRates || [];
  const totalP0 = nightlyRates.reduce((sum, n) => sum + (n.p0 ?? 0), 0);
  const totalP1 = nightlyRates.reduce((sum, n) => sum + (n.p1 ?? 0), 0);
  const totalP2 = nightlyRates.reduce((sum, n) => sum + (n.p2 ?? 0), 0);
  const totalDiscount = order.totalDiscountAmount || 0;
  const totalActual = order.actualAmount || 0;
  const totalRefund = order.refundAmount || 0;
  const finalActual = totalActual - totalRefund;
  
  // 计算利润
  const totalPlatformProfit = order.platformProfit || 0;
  const totalPartnerProfit = order.partnerProfit || 0;
  const totalCommission = order.commissionAmount || 0;
  
  // 计算有效晚数
  const validNights = nightlyRates.filter(n => {
    const status = n.status || 'normal';
    return status !== 'cancelled' && status !== 'refunded';
  }).length;
  
  // 加价率
  const platformMarkupRate = order.platformMarkupRate || 0;
  const partnerMarkupRate = order.partnerMarkupRate || 0;
  const partnerCommissionRate = order.partnerCommissionRate || 0;
  
  // 是否为推广联盟模式（小B订单）
  const isAffiliateMode = order.partnerBusinessModel === 'affiliate';
  // 是否为小B订单（有smallBPartnerId表示是小B订单）
  const isSmallBOrder = !!order.smallBPartnerId;

  return (
    <Card className="border border-t-0 border-gray-200 rounded-t-none rounded-b-sm">
      <CardContent className="pt-6 space-y-6">
        {/* 加价率信息卡片 */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            加价率信息
          </h3>
          <div className={`grid gap-4 ${isSmallBOrder ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* 平台加价率 - 始终显示 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label className="text-blue-700 text-sm font-medium">平台加价率</Label>
              <p className="text-xs text-blue-600 mt-1">P0 → P1</p>
              <p className="text-2xl font-bold text-blue-700 mt-2">{platformMarkupRate}%</p>
            </div>
            {/* 大B加价率 - 始终显示 */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <Label className="text-green-700 text-sm font-medium">大B加价率</Label>
              <p className="text-xs text-green-600 mt-1">P1 → P2</p>
              <p className="text-2xl font-bold text-green-700 mt-2">{partnerMarkupRate}%</p>
            </div>
            {/* 小B佣金率 - 仅小B订单显示 */}
            {isSmallBOrder && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Label className="text-purple-700 text-sm font-medium">小B佣金率</Label>
                <p className="text-xs text-purple-600 mt-1">总利润的佣金比例</p>
                <p className="text-2xl font-bold text-purple-700 mt-2">{partnerCommissionRate}%</p>
              </div>
            )}
          </div>
        </div>

        {/* 按晚价格明细表格 */}
        <div className="-mx-6 px-6 border-t border-gray-200 pt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">按晚价格明细</h3>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 text-left text-gray-600 font-medium whitespace-nowrap">日期</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">P0</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">P1</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">P2</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">优惠</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">实付</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">退款</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">平台利润</th>
                    <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">大B利润</th>
                    {isSmallBOrder && (
                      <th className="px-3 py-3 text-right text-gray-600 font-medium whitespace-nowrap">小B佣金</th>
                    )}
                    <th className="px-3 py-3 text-left text-gray-600 font-medium whitespace-nowrap">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {nightlyRates.map((n, idx) => {
                    const p0 = n.p0 ?? 0;
                    const p1 = n.p1 ?? 0;
                    const p2 = n.p2 ?? 0;
                    const discount = n.discountAmount ?? 0;
                    const actual = n.actualAmount ?? (p2 - discount);
                    const refund = n.refundAmount ?? 0;
                    const status = n.status || 'normal';
                    
                    // 计算每晚利润
                    const totalProfitNightly = p2 - p0; // 每晚总利润
                    const platformProfitNightly = p1 - p0; // 每晚平台利润
                    const commissionNightly = isSmallBOrder ? p2 * (partnerCommissionRate / 100) : 0; // 每晚小B佣金 = P2 × 佣金率
                    const partnerProfitNightly = (p2 - p1) - commissionNightly; // 每晚大B利润 = (P2-P1) - 佣金
                    
                    const statusMap: Record<string, { label: string; className: string }> = {
                      normal: { label: '正常', className: 'bg-gray-100 text-gray-700' },
                      cancelled: { label: '已取消', className: 'bg-gray-50 text-gray-500' },
                      refunded: { label: '已退款', className: 'bg-red-100 text-red-700' },
                      partial_refunded: { label: '部分退款', className: 'bg-orange-100 text-orange-700' },
                    };
                    
                    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
                    const canRefund = (status === 'normal' || status === 'partial_refunded') && 
                                     (order.orderStatus === 'completed' || order.orderStatus === 'settleable');
                    
                    return (
                      <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 font-mono text-gray-900 whitespace-nowrap">{n.date}</td>
                        <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">¥{p0.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">{p1 ? `¥${p1.toFixed(2)}` : '-'}</td>
                        <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">¥{p2.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap">{discount ? `-¥${discount.toFixed(2)}` : '-'}</td>
                        <td className="px-3 py-3 text-right text-gray-900 whitespace-nowrap font-medium">¥{actual.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right text-orange-600 whitespace-nowrap">{refund ? `-¥${refund.toFixed(2)}` : '-'}</td>
                        <td className="px-3 py-3 text-right text-blue-600 whitespace-nowrap font-medium">¥{platformProfitNightly.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right text-green-600 whitespace-nowrap font-medium">¥{partnerProfitNightly.toFixed(2)}</td>
                        {isSmallBOrder && (
                          <td className="px-3 py-3 text-right text-purple-600 whitespace-nowrap font-medium">¥{commissionNightly.toFixed(2)}</td>
                        )}
                        <td className="px-3 py-3 text-left whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {nightlyRates.length === 0 && (
                    <tr>
                      <td className="px-3 py-8 text-center text-gray-500" colSpan={isSmallBOrder ? 11 : 10}>
                        暂无按晚价格数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 订单汇总信息 */}
        <div className="-mx-6 px-6 border-t border-gray-200 pt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            订单汇总信息
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* 价格汇总 */}
            <Card className="border-2 border-gray-200">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">价格汇总</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总底价 (P0)</span>
                    <span className="font-medium">¥{totalP0.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总分销价 (P1)</span>
                    <span className="font-medium">¥{totalP1.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总订单金额 (P2)</span>
                    <span className="font-medium">¥{totalP2.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 优惠与实付 */}
            <Card className="border-2 border-indigo-200">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">优惠与实付</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总优惠金额</span>
                    <span className="font-medium text-orange-600">-¥{totalDiscount.toFixed(2)}</span>
                  </div>
                  {order.discountContribution && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>├ 平台出资</span>
                      <span>¥{order.discountContribution.platform.toFixed(2)}</span>
                    </div>
                  )}
                  {order.discountContribution && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>└ 大B出资</span>
                      <span>¥{order.discountContribution.bigB.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">实付总金额</span>
                    <span className="font-medium">¥{totalActual.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总退款金额</span>
                    <span className="font-medium text-red-600">-¥{totalRefund.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-900 font-semibold">最终实付</span>
                    <span className="font-bold text-indigo-600">¥{finalActual.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 利润与佣金 */}
            <Card className="border-2 border-green-200">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">利润与佣金</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总平台利润</span>
                    <span className="font-medium text-blue-600">¥{totalPlatformProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">总大B利润</span>
                    <span className="font-medium text-green-600">¥{totalPartnerProfit.toFixed(2)}</span>
                  </div>
                  {isSmallBOrder && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">总小B佣金</span>
                      <span className="font-medium text-purple-600">¥{totalCommission.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 晚数统计 */}
            <Card className="border-2 border-gray-200">
              <CardContent className="pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">晚数统计</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">总晚数</span>
                    <span className="font-medium">{nightlyRates.length} 晚</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">有效晚数</span>
                    <span className="font-medium text-green-600">{validNights} 晚</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">取消/退款晚数</span>
                    <span className="font-medium text-red-600">{nightlyRates.length - validNights} 晚</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 退款/取消记录 */}
        {order.refundRecords && order.refundRecords.length > 0 && (
          <div className="-mx-6 px-6 border-t border-gray-200 pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              退款/取消记录
            </h3>
            <div className="space-y-3">
              {order.refundRecords.map((record, idx) => (
                <Card key={idx} className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          record.type === 'cancel' 
                            ? 'bg-gray-50 text-gray-700 border-gray-300'
                            : 'bg-orange-50 text-orange-700 border-orange-300'
                        }>
                          {record.type === 'cancel' ? '取消' : '退款'}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          {record.type === 'cancel' ? '免费取消' : '部分退款'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-orange-600">-¥{record.amount.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">操作时间：</span>
                        <span className="text-gray-900">{record.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">操作人：</span>
                        <span className="text-gray-900">{record.handler}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">原因：</span>
                        <span className="text-gray-900">{record.reason}</span>
                      </div>
                      {record.affectedDates && record.affectedDates.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-gray-500">影响日期：</span>
                          <span className="text-gray-900">{record.affectedDates.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
