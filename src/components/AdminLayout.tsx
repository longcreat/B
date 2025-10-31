import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, LogOut, FileCheck, Users, ChevronLeft, ChevronRight, Receipt, Settings, Package, Key } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

type AdminMenuItem = 'review' | 'users' | 'orders' | 'finance' | 'apikeys' | 'pricing';

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
  pendingReviewCount?: number;
}

export function AdminLayout({
  children,
  currentUser,
  onLogout,
  currentMenu = 'review',
  onMenuChange,
  pendingReviewCount = 0,
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3); // 示例：3个未读通知

  const menuItems = [
    { id: 'review' as AdminMenuItem, icon: FileCheck, label: '资格审核', count: pendingReviewCount },
    { id: 'users' as AdminMenuItem, icon: Users, label: '用户管理', count: 0 },
    { id: 'orders' as AdminMenuItem, icon: Package, label: '订单管理', count: 0 },
    { id: 'finance' as AdminMenuItem, icon: Receipt, label: '结算中心', count: 0 },
    { id: 'apikeys' as AdminMenuItem, icon: Key, label: 'API密钥管理', count: 0 },
    { id: 'pricing' as AdminMenuItem, icon: Settings, label: '价格配置', count: 0 },
  ];

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
          className={`bg-white border-r transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="sticky top-16">
            {/* 侧边栏内容 */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onMenuChange?.(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
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

            {/* 折叠按钮 */}
            <div className="px-4 py-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
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
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
