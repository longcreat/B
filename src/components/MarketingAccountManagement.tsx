import React, { useMemo, useState } from 'react';
import { Wallet, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface MarketingAccountRow {
  id: string;
  partyType: 'platform' | 'bigB';
  name: string;
  currentBalance: number;
  frozenMarketingAmount?: number;
  usedMarketingAmount: number;
  status: 'normal' | 'warning';
  remark?: string;
  businessMode?: 'mcp' | 'paas_white_label';
  lastUpdated?: string;
}

interface PlatformTransaction {
  id: string;
  time: string;
  type: 'recharge' | 'campaign' | 'refund' | 'adjustment';
  direction: 'in' | 'out';
  amount: number;
  balanceAfter: number;
  relatedObject: string;
  operator: string;
  remark?: string;
  isManual?: boolean;
}

const formatDateTime = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

type MarketingView = 'overview' | 'platform-detail' | 'bigb-list';

export function MarketingAccountManagement() {
  const [view, setView] = useState<MarketingView>('overview');
  const accounts: MarketingAccountRow[] = useMemo(
    () => [
      {
        id: 'MA-PLATFORM',
        partyType: 'platform',
        name: '平台营销账户',
        currentBalance: 800000,
        frozenMarketingAmount: 50000,
        usedMarketingAmount: 200000,
        status: 'normal',
        remark: '平台自有营销预算，用于平台级活动',
        lastUpdated: '2024-01-20 10:30:00',
      },
      {
        id: 'MA-BIGB-A',
        partyType: 'bigB',
        name: '大B A 联合营销账户',
        currentBalance: 120000,
        frozenMarketingAmount: 20000,
        usedMarketingAmount: 80000,
        status: 'normal',
        remark: '用于大B A 联合补贴活动',
        businessMode: 'mcp',
        lastUpdated: '2024-01-19 09:15:00',
      },
      {
        id: 'MA-BIGB-B',
        partyType: 'bigB',
        name: '大B B 联合营销账户',
        currentBalance: 15000,
        frozenMarketingAmount: 5000,
        usedMarketingAmount: 90000,
        status: 'warning',
        remark: '余额接近用尽，建议提醒充值',
        businessMode: 'mcp',
        lastUpdated: '2024-01-19 08:45:00',
      },
    ],
    []
  );

  const formatCurrency = (value: number) =>
    `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;

  const getAccountTotalAmount = (account: MarketingAccountRow) =>
    account.currentBalance + (account.frozenMarketingAmount ?? 0) + account.usedMarketingAmount;

  const platformAccount =
    accounts.find((item) => item.partyType === 'platform') ?? accounts[0];
  const bigBAccounts = accounts.filter((item) => item.partyType === 'bigB');

  const [platformBalance, setPlatformBalance] = useState(() => ({
    currentBalance: platformAccount.currentBalance,
    frozenMarketingAmount: platformAccount.frozenMarketingAmount ?? 0,
    usedMarketingAmount: platformAccount.usedMarketingAmount,
  }));

  const bigBWarningCount = bigBAccounts.filter((item) => item.status === 'warning').length;

  const totalMarketingAmount =
    platformBalance.currentBalance +
    platformBalance.frozenMarketingAmount +
    platformBalance.usedMarketingAmount;

  const [platformSearch, setPlatformSearch] = useState('');
  const [platformTypeFilter, setPlatformTypeFilter] =
    useState<'all' | 'recharge' | 'campaign' | 'refund' | 'adjustment'>('all');
  const [platformDateStart, setPlatformDateStart] = useState('');
  const [platformDateEnd, setPlatformDateEnd] = useState('');
  const [platformOnlyManual, setPlatformOnlyManual] = useState(false);

  const [bigBSearch, setBigBSearch] = useState('');
  const [bigBBusinessModeFilter, setBigBBusinessModeFilter] =
    useState<'all' | 'mcp' | 'paas_white_label'>('all');
  const [bigBStatusFilter, setBigBStatusFilter] =
    useState<'all' | 'normal' | 'warning'>('all');
  const [bigBOnlyWarning, setBigBOnlyWarning] = useState(false);
  const [bigBDetailOpen, setBigBDetailOpen] = useState(false);
  const [selectedBigB, setSelectedBigB] = useState<MarketingAccountRow | null>(null);

  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const [riskLowBalanceThreshold, setRiskLowBalanceThreshold] = useState('50000');
  const [riskAutoFreeze, setRiskAutoFreeze] = useState(true);

  const [fundDialogType, setFundDialogType] = useState<'deposit' | 'withdraw' | null>(
    null
  );
  const [fundChannel, setFundChannel] = useState<'platformAccount' | 'bankCard'>(
    'platformAccount'
  );
  const [fundAmount, setFundAmount] = useState('');
  const [fundRemark, setFundRemark] = useState('');

  const initialPlatformTransactions: PlatformTransaction[] = useMemo(
    () => [
      {
        id: 'TX-20240120001',
        time: '2024-01-20 09:00:00',
        type: 'recharge',
        direction: 'in',
        amount: 200000,
        balanceAfter: 800000,
        relatedObject: '对公账户充值',
        operator: '财务-张三',
        remark: '年度营销预算充值',
      },
      {
        id: 'TX-20240119001',
        time: '2024-01-19 18:20:00',
        type: 'campaign',
        direction: 'out',
        amount: 50000,
        balanceAfter: 620000,
        relatedObject: '平台新客拉新活动',
        operator: '运营-李四',
        remark: '活动投放消耗',
      },
      {
        id: 'TX-20240118001',
        time: '2024-01-18 14:10:00',
        type: 'refund',
        direction: 'out',
        amount: 8000,
        balanceAfter: 670000,
        relatedObject: '订单退款对应补贴回退',
        operator: '系统',
        remark: '自动冲回退款对应补贴',
      },
      {
        id: 'TX-20240117001',
        time: '2024-01-17 11:30:00',
        type: 'adjustment',
        direction: 'in',
        amount: 3000,
        balanceAfter: 678000,
        relatedObject: '历史账务核对调整',
        operator: '财务-王五',
        remark: '人工调账，补记历史优惠',
        isManual: true,
      },
    ],
    []
  );

  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransaction[]>(
    initialPlatformTransactions
  );

  const filteredPlatformTransactions = platformTransactions.filter((tx) => {
    const matchesSearch =
      !platformSearch ||
      tx.id.includes(platformSearch) ||
      tx.relatedObject.includes(platformSearch);
    const matchesType =
      platformTypeFilter === 'all' || tx.type === platformTypeFilter;
    const matchesManual = !platformOnlyManual || tx.isManual;
    const matchesStart =
      !platformDateStart || tx.time >= `${platformDateStart} 00:00:00`;
    const matchesEnd =
      !platformDateEnd || tx.time <= `${platformDateEnd} 23:59:59`;
    return matchesSearch && matchesType && matchesManual && matchesStart && matchesEnd;
  });

  const platformIncomeTotal = filteredPlatformTransactions.reduce(
    (sum, tx) => (tx.direction === 'in' ? sum + tx.amount : sum),
    0
  );
  const platformOutcomeTotal = filteredPlatformTransactions.reduce(
    (sum, tx) => (tx.direction === 'out' ? sum + tx.amount : sum),
    0
  );
  const platformNetChange = platformIncomeTotal - platformOutcomeTotal;

  const filteredBigBAccounts = bigBAccounts.filter((account) => {
    const matchesSearch =
      !bigBSearch ||
      account.name.includes(bigBSearch) ||
      account.id.includes(bigBSearch);
    const matchesMode =
      bigBBusinessModeFilter === 'all' ||
      account.businessMode === bigBBusinessModeFilter;
    const matchesStatus =
      bigBStatusFilter === 'all' || account.status === bigBStatusFilter;
    const matchesWarning = !bigBOnlyWarning || account.status === 'warning';
    return matchesSearch && matchesMode && matchesStatus && matchesWarning;
  });

  const renderPartyType = (type: MarketingAccountRow['partyType']) => {
    if (type === 'platform') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
          平台
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
        大B
      </Badge>
    );
  };

  const renderStatus = (status: MarketingAccountRow['status']) => {
    if (status === 'normal') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          正常
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
        余额预警
      </Badge>
    );
  };

  const renderBusinessMode = (mode?: MarketingAccountRow['businessMode']) => {
    if (!mode) {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">
          -
        </Badge>
      );
    }
    const config = {
      mcp: { label: 'MCP', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      paas_white_label: {
        label: 'PAAS与White Label',
        className: 'bg-purple-50 text-purple-700 border-purple-300',
      },
    } as const;
    const { label, className } = config[mode];
    return (
      <Badge variant="outline" className={className}>
        {label}
      </Badge>
    );
  };
  const renderTransactionType = (type: PlatformTransaction['type']) => {
    const config: Record<PlatformTransaction['type'], { label: string; className: string }> = {
      recharge: {
        label: '充值',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      },
      campaign: {
        label: '活动投放',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-300',
      },
      refund: {
        label: '退款冲回',
        className: 'bg-slate-50 text-slate-700 border-slate-300',
      },
      adjustment: {
        label: '调账',
        className: 'bg-orange-50 text-orange-700 border-orange-300',
      },
    };
    const current = config[type];
    return (
      <Badge variant="outline" className={current.className}>
        {current.label}
      </Badge>
    );
  };

  const renderTransactionDirection = (direction: PlatformTransaction['direction']) => {
    if (direction === 'in') {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
          收入
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300">
        支出
      </Badge>
    );
  };

  const handleConfirmFundChange = () => {
    if (!fundDialogType) {
      return;
    }

    const amountNumber = Number(fundAmount);
    if (!amountNumber || Number.isNaN(amountNumber) || amountNumber <= 0) {
      return;
    }

    setPlatformBalance((prev) => {
      const isDeposit = fundDialogType === 'deposit';
      const safeAmount = isDeposit ? amountNumber : Math.min(amountNumber, prev.currentBalance);

      if (safeAmount <= 0) {
        return prev;
      }

      const newCurrent = isDeposit
        ? prev.currentBalance + safeAmount
        : prev.currentBalance - safeAmount;

      const now = new Date();
      const channelLabel = fundChannel === 'platformAccount' ? '平台账户' : '银行卡';

      const newTransaction: PlatformTransaction = {
        id: `TX-${isDeposit ? 'DEP' : 'WDL'}-${now.getTime()}`,
        time: formatDateTime(now),
        type: isDeposit ? 'recharge' : 'adjustment',
        direction: isDeposit ? 'in' : 'out',
        amount: safeAmount,
        balanceAfter: newCurrent,
        relatedObject: isDeposit
          ? `${channelLabel}充值（模拟）`
          : `${channelLabel}提现（模拟）`,
        operator: '平台财务（模拟）',
        remark:
          fundRemark ||
          (isDeposit ? `通过${channelLabel}充值` : `通过${channelLabel}提现`),
        isManual: true,
      };

      setPlatformTransactions((transactions) => [newTransaction, ...transactions]);

      return {
        ...prev,
        currentBalance: newCurrent,
      };
    });

    setFundDialogType(null);
    setFundAmount('');
    setFundRemark('');
    setFundChannel('platformAccount');
  };

  const handleExportPlatformTransactions = () => {
    if (platformTransactions.length === 0) {
      return;
    }

    const typeLabelMap: Record<PlatformTransaction['type'], string> = {
      recharge: '充值',
      campaign: '活动投放',
      refund: '退款冲回',
      adjustment: '调账',
    };

    const headers = [
      '流水号',
      '业务时间',
      '资金类型',
      '收支方向',
      '变动金额（元）',
      '变动后余额（元）',
      '关联对象',
      '操作人',
      '备注',
    ];

    const escapeCsv = (value: string) => '"' + value.replace(/"/g, '""') + '"';

    const rows = platformTransactions.map((tx) => [
      tx.id,
      tx.time,
      typeLabelMap[tx.type],
      tx.direction === 'in' ? '收入' : '支出',
      tx.amount.toString(),
      tx.balanceAfter.toString(),
      tx.relatedObject,
      tx.operator,
      tx.remark ?? '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '平台资金流水.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'overview' && (
        <div className="p-6 space-y-6">
          {/* 面包屑导航 */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>财务中心</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>营销账户</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  平台营销账户总览
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setFundDialogType('deposit');
                      setFundChannel('platformAccount');
                      setFundAmount('');
                      setFundRemark('');
                    }}
                  >
                    充值
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFundDialogType('withdraw');
                      setFundChannel('platformAccount');
                      setFundAmount('');
                      setFundRemark('');
                    }}
                  >
                    提现
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportPlatformTransactions}
                  >
                    导出流水
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRiskDialogOpen(true)}
                  >
                    账户风控设置
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6">
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">营销总金额（累计预算）</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(totalMarketingAmount)}
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">当前可用金额</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-700">
                    {formatCurrency(platformBalance.currentBalance)}
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">冻结金额</div>
                  <div className="mt-2 text-2xl font-bold text-orange-600">
                    {formatCurrency(platformBalance.frozenMarketingAmount)}
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">累计已使用金额</div>
                  <div className="mt-2 text-2xl font-bold text-indigo-700">
                    {formatCurrency(platformBalance.usedMarketingAmount)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('platform-detail')}
              className="flex items-center gap-1 px-0 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="w-4 h-4" />
              <span>进入平台账户明细</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>账户明细入口</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-white p-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">平台账户明细</div>
                    <div className="text-xs text-gray-500">
                      查看平台营销账户的资金流水、活动预算、充值与余额退回、操作与审批记录等详细信息。
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">面向平台财务/运营角色</div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setView('platform-detail');
                      }}
                    >
                      进入平台账户明细
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">大B营销账户</div>
                    <div className="text-xs text-gray-500">
                      管理大B联合出资营销账户的余额结构、预警状态及账户列表，支持后续对单个大B账户进行明细查看。
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      当前大B账户：{bigBAccounts.length} 个
                      {bigBWarningCount > 0 && (
                        <span className="ml-2 text-orange-600">
                          预警：{bigBWarningCount} 个
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setView('bigb-list');
                      }}
                    >
                      进入大B账户列表
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog
            open={fundDialogType !== null}
            onOpenChange={(open: boolean) => {
              if (!open) {
                setFundDialogType(null);
              }
            }}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {fundDialogType === 'deposit' ? '平台营销账户充值' : '平台营销账户提现'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  本操作仅为前端模拟，用于展示充值/提现与流水记录的交互效果，不会真实修改后端数据。
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">资金渠道</Label>
                  <Select
                    value={fundChannel}
                    onValueChange={(value: 'platformAccount' | 'bankCard') =>
                      setFundChannel(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择资金渠道" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platformAccount">平台账户</SelectItem>
                      <SelectItem value="bankCard">银行卡</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">金额（元）</Label>
                  <Input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder={
                      fundDialogType === 'deposit'
                        ? '请输入本次充值金额'
                        : '请输入本次提现金额'
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">备注（可选）</Label>
                  <Input
                    value={fundRemark}
                    onChange={(e) => setFundRemark(e.target.value)}
                    placeholder={
                      fundDialogType === 'deposit'
                        ? '例如：从平台账户划拨 / 从银行卡充值'
                        : '例如：提现回平台账户 / 提现至银行卡'
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFundDialogType(null)}
                  >
                    取消
                  </Button>
                  <Button size="sm" onClick={handleConfirmFundChange}>
                    确认提交
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={riskDialogOpen}
            onOpenChange={(open: boolean) => setRiskDialogOpen(open)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>账户风控设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">低余额预警阈值（元）</Label>
                  <Input
                    type="number"
                    value={riskLowBalanceThreshold}
                    onChange={(e) => setRiskLowBalanceThreshold(e.target.value)}
                    placeholder="例如：50000"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={riskAutoFreeze}
                    onCheckedChange={(checked: boolean) => setRiskAutoFreeze(checked)}
                  />
                  <span className="text-sm text-gray-700">
                    余额为负时自动冻结账户（模拟）
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRiskDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      console.log('save risk settings', {
                        lowBalance: riskLowBalanceThreshold,
                        autoFreeze: riskAutoFreeze,
                      });
                      setRiskDialogOpen(false);
                    }}
                  >
                    保存设置
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {view === 'platform-detail' && (
        <div className="p-6 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>财务中心</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>营销账户</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>平台账户明细</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('overview')}
              className="flex items-center gap-1 px-0 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回营销账户总览</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>平台资金流水</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索流水号或关联对象"
                      value={platformSearch}
                      onChange={(e) => setPlatformSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    筛选
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPlatformTransactions}
                  >
                    导出流水
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="w-20 text-sm text-gray-700">资金类型</Label>
                  <Select
                    value={platformTypeFilter}
                    onValueChange={(
                      value: 'all' | 'recharge' | 'campaign' | 'refund' | 'adjustment'
                    ) => setPlatformTypeFilter(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="recharge">充值</SelectItem>
                      <SelectItem value="campaign">活动投放</SelectItem>
                      <SelectItem value="refund">退款冲回</SelectItem>
                      <SelectItem value="adjustment">调账</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-20 text-sm text-gray-700">业务日期</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="date"
                      value={platformDateStart}
                      onChange={(e) => setPlatformDateStart(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">至</span>
                    <Input
                      type="date"
                      value={platformDateEnd}
                      onChange={(e) => setPlatformDateEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between md:justify-start">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={platformOnlyManual}
                      onCheckedChange={(checked: boolean) => setPlatformOnlyManual(checked)}
                    />
                    <span className="text-sm text-gray-700">仅查看异常/人工调整流水</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                <div>
                  当前筛选结果：
                  <span className="ml-1 font-medium text-gray-900">
                    {filteredPlatformTransactions.length}
                  </span>
                  条资金流水
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    收入合计：
                    <span className="ml-1 font-medium text-emerald-700">
                      {formatCurrency(platformIncomeTotal)}
                    </span>
                  </div>
                  <div>
                    支出合计：
                    <span className="ml-1 font-medium text-rose-700">
                      {formatCurrency(platformOutcomeTotal)}
                    </span>
                  </div>
                  <div>
                    净变动（收入-支出）：
                    <span
                      className={
                        platformNetChange > 0
                          ? 'ml-1 font-medium text-emerald-700'
                          : platformNetChange < 0
                          ? 'ml-1 font-medium text-rose-700'
                          : 'ml-1 font-medium text-gray-700'
                      }
                    >
                      {formatCurrency(platformNetChange)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">业务时间</TableHead>
                      <TableHead className="w-[150px]">流水号</TableHead>
                      <TableHead className="w-[120px]">资金类型</TableHead>
                      <TableHead className="w-[100px]">收支方向</TableHead>
                      <TableHead className="w-[140px] text-right">变动金额</TableHead>
                      <TableHead className="w-[140px] text-right">变动后余额</TableHead>
                      <TableHead className="w-[220px]">关联对象</TableHead>
                      <TableHead className="w-[120px]">操作人</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlatformTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="py-10 text-center text-gray-500"
                        >
                          暂无资金流水数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlatformTransactions.map((tx) => (
                        <TableRow key={tx.id} className="odd:bg-white even:bg-gray-50">
                          <TableCell className="font-mono text-sm text-gray-700">
                            {tx.time}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-gray-600">
                            {tx.id}
                          </TableCell>
                          <TableCell>{renderTransactionType(tx.type)}</TableCell>
                          <TableCell>
                            {renderTransactionDirection(tx.direction)}
                          </TableCell>
                          <TableCell
                            className={
                              tx.direction === 'in'
                                ? 'text-right text-emerald-700'
                                : 'text-right text-rose-700'
                            }
                          >
                            {tx.direction === 'in' ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell className="text-right text-gray-900">
                            {formatCurrency(tx.balanceAfter)}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {tx.relatedObject}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {tx.operator}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {tx.remark || '-'}
                            {tx.isManual && (
                              <span className="ml-2 text-xs text-orange-600">
                                异常/人工调整
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {view === 'bigb-list' && (
        <div className="p-6 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>财务中心</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>营销账户</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>大B营销账户</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('overview')}
              className="flex items-center gap-1 px-0 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回营销账户总览</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>大B营销账户列表</CardTitle>
                <div className="text-sm text-gray-600">
                  共 {bigBAccounts.length} 个账户
                  {bigBWarningCount > 0 && (
                    <span className="ml-3 text-orange-600">
                      预警账户：{bigBWarningCount} 个
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索大B名称或账户ID"
                    value={bigBSearch}
                    onChange={(e) => setBigBSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={bigBBusinessModeFilter}
                    onValueChange={(value: 'all' | 'mcp' | 'paas_white_label') =>
                      setBigBBusinessModeFilter(value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="业务模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部模式</SelectItem>
                      <SelectItem value="mcp">MCP</SelectItem>
                      <SelectItem value="paas_white_label">PAAS与White Label</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={bigBStatusFilter}
                    onValueChange={(value: 'all' | 'normal' | 'warning') =>
                      setBigBStatusFilter(value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="账户状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="normal">正常</SelectItem>
                      <SelectItem value="warning">余额预警</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Switch
                      checked={bigBOnlyWarning}
                      onCheckedChange={(checked: boolean) => setBigBOnlyWarning(checked)}
                    />
                    <span>仅显示预警账户</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">账户ID</TableHead>
                      <TableHead className="w-[200px]">大B名称</TableHead>
                      <TableHead className="w-[110px]">业务模式</TableHead>
                      <TableHead className="w-[140px]">总金额</TableHead>
                      <TableHead className="w-[120px]">冻结金额</TableHead>
                      <TableHead className="w-[140px]">可使用金额</TableHead>
                      <TableHead className="w-[150px]">累计已使用金额</TableHead>
                      <TableHead className="w-[110px]">账户状态</TableHead>
                      <TableHead className="w-[180px]">最近更新时间</TableHead>
                      <TableHead>备注</TableHead>
                      <TableHead className="w-[110px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBigBAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className="py-10 text-center text-gray-500"
                        >
                          暂无大B营销账户数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBigBAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono text-sm text-gray-700">
                            {account.id}
                          </TableCell>
                          <TableCell className="text-gray-900">{account.name}</TableCell>
                          <TableCell>{renderBusinessMode(account.businessMode)}</TableCell>
                          <TableCell className="text-gray-900 font-medium">
                            {formatCurrency(getAccountTotalAmount(account))}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            {formatCurrency(account.frozenMarketingAmount ?? 0)}
                          </TableCell>
                          <TableCell className="text-emerald-700">
                            {formatCurrency(account.currentBalance)}
                          </TableCell>
                          <TableCell className="text-indigo-700">
                            {formatCurrency(account.usedMarketingAmount)}
                          </TableCell>
                          <TableCell>{renderStatus(account.status)}</TableCell>
                          <TableCell className="text-gray-700">
                            {account.lastUpdated}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {account.remark || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBigB(account);
                                setBigBDetailOpen(true);
                              }}
                            >
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Dialog
            open={bigBDetailOpen}
            onOpenChange={(open: boolean) => {
              setBigBDetailOpen(open);
              if (!open) {
                setSelectedBigB(null);
              }
            }}
          >
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>大B营销账户详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">大B名称</div>
                    <div className="mt-1 text-gray-900">
                      {selectedBigB?.name || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">账户ID</div>
                    <div className="mt-1 font-mono text-gray-800">
                      {selectedBigB?.id || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">业务模式</div>
                    <div className="mt-1">
                      {renderBusinessMode(selectedBigB?.businessMode)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">账户状态</div>
                    <div className="mt-1">
                      {selectedBigB ? renderStatus(selectedBigB.status) : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">营销总金额</div>
                    <div className="mt-1 text-gray-900 font-medium">
                      {selectedBigB
                        ? formatCurrency(getAccountTotalAmount(selectedBigB))
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">当前可用金额</div>
                    <div className="mt-1 text-emerald-700 font-medium">
                      {selectedBigB
                        ? formatCurrency(selectedBigB.currentBalance)
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">冻结金额</div>
                    <div className="mt-1 text-orange-600 font-medium">
                      {selectedBigB
                        ? formatCurrency(selectedBigB.frozenMarketingAmount ?? 0)
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">累计已使用金额</div>
                    <div className="mt-1 text-indigo-700 font-medium">
                      {selectedBigB
                        ? formatCurrency(selectedBigB.usedMarketingAmount)
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">最近更新时间</div>
                    <div className="mt-1 text-gray-700">
                      {selectedBigB?.lastUpdated || '-'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">备注</div>
                    <div className="mt-1 text-gray-700">
                      {selectedBigB?.remark || '-'}
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  后续可在此补充该大B账户的资金流水、小B挂载数量、额度与风控规则等信息，用于支撑风控与对账场景。
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
