import React, { useState, useEffect } from 'react';
import { Check, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BusinessModelSelection } from './BusinessModelSelection';
import { IdentityTypeSelection, type UserType } from './IdentityTypeSelection';
import { CertificationTypeSelection, type CertificationType } from './CertificationTypeSelection';
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
  userType?: UserType; // 用户信息类型
  certificationType?: CertificationType; // 认证方式
  identityType?: string; // 兼容旧类型
}

interface RegistrationStepsProps {
  onSubmit: (data: any) => void;
  initialBusinessModel?: BusinessModel | null;
  initialUserType?: UserType | null;
  initialCertificationType?: CertificationType | null;
  onBusinessModelChange?: (model: BusinessModel) => void;
  onUserTypeChange?: (userType: UserType) => void;
  onCertificationTypeChange?: (certType: CertificationType) => void;
  existingApplicationId?: string | null;
  applicationData?: ApplicationData | null;
  onGoToDashboard?: () => void;
  onReapply?: () => void;
}

export function RegistrationSteps({
  onSubmit,
  initialBusinessModel = null,
  initialUserType = null,
  initialCertificationType = null,
  onBusinessModelChange,
  onUserTypeChange,
  onCertificationTypeChange,
  existingApplicationId = null,
  applicationData = null,
  onGoToDashboard,
  onReapply,
}: RegistrationStepsProps) {
  // 新流程：用户信息类型 → 认证方式 → 业务模式 → 表单 → 状态
  // 如果有现有申请，直接显示申请状态；否则从用户信息类型选择开始
  const [currentStep, setCurrentStep] = useState(existingApplicationId ? 'status' : 'userType');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(initialUserType);
  const [selectedCertificationType, setSelectedCertificationType] = useState<CertificationType | null>(initialCertificationType);
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
      } else if (applicationData.status === 'rejected' && !isEditMode) {
        // 驳回状态但非编辑模式：显示状态页（用户可以点击重新申请或修改信息）
        setCurrentStep('status');
        // 从申请数据恢复选择的状态
        if (applicationData.userType) {
          setSelectedUserType(applicationData.userType);
        }
        if (applicationData.certificationType) {
          setSelectedCertificationType(applicationData.certificationType);
        }
        if (applicationData.businessModel) {
          setSelectedBusinessModel(applicationData.businessModel);
        }
      } else if (applicationData.status === 'pending' || applicationData.status === 'approved') {
        // 待审核或已通过状态：显示状态页
        setCurrentStep('status');
        // 从申请数据恢复选择的状态
        if (applicationData.userType) {
          setSelectedUserType(applicationData.userType);
        }
        if (applicationData.certificationType) {
          setSelectedCertificationType(applicationData.certificationType);
        }
        if (applicationData.businessModel) {
          setSelectedBusinessModel(applicationData.businessModel);
        }
      }
    } else if (!existingApplicationId && !applicationData) {
      // 没有申请ID和数据（首次访问），从用户信息类型选择开始
      setCurrentStep('userType');
      setIsEditMode(false); // 重置编辑模式
      setIsReapplying(false); // 重置重新申请模式
    }
  }, [existingApplicationId, applicationData, isEditMode, isReapplying]);

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    onUserTypeChange?.(userType);
    setSelectedCertificationType(null); // 切换用户类型时清空认证方式选择
    setSelectedBusinessModel(null); // 切换用户类型时清空业务模式选择
    setIsEditMode(false); // 切换用户类型时退出编辑模式
    setCurrentStep('certification');
  };

  const handleCertificationTypeSelect = (certType: CertificationType) => {
    setSelectedCertificationType(certType);
    onCertificationTypeChange?.(certType);
    setSelectedBusinessModel(null); // 切换认证方式时清空业务模式选择
    setIsEditMode(false); // 切换认证方式时退出编辑模式
    setCurrentStep('business');
  };

  const handleBusinessModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModel(model);
    onBusinessModelChange?.(model);
    setIsEditMode(false); // 选择业务模式时退出编辑模式
    setCurrentStep('form');
  };

  // 处理重新申请：清空所有选择，从用户信息类型选择开始
  const handleReapply = () => {
    setSelectedUserType(null);
    setSelectedCertificationType(null);
    setSelectedBusinessModel(null);
    setIsEditMode(false);
    setIsReapplying(true); // 进入重新申请模式
    onUserTypeChange?.(null as any);
    onCertificationTypeChange?.(null as any);
    onBusinessModelChange?.(null as any);
    if (onReapply) {
      onReapply();
    }
    setCurrentStep('userType');
  };

  // 处理修改信息：恢复之前的选择，直接跳转到表单
  const handleEditInfo = () => {
    if (applicationData) {
      // 恢复用户信息类型、认证方式和业务模式
      if (applicationData.userType) {
        setSelectedUserType(applicationData.userType);
        onUserTypeChange?.(applicationData.userType);
      }
      if (applicationData.certificationType) {
        setSelectedCertificationType(applicationData.certificationType);
        onCertificationTypeChange?.(applicationData.certificationType);
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
      if (tab === 'userType') return true;
      if (tab === 'certification') return selectedUserType !== null;
      if (tab === 'business') return selectedUserType !== null && selectedCertificationType !== null;
      if (tab === 'form') return selectedUserType !== null && selectedCertificationType !== null && selectedBusinessModel !== null;
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
          // 非编辑模式：可以访问status tab和userType tab（用于重新申请）
          return tab === 'status' || tab === 'userType';
        }
      }
      // 审核通过：只能访问status tab（会显示进入管理后台按钮）
      if (applicationData.status === 'approved') {
        return tab === 'status';
      }
    }
    
    // 没有申请数据，按照正常流程逐步解锁
    if (tab === 'userType') return true;
    if (tab === 'certification') return selectedUserType !== null;
    if (tab === 'business') return selectedUserType !== null && selectedCertificationType !== null;
    if (tab === 'form') return selectedUserType !== null && selectedCertificationType !== null && selectedBusinessModel !== null;
    if (tab === 'status') return existingApplicationId !== null;
    return false;
  };

  const handleTabChange = (value: string) => {
    if (canAccessTab(value)) {
      setCurrentStep(value);
    }
  };

  // 根据用户信息类型和认证方式选择对应的表单组件
  const getFormComponent = () => {
    if (!selectedUserType || !selectedCertificationType || !selectedBusinessModel) return null;

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
      userType: selectedUserType, // 传递用户信息类型给表单
      certificationType: selectedCertificationType, // 传递认证方式给表单
      businessModel: selectedBusinessModel, // 传递业务模式给表单
    } as any; // 使用as any以兼容新旧接口

    // 根据用户信息类型和认证方式选择表单
    // 旅行代理
    if (selectedUserType === 'travel_agent') {
      if (selectedCertificationType === 'individual') {
        return <IndividualForm {...formProps} />;
      } else {
        return <EnterpriseForm {...formProps} />;
      }
    }
    
    // 网络博主
    if (selectedUserType === 'influencer') {
      if (selectedCertificationType === 'individual') {
        return <InfluencerForm {...formProps} />;
      } else {
        return <EnterpriseForm {...formProps} />;
      }
    }
    
    // 旅游类相关应用
    if (selectedUserType === 'travel_app') {
      if (selectedCertificationType === 'individual') {
        return <IndividualForm {...formProps} />;
      } else {
        return <EnterpriseForm {...formProps} />;
      }
    }

    return null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'userType':
        return (
          <IdentityTypeSelection
            onSelect={handleUserTypeSelect}
            selectedType={selectedUserType}
          />
        );

      case 'certification':
        return (
          <CertificationTypeSelection
            onSelect={handleCertificationTypeSelect}
            selectedType={selectedCertificationType}
          />
        );

      case 'business':
        return (
          <BusinessModelSelection
            onSelect={handleBusinessModelSelect}
            selectedModel={selectedBusinessModel}
            userType={selectedUserType}
            certificationType={selectedCertificationType}
          />
        );

      case 'form':
        if (!selectedUserType || !selectedCertificationType || !selectedBusinessModel) {
          return (
            <div className="text-center py-12">
              <p className="text-gray-500">请先完成用户信息类型、认证方式和业务模式选择</p>
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

        const getUserTypeName = (type: string) => {
          const names = {
            travel_agent: '旅行代理',
            influencer: '网络博主',
            travel_app: '旅游类相关应用',
          };
          return names[type as keyof typeof names] || type;
        };

        const getCertificationTypeName = (type: string) => {
          const names = {
            individual: '个人认证',
            enterprise: '企业认证',
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
                    <p className="text-sm text-gray-500 mb-1">用户信息类型</p>
                    <p className="text-sm font-medium text-gray-900">{selectedUserType ? getUserTypeName(selectedUserType) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">认证方式</p>
                    <p className="text-sm font-medium text-gray-900">{selectedCertificationType ? getCertificationTypeName(selectedCertificationType) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">业务模式</p>
                    <p className="text-sm font-medium text-gray-900">{selectedBusinessModel ? getBusinessModelName(selectedBusinessModel) : '-'}</p>
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
        <TabsList className="flex w-full mb-8 h-auto min-h-[48px] bg-gray-100 rounded-lg p-1 gap-1">
          <TabsTrigger 
            value="userType"
            disabled={!canAccessTab('userType') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs sm:text-sm px-2 py-2 whitespace-nowrap flex-1"
          >
            用户信息类型
          </TabsTrigger>
          <TabsTrigger 
            value="certification"
            disabled={!canAccessTab('certification') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs sm:text-sm px-2 py-2 whitespace-nowrap flex-1"
          >
            认证方式
          </TabsTrigger>
          <TabsTrigger 
            value="business"
            disabled={!canAccessTab('business') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs sm:text-sm px-2 py-2 whitespace-nowrap flex-1"
          >
            业务模式
          </TabsTrigger>
          <TabsTrigger 
            value="form"
            disabled={!canAccessTab('form')}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs sm:text-sm px-2 py-2 whitespace-nowrap flex-1"
          >
            填写信息
          </TabsTrigger>
          <TabsTrigger 
            value="status"
            disabled={!canAccessTab('status') || (isEditMode && !isReapplying)}
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-xs sm:text-sm px-2 py-2 whitespace-nowrap flex-1"
          >
            申请状态
          </TabsTrigger>
        </TabsList>

        <TabsContent value="userType" className="min-h-[400px]">
          {renderStepContent()}
        </TabsContent>

        <TabsContent value="certification" className="min-h-[400px]">
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
