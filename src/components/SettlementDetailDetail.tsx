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
import { ArrowLeft } from 'lucide-react';
import { Label } from './ui/label';
import { type SettlementDetail, type SettlementDetailStatus, type SettlementType, type SettlementObjectType } from '../data/mockBusinessDocuments';

interface SettlementDetailDetailProps {
  detail: SettlementDetail;
  onBack: () => void;
  onViewBatch?: (batchId: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export function SettlementDetailDetail({ detail, onBack, onViewBatch, onViewOrder }: SettlementDetailDetailProps) {
  // 状态Badge
  const getSettlementStatusBadge = (status: SettlementDetailStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      credited: { label: '已计入', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300' },
      completed: { label: '已完成', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 结算类型标签
  const getSettlementTypeLabel = (type: SettlementType) => {
    return type === 'partner_settlement' ? '客户结算' : '供应商结算';
  };

  // 结算对象类型标签
  const getSettlementObjectTypeLabel = (type: SettlementObjectType) => {
    return type === 'partner' ? '小B客户' : '供应商';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                结算明细
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 结算基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>结算基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getSettlementStatusBadge(detail.settlementStatus)}
                <span className="text-gray-500">明细ID：{detail.detailId}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 结算信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">结算信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">明细ID</Label>
                <p className="text-sm text-gray-900">{detail.detailId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算批次号</Label>
                <p className="text-sm text-gray-900">{detail.batchId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
                <p className="text-sm text-gray-900">{detail.orderId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算类型</Label>
                <p className="text-sm text-gray-900">{getSettlementTypeLabel(detail.settlementType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算对象类型</Label>
                <p className="text-sm text-gray-900">{getSettlementObjectTypeLabel(detail.settlementObjectType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算对象</Label>
                <p className="text-sm text-gray-900">{detail.relatedObjectName}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg text-blue-600">
                  ¥{detail.settlementAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算周期</Label>
                <p className="text-sm text-gray-900">
                  {detail.settlementPeriodStart} 至 {detail.settlementPeriodEnd}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算时间</Label>
                <p className="text-sm text-gray-900">{detail.settlementTime}</p>
              </div>
              {detail.creditedTime && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">计入时间</Label>
                  <p className="text-sm text-gray-900">{detail.creditedTime}</p>
                </div>
              )}
              {detail.paidTime && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">打款时间</Label>
                  <p className="text-sm text-gray-900">{detail.paidTime}</p>
                </div>
              )}
              {detail.paymentNo && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">打款流水号</Label>
                  <p className="text-sm text-gray-900">{detail.paymentNo}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结算账户信息卡片 */}
      {detail.settlementStatus === 'credited' || detail.settlementStatus === 'paid' || detail.settlementStatus === 'completed' ? (
        <Card>
          <CardHeader>
            <CardTitle>结算账户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">账户类型</Label>
                <p className="text-sm text-gray-900">
                  {detail.settlementObjectType === 'partner' ? '小B账户' : '供应商账户'}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">计入前余额</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">计入后余额</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">账户状态</Label>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  正常
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 打款信息卡片 */}
      {detail.settlementStatus === 'paid' || detail.settlementStatus === 'completed' ? (
        <Card>
          <CardHeader>
            <CardTitle>打款信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">打款时间</Label>
                <p className="text-sm text-gray-900">{detail.paidTime}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">打款流水号</Label>
                <p className="text-sm text-gray-900">{detail.paymentNo || '-'}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">打款状态</Label>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  成功
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 关联订单信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>关联订单信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
              <p className="text-sm text-gray-900">{detail.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
              <p className="text-sm text-gray-900">{detail.relatedObjectName}</p>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewOrder?.(detail.orderId)}
            >
              查看订单详情
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 关联结算批次信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>关联结算批次信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">批次号</Label>
              <p className="text-sm text-gray-900">{detail.batchId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">批次状态</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                已处理
              </Badge>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewBatch?.(detail.batchId)}
            >
              查看批次详情
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 操作历史记录卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>操作历史记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="text-sm font-medium">结算</div>
                <div className="text-xs text-gray-500 mt-1">{detail.settlementTime}</div>
              </div>
              <div className="text-sm text-gray-600">系统</div>
            </div>
            {detail.creditedTime && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="text-sm font-medium">计入账户</div>
                  <div className="text-xs text-gray-500 mt-1">{detail.creditedTime}</div>
                </div>
                <div className="text-sm text-gray-600">系统</div>
              </div>
            )}
            {detail.paidTime && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="text-sm font-medium">打款</div>
                  <div className="text-xs text-gray-500 mt-1">{detail.paidTime}</div>
                </div>
                <div className="text-sm text-gray-600">系统</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

