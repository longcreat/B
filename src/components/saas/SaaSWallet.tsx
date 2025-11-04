import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Wallet, 
  TrendingUp, 
  Lock, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Transaction {
  id: string;
  type: 'income' | 'withdraw' | 'deduction';
  amount: number;
  description: string;
  relatedOrderNo?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 380,
    description: '订单佣金计入',
    relatedOrderNo: 'ORD20251031001',
    status: 'completed',
    createdAt: '2025-10-31 18:30',
  },
  {
    id: '2',
    type: 'income',
    amount: 570,
    description: '订单佣金计入',
    relatedOrderNo: 'ORD20251030002',
    status: 'completed',
    createdAt: '2025-10-30 20:15',
  },
  {
    id: '3',
    type: 'income',
    amount: 650,
    description: '订单佣金计入',
    relatedOrderNo: 'ORD20251029003',
    status: 'completed',
    createdAt: '2025-10-29 16:45',
  },
  {
    id: '4',
    type: 'withdraw',
    amount: -5000,
    description: '利润提现',
    status: 'completed',
    createdAt: '2025-10-25 10:20',
  },
  {
    id: '5',
    type: 'deduction',
    amount: -200,
    description: '客诉追索扣除',
    relatedOrderNo: 'ORD20251020005',
    status: 'completed',
    createdAt: '2025-10-22 14:30',
  },
];

export function SaaSWallet() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // 账户余额数据
  const availableBalance = 28650; // 可用余额
  const frozenBalance = 1600; // 冻结余额
  const totalProfit = 45280; // 累计总利润

  // 筛选交易记录
  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter === 'all') return true;
    return tx.type === typeFilter;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'withdraw':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      case 'deduction':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'withdraw':
        return 'text-blue-600';
      case 'deduction':
        return 'text-red-600';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      completed: { label: '已完成', variant: 'secondary' as const },
      pending: { label: '处理中', variant: 'default' as const },
      failed: { label: '失败', variant: 'destructive' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleWithdraw = () => {
    toast.info('正在跳转到提现/兑换页面...');
  };

  const exportTransactions = () => {
    toast.success('交易明细导出中...');
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 利润账户总览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <Wallet className="w-4 h-4" />
              可用利润余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-green-600">¥{availableBalance.toLocaleString()}</span>
            </div>
            <p className="text-xs text-green-700">可随时提现或兑换</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Lock className="w-4 h-4" />
              冻结利润
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-orange-600">¥{frozenBalance.toLocaleString()}</span>
            </div>
            <p className="text-xs text-orange-700">待订单完成后解冻</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <TrendingUp className="w-4 h-4" />
              累计总利润
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600">¥{totalProfit.toLocaleString()}</span>
            </div>
            <p className="text-xs text-blue-700">历史累计收益</p>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">利润提取/兑换</h3>
              <p className="text-sm text-purple-700">
                当前可用余额 <span className="font-bold">¥{availableBalance.toLocaleString()}</span>，可随时提现或兑换积分
              </p>
            </div>
            <Button onClick={handleWithdraw} size="lg" className="bg-purple-600 hover:bg-purple-700">
              <DollarSign className="w-4 h-4 mr-2" />
              立即提取
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 利润明细 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>利润明细</CardTitle>
              <CardDescription className="mt-2">
                查看所有利润收入和支出记录
              </CardDescription>
            </div>
            <Button variant="outline" onClick={exportTransactions}>
              <Download className="w-4 h-4 mr-2" />
              导出明细
            </Button>
          </div>

          {/* 筛选器 */}
          <div className="w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="income">收入</SelectItem>
                <SelectItem value="withdraw">提现</SelectItem>
                <SelectItem value="deduction">扣除</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无交易记录</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>关联订单</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(tx.type)}
                        <span className="text-sm">
                          {tx.type === 'income' && '收入'}
                          {tx.type === 'withdraw' && '提现'}
                          {tx.type === 'deduction' && '扣除'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>
                      {tx.relatedOrderNo ? (
                        <span className="font-mono text-xs">{tx.relatedOrderNo}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getTransactionColor(tx.type)}`}>
                        {tx.amount > 0 ? '+' : ''}¥{Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{tx.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 说明卡片 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-3">财务说明</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[100px]">可用余额：</span>
              <span>已结算的利润，可随时提现或兑换积分</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[100px]">冻结余额：</span>
              <span>订单进行中的预估利润，订单完成后自动解冻</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[100px]">结算周期：</span>
              <span>订单完成后次月5日结算到可用余额</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-[100px]">提现方式：</span>
              <span>个人/博主用户可兑换积分，企业用户可提现到对公账户</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
