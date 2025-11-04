import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { getMockWithdrawals, type Withdrawal, type WithdrawalStatus, type BusinessModel } from '../data/mockWithdrawals';

export { type Withdrawal };

interface WithdrawalManagementProps {
  onViewWithdrawalDetail?: (withdrawal: Withdrawal) => void;
}

export function WithdrawalManagement({ onViewWithdrawalDetail }: WithdrawalManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 筛选条件
  const [filterUserId, setFilterUserId] = useState('');
  const [filterUserName, setFilterUserName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<string>('all');
  const [filterCreateDateStart, setFilterCreateDateStart] = useState('');
  const [filterCreateDateEnd, setFilterCreateDateEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');

  // 批量操作
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set());

  // 使用 mock 数据
  const withdrawals: Withdrawal[] = getMockWithdrawals();

  // 过滤数据
  const getFilteredWithdrawals = () => {
    let filtered = withdrawals;

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.withdrawalId.toLowerCase().includes(query) ||
        w.userId.toLowerCase().includes(query) ||
        w.userName.toLowerCase().includes(query) ||
        w.phone.includes(query) ||
        w.account.includes(query) ||
        w.accountName.toLowerCase().includes(query)
      );
    }

    // 筛选条件
    if (filterUserId) {
      filtered = filtered.filter(w => w.userId.includes(filterUserId));
    }
    if (filterUserName) {
      filtered = filtered.filter(w => w.userName.includes(filterUserName));
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.status === filterStatus);
    }
    if (filterBusinessModel !== 'all') {
      filtered = filtered.filter(w => w.businessModel === filterBusinessModel);
    }
    if (filterCreateDateStart) {
      filtered = filtered.filter(w => w.createTime >= filterCreateDateStart);
    }
    if (filterCreateDateEnd) {
      filtered = filtered.filter(w => w.createTime <= filterCreateDateEnd + ' 23:59:59');
    }
    if (filterAmountMin) {
      const min = parseFloat(filterAmountMin);
      if (!isNaN(min)) {
        filtered = filtered.filter(w => w.amount >= min);
      }
    }
    if (filterAmountMax) {
      const max = parseFloat(filterAmountMax);
      if (!isNaN(max)) {
        filtered = filtered.filter(w => w.amount <= max);
      }
    }

    return filtered;
  };

  const filteredWithdrawals = getFilteredWithdrawals();

  // 获取状态徽章
  const getStatusBadge = (status: WithdrawalStatus) => {
    const config: Record<WithdrawalStatus, { label: string; className: string }> = {
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      success: { label: '提现成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '提现失败', className: 'bg-red-50 text-red-700 border-red-300' },
      pending_review: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      rejected: { label: '已拒绝', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      closed: { label: '提现关闭', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 获取业务模式标签
  const getBusinessModelLabel = (model: BusinessModel) => {
    const labels: Record<BusinessModel, string> = {
      mcp: 'MCP服务',
      saas: 'SaaS方案',
      affiliate: '联盟推广',
    };
    return labels[model];
  };

  const handleViewDetail = (withdrawal: Withdrawal) => {
    if (onViewWithdrawalDetail) {
      onViewWithdrawalDetail(withdrawal);
    }
  };

  const clearAllFilters = () => {
    setFilterUserId('');
    setFilterUserName('');
    setFilterStatus('all');
    setFilterBusinessModel('all');
    setFilterCreateDateStart('');
    setFilterCreateDateEnd('');
    setFilterAmountMin('');
    setFilterAmountMax('');
  };

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 计算分页数据
  const totalItems = filteredWithdrawals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
    setSelectedWithdrawals(new Set());
  }, [searchQuery, filterUserId, filterUserName, filterStatus, filterBusinessModel, filterCreateDateStart, filterCreateDateEnd, filterAmountMin, filterAmountMax]);

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWithdrawals(new Set(paginatedWithdrawals.map(w => w.withdrawalId)));
    } else {
      setSelectedWithdrawals(new Set());
    }
  };

  // 单个选择
  const handleSelectOne = (withdrawalId: string, checked: boolean) => {
    const newSelected = new Set(selectedWithdrawals);
    if (checked) {
      newSelected.add(withdrawalId);
    } else {
      newSelected.delete(withdrawalId);
    }
    setSelectedWithdrawals(newSelected);
  };

  // 批量操作
  const handleBatchReject = () => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请先选择要操作的提现记录');
      return;
    }
    toast.success(`已批量拒绝 ${selectedWithdrawals.size} 条提现记录`);
    setSelectedWithdrawals(new Set());
  };

  const handleBatchApprove = () => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请先选择要操作的提现记录');
      return;
    }
    toast.success(`已批量通过 ${selectedWithdrawals.size} 条提现记录`);
    setSelectedWithdrawals(new Set());
  };

  const handleBatchRetry = () => {
    if (selectedWithdrawals.size === 0) {
      toast.error('请先选择要操作的提现记录');
      return;
    }
    toast.success(`已批量重新发起 ${selectedWithdrawals.size} 条提现记录`);
    setSelectedWithdrawals(new Set());
  };

  const isAllSelected = paginatedWithdrawals.length > 0 && selectedWithdrawals.size === paginatedWithdrawals.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* 面包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>提现管理</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>自动提现</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className={showFilters ? "py-4" : "py-3"}>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索流水号、用户ID、用户名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>
            
            {/* 筛选条件 */}
            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">用户ID</Label>
                    <Input
                      placeholder="请输入用户ID"
                      value={filterUserId}
                      onChange={(e) => setFilterUserId(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">用户名称</Label>
                    <Input
                      placeholder="请输入用户名称"
                      value={filterUserName}
                      onChange={(e) => setFilterUserName(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">提现状态</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="processing">处理中</SelectItem>
                        <SelectItem value="success">提现成功</SelectItem>
                        <SelectItem value="failed">提现失败</SelectItem>
                        <SelectItem value="pending_review">待审核</SelectItem>
                        <SelectItem value="rejected">已拒绝</SelectItem>
                        <SelectItem value="closed">提现关闭</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">业务模式</Label>
                    <Select value={filterBusinessModel} onValueChange={setFilterBusinessModel}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部模式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部模式</SelectItem>
                        <SelectItem value="mcp">MCP服务</SelectItem>
                        <SelectItem value="saas">SaaS方案</SelectItem>
                        <SelectItem value="affiliate">联盟推广</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">创建时间</Label>
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
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">提现金额</Label>
                    <Input
                      type="number"
                      placeholder="最小金额"
                      value={filterAmountMin}
                      onChange={(e) => setFilterAmountMin(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-gray-500">至</span>
                    <Input
                      type="number"
                      placeholder="最大金额"
                      value={filterAmountMax}
                      onChange={(e) => setFilterAmountMax(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearAllFilters}>
                    清除所有筛选
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 批量操作 */}
        {selectedWithdrawals.size > 0 && (
          <Card className="mb-6">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已选择 <span className="font-medium text-gray-900">{selectedWithdrawals.size}</span> 条记录
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchReject}
                  >
                    批量拒绝
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchApprove}
                  >
                    批量通过
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchRetry}
                  >
                    批量重新发起
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 提现列表 */}
        <Card>
          <CardHeader>
            <CardTitle>提现列表</CardTitle>
          </CardHeader>
          <CardContent>
            <style>{`
              .withdrawal-table-container {
                position: relative;
              }
              .withdrawal-table-container table {
                min-width: 2000px !important;
                width: max-content;
              }
              .withdrawal-table-container table th:last-child,
              .withdrawal-table-container table td:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .withdrawal-table-container table th:last-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto withdrawal-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '2000px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '50px' }}>
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>流水号</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>用户ID</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>用户名称</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>提现创建时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>转账汇款时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>提现人电话</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>提现账户</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>提现用户名</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>提现金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>提现状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>业务模式</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>备注</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '100px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWithdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="text-center py-12 text-gray-500">
                        暂无提现数据
                      </td>
                    </tr>
                  ) : (
                    paginatedWithdrawals.map((withdrawal) => (
                      <tr key={withdrawal.withdrawalId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedWithdrawals.has(withdrawal.withdrawalId)}
                            onCheckedChange={(checked) => handleSelectOne(withdrawal.withdrawalId, checked as boolean)}
                          />
                        </td>
                        <td className="p-3 text-sm">{withdrawal.withdrawalId}</td>
                        <td className="p-3 text-sm">{withdrawal.userId}</td>
                        <td className="p-3 text-sm">{withdrawal.userName}</td>
                        <td className="p-3 text-sm">{withdrawal.createTime}</td>
                        <td className="p-3 text-sm">{withdrawal.transferTime || '--'}</td>
                        <td className="p-3 text-sm">{withdrawal.phone}</td>
                        <td className="p-3 text-sm">{withdrawal.account}</td>
                        <td className="p-3 text-sm">{withdrawal.accountName}</td>
                        <td className="p-3 text-sm font-medium">¥{withdrawal.amount.toFixed(2)}</td>
                        <td className="p-3 text-sm">{getStatusBadge(withdrawal.status)}</td>
                        <td className="p-3 text-sm">{getBusinessModelLabel(withdrawal.businessModel)}</td>
                        <td className="p-3 text-sm">{withdrawal.remark || '--'}</td>
                        <td className="p-3 text-sm sticky right-0 bg-white z-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(withdrawal)}
                            className="h-8 px-2"
                          >
                            详情
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
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  共 {totalItems} 条数据，第 {currentPage} / {totalPages} 页
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
      </div>
    </div>
  );
}

