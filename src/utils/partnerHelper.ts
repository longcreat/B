// Partner辅助函数：从Application数据创建Partner数据

import type { ApplicationData } from '../data/mockApplications';
import type { Partner } from '../data/mockPartners';
import { businessModelMetadata } from '../data/mockBusinessModelConfig';

/**
 * 从Application数据创建Partner数据
 * @param application 申请数据
 * @param userId 用户ID
 * @returns Partner数据
 */
export function createPartnerFromApplication(
  application: ApplicationData,
  userId: string
): Partner {
  const businessModel = application.businessModel as 'mcp' | 'saas' | 'affiliate';
  const metadata = businessModelMetadata.find(m => m.businessModel === businessModel);
  
  // 判断是否为大B
  const isBigB = metadata?.isBigB || false;
  
  // 获取显示名称
  const displayName = application.data?.realName || 
                     application.data?.companyName || 
                     application.data?.contactName || 
                     application.applicantName || 
                     '未知用户';
  
  // 获取邮箱
  const email = application.data?.email || 
                application.data?.contactEmail || 
                application.userEmail || 
                '';
  
  // 获取手机号
  const phone = application.data?.phone || 
                application.data?.contactPhone || 
                '';
  
  // 判断Partner类型
  let partnerType: 'individual' | 'influencer' | 'enterprise' = 'individual';
  if (application.userType === 'influencer') {
    partnerType = 'influencer';
  } else if (application.certificationType === 'enterprise') {
    partnerType = 'enterprise';
  } else if (application.userType === 'travel_agent' || application.userType === 'travel_app') {
    partnerType = 'individual';
  }
  
  // 创建Partner对象
  const partner: Partner = {
    id: `PARTNER-${application.id}`,
    type: partnerType,
    displayName,
    email,
    phone,
    businessModel,
    canSetMarkupRate: metadata?.canSetMarkupRate || false,
    defaultCommissionRate: metadata?.defaultCommissionRate,
    // 推广联盟用户默认挂载在平台大B下（parentPartnerId为null，managedBy为admin）
    // 大B用户直接由管理员管理
    parentPartnerId: isBigB ? null : null, // 暂时都设为null，后续可以根据业务规则设置
    managedBy: isBigB ? 'admin' : 'admin', // 暂时都由admin管理，后续大B可以管理小B
    certificationStatus: application.status,
    certificationType: application.certificationType, // 保存认证方式
    certifiedAt: application.status === 'approved' ? application.reviewedAt : undefined,
    accountStatus: application.status === 'approved' ? 'active' : 'frozen',
    settlementStatus: 'normal',
    permissionLevel: 'L0',
    financialData: {
      totalRevenue: 0,
      totalProfit: 0,
      availableBalance: 0,
      pendingSettlement: 0,
      withdrawnAmount: 0,
    },
    businessData: {
      totalOrders: 0,
      completedOrders: 0,
      avgMarkupRate: 0,
      activeCustomers: 0,
    },
    specificInfo: {
      realName: application.data?.realName,
      idNumber: application.data?.idNumber,
      companyName: application.data?.companyName,
      socialCreditCode: application.data?.creditCode,
      legalRepresentative: application.data?.legalRepName,
    },
    registeredAt: application.submittedAt,
  };
  
  return partner;
}

/**
 * 根据用户邮箱查找对应的Partner
 * @param email 用户邮箱
 * @param partners Partner列表
 * @returns Partner或undefined
 */
export function findPartnerByEmail(email: string, partners: Partner[]): Partner | undefined {
  return partners.find(p => p.email === email);
}

