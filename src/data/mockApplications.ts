// 申请相关的 mock 数据

export interface ApplicationData {
  id: string;
  applicantName: string;
  businessModel: 'mcp' | 'saas' | 'affiliate';
  identityType: 'individual' | 'influencer' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  permissionLevel?: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  internalNote?: string;
  userId?: string;
  userEmail?: string;
  data: any;
}

/**
 * 获取模拟申请数据
 */
export function getMockApplications(): ApplicationData[] {
  return [
    {
      id: 'APP-001',
      applicantName: '张三',
      businessModel: 'mcp',
      identityType: 'individual',
      status: 'pending',
      submittedAt: '2025-10-28 14:30:00',
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
      },
    },
    {
      id: 'APP-002',
      applicantName: '李四',
      businessModel: 'saas',
      identityType: 'influencer',
      status: 'approved',
      submittedAt: '2025-10-27 10:15:00',
      reviewedAt: '2025-10-28 09:20:00',
      data: {
        realName: '李四',
        idNumber: '110101199002021234',
        mainPlatform: '小红书',
        mainProfileLink: 'https://xiaohongshu.com/user/123',
        mainFollowersCount: '50000',
        phone: '13900139000',
        accountType: 'alipay',
        alipayAccount: '13900139000',
        alipayRealName: '李四',
      },
    },
    {
      id: 'APP-003',
      applicantName: '王五',
      businessModel: 'affiliate',
      identityType: 'enterprise',
      status: 'rejected',
      submittedAt: '2025-10-26 16:45:00',
      reviewedAt: '2025-10-27 14:30:00',
      rejectionReason: '1. 营业执照照片不清晰，无法辨认企业名称和信用代码\n2. 法人身份证号格式错误\n3. 银行账号信息与企业名称不符',
      data: {
        companyName: '某某科技有限公司',
        creditCode: '91110000MA01ABCD1E',
        businessLicense: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
        legalRepName: '王五',
        legalRepIdNumber: '110101199003031234',
        contactName: '王五',
        contactPhone: '13700137000',
        contactEmail: 'wangwu@example.com',
        accountHolderName: '某某科技有限公司',
        bankName: '中国建设银行',
        bankBranch: '北京市海淀区支行',
        accountNumber: '11001234567890123456',
      },
    },
  ];
}

