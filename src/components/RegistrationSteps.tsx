import React, { useState, useEffect } from 'react';
import { Check, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BusinessModelSelection } from './BusinessModelSelection';
import { IdentityTypeSelection, type IdentityType } from './IdentityTypeSelection';
import { IndividualForm } from './IndividualForm';
import { InfluencerForm } from './InfluencerForm';
import { EnterpriseForm } from './EnterpriseForm';
import { PageContainer } from './PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import type { BusinessModel } from './BusinessModelSelection';

interface ApplicationData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  data?: any; // 原有的表单数据
  businessModel?: BusinessModel;
  identityType?: IdentityType | 'individual'; // 兼容旧类型
}

interface RegistrationStepsProps {
  onSubmit: (data: any) => void;
  initialBusinessModel?: BusinessModel | null;
  initialIdentityType?: IdentityType | null;
  onBusinessModelChange?: (model: BusinessModel) => void;
  onIdentityTypeChange?: (identity: IdentityType) => void;
  existingApplicationId?: string | null;
  applicationData?: ApplicationData | null;
  onGoToDashboard?: () => void;
  onReapply?: () => void;
}

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
  // 新流程：身份类型 → 业务模式 → 表单 → 状态
  // 如果有现有申请，直接显示申请状态；否则从身份类型选择开始
  const [currentStep, setCurrentStep] = useState(existingApplicationId ? 'status' : 'identity');
  const [selectedIdentityType, setSelectedIdentityType] = useState<IdentityType | null>(initialIdentityType);
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel | null>(initialBusinessModel);
  // 是否为修改信息模式（驳回后选择修改信息）
  const [isEditMode, setIsEditMode] = useState(false);
  // 是否为重新申请模式（驳回后选择重新申请）
  const [isReapplying, setIsReapplying] = useState(false);

  // 当existingApplicationId或applicationData变化时，更新当前步骤和状态
  useEffect(() => {
    // 如果处于重新申请模式，不执行自动跳转逻辑，让用户正常走流程
    if (isReapplying) {
      return;
    }

    if (existingApplicationId && applicationData) {
      // 有申请ID和数据
      if (applicationData.status === 'rejected' && isEditMode) {
        // 修改信息模式：直接跳转到表单
        setCurrentStep('form');
      } else if (applicationData.status !== 'rejected') {
        // 非驳回状态：显示状态页
        setCurrentStep('status');
        // 从申请数据恢复选择的状态
        if (applicationData.identityType) {
          // 兼容旧的身份类型
          const identityType = applicationData.identityType === 'individual' ? 'developer' : 
                              applicationData.identityType as IdentityType;
          setSelectedIdentityType(identityType);
        }
        if (applicationData.businessModel) {
          setSelectedBusinessModel(applicationData.businessModel);
        }
      }
      // 驳回状态但非编辑模式：保持在状态页（用户可以点击重新申请）
    } else if (!existingApplicationId && !applicationData) {
      // 没有申请ID和数据（首次访问），从身份类型选择开始
      setCurrentStep('identity');
      setIsEditMode(false); // 重置编辑模式
      setIsReapplying(false); // 重置重新申请模式
    }
  }, [existingApplicationId, applicationData, isEditMode, isReapplying]);

  const handleIdentitySelect = (identity: IdentityType) => {
    setSelectedIdentityType(identity);
    onIdentityTypeChange?.(identity);
    setSelectedBusinessModel(null); // 切换身份类型时清空业务模式选择
    setIsEditMode(false); // 切换身份类型时退出编辑模式
    // 如果处于重新申请模式，保持重新申请模式
    setCurrentStep('business');
  };

  const handleBusinessModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModel(model);
    onBusinessModelChange?.(model);
    setIsEditMode(false); // 选择业务模式时退出编辑模式
    // 如果处于重新申请模式，保持重新申请模式
    setCurrentStep('form');
  };

  // 处理重新申请：清空所有选择，从身份选择开始
  const handleReapply = () => {
    setSelectedIdentityType(null);
    setSelectedBusinessModel(null);
    setIsEditMode(false);
    setIsReapplying(true); // 进入重新申请模式
    onIdentityTypeChange?.(null);
    onBusinessModelChange?.(null);
    if (onReapply) {
      onReapply();
    }
    setCurrentStep('identity');
  };

  // 处理修改信息：恢复之前的选择，直接跳转到表单
  const handleEditInfo = () => {
    if (applicationData) {
      // 恢复身份类型和业务模式
      if (applicationData.identityType) {
        const identityType = applicationData.identityType === 'individual' ? 'developer' : 
                            applicationData.identityType as IdentityType;
        setSelectedIdentityType(identityType);
        onIdentityTypeChange?.(identityType);
      }
      if (applicationData.businessModel) {
        setSelectedBusinessModel(applicationData.businessModel);
        onBusinessModelChange?.(applicationData.businessModel);
      }
      // 进入编辑模式
      setIsEditMode(true);
      // 跳转到表单页面
      setCurrentStep('form');
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    setIsEditMode(false); // 提交后退出编辑模式
    setIsReapplying(false); // 提交后退出重新申请模式
    setCurrentStep('status');
  };

  const canAccessTab = (tab: string) => {
    // 如果处于重新申请模式，按照正常流程逐步解锁
    if (isReapplying) {
      if (tab === 'identity') return true;
      if (tab === 'business') return selectedIdentityType !== null;
      if (tab === 'form') return selectedIdentityType !== null && selectedBusinessModel !== null;
      if (tab === 'status') return false; // 重新申请模式下，status tab 在提交前不可访问
      return false;
    }

    // 如果有申请数据，根据状态决定访问权限
    if (applicationData) {
      // 审核中：只能访问status tab
      if (applicationData.status === 'pending') {
        return tab === 'status';
      }
      // 已驳回：根据是否处于编辑模式决定
      if (applicationData.status === 'rejected') {
        if (isEditMode) {
          // 修改信息模式：只能访问form tab，其他tab禁用
          return tab === 'form';
        } else {
          // 非编辑模式：可以访问status tab和identity tab（用于重新申请）
          return tab === 'status' || tab === 'identity';
        }
      }
      // 审核通过：只能访问status tab（会显示进入管理后台按钮）
      if (applicationData.status === 'approved') {
        return tab === 'status';
      }
    }
    
    // 没有申请数据，按照正常流程逐步解锁
    if (tab === 'identity') return true;
    if (tab === 'business') return selectedIdentityType !== null;
    if (tab === 'form') return selectedIdentityType !== null && selectedBusinessModel !== null;
    if (tab === 'status') return existingApplicationId !== null;
    return false;
  };

  const handleTabChange = (value: string) => {
    if (canAccessTab(value)) {
      setCurrentStep(value);
    }
  };

  // 根据身份类型选择对应的表单组件
  const getFormComponent = () => {
    if (!selectedIdentityType || !selectedBusinessModel) return null;

    // 如果是被驳回的申请，传递原有数据用于预加载
    const initialData = applicationData?.status === 'rejected' && applicationData?.data 
      ? applicationData.data 
      : undefined;
    
    const formProps = {
      onBack: () => {
        // 如果是编辑模式，返回时应该回到状态页
        if (isEditMode) {
          setIsEditMode(false);
          setCurrentStep('status');
        } else {
          setCurrentStep('business');
        }
      },
      onSubmit: handleFormSubmit,
      initialData: initialData,
      identityType: selectedIdentityType, // 传递身份类型给表单
      businessModel: selectedBusinessModel, // 传递业务模式给表单
    };

    // developer 和 agent 都使用个人表单，但需要区分
    if (selectedIdentityType === 'developer' || selectedIdentityType === 'agent') {
      return <IndividualForm {...formProps} />;
    }
    
    if (selectedIdentityType === 'influencer') {
      return <InfluencerForm {...formProps} />;
    }
    
    if (selectedIdentityType === 'enterprise') {
      return <EnterpriseForm {...formProps} />;
    }

    return null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'identity':
        return (
          <IdentityTypeSelection
            onSelect={handleIdentitySelect}
            selectedType={selectedIdentityType}
          />
        );

      case 'business':
        return (
          <BusinessModelSelection
            onSelect={handleBusinessModelSelect}
            selectedModel={selectedBusinessModel}
            identityType={selectedIdentityType}
          />
        );

      case 'form':
        if (!selectedIdentityType || !selectedBusinessModel) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">请先完成身份类型和业务模式选择</p>
            </div>
          );
        }

        return (
          <>
            {isEditMode && applicationData?.status === 'rejected' && applicationData?.data && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-900">
                  您之前提交的信息已自动填充到表单中，请根据驳回原因修改相关信息后重新提交。
                </AlertDescription>
              </Alert>
            )}
            {getFormComponent()}
          </>
        );

      case 'status':
        if (!applicationData) {
          // 刚提交的情况
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">申请已提交</h2>
                  <p className="text-gray-600">我们已收到您的申请，将在1-3个工作日内完成审核</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-sm text-left">
                  <p className="font-medium text-blue-900 mb-2">接下来您需要：</p>
                  <ul className="space-y-2 text-blue-700">
                    <li>• 等待审核结果通知</li>
                    <li>• 保持联系方式畅通</li>
                    <li>• 审核通过后即可开始使用服务</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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
            developer: '独立开发者',
            influencer: '旅行达人',
            enterprise: '旅行相关企业',
            agent: '个人旅行代理',
            individual: '个人认证', // 兼容旧类型
          };
          return names[type as keyof typeof names] || type;
        };

        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className={`border ${config.borderColor} bg-white`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor}`}>
                      <StatusIcon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl mb-2 font-semibold text-gray-900">{config.title}</h2>
                      {config.badge}
                    </div>
                  </div>
                </div>

                {/* 申请信息 */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">业务模式</p>
                    <p className="text-sm font-medium text-gray-900">{selectedBusinessModel ? getBusinessModelName(selectedBusinessModel) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">身份类型</p>
                    <p className="text-sm font-medium text-gray-900">{selectedIdentityType ? getIdentityTypeName(selectedIdentityType) : '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">提交时间</p>
                    <p className="text-sm font-mono text-gray-900">{applicationData.submittedAt}</p>
                  </div>
                  {applicationData.reviewedAt && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">审核时间</p>
                      <p className="text-sm font-mono text-gray-900">{applicationData.reviewedAt}</p>
                    </div>
                  )}
                </div>

                {/* 审核中状态 */}
                {applicationData.status === 'pending' && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="ml-2 text-yellow-900">
                      您的资料已提交，我们将在1-3个工作日内完成审核，请耐心等待。审核结果将通过短信和邮件通知您。
                    </AlertDescription>
                  </Alert>
                )}

                {/* 审核通过状态 */}
                {applicationData.status === 'approved' && (
                  <>
                    <Alert className="bg-green-50 border-green-200 mb-4">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="ml-2 text-green-900">
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
                      <AlertDescription className="ml-2 text-red-900">
                        很抱歉，您的认证申请未通过审核。请根据以下原因修改相关信息后重新提交。
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                      <h4 className="mb-3 font-semibold text-red-900">驳回原因：</h4>
                      <p className="text-sm text-red-800 whitespace-pre-wrap">{applicationData.rejectionReason}</p>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button 
                        variant="outline"
                        onClick={handleReapply}
                      >
                        重新申请
                      </Button>
                      <Button 
                        onClick={handleEditInfo}
                      >
                        修改信息
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
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
            value="identity"
            disabled={!canAccessTab('identity') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            身份选择
          </TabsTrigger>
          <TabsTrigger 
            value="business"
            disabled={!canAccessTab('business') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            业务选择
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
            disabled={!canAccessTab('status') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            申请状态
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>

        <TabsContent value="business" className="min-h-[400px]">
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
