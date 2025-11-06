import React, { useState, useEffect } from 'react';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { AdminReviewList } from './components/AdminReviewList';
import type { ApplicationData } from './data/mockApplications';
import { getMockApplications } from './data/mockApplications';
import { AdminReviewDetail } from './components/AdminReviewDetail';
import { AdminLayout, type AdminMenuItem, type FinanceSubMenu, type PartnerAccountSubMenu, type ReconciliationSubMenu, type SettlementSubMenu, type BusinessDocumentsSubMenu } from './components/AdminLayout';
import { UserManagement } from './components/UserManagement';
import { OrderManagement, type Order } from './components/OrderManagement';
import { OrderDetail } from './components/OrderDetail';
import { SettlementCenter } from './components/SettlementCenter';
import { InvoiceManagement, type Invoice } from './components/InvoiceManagement';
import { InvoiceDetail } from './components/InvoiceDetail';
import { WithdrawalManagement, type Withdrawal } from './components/WithdrawalManagement';
import { WithdrawalDetail } from './components/WithdrawalDetail';
import { ReconciliationManagement, type Reconciliation } from './components/ReconciliationManagement';
import { ReconciliationDetail } from './components/ReconciliationDetail';
import { ReconciliationSummary } from './components/ReconciliationSummary';
import { PartnerSettlementBatchList, type PartnerSettlementBatch } from './components/PartnerSettlementBatchList';
import { PartnerSettlementBatchDetail } from './components/PartnerSettlementBatchDetail';
import { SupplierSettlementBatchList, type SupplierSettlementBatch } from './components/SupplierSettlementBatchList';
import { SupplierSettlementBatchDetail } from './components/SupplierSettlementBatchDetail';
import { SettlementConfig } from './components/SettlementConfig';
import { ViolationFeeRecordList, type ViolationFeeRecord } from './components/ViolationFeeRecordList';
import { ViolationFeeRecordDetail } from './components/ViolationFeeRecordDetail';
import { OrderTransactionList, type OrderTransaction } from './components/OrderTransactionList';
import { OrderTransactionDetail } from './components/OrderTransactionDetail';
import { OrderPriceChangeRecordList, type OrderPriceChangeRecord } from './components/OrderPriceChangeRecordList';
import { OrderPriceChangeRecordDetail } from './components/OrderPriceChangeRecordDetail';
import { OrderRefundRecordList, type OrderRefundRecord } from './components/OrderRefundRecordList';
import { OrderRefundRecordDetail } from './components/OrderRefundRecordDetail';
import { SettlementDetailList, type SettlementDetail } from './components/SettlementDetailList';
import { SettlementDetailDetail } from './components/SettlementDetailDetail';
import { getMockOrders } from './data/mockOrders';
import { getMockSettlementBatches, getMockSupplierSettlementBatches, getMockPartnerSettlementBatches } from './data/mockSettlementBatches';
import { ApiKeyManagement, type ApiKeyInfo } from './components/ApiKeyManagement';
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
import type { IdentityType } from './components/IdentityTypeSelection';

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
type AuthView = 'login' | 'register' | null;

type UserView = 'registration' | 'userCenter';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('registration');
  const [selectedBusinessModel, setSelectedBusinessModel] = useState<BusinessModel | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityType | null>(null);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [selectedAdminApplication, setSelectedAdminApplication] = useState<ApplicationData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<Reconciliation | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKeyInfo | null>(() => {
    const stored = localStorage.getItem('selectedApiKeyId');
    if (stored) {
      const { getMockApiKeys } = require('./data/mockApiKeys');
      const keys = getMockApiKeys();
      return keys.find((k: ApiKeyInfo) => k.id === stored) || null;
    }
    return null;
  });
  const [selectedPartnerBatch, setSelectedPartnerBatch] = useState<PartnerSettlementBatch | null>(null);
  const [selectedSupplierBatch, setSelectedSupplierBatch] = useState<SupplierSettlementBatch | null>(null);
  const [selectedViolationFeeRecord, setSelectedViolationFeeRecord] = useState<ViolationFeeRecord | null>(() => {
    const stored = localStorage.getItem('selectedViolationFeeRecordId');
    if (stored) {
      // 动态导入以避免循环依赖
      const { getMockViolationFeeRecords } = require('./data/mockBusinessDocuments');
      const records = getMockViolationFeeRecords();
      return records.find((r: ViolationFeeRecord) => r.feeId === stored) || null;
    }
    return null;
  });
  const [selectedSettlementDetail, setSelectedSettlementDetail] = useState<SettlementDetail | null>(() => {
    const stored = localStorage.getItem('selectedSettlementDetailId');
    if (stored) {
      // 动态导入以避免循环依赖
      const { getMockSettlementDetails } = require('./data/mockBusinessDocuments');
      const details = getMockSettlementDetails();
      return details.find((d: SettlementDetail) => d.detailId === stored) || null;
    }
    return null;
  });
  const [selectedOrderTransaction, setSelectedOrderTransaction] = useState<OrderTransaction | null>(() => {
    const stored = localStorage.getItem('selectedOrderTransactionId');
    if (stored) {
      const { getMockOrderTransactions } = require('./data/mockBusinessDocuments');
      const transactions = getMockOrderTransactions();
      return transactions.find((t: OrderTransaction) => t.transactionId === stored) || null;
    }
    return null;
  });
  const [selectedOrderPriceChangeRecord, setSelectedOrderPriceChangeRecord] = useState<OrderPriceChangeRecord | null>(() => {
    const stored = localStorage.getItem('selectedOrderPriceChangeRecordId');
    if (stored) {
      const { getMockOrderPriceChangeRecords } = require('./data/mockBusinessDocuments');
      const records = getMockOrderPriceChangeRecords();
      return records.find((r: OrderPriceChangeRecord) => r.priceChangeId === stored) || null;
    }
    return null;
  });
  const [selectedOrderRefundRecord, setSelectedOrderRefundRecord] = useState<OrderRefundRecord | null>(() => {
    const stored = localStorage.getItem('selectedOrderRefundRecordId');
    if (stored) {
      const { getMockOrderRefundRecords } = require('./data/mockBusinessDocuments');
      const records = getMockOrderRefundRecords();
      return records.find((r: OrderRefundRecord) => r.refundId === stored) || null;
    }
    return null;
  });
  const [hasCheckedExistingApplication, setHasCheckedExistingApplication] = useState(false);
  
  // 从 localStorage 恢复管理员页面状态
  const [adminCurrentMenu, setAdminCurrentMenu] = useState<AdminMenuItem>(() => {
    const stored = localStorage.getItem('adminCurrentMenu');
    return (stored as AdminMenuItem) || 'review';
  });
  const [adminCurrentFinanceSubMenu, setAdminCurrentFinanceSubMenu] = useState<FinanceSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentFinanceSubMenu');
    return stored ? (stored as FinanceSubMenu) : undefined;
  });
  const [adminCurrentPartnerAccountSubMenu, setAdminCurrentPartnerAccountSubMenu] = useState<PartnerAccountSubMenu | undefined>(() => {
    const stored = localStorage.getItem('adminCurrentPartnerAccountSubMenu');
    return stored ? (stored as PartnerAccountSubMenu) : undefined;
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

  // Load applications from localStorage
  const [applications, setApplications] = useState<ApplicationData[]>(() => {
    const stored = localStorage.getItem('applications');
    if (stored) {
      return JSON.parse(stored);
    }
    // 使用 mock 数据
    return getMockApplications();
  });

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
    // 验证必需的选择
    if (!selectedBusinessModel || !selectedIdentity) {
      toast.error('请先完成身份类型和业务模式选择');
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
              data: formData,
              businessModel: selectedBusinessModel,
              identityType: selectedIdentity,
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
        identityType: selectedIdentity,
        status: 'pending',
        submittedAt: formatDateTime(new Date()),
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
    // 重新申请：清空身份类型和业务模式选择，让用户从身份选择开始
    setSelectedBusinessModel(null);
    setSelectedIdentity(null);
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

      // 如果正在查看违约扣费记录详情
      if (selectedViolationFeeRecord && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'business-documents' && 
          adminCurrentBusinessDocumentsSubMenu === 'violation-fee') {
        // 保存记录ID到localStorage
        localStorage.setItem('selectedViolationFeeRecordId', selectedViolationFeeRecord.feeId);
        return (
          <ViolationFeeRecordDetail
            record={selectedViolationFeeRecord}
            onBack={() => {
              setSelectedViolationFeeRecord(null);
              localStorage.removeItem('selectedViolationFeeRecordId');
            }}
            onCancelFee={(recordId, reason) => {
              toast.success(`撤销扣费功能开发中: ${recordId}, 原因: ${reason}`);
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

      // 如果正在查看订单改价记录详情
      if (selectedOrderPriceChangeRecord && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'business-documents' && 
          adminCurrentBusinessDocumentsSubMenu === 'order-price-change') {
        // 保存改价记录ID到localStorage
        localStorage.setItem('selectedOrderPriceChangeRecordId', selectedOrderPriceChangeRecord.priceChangeId);
        return (
          <OrderPriceChangeRecordDetail
            record={selectedOrderPriceChangeRecord}
            onBack={() => {
              setSelectedOrderPriceChangeRecord(null);
              localStorage.removeItem('selectedOrderPriceChangeRecordId');
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
            onApprove={(recordId, approved, reason) => {
              toast.success(approved ? `改价记录 ${recordId} 审批通过` : `改价记录 ${recordId} 已驳回：${reason}`);
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

      // 如果正在查看结算明细详情
      if (selectedSettlementDetail && adminCurrentMenu === 'finance' && adminCurrentFinanceSubMenu === 'business-documents' && 
          adminCurrentBusinessDocumentsSubMenu === 'settlement-detail') {
        // 保存明细ID到localStorage
        localStorage.setItem('selectedSettlementDetailId', selectedSettlementDetail.detailId);
        return (
          <SettlementDetailDetail
            detail={selectedSettlementDetail}
            onBack={() => {
              setSelectedSettlementDetail(null);
              localStorage.removeItem('selectedSettlementDetailId');
            }}
            onViewBatch={(batchId) => {
              // 根据批次ID判断是客户结算还是供应商结算
              if (batchId.startsWith('BATCH-B-')) {
                // 先尝试从客户结算批次列表查找
                const partnerBatches = getMockPartnerSettlementBatches();
                let batch = partnerBatches.find(b => b.batchId === batchId);
                
                // 如果找不到，可能是ID格式问题，尝试从旧的结算批次列表查找
                if (!batch) {
                  const oldBatches = getMockSettlementBatches();
                  const oldBatch = oldBatches.find(b => b.batchId === batchId);
                  if (oldBatch) {
                    // 转换为新的格式
                    batch = {
                      batchId: oldBatch.batchId,
                      partnerId: oldBatch.partnerId || `PARTNER-${oldBatch.batchId}`,
                      partnerName: oldBatch.partnerName || '未知客户',
                      partnerType: 'individual',
                      settlementPeriodStart: oldBatch.settlementPeriodStart || '',
                      settlementPeriodEnd: oldBatch.settlementPeriodEnd || '',
                      orderCount: oldBatch.orderCount || 0,
                      settlementAmount: oldBatch.settlementAmount || 0,
                      status: oldBatch.status as any,
                      createdAt: oldBatch.createdAt || '',
                      totalC2cAmount: oldBatch.totalC2cAmount,
                      totalPlatformProfit: oldBatch.totalPlatformProfit,
                    };
                  }
                }
                
                if (batch) {
                  setSelectedPartnerBatch(batch);
                  setAdminCurrentFinanceSubMenu('settlement');
                  setAdminCurrentSettlementSubMenu('partner-batches');
                  // 清除结算明细详情状态，避免冲突
                  setSelectedSettlementDetail(null);
                  localStorage.removeItem('selectedSettlementDetailId');
                  localStorage.setItem('adminCurrentFinanceSubMenu', 'settlement');
                  localStorage.setItem('adminCurrentSettlementSubMenu', 'partner-batches');
                  localStorage.setItem('selectedPartnerBatchId', batchId);
                } else {
                  toast.error(`未找到该批次: ${batchId}`);
                  console.error('批次ID:', batchId, '可用批次ID:', partnerBatches.map(b => b.batchId).slice(0, 5));
                }
              } else if (batchId.startsWith('BATCH-S-')) {
                const batches = getMockSupplierSettlementBatches();
                const batch = batches.find(b => b.batchId === batchId);
                if (batch) {
                  setSelectedSupplierBatch(batch);
                  setAdminCurrentFinanceSubMenu('settlement');
                  setAdminCurrentSettlementSubMenu('supplier-batches');
                  // 清除结算明细详情状态，避免冲突
                  setSelectedSettlementDetail(null);
                  localStorage.removeItem('selectedSettlementDetailId');
                  localStorage.setItem('adminCurrentFinanceSubMenu', 'settlement');
                  localStorage.setItem('adminCurrentSettlementSubMenu', 'supplier-batches');
                  localStorage.setItem('selectedSupplierBatchId', batchId);
                } else {
                  toast.error(`未找到该批次: ${batchId}`);
                  console.error('批次ID:', batchId, '可用批次ID:', batches.map(b => b.batchId).slice(0, 5));
                }
              }
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
              return <WithdrawalManagement onViewWithdrawalDetail={setSelectedWithdrawal} />;
            case 'invoice':
              return <InvoiceManagement onViewInvoiceDetail={setSelectedInvoice} />;
            case 'business-documents':
              // 业务单据管理下的四级菜单
              if (adminCurrentBusinessDocumentsSubMenu === 'violation-fee') {
                return <ViolationFeeRecordList 
                  onViewRecordDetail={(record) => {
                    setSelectedViolationFeeRecord(record);
                    localStorage.setItem('selectedViolationFeeRecordId', record.feeId);
                  }}
                  onCancelFee={(record) => {
                    // 可以通过详情页处理，或者直接在这里处理
                    setSelectedViolationFeeRecord(record);
                    localStorage.setItem('selectedViolationFeeRecordId', record.feeId);
                    // 这里可以打开详情页，详情页有撤销扣费的完整功能
                  }}
                />;
              } else if (adminCurrentBusinessDocumentsSubMenu === 'order-transaction') {
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
              } else if (adminCurrentBusinessDocumentsSubMenu === 'order-price-change') {
                return <OrderPriceChangeRecordList 
                  onViewRecordDetail={(record) => {
                    setSelectedOrderPriceChangeRecord(record);
                    localStorage.setItem('selectedOrderPriceChangeRecordId', record.priceChangeId);
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
                  onApprove={(record, approved, reason) => {
                    // 打开详情页进行审批，详情页有完整的审批对话框
                    setSelectedOrderPriceChangeRecord(record);
                    localStorage.setItem('selectedOrderPriceChangeRecordId', record.priceChangeId);
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
                return <SettlementDetailList 
                  onViewDetail={(detail) => {
                    setSelectedSettlementDetail(detail);
                    localStorage.setItem('selectedSettlementDetailId', detail.detailId);
                  }}
                  onViewBatch={(batchId) => {
                    // 根据批次ID判断是客户结算还是供应商结算
                    if (batchId.startsWith('BATCH-B-')) {
                      // 先尝试从客户结算批次列表查找
                      const partnerBatches = getMockPartnerSettlementBatches();
                      let batch = partnerBatches.find(b => b.batchId === batchId);
                      
                      // 如果找不到，可能是ID格式问题，尝试从旧的结算批次列表查找
                      if (!batch) {
                        const oldBatches = getMockSettlementBatches();
                        const oldBatch = oldBatches.find(b => b.batchId === batchId);
                        if (oldBatch) {
                          // 转换为新的格式
                          batch = {
                            batchId: oldBatch.batchId,
                            partnerId: oldBatch.partnerId || `PARTNER-${oldBatch.batchId}`,
                            partnerName: oldBatch.partnerName || '未知客户',
                            partnerType: 'individual',
                            settlementPeriodStart: oldBatch.settlementPeriodStart || '',
                            settlementPeriodEnd: oldBatch.settlementPeriodEnd || '',
                            orderCount: oldBatch.orderCount || 0,
                            settlementAmount: oldBatch.settlementAmount || 0,
                            status: oldBatch.status as any,
                            createdAt: oldBatch.createdAt || '',
                            totalC2cAmount: oldBatch.totalC2cAmount,
                            totalPlatformProfit: oldBatch.totalPlatformProfit,
                          };
                        }
                      }
                      
                      if (batch) {
                        setSelectedPartnerBatch(batch);
                        setAdminCurrentFinanceSubMenu('settlement');
                        setAdminCurrentSettlementSubMenu('partner-batches');
                        // 清除结算明细详情状态，避免冲突
                        setSelectedSettlementDetail(null);
                        localStorage.removeItem('selectedSettlementDetailId');
                        localStorage.setItem('adminCurrentFinanceSubMenu', 'settlement');
                        localStorage.setItem('adminCurrentSettlementSubMenu', 'partner-batches');
                        localStorage.setItem('selectedPartnerBatchId', batchId);
                      } else {
                        toast.error(`未找到该批次: ${batchId}`);
                        console.error('批次ID:', batchId, '可用批次ID:', partnerBatches.map(b => b.batchId).slice(0, 5));
                      }
                    } else if (batchId.startsWith('BATCH-S-')) {
                      const batches = getMockSupplierSettlementBatches();
                      const batch = batches.find(b => b.batchId === batchId);
                      if (batch) {
                        setSelectedSupplierBatch(batch);
                        setAdminCurrentFinanceSubMenu('settlement');
                        setAdminCurrentSettlementSubMenu('supplier-batches');
                        // 清除结算明细详情状态，避免冲突
                        setSelectedSettlementDetail(null);
                        localStorage.removeItem('selectedSettlementDetailId');
                        localStorage.setItem('adminCurrentFinanceSubMenu', 'settlement');
                        localStorage.setItem('adminCurrentSettlementSubMenu', 'supplier-batches');
                        localStorage.setItem('selectedSupplierBatchId', batchId);
                      } else {
                        toast.error(`未找到该批次: ${batchId}`);
                        console.error('批次ID:', batchId, '可用批次ID:', batches.map(b => b.batchId).slice(0, 5));
                      }
                    }
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
              }
              // 如果四级菜单未选中，显示业务单据管理的占位内容
              return <div className="p-6"><div className="text-lg font-semibold">业务单据管理</div><div className="text-gray-500 mt-2">请选择具体的菜单项</div></div>;
            default:
          return <SettlementCenter />;
          }
        case 'apikeys':
          return <ApiKeyManagement onViewApiKeyDetail={setSelectedApiKey} />;
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
      setSelectedInvoice(null);
      setSelectedWithdrawal(null);
      setSelectedReconciliation(null);
      setSelectedPartnerBatch(null);
      setSelectedSupplierBatch(null);
      setSelectedApiKey(null);
      setAdminCurrentMenu(menu);
      // 保存到 localStorage
      localStorage.setItem('adminCurrentMenu', menu);
      localStorage.removeItem('adminCurrentFinanceSubMenu');
      localStorage.removeItem('adminCurrentPartnerAccountSubMenu');
      localStorage.removeItem('adminCurrentReconciliationSubMenu');
      localStorage.removeItem('adminCurrentSettlementSubMenu');
      localStorage.removeItem('adminCurrentBusinessDocumentsSubMenu');
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
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentFinanceSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentFinanceSubMenu');
      }
      localStorage.removeItem('adminCurrentPartnerAccountSubMenu');
    };

    // 统一的三级菜单切换处理函数（小B账户）
    const handlePartnerAccountSubMenuChange = (subMenu: PartnerAccountSubMenu | undefined) => {
      // 切换三级菜单时，清除详情页面状态
      setSelectedOrder(null);
      setSelectedAdminApplication(null);
      setSelectedInvoice(null);
      setSelectedApiKey(null);
      setAdminCurrentPartnerAccountSubMenu(subMenu);
      // 保存到 localStorage
      if (subMenu) {
        localStorage.setItem('adminCurrentPartnerAccountSubMenu', subMenu);
      } else {
        localStorage.removeItem('adminCurrentPartnerAccountSubMenu');
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
          currentReconciliationSubMenu={adminCurrentReconciliationSubMenu}
          onReconciliationSubMenuChange={handleReconciliationSubMenuChange}
          currentSettlementSubMenu={adminCurrentSettlementSubMenu}
          onSettlementSubMenuChange={handleSettlementSubMenuChange}
          currentBusinessDocumentsSubMenu={adminCurrentBusinessDocumentsSubMenu}
          onBusinessDocumentsSubMenuChange={handleBusinessDocumentsSubMenuChange}
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
            identityType: currentApp.identityType,
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
          identityType: currentApp.identityType,
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
