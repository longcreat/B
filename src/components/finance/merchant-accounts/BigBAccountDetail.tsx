import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Checkbox } from '../../ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { 
  BigBAccount, 
  BigBOrderDetail,
  BigBSettlementBatch,
  BigBSettlementRecord,
  BigBBalanceDetail,
  ManagedSmallB, 
  UserType, 
  AuthType, 
  BusinessMode, 
  AccountStatus, 
  SettlementStatus,
  OrderType,
  BalanceChangeType 
} from './types';

interface BigBAccountDetailProps {
  account: BigBAccount;
  onBack: () => void;
}

export function BigBAccountDetail({ account, onBack }: BigBAccountDetailProps) {
  // Mock数据 - 订单明细
  const orderDetails: BigBOrderDetail[] = [
    {
      orderId: 'ORD-2024-001',
      orderType: 'direct',
      orderAmount: 10000,
      refundAmount: 500,
      settlementAmount: 1300,
      orderStatus: '已完成',
      settlementStatus: 'settled',
      orderTime: '2024-01-15 10:30:00',
      settlementTime: '2024-01-20 14:20:00',
    },
    {
      orderId: 'ORD-2024-002',
      orderType: 'smallb_promotion',
      orderAmount: 8000,
      refundAmount: 0,
      settlementAmount: 1000,
      orderStatus: '已完成',
      settlementStatus: 'settleable',
      orderTime: '2024-01-16 11:00:00',
    },
  ];

  // Mock数据 - 结算批次（周期结算模式）
  const settlementBatches: BigBSettlementBatch[] = account.settlementMode === 'batch' ? [
    {
      batchId: 'BATCH-001',
      batchNumber: 'BATCH-2024-001',
      settlementAmount: 50000,
      orderCount: 25,
      status: 'settled',
      createdAt: '2024-01-15 10:00:00',
      settledAt: '2024-01-15 15:30:00',
      operator: '系统管理员',
    },
  ] : [];

  // Mock数据 - 结算记录（按单结算模式）
  const settlementRecords: BigBSettlementRecord[] = account.settlementMode === 'per_order' ? [
    {
      id: 'SETTLE-001',
      orderId: 'ORD-2024-001',
      settlementAmount: 1300,
      settlementTime: '2024-01-20 14:20:00',
      settlementStatus: 'settled',
      operator: '系统管理员',
    },
  ] : [];

  // Mock数据 - 月度GMV汇总
  const monthlyGMVData = [
    { month: '2024-05', gmv: 45000 },
    { month: '2024-06', gmv: 52000 },
    { month: '2024-07', gmv: 48000 },
    { month: '2024-08', gmv: 61000 },
    { month: '2024-09', gmv: 58000 },
    { month: '2024-10', gmv: 67000 },
    { month: '2024-11', gmv: 72000 },
  ];

  // Mock数据 - 余额明细
  const balanceDetails: BigBBalanceDetail[] = [
    {
      id: 'BAL-001',
      changeTime: '2024-01-20 14:20:00',
      changeType: 'income',
      changeAmount: 1300,
      balanceBefore: 118700,
      balanceAfter: 120000,
      relatedOrderId: 'ORD-2024-001',
      operator: '系统自动',
      remark: '订单结算收入',
    },
    {
      id: 'BAL-002',
      changeTime: '2024-01-19 10:30:00',
      changeType: 'freeze',
      changeAmount: 5000,
      balanceBefore: 120000,
      balanceAfter: 120000,
      operator: '财务人员',
      remark: '提现申请冻结',
    },
  ];

  const initialSmallBs = useMemo<ManagedSmallB[]>(
    () =>
      account.canManageAffiliate
        ? [
    {
      id: 'SB-001',
      name: '张三工作室',
      userType: 'travel_agent',
      authType: 'individual',
      mountedTime: '2024-01-01',
      accountStatus: 'active',
      currentCommissionRate: 5.0,
      shopConfigEnabled: true,
      totalOrderAmount: 50000,
      totalCommission: 2500,
      settledCommission: 2000,
      pendingCommission: 500,
    },
    {
      id: 'SB-002',
      name: '李四旅游工作室',
      userType: 'influencer',
      authType: 'individual',
      mountedTime: '2024-02-15',
      accountStatus: 'active',
      currentCommissionRate: 4.5,
      shopConfigEnabled: false,
      totalOrderAmount: 30000,
      totalCommission: 1350,
      settledCommission: 1000,
      pendingCommission: 350,
    },
        ]
        : [],
    [account.canManageAffiliate],
  );

  const [smallBs, setSmallBs] = useState<ManagedSmallB[]>(initialSmallBs);
  const [selectedSmallBs, setSelectedSmallBs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSmallBs(initialSmallBs);
    setSelectedSmallBs(new Set());
  }, [initialSmallBs]);

  useEffect(() => {
    setSelectedSmallBs((prev) => {
      if (prev.size === 0) return prev;
      const validIds = new Set(initialSmallBs.map((sb) => sb.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (validIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [initialSmallBs]);

  // 批量操作Modal状态
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showShopConfigModal, setShowShopConfigModal] = useState(false);
  const [commissionRateInput, setCommissionRateInput] = useState('');
  const [commissionReason, setCommissionReason] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');
  const [activateReason, setActivateReason] = useState('');
  const [shopConfigEnabledTarget, setShopConfigEnabledTarget] = useState(true);
  const [shopConfigReason, setShopConfigReason] = useState('');

  const selectedSmallBList = useMemo(
    () => smallBs.filter((sb) => selectedSmallBs.has(sb.id)),
    [smallBs, selectedSmallBs],
  );
  const hasSelection = selectedSmallBList.length > 0;
  const selectAllChecked = smallBs.length > 0 && selectedSmallBs.size === smallBs.length;
  const canDeactivate = selectedSmallBList.some((sb) => sb.accountStatus === 'active');
  const canActivate = selectedSmallBList.some((sb) => sb.accountStatus === 'frozen');

  const totalCommissionAmount = useMemo(
    () => smallBs.reduce((sum, sb) => sum + sb.totalCommission, 0),
    [smallBs],
  );
  const totalSettledCommission = useMemo(
    () => smallBs.reduce((sum, sb) => sum + sb.settledCommission, 0),
    [smallBs],
  );
  const totalPendingCommission = useMemo(
    () => smallBs.reduce((sum, sb) => sum + sb.pendingCommission, 0),
    [smallBs],
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSmallBs(new Set(smallBs.map((sb) => sb.id)));
    } else {
      setSelectedSmallBs(new Set());
    }
  };

  const handleSelectSmallB = (smallBId: string, checked: boolean) => {
    setSelectedSmallBs((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(smallBId);
      } else {
        next.delete(smallBId);
      }
      return next;
    });
  };

  const handleBatchCommissionAdjust = () => {
    if (!hasSelection) return;
    setCommissionRateInput('');
    setCommissionReason('');
    setShowCommissionModal(true);
  };

  const handleBatchDeactivate = () => {
    if (!canDeactivate) return;
    setDeactivateReason('');
    setShowDeactivateModal(true);
  };

  const handleBatchActivate = () => {
    if (!canActivate) return;
    setActivateReason('');
    setShowActivateModal(true);
  };

  const handleBatchShopConfig = () => {
    if (!hasSelection) return;
    const firstSelected = selectedSmallBList[0];
    setShopConfigEnabledTarget(firstSelected?.shopConfigEnabled ?? true);
    setShopConfigReason('');
    setShowShopConfigModal(true);
  };

  const applyCommissionAdjust = () => {
    const rate = Number(commissionRateInput);
    if (Number.isNaN(rate) || rate <= 0) return;
    setSmallBs((prev) =>
      prev.map((sb) =>
        selectedSmallBs.has(sb.id)
          ? {
              ...sb,
              currentCommissionRate: rate,
            }
          : sb,
      ),
    );
    setShowCommissionModal(false);
    setCommissionRateInput('');
    setCommissionReason('');
  };

  const applyDeactivate = () => {
    if (deactivateReason.trim().length < 5) return;
    setSmallBs((prev) =>
      prev.map((sb) =>
        selectedSmallBs.has(sb.id)
          ? {
              ...sb,
              accountStatus: 'frozen',
            }
          : sb,
      ),
    );
    setShowDeactivateModal(false);
    setDeactivateReason('');
  };

  const applyActivate = () => {
    if (activateReason.trim().length < 5) return;
    setSmallBs((prev) =>
      prev.map((sb) =>
        selectedSmallBs.has(sb.id)
          ? {
              ...sb,
              accountStatus: 'active',
            }
          : sb,
      ),
    );
    setShowActivateModal(false);
    setActivateReason('');
  };

  const applyShopConfig = () => {
    if (shopConfigReason.trim().length < 5) return;
    setSmallBs((prev) =>
      prev.map((sb) =>
        selectedSmallBs.has(sb.id)
          ? {
              ...sb,
              shopConfigEnabled: shopConfigEnabledTarget,
            }
          : sb,
      ),
    );
    setShowShopConfigModal(false);
    setShopConfigReason('');
  };

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

  const getOrderTypeBadge = (type: OrderType) => {
    const config = {
      direct: { label: '直接订单', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      smallb_promotion: { label: '小B推广订单', className: 'bg-purple-50 text-purple-700 border-purple-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getBalanceChangeTypeBadge = (type: BalanceChangeType) => {
    const config = {
      income: { label: '收入', className: 'bg-green-50 text-green-700 border-green-300' },
      expense: { label: '支出', className: 'bg-red-50 text-red-700 border-red-300' },
      freeze: { label: '冻结', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      unfreeze: { label: '解冻', className: 'bg-blue-50 text-blue-700 border-blue-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getShopConfigBadge = (enabled: boolean) => (
    <Badge variant="outline" className={enabled ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-600 border-gray-300'}>
      {enabled ? '已开启' : '未开启'}
    </Badge>
  );

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
      processing: { label: '处理中', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <button onClick={onBack} className="hover:text-blue-600">财务中心</button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <button onClick={onBack} className="hover:text-blue-600">大B账户</button>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{account.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Button>
      </div>

      {/* 基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
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
              <label className="text-sm text-gray-500">风控等级</label>
              <div className="mt-1">
                <Badge variant="outline" className={account.riskLevel === 'L0' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-yellow-50 text-yellow-700 border-yellow-300'}>
                  {account.riskLevel}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">结算模式</label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {account.settlementMode === 'batch' ? '周期结算' : '按单结算'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">推广联盟权限</label>
              <div className="mt-1">
                {account.canManageAffiliate ? (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />已开启
                  </span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />未开启
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">注册时间</label>
              <div className="mt-1 text-sm">{account.registeredAt}</div>
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
              <label className="text-sm text-gray-500">最后登录时间</label>
              <div className="mt-1 text-sm text-gray-600">{account.lastLoginAt || '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 业务概览卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>业务概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="text-sm text-gray-500">累计销售额</label>
              <div className="mt-1 text-2xl font-bold">¥{account.businessStats.totalSalesAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">已结算金额</label>
              <div className="mt-1 text-2xl font-bold text-green-600">¥{account.businessStats.settledAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">待结金额</label>
              <div className="mt-1 text-2xl font-bold text-blue-600">¥{account.businessStats.pendingAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">账户余额</label>
              <div className="mt-1 text-2xl font-bold text-purple-600">¥{account.businessStats.accountBalance.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 月度GMV汇总卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>月度GMV汇总</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* GMV统计数据 */}
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-500">近7月总GMV</label>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  ¥{monthlyGMVData.reduce((sum, item) => sum + item.gmv, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">月均GMV</label>
                <div className="mt-1 text-2xl font-bold text-green-600">
                  ¥{Math.round(monthlyGMVData.reduce((sum, item) => sum + item.gmv, 0) / monthlyGMVData.length).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">最高月GMV</label>
                <div className="mt-1 text-2xl font-bold text-purple-600">
                  ¥{Math.max(...monthlyGMVData.map(item => item.gmv)).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">环比增长</label>
                <div className="mt-1 text-2xl font-bold text-orange-600">
                  {monthlyGMVData.length >= 2 
                    ? ((monthlyGMVData[monthlyGMVData.length - 1].gmv - monthlyGMVData[monthlyGMVData.length - 2].gmv) / monthlyGMVData[monthlyGMVData.length - 2].gmv * 100).toFixed(1)
                    : '0.0'}%
                </div>
              </div>
            </div>

            {/* GMV趋势曲线图 */}
            <div>
              <label className="text-sm text-gray-500 mb-3 block">GMV趋势</label>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGMVData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`¥${value.toLocaleString()}`, 'GMV']}
                    labelStyle={{ color: '#666' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gmv" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 结算概览卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>结算概览（{account.settlementMode === 'batch' ? '周期结算模式' : '按单结算模式'}）</CardTitle>
        </CardHeader>
        <CardContent>
          {account.settlementMode === 'batch' ? (
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-500">本期应付</label>
                <div className="mt-1 text-2xl font-bold text-orange-600">¥{account.businessStats.pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">当前周期应结算给大B的金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">已结算</label>
                <div className="mt-1 text-2xl font-bold text-green-600">¥{account.businessStats.settledAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">本周期已结算的金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">待结算</label>
                <div className="mt-1 text-2xl font-bold text-blue-600">¥{account.businessStats.pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">本周期待结算的金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">在途提现</label>
                <div className="mt-1 text-2xl font-bold text-gray-600">¥{account.businessStats.frozenBalance.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">申请提现但未完成的金额</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-500">本期应付</label>
                <div className="mt-1 text-2xl font-bold text-orange-600">¥{account.businessStats.pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">当前可结算的订单总金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">已结算</label>
                <div className="mt-1 text-2xl font-bold text-green-600">¥{account.businessStats.settledAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">今日已结算的订单总金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">待结算</label>
                <div className="mt-1 text-2xl font-bold text-blue-600">¥{account.businessStats.pendingAmount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">累计待结算的订单总金额</div>
              </div>
              <div>
                <label className="text-sm text-gray-500">在途提现</label>
                <div className="mt-1 text-2xl font-bold text-gray-600">¥{account.businessStats.frozenBalance.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">申请提现但未完成的金额</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详情Tab页 */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">订单明细</TabsTrigger>
          <TabsTrigger value="balance">余额明细</TabsTrigger>
          {account.settlementMode === 'batch' && <TabsTrigger value="batches">结算批次列表</TabsTrigger>}
          {account.settlementMode === 'per_order' && <TabsTrigger value="records">结算记录</TabsTrigger>}
          {account.canManageAffiliate && <TabsTrigger value="smallb">小B监管</TabsTrigger>}
        </TabsList>

        {/* 订单明细Tab */}
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
                      <TableHead>订单类型</TableHead>
                      <TableHead className="text-right">订单金额P2</TableHead>
                      <TableHead className="text-right">退款金额</TableHead>
                      <TableHead className="text-right">结算金额</TableHead>
                      <TableHead>订单状态</TableHead>
                      <TableHead>结算状态</TableHead>
                      <TableHead>订单时间</TableHead>
                      {account.settlementMode === 'per_order' && <TableHead>操作</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>{getOrderTypeBadge(order.orderType)}</TableCell>
                        <TableCell className="text-right">¥{order.orderAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-red-600">
                          {order.refundAmount > 0 ? `¥${order.refundAmount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ¥{order.settlementAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{order.orderStatus}</TableCell>
                        <TableCell>{getSettlementStatusBadge(order.settlementStatus)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{order.orderTime}</TableCell>
                        {account.settlementMode === 'per_order' && (
                          <TableCell>
                            {order.settlementStatus === 'settleable' && (
                              <Button variant="outline" size="sm">
                                立即结算
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 余额明细Tab */}
        <TabsContent value="balance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>余额明细</CardTitle>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">当前余额：</span>
                    <span className="font-bold text-purple-600">¥{account.businessStats.accountBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">可提现余额：</span>
                    <span className="font-bold text-green-600">¥{account.businessStats.availableBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">冻结余额：</span>
                    <span className="font-bold text-orange-600">¥{account.businessStats.frozenBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>变动时间</TableHead>
                      <TableHead>变动类型</TableHead>
                      <TableHead className="text-right">变动金额</TableHead>
                      <TableHead className="text-right">变动前余额</TableHead>
                      <TableHead className="text-right">变动后余额</TableHead>
                      <TableHead>关联订单号</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="text-sm text-gray-600">{detail.changeTime}</TableCell>
                        <TableCell>{getBalanceChangeTypeBadge(detail.changeType)}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={detail.changeType === 'income' ? 'text-green-600' : detail.changeType === 'expense' ? 'text-red-600' : ''}>
                            {detail.changeType === 'income' ? '+' : detail.changeType === 'expense' ? '-' : ''}¥{detail.changeAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">¥{detail.balanceBefore.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">¥{detail.balanceAfter.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{detail.relatedOrderId || '-'}</TableCell>
                        <TableCell className="text-sm">{detail.operator}</TableCell>
                        <TableCell className="text-sm text-gray-600">{detail.remark || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 结算批次列表Tab（仅周期结算模式显示） */}
        {account.settlementMode === 'batch' && (
          <TabsContent value="batches" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>结算批次列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>结算批次号</TableHead>
                        <TableHead className="text-right">结算金额</TableHead>
                        <TableHead className="text-right">订单数量</TableHead>
                        <TableHead>结算状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>结算时间</TableHead>
                        <TableHead>操作人</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlementBatches.map((batch) => (
                        <TableRow key={batch.batchId}>
                          <TableCell className="font-medium">{batch.batchNumber}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ¥{batch.settlementAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">{batch.orderCount}</TableCell>
                          <TableCell>{getSettlementStatusBadge(batch.status)}</TableCell>
                          <TableCell className="text-sm text-gray-600">{batch.createdAt}</TableCell>
                          <TableCell className="text-sm text-gray-600">{batch.settledAt || '-'}</TableCell>
                          <TableCell className="text-sm">{batch.operator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* 结算记录Tab（仅按单结算模式显示） */}
        {account.settlementMode === 'per_order' && (
          <TabsContent value="records" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>结算记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单号</TableHead>
                        <TableHead className="text-right">结算金额</TableHead>
                        <TableHead>结算时间</TableHead>
                        <TableHead>结算状态</TableHead>
                        <TableHead>操作人</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlementRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.orderId}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            ¥{record.settlementAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{record.settlementTime}</TableCell>
                          <TableCell>{getSettlementStatusBadge(record.settlementStatus)}</TableCell>
                          <TableCell className="text-sm">{record.operator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {account.canManageAffiliate && (
          <TabsContent value="smallb" className="mt-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">累计佣金总额</div>
                  <div className="text-2xl font-bold text-purple-600 mt-2">
                    ¥{totalCommissionAmount.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">已结算佣金总额</div>
                  <div className="text-2xl font-bold text-green-600 mt-2">
                    ¥{totalSettledCommission.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500">待结算佣金总额</div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    ¥{totalPendingCommission.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>管理的小B情况</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">已选择 {selectedSmallBs.size} 个小B</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchCommissionAdjust}
                      disabled={!hasSelection}
                    >
                      批量调整佣金率
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchDeactivate}
                      disabled={!canDeactivate}
                    >
                      批量停用
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchActivate}
                      disabled={!canActivate}
                    >
                      批量启用
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBatchShopConfig}
                      disabled={!hasSelection}
                    >
                      批量设置店铺配置权限
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {smallBs.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">暂无小B数据</div>
                ) : (
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectAllChecked}
                              onCheckedChange={(value: CheckedState) => handleSelectAll(Boolean(value))}
                            />
                          </TableHead>
                          <TableHead>小B名称</TableHead>
                          <TableHead>用户信息类型</TableHead>
                          <TableHead>认证方式</TableHead>
                          <TableHead>挂载时间</TableHead>
                          <TableHead>账户状态</TableHead>
                          <TableHead className="text-right">当前佣金比例</TableHead>
                          <TableHead className="text-right">累计佣金金额</TableHead>
                          <TableHead className="text-right">已结算佣金</TableHead>
                          <TableHead className="text-right">待结算佣金</TableHead>
                          <TableHead className="text-center">店铺配置权限</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {smallBs.map((smallB) => (
                          <TableRow key={smallB.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedSmallBs.has(smallB.id)}
                                onCheckedChange={(value: CheckedState) => handleSelectSmallB(smallB.id, value === true)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{smallB.name}</TableCell>
                            <TableCell>{getUserTypeBadge(smallB.userType)}</TableCell>
                            <TableCell>{getAuthTypeBadge(smallB.authType)}</TableCell>
                            <TableCell className="text-sm text-gray-600">{smallB.mountedTime}</TableCell>
                            <TableCell>{getAccountStatusBadge(smallB.accountStatus)}</TableCell>
                            <TableCell className="text-right font-medium">{smallB.currentCommissionRate.toFixed(1)}%</TableCell>
                            <TableCell className="text-right text-purple-600">
                              ¥{smallB.totalCommission.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              ¥{smallB.settledCommission.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-blue-600">
                              ¥{smallB.pendingCommission.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center">{getShopConfigBadge(smallB.shopConfigEnabled)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* 批量调整佣金率 */}
      <Dialog open={showCommissionModal} onOpenChange={setShowCommissionModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>批量调整佣金率</DialogTitle>
            <DialogDescription>
              选中小B数量：{selectedSmallBs.size} 个。调整后的佣金率将覆盖所有选中的小B。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="commissionRate">新的佣金率（%）</Label>
              <Input
                id="commissionRate"
                type="number"
                min={0}
                step="0.1"
                value={commissionRateInput}
                onChange={(e) => setCommissionRateInput(e.target.value)}
                placeholder="如：5.0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commissionReason">调整原因</Label>
              <Textarea
                id="commissionReason"
                rows={4}
                value={commissionReason}
                onChange={(e) => setCommissionReason(e.target.value)}
                placeholder="请填写不少于5个字的调整原因"
              />
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600">
              <div className="font-medium text-gray-700 mb-1">选中的小B：</div>
              {selectedSmallBList.length === 0 ? '暂无' : selectedSmallBList.map((sb) => sb.name).join('、')}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionModal(false)}>
              取消
            </Button>
            <Button
              onClick={applyCommissionAdjust}
              disabled={Number.isNaN(Number(commissionRateInput)) || Number(commissionRateInput) <= 0 || commissionReason.trim().length < 5}
            >
              确认调整
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量停用 */}
      <Dialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>批量停用小B</DialogTitle>
            <DialogDescription>
              将选中的小B账户状态设置为冻结，请填写停用原因。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="deactivateReason">停用原因</Label>
              <Textarea
                id="deactivateReason"
                rows={4}
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="请填写不少于5个字的停用原因"
              />
            </div>
            <div className="rounded-md bg-yellow-50 p-3 text-xs text-yellow-700">
              高风险操作，请确认信息准确后再执行。
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateModal(false)}>
              取消
            </Button>
            <Button onClick={applyDeactivate} disabled={deactivateReason.trim().length < 5}>
              确认停用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量启用 */}
      <Dialog open={showActivateModal} onOpenChange={setShowActivateModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>批量启用小B</DialogTitle>
            <DialogDescription>将选中的冻结状态小B重新启用。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="activateReason">启用原因</Label>
              <Textarea
                id="activateReason"
                rows={4}
                value={activateReason}
                onChange={(e) => setActivateReason(e.target.value)}
                placeholder="请填写不少于5个字的启用原因"
              />
            </div>
            <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700">
              启用后小B可以恢复业务操作。
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActivateModal(false)}>
              取消
            </Button>
            <Button onClick={applyActivate} disabled={activateReason.trim().length < 5}>
              确认启用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 批量设置店铺配置权限 */}
      <Dialog open={showShopConfigModal} onOpenChange={setShowShopConfigModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>批量设置店铺配置权限</DialogTitle>
            <DialogDescription>
              控制选中小B是否可以使用店铺配置功能。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">允许使用店铺配置功能</Label>
              <Switch
                checked={shopConfigEnabledTarget}
                onCheckedChange={(checked) => setShopConfigEnabledTarget(Boolean(checked))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shopConfigReason">设置原因</Label>
              <Textarea
                id="shopConfigReason"
                rows={4}
                value={shopConfigReason}
                onChange={(e) => setShopConfigReason(e.target.value)}
                placeholder="请填写不少于5个字的原因"
              />
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-600">
              <div className="font-medium text-gray-700 mb-1">选中的小B：</div>
              {selectedSmallBList.length === 0 ? '暂无' : selectedSmallBList.map((sb) => sb.name).join('、')}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShopConfigModal(false)}>
              取消
            </Button>
            <Button onClick={applyShopConfig} disabled={shopConfigReason.trim().length < 5}>
              确认设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
