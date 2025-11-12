import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Lock, LockOpen, RotateCcw, Edit2, Link2, Copy, ExternalLink, Download, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { getMockPartners, type Partner } from '../data/mockPartners';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export interface PromotionLink {
  id: string;
  partnerId: string;
  partnerName: string;
  userType: '旅行代理' | '网络博主' | '旅游类相关应用';
  businessModel: 'SaaS' | '推广联盟';
  promotionId: string;
  promotionCode?: string;
  defaultLink: string;
  mainLink?: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
  updatedAt: string;
  commissionRate?: string;
}

interface PromotionLinkManagementProps {
  onViewDetail?: (link: PromotionLink) => void;
}

export function PromotionLinkManagement({ onViewDetail }: PromotionLinkManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 生成模拟数据
  const promotionLinks: PromotionLink[] = useMemo(() => {
    const partners = getMockPartners();
    return partners.map((partner: Partner, index: number) => {
      const userTypeMap: Record<string, '旅行代理' | '网络博主' | '旅游类相关应用'> = {
        individual: '旅行代理',
        influencer: '网络博主',
        enterprise: '旅游类相关应用',
      };

      const promotionId = `promo-${partner.id.toLowerCase()}`;
      const hasCustomCode = index % 3 !== 0;
      const promotionCode = hasCustomCode ? `ref-${partner.id.toLowerCase()}` : undefined;

      return {
        id: `link-${partner.id}`,
        partnerId: partner.id,
        partnerName: partner.displayName,
        userType: userTypeMap[partner.type] || '旅行代理',
        businessModel: partner.businessModel === 'saas' || partner.businessModel === 'mcp' ? 'SaaS' : '推广联盟',
        promotionId,
        promotionCode,
        defaultLink: `https://aigohotel.com/ref?id=${promotionId}`,
        mainLink: promotionCode ? `https://aigohotel.com/ref/${promotionCode}` : undefined,
        status: index % 5 === 0 ? 'disabled' : 'enabled',
        createdAt: partner.registeredAt,
        updatedAt: partner.lastLoginAt || partner.registeredAt,
        commissionRate: partner.businessModel === 'affiliate' ? `${10 + (index % 5) * 2}%` : undefined,
      };
    });
  }, []);

  // 筛选和搜索
  const filteredLinks = useMemo(() => {
    return promotionLinks.filter((link) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query
        ? [link.partnerName, link.promotionCode, link.promotionId]
            .filter(Boolean)
            .some((field) => field?.toLowerCase().includes(query))
        : true;

      const matchesUserType = filterUserType === 'all' || link.userType === filterUserType;
      const matchesBusinessModel = filterBusinessModel === 'all' || link.businessModel === filterBusinessModel;
      const matchesStatus = filterStatus === 'all' || link.status === filterStatus;

      return matchesSearch && matchesUserType && matchesBusinessModel && matchesStatus;
    });
  }, [promotionLinks, searchQuery, filterUserType, filterBusinessModel, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterUserType, filterBusinessModel, filterStatus]);

  // 分页
  const paginatedLinks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLinks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLinks, currentPage]);

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);

  const handleCopy = (value?: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success('已复制链接');
  };

  const handleOpenLink = (value?: string) => {
    if (!value) return;
    window.open(value, '_blank')?.focus();
  };

  const handleToggleStatus = (link: PromotionLink) => {
    const nextStatus = link.status === 'enabled' ? 'disabled' : 'enabled';
    toast.success(`链接状态已更新为：${nextStatus === 'enabled' ? '启用' : '禁用'}`);
  };

  const handleResetCode = (link: PromotionLink) => {
    toast.success('推广代码已重置');
  };

  const handleModifyCode = (link: PromotionLink) => {
    toast.success('推广代码已修改');
  };

  const handleExport = () => {
    toast.success('已导出当前筛选结果（模拟）');
  };

  const handleViewDetail = (link: PromotionLink) => {
    onViewDetail?.(link);
  };

  const handleClearFilters = () => {
    setFilterUserType('all');
    setFilterBusinessModel('all');
    setFilterStatus('all');
  };

  const getUserTypeBadge = (type: string) => {
    const config = {
      '旅行代理': { className: 'bg-orange-50 text-orange-700 border-orange-300' },
      '网络博主': { className: 'bg-pink-50 text-pink-700 border-pink-300' },
      '旅游类相关应用': { className: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
    };
    const { className } = config[type as keyof typeof config] || { className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{type}</Badge>;
  };

  const getBusinessModelBadge = (model: string) => {
    const config = {
      'SaaS': { className: 'bg-purple-50 text-purple-700 border-purple-300' },
      '推广联盟': { className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { className } = config[model as keyof typeof config] || { className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{model}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      enabled: { label: '启用', className: 'bg-green-50 text-green-700 border-green-300' },
      disabled: { label: '禁用', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };


  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>推广链接管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              推广链接列表
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索用户名称、推广代码、推广ID"
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

              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* 筛选器 */}
          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">用户信息类型</Label>
                  <Select value={filterUserType} onValueChange={(value: any) => setFilterUserType(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="旅行代理">旅行代理</SelectItem>
                      <SelectItem value="网络博主">网络博主</SelectItem>
                      <SelectItem value="旅游类相关应用">旅游类相关应用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">业务模式</Label>
                  <Select value={filterBusinessModel} onValueChange={(value: any) => setFilterBusinessModel(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部模式</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="推广联盟">推广联盟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">链接状态</Label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="enabled">启用</SelectItem>
                      <SelectItem value="disabled">禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 清除筛选按钮 */}
              {(filterUserType !== 'all' || filterBusinessModel !== 'all' || filterStatus !== 'all') && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className={showFilters ? "py-4" : "py-3"}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户信息类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">推广ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">推广代码</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后修改时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLinks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      暂无符合条件的推广链接
                    </td>
                  </tr>
                ) : (
                  paginatedLinks.map((link) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{link.partnerName}</td>
                      <td className="px-4 py-3 text-sm">{getUserTypeBadge(link.userType)}</td>
                      <td className="px-4 py-3 text-sm">{getBusinessModelBadge(link.businessModel)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{link.promotionId}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{link.promotionCode || '-'}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(link.status)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{link.createdAt}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{link.updatedAt}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(link)}
                          className="h-8 px-2"
                        >
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
          {totalPages >= 1 && filteredLinks.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                共 {filteredLinks.length} 条记录，第 {currentPage} / {totalPages} 页
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
    </div>
  );
}
