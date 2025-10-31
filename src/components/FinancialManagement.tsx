import { useState } from 'react';
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

interface Transaction {
  id: string;
  type: 'income' | 'withdraw' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  userName: string;
  userEmail: string;
  businessModel: string;
  createdAt: string;
  completedAt?: string;
  description: string;
}

export function FinancialManagement() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟交易数据
  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'income',
      amount: 15680,
      status: 'completed',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      businessModel: 'MCP',
      createdAt: '2025-10-30 14:30:00',
      completedAt: '2025-10-30 14:31:00',
      description: 'API调用费用',
    },
    {
      id: 'TXN-002',
      type: 'withdraw',
      amount: 5000,
      status: 'pending',
      userName: '李四',
      userEmail: 'lisi@example.com',
      businessModel: '联盟推广',
      createdAt: '2025-10-31 09:15:00',
      description: '佣金提现',
    },
    {
      id: 'TXN-003',
      type: 'income',
      amount: 28900,
      status: 'completed',
      userName: '王五科技',
      userEmail: 'wangwu@example.com',
      businessModel: '品牌预订站',
      createdAt: '2025-10-29 16:20:00',
      completedAt: '2025-10-29 16:22:00',
      description: 'SaaS订阅年费',
    },
    {
      id: 'TXN-004',
      type: 'refund',
      amount: 3500,
      status: 'completed',
      userName: '赵六',
      userEmail: 'zhaoliu@example.com',
      businessModel: 'MCP',
      createdAt: '2025-10-28 11:45:00',
      completedAt: '2025-10-28 11:50:00',
      description: '服务退款',
    },
    {
      id: 'TXN-005',
      type: 'withdraw',
      amount: 12000,
      status: 'failed',
      userName: '钱七',
      userEmail: 'qianqi@example.com',
      businessModel: '联盟推广',
      createdAt: '2025-10-27 10:00:00',
      completedAt: '2025-10-27 10:05:00',
      description: '佣金提现（银行卡信息错误）',
    },
  ];

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
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                          暂无交易记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((txn) => (
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
