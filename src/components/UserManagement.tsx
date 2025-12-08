import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  User,
  TrendingUp,
  Building2,
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
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { getMockPartners, type Partner, type PartnerType, type AccountStatus, type SettlementStatus, type PermissionLevel, type BusinessModel } from '../data/mockPartners';
import { cn } from './ui/utils';

export { type Partner };

export interface UserManagementProps {
  onViewDetail?: (partner: Partner) => void;
}

export function UserManagement({ onViewDetail }: UserManagementProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'bigb' | 'smallb'>('bigb');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCertificationType, setFilterCertificationType] = useState<'all' | 'individual' | 'enterprise'>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<'all' | BusinessModel>('all');
  const [filterAccountStatus, setFilterAccountStatus] = useState<'all' | AccountStatus>('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusAction, setStatusAction] = useState<'freeze' | 'activate' | 'close' | null>(null);
  const [statusReason, setStatusReason] = useState('');
  
  // 风控等级编辑
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [newPermissionLevel, setNewPermissionLevel] = useState<PermissionLevel>('L4');
  const [levelChangeReason, setLevelChangeReason] = useState('');

  // 使用 mock 数据
  const partners: Partner[] = getMockPartners();

  const DetailItem = ({
    label,
    value,
    description,
    copyable,
  }: {
    label: string;
    value: React.ReactNode;
    description?: React.ReactNode;
    copyable?: boolean;
  }) => {
    const renderValue = () => {
      if (copyable && typeof value === 'string' && value !== '-') {
        return (
          <div className="flex items-center gap-1">
            <span className="truncate" title={value}>
              {value}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                navigator.clipboard.writeText(value).then(() => toast.success('已复制到剪贴板'));
              }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </Button>
          </div>
        );
      }

      return value ?? '-';
    };

    return (
      <div className="p-3 bg-gray-50 rounded">
        <Label className="text-gray-600 text-xs uppercase tracking-wide">{label}</Label>
        <div className="mt-1 text-sm text-gray-900 space-y-1">{renderValue()}</div>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
    );
  };

  const KpiCard = ({
    label,
    value,
    tone = 'slate',
  }: {
    label: string;
    value: React.ReactNode;
    tone?: 'slate' | 'emerald' | 'blue' | 'purple';
  }) => {
    const toneMap = {
      slate: 'text-slate-700',
      emerald: 'text-emerald-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
    } as const;

    return (
      <div className="p-4 bg-gray-50 rounded text-center">
        <Label className="text-xs uppercase tracking-wide text-gray-500">{label}</Label>
        <p className={cn('text-2xl mt-2 font-semibold', toneMap[tone])}>{value}</p>
      </div>
    );
  };

  const StatCard = ({
    label,
    value,
    tone = 'slate',
  }: {
    label: string;
    value: React.ReactNode;
    tone?: 'slate' | 'emerald' | 'blue' | 'amber' | 'purple';
  }) => {
    const toneMap = {
      slate: 'bg-slate-50 text-slate-700 border-slate-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    } as const;

    return (
      <div className={cn('p-4 rounded-lg border', toneMap[tone])}>
        <Label className="text-xs uppercase tracking-wide text-gray-600">{label}</Label>
        <p className="mt-2 text-xl font-semibold">{value}</p>
      </div>
    );
  };

  const getUserInfoTypeBadge = (type: PartnerType) => {
    const config = {
      individual: {
        icon: <User className="w-3.5 h-3.5" />,
        label: '旅行代理',
        className: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      influencer: {
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        label: '网络博主',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
      },
      enterprise: {
        icon: <Building2 className="w-3.5 h-3.5" />,
        label: '旅游类相关应用',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    } as const;

    const { icon, label, className } = config[type];
    return (
      <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium', className)}>
        <span className="inline-flex items-center gap-1">
          {icon}
          {label}
        </span>
      </Badge>
    );
  };

  const getAccountStatusBadge = (status: AccountStatus) => {
    const config = {
      active: { label: '正常', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      frozen: { label: '冻结', className: 'bg-amber-50 text-amber-700 border-amber-200' },
      closed: { label: '关闭', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    } as const;
    const { label, className } = config[status];
    return (
      <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium', className)}>
        {label}
      </Badge>
    );
  };

  const getSettlementStatusBadge = (status: SettlementStatus) => {
    const config = {
      normal: { label: '正常结算', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'on-hold': { label: '暂停结算', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    } as const;
    const { label, className } = config[status];
    return (
      <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium', className)}>
        {label}
      </Badge>
    );
  };

  const getPermissionLevelBadge = (level: PermissionLevel) => {
    const config = {
      L0: { label: 'L0', className: 'bg-rose-50 text-rose-700 border-rose-200' },
      L1: { label: 'L1', className: 'bg-amber-50 text-amber-700 border-amber-200' },
      L2: { label: 'L2', className: 'bg-purple-50 text-purple-700 border-purple-200' },
      L3: { label: 'L3', className: 'bg-blue-50 text-blue-700 border-blue-200' },
      L4: { label: 'L4', className: 'bg-slate-50 text-slate-700 border-slate-200' },
    } as const;
    const { label, className } = config[level];
    return (
      <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium', className)}>
        {label}
      </Badge>
    );
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
    if (onViewDetail) {
      onViewDetail(partner);
    } else {
      setSelectedPartner(partner);
      setShowDetailDialog(true);
    }
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
    const matchesTab =
      activeTab === 'bigb'
        ? partner.businessModel !== 'affiliate'
        : partner.businessModel === 'affiliate';

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query
      ? [partner.displayName, partner.email, partner.phone, partner.id]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query))
      : true;

    const matchesCertification =
      filterCertificationType === 'all' || partner.certificationType === filterCertificationType;
    const matchesBusinessModel =
      filterBusinessModel === 'all' || partner.businessModel === filterBusinessModel;
    const matchesAccountStatus =
      filterAccountStatus === 'all' || partner.accountStatus === filterAccountStatus;

    return matchesTab && matchesSearch && matchesCertification && matchesBusinessModel && matchesAccountStatus;
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
  }, [searchQuery, activeTab, filterCertificationType, filterBusinessModel, filterAccountStatus]);

  // tab 切换时同步业务模式筛选：大B不包含推广联盟，小B强制推广联盟
  useEffect(() => {
    if (activeTab === 'smallb') {
      setFilterBusinessModel('affiliate');
    } else if (filterBusinessModel === 'affiliate') {
      setFilterBusinessModel('all');
    }
  }, [activeTab, filterBusinessModel]);

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-gray-500 hover:text-gray-700">
              用户管理
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">用户列表</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tab 切换与搜索 */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'bigb' | 'smallb')}>
              <TabsList>
                <TabsTrigger value="bigb">大B</TabsTrigger>
                <TabsTrigger value="smallb">小B</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-80 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索名称 / 邮箱 / 手机号 / 用户 ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
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
            <div className="pt-2 border-t space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">个人/企业</Label>
                  <Select
                    value={filterCertificationType}
                    onValueChange={(value: 'all' | 'individual' | 'enterprise') => setFilterCertificationType(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="individual">个人</SelectItem>
                      <SelectItem value="enterprise">企业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">业务模式</Label>
                  <Select
                    value={filterBusinessModel}
                    onValueChange={(value: 'all' | BusinessModel) => setFilterBusinessModel(value)}
                    disabled={activeTab === 'smallb'}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === 'smallb' ? (
                        <SelectItem value="affiliate">推广联盟</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="all">全部</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="mcp">MCP</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">账户状态</Label>
                  <Select
                    value={filterAccountStatus}
                    onValueChange={(value: 'all' | AccountStatus) => setFilterAccountStatus(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="active">正常</SelectItem>
                      <SelectItem value="frozen">冻结</SelectItem>
                      <SelectItem value="closed">关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(filterCertificationType !== 'all' ||
                filterBusinessModel !== 'all' ||
                filterAccountStatus !== 'all') && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterCertificationType('all');
                      setFilterBusinessModel('all');
                      setFilterAccountStatus('all');
                    }}
                  >
                    清除筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <style>{`
            .user-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .user-table-container table td:last-child,
            .user-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .user-table-container table td,
            .user-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="user-table-container overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">个人/企业</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">注册时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">手机号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">累计订单数</th>
                  {activeTab === 'smallb' && (
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">挂载大B</th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPartners.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'smallb' ? 10 : 9} className="px-4 py-8 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  paginatedPartners.map((partner) => {
                    const isSmallB = partner.businessModel === 'affiliate';
                    const businessModelLabel =
                      partner.businessModel === 'saas' ? 'SaaS' : partner.businessModel === 'mcp' ? 'MCP' : '推广联盟';
                    const certificationLabel = partner.certificationType === 'enterprise' ? '企业' : '个人';
                    return (
                      <tr key={partner.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">{partner.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{partner.displayName}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium bg-slate-50 text-slate-700 border-slate-200">
                            {certificationLabel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="px-2 py-0.5 text-xs font-medium bg-slate-50 text-slate-700 border-slate-200">
                            {businessModelLabel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{partner.registeredAt}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{partner.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{partner.phone}</td>
                        <td className="px-4 py-3 text-sm">{getAccountStatusBadge(partner.accountStatus)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{partner.businessData.totalOrders}</td>
                        {activeTab === 'smallb' && (
                          <td className="px-4 py-3 text-sm text-gray-700">{partner.parentPartnerId ?? '-'}</td>
                        )}
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex flex-col items-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetail(partner)} className="h-8 px-2">
                              <Eye className="w-4 h-4 mr-1" />
                              查看详情
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditLevel(partner)} className="h-8 px-2">
                              <Shield className="w-4 h-4 mr-1" />
                              调整风控等级
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleStatusAction(partner, partner.accountStatus === 'active' ? 'freeze' : 'activate')}
                            >
                              {partner.accountStatus === 'active' ? (
                                <Ban className="w-4 h-4 mr-1" />
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-1" />
                              )}
                              {partner.accountStatus === 'active' ? '冻结账户' : '激活账户'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm text-slate-600">用户信息</CardTitle>
                  <div className="text-xs text-slate-500">
                    {selectedPartner.displayName}（ID：{selectedPartner.id}）
                  </div>
                </CardHeader>
              </Card>

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
