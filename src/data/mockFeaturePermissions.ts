// 功能权限配置 - Mock数据

export type FeatureCode = 
  | 'brand-config'           // 品牌配置
  | 'pricing-strategy'       // 加价策略
  | 'smallb-management'      // 小B客户管理
  | 'mcp-config'            // MCP配置
  | 'mcp-monitoring'        // 用量监控
  | 'affiliate-link'        // 推广链接
  | 'data-reports'          // 数据报表
  | 'withdrawal'            // 提现管理
  | 'order-management';     // 订单管理

export type PermissionRule = 
  | 'all'                    // 所有人
  | 'bigb-only'             // 仅大B
  | 'smallb-only'           // 仅小B
  | 'saas-only'             // 仅SaaS业务
  | 'mcp-only'              // 仅MCP业务
  | 'affiliate-only'        // 仅分销业务
  | 'whitelist';            // 白名单用户

export interface FeaturePermission {
  code: FeatureCode;
  name: string;
  description: string;
  category: 'business' | 'system' | 'finance';
  enabled: boolean;                    // 功能总开关
  rule: PermissionRule;                // 权限规则
  whitelistPartnerIds?: string[];      // 白名单Partner ID列表
  blacklistPartnerIds?: string[];      // 黑名单Partner ID列表
  requiredBusinessModels?: ('saas' | 'mcp' | 'affiliate')[]; // 要求的业务模式
  requiredUserTypes?: ('bigb' | 'smallb')[]; // 要求的用户类型
  betaTest?: boolean;                  // 是否为Beta测试功能
  launchDate?: string;                 // 功能上线日期
  updatedAt: string;                   // 最后更新时间
  updatedBy: string;                   // 更新人
}

// Mock功能权限配置数据
export const mockFeaturePermissions: FeaturePermission[] = [
  {
    code: 'brand-config',
    name: '品牌配置',
    description: 'SaaS业务的品牌定制化配置功能',
    category: 'business',
    enabled: true,
    rule: 'whitelist',
    whitelistPartnerIds: ['P001', 'P002'], // 只有这些Partner可以使用
    requiredBusinessModels: ['saas'],
    requiredUserTypes: ['bigb'],
    betaTest: true,
    launchDate: '2025-01-15',
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'pricing-strategy',
    name: '加价策略',
    description: '配置酒店价格加价规则',
    category: 'business',
    enabled: true,
    rule: 'bigb-only',
    requiredUserTypes: ['bigb'],
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'smallb-management',
    name: '小B客户管理',
    description: '管理小B客户、设置佣金、审核申请',
    category: 'business',
    enabled: true,
    rule: 'bigb-only',
    requiredUserTypes: ['bigb'],
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'mcp-config',
    name: 'MCP配置',
    description: 'MCP服务配置和API密钥管理',
    category: 'system',
    enabled: true,
    rule: 'mcp-only',
    requiredBusinessModels: ['mcp'],
    requiredUserTypes: ['bigb'],
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'mcp-monitoring',
    name: '用量监控',
    description: '监控MCP服务的调用量和并发',
    category: 'system',
    enabled: true,
    rule: 'mcp-only',
    requiredBusinessModels: ['mcp'],
    requiredUserTypes: ['bigb'],
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'affiliate-link',
    name: '推广链接',
    description: '生成和管理推广链接',
    category: 'business',
    enabled: true,
    rule: 'affiliate-only',
    requiredBusinessModels: ['affiliate'],
    requiredUserTypes: ['smallb'],
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'data-reports',
    name: '数据报表',
    description: '查看业务数据和报表分析',
    category: 'business',
    enabled: true,
    rule: 'all',
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'withdrawal',
    name: '提现管理',
    description: '提现申请和银行卡管理',
    category: 'finance',
    enabled: true,
    rule: 'all',
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
  {
    code: 'order-management',
    name: '订单管理',
    description: '查看和管理订单',
    category: 'business',
    enabled: true,
    rule: 'all',
    updatedAt: '2025-11-06',
    updatedBy: 'admin',
  },
];

// 获取所有功能权限配置
export function getMockFeaturePermissions(): FeaturePermission[] {
  return [...mockFeaturePermissions];
}

// 根据功能代码获取权限配置
export function getFeaturePermission(code: FeatureCode): FeaturePermission | undefined {
  return mockFeaturePermissions.find(fp => fp.code === code);
}

// 更新功能权限配置
export function updateFeaturePermission(code: FeatureCode, updates: Partial<FeaturePermission>): boolean {
  const index = mockFeaturePermissions.findIndex(fp => fp.code === code);
  if (index !== -1) {
    mockFeaturePermissions[index] = {
      ...mockFeaturePermissions[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return true;
  }
  return false;
}

