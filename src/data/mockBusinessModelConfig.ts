// 业务模式配置数据

export type UserType = 'travel_agent' | 'influencer' | 'travel_app';
export type CertificationType = 'individual' | 'enterprise';
export type BusinessModel = 'mcp' | 'saas' | 'affiliate';
export type ConfigStatus = 'active' | 'inactive' | 'draft';

export interface BusinessModelConfig {
  configId: string;
  userType: UserType;
  certificationType: CertificationType;
  businessModel: BusinessModel;
  isEnabled: boolean;
  priority: number;
  displayName?: string;
  description?: string;
  configStatus: ConfigStatus;
  effectiveAt?: string;
  expiresAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt: string;
}

export interface BusinessModelMetadata {
  businessModel: BusinessModel;
  displayName: string;
  description?: string;
  icon?: string;
  isBigB: boolean;
  canSetMarkupRate: boolean;
  defaultCommissionRate?: number;
  metadataStatus: 'active' | 'inactive';
}

export interface UserTypeMetadata {
  userType: UserType;
  displayName: string;
  description?: string;
  icon?: string;
  metadataStatus: 'active' | 'inactive';
}

// 业务模式元数据
export const businessModelMetadata: BusinessModelMetadata[] = [
  {
    businessModel: 'mcp',
    displayName: 'MCP',
    description: 'MCP模式，可设置加价率',
    isBigB: true,
    canSetMarkupRate: true,
    metadataStatus: 'active',
  },
  {
    businessModel: 'saas',
    displayName: 'SaaS',
    description: 'SaaS模式，可设置加价率',
    isBigB: true,
    canSetMarkupRate: true,
    metadataStatus: 'active',
  },
  {
    businessModel: 'affiliate',
    displayName: '推广联盟',
    description: '推广联盟模式，分佣模式',
    isBigB: false,
    canSetMarkupRate: false,
    defaultCommissionRate: 10.0,
    metadataStatus: 'active',
  },
];

// 用户信息类型元数据
export const userTypeMetadata: UserTypeMetadata[] = [
  {
    userType: 'travel_agent',
    displayName: '旅行代理',
    description: '含旅行社、个人代理',
    metadataStatus: 'active',
  },
  {
    userType: 'influencer',
    displayName: '网络博主',
    description: '网络博主、KOL',
    metadataStatus: 'active',
  },
  {
    userType: 'travel_app',
    displayName: '旅游类相关应用',
    description: '旅游类相关应用、开发者',
    metadataStatus: 'active',
  },
];

// 获取所有配置
export function getBusinessModelConfigs(): BusinessModelConfig[] {
  // 强制清除旧配置，使用新配置
  // TODO: 在生产环境中应该使用版本号来判断是否需要更新
  localStorage.removeItem('businessModelConfigs');
  
  // 默认配置
  const defaultConfigs: BusinessModelConfig[] = [
    // 旅行代理-个人认证 - 全部三个选项可用
    {
      configId: 'config_001',
      userType: 'travel_agent',
      certificationType: 'individual',
      businessModel: 'mcp',
      isEnabled: true,
      priority: 3,
      displayName: '个人认证-MCP',
      description: '个人认证可以选择MCP模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_002',
      userType: 'travel_agent',
      certificationType: 'individual',
      businessModel: 'saas',
      isEnabled: true,
      priority: 2,
      displayName: '个人认证-联名独立站',
      description: '个人认证可以选择联名独立站模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_003',
      userType: 'travel_agent',
      certificationType: 'individual',
      businessModel: 'affiliate',
      isEnabled: true,
      priority: 1,
      displayName: '个人认证-链接分销',
      description: '个人认证可以选择链接分销模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 旅行代理-企业认证 - 全部三个选项可用
    {
      configId: 'config_004',
      userType: 'travel_agent',
      certificationType: 'enterprise',
      businessModel: 'mcp',
      isEnabled: true,
      priority: 3,
      displayName: '企业认证-MCP',
      description: '企业认证可以选择MCP模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_005',
      userType: 'travel_agent',
      certificationType: 'enterprise',
      businessModel: 'saas',
      isEnabled: true,
      priority: 2,
      displayName: '企业认证-联名独立站',
      description: '企业认证可以选择联名独立站模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_006',
      userType: 'travel_agent',
      certificationType: 'enterprise',
      businessModel: 'affiliate',
      isEnabled: true,
      priority: 1,
      displayName: '企业认证-链接分销',
      description: '企业认证可以选择链接分销模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 网络博主-个人认证
    {
      configId: 'config_004',
      userType: 'influencer',
      certificationType: 'individual',
      businessModel: 'saas',
      isEnabled: true,
      priority: 1,
      displayName: '网络博主-个人认证-SaaS',
      description: '网络博主个人认证只能选择SaaS模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 网络博主-企业认证
    {
      configId: 'config_005',
      userType: 'influencer',
      certificationType: 'enterprise',
      businessModel: 'saas',
      isEnabled: true,
      priority: 1,
      displayName: '网络博主-企业认证-SaaS',
      description: '网络博主企业认证只能选择SaaS模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 旅游类相关应用-个人认证
    {
      configId: 'config_006',
      userType: 'travel_app',
      certificationType: 'individual',
      businessModel: 'mcp',
      isEnabled: true,
      priority: 3,
      displayName: '旅游应用-个人认证-MCP',
      description: '旅游类相关应用个人认证可以选择MCP模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_007',
      userType: 'travel_app',
      certificationType: 'individual',
      businessModel: 'saas',
      isEnabled: true,
      priority: 2,
      displayName: '旅游应用-个人认证-SaaS',
      description: '旅游类相关应用个人认证可以选择SaaS模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_008',
      userType: 'travel_app',
      certificationType: 'individual',
      businessModel: 'affiliate',
      isEnabled: true,
      priority: 1,
      displayName: '旅游应用-个人认证-推广联盟',
      description: '旅游类相关应用个人认证可以选择推广联盟模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 旅游类相关应用-企业认证
    {
      configId: 'config_009',
      userType: 'travel_app',
      certificationType: 'enterprise',
      businessModel: 'mcp',
      isEnabled: true,
      priority: 3,
      displayName: '旅游应用-企业认证-MCP',
      description: '旅游类相关应用企业认证可以选择MCP模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_010',
      userType: 'travel_app',
      certificationType: 'enterprise',
      businessModel: 'saas',
      isEnabled: true,
      priority: 2,
      displayName: '旅游应用-企业认证-SaaS',
      description: '旅游类相关应用企业认证可以选择SaaS模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      configId: 'config_011',
      userType: 'travel_app',
      certificationType: 'enterprise',
      businessModel: 'affiliate',
      isEnabled: true,
      priority: 1,
      displayName: '旅游应用-企业认证-推广联盟',
      description: '旅游类相关应用企业认证可以选择推广联盟模式',
      configStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  localStorage.setItem('businessModelConfigs', JSON.stringify(defaultConfigs));
  return defaultConfigs;
}

// 保存配置
export function saveBusinessModelConfigs(configs: BusinessModelConfig[]): void {
  localStorage.setItem('businessModelConfigs', JSON.stringify(configs));
}

// 获取可用的业务模式
export function getAvailableBusinessModels(
  userType: UserType,
  certificationType: CertificationType
): BusinessModel[] {
  const configs = getBusinessModelConfigs();
  const now = new Date();
  
  return configs
    .filter(config => {
      // 匹配用户类型和认证方式
      if (config.userType !== userType || config.certificationType !== certificationType) {
        return false;
      }
      
      // 检查是否启用
      if (!config.isEnabled) {
        return false;
      }
      
      // 检查状态
      if (config.configStatus !== 'active') {
        return false;
      }
      
      // 检查生效时间
      if (config.effectiveAt) {
        const effectiveDate = new Date(config.effectiveAt);
        if (now < effectiveDate) {
          return false;
        }
      }
      
      // 检查失效时间
      if (config.expiresAt) {
        const expiresDate = new Date(config.expiresAt);
        if (now > expiresDate) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => b.priority - a.priority) // 按优先级降序排序
    .map(config => config.businessModel);
}

// 获取业务模式选项（包含元数据）
export function getBusinessModelOptions(
  userType: UserType,
  certificationType: CertificationType
): Array<BusinessModelMetadata & { priority: number }> {
  const availableModels = getAvailableBusinessModels(userType, certificationType);
  const configs = getBusinessModelConfigs();
  
  return availableModels
    .map(businessModel => {
      const metadata = businessModelMetadata.find(m => m.businessModel === businessModel);
      const config = configs.find(
        c => c.userType === userType && 
        c.certificationType === certificationType && 
        c.businessModel === businessModel
      );
      
      if (!metadata) {
        return null;
      }
      
      return {
        ...metadata,
        priority: config?.priority || 0,
      };
    })
    .filter((item): item is BusinessModelMetadata & { priority: number } => item !== null)
    .sort((a, b) => b.priority - a.priority);
}

