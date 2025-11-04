import { 
  FileText, 
  Settings, 
  TrendingUp, 
  BookOpen, 
  DollarSign, 
  ShoppingCart, 
  Wallet,
  Link2,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Store,
  type LucideIcon
} from 'lucide-react';
import type { ServiceType, ServiceStatus } from '../types/user';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  serviceType: ServiceType | 'common';
  requiredStatus: ServiceStatus | 'any';
  description?: string;
}

export const MENU_CONFIG: MenuItem[] = [
  // 通用菜单 - 新用户或未审核通过
  {
    id: 'registration',
    label: '注册服务',
    icon: FileText,
    serviceType: 'common',
    requiredStatus: 'any',
    description: '申请开通服务',
  },
  
  // ========== MCP服务菜单 ==========
  {
    id: 'mcp-config',
    label: 'MCP配置',
    icon: Settings,
    serviceType: 'mcp',
    requiredStatus: 'approved',
    description: 'API密钥与集成协议',
  },
  {
    id: 'mcp-monitoring',
    label: '用量监控',
    icon: TrendingUp,
    serviceType: 'mcp',
    requiredStatus: 'approved',
    description: '数据监控与用量统计',
  },
  {
    id: 'mcp-docs',
    label: '文档与支持',
    icon: BookOpen,
    serviceType: 'mcp',
    requiredStatus: 'approved',
    description: '技术文档和服务信息',
  },
  
  // ========== SaaS服务菜单 ==========
  {
    id: 'saas-dashboard',
    label: '业务概览',
    icon: LayoutDashboard,
    serviceType: 'saas',
    requiredStatus: 'approved',
    description: '仪表盘与快捷入口',
  },
  {
    id: 'saas-brand',
    label: '品牌配置',
    icon: Store,
    serviceType: 'saas',
    requiredStatus: 'approved',
    description: '店铺个性化设置',
  },
  {
    id: 'saas-pricing',
    label: '加价策略',
    icon: DollarSign,
    serviceType: 'saas',
    requiredStatus: 'approved',
    description: '管理价格规则',
  },
  {
    id: 'saas-orders',
    label: '订单管理',
    icon: ShoppingCart,
    serviceType: 'saas',
    requiredStatus: 'approved',
    description: '查看和管理订单',
  },
  {
    id: 'saas-wallet',
    label: '财务中心',
    icon: Wallet,
    serviceType: 'saas',
    requiredStatus: 'approved',
    description: '利润账户与明细',
  },
  
  // ========== 推广联盟菜单 ==========
  {
    id: 'affiliate-dashboard',
    label: '业务概览',
    icon: LayoutDashboard,
    serviceType: 'affiliate',
    requiredStatus: 'approved',
    description: '仪表盘与快捷入口',
  },
  {
    id: 'affiliate-link',
    label: '推广物料',
    icon: Link2,
    serviceType: 'affiliate',
    requiredStatus: 'approved',
    description: '推广链接与工具',
  },
  {
    id: 'affiliate-data',
    label: '效果报表',
    icon: BarChart3,
    serviceType: 'affiliate',
    requiredStatus: 'approved',
    description: '数据报表与订单明细',
  },
  {
    id: 'affiliate-points',
    label: '积分中心',
    icon: CreditCard,
    serviceType: 'affiliate',
    requiredStatus: 'approved',
    description: '积分账户与兑换',
  },
];

/**
 * 获取用户可见的菜单项
 */
export function getVisibleMenus(
  serviceType: ServiceType,
  serviceStatus: ServiceStatus
): MenuItem[] {
  return MENU_CONFIG.filter(menu => {
    // 通用菜单：没有服务或审核未通过时显示
    if (menu.serviceType === 'common') {
      return !serviceType || serviceStatus !== 'approved';
    }
    
    // 特定服务菜单：服务类型匹配且状态为已审核通过
    return menu.serviceType === serviceType && serviceStatus === 'approved';
  });
}

/**
 * 获取默认菜单ID
 */
export function getDefaultMenuId(
  serviceType: ServiceType,
  serviceStatus: ServiceStatus
): string {
  const visibleMenus = getVisibleMenus(serviceType, serviceStatus);
  return visibleMenus.length > 0 ? visibleMenus[0].id : 'registration';
}
