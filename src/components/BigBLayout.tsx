// 大B客户管理系统布局
// 根据系统架构图：大B客户（SaaS/MCP模式）可以管理小B客户、设置加价率、查看订单等

import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Users, Package, TrendingUp, Wallet, Link2, Settings, BarChart3, Key, Activity, Home, CreditCard, HelpCircle, ChevronRight, Store } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { User } from '../types/user';
import type { Partner } from '../data/mockPartners';
import { hasFeaturePermission } from '../utils/featurePermissionUtils';
import type { FeatureCode } from '../data/mockFeaturePermissions';

export type BigBMenuItem = 
  | 'dashboard'          // 首页看板
  | 'orders'             // 订单佣金
  | 'withdrawal'         // 提现管理（一级菜单）
  | 'withdrawal-center'  // 提现中心（二级菜单）
  | 'bank-cards'         // 银行卡管理（二级菜单）
  | 'account-help'        // 账户说明
  | 'smallb-management'  // 小B客户管理
  | 'pricing'            // 加价策略
  | 'reports'            // 数据报表
  | 'brand-config'       // 品牌配置（SaaS模式）
  | 'links'              // 推广链接（SaaS模式）
  | 'mcp-config'         // MCP配置（MCP模式）
  | 'mcp-monitoring';    // 用量监控（MCP模式）

interface BigBLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  currentPartner: Partner | null;
  onLogout: () => void;
  currentMenu?: BigBMenuItem;
  onMenuChange?: (menu: BigBMenuItem) => void;
}

export function BigBLayout({
  children,
  currentUser,
  currentPartner,
  onLogout,
  currentMenu = 'dashboard',
  onMenuChange,
}: BigBLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isSaaS = currentPartner?.businessModel === 'saas';
  const isMCP = currentPartner?.businessModel === 'mcp';

  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  
  // 检查功能权限
  const checkPermission = (featureCode: FeatureCode): boolean => {
    return hasFeaturePermission(featureCode, currentPartner, 'bigb');
  };
  
  // 根据业务模式和功能权限显示不同的菜单
  const menuItems: Array<{
    id: BigBMenuItem;
    icon: React.ElementType;
    label: string;
    visible: boolean;
    subMenu?: Array<{ id: string; label: string }>;
  }> = [
    { id: 'dashboard', icon: Home, label: '首页看板', visible: true },
    { id: 'orders', icon: Package, label: '订单佣金', visible: checkPermission('order-management') },
    { 
      id: 'withdrawal', 
      icon: Wallet, 
      label: '提现管理', 
      visible: checkPermission('withdrawal'),
      subMenu: [
        { id: 'withdrawal-center', label: '提现中心' },
        { id: 'bank-cards', label: '银行卡管理' }
      ]
    },
    { id: 'smallb-management', icon: Users, label: '小B客户管理', visible: checkPermission('smallb-management') },
    { id: 'pricing', icon: TrendingUp, label: '加价策略', visible: checkPermission('pricing-strategy') },
    { id: 'reports', icon: BarChart3, label: '数据报表', visible: checkPermission('data-reports') },
    { id: 'brand-config', icon: Store, label: '品牌配置', visible: isSaaS && checkPermission('brand-config') },
    { id: 'links', icon: Link2, label: '推广链接', visible: isSaaS },
    { id: 'mcp-config', icon: Key, label: 'MCP配置', visible: isMCP && checkPermission('mcp-config') },
    { id: 'mcp-monitoring', icon: Activity, label: '用量监控', visible: isMCP && checkPermission('mcp-monitoring') },
    { id: 'account-help', icon: HelpCircle, label: '账户说明', visible: true },
  ].filter(item => item.visible);
  
  const toggleSubMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  // 当菜单项改变时，如果该菜单项有子菜单，自动展开
  useEffect(() => {
    const menuItem = menuItems.find(item => item.id === currentMenu);
    if (menuItem && menuItem.subMenu && menuItem.subMenu.length > 0) {
      setExpandedMenus(prev => {
        if (!prev.has(currentMenu)) {
          return new Set(prev).add(currentMenu);
        }
        return prev;
      });
    }
  }, [currentMenu, menuItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部页头 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border-2 border-orange-200 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-red-600 text-sm font-bold">AI</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AIGOHOTEL</span>
              <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700 border-orange-300">
                大B客户系统
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 通知栏 */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
            </Button>

            {/* 用户中心 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {currentUser?.name?.[0] || currentUser?.email?.[0] || 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <div className="text-sm">{currentUser?.name || currentUser?.email?.split('@')[0]}</div>
                    <div className="text-xs text-gray-500">
                      {currentPartner?.businessModel === 'saas' ? 'SaaS模式' : 'MCP模式'}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p>{currentUser?.name || '大B客户'}</p>
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
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="sticky top-16 flex flex-col h-[calc(100vh-4rem)]">
            <nav className={`space-y-1 flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentMenu === item.id || (item.subMenu && item.subMenu.some(sub => currentMenu === sub.id));
                const isExpanded = expandedMenus.has(item.id);
                const hasSubMenu = item.subMenu && item.subMenu.length > 0;
                
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={(e) => {
                        // 如果点击的是箭头图标区域，只切换展开/折叠
                        const target = e.target as HTMLElement;
                        if (target.closest('.chevron-icon')) {
                          e.stopPropagation();
                          toggleSubMenu(item.id);
                          return;
                        }
                        
                        // 如果有子菜单，点击时导航到主页面
                        if (hasSubMenu) {
                          onMenuChange?.(item.id);
                          // 如果当前不在该页面，自动展开子菜单
                          if (currentMenu !== item.id && !expandedMenus.has(item.id)) {
                            toggleSubMenu(item.id);
                          }
                        } else {
                          onMenuChange?.(item.id);
                        }
                      }}
                      className={`flex items-center rounded-lg transition-colors text-sm w-full ${
                        sidebarCollapsed
                          ? 'justify-center px-2 py-2'
                          : 'gap-3 px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-orange-50 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {hasSubMenu && (
                            <ChevronRight 
                              className={`w-4 h-4 transition-transform chevron-icon ${isExpanded ? 'rotate-90' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubMenu(item.id);
                              }}
                            />
                          )}
                        </>
                      )}
                    </button>
                    {!sidebarCollapsed && hasSubMenu && isExpanded && (
                      <div className="ml-8 space-y-1">
                        {item.subMenu!.map((subItem) => {
                          const isSubActive = currentMenu === subItem.id;
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => onMenuChange?.(subItem.id as BigBMenuItem)}
                              className={`flex items-center rounded-lg transition-colors text-sm w-full px-3 py-2 ${
                                isSubActive
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="flex-1 text-left">{subItem.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* 折叠按钮 */}
            <div className={`border-t flex-shrink-0 ${sidebarCollapsed ? 'px-2 py-2' : 'px-4 py-2'}`}>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-center'}`}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <span className="text-xs">展开</span>
                ) : (
                  <span className="text-xs">收起</span>
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

