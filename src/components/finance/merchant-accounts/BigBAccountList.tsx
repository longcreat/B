import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Search, Download, Filter, Eye, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import type { BigBAccount, UserType, AuthType, BusinessMode, AccountStatus } from './types';
import { BigBAccountDetail } from './BigBAccountDetail';

export function BigBAccountList() {
  const [selectedAccount, setSelectedAccount] = useState<BigBAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<UserType | 'all'>('all');
  const [authTypeFilter, setAuthTypeFilter] = useState<AuthType | 'all'>('all');
  const [businessModeFilter, setBusinessModeFilter] = useState<BusinessMode | 'all'>('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock数据
  const [accounts] = useState<BigBAccount[]>([
    {
      id: 'BB-001',
      name: '华东渠道A',
      userType: 'travel_agent',
      authType: 'enterprise',
      businessMode: 'saas',
      accountStatus: 'active',
      contactInfo: {
        email: 'contact@huadong.com',
        phone: '138****5678',
      },
      registeredAt: '2024-01-15',
      lastLoginAt: '2024-11-13 10:30:00',
      businessStats: {
        totalSalesAmount: 500000,
        settledAmount: 100000,
        pendingAmount: 50000,
        accountBalance: 120000,
        availableBalance: 100000,
        frozenBalance: 20000,
        totalOrderCount: 150,
        totalCustomerCount: 80,
        refundRate: 4.0,
        monthlyAvgSales: 50000,
        registrationDays: 303,
      },
      canManageAffiliate: true,
      riskLevel: 'L1',
      settlementMode: 'batch',
    },
    {
      id: 'BB-002',
      name: '华北渠道B',
      userType: 'influencer',
      authType: 'individual',
      businessMode: 'mcp',
      accountStatus: 'active',
      contactInfo: {
        email: 'contact@huabei.com',
        phone: '139****1234',
      },
      registeredAt: '2024-03-20',
      lastLoginAt: '2024-11-12 15:20:00',
      businessStats: {
        totalSalesAmount: 300000,
        settledAmount: 60000,
        pendingAmount: 20000,
        accountBalance: 70000,
        availableBalance: 65000,
        frozenBalance: 5000,
        totalOrderCount: 90,
        totalCustomerCount: 45,
        refundRate: 3.3,
        monthlyAvgSales: 30000,
        registrationDays: 238,
      },
      canManageAffiliate: false,
      riskLevel: 'L0',
      settlementMode: 'per_order',
    },
    {
      id: 'BB-003',
      name: 'AIGO平台自营',
      userType: 'travel_agent',
      authType: 'enterprise',
      businessMode: 'platform_self_operated',
      accountStatus: 'active',
      contactInfo: {
        email: 'platform@aigo.com',
        phone: '400****8888',
      },
      registeredAt: '2023-12-01',
      lastLoginAt: '2024-11-13 09:00:00',
      businessStats: {
        totalSalesAmount: 1200000,
        settledAmount: 800000,
        pendingAmount: 150000,
        accountBalance: 850000,
        availableBalance: 800000,
        frozenBalance: 50000,
        totalOrderCount: 500,
        totalCustomerCount: 280,
        refundRate: 2.5,
        monthlyAvgSales: 120000,
        registrationDays: 348,
      },
      canManageAffiliate: true,
      riskLevel: 'L0',
      settlementMode: 'batch',
    },
  ]);

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

  const getBusinessModeBadge = (mode: BusinessMode) => {
    const config = {
      saas: { label: 'SaaS', className: 'bg-green-50 text-green-700 border-green-300' },
      mcp: { label: 'MCP', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      platform_self_operated: { label: '平台自营', className: 'bg-purple-50 text-purple-700 border-purple-300' },
    };
    const { label, className } = config[mode];
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
        account.contactInfo.email.includes(searchQuery) ||
        account.contactInfo.phone.includes(searchQuery);

      const matchesUserType = userTypeFilter === 'all' || account.userType === userTypeFilter;
      const matchesAuthType = authTypeFilter === 'all' || account.authType === authTypeFilter;
      const matchesBusinessMode = businessModeFilter === 'all' || account.businessMode === businessModeFilter;
      const matchesAccountStatus = accountStatusFilter === 'all' || account.accountStatus === accountStatusFilter;

      return matchesSearch && matchesUserType && matchesAuthType && matchesBusinessMode && matchesAccountStatus;
    });
  }, [accounts, searchQuery, userTypeFilter, authTypeFilter, businessModeFilter, accountStatusFilter]);

  const hasActiveFilters =
    userTypeFilter !== 'all' ||
    authTypeFilter !== 'all' ||
    businessModeFilter !== 'all' ||
    accountStatusFilter !== 'all';

  // 如果选中了账户，显示详情页
  if (selectedAccount) {
    return <BigBAccountDetail account={selectedAccount} onBack={() => setSelectedAccount(null)} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              大B账户列表
            </CardTitle>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="relative w-64 min-w-[16rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索大B名称、邮箱、手机号..."
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
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">业务模式</Label>
                  <Select value={businessModeFilter} onValueChange={(value: BusinessMode | 'all') => setBusinessModeFilter(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部模式</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="mcp">MCP</SelectItem>
                      <SelectItem value="platform_self_operated">平台自营</SelectItem>
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
                      setBusinessModeFilter('all');
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
        {/* 统计信息 */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">总大B数量</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{filteredAccounts.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">活跃大B数量</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {filteredAccounts.filter(a => a.accountStatus === 'active').length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">冻结大B数量</div>
            <div className="text-2xl font-bold text-yellow-700 mt-1">
              {filteredAccounts.filter(a => a.accountStatus === 'frozen').length}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">总累计销售额</div>
            <div className="text-2xl font-bold text-orange-700 mt-1">
              ¥{filteredAccounts.reduce((sum, a) => sum + a.businessStats.totalSalesAmount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">总账户余额</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              ¥{filteredAccounts.reduce((sum, a) => sum + a.businessStats.accountBalance, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">平均退款率</div>
            <div className="text-2xl font-bold text-gray-700 mt-1">
              {filteredAccounts.length > 0 
                ? (filteredAccounts.reduce((sum, a) => sum + a.businessStats.refundRate, 0) / filteredAccounts.length).toFixed(1)
                : '0.0'}%
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">高退款率大B数量</div>
            <div className="text-2xl font-bold text-red-700 mt-1">
              {filteredAccounts.filter(a => a.businessStats.refundRate > 5).length}
            </div>
          </div>
          <div className="bg-cyan-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">新注册大B数量</div>
            <div className="text-2xl font-bold text-cyan-700 mt-1">
              {filteredAccounts.filter(a => a.businessStats.registrationDays < 30).length}
            </div>
          </div>
        </div>

        <style>
          {`
            .bigb-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .bigb-table-container table td:last-child,
            .bigb-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.06);
            }
            .bigb-table-container table td,
            .bigb-table-container table th {
              white-space: nowrap;
            }
          `}
        </style>
        <div className="bigb-table-container overflow-x-auto border rounded-lg">
          <table className="border-collapse w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">大B名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户信息类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">认证方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">推广联盟权限</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">累计销售额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">已结算金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">待结金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">账户余额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">可提现金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">冻结金额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">累计订单数</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">累计客户数</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">退款率</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">月销售额</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">注册天数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后登录</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={19} className="px-4 py-10 text-center text-gray-500">
                    暂无大B账户数据
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{account.name}</td>
                    <td className="px-4 py-3 text-sm">{getUserTypeBadge(account.userType)}</td>
                    <td className="px-4 py-3 text-sm">{getAuthTypeBadge(account.authType)}</td>
                    <td className="px-4 py-3 text-sm">{getBusinessModeBadge(account.businessMode)}</td>
                    <td className="px-4 py-3 text-center text-sm">
                      {account.canManageAffiliate ? (
                        <span className="text-green-600 font-medium">✓</span>
                      ) : (
                        <span className="text-gray-400">×</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{getAccountStatusBadge(account.accountStatus)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      ¥{account.businessStats.totalSalesAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      ¥{account.businessStats.settledAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600">
                      ¥{account.businessStats.pendingAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      ¥{account.businessStats.accountBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      ¥{account.businessStats.availableBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">
                      ¥{account.businessStats.frozenBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {account.businessStats.totalOrderCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {account.businessStats.totalCustomerCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={account.businessStats.refundRate > 5 ? 'text-red-600 font-medium' : ''}>
                        {account.businessStats.refundRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      ¥{account.businessStats.monthlyAvgSales.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {account.businessStats.registrationDays}天
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {account.lastLoginAt || '-'}
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

        {filteredAccounts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredAccounts.length} 条记录
          </div>
        )}
      </CardContent>
    </Card>
  );
}
