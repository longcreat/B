import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PlatformAccountDashboard } from './finance/PlatformAccountDashboard';
import { OrderDetailsTable, type OrderDetail, type OrderStatus } from './finance/OrderDetailsTable';
import { CommissionSettlementTable, type CommissionWithdrawal, type WithdrawalStatus } from './finance/CommissionSettlementTable';
import { SupplierSettlementTable, type SupplierSettlement, type SupplierSettlementStatus } from './finance/SupplierSettlementTable';

export function PlatformAccount() {
  // 模拟订单数据
  // 业务逻辑：
  // 普通模式（API/PAAS）：
  // 1. 订单底价 = 供应商给的底价
  // 2. 分销价 = 订单底价 × 1.02 (默认加价2%)
  // 3. 订单金额 = 分销价 × (1 + 加价率)
  // 4. 佣金 = 订单金额 - 分销价
  // 5. 订单利润 = 分销价 - 订单底价
  //
  // 链接分销模式（link）：
  // 1. 订单底价 = 供应商给的底价
  // 2. 分销价 = 订单底价 × 1.02
  // 3. 订单金额 = 分销价 × (1 + 加价率)（和普通模式一样）
  // 4. 佣金 = 订单金额 × 链接分销佣金率（特殊计算方式）
  // 5. 余额 = 订单金额 - 分销价 - 佣金
  // 6. 订单利润 = (分销价 - 订单底价) + 余额
  const [orders] = useState<OrderDetail[]>([
    {
      orderId: 'ORD-2025001',
      supplierCost: 1200, // 订单底价
      distributionPrice: 1224, // 分销价 = 1200 × 1.02
      markupRate: 10, // 加价率 10%
      orderAmount: 1346.4, // 订单金额 = 1224 × 1.1
      commission: 122.4, // 佣金 = 1346.4 - 1224
      profit: 24, // 订单利润 = 1224 - 1200
      channel: '张三',
      accessType: 'API',
      status: 'completed',
      checkInDate: '2025-10-15',
      checkOutDate: '2025-10-17',
      hotelName: '上海外滩酒店',
    },
    {
      orderId: 'ORD-2025002',
      supplierCost: 1800,
      distributionPrice: 1836, // 1800 × 1.02
      markupRate: 10,
      orderAmount: 2019.6, // 1836 × 1.1
      commission: 183.6, // 2019.6 - 1836
      profit: 36, // 1836 - 1800
      channel: '李四',
      accessType: 'PAAS',
      status: 'pending_checkin',
      checkInDate: '2025-11-05',
      checkOutDate: '2025-11-07',
      hotelName: '北京王府井大酒店',
    },
    {
      orderId: 'ORD-2025003',
      supplierCost: 750,
      distributionPrice: 765, // 750 × 1.02
      markupRate: 10, // 加价率 10%
      orderAmount: 0, // 已免费取消，金额为0
      commission: 0,
      profit: 0,
      channel: '王五',
      accessType: 'link',
      linkCommissionRate: 10, // 链接分销佣金率 10%
      status: 'cancelled_free',
      checkInDate: '2025-10-20',
      checkOutDate: '2025-10-22',
      hotelName: '杭州西湖宾馆',
    },
    {
      // 链接分销示例：部分取消
      orderId: 'ORD-2025004',
      supplierCost: 750,
      distributionPrice: 765, // 750 × 1.02
      markupRate: 10, // 加价率 10%
      orderAmount: 841.5, // 订单金额 = 765 × 1.1
      commission: 84.15, // 佣金 = 841.5 × 10%
      profit: -68.65, // 订单利润计算：
      // 基础利润 = 765 - 750 = 15
      // 余额 = 841.5 - 765 - 84.15 = -7.65
      // 订单利润 = 15 + (-7.65) = 7.35（但部分取消后调整为负）
      channel: '赵六',
      accessType: 'link',
      linkCommissionRate: 10, // 链接分销佣金率 10%
      status: 'cancelled_partial',
      checkInDate: '2025-10-25',
      checkOutDate: '2025-10-28',
      hotelName: '深圳湾大酒店',
    },
    {
      orderId: 'ORD-2025005',
      supplierCost: 2500,
      distributionPrice: 2550, // 2500 × 1.02
      markupRate: 10,
      orderAmount: 2805, // 2550 × 1.1
      commission: 255, // 2805 - 2550
      profit: 50, // 2550 - 2500
      channel: '钱七',
      accessType: 'API',
      status: 'completed',
      checkInDate: '2025-10-10',
      checkOutDate: '2025-10-13',
      hotelName: '广州珠江新城酒店',
    },
    {
      // 链接分销示例：已完结订单
      orderId: 'ORD-2025006',
      supplierCost: 1500,
      distributionPrice: 1530, // 1500 × 1.02
      markupRate: 10, // 加价率 10%
      orderAmount: 1683, // 订单金额 = 1530 × 1.1
      commission: 168.3, // 佣金 = 1683 × 10%
      profit: 14.7, // 订单利润计算：
      // 基础利润 = 1530 - 1500 = 30
      // 余额 = 1683 - 1530 - 168.3 = -15.3
      // 订单利润 = 30 + (-15.3) = 14.7
      channel: '孙八',
      accessType: 'link',
      linkCommissionRate: 10, // 链接分销佣金率 10%
      status: 'completed',
      checkInDate: '2025-10-28',
      checkOutDate: '2025-10-30',
      hotelName: '成都春熙路酒店',
    },
  ]);

  // 模拟佣金结算数据
  const [commissionWithdrawals, setCommissionWithdrawals] = useState<CommissionWithdrawal[]>([
    {
      id: 'WD-2025001',
      applicant: '张三',
      amount: 5000,
      status: 'approved',
      createdAt: '2025-10-28 10:30:00',
    },
    {
      id: 'WD-2025002',
      applicant: '李四',
      amount: 3500,
      status: 'paid',
      createdAt: '2025-10-25 14:20:00',
      processedAt: '2025-10-26 09:15:00',
    },
    {
      id: 'WD-2025003',
      applicant: '王五',
      amount: 2000,
      status: 'rejected',
      createdAt: '2025-10-22 16:45:00',
      processedAt: '2025-10-23 11:30:00',
    },
    {
      id: 'WD-2025004',
      applicant: '赵六',
      amount: 4200,
      status: 'failed',
      createdAt: '2025-10-20 09:00:00',
      processedAt: '2025-10-21 10:20:00',
    },
  ]);

  // 模拟供应商结算数据
  const [supplierSettlements, setSupplierSettlements] = useState<SupplierSettlement[]>([
    {
      id: 'SS-2025001',
      period: '2025-09',
      supplierName: '华住酒店集团',
      amount: 125000,
      status: 'paid',
      createdAt: '2025-10-20 00:00:00',
      paidAt: '2025-10-20 15:30:00',
    },
    {
      id: 'SS-2025002',
      period: '2025-09',
      supplierName: '锦江酒店集团',
      amount: 98000,
      status: 'paid',
      createdAt: '2025-10-20 00:00:00',
      paidAt: '2025-10-20 16:45:00',
    },
    {
      id: 'SS-2025003',
      period: '2025-08',
      supplierName: '首旅如家集团',
      amount: 87500,
      status: 'failed',
      createdAt: '2025-09-20 00:00:00',
      paidAt: '2025-09-20 14:20:00',
    },
  ]);

  // 计算看板统计数据
  const [stats, setStats] = useState(() => {
    // 订单预收款：未完结订单（待入住）的预付费用
    const advancePayment = orders
      .filter(o => o.status === 'pending_checkin')
      .reduce((sum, o) => sum + o.orderAmount, 0);

    // 订单实际收款：已完结订单的预付费用
    const actualRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.orderAmount, 0);

    // 应付账款（分销）：已完结订单的佣金 - 已打款的佣金
    const completedCommission = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.commission, 0);
    const paidCommission = commissionWithdrawals
      .filter(w => w.status === 'paid')
      .reduce((sum, w) => sum + w.amount, 0);
    const payableDistribution = completedCommission - paidCommission;

    // 应付账款（供应商）：已完结订单的供应商成本 - 已打款的供应商结算
    const completedSupplierCost = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.supplierCost, 0);
    const paidSupplier = supplierSettlements
      .filter(s => s.status === 'paid')
      .reduce((sum, s) => sum + s.amount, 0);
    const payableSupplier = completedSupplierCost - paidSupplier;

    // 可用资金：实际收款 - 应付账款（分销） - 应付账款（供应商）
    const availableFunds = actualRevenue - payableDistribution - payableSupplier;

    return {
      advancePayment,
      actualRevenue,
      payableDistribution,
      payableSupplier,
      availableFunds,
    };
  });

  // 处理充值
  const handleRecharge = (amount: number) => {
    setStats(prev => ({
      ...prev,
      availableFunds: prev.availableFunds + amount,
    }));
  };

  // 处理打款
  const handlePay = (id: string) => {
    const withdrawal = commissionWithdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    setCommissionWithdrawals(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, status: 'paid' as WithdrawalStatus, processedAt: new Date().toLocaleString('zh-CN') }
          : w
      )
    );
    
    // 更新应付账款：打款后减少应付账款，确保不会变成负数
    setStats(prev => ({
      ...prev,
      payableDistribution: Math.max(0, prev.payableDistribution - withdrawal.amount),
    }));
  };

  // 处理标记失败（从已打款状态标记为失败）
  const handleMarkFailed = (id: string) => {
    const withdrawal = commissionWithdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    const wasPaid = withdrawal.status === 'paid';

    setCommissionWithdrawals(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, status: 'failed' as WithdrawalStatus, processedAt: new Date().toLocaleString('zh-CN') }
          : w
      )
    );
    
    // 如果之前是已打款状态，需要将金额退回应付账款
    if (wasPaid) {
      setStats(prev => ({
        ...prev,
        payableDistribution: prev.payableDistribution + withdrawal.amount,
      }));
    }
  };

  // 处理供应商结算标记失败
  const handleSupplierMarkFailed = (id: string) => {
    const settlement = supplierSettlements.find(s => s.id === id);
    if (!settlement) return;

    const wasPaid = settlement.status === 'paid';

    setSupplierSettlements(prev => 
      prev.map(s => 
        s.id === id 
          ? { ...s, status: 'failed' as SupplierSettlementStatus }
          : s
      )
    );
    
    // 如果之前是已打款状态，需要将金额退回应付账款
    if (wasPaid) {
      setStats(prev => ({
        ...prev,
        payableSupplier: prev.payableSupplier + settlement.amount,
      }));
    }
  };

  // 处理供应商结算重新打款
  const handleSupplierRetryPay = (id: string) => {
    const settlement = supplierSettlements.find(s => s.id === id);
    if (!settlement) return;

    setSupplierSettlements(prev => 
      prev.map(s => 
        s.id === id 
          ? { ...s, status: 'paid' as SupplierSettlementStatus, paidAt: new Date().toLocaleString('zh-CN') }
          : s
      )
    );
    
    // 重新打款后，应付账款减少
    setStats(prev => ({
      ...prev,
      payableSupplier: Math.max(0, prev.payableSupplier - settlement.amount),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>平台账户</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 看板统计 */}
      <PlatformAccountDashboard stats={stats} onRecharge={handleRecharge} />

      {/* 明细表格 */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">订单明细</TabsTrigger>
          <TabsTrigger value="commission">佣金结算明细</TabsTrigger>
          <TabsTrigger value="supplier">供应商结算明细</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrderDetailsTable orders={orders} />
        </TabsContent>

        <TabsContent value="commission">
          <CommissionSettlementTable 
            withdrawals={commissionWithdrawals}
            onPay={handlePay}
            onMarkFailed={handleMarkFailed}
          />
        </TabsContent>

        <TabsContent value="supplier">
          <SupplierSettlementTable 
            settlements={supplierSettlements}
            onMarkFailed={handleSupplierMarkFailed}
            onRetryPay={handleSupplierRetryPay}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

