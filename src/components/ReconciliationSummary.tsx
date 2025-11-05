import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
  Download,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getMockReconciliations, 
  type Reconciliation, 
  type ReconciliationType,
} from '../data/mockReconciliations';

interface ReconciliationSummaryProps {
  onViewReconciliationDetail?: (reconciliation: Reconciliation) => void;
}

export function ReconciliationSummary({ onViewReconciliationDetail }: ReconciliationSummaryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ReconciliationType | 'all'>('all');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 获取所有对账数据
  const allReconciliations = getMockReconciliations();

  // 判断是否有差异
  const hasDifference = (reconciliation: Reconciliation): boolean => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.status === 'difference';
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.status === 'platform_more' || reconciliation.status === 'channel_more';
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.status === 'withdrawal_more' || reconciliation.status === 'account_more';
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.status === 'invoice_more' || reconciliation.status === 'cost_more';
    }
    return false;
  };

  // 获取差异金额
  const getDifferenceAmount = (reconciliation: Reconciliation): number => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.difference;
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.differenceAmount;
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.differenceAmount;
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.differenceAmount;
    }
    return 0;
  };

  // 筛选出有差异的记录
  const differenceReconciliations = useMemo(() => {
    return allReconciliations.filter(hasDifference);
  }, [allReconciliations]);

  // 统计数据
  const statistics = useMemo(() => {
    let filtered = [...differenceReconciliations];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        if (r.type === 'supplier_cost') {
          return r.orderId.toLowerCase().includes(query) || 
                 r.supplierName.toLowerCase().includes(query);
        } else if (r.type === 'payment_channel') {
          return r.id.toLowerCase().includes(query);
        } else if (r.type === 'withdrawal') {
          return r.partnerName.toLowerCase().includes(query) || 
                 r.partnerId.toLowerCase().includes(query);
        } else if (r.type === 'invoice') {
          return r.id.toLowerCase().includes(query);
        }
        return false;
      });
    }

    // 类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    // 日期筛选
    if (filterDateStart) {
      filtered = filtered.filter(r => {
        const date = r.type === 'supplier_cost' || r.type === 'payment_channel' 
          ? (r.type === 'supplier_cost' ? r.createdAt : (r as any).reconciliationDate)
          : (r.type === 'withdrawal' || r.type === 'invoice' ? (r as any).reconciliationMonth : r.createdAt);
        return date >= filterDateStart;
      });
    }
    if (filterDateEnd) {
      filtered = filtered.filter(r => {
        const date = r.type === 'supplier_cost' || r.type === 'payment_channel' 
          ? (r.type === 'supplier_cost' ? r.createdAt : (r as any).reconciliationDate)
          : (r.type === 'withdrawal' || r.type === 'invoice' ? (r as any).reconciliationMonth : r.createdAt);
        return date <= filterDateEnd;
      });
    }

    // 计算统计
    const totalCount = filtered.length;
    const totalAmount = filtered.reduce((sum, r) => sum + Math.abs(getDifferenceAmount(r)), 0);
    
    const byType = {
      supplier_cost: filtered.filter(r => r.type === 'supplier_cost').length,
      payment_channel: filtered.filter(r => r.type === 'payment_channel').length,
      withdrawal: filtered.filter(r => r.type === 'withdrawal').length,
      invoice: filtered.filter(r => r.type === 'invoice').length,
    };

    const byTypeAmount = {
      supplier_cost: filtered.filter(r => r.type === 'supplier_cost')
        .reduce((sum, r) => sum + Math.abs(getDifferenceAmount(r)), 0),
      payment_channel: filtered.filter(r => r.type === 'payment_channel')
        .reduce((sum, r) => sum + Math.abs(getDifferenceAmount(r)), 0),
      withdrawal: filtered.filter(r => r.type === 'withdrawal')
        .reduce((sum, r) => sum + Math.abs(getDifferenceAmount(r)), 0),
      invoice: filtered.filter(r => r.type === 'invoice')
        .reduce((sum, r) => sum + Math.abs(getDifferenceAmount(r)), 0),
    };

    return {
      totalCount,
      totalAmount,
      byType,
      byTypeAmount,
      filtered,
    };
  }, [differenceReconciliations, searchQuery, filterType, filterDateStart, filterDateEnd]);

  // 分页
  const totalItems = statistics.filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReconciliations = statistics.filtered.slice(startIndex, endIndex);

  // 重置页码当筛选条件变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterDateStart, filterDateEnd]);

  // 获取对账类型标签
  const getTypeLabel = (type: ReconciliationType) => {
    const labels: Record<ReconciliationType, string> = {
      supplier_cost: '供应商成本对账',
      payment_channel: '支付渠道对账',
      withdrawal: '提现对账',
      invoice: '开票对账',
    };
    return labels[type];
  };

  // 获取状态徽章
  const getStatusBadge = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      const config: Record<string, { label: string; className: string }> = {
        difference: { label: '对账差异', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      };
      const { label, className } = config[reconciliation.status] || { label: reconciliation.status, className: '' };
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'payment_channel') {
      const config: Record<string, { label: string; className: string }> = {
        platform_more: { label: '平台多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        channel_more: { label: '渠道多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      };
      const { label, className } = config[reconciliation.status] || { label: reconciliation.status, className: '' };
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'withdrawal') {
      const config: Record<string, { label: string; className: string }> = {
        withdrawal_more: { label: '打款多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        account_more: { label: '账本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      };
      const { label, className } = config[reconciliation.status] || { label: reconciliation.status, className: '' };
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'invoice') {
      const config: Record<string, { label: string; className: string }> = {
        invoice_more: { label: '开票多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        cost_more: { label: '成本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      };
      const { label, className } = config[reconciliation.status] || { label: reconciliation.status, className: '' };
      return <Badge variant="outline" className={className}>{label}</Badge>;
    }
    return null;
  };

  // 获取对账对象显示
  const getReconciliationObject = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.orderId;
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.reconciliationDate;
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.partnerName;
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.reconciliationMonth;
    }
    return '';
  };

  // 获取对账日期/月份显示
  const getReconciliationDate = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.createdAt.split(' ')[0];
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.reconciliationDate;
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.reconciliationMonth;
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.reconciliationMonth;
    }
    return '';
  };

  // 导出报告
  const handleExport = () => {
    toast.success('导出功能开发中...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">对账差异汇总</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              差异总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{statistics.totalCount}</span>
              <span className="text-sm text-gray-500">笔</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">所有有差异的对账记录</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              差异总金额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">
                ¥{statistics.totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">所有差异金额的绝对值总和</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              待处理数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {statistics.filtered.filter(r => {
                  if (r.type === 'supplier_cost') return r.status === 'difference';
                  if (r.type === 'payment_channel') return r.status === 'platform_more' || r.status === 'channel_more';
                  if (r.type === 'withdrawal') return r.status === 'withdrawal_more' || r.status === 'account_more';
                  if (r.type === 'invoice') return r.status === 'invoice_more' || r.status === 'cost_more';
                  return false;
                }).length}
              </span>
              <span className="text-sm text-gray-500">笔</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">未处理的差异记录</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              已处理数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                {statistics.filtered.filter(r => r.status === 'resolved').length}
              </span>
              <span className="text-sm text-gray-500">笔</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">已处理的差异记录</p>
          </CardContent>
        </Card>
      </div>

      {/* 按类型汇总 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              供应商成本对账
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异数量</span>
                <span className="text-lg font-semibold">{statistics.byType.supplier_cost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异金额</span>
                <span className="text-lg font-semibold text-red-600">
                  ¥{statistics.byTypeAmount.supplier_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              支付渠道对账
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异数量</span>
                <span className="text-lg font-semibold">{statistics.byType.payment_channel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异金额</span>
                <span className="text-lg font-semibold text-red-600">
                  ¥{statistics.byTypeAmount.payment_channel.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              提现对账
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异数量</span>
                <span className="text-lg font-semibold">{statistics.byType.withdrawal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异金额</span>
                <span className="text-lg font-semibold text-red-600">
                  ¥{statistics.byTypeAmount.withdrawal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              开票对账
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异数量</span>
                <span className="text-lg font-semibold">{statistics.byType.invoice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">差异金额</span>
                <span className="text-lg font-semibold text-red-600">
                  ¥{statistics.byTypeAmount.invoice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="搜索订单ID、供应商、用户名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-shrink-0"
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex-shrink-0"
              >
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <Label className="w-20 flex-shrink-0 text-gray-700">对账类型</Label>
                  <Select value={filterType} onValueChange={(value) => setFilterType(value as ReconciliationType | 'all')}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="supplier_cost">供应商成本对账</SelectItem>
                      <SelectItem value="payment_channel">支付渠道对账</SelectItem>
                      <SelectItem value="withdrawal">提现对账</SelectItem>
                      <SelectItem value="invoice">开票对账</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-20 flex-shrink-0 text-gray-700">开始日期</Label>
                  <Input
                    type="date"
                    value={filterDateStart}
                    onChange={(e) => setFilterDateStart(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-20 flex-shrink-0 text-gray-700">结束日期</Label>
                  <Input
                    type="date"
                    value={filterDateEnd}
                    onChange={(e) => setFilterDateEnd(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 差异列表 */}
      <Card>
        <CardHeader>
          <CardTitle>差异记录列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-gray-700" style={{ minWidth: '120px' }}>对账类型</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700" style={{ minWidth: '150px' }}>对账对象</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700" style={{ minWidth: '120px' }}>对账日期/月份</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700" style={{ minWidth: '100px' }}>状态</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700" style={{ minWidth: '120px' }}>差异金额</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-700" style={{ minWidth: '100px', position: 'sticky', right: 0, background: 'white', zIndex: 10 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReconciliations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      暂无差异记录
                    </td>
                  </tr>
                ) : (
                  paginatedReconciliations.map((reconciliation) => (
                    <tr key={reconciliation.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{getTypeLabel(reconciliation.type)}</td>
                      <td className="p-3 text-sm font-medium">{getReconciliationObject(reconciliation)}</td>
                      <td className="p-3 text-sm">{getReconciliationDate(reconciliation)}</td>
                      <td className="p-3 text-sm">{getStatusBadge(reconciliation)}</td>
                      <td className={`p-3 text-sm text-right font-medium ${
                        Math.abs(getDifferenceAmount(reconciliation)) > 0 ? 'text-orange-600' : ''
                      }`}>
                        {Math.abs(getDifferenceAmount(reconciliation)) > 0 ? (
                          <span>
                            {getDifferenceAmount(reconciliation) > 0 ? '+' : ''}
                            ¥{getDifferenceAmount(reconciliation).toFixed(2)}
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="p-3 text-sm text-right" style={{ position: 'sticky', right: 0, background: 'white', zIndex: 10 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReconciliationDetail?.(reconciliation)}
                          className="h-8 px-2"
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
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                共 {totalItems} 条记录，第 {currentPage} / {totalPages} 页
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                            className="cursor-pointer"
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
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
  );
}

