// 小B客户佣金明细组件
// 功能：查看佣金比例（只读）、查看佣金明细、查看佣金统计

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Wallet, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { getMockOrders, type Order } from '../../data/mockOrders';
import { getMockPartners, type Partner } from '../../data/mockPartners';
import { calculateOrderCommission } from '../../utils/orderUtils';
import { formatCurrency } from '../../utils/format';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

// 如果formatCurrency不存在，使用简单的实现
const formatCurrencyFallback = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface CommissionDetailProps {
  currentPartner: Partner | null;
}

export function CommissionDetail({ currentPartner }: CommissionDetailProps) {
  const [orders] = useState<Order[]>(getMockOrders());
  const [partners] = useState<Partner[]>(getMockPartners());

  // 获取当前小B的订单（只包含自己的订单）
  const myOrders = useMemo(() => {
    if (!currentPartner) return [];
    return orders.filter(order => order.smallBPartnerId === currentPartner.id);
  }, [orders, currentPartner]);

  // 获取关联的大B客户信息
  const bigBPartner = useMemo(() => {
    if (!currentPartner?.parentPartnerId) return null;
    return partners.find(p => p.id === currentPartner.parentPartnerId) || null;
  }, [partners, currentPartner]);

  // 计算佣金统计
  const commissionStats = useMemo(() => {
    const totalCommission = myOrders.reduce((sum, order) => {
      const commission = calculateOrderCommission(order, currentPartner || undefined);
      return sum + commission.smallBCommission;
    }, 0);

    const totalOrders = myOrders.length;
    const completedOrders = myOrders.filter(o => o.orderStatus === 'completed' || o.orderStatus === 'completed_settleable').length;
    const pendingCommission = myOrders
      .filter(o => o.settlementStatus === 'pending' || o.settlementStatus === 'ready')
      .reduce((sum, order) => {
        const commission = calculateOrderCommission(order, currentPartner || undefined);
        return sum + commission.smallBCommission;
      }, 0);

    return {
      totalCommission,
      totalOrders,
      completedOrders,
      pendingCommission,
      averageCommission: totalOrders > 0 ? totalCommission / totalOrders : 0,
    };
  }, [myOrders, currentPartner]);

  if (!currentPartner) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">未找到客户信息</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>佣金明细</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 佣金统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">累计佣金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(commissionStats.totalCommission)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">待结算佣金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(commissionStats.pendingCommission)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">订单总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissionStats.totalOrders}</div>
            <div className="text-xs text-gray-500 mt-1">已完成: {commissionStats.completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均佣金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(commissionStats.averageCommission)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 佣金明细 */}
      <Card>
        <CardHeader>
          <CardTitle>佣金明细</CardTitle>
          <CardDescription>查看每笔订单的佣金详情</CardDescription>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无订单记录
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单编号</TableHead>
                  <TableHead>酒店名称</TableHead>
                  <TableHead>入住日期</TableHead>
                  <TableHead>实付金额</TableHead>
                  <TableHead>总利润</TableHead>
                  <TableHead>佣金比例</TableHead>
                  <TableHead>佣金金额</TableHead>
                  <TableHead>结算状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOrders.map((order) => {
                  const commission = calculateOrderCommission(order, currentPartner);
                  return (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                      <TableCell>{order.hotelName}</TableCell>
                      <TableCell>{order.checkInDate}</TableCell>
                      <TableCell>{formatCurrency(order.actualAmount)}</TableCell>
                      <TableCell>{formatCurrency(commission.totalProfit)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.partnerCommissionRate || currentPartner.defaultCommissionRate || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(commission.smallBCommission)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          order.settlementStatus === 'completed' ? 'default' :
                          order.settlementStatus === 'ready' ? 'secondary' :
                          'outline'
                        }>
                          {order.settlementStatus === 'completed' ? '已结算' :
                           order.settlementStatus === 'ready' ? '待结算' :
                           '未结算'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

