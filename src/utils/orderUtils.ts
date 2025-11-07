// 订单工具函数：订单查询、过滤、佣金计算等

import type { Order } from '../data/mockOrders';
import type { Partner } from '../data/mockPartners';
import { getMockPartners } from '../data/mockPartners';

/**
 * 根据用户类型和Partner信息过滤订单
 * @param orders 所有订单
 * @param partner 当前用户的Partner信息
 * @param userType 用户类型：'admin' | 'bigb' | 'smallb'
 * @returns 过滤后的订单列表
 */
export function filterOrdersByUserType(
  orders: Order[],
  partner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb'
): Order[] {
  if (userType === 'admin') {
    // 管理员可以查看所有订单
    return orders;
  }
  
  if (userType === 'bigb' && partner) {
    // 大B客户：可以查询自己的订单 + 所有挂载小B的订单
    // 查询条件：order.bigBPartnerId = 大B客户ID OR order.smallBPartnerId IN (所有挂载小B的ID列表)
    const smallBIds = getSmallBPartnerIds(partner.id);
    return orders.filter(order => 
      order.bigBPartnerId === partner.id || 
      (order.smallBPartnerId && smallBIds.includes(order.smallBPartnerId))
    );
  }
  
  if (userType === 'smallb' && partner) {
    // 小B客户：只能查询自己的订单
    // 查询条件：order.smallBPartnerId = 小B客户ID
    return orders.filter(order => order.smallBPartnerId === partner.id);
  }
  
  return [];
}

/**
 * 获取挂载在指定大B下的所有小B客户ID列表
 * @param bigBPartnerId 大B客户ID
 * @returns 小B客户ID列表
 */
export function getSmallBPartnerIds(bigBPartnerId: string): string[] {
  // 从localStorage或API获取所有Partners
  const partners = getMockPartners();
  
  return partners
    .filter(p => p.parentPartnerId === bigBPartnerId && p.businessModel === 'affiliate')
    .map(p => p.id);
}

/**
 * 计算订单佣金（根据系统架构图的价格体系）
 * @param order 订单
 * @param partner 小B客户信息（用于获取佣金比例）
 * @returns 佣金计算结果
 */
export function calculateOrderCommission(order: Order, partner?: Partner) {
  const totalProfit = order.p2_salePrice - order.p0_supplierCost;
  
  if (order.partnerBusinessModel === 'saas') {
    // SaaS模式：小B利润 = P2 - P1（已计算在order.partnerProfit中）
    return {
      totalProfit,
      smallBCommission: order.partnerProfit || 0,
      bigBProfit: order.bigBProfit || (order.p1_platformPrice ? order.p1_platformPrice - order.p0_supplierCost : 0),
    };
  } else if (order.partnerBusinessModel === 'affiliate' || order.partnerBusinessModel === 'mcp') {
    // MCP/推广联盟模式：小B佣金 = 总利润 × 佣金比例（由大B设置）
    const commissionRate = order.partnerCommissionRate || partner?.defaultCommissionRate || 0;
    const smallBCommission = totalProfit * (commissionRate / 100);
    const bigBProfit = totalProfit - smallBCommission;
    
    return {
      totalProfit,
      smallBCommission,
      bigBProfit,
      commissionRate,
    };
  }
  
  return {
    totalProfit,
    smallBCommission: 0,
    bigBProfit: totalProfit,
  };
}

/**
 * 获取订单关联的大B客户信息
 * @param order 订单
 * @returns 大B客户信息
 */
export function getBigBPartnerFromOrder(order: Order): Partner | null {
  if (!order.bigBPartnerId) return null;
  
  const partners = getMockPartners();
  return partners.find(p => p.id === order.bigBPartnerId) || null;
}

/**
 * 获取订单关联的小B客户信息
 * @param order 订单
 * @returns 小B客户信息
 */
export function getSmallBPartnerFromOrder(order: Order): Partner | null {
  if (!order.smallBPartnerId) return null;
  
  const partners = getMockPartners();
  return partners.find(p => p.id === order.smallBPartnerId) || null;
}

