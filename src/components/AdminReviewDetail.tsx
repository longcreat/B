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
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle, ZoomIn } from 'lucide-react';
import type { ApplicationData } from '../data/mockApplications';

interface AdminReviewDetailProps {
  application: ApplicationData;
  onBack: () => void;
  onApprove: (id: string, permissionLevel: string, internalNote?: string) => void;
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
  const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>('L0');
  const [rejectionReason, setRejectionReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleStartReview = () => {
    setReviewDecision(null);
    setPermissionLevel('L4'); // 默认设置为入门级
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
      onApprove(application.id, permissionLevel, internalNote || undefined);
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

  const getIdentityTypeName = (type: string) => {
    const names = {
      individual: '个人认证',
      influencer: '博主认证',
      enterprise: '企业认证',
    };
    return names[type as keyof typeof names] || type;
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

  const renderFieldValue = (label: string, value: any, isImage?: boolean) => {
    if (!value) return null;

    if (isImage) {
      return (
        <div key={label} className="space-y-2">
          <Label>{label}</Label>
          <div className="relative group">
            <img
              src={value}
              alt={label}
              className="max-w-xs border rounded cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setImagePreview(value)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={label} className="space-y-2">
        <Label>{label}</Label>
        <p className="text-gray-900">{value}</p>
      </div>
    );
  };

  const renderApplicationData = () => {
    const { data } = application;
    
    if (application.identityType === 'individual') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="pb-2 border-b">身份信息</h3>
            {renderFieldValue('真实姓名', data.realName)}
            {renderFieldValue('身份证号', data.idNumber)}
            {renderFieldValue('身份证有效期', `${data.idValidityStart} 至 ${data.idValidityEnd}`)}
            <div className="grid grid-cols-2 gap-4">
              {renderFieldValue('身份证人像面', data.idPhotoFront, true)}
              {renderFieldValue('身份证国徽面', data.idPhotoBack, true)}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">业务信息</h3>
            {data.promotionChannels && data.promotionChannels.length > 0 && (
              <div className="space-y-2">
                <Label>主要推广渠道</Label>
                <div className="flex flex-wrap gap-2">
                  {data.promotionChannels.map((channel: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {channel}
                    </span>
                  ))}
                </div>
                {data.promotionChannels.includes('其他') && data.promotionChannelsOther && (
                  <p className="text-gray-600 ml-2">其他渠道说明：{data.promotionChannelsOther}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">联系信息</h3>
            {renderFieldValue('联系手机号', data.phone)}
            {renderFieldValue('电子邮箱', data.email)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">结算账户信息</h3>
            {renderFieldValue('账户类型', data.accountType === 'bank' ? '银行卡' : '支付宝')}
            {data.accountType === 'bank' && (
              <>
                {renderFieldValue('开户人姓名', data.bankCardholderName)}
                {renderFieldValue('开户银行', data.bankName)}
                {renderFieldValue('开户支行', data.bankBranch)}
                {renderFieldValue('银行卡号', data.bankCardNumber)}
              </>
            )}
            {data.accountType === 'alipay' && (
              <>
                {renderFieldValue('支付宝账号', data.alipayAccount)}
                {renderFieldValue('实名认证姓名', data.alipayRealName)}
              </>
            )}
          </div>
        </>
      );
    }

    if (application.identityType === 'influencer') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="pb-2 border-b">身份信息</h3>
            {renderFieldValue('真实姓名', data.realName)}
            {renderFieldValue('身份证号', data.idNumber)}
            {renderFieldValue('身份证有效期', `${data.idValidityStart} 至 ${data.idValidityEnd}`)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">商业影响力信息</h3>
            {renderFieldValue('主营社交平台', data.mainPlatform)}
            {renderFieldValue('个人主页链接', data.mainProfileLink)}
            {renderFieldValue('粉丝数/订阅数', data.mainFollowersCount)}
            {data.cooperationIntro && renderFieldValue('合作简介', data.cooperationIntro)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">联系信息</h3>
            {renderFieldValue('联系手机号', data.phone)}
            {renderFieldValue('电子邮箱', data.email)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">结算账户信息</h3>
            {renderFieldValue('账户类型', data.accountType === 'bank' ? '银行卡' : '支付宝')}
            {data.accountType === 'bank' && (
              <>
                {renderFieldValue('开户银行', data.bankName)}
                {renderFieldValue('开户支行', data.bankBranch)}
                {renderFieldValue('银行卡号', data.bankCardNumber)}
              </>
            )}
          </div>
        </>
      );
    }

    if (application.identityType === 'enterprise') {
      return (
        <>
          <div className="space-y-4">
            <h3 className="pb-2 border-b">企业主体信息</h3>
            {renderFieldValue('企业名称', data.companyName)}
            {renderFieldValue('统一社会信用代码', data.creditCode)}
            {renderFieldValue('营业执照', data.businessLicense, true)}
            {renderFieldValue('法人代表姓名', data.legalRepName)}
            {renderFieldValue('法人身份证号', data.legalRepIdNumber)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">业务联系人信息</h3>
            {renderFieldValue('联系人姓名', data.contactName)}
            {renderFieldValue('联系人手机号', data.contactPhone)}
            {renderFieldValue('联系人电子邮箱', data.contactEmail)}
          </div>

          <div className="space-y-4">
            <h3 className="pb-2 border-b">对公结算账户信息</h3>
            {renderFieldValue('开户主体名称', data.accountHolderName)}
            {renderFieldValue('开户银行', data.bankName)}
            {renderFieldValue('开户支行', data.bankBranch)}
            {renderFieldValue('对公银行账号', data.accountNumber)}
          </div>
        </>
      );
    }
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
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                资质审核
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>申请详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>申请详情</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {statusBadge(application.status)}
                <span className="text-gray-500">申请编号：{application.id}</span>
                {application.permissionLevel && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                    {getPermissionLevelName(application.permissionLevel)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

          <CardContent className="space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label>申请人</Label>
                <p className="mt-1">{application.applicantName}</p>
              </div>
              <div>
                <Label>业务模式</Label>
                <p className="mt-1">{getBusinessModelName(application.businessModel)}</p>
              </div>
              <div>
                <Label>身份类型</Label>
                <p className="mt-1">{getIdentityTypeName(application.identityType)}</p>
              </div>
              <div>
                <Label>提交时间</Label>
                <p className="mt-1">{application.submittedAt}</p>
              </div>
              {application.reviewedAt && (
                <div>
                  <Label>审核时间</Label>
                  <p className="mt-1">{application.reviewedAt}</p>
                </div>
              )}
            </div>

            {/* 驳回原因（如果有） */}
            {application.status === 'rejected' && application.rejectionReason && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <Label className="text-red-900">驳回原因</Label>
                <p className="mt-2 text-red-800 whitespace-pre-wrap">{application.rejectionReason}</p>
              </div>
            )}

            {/* 内部备注（如果有） */}
            {application.internalNote && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="text-blue-900">内部备注</Label>
                <p className="mt-2 text-blue-800 whitespace-pre-wrap">{application.internalNote}</p>
              </div>
            )}

            {/* 详细资料 */}
            <div className="space-y-6">
              {renderApplicationData()}
            </div>

            {/* 操作按钮 */}
            {application.status === 'pending' && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button onClick={handleStartReview} size="lg">
                  开始审核
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

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
            <div className="space-y-3">
              <Label>2. 指定风控等级 {reviewDecision === 'approve' && <span className="text-red-500">*</span>}</Label>
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
                3. 驳回原因 {reviewDecision === 'reject' && <span className="text-red-500">*</span>}
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
              <Label htmlFor="internal-note">4. 内部备注 (选填)</Label>
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
