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
import { 
  Search,
  Eye,
  Ban,
  RefreshCw,
  Download,
  Key,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { getMockApiKeys, type ApiKeyInfo, type ApiKeyStatus, type PartnerType } from '../data/mockApiKeys';

export { type ApiKeyInfo };

interface ApiKeyManagementProps {
  onViewApiKeyDetail?: (apiKey: ApiKeyInfo) => void;
}

export function ApiKeyManagement({ onViewApiKeyDetail }: ApiKeyManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ApiKeyStatus>('all');
  const [filterUserType, setFilterUserType] = useState<'all' | PartnerType>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | 'L0' | 'L1' | 'L2' | 'L3' | 'L4'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [keyToSuspend, setKeyToSuspend] = useState<ApiKeyInfo | null>(null);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [keyToReactivate, setKeyToReactivate] = useState<ApiKeyInfo | null>(null);

  // 使用 mock 数据
  const apiKeys: ApiKeyInfo[] = getMockApiKeys();

  const getStatusBadge = (status: ApiKeyStatus) => {
    const config = {
      active: { label: '活跃', className: 'bg-green-50 text-green-700 border-green-300' },
      suspended: { label: '已暂停', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      revoked: { label: '已吊销', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getRiskLevelBadge = (level: string) => {
    const config = {
      L0: { label: 'L0-战略级', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      L1: { label: 'L1-高级', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      L2: { label: 'L2-标准', className: 'bg-green-50 text-green-700 border-green-300' },
      L3: { label: 'L3-基础', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      L4: { label: 'L4-入门', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[level as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getUserTypeBadge = (type: PartnerType) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      enterprise: { label: '企业', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const filteredApiKeys = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch =
        key.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.keyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (key.realName && key.realName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (key.companyName && key.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || key.status === filterStatus;
      const matchesUserType = filterUserType === 'all' || key.userType === filterUserType;
      const matchesRiskLevel = filterRiskLevel === 'all' || key.riskLevel === filterRiskLevel;

      return matchesSearch && matchesStatus && matchesUserType && matchesRiskLevel;
    });
  }, [apiKeys, searchQuery, filterStatus, filterUserType, filterRiskLevel]);

  // 计算分页数据
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredApiKeys.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApiKeys = filteredApiKeys.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterUserType, filterRiskLevel]);

  const handleViewDetail = (apiKey: ApiKeyInfo) => {
    if (onViewApiKeyDetail) {
      onViewApiKeyDetail(apiKey);
      // 保存API密钥ID到localStorage，以便刷新后恢复
      localStorage.setItem('selectedApiKeyId', apiKey.id);
    }
  };

  const handleSuspendKey = (apiKey: ApiKeyInfo) => {
    setKeyToSuspend(apiKey);
    setShowSuspendDialog(true);
  };

  const confirmSuspend = () => {
    if (!suspendReason.trim()) {
      toast.error('请输入暂停原因');
      return;
    }
    toast.success(`API密钥 ${keyToSuspend?.keyPrefix} 已暂停`);
    setShowSuspendDialog(false);
    setSuspendReason('');
    setKeyToSuspend(null);
  };

  const handleReactivateKey = (apiKey: ApiKeyInfo) => {
    setKeyToReactivate(apiKey);
    setShowReactivateDialog(true);
  };

  const confirmReactivate = () => {
    toast.success(`API密钥 ${keyToReactivate?.keyPrefix} 已重新激活`);
    setShowReactivateDialog(false);
    setKeyToReactivate(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>密钥管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API密钥列表
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索用户、邮箱、手机或密钥"
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
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">密钥状态</Label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="suspended">已暂停</SelectItem>
                      <SelectItem value="revoked">已吊销</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">用户类型</Label>
                  <Select value={filterUserType} onValueChange={(value: any) => setFilterUserType(value)}>
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

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">风控等级</Label>
                  <Select value={filterRiskLevel} onValueChange={(value: any) => setFilterRiskLevel(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部等级</SelectItem>
                      <SelectItem value="L0">L0-战略级</SelectItem>
                      <SelectItem value="L1">L1-高级</SelectItem>
                      <SelectItem value="L2">L2-标准</SelectItem>
                      <SelectItem value="L3">L3-基础</SelectItem>
                      <SelectItem value="L4">L4-入门</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 清除筛选按钮 */}
              {(filterStatus !== 'all' || filterUserType !== 'all' || filterRiskLevel !== 'all') && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterUserType('all');
                      setFilterRiskLevel('all');
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
            .api-key-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .api-key-table-container table td:last-child,
            .api-key-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .api-key-table-container table td,
            .api-key-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="api-key-table-container overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">显示名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">手机号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">密钥名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">密钥前缀</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">风控等级</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">总调用次数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">今日调用</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">本月调用</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">成功率</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">平均响应时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后使用</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApiKeys.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="px-4 py-8 text-center text-gray-500">
                      暂无API密钥数据
                    </td>
                  </tr>
                ) : (
                  paginatedApiKeys.map((key) => (
                    <tr key={key.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{key.userId}</td>
                      <td className="px-4 py-3 text-sm">{getUserTypeBadge(key.userType)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.userPhone}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.userEmail}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.keyName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{key.keyPrefix}...</td>
                      <td className="px-4 py-3 text-sm">{getRiskLevelBadge(key.riskLevel)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.totalCalls.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.callsToday.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.callsThisMonth.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{key.successRate}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{key.avgResponseTime}ms</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{key.lastUsed}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{key.createdAt}</td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(key.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(key)}
                            className="h-8 px-2"
                          >
                            查看详情
                          </Button>
                          {key.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspendKey(key)}
                              className="h-8 px-2 text-orange-600 hover:text-orange-700"
                            >
                              暂停
                            </Button>
                          )}
                          {key.status === 'suspended' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReactivateKey(key)}
                              className="h-8 px-2 text-green-600 hover:text-green-700"
                            >
                              恢复
                            </Button>
                          )}
                        </div>
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

      {/* 暂停API密钥对话框 */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-orange-600" />
              暂停API密钥
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  您确定要暂停用户 <strong>{keyToSuspend?.userName}</strong> 的API密钥吗？
                </p>
                <div className="p-3 bg-orange-50 rounded border border-orange-200">
                  <p className="text-sm text-orange-800">
                    ⚠️ 暂停后，该密钥将立即停止工作，用户的所有API调用将失败。
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>暂停原因 *</Label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md"
                    placeholder="请详细说明暂停原因，此信息将记录在系统中..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSuspendReason('');
              setKeyToSuspend(null);
            }}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSuspend}>
              确认暂停
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 重新激活API密钥对话框 */}
      <AlertDialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-green-600" />
              重新激活API密钥
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>
                  您确定要重新激活用户 <strong>{keyToReactivate?.userName}</strong> 的API密钥吗？
                </p>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-800">
                    ✅ 激活后，该密钥将恢复正常工作，用户可以继续使用API服务。
                  </p>
                </div>
                {keyToReactivate?.suspendReason && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600 mb-1">之前暂停原因：</p>
                    <p className="text-sm">{keyToReactivate.suspendReason}</p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKeyToReactivate(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReactivate}>
              确认激活
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
