import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Wallet, 
  Lock, 
  TrendingUp, 
  Gift, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  CreditCard,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Transaction {
  id: string;
  type: 'income' | 'exchange' | 'deduction';
  amount: number;
  description: string;
  relatedOrderNo?: string;
  status: 'completed' | 'pending';
  createdAt: string;
  balance: number;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 218,
    description: '订单积分计入',
    relatedOrderNo: 'ORD****1001',
    status: 'completed',
    createdAt: '2025-10-31 18:30',
    balance: 28650,
  },
  {
    id: '2',
    type: 'income',
    amount: 342,
    description: '订单积分计入',
    relatedOrderNo: 'ORD****1002',
    status: 'completed',
    createdAt: '2025-10-30 20:15',
    balance: 28432,
  },
  {
    id: '3',
    type: 'exchange',
    amount: -5000,
    description: '积分兑换 - 京东卡500元',
    status: 'completed',
    createdAt: '2025-10-25 10:20',
    balance: 28090,
  },
  {
    id: '4',
    type: 'income',
    amount: 415,
    description: '订单积分计入',
    relatedOrderNo: 'ORD****1003',
    status: 'completed',
    createdAt: '2025-10-29 16:45',
    balance: 33090,
  },
  {
    id: '5',
    type: 'deduction',
    amount: -265,
    description: '客诉追索扣除',
    relatedOrderNo: 'ORD****1005',
    status: 'completed',
    createdAt: '2025-10-27 14:30',
    balance: 32675,
  },
];

export function AffiliatePoints() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isPointsInfoOpen, setIsPointsInfoOpen] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: '工商银行',
    branchName: '北京分行',
    accountNumber: '6222 **** **** 1234',
    accountName: '张三',
  });
  const [isEditingBank, setIsEditingBank] = useState(false);

  // 积分账户数据
  const availablePoints = 28650; // 可用积分
  const frozenPoints = 1600; // 冻结积分
  const totalPoints = 45280; // 累计总积分
  const debtPoints = 0; // 积分欠款

  // 筛选交易记录
  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter === 'all') return true;
    return tx.type === typeFilter;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'exchange':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      case 'deduction':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'exchange':
        return 'text-blue-600';
      case 'deduction':
        return 'text-red-600';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      completed: { label: '已完成', variant: 'secondary' as const },
      pending: { label: '处理中', variant: 'default' as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const goToPointsMall = () => {
    toast.info('正在跳转到积分商城...');
  };

  const exportTransactions = () => {
    toast.success('流水明细导出中...');
  };

  const saveBankInfo = () => {
    setIsEditingBank(false);
    toast.success('收款账户信息已保存');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>积分管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 账户总览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <Wallet className="w-4 h-4" />
              可用积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-green-600">{availablePoints.toLocaleString()}</span>
              <span className="text-sm text-green-600">分</span>
            </div>
            <p className="text-xs text-green-700">可立即兑换</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Lock className="w-4 h-4" />
              冻结积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-orange-600">{frozenPoints.toLocaleString()}</span>
              <span className="text-sm text-orange-600">分</span>
            </div>
            <p className="text-xs text-orange-700">待过安全期</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <TrendingUp className="w-4 h-4" />
              累计总积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600">{totalPoints.toLocaleString()}</span>
              <span className="text-sm text-blue-600">分</span>
            </div>
            <p className="text-xs text-blue-700">历史累计收益</p>
          </CardContent>
        </Card>

        <Card className={`border-2 ${debtPoints > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm flex items-center gap-2 ${debtPoints > 0 ? 'text-red-700' : 'text-gray-700'}`}>
              <AlertCircle className="w-4 h-4" />
              积分欠款
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-bold ${debtPoints > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {debtPoints.toLocaleString()}
              </span>
              <span className={`text-sm ${debtPoints > 0 ? 'text-red-600' : 'text-gray-600'}`}>分</span>
            </div>
            <p className={`text-xs ${debtPoints > 0 ? 'text-red-700' : 'text-gray-500'}`}>
              {debtPoints > 0 ? '需补偿的积分' : '无欠款'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 积分兑换 CTA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-1 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                立即兑换您的积分
              </h3>
              <p className="text-sm text-purple-700">
                当前可用积分 <span className="font-bold text-lg">{availablePoints.toLocaleString()}</span> 分，可兑换京东卡、话费充值、酒店券等
              </p>
            </div>
            <Button 
              onClick={goToPointsMall} 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shrink-0"
            >
              <Gift className="w-4 h-4 mr-2" />
              前往积分商城
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 利润流水明细 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>积分流水明细</CardTitle>
              <CardDescription className="mt-2">
                完整的账户流水记录，包含所有积分变动
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
                <SelectItem value="exchange">兑换</SelectItem>
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
                  <TableHead>变动数量</TableHead>
                  <TableHead>当前余额</TableHead>
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
                          {tx.type === 'exchange' && '兑换'}
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
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tx.balance.toLocaleString()}
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

      {/* 收款账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            收款账户信息
          </CardTitle>
          <CardDescription className="mt-2">
            此账户信息将用于通过我们的合作灵活用工平台为您进行合规的现金结算（若适用）。大部分收益将通过积分商城兑换。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingBank ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>银行名称</Label>
                  <Input
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>开户行</Label>
                  <Input
                    value={bankInfo.branchName}
                    onChange={(e) => setBankInfo({ ...bankInfo, branchName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>银行卡号</Label>
                  <Input
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>户名</Label>
                  <Input
                    value={bankInfo.accountName}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveBankInfo}>保存</Button>
                <Button variant="outline" onClick={() => setIsEditingBank(false)}>取消</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">银行名称</span>
                  <span className="font-medium">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">开户行</span>
                  <span className="font-medium">{bankInfo.branchName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">银行卡号</span>
                  <span className="font-mono">{bankInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">户名</span>
                  <span className="font-medium">{bankInfo.accountName}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setIsEditingBank(true)}>
                修改收款账户
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* 积分说明 - 可折叠 */}
      <Collapsible open={isPointsInfoOpen} onOpenChange={setIsPointsInfoOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">积分说明</span>
                </div>
                {isPointsInfoOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">可用积分：</span>
                  <span>已结算的积分，可立即在积分商城兑换商品或服务</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">冻结积分：</span>
                  <span>订单进行中的预估积分，客人离店后7-15天安全期内自动解冻</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">积分欠款：</span>
                  <span>因客诉追索等原因产生的负积分，将从后续收益中扣除</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">兑换方式：</span>
                  <span>积分可兑换京东卡、话费充值、酒店券等，部分情况下可通过灵活用工平台合规提现</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
