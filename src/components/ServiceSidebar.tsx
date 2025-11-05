import { getVisibleMenus } from '../config/menuConfig';
import type { ServiceType, ServiceStatus } from '../types/user';
import React from 'react';
interface ServiceSidebarProps {
  currentView: string;
  serviceType: ServiceType;
  serviceStatus: ServiceStatus;
  onNavigate: (view: string) => void;
}

export function ServiceSidebar({ 
  currentView,
  serviceType,
  serviceStatus,
  onNavigate,
}: ServiceSidebarProps) {
  // 获取当前用户可见的菜单项
  const visibleMenus = getVisibleMenus(serviceType, serviceStatus);

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleMenus.map((menu) => {
          const Icon = menu.icon;
          const isActive = currentView === menu.id;

          return (
            <button
              key={menu.id}
              onClick={() => onNavigate(menu.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={menu.description}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="font-medium">{menu.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 服务状态提示 */}
      {serviceType && serviceStatus === 'approved' && (
        <div className="p-4 border-t">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-900 mb-1">
              {serviceType === 'mcp' && 'MCP服务已开通'}
              {serviceType === 'saas' && 'SaaS服务已开通'}
              {serviceType === 'affiliate' && '推广联盟已开通'}
            </p>
            <p className="text-xs text-green-700">
              您可以使用左侧菜单访问各项功能
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
