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
  getMockOrderPriceChangeRecords,
  type OrderPriceChangeRecord,
  type PriceChangeType,
  type ApprovalStatus,
} from '../data/mockBusinessDocuments';

export { type OrderPriceChangeRecord };

interface OrderPriceChangeRecordListProps {
  onViewRecordDetail?: (record: OrderPriceChangeRecord) => void;
  onViewOrder?: (orderId: string) => void;
  onApprove?: (record: OrderPriceChangeRecord, approved: boolean, reason?: string) => void;
}

export function OrderPriceChangeRecordList({ onViewRecordDetail, onViewOrder, onApprove }: OrderPriceChangeRecordListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterChangeType, setFilterChangeType] = useState<string>('all');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>('all');
  const [filterChangeAmountMin, setFilterChangeAmountMin] = useState('');
  const [filterChangeAmountMax, setFilterChangeAmountMax] = useState('');
  const [filterChangeTimeStart, setFilterChangeTimeStart] = useState('');
  const [filterChangeTimeEnd, setFilterChangeTimeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 使用 mock 数据
  const allRecords = getMockOrderPriceChangeRecords();

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.priceChangeId.toLowerCase().includes(query) &&
            !record.orderId.toLowerCase().includes(query) &&
            !record.relatedObjectName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 改价类型筛选
      if (filterChangeType !== 'all' && record.changeType !== filterChangeType) {
        return false;
      }

      // 审批状态筛选
      if (filterApprovalStatus !== 'all' && record.approvalStatus !== filterApprovalStatus) {
        return false;
      }

      // 改价金额范围筛选
      if (filterChangeAmountMin && Math.abs(record.changeAmount) < parseFloat(filterChangeAmountMin)) {
        return false;
      }
      if (filterChangeAmountMax && Math.abs(record.changeAmount) > parseFloat(filterChangeAmountMax)) {
        return false;
      }

      // 改价时间筛选
      if (filterChangeTimeStart && record.changeTime < filterChangeTimeStart) {
        return false;
      }
      if (filterChangeTimeEnd && record.changeTime > filterChangeTimeEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [allRecords, searchQuery, filterChangeType, filterApprovalStatus, filterChangeAmountMin, filterChangeAmountMax, filterChangeTimeStart, filterChangeTimeEnd]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalChangeAmount = filteredRecords.reduce((sum, r) => sum + r.changeAmount, 0);
    const totalCount = filteredRecords.length;
    const increaseAmount = filteredRecords
      .filter(r => r.changeType === 'price_increase')
      .reduce((sum, r) => sum + r.changeAmount, 0);
    const decreaseAmount = filteredRecords
      .filter(r => r.changeType === 'price_decrease')
      .reduce((sum, r) => sum + r.changeAmount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredRecords
      .filter(r => r.changeTime.startsWith(today))
      .reduce((sum, r) => sum + r.changeAmount, 0);

    return {
      totalChangeAmount,
      totalCount,
      increaseAmount,
      decreaseAmount,
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
  }, [searchQuery, filterChangeType, filterApprovalStatus, filterChangeAmountMin, filterChangeAmountMax, filterChangeTimeStart, filterChangeTimeEnd]);

  // 状态Badge
  const getApprovalStatusBadge = (status: ApprovalStatus) => {
    const config = {
      pending: { label: '待审批', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已审批', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 改价类型标签
  const getChangeTypeLabel = (type: PriceChangeType) => {
    const typeMap = {
      price_increase: '升价',
      price_decrease: '降价',
      price_correction: '价格修正',
    };
    return typeMap[type] || type;
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
              <span>交易记录</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>订单改价记录</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 统计信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">改价总金额：</span>
                <span className={`text-lg font-bold ${
                  statistics.totalChangeAmount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {statistics.totalChangeAmount >= 0 ? '+' : ''}
                  ¥{statistics.totalChangeAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">改价笔数：</span>
                <span className="text-lg font-bold text-gray-900">
                  {statistics.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">升价总金额：</span>
                <span className="text-lg font-bold text-green-600">
                  +¥{statistics.increaseAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">降价总金额：</span>
                <span className="text-lg font-bold text-red-600">
                  -¥{Math.abs(statistics.decreaseAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">今日改价金额：</span>
                <span className={`text-lg font-bold ${
                  statistics.todayAmount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {statistics.todayAmount >= 0 ? '+' : ''}
                  ¥{statistics.todayAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  placeholder="搜索改价记录ID、订单号、关联对象"
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
                setFilterChangeType('all');
                setFilterApprovalStatus('all');
                setFilterChangeAmountMin('');
                setFilterChangeAmountMax('');
                setFilterChangeTimeStart('');
                setFilterChangeTimeEnd('');
              }}>
                重置
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>

            {/* 筛选条件 */}
            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">改价类型</Label>
                    <Select value={filterChangeType} onValueChange={setFilterChangeType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="price_increase">升价</SelectItem>
                        <SelectItem value="price_decrease">降价</SelectItem>
                        <SelectItem value="price_correction">价格修正</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">审批状态</Label>
                    <Select value={filterApprovalStatus} onValueChange={setFilterApprovalStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待审批</SelectItem>
                        <SelectItem value="approved">已审批</SelectItem>
                        <SelectItem value="rejected">已驳回</SelectItem>
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
                      value={filterChangeAmountMin}
                      onChange={(e) => setFilterChangeAmountMin(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">最大金额</Label>
                    <Input
                      type="number"
                      placeholder="最大金额"
                      value={filterChangeAmountMax}
                      onChange={(e) => setFilterChangeAmountMax(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">改价时间开始</Label>
                    <Input
                      type="date"
                      value={filterChangeTimeStart}
                      onChange={(e) => setFilterChangeTimeStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">改价时间结束</Label>
                    <Input
                      type="date"
                      value={filterChangeTimeEnd}
                      onChange={(e) => setFilterChangeTimeEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 改价记录列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .price-change-table-container table {
                table-layout: auto;
                min-width: 100%;
                width: max-content;
              }
              .price-change-table-container table td:last-child,
              .price-change-table-container table th:last-child {
                position: sticky;
                right: 0;
                background: white;
                z-index: 10;
                box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .price-change-table-container table td,
              .price-change-table-container table th {
                white-space: nowrap;
              }
              .price-change-table-container table td:nth-child(3),
              .price-change-table-container table th:nth-child(3) {
                white-space: normal;
                min-width: 120px;
              }
              .price-change-table-container table td:nth-child(8),
              .price-change-table-container table th:nth-child(8) {
                white-space: normal;
                min-width: 200px;
                max-width: 300px;
              }
            `}</style>
            <div className="price-change-table-container overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">改价记录ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关联对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">改价类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">原订单金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">新订单金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">改价金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">改价原因</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">改价时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">审批状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作人</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((record) => (
                      <tr key={record.priceChangeId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{record.priceChangeId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.relatedObjectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getChangeTypeLabel(record.changeType)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ¥{record.originalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ¥{record.newAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium ${
                          record.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {record.changeAmount >= 0 ? '+' : ''}
                          ¥{Math.abs(record.changeAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.changeReason}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.changeTime}</td>
                        <td className="px-4 py-3 text-sm">{getApprovalStatusBadge(record.approvalStatus)}</td>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewOrder?.(record.orderId)}
                              className="h-8 px-2"
                            >
                              查看订单
                            </Button>
                            {record.approvalStatus === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onApprove?.(record, true)}
                                className="h-8 px-2 text-green-600 hover:text-green-700"
                              >
                                审批
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

