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
import { type OrderRefundRecord, type RefundType, type RefundStatus } from '../data/mockBusinessDocuments';

interface OrderRefundRecordDetailProps {
  record: OrderRefundRecord;
  onBack: () => void;
  onViewOrder?: (orderId: string) => void;
  onRetryRefund?: (record: OrderRefundRecord) => void;
}

export function OrderRefundRecordDetail({ record, onBack, onViewOrder, onRetryRefund }: OrderRefundRecordDetailProps) {
  const [showRetryDialog, setShowRetryDialog] = useState(false);

  // 退款类型标签
  const getRefundTypeLabel = (type: RefundType) => {
    const typeMap: Record<RefundType, string> = {
      full_refund: '全额退款',
      partial_refund: '部分退款',
      cancel_refund: '取消退款',
    };
    return typeMap[type] || type;
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
          {/* 退款信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">退款信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款记录ID</Label>
                <p className="text-sm text-gray-900">{record.refundId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联订单号</Label>
                <p className="text-sm text-gray-900">{record.orderId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
                <p className="text-sm text-gray-900">{record.relatedObjectName}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款类型</Label>
                <p className="text-sm text-gray-900">{getRefundTypeLabel(record.refundType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">原订单金额</Label>
                <p className="text-sm text-gray-900">
                  ¥{record.originalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg text-red-600">
                  ¥{record.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
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
              {record.refundNo && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">退款流水号</Label>
                  <p className="text-sm text-gray-900">{record.refundNo}</p>
                </div>
              )}
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">操作人</Label>
                <p className="text-sm text-gray-900">{record.operatorName}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">退款原因</h3>
            <p className="text-sm text-gray-900">{record.refundReason}</p>
          </div>

          {record.remark && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">备注</h3>
              <p className="text-sm text-gray-900">{record.remark}</p>
            </div>
          )}
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
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
              <p className="text-sm text-gray-900">{record.relatedObjectName}</p>
            </div>
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

