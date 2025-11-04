import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
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
import { 
  Search,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  Download,
  Key,
  TrendingUp,
  Users,
  Activity,
  RefreshCw,
  Calendar,
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

export function ApiKeyManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ApiKeyStatus>('all');
  const [filterUserType, setFilterUserType] = useState<'all' | PartnerType>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | 'L0' | 'L1' | 'L2' | 'L3' | 'L4'>('all');
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKeyInfo | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
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

  const handleViewDetail = (apiKey: ApiKeyInfo) => {
    setSelectedApiKey(apiKey);
    setShowDetailDialog(true);
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

  const filteredApiKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.keyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.keyPrefix.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || key.status === filterStatus;
    const matchesUserType = filterUserType === 'all' || key.userType === filterUserType;
    const matchesRiskLevel = filterRiskLevel === 'all' || key.riskLevel === filterRiskLevel;

    return matchesSearch && matchesStatus && matchesUserType && matchesRiskLevel;
  });

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
                  placeholder="搜索用户、邮箱或密钥"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="suspended">已暂停</SelectItem>
                  <SelectItem value="revoked">已吊销</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterUserType} onValueChange={(value: any) => setFilterUserType(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="用户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="individual">个人</SelectItem>
                  <SelectItem value="influencer">博主</SelectItem>
                  <SelectItem value="enterprise">企业</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRiskLevel} onValueChange={(value: any) => setFilterRiskLevel(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="风控等级" />
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

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户信息</TableHead>
                  <TableHead>密钥信息</TableHead>
                  <TableHead>风控等级</TableHead>
                  <TableHead>调用统计</TableHead>
                  <TableHead>服务质量</TableHead>
                  <TableHead>最后使用</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApiKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      暂无API密钥数据
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p>{key.userName}</p>
                            {getUserTypeBadge(key.userType)}
                          </div>
                          <p className="text-sm text-gray-500">{key.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{key.keyName}</p>
                          <p className="text-sm text-gray-500 font-mono">{key.keyPrefix}...</p>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskLevelBadge(key.riskLevel)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>总计: {key.totalCalls.toLocaleString()}</p>
                          <p className="text-gray-500">今日: {key.callsToday.toLocaleString()}</p>
                          <p className="text-blue-600">本月: {key.callsThisMonth.toLocaleString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-green-600">成功率: {key.successRate}%</p>
                          <p className="text-gray-500">响应: {key.avgResponseTime}ms</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {key.lastUsed}
                      </TableCell>
                      <TableCell>{getStatusBadge(key.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(key)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            详情
                          </Button>
                          {key.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspendKey(key)}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              暂停
                            </Button>
                          )}
                          {key.status === 'suspended' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReactivateKey(key)}
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              恢复
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

      {/* API密钥详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API密钥详情
            </DialogTitle>
            <DialogDescription>查看API密钥的完整信息和使用统计</DialogDescription>
          </DialogHeader>
          
          {selectedApiKey && (
            <div className="space-y-6">
              {/* 用户信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  用户信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">用户名称</Label>
                    <p className="mt-1">{selectedApiKey.userName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">邮箱</Label>
                    <p className="mt-1">{selectedApiKey.userEmail}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">用户类型</Label>
                    <div className="mt-1">{getUserTypeBadge(selectedApiKey.userType)}</div>
                  </div>
                </div>
              </div>

              {/* 密钥信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  密钥信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">密钥名称</Label>
                    <p className="mt-1">{selectedApiKey.keyName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">密钥前缀</Label>
                    <p className="mt-1 font-mono text-sm">{selectedApiKey.keyPrefix}...</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">创建时间</Label>
                    <p className="mt-1">{selectedApiKey.createdAt}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">风控等级</Label>
                    <div className="mt-1">{getRiskLevelBadge(selectedApiKey.riskLevel)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">当前状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedApiKey.status)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">最后使用</Label>
                    <p className="mt-1 text-sm">{selectedApiKey.lastUsed}</p>
                  </div>
                </div>
              </div>

              {/* 调用统计 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  调用统计
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Label className="text-gray-600">总调用次数</Label>
                    <p className="text-2xl mt-2 text-blue-700">{selectedApiKey.totalCalls.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Label className="text-gray-600">今日调用</Label>
                    <p className="text-2xl mt-2 text-green-700">{selectedApiKey.callsToday.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Label className="text-gray-600">本月调用</Label>
                    <p className="text-2xl mt-2 text-purple-700">{selectedApiKey.callsThisMonth.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 服务质量 */}
              <div>
                <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  服务质量监控
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Label className="text-gray-600">成功率</Label>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl text-green-600">{selectedApiKey.successRate}%</span>
                      {selectedApiKey.successRate >= 99 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${selectedApiKey.successRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-gray-600">平均响应时间</Label>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl text-blue-600">{selectedApiKey.avgResponseTime}</span>
                      <span className="text-gray-500">ms</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedApiKey.avgResponseTime < 150 ? '✅ 响应速度优秀' : 
                       selectedApiKey.avgResponseTime < 200 ? '⚠️ 响应速度正常' : 
                       '❌ 响应速度较慢'}
                    </p>
                  </div>
                </div>
              </div>

              {/* MCP服务说明 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-blue-900 mb-1">MCP酒店资源服务</p>
                    <p className="text-sm text-blue-700">
                      该密钥用于查询酒店资源信息，包括房型、价格、库存等数据。MCP服务不限制调用次数，
                      但系统会监控异常调用模式以确保服务质量。
                    </p>
                  </div>
                </div>
              </div>

              {/* 暂停信息 */}
              {selectedApiKey.status === 'suspended' && selectedApiKey.suspendedAt && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-orange-900 mb-1">密钥已暂停</p>
                      <p className="text-sm text-orange-700 mb-2">暂停时间: {selectedApiKey.suspendedAt}</p>
                      <p className="text-sm text-orange-700">暂停原因: {selectedApiKey.suspendReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
