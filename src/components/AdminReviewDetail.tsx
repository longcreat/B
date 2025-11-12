import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, ZoomIn, FileText, User, Building, CreditCard } from 'lucide-react';
import type { ApplicationData } from '../data/mockApplications';
import { formatDateTime } from '../utils/dateFormat';

interface AdminReviewDetailProps {
  application: ApplicationData;
  onBack: () => void;
  onApprove: (id: string, permissionLevel: string, internalNote?: string, parentPartnerId?: string) => void;
  onReject: (id: string, reason: string, internalNote?: string) => void;
}

type PermissionLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export function AdminReviewDetail({
  application,
  onBack,
  onApprove,
  onReject,
}: AdminReviewDetailProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | null>(null);
  const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>('L4');
  const [rejectionReason, setRejectionReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [parentPartnerId, setParentPartnerId] = useState<string>('AIGO_BIGB');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleStartReview = () => {
    setReviewDecision(null);
    setPermissionLevel('L4');
    setRejectionReason('');
    setInternalNote('');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!reviewDecision) {
      toast.error('请选择审批结论');
      return;
    }

    if (reviewDecision === 'approve') {
      if (application.businessModel === 'affiliate') {
        onApprove(application.id, permissionLevel, internalNote || undefined, parentPartnerId);
      } else {
        onApprove(application.id, permissionLevel, internalNote || undefined);
      }
      toast.success(`审核已通过，权限等级：${permissionLevel}`);
    } else {
      if (!rejectionReason.trim()) {
        toast.error('请填写驳回原因');
        return;
      }
      onReject(application.id, rejectionReason, internalNote || undefined);
      toast.success('已驳回申请');
    }

    setShowReviewDialog(false);
  };

  const getBusinessModelName = (model: string) => {
    const names = {
      mcp: 'MCP - 大模型与API集成',
      saas: '品牌预订站 (SaaS方案)',
      affiliate: '联盟推广计划',
    };
    return names[model as keyof typeof names] || model;
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      travel_agent: '旅行代理',
      influencer: '网络博主',
      travel_app: '旅游类相关应用',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getCertificationTypeLabel = (type: string) => {
    const labels = {
      individual: '个人认证',
      enterprise: '企业认证',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderUserTypeBadge = (type?: string) => {
    if (!type) return '-';
    const config = {
      travel_agent: { label: '旅行代理', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      influencer: { label: '网络博主', className: 'bg-pink-50 text-pink-700 border-pink-300' },
      travel_app: { label: '旅游类相关应用', className: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
    } as const;
    const item = config[type as keyof typeof config];
    if (!item) return type;
    return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
  };

  const renderCertificationBadge = (type?: string) => {
    if (!type) return '-';
    const config = {
      individual: { label: '个人认证', className: 'bg-slate-50 text-slate-700 border-slate-300' },
      enterprise: { label: '企业认证', className: 'bg-amber-50 text-amber-700 border-amber-300' },
    } as const;
    const item = config[type as keyof typeof config];
    if (!item) return type;
    return <Badge variant="outline" className={item.className}>{item.label}</Badge>;
  };

  const getPermissionLevelName = (level: string) => {
    const names = {
      L0: 'L0 (战略级)',
      L1: 'L1 (核心级)',
      L2: 'L2 (优质级)',
      L3: 'L3 (标准级)',
      L4: 'L4 (入门级)',
    };
    return names[level as keyof typeof names] || level;
  };

  const getPermissionLevelBadge = (level: string) => {
    const config = {
      L0: { label: 'L0-战略级', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      L1: { label: 'L1-核心级', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      L2: { label: 'L2-优质级', className: 'bg-green-50 text-green-700 border-green-300' },
      L3: { label: 'L3-标准级', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      L4: { label: 'L4-入门级', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[level as keyof typeof config] || { label: level, className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const renderImageItem = (label: string, url: string) => (
    <div key={`${label}-${url}`} className="space-y-2">
      <Label className="text-sm text-gray-600">{label}</Label>
      <div className="relative group">
        <img
          src={url}
          alt={label}
          className="max-w-xs border rounded cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setImagePreview(url)}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
    </div>
  );

  const renderFieldValue = (label: string, value: any, isImage?: boolean) => {
    if (value === undefined || value === null || value === '') return null;

    if (isImage && typeof value === 'string') {
      return renderImageItem(label, value);
    }

    return (
      <div key={label} className="space-y-2">
        <Label className="text-sm text-gray-600">{label}</Label>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    );
  };

  const renderImageList = (label: string, images?: string[]) => {
    if (!images || images.length === 0) return null;
    return (
      <div className="space-y-2 col-span-2">
        <Label className="text-sm text-gray-600">{label}</Label>
        <div className="flex flex-wrap gap-4">
          {images.map((img, idx) => (
            <div key={`${label}-${idx}`} className="flex-shrink-0">
              {renderImageItem(`${label} ${images.length > 1 ? idx + 1 : ''}`.trim(), img)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApplicationData = () => {
    const { data } = application;

    if (!data) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">暂无详细资料</CardContent>
        </Card>
      );
    }

    const identityCard = (
      <Card key="identity-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <User className="w-5 h-5 text-blue-600" />
            身份信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('真实姓名', data.realName)}
            {renderFieldValue('身份证号', data.idNumber)}
            {renderFieldValue('身份证有效期', data.idValidityStart && data.idValidityEnd ? `${data.idValidityStart} 至 ${data.idValidityEnd}` : undefined)}
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {renderFieldValue('身份证人像面', data.idPhotoFront, true)}
            {renderFieldValue('身份证国徽面', data.idPhotoBack, true)}
          </div>
        </CardContent>
      </Card>
    );

    const contactCard = (
      <Card key="contact-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <User className="w-5 h-5 text-blue-600" />
            联系信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('联系手机号', data.phone || data.contactPhone)}
            {renderFieldValue('电子邮箱', data.email || data.contactEmail)}
          </div>
        </CardContent>
      </Card>
    );

    const settlementCard = (
      <Card key="settlement-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <CreditCard className="w-5 h-5 text-blue-600" />
            结算账户信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('账户类型', data.accountType ? (data.accountType === 'bank' ? '银行卡' : '支付宝') : undefined)}
            {renderFieldValue('开户人姓名', data.bankCardholderName || data.accountHolderName)}
            {renderFieldValue('开户银行', data.bankName)}
            {renderFieldValue('开户支行', data.bankBranch)}
            {renderFieldValue('银行卡号/对公账号', data.bankCardNumber || data.accountNumber)}
            {renderFieldValue('支付宝账号', data.alipayAccount)}
            {renderFieldValue('实名认证姓名', data.alipayRealName)}
          </div>
        </CardContent>
      </Card>
    );

    const individualBusinessCard = (
      <Card key="individual-business-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            业务信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('主营社交平台', data.mainPlatform)}
            {renderFieldValue('主页链接', data.mainProfileLink)}
            {renderFieldValue('粉丝/订阅数', data.mainFollowersCount)}
            {renderFieldValue('业务场景描述', data.businessScenario)}
            {renderFieldValue('合作简介', data.cooperationIntro)}
            {renderFieldValue('GitHub 账号', data.githubAccount)}
            {renderFieldValue('作品集/应用链接', data.portfolioLink)}
          </div>
          {renderImageList('平台数据截图', data.platformDataScreenshots)}
          {renderImageList('业务证明材料', data.businessProofFiles)}
          {renderImageList('应用截图', data.appScreenshots)}
        </CardContent>
      </Card>
    );

    const enterpriseCompanyCard = (
      <Card key="enterprise-company-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <Building className="w-5 h-5 text-blue-600" />
            企业主体信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('企业名称', data.companyName)}
            {renderFieldValue('统一社会信用代码', data.creditCode)}
            {renderFieldValue('法人代表姓名', data.legalRepName)}
            {renderFieldValue('法人身份证号', data.legalRepIdNumber)}
            {renderFieldValue('主营业务/产品', data.businessScope)}
            {renderFieldValue('现有业务证明', data.existingBusinessProof)}
          </div>
          {renderFieldValue('营业执照', data.businessLicense, true)}
          {renderImageList('业务资质附件', data.businessLicenseFiles)}
        </CardContent>
      </Card>
    );

    const enterpriseBusinessCard = (
      <Card key="enterprise-business-card">
        <CardHeader className="pb-4 border-b bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            业务信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {renderFieldValue('主营社交平台', data.mainPlatform)}
            {renderFieldValue('品牌/应用主页', data.mainProfileLink)}
            {renderFieldValue('粉丝/订阅数', data.mainFollowersCount)}
            {renderFieldValue('合作简介', data.cooperationIntro)}
          </div>
          {renderImageList('平台数据截图', data.platformDataScreenshots)}
          {renderImageList('业务证明材料', data.businessProofFiles)}
          {renderImageList('应用截图', data.appScreenshots)}
        </CardContent>
      </Card>
    );

    const sections: React.ReactNode[] = [];

    const hasIdentity = !!(data.realName || data.idNumber || data.idPhotoFront || data.idPhotoBack);
    const hasContact = !!(data.phone || data.contactPhone || data.email || data.contactEmail);
    const hasBankInfo = !!(data.accountType || data.bankCardholderName || data.accountHolderName || data.bankName || data.bankBranch || data.bankCardNumber || data.accountNumber || data.alipayAccount);

    if (application.certificationType === 'enterprise') {
      const hasEnterpriseCompany = !!(data.companyName || data.creditCode || data.legalRepName || data.businessLicense || (data.businessLicenseFiles && data.businessLicenseFiles.length) || data.businessScope || data.existingBusinessProof);
      const hasEnterpriseBusiness = !!(data.mainPlatform || data.mainProfileLink || data.mainFollowersCount || data.cooperationIntro || (data.platformDataScreenshots && data.platformDataScreenshots.length) || (data.businessProofFiles && data.businessProofFiles.length) || (data.appScreenshots && data.appScreenshots.length));

      if (hasEnterpriseCompany) sections.push(enterpriseCompanyCard);
      if (hasEnterpriseBusiness) sections.push(enterpriseBusinessCard);
      if (hasContact) sections.push(contactCard);
      if (hasBankInfo) sections.push(settlementCard);
    } else {
      const hasIndividualBusiness = !!(data.mainPlatform || data.mainProfileLink || data.mainFollowersCount || data.businessScenario || data.cooperationIntro || data.githubAccount || data.portfolioLink || (data.platformDataScreenshots && data.platformDataScreenshots.length) || (data.businessProofFiles && data.businessProofFiles.length) || (data.appScreenshots && data.appScreenshots.length));

      if (hasIdentity) sections.push(identityCard);
      if (hasIndividualBusiness) sections.push(individualBusinessCard);
      if (hasContact) sections.push(contactCard);
      if (hasBankInfo) sections.push(settlementCard);
    }

    if (sections.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">暂无可展示的详细资料</CardContent>
        </Card>
      );
    }

    return <>{sections}</>;
  };

  // 格式化时间显示
  const formatTimeDisplay = (timeStr: string | undefined): string => {
    if (!timeStr) return '';
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
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 面包屑和返回按钮 */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="cursor-pointer hover:text-blue-600 transition-colors">
                  资格审核
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>申请详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
        </div>

        {/* 页面标题区域 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">申请详情</h1>
              <p className="text-sm text-gray-500 font-mono">申请编号: {normalizeAppId(application.id)}</p>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            {statusBadge(application.status)}
            {application.permissionLevel && getPermissionLevelBadge(application.permissionLevel)}
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full gap-0">
          <TabsList className="bg-white mb-6 w-full justify-start h-12 rounded-none border-b border-gray-200">
            <TabsTrigger value="basic" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              基本信息
            </TabsTrigger>
            <TabsTrigger value="details" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              详细资料
            </TabsTrigger>
            <TabsTrigger value="history" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              审核记录
            </TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-blue-600" />
                  申请信息
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">申请人</Label>
                    <p className="text-sm font-medium text-gray-900">{application.applicantName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">业务模式</Label>
                    <p className="text-sm text-gray-900">{getBusinessModelName(application.businessModel)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">用户信息类型</Label>
                    <div className="text-sm text-gray-900">
                      {renderUserTypeBadge(application.userType)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">认证方式</Label>
                    <div className="text-sm text-gray-900">
                      {renderCertificationBadge(application.certificationType)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">提交时间</Label>
                    <p className="text-sm font-mono text-gray-900">{formatTimeDisplay(application.submittedAt)}</p>
                  </div>
                  {application.reviewedAt && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">审核时间</Label>
                      <p className="text-sm font-mono text-gray-900">{formatTimeDisplay(application.reviewedAt)}</p>
                    </div>
                  )}
                  {application.permissionLevel && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">权限等级</Label>
                      <div>{getPermissionLevelBadge(application.permissionLevel)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 驳回原因（如果有） */}
            {application.status === 'rejected' && application.rejectionReason && (
              <Card>
                <CardHeader className="pb-4 border-b bg-red-50/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-900">
                    <XCircle className="w-5 h-5 text-red-600" />
                    驳回原因
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-red-800 whitespace-pre-wrap">{application.rejectionReason}</p>
                </CardContent>
              </Card>
            )}

            {/* 内部备注（如果有） */}
            {application.internalNote && (
              <Card>
                <CardHeader className="pb-4 border-b bg-blue-50/50">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-900">
                    <FileText className="w-5 h-5 text-blue-600" />
                    内部备注
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{application.internalNote}</p>
                </CardContent>
              </Card>
            )}

            {/* 操作按钮 */}
            {application.status === 'pending' && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleStartReview} size="lg" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  开始审核
                </Button>
              </div>
            )}
          </TabsContent>

          {/* 详细资料 */}
          <TabsContent value="details" className="space-y-4">
            {renderApplicationData()}
          </TabsContent>

          {/* 审核记录 */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="pb-4 border-b bg-gray-50/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-blue-600" />
                  审核历史记录
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {application.reviewHistory && application.reviewHistory.length > 0 ? (
                  <ul className="space-y-4">
                    {application.reviewHistory.map((entry, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${entry.action === 'approved' ? 'bg-green-100' : entry.action === 'rejected' ? 'bg-red-100' : 'bg-gray-100'}`}>
                            {entry.action === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {entry.action === 'rejected' && <XCircle className="w-5 h-5 text-red-600" />}
                            {entry.action !== 'approved' && entry.action !== 'rejected' && <FileText className="w-5 h-5 text-gray-600" />}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{entry.details}</p>
                          <p className="text-sm text-gray-500">
                            由 {entry.reviewer} 在 {formatTimeDisplay(entry.timestamp)} 操作
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-8">暂无审核记录</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 审核对话框 */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>审核申请</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 1. 审批结论 */}
            <div className="space-y-3">
              <Label>1. 审批结论 <span className="text-red-500">*</span></Label>
              <RadioGroup value={reviewDecision || ''} onValueChange={(value: any) => setReviewDecision(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="cursor-pointer">通过</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="cursor-pointer">驳回</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 2. 风控等级（通过时） */}
            {application.businessModel === 'affiliate' && (
              <div className="space-y-3">
                <Label>2. 挂载大B {reviewDecision === 'approve' && <span className="text-red-500">*</span>}</Label>
                <Select 
                  value={parentPartnerId} 
                  onValueChange={(value: string) => setParentPartnerId(value)}
                  disabled={reviewDecision !== 'approve'}
                >
                  <SelectTrigger className={reviewDecision !== 'approve' ? 'opacity-50' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AIGO_BIGB">AIGO 大B (平台默认)</SelectItem>
                    <SelectItem value="BIGB_001">大B客户001</SelectItem>
                    <SelectItem value="BIGB_002">大B客户002</SelectItem>
                  </SelectContent>
                </Select>
                {reviewDecision !== 'approve' && (
                  <p className="text-sm text-gray-500">请先选择"通过"才能设置挂载大B</p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Label>3. 指定风控等级 {reviewDecision === 'approve' && <span className="text-red-500">*</span>}</Label>
              <Select 
                value={permissionLevel} 
                onValueChange={(value: PermissionLevel) => setPermissionLevel(value)}
                disabled={reviewDecision !== 'approve'}
              >
                <SelectTrigger className={reviewDecision !== 'approve' ? 'opacity-50' : ''}>
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
              {reviewDecision !== 'approve' && (
                <p className="text-sm text-gray-500">请先选择"通过"才能设置风控等级</p>
              )}
              {reviewDecision === 'approve' && (
                <p className="text-sm text-gray-500">风控等级越低（L0），信任度越高，权限越大</p>
              )}
            </div>

            {/* 3. 驳回原因（驳回时） */}
            <div className="space-y-3">
              <Label htmlFor="rejection-reason">
                4. 驳回原因 {reviewDecision === 'reject' && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="请详细说明驳回原因，此内容将展示给申请用户"
                rows={4}
                disabled={reviewDecision !== 'reject'}
                className={reviewDecision !== 'reject' ? 'opacity-50' : ''}
              />
              {reviewDecision !== 'reject' && (
                <p className="text-sm text-gray-500">请先选择"驳回"才能填写驳回原因</p>
              )}
            </div>

            {/* 4. 内部备注 */}
            <div className="space-y-3">
              <Label htmlFor="internal-note">5. 内部备注 (选填)</Label>
              <Textarea
                id="internal-note"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="此处填写的内容仅供内部管理员查看，可用于记录特殊情况或审核考量"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmitReview}>
              确认提交
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 图片预览对话框 */}
      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="max-w-4xl" aria-describedby="image-preview-description">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          <div id="image-preview-description" className="max-h-[70vh] overflow-auto">
            {imagePreview && <img src={imagePreview} alt="预览" className="w-full" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
