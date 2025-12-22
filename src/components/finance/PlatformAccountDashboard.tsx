import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, TrendingUp, Clock, Wallet, Plus, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface DashboardStats {
  advancePayment: number; // 订单预收款
  actualRevenue: number; // 订单已收款
  estimatedProfit: number; // 平台预估利润
  actualProfit: number; // 平台实际利润
  payableBigB: number; // 应付大B佣金
  payableSmallB: number; // 应付小B佣金
  payableSupplier: number; // 应付供应商费用
  availableFunds: number; // 可用资金
  platformDiscountContribution: number; // 平台出资优惠金额
  bigBDiscountContribution: number; // 大B出资优惠金额
}

interface PlatformAccountDashboardProps {
  stats: DashboardStats;
  onRecharge?: (amount: number) => void;
  onViewTransactionHistory?: (type: 'payableBigB' | 'payableSmallB' | 'payableSupplier' | 'availableFunds') => void;
}

export function PlatformAccountDashboard({ stats, onRecharge, onViewTransactionHistory }: PlatformAccountDashboardProps) {
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('请输入有效的充值金额');
      return;
    }
    
    onRecharge?.(amount);
    toast.success(`充值成功：¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    setIsRechargeDialogOpen(false);
    setRechargeAmount('');
  };

  return (
    <>
      <div className="space-y-3">
        {/* 卡片网格：4列布局 */}
        <div className="grid grid-cols-4 gap-3">
          {/* 订单预收款统计 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">订单预收款</p>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-600">
                  ¥{stats.advancePayment.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">未完结订单</p>
              </div>
            </CardContent>
          </Card>

          {/* 订单已收款统计 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">订单已收款</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xl font-bold text-green-600">
                  ¥{stats.actualRevenue.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">已完结订单</p>
              </div>
            </CardContent>
          </Card>

          {/* 平台预估利润 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">平台预估利润</p>
                  <DollarSign className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xl font-bold text-purple-600">
                  ¥{stats.estimatedProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">未完结订单</p>
              </div>
            </CardContent>
          </Card>

          {/* 平台实际利润 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">平台实际利润</p>
                  <DollarSign className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-xl font-bold text-orange-600">
                  ¥{stats.actualProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">已完结订单</p>
              </div>
            </CardContent>
          </Card>

          {/* 应付大B佣金 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">应付大B佣金</p>
                  <DollarSign className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-xl font-bold text-red-600">
                  ¥{stats.payableBigB.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">待对方提现</p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-5 text-xs px-2 text-blue-600 hover:text-blue-700"
                    onClick={() => onViewTransactionHistory?.('payableBigB')}
                  >
                    <FileText className="w-3 h-3 mr-0.5" />
                    变动明细
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 应付小B佣金 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">应付小B佣金</p>
                  <DollarSign className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xl font-bold text-amber-600">
                  ¥{stats.payableSmallB.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">待对方提现</p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-5 text-xs px-2 text-blue-600 hover:text-blue-700"
                    onClick={() => onViewTransactionHistory?.('payableSmallB')}
                  >
                    <FileText className="w-3 h-3 mr-0.5" />
                    变动明细
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 应付供应商费用 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">应付供应商费用</p>
                  <DollarSign className="w-4 h-4 text-pink-500" />
                </div>
                <p className="text-xl font-bold text-pink-600">
                  ¥{stats.payableSupplier.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">待支付</p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-5 text-xs px-2 text-blue-600 hover:text-blue-700"
                    onClick={() => onViewTransactionHistory?.('payableSupplier')}
                  >
                    <FileText className="w-3 h-3 mr-0.5" />
                    变动明细
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 可用资金 */}
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">平台总资金池</p>
                  <Wallet className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xl font-bold text-emerald-600">
                  ¥{stats.availableFunds.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-gray-500">扣除应付后</p>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-5 text-xs px-2 text-blue-600 hover:text-blue-700"
                      onClick={() => onViewTransactionHistory?.('availableFunds')}
                    >
                      <FileText className="w-3 h-3 mr-0.5" />
                      变动明细
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-5 text-xs px-2"
                      onClick={() => setIsRechargeDialogOpen(true)}
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
                      充值
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 充值对话框 */}
      <Dialog open={isRechargeDialogOpen} onOpenChange={setIsRechargeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>充值可用资金</DialogTitle>
            <DialogDescription>
              请输入充值金额，充值后将直接增加到可用资金中
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">充值金额</Label>
              <Input
                id="amount"
                type="number"
                placeholder="请输入充值金额"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRechargeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRecharge}>
              确认充值
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

