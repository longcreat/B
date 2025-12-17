import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, LogOut, FileCheck, Users, ChevronLeft, ChevronRight, Receipt, Settings, Package, Key, Wallet, Building2, FileText, CreditCard, Calculator, ArrowRight, ChevronDown, ChevronUp, Cog, Shield, Link2, Percent } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

// 统一的菜单图标大小配置
const MENU_ICON_SIZE = 'w-4 h-4';

export type AdminMenuItem =
  | 'review'
  | 'users'
  | 'orders'
  | 'finance'
  | 'marketing'
  | 'apikeys'
  | 'pricing'
  | 'business-model-config'
  | 'feature-permissions';
export type UserSubMenu = 'user-list' | 'promotion-links';
export type FinanceSubMenu = 'platform-account' | 'merchant-accounts' | 'business-documents' | 'settlement' | 'reconciliation' | 'withdrawal' | 'invoice';
export type ReconciliationSubMenu = 'reconciliation-management' | 'reconciliation-summary';
export type SettlementSubMenu = 'partner-batches' | 'supplier-batches' | 'settlement-config';
export type BusinessDocumentsSubMenu = 'order-transaction' | 'order-refund' | 'settlement-detail';
export type MarketingSubMenu = 'promotions' | 'marketing-accounts' | 'crowd-tags';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name?: string;
    email?: string;
    role?: string;
  } | null;
  onLogout: () => void;
  currentMenu?: AdminMenuItem;
  onMenuChange?: (menu: AdminMenuItem) => void;
  currentUserSubMenu?: UserSubMenu;
  onUserSubMenuChange?: (subMenu: UserSubMenu) => void;
  currentFinanceSubMenu?: FinanceSubMenu;
  onFinanceSubMenuChange?: (subMenu: FinanceSubMenu) => void;
  currentReconciliationSubMenu?: ReconciliationSubMenu;
  onReconciliationSubMenuChange?: (subMenu: ReconciliationSubMenu) => void;
  currentSettlementSubMenu?: SettlementSubMenu;
  onSettlementSubMenuChange?: (subMenu: SettlementSubMenu) => void;
  currentBusinessDocumentsSubMenu?: BusinessDocumentsSubMenu;
  onBusinessDocumentsSubMenuChange?: (subMenu: BusinessDocumentsSubMenu) => void;
  currentMarketingSubMenu?: MarketingSubMenu;
  onMarketingSubMenuChange?: (subMenu: MarketingSubMenu) => void;
  pendingReviewCount?: number;
}

export function AdminLayout({
  children,
  currentUser,
  onLogout,
  currentMenu = 'review',
  onMenuChange,
  currentUserSubMenu,
  onUserSubMenuChange,
  currentFinanceSubMenu,
  onFinanceSubMenuChange,
  currentReconciliationSubMenu,
  onReconciliationSubMenuChange,
  currentSettlementSubMenu,
  onSettlementSubMenuChange,
  currentBusinessDocumentsSubMenu,
  onBusinessDocumentsSubMenuChange,
  currentMarketingSubMenu,
  onMarketingSubMenuChange,
  pendingReviewCount = 0,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3); // 示例：3个未读通知

  // 统一的图标大小配置 - 确保所有菜单层级的图标大小一致
  const ICON_SIZES = {
    level1: 'w-5 h-5',      // 一级菜单（资格审核、用户管理、订单管理等）
    level2: 'w-4 h-4',      // 二级菜单（财务中心下的子菜单）
    level3: 'w-4 h-4',      // 三级菜单（管控账单、交易记录、结算明细等）
    level4: 'w-4 h-4',      // 四级菜单（违约扣费记录、订单交易等）- 与三级菜单统一大小
    chevron: 'w-3 h-3',     // 展开/收起箭头
  } as const;
  
  // 菜单展开状态管理
  const [userMenuExpanded, setUserMenuExpanded] = useState(false);
  const [financeMenuExpanded, setFinanceMenuExpanded] = useState(false);
  const [marketingMenuExpanded, setMarketingMenuExpanded] = useState(false);
  const [reconciliationMenuExpanded, setReconciliationMenuExpanded] = useState(false);
  const [businessDocumentsMenuExpanded, setBusinessDocumentsMenuExpanded] = useState(false);

  const menuItems = [
    { id: 'review' as AdminMenuItem, icon: FileCheck, label: '资格审核', count: pendingReviewCount },
    { id: 'users' as AdminMenuItem, icon: Users, label: '用户管理', count: 0, hasSubMenu: true },
    { id: 'orders' as AdminMenuItem, icon: Package, label: '订单管理', count: 0 },
    { id: 'finance' as AdminMenuItem, icon: Receipt, label: '财务中心', count: 0 },
    // { id: 'marketing' as AdminMenuItem, icon: Wallet, label: '营销', count: 0, hasSubMenu: true }, // 暂时隐藏
    { id: 'apikeys' as AdminMenuItem, icon: Key, label: '密钥管理', count: 0 },
    { id: 'pricing' as AdminMenuItem, icon: Settings, label: '价格配置', count: 0 },
    // { id: 'business-model-config' as AdminMenuItem, icon: Cog, label: '业务模式配置', count: 0 }, // 暂时隐藏
    // { id: 'feature-permissions' as AdminMenuItem, icon: Shield, label: '功能权限管理', count: 0 }, // 暂时隐藏
  ];

  const userSubMenus = [
    { id: 'user-list' as UserSubMenu, icon: Users, label: '用户列表', hasSubMenu: false },
  ];

  const financeSubMenus = [
    { id: 'platform-account' as FinanceSubMenu, icon: Building2, label: '平台账户', hasSubMenu: false },
    { id: 'merchant-accounts' as FinanceSubMenu, icon: Users, label: '大B/达人账户', hasSubMenu: false },
    // { id: 'business-documents' as FinanceSubMenu, icon: FileText, label: '业务单据管理', hasSubMenu: true },
    { id: 'settlement' as FinanceSubMenu, icon: CreditCard, label: '结算管理', hasSubMenu: false },
    // { id: 'reconciliation' as FinanceSubMenu, icon: Calculator, label: '对账', hasSubMenu: true },
    // { id: 'withdrawal' as FinanceSubMenu, icon: ArrowRight, label: '提现管理', hasSubMenu: false },
    { id: 'invoice' as FinanceSubMenu, icon: Receipt, label: '发票管理', hasSubMenu: false },
  ];

  const reconciliationSubMenus = [
    { id: 'reconciliation-management' as ReconciliationSubMenu, icon: Calculator, label: '对账管理' },
    { id: 'reconciliation-summary' as ReconciliationSubMenu, icon: FileText, label: '对账差异汇总' },
  ];


  const businessDocumentsSubMenus = [
    { id: 'order-transaction' as BusinessDocumentsSubMenu, icon: FileText, label: '订单交易', parent: 'transaction-record' },
    { id: 'order-refund' as BusinessDocumentsSubMenu, icon: FileText, label: '订单退款记录', parent: 'transaction-record' },
    { id: 'settlement-detail' as BusinessDocumentsSubMenu, icon: FileText, label: '结算明细', parent: null },
  ];

  // 三级菜单分组（交易记录、结算明细）
  const businessDocumentsThirdMenus = [
    { id: 'transaction-record', label: '交易记录', icon: FileText, subMenus: ['order-transaction' as BusinessDocumentsSubMenu, 'order-refund' as BusinessDocumentsSubMenu] },
    { id: 'settlement-detail-menu', label: '结算明细', icon: FileText, subMenus: ['settlement-detail' as BusinessDocumentsSubMenu] },
  ];

  // ========== 菜单事件处理 ==========
  // const marketingSubMenus = [
  //   { id: 'promotions' as MarketingSubMenu, icon: Percent, label: '优惠活动管理' },
  //   { id: 'marketing-accounts' as MarketingSubMenu, icon: Wallet, label: '营销账户管理' },
  //   { id: 'crowd-tags' as MarketingSubMenu, icon: Users, label: '人群标签' },
  // ];
  
  // 处理一级菜单（用户管理）点击
  const handleUserMenuClick = () => {
    if (currentMenu !== 'users') {
      // 切换到用户管理
      onMenuChange?.('users');
      if (!sidebarCollapsed) {
        setUserMenuExpanded(true);
        // 自动选中用户列表子菜单
        onUserSubMenuChange?.('user-list');
      }
    } else {
      // 如果已经在用户管理，切换展开/收起
      if (!sidebarCollapsed) {
        setUserMenuExpanded(!userMenuExpanded);
      }
    }
  };

  // 处理一级菜单（营销）点击
  const handleMarketingMenuClick = () => {
    if (currentMenu !== 'marketing') {
      onMenuChange?.('marketing');
      if (!sidebarCollapsed) {
        setMarketingMenuExpanded(true);
        // 默认选中优惠活动管理
        onMarketingSubMenuChange?.('promotions');
      }
    } else {
      if (!sidebarCollapsed) {
        setMarketingMenuExpanded(!marketingMenuExpanded);
      }
    }
  };

  // 处理一级菜单（财务中心）点击
  const handleFinanceMenuClick = () => {
    if (currentMenu !== 'finance') {
      // 切换到财务中心
      onMenuChange?.('finance');
      if (!sidebarCollapsed) {
        setFinanceMenuExpanded(true);
      }
      // 不自动选中任何子菜单，让用户自己选择
    } else {
      // 如果已经在财务中心，切换展开/收起
      if (!sidebarCollapsed) {
        setFinanceMenuExpanded(!financeMenuExpanded);
      }
    }
  };

  // 处理二级菜单（对账）点击
  const handleReconciliationMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 如果当前不是对账，切换到对账
    if (currentFinanceSubMenu !== 'reconciliation') {
      onFinanceSubMenuChange?.('reconciliation');
      // 不自动选中三级菜单，只选中二级菜单
      if (!sidebarCollapsed) {
        setReconciliationMenuExpanded(true);
      }
    } else {
      // 如果已经是对账，切换展开/收起
      if (!sidebarCollapsed) {
        // 如果三级菜单已选中，不允许收起
        if (currentReconciliationSubMenu) {
          setReconciliationMenuExpanded(true);
        } else {
          setReconciliationMenuExpanded(!reconciliationMenuExpanded);
        }
      }
    }
  };

  // 处理三级菜单（对账下的子菜单）点击
  const handleReconciliationThirdMenuClick = (menuId: ReconciliationSubMenu) => {
    // 确保父菜单展开并选中
    setReconciliationMenuExpanded(true);
    onFinanceSubMenuChange?.('reconciliation');
    // 选中三级菜单
    onReconciliationSubMenuChange?.(menuId);
  };

  // 处理二级菜单（结算管理）点击 - 不再有三级菜单
  const handleSettlementMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFinanceSubMenuChange?.('settlement');
  };

  // 处理二级菜单（业务单据管理）点击
  const handleBusinessDocumentsMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 如果当前不是业务单据管理，切换到业务单据管理
    if (currentFinanceSubMenu !== 'business-documents') {
      onFinanceSubMenuChange?.('business-documents');
      // 不自动选中三级菜单，只选中二级菜单
      if (!sidebarCollapsed) {
        setBusinessDocumentsMenuExpanded(true);
      }
    } else {
      // 如果已经是业务单据管理，切换展开/收起
      if (!sidebarCollapsed) {
        // 如果三级菜单已选中，不允许收起
        if (currentBusinessDocumentsSubMenu) {
          setBusinessDocumentsMenuExpanded(true);
        } else {
          setBusinessDocumentsMenuExpanded(!businessDocumentsMenuExpanded);
        }
      }
    }
  };

  // 处理三级菜单（业务单据管理下的子菜单）点击
  const handleBusinessDocumentsThirdMenuClick = (menuId: BusinessDocumentsSubMenu) => {
    // 确保父菜单展开并选中
    setBusinessDocumentsMenuExpanded(true);
    onFinanceSubMenuChange?.('business-documents');
    // 选中三级菜单
    onBusinessDocumentsSubMenuChange?.(menuId);
  };

  // 处理普通二级菜单点击
  const handleSecondMenuClick = (menuId: FinanceSubMenu) => {
    onFinanceSubMenuChange?.(menuId);
    // 如果切换到非对账/结算管理/业务单据管理菜单，清除三级菜单选中状态
    if (menuId !== 'reconciliation' && menuId !== 'settlement' && menuId !== 'business-documents') {
      // 清除三级菜单选中状态
      if (!sidebarCollapsed) {
        setReconciliationMenuExpanded(false);
        setBusinessDocumentsMenuExpanded(false);
      }
    }
  };

  // ========== 菜单状态同步 ==========
  
  // 同步菜单展开状态
  useEffect(() => {
    if (sidebarCollapsed) {
      // 侧边栏收起时，保持展开状态但不显示
      return;
    }
    
    if (currentMenu === 'finance') {
      // 在财务中心时，确保财务中心菜单展开
      setFinanceMenuExpanded(true);
      
      if (currentFinanceSubMenu === 'reconciliation') {
        // 如果选中对账，确保对账菜单展开
        setReconciliationMenuExpanded(true);
      } else {
        // 如果切换到其他二级菜单，收起对账菜单
        setReconciliationMenuExpanded(false);
      }
      if (currentFinanceSubMenu === 'business-documents') {
        // 如果选中业务单据管理，确保业务单据管理菜单展开
        setBusinessDocumentsMenuExpanded(true);
      } else {
        // 如果切换到其他二级菜单，收起业务单据管理菜单
        setBusinessDocumentsMenuExpanded(false);
      }
    } else if (currentMenu === 'marketing') {
      // 在营销菜单时，确保营销菜单展开
      setMarketingMenuExpanded(true);
    } else {
      // 不在财务中心/营销时，收起相关子菜单
      setFinanceMenuExpanded(false);
      setReconciliationMenuExpanded(false);
      setBusinessDocumentsMenuExpanded(false);
      setMarketingMenuExpanded(false);
    }
  }, [currentMenu, currentFinanceSubMenu, currentReconciliationSubMenu, currentSettlementSubMenu, currentBusinessDocumentsSubMenu, sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部页头 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-red-600 text-sm font-bold">AI</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AIGOHOTEL</span>
              <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-300">
                管理后台
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 通知栏 */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* 用户中心 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {currentUser?.name?.[0] || currentUser?.email?.[0] || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <div className="text-sm">{currentUser?.name || currentUser?.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-500">管理员</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p>{currentUser?.name || '管理员'}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className={`${ICON_SIZES.level2} mr-2`} />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside
          className={`bg-white border-r transition-all duration-300 flex flex-col ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="sticky top-16 flex flex-col h-[calc(100vh-4rem)]">
            {/* 侧边栏内容 */}
            <nav className={`space-y-1 flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentMenu === item.id;
                const isFinance = item.id === 'finance';
                const isMarketing = item.id === 'marketing';
                const isUsers = item.id === 'users';
                
                if (isUsers && !sidebarCollapsed) {
                  // 用户管理菜单带二级菜单
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={handleUserMenuClick}
                        className={`flex items-center rounded-lg transition-colors w-full gap-3 px-3 py-2 text-sm ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`${ICON_SIZES.level1} flex-shrink-0`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count > 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {item.count}
                          </Badge>
                        )}
                        {userMenuExpanded ? (
                          <ChevronUp className={`${ICON_SIZES.level2} flex-shrink-0`} />
                        ) : (
                          <ChevronDown className={`${ICON_SIZES.level2} flex-shrink-0`} />
                        )}
                      </button>
                      {userMenuExpanded && isActive && (
                        <div className="ml-6 space-y-1">
                          {userSubMenus.map((subMenu) => {
                            const SubIcon = subMenu.icon;
                            const isSubActive = currentUserSubMenu === subMenu.id;
                            
                            return (
                              <button
                                key={subMenu.id}
                                onClick={() => onUserSubMenuChange?.(subMenu.id)}
                                className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                  isSubActive
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className={`${ICON_SIZES.level2} flex-shrink-0 ${
                                  isSubActive ? 'text-blue-700' : 'text-gray-600'
                                }`} />
                                <span className="flex-1 text-left">{subMenu.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // if (isMarketing && !sidebarCollapsed) {
                //   return (
                //     <div key={item.id} className="space-y-1">
                //       <button
                //         onClick={handleMarketingMenuClick}
                //         className={`flex items-center rounded-lg transition-colors w-full gap-3 px-3 py-2 text-sm ${
                //           isActive
                //             ? 'bg-blue-50 text-blue-700'
                //             : 'text-gray-700 hover:bg-gray-100'
                //         }`}
                //       >
                //         <Icon className={`${ICON_SIZES.level1} flex-shrink-0`} />
                //         <span className="flex-1 text-left">{item.label}</span>
                //         {marketingMenuExpanded ? (
                //           <ChevronUp className={`${ICON_SIZES.level2} flex-shrink-0`} />
                //         ) : (
                //           <ChevronDown className={`${ICON_SIZES.level2} flex-shrink-0`} />
                //         )}
                //       </button>
                //       {marketingMenuExpanded && isActive && (
                //         <div className="ml-6 space-y-1">
                //           {marketingSubMenus.map((subMenu) => {
                //             const SubIcon = subMenu.icon;
                //             const isSubActive = currentMarketingSubMenu === subMenu.id;
                //
                //             return (
                //               <button
                //                 key={subMenu.id}
                //                 onClick={() => onMarketingSubMenuChange?.(subMenu.id)}
                //                 className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                //                   isSubActive
                //                     ? 'bg-blue-100 text-blue-700 font-medium'
                //                     : 'text-gray-600 hover:bg-gray-50'
                //                 }`}
                //               >
                //                 <SubIcon
                //                   className={`${ICON_SIZES.level2} flex-shrink-0 ${
                //                     isSubActive ? 'text-blue-700' : 'text-gray-600'
                //                   }`}
                //                 />
                //                 <span className="flex-1 text-left">{subMenu.label}</span>
                //               </button>
                //             );
                //           })}
                //         </div>
                //       )}
                //     </div>
                //   );
                // }
                
                if (isFinance && !sidebarCollapsed) {
                  // 财务中心菜单带二级菜单
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={handleFinanceMenuClick}
                        className={`flex items-center rounded-lg transition-colors w-full gap-3 px-3 py-2 text-sm ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`${ICON_SIZES.level1} flex-shrink-0`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count > 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {item.count}
                          </Badge>
                        )}
                        {financeMenuExpanded ? (
                          <ChevronUp className={`${ICON_SIZES.level2} flex-shrink-0`} />
                        ) : (
                          <ChevronDown className={`${ICON_SIZES.level2} flex-shrink-0`} />
                        )}
                      </button>
                      {financeMenuExpanded && isActive && (
                        <div className="ml-6 space-y-1">
                          {financeSubMenus.map((subMenu) => {
                            const SubIcon = subMenu.icon;
                            const isSubActive = currentFinanceSubMenu === subMenu.id;
                            const isReconciliation = subMenu.id === 'reconciliation';
                            const isSettlement = subMenu.id === 'settlement';
                            const isBusinessDocuments = subMenu.id === 'business-documents';
                            
                            if (isReconciliation && subMenu.hasSubMenu) {
                              // 对账有三级菜单
                              const hasThirdMenuActive = !!currentReconciliationSubMenu;
                              const isSubMenuActive = isSubActive && !hasThirdMenuActive;
                              
                              return (
                                <div key={subMenu.id} className="space-y-1">
                                  {/* 二级菜单按钮 */}
                                  <button
                                    onClick={handleReconciliationMenuClick}
                                    className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                      isSubMenuActive
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : isSubActive
                                        ? 'text-blue-600 hover:bg-blue-50'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <SubIcon className={`${ICON_SIZES.level2} flex-shrink-0 ${
                                      isSubMenuActive
                                        ? 'text-blue-700'
                                        : isSubActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                    <span className="flex-1 text-left">{subMenu.label}</span>
                                    {reconciliationMenuExpanded ? (
                                      <ChevronUp className={`${ICON_SIZES.chevron} flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    ) : (
                                      <ChevronDown className={`${ICON_SIZES.chevron} flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    )}
                                  </button>
                                  
                                  {/* 三级菜单 */}
                                  {reconciliationMenuExpanded && (
                                    <div className="ml-6 space-y-1">
                                      {reconciliationSubMenus.map((thirdMenu) => {
                                        const ThirdIcon = thirdMenu.icon;
                                        const isThirdActive = currentReconciliationSubMenu === thirdMenu.id;
                                        return (
                                          <button
                                            key={thirdMenu.id}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleReconciliationThirdMenuClick(thirdMenu.id);
                                            }}
                                            className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                              isThirdActive
                                                ? 'bg-blue-200 text-blue-800 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                          >
                                            <ThirdIcon className={`${ICON_SIZES.level3} flex-shrink-0 ${
                                              isThirdActive
                                                ? 'text-blue-800'
                                                : 'text-gray-600'
                                            }`} />
                                            <span className="flex-1 text-left">{thirdMenu.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            
                            
                            if (isBusinessDocuments && subMenu.hasSubMenu) {
                              // 业务单据管理有三级菜单（管控账单、交易记录、结算明细）
                              const hasThirdMenuActive = !!currentBusinessDocumentsSubMenu;
                              const isSubMenuActive = isSubActive && !hasThirdMenuActive;
                              
                              return (
                                <div key={subMenu.id} className="space-y-1">
                                  {/* 二级菜单按钮 */}
                                  <button
                                    onClick={handleBusinessDocumentsMenuClick}
                                    className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                      isSubMenuActive
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : isSubActive
                                        ? 'text-blue-600 hover:bg-blue-50'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <SubIcon className={`${ICON_SIZES.level2} flex-shrink-0 ${
                                      isSubMenuActive
                                        ? 'text-blue-700'
                                        : isSubActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                    <span className="flex-1 text-left">{subMenu.label}</span>
                                    {businessDocumentsMenuExpanded ? (
                                      <ChevronUp className={`${ICON_SIZES.chevron} flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    ) : (
                                      <ChevronDown className={`${ICON_SIZES.chevron} flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    )}
                                  </button>
                                  
                                  {/* 三级菜单（管控账单、交易记录、结算明细） */}
                                  {businessDocumentsMenuExpanded && (
                                    <div className="ml-4 space-y-1">
                                      {businessDocumentsThirdMenus.map((thirdMenu) => {
                                        const ThirdIcon = thirdMenu.icon;
                                        const hasFourthMenuActive = thirdMenu.subMenus.some(sub => currentBusinessDocumentsSubMenu === sub);
                                        const isThirdMenuActive = hasFourthMenuActive;
                                        
                                        return (
                                          <div key={thirdMenu.id} className="space-y-1">
                                            {/* 三级菜单按钮 */}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // 如果有四级菜单，展开/收起；如果没有，直接选择第一个四级菜单
                                                if (thirdMenu.subMenus.length === 1) {
                                                  // 如果只有一个子菜单，直接选中它
                                                  handleBusinessDocumentsThirdMenuClick(thirdMenu.subMenus[0]);
                                                } else {
                                                  // 如果有多个子菜单，展开/收起
                                                  // 这里可以添加展开/收起逻辑，暂时先默认展开并选中第一个
                                                  if (!hasFourthMenuActive) {
                                                    handleBusinessDocumentsThirdMenuClick(thirdMenu.subMenus[0]);
                                                  }
                                                }
                                              }}
                                              className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                                isThirdMenuActive
                                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                                  : 'text-gray-600 hover:bg-gray-50'
                                              }`}
                                            >
                                              <ThirdIcon className={`${ICON_SIZES.level3} flex-shrink-0 ${
                                                isThirdMenuActive
                                                  ? 'text-blue-700'
                                                  : 'text-gray-600'
                                              }`} />
                                              <span className="flex-1 text-left truncate">{thirdMenu.label}</span>
                                              {thirdMenu.subMenus.length > 1 && (
                                                hasFourthMenuActive ? (
                                                  <ChevronUp className={`${ICON_SIZES.chevron} flex-shrink-0`} />
                                                ) : (
                                                  <ChevronDown className={`${ICON_SIZES.chevron} flex-shrink-0`} />
                                                )
                                              )}
                                            </button>
                                            
                                            {/* 四级菜单 */}
                                            {thirdMenu.subMenus.length > 0 && (
                                              <div className="ml-4 space-y-1">
                                                {thirdMenu.subMenus.map((fourthMenuId) => {
                                                  const fourthMenu = businessDocumentsSubMenus.find(m => m.id === fourthMenuId);
                                                  if (!fourthMenu) return null;
                                                  
                                                  const FourthIcon = fourthMenu.icon || FileText;
                                                  const isFourthActive = currentBusinessDocumentsSubMenu === fourthMenuId;
                                                  
                                                  return (
                                                    <button
                                                      key={fourthMenuId}
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBusinessDocumentsThirdMenuClick(fourthMenuId);
                                                      }}
                                                      className={`flex items-center rounded-lg transition-colors w-full gap-2 px-2 py-1.5 text-sm ${
                                                        isFourthActive
                                                          ? 'bg-blue-200 text-blue-800 font-medium'
                                                          : 'text-gray-600 hover:bg-gray-50'
                                                      }`}
                                                    >
                                                      <FourthIcon className={`${ICON_SIZES.level4} flex-shrink-0 ${
                                                        isFourthActive
                                                          ? 'text-blue-800'
                                                          : 'text-gray-600'
                                                      }`} />
                                                      <span className="flex-1 text-left truncate">{fourthMenu.label}</span>
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            
                            // 普通二级菜单项
                            return (
                              <button
                                key={subMenu.id}
                                onClick={() => handleSecondMenuClick(subMenu.id)}
                                className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                  isSubActive
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <SubIcon className={`${ICON_SIZES.level2} flex-shrink-0`} />
                                <span className="flex-1 text-left">{subMenu.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // 普通菜单项
                return (
                  <button
                    key={item.id}
                    onClick={() => onMenuChange?.(item.id)}
                    className={`flex items-center rounded-lg transition-colors text-sm ${
                      sidebarCollapsed
                        ? 'w-full justify-center px-2 py-2'
                        : 'w-full gap-3 px-3 py-2'
                    } ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`${ICON_SIZES.level1} flex-shrink-0`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count > 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {item.count}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 折叠按钮 - 固定在底部 */}
            <div className={`border-t flex-shrink-0 ${sidebarCollapsed ? 'px-2 py-2' : 'px-4 py-2'}`}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-center'}`}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className={`${ICON_SIZES.level2}`} />
                ) : (
                  <>
                    <ChevronLeft className={`${ICON_SIZES.level2} mr-2`} />
                    收起
                  </>
                )}
              </Button>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
