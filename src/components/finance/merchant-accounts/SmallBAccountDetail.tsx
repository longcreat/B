import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { ArrowLeft, Search, Download, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import type { SmallBAccount, SmallBOrderDetail, SmallBCommissionRecord, SmallBSettlementOrderDetail, UserType, AuthType, AccountStatus, SettlementStatus, SettlementType } from './types';

interface SmallBAccountDetailProps {
  account: SmallBAccount;
  onBack: () => void;
}

export function SmallBAccountDetail({ account, onBack }: SmallBAccountDetailProps) {
  // 订单明细筛选状态
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSettlementStatusFilter, setOrderSettlementStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [orderDateRange, setOrderDateRange] = useState({ start: '', end: '' });

  // 佣金结算记录筛选状态
  const [commissionSearchQuery, setCommissionSearchQuery] = useState('');
  const [commissionSettlementStatusFilter, setCommissionSettlementStatusFilter] = useState<SettlementStatus | 'all'>('all');
  const [commissionSettlementTypeFilter, setCommissionSettlementTypeFilter] = useState<SettlementType | 'all'>('all');
  const [commissionDateRange, setCommissionDateRange] = useState({ start: '', end: '' });

  // 结算详情弹窗
  const [selectedSettlement, setSelectedSettlement] = useState<SmallBCommissionRecord | null>(null);

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
    {
      orderId: 'ORD-2024-002',
      p2_orderAmount: 3000,
      orderProfit: 500,
      commissionRate: 10,
      totalCommission: 300,
      settlementStatus: 'pending',
      settledBy: account.parentBigBName,
    },
  ];

  const commissionRecords: SmallBCommissionRecord[] = [
    {
      id: 'COMM-001',
      settlementType: 'batch',
      batchNumber: 'BATCH-2024-001',
      settlementAmount: 3000,
      settlementTime: '2024-01-15 10:30:00',
      settlementStatus: 'settled',
      settledBy: account.parentBigBName,
      orders: [
        { orderId: 'ORD-2024-001', orderAmount: 5000, totalCommission: 500, settlementAmount: 500 },
        { orderId: 'ORD-2024-003', orderAmount: 4000, totalCommission: 400, settlementAmount: 400 },
      ],
    },
    {
      id: 'COMM-002',
      settlementType: 'per_order',
      batchNumber: 'ORD-2024-005',
      settlementAmount: 600,
      settlementTime: '2024-01-16 14:20:00',
      settlementStatus: 'settled',
      settledBy: account.parentBigBName,
      orders: [
        { orderId: 'ORD-2024-005', orderAmount: 6000, totalCommission: 600, settlementAmount: 600 },
      ],
    },
  ];

  // 订单明细筛选
  const filteredOrders = orderDetails.filter((order) => {
    const matchesSearch = order.orderId.includes(orderSearchQuery);
    const matchesStatus = orderSettlementStatusFilter === 'all' || order.settlementStatus === orderSettlementStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // 佣金结算记录筛选
  const filteredCommissionRecords = commissionRecords.filter((record) => {
    const matchesSearch = record.batchNumber.includes(commissionSearchQuery);
    const matchesStatus = commissionSettlementStatusFilter === 'all' || record.settlementStatus === commissionSettlementStatusFilter;
    const matchesType = commissionSettlementTypeFilter === 'all' || record.settlementType === commissionSettlementTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
      settleable: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getSettlementTypeBadge = (type: SettlementType) => {
    const config = {
      batch: { label: '周期结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      per_order: { label: '按单结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[type];
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
            <div>
              <label className="text-sm text-gray-500">最近登录时间</label>
              <div className="mt-1 font-medium">{account.lastLoginAt || '-'}</div>
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
            <div>
              <label className="text-sm text-gray-500">佣金比例</label>
              <div className="mt-1 text-2xl font-bold text-purple-600">{account.stats.commissionRate}%</div>
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
              <div className="flex items-center justify-between">
                <CardTitle>订单明细</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索订单号..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={orderSettlementStatusFilter} onValueChange={(value: SettlementStatus | 'all') => setOrderSettlementStatusFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="结算状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待结算</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="settled">已结算</SelectItem>
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
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                          暂无订单数据
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((detail) => (
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>佣金结算记录</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索批次号/订单号..."
                      value={commissionSearchQuery}
                      onChange={(e) => setCommissionSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={commissionSettlementTypeFilter} onValueChange={(value: SettlementType | 'all') => setCommissionSettlementTypeFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="结算类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="batch">周期结算</SelectItem>
                      <SelectItem value="per_order">按单结算</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={commissionSettlementStatusFilter} onValueChange={(value: SettlementStatus | 'all') => setCommissionSettlementStatusFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="结算状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待结算</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="settled">已结算</SelectItem>
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
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>结算类型</TableHead>
                      <TableHead>结算批次号/订单号</TableHead>
                      <TableHead className="text-right">结算金额</TableHead>
                      <TableHead>结算时间</TableHead>
                      <TableHead>结算状态</TableHead>
                      <TableHead>结算方</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommissionRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                          暂无结算记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCommissionRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{getSettlementTypeBadge(record.settlementType)}</TableCell>
                          <TableCell className="font-medium">{record.batchNumber}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ¥{record.settlementAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{record.settlementTime}</TableCell>
                          <TableCell>{getSettlementStatusBadge(record.settlementStatus)}</TableCell>
                          <TableCell className="text-sm text-gray-600">{record.settledBy}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSettlement(record)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 结算详情弹窗 */}
      <Dialog open={!!selectedSettlement} onOpenChange={() => setSelectedSettlement(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>结算详情</DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">结算类型</label>
                  <div className="mt-1">{getSettlementTypeBadge(selectedSettlement.settlementType)}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    {selectedSettlement.settlementType === 'batch' ? '结算批次号' : '订单号'}
                  </label>
                  <div className="mt-1 font-medium">{selectedSettlement.batchNumber}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">结算金额</label>
                  <div className="mt-1 text-xl font-bold text-green-600">
                    ¥{selectedSettlement.settlementAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">结算状态</label>
                  <div className="mt-1">{getSettlementStatusBadge(selectedSettlement.settlementStatus)}</div>
                </div>
              </div>

              {selectedSettlement.orders && selectedSettlement.orders.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">订单明细</h4>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>订单号</TableHead>
                          <TableHead className="text-right">订单金额P2</TableHead>
                          <TableHead className="text-right">订单佣金</TableHead>
                          <TableHead className="text-right">结算金额</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSettlement.orders.map((order) => (
                          <TableRow key={order.orderId}>
                            <TableCell className="font-medium">{order.orderId}</TableCell>
                            <TableCell className="text-right">¥{order.orderAmount.toLocaleString()}</TableCell>
                            <TableCell className="text-right text-purple-600">
                              ¥{order.totalCommission.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              ¥{order.settlementAmount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSettlement(null)}>
                  关闭
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  导出详情
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
