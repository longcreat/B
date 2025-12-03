import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { type Withdrawal } from '../data/mockWithdrawals';

interface WithdrawalDetailPageProps {
  withdrawal: Withdrawal;
  onBack: () => void;
}

export function WithdrawalDetailPage({ withdrawal, onBack }: WithdrawalDetailPageProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closeReason, setCloseReason] = useState('');

  const getStatusBadge = (status: string) => {
    const config = {
      pending_review: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      reviewing: { label: '审核中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      approved: { label: '审核通过', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已拒绝', className: 'bg-red-50 text-red-700 border-red-300' },
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      success: { label: '提现成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '提现失败', className: 'bg-red-50 text-red-700 border-red-300' },
      closed: { label: '提现关闭', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getUserTypeLabel = (type: string) => {
    return type === 'bigb' ? '大B客户' : '小B客户';
  };

  const getBusinessModelLabel = (model: string) => {
    const labels = {
      saas: 'SaaS',
      mcp: 'MCP',
      affiliate: '推广联盟',
    };
    return labels[model as keyof typeof labels] || model;
  };

  const getAccountTypeLabel = (type: string) => {
    const labels = {
      bank: '银行账户',
      alipay: '支付宝',
      wechat: '微信',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getInvoiceTypeLabel = (type: string) => {
    return type === 'vat_special' ? '增值税专用发票' : '增值税普通发票';
  };

  const handleReview = (action: 'approve' | 'reject') => {
    setReviewAction(action);
    setReviewComment('');
    setShowReviewDialog(true);
  };

  const handleConfirmReview = () => {
    if (reviewAction === 'reject' && reviewComment.length < 10) {
      toast.error('拒绝原因至少需要10个字符');
      return;
    }

    toast.success(`${reviewAction === 'approve' ? '审核通过' : '审核拒绝'}成功`);
    setShowReviewDialog(false);
    setReviewComment('');
    setTimeout(() => onBack(), 1000);
  };

  const handleClose = () => {
    setCloseReason('');
    setShowCloseDialog(true);
  };

  const handleConfirmClose = () => {
    if (closeReason.length < 10) {
      toast.error('关闭原因至少需要10个字符');
      return;
    }

    toast.success('提现申请已关闭');
    setShowCloseDialog(false);
    setCloseReason('');
    setTimeout(() => onBack(), 1000);
  };

  const handleRetry = () => {
    toast.success('重新发起打款成功');
    setTimeout(() => onBack(), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <div className="flex gap-2">
          {withdrawal.status === 'pending_review' && (
            <>
              <Button onClick={() => handleReview('approve')}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                审核通过
              </Button>
              <Button variant="destructive" onClick={() => handleReview('reject')}>
                <XCircle className="w-4 h-4 mr-2" />
                审核拒绝
              </Button>
            </>
          )}
          {withdrawal.status === 'failed' && (
            <Button onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新发起打款
            </Button>
          )}
          {(withdrawal.status === 'pending_review' || withdrawal.status === 'reviewing') && (
            <Button variant="outline" onClick={handleClose}>
              <XCircle className="w-4 h-4 mr-2" />
              关闭提现
            </Button>
          )}
        </div>
      </div>

      {/* 提现基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>提现基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm text-gray-600">提现单号</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">{withdrawal.withdrawalId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">提现状态</Label>
              <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">提现金额</Label>
              <p className="text-sm font-bold text-blue-600 mt-1">
                ¥{withdrawal.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">可用余额</Label>
              <p className="text-sm text-gray-900 mt-1">
                ¥{withdrawal.availableBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">申请时间</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.createTime}</p>
            </div>
            {withdrawal.reviewTime && (
              <div>
                <Label className="text-sm text-gray-600">审核时间</Label>
                <p className="text-sm text-gray-900 mt-1">{withdrawal.reviewTime}</p>
              </div>
            )}
            {withdrawal.reviewer && (
              <div>
                <Label className="text-sm text-gray-600">审核人</Label>
                <p className="text-sm text-gray-900 mt-1">{withdrawal.reviewer}</p>
              </div>
            )}
            {withdrawal.reviewComment && (
              <div className="col-span-3">
                <Label className="text-sm text-gray-600">审核意见</Label>
                <p className="text-sm text-gray-900 mt-1">{withdrawal.reviewComment}</p>
              </div>
            )}
            {withdrawal.remark && (
              <div className="col-span-3">
                <Label className="text-sm text-gray-600">申请备注</Label>
                <p className="text-sm text-gray-900 mt-1">{withdrawal.remark}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 用户信息 */}
      <Card>
        <CardHeader>
          <CardTitle>用户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm text-gray-600">用户ID</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.userId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">用户名称</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">用户类型</Label>
              <p className="text-sm text-gray-900 mt-1">{getUserTypeLabel(withdrawal.userType)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">业务模式</Label>
              <p className="text-sm text-gray-900 mt-1">{getBusinessModelLabel(withdrawal.businessModel)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">联系电话</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm text-gray-600">提现账户类型</Label>
              <p className="text-sm text-gray-900 mt-1">{getAccountTypeLabel(withdrawal.accountType)}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">提现账户</Label>
              <p className="text-sm font-mono text-gray-900 mt-1">{withdrawal.account}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">提现用户名</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.accountName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">提现人电话</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 发票信息（仅企业用户） */}
      {withdrawal.invoice && (
        <Card>
          <CardHeader>
            <CardTitle>发票信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-sm text-gray-600">发票类型</Label>
                <p className="text-sm text-gray-900 mt-1">{getInvoiceTypeLabel(withdrawal.invoice.type)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">发票代码</Label>
                <p className="text-sm font-mono text-gray-900 mt-1">{withdrawal.invoice.code}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">发票号码</Label>
                <p className="text-sm font-mono text-gray-900 mt-1">{withdrawal.invoice.number}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">开票日期</Label>
                <p className="text-sm text-gray-900 mt-1">{withdrawal.invoice.date}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">发票金额</Label>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  ¥{withdrawal.invoice.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">发票状态</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={
                    withdrawal.invoice.status === 'approved' ? 'bg-green-50 text-green-700 border-green-300' :
                    withdrawal.invoice.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-300' :
                    'bg-yellow-50 text-yellow-700 border-yellow-300'
                  }>
                    {withdrawal.invoice.status === 'approved' ? '审核通过' :
                     withdrawal.invoice.status === 'rejected' ? '审核拒绝' :
                     withdrawal.invoice.status === 'uploaded' ? '已上传' : '待上传'}
                  </Badge>
                </div>
              </div>
              <div className="col-span-3">
                <Label className="text-sm text-gray-600">发票文件</Label>
                <div className="mt-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    查看发票
                  </Button>
                  <Button variant="outline" size="sm" className="ml-2">
                    <Download className="w-4 h-4 mr-2" />
                    下载发票
                  </Button>
                </div>
              </div>
              {withdrawal.invoice.reviewComment && (
                <div className="col-span-3">
                  <Label className="text-sm text-gray-600">发票审核意见</Label>
                  <p className="text-sm text-gray-900 mt-1">{withdrawal.invoice.reviewComment}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 打款信息（如已打款） */}
      {withdrawal.transactionNo && (
        <Card>
          <CardHeader>
            <CardTitle>打款信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {withdrawal.transferTime && (
                <div>
                  <Label className="text-sm text-gray-600">转账汇款时间</Label>
                  <p className="text-sm text-gray-900 mt-1">{withdrawal.transferTime}</p>
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-600">流水号</Label>
                <p className="text-sm font-mono text-gray-900 mt-1">{withdrawal.transactionNo}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">打款状态</Label>
                <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
              </div>
              {withdrawal.failureReason && (
                <div className="col-span-3">
                  <Label className="text-sm text-gray-600">失败原因</Label>
                  <p className="text-sm text-red-600 mt-1">{withdrawal.failureReason}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 审核对话框 */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? '审核通过' : '审核拒绝'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700">提现单号</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.withdrawalId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">用户名称</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">提现金额</Label>
              <p className="text-sm font-medium text-blue-600 mt-1">
                ¥{withdrawal.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            {reviewAction === 'reject' ? (
              <div>
                <Label className="text-sm text-gray-700">拒绝原因 *</Label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="请填写拒绝原因（至少10个字符）"
                  className="mt-1"
                  rows={4}
                />
              </div>
            ) : (
              <div>
                <Label className="text-sm text-gray-700">审核意见（选填）</Label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="请填写审核意见"
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmReview}>
              确认{reviewAction === 'approve' ? '通过' : '拒绝'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 关闭对话框 */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>关闭提现申请</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700">提现单号</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.withdrawalId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">用户名称</Label>
              <p className="text-sm text-gray-900 mt-1">{withdrawal.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">提现金额</Label>
              <p className="text-sm font-medium text-blue-600 mt-1">
                ¥{withdrawal.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">关闭原因 *</Label>
              <Textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="请填写关闭原因（至少10个字符）"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              确认关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
