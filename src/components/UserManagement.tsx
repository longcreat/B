import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Search,
  User,
  Building2,
  Users,
  Eye,
  Ban,
  CheckCircle,
  Wallet,
  Settings,
  TrendingUp,
  Store,
  Edit,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 小B用户类型
type PartnerType = 'individual' | 'influencer' | 'enterprise';

// 小B用户账户状态
type AccountStatus = 'active' | 'frozen' | 'closed';

// 结算状态
type SettlementStatus = 'normal' | 'on-hold';

// 权限等级
type PermissionLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

// 小B用户数据结构
interface Partner {
  id: string;
  type: PartnerType;
  
  // 基本信息
  displayName: string; // 显示名称（个人姓名、博主昵称、企业名称）
  email: string;
  phone: string;
  
  // 认证信息
  certificationStatus: 'pending' | 'approved' | 'rejected';
  certifiedAt?: string;
  
  // 账户状态
  accountStatus: AccountStatus;
  settlementStatus: SettlementStatus;
  
  // 权限等级
  permissionLevel: PermissionLevel;
  
  // 财务数据
  financialData: {
    totalRevenue: number; // 总交易额（P2）
    totalProfit: number; // 累计利润
    availableBalance: number; // 可用余额
    pendingSettlement: number; // 待结算
    withdrawnAmount: number; // 已提取
  };
  
  // 业务数据
  businessData: {
    totalOrders: number; // 订单总数
    completedOrders: number; // 已完成订单
    avgMarkupRate: number; // 平均加价率
    activeCustomers: number; // 活跃客户数
  };
  
  // 类型特有信息
  specificInfo: {
    // 个人
    realName?: string;
    idNumber?: string;
    
    // 博主
    platformName?: string;
    followersCount?: number;
    influenceScore?: number;
    
    // 企业
    companyName?: string;
    socialCreditCode?: string;
    legalRepresentative?: string;
    registeredCapital?: string;
  };
  
  // 店铺信息
  storeConfig?: {
    storeName: string;
    customDomain?: string;
    status: 'active' | 'inactive';
  };
  
  registeredAt: string;
  lastLoginAt?: string;
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | PartnerType>('all');
  const [filterAccountStatus, setFilterAccountStatus] = useState<'all' | AccountStatus>('all');
  const [filterSettlementStatus, setFilterSettlementStatus] = useState<'all' | SettlementStatus>('all');
  const [filterPermissionLevel, setFilterPermissionLevel] = useState<'all' | PermissionLevel>('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusAction, setStatusAction] = useState<'freeze' | 'activate' | 'close' | null>(null);
  const [statusReason, setStatusReason] = useState('');
  
  // 风控等级编辑
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [newPermissionLevel, setNewPermissionLevel] = useState<PermissionLevel>('L4');
  const [levelChangeReason, setLevelChangeReason] = useState('');

  // 模拟小B用户数据
  const partners: Partner[] = [
    {
      id: 'P001',
      type: 'individual',
      displayName: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      certificationStatus: 'approved',
      certifiedAt: '2025-10-20 15:30:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L3',
      financialData: {
        totalRevenue: 156800,
        totalProfit: 15680,
        availableBalance: 2580.50,
        pendingSettlement: 856.20,
        withdrawnAmount: 12243.30,
      },
      businessData: {
        totalOrders: 156,
        completedOrders: 142,
        avgMarkupRate: 10,
        activeCustomers: 48,
      },
      specificInfo: {
        realName: '张三',
        idNumber: '110101199001011234',
      },
      storeConfig: {
        storeName: '张三的旅游工作室',
        customDomain: 'zhangsan.aigohotel.com',
        status: 'active',
      },
      registeredAt: '2025-10-18 10:30:00',
      lastLoginAt: '2025-10-31 09:15:00',
    },
    {
      id: 'P002',
      type: 'influencer',
      displayName: '旅游达人小李',
      email: 'lisi@example.com',
      phone: '13900139000',
      certificationStatus: 'approved',
      certifiedAt: '2025-10-22 11:20:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L1',
      financialData: {
        totalRevenue: 568900,
        totalProfit: 56890,
        availableBalance: 8560.80,
        pendingSettlement: 2340.50,
        withdrawnAmount: 45989.50,
      },
      businessData: {
        totalOrders: 423,
        completedOrders: 398,
        avgMarkupRate: 12,
        activeCustomers: 256,
      },
      specificInfo: {
        realName: '李四',
        idNumber: '110101199201021234',
        platformName: '抖音、小红书',
        followersCount: 158000,
        influenceScore: 85,
      },
      storeConfig: {
        storeName: '小李的环球旅行',
        customDomain: 'xiaoli.aigohotel.com',
        status: 'active',
      },
      registeredAt: '2025-10-20 14:20:00',
      lastLoginAt: '2025-10-31 08:45:00',
    },
    {
      id: 'P003',
      type: 'enterprise',
      displayName: '某某商旅服务有限公司',
      email: 'business@example.com',
      phone: '010-12345678',
      certificationStatus: 'approved',
      certifiedAt: '2025-10-25 16:00:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L0',
      financialData: {
        totalRevenue: 1256800,
        totalProfit: 125680,
        availableBalance: 15680.50,
        pendingSettlement: 5670.20,
        withdrawnAmount: 104329.30,
      },
      businessData: {
        totalOrders: 856,
        completedOrders: 798,
        avgMarkupRate: 15,
        activeCustomers: 128,
      },
      specificInfo: {
        companyName: '某某商旅服务有限公司',
        socialCreditCode: '91110000MA01ABCD1E',
        legalRepresentative: '王五',
        registeredCapital: '500万元',
      },
      storeConfig: {
        storeName: '某某商旅预订中心',
        status: 'active',
      },
      registeredAt: '2025-10-23 09:00:00',
      lastLoginAt: '2025-10-31 10:30:00',
    },
    {
      id: 'P004',
      type: 'individual',
      displayName: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13700137000',
      certificationStatus: 'approved',
      certifiedAt: '2025-10-26 10:15:00',
      accountStatus: 'frozen',
      settlementStatus: 'on-hold',
      permissionLevel: 'L0',
      financialData: {
        totalRevenue: 45600,
        totalProfit: 4560,
        availableBalance: 1200.00,
        pendingSettlement: 0,
        withdrawnAmount: 3360.00,
      },
      businessData: {
        totalOrders: 45,
        completedOrders: 42,
        avgMarkupRate: 8,
        activeCustomers: 15,
      },
      specificInfo: {
        realName: '赵六',
        idNumber: '110101199501011234',
      },
      registeredAt: '2025-10-24 11:30:00',
      lastLoginAt: '2025-10-28 15:20:00',
    },
  ];

  const getTypeIcon = (type: PartnerType) => {
    switch (type) {
      case 'individual':
        return <User className="w-4 h-4" />;
      case 'influencer':
        return <TrendingUp className="w-4 h-4" />;
      case 'enterprise':
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: PartnerType) => {
    switch (type) {
      case 'individual':
        return '个人';
      case 'influencer':
        return '博主';
      case 'enterprise':
        return '企业';
    }
  };

  const getTypeBadge = (type: PartnerType) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      enterprise: { label: '企业', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[type];
    return (
      <Badge variant="outline" className={className}>
        <span className="mr-1">{getTypeIcon(type)}</span>
        {label}
      </Badge>
    );
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
      normal: { label: '正常结算', className: 'bg-green-50 text-green-700 border-green-300' },
      'on-hold': { label: '暂停结算', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getPermissionLevelBadge = (level: PermissionLevel) => {
    const config = {
      L0: { label: 'L0', className: 'bg-red-50 text-red-700 border-red-300' },
      L1: { label: 'L1', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      L2: { label: 'L2', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      L3: { label: 'L3', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      L4: { label: 'L4', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[level];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getPermissionLevelName = (level: PermissionLevel) => {
    const names = {
      L0: 'L0 (战略级 - 最高权限)',
      L1: 'L1 (核心级)',
      L2: 'L2 (优质级)',
      L3: 'L3 (标准级)',
      L4: 'L4 (入门级 - 基础权限)',
    };
    return names[level];
  };

  const handleViewDetail = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDetailDialog(true);
  };

  const handleStatusAction = (partner: Partner, action: 'freeze' | 'activate' | 'close') => {
    setSelectedPartner(partner);
    setStatusAction(action);
    setStatusReason('');
    setShowStatusDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (!statusReason.trim()) {
      toast.error('请填写操作原因');
      return;
    }

    const actionText = {
      freeze: '冻结',
      activate: '激活',
      close: '关闭',
    }[statusAction!];

    toast.success(`账户${actionText}成功`);
    setShowStatusDialog(false);
  };

  const handleEditLevel = (partner: Partner) => {
    setSelectedPartner(partner);
    setNewPermissionLevel(partner.permissionLevel);
    setLevelChangeReason('');
    setShowLevelDialog(true);
  };

  const handleConfirmLevelChange = () => {
    if (!selectedPartner) return;

    if (newPermissionLevel === selectedPartner.permissionLevel) {
      toast.error('请选择不同的风控等级');
      return;
    }

    if (!levelChangeReason.trim()) {
      toast.error('请填写修改原因');
      return;
    }

    const oldLevelName = getPermissionLevelName(selectedPartner.permissionLevel);
    const newLevelName = getPermissionLevelName(newPermissionLevel);

    toast.success(`风控等级已从 ${oldLevelName} 修改为 ${newLevelName}`);
    setShowLevelDialog(false);
    setShowDetailDialog(false);
  };

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.phone.includes(searchQuery) ||
      partner.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesAccountStatus = filterAccountStatus === 'all' || partner.accountStatus === filterAccountStatus;
    const matchesSettlementStatus = filterSettlementStatus === 'all' || partner.settlementStatus === filterSettlementStatus;
    const matchesPermissionLevel = filterPermissionLevel === 'all' || partner.permissionLevel === filterPermissionLevel;

    return matchesSearch && matchesType && matchesAccountStatus && matchesSettlementStatus && matchesPermissionLevel;
  });

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>小B用户管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>小B商户列表</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索名称、邮箱、手机号"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="用户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="individual">个人</SelectItem>
                  <SelectItem value="influencer">博主</SelectItem>
                  <SelectItem value="enterprise">企业</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAccountStatus} onValueChange={(value: any) => setFilterAccountStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="账户状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="frozen">冻结</SelectItem>
                  <SelectItem value="closed">关闭</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSettlementStatus} onValueChange={(value: any) => setFilterSettlementStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="结算状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="normal">正常结算</SelectItem>
                  <SelectItem value="on-hold">暂停结算</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPermissionLevel} onValueChange={(value: any) => setFilterPermissionLevel(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="风控等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="L0">L0 (战略级)</SelectItem>
                  <SelectItem value="L1">L1 (核心级)</SelectItem>
                  <SelectItem value="L2">L2 (优质级)</SelectItem>
                  <SelectItem value="L3">L3 (标准级)</SelectItem>
                  <SelectItem value="L4">L4 (入门级)</SelectItem>
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
                  <TableHead>用户信息</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>风控等级</TableHead>
                  <TableHead>联系方式</TableHead>
                  <TableHead>财务数据</TableHead>
                  <TableHead>业务数据</TableHead>
                  <TableHead>账户状态</TableHead>
                  <TableHead>结算状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                            {partner.displayName[0]}
                          </div>
                          <div>
                            <p>{partner.displayName}</p>
                            <p className="text-sm text-gray-500">{partner.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(partner.type)}</TableCell>
                      <TableCell>{getPermissionLevelBadge(partner.permissionLevel)}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">{partner.email}</p>
                          <p className="text-gray-500">{partner.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>累计利润：<span className="text-green-600">¥{partner.financialData.totalProfit.toLocaleString()}</span></p>
                          <p>可用余额：<span className="text-blue-600">¥{partner.financialData.availableBalance.toFixed(2)}</span></p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p>订单：{partner.businessData.completedOrders}/{partner.businessData.totalOrders}</p>
                          <p>加价率：{partner.businessData.avgMarkupRate}%</p>
                        </div>
                      </TableCell>
                      <TableCell>{getAccountStatusBadge(partner.accountStatus)}</TableCell>
                      <TableCell>{getSettlementStatusBadge(partner.settlementStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(partner)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            详情
                          </Button>
                          {partner.accountStatus === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusAction(partner, 'freeze')}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              冻结
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusAction(partner, 'activate')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              激活
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>小B商户详情</DialogTitle>
            <DialogDescription>查看完整的商户信息和业务数据</DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">用户ID</Label>
                    <p className="mt-1">{selectedPartner.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">用户类型</Label>
                    <div className="mt-1">{getTypeBadge(selectedPartner.type)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">显示名称</Label>
                    <p className="mt-1">{selectedPartner.displayName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">邮箱</Label>
                    <p className="mt-1">{selectedPartner.email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">手机号</Label>
                    <p className="mt-1">{selectedPartner.phone}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">注册时间</Label>
                    <p className="mt-1">{selectedPartner.registeredAt}</p>
                  </div>
                </div>
              </div>

              {/* 认证信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  认证信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedPartner.type === 'individual' && (
                    <>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">真实姓名</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.realName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">身份证号</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.idNumber}</p>
                      </div>
                    </>
                  )}
                  {selectedPartner.type === 'influencer' && (
                    <>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">真实姓名</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.realName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">平台</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.platformName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">粉丝数</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.followersCount?.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">影响力评分</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.influenceScore}/100</p>
                      </div>
                    </>
                  )}
                  {selectedPartner.type === 'enterprise' && (
                    <>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">公司名称</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.companyName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">统一社会信用代码</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.socialCreditCode}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">法定代表人</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.legalRepresentative}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">注册资本</Label>
                        <p className="mt-1">{selectedPartner.specificInfo.registeredCapital}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 财务数据 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  财务数据
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <Label className="text-gray-600">总交易额（P2）</Label>
                    <p className="text-xl mt-1 text-blue-700">¥{selectedPartner.financialData.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <Label className="text-gray-600">累计利润</Label>
                    <p className="text-xl mt-1 text-green-700">¥{selectedPartner.financialData.totalProfit.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <Label className="text-gray-600">可用余额</Label>
                    <p className="text-xl mt-1 text-purple-700">¥{selectedPartner.financialData.availableBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <Label className="text-gray-600">待结算</Label>
                    <p className="text-xl mt-1 text-yellow-700">¥{selectedPartner.financialData.pendingSettlement.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">已提取</Label>
                    <p className="text-xl mt-1">¥{selectedPartner.financialData.withdrawnAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* 业务数据 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  业务数据
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <Label className="text-gray-600">总订单</Label>
                    <p className="text-2xl mt-1">{selectedPartner.businessData.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <Label className="text-gray-600">已完成</Label>
                    <p className="text-2xl mt-1 text-green-600">{selectedPartner.businessData.completedOrders}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <Label className="text-gray-600">平均加价率</Label>
                    <p className="text-2xl mt-1 text-purple-600">{selectedPartner.businessData.avgMarkupRate}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-center">
                    <Label className="text-gray-600">活跃客户</Label>
                    <p className="text-2xl mt-1 text-blue-600">{selectedPartner.businessData.activeCustomers}</p>
                  </div>
                </div>
              </div>

              {/* 店铺信息 */}
              {selectedPartner.storeConfig && (
                <div>
                  <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    店铺信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <Label className="text-gray-600">店铺名称</Label>
                      <p className="mt-1">{selectedPartner.storeConfig.storeName}</p>
                    </div>
                    {selectedPartner.storeConfig.customDomain && (
                      <div className="p-3 bg-gray-50 rounded">
                        <Label className="text-gray-600">自定义域名</Label>
                        <p className="mt-1 text-blue-600">{selectedPartner.storeConfig.customDomain}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 账户状态 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    账户状态
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditLevel(selectedPartner)}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    修改风控等级
                  </Button>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">风控等级</Label>
                    <div className="mt-2">
                      {getPermissionLevelBadge(selectedPartner.permissionLevel)}
                      <p className="text-sm text-gray-500 mt-1">{getPermissionLevelName(selectedPartner.permissionLevel)}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">账户状态</Label>
                    <div className="mt-2">{getAccountStatusBadge(selectedPartner.accountStatus)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">结算状态</Label>
                    <div className="mt-2">{getSettlementStatusBadge(selectedPartner.settlementStatus)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 状态变更对话框 */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'freeze' && '冻结账户'}
              {statusAction === 'activate' && '激活账户'}
              {statusAction === 'close' && '关闭账户'}
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'freeze' && '冻结后该用户将无法登录和交易，结算将被暂停'}
              {statusAction === 'activate' && '激活后该用户可以正常使用系统'}
              {statusAction === 'close' && '关闭后该用户将永久无法使用系统，此操作不可恢复'}
            </DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">用户信息</p>
                <p className="mt-1">{selectedPartner.displayName} ({selectedPartner.id})</p>
              </div>

              <div>
                <Label htmlFor="reason">操作原因 <span className="text-red-500">*</span></Label>
                <Textarea
                  id="reason"
                  placeholder="请输入操作原因..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              variant={statusAction === 'close' ? 'destructive' : 'default'}
            >
              确认{statusAction === 'freeze' ? '冻结' : statusAction === 'activate' ? '激活' : '关闭'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 风控等级编辑对话框 */}
      <Dialog open={showLevelDialog} onOpenChange={setShowLevelDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              修改风控等级
            </DialogTitle>
            <DialogDescription>
              调整用户的风控等级，等级越低（L0）信任度越高、权限越大，等级越高（L4）风控越严格、权限越小
            </DialogDescription>
          </DialogHeader>

          {selectedPartner && (
            <div className="space-y-6 py-4">
              {/* 用户信息 */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                    {selectedPartner.displayName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{selectedPartner.displayName}</p>
                    <p className="text-sm text-gray-500">{selectedPartner.email}</p>
                  </div>
                </div>
                
                {/* 当前等级 */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Label className="text-gray-600">当前风控等级：</Label>
                  {getPermissionLevelBadge(selectedPartner.permissionLevel)}
                  <span className="text-sm text-gray-500">
                    {getPermissionLevelName(selectedPartner.permissionLevel)}
                  </span>
                </div>
              </div>

              {/* 新等级选择 */}
              <div className="space-y-3">
                <Label htmlFor="new-level">
                  新的风控等级 <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={newPermissionLevel} 
                  onValueChange={(value: PermissionLevel) => setNewPermissionLevel(value)}
                >
                  <SelectTrigger id="new-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L0">L0 (战略级 - 最高权限)</SelectItem>
                    <SelectItem value="L1">L1 (核心级)</SelectItem>
                    <SelectItem value="L2">L2 (优质级)</SelectItem>
                    <SelectItem value="L3">L3 (标准级)</SelectItem>
                    <SelectItem value="L4">L4 (入门级 - 基础权限)</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* 等级变化提示 */}
                {newPermissionLevel !== selectedPartner.permissionLevel && (
                  <div className={`p-3 rounded-lg border ${
                    newPermissionLevel < selectedPartner.permissionLevel 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <p className={`text-sm ${
                      newPermissionLevel < selectedPartner.permissionLevel 
                        ? 'text-green-800' 
                        : 'text-orange-800'
                    }`}>
                      {newPermissionLevel < selectedPartner.permissionLevel 
                        ? '⬆️ 等级提升：用户将获得更高信任度和更多权限' 
                        : '⬇️ 等级降低：用户的风控审查将更严格，权限将受到限制'}
                    </p>
                  </div>
                )}
              </div>

              {/* 修改原因 */}
              <div className="space-y-3">
                <Label htmlFor="level-reason">
                  修改原因 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="level-reason"
                  placeholder="请详细说明修改风控等级的原因，例如：用户业务表现优秀、订单量稳定增长、信用记录良好等"
                  value={levelChangeReason}
                  onChange={(e) => setLevelChangeReason(e.target.value)}
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  此修改将被记录到系统日志，请认真填写
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLevelDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmLevelChange}>
              <Shield className="w-4 h-4 mr-2" />
              确认修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
