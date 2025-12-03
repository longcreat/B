import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Search, Download, Filter, Eye, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import type { SmallBAccount, UserType, AuthType, AccountStatus } from './types';
import { SmallBAccountDetail } from './SmallBAccountDetail';

export function SmallBAccountList() {
  const [selectedAccount, setSelectedAccount] = useState<SmallBAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'all'>('all');
  const [authTypeFilter, setAuthTypeFilter] = useState<AuthType | 'all'>('all');
  const [parentBigBFilter, setParentBigBFilter] = useState<string>('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Mock数据
  const [accounts] = useState<SmallBAccount[]>([
    {
      id: 'SB-001',
      name: '张三工作室',
      userType: 'travel_agent',
      authType: 'individual',
      parentBigBId: 'BB-001',
      parentBigBName: '华东渠道A',
      accountStatus: 'active',
      contactInfo: {
        email: 'zhangsan@example.com',
        phone: '138****5678',
      },
      lastLoginAt: '2024-01-15 10:30:00',
      stats: {
        totalOrderAmount: 50000,
        totalRefund: 2000,
        totalProfit: 8000,
        totalCommission: 5000,
        settledCommission: 3000,
        pendingCommission: 2000,
        commissionRate: 10,
      },
    },
    {
      id: 'SB-002',
      name: '李四旅游',
      userType: 'influencer',
      authType: 'enterprise',
      parentBigBId: 'BB-001',
      parentBigBName: '华东渠道A',
      accountStatus: 'active',
      contactInfo: {
        email: 'lisi@example.com',
        phone: '139****1234',
      },
      lastLoginAt: '2024-01-14 15:20:00',
      stats: {
        totalOrderAmount: 30000,
        totalRefund: 1000,
        totalProfit: 5000,
        totalCommission: 3000,
        settledCommission: 2000,
        pendingCommission: 1000,
        commissionRate: 8,
      },
    },
  ]);

  // Mock大B列表（用于筛选）
  const bigBOptions = [
    { id: 'BB-001', name: '华东渠道A' },
    { id: 'BB-002', name: '华北渠道B' },
  ];

  const getUserTypeBadge = (type: UserType) => {
    const config = {
      travel_agent: { label: '旅行代理', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '网络博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      travel_app: { label: '旅游应用', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getAuthTypeBadge = (type: AuthType) => {
    const config = {
      individual: { label: '个人认证', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      enterprise: { label: '企业认证', className: 'bg-blue-50 text-blue-700 border-blue-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getAccountStatusBadge = (status: AccountStatus) => {
    const config = {
      active: { label: '正常', className: 'bg-green-50 text-green-700 border-green-300' },
      frozen: { label: '冻结', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      closed: { label: '关闭', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        account.name.includes(searchQuery) ||
        account.parentBigBName.includes(searchQuery) ||
        account.contactInfo.email.includes(searchQuery) ||
        account.contactInfo.phone.includes(searchQuery);

      const matchesUserType = userTypeFilter === 'all' || account.userType === userTypeFilter;
      const matchesAuthType = authTypeFilter === 'all' || account.authType === authTypeFilter;
      const matchesParentBigB = parentBigBFilter === 'all' || account.parentBigBId === parentBigBFilter;
      const matchesAccountStatus = accountStatusFilter === 'all' || account.accountStatus === accountStatusFilter;

      return matchesSearch && matchesUserType && matchesAuthType && matchesParentBigB && matchesAccountStatus;
    });
  }, [accounts, searchQuery, userTypeFilter, authTypeFilter, parentBigBFilter, accountStatusFilter]);

  const hasActiveFilters =
    userTypeFilter !== 'all' ||
    authTypeFilter !== 'all' ||
    parentBigBFilter !== 'all' ||
    accountStatusFilter !== 'all';

  // 分页逻辑
  const totalPages = Math.ceil(filteredAccounts.length / pageSize);
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(startIndex, startIndex + pageSize);
  }, [filteredAccounts, currentPage]);

  // 如果选中了账户，显示详情页
  if (selectedAccount) {
    return <SmallBAccountDetail account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-gray-600" />
              小B账户列表
            </CardTitle>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="relative w-64 min-w-[16rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索小B名称、挂载大B、邮箱、手机号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">用户信息类型</Label>
                  <Select value={userTypeFilter} onValueChange={(value: UserType | 'all') => setUserTypeFilter(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="travel_agent">旅行代理</SelectItem>
                      <SelectItem value="influencer">网络博主</SelectItem>
                      <SelectItem value="travel_app">旅游应用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">认证方式</Label>
                  <Select value={authTypeFilter} onValueChange={(value: AuthType | 'all') => setAuthTypeFilter(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部方式</SelectItem>
                      <SelectItem value="individual">个人认证</SelectItem>
                      <SelectItem value="enterprise">企业认证</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">挂载大B</Label>
                  <Select value={parentBigBFilter} onValueChange={setParentBigBFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部大B" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部大B</SelectItem>
                      {bigBOptions.map((bigB) => (
                        <SelectItem key={bigB.id} value={bigB.id}>
                          {bigB.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">账户状态</Label>
                  <Select value={accountStatusFilter} onValueChange={(value: AccountStatus | 'all') => setAccountStatusFilter(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">正常</SelectItem>
                      <SelectItem value="frozen">冻结</SelectItem>
                      <SelectItem value="closed">关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserTypeFilter('all');
                      setAuthTypeFilter('all');
                      setParentBigBFilter('all');
                      setAccountStatusFilter('all');
                    }}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <style>
          {`
            .smallb-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .smallb-table-container table td:last-child,
            .smallb-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.06);
            }
            .smallb-table-container table td,
            .smallb-table-container table th {
              white-space: nowrap;
            }
          `}
        </style>
        <div className="smallb-table-container overflow-x-auto border rounded-lg">
          <table className="border-collapse w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">小B名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户信息类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">认证方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">挂载大B</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">累计订单金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">累计订单佣金</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">佣金比例</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">已结算佣金</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">待结算佣金</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-gray-500">
                    {searchQuery || hasActiveFilters ? '未找到符合条件的小B账户' : '暂无小B账户数据'}
                  </td>
                </tr>
              ) : (
                paginatedAccounts.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{account.name}</td>
                    <td className="px-4 py-3 text-sm">{getUserTypeBadge(account.userType)}</td>
                    <td className="px-4 py-3 text-sm">{getAuthTypeBadge(account.authType)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{account.parentBigBName}</td>
                    <td className="px-4 py-3 text-sm">{getAccountStatusBadge(account.accountStatus)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {account.stats.totalOrderAmount > 0 ? `¥${account.stats.totalOrderAmount.toLocaleString()}` : '–'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-purple-600">
                      {account.stats.totalCommission > 0 ? `¥${account.stats.totalCommission.toLocaleString()}` : '–'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {account.stats.commissionRate}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      {account.stats.settledCommission > 0 ? `¥${account.stats.settledCommission.toLocaleString()}` : '–'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600">
                      {account.stats.pendingCommission > 0 ? `¥${account.stats.pendingCommission.toLocaleString()}` : '–'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setSelectedAccount(account)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页，共 {filteredAccounts.length} 条记录
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
