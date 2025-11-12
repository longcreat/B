import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { BigBAccount, BigBBalanceDetail, BigBSettlementRecord, ManagedSmallB, UserType, AuthType, BusinessMode, AccountStatus, SettlementStatus } from './types';

interface BigBAccountDetailProps {
  account: BigBAccount;
  onBack: () => void;
}

export function BigBAccountDetail({ account, onBack }: BigBAccountDetailProps) {
  // Mock数据
  const balanceDetails: BigBBalanceDetail[] = [
    {
      orderId: 'ORD-2024-001',
      p2_orderAmount: 10000,
      totalRefund: 500,
      p1_distributionPrice: 9000,
      p0_supplierCost: 8000,
      totalCommission: 500,
      bigBDiscountContribution: 200,
      settlementAmount: 1300,
      settlementStatus: 'settled',
      settlementTime: '2024-01-15 10:30:00',
    },
  ];

  const settlementRecords: BigBSettlementRecord[] = [
    {
      id: 'BATCH-001',
      batchNumber: 'BATCH-2024-001',
      settlementAmount: 50000,
      settlementTime: '2024-01-15 10:30:00',
      settlementStatus: 'settled',
    },
  ];

  const managedSmallBs: ManagedSmallB[] = account.canManageAffiliate ? [
    {
      id: 'SB-001',
      name: '张三工作室',
      userType: 'travel_agent',
      authType: 'individual',
      mountedTime: '2024-01-01',
      accountStatus: 'active',
      totalOrderAmount: 50000,
      totalCommission: 5000,
      settledCommission: 3000,
      pendingCommission: 2000,
    },
  ] : [];

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

  const getSettlementStatusBadge = (status: SettlementStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Button>

      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">大B名称</label>
              <div className="mt-1 font-medium">{account.name}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">用户信息类型</label>
              <div className="mt-1">{getUserTypeBadge(account.userType)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">认证方式</label>
              <div className="mt-1">{getAuthTypeBadge(account.authType)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">业务模式</label>
              <div className="mt-1">{getBusinessModeBadge(account.businessMode)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">账户状态</label>
              <div className="mt-1">{getAccountStatusBadge(account.accountStatus)}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">联系邮箱</label>
              <div className="mt-1 font-medium">{account.contactInfo.email}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">联系电话</label>
              <div className="mt-1 font-medium">{account.contactInfo.phone}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结算统计卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>结算统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="text-sm text-gray-500">累计订单总金额</label>
              <div className="mt-1 text-2xl font-bold">¥{account.stats.totalOrderAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">累计订单总退款</label>
              <div className="mt-1 text-2xl font-bold text-red-600">¥{account.stats.totalRefund.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">累计应付账款</label>
              <div className="mt-1 text-2xl font-bold text-orange-600">¥{account.stats.totalPayable.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">已结算金额</label>
              <div className="mt-1 text-2xl font-bold text-green-600">¥{account.stats.settledAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">待结算金额</label>
              <div className="mt-1 text-2xl font-bold text-blue-600">¥{account.stats.pendingAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">累计订单佣金</label>
              <div className="mt-1 text-2xl font-bold text-purple-600">
                {account.stats.totalCommission > 0 ? `¥${account.stats.totalCommission.toLocaleString()}` : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详情Tab页 */}
      <Tabs defaultValue="balance" className="w-full">
        <TabsList>
          <TabsTrigger value="balance">余额明细</TabsTrigger>
          <TabsTrigger value="settlement">结算记录</TabsTrigger>
          {account.canManageAffiliate && <TabsTrigger value="smallb">管理的小B</TabsTrigger>}
        </TabsList>

        <TabsContent value="balance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>余额明细（按订单汇总）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead className="text-right">订单金额P2</TableHead>
                      <TableHead className="text-right">退款金额</TableHead>
                      <TableHead className="text-right">分销价P1</TableHead>
                      <TableHead className="text-right">底价P0</TableHead>
                      <TableHead className="text-right">订单佣金</TableHead>
                      <TableHead className="text-right">大B出资优惠</TableHead>
                      <TableHead className="text-right">结算金额</TableHead>
                      <TableHead>结算状态</TableHead>
                      <TableHead>结算时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceDetails.map((detail) => (
                      <TableRow key={detail.orderId}>
                        <TableCell className="font-medium">{detail.orderId}</TableCell>
                        <TableCell className="text-right">¥{detail.p2_orderAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-red-600">¥{detail.totalRefund.toLocaleString()}</TableCell>
                        <TableCell className="text-right">¥{detail.p1_distributionPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">¥{detail.p0_supplierCost.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-purple-600">
                          {detail.totalCommission > 0 ? `¥${detail.totalCommission.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">¥{detail.bigBDiscountContribution.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ¥{detail.settlementAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>{getSettlementStatusBadge(detail.settlementStatus)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{detail.settlementTime || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>结算记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>结算批次号</TableHead>
                      <TableHead className="text-right">结算金额</TableHead>
                      <TableHead>结算时间</TableHead>
                      <TableHead>结算状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlementRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.batchNumber}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ¥{record.settlementAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{record.settlementTime}</TableCell>
                        <TableCell>{getSettlementStatusBadge(record.settlementStatus)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {account.canManageAffiliate && (
          <TabsContent value="smallb" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>管理的小B情况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>小B名称</TableHead>
                        <TableHead>用户信息类型</TableHead>
                        <TableHead>认证方式</TableHead>
                        <TableHead>挂载时间</TableHead>
                        <TableHead>账户状态</TableHead>
                        <TableHead className="text-right">累计订单金额</TableHead>
                        <TableHead className="text-right">累计佣金</TableHead>
                        <TableHead className="text-right">已结算佣金</TableHead>
                        <TableHead className="text-right">待结算佣金</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {managedSmallBs.map((smallB) => (
                        <TableRow key={smallB.id}>
                          <TableCell className="font-medium">{smallB.name}</TableCell>
                          <TableCell>{getUserTypeBadge(smallB.userType)}</TableCell>
                          <TableCell>{getAuthTypeBadge(smallB.authType)}</TableCell>
                          <TableCell className="text-sm text-gray-600">{smallB.mountedTime}</TableCell>
                          <TableCell>{getAccountStatusBadge(smallB.accountStatus)}</TableCell>
                          <TableCell className="text-right">¥{smallB.totalOrderAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-purple-600">
                            ¥{smallB.totalCommission.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            ¥{smallB.settledCommission.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-blue-600">
                            ¥{smallB.pendingCommission.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
