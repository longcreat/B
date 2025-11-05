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
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMockOrderRefundRecords,
  type OrderRefundRecord,
  type RefundType,
  type RefundStatus,
} from '../data/mockBusinessDocuments';

export { type OrderRefundRecord };

interface OrderRefundRecordListProps {
  onViewRecordDetail?: (record: OrderRefundRecord) => void;
  onViewOrder?: (orderId: string) => void;
  onRetryRefund?: (record: OrderRefundRecord) => void;
}

export function OrderRefundRecordList({ onViewRecordDetail, onViewOrder, onRetryRefund }: OrderRefundRecordListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRefundType, setFilterRefundType] = useState<string>('all');
  const [filterRefundStatus, setFilterRefundStatus] = useState<string>('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterRefundTimeStart, setFilterRefundTimeStart] = useState('');
  const [filterRefundTimeEnd, setFilterRefundTimeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 使用 mock 数据
  const allRecords = getMockOrderRefundRecords();

  // 筛选逻辑
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!record.refundId.toLowerCase().includes(query) &&
            !record.orderId.toLowerCase().includes(query) &&
            !record.relatedObjectName.toLowerCase().includes(query) &&
            !(record.refundNo && record.refundNo.toLowerCase().includes(query))) {
          return false;
        }
      }

      // 退款类型筛选
      if (filterRefundType !== 'all' && record.refundType !== filterRefundType) {
        return false;
      }

      // 退款状态筛选
      if (filterRefundStatus !== 'all' && record.refundStatus !== filterRefundStatus) {
        return false;
      }

      // 退款金额范围筛选
      if (filterAmountMin && record.refundAmount < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && record.refundAmount > parseFloat(filterAmountMax)) {
        return false;
      }

      // 退款时间筛选
      if (filterRefundTimeStart && record.refundTime < filterRefundTimeStart) {
        return false;
      }
      if (filterRefundTimeEnd && record.refundTime > filterRefundTimeEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [allRecords, searchQuery, filterRefundType, filterRefundStatus, filterAmountMin, filterAmountMax, filterRefundTimeStart, filterRefundTimeEnd]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredRecords.reduce((sum, r) => sum + r.refundAmount, 0);
    const totalCount = filteredRecords.length;
    const successAmount = filteredRecords
      .filter(r => r.refundStatus === 'success')
      .reduce((sum, r) => sum + r.refundAmount, 0);
    const failedCount = filteredRecords.filter(r => r.refundStatus === 'failed').length;
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredRecords
      .filter(r => r.refundTime.startsWith(today))
      .reduce((sum, r) => sum + r.refundAmount, 0);

    return {
      totalAmount,
      totalCount,
      successAmount,
      failedCount,
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
  }, [searchQuery, filterRefundType, filterRefundStatus, filterAmountMin, filterAmountMax, filterRefundTimeStart, filterRefundTimeEnd]);

  // 状态Badge
  const getRefundStatusBadge = (status: RefundStatus) => {
    const config = {
      processing: { label: '退款中', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      success: { label: '退款成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '退款失败', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 退款类型标签
  const getRefundTypeLabel = (type: RefundType) => {
    const typeMap = {
      full_refund: '全额退款',
      partial_refund: '部分退款',
      cancel_refund: '取消退款',
    };
    return typeMap[type] || type;
  };

  // 导出
  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  // 重新发起退款
  const handleRetryRefund = (record: OrderRefundRecord) => {
    if (onRetryRefund) {
      onRetryRefund(record);
    } else {
      toast.success('重新发起退款功能开发中');
    }
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
            <BreadcrumbPage>订单退款记录</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 统计信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">退款总金额：</span>
                <span className="text-lg font-bold text-red-600">
                  ¥{statistics.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">退款笔数：</span>
                <span className="text-lg font-bold text-gray-900">
                  {statistics.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">退款成功金额：</span>
                <span className="text-lg font-bold text-green-600">
                  ¥{statistics.successAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">退款失败笔数：</span>
                <span className="text-lg font-bold text-red-600">
                  {statistics.failedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">今日退款金额：</span>
                <span className="text-lg font-bold text-blue-600">
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
                  placeholder="搜索退款记录ID、订单号、关联对象、退款流水号"
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
                setFilterRefundType('all');
                setFilterRefundStatus('all');
                setFilterAmountMin('');
                setFilterAmountMax('');
                setFilterRefundTimeStart('');
                setFilterRefundTimeEnd('');
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">退款类型</Label>
                    <Select value={filterRefundType} onValueChange={setFilterRefundType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="full_refund">全额退款</SelectItem>
                        <SelectItem value="partial_refund">部分退款</SelectItem>
                        <SelectItem value="cancel_refund">取消退款</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">退款状态</Label>
                    <Select value={filterRefundStatus} onValueChange={setFilterRefundStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="processing">退款中</SelectItem>
                        <SelectItem value="success">退款成功</SelectItem>
                        <SelectItem value="failed">退款失败</SelectItem>
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">退款时间开始</Label>
                    <Input
                      type="date"
                      value={filterRefundTimeStart}
                      onChange={(e) => setFilterRefundTimeStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">退款时间结束</Label>
                    <Input
                      type="date"
                      value={filterRefundTimeEnd}
                      onChange={(e) => setFilterRefundTimeEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 退款记录列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .refund-record-table-container table {
                table-layout: auto;
                min-width: 100%;
                width: max-content;
              }
              .refund-record-table-container table td:last-child,
              .refund-record-table-container table th:last-child {
                position: sticky;
                right: 0;
                background: white;
                z-index: 10;
                box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .refund-record-table-container table td,
              .refund-record-table-container table th {
                white-space: nowrap;
              }
              .refund-record-table-container table td:nth-child(3),
              .refund-record-table-container table th:nth-child(3) {
                white-space: normal;
                min-width: 120px;
              }
              .refund-record-table-container table td:nth-child(7),
              .refund-record-table-container table th:nth-child(7) {
                white-space: normal;
                min-width: 200px;
                max-width: 300px;
              }
            `}</style>
            <div className="refund-record-table-container overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款记录ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关联对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">原订单金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款原因</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款流水号</th>
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
                      <tr key={record.refundId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{record.refundId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.relatedObjectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getRefundTypeLabel(record.refundType)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ¥{record.originalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 font-medium">
                          ¥{record.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.refundReason}</td>
                        <td className="px-4 py-3 text-sm">{getRefundStatusBadge(record.refundStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.refundTime}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.refundNo || '-'}</td>
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
                            {record.refundStatus === 'failed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRetryRefund(record)}
                                className="h-8 px-2 text-orange-600 hover:text-orange-700"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                重试
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
