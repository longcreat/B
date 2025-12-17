import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, TrendingUp, Clock, Wallet, Plus } from 'lucide-react';
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
  payableDistribution: number; // 应付账款（分销）
  payableSupplier: number; // 应付账款（供应商卖价）
  availableFunds: number; // 可用资金
  platformDiscountContribution: number; // 平台出资优惠金额
  bigBDiscountContribution: number; // 大B出资优惠金额
}

interface PlatformAccountDashboardProps {
  stats: DashboardStats;
  onRecharge?: (amount: number) => void;
}

export function PlatformAccountDashboard({ stats, onRecharge }: PlatformAccountDashboardProps) {
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('请输入有效的充值金额');
      return;
    }
    
    onRecharge?.(amount);
    toast.success(`充值成功：¥${amount.toLocaleString()}`);
    setIsRechargeDialogOpen(false);
    setRechargeAmount('');
  };

  return (
    <>
      <div className="space-y-3">
        {/* 卡片网格：2列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 订单预收款统计 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600">订单预收款</p>
                  <p className="text-lg font-semibold mt-0.5 text-blue-600">
                    ¥{stats.advancePayment.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">未完结订单</p>
                </div>
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* 订单已收款统计 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600">订单已收款</p>
                  <p className="text-lg font-semibold mt-0.5 text-green-600">
                    ¥{stats.actualRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">已完结订单</p>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* 平台预估利润 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600">平台预估利润</p>
                  <p className="text-lg font-semibold mt-0.5 text-purple-600">
                    ¥{stats.estimatedProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">未完结订单</p>
                </div>
                <DollarSign className="w-6 h-6 text-purple-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* 平台实际利润 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600">平台实际利润</p>
                  <p className="text-lg font-semibold mt-0.5 text-orange-600">
                    ¥{stats.actualProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">已完结订单</p>
                </div>
                <DollarSign className="w-6 h-6 text-orange-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* 可用资金 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-gray-600">平台总资金池</p>
                  <p className="text-lg font-semibold mt-0.5 text-emerald-600">
                    ¥{stats.availableFunds.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">扣除应付后</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Wallet className="w-6 h-6 text-emerald-500" />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={() => setIsRechargeDialogOpen(true)}
                  >
                    <Plus className="w-3 h-3 mr-0.5" />
                    充值
                  </Button>
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

