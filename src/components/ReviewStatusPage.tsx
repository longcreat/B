import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface RejectionInfo {
  reason: string;
  fields: string[];
}

interface ReviewStatusPageProps {
  status: ReviewStatus;
  businessModel: string;
  identityType: string;
  submittedAt: string;
  rejectionInfo?: RejectionInfo;
  onBack: () => void;
  onEdit: () => void;
  onGoToDashboard?: () => void;
}

export function ReviewStatusPage({
  status,
  businessModel,
  identityType,
  submittedAt,
  rejectionInfo,
  onBack,
  onEdit,
  onGoToDashboard,
}: ReviewStatusPageProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: '审核中',
      badge: <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">审核中</Badge>,
    },
    approved: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: '审核通过',
      badge: <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">已通过</Badge>,
    },
    rejected: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: '审核未通过',
      badge: <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">已驳回</Badge>,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <Card className={`border-2 ${config.borderColor}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor}`}>
                  <StatusIcon className={`w-8 h-8 ${config.color}`} />
                </div>
                <div>
                  <CardTitle className="mb-2">{config.title}</CardTitle>
                  {config.badge}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 申请信息 */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500 mb-1">业务模式</p>
                <p>{getBusinessModelName(businessModel)}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">身份类型</p>
                <p>{getIdentityTypeName(identityType)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">提交时间</p>
                <p>{submittedAt}</p>
              </div>
            </div>

            {/* 审核中状态 */}
            {status === 'pending' && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="ml-2">
                  您的资料已提交，我们将在1-3个工作日内完成审核，请耐心等待。审核结果将通过短信和邮件通知您。
                </AlertDescription>
              </Alert>
            )}

            {/* 审核通过状态 */}
            {status === 'approved' && (
              <>
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="ml-2">
                    恭喜！您的认证申请已通过审核。您现在可以访问专属的后台管理系统，开始您的业务之旅。
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end">
                  <Button onClick={onGoToDashboard} size="lg">
                    进入管理后台
                  </Button>
                </div>
              </>
            )}

            {/* 审核驳回状态 */}
            {status === 'rejected' && rejectionInfo && (
              <>
                <Alert className="bg-red-50 border-red-200">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="ml-2">
                    很抱歉，您的认证申请未通过审核。请根据以下原因修改相关信息后重新提交。
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="mb-3 text-red-900">驳回原因：</h4>
                  <p className="text-red-800 whitespace-pre-wrap">{rejectionInfo.reason}</p>
                  
                  {rejectionInfo.fields.length > 0 && (
                    <div className="mt-4">
                      <p className="text-red-900 mb-2">需要修改的字段：</p>
                      <ul className="list-disc list-inside space-y-1">
                        {rejectionInfo.fields.map((field, index) => (
                          <li key={index} className="text-red-800">{field}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={onBack}>
                    取消
                  </Button>
                  <Button onClick={onEdit}>
                    修改并重新提交
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
