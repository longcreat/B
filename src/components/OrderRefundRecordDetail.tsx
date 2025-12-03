import React, { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { type OrderRefundRecord, type RefundType, type RefundStatus, type RefundTriggerMethod, type RefundChannel, type RefundPath, type RelatedObjectType, type BusinessModel } from '../data/mockBusinessDocuments';

interface OrderRefundRecordDetailProps {
  record: OrderRefundRecord;
  onBack: () => void;
  onViewOrder?: (orderId: string) => void;
  onRetryRefund?: (record: OrderRefundRecord) => void;
}

export function OrderRefundRecordDetail({ record, onBack, onViewOrder, onRetryRefund }: OrderRefundRecordDetailProps) {
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [showNightlyBreakdown, setShowNightlyBreakdown] = useState(false);

  // 退款类型标签
  const getRefundTypeLabel = (type: RefundType) => {
    const typeMap: Record<RefundType, string> = {
      full_refund: '全额退款',
      partial_refund: '部分退款',
      cancel_refund: '取消退款',
    };
    return typeMap[type] || type;
  };

  // 退款触发方式标签
  const getRefundTriggerMethodLabel = (method: RefundTriggerMethod) => {
    return method === 'auto' ? '系统自动' : '人工发起';
  };

  // 退款渠道标签
  const getRefundChannelLabel = (channel: RefundChannel) => {
    const channelMap = { wechat: '微信', alipay: '支付宝', bank: '银行转账', other: '其他' };
    return channelMap[channel] || channel;
  };

  // 退款路径标签
  const getRefundPathLabel = (path: RefundPath) => {
    return path === 'original' ? '原路退' : '线下打款';
  };

  // 关联对象类型标签
  const getRelatedObjectTypeLabel = (type: RelatedObjectType) => {
    return type === 'bigb' ? '大B客户' : '小B客户';
  };

  // 业务模式标签
  const getBusinessModelLabel = (model: BusinessModel) => {
    const modelMap = { saas: 'SaaS', mcp: 'MCP', affiliate: '推广联盟' };
    return modelMap[model] || model;
  };

  // 退款状态Badge
  const getRefundStatusBadge = (status: RefundStatus) => {
    const config = {
      processing: { label: '退款中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      success: { label: '退款成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '退款失败', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 重新发起退款
  const handleRetryRefund = () => {
    setShowRetryDialog(true);
  };

  const handleConfirmRetry = () => {
    if (onRetryRefund) {
      onRetryRefund(record);
    } else {
      toast.success('重新发起退款功能开发中');
    }
    setShowRetryDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                订单退款记录
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 退款基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>退款基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getRefundStatusBadge(record.refundStatus)}
                <span className="text-gray-500">退款记录ID：{record.refundId}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              {record.refundStatus === 'failed' && (
                <Button
                  variant="outline"
                  onClick={handleRetryRefund}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新发起退款
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款记录ID</Label>
              <p className="text-sm text-gray-900">{record.refundId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
              <p className="text-sm text-gray-900">{record.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款类型</Label>
              <p className="text-sm text-gray-900">{getRefundTypeLabel(record.refundType)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款触发方式</Label>
              <p className="text-sm text-gray-900">{getRefundTriggerMethodLabel(record.refundTriggerMethod)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单总退款金额</Label>
              <p className="text-lg font-bold text-red-600">
                ¥{record.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">客户实付金额</Label>
              <p className="text-sm text-gray-900">
                ¥{record.customerActualPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">是否影响结算</Label>
              <Badge variant="outline" className={record.affectsSettlement ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-700 border-gray-300'}>
                {record.affectsSettlement ? '是' : '否'}
              </Badge>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款原因</Label>
              <p className="text-sm text-gray-900">{record.refundReason}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款状态</Label>
              {getRefundStatusBadge(record.refundStatus)}
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款时间</Label>
              <p className="text-sm text-gray-900">{record.refundTime}</p>
            </div>
            {record.refundCompletedTime && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款完成时间</Label>
                <p className="text-sm text-gray-900">{record.refundCompletedTime}</p>
              </div>
            )}
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款渠道</Label>
              <p className="text-sm text-gray-900">{getRefundChannelLabel(record.refundChannel)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款路径</Label>
              <p className="text-sm text-gray-900">{getRefundPathLabel(record.refundPath)}</p>
            </div>
            {record.refundNo && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款流水号</Label>
                <p className="text-sm text-gray-900">{record.refundNo}</p>
              </div>
            )}
            {record.refundProof && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款凭证</Label>
                <a href={record.refundProof} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  查看凭证
                </a>
              </div>
            )}
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">操作人</Label>
              <p className="text-sm text-gray-900">{record.operatorName}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">操作人角色</Label>
              <p className="text-sm text-gray-900">
                {record.operatorRole === 'customer_service' ? '客服' : record.operatorRole === 'finance' ? '财务' : '系统'}
              </p>
            </div>
            {record.remark && (
              <div className="col-span-2">
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">备注</Label>
                <p className="text-sm text-gray-900">{record.remark}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 关联订单信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>关联订单信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
              <p className="text-sm text-gray-900">{record.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">原订单总金额P2</Label>
              <p className="text-sm text-gray-900">
                ¥{record.orderTotalPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单实付总金额</Label>
              <p className="text-sm text-gray-900">
                ¥{record.customerActualPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
              <p className="text-sm text-gray-900">{record.relatedObjectName}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象类型</Label>
              <p className="text-sm text-gray-900">{getRelatedObjectTypeLabel(record.relatedObjectType)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">业务模式</Label>
              <p className="text-sm text-gray-900">{getBusinessModelLabel(record.businessModel)}</p>
            </div>
            {record.managingBigB && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">管理大B</Label>
                <p className="text-sm text-gray-900">{record.managingBigB}</p>
              </div>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewOrder?.(record.orderId)}
            >
              查看订单详情
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 退款金额拆分卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>退款金额拆分</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNightlyBreakdown(!showNightlyBreakdown)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showNightlyBreakdown ? '收起每晚明细' : '展开每晚明细'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 订单汇总信息 */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单总金额P2</Label>
              <p className="text-sm font-medium text-gray-900">
                ¥{record.orderTotalPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单总退款金额</Label>
              <p className="text-sm font-medium text-red-600">
                ¥{record.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">是否影响结算</Label>
              <Badge variant="outline" className={record.affectsSettlement ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-gray-50 text-gray-700 border-gray-300'}>
                {record.affectsSettlement ? '是' : '否'}
              </Badge>
            </div>
          </div>

          {/* 按每晚展示的退款金额拆分 */}
          {showNightlyBreakdown && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">退款金额拆分（按每晚展示）</h4>
              <div className="space-y-2">
                {/* 示例：模拟3晚的数据 */}
                {[1, 2, 3].map((night) => {
                  const nightlyP2 = record.orderTotalPrice / 3;
                  const nightlyRefund = record.refundAmount / 3;
                  const nightlyP0 = record.refundSupplierPrice / 3;
                  const nightlyP1 = record.refundDistributionPrice / 3;
                  const nightlyCommission = record.refundCommission ? record.refundCommission / 3 : 0;
                  
                  return (
                    <div key={night} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-medium text-gray-700">第 {night} 晚</Label>
                        <span className="text-xs text-gray-500">2025-01-{String(night).padStart(2, '0')}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">订单金额P2</span>
                          <p className="font-medium text-gray-900 mt-0.5">
                            ¥{nightlyP2.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">退款金额</span>
                          <p className="font-medium text-red-600 mt-0.5">
                            ¥{nightlyRefund.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">退款P0部分</span>
                          <p className="font-medium text-purple-600 mt-0.5">
                            ¥{nightlyP0.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">退款P1部分</span>
                          <p className="font-medium text-indigo-600 mt-0.5">
                            ¥{nightlyP1.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        {record.refundCommission && (
                          <div>
                            <span className="text-gray-500">退款佣金部分</span>
                            <p className="font-medium text-orange-600 mt-0.5">
                              ¥{nightlyCommission.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 退款金额拆分汇总 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">退款金额拆分（汇总）</h4>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款对应的P0部分</Label>
                <p className="text-sm font-medium text-purple-600">
                  ¥{record.refundSupplierPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款对应的P1部分</Label>
                <p className="text-sm font-medium text-indigo-600">
                  ¥{record.refundDistributionPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              {record.refundCommission && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款对应的佣金部分</Label>
                  <p className="text-sm font-medium text-orange-600">
                    ¥{record.refundCommission.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 退款进度信息卡片 */}
      {record.refundStatus === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle>退款进度信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款状态</Label>
                <div>{getRefundStatusBadge(record.refundStatus)}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款完成时间</Label>
                <p className="text-sm text-gray-900">{record.refundCompletedTime}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款流水号</Label>
                <p className="text-sm text-gray-900">{record.refundNo || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 退款失败信息卡片 */}
      {record.refundStatus === 'failed' && (
        <Card>
          <CardHeader>
            <CardTitle>退款失败信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款状态</Label>
                <div>{getRefundStatusBadge(record.refundStatus)}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">失败原因</Label>
                <p className="text-sm text-gray-900 text-red-600">{record.remark || '退款失败'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作历史记录卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>操作历史记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="text-sm font-medium">退款发起</div>
                <div className="text-xs text-gray-500 mt-1">{record.refundTime}</div>
              </div>
              <div className="text-sm text-gray-600">{record.operatorName}</div>
            </div>
            {record.refundCompletedTime && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="text-sm font-medium">
                    {record.refundStatus === 'success' ? '退款完成' : '退款失败'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{record.refundCompletedTime}</div>
                </div>
                <div className="text-sm text-gray-600">系统</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 重新发起退款对话框 */}
      <Dialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重新发起退款</DialogTitle>
            <DialogDescription>
              确认要重新发起此退款吗？退款金额 ¥{record.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetryDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmRetry}>
              确认重新发起
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

