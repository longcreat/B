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
import { ArrowLeft, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { type ViolationFeeRecord, type ViolationFeeStatus, type AccountType } from '../data/mockBusinessDocuments';
import { getMockViolationFeeRecords } from '../data/mockBusinessDocuments';

interface ViolationFeeRecordDetailProps {
  record: ViolationFeeRecord;
  onBack: () => void;
  onCancelFee?: (recordId: string, reason: string) => void;
}

export function ViolationFeeRecordDetail({ record, onBack, onCancelFee }: ViolationFeeRecordDetailProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // 状态Badge
  const getStatusBadge = (status: ViolationFeeStatus) => {
    const config = {
      pending: { label: '待扣费', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      deducted: { label: '已扣费', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled: { label: '已撤销', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 扣费类型标签
  const getFeeTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      dispute_deduction: '客诉追索',
      no_show_fee: 'No-Show扣费',
      violation_fee: '违规扣费',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 账户类型标签
  const getAccountTypeLabel = (type: AccountType) => {
    return type === 'points' ? '积分账户' : '现金账户';
  };

  // 撤销扣费
  const handleCancelFee = () => {
    if (!cancelReason.trim()) {
      toast.error('请输入撤销原因');
      return;
    }
    if (onCancelFee) {
      onCancelFee(record.feeId, cancelReason);
    } else {
      toast.success('撤销扣费功能开发中');
    }
    setShowCancelDialog(false);
    setCancelReason('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                违约扣费记录
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 扣费基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>扣费基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(record.feeStatus)}
                <span className="text-gray-500">扣费记录ID：{record.feeId}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 扣费信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">扣费信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费记录ID</Label>
                <p className="text-sm text-gray-900">{record.feeId}</p>
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
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费类型</Label>
                <p className="text-sm text-gray-900">{getFeeTypeLabel(record.feeType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg text-red-600">
                  ¥{Math.abs(record.feeAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费时间</Label>
                <p className="text-sm text-gray-900">{record.feeTime}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">账户类型</Label>
                <p className="text-sm text-gray-900">{getAccountTypeLabel(record.accountType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">操作人</Label>
                <p className="text-sm text-gray-900">{record.operatorName}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">扣费原因</h3>
            <p className="text-sm text-gray-900">{record.feeReason}</p>
          </div>

          {record.remark && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">备注</h3>
              <p className="text-sm text-gray-900">{record.remark}</p>
            </div>
          )}

          {record.feeStatus === 'deducted' && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(true)}
                className="text-orange-600 hover:text-orange-700"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                撤销扣费
              </Button>
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
              onClick={() => {
                // 跳转到订单详情
                toast.info('跳转到订单详情功能开发中');
              }}
            >
              查看订单详情
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 扣费账户信息卡片 */}
      {record.feeStatus === 'deducted' && (
        <Card>
          <CardHeader>
            <CardTitle>扣费账户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">账户类型</Label>
                <p className="text-sm text-gray-900">{getAccountTypeLabel(record.accountType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费前余额</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">扣费后余额</Label>
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
                <div className="text-sm font-medium">扣费</div>
                <div className="text-xs text-gray-500 mt-1">{record.feeTime}</div>
              </div>
              <div className="text-sm text-gray-600">{record.operatorName}</div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* 撤销扣费对话框 */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>撤销扣费</DialogTitle>
              <DialogDescription>
                确认要撤销此扣费记录吗？撤销后，扣费金额将返还到账户。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>撤销原因</Label>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="请输入撤销原因"
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                取消
              </Button>
              <Button onClick={handleCancelFee} variant="destructive">
                确认撤销
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

