import React, { useState, useEffect } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { AdminReviewList } from './components/AdminReviewList';
import type { ApplicationData } from './data/mockApplications';
import { getMockApplications } from './data/mockApplications';
import { AdminReviewDetail } from './components/AdminReviewDetail';
import {
  AdminLayout,
  type AdminMenuItem,
  type UserSubMenu,
  type FinanceSubMenu,
  type ReconciliationSubMenu,
  type SettlementSubMenu,
  type BusinessDocumentsSubMenu,
  type MarketingSubMenu,
} from './components/AdminLayout';
import { UserManagement } from './components/UserManagement';
import { UserDetail } from './components/UserDetail';
import { PromotionLinkManagement, type PromotionLink } from './components/PromotionLinkManagement';
import { PromotionLinkDetail } from './components/PromotionLinkDetail';
import { OrderManagement, type Order } from './components/OrderManagement';
import { OrderDetail } from './components/OrderDetail';
import { SettlementCenter } from './components/SettlementCenter';
import { PlatformAccount } from './components/PlatformAccount';
import { MerchantAccounts } from './components/finance/merchant-accounts';
import { InvoiceManagement, type Invoice } from './components/InvoiceManagement';
import { InvoiceDetail } from './components/InvoiceDetail';
import { WithdrawalManager } from './components/WithdrawalManager';
import { WithdrawalManagement, type Withdrawal as WithdrawalRecord } from './components/WithdrawalManagement';
import { WithdrawalDetail } from './components/WithdrawalDetail';
import { ReconciliationManagement, type Reconciliation } from './components/ReconciliationManagement';
import { ReconciliationDetail } from './components/ReconciliationDetail';
import { ReconciliationSummary } from './components/ReconciliationSummary';
import { PartnerSettlementBatchList, type PartnerSettlementBatch } from './components/PartnerSettlementBatchList';
import { PartnerSettlementBatchDetail } from './components/PartnerSettlementBatchDetail';
import { SupplierSettlementBatchList, type SupplierSettlementBatch } from './components/SupplierSettlementBatchList';
import { SupplierSettlementBatchDetail } from './components/SupplierSettlementBatchDetail';
import { SettlementConfig } from './components/SettlementConfig';
import { OrderTransactionList, type OrderTransaction } from './components/OrderTransactionList';
import { OrderTransactionDetail } from './components/OrderTransactionDetail';
import { OrderRefundRecordList, type OrderRefundRecord } from './components/OrderRefundRecordList';
import { OrderRefundRecordDetail } from './components/OrderRefundRecordDetail';
import { SettlementDetailsManager } from './components/SettlementDetailsManager';
import { getMockOrders } from './data/mockOrders';
import { getMockSettlementBatches, getMockSupplierSettlementBatches, getMockPartnerSettlementBatches } from './data/mockSettlementBatches';
import { getMockApiKeys, type ApiKeyInfo } from './data/mockApiKeys';
import { getMockSettlementDetails } from './data/mockBusinessDocuments';
import { getMockOrderTransactions } from './data/mockBusinessDocuments';
import { getMockOrderRefundRecords } from './data/mockBusinessDocuments';
import { ApiKeyManagement } from './components/ApiKeyManagement';
import { ApiKeyDetail } from './components/ApiKeyDetail';
import { PriceConfiguration } from './components/PriceConfiguration';
import { UserLayout } from './components/UserLayout';
import { ServiceSidebar } from './components/ServiceSidebar';
import { RegistrationSteps } from './components/RegistrationSteps';
import { UserCenter } from './components/UserCenter';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import type { User, ServiceType, ServiceStatus } from './types/user';
import { getDefaultMenuId } from './config/menuConfig';
import { formatDateTime } from './utils/dateFormat';
import type { BusinessModel } from './components/BusinessModelSelection';
import type { UserType } from './components/IdentityTypeSelection';
import type { CertificationType } from './components/CertificationTypeSelection';
import { BusinessModelConfigManagement } from './components/BusinessModelConfigManagement';
import { FeaturePermissionManagement } from './components/FeaturePermissionManagement';
import { getUserType } from './utils/partnerUtils';
import { createPartnerFromApplication, findPartnerByEmail } from './utils/partnerHelper';
import { getMockPartners, type Partner } from './data/mockPartners';
import { BigBLayout, type BigBMenuItem } from './components/BigBLayout';
import { SmallBLayout, type SmallBMenuItem } from './components/SmallBLayout';
import { PromotionManagement } from './components/PromotionManagement';
import { MarketingAccountManagement } from './components/MarketingAccountManagement';
import { CrowdTagManagement } from './components/CrowdTagManagement';

// MCP 组件（大B客户系统）
import { MCPConfiguration } from './components/bigb/MCPConfiguration';
import { MCPMonitoring } from './components/bigb/mcp/MCPMonitoring';
import { MCPDocumentation } from './components/bigb/mcp/MCPDocumentation';

// SaaS 组件（大B客户系统）
import { SaaSBrandConfig } from './components/bigb/SaaSBrandConfig';
import { FeatureProtected } from './components/FeatureProtected';

// 推广联盟组件（小B客户系统）
import { AffiliateLink } from './components/smallb/AffiliateLink';
import { AffiliatePoints } from './components/smallb/AffiliatePoints';

// 通用组件（大B和小B共用）
import { Dashboard } from './components/shared/Dashboard';
import { Withdrawal } from './components/shared/Withdrawal';
import { BankCardManagement } from './components/shared/BankCardManagement';
import { AccountHelp } from './components/shared/AccountHelp';
import { Reports } from './components/shared/Reports';

// 大B客户系统组件
import { SmallBManagement } from './components/bigb/SmallBManagement';
import { PricingStrategy } from './components/bigb/PricingStrategy';

// 小B客户系统组件
import { CommissionDetail } from './components/smallb/CommissionDetail';
type AuthView = 'login' | 'register' | null;

type UserView = 'registration' | 'userCenter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('registration');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [selectedCertificationType, setSelectedCertificationType] = useState<CertificationType | null>(null);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [selectedAdminApplication, setSelectedAdminApplication] = useState<ApplicationData | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedPromotionLink, setSelectedPromotionLink] = useState<PromotionLink | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRecord | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<Reconciliation | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKeyInfo | null>(() => {
    const stored = localStorage.getItem('selectedApiKeyId');
    if (stored) {
      const keys = getMockApiKeys();
      return keys.find((k: ApiKeyInfo) => k.id === stored) || null;
    }
    return null;
  });
  const [selectedPartnerBatch, setSelectedPartnerBatch] = useState<PartnerSettlementBatch | null>(null);
  const [selectedSupplierBatch, setSelectedSupplierBatch] = useState<SupplierSettlementBatch | null>(null);
  const [selectedOrderTransaction, setSelectedOrderTransaction] = useState<OrderTransaction | null>(() => {
    const stored = localStorage.getItem('selectedOrderTransactionId');
    if (stored) {
      const transactions = getMockOrderTransactions();
      return transactions.find((t: OrderTransaction) => t.transactionId === stored) || null;
    }
    return null;
  });
  const [selectedOrderRefundRecord, setSelectedOrderRefundRecord] = useState<OrderRefundRecord | null>(() => {
    const stored = localStorage.getItem('selectedOrderRefundRecordId');
    if (stored) {
      const records = getMockOrderRefundRecords();
      return records.find((r: OrderRefundRecord) => r.refundId === stored) || null;
    }
    return null;
  });
  const [hasCheckedExistingApplication, setHasCheckedExistingApplication] = useState(false);
  
  // Partner数据状态（用于大B/小B系统）
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  const [bigBCurrentMenu, setBigBCurrentMenu] = useState<BigBMenuItem>('smallb-management');
  const [smallBCurrentMenu, setSmallBCurrentMenu] = useState<SmallBMenuItem>('affiliate-link');
  
  // 从 localStorage 恢复管理员页面状态
  const [adminCurrentMenu, setAdminCurrentMenu] = useState<AdminMenuItem>(() => {
    const stored = localStorage.getItem('adminCurrentMenu');
    return (stored as AdminMenuItem) || 'review';
  });
  const [adminCurrentFinanceSubMenu, setAdminCurrentFinanceSubMenu] = useState<FinanceSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentFinanceSubMenu');
    return stored ? (stored as FinanceSubMenu) : undefined;
  });
  const [adminCurrentUserSubMenu, setAdminCurrentUserSubMenu] = useState<UserSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentUserSubMenu');
    return stored ? (stored as UserSubMenu) : undefined;
  });
  const [adminCurrentReconciliationSubMenu, setAdminCurrentReconciliationSubMenu] = useState<ReconciliationSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentReconciliationSubMenu');
    return stored ? (stored as ReconciliationSubMenu) : undefined;
  });
  const [adminCurrentSettlementSubMenu, setAdminCurrentSettlementSubMenu] = useState<SettlementSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentSettlementSubMenu');
    return stored ? (stored as SettlementSubMenu) : undefined;
  });
  const [adminCurrentBusinessDocumentsSubMenu, setAdminCurrentBusinessDocumentsSubMenu] = useState<BusinessDocumentsSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentBusinessDocumentsSubMenu');
    return stored ? (stored as BusinessDocumentsSubMenu) : undefined;
  });
  const [adminCurrentMarketingSubMenu, setAdminCurrentMarketingSubMenu] = useState<MarketingSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentMarketingSubMenu');
    return stored ? (stored as MarketingSubMenu) : undefined;
  });

  // Load applications from localStorage
  const [applications, setApplications] = useState<ApplicationData[]>(() => {
    const isDevelopment = !('document' in globalThis) || globalThis.location?.hostname === 'localhost';
    // 开发环境下强制使用新的mock数据，确保能看到最新的待审核数据
    if (isDevelopment) {
      console.log('开发环境：使用最新的mock数据');
      return getMockApplications();
    }
    
    const stored = localStorage.getItem('applications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 检查数据是否包含新字段，如果不包含则使用新数据
        if (parsed.length > 0 && !parsed[0].phoneNumber) {
          console.log('检测到旧数据格式，使用新的mock数据');
          return getMockApplications();
        }
        return parsed;
      } catch (e) {
        console.error('解析localStorage数据失败，使用mock数据');
        return getMockApplications();
      }
    }
    // 使用 mock 数据
    return getMockApplications();
  });

  // 刷新数据的函数
  const handleRefreshData = () => {
    const freshData = getMockApplications();
    setApplications(freshData);
    console.log('数据已刷新，最新数据条数：', freshData.length);
    console.log('待审核数据条数：', freshData.filter(app => app.status === 'pending').length);
  };

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

  // 恢复详情页面状态（仅在管理员登录后）
  useEffect(() => {
    if (isLoggedIn && currentUser?.role === 'admin') {
      // 恢复申请详情（数据在App中，可以直接恢复）
      const storedApplicationId = localStorage.getItem('selectedApplicationId');
      if (storedApplicationId && adminCurrentMenu === 'review') {
        const app = applications.find(a => a.id === storedApplicationId);
        if (app) {
          setSelectedAdminApplication(app);
        } else {
          localStorage.removeItem('selectedApplicationId');
        }
      }
      
      // 订单和发票详情由于数据在各自组件中动态生成，刷新后不自动恢复
      // 用户需要重新点击查看详情，但菜单状态会保持
    }
  }, [isLoggedIn, currentUser, adminCurrentMenu, applications]);

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
          // setSelectedIdentity 已移除，使用新的 userType 和 certificationType
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

      // 创建或查找Partner数据
      const partners = getMockPartners();
      let partner = findPartnerByEmail(currentUser.email || '', partners);
      
      // 如果找不到Partner，从Application创建
      if (!partner && app) {
        partner = createPartnerFromApplication(app, currentUser.email || '');
      }
      
      setCurrentPartner(partner || null);

      // 如果当前仍在注册页，则跳转到默认服务页
      if (currentView === 'registration') {
        const defaultView = getDefaultMenuId(app.businessModel as ServiceType, 'approved');
        setCurrentView(defaultView);
      }
    } else {
      // 如果申请未通过，清除Partner数据
      setCurrentPartner(null);
    }
  }, [applications, currentApplicationId, currentUser]);



  const handleFormSubmit = (formData: any) => {
    // 验证必需的选择
    if (!selectedBusinessModel || !selectedUserType || !selectedCertificationType) {
      toast.error('请先完成用户信息类型、认证方式和业务模式选择');
      return;
    }

    const currentApp = getCurrentApplication();
    
    // 如果是重新申请（已有被驳回的申请），更新现有记录
    if (currentApp && currentApp.status === 'rejected') {
      const updatedApplications = applications.map(app => 
        app.id === currentApplicationId
          ? {
              ...app,
              applicantName: formData.realName || formData.companyName || formData.contactName,
              status: 'pending' as const,
              submittedAt: formatDateTime(new Date()),
              reviewedAt: undefined,
              rejectionReason: undefined,
              phoneNumber: formData.phone || formData.contactPhone || formData.contact?.phone || '',
              data: formData,
              businessModel: selectedBusinessModel,
              userType: selectedUserType,
              certificationType: selectedCertificationType,
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
        businessModel: selectedBusinessModel,
        userType: selectedUserType,
        certificationType: selectedCertificationType,
        status: 'pending',
        submittedAt: formatDateTime(new Date()),
        phoneNumber: formData.phone || formData.contactPhone || formData.contact?.phone || '',
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
    // 重新申请：清空用户信息类型、认证方式和业务模式选择，让用户从用户信息类型选择开始
    setSelectedBusinessModel(null);
    setSelectedUserType(null);
    setSelectedCertificationType(null);
    // 注意：不删除旧记录，保留驳回原因供用户查看
    // 当用户重新提交时，handleFormSubmit 会更新现有记录
  };

  const handleAdminApprove = (id: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === id
        ? {
            ...app,
            status: 'approved' as const,
            reviewedAt: formatDateTime(new Date()),
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
        setSelectedUserType(existingApp.userType as UserType || null);
        setSelectedCertificationType(existingApp.certificationType as CertificationType || null);
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
    setSelectedUserType(null);
    setSelectedCertificationType(null);
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
      // 如果正在查看API密钥详情，且当前菜单是密钥管理
      if (selectedApiKey && adminCurrentMenu === 'apikeys') {
        // 保存API密钥ID到localStorage
        localStorage.setItem('selectedApiKeyId', selectedApiKey.id);
        return (
          <ApiKeyDetail
            apiKey={selectedApiKey}
            onBack={() => {
              setSelectedApiKey(null);
              localStorage.removeItem('selectedApiKeyId');
            }}
          />
        );
      }

      // 如果正在查看申请详情，且当前菜单是资格审核
      if (selectedAdminApplication && adminCurrentMenu === 'review') {
        // 保存申请ID到localStorage
        localStorage.setItem('selectedApplicationId', selectedAdminApplication.id);
        return (
          <AdminReviewDetail
            application={selectedAdminApplication}
            onBack={() => {
              setSelectedAdminApplication(null);
              localStorage.removeItem('selectedApplicationId');
            }}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
          />
        );
      }

      // 如果正在查看推广链接详情，且当前菜单是推广链接管理
      if (
        selectedPromotionLink &&
        adminCurrentMenu === 'users' &&
        adminCurrentUserSubMenu === 'promotion-links'
      ) {
        // 保存推广链接ID到localStorage
        localStorage.setItem('selectedPromotionLinkId', selectedPromotionLink.id);
        return (
          <PromotionLinkDetail
            link={selectedPromotionLink}
            onBack={() => {
              setSelectedPromotionLink(null);
              localStorage.removeItem('selectedPromotionLinkId');
            }}
          />
        );
      }

      // 如果正在查看发票详情，且当前菜单是发票管理
      if (selectedInvoice && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'invoice') {
        // 保存发票ID到localStorage
        localStorage.setItem('selectedInvoiceId', selectedInvoice.invoiceId);
        return (
          <InvoiceDetail
            invoice={selectedInvoice}
            onBack={() => {
              setSelectedInvoice(null);
              localStorage.removeItem('selectedInvoiceId');
            }}
          />
        );
      }

      // 如果正在查看提现详情，且当前菜单是提现管理
      if (selectedWithdrawal && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'withdrawal') {
        // 保存提现ID到localStorage
        localStorage.setItem('selectedWithdrawalId', selectedWithdrawal.withdrawalId);
        return (
          <WithdrawalDetail
            withdrawal={selectedWithdrawal}
            onBack={() => {
              setSelectedWithdrawal(null);
              localStorage.removeItem('selectedWithdrawalId');
            }}
          />
        );
      }

      // 如果正在查看对账详情，且当前菜单是对账（无论是管理还是汇总）
      if (selectedReconciliation && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'reconciliation' && 
          (adminCurrentReconciliationSubMenu === 'reconciliation-management' || adminCurrentReconciliationSubMenu === 'reconciliation-summary')) {
        // 保存对账ID到localStorage
        localStorage.setItem('selectedReconciliationId', selectedReconciliation.id);
        return (
          <ReconciliationDetail
            reconciliation={selectedReconciliation}
            onBack={() => {
              setSelectedReconciliation(null);
              localStorage.removeItem('selectedReconciliationId');
            }}
            onViewOrderDetail={(orderId) => {
              // 从订单列表中查找订单并跳转
              const orders = getMockOrders();
              const order = orders.find(o => o.orderId === orderId);
              if (order) {
                setSelectedOrder(order);
                setAdminCurrentMenu('orders');
                localStorage.setItem('adminCurrentMenu', 'orders');
                localStorage.setItem('selectedOrderId', orderId);
              } else {
                toast.error('未找到该订单');
              }
            }}
          />
        );
      }

      // 如果正在查看小B结算批次详情（优先检查，确保从其他页面跳转过来时能正确显示）
      if (selectedPartnerBatch && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'settlement' && 
          adminCurrentSettlementSubMenu === 'partner-batches') {
        // 保存批次ID到localStorage
        localStorage.setItem('selectedPartnerBatchId', selectedPartnerBatch.batchId);
        return (
          <PartnerSettlementBatchDetail
            batch={selectedPartnerBatch}
            onBack={() => {
              setSelectedPartnerBatch(null);
              localStorage.removeItem('selectedPartnerBatchId');
            }}
            onViewOrderDetail={(orderId) => {
              const orders = getMockOrders();
              const order = orders.find(o => o.orderId === orderId);
              if (order) {
                setSelectedOrder(order);
                setAdminCurrentMenu('orders');
                localStorage.setItem('adminCurrentMenu', 'orders');
                localStorage.setItem('selectedOrderId', orderId);
              } else {
                toast.error('未找到该订单');
              }
            }}
          />
        );
      }

      // 如果正在查看供应商结算批次详情（优先检查，确保从其他页面跳转过来时能正确显示）
      if (selectedSupplierBatch && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'settlement' && 
          adminCurrentSettlementSubMenu === 'supplier-batches') {
        // 保存批次ID到localStorage
        localStorage.setItem('selectedSupplierBatchId', selectedSupplierBatch.batchId);
        return (
          <SupplierSettlementBatchDetail
            batch={selectedSupplierBatch}
            onBack={() => {
              setSelectedSupplierBatch(null);
              localStorage.removeItem('selectedSupplierBatchId');
            }}
            onViewOrderDetail={(orderId) => {
              const orders = getMockOrders();
              const order = orders.find(o => o.orderId === orderId);
              if (order) {
                setSelectedOrder(order);
                setAdminCurrentMenu('orders');
                localStorage.setItem('adminCurrentMenu', 'orders');
                localStorage.setItem('selectedOrderId', orderId);
              } else {
                toast.error('未找到该订单');
              }
            }}
          />
        );
      }


      // 如果正在查看订单交易详情
      if (selectedOrderTransaction && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'business-documents' && 
          adminCurrentBusinessDocumentsSubMenu === 'order-transaction') {
        // 保存交易ID到localStorage
        localStorage.setItem('selectedOrderTransactionId', selectedOrderTransaction.transactionId);
        return (
          <OrderTransactionDetail
            transaction={selectedOrderTransaction}
            onBack={() => {
              setSelectedOrderTransaction(null);
              localStorage.removeItem('selectedOrderTransactionId');
            }}
            onViewOrder={(orderId) => {
              const orders = getMockOrders();
              const order = orders.find(o => o.orderId === orderId);
              if (order) {
                setSelectedOrder(order);
                setAdminCurrentMenu('orders');
                localStorage.setItem('adminCurrentMenu', 'orders');
                localStorage.setItem('selectedOrderId', orderId);
              } else {
                toast.error('未找到该订单');
              }
            }}
          />
        );
      }


      // 如果正在查看订单退款记录详情
      if (selectedOrderRefundRecord && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'business-documents' && 
          adminCurrentBusinessDocumentsSubMenu === 'order-refund') {
        // 保存退款记录ID到localStorage
        localStorage.setItem('selectedOrderRefundRecordId', selectedOrderRefundRecord.refundId);
        return (
          <OrderRefundRecordDetail
            record={selectedOrderRefundRecord}
            onBack={() => {
              setSelectedOrderRefundRecord(null);
              localStorage.removeItem('selectedOrderRefundRecordId');
            }}
            onViewOrder={(orderId) => {
              const orders = getMockOrders();
              const order = orders.find(o => o.orderId === orderId);
              if (order) {
                setSelectedOrder(order);
                setAdminCurrentMenu('orders');
                localStorage.setItem('adminCurrentMenu', 'orders');
                localStorage.setItem('selectedOrderId', orderId);
              } else {
                toast.error('未找到该订单');
              }
            }}
            onRetryRefund={(record) => {
              toast.success(`重新发起退款功能开发中: ${record.refundId}`);
            }}
          />
        );
      }

      // 如果正在查看订单详情，且当前菜单是订单管理
      if (selectedOrder && adminCurrentMenu === 'orders') {
        // 保存订单ID到localStorage
        localStorage.setItem('selectedOrderId', selectedOrder.orderId);
        return (
          <OrderDetail
            order={selectedOrder}
            onBack={() => {
              setSelectedOrder(null);
              localStorage.removeItem('selectedOrderId');
            }}
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
              onRefreshData={handleRefreshData}
            />
          );
        case 'users':
          // 如果选中了用户详情，显示详情页
          if (selectedPartner) {
            return (
              <UserDetail partner={selectedPartner} onBack={() => setSelectedPartner(null)} />
            );
          }
          // 根据用户管理二级菜单显示不同内容
          switch (adminCurrentUserSubMenu) {
            case 'user-list':
              return <UserManagement onViewDetail={setSelectedPartner} />;
            case 'promotion-links':
              return (
                <PromotionLinkManagement
                  onViewDetail={(link) => {
                    setSelectedPromotionLink(link);
                    localStorage.setItem('selectedPromotionLinkId', link.id);
                  }}
                />
              );
            default:
              return <UserManagement onViewDetail={setSelectedPartner} />;
          }
        case 'orders':
          return <OrderManagement onViewOrderDetail={setSelectedOrder} />;
        case 'finance':
          // 根据财务中心二级菜单显示不同内容
          switch (adminCurrentFinanceSubMenu) {
            case 'platform-account':
              return <PlatformAccount />;
            case 'merchant-accounts':
              return <MerchantAccounts />;
            case 'settlement':
              // 结算管理下的三级菜单
              if (adminCurrentSettlementSubMenu === 'partner-batches') {
                return <PartnerSettlementBatchList onViewBatchDetail={setSelectedPartnerBatch} />;
              } else if (adminCurrentSettlementSubMenu === 'supplier-batches') {
                return <SupplierSettlementBatchList onViewBatchDetail={setSelectedSupplierBatch} />;
              } else if (adminCurrentSettlementSubMenu === 'settlement-config') {
                return <SettlementConfig />;
              }
              // 如果三级菜单未选中，显示结算管理的占位内容
              return <div className="p-6"><div className="text-lg font-semibold">结算管理</div><div className="text-gray-500 mt-2">请选择具体的菜单项</div></div>;
            case 'reconciliation':
              // 对账下的三级菜单
              if (adminCurrentReconciliationSubMenu === 'reconciliation-management') {
                return <ReconciliationManagement onViewReconciliationDetail={setSelectedReconciliation} />;
              } else if (adminCurrentReconciliationSubMenu === 'reconciliation-summary') {
                return <ReconciliationSummary onViewReconciliationDetail={setSelectedReconciliation} />;
              }
              // 如果三级菜单未选中，显示对账的占位内容
              return <div className="p-6"><div className="text-lg font-semibold">对账</div><div className="text-gray-500 mt-2">请选择具体的菜单项</div></div>;
            case 'withdrawal':
              return <WithdrawalManager />;
            case 'invoice':
              return <InvoiceManagement onViewInvoiceDetail={setSelectedInvoice} />;
            case 'business-documents':
              // 业务单据管理下的四级菜单
              if (adminCurrentBusinessDocumentsSubMenu === 'order-transaction') {
                return <OrderTransactionList 
                  onViewTransactionDetail={(transaction) => {
                    setSelectedOrderTransaction(transaction);
                    localStorage.setItem('selectedOrderTransactionId', transaction.transactionId);
                  }}
                  onViewOrder={(orderId) => {
                    const orders = getMockOrders();
                    const order = orders.find(o => o.orderId === orderId);
                    if (order) {
                      setSelectedOrder(order);
                      setAdminCurrentMenu('orders');
                      localStorage.setItem('adminCurrentMenu', 'orders');
                      localStorage.setItem('selectedOrderId', orderId);
                    } else {
                      toast.error('未找到该订单');
                    }
                  }}
                />;
              } else if (adminCurrentBusinessDocumentsSubMenu === 'order-refund') {
                return <OrderRefundRecordList 
                  onViewRecordDetail={(record) => {
                    setSelectedOrderRefundRecord(record);
                    localStorage.setItem('selectedOrderRefundRecordId', record.refundId);
                  }}
                  onViewOrder={(orderId) => {
                    const orders = getMockOrders();
                    const order = orders.find(o => o.orderId === orderId);
                    if (order) {
                      setSelectedOrder(order);
                      setAdminCurrentMenu('orders');
                      localStorage.setItem('adminCurrentMenu', 'orders');
                      localStorage.setItem('selectedOrderId', orderId);
                    } else {
                      toast.error('未找到该订单');
                    }
                  }}
                  onRetryRefund={(record) => {
                    toast.success('重新发起退款功能开发中');
                  }}
                />;
              } else if (adminCurrentBusinessDocumentsSubMenu === 'settlement-detail') {
                return <SettlementDetailsManager />;
              }
              // 如果四级菜单未选中，显示业务单据管理的占位内容
              return <div className="p-6"><div className="text-lg font-semibold">业务单据管理</div><div className="text-gray-500 mt-2">请选择具体的菜单项</div></div>;
            default:
          return <SettlementCenter />;
          }
        case 'marketing':
          switch (adminCurrentMarketingSubMenu) {
            case 'promotions':
              return <PromotionManagement />;
            case 'marketing-accounts':
              return <MarketingAccountManagement />;
            case 'crowd-tags':
              return <CrowdTagManagement />;
            default:
              return <PromotionManagement />;
          }
        case 'apikeys':
          return <ApiKeyManagement onViewApiKeyDetail={setSelectedApiKey} />;
        case 'pricing':
          return <PriceConfiguration />;
        case 'business-model-config':
          return <BusinessModelConfigManagement />;
        case 'feature-permissions':
          return <FeaturePermissionManagement />;
        default:
          return (
            <AdminReviewList
              applications={applications}
              onViewDetail={setSelectedAdminApplication}
              onRefreshData={handleRefreshData}
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
      setSelectedInvoice(null);
      setSelectedWithdrawal(null);
      setSelectedReconciliation(null);
      setSelectedPartnerBatch(null);
      setSelectedSupplierBatch(null);
      setSelectedApiKey(null);
      setSelectedPromotionLink(null);
      setSelectedPartner(null);
      setSelectedOrderTransaction(null);
      setSelectedOrderRefundRecord(null);
      setAdminCurrentMenu(menu);
      // 保存到 localStorage
      localStorage.setItem('adminCurrentMenu', menu);
      localStorage.removeItem('adminCurrentFinanceSubMenu');
      localStorage.removeItem('adminCurrentReconciliationSubMenu');
      localStorage.removeItem('adminCurrentSettlementSubMenu');
      localStorage.removeItem('adminCurrentBusinessDocumentsSubMenu');
      localStorage.removeItem('adminCurrentMarketingSubMenu');
      localStorage.removeItem('selectedApplicationId');
      localStorage.removeItem('selectedInvoiceId');
      localStorage.removeItem('selectedWithdrawalId');
      localStorage.removeItem('selectedReconciliationId');
      localStorage.removeItem('selectedPartnerBatchId');
      localStorage.removeItem('selectedSupplierBatchId');
      localStorage.removeItem('selectedApiKeyId');
      localStorage.removeItem('selectedPromotionLinkId');
      localStorage.removeItem('selectedPartnerId');
      localStorage.removeItem('selectedViolationFeeRecordId');
      localStorage.removeItem('selectedOrderTransactionId');
      localStorage.removeItem('selectedOrderPriceChangeRecordId');
      localStorage.removeItem('selectedOrderRefundRecordId');
      localStorage.removeItem('selectedSettlementDetailId');
      localStorage.removeItem('selectedOrderId');
    };

    // 统一的用户管理子菜单切换处理函数
    const handleUserSubMenuChange = (subMenu: UserSubMenu | undefined) => {
      // 切换用户管理子菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setSelectedInvoice(null);
      setSelectedWithdrawal(null);
      setSelectedReconciliation(null);
      setSelectedApiKey(null);
      setSelectedPartnerBatch(null);
      setSelectedSupplierBatch(null);
      setSelectedPartner(null);
      setAdminCurrentUserSubMenu(subMenu);
      // 保存到localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentUserSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentUserSubMenu');
      }
    };

    // 统一的二级菜单切换处理函数
    const handleFinanceSubMenuChange = (subMenu: FinanceSubMenu | undefined) => {
      // 切换二级菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setSelectedInvoice(null);
      setSelectedWithdrawal(null);
      setSelectedReconciliation(null);
      setSelectedApiKey(null);
      setSelectedPartnerBatch(null);
      setSelectedSupplierBatch(null);
      setAdminCurrentFinanceSubMenu(subMenu);
      // 如果切换到的不是对账菜单，清除对账三级菜单状态
      if (subMenu !== 'reconciliation') {
        setAdminCurrentReconciliationSubMenu(undefined);
        localStorage.removeItem('adminCurrentReconciliationSubMenu');
      }
      // 如果切换到的不是结算管理菜单，清除结算管理三级菜单状态
      if (subMenu !== 'settlement') {
        setAdminCurrentSettlementSubMenu(undefined);
        localStorage.removeItem('adminCurrentSettlementSubMenu');
      }
      // 如果切换到的不是业务单据管理菜单，清除业务单据管理三级菜单状态
      if (subMenu !== 'business-documents') {
        setAdminCurrentBusinessDocumentsSubMenu(undefined);
        localStorage.removeItem('adminCurrentBusinessDocumentsSubMenu');
      }
      // 切换到财务中心时不影响营销菜单
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentFinanceSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentFinanceSubMenu');
      }
    };

    // 对账三级菜单切换处理函数
    const handleReconciliationSubMenuChange = (subMenu: ReconciliationSubMenu | undefined) => {
      // 切换三级菜单时，清除详情页面状态
      setSelectedReconciliation(null);
      setAdminCurrentReconciliationSubMenu(subMenu);
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentReconciliationSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentReconciliationSubMenu');
      }
    };

    // 结算管理三级菜单切换处理函数
    const handleSettlementSubMenuChange = (subMenu: SettlementSubMenu | undefined) => {
      // 切换三级菜单时，清除详情页面状态
      setSelectedPartnerBatch(null);
      setSelectedSupplierBatch(null);
      setAdminCurrentSettlementSubMenu(subMenu);
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentSettlementSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentSettlementSubMenu');
      }
    };

    // 业务单据管理四级菜单切换处理函数
    const handleBusinessDocumentsSubMenuChange = (subMenu: BusinessDocumentsSubMenu | undefined) => {
      // 切换四级菜单时，清除详情页面状态
      setAdminCurrentBusinessDocumentsSubMenu(subMenu);
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentBusinessDocumentsSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentBusinessDocumentsSubMenu');
      }
    };

    // 营销二级菜单切换处理函数
    const handleMarketingSubMenuChange = (subMenu: MarketingSubMenu | undefined) => {
      setAdminCurrentMarketingSubMenu(subMenu);
      if (subMenu) {
        localStorage.setItem('adminCurrentMarketingSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentMarketingSubMenu');
      }
    };

    return (
      <>
        <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          currentMenu={adminCurrentMenu}
          onMenuChange={handleMenuChange}
          currentUserSubMenu={adminCurrentUserSubMenu}
          onUserSubMenuChange={handleUserSubMenuChange}
          currentFinanceSubMenu={adminCurrentFinanceSubMenu}
          onFinanceSubMenuChange={handleFinanceSubMenuChange}
          currentReconciliationSubMenu={adminCurrentReconciliationSubMenu}
          onReconciliationSubMenuChange={handleReconciliationSubMenuChange}
          currentSettlementSubMenu={adminCurrentSettlementSubMenu}
          onSettlementSubMenuChange={handleSettlementSubMenuChange}
          currentBusinessDocumentsSubMenu={adminCurrentBusinessDocumentsSubMenu}
          onBusinessDocumentsSubMenuChange={handleBusinessDocumentsSubMenuChange}
          currentMarketingSubMenu={adminCurrentMarketingSubMenu}
          onMarketingSubMenuChange={handleMarketingSubMenuChange}
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

  // 根据用户类型和Partner信息判断应该显示哪个系统
  const getUserSystemType = (): 'admin' | 'bigb' | 'smallb' | 'registration' => {
    if (!currentUser) return 'registration';
    if (currentUser.role === 'admin') return 'admin';
    
    // 如果申请已通过，根据业务模式判断
    const app = getCurrentApplication();
    if (app && app.status === 'approved' && currentPartner) {
      const userType = getUserType(currentUser, currentPartner);
      if (userType === 'bigb') return 'bigb';
      if (userType === 'smallb') return 'smallb';
    }
    
    // 默认显示注册页面
    return 'registration';
  };

  // 大B客户系统内容渲染
  const renderBigBContent = () => {
    if (!currentUser || !currentPartner) return null;
    
    switch (bigBCurrentMenu) {
      case 'dashboard':
        return <Dashboard currentPartner={currentPartner} userType="bigb" />;
      case 'orders':
        return <OrderManagement 
          onViewOrderDetail={setSelectedOrder} 
          currentPartner={currentPartner}
          userType="bigb"
        />;
      case 'withdrawal':
        // 提现管理作为一级菜单，默认显示提现中心
        return <Withdrawal currentPartner={currentPartner} userType="bigb" />;
      case 'withdrawal-center':
        return <Withdrawal currentPartner={currentPartner} userType="bigb" />;
      case 'bank-cards':
        return <BankCardManagement currentPartner={currentPartner} userType="bigb" />;
      case 'account-help':
        return <AccountHelp currentPartner={currentPartner} userType="bigb" />;
      case 'smallb-management':
        return <SmallBManagement />;
      case 'pricing':
        return <PricingStrategy currentPartner={currentPartner} />;
      case 'reports':
        return <Reports currentPartner={currentPartner} userType="bigb" />;
      case 'brand-config':
        return (
          <FeatureProtected 
            featureCode="brand-config" 
            currentPartner={currentPartner} 
            userType="bigb"
          >
            <SaaSBrandConfig />
          </FeatureProtected>
        );
      case 'links':
        return currentPartner.businessModel === 'saas' ? <AffiliateLink /> : null;
      case 'mcp-config':
        return currentPartner.businessModel === 'mcp' ? <MCPConfiguration /> : null;
      case 'mcp-monitoring':
        return currentPartner.businessModel === 'mcp' ? <MCPMonitoring /> : null;
      default:
        return <Dashboard currentPartner={currentPartner} userType="bigb" />;
    }
  };

  // 小B客户系统内容渲染
  const renderSmallBContent = () => {
    if (!currentUser || !currentPartner) return null;
    
    switch (smallBCurrentMenu) {
      case 'dashboard':
        return <Dashboard currentPartner={currentPartner} userType="smallb" />;
      case 'orders':
        return <OrderManagement 
          onViewOrderDetail={setSelectedOrder} 
          currentPartner={currentPartner}
          userType="smallb"
        />;
      case 'withdrawal':
        // 提现管理作为一级菜单，默认显示提现中心
        return <Withdrawal currentPartner={currentPartner} userType="smallb" />;
      case 'withdrawal-center':
        return <Withdrawal currentPartner={currentPartner} userType="smallb" />;
      case 'bank-cards':
        return <BankCardManagement currentPartner={currentPartner} userType="smallb" />;
      case 'account-help':
        return <AccountHelp currentPartner={currentPartner} userType="smallb" />;
      case 'affiliate-link':
        return <AffiliateLink />;
      case 'commission':
        return <CommissionDetail currentPartner={currentPartner} />;
      case 'reports':
        return <Reports currentPartner={currentPartner} userType="smallb" />;
      default:
        return <Dashboard currentPartner={currentPartner} userType="smallb" />;
    }
  };

  // 用户视图 - 根据当前视图和服务类型渲染内容
  const renderUserContent = () => {
    if (!currentUser) return null;
    
    const systemType = getUserSystemType();
    
    // 大B客户系统
    if (systemType === 'bigb') {
      return (
        <BigBLayout
          currentUser={currentUser}
          currentPartner={currentPartner}
          onLogout={handleLogout}
          currentMenu={bigBCurrentMenu}
          onMenuChange={setBigBCurrentMenu}
        >
          {renderBigBContent()}
          <Toaster />
        </BigBLayout>
      );
    }
    
    // 小B客户系统
    if (systemType === 'smallb') {
      return (
        <SmallBLayout
          currentUser={currentUser}
          currentPartner={currentPartner}
          onLogout={handleLogout}
          currentMenu={smallBCurrentMenu}
          onMenuChange={setSmallBCurrentMenu}
        >
          {renderSmallBContent()}
          <Toaster />
        </SmallBLayout>
      );
    }

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
          initialUserType={selectedUserType}
          initialCertificationType={selectedCertificationType}
          onBusinessModelChange={setSelectedBusinessModel}
          onUserTypeChange={setSelectedUserType}
          onCertificationTypeChange={setSelectedCertificationType}
          existingApplicationId={currentApplicationId}
          applicationData={currentApp ? {
            id: currentApp.id,
            status: currentApp.status,
            submittedAt: currentApp.submittedAt,
            reviewedAt: currentApp.reviewedAt,
            rejectionReason: currentApp.rejectionReason,
            data: currentApp.data,
            userType: currentApp.userType,
            certificationType: currentApp.certificationType,
            businessModel: currentApp.businessModel,
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

    // 注意：旧的基于 serviceType 的路由逻辑已废弃
    // 现在使用新的 BigBLayout/SmallBLayout 系统
    // 这些代码保留作为向后兼容，但实际不会执行（因为 systemType 判断在前面）

    // 默认显示注册服务
    return (
      <RegistrationSteps
        onSubmit={handleFormSubmit}
        initialBusinessModel={selectedBusinessModel}
        initialUserType={selectedUserType}
        initialCertificationType={selectedCertificationType}
        onBusinessModelChange={setSelectedBusinessModel}
        onUserTypeChange={setSelectedUserType}
        onCertificationTypeChange={setSelectedCertificationType}
        existingApplicationId={currentApplicationId}
        applicationData={currentApp ? {
          id: currentApp.id,
          status: currentApp.status,
          submittedAt: currentApp.submittedAt,
          reviewedAt: currentApp.reviewedAt,
          rejectionReason: currentApp.rejectionReason,
          data: currentApp.data,
          userType: currentApp.userType,
          certificationType: currentApp.certificationType,
          businessModel: currentApp.businessModel,
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

  // 根据用户类型决定使用哪个布局
  const systemType = getUserSystemType();
  
  // 大B或小B客户系统，直接返回对应的布局（布局已在renderUserContent中）
  if (systemType === 'bigb' || systemType === 'smallb') {
    return renderUserContent();
  }
  
  // 管理员系统已经在上面处理了，这里只处理普通用户（注册中或未审核通过）
  // Render user view with layout (仅用于注册流程和未审核通过的用户)
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
