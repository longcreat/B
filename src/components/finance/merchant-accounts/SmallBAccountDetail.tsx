import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import type { SmallBAccount, SmallBOrderDetail, SmallBCommissionRecord, UserType, AuthType, AccountStatus, SettlementStatus } from './types';

interface SmallBAccountDetailProps {
  account: SmallBAccount;
  onBack: () => void;
}

export function SmallBAccountDetail({ account, onBack }: SmallBAccountDetailProps) {
  // Mock数据
  const orderDetails: SmallBOrderDetail[] = [
    {
      orderId: 'ORD-2024-001',
      p2_orderAmount: 5000,
      orderProfit: 800,
      commissionRate: 10,
      totalCommission: 500,
      settlementStatus: 'settled',
      settlementTime: '2024-01-15 10:30:00',
      settledBy: account.parentBigBName,
    },
  ];

  const commissionRecords: SmallBCommissionRecord[] = [
    {
      id: 'COMM-001',
      batchNumber: 'COMM-2024-001',
      settlementAmount: 3000,
      settlementTime: '2024-01-15 10:30:00',
      settlementStatus: 'settled',
      settledBy: account.parentBigBName,
    },
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
              <label className="text-sm text-gray-500">小B名称</label>
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
              <label className="text-sm text-gray-500">挂载大B</label>
              <div className="mt-1 font-medium text-blue-600">{account.parentBigBName}</div>
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

      {/* 业务统计卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>业务统计</CardTitle>
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
              <label className="text-sm text-gray-500">累计订单总利润</label>
              <div className="mt-1 text-2xl font-bold text-green-600">¥{account.stats.totalProfit.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">累计订单总佣金</label>
              <div className="mt-1 text-2xl font-bold text-purple-600">¥{account.stats.totalCommission.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">已结算佣金</label>
              <div className="mt-1 text-2xl font-bold text-green-600">¥{account.stats.settledCommission.toLocaleString()}</div>
              <div className="mt-1 text-xs text-gray-500">结算方：{account.parentBigBName}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">待结算佣金</label>
              <div className="mt-1 text-2xl font-bold text-blue-600">¥{account.stats.pendingCommission.toLocaleString()}</div>
              <div className="mt-1 text-xs text-gray-500">结算方：{account.parentBigBName}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详情Tab页 */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">订单明细</TabsTrigger>
          <TabsTrigger value="commission">佣金结算记录</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>订单明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead className="text-right">订单金额P2</TableHead>
                      <TableHead className="text-right">订单利润</TableHead>
                      <TableHead className="text-right">佣金率</TableHead>
                      <TableHead className="text-right">订单佣金</TableHead>
                      <TableHead>结算状态</TableHead>
                      <TableHead>结算时间</TableHead>
                      <TableHead>结算方</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.map((detail) => (
                      <TableRow key={detail.orderId}>
                        <TableCell className="font-medium">{detail.orderId}</TableCell>
                        <TableCell className="text-right">¥{detail.p2_orderAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">¥{detail.orderProfit.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{detail.commissionRate}%</TableCell>
                        <TableCell className="text-right font-medium text-purple-600">
                          ¥{detail.totalCommission.toLocaleString()}
                        </TableCell>
                        <TableCell>{getSettlementStatusBadge(detail.settlementStatus)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{detail.settlementTime || '-'}</TableCell>
                        <TableCell className="text-sm text-gray-600">{detail.settledBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>佣金结算记录</CardTitle>
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
                      <TableHead>结算方</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.batchNumber}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ¥{record.settlementAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{record.settlementTime}</TableCell>
                        <TableCell>{getSettlementStatusBadge(record.settlementStatus)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{record.settledBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
