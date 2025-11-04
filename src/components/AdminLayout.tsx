import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, LogOut, FileCheck, Users, ChevronLeft, ChevronRight, Receipt, Settings, Package, Key, Wallet, Building2, FileText, CreditCard, Calculator, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export type AdminMenuItem = 'review' | 'users' | 'orders' | 'finance' | 'apikeys' | 'pricing';
export type FinanceSubMenu = 'platform-account' | 'partner-account' | 'business-documents' | 'settlement' | 'reconciliation' | 'withdrawal' | 'invoice';
export type PartnerAccountSubMenu = 'partner-balance';
export type ReconciliationSubMenu = 'reconciliation-management' | 'reconciliation-summary';

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
  currentFinanceSubMenu?: FinanceSubMenu;
  onFinanceSubMenuChange?: (subMenu: FinanceSubMenu) => void;
  currentPartnerAccountSubMenu?: PartnerAccountSubMenu;
  onPartnerAccountSubMenuChange?: (subMenu: PartnerAccountSubMenu) => void;
  currentReconciliationSubMenu?: ReconciliationSubMenu;
  onReconciliationSubMenuChange?: (subMenu: ReconciliationSubMenu) => void;
  pendingReviewCount?: number;
}

export function AdminLayout({
  children,
  currentUser,
  onLogout,
  currentMenu = 'review',
  onMenuChange,
  currentFinanceSubMenu,
  onFinanceSubMenuChange,
  currentPartnerAccountSubMenu,
  onPartnerAccountSubMenuChange,
  currentReconciliationSubMenu,
  onReconciliationSubMenuChange,
  pendingReviewCount = 0,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3); // 示例：3个未读通知
  
  // 菜单展开状态管理
  const [financeMenuExpanded, setFinanceMenuExpanded] = useState(false);
  const [partnerAccountMenuExpanded, setPartnerAccountMenuExpanded] = useState(false);
  const [reconciliationMenuExpanded, setReconciliationMenuExpanded] = useState(false);

  const menuItems = [
    { id: 'review' as AdminMenuItem, icon: FileCheck, label: '资格审核', count: pendingReviewCount },
    { id: 'users' as AdminMenuItem, icon: Users, label: '用户管理', count: 0 },
    { id: 'orders' as AdminMenuItem, icon: Package, label: '订单管理', count: 0 },
    { id: 'finance' as AdminMenuItem, icon: Receipt, label: '财务中心', count: 0 },
    { id: 'apikeys' as AdminMenuItem, icon: Key, label: '密钥管理', count: 0 },
    { id: 'pricing' as AdminMenuItem, icon: Settings, label: '价格配置', count: 0 },
  ];

  const financeSubMenus = [
    { id: 'platform-account' as FinanceSubMenu, icon: Building2, label: '平台账户', hasSubMenu: false },
    { id: 'partner-account' as FinanceSubMenu, icon: Users, label: '小B账户', hasSubMenu: true },
    { id: 'business-documents' as FinanceSubMenu, icon: FileText, label: '业务单据管理', hasSubMenu: false },
    { id: 'settlement' as FinanceSubMenu, icon: CreditCard, label: '结算管理', hasSubMenu: false },
    { id: 'reconciliation' as FinanceSubMenu, icon: Calculator, label: '对账', hasSubMenu: true },
    { id: 'withdrawal' as FinanceSubMenu, icon: ArrowRight, label: '提现管理', hasSubMenu: false },
    { id: 'invoice' as FinanceSubMenu, icon: Receipt, label: '发票管理', hasSubMenu: false },
  ];

  const partnerAccountSubMenus = [
    { id: 'partner-balance' as PartnerAccountSubMenu, icon: Wallet, label: '小B余额' },
  ];

  const reconciliationSubMenus = [
    { id: 'reconciliation-management' as ReconciliationSubMenu, icon: Calculator, label: '对账管理' },
    { id: 'reconciliation-summary' as ReconciliationSubMenu, icon: FileText, label: '对账差异汇总' },
  ];

  // ========== 菜单事件处理 ==========
  
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

  // 处理二级菜单（小B账户）点击
  const handlePartnerAccountMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 如果当前不是小B账户，切换到小B账户
    if (currentFinanceSubMenu !== 'partner-account') {
      onFinanceSubMenuChange?.('partner-account');
      // 不自动选中三级菜单，只选中二级菜单
      // 通过不调用 onPartnerAccountSubMenuChange 来保持三级菜单未选中
      if (!sidebarCollapsed) {
        setPartnerAccountMenuExpanded(true);
      }
    } else {
      // 如果已经是小B账户，切换展开/收起
      if (!sidebarCollapsed) {
        // 如果三级菜单已选中，不允许收起
        if (currentPartnerAccountSubMenu) {
          setPartnerAccountMenuExpanded(true);
        } else {
          setPartnerAccountMenuExpanded(!partnerAccountMenuExpanded);
        }
      }
    }
  };

  // 处理三级菜单（小B余额）点击
  const handleThirdMenuClick = (menuId: PartnerAccountSubMenu) => {
    // 确保父菜单展开并选中
    setPartnerAccountMenuExpanded(true);
    onFinanceSubMenuChange?.('partner-account');
    // 选中三级菜单
    onPartnerAccountSubMenuChange?.(menuId);
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

  // 处理普通二级菜单点击
  const handleSecondMenuClick = (menuId: FinanceSubMenu) => {
    onFinanceSubMenuChange?.(menuId);
    // 如果切换到非小B账户/对账菜单，清除三级菜单选中状态
    if (menuId !== 'partner-account' && menuId !== 'reconciliation') {
      // 清除三级菜单选中状态
      if (!sidebarCollapsed) {
        setPartnerAccountMenuExpanded(false);
        setReconciliationMenuExpanded(false);
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
      
      if (currentFinanceSubMenu === 'partner-account') {
        // 如果选中小B账户，确保小B账户菜单展开
        setPartnerAccountMenuExpanded(true);
      } else {
        // 如果切换到其他二级菜单，收起小B账户菜单
        setPartnerAccountMenuExpanded(false);
      }
      if (currentFinanceSubMenu === 'reconciliation') {
        // 如果选中对账，确保对账菜单展开
        setReconciliationMenuExpanded(true);
      } else {
        // 如果切换到其他二级菜单，收起对账菜单
        setReconciliationMenuExpanded(false);
      }
    } else {
      // 不在财务中心时，收起所有子菜单
      setFinanceMenuExpanded(false);
      setPartnerAccountMenuExpanded(false);
      setReconciliationMenuExpanded(false);
    }
  }, [currentMenu, currentFinanceSubMenu, currentPartnerAccountSubMenu, currentReconciliationSubMenu, sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部页头 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">AI</span>
              </div>
              <span className="text-xl">AIGOHOTEL</span>
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
                  <LogOut className="w-4 h-4 mr-2" />
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
            sidebarCollapsed ? 'w-16' : 'w-56'
          }`}
        >
          <div className="sticky top-16 flex flex-col h-[calc(100vh-4rem)]">
            {/* 侧边栏内容 */}
            <nav className={`space-y-1 flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentMenu === item.id;
                const isFinance = item.id === 'finance';
                
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
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.count > 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            {item.count}
                          </Badge>
                        )}
                        {financeMenuExpanded ? (
                          <ChevronUp className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        )}
                      </button>
                      {financeMenuExpanded && isActive && (
                        <div className="ml-6 space-y-1">
                          {financeSubMenus.map((subMenu) => {
                            const SubIcon = subMenu.icon;
                            const isSubActive = currentFinanceSubMenu === subMenu.id;
                            const isPartnerAccount = subMenu.id === 'partner-account';
                            const isReconciliation = subMenu.id === 'reconciliation';
                            
                            if (isPartnerAccount && subMenu.hasSubMenu) {
                              // 小B账户有三级菜单
                              const hasThirdMenuActive = !!currentPartnerAccountSubMenu;
                              const isSubMenuActive = isSubActive && !hasThirdMenuActive;
                              
                              return (
                                <div key={subMenu.id} className="space-y-1">
                                  {/* 二级菜单按钮 */}
                                  <button
                                    onClick={handlePartnerAccountMenuClick}
                                    className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                      isSubMenuActive
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : isSubActive
                                        ? 'text-blue-600 hover:bg-blue-50'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <SubIcon className={`w-4 h-4 flex-shrink-0 ${
                                      isSubMenuActive
                                        ? 'text-blue-700'
                                        : isSubActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                    <span className="flex-1 text-left">{subMenu.label}</span>
                                    {partnerAccountMenuExpanded ? (
                                      <ChevronUp className={`w-3 h-3 flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    ) : (
                                      <ChevronDown className={`w-3 h-3 flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    )}
                                  </button>
                                  
                                  {/* 三级菜单 */}
                                  {partnerAccountMenuExpanded && (
                                    <div className="ml-6 space-y-1">
                                      {partnerAccountSubMenus.map((thirdMenu) => {
                                        const ThirdIcon = thirdMenu.icon;
                                        const isThirdActive = currentPartnerAccountSubMenu === thirdMenu.id;
                                        return (
                                          <button
                                            key={thirdMenu.id}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleThirdMenuClick(thirdMenu.id);
                                            }}
                                            className={`flex items-center rounded-lg transition-colors w-full gap-2 px-3 py-2 text-sm ${
                                              isThirdActive
                                                ? 'bg-blue-200 text-blue-800 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                          >
                                            <ThirdIcon className={`w-4 h-4 flex-shrink-0 ${
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
                                    <SubIcon className={`w-4 h-4 flex-shrink-0 ${
                                      isSubMenuActive
                                        ? 'text-blue-700'
                                        : isSubActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                    <span className="flex-1 text-left">{subMenu.label}</span>
                                    {reconciliationMenuExpanded ? (
                                      <ChevronUp className={`w-3 h-3 flex-shrink-0 ${
                                        isSubMenuActive
                                          ? 'text-blue-700'
                                          : isSubActive
                                          ? 'text-blue-600'
                                          : 'text-gray-600'
                                      }`} />
                                    ) : (
                                      <ChevronDown className={`w-3 h-3 flex-shrink-0 ${
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
                                            <ThirdIcon className={`w-4 h-4 flex-shrink-0 ${
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
                                <SubIcon className="w-4 h-4 flex-shrink-0" />
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
                    <Icon className="w-5 h-5 flex-shrink-0" />
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
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
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
