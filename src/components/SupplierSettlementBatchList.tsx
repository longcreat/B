import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
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
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getMockSupplierSettlementBatches, 
  type SupplierSettlementBatch,
  type SupplierBatchStatus,
} from '../data/mockSettlementBatches';

export { type SupplierSettlementBatch };

interface SupplierSettlementBatchListProps {
  onViewBatchDetail?: (batch: SupplierSettlementBatch) => void;
}

export function SupplierSettlementBatchList({ onViewBatchDetail }: SupplierSettlementBatchListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriodStart, setFilterPeriodStart] = useState('');
  const [filterPeriodEnd, setFilterPeriodEnd] = useState('');
  const [filterCreateDateStart, setFilterCreateDateStart] = useState('');
  const [filterCreateDateEnd, setFilterCreateDateEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBatches, setSelectedBatches] = useState<Set<string>>(new Set());
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approvingBatch, setApprovingBatch] = useState<SupplierSettlementBatch | null>(null);
  const [approveAction, setApproveAction] = useState<'approve' | 'reject'>('approve');
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [payingBatch, setPayingBatch] = useState<SupplierSettlementBatch | null>(null);

  // 使用 mock 数据
  const allBatches = getMockSupplierSettlementBatches();

  // 筛选逻辑
  const filteredBatches = useMemo(() => {
    return allBatches.filter((batch) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!batch.batchId.toLowerCase().includes(query) && 
            !batch.supplierName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 状态筛选
      if (filterStatus !== 'all' && batch.status !== filterStatus) {
        return false;
      }

      // 结算周期筛选
      if (filterPeriodStart && batch.settlementPeriodEnd < filterPeriodStart) {
        return false;
      }
      if (filterPeriodEnd && batch.settlementPeriodStart > filterPeriodEnd) {
        return false;
      }

      // 创建时间筛选
      if (filterCreateDateStart && batch.createdAt < filterCreateDateStart) {
        return false;
      }
      if (filterCreateDateEnd && batch.createdAt > filterCreateDateEnd + ' 23:59:59') {
        return false;
      }

      // 金额范围筛选
      if (filterAmountMin && batch.settlementAmount < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && batch.settlementAmount > parseFloat(filterAmountMax)) {
        return false;
      }

      return true;
    });
  }, [allBatches, searchQuery, filterStatus, filterPeriodStart, filterPeriodEnd, filterCreateDateStart, filterCreateDateEnd, filterAmountMin, filterAmountMax]);

  // 计算分页数据
  const totalItems = filteredBatches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBatches = filteredBatches.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
    setSelectedBatches(new Set());
  }, [searchQuery, filterStatus, filterPeriodStart, filterPeriodEnd, filterCreateDateStart, filterCreateDateEnd, filterAmountMin, filterAmountMax]);

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

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedBatches);
      paginatedBatches.forEach(batch => {
        newSelected.add(batch.batchId);
      });
      setSelectedBatches(newSelected);
    } else {
      const newSelected = new Set(selectedBatches);
      paginatedBatches.forEach(batch => {
        newSelected.delete(batch.batchId);
      });
      setSelectedBatches(newSelected);
    }
  };

  const isAllSelected = paginatedBatches.length > 0 && 
    paginatedBatches.every(batch => selectedBatches.has(batch.batchId));

  // 单个选择
  const handleSelectOne = (batchId: string, checked: boolean) => {
    const newSelected = new Set(selectedBatches);
    if (checked) {
      newSelected.add(batchId);
    } else {
      newSelected.delete(batchId);
    }
    setSelectedBatches(newSelected);
  };

  // 批量审批
  const handleBatchApprove = () => {
    const selected = filteredBatches.filter(b => selectedBatches.has(b.batchId) && b.status === 'pending_approval');
    if (selected.length === 0) {
      toast.error('请选择待审核状态的批次');
      return;
    }
    toast.success(`已批量审批 ${selected.length} 条批次`);
    setSelectedBatches(new Set());
  };

  // 批量打款
  const handleBatchPay = () => {
    const selected = filteredBatches.filter(b => selectedBatches.has(b.batchId) && b.status === 'approved');
    if (selected.length === 0) {
      toast.error('请选择已批准状态的批次');
      return;
    }
    toast.success(`已批量打款 ${selected.length} 条批次`);
    setSelectedBatches(new Set());
  };

  // 审批单个批次
  const handleApprove = (batch: SupplierSettlementBatch) => {
    setApprovingBatch(batch);
    setApproveAction('approve');
    setApproveComment('');
    setRejectReason('');
    setShowApproveDialog(true);
  };

  // 提交审批
  const handleSubmitApprove = () => {
    if (!approvingBatch) return;
    
    if (approveAction === 'reject' && !rejectReason.trim()) {
      toast.error('请填写驳回原因');
      return;
    }

    if (approveAction === 'approve') {
      toast.success(`批次 ${approvingBatch.batchId} 审批成功`);
    } else {
      toast.success(`批次 ${approvingBatch.batchId} 已驳回`);
    }

    setShowApproveDialog(false);
    setApprovingBatch(null);
    setApproveComment('');
    setRejectReason('');
  };

  // 打款
  const handlePay = (batch: SupplierSettlementBatch) => {
    setPayingBatch(batch);
    setShowPayDialog(true);
  };

  // 提交打款
  const handleSubmitPay = () => {
    if (!payingBatch) return;
    
    toast.success(`正在打款，请稍候...`);
    
    // 模拟打款API调用
    setTimeout(() => {
      toast.success(`打款成功，打款单号：${payingBatch.paymentOrderId || 'BANK-' + Date.now()}`);
      setShowPayDialog(false);
      setPayingBatch(null);
    }, 2000);
  };

  // 导出
  const handleExport = () => {
    toast.success('导出功能开发中');
  };

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
            <BreadcrumbPage>供应商结算</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索批次号、供应商名称"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                筛选
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterPeriodStart('');
                setFilterPeriodEnd('');
                setFilterCreateDateStart('');
                setFilterCreateDateEnd('');
                setFilterAmountMin('');
                setFilterAmountMax('');
              }}>
                重置
              </Button>
              {selectedBatches.size > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">
                    已选择 <span className="font-medium text-gray-900">{selectedBatches.size}</span> 条记录
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchApprove}
                    disabled={filteredBatches.filter(b => selectedBatches.has(b.batchId) && b.status === 'pending_approval').length === 0}
                  >
                    批量审批
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchPay}
                    disabled={filteredBatches.filter(b => selectedBatches.has(b.batchId) && b.status === 'approved').length === 0}
                  >
                    批量打款
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </Button>
            </div>

            {/* 筛选条件 */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">结算状态</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="pending">待结算</SelectItem>
                      <SelectItem value="pending_approval">待审核</SelectItem>
                      <SelectItem value="approved">已批准</SelectItem>
                      <SelectItem value="paid">已打款</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="rejected">已驳回</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">结算周期开始</Label>
                  <Input
                    type="date"
                    value={filterPeriodStart}
                    onChange={(e) => setFilterPeriodStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">结算周期结束</Label>
                  <Input
                    type="date"
                    value={filterPeriodEnd}
                    onChange={(e) => setFilterPeriodEnd(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">创建时间开始</Label>
                  <Input
                    type="date"
                    value={filterCreateDateStart}
                    onChange={(e) => setFilterCreateDateStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">创建时间结束</Label>
                  <Input
                    type="date"
                    value={filterCreateDateEnd}
                    onChange={(e) => setFilterCreateDateEnd(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">最小金额</Label>
                  <Input
                    type="number"
                    placeholder="最小金额"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">最大金额</Label>
                  <Input
                    type="number"
                    placeholder="最大金额"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 批次列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .supplier-batch-table-container table td:last-child,
              .supplier-batch-table-container table th:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .supplier-batch-table-container table th:last-child {
                background: #f9fafb !important;
              }
              .supplier-batch-table-container table td:first-child,
              .supplier-batch-table-container table th:first-child {
                position: sticky !important;
                left: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: 2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .supplier-batch-table-container table th:first-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto supplier-batch-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '1800px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '50px' }}>
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => {
                          if (checked === true || checked === false) {
                            handleSelectAll(checked);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '180px' }}>批次号</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>供应商名称</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>供应商ID</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>结算周期</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>订单数量</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>结算金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>结算状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>创建时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>审核时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>打款时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>打款单号</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '150px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBatches.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-12 text-gray-500">
                        暂无结算批次数据
                      </td>
                    </tr>
                  ) : (
                    paginatedBatches.map((batch) => (
                      <tr key={batch.batchId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedBatches.has(batch.batchId)}
                            onCheckedChange={(checked) => handleSelectOne(batch.batchId, checked === true)}
                          />
                        </td>
                        <td className="p-3 text-sm font-mono">{batch.batchId}</td>
                        <td className="p-3 text-sm">{batch.supplierName}</td>
                        <td className="p-3 text-sm font-mono">{batch.supplierId}</td>
                        <td className="p-3 text-sm">{new Date(batch.settlementPeriodStart).getFullYear()}年{new Date(batch.settlementPeriodStart).getMonth() + 1}月</td>
                        <td className="p-3 text-sm">{batch.orderCount}</td>
                        <td className="p-3 text-sm font-medium">¥{batch.settlementAmount.toFixed(2)}</td>
                        <td className="p-3 text-sm">{getStatusBadge(batch.status)}</td>
                        <td className="p-3 text-sm">{batch.createdAt}</td>
                        <td className="p-3 text-sm">{batch.approvedAt || '--'}</td>
                        <td className="p-3 text-sm">{batch.paidAt || '--'}</td>
                        <td className="p-3 text-sm font-mono">{batch.paymentOrderId || '--'}</td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewBatchDetail?.(batch)}
                            >
                              查看详情
                            </Button>
                            {batch.status === 'pending_approval' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(batch)}
                              >
                                审批
                              </Button>
                            )}
                            {batch.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePay(batch)}
                              >
                                打款
                              </Button>
                            )}
                            {(batch.status === 'paid' || batch.status === 'completed') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleExport}
                              >
                                导出批次
                              </Button>
                            )}
                          </div>
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
            {approvingBatch && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">批次号</Label>
                    <p className="mt-1 font-mono">{approvingBatch.batchId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">供应商名称</Label>
                    <p className="mt-1">{approvingBatch.supplierName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">结算周期</Label>
                    <p className="mt-1">{new Date(approvingBatch.settlementPeriodStart).getFullYear()}年{new Date(approvingBatch.settlementPeriodStart).getMonth() + 1}月</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">订单数量</Label>
                    <p className="mt-1">{approvingBatch.orderCount}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">结算金额</Label>
                    <p className="mt-1 text-lg font-medium">¥{approvingBatch.settlementAmount.toFixed(2)}</p>
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
            )}
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
            {payingBatch && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">批次号</Label>
                    <p className="mt-1 font-mono">{payingBatch.batchId}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">供应商名称</Label>
                    <p className="mt-1">{payingBatch.supplierName}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">打款金额</Label>
                    <p className="mt-1 text-2xl font-medium">¥{payingBatch.settlementAmount.toFixed(2)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">收款账户</Label>
                    <p className="mt-1">中国工商银行 ****1234</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-gray-600">收款户名</Label>
                    <p className="mt-1">{payingBatch.supplierName}</p>
                  </div>
                </div>
              </div>
            )}
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

