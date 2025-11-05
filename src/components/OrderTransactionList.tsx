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
  getMockOrderTransactions,
  type OrderTransaction,
  type TransactionType,
  type PaymentChannel,
  type PaymentStatus,
} from '../data/mockBusinessDocuments';

export { type OrderTransaction };

interface OrderTransactionListProps {
  onViewTransactionDetail?: (transaction: OrderTransaction) => void;
  onViewOrder?: (orderId: string) => void;
}

export function OrderTransactionList({ onViewTransactionDetail, onViewOrder }: OrderTransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterTransactionType, setFilterTransactionType] = useState<string>('all');
  const [filterPaymentChannel, setFilterPaymentChannel] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterTransactionTimeStart, setFilterTransactionTimeStart] = useState('');
  const [filterTransactionTimeEnd, setFilterTransactionTimeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 使用 mock 数据
  const allTransactions = getMockOrderTransactions();

  // 筛选逻辑
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!transaction.transactionId.toLowerCase().includes(query) &&
            !transaction.orderId.toLowerCase().includes(query) &&
            !transaction.relatedObjectName.toLowerCase().includes(query) &&
            !(transaction.transactionNo && transaction.transactionNo.toLowerCase().includes(query))) {
          return false;
        }
      }

      // 交易类型筛选
      if (filterTransactionType !== 'all' && transaction.transactionType !== filterTransactionType) {
        return false;
      }

      // 支付渠道筛选
      if (filterPaymentChannel !== 'all' && transaction.paymentChannel !== filterPaymentChannel) {
        return false;
      }

      // 支付状态筛选
      if (filterPaymentStatus !== 'all' && transaction.paymentStatus !== filterPaymentStatus) {
        return false;
      }

      // 交易金额范围筛选
      if (filterAmountMin && Math.abs(transaction.transactionAmount) < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && Math.abs(transaction.transactionAmount) > parseFloat(filterAmountMax)) {
        return false;
      }

      // 交易时间筛选
      if (filterTransactionTimeStart && transaction.transactionTime < filterTransactionTimeStart) {
        return false;
      }
      if (filterTransactionTimeEnd && transaction.transactionTime > filterTransactionTimeEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [allTransactions, searchQuery, filterTransactionType, filterPaymentChannel, filterPaymentStatus, filterAmountMin, filterAmountMax, filterTransactionTimeStart, filterTransactionTimeEnd]);

  // 计算统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.transactionAmount, 0);
    const totalCount = filteredTransactions.length;
    const successAmount = filteredTransactions
      .filter(t => t.paymentStatus === 'success')
      .reduce((sum, t) => sum + (t.transactionAmount > 0 ? t.transactionAmount : 0), 0);
    const failedCount = filteredTransactions.filter(t => t.paymentStatus === 'failed').length;
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredTransactions
      .filter(t => t.transactionTime.startsWith(today))
      .reduce((sum, t) => sum + (t.transactionAmount > 0 ? t.transactionAmount : 0), 0);

    return {
      totalAmount,
      totalCount,
      successAmount,
      failedCount,
      todayAmount,
    };
  }, [filteredTransactions]);

  // 计算分页数据
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTransactionType, filterPaymentChannel, filterPaymentStatus, filterAmountMin, filterAmountMax, filterTransactionTimeStart, filterTransactionTimeEnd]);

  // 状态Badge
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const config = {
      processing: { label: '支付中', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      success: { label: '支付成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '支付失败', className: 'bg-red-50 text-red-700 border-red-300' },
      refunded: { label: '已退款', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 交易类型标签
  const getTransactionTypeLabel = (type: TransactionType) => {
    const typeMap = {
      order_payment: '订单支付',
      order_refund: '订单退款',
      order_supplement: '订单补款',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 支付渠道标签
  const getPaymentChannelLabel = (channel: PaymentChannel) => {
    const channelMap = {
      wechat: '微信',
      alipay: '支付宝',
      bank: '银行转账',
      other: '其他',
    };
    return channelMap[channel] || channel;
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
            <BreadcrumbPage>订单交易</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 统计信息卡片 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">总交易金额：</span>
                <span className="text-lg font-bold text-blue-600">
                  ¥{statistics.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">交易笔数：</span>
                <span className="text-lg font-bold text-gray-900">
                  {statistics.totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">支付成功金额：</span>
                <span className="text-lg font-bold text-green-600">
                  ¥{statistics.successAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">支付失败笔数：</span>
                <span className="text-lg font-bold text-red-600">
                  {statistics.failedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">今日交易金额：</span>
                <span className="text-lg font-bold text-blue-600">
                  ¥{statistics.todayAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索交易记录ID、订单号、关联对象、流水号"
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
                setFilterTransactionType('all');
                setFilterPaymentChannel('all');
                setFilterPaymentStatus('all');
                setFilterAmountMin('');
                setFilterAmountMax('');
                setFilterTransactionTimeStart('');
                setFilterTransactionTimeEnd('');
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">交易类型</Label>
                    <Select value={filterTransactionType} onValueChange={setFilterTransactionType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="order_payment">订单支付</SelectItem>
                        <SelectItem value="order_refund">订单退款</SelectItem>
                        <SelectItem value="order_supplement">订单补款</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">支付渠道</Label>
                    <Select value={filterPaymentChannel} onValueChange={setFilterPaymentChannel}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部渠道" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部渠道</SelectItem>
                        <SelectItem value="wechat">微信</SelectItem>
                        <SelectItem value="alipay">支付宝</SelectItem>
                        <SelectItem value="bank">银行转账</SelectItem>
                        <SelectItem value="other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">支付状态</Label>
                    <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="processing">支付中</SelectItem>
                        <SelectItem value="success">支付成功</SelectItem>
                        <SelectItem value="failed">支付失败</SelectItem>
                        <SelectItem value="refunded">已退款</SelectItem>
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">交易时间开始</Label>
                    <Input
                      type="date"
                      value={filterTransactionTimeStart}
                      onChange={(e) => setFilterTransactionTimeStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">交易时间结束</Label>
                    <Input
                      type="date"
                      value={filterTransactionTimeEnd}
                      onChange={(e) => setFilterTransactionTimeEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 交易记录列表 */}
        <Card>
          <CardContent className="p-0">
            <style>{`
              .order-transaction-table-container table {
                table-layout: auto;
                min-width: 100%;
                width: max-content;
              }
              .order-transaction-table-container table td:last-child,
              .order-transaction-table-container table th:last-child {
                position: sticky;
                right: 0;
                background: white;
                z-index: 10;
                box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
              }
              .order-transaction-table-container table td,
              .order-transaction-table-container table th {
                white-space: nowrap;
              }
              .order-transaction-table-container table td:nth-child(3),
              .order-transaction-table-container table th:nth-child(3) {
                white-space: normal;
                min-width: 120px;
              }
            `}</style>
            <div className="order-transaction-table-container overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">交易记录ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关联对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">交易类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">交易金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">支付渠道</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">支付状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">交易流水号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">交易时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr key={transaction.transactionId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{transaction.transactionId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{transaction.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{transaction.relatedObjectName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getTransactionTypeLabel(transaction.transactionType)}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${
                          transaction.transactionAmount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.transactionAmount > 0 ? '+' : ''}
                          ¥{Math.abs(transaction.transactionAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getPaymentChannelLabel(transaction.paymentChannel)}</td>
                        <td className="px-4 py-3 text-sm">{getPaymentStatusBadge(transaction.paymentStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{transaction.transactionNo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{transaction.transactionTime}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewTransactionDetail?.(transaction)}
                              className="h-8 px-2"
                            >
                              查看详情
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewOrder?.(transaction.orderId)}
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

