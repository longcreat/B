import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { ArrowLeft, Download } from 'lucide-react';
import { Label } from './ui/label';
import { type SupplierSettlement } from './SupplierSettlementList';
import { toast } from 'sonner';

interface SupplierSettlementDetailProps {
  settlement: SupplierSettlement;
  onBack: () => void;
}

export function SupplierSettlementDetail({ settlement, onBack }: SupplierSettlementDetailProps) {
  const getStatusBadge = (status: SupplierSettlement['settlementStatus']) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      ready: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled: { label: '已取消', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                供应商结算明细
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 结算基本信息 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>结算基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(settlement.settlementStatus)}
                <span className="text-gray-500 text-sm">结算记录ID：{settlement.settlementId}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算记录ID</Label>
              <p className="text-sm text-gray-900">{settlement.settlementId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
              <p className="text-sm text-gray-900">{settlement.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算状态</Label>
              {getStatusBadge(settlement.settlementStatus)}
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算时间</Label>
              <p className="text-sm text-gray-900">{settlement.settlementTime}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算金额</Label>
              <p className="text-lg font-bold text-blue-600">
                ¥{settlement.settlementAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 供应商信息 */}
      <Card>
        <CardHeader>
          <CardTitle>供应商信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">供应商名称</Label>
              <p className="text-sm text-gray-900">{settlement.supplierName}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">联系方式</Label>
              <p className="text-sm text-gray-900">400-123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 订单信息 */}
      <Card>
        <CardHeader>
          <CardTitle>订单信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单状态</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">已完成</Badge>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单成本</Label>
              <p className="text-sm text-gray-900">
                ¥{settlement.orderCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款成本</Label>
              <p className="text-sm text-gray-900">
                {settlement.refundCost > 0 ? `¥${settlement.refundCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单创建时间</Label>
              <p className="text-sm text-gray-900">2025-01-01 10:00:00</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单完成时间</Label>
              <p className="text-sm text-gray-900">2025-01-05 15:30:00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结算计算明细 */}
      <Card>
        <CardHeader>
          <CardTitle>结算计算明细</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 收入项目 */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">收入项目：</div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">订单成本</span>
                  <span className="text-sm font-medium text-gray-900">
                    ¥{settlement.orderCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 扣减项目 */}
            {settlement.refundCost > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">扣减项目：</div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">退款成本</span>
                    <span className="text-sm font-medium text-gray-900">
                      ¥{settlement.refundCost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 结算金额 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">结算金额</span>
                <span className="text-xl font-bold text-blue-600">
                  ¥{settlement.settlementAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">收入 - 扣减</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作历史记录 */}
      <Card>
        <CardHeader>
          <CardTitle>操作历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="text-sm font-medium">创建结算记录</div>
                <div className="text-xs text-gray-500 mt-1">{settlement.settlementTime}</div>
              </div>
              <div className="text-sm text-gray-600">系统</div>
            </div>
            {settlement.settlementStatus === 'settled' && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="text-sm font-medium">完成结算</div>
                  <div className="text-xs text-gray-500 mt-1">{settlement.settlementTime}</div>
                </div>
                <div className="text-sm text-gray-600">系统</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          返回列表
        </Button>
        <Button variant="outline" onClick={() => toast.success('导出功能开发中')}>
          <Download className="w-4 h-4 mr-2" />
          导出结算单
        </Button>
        <Button variant="outline" onClick={() => toast.success('查看订单详情功能开发中')}>
          查看订单详情
        </Button>
      </div>
    </div>
  );
}
