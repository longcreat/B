import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { PartnerAccountTable, type PartnerAccount, type AccessType } from './finance/PartnerAccountTable';

export function PartnerAccount() {
  // 模拟小B账户数据
  // 数据来源：根据订单明细中的佣金计算
  const [partnerAccounts] = useState<PartnerAccount[]>([
    {
      partnerId: 'PTN-001',
      partnerName: '张三',
      accessType: 'API',
      totalCommission: 280.8, // ORD-2025001 (122.4) + 其他已完结订单
      withdrawnCommission: 0, // 已提现
      availableCommission: 280.8, // 未提现（已完结订单的佣金）
      pendingCommission: 0, // 未确认（待入住订单）
    },
    {
      partnerId: 'PTN-002',
      partnerName: '李四',
      accessType: 'PAAS',
      totalCommission: 183.6, // ORD-2025002
      withdrawnCommission: 0,
      availableCommission: 0, // 订单未完结
      pendingCommission: 183.6, // 待入住订单
    },
    {
      partnerId: 'PTN-003',
      partnerName: '王五',
      accessType: 'link',
      totalCommission: 0, // ORD-2025003 已免费取消
      withdrawnCommission: 0,
      availableCommission: 0,
      pendingCommission: 0,
    },
    {
      partnerId: 'PTN-004',
      partnerName: '赵六',
      accessType: 'link',
      totalCommission: 84.15, // ORD-2025004 部分取消
      withdrawnCommission: 0,
      availableCommission: 84.15,
      pendingCommission: 0,
    },
    {
      partnerId: 'PTN-005',
      partnerName: '钱七',
      accessType: 'API',
      totalCommission: 255, // ORD-2025005
      withdrawnCommission: 100, // 已提现部分
      availableCommission: 155, // 未提现
      pendingCommission: 0,
    },
    {
      partnerId: 'PTN-006',
      partnerName: '孙八',
      accessType: 'link',
      totalCommission: 168.3, // ORD-2025006
      withdrawnCommission: 0,
      availableCommission: 168.3,
      pendingCommission: 0,
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>小B账户</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 小B账户表格 */}
      <PartnerAccountTable accounts={partnerAccounts} />
    </div>
  );
}

