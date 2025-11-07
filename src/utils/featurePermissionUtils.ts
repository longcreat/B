// 功能权限检查工具函数

import { Partner } from '../data/mockPartners';
import { FeatureCode, FeaturePermission, getFeaturePermission } from '../data/mockFeaturePermissions';

/**
 * 检查用户是否有权限使用指定功能
 */
export function hasFeaturePermission(
  featureCode: FeatureCode,
  partner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb'
): boolean {
  // 管理员拥有所有权限
  if (userType === 'admin') {
    return true;
  }

  // 如果没有Partner信息，拒绝访问
  if (!partner) {
    return false;
  }

  // 获取功能权限配置
  const permission = getFeaturePermission(featureCode);
  
  // 如果功能不存在或未启用，拒绝访问
  if (!permission || !permission.enabled) {
    return false;
  }

  // 检查业务模式限制
  if (permission.requiredBusinessModels && permission.requiredBusinessModels.length > 0) {
    if (!permission.requiredBusinessModels.includes(partner.businessModel)) {
      return false;
    }
  }

  // 检查用户类型限制
  if (permission.requiredUserTypes && permission.requiredUserTypes.length > 0) {
    if (!permission.requiredUserTypes.includes(userType as 'bigb' | 'smallb')) {
      return false;
    }
  }

  // 检查黑名单
  if (permission.blacklistPartnerIds && permission.blacklistPartnerIds.includes(partner.id)) {
    return false;
  }

  // 根据权限规则判断
  switch (permission.rule) {
    case 'all':
      return true;

    case 'bigb-only':
      return userType === 'bigb';

    case 'smallb-only':
      return userType === 'smallb';

    case 'saas-only':
      return partner.businessModel === 'saas';

    case 'mcp-only':
      return partner.businessModel === 'mcp';

    case 'affiliate-only':
      return partner.businessModel === 'affiliate';

    case 'whitelist':
      // 白名单模式：必须在白名单中
      return permission.whitelistPartnerIds?.includes(partner.id) ?? false;

    default:
      return false;
  }
}

/**
 * 获取用户可用的功能列表
 */
export function getAvailableFeatures(
  partner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb',
  allFeatures: FeatureCode[]
): FeatureCode[] {
  return allFeatures.filter(featureCode => 
    hasFeaturePermission(featureCode, partner, userType)
  );
}

/**
 * 批量检查功能权限
 */
export function checkFeaturesPermissions(
  featureCodes: FeatureCode[],
  partner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb'
): Record<FeatureCode, boolean> {
  const result: Record<string, boolean> = {};
  
  featureCodes.forEach(code => {
    result[code] = hasFeaturePermission(code, partner, userType);
  });
  
  return result as Record<FeatureCode, boolean>;
}

/**
 * 获取功能不可用的原因
 */
export function getFeatureDisabledReason(
  featureCode: FeatureCode,
  partner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb'
): string | null {
  if (userType === 'admin') {
    return null;
  }

  if (!partner) {
    return '未找到用户信息';
  }

  const permission = getFeaturePermission(featureCode);
  
  if (!permission) {
    return '功能不存在';
  }

  if (!permission.enabled) {
    return '功能未启用';
  }

  if (permission.requiredBusinessModels && !permission.requiredBusinessModels.includes(partner.businessModel)) {
    return `该功能仅适用于 ${permission.requiredBusinessModels.join('/')} 业务模式`;
  }

  if (permission.requiredUserTypes && !permission.requiredUserTypes.includes(userType as 'bigb' | 'smallb')) {
    return `该功能仅适用于 ${permission.requiredUserTypes.join('/')} 用户`;
  }

  if (permission.blacklistPartnerIds?.includes(partner.id)) {
    return '您的账户暂时无法使用此功能';
  }

  if (permission.rule === 'whitelist' && !permission.whitelistPartnerIds?.includes(partner.id)) {
    if (permission.betaTest) {
      return '该功能正在内测中，暂未对您开放';
    }
    return '您暂无权限使用此功能';
  }

  return null;
}

