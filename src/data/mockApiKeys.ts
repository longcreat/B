// API密钥相关的 mock 数据

export type ApiKeyStatus = 'active' | 'suspended' | 'revoked';
export type PartnerType = 'individual' | 'influencer' | 'enterprise';

export interface ApiKeyInfo {
  id: string;
  userId: string;
  userType: PartnerType;
  
  // 基本信息
  userName: string; // 显示名称
  userEmail: string;
  userPhone: string;
  
  // 详细用户信息（根据用户类型不同）
  // 个人用户字段
  realName?: string;
  idNumber?: string;
  
  // 博主用户字段
  platformName?: string;
  followersCount?: number;
  influenceScore?: number;
  
  // 企业用户字段
  companyName?: string;
  creditCode?: string;
  legalRepName?: string;
  legalRepIdNumber?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // 结算账户信息
  accountType?: 'bank' | 'alipay';
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  alipayAccount?: string;
  alipayRealName?: string;
  
  // 密钥信息
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
      userType: 'individual',
      userName: '张三的旅游工作室',
      userEmail: 'zhangsan@example.com',
      userPhone: '13800138000',
      realName: '张三',
      idNumber: '110101199001011234',
      accountType: 'bank',
      bankName: '中国工商银行',
      bankBranch: '北京朝阳支行',
      accountNumber: '6222021234567890123',
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
      userType: 'enterprise',
      userName: '李四商旅服务',
      userEmail: 'lisi@example.com',
      userPhone: '13900139000',
      companyName: '北京李四商旅服务有限公司',
      creditCode: '91110000123456789X',
      legalRepName: '李四',
      legalRepIdNumber: '110101198001011234',
      contactName: '李四',
      contactPhone: '13900139000',
      contactEmail: 'lisi@example.com',
      accountType: 'bank',
      bankName: '中国建设银行',
      bankBranch: '北京海淀支行',
      accountNumber: '6227001234567890123',
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
      userType: 'influencer',
      userName: '旅游达人小李',
      userEmail: 'xiaoli@example.com',
      userPhone: '13700137000',
      realName: '李小明',
      idNumber: '110101199201021234',
      platformName: '抖音、小红书',
      followersCount: 158000,
      influenceScore: 85,
      accountType: 'alipay',
      alipayAccount: 'xiaoli@alipay.com',
      alipayRealName: '李小明',
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
      userType: 'enterprise',
      userName: '王五企业集团',
      userEmail: 'wangwu@example.com',
      userPhone: '13600136000',
      companyName: '上海王五企业集团有限公司',
      creditCode: '91310000987654321A',
      legalRepName: '王五',
      legalRepIdNumber: '310101197501011234',
      contactName: '王五',
      contactPhone: '13600136000',
      contactEmail: 'wangwu@example.com',
      accountType: 'bank',
      bankName: '招商银行',
      bankBranch: '上海浦东支行',
      accountNumber: '6225881234567890123',
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
      userType: 'enterprise',
      userName: '赵六数字营销',
      userEmail: 'zhaoliu@example.com',
      userPhone: '13500135000',
      companyName: '深圳赵六数字营销有限公司',
      creditCode: '91440300111222333B',
      legalRepName: '赵六',
      legalRepIdNumber: '440301198501011234',
      contactName: '赵六',
      contactPhone: '13500135000',
      contactEmail: 'zhaoliu@example.com',
      accountType: 'bank',
      bankName: '平安银行',
      bankBranch: '深圳南山支行',
      accountNumber: '6221551234567890123',
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
    {
      id: 'key-006',
      userId: 'user-006',
      userType: 'individual',
      userName: '孙七的酒店预订',
      userEmail: 'sunqi@example.com',
      userPhone: '13400134000',
      realName: '孙七',
      idNumber: '110101199501011234',
      accountType: 'alipay',
      alipayAccount: 'sunqi@alipay.com',
      alipayRealName: '孙七',
      keyName: 'MCP测试密钥',
      keyPrefix: 'sk_test_2c3d4e5f',
      status: 'active',
      riskLevel: 'L4',
      totalCalls: 1230,
      callsToday: 45,
      callsThisMonth: 1230,
      successRate: 97.8,
      avgResponseTime: 178,
      lastUsed: '2025-10-31 10:15',
      createdAt: '2025-10-25 14:20',
    },
    {
      id: 'key-007',
      userId: 'user-007',
      userType: 'influencer',
      userName: '周八旅行分享',
      userEmail: 'zhouba@example.com',
      userPhone: '13300133000',
      realName: '周八',
      idNumber: '110101199301021234',
      platformName: '微博、B站',
      followersCount: 85000,
      influenceScore: 72,
      accountType: 'bank',
      bankName: '中国银行',
      bankBranch: '北京西城支行',
      accountNumber: '6216611234567890123',
      keyName: 'MCP内容查询',
      keyPrefix: 'sk_live_3d4e5f6a',
      status: 'active',
      riskLevel: 'L2',
      totalCalls: 23450,
      callsToday: 680,
      callsThisMonth: 23450,
      successRate: 98.9,
      avgResponseTime: 156,
      lastUsed: '2025-10-31 13:20',
      createdAt: '2025-10-10 09:30',
    },
    {
      id: 'key-008',
      userId: 'user-008',
      userType: 'individual',
      userName: '吴九的旅游服务',
      userEmail: 'wujiu@example.com',
      userPhone: '13200132000',
      realName: '吴九',
      idNumber: '110101199701011234',
      accountType: 'bank',
      bankName: '中国农业银行',
      bankBranch: '北京东城支行',
      accountNumber: '6228481234567890123',
      keyName: 'MCP生产密钥',
      keyPrefix: 'sk_live_6a7b8c9d',
      status: 'active',
      riskLevel: 'L3',
      totalCalls: 5670,
      callsToday: 180,
      callsThisMonth: 5670,
      successRate: 96.5,
      avgResponseTime: 189,
      lastUsed: '2025-10-31 11:45',
      createdAt: '2025-10-20 16:10',
    },
    {
      id: 'key-009',
      userId: 'user-009',
      userType: 'enterprise',
      userName: '郑十国际旅行社',
      userEmail: 'zhengshi@example.com',
      userPhone: '13100131000',
      companyName: '广州郑十国际旅行社有限公司',
      creditCode: '91440100122334455C',
      legalRepName: '郑十',
      legalRepIdNumber: '440301199001011234',
      contactName: '郑十',
      contactPhone: '13100131000',
      contactEmail: 'zhengshi@example.com',
      accountType: 'bank',
      bankName: '广发银行',
      bankBranch: '广州天河支行',
      accountNumber: '6225561234567890123',
      keyName: 'MCP企业密钥',
      keyPrefix: 'sk_live_7b8c9d0e',
      status: 'active',
      riskLevel: 'L1',
      totalCalls: 89230,
      callsToday: 2450,
      callsThisMonth: 89230,
      successRate: 99.5,
      avgResponseTime: 142,
      lastUsed: '2025-10-31 16:30',
      createdAt: '2025-09-15 10:00',
    },
    {
      id: 'key-010',
      userId: 'user-010',
      userType: 'influencer',
      userName: '钱一美食旅行',
      userEmail: 'qianyi@example.com',
      userPhone: '13000130000',
      realName: '钱一',
      idNumber: '110101199401011234',
      platformName: '抖音',
      followersCount: 245000,
      influenceScore: 92,
      accountType: 'bank',
      bankName: '浦发银行',
      bankBranch: '北京丰台支行',
      accountNumber: '6225211234567890123',
      keyName: 'MCP博主密钥',
      keyPrefix: 'sk_live_8c9d0e1f',
      status: 'active',
      riskLevel: 'L1',
      totalCalls: 67890,
      callsToday: 1890,
      callsThisMonth: 67890,
      successRate: 99.3,
      avgResponseTime: 138,
      lastUsed: '2025-10-31 15:20',
      createdAt: '2025-09-25 14:15',
    },
  ];
}

