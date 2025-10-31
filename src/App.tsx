import { useState, useEffect } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { AdminReviewList, type ApplicationData } from './components/AdminReviewList';
import { AdminReviewDetail } from './components/AdminReviewDetail';
import { AdminLayout } from './components/AdminLayout';
import { UserManagement } from './components/UserManagement';
import { OrderManagement } from './components/OrderManagement';
import { SettlementCenter } from './components/SettlementCenter';
import { PriceConfiguration } from './components/PriceConfiguration';
import { DeveloperCenter } from './components/DeveloperCenter';
import { SmallBAdmin } from './components/SmallBAdmin';
import { AffiliateBackend } from './components/AffiliateBackend';
import { UserLayout } from './components/UserLayout';
import { ServiceSidebar } from './components/ServiceSidebar';
import { RegistrationSteps } from './components/RegistrationSteps';
import { UserCenter } from './components/UserCenter';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type BusinessModel = 'mcp' | 'saas' | 'affiliate' | null;
type IdentityType = 'individual' | 'influencer' | 'enterprise' | null;
type AuthView = 'login' | 'register' | null;

type UserView = 'registration' | 'userCenter';
type AdminMenuItem = 'review' | 'users' | 'finance' | 'pricing';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<{ 
    name?: string;
    phone?: string; 
    email?: string; 
    role?: 'admin' | 'user';
    company?: string;
    registeredAt?: string;
  } | null>(null);
  const [currentView, setCurrentView] = useState<UserView>('registration');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>(null);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [selectedAdminApplication, setSelectedAdminApplication] = useState<ApplicationData | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [hasCheckedExistingApplication, setHasCheckedExistingApplication] = useState(false);
  const [adminCurrentMenu, setAdminCurrentMenu] = useState<AdminMenuItem>('review');

  // Restore user session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load applications from localStorage
  const [applications, setApplications] = useState<ApplicationData[]>(() => {
    const stored = localStorage.getItem('applications');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
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
  ];
  });

  // Check for existing application on mount/login (skip for admin)
  useEffect(() => {
    if (isLoggedIn && currentUser && !hasCheckedExistingApplication) {
      // 管理员直接跳过检查
      if (currentUser.role === 'admin') {
        setHasCheckedExistingApplication(true);
        return;
      }
      
      const userEmail = currentUser.email;
      if (userEmail) {
        const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
        const existingApp = storedApplications.find((app: any) => 
          app.data?.email === userEmail || app.userEmail === userEmail
        );
        if (existingApp) {
          setCurrentApplicationId(existingApp.id);
          setSelectedBusinessModel(existingApp.businessModel as BusinessModel);
          setSelectedIdentity(existingApp.identityType as IdentityType);
          setApplications(storedApplications);
        }
      }
      setHasCheckedExistingApplication(true);
    }
  }, [isLoggedIn, currentUser, hasCheckedExistingApplication]);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);



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
      userEmail: currentUser?.email, // 关联用户邮箱
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    setCurrentApplicationId(newApplication.id);
    
    // 保存到localStorage
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const handleReapply = () => {
    // 重新申请时，删除旧的申请记录
    if (currentApplicationId) {
      const updatedApplications = applications.filter(app => app.id !== currentApplicationId);
      setApplications(updatedApplications);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
    }
    // 清除当前申请ID，允许用户重新申请
    setCurrentApplicationId(null);
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



  const getDashboardComponent = (businessModel: string) => {
    if (businessModel === 'mcp') return <DeveloperCenter />;
    if (businessModel === 'saas') return <SmallBAdmin />;
    if (businessModel === 'affiliate') return <AffiliateBackend />;
    return null;
  };

  const handleLoginSuccess = (userData: { phone?: string; email?: string; role?: 'admin' | 'user'; name?: string; registeredAt?: string }) => {
    const enrichedUserData = {
      ...userData,
      name: userData.name || userData.email?.split('@')[0],
    };
    setCurrentUser(enrichedUserData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(enrichedUserData));
    
    // 如果是管理员，直接跳过检查已有申请的逻辑
    if (userData.role === 'admin') {
      setHasCheckedExistingApplication(true);
      return;
    }
    
    // Check if user has existing application (reload from localStorage to get latest)
    const userEmail = userData.email;
    if (userEmail) {
      const storedApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const existingApp = storedApplications.find((app: any) => 
        app.data?.email === userEmail || app.userEmail === userEmail
      );
      if (existingApp) {
        setCurrentApplicationId(existingApp.id);
        setSelectedBusinessModel(existingApp.businessModel as BusinessModel);
        setSelectedIdentity(existingApp.identityType as IdentityType);
        setApplications(storedApplications);
        // Set view based on application status
        if (existingApp.status === 'approved') {
          setCurrentView('registration');
        } else {
          setCurrentView('registration');
        }
      } else {
        setCurrentView('registration');
      }
    } else {
      setCurrentView('registration');
    }
    setHasCheckedExistingApplication(true);
  };

  const handleRegisterSuccess = (userData: { phone?: string; email?: string; role?: 'admin' | 'user'; name?: string; registeredAt?: string }) => {
    const enrichedUserData = {
      ...userData,
      name: userData.name || userData.email?.split('@')[0],
    };
    setCurrentUser(enrichedUserData);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(enrichedUserData));
    setHasCheckedExistingApplication(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('registration');
    setSelectedBusinessModel(null);
    setSelectedIdentity(null);
    setCurrentApplicationId(null);
    setShowDashboard(false);
    setHasCheckedExistingApplication(false);
    localStorage.removeItem('currentUser');
  };

  const handleUpdateProfile = (data: { name: string; phone?: string; company?: string }) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: data.name,
        phone: data.phone,
        company: data.company,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    // 在真实应用中，这里应该调用API验证旧密码并更新新密码
    // 这里仅作为演示，简单地显示成功消息
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = storedUsers.findIndex((u: any) => u.email === currentUser?.email);
    
    if (userIndex !== -1) {
      // 验证旧密码（简化版本）
      if (storedUsers[userIndex].password === oldPassword) {
        storedUsers[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        toast.success('密码修改成功');
      } else {
        toast.error('当前密码错误');
        throw new Error('当前密码错误');
      }
    }
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

  // Admin view - 根据用户角色显示
  if (isLoggedIn && currentUser?.role === 'admin') {
    const renderAdminContent = () => {
      // 如果正在查看申请详情
      if (selectedAdminApplication) {
        return (
          <AdminReviewDetail
            application={selectedAdminApplication}
            onBack={() => setSelectedAdminApplication(null)}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
          />
        );
      }

      // 根据当前菜单显示内容
      switch (adminCurrentMenu) {
        case 'review':
          return (
            <AdminReviewList
              applications={applications}
              onViewDetail={setSelectedAdminApplication}
            />
          );
        case 'users':
          return <UserManagement />;
        case 'orders':
          return <OrderManagement />;
        case 'finance':
          return <SettlementCenter />;
        case 'pricing':
          return <PriceConfiguration />;
        default:
          return (
            <AdminReviewList
              applications={applications}
              onViewDetail={setSelectedAdminApplication}
            />
          );
      }
    };

    // 计算待审核数量
    const pendingCount = applications.filter(app => app.status === 'pending').length;

    return (
      <>
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          currentMenu={adminCurrentMenu}
          onMenuChange={setAdminCurrentMenu}
          pendingReviewCount={pendingCount}
        >
          {renderAdminContent()}
        </AdminLayout>
        <Toaster />
      </>
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

  const currentApp = getCurrentApplication();

  // Handle navigation
  const handleNavigate = (view: string) => {
    if (view === 'registration') {
      setCurrentView('registration');
      // Don't reset these if user has an application
      if (!currentApplicationId) {
        setSelectedBusinessModel(null);
        setSelectedIdentity(null);
      }
    } else if (view === 'userCenter') {
      setCurrentView('userCenter');
    }
  };

  // User view - Main layout with sidebar
  const renderMainContent = (currentApp: ApplicationData | undefined) => {
    // User Center view
    if (currentView === 'userCenter') {
      return (
        <UserCenter
          currentUser={{
            email: currentUser?.email || '',
            name: currentUser?.name || currentUser?.email?.split('@')[0] || '用户',
            role: currentUser?.role || 'user',
            phone: currentUser?.phone,
            company: currentUser?.company,
            registeredAt: currentUser?.registeredAt,
          }}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
        />
      );
    }

    // Registration view (default and main view)
    if (currentView === 'registration') {
      return (
        <RegistrationSteps
          onSubmit={handleFormSubmit}
          initialBusinessModel={selectedBusinessModel}
          initialIdentityType={selectedIdentity}
          onBusinessModelChange={setSelectedBusinessModel}
          onIdentityTypeChange={setSelectedIdentity}
          existingApplicationId={currentApplicationId}
          applicationData={currentApp ? {
            id: currentApp.id,
            status: currentApp.status,
            submittedAt: currentApp.submittedAt,
            reviewedAt: currentApp.reviewedAt,
            rejectionReason: currentApp.rejectionReason,
            data: currentApp.data,
          } : null}
          onGoToDashboard={() => setShowDashboard(true)}
          onReapply={handleReapply}
        />
      );
    }

    // Default fallback
    return (
      <RegistrationSteps
        onSubmit={handleFormSubmit}
        initialBusinessModel={selectedBusinessModel}
        initialIdentityType={selectedIdentity}
        onBusinessModelChange={setSelectedBusinessModel}
        onIdentityTypeChange={setSelectedIdentity}
        existingApplicationId={currentApplicationId}
        applicationData={currentApp ? {
          id: currentApp.id,
          status: currentApp.status,
          submittedAt: currentApp.submittedAt,
          reviewedAt: currentApp.reviewedAt,
          rejectionReason: currentApp.rejectionReason,
          data: currentApp.data,
        } : null}
        onGoToDashboard={() => setShowDashboard(true)}
        onReapply={handleReapply}
      />
    );
  };

  // Render user view with layout
  return (
    <UserLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      applicationStatus={currentApp?.status as any}
      onNavigateToUserCenter={() => setCurrentView('userCenter')}
      sidebarContent={
        <ServiceSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      }
    >
      {renderMainContent(currentApp)}
      <Toaster />
    </UserLayout>
  );
}
