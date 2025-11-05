import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  type PartnerSettlementBatch,
  type PartnerBatchStatus,
} from '../data/mockSettlementBatches';

interface PartnerSettlementBatchDetailProps {
  batch: PartnerSettlementBatch;
  onBack: () => void;
  onViewOrderDetail?: (orderId: string) => void;
}

export function PartnerSettlementBatchDetail({ 
  batch, 
  onBack,
  onViewOrderDetail,
}: PartnerSettlementBatchDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveAction, setApproveAction] = useState<'approve' | 'reject'>('approve');
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const orders = batch.orders || [];

  // 分页
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // 状态Badge
  const getStatusBadge = (status: PartnerBatchStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      pending_approval: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已批准', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      credited: { label: '已计入', className: 'bg-green-50 text-green-700 border-green-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status] || config.pending;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getPartnerTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      individual: '个人',
      influencer: '博主',
      enterprise: '企业',
    };
    return typeMap[type] || type;
  };

  // 审批
  const handleApprove = () => {
    setShowApproveDialog(true);
    setApproveAction('approve');
    setApproveComment('');
    setRejectReason('');
  };

  const handleSubmitApprove = () => {
    if (approveAction === 'reject' && !rejectReason.trim()) {
      toast.error('请填写驳回原因');
      return;
    }

    if (approveAction === 'approve') {
      toast.success(`批次 ${batch.batchId} 审批成功`);
    } else {
      toast.success(`批次 ${batch.batchId} 已驳回`);
    }

    setShowApproveDialog(false);
  };

  // 计入账户
  const handleCredit = () => {
    if (confirm(`确定要将批次 ${batch.batchId} 的金额 ¥${batch.settlementAmount.toFixed(2)} 元计入 ${batch.partnerName} 的账户吗？`)) {
      toast.success(`批次 ${batch.batchId} 已成功计入账户`);
    }
  };

  // 导出
  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  // 计算统计
  const totalC2cAmount = batch.totalC2cAmount || orders.reduce((sum, o) => sum + o.c2cAmount, 0);
  const totalPlatformProfit = batch.totalPlatformProfit || orders.reduce((sum, o) => sum + o.platformProfit, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* 面包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>财务中心</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>结算管理</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>客户结算</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>批次详情</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 操作栏 */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
          <div className="flex items-center gap-2">
            {batch.status === 'pending_approval' && (
              <Button onClick={handleApprove}>
                审批
              </Button>
            )}
            {batch.status === 'approved' && (
              <Button onClick={handleCredit}>
                计入账户
              </Button>
            )}
            {(batch.status === 'credited' || batch.status === 'completed') && (
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出批次明细
              </Button>
            )}
          </div>
        </div>

        {/* 批次基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>批次基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">批次号</Label>
                <p className="mt-1 font-mono">{batch.batchId}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">小B名称</Label>
                <p className="mt-1">{batch.partnerName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">小BID</Label>
                <p className="mt-1 font-mono">{batch.partnerId}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">小B类型</Label>
                <p className="mt-1">{getPartnerTypeLabel(batch.partnerType)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">结算周期</Label>
                <p className="mt-1">{batch.settlementPeriodStart} 至 {batch.settlementPeriodEnd}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">创建时间</Label>
                <p className="mt-1">{batch.createdAt}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">结算状态</Label>
                <div className="mt-1">{getStatusBadge(batch.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 结算金额统计 */}
        <Card>
          <CardHeader>
            <CardTitle>结算金额统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="text-sm text-gray-600">订单数量</Label>
                <p className="text-3xl mt-2 text-blue-700">{batch.orderCount} 笔</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Label className="text-sm text-gray-600">结算总金额</Label>
                <p className="text-3xl mt-2 text-green-700">¥{batch.settlementAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Label className="text-sm text-gray-600">订单金额小计</Label>
                <p className="text-3xl mt-2 text-purple-700">¥{totalC2cAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <Label className="text-sm text-gray-600">平台利润</Label>
                <p className="text-3xl mt-2 text-orange-700">¥{totalPlatformProfit.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <Label className="text-sm text-gray-600">小B利润</Label>
                <p className="text-3xl mt-2 text-teal-700">¥{batch.settlementAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 审批信息 */}
        {(batch.status === 'approved' || batch.status === 'credited' || batch.status === 'completed' || batch.status === 'rejected') && (
          <Card>
            <CardHeader>
              <CardTitle>审批信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">审核人</Label>
                  <p className="mt-1">李财务</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">审核时间</Label>
                  <p className="mt-1">{batch.approvedAt || '--'}</p>
                </div>
                {batch.approvalComment && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">审核意见</Label>
                    <p className="mt-1">{batch.approvalComment}</p>
                  </div>
                )}
                {batch.rejectionReason && (
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">驳回原因</Label>
                    <p className="mt-1 text-red-600">{batch.rejectionReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 计入账户信息 */}
        {(batch.status === 'credited' || batch.status === 'completed') && (
          <Card>
            <CardHeader>
              <CardTitle>计入账户信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">计入账户类型</Label>
                  <p className="mt-1">{batch.partnerType === 'individual' ? '积分账户' : '现金账户'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">计入金额</Label>
                  <p className="mt-1">¥{batch.settlementAmount.toFixed(2)}</p>
                </div>
                {batch.partnerType === 'individual' && (
                  <div>
                    <Label className="text-sm text-gray-600">计入积分</Label>
                    <p className="mt-1">{Math.floor(batch.settlementAmount)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-gray-600">计入时间</Label>
                  <p className="mt-1">{batch.creditedAt || '--'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">操作人</Label>
                  <p className="mt-1">系统自动</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 批次订单列表 */}
        <Card>
          <CardHeader>
            <CardTitle>批次订单列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <style>{`
              .partner-batch-detail-table-container table td:last-child,
              .partner-batch-detail-table-container table th:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .partner-batch-detail-table-container table th:last-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto partner-batch-detail-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '1400px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>订单号</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>酒店名称</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>入住日期</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>离店日期</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>C端支付金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>平台利润</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>小B利润</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>订单状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '100px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-gray-500">
                        暂无订单数据
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.orderId} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-mono">{order.orderId}</td>
                        <td className="p-3 text-sm">{order.hotelName}</td>
                        <td className="p-3 text-sm">{order.checkInDate}</td>
                        <td className="p-3 text-sm">{order.checkOutDate}</td>
                        <td className="p-3 text-sm font-medium">¥{order.c2cAmount.toFixed(2)}</td>
                        <td className="p-3 text-sm">¥{order.platformProfit.toFixed(2)}</td>
                        <td className="p-3 text-sm font-medium">¥{order.partnerProfit.toFixed(2)}</td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewOrderDetail?.(order.orderId)}
                          >
                            查看详情
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages >= 1 && totalItems > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  共 {totalItems} 条记录，第 {currentPage} / {totalPages} 页
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 审批对话框 */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>审批结算批次</DialogTitle>
              <DialogDescription>请确认批次信息并选择审批操作</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm text-gray-600">批次号</Label>
                  <p className="mt-1 font-mono">{batch.batchId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">小B名称</Label>
                  <p className="mt-1">{batch.partnerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">结算周期</Label>
                  <p className="mt-1">{batch.settlementPeriodStart} 至 {batch.settlementPeriodEnd}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">订单数量</Label>
                  <p className="mt-1">{batch.orderCount}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600">结算金额</Label>
                  <p className="mt-1 text-lg font-medium">¥{batch.settlementAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>审批操作</Label>
                <div className="flex gap-4">
                  <Button
                    variant={approveAction === 'approve' ? 'default' : 'outline'}
                    onClick={() => setApproveAction('approve')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    通过
                  </Button>
                  <Button
                    variant={approveAction === 'reject' ? 'destructive' : 'outline'}
                    onClick={() => setApproveAction('reject')}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    驳回
                  </Button>
                </div>
              </div>

              {approveAction === 'approve' ? (
                <div>
                  <Label htmlFor="approve-comment">审核意见（可选）</Label>
                  <Textarea
                    id="approve-comment"
                    value={approveComment}
                    onChange={(e) => setApproveComment(e.target.value)}
                    placeholder="请输入审核意见"
                    rows={3}
                    className="mt-2"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="reject-reason">驳回原因（必填）</Label>
                  <Textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入驳回原因"
                    rows={3}
                    className="mt-2"
                    required
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitApprove}>
                确认
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

