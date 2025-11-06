import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Key,
  User,
  Building,
  CreditCard,
  Activity,
  Shield,
  Ban,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';
import { type ApiKeyInfo } from '../data/mockApiKeys';

export { type ApiKeyInfo };

interface ApiKeyDetailProps {
  apiKey: ApiKeyInfo;
  onBack: () => void;
}

export function ApiKeyDetail({ apiKey, onBack }: ApiKeyDetailProps) {
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [showFullKey, setShowFullKey] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: '活跃', className: 'bg-green-50 text-green-700 border-green-300' },
      suspended: { label: '已暂停', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      revoked: { label: '已吊销', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status as keyof typeof config];
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

  const getUserTypeBadge = (type: string) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      enterprise: { label: '企业', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[type as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const confirmSuspend = () => {
    if (!suspendReason.trim()) {
      toast.error('请输入暂停原因');
      return;
    }
    toast.success(`API密钥 ${apiKey.keyPrefix} 已暂停`);
    setShowSuspendDialog(false);
    setSuspendReason('');
    onBack();
  };

  const confirmReactivate = () => {
    toast.success(`API密钥 ${apiKey.keyPrefix} 已重新激活`);
    setShowReactivateDialog(false);
    onBack();
  };

  // 生成完整的密钥（模拟）
  const fullKey = `${apiKey.keyPrefix}${'x'.repeat(32)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 面包屑和返回按钮 */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="cursor-pointer hover:text-blue-600 transition-colors">
                  密钥管理
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>密钥详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            {apiKey.status === 'active' && (
              <Button variant="outline" size="sm" onClick={() => setShowSuspendDialog(true)} className="gap-2 text-orange-600 hover:text-orange-700">
                <Ban className="w-4 h-4" />
                暂停密钥
              </Button>
            )}
            {apiKey.status === 'suspended' && (
              <Button variant="outline" size="sm" onClick={() => setShowReactivateDialog(true)} className="gap-2 text-green-600 hover:text-green-700">
                <RefreshCw className="w-4 h-4" />
                恢复密钥
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
          </div>
        </div>

        {/* 页面标题区域 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">API密钥详情</h1>
              <p className="text-sm text-gray-500 font-mono">密钥前缀: {apiKey.keyPrefix}...</p>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            {getStatusBadge(apiKey.status)}
            {getRiskLevelBadge(apiKey.riskLevel)}
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full gap-0">
          <TabsList className="bg-white mb-6 w-full justify-start h-12 rounded-none border-b border-gray-200">
            <TabsTrigger value="basic" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              基本信息
            </TabsTrigger>
            <TabsTrigger value="user" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              用户信息
            </TabsTrigger>
            <TabsTrigger value="account" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              结算账户
            </TabsTrigger>
            <TabsTrigger value="usage" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              使用统计
            </TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Key className="w-5 h-5 text-blue-600" />
                  密钥信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">密钥名称</Label>
                    <p className="text-sm font-medium text-gray-900">{apiKey.keyName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">密钥前缀</Label>
                    <p className="text-sm font-mono text-gray-900">{apiKey.keyPrefix}...</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">完整密钥</Label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-gray-900 flex-1">
                        {showFullKey ? fullKey : `${apiKey.keyPrefix}${'•'.repeat(32)}`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullKey(!showFullKey)}
                        className="h-8 px-2"
                      >
                        {showFullKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">状态</Label>
                    <div>{getStatusBadge(apiKey.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">风控等级</Label>
                    <div>{getRiskLevelBadge(apiKey.riskLevel)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">创建时间</Label>
                    <p className="text-sm text-gray-900">{apiKey.createdAt}</p>
                  </div>
                  {apiKey.suspendedAt && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">暂停时间</Label>
                        <p className="text-sm text-gray-900">{apiKey.suspendedAt}</p>
                      </div>
                      {apiKey.suspendReason && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">暂停原因</Label>
                          <p className="text-sm text-gray-900">{apiKey.suspendReason}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户信息 */}
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5 text-blue-600" />
                  用户基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">用户ID</Label>
                    <p className="text-sm font-medium text-gray-900">{apiKey.userId}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">用户类型</Label>
                    <div>{getUserTypeBadge(apiKey.userType)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">显示名称</Label>
                    <p className="text-sm text-gray-900">{apiKey.userName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">手机号</Label>
                    <p className="text-sm text-gray-900">{apiKey.userPhone}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">邮箱</Label>
                    <p className="text-sm text-gray-900">{apiKey.userEmail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 个人/博主用户信息 */}
            {(apiKey.userType === 'individual' || apiKey.userType === 'influencer') && (
              <Card>
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5 text-blue-600" />
                    {apiKey.userType === 'individual' ? '个人用户信息' : '博主用户信息'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    {apiKey.realName && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">真实姓名</Label>
                        <p className="text-sm text-gray-900">{apiKey.realName}</p>
                      </div>
                    )}
                    {apiKey.idNumber && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">身份证号</Label>
                        <p className="text-sm font-mono text-gray-900">{apiKey.idNumber}</p>
                      </div>
                    )}
                    {apiKey.platformName && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">平台名称</Label>
                        <p className="text-sm text-gray-900">{apiKey.platformName}</p>
                      </div>
                    )}
                    {apiKey.followersCount !== undefined && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">粉丝数</Label>
                        <p className="text-sm text-gray-900">{apiKey.followersCount.toLocaleString()}</p>
                      </div>
                    )}
                    {apiKey.influenceScore !== undefined && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">影响力评分</Label>
                        <p className="text-sm text-gray-900">{apiKey.influenceScore}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 企业用户信息 */}
            {apiKey.userType === 'enterprise' && (
              <Card>
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Building className="w-5 h-5 text-blue-600" />
                    企业用户信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    {apiKey.companyName && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">企业名称</Label>
                        <p className="text-sm text-gray-900">{apiKey.companyName}</p>
                      </div>
                    )}
                    {apiKey.creditCode && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">统一社会信用代码</Label>
                        <p className="text-sm font-mono text-gray-900">{apiKey.creditCode}</p>
                      </div>
                    )}
                    {apiKey.legalRepName && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">法人代表</Label>
                        <p className="text-sm text-gray-900">{apiKey.legalRepName}</p>
                      </div>
                    )}
                    {apiKey.legalRepIdNumber && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">法人身份证号</Label>
                        <p className="text-sm font-mono text-gray-900">{apiKey.legalRepIdNumber}</p>
                      </div>
                    )}
                    {apiKey.contactName && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">联系人</Label>
                        <p className="text-sm text-gray-900">{apiKey.contactName}</p>
                      </div>
                    )}
                    {apiKey.contactPhone && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">联系人手机</Label>
                        <p className="text-sm text-gray-900">{apiKey.contactPhone}</p>
                      </div>
                    )}
                    {apiKey.contactEmail && (
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">联系人邮箱</Label>
                        <p className="text-sm text-gray-900">{apiKey.contactEmail}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 结算账户 */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  结算账户信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">账户类型</Label>
                    <p className="text-sm text-gray-900">
                      {apiKey.accountType === 'bank' ? '银行卡' : apiKey.accountType === 'alipay' ? '支付宝' : '-'}
                    </p>
                  </div>
                  {apiKey.accountType === 'bank' && (
                    <>
                      {apiKey.bankName && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">开户银行</Label>
                          <p className="text-sm text-gray-900">{apiKey.bankName}</p>
                        </div>
                      )}
                      {apiKey.bankBranch && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">开户支行</Label>
                          <p className="text-sm text-gray-900">{apiKey.bankBranch}</p>
                        </div>
                      )}
                      {apiKey.accountNumber && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">银行账号</Label>
                          <p className="text-sm font-mono text-gray-900">{apiKey.accountNumber}</p>
                        </div>
                      )}
                    </>
                  )}
                  {apiKey.accountType === 'alipay' && (
                    <>
                      {apiKey.alipayAccount && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">支付宝账号</Label>
                          <p className="text-sm text-gray-900">{apiKey.alipayAccount}</p>
                        </div>
                      )}
                      {apiKey.alipayRealName && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">支付宝实名</Label>
                          <p className="text-sm text-gray-900">{apiKey.alipayRealName}</p>
                        </div>
                      )}
                    </>
                  )}
                  {!apiKey.accountType && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">暂无结算账户信息</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用统计 */}
          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <Activity className="w-5 h-5 text-blue-600" />
                  API调用统计
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">总调用次数</Label>
                    <p className="text-lg font-semibold text-gray-900">{apiKey.totalCalls.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">今日调用</Label>
                    <p className="text-lg font-semibold text-blue-600">{apiKey.callsToday.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">本月调用</Label>
                    <p className="text-lg font-semibold text-gray-900">{apiKey.callsThisMonth.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">成功率</Label>
                    <p className="text-lg font-semibold text-green-600">{apiKey.successRate}%</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">平均响应时间</Label>
                    <p className="text-lg font-semibold text-gray-900">{apiKey.avgResponseTime}ms</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">最后使用时间</Label>
                    <p className="text-sm text-gray-900">{apiKey.lastUsed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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
                  您确定要暂停用户 <strong>{apiKey.userName}</strong> 的API密钥吗？
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
            <AlertDialogCancel onClick={() => setSuspendReason('')}>
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
                  您确定要重新激活用户 <strong>{apiKey.userName}</strong> 的API密钥吗？
                </p>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-800">
                    ✅ 激活后，该密钥将恢复正常工作，用户可以继续使用API服务。
                  </p>
                </div>
                {apiKey.suspendReason && (
                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="text-sm text-gray-600 mb-1">之前暂停原因：</p>
                    <p className="text-sm">{apiKey.suspendReason}</p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
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

