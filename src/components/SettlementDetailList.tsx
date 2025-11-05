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
  getMockSettlementDetails,
  type SettlementDetail,
  type SettlementType,
  type SettlementObjectType,
  type SettlementDetailStatus,
} from '../data/mockBusinessDocuments';

export { type SettlementDetail };

interface SettlementDetailListProps {
  onViewDetail?: (detail: SettlementDetail) => void;
  onViewBatch?: (batchId: string) => void;
  onViewOrder?: (orderId: string) => void;
}

export function SettlementDetailList({ onViewDetail, onViewBatch, onViewOrder }: SettlementDetailListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSettlementType, setFilterSettlementType] = useState<string>('all');
  const [filterSettlementObjectType, setFilterSettlementObjectType] = useState<string>('all');
  const [filterSettlementStatus, setFilterSettlementStatus] = useState<string>('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterSettlementTimeStart, setFilterSettlementTimeStart] = useState('');
  const [filterSettlementTimeEnd, setFilterSettlementTimeEnd] = useState('');
  const [filterPeriodStart, setFilterPeriodStart] = useState('');
  const [filterPeriodEnd, setFilterPeriodEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 使用 mock 数据
  const allDetails = getMockSettlementDetails();

  // 筛选逻辑
  const filteredDetails = useMemo(() => {
    return allDetails.filter((detail) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!detail.detailId.toLowerCase().includes(query) &&
            !detail.batchId.toLowerCase().includes(query) &&
            !detail.orderId.toLowerCase().includes(query) &&
            !detail.relatedObjectName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 结算类型筛选
      if (filterSettlementType !== 'all' && detail.settlementType !== filterSettlementType) {
        return false;
      }

      // 结算对象类型筛选
      if (filterSettlementObjectType !== 'all' && detail.settlementObjectType !== filterSettlementObjectType) {
        return false;
      }

      // 结算状态筛选
      if (filterSettlementStatus !== 'all' && detail.settlementStatus !== filterSettlementStatus) {
        return false;
      }

      // 结算金额范围筛选
      if (filterAmountMin && detail.settlementAmount < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && detail.settlementAmount > parseFloat(filterAmountMax)) {
        return false;
      }

      // 结算时间筛选
      if (filterSettlementTimeStart && detail.settlementTime < filterSettlementTimeStart) {
        return false;
      }
      if (filterSettlementTimeEnd && detail.settlementTime > filterSettlementTimeEnd + ' 23:59:59') {
        return false;
      }

      // 结算周期筛选
      if (filterPeriodStart && detail.settlementPeriodEnd < filterPeriodStart) {
        return false;
      }
      if (filterPeriodEnd && detail.settlementPeriodStart > filterPeriodEnd) {
        return false;
      }

      return true;
    });
  }, [allDetails, searchQuery, filterSettlementType, filterSettlementObjectType, filterSettlementStatus, filterAmountMin, filterAmountMax, filterSettlementTimeStart, filterSettlementTimeEnd, filterPeriodStart, filterPeriodEnd]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredDetails.reduce((sum, d) => sum + d.settlementAmount, 0);
    const totalCount = filteredDetails.length;
    const creditedAmount = filteredDetails
      .filter(d => d.settlementStatus === 'credited' || d.settlementStatus === 'paid' || d.settlementStatus === 'completed')
      .reduce((sum, d) => sum + d.settlementAmount, 0);
    const paidAmount = filteredDetails
      .filter(d => d.settlementStatus === 'paid' || d.settlementStatus === 'completed')
      .reduce((sum, d) => sum + d.settlementAmount, 0);
    const pendingAmount = filteredDetails
      .filter(d => d.settlementStatus === 'pending')
      .reduce((sum, d) => sum + d.settlementAmount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredDetails
      .filter(d => d.settlementTime.startsWith(today))
      .reduce((sum, d) => sum + d.settlementAmount, 0);

    return {
      totalAmount,
      totalCount,
      creditedAmount,
      paidAmount,
      pendingAmount,
      todayAmount,
    };
  }, [filteredDetails]);

  // 计算分页数据
  const totalItems = filteredDetails.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDetails = filteredDetails.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSettlementType, filterSettlementObjectType, filterSettlementStatus, filterAmountMin, filterAmountMax, filterSettlementTimeStart, filterSettlementTimeEnd, filterPeriodStart, filterPeriodEnd]);

  // 状态Badge
  const getSettlementStatusBadge = (status: SettlementDetailStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      credited: { label: '已计入', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300' },
      completed: { label: '已完成', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 结算类型标签
  const getSettlementTypeLabel = (type: SettlementType) => {
    return type === 'partner_settlement' ? '客户结算' : '供应商结算';
  };

  // 结算对象类型标签
  const getSettlementObjectTypeLabel = (type: SettlementObjectType) => {
    return type === 'partner' ? '小B客户' : '供应商';
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
            <BreadcrumbPage>结算明细</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 统计信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">结算总金额：</span>
                <span className="text-lg font-bold text-blue-600">
                  ¥{statistics.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">结算笔数：</span>
                <span className="text-lg font-bold text-gray-900">
                  {statistics.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">已计入金额：</span>
                <span className="text-lg font-bold text-blue-600">
                  ¥{statistics.creditedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">已打款金额：</span>
                <span className="text-lg font-bold text-green-600">
                  ¥{statistics.paidAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">待结算金额：</span>
                <span className="text-lg font-bold text-yellow-600">
                  ¥{statistics.pendingAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">今日结算金额：</span>
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
                  placeholder="搜索明细ID、结算批次号、订单号、结算对象"
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
                setFilterSettlementType('all');
                setFilterSettlementObjectType('all');
                setFilterSettlementStatus('all');
                setFilterAmountMin('');
                setFilterAmountMax('');
                setFilterSettlementTimeStart('');
                setFilterSettlementTimeEnd('');
                setFilterPeriodStart('');
                setFilterPeriodEnd('');
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算类型</Label>
                    <Select value={filterSettlementType} onValueChange={setFilterSettlementType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="partner_settlement">客户结算</SelectItem>
                        <SelectItem value="supplier_settlement">供应商结算</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算对象类型</Label>
                    <Select value={filterSettlementObjectType} onValueChange={setFilterSettlementObjectType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="partner">小B客户</SelectItem>
                        <SelectItem value="supplier">供应商</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算状态</Label>
                    <Select value={filterSettlementStatus} onValueChange={setFilterSettlementStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待结算</SelectItem>
                        <SelectItem value="credited">已计入</SelectItem>
                        <SelectItem value="paid">已打款</SelectItem>
                        <SelectItem value="completed">已完成</SelectItem>
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算时间开始</Label>
                    <Input
                      type="date"
                      value={filterSettlementTimeStart}
                      onChange={(e) => setFilterSettlementTimeStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算时间结束</Label>
                    <Input
                      type="date"
                      value={filterSettlementTimeEnd}
                      onChange={(e) => setFilterSettlementTimeEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算周期开始</Label>
                    <Input
                      type="date"
                      value={filterPeriodStart}
                      onChange={(e) => setFilterPeriodStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算周期结束</Label>
                    <Input
                      type="date"
                      value={filterPeriodEnd}
                      onChange={(e) => setFilterPeriodEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 结算明细列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .settlement-detail-table-container table {
                table-layout: auto;
                min-width: 100%;
                width: max-content;
              }
              .settlement-detail-table-container table td:last-child,
              .settlement-detail-table-container table th:last-child {
                position: sticky;
                right: 0;
                background: white;
                z-index: 10;
                box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .settlement-detail-table-container table td,
              .settlement-detail-table-container table th {
                white-space: nowrap;
              }
              .settlement-detail-table-container table td:nth-child(4),
              .settlement-detail-table-container table th:nth-child(4) {
                white-space: normal;
                min-width: 120px;
              }
            `}</style>
            <div className="settlement-detail-table-container overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">明细ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算批次号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算周期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDetails.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedDetails.map((detail) => (
                      <tr key={detail.detailId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{detail.detailId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{detail.batchId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{detail.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{detail.relatedObjectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getSettlementTypeLabel(detail.settlementType)}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                          ¥{detail.settlementAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {detail.settlementPeriodStart} 至 {detail.settlementPeriodEnd}
                        </td>
                        <td className="px-4 py-3 text-sm">{getSettlementStatusBadge(detail.settlementStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{detail.settlementTime}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetail?.(detail)}
                              className="h-8 px-2"
                            >
                              查看详情
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewBatch?.(detail.batchId)}
                              className="h-8 px-2"
                            >
                              查看批次
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewOrder?.(detail.orderId)}
                              className="h-8 px-2"
                            >
                              查看订单
                            </Button>
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
