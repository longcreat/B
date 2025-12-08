// 小B用户/合作伙伴相关的 mock 数据

export type PartnerType = 'individual' | 'influencer' | 'enterprise';
export type AccountStatus = 'active' | 'frozen' | 'closed';
export type SettlementStatus = 'normal' | 'on-hold';
export type PermissionLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
export type BusinessModel = 'mcp' | 'saas' | 'affiliate';
export type ManagedBy = 'admin' | 'bigb';

export interface Partner {
  id: string;
  type: PartnerType;
  
  // 基本信息
  displayName: string; // 显示名称（个人姓名、博主昵称、企业名称）
  email: string;
  phone: string;
  
  // 业务模式属性（根据系统架构图新增）
  businessModel: BusinessModel; // 业务模式：mcp / saas / affiliate
  canSetMarkupRate: boolean; // 是否允许自己设置加价率（SaaS/MCP为true，推广联盟为false）
  defaultCommissionRate?: number; // 默认佣金比例（百分比，推广联盟用户使用，由大B或管理员设置）
  
  // 小B客户挂载关系（根据系统架构图新增）
  parentPartnerId?: string | null; // 上级大B客户ID，NULL表示直接由管理员管理，非NULL表示挂载在大B客户下
  managedBy: ManagedBy; // 管理方：admin=管理员直接管理，bigb=大B客户管理
  
  // 小B客户申请状态（挂载在大B下时，根据系统架构图新增）
  smallbApplicationStatus?: 'pending' | 'approved' | 'rejected' | null; // 小B申请状态，仅当parent_partner_id不为NULL时有效
  smallbReviewedAt?: string | null; // 小B审核时间
  smallbReviewedBy?: string | null; // 小B审核人（大B客户ID）
  smallbRejectionReason?: string | null; // 小B驳回原因
  
  // 小B客户状态管理（根据系统架构图新增）
  smallbStatus?: 'active' | 'suspended' | null; // 小B客户状态：active=启用，suspended=停用，仅当parent_partner_id不为NULL时有效
  smallbSuspendedAt?: string | null; // 小B停用时间
  smallbSuspendedBy?: string | null; // 小B停用操作人（大B客户ID）
  
  // 认证信息
  certificationStatus: 'pending' | 'approved' | 'rejected';
  certificationType?: 'individual' | 'enterprise'; // 认证方式：个人认证/企业认证
  certifiedAt?: string;
  
  // 账户状态
  accountStatus: AccountStatus;
  settlementStatus: SettlementStatus;
  
  // 权限等级
  permissionLevel: PermissionLevel;
  
  // 财务数据
  financialData: {
    totalRevenue: number; // 总交易额（P2）
    totalProfit: number; // 累计利润
    availableBalance: number; // 可用余额
    pendingSettlement: number; // 待结算
    withdrawnAmount: number; // 已提取
  };
  
  // 业务数据
  businessData: {
    totalOrders: number; // 订单总数
    completedOrders: number; // 已完成订单
    avgMarkupRate: number; // 平均加价率
    activeCustomers: number; // 活跃客户数
  };
  
  // 类型特有信息
  specificInfo: {
    // 个人
    realName?: string;
    idNumber?: string;
    
    // 博主
    platformName?: string;
    followersCount?: number;
    influenceScore?: number;
    
    // 企业
    companyName?: string;
    socialCreditCode?: string;
    legalRepresentative?: string;
    registeredCapital?: string;
  };
  
  // 店铺信息
  storeConfig?: {
    storeName: string;
    customDomain?: string;
    status: 'active' | 'inactive';
  };
  
  registeredAt: string;
  lastLoginAt?: string;
}

/**
 * 获取模拟小B用户数据
 */
export function getMockPartners(): Partner[] {
  return [
    {
      id: 'P001',
      type: 'individual',
      displayName: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      businessModel: 'affiliate', // 推广联盟模式（小B）
      canSetMarkupRate: false,
      defaultCommissionRate: 10.0,
      parentPartnerId: 'P002', // 挂载在大B客户P002下
      managedBy: 'bigb',
      smallbApplicationStatus: 'approved',
      smallbReviewedAt: '2025-10-20 15:30:00',
      smallbReviewedBy: 'P002',
      smallbStatus: 'active',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-20 15:30:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L3',
      financialData: {
        totalRevenue: 156800,
        totalProfit: 15680,
        availableBalance: 2580.50,
        pendingSettlement: 856.20,
        withdrawnAmount: 12243.30,
      },
      businessData: {
        totalOrders: 156,
        completedOrders: 142,
        avgMarkupRate: 10,
        activeCustomers: 48,
      },
      specificInfo: {
        realName: '张三',
        idNumber: '110101199001011234',
      },
      storeConfig: {
        storeName: '张三的旅游工作室',
        customDomain: 'zhangsan.aigohotel.com',
        status: 'active',
      },
      registeredAt: '2025-10-18 10:30:00',
      lastLoginAt: '2025-10-31 09:15:00',
    },
    {
      id: 'P002',
      type: 'influencer',
      displayName: '旅游达人小李',
      email: 'xiaoli@example.com',
      phone: '13900139000',
      businessModel: 'saas', // SaaS模式（大B）
      canSetMarkupRate: true,
      parentPartnerId: null, // 直接由管理员管理
      managedBy: 'admin',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-22 11:20:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L1',
      financialData: {
        totalRevenue: 568900,
        totalProfit: 56890,
        availableBalance: 8560.80,
        pendingSettlement: 2340.50,
        withdrawnAmount: 45989.50,
      },
      businessData: {
        totalOrders: 423,
        completedOrders: 398,
        avgMarkupRate: 12,
        activeCustomers: 256,
      },
      specificInfo: {
        realName: '李四',
        idNumber: '110101199201021234',
        platformName: '抖音、小红书',
        followersCount: 158000,
        influenceScore: 85,
      },
      storeConfig: {
        storeName: '小李的环球旅行',
        customDomain: 'xiaoli.aigohotel.com',
        status: 'active',
      },
      registeredAt: '2025-10-20 14:20:00',
      lastLoginAt: '2025-10-31 08:45:00',
    },
    {
      id: 'P003',
      type: 'enterprise',
      displayName: '某某商旅服务有限公司',
      email: 'business@example.com',
      phone: '010-12345678',
      businessModel: 'mcp', // MCP模式（大B）
      canSetMarkupRate: true,
      parentPartnerId: null, // 直接由管理员管理
      managedBy: 'admin',
      certificationStatus: 'approved',
      certificationType: 'enterprise',
      certifiedAt: '2025-10-25 16:00:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L0',
      financialData: {
        totalRevenue: 1256800,
        totalProfit: 125680,
        availableBalance: 15680.50,
        pendingSettlement: 5670.20,
        withdrawnAmount: 104329.30,
      },
      businessData: {
        totalOrders: 856,
        completedOrders: 798,
        avgMarkupRate: 15,
        activeCustomers: 128,
      },
      specificInfo: {
        companyName: '某某商旅服务有限公司',
        socialCreditCode: '91110000MA01ABCD1E',
        legalRepresentative: '王五',
        registeredCapital: '500万元',
      },
      storeConfig: {
        storeName: '某某商旅预订中心',
        status: 'active',
      },
      registeredAt: '2025-10-23 09:00:00',
      lastLoginAt: '2025-10-31 10:30:00',
    },
    {
      id: 'P004',
      type: 'individual',
      displayName: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13700137000',
      businessModel: 'affiliate', // 推广联盟模式（小B）
      canSetMarkupRate: false,
      defaultCommissionRate: 8.0,
      parentPartnerId: 'P003', // 挂载在大B客户P003下
      managedBy: 'bigb',
      smallbApplicationStatus: 'approved',
      smallbReviewedAt: '2025-10-26 10:15:00',
      smallbReviewedBy: 'P003',
      smallbStatus: 'suspended', // 已停用
      smallbSuspendedAt: '2025-10-28 15:20:00',
      smallbSuspendedBy: 'P003',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-26 10:15:00',
      accountStatus: 'frozen',
      settlementStatus: 'on-hold',
      permissionLevel: 'L0',
      financialData: {
        totalRevenue: 45600,
        totalProfit: 4560,
        availableBalance: 1200.00,
        pendingSettlement: 0,
        withdrawnAmount: 3360.00,
      },
      businessData: {
        totalOrders: 45,
        completedOrders: 42,
        avgMarkupRate: 8,
        activeCustomers: 15,
      },
      specificInfo: {
        realName: '赵六',
        idNumber: '110101199501011234',
      },
      registeredAt: '2025-10-24 11:30:00',
      lastLoginAt: '2025-10-28 15:20:00',
    },
    // 测试账号 - MCP已通过用户（大B）
    {
      id: 'P-TEST-MCP',
      type: 'influencer',
      displayName: 'MCP测试用户',
      email: 'mcp@test.com',
      phone: '13800138012',
      businessModel: 'mcp',
      canSetMarkupRate: true,
      parentPartnerId: null,
      managedBy: 'admin',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-20 10:00:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L1',
      financialData: {
        totalRevenue: 100000,
        totalProfit: 10000,
        availableBalance: 5000,
        pendingSettlement: 1000,
        withdrawnAmount: 4000,
      },
      businessData: {
        totalOrders: 50,
        completedOrders: 45,
        avgMarkupRate: 10,
        activeCustomers: 30,
      },
      specificInfo: {
        realName: '李四',
        idNumber: '110101199001011235',
      },
      registeredAt: '2025-10-15 10:00:00',
      lastLoginAt: '2025-11-01 09:00:00',
    },
    // 测试账号 - SaaS已通过用户（大B）
    {
      id: 'P-TEST-SAAS',
      type: 'individual',
      displayName: 'SaaS测试用户',
      email: 'saas@test.com',
      phone: '13800138014',
      businessModel: 'saas',
      canSetMarkupRate: true,
      parentPartnerId: null,
      managedBy: 'admin',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-20 10:00:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L1',
      financialData: {
        totalRevenue: 200000,
        totalProfit: 20000,
        availableBalance: 8000,
        pendingSettlement: 2000,
        withdrawnAmount: 10000,
      },
      businessData: {
        totalOrders: 80,
        completedOrders: 75,
        avgMarkupRate: 12,
        activeCustomers: 50,
      },
      specificInfo: {
        realName: '赵六',
        idNumber: '110101199001011236',
      },
      registeredAt: '2025-10-16 10:00:00',
      lastLoginAt: '2025-11-01 10:00:00',
    },
    // 测试账号 - 推广联盟已通过用户（小B）
    {
      id: 'P-TEST-AFFILIATE',
      type: 'influencer',
      displayName: '推广联盟测试用户',
      email: 'affiliate@test.com',
      phone: '13800138015',
      businessModel: 'affiliate',
      canSetMarkupRate: false,
      defaultCommissionRate: 10.0,
      parentPartnerId: 'P-TEST-SAAS', // 挂载在SaaS大B下
      managedBy: 'bigb',
      smallbApplicationStatus: 'approved',
      smallbReviewedAt: '2025-10-21 10:00:00',
      smallbReviewedBy: 'P-TEST-SAAS',
      smallbStatus: 'active',
      certificationStatus: 'approved',
      certificationType: 'individual',
      certifiedAt: '2025-10-21 10:00:00',
      accountStatus: 'active',
      settlementStatus: 'normal',
      permissionLevel: 'L2',
      financialData: {
        totalRevenue: 50000,
        totalProfit: 5000,
        availableBalance: 2000,
        pendingSettlement: 500,
        withdrawnAmount: 2500,
      },
      businessData: {
        totalOrders: 30,
        completedOrders: 28,
        avgMarkupRate: 8,
        activeCustomers: 20,
      },
      specificInfo: {
        realName: '孙七',
        idNumber: '110101199001011237',
      },
      registeredAt: '2025-10-17 10:00:00',
      lastLoginAt: '2025-11-01 11:00:00',
    },
  ];
}

