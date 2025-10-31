import { useState } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { BusinessModelSelection } from './components/BusinessModelSelection';
import { IndividualForm } from './components/IndividualForm';
import { InfluencerForm } from './components/InfluencerForm';
import { EnterpriseForm } from './components/EnterpriseForm';
import { ReviewStatusPage } from './components/ReviewStatusPage';
import { AdminReviewList, type ApplicationData } from './components/AdminReviewList';
import { AdminReviewDetail } from './components/AdminReviewDetail';
import { DeveloperCenter } from './components/DeveloperCenter';
import { SmallBAdmin } from './components/SmallBAdmin';
import { AffiliateBackend } from './components/AffiliateBackend';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { User, Users, Building2, ArrowLeft, Settings, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

type BusinessModel = 'mcp' | 'saas' | 'affiliate' | null;
type IdentityType = 'individual' | 'influencer' | 'enterprise' | null;
type ViewMode = 'user' | 'admin';
type AuthView = 'login' | 'register' | null;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<{ phone?: string; email?: string } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>(null);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [selectedAdminApplication, setSelectedAdminApplication] = useState<ApplicationData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Mock applications database
  const [applications, setApplications] = useState<ApplicationData[]>([
    {
      id: 'APP-001',
      applicantName: '张三',
      businessModel: 'mcp',
      identityType: 'individual',
      status: 'pending',
      submittedAt: '2025-10-28 14:30:00',
      data: {
        realName: '张三',
        idNumber: '110101199001011234',
        idValidityStart: '2020-01-01',
        idValidityEnd: '2030-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        accountType: 'bank',
        bankCardholderName: '张三',
        bankName: '中国工商银行',
        bankBranch: '北京市朝阳区支行',
        bankCardNumber: '6222021234567890123',
      },
    },
    {
      id: 'APP-002',
      applicantName: '李四',
      businessModel: 'saas',
      identityType: 'influencer',
      status: 'approved',
      submittedAt: '2025-10-27 10:15:00',
      reviewedAt: '2025-10-28 09:20:00',
      data: {
        realName: '李四',
        idNumber: '110101199002021234',
        mainPlatform: '小红书',
        mainProfileLink: 'https://xiaohongshu.com/user/123',
        mainFollowersCount: '50000',
        phone: '13900139000',
        accountType: 'alipay',
        alipayAccount: '13900139000',
        alipayRealName: '李四',
      },
    },
    {
      id: 'APP-003',
      applicantName: '王五',
      businessModel: 'affiliate',
      identityType: 'enterprise',
      status: 'rejected',
      submittedAt: '2025-10-26 16:45:00',
      reviewedAt: '2025-10-27 14:30:00',
      rejectionReason: '1. 营业执照照片不清晰，无法辨认企业名称和信用代码\n2. 法人身份证号格式错误\n3. 银行账号信息与企业名称不符',
      data: {
        companyName: '某某科技有限公司',
        creditCode: '91110000MA01ABCD1E',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '王五',
        legalRepIdNumber: '110101199003031234',
        contactName: '王五',
        contactPhone: '13700137000',
        contactEmail: 'wangwu@example.com',
        accountHolderName: '某某科技有限公司',
        bankName: '中国建设银行',
        bankBranch: '北京市海淀区支行',
        accountNumber: '11001234567890123456',
      },
    },
  ]);

  const identityTypes = [
    {
      id: 'individual' as const,
      title: '个人',
      description: '个人用户认证',
      icon: User,
    },
    {
      id: 'influencer' as const,
      title: '博主',
      description: '内容创作者、KOL认证',
      icon: Users,
    },
    {
      id: 'enterprise' as const,
      title: '企业',
      description: '企业/机构主体认证',
      icon: Building2,
    },
  ];

  const handleBusinessModelSelect = (model: BusinessModel) => {
    setSelectedBusinessModel(model);
  };

  const handleIdentitySelect = (identity: IdentityType) => {
    setSelectedIdentity(identity);
  };

  const handleBackToBusinessModel = () => {
    setSelectedBusinessModel(null);
    setSelectedIdentity(null);
    setCurrentApplicationId(null);
  };

  const handleBackToIdentityType = () => {
    setSelectedIdentity(null);
  };

  const handleFormSubmit = (formData: any) => {
    // Create new application
    const newApplication: ApplicationData = {
      id: `APP-${String(applications.length + 1).padStart(3, '0')}`,
      applicantName: formData.realName || formData.companyName || formData.contactName,
      businessModel: selectedBusinessModel!,
      identityType: selectedIdentity!,
      status: 'pending',
      submittedAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      data: formData,
    };

    setApplications([...applications, newApplication]);
    setCurrentApplicationId(newApplication.id);
  };

  const handleAdminApprove = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'approved' as const,
              reviewedAt: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            }
          : app
      )
    );
    setSelectedAdminApplication(null);
  };

  const handleAdminReject = (id: string, reason: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'rejected' as const,
              rejectionReason: reason,
              reviewedAt: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            }
          : app
      )
    );
    setSelectedAdminApplication(null);
  };

  const getCurrentApplication = () => {
    return applications.find((app) => app.id === currentApplicationId);
  };

  const handleGoToDashboard = () => {
    setShowDashboard(true);
  };

  const getDashboardComponent = (businessModel: string) => {
    if (businessModel === 'mcp') return <DeveloperCenter />;
    if (businessModel === 'saas') return <SmallBAdmin />;
    if (businessModel === 'affiliate') return <AffiliateBackend />;
    return null;
  };

  const handleLoginSuccess = (userData: { phone?: string; email?: string }) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleRegisterSuccess = (userData: { phone?: string; email?: string }) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedBusinessModel(null);
    setSelectedIdentity(null);
    setCurrentApplicationId(null);
    setShowDashboard(false);
    setViewMode('user');
    localStorage.removeItem('currentUser');
  };

  // Show login/register if not logged in
  if (!isLoggedIn) {
    if (authView === 'register') {
      return (
        <>
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthView('login')}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('register')}
        />
        <Toaster />
      </>
    );
  }

  // Admin view
  if (viewMode === 'admin') {
    if (selectedAdminApplication) {
      return (
        <>
          <AdminReviewDetail
            application={selectedAdminApplication}
            onBack={() => setSelectedAdminApplication(null)}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
          />
          <Toaster />
        </>
      );
    }

    return (
      <div>
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h2>管理员后台</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setViewMode('user')}>
                切换到用户视图
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
        <AdminReviewList
          applications={applications}
          onViewDetail={setSelectedAdminApplication}
        />
        <Toaster />
      </div>
    );
  }

  // User view - Show dashboard if approved and user clicks to go there
  if (currentApplicationId && showDashboard) {
    const currentApp = getCurrentApplication();
    if (currentApp && currentApp.status === 'approved') {
      return (
        <>
          {getDashboardComponent(currentApp.businessModel)}
          <Toaster />
        </>
      );
    }
  }

  // User view - Show review status page if application exists
  if (currentApplicationId) {
    const currentApp = getCurrentApplication();
    if (currentApp) {
      return (
        <>
          <div className="absolute top-4 right-4 z-10">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
          <ReviewStatusPage
            status={currentApp.status}
            businessModel={currentApp.businessModel}
            identityType={currentApp.identityType}
            submittedAt={currentApp.submittedAt}
            rejectionInfo={
              currentApp.status === 'rejected' && currentApp.rejectionReason
                ? {
                    reason: currentApp.rejectionReason,
                    fields: [],
                  }
                : undefined
            }
            onBack={handleBackToBusinessModel}
            onEdit={() => {
              setCurrentApplicationId(null);
              // Keep the business model and identity type selected
            }}
            onGoToDashboard={currentApp.status === 'approved' ? handleGoToDashboard : undefined}
          />
          <Toaster />
        </>
      );
    }
  }

  // Step 3: Show form based on selected identity
  if (selectedIdentity) {
    const formProps = {
      onBack: handleBackToIdentityType,
      onSubmit: handleFormSubmit,
    };

    let FormComponent;
    switch (selectedIdentity) {
      case 'individual':
        FormComponent = <IndividualForm {...formProps} />;
        break;
      case 'influencer':
        FormComponent = <InfluencerForm {...formProps} />;
        break;
      case 'enterprise':
        FormComponent = <EnterpriseForm {...formProps} />;
        break;
      default:
        FormComponent = null;
    }

    return (
      <>
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </Button>
        </div>
        {FormComponent}
        <Toaster />
      </>
    );
  }

  // Step 2: Show identity type selection after business model is selected
  if (selectedBusinessModel) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={handleBackToBusinessModel}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回业务模式选择
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode('admin')}>
                <Settings className="w-4 h-4 mr-2" />
                管理员入口
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="mb-4">资质信息提交</h1>
            <p className="text-gray-600">请选择您的身份类型，系统将为您加载对应的认证表单</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {identityTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => handleIdentitySelect(type.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <type.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-2">{type.title}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Step 1: Show business model selection first
  return (
    <div>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setViewMode('admin')}>
          <Settings className="w-4 h-4 mr-2" />
          管理员入口
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </div>
      <div>
        <BusinessModelSelection onSelect={handleBusinessModelSelect} />
        <Toaster />
      </div>
    </div>
  );
}
