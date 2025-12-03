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
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

// 大B结算明细数据类型
export interface BigBSettlement {
  settlementId: string;
  orderId: string;
  bigbName: string;
  businessModel: 'saas' | 'mcp';
  orderAmount: number;
  refundAmount: number;
  settlementAmount: number;
  settlementStatus: 'pending' | 'ready' | 'settled' | 'cancelled';
  settlementTime: string;
}

interface BigBSettlementListProps {
  onViewDetail?: (settlement: BigBSettlement) => void;
}

// Mock数据生成
const generateMockData = (): BigBSettlement[] => {
  const data: BigBSettlement[] = [];
  const bigbNames = ['张三的旅游工作室', '李四旅行社', '王五旅游', '赵六国际旅行', '钱七旅游公司'];
  const statuses: BigBSettlement['settlementStatus'][] = ['pending', 'ready', 'settled', 'cancelled'];
  const models: BigBSettlement['businessModel'][] = ['saas', 'mcp'];
  
  for (let i = 1; i <= 50; i++) {
    data.push({
      settlementId: `SETTLE-B-${String(i).padStart(6, '0')}`,
      orderId: `ORD-${String(i).padStart(6, '0')}`,
      bigbName: bigbNames[i % bigbNames.length],
      businessModel: models[i % models.length],
      orderAmount: 1000 + Math.random() * 2000,
      refundAmount: Math.random() > 0.7 ? Math.random() * 500 : 0,
      settlementAmount: 500 + Math.random() * 1000,
      settlementStatus: statuses[i % statuses.length],
      settlementTime: new Date(2025, 0, Math.floor(i / 2) + 1, 10, 30).toISOString().replace('T', ' ').substring(0, 19),
    });
  }
  return data;
};

export function BigBSettlementList({ onViewDetail }: BigBSettlementListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<string>('all');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterTimeStart, setFilterTimeStart] = useState('');
  const [filterTimeEnd, setFilterTimeEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const allSettlements = useMemo(() => generateMockData(), []);

  // 筛选逻辑
  const filteredSettlements = useMemo(() => {
    return allSettlements.filter((settlement) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!settlement.settlementId.toLowerCase().includes(query) &&
            !settlement.orderId.toLowerCase().includes(query) &&
            !settlement.bigbName.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (filterStatus !== 'all' && settlement.settlementStatus !== filterStatus) {
        return false;
      }

      if (filterBusinessModel !== 'all' && settlement.businessModel !== filterBusinessModel) {
        return false;
      }

      if (filterAmountMin && settlement.settlementAmount < parseFloat(filterAmountMin)) {
        return false;
      }
      if (filterAmountMax && settlement.settlementAmount > parseFloat(filterAmountMax)) {
        return false;
      }

      if (filterTimeStart && settlement.settlementTime < filterTimeStart) {
        return false;
      }
      if (filterTimeEnd && settlement.settlementTime > filterTimeEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [allSettlements, searchQuery, filterStatus, filterBusinessModel, filterAmountMin, filterAmountMax, filterTimeStart, filterTimeEnd]);

  // 统计信息
  const statistics = useMemo(() => {
    const totalAmount = filteredSettlements.reduce((sum, s) => sum + s.settlementAmount, 0);
    const totalCount = filteredSettlements.length;
    const pendingAmount = filteredSettlements.filter(s => s.settlementStatus === 'pending').reduce((sum, s) => sum + s.settlementAmount, 0);
    const settledAmount = filteredSettlements.filter(s => s.settlementStatus === 'settled').reduce((sum, s) => sum + s.settlementAmount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayAmount = filteredSettlements.filter(s => s.settlementTime.startsWith(today)).reduce((sum, s) => sum + s.settlementAmount, 0);

    return { totalAmount, totalCount, pendingAmount, settledAmount, todayAmount };
  }, [filteredSettlements]);

  // 分页
  const totalItems = filteredSettlements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSettlements = filteredSettlements.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterBusinessModel, filterAmountMin, filterAmountMax, filterTimeStart, filterTimeEnd]);

  const getStatusBadge = (status: BigBSettlement['settlementStatus']) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      ready: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled: { label: '已取消', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getBusinessModelLabel = (model: BigBSettlement['businessModel']) => {
    return model === 'saas' ? 'SaaS' : 'MCP';
  };

  return (
    <div className="space-y-6">

        {/* 统计信息 */}
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
                <span className="text-lg font-bold text-gray-900">{statistics.totalCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">待结算金额：</span>
                <span className="text-lg font-bold text-yellow-600">
                  ¥{statistics.pendingAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">已结算金额：</span>
                <span className="text-lg font-bold text-green-600">
                  ¥{statistics.settledAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  placeholder="搜索结算记录ID、订单号、大B名称"
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
                setFilterStatus('all');
                setFilterBusinessModel('all');
                setFilterAmountMin('');
                setFilterAmountMax('');
                setFilterTimeStart('');
                setFilterTimeEnd('');
              }}>
                重置
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('导出功能开发中')}>
                <Download className="w-4 h-4 mr-2" />
                批量导出
              </Button>
            </div>

            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算状态</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending">待结算</SelectItem>
                        <SelectItem value="ready">可结算</SelectItem>
                        <SelectItem value="settled">已结算</SelectItem>
                        <SelectItem value="cancelled">已取消</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">业务模式</Label>
                    <Select value={filterBusinessModel} onValueChange={setFilterBusinessModel}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部模式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部模式</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="mcp">MCP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">开始日期</Label>
                    <Input
                      type="date"
                      value={filterTimeStart}
                      onChange={(e) => setFilterTimeStart(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结束日期</Label>
                    <Input
                      type="date"
                      value={filterTimeEnd}
                      onChange={(e) => setFilterTimeEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 列表 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算记录ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">大B名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">订单金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">退款金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">结算时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSettlements.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    paginatedSettlements.map((settlement) => (
                      <tr key={settlement.settlementId} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{settlement.settlementId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{settlement.orderId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{settlement.bigbName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{getBusinessModelLabel(settlement.businessModel)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ¥{settlement.orderAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {settlement.refundAmount > 0 ? `¥${settlement.refundAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                          ¥{settlement.settlementAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-sm">{getStatusBadge(settlement.settlementStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{settlement.settlementTime}</td>
                        <td className="px-4 py-3 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetail?.(settlement)}
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
  );
}
