import React, { useState, useEffect } from 'react';
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
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { getMockPartners, type Partner, type PartnerType, type AccountStatus, type SettlementStatus, type PermissionLevel } from '../data/mockPartners';

export { type Partner };

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
  const [showFilters, setShowFilters] = useState(false);
  
  // 风控等级编辑
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [newPermissionLevel, setNewPermissionLevel] = useState<PermissionLevel>('L4');
  const [levelChangeReason, setLevelChangeReason] = useState('');

  // 使用 mock 数据
  const partners: Partner[] = getMockPartners();

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

  // 计算分页数据
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredPartners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPartners = filteredPartners.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterAccountStatus, filterSettlementStatus, filterPermissionLevel]);

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>用户管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>商户列表</CardTitle>
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

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t mt-4">
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

              {(filterType !== 'all' || filterAccountStatus !== 'all' || filterSettlementStatus !== 'all' || filterPermissionLevel !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterType('all');
                    setFilterAccountStatus('all');
                    setFilterSettlementStatus('all');
                    setFilterPermissionLevel('all');
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          )}
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
                {paginatedPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPartners.map((partner) => (
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
          
          {/* 分页 */}
          {totalPages >= 1 && totalItems > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                共 {totalItems} 条数据，第 {currentPage} / {totalPages} 页
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
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
