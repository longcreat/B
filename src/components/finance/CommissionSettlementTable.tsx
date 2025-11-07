import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

// 佣金结算申请状态
export type WithdrawalStatus = 'approved' | 'rejected' | 'paid' | 'failed';

// 佣金结算明细
export interface CommissionWithdrawal {
  id: string;
  applicant: string;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt?: string;
}

interface CommissionSettlementTableProps {
  withdrawals: CommissionWithdrawal[];
  onPay?: (id: string) => void;
  onMarkFailed?: (id: string) => void;
}

export function CommissionSettlementTable({ 
  withdrawals, 
  onPay, 
  onMarkFailed 
}: CommissionSettlementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<CommissionWithdrawal | null>(null);
  const [actionType, setActionType] = useState<'pay' | 'fail' | null>(null);

  const getStatusBadge = (status: WithdrawalStatus) => {
    const config = {
      approved: { label: '已通过', className: 'bg-blue-50 text-blue-700 border-blue-300', icon: CheckCircle2 },
      rejected: { label: '未通过', className: 'bg-red-50 text-red-700 border-red-300', icon: XCircle },
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300', icon: CheckCircle2 },
      failed: { label: '付款失败', className: 'bg-orange-50 text-orange-700 border-orange-300', icon: AlertCircle },
    };
    const { label, className, icon: Icon } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch = 
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.applicant.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePayClick = (withdrawal: CommissionWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setActionType('pay');
  };

  const handleMarkFailedClick = (withdrawal: CommissionWithdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setActionType('fail');
  };

  const handleConfirmAction = () => {
    if (!selectedWithdrawal) return;

    if (actionType === 'pay') {
      onPay?.(selectedWithdrawal.id);
      toast.success(`已发起打款：${selectedWithdrawal.id}`);
    } else if (actionType === 'fail') {
      onMarkFailed?.(selectedWithdrawal.id);
      toast.success(`已标记为付款失败：${selectedWithdrawal.id}`);
    }

    setSelectedWithdrawal(null);
    setActionType(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>佣金结算明细</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索申请单号、申请人..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="申请状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="rejected">未通过</SelectItem>
                  <SelectItem value="paid">已打款</SelectItem>
                  <SelectItem value="failed">付款失败</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>申请单号</TableHead>
                  <TableHead>申请人</TableHead>
                  <TableHead className="text-right">申请金额</TableHead>
                  <TableHead>申请状态</TableHead>
                  <TableHead>申请时间</TableHead>
                  <TableHead>处理时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      暂无提现申请
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-mono text-sm">{withdrawal.id}</TableCell>
                      <TableCell>{withdrawal.applicant}</TableCell>
                      <TableCell className="text-right font-medium text-orange-600">
                        ¥{withdrawal.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {withdrawal.createdAt}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {withdrawal.processedAt || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {withdrawal.status === 'approved' && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handlePayClick(withdrawal)}
                            >
                              打款
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkFailedClick(withdrawal)}
                            >
                              标记失败
                            </Button>
                          </div>
                        )}
                        {withdrawal.status === 'paid' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkFailedClick(withdrawal)}
                          >
                            标记失败
                          </Button>
                        )}
                        {withdrawal.status === 'failed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePayClick(withdrawal)}
                          >
                            重新打款
                          </Button>
                        )}
                        {withdrawal.status === 'rejected' && (
                          <span className="text-sm text-gray-500">已拒绝</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredWithdrawals.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              共 {filteredWithdrawals.length} 条申请
            </div>
          )}
        </CardContent>
      </Card>

      {/* 确认对话框 */}
      <AlertDialog open={!!selectedWithdrawal} onOpenChange={() => {
        setSelectedWithdrawal(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'pay' ? '确认打款' : '确认标记为付款失败'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'pay' ? (
                <>
                  确认向 <strong>{selectedWithdrawal?.applicant}</strong> 打款 
                  <strong className="text-orange-600"> ¥{selectedWithdrawal?.amount.toLocaleString()}</strong> 吗？
                  <br />
                  打款后，应付账款（分销）将减少对应金额。
                </>
              ) : (
                <>
                  确认将申请单 <strong>{selectedWithdrawal?.id}</strong> 标记为付款失败吗？
                  <br />
                  标记后，已减少的金额将回到应付账款中。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

