import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// 供应商结算状态
export type SupplierSettlementStatus = 'paid' | 'failed';

// 供应商结算明细
export interface SupplierSettlement {
  id: string;
  period: string; // 账单周期
  supplierName: string;
  amount: number;
  status: SupplierSettlementStatus;
  createdAt: string;
  paidAt?: string;
}

interface SupplierSettlementTableProps {
  settlements: SupplierSettlement[];
  onMarkFailed?: (id: string) => void;
  onRetryPay?: (id: string) => void;
}

export function SupplierSettlementTable({ settlements, onMarkFailed, onRetryPay }: SupplierSettlementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  const getStatusBadge = (status: SupplierSettlementStatus) => {
    const config = {
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300', icon: CheckCircle2 },
      failed: { label: '付款失败', className: 'bg-red-50 text-red-700 border-red-300', icon: XCircle },
    };
    const { label, className, icon: Icon } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  // 获取所有唯一的账单周期
  const uniquePeriods = Array.from(new Set(settlements.map(s => s.period))).sort().reverse();

  const filteredSettlements = settlements.filter((settlement) => {
    const matchesSearch = 
      settlement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.supplierName.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    const matchesPeriod = periodFilter === 'all' || settlement.period === periodFilter;
    
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // 计算统计信息
  const totalAmount = filteredSettlements.reduce((sum, s) => sum + s.amount, 0);
  const paidAmount = filteredSettlements
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>供应商结算明细</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              每月20号向供应商打款上月全部完结的订单
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索账单号、供应商..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="账单周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部周期</SelectItem>
                {uniquePeriods.map(period => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="结算状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
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
                <TableHead>账单号</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    账单周期
                  </div>
                </TableHead>
                <TableHead>供应商名称</TableHead>
                <TableHead className="text-right">结算金额</TableHead>
                <TableHead>结算状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>打款时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    暂无结算记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredSettlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        {settlement.period}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{settlement.supplierName}</TableCell>
                    <TableCell className="text-right font-medium text-purple-600">
                      ¥{settlement.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {settlement.createdAt}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {settlement.paidAt || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {settlement.status === 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onMarkFailed?.(settlement.id)}
                        >
                          标记失败
                        </Button>
                      )}
                      {settlement.status === 'failed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onRetryPay?.(settlement.id)}
                        >
                          重新打款
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredSettlements.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredSettlements.length} 条结算记录
          </div>
        )}
      </CardContent>
    </Card>
  );
}

