import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
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
import { Search, Eye, Download, FileText, Filter } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { type ApplicationData } from '../data/mockApplications';
import { formatDateTime } from '../utils/dateFormat';

export { type ApplicationData };

interface AdminReviewListProps {
  applications: ApplicationData[];
  onViewDetail: (application: ApplicationData) => void;
}

export function AdminReviewList({ applications, onViewDetail }: AdminReviewListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<'all' | 'mcp' | 'saas' | 'affiliate'>('all');
  const [filterIdentityType, setFilterIdentityType] = useState<'all' | 'individual' | 'influencer' | 'enterprise'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getBusinessModelName = (model: string) => {
    const names = {
      mcp: 'MCP',
      saas: '品牌预订站',
      affiliate: '联盟推广',
    };
    return names[model as keyof typeof names] || model;
  };

  const getBusinessModelBadge = (model: string) => {
    const config = {
      mcp: { label: 'MCP', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      saas: { label: '品牌预订站', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      affiliate: { label: '联盟推广', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[model as keyof typeof config] || { label: model, className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getIdentityTypeName = (type: string) => {
    const names = {
      individual: '个人',
      influencer: '博主',
      enterprise: '企业',
    };
    return names[type as keyof typeof names] || type;
  };

  const getIdentityTypeBadge = (type: string) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      enterprise: { label: '企业', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[type as keyof typeof config] || { label: type, className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 格式化时间显示
  const formatTimeDisplay = (timeStr: string | undefined): string => {
    if (!timeStr) return '-';
    // 如果已经是 YYYY-MM-DD HH:mm:ss 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    // 如果是 ISO 格式或其他格式，转换为统一格式
    try {
      return formatDateTime(timeStr);
    } catch {
      return timeStr;
    }
  };

  // 规范化申请编号格式
  const normalizeAppId = (id: string): string => {
    // 如果已经是 APP-XXX 格式（XXX是数字），直接返回
    if (/^APP-\d{3}$/.test(id)) {
      return id;
    }
    // 否则尝试提取数字部分，如果没有则保持原样
    const match = id.match(/APP-(\d+)/);
    if (match) {
      const num = match[1];
      return `APP-${num.padStart(3, '0')}`;
    }
    // 如果完全不匹配，保持原样（避免破坏数据）
    return id;
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.userEmail && app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      const matchesBusinessModel = filterBusinessModel === 'all' || app.businessModel === filterBusinessModel;
      const matchesIdentityType = filterIdentityType === 'all' || app.identityType === filterIdentityType;

      return matchesSearch && matchesStatus && matchesBusinessModel && matchesIdentityType;
    });
  }, [applications, searchQuery, filterStatus, filterBusinessModel, filterIdentityType]);

  // 计算分页数据
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterBusinessModel, filterIdentityType]);

  const statusBadge = (status: string) => {
    const config = {
      pending: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已通过', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
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
            <BreadcrumbPage>资格审核</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              申请列表
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索申请人、申请编号、邮箱"
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
                导出
              </Button>
            </div>
          </div>

          {/* 筛选器 */}
          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">审核状态</Label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待审核</SelectItem>
                      <SelectItem value="approved">已通过</SelectItem>
                      <SelectItem value="rejected">已驳回</SelectItem>
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
                      <SelectItem value="mcp">MCP</SelectItem>
                      <SelectItem value="saas">品牌预订站</SelectItem>
                      <SelectItem value="affiliate">联盟推广</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">身份类型</Label>
                  <Select value={filterIdentityType} onValueChange={(value: any) => setFilterIdentityType(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="individual">个人</SelectItem>
                      <SelectItem value="influencer">博主</SelectItem>
                      <SelectItem value="enterprise">企业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 清除筛选按钮 */}
              {(filterStatus !== 'all' || filterBusinessModel !== 'all' || filterIdentityType !== 'all') && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterBusinessModel('all');
                      setFilterIdentityType('all');
                    }}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className={showFilters ? "py-4" : "py-3"}>
          <style>{`
            .review-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .review-table-container table td:last-child,
            .review-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .review-table-container table td,
            .review-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="review-table-container overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">业务模式</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">身份类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">提交时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">审核时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      暂无符合条件的申请
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{normalizeAppId(app.id)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{app.applicantName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{app.userEmail || '-'}</td>
                      <td className="px-4 py-3 text-sm">{getBusinessModelBadge(app.businessModel)}</td>
                      <td className="px-4 py-3 text-sm">{getIdentityTypeBadge(app.identityType)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{formatTimeDisplay(app.submittedAt)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{formatTimeDisplay(app.reviewedAt)}</td>
                      <td className="px-4 py-3 text-sm">{statusBadge(app.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail(app)}
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
          {totalPages >= 1 && totalItems > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                共 {totalItems} 条记录，第 {currentPage} / {totalPages} 页
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
