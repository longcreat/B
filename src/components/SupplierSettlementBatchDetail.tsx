import React, { useState } from 'react';
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
  type SupplierSettlementBatch,
  type SupplierBatchStatus,
} from '../data/mockSettlementBatches';

interface SupplierSettlementBatchDetailProps {
  batch: SupplierSettlementBatch;
  onBack: () => void;
  onViewOrderDetail?: (orderId: string) => void;
}

export function SupplierSettlementBatchDetail({ 
  batch, 
  onBack,
  onViewOrderDetail,
}: SupplierSettlementBatchDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveAction, setApproveAction] = useState<'approve' | 'reject'>('approve');
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showPayDialog, setShowPayDialog] = useState(false);

  const orders = batch.orders || [];

  // 分页
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // 状态Badge
  const getStatusBadge = (status: SupplierBatchStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      pending_approval: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已批准', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status] || config.pending;
    return <Badge variant="outline" className={className}>{label}</Badge>;
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

  // 打款
  const handlePay = () => {
    setShowPayDialog(true);
  };

  const handleSubmitPay = () => {
    toast.success(`正在打款，请稍候...`);
    
    setTimeout(() => {
      toast.success(`打款成功，打款单号：${batch.paymentOrderId || 'BANK-' + Date.now()}`);
      setShowPayDialog(false);
    }, 2000);
  };

  // 导出
  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  // 计算统计
  const totalC2cAmount = batch.totalC2cAmount || orders.reduce((sum, o) => sum + o.c2cAmount, 0);

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
              <span>供应商结算</span>
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
              <Button onClick={handlePay}>
                打款
              </Button>
            )}
            {(batch.status === 'paid' || batch.status === 'completed') && (
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
                <Label className="text-sm text-gray-600">供应商名称</Label>
                <p className="mt-1">{batch.supplierName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">供应商ID</Label>
                <p className="mt-1 font-mono">{batch.supplierId}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">结算周期</Label>
                <p className="mt-1">{new Date(batch.settlementPeriodStart).getFullYear()}年{new Date(batch.settlementPeriodStart).getMonth() + 1}月</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <Label className="text-sm text-gray-600">供应商成本</Label>
                <p className="text-3xl mt-2 text-orange-700">¥{batch.settlementAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 审批信息 */}
        {(batch.status === 'approved' || batch.status === 'paid' || batch.status === 'completed' || batch.status === 'rejected') && (
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

        {/* 打款信息 */}
        {(batch.status === 'paid' || batch.status === 'completed') && (
          <Card>
            <CardHeader>
              <CardTitle>打款信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">打款金额</Label>
                  <p className="mt-1">¥{batch.settlementAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">收款账户</Label>
                  <p className="mt-1">中国工商银行 ****1234</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">打款时间</Label>
                  <p className="mt-1">{batch.paidAt || '--'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">打款单号</Label>
                  <p className="mt-1 font-mono">{batch.paymentOrderId || '--'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">打款状态</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {batch.paymentStatus === 'success' ? '打款成功' : batch.paymentStatus === 'processing' ? '打款中' : '打款失败'}
                    </Badge>
                  </div>
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
              .supplier-batch-detail-table-container table td:last-child,
              .supplier-batch-detail-table-container table th:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .supplier-batch-detail-table-container table th:last-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto supplier-batch-detail-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>订单号</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>酒店名称</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>入住日期</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>离店日期</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>C端支付金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>供应商成本</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>订单状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '100px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
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
                        <td className="p-3 text-sm font-medium">¥{order.supplierCost.toFixed(2)}</td>
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
                  <Label className="text-sm text-gray-600">供应商名称</Label>
                  <p className="mt-1">{batch.supplierName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">结算周期</Label>
                  <p className="mt-1">{new Date(batch.settlementPeriodStart).getFullYear()}年{new Date(batch.settlementPeriodStart).getMonth() + 1}月</p>
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

        {/* 打款对话框 */}
        <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>确认打款</DialogTitle>
              <DialogDescription>请确认打款信息</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm text-gray-600">批次号</Label>
                  <p className="mt-1 font-mono">{batch.batchId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">供应商名称</Label>
                  <p className="mt-1">{batch.supplierName}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600">打款金额</Label>
                  <p className="mt-1 text-2xl font-medium">¥{batch.settlementAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600">收款账户</Label>
                  <p className="mt-1">中国工商银行 ****1234</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600">收款户名</Label>
                  <p className="mt-1">{batch.supplierName}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPayDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSubmitPay}>
                确认打款
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

