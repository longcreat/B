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
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { type OrderPriceChangeRecord, type PriceChangeType, type ApprovalStatus } from '../data/mockBusinessDocuments';

interface OrderPriceChangeRecordDetailProps {
  record: OrderPriceChangeRecord;
  onBack: () => void;
  onViewOrder?: (orderId: string) => void;
  onApprove?: (recordId: string, approved: boolean, reason: string) => void;
}

export function OrderPriceChangeRecordDetail({ record, onBack, onViewOrder, onApprove }: OrderPriceChangeRecordDetailProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveAction, setApproveAction] = useState<'approve' | 'reject'>('approve');
  const [approveReason, setApproveReason] = useState('');

  // 改价类型标签
  const getChangeTypeLabel = (type: PriceChangeType) => {
    const typeMap: Record<PriceChangeType, string> = {
      price_increase: '升价',
      price_decrease: '降价',
      price_correction: '价格修正',
    };
    return typeMap[type] || type;
  };

  // 审批状态Badge
  const getApprovalStatusBadge = (status: ApprovalStatus) => {
    const config = {
      pending: { label: '待审批', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已审批', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 审批
  const handleApprove = () => {
    setShowApproveDialog(true);
    setApproveAction('approve');
    setApproveReason('');
  };

  const handleReject = () => {
    setShowApproveDialog(true);
    setApproveAction('reject');
    setApproveReason('');
  };

  const handleSubmitApprove = () => {
    if (approveAction === 'reject' && !approveReason.trim()) {
      toast.error('请输入驳回原因');
      return;
    }
    if (onApprove) {
      onApprove(record.priceChangeId, approveAction === 'approve', approveReason);
    } else {
      toast.success(approveAction === 'approve' ? '审批通过' : '已驳回');
    }
    setShowApproveDialog(false);
    setApproveReason('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                订单改价记录
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 改价基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>改价基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getApprovalStatusBadge(record.approvalStatus)}
                <span className="text-gray-500">改价记录ID：{record.priceChangeId}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              {record.approvalStatus === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    驳回
                  </Button>
                  <Button onClick={handleApprove}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    审批通过
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 改价信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">改价信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">改价记录ID</Label>
                <p className="text-sm text-gray-900">{record.priceChangeId}</p>
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
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">改价类型</Label>
                <p className="text-sm text-gray-900">{getChangeTypeLabel(record.changeType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">原订单金额</Label>
                <p className="text-sm text-gray-900">
                  ¥{record.originalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">新订单金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg text-blue-600">
                  ¥{record.newAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">改价差额</Label>
                <p className={`text-sm text-gray-900 font-semibold text-lg ${record.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {record.changeAmount >= 0 ? '+' : ''}
                  ¥{record.changeAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">改价时间</Label>
                <p className="text-sm text-gray-900">{record.changeTime}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">操作人</Label>
                <p className="text-sm text-gray-900">{record.operatorName}</p>
              </div>
              {record.approverName && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审批人</Label>
                  <p className="text-sm text-gray-900">{record.approverName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">改价原因</h3>
            <p className="text-sm text-gray-900">{record.changeReason}</p>
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

      {/* 审批信息卡片 */}
      {record.approvalStatus !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>审批信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审批状态</Label>
                <div>{getApprovalStatusBadge(record.approvalStatus)}</div>
              </div>
              {record.approverName && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审批人</Label>
                  <p className="text-sm text-gray-900">{record.approverName}</p>
                </div>
              )}
              {record.remark && (
                <div className="col-span-2">
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审批备注</Label>
                  <p className="text-sm text-gray-900">{record.remark}</p>
                </div>
              )}
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
                <div className="text-sm font-medium">改价</div>
                <div className="text-xs text-gray-500 mt-1">{record.changeTime}</div>
              </div>
              <div className="text-sm text-gray-600">{record.operatorName}</div>
            </div>
            {record.approvalStatus !== 'pending' && record.approverName && (
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <div className="text-sm font-medium">
                    {record.approvalStatus === 'approved' ? '审批通过' : '审批驳回'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{record.changeTime}</div>
                </div>
                <div className="text-sm text-gray-600">{record.approverName}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 审批对话框 */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{approveAction === 'approve' ? '审批通过' : '驳回审批'}</DialogTitle>
            <DialogDescription>
              {approveAction === 'approve' 
                ? '确认要审批通过此改价记录吗？审批通过后，订单金额将被更新。'
                : '确认要驳回此改价记录吗？请填写驳回原因。'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {approveAction === 'reject' && (
              <div>
                <Label>驳回原因</Label>
                <Textarea
                  value={approveReason}
                  onChange={(e) => setApproveReason(e.target.value)}
                  placeholder="请输入驳回原因"
                  className="mt-2"
                  rows={4}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={handleSubmitApprove}
              variant={approveAction === 'reject' ? 'destructive' : 'default'}
            >
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

