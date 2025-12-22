import { X, Calendar, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

export type TransactionType = 'payableBigB' | 'payableSmallB' | 'payableSupplier' | 'availableFunds';

export interface Transaction {
  id: string;
  timestamp: string;
  type: 'increase' | 'decrease';
  amount: number;
  description: string;
  relatedId?: string;
  operator?: string;
}

interface TransactionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transactionType: TransactionType;
  transactions: Transaction[];
  onAddTransaction?: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  payableBigB: '应付大B佣金',
  payableSmallB: '应付小B佣金',
  payableSupplier: '应付供应商费用',
  availableFunds: '平台总资金池',
};

export function TransactionHistoryPanel({
  isOpen,
  onClose,
  transactionType,
  transactions,
  onAddTransaction,
}: TransactionHistoryPanelProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState<'compensation' | 'company_withdrawal'>('compensation');
  const [newAmount, setNewAmount] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRelatedId, setNewRelatedId] = useState('');
  const [newOperator, setNewOperator] = useState('');

  // 根据日期筛选交易记录
  const filteredTransactions = useMemo(() => {
    if (!startDate && !endDate) return transactions;

    return transactions.filter((transaction) => {
      const transactionDate = transaction.timestamp.split(' ')[0]; // 提取日期部分 YYYY-MM-DD
      
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;
      
      return true;
    });
  }, [transactions, startDate, endDate]);

  // 重置筛选
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  // 处理添加交易记录
  const handleAddTransaction = () => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('请输入有效的金额');
      return;
    }

    if (!newDescription.trim()) {
      toast.error('请输入交易描述');
      return;
    }

    if (!newOperator.trim()) {
      toast.error('请输入操作人');
      return;
    }

    const transaction: Omit<Transaction, 'id' | 'timestamp'> = {
      type: 'decrease',
      amount,
      description: newTransactionType === 'compensation' ? '客户赔付' : '公司提现',
      relatedId: newRelatedId.trim() || undefined,
      operator: newOperator.trim(),
    };

    onAddTransaction?.(transaction);
    toast.success('交易记录已添加');
    
    // 重置表单
    setShowAddDialog(false);
    setNewTransactionType('compensation');
    setNewAmount('');
    setNewDescription('');
    setNewRelatedId('');
    setNewOperator('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 侧边面板 */}
      <div className="relative w-[800px] bg-white shadow-2xl flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {TRANSACTION_TYPE_LABELS[transactionType]} - 变动明细
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                共 {filteredTransactions.length} 条记录
                {(startDate || endDate) && (
                  <span className="text-blue-600 ml-2">
                    (已筛选)
                  </span>
                )}
              </p>
              {transactionType === 'availableFunds' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddDialog(true)}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  手动录入
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 日期筛选区域 */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="start-date" className="text-xs text-gray-600 mb-1">
                开始日期
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="text-xs text-gray-600 mb-1">
                结束日期
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9"
              disabled={!startDate && !endDate}
            >
              重置
            </Button>
          </div>
        </div>

        {/* 交易列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>
                {transactions.length === 0 ? '暂无变动记录' : '没有符合筛选条件的记录'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={
                            transaction.type === 'increase'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          }
                        >
                          {transaction.type === 'increase' ? '增加' : '减少'}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {transaction.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">
                        {transaction.description}
                      </p>
                      {transaction.relatedId && (
                        <p className="text-xs text-gray-500">
                          关联单号: {transaction.relatedId}
                        </p>
                      )}
                      {transaction.operator && (
                        <p className="text-xs text-gray-500">
                          操作人: {transaction.operator}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'increase' ? '+' : '-'}¥
                        {transaction.amount.toLocaleString('zh-CN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 手动录入交易记录对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>手动录入交易记录</DialogTitle>
            <DialogDescription>
              录入平台资金池的支出记录（客户赔付或公司提现）
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-type">交易类型 *</Label>
              <Select
                value={newTransactionType}
                onValueChange={(value: 'compensation' | 'company_withdrawal') => setNewTransactionType(value)}
              >
                <SelectTrigger id="transaction-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compensation">客户赔付</SelectItem>
                  <SelectItem value="company_withdrawal">公司提现</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">金额 *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="请输入金额"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="related-id">关联单号</Label>
              <Input
                id="related-id"
                placeholder="选填，如赔付单号"
                value={newRelatedId}
                onChange={(e) => setNewRelatedId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operator">操作人 *</Label>
              <Input
                id="operator"
                placeholder="请输入操作人姓名"
                value={newOperator}
                onChange={(e) => setNewOperator(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleAddTransaction}>
              确认录入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
