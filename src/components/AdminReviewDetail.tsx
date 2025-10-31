import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, CheckCircle, XCircle, ZoomIn } from 'lucide-react';
import type { ApplicationData } from './AdminReviewList';

interface AdminReviewDetailProps {
  application: ApplicationData;
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function AdminReviewDetail({
  application,
  onBack,
  onApprove,
  onReject,
}: AdminReviewDetailProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleApprove = () => {
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    onApprove(application.id);
    setShowApproveDialog(false);
    toast.success('审核已通过');
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('请填写驳回原因');
      return;
    }
    onReject(application.id, rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason('');
    toast.success('已驳回申请');
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
            {renderFieldValue('��户主体名称', data.accountHolderName)}
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>申请详情</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  {statusBadge(application.status)}
                  <span className="text-gray-500">申请编号：{application.id}</span>
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

            {/* 详细资料 */}
            <div className="space-y-6">
              {renderApplicationData()}
            </div>

            {/* 操作按钮 */}
            {application.status === 'pending' && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  驳回
                </Button>
                <Button onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  通过
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 通过确认对话框 */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认通过审核</AlertDialogTitle>
            <AlertDialogDescription>
              确认通过该用户的认证申请吗？通过后，用户将获得相应的业务权限并可以访问后台管理系统。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove}>确认通过</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 驳回对话框 */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>驳回申请</AlertDialogTitle>
            <AlertDialogDescription>
              请填写具体、清晰的驳回原因，以便用户了解需要修改的内容。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">驳回原因 <span className="text-red-500">*</span></Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="请详细说明驳回原因，例如：身份证照片模糊、银行卡信息不完整等"
              rows={6}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason('')}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject}>确认驳回</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
