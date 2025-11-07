import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import { CreditCard, DollarSign, Calendar, Download, Wallet, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

interface SettlementRecord {
  id: string;
  month: string;
  amount: number;
  status: 'pending' | 'completed';
  settledAt?: string;
}

const settlementRecords: SettlementRecord[] = [
  { id: '1', month: '2025-09', amount: 12580, status: 'completed', settledAt: '2025-10-05' },
  { id: '2', month: '2025-10', amount: 8560, status: 'pending' },
];

export function AffiliateSettlement() {
  const [records] = useState<SettlementRecord[]>(settlementRecords);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const pendingCommission = records
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const settledCommission = records
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const requestWithdrawal = () => {
    if (pendingCommission === 0) {
      toast.error('暂无可提现金额');
      return;
    }
    toast.success('提现申请已提交，预计3个工作日内到账');
  };

  const downloadStatement = (month: string) => {
    toast.success(`正在下载${month}的结算单...`);
  };

  const getStatusBadge = (status: SettlementRecord['status']) => {
    if (status === 'completed') {
      return <Badge variant="secondary">已结算</Badge>;
    }
    return <Badge variant="default">待结算</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>结算管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 佣金概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              待结算佣金
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ¥{pendingCommission.toLocaleString()}
              </span>
            </div>
            <Button onClick={requestWithdrawal} className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              申请提现
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              每月5日自动结算上月佣金
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              累计已结算
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-green-600">
                ¥{settledCommission.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>结算次数</span>
                <span className="font-medium">{records.filter(r => r.status === 'completed').length} 次</span>
              </div>
              <div className="flex justify-between">
                <span>平均每月</span>
                <span className="font-medium">
                  ¥{(settledCommission / Math.max(records.filter(r => r.status === 'completed').length, 1)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 结算记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            结算记录
          </CardTitle>
          <CardDescription>
            查看每月的佣金结算明细
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无结算记录</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>结算月份</TableHead>
                  <TableHead>佣金金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>结算时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.month}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      ¥{record.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-gray-600">
                      {record.settledAt || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadStatement(record.month)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载账单
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 结算说明 - 可折叠 */}
      <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">结算规则</span>
                </div>
                {isRulesOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                1
              </span>
              <div>
                <p className="font-medium mb-1">结算周期</p>
                <p className="text-blue-700">每月5日自动结算上月的佣金收益</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                2
              </span>
              <div>
                <p className="font-medium mb-1">佣金计算</p>
                <p className="text-blue-700">订单完成后，按订单金额的8%计算佣金</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                3
              </span>
              <div>
                <p className="font-medium mb-1">提现方式</p>
                <p className="text-blue-700">支持提现到银行卡或支付宝账户，3个工作日内到账</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                4
              </span>
              <div>
                <p className="font-medium mb-1">最低提现</p>
                <p className="text-blue-700">单次提现金额不低于100元</p>
              </div>
            </div>
          </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 收款账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle>收款账户</CardTitle>
          <CardDescription>
            佣金将结算到以下账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">账户类型</span>
              <span className="font-medium">工商银行</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">开户行</span>
              <span className="font-medium">北京分行</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">银行卡号</span>
              <span className="font-mono">6222 **** **** 1234</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">户名</span>
              <span className="font-medium">张三</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            修改收款账户
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
