import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  ShoppingBag,
  CreditCard,
  Gift,
  Coins,
  Download,
  ArrowUpRight
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

// 利润明细
interface ProfitRecord {
  id: string;
  orderId: string;
  hotelName: string;
  checkOutDate: string;
  profit: number;
  status: 'pending' | 'settled' | 'withdrawn';
  settledAt?: string;
  createdAt: string;
}

// 提取记录
interface WithdrawalRecord {
  id: string;
  type: 'cash' | 'jdcard' | 'points';
  amount: number;
  actualAmount?: number; // 扣税后实际到账
  taxAmount?: number; // 税额
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  cardInfo?: string; // 京东E卡卡密
}

export function ProfitWallet() {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'withdrawal'>('overview');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawType, setWithdrawType] = useState<'cash' | 'jdcard' | 'points' | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // 账户余额数据
  const walletBalance = {
    available: 2580.50, // 可用余额
    pending: 856.20, // 待结算
    totalEarned: 15680.00, // 累计利润
    withdrawn: 12243.30, // 已提取
  };

  // 利润明细记录
  const profitRecords: ProfitRecord[] = [
    {
      id: 'PR-001',
      orderId: 'ORD-2025001',
      hotelName: '北京希尔顿酒店',
      checkOutDate: '2025-10-20',
      profit: 88.00,
      status: 'settled',
      settledAt: '2025-10-30 01:00:00',
      createdAt: '2025-10-18 14:30:00',
    },
    {
      id: 'PR-002',
      orderId: 'ORD-2025002',
      hotelName: '上海浦东香格里拉',
      checkOutDate: '2025-10-25',
      profit: 132.00,
      status: 'pending',
      createdAt: '2025-10-23 10:15:00',
    },
    {
      id: 'PR-003',
      orderId: 'ORD-2024998',
      hotelName: '深圳湾万豪酒店',
      checkOutDate: '2025-10-15',
      profit: 156.50,
      status: 'withdrawn',
      settledAt: '2025-10-23 01:00:00',
      createdAt: '2025-10-13 09:20:00',
    },
  ];

  // 提取记录
  const withdrawalRecords: WithdrawalRecord[] = [
    {
      id: 'WD-001',
      type: 'jdcard',
      amount: 1000,
      status: 'completed',
      createdAt: '2025-10-25 14:30:00',
      completedAt: '2025-10-25 14:31:00',
      cardInfo: '****-****-****-5678',
    },
    {
      id: 'WD-002',
      type: 'cash',
      amount: 500,
      actualAmount: 400, // 扣税20%
      taxAmount: 100,
      status: 'completed',
      createdAt: '2025-10-20 10:15:00',
      completedAt: '2025-10-21 16:20:00',
    },
    {
      id: 'WD-003',
      type: 'points',
      amount: 300,
      status: 'completed',
      createdAt: '2025-10-18 16:45:00',
      completedAt: '2025-10-18 16:46:00',
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
      withdrawn: { label: '已提取', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '失败', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status as keyof typeof config] || config.pending;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getWithdrawTypeName = (type: string) => {
    const names = {
      cash: '现金提取',
      jdcard: '京东E卡',
      points: '平台积分',
    };
    return names[type as keyof typeof names] || type;
  };

  const handleWithdrawClick = (type: 'cash' | 'jdcard' | 'points') => {
    setWithdrawType(type);
    setShowWithdrawDialog(true);
  };

  const handleConfirmWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('请输入有效的提取金额');
      return;
    }
    if (amount > walletBalance.available) {
      toast.error('余额不足');
      return;
    }

    let message = '';
    if (withdrawType === 'cash') {
      const taxAmount = amount * 0.2; // 20%税率
      const actualAmount = amount - taxAmount;
      message = `提取申请已提交！扣税后实际到账：¥${actualAmount.toFixed(2)}（税额：¥${taxAmount.toFixed(2)}）`;
    } else if (withdrawType === 'jdcard') {
      message = `京东E卡兑换申请已提交！预计1-3分钟内发放到账`;
    } else {
      const pointsAmount = amount * 1.05; // 1:1.05兑换比例
      message = `已兑换 ${pointsAmount.toFixed(0)} 平台积分`;
    }

    toast.success(message);
    setShowWithdrawDialog(false);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-6">
      {/* 账户概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 mb-2">可用余额</p>
                <p className="text-4xl mb-4">¥{walletBalance.available.toFixed(2)}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab('withdrawal')}
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  提取利润
                </Button>
              </div>
              <Wallet className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待结算</p>
                <p className="text-2xl mt-1 text-yellow-600">¥{walletBalance.pending.toFixed(2)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">累计收益</p>
                <p className="text-2xl mt-1 text-green-600">¥{walletBalance.totalEarned.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主内容区 */}
      <Card>
        <CardHeader>
          <CardTitle>利润中心</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">账户概览</TabsTrigger>
              <TabsTrigger value="records">利润明细</TabsTrigger>
              <TabsTrigger value="withdrawal">提取记录</TabsTrigger>
            </TabsList>

            {/* 账户概览 */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-600">累计收益</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl">¥{walletBalance.totalEarned.toFixed(2)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-gray-600">已提取</span>
                    <Download className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl">¥{walletBalance.withdrawn.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 pb-2 border-b">利润趋势</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">收益趋势图表（待集成图表库）</p>
                </div>
              </div>
            </TabsContent>

            {/* 利润明细 */}
            <TabsContent value="records" className="mt-6">
              <div className="space-y-3">
                {profitRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p>{record.hotelName}</p>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>订单号：{record.orderId}</span>
                          <span>离店日期：{record.checkOutDate}</span>
                        </div>
                        {record.settledAt && (
                          <p className="text-xs text-gray-500 mt-1">结算时间：{record.settledAt}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl text-green-600">+¥{record.profit.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">{record.createdAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 提取记录 */}
            <TabsContent value="withdrawal" className="mt-6 space-y-6">
              {/* 提取方式选择 */}
              <div>
                <h3 className="mb-4">选择提取方式</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 现金提取 */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500" onClick={() => handleWithdrawClick('cash')}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <h4>现金提取</h4>
                        <p className="text-sm text-gray-600">T+1到账银行卡</p>
                        <p className="text-xs text-red-600">需扣除20%个税</p>
                        <Button className="w-full">立即提取</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 京东E卡 */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500" onClick={() => handleWithdrawClick('jdcard')}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                          <Gift className="w-6 h-6 text-red-600" />
                        </div>
                        <h4>京东E卡</h4>
                        <p className="text-sm text-gray-600">等值消费力</p>
                        <p className="text-xs text-green-600">无税费，即时到账</p>
                        <Button className="w-full">兑换E卡</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 平台积分 */}
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500" onClick={() => handleWithdrawClick('points')}>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                          <Coins className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4>平台积分</h4>
                        <p className="text-sm text-gray-600">可抵扣订单</p>
                        <p className="text-xs text-purple-600">1:1.05兑换比例</p>
                        <Button className="w-full">兑换积分</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 提取历史记录 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">提取记录</h3>
                <div className="space-y-3">
                  {withdrawalRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p>{getWithdrawTypeName(record.type)}</p>
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>提取金额：¥{record.amount.toFixed(2)}</p>
                            {record.actualAmount && (
                              <p className="text-green-600">
                                实际到账：¥{record.actualAmount.toFixed(2)} 
                                （税额：¥{record.taxAmount?.toFixed(2)}）
                              </p>
                            )}
                            {record.cardInfo && (
                              <p>卡密：{record.cardInfo}</p>
                            )}
                            <p className="text-xs text-gray-500">申请时间：{record.createdAt}</p>
                            {record.completedAt && (
                              <p className="text-xs text-gray-500">完成时间：{record.completedAt}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 提取确认对话框 */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {withdrawType === 'cash' && '现金提取'}
              {withdrawType === 'jdcard' && '京东E卡兑换'}
              {withdrawType === 'points' && '平台积分兑换'}
            </DialogTitle>
            <DialogDescription>
              {withdrawType === 'cash' && '提现将于1个工作日内到账您的银行卡，需扣除20%个人所得税'}
              {withdrawType === 'jdcard' && '兑换京东E卡无需扣税，等值消费力，1-3分钟内发放'}
              {withdrawType === 'points' && '按1:1.05比例兑换为平台积分，可用于抵扣订单费用'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>可用余额</Label>
              <p className="text-2xl text-blue-600 mt-2">¥{walletBalance.available.toFixed(2)}</p>
            </div>

            <div>
              <Label htmlFor="amount">
                {withdrawType === 'points' ? '兑换金额' : '提取金额'}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="请输入金额"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-2"
              />
            </div>

            {withdrawType === 'cash' && withdrawAmount && parseFloat(withdrawAmount) > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-gray-700">
                  扣税金额：¥{(parseFloat(withdrawAmount) * 0.2).toFixed(2)}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  实际到账：¥{(parseFloat(withdrawAmount) * 0.8).toFixed(2)}
                </p>
              </div>
            )}

            {withdrawType === 'points' && withdrawAmount && parseFloat(withdrawAmount) > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm text-gray-700">
                  兑换积分：{(parseFloat(withdrawAmount) * 1.05).toFixed(0)} 积分
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmWithdraw}>
              确认{withdrawType === 'cash' ? '提取' : '兑换'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
