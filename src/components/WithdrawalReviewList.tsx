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
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMockWithdrawals, type Withdrawal, type WithdrawalStatus } from '../data/mockWithdrawals';

interface WithdrawalReviewListProps {
  onViewDetail?: (withdrawal: Withdrawal) => void;
}

export function WithdrawalReviewList({ onViewDetail }: WithdrawalReviewListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<string>('all');
  const [filterCreateDateStart, setFilterCreateDateStart] = useState('');
  const [filterCreateDateEnd, setFilterCreateDateEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set());
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewingWithdrawal, setReviewingWithdrawal] = useState<Withdrawal | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');

  // 使用 mock 数据，只显示待审核和审核中的记录
  const allWithdrawals = useMemo(() => {
    return getMockWithdrawals().filter(w => 
      w.status === 'pending_review' || w.status === 'reviewing'
    );
  }, []);

  // 筛选逻辑
  const filteredWithdrawals = useMemo(() => {
    return allWithdrawals.filter((withdrawal) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!withdrawal.withdrawalId.toLowerCase().includes(query) &&
            !withdrawal.userName.toLowerCase().includes(query)) {
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

      // 创建时间筛选
      if (filterCreateDateStart && withdrawal.createTime < filterCreateDateStart) {
        return false;
      }
      if (filterCreateDateEnd && withdrawal.createTime > filterCreateDateEnd + ' 23:59:59') {
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
  }, [allWithdrawals, searchQuery, filterStatus, filterUserType, filterBusinessModel, filterCreateDateStart, filterCreateDateEnd, filterAmountMin, filterAmountMax]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const pendingWithdrawals = filteredWithdrawals.filter(w => w.status === 'pending_review');
    const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const pendingCount = pendingWithdrawals.length;

    const today = new Date().toISOString().split('T')[0];
    const todayApproved = allWithdrawals.filter(w => w.reviewTime?.startsWith(today) && w.status === 'approved');
    const todayApprovedAmount = todayApproved.reduce((sum, w) => sum + w.amount, 0);
    const todayApprovedCount = todayApproved.length;

    const todayRejected = allWithdrawals.filter(w => w.reviewTime?.startsWith(today) && w.status === 'rejected');
    const todayRejectedAmount = todayRejected.reduce((sum, w) => sum + w.amount, 0);
    const todayRejectedCount = todayRejected.length;

    const thisMonth = new Date().toISOString().substring(0, 7);
    const monthWithdrawals = allWithdrawals.filter(w => w.createTime.startsWith(thisMonth));
    const monthAmount = monthWithdrawals.reduce((sum, w) => sum + w.amount, 0);
    const monthCount = monthWithdrawals.length;

    return {
      pendingAmount,
      pendingCount,
      todayApprovedAmount,
      todayApprovedCount,
      todayRejectedAmount,
      todayRejectedCount,
      monthAmount,
      monthCount,
    };
  }, [filteredWithdrawals, allWithdrawals]);

  // 分页
  const totalItems = filteredWithdrawals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedWithdrawals(new Set());
  }, [searchQuery, filterStatus, filterUserType, filterBusinessModel, filterCreateDateStart, filterCreateDateEnd, filterAmountMin, filterAmountMax]);

  const getStatusBadge = (status: WithdrawalStatus) => {
    const config = {
      pending_review: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      reviewing: { label: '审核中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      approved: { label: '已通过', className: 'bg-green-50 text-green-700 border-green-300' },
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

  const getAccountTypeLabel = (type: string) => {
    const labels = {
      bank: '银行账户',
      alipay: '支付宝',
      wechat: '微信',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleReview = (withdrawal: Withdrawal, action: 'approve' | 'reject') => {
    setReviewingWithdrawal(withdrawal);
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
    setReviewingWithdrawal(null);
    setReviewComment('');
  };

  const handleBatchReview = (action: 'approve' | 'reject') => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请选择要审核的提现申请');
      return;
    }
    toast.success(`批量${action === 'approve' ? '通过' : '拒绝'}成功，共处理${selectedWithdrawals.size}条记录`);
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
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">待审核提现总金额</span>
              <p className="text-2xl font-bold text-yellow-600">
                ¥{statistics.pendingAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">待审核笔数：{statistics.pendingCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">今日审核通过金额</span>
              <p className="text-2xl font-bold text-green-600">
                ¥{statistics.todayApprovedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">通过笔数：{statistics.todayApprovedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">今日审核拒绝金额</span>
              <p className="text-2xl font-bold text-red-600">
                ¥{statistics.todayRejectedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">拒绝笔数：{statistics.todayRejectedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-600">本月累计提现金额</span>
              <p className="text-2xl font-bold text-blue-600">
                ¥{statistics.monthAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
              <span className="text-xs text-gray-500">累计笔数：{statistics.monthCount}</span>
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
                placeholder="搜索提现单号、用户名称"
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
                <Button onClick={() => handleBatchReview('approve')}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  批量通过
                </Button>
                <Button variant="destructive" onClick={() => handleBatchReview('reject')}>
                  <XCircle className="w-4 h-4 mr-2" />
                  批量拒绝
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
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">审核状态</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus} className="flex-1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="pending_review">待审核</SelectItem>
                    <SelectItem value="reviewing">审核中</SelectItem>
                    <SelectItem value="approved">已通过</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-700 w-20 flex-shrink-0">用户类型</Label>
                <Select value={filterUserType} onValueChange={setFilterUserType} className="flex-1">
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
                <Select value={filterBusinessModel} onValueChange={setFilterBusinessModel} className="flex-1">
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
                    placeholder="最小金额"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="最大金额"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
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
            .withdrawal-review-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .withdrawal-review-table-container table td:last-child,
            .withdrawal-review-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .withdrawal-review-table-container table td,
            .withdrawal-review-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="withdrawal-review-table-container overflow-x-auto">
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">提现金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">可用余额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">审核状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
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
                      <td className="px-4 py-3 text-sm text-gray-900">{withdrawal.userId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{withdrawal.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getUserTypeLabel(withdrawal.userType)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getBusinessModelLabel(withdrawal.businessModel)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">
                        ¥{withdrawal.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ¥{withdrawal.availableBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{withdrawal.createTime}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(withdrawal.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{getAccountTypeLabel(withdrawal.accountType)}</td>
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
                          {withdrawal.status === 'pending_review' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReview(withdrawal, 'approve')}
                                className="h-8 px-2 text-green-600 hover:text-green-700"
                              >
                                审核
                              </Button>
                            </>
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
              <p className="text-sm text-gray-900 mt-1">{reviewingWithdrawal?.withdrawalId}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">用户名称</Label>
              <p className="text-sm text-gray-900 mt-1">{reviewingWithdrawal?.userName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-700">提现金额</Label>
              <p className="text-sm font-medium text-blue-600 mt-1">
                ¥{reviewingWithdrawal?.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            {reviewAction === 'reject' && (
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
            )}
            {reviewAction === 'approve' && (
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
    </div>
  );
}
