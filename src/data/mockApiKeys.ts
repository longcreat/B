// API密钥相关的 mock 数据

export type ApiKeyStatus = 'active' | 'suspended' | 'revoked';
export type PartnerType = 'individual' | 'influencer' | 'enterprise';

export interface ApiKeyInfo {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: PartnerType;
  
  keyName: string;
  keyPrefix: string; // 只显示前缀
  
  status: ApiKeyStatus;
  riskLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  
  // 使用统计
  totalCalls: number;
  callsToday: number;
  callsThisMonth: number;
  successRate: number; // 百分比
  avgResponseTime: number; // 毫秒
  lastUsed: string;
  
  createdAt: string;
  suspendedAt?: string;
  suspendReason?: string;
}

/**
 * 获取模拟API密钥数据
 */
export function getMockApiKeys(): ApiKeyInfo[] {
  return [
    {
      id: 'key-001',
      userId: 'user-001',
      userName: '张三的旅游工作室',
      userEmail: 'zhangsan@example.com',
      userType: 'individual',
      keyName: 'MCP生产环境',
      keyPrefix: 'sk_live_4f3a2b1c',
      status: 'active',
      riskLevel: 'L2',
      totalCalls: 45680,
      callsToday: 1250,
      callsThisMonth: 45680,
      successRate: 99.2,
      avgResponseTime: 145,
      lastUsed: '2025-10-31 14:32',
      createdAt: '2025-10-15 10:30',
    },
    {
      id: 'key-002',
      userId: 'user-002',
      userName: '李四商旅服务',
      userEmail: 'lisi@example.com',
      userType: 'enterprise',
      keyName: 'MCP酒店查询',
      keyPrefix: 'sk_live_7d8e9f0a',
      status: 'active',
      riskLevel: 'L1',
      totalCalls: 128450,
      callsToday: 3580,
      callsThisMonth: 128450,
      successRate: 99.8,
      avgResponseTime: 132,
      lastUsed: '2025-10-31 15:45',
      createdAt: '2025-09-20 09:15',
    },
    {
      id: 'key-003',
      userId: 'user-003',
      userName: '旅游达人小李',
      userEmail: 'xiaoli@example.com',
      userType: 'influencer',
      keyName: 'MCP测试环境',
      keyPrefix: 'sk_test_1b2c3d4e',
      status: 'suspended',
      riskLevel: 'L3',
      totalCalls: 8920,
      callsToday: 0,
      callsThisMonth: 8920,
      successRate: 95.5,
      avgResponseTime: 198,
      lastUsed: '2025-10-28 10:20',
      createdAt: '2025-10-01 14:20',
      suspendedAt: '2025-10-29 16:30',
      suspendReason: '检测到异常调用模式，暂时停用进行审查',
    },
    {
      id: 'key-004',
      userId: 'user-004',
      userName: '王五企业集团',
      userEmail: 'wangwu@example.com',
      userType: 'enterprise',
      keyName: 'MCP主密钥',
      keyPrefix: 'sk_live_5f6a7b8c',
      status: 'active',
      riskLevel: 'L0',
      totalCalls: 256890,
      callsToday: 8520,
      callsThisMonth: 256890,
      successRate: 99.9,
      avgResponseTime: 118,
      lastUsed: '2025-10-31 15:50',
      createdAt: '2025-08-10 11:00',
    },
    {
      id: 'key-005',
      userId: 'user-005',
      userName: '赵六数字营销',
      userEmail: 'zhaoliu@example.com',
      userType: 'enterprise',
      keyName: 'MCP开发测试',
      keyPrefix: 'sk_test_9e0f1a2b',
      status: 'revoked',
      riskLevel: 'L2',
      totalCalls: 3450,
      callsToday: 0,
      callsThisMonth: 3450,
      successRate: 98.2,
      avgResponseTime: 167,
      lastUsed: '2025-10-25 09:15',
      createdAt: '2025-10-18 16:45',
    },
  ];
}

