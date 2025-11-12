// 申请相关的 mock 数据

// 用户信息类型定义
export type UserType = 'travel_agent' | 'influencer' | 'travel_app'; // 旅行代理、网络博主、旅游类相关应用

// 认证方式定义
export type CertificationType = 'individual' | 'enterprise'; // 个人认证、企业认证

// 业务模式定义
export type BusinessModel = 'mcp' | 'saas' | 'affiliate'; // MCP、SaaS、推广联盟

// 兼容旧的身份类型（向后兼容）
export type IdentityType = 'developer' | 'influencer' | 'enterprise' | 'agent';
export type LegacyIdentityType = 'individual' | 'influencer' | 'enterprise';

export interface ReviewHistoryItem {
  reviewer: string;
  timestamp: string;
  action: 'approved' | 'rejected' | 'note_added' | 'created';
  details: string;
}

export interface ApplicationData {
  id: string;
  applicantName: string;
  phoneNumber: string;
  userEmail?: string;
  userType: UserType; // 用户信息类型：旅行代理、网络博主、旅游类相关应用
  certificationType: CertificationType; // 认证方式：个人认证、企业认证
  businessModel: BusinessModel; // 业务模式：MCP、SaaS、推广联盟
  identityType?: IdentityType | LegacyIdentityType; // 兼容旧类型
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  permissionLevel?: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  internalNote?: string;
  userId?: string;
  data: any;
  reviewHistory?: ReviewHistoryItem[];
}

/**
 * 获取模拟申请数据
 */
export function getMockApplications(): ApplicationData[] {
  return [
    {
      id: 'APP-001',
      applicantName: '张三',
      phoneNumber: '13800138000',
      userEmail: 'zhangsan@example.com',
      userType: 'travel_agent', // 旅行代理
      certificationType: 'individual', // 个人认证
      businessModel: 'affiliate', // 推广联盟（小B）
      identityType: 'agent',
      status: 'pending',
      submittedAt: '2025-10-28 14:30:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-28 14:30:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        realName: '张三',
        idNumber: '110101199001011234',
        idValidityStart: '2020-01-01',
        idValidityEnd: '2030-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        accountType: 'bank',
        bankCardholderName: '张三',
        bankName: '中国工商银行',
        bankBranch: '北京市朝阳区支行',
        bankCardNumber: '6222021234567890123',
        businessScenario: '通过微信群推广酒店代订服务',
        businessProofFiles: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    },
    {
      id: 'APP-002',
      applicantName: '李四',
      phoneNumber: '13900139000',
      userEmail: 'lisi@example.com',
      userType: 'influencer', // 网络博主
      certificationType: 'enterprise', // 企业认证
      businessModel: 'saas', // SaaS（大B）
      identityType: 'enterprise',
      status: 'approved',
      submittedAt: '2025-10-27 10:15:00',
      reviewedAt: '2025-10-27 16:20:00',
      permissionLevel: 'L3',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-27 10:15:00', action: 'created', details: '用户提交申请' },
        { reviewer: '管理员', timestamp: '2025-10-27 16:20:00', action: 'approved', details: '审核通过，风控等级L3' },
      ],
      data: {
        companyName: '李四工作室',
        creditCode: '91110100MA01ABCD4N',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '李四',
        legalRepIdNumber: '110101199002021234',
        mainPlatform: '抖音',
        mainProfileLink: 'https://douyin.com/user/123456',
        mainFollowersCount: '500000',
        contactName: '李四',
        contactPhone: '13900139000',
        contactEmail: 'lisi@example.com',
        accountHolderName: '李四工作室',
        bankName: '中国建设银行',
        bankBranch: '北京市海淀区支行',
        accountNumber: '6217001234567890123',
      }
    },
    {
      id: 'APP-003',
      applicantName: '王五',
      phoneNumber: '13700137000',
      userEmail: 'wangwu@example.com',
      userType: 'travel_app', // 旅游类相关应用
      certificationType: 'enterprise', // 企业认证
      businessModel: 'mcp', // MCP（大B）
      identityType: 'developer',
      status: 'rejected',
      submittedAt: '2025-10-26 09:45:00',
      reviewedAt: '2025-10-26 15:30:00',
      rejectionReason: '企业资质材料不完整，请补充完整的营业执照和业务证明',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-26 09:45:00', action: 'created', details: '用户提交申请' },
        { reviewer: '管理员', timestamp: '2025-10-26 15:30:00', action: 'rejected', details: '企业资质材料不完整' },
      ],
      data: {
        companyName: '旅游科技有限公司',
        creditCode: '91110100MA01EFGH4N',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '王五',
        legalRepIdNumber: '110101199003031234',
        contactName: '王五',
        contactPhone: '13700137000',
        contactEmail: 'wangwu@example.com',
        accountHolderName: '旅游科技有限公司',
        bankName: '中国农业银行',
        bankBranch: '北京市西城区支行',
        accountNumber: '6228481234567890123',
        githubAccount: 'wangwu-dev',
        portfolioLink: 'https://github.com/wangwu-dev',
        appScreenshots: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    },
    {
      id: 'APP-004',
      applicantName: '赵六',
      phoneNumber: '13600136000',
      userEmail: 'zhaoliu@example.com',
      userType: 'travel_agent', // 旅行代理
      certificationType: 'enterprise', // 企业认证
      businessModel: 'saas', // SaaS（大B）
      identityType: 'enterprise',
      status: 'pending',
      submittedAt: '2025-10-25 11:20:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-25 11:20:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        companyName: '赵六旅行社',
        creditCode: '91110100MA01IJKL4N',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '赵六',
        legalRepIdNumber: '110101199004041234',
        contactName: '赵六',
        contactPhone: '13600136000',
        contactEmail: 'zhaoliu@example.com',
        accountHolderName: '赵六旅行社',
        bankName: '中国银行',
        bankBranch: '北京市东城区支行',
        accountNumber: '6216611234567890123',
        businessLicenseFiles: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    },
    {
      id: 'APP-005',
      applicantName: '孙七',
      phoneNumber: '13500135000',
      userEmail: 'sunqi@example.com',
      userType: 'influencer', // 网络博主
      certificationType: 'individual', // 个人认证
      businessModel: 'saas', // SaaS（大B）
      identityType: 'influencer',
      status: 'pending',
      submittedAt: '2025-10-24 08:30:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-24 08:30:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        realName: '孙七',
        idNumber: '110101199005051234',
        idValidityStart: '2019-01-01',
        idValidityEnd: '2029-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        mainPlatform: '小红书',
        mainProfileLink: 'https://xiaohongshu.com/user/789012',
        mainFollowersCount: '150000',
        platformDataScreenshots: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
        phone: '13500135000',
        email: 'sunqi@example.com',
        accountType: 'bank',
        bankCardholderName: '孙七',
        bankName: '中国招商银行',
        bankBranch: '北京市朝阳区支行',
        bankCardNumber: '6225881234567890123',
      }
    },
    {
      id: 'APP-006',
      applicantName: '周八',
      phoneNumber: '13400134000',
      userEmail: 'zhouba@example.com',
      userType: 'travel_app', // 旅游类相关应用
      certificationType: 'individual', // 个人认证
      businessModel: 'affiliate', // 推广联盟（小B）
      identityType: 'agent',
      status: 'pending',
      submittedAt: '2025-10-23 14:15:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-23 14:15:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        realName: '周八',
        idNumber: '110101199006061234',
        idValidityStart: '2018-01-01',
        idValidityEnd: '2028-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        phone: '13400134000',
        email: 'zhouba@example.com',
        accountType: 'alipay',
        alipayAccount: '13400134000',
        alipayRealName: '周八',
        businessScenario: '通过社交媒体推广酒店预订服务',
        businessProofFiles: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    },
    {
      id: 'APP-007',
      applicantName: '吴九',
      phoneNumber: '13300133000',
      userEmail: 'wujiu@example.com',
      userType: 'travel_agent', // 旅行代理
      certificationType: 'individual', // 个人认证
      businessModel: 'affiliate', // 推广联盟（小B）
      identityType: 'agent',
      status: 'pending',
      submittedAt: '2025-10-22 16:45:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-22 16:45:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        realName: '吴九',
        idNumber: '110101199007071234',
        idValidityStart: '2017-01-01',
        idValidityEnd: '2027-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        phone: '13300133000',
        email: 'wujiu@example.com',
        accountType: 'bank',
        bankCardholderName: '吴九',
        bankName: '中国交通银行',
        bankBranch: '北京市丰台区支行',
        bankCardNumber: '6222621234567890123',
        businessScenario: '通过微信群推广酒店代订服务',
        businessProofFiles: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    },
    {
      id: 'APP-008',
      applicantName: '郑十',
      phoneNumber: '13200132000',
      userEmail: 'zhengshi@example.com',
      userType: 'travel_app', // 旅游类相关应用
      certificationType: 'enterprise', // 企业认证
      businessModel: 'saas', // SaaS（大B）
      identityType: 'enterprise',
      status: 'approved',
      submittedAt: '2025-10-21 13:20:00',
      reviewedAt: '2025-10-21 17:45:00',
      permissionLevel: 'L4',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-21 13:20:00', action: 'created', details: '用户提交申请' },
        { reviewer: '管理员', timestamp: '2025-10-21 17:45:00', action: 'approved', details: '审核通过，风控等级L4' },
      ],
      data: {
        companyName: '智慧旅游科技有限公司',
        creditCode: '91110100MA01MNOP4N',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '郑十',
        legalRepIdNumber: '110101199008081234',
        contactName: '郑十',
        contactPhone: '13200132000',
        contactEmail: 'zhengshi@example.com',
        accountHolderName: '智慧旅游科技有限公司',
        bankName: '中国民生银行',
        bankBranch: '北京市石景山区支行',
        accountNumber: '6226221234567890123',
        existingBusinessProof: 'https://example.com/app',
      }
    },
    {
      id: 'APP-009',
      applicantName: '钱十一',
      phoneNumber: '13100131000',
      userEmail: 'qianshiyi@example.com',
      userType: 'influencer', // 网络博主
      certificationType: 'enterprise', // 企业认证
      businessModel: 'saas', // SaaS（大B）
      identityType: 'enterprise',
      status: 'rejected',
      submittedAt: '2025-10-20 10:30:00',
      reviewedAt: '2025-10-20 14:15:00',
      rejectionReason: '粉丝数量未达到要求，请提供更多平台数据证明',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-20 10:30:00', action: 'created', details: '用户提交申请' },
        { reviewer: '管理员', timestamp: '2025-10-20 14:15:00', action: 'rejected', details: '粉丝数量未达到要求' },
      ],
      data: {
        companyName: '钱十一传媒工作室',
        creditCode: '91110100MA01QRST4N',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '钱十一',
        legalRepIdNumber: '110101199009091234',
        mainPlatform: '微信公众号',
        mainProfileLink: 'https://mp.weixin.qq.com/profile',
        mainFollowersCount: '50', // 未达到门槛
        platformDataScreenshots: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
        contactName: '钱十一',
        contactPhone: '13100131000',
        contactEmail: 'qianshiyi@example.com',
        accountHolderName: '钱十一传媒工作室',
        bankName: '中国光大银行',
        bankBranch: '北京市门头沟区支行',
        accountNumber: '6226621234567890123',
      }
    },
    {
      id: 'APP-010',
      applicantName: '孙十二',
      phoneNumber: '13000130000',
      userEmail: 'sunshier@example.com',
      userType: 'travel_app', // 旅游类相关应用
      certificationType: 'individual', // 个人认证
      businessModel: 'mcp', // MCP（大B）
      identityType: 'developer',
      status: 'pending',
      submittedAt: '2025-10-19 15:00:00',
      reviewHistory: [
        { reviewer: '系统', timestamp: '2025-10-19 15:00:00', action: 'created', details: '用户提交申请' },
      ],
      data: {
        realName: '孙十二',
        idNumber: '110101199010101234',
        idValidityStart: '2016-01-01',
        idValidityEnd: '2026-01-01',
        idPhotoFront: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        idPhotoBack: 'https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400',
        phone: '13000130000',
        email: 'sunshier@example.com',
        accountType: 'bank',
        bankCardholderName: '孙十二',
        bankName: '中国邮政储蓄银行',
        bankBranch: '北京市房山区支行',
        bankCardNumber: '6221881234567890123',
        githubAccount: 'sunshier-dev',
        portfolioLink: 'https://sunshier.dev',
        appScreenshots: ['https://images.unsplash.com/photo-1589395937921-e452d6a2f37f?w=400'],
      }
    }
  ];
}
