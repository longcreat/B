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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
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
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMockViolationFeeRecords,
  type ViolationFeeRecord,
  type ViolationFeeType,
  type ViolationFeeStatus,
  type AccountType,
} from '../data/mockBusinessDocuments';

export { type ViolationFeeRecord };

interface ViolationFeeRecordListProps {
  onViewRecordDetail?: (record: ViolationFeeRecord) => void;
  onCancelFee?: (record: ViolationFeeRecord) => void;
}

export function ViolationFeeRecordList({ onViewRecordDetail, onCancelFee }: ViolationFeeRecordListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterFeeType, setFilterFeeType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAccountType, setFilterAccountType] = useState<string>('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterFeeTimeStart, setFilterFeeTimeStart] = useState('');
  const [filterFeeTimeEnd, setFilterFeeTimeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 使用 mock 数据
  const allRecords = getMockViolationFeeRecords();

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.feeId.toLowerCase().includes(query) &&
            !record.orderId.toLowerCase().includes(query) &&
            !record.relatedObjectName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 扣费类型筛选
      if (filterFeeType !== 'all' && record.feeType !== filterFeeType) {
        return false;
      }

      // 扣费状态筛选
      if (filterStatus !== 'all' && record.feeStatus !== filterStatus) {
        return false;
      }

      // 账户类型筛选
      if (filterAccountType !== 'all' && record.accountType !== filterAccountType) {
        return false;
      }

      // 扣费金额范围筛选
      if (filterAmountMin && Math.abs(record.feeAmount) < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && Math.abs(record.feeAmount) > parseFloat(filterAmountMax)) {
        return false;
      }

      // 扣费时间筛选
      if (filterFeeTimeStart && record.feeTime < filterFeeTimeStart) {
        return false;
      }
      if (filterFeeTimeEnd && record.feeTime > filterFeeTimeEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [allRecords, searchQuery, filterFeeType, filterStatus, filterAccountType, filterAmountMin, filterAmountMax, filterFeeTimeStart, filterFeeTimeEnd]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredRecords.reduce((sum, r) => sum + r.feeAmount, 0);
    const totalCount = filteredRecords.length;
    const pendingAmount = filteredRecords
      .filter(r => r.feeStatus === 'pending')
      .reduce((sum, r) => sum + r.feeAmount, 0);
    const deductedAmount = filteredRecords
      .filter(r => r.feeStatus === 'deducted')
      .reduce((sum, r) => sum + r.feeAmount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredRecords
      .filter(r => r.feeTime.startsWith(today))
      .reduce((sum, r) => sum + r.feeAmount, 0);

    return {
      totalAmount,
      totalCount,
      pendingAmount,
      deductedAmount,
      todayAmount,
    };
  }, [filteredRecords]);

  // 计算分页数据
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterFeeType, filterStatus, filterAccountType, filterAmountMin, filterAmountMax, filterFeeTimeStart, filterFeeTimeEnd]);

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
  const getFeeTypeLabel = (type: ViolationFeeType) => {
    const typeMap = {
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
              <span>业务单据管理</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>管控账单</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>违约扣费记录</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 统计信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">总扣费金额：</span>
                <span className="text-lg font-bold text-red-600">
                  ¥{Math.abs(statistics.totalAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">扣费笔数：</span>
                <span className="text-lg font-bold text-gray-900">
                  {statistics.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">待扣费金额：</span>
                <span className="text-lg font-bold text-yellow-600">
                  ¥{Math.abs(statistics.pendingAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">已扣费金额：</span>
                <span className="text-lg font-bold text-green-600">
                  ¥{Math.abs(statistics.deductedAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">今日扣费金额：</span>
                <span className="text-lg font-bold text-blue-600">
                  ¥{Math.abs(statistics.todayAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className={showFilters ? "py-4" : "py-3"}>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索扣费记录ID、订单号、关联对象"
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
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setSearchQuery('');
                setFilterFeeType('all');
                setFilterStatus('all');
                setFilterAccountType('all');
                setFilterAmountMin('');
                setFilterAmountMax('');
                setFilterFeeTimeStart('');
                setFilterFeeTimeEnd('');
              }}>
                重置
              </Button>
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出
              </Button>
            </div>

            {/* 筛选条件 */}
            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">扣费类型</Label>
                    <Select value={filterFeeType} onValueChange={setFilterFeeType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="dispute_deduction">客诉追索</SelectItem>
                      <SelectItem value="no_show_fee">No-Show扣费</SelectItem>
                      <SelectItem value="violation_fee">违规扣费</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">扣费状态</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待扣费</SelectItem>
                      <SelectItem value="deducted">已扣费</SelectItem>
                      <SelectItem value="cancelled">已撤销</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">账户类型</Label>
                  <Select value={filterAccountType} onValueChange={setFilterAccountType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="points">积分账户</SelectItem>
                      <SelectItem value="cash">现金账户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">最小金额</Label>
                  <Input
                    type="number"
                    placeholder="最小金额"
                    value={filterAmountMin}
                    onChange={(e) => setFilterAmountMin(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">最大金额</Label>
                  <Input
                    type="number"
                    placeholder="最大金额"
                    value={filterAmountMax}
                    onChange={(e) => setFilterAmountMax(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">扣费时间开始</Label>
                  <Input
                    type="date"
                    value={filterFeeTimeStart}
                    onChange={(e) => setFilterFeeTimeStart(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">扣费时间结束</Label>
                  <Input
                    type="date"
                    value={filterFeeTimeEnd}
                    onChange={(e) => setFilterFeeTimeEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 扣费记录列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .violation-fee-table-container table {
                table-layout: auto;
                min-width: 100%;
                width: max-content;
              }
              .violation-fee-table-container table td:last-child,
              .violation-fee-table-container table th:last-child {
                position: sticky;
                right: 0;
                background: white;
                z-index: 10;
                box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .violation-fee-table-container table td,
              .violation-fee-table-container table th {
                white-space: nowrap;
              }
              .violation-fee-table-container table td:nth-child(3),
              .violation-fee-table-container table th:nth-child(3) {
                white-space: normal;
                min-width: 120px;
              }
              .violation-fee-table-container table td:nth-child(5),
              .violation-fee-table-container table th:nth-child(5) {
                white-space: normal;
                min-width: 200px;
                max-width: 300px;
              }
            `}</style>
            <div className="violation-fee-table-container overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费记录ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关联订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关联对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费原因</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">扣费状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作人</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record) => (
                      <tr key={record.feeId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{record.feeId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.relatedObjectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getFeeTypeLabel(record.feeType)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.feeReason}</td>
                        <td className="px-4 py-3 text-sm text-red-600 font-medium">
                          ¥{Math.abs(record.feeAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.feeTime}</td>
                        <td className="px-4 py-3 text-sm">{getStatusBadge(record.feeStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getAccountTypeLabel(record.accountType)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.operatorName}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewRecordDetail?.(record)}
                              className="h-8 px-2"
                            >
                              查看详情
                            </Button>
                            {record.feeStatus === 'deducted' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onCancelFee?.(record)}
                                className="h-8 px-2 text-orange-600 hover:text-orange-700"
                              >
                                撤销扣费
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
          </CardContent>
        </Card>

        {/* 分页 */}
        {totalPages >= 1 && totalItems > 0 && (
          <div className="flex items-center justify-between">
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
      </div>
    </div>
  );
}

