import React, { useState, useEffect } from 'react';
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
  getMockReconciliations, 
  type Reconciliation, 
  type ReconciliationType,
  type ReconciliationStatus,
} from '../data/mockReconciliations';

export { type Reconciliation };

interface ReconciliationManagementProps {
  onViewReconciliationDetail?: (reconciliation: Reconciliation) => void;
}

export function ReconciliationManagement({ onViewReconciliationDetail }: ReconciliationManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 筛选条件
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // 使用 mock 数据
  const reconciliations: Reconciliation[] = getMockReconciliations();

  // 过滤数据
  const getFilteredReconciliations = () => {
    let filtered = reconciliations;

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        if (r.type === 'supplier_cost') {
          return r.orderId.toLowerCase().includes(query) || 
                 r.supplierName.toLowerCase().includes(query) ||
                 (r.supplierBillNo && r.supplierBillNo.toLowerCase().includes(query));
        } else if (r.type === 'payment_channel') {
          return r.reconciliationDate.includes(query);
        } else if (r.type === 'withdrawal') {
          return r.partnerName.toLowerCase().includes(query) ||
                 r.partnerId.toLowerCase().includes(query) ||
                 r.reconciliationMonth.includes(query);
        } else if (r.type === 'invoice') {
          return r.reconciliationMonth.includes(query);
        }
        return false;
      });
    }

    // 筛选条件
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => {
        // 状态筛选需要匹配对应的状态值
        return r.status === filterStatus;
      });
    }
    if (filterDateStart) {
      filtered = filtered.filter(r => {
        let date: string;
        if (r.type === 'supplier_cost') {
          date = r.createdAt;
        } else if (r.type === 'payment_channel') {
          date = r.reconciliationDate;
        } else if (r.type === 'withdrawal') {
          date = r.reconciliationMonth;
        } else if (r.type === 'invoice') {
          date = r.reconciliationMonth;
        } else {
          // 所有类型都有 createdAt，但为了类型安全，使用默认值
          date = 'supplier_cost' in r ? r.createdAt : 'payment_channel' in r ? r.createdAt : 'withdrawal' in r ? r.createdAt : 'invoice' in r ? r.createdAt : '';
        }
        return date >= filterDateStart;
      });
    }
    if (filterDateEnd) {
      filtered = filtered.filter(r => {
        let date: string;
        if (r.type === 'supplier_cost') {
          date = r.createdAt;
        } else if (r.type === 'payment_channel') {
          date = r.reconciliationDate;
        } else if (r.type === 'withdrawal') {
          date = r.reconciliationMonth;
        } else if (r.type === 'invoice') {
          date = r.reconciliationMonth;
        } else {
          // 所有类型都有 createdAt，但为了类型安全，使用默认值
          date = 'supplier_cost' in r ? r.createdAt : 'payment_channel' in r ? r.createdAt : 'withdrawal' in r ? r.createdAt : 'invoice' in r ? r.createdAt : '';
        }
        return date <= filterDateEnd;
      });
    }

    return filtered;
  };

  const filteredReconciliations = getFilteredReconciliations();

  // 获取类型标签
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
        pending: { label: '未对账', className: 'bg-gray-50 text-gray-700 border-gray-300' },
        reconciling: { label: '对账中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
        reconciled: { label: '已对账', className: 'bg-green-50 text-green-700 border-green-300' },
        difference: { label: '对账差异', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.pending;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'payment_channel') {
      const config: Record<string, { label: string; className: string }> = {
        reconciling: { label: '对账中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        platform_more: { label: '平台多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        channel_more: { label: '渠道多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.reconciling;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'withdrawal') {
      const config: Record<string, { label: string; className: string }> = {
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        withdrawal_more: { label: '打款多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        account_more: { label: '账本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.balanced;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'invoice') {
      const config: Record<string, { label: string; className: string }> = {
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        invoice_more: { label: '开票多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        cost_more: { label: '成本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.balanced;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    }
    return null;
  };

  // 获取对账对象显示
  const getReconciliationObject = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.orderId;
    } else if (reconciliation.type === 'payment_channel') {
      const channelLabels: Record<string, string> = {
        wechat: '微信支付',
        alipay: '支付宝',
        bank: '银行',
      };
      return `${reconciliation.reconciliationDate} (${channelLabels[reconciliation.channel]})`;
    } else if (reconciliation.type === 'withdrawal') {
      return `${reconciliation.partnerName} (${reconciliation.reconciliationMonth})`;
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.reconciliationMonth;
    }
    return '-';
  };

  // 获取差异金额显示
  const getDifferenceAmount = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.difference !== 0 ? `¥${reconciliation.difference.toFixed(2)}` : '-';
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.differenceAmount !== 0 ? `¥${reconciliation.differenceAmount.toFixed(2)}` : '-';
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.differenceAmount !== 0 ? `¥${reconciliation.differenceAmount.toFixed(2)}` : '-';
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.differenceAmount !== 0 ? `¥${reconciliation.differenceAmount.toFixed(2)}` : '-';
    }
    return '-';
  };

  const handleViewDetail = (reconciliation: Reconciliation) => {
    if (onViewReconciliationDetail) {
      onViewReconciliationDetail(reconciliation);
    }
  };

  const handleExport = () => {
    toast.success('对账报告导出功能开发中...');
  };

  const clearAllFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setFilterDateStart('');
    setFilterDateEnd('');
  };

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 计算分页数据
  const totalItems = filteredReconciliations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReconciliations = filteredReconciliations.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterStatus, filterDateStart, filterDateEnd]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* 面包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>对账管理</BreadcrumbPage>
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
                  placeholder="搜索订单ID、供应商、用户..."
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
            
            {/* 筛选条件 */}
            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">对账类型</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
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
                    <Label className="w-20 flex-shrink-0 text-gray-700">对账状态</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        {/* 根据对账类型显示不同的状态选项 */}
                        {filterType === 'all' || filterType === 'supplier_cost' ? (
                          <>
                            <SelectItem value="pending">未对账</SelectItem>
                            <SelectItem value="reconciling">对账中</SelectItem>
                            <SelectItem value="reconciled">已对账</SelectItem>
                            <SelectItem value="difference">对账差异</SelectItem>
                            <SelectItem value="resolved">已处理</SelectItem>
                          </>
                        ) : null}
                        {filterType === 'all' || filterType === 'payment_channel' ? (
                          <>
                            <SelectItem value="reconciling">对账中</SelectItem>
                            <SelectItem value="balanced">已对平</SelectItem>
                            <SelectItem value="platform_more">平台多</SelectItem>
                            <SelectItem value="channel_more">渠道多</SelectItem>
                            <SelectItem value="resolved">已处理</SelectItem>
                          </>
                        ) : null}
                        {filterType === 'all' || filterType === 'withdrawal' ? (
                          <>
                            <SelectItem value="balanced">已对平</SelectItem>
                            <SelectItem value="withdrawal_more">打款多</SelectItem>
                            <SelectItem value="account_more">账本多</SelectItem>
                            <SelectItem value="resolved">已处理</SelectItem>
                          </>
                        ) : null}
                        {filterType === 'all' || filterType === 'invoice' ? (
                          <>
                            <SelectItem value="balanced">已对平</SelectItem>
                            <SelectItem value="invoice_more">开票多</SelectItem>
                            <SelectItem value="cost_more">成本多</SelectItem>
                            <SelectItem value="resolved">已处理</SelectItem>
                          </>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">时间范围</Label>
                    <Input
                      type="date"
                      value={filterDateStart}
                      onChange={(e) => setFilterDateStart(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-gray-500">至</span>
                    <Input
                      type="date"
                      value={filterDateEnd}
                      onChange={(e) => setFilterDateEnd(e.target.value)}
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

        {/* 对账列表 */}
        <Card>
          <CardHeader>
            <CardTitle>对账列表</CardTitle>
          </CardHeader>
          <CardContent>
            <style>{`
              .reconciliation-table-container {
                position: relative;
              }
              .reconciliation-table-container table {
                min-width: 1200px !important;
                width: max-content;
              }
              .reconciliation-table-container table th:last-child,
              .reconciliation-table-container table td:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .reconciliation-table-container table th:last-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto reconciliation-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>对账类型</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>对账对象</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>对账日期/月份</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>对账状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>差异金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '100px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReconciliations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        暂无对账数据
                      </td>
                    </tr>
                  ) : (
                    paginatedReconciliations.map((reconciliation) => (
                      <tr key={reconciliation.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{getTypeLabel(reconciliation.type)}</td>
                        <td className="p-3 text-sm">{getReconciliationObject(reconciliation)}</td>
                        <td className="p-3 text-sm">
                          {reconciliation.type === 'supplier_cost' 
                            ? reconciliation.createdAt.split(' ')[0]
                            : reconciliation.type === 'payment_channel'
                            ? reconciliation.reconciliationDate
                            : reconciliation.type === 'withdrawal'
                            ? reconciliation.reconciliationMonth
                            : reconciliation.type === 'invoice'
                            ? reconciliation.reconciliationMonth
                            : reconciliation.createdAt.split(' ')[0]}
                        </td>
                        <td className="p-3 text-sm">{getStatusBadge(reconciliation)}</td>
                        <td className={`p-3 text-sm ${reconciliation.type === 'supplier_cost' && reconciliation.status === 'difference' ? 'text-orange-600 font-medium' : ''}`}>
                          {getDifferenceAmount(reconciliation)}
                        </td>
                        <td className="p-3 text-sm sticky right-0 bg-white z-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(reconciliation)}
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

