import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Search } from 'lucide-react';

// 接入类型
export type AccessType = 'API' | 'PAAS' | 'link';

// 小B账户信息
export interface PartnerAccount {
  partnerId: string;
  partnerName: string;
  accessType: AccessType;
  totalCommission: number; // 历史总佣金
  withdrawnCommission: number; // 已提现佣金
  availableCommission: number; // 未提现佣金（可提现）
  pendingCommission: number; // 未确认佣金（待入住订单）
}

interface PartnerAccountTableProps {
  accounts: PartnerAccount[];
}

export function PartnerAccountTable({ accounts }: PartnerAccountTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessTypeFilter, setAccessTypeFilter] = useState<string>('all');

  const getAccessTypeBadge = (type: AccessType) => {
    const config = {
      API: { label: 'API', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      PAAS: { label: 'PAAS', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      link: { label: '链接分销', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.partnerName.includes(searchQuery) ||
      account.partnerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAccessType = accessTypeFilter === 'all' || account.accessType === accessTypeFilter;
    
    return matchesSearch && matchesAccessType;
  });

  // 计算汇总数据
  const summary = filteredAccounts.reduce(
    (acc, account) => ({
      totalCommission: acc.totalCommission + account.totalCommission,
      withdrawnCommission: acc.withdrawnCommission + account.withdrawnCommission,
      availableCommission: acc.availableCommission + account.availableCommission,
      pendingCommission: acc.pendingCommission + account.pendingCommission,
    }),
    { totalCommission: 0, withdrawnCommission: 0, availableCommission: 0, pendingCommission: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>小B账户列表</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索小B名称、ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={accessTypeFilter} onValueChange={setAccessTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="接入方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部接入方式</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="PAAS">PAAS</SelectItem>
                <SelectItem value="link">链接分销</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">小B ID</TableHead>
                <TableHead className="text-center">小B名称</TableHead>
                <TableHead className="text-center">接入方式</TableHead>
                <TableHead className="text-center">历史总佣金</TableHead>
                <TableHead className="text-center">已提现佣金</TableHead>
                <TableHead className="text-center">未提现佣金</TableHead>
                <TableHead className="text-center">未确认佣金</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    暂无小B账户数据
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.partnerId}>
                      <TableCell className="font-mono text-sm text-center">{account.partnerId}</TableCell>
                      <TableCell className="font-medium text-center">{account.partnerName}</TableCell>
                      <TableCell className="text-center">{getAccessTypeBadge(account.accessType)}</TableCell>
                      <TableCell className="text-center font-medium">
                        ¥{account.totalCommission.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        ¥{account.withdrawnCommission.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">
                        ¥{account.availableCommission.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center text-orange-600">
                        ¥{account.pendingCommission.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* 汇总行 */}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell colSpan={3} className="text-center">汇总</TableCell>
                    <TableCell className="text-center">
                      ¥{summary.totalCommission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center text-green-600">
                      ¥{summary.withdrawnCommission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center text-blue-600">
                      ¥{summary.availableCommission.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center text-orange-600">
                      ¥{summary.pendingCommission.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredAccounts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredAccounts.length} 个小B账户
          </div>
        )}
      </CardContent>
    </Card>
  );
}

