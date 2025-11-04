import { useState, useEffect } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { AdminReviewList, type ApplicationData } from './components/AdminReviewList';
import { AdminReviewDetail } from './components/AdminReviewDetail';
import { AdminLayout, type AdminMenuItem, type FinanceSubMenu, type PartnerAccountSubMenu } from './components/AdminLayout';
import { UserManagement } from './components/UserManagement';
import { OrderManagement, type Order } from './components/OrderManagement';
import { OrderDetail } from './components/OrderDetail';
import { SettlementCenter } from './components/SettlementCenter';
import { ApiKeyManagement } from './components/ApiKeyManagement';
import { PriceConfiguration } from './components/PriceConfiguration';
import { UserLayout } from './components/UserLayout';
import { ServiceSidebar } from './components/ServiceSidebar';
import { RegistrationSteps } from './components/RegistrationSteps';
import { UserCenter } from './components/UserCenter';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import type { User, ServiceType, ServiceStatus } from './types/user';
import { getDefaultMenuId } from './config/menuConfig';

// MCP 组件
import { MCPConfiguration } from './components/mcp/MCPConfiguration';
import { MCPMonitoring } from './components/mcp/MCPMonitoring';
import { MCPDocumentation } from './components/mcp/MCPDocumentation';

// SaaS 组件
import { SaaSDashboard } from './components/saas/SaaSDashboard';
import { SaaSBrandConfig } from './components/saas/SaaSBrandConfig';
import { SaaSPricing } from './components/saas/SaaSPricing';
import { SaaSOrders } from './components/saas/SaaSOrders';
import { SaaSWallet } from './components/saas/SaaSWallet';

// 推广联盟组件
import { AffiliateDashboard } from './components/affiliate/AffiliateDashboard';
import { AffiliateLink } from './components/affiliate/AffiliateLink';
import { AffiliateData } from './components/affiliate/AffiliateData';
import { AffiliatePoints } from './components/affiliate/AffiliatePoints';

type BusinessModel = 'mcp' | 'saas' | 'affiliate' | null;
type IdentityType = 'individual' | 'influencer' | 'enterprise' | null;
type AuthView = 'login' | 'register' | null;

type UserView = 'registration' | 'userCenter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('registration');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>(null);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [selectedAdminApplication, setSelectedAdminApplication] = useState<ApplicationData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hasCheckedExistingApplication, setHasCheckedExistingApplication] = useState(false);
  const [adminCurrentMenu, setAdminCurrentMenu] = useState<AdminMenuItem>('review');
  const [adminCurrentFinanceSubMenu, setAdminCurrentFinanceSubMenu] = useState<FinanceSubMenu | undefined>(undefined);
  const [adminCurrentPartnerAccountSubMenu, setAdminCurrentPartnerAccountSubMenu] = useState<PartnerAccountSubMenu | undefined>(undefined);

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
          
          // 同步用户的服务类型和状态
          const updatedUser: User = {
            ...currentUser,
            serviceType: existingApp.businessModel as ServiceType,
            serviceStatus: existingApp.status as ServiceStatus,
            applicationId: existingApp.id,
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // 如果已审核通过，设置默认视图
          if (existingApp.status === 'approved') {
            const defaultView = getDefaultMenuId(
              existingApp.businessModel as ServiceType,
              'approved'
            );
            setCurrentView(defaultView);
          }
        }
      }
      setHasCheckedExistingApplication(true);
    }
  }, [isLoggedIn, currentUser, hasCheckedExistingApplication]);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  // 当申请变为已通过时，自动同步用户服务状态并导航到默认页面
  useEffect(() => {
    if (!currentUser) return;
    const app = getCurrentApplication();
    if (app && app.status === 'approved') {
      // 同步用户状态
      if (
        currentUser.serviceStatus !== 'approved' ||
        currentUser.serviceType !== (app.businessModel as ServiceType) ||
        currentUser.applicationId !== app.id
      ) {
        const updatedUser: User = {
          ...currentUser,
          serviceType: app.businessModel as ServiceType,
          serviceStatus: 'approved',
          applicationId: app.id,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // 如果当前仍在注册页，则跳转到默认服务页
      if (currentView === 'registration') {
        const defaultView = getDefaultMenuId(app.businessModel as ServiceType, 'approved');
        setCurrentView(defaultView);
      }
    }
  }, [applications, currentApplicationId]);



  const handleFormSubmit = (formData: any) => {
    const currentApp = getCurrentApplication();
    
    // 如果是重新申请（已有被驳回的申请），更新现有记录
    if (currentApp && currentApp.status === 'rejected') {
      const updatedApplications = applications.map(app => 
        app.id === currentApplicationId
          ? {
              ...app,
              applicantName: formData.realName || formData.companyName || formData.contactName,
              status: 'pending' as const,
              submittedAt: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              reviewedAt: undefined,
              rejectionReason: undefined,
              data: formData,
            }
          : app
      );
      setApplications(updatedApplications);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
    } else {
      // 首次申请，创建新记录
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
        userEmail: currentUser?.email,
      };

      const updatedApplications = [...applications, newApplication];
      setApplications(updatedApplications);
      setCurrentApplicationId(newApplication.id);
      localStorage.setItem('applications', JSON.stringify(updatedApplications));
    }
  };

  const handleReapply = () => {
    // 重新申请时，不删除旧记录，保留驳回原因供用户查看
    // 只是允许用户重新编辑表单，提交时会更新现有记录
  };

  const handleAdminApprove = (id: string) => {
    const updatedApplications = applications.map((app) =>
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
    );
    setApplications(updatedApplications);
    
    // 如果是当前用户的申请，更新用户状态
    const approvedApp = updatedApplications.find(app => app.id === id);
    if (approvedApp && currentUser && approvedApp.userEmail === currentUser.email) {
      const updatedUser: User = {
        ...currentUser,
        serviceType: approvedApp.businessModel as ServiceType,
        serviceStatus: 'approved',
        applicationId: approvedApp.id,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
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



  // 已移除 getDashboardComponent，改用 renderUserContent

  const handleLoginSuccess = (userData: { phone?: string; email?: string; role?: 'admin' | 'user'; name?: string; registeredAt?: string }) => {
    const enrichedUserData: User = {
      email: userData.email || '',
      name: userData.name || userData.email?.split('@')[0] || '用户',
      role: userData.role || 'user',
      phone: userData.phone,
      registeredAt: userData.registeredAt,
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
    const enrichedUserData: User = {
      email: userData.email || '',
      name: userData.name || userData.email?.split('@')[0] || '用户',
      role: userData.role || 'user',
      phone: userData.phone,
      registeredAt: userData.registeredAt,
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
      // 详情页面的显示逻辑：只有在对应菜单下才显示详情页面
      // 如果正在查看订单详情，且当前菜单是订单管理
      if (selectedOrder && adminCurrentMenu === 'orders') {
        return (
          <OrderDetail
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
          />
        );
      }

      // 如果正在查看申请详情，且当前菜单是资格审核
      if (selectedAdminApplication && adminCurrentMenu === 'review') {
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
          return <OrderManagement onViewOrderDetail={setSelectedOrder} />;
        case 'finance':
          // 根据财务中心二级菜单显示不同内容
          switch (adminCurrentFinanceSubMenu) {
            case 'platform-account':
              return <div className="p-6"><div className="text-lg font-semibold">平台账户</div><div className="text-gray-500 mt-2">平台账户管理功能开发中...</div></div>;
            case 'partner-account':
              // 小B账户下的三级菜单
              if (adminCurrentPartnerAccountSubMenu === 'partner-balance') {
                return <SettlementCenter />;
              }
              // 如果三级菜单未选中，显示小B账户的占位内容
              return <div className="p-6"><div className="text-lg font-semibold">小B账户</div><div className="text-gray-500 mt-2">请选择具体的菜单项</div></div>;
            case 'business-documents':
              return <div className="p-6"><div className="text-lg font-semibold">业务单据管理</div><div className="text-gray-500 mt-2">业务单据管理功能开发中...</div></div>;
            case 'settlement':
              return <div className="p-6"><div className="text-lg font-semibold">结算管理</div><div className="text-gray-500 mt-2">结算管理功能开发中...</div></div>;
            case 'reconciliation':
              return <div className="p-6"><div className="text-lg font-semibold">对账</div><div className="text-gray-500 mt-2">对账功能开发中...</div></div>;
            case 'withdrawal':
              return <div className="p-6"><div className="text-lg font-semibold">提现管理</div><div className="text-gray-500 mt-2">提现管理功能开发中...</div></div>;
            case 'invoice':
              return <div className="p-6"><div className="text-lg font-semibold">发票管理</div><div className="text-gray-500 mt-2">发票管理功能开发中...</div></div>;
            default:
              return <SettlementCenter />;
          }
        case 'apikeys':
          return <ApiKeyManagement />;
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

    // 统一的菜单切换处理函数
    const handleMenuChange = (menu: AdminMenuItem) => {
      // 切换菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setAdminCurrentMenu(menu);
    };

    // 统一的二级菜单切换处理函数
    const handleFinanceSubMenuChange = (subMenu: FinanceSubMenu | undefined) => {
      // 切换二级菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setAdminCurrentFinanceSubMenu(subMenu);
    };

    // 统一的三级菜单切换处理函数
    const handlePartnerAccountSubMenuChange = (subMenu: PartnerAccountSubMenu | undefined) => {
      // 切换三级菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setAdminCurrentPartnerAccountSubMenu(subMenu);
    };

    return (
      <>
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          currentMenu={adminCurrentMenu}
          onMenuChange={handleMenuChange}
          currentFinanceSubMenu={adminCurrentFinanceSubMenu}
          onFinanceSubMenuChange={handleFinanceSubMenuChange}
          currentPartnerAccountSubMenu={adminCurrentPartnerAccountSubMenu}
          onPartnerAccountSubMenuChange={handlePartnerAccountSubMenuChange}
          pendingReviewCount={pendingCount}
        >
          {renderAdminContent()}
        </AdminLayout>
        <Toaster />
      </>
    );
  }

  const currentApp = getCurrentApplication();

  // Handle navigation
  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  // 用户视图 - 根据当前视图和服务类型渲染内容
  const renderUserContent = () => {
    if (!currentUser) return null;

    // 个人中心
    if (currentView === 'userCenter') {
      return (
        <UserCenter
          currentUser={currentUser}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
        />
      );
    }

    // 注册服务
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
          onGoToDashboard={() => {
            // 使用当前申请数据进行判断，避免依赖尚未同步的 currentUser
            const app = getCurrentApplication();
            if (app && app.status === 'approved') {
              const defaultView = getDefaultMenuId(app.businessModel as ServiceType, 'approved');
              setCurrentView(defaultView);
              if (currentUser) {
                const updatedUser: User = {
                  ...currentUser,
                  serviceType: app.businessModel as ServiceType,
                  serviceStatus: 'approved',
                  applicationId: app.id,
                };
                setCurrentUser(updatedUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
              }
            }
          }}
          onReapply={handleReapply}
        />
      );
    }

    // MCP 服务页面
    if (currentUser.serviceType === 'mcp' && currentUser.serviceStatus === 'approved') {
      if (currentView === 'mcp-config') return <MCPConfiguration />;
      if (currentView === 'mcp-monitoring') return <MCPMonitoring />;
      if (currentView === 'mcp-docs') return <MCPDocumentation />;
    }

    // SaaS 服务页面
    if (currentUser.serviceType === 'saas' && currentUser.serviceStatus === 'approved') {
      if (currentView === 'saas-dashboard') return <SaaSDashboard />;
      if (currentView === 'saas-brand') return <SaaSBrandConfig />;
      if (currentView === 'saas-pricing') return <SaaSPricing />;
      if (currentView === 'saas-orders') return <SaaSOrders />;
      if (currentView === 'saas-wallet') return <SaaSWallet />;
    }

    // 推广联盟服务页面
    if (currentUser.serviceType === 'affiliate' && currentUser.serviceStatus === 'approved') {
      if (currentView === 'affiliate-dashboard') return <AffiliateDashboard />;
      if (currentView === 'affiliate-link') return <AffiliateLink />;
      if (currentView === 'affiliate-data') return <AffiliateData />;
      if (currentView === 'affiliate-points') return <AffiliatePoints />;
    }

    // 默认显示注册服务
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
        onGoToDashboard={() => {
          const app = getCurrentApplication();
          if (app && app.status === 'approved') {
            const defaultView = getDefaultMenuId(app.businessModel as ServiceType, 'approved');
            setCurrentView(defaultView);
            if (currentUser) {
              const updatedUser: User = {
                ...currentUser,
                serviceType: app.businessModel as ServiceType,
                serviceStatus: 'approved',
                applicationId: app.id,
              };
              setCurrentUser(updatedUser);
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
          }
        }}
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
          serviceType={currentUser?.serviceType || null}
          serviceStatus={currentUser?.serviceStatus || 'none'}
          onNavigate={handleNavigate}
        />
      }
    >
      {renderUserContent()}
      <Toaster />
    </UserLayout>
  );
}
