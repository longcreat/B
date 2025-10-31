import { useState } from 'react';
import { Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface UserLayoutProps {
  children: React.ReactNode;
  currentUser: { email?: string; phone?: string; role?: string; name?: string } | null;
  onLogout: () => void;
  applicationStatus?: 'pending' | 'approved' | 'rejected' | null;
  sidebarContent?: React.ReactNode;
  onNavigateToUserCenter?: () => void;
}

export function UserLayout({ 
  children, 
  currentUser, 
  onLogout,
  applicationStatus,
  sidebarContent,
  onNavigateToUserCenter,
}: UserLayoutProps) {
  const [unreadNotifications] = useState(2);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'info',
      title: '系统通知',
      message: '欢迎使用AIGOHOTEL资质认证系统',
      time: '刚刚',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: '功能更新',
      message: '新增了更多认证选项，快去体验吧！',
      time: '2小时前',
      read: false,
    },
  ];

  const getUserInitial = () => {
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getStatusBadge = () => {
    if (!applicationStatus) return null;

    const statusConfig = {
      pending: { text: '待审核', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      approved: { text: '已通过', class: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { text: '已驳回', class: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[applicationStatus];
    return (
      <Badge variant="outline" className={`${config.class} border text-xs px-2.5 py-0.5`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AIGOHOTEL</h1>
                <p className="text-xs text-gray-500">资质认证管理系统</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              {getStatusBadge()}

              {/* Notifications */}
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">通知</h3>
                      {unreadNotifications > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {unreadNotifications} 条未读
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            !notification.read 
                              ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" className="w-full text-xs">
                      查看全部通知
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Menu */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 pl-2 pr-3 hover:bg-gray-100"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('User menu button clicked');
                    }}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium leading-none mb-1">
                        {currentUser?.name || currentUser?.email?.split('@')[0] || '用户'}
                      </span>
                      <span className="text-xs text-gray-500 leading-none">
                        {currentUser?.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">我的账号</p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser?.email || currentUser?.phone}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateToUserCenter?.();
                    }}
                    className="cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-2" />
                    用户中心
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                    }} 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        {sidebarContent && (
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            {sidebarContent}
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
