import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMockWithdrawals, type Withdrawal, type WithdrawalStatus } from '../data/mockWithdrawals';

interface WithdrawalRecordListProps {
  onViewDetail?: (withdrawal: Withdrawal) => void;
}

export function WithdrawalRecordList({ onViewDetail }: WithdrawalRecordListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<string>('all');
  const [filterCreateDateStart, setFilterCreateDateStart] = useState('');
  const [filterCreateDateEnd, setFilterCreateDateEnd] = useState('');
  const [filterTransferDateStart, setFilterTransferDateStart] = useState('');
  const [filterTransferDateEnd, setFilterTransferDateEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set());
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingWithdrawal, setClosingWithdrawal] = useState<Withdrawal | null>(null);
  const [closeReason, setCloseReason] = useState('');

  // 使用 mock 数据
  const allWithdrawals = useMemo(() => getMockWithdrawals(), []);

  // 筛选逻辑
  const filteredWithdrawals = useMemo(() => {
    return allWithdrawals.filter((withdrawal) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!withdrawal.withdrawalId.toLowerCase().includes(query) &&
            !withdrawal.userName.toLowerCase().includes(query) &&
            !(withdrawal.transactionNo?.toLowerCase().includes(query))) {
          return false;
        }
      }

      // 状态筛选
      if (filterStatus !== 'all' && withdrawal.status !== filterStatus) {
        return false;
      }

      // 用户类型筛选
      if (filterUserType !== 'all' && withdrawal.userType !== filterUserType) {
        return false;
      }

      // 业务模式筛选
      if (filterBusinessModel !== 'all' && withdrawal.businessModel !== filterBusinessModel) {
        return false;
      }

      // 申请时间筛选
      if (filterCreateDateStart && withdrawal.createTime < filterCreateDateStart) {
        return false;
      }
      if (filterCreateDateEnd && withdrawal.createTime > filterCreateDateEnd + ' 23:59:59') {
        return false;
      }

      // 转账汇款时间筛选
      if (filterTransferDateStart && (!withdrawal.transferTime || withdrawal.transferTime < filterTransferDateStart)) {
        return false;
      }
      if (filterTransferDateEnd && (!withdrawal.transferTime || withdrawal.transferTime > filterTransferDateEnd + ' 23:59:59')) {
        return false;
      }

      // 金额范围筛选
      if (filterAmountMin && withdrawal.amount < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && withdrawal.amount > parseFloat(filterAmountMax)) {
        return false;
      }

      return true;
    });
  }, [allWithdrawals, searchQuery, filterStatus, filterUserType, filterBusinessModel, filterCreateDateStart, filterCreateDateEnd, filterTransferDateStart, filterTransferDateEnd, filterAmountMin, filterAmountMax]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const totalCount = filteredWithdrawals.length;

    const successWithdrawals = filteredWithdrawals.filter(w => w.status === 'success');
    const successAmount = successWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const successCount = successWithdrawals.length;

    const failedWithdrawals = filteredWithdrawals.filter(w => w.status === 'failed');
    const failedAmount = failedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const failedCount = failedWithdrawals.length;

    const today = new Date().toISOString().split('T')[0];
    const todayWithdrawals = filteredWithdrawals.filter(w => w.createTime.startsWith(today));
    const todayAmount = todayWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const todayCount = todayWithdrawals.length;

    const thisMonth = new Date().toISOString().substring(0, 7);
    const monthWithdrawals = filteredWithdrawals.filter(w => w.createTime.startsWith(thisMonth));
    const monthAmount = monthWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const monthCount = monthWithdrawals.length;

    return {
      totalAmount,
      totalCount,
      successAmount,
      successCount,
      failedAmount,
      failedCount,
      todayAmount,
      todayCount,
      monthAmount,
      monthCount,
    };
  }, [filteredWithdrawals]);

  // 分页
  const totalItems = filteredWithdrawals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedWithdrawals(new Set());
  }, [searchQuery, filterStatus, filterUserType, filterBusinessModel, filterCreateDateStart, filterCreateDateEnd, filterTransferDateStart, filterTransferDateEnd, filterAmountMin, filterAmountMax]);

  const getStatusBadge = (status: WithdrawalStatus) => {
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
    const { label, className } = config[status];
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

  const handleRetry = (withdrawal: Withdrawal) => {
    toast.success('重新发起打款成功');
  };

  const handleClose = (withdrawal: Withdrawal) => {
    setClosingWithdrawal(withdrawal);
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
    setClosingWithdrawal(null);
    setCloseReason('');
  };

  const handleBatchRetry = () => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请选择要重新发起的提现记录');
      return;
    }
    toast.success(`批量重新发起成功，共处理${selectedWithdrawals.size}条记录`);
    setSelectedWithdrawals(new Set());
  };

  const handleBatchClose = () => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请选择要关闭的提现记录');
      return;
    }
    toast.success(`批量关闭成功，共处理${selectedWithdrawals.size}条记录`);
    setSelectedWithdrawals(new Set());
  };

  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  const toggleSelectAll = () => {
    if (selectedWithdrawals.size === paginatedWithdrawals.length) {
      setSelectedWithdrawals(new Set());
    } else {
      setSelectedWithdrawals(new Set(paginatedWithdrawals.map(w => w.withdrawalId)));
    }
  };

  const toggleSelect = (withdrawalId: string) => {
    const newSelected = new Set(selectedWithdrawals);
    if (newSelected.has(withdrawalId)) {
      newSelected.delete(withdrawalId);
    } else {
      newSelected.add(withdrawalId);
    }
    setSelectedWithdrawals(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <Card className="min-w-[220px]">
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">提现总金额</span>
              <p className="text-2xl font-bold text-blue-600">
                ¥{statistics.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">总笔数：{statistics.totalCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-[220px]">
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">提现成功金额</span>
              <p className="text-2xl font-bold text-green-600">
                ¥{statistics.successAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">成功笔数：{statistics.successCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-[220px]">
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">提现失败金额</span>
              <p className="text-2xl font-bold text-red-600">
                ¥{statistics.failedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">失败笔数：{statistics.failedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-[220px]">
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">今日提现金额</span>
              <p className="text-2xl font-bold text-blue-600">
                ¥{statistics.todayAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">今日笔数：{statistics.todayCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-[220px]">
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">本月累计提现</span>
              <p className="text-2xl font-bold text-purple-600">
                ¥{statistics.monthAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">本月笔数：{statistics.monthCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索提现单号、用户名称、流水号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            {selectedWithdrawals.size > 0 && (
              <>
                <Button onClick={handleBatchRetry}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  批量重新发起
                </Button>
                <Button variant="destructive" onClick={handleBatchClose}>
                  <XCircle className="w-4 h-4 mr-2" />
                  批量关闭
                </Button>
              </>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t mt-4">
              <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">提现状态</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="pending_review">待审核</SelectItem>
                    <SelectItem value="reviewing">审核中</SelectItem>
                    <SelectItem value="approved">审核通过</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="success">提现成功</SelectItem>
                    <SelectItem value="failed">提现失败</SelectItem>
                    <SelectItem value="closed">提现关闭</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">用户类型</Label>
                <Select value={filterUserType} onValueChange={setFilterUserType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="bigb">大B客户</SelectItem>
                    <SelectItem value="smallb">小B客户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">业务模式</Label>
                <Select value={filterBusinessModel} onValueChange={setFilterBusinessModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="mcp">MCP</SelectItem>
                    <SelectItem value="affiliate">推广联盟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">申请时间</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filterCreateDateStart}
                    onChange={(e) => setFilterCreateDateStart(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">至</span>
                  <Input
                    type="date"
                    value={filterCreateDateEnd}
                    onChange={(e) => setFilterCreateDateEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">提现金额</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="最小"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="最大"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-24 flex-shrink-0">转账汇款时间</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filterTransferDateStart}
                    onChange={(e) => setFilterTransferDateStart(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">至</span>
                  <Input
                    type="date"
                    value={filterTransferDateEnd}
                    onChange={(e) => setFilterTransferDateEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* 列表 */}
      <Card>
        <CardContent className="p-0">
          <style>{`
            .withdrawal-record-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .withdrawal-record-table-container table td:last-child,
            .withdrawal-record-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .withdrawal-record-table-container table td,
            .withdrawal-record-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="withdrawal-record-table-container overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedWithdrawals.size === paginatedWithdrawals.length && paginatedWithdrawals.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">提现单号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">提现金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">提现状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">转账汇款时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">流水号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  paginatedWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.withdrawalId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedWithdrawals.has(withdrawal.withdrawalId)}
                          onCheckedChange={() => toggleSelect(withdrawal.withdrawalId)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{withdrawal.withdrawalId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{withdrawal.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getUserTypeLabel(withdrawal.userType)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getBusinessModelLabel(withdrawal.businessModel)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        ¥{withdrawal.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(withdrawal.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{withdrawal.createTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{withdrawal.transferTime || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{withdrawal.transactionNo || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetail?.(withdrawal)}
                            className="h-8 px-2"
                          >
                            查看详情
                          </Button>
                          {withdrawal.status === 'failed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetry(withdrawal)}
                              className="h-8 px-2 text-orange-600 hover:text-orange-700"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              重新发起
                            </Button>
                          )}
                          {(withdrawal.status === 'pending_review' || withdrawal.status === 'reviewing') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClose(withdrawal)}
                              className="h-8 px-2 text-red-600 hover:text-red-700"
                            >
                              关闭
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="text-sm text-gray-600">
                共 {totalItems} 条记录，第 {currentPage} / {totalPages} 页
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 关闭对话框 */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>关闭提现申请</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700">提现单号</Label>
              <p className="text-sm text-gray-900 mt-1">{closingWithdrawal?.withdrawalId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">用户名称</Label>
              <p className="text-sm text-gray-900 mt-1">{closingWithdrawal?.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">提现金额</Label>
              <p className="text-sm font-medium text-blue-600 mt-1">
                ¥{closingWithdrawal?.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
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
