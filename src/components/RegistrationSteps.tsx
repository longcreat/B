import { useState, useEffect } from 'react';
import { Check, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BusinessModelSelection } from './BusinessModelSelection';
import { IndividualForm } from './IndividualForm';
import { InfluencerForm } from './InfluencerForm';
import { EnterpriseForm } from './EnterpriseForm';
import { Card, CardContent } from './ui/card';
import { User, Users, Building2 } from 'lucide-react';
import { PageContainer } from './PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

type BusinessModel = 'mcp' | 'saas' | 'affiliate' | null;
type IdentityType = 'individual' | 'influencer' | 'enterprise' | null;

interface ApplicationData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  data?: any; // 原有的表单数据
}

interface RegistrationStepsProps {
  onSubmit: (data: any) => void;
  initialBusinessModel?: BusinessModel;
  initialIdentityType?: IdentityType;
  onBusinessModelChange?: (model: BusinessModel) => void;
  onIdentityTypeChange?: (identity: IdentityType) => void;
  existingApplicationId?: string | null;
  applicationData?: ApplicationData | null;
  onGoToDashboard?: () => void;
  onReapply?: () => void;
}

const identityTypes = [
  {
    id: 'individual' as const,
    title: '个人认证',
    description: '适合个人开发者和独立创作者',
    icon: User,
  },
  {
    id: 'influencer' as const,
    title: '博主认证',
    description: '适合拥有一定粉丝基础的内容创作者',
    icon: Users,
  },
  {
    id: 'enterprise' as const,
    title: '企业认证',
    description: '适合企业用户和团队使用',
    icon: Building2,
  },
];

export function RegistrationSteps({
  onSubmit,
  initialBusinessModel = null,
  initialIdentityType = null,
  onBusinessModelChange,
  onIdentityTypeChange,
  existingApplicationId = null,
  applicationData = null,
  onGoToDashboard,
  onReapply,
}: RegistrationStepsProps) {
  // 如果有现有申请，直接显示申请状态；否则从业务选择开始
  const [currentStep, setCurrentStep] = useState(existingApplicationId ? 'status' : 'business');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel>(initialBusinessModel);
  const [selectedIdentityType, setSelectedIdentityType] = useState<IdentityType>(initialIdentityType);

  // 当existingApplicationId变化时，更新当前步骤
  useEffect(() => {
    if (existingApplicationId && applicationData) {
      // 有申请ID和数据，显示状态页
      setCurrentStep('status');
    } else if (!existingApplicationId && !applicationData) {
      // 没有申请ID和数据（重新申请或首次访问），显示业务选择
      setCurrentStep('business');
    }
  }, [existingApplicationId, applicationData]);

  const handleBusinessModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModel(model);
    onBusinessModelChange?.(model);
    setCurrentStep('identity');
  };

  const handleIdentitySelect = (identity: IdentityType) => {
    setSelectedIdentityType(identity);
    onIdentityTypeChange?.(identity);
    setCurrentStep('form');
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    setCurrentStep('status');
  };

  const canAccessTab = (tab: string) => {
    // 如果有申请数据，根据状态决定访问权限
    if (applicationData) {
      // 审核中：只能访问status tab
      if (applicationData.status === 'pending') {
        return tab === 'status';
      }
      // 已驳回：可以访问所有tab（允许修改重新提交）
      if (applicationData.status === 'rejected') {
        if (tab === 'business') return true;
        if (tab === 'identity') return selectedBusinessModel !== null;
        if (tab === 'form') return selectedBusinessModel !== null && selectedIdentityType !== null;
        if (tab === 'status') return true;
        return false;
      }
      // 审核通过：只能访问status tab（会显示进入管理后台按钮）
      if (applicationData.status === 'approved') {
        return tab === 'status';
      }
    }
    
    // 没有申请数据，按照正常流程逐步解锁
    if (tab === 'business') return true;
    if (tab === 'identity') return selectedBusinessModel !== null;
    if (tab === 'form') return selectedBusinessModel !== null && selectedIdentityType !== null;
    if (tab === 'status') return existingApplicationId !== null;
    return false;
  };

  const handleTabChange = (value: string) => {
    if (canAccessTab(value)) {
      setCurrentStep(value);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'business':
        return (
          <BusinessModelSelection 
            onSelect={handleBusinessModelSelect}
            selectedModel={selectedBusinessModel}
          />
        );

      case 'identity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {identityTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedIdentityType === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'hover:shadow-lg hover:border-blue-300'
                }`}
                onClick={() => handleIdentitySelect(type.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedIdentityType === type.id
                        ? 'bg-blue-500'
                        : 'bg-blue-100'
                    }`}>
                      <type.icon className={`w-8 h-8 ${
                        selectedIdentityType === type.id
                          ? 'text-white'
                          : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'form':
        if (!selectedIdentityType) return null;
        
        // 如果是被驳回的申请，传递原有数据用于预加载
        const initialData = applicationData?.status === 'rejected' && applicationData?.data 
          ? applicationData.data 
          : undefined;
        
        const formProps = {
          onBack: () => setCurrentStep('identity'),
          onSubmit: handleFormSubmit,
          initialData: initialData,
        };

        return (
          <>
            {initialData && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-900">
                  您之前提交的信息已自动填充到表单中，请根据驳回原因修改相关信息后重新提交。
                </AlertDescription>
              </Alert>
            )}
            
            {selectedIdentityType === 'individual' && <IndividualForm {...formProps} />}
            {selectedIdentityType === 'influencer' && <InfluencerForm {...formProps} />}
            {selectedIdentityType === 'enterprise' && <EnterpriseForm {...formProps} />}
          </>
        );

      case 'status':
        if (!applicationData) {
          // 刚提交的情况
          return (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">申请已提交</h2>
                <p className="text-gray-600">我们已收到您的申请，将在1-3个工作日内完成审核</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-left">
                <p className="font-medium text-blue-900 mb-2">接下来您需要：</p>
                <ul className="space-y-2 text-blue-700">
                  <li>• 等待审核结果通知</li>
                  <li>• 保持联系方式畅通</li>
                  <li>• 审核通过后即可开始使用服务</li>
                </ul>
              </div>
            </div>
          );
        }

        // 有申请数据的情况，显示具体审核状态
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

        const config = statusConfig[applicationData.status];
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
          <div className="max-w-3xl mx-auto">
            <Card className={`border-2 ${config.borderColor}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor}`}>
                      <StatusIcon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl mb-2">{config.title}</h2>
                      {config.badge}
                    </div>
                  </div>
                </div>

                {/* 申请信息 */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div>
                    <p className="text-gray-500 mb-1">业务模式</p>
                    <p>{selectedBusinessModel ? getBusinessModelName(selectedBusinessModel) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">身份类型</p>
                    <p>{selectedIdentityType ? getIdentityTypeName(selectedIdentityType) : '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">提交时间</p>
                    <p>{applicationData.submittedAt}</p>
                  </div>
                  {applicationData.reviewedAt && (
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">审核时间</p>
                      <p>{applicationData.reviewedAt}</p>
                    </div>
                  )}
                </div>

                {/* 审核中状态 */}
                {applicationData.status === 'pending' && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="ml-2">
                      您的资料已提交，我们将在1-3个工作日内完成审核，请耐心等待。审核结果将通过短信和邮件通知您。
                    </AlertDescription>
                  </Alert>
                )}

                {/* 审核通过状态 */}
                {applicationData.status === 'approved' && (
                  <>
                    <Alert className="bg-green-50 border-green-200 mb-4">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="ml-2">
                        恭喜！您的认证申请已通过审核。您现在可以访问专属的后台管理系统，开始您的业务之旅。
                      </AlertDescription>
                    </Alert>
                    {onGoToDashboard && (
                      <div className="flex justify-end">
                        <Button onClick={onGoToDashboard} size="lg">
                          进入管理后台
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {/* 审核驳回状态 */}
                {applicationData.status === 'rejected' && applicationData.rejectionReason && (
                  <>
                    <Alert className="bg-red-50 border-red-200 mb-4">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="ml-2">
                        很抱歉，您的认证申请未通过审核。请根据以下原因修改相关信息后重新提交。
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                      <h4 className="mb-3 text-red-900">驳回原因：</h4>
                      <p className="text-red-800 whitespace-pre-wrap">{applicationData.rejectionReason}</p>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button 
                        onClick={() => {
                          if (onReapply) {
                            onReapply();
                          }
                          setCurrentStep('business');
                        }}
                      >
                        重新申请
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer
      breadcrumbs={[
        { label: '注册服务' },
      ]}
      maxWidth="6xl"
    >
      <Tabs value={currentStep} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 h-12 bg-gray-100">
          <TabsTrigger 
            value="business"
            disabled={!canAccessTab('business')}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            业务选择
          </TabsTrigger>
          <TabsTrigger 
            value="identity"
            disabled={!canAccessTab('identity')}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            身份选择
          </TabsTrigger>
          <TabsTrigger 
            value="form"
            disabled={!canAccessTab('form')}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            填写信息
          </TabsTrigger>
          <TabsTrigger 
            value="status"
            disabled={!canAccessTab('status')}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            申请状态
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>

        <TabsContent value="identity" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>

        <TabsContent value="form" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>

        <TabsContent value="status" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export type { BusinessModel, IdentityType };
