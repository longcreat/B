// 权限判断工具函数
// 根据系统架构图实现

import type { User } from '../types/user';
import type { Partner } from '../data/mockPartners';

export type UserSystemType = 'admin' | 'bigb' | 'smallb';

/**
 * 判断用户系统类型
 * @param user 用户信息
 * @param partner 合作伙伴信息（可选，如果用户已通过审核）
 * @returns 用户系统类型：admin=管理员，bigb=大B客户，smallb=小B客户
 */
export function getUserType(user: User, partner?: Partner): UserSystemType {
  if (user.role === 'admin') return 'admin';
  
  // 如果没有partner信息，无法判断，返回smallb作为默认值
  if (!partner) return 'smallb';
  
  // 大B客户：SaaS或MCP模式，可以设置加价率
  if (partner.businessModel === 'saas' || partner.businessModel === 'mcp') {
    return 'bigb';
  }
  
  // 小B客户：推广联盟模式，不能设置加价率
  return 'smallb';
}

/**
 * 判断是否可以管理小B
 * @param partner 合作伙伴信息
 * @returns 是否可以管理小B客户
 */
export function canManageSmallB(partner?: Partner): boolean {
  if (!partner) return false;
  // SaaS或MCP模式的大B客户可以管理小B（推广联盟用户）
  return partner.businessModel === 'saas' || partner.businessModel === 'mcp';
}

/**
 * 判断是否可以审核小B申请
 * @param partner 合作伙伴信息
 * @returns 是否可以审核小B申请
 */
export function canReviewSmallBApplication(partner?: Partner): boolean {
  // 大B客户可以审核挂载在自己下面的小B申请
  return canManageSmallB(partner);
}

/**
 * 判断是否可以修改小B佣金比例
 * @param partner 合作伙伴信息
 * @returns 是否可以修改小B佣金比例
 */
export function canModifySmallBCommission(partner?: Partner): boolean {
  // 大B客户可以修改小B的佣金比例
  return canManageSmallB(partner);
}

/**
 * 判断是否可以停用/启用小B
 * @param partner 合作伙伴信息
 * @returns 是否可以停用/启用小B
 */
export function canToggleSmallBStatus(partner?: Partner): boolean {
  // 大B客户可以停用/启用小B
  return canManageSmallB(partner);
}

/**
 * 判断业务模式
 * @param partner 合作伙伴信息
 * @returns 业务模式
 */
export function getBusinessModel(partner?: Partner): 'saas' | 'mcp' | 'affiliate' | null {
  return partner?.businessModel || null;
}

/**
 * 判断是否为大B客户
 * @param partner 合作伙伴信息
 * @returns 是否为大B客户
 */
export function isBigBPartner(partner?: Partner): boolean {
  if (!partner) return false;
  // SaaS或MCP模式为大B客户
  return partner.businessModel === 'saas' || partner.businessModel === 'mcp';
}

/**
 * 判断是否为小B客户
 * @param partner 合作伙伴信息
 * @returns 是否为小B客户
 */
export function isSmallBPartner(partner?: Partner): boolean {
  if (!partner) return false;
  // 推广联盟模式为小B客户
  return partner.businessModel === 'affiliate';
}

/**
 * 判断是否可以设置加价率
 * @param partner 合作伙伴信息
 * @returns 是否可以设置加价率
 */
export function canSetMarkupRate(partner?: Partner): boolean {
  if (!partner) return false;
  // 大B客户（SaaS或MCP模式）可以设置加价率
  return isBigBPartner(partner);
}

