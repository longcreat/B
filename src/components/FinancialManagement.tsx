import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Search,
  Download,
  Filter
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { getMockTransactions, type Transaction } from '../data/mockTransactions';

export { type Transaction };

export function FinancialManagement() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 使用 mock 数据
  const transactions: Transaction[] = getMockTransactions();

  // 统计数据
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdraw = transactions
    .filter(t => t.type === 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const getTypeBadge = (type: string) => {
    const config = {
      income: { label: '收入', className: 'bg-green-50 text-green-700 border-green-300' },
      withdraw: { label: '提现', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      refund: { label: '退款', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[type as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: '处理中', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '失败', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-600' : type === 'refund' ? 'text-orange-600' : 'text-blue-600';
    return <span className={color}>{prefix}¥{amount.toLocaleString()}</span>;
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.userName.includes(searchQuery) || 
                         txn.userEmail.includes(searchQuery) ||
                         txn.id.includes(searchQuery);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && txn.status === 'pending';
    if (activeTab === 'completed') return matchesSearch && txn.status === 'completed';
    return matchesSearch;
  });

  // 计算分页数据
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总收入</p>
                <p className="text-2xl mt-1 text-green-600">¥{totalIncome.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总提现</p>
                <p className="text-2xl mt-1 text-blue-600">¥{totalWithdraw.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待处理金额</p>
                <p className="text-2xl mt-1 text-yellow-600">¥{pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">本月交易</p>
                <p className="text-2xl mt-1">{transactions.filter(t => t.createdAt.startsWith('2025-10')).length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 交易列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>交易记录</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索交易ID、用户名或邮箱"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                全部 ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                待处理 ({transactions.filter(t => t.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                已完成 ({transactions.filter(t => t.status === 'completed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>交易ID</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>业务模式</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                          暂无交易记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                          <TableCell>
                            <div>
                              <p>{txn.userName}</p>
                              <p className="text-sm text-gray-500">{txn.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(txn.type)}</TableCell>
                          <TableCell>{txn.businessModel}</TableCell>
                          <TableCell>{formatAmount(txn.amount, txn.type)}</TableCell>
                          <TableCell>{getStatusBadge(txn.status)}</TableCell>
                          <TableCell className="text-sm text-gray-600">{txn.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
