// 用户类型定义

export type ServiceType = 'mcp' | 'saas' | 'affiliate' | null;
export type ServiceStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  company?: string;
  registeredAt?: string;
  
  // 服务相关字段
  serviceType?: ServiceType;
  serviceStatus?: ServiceStatus;
  applicationId?: string;
}

export interface UserSession extends User {
  // 可以添加会话相关的额外字段
}
