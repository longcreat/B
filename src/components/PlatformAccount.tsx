import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { PlatformAccountDashboard } from './finance/PlatformAccountDashboard';
import { OrderDetailsTable, type OrderDetail } from './finance/OrderDetailsTable';

type DashboardAggregate = {
  advancePayment: number;
  actualRevenue: number;
  platformProfit: number;
  payableDistribution: number;
  payableSupplier: number;
  availableFunds: number;
  platformDiscountContribution: number;
  bigBDiscountContribution: number;
};

const computeStats = (
  ordersData: OrderDetail[],
): DashboardAggregate => {
  const advancePayment = ordersData
    .filter(order => order.orderStatus === 'pending_checkin')
    .reduce((sum, order) => sum + order.p2_orderAmount, 0);

  const actualRevenue = ordersData
    .filter(order => order.orderStatus === 'completed')
    .reduce((sum, order) => sum + (order.actualAmount - order.totalRefund), 0);

  const platformProfit = ordersData.reduce((sum, order) => {
    const gross = order.p1_distributionPrice - order.p0_supplierCost;
    const refundProfit = order.p2_orderAmount > 0
      ? order.totalRefund * (order.p1_distributionPrice - order.p0_supplierCost) / order.p2_orderAmount
      : 0;
    const platformContribution = order.platformDiscountContribution || 0;
    return sum + (gross - refundProfit - platformContribution);
  }, 0);

  const platformDiscountContribution = ordersData.reduce(
    (sum, order) => sum + order.platformDiscountContribution,
    0,
  );

  const bigBDiscountContribution = ordersData.reduce(
    (sum, order) => sum + order.bigBDiscountContribution,
    0,
  );

  // 应付账款（大B）：按PRD公式基于订单字段计算（不扣除佣金，由大B自行结算给小B）
  const payableDistribution = ordersData
    .filter(order => order.orderStatus === 'completed')
    .reduce((sum, order) => {
      const refundP1Part = order.p2_orderAmount > 0
        ? order.totalRefund * order.p1_distributionPrice / order.p2_orderAmount
        : 0;
      const bigBContribution = order.bigBDiscountContribution || 0;
      const amount = (order.p2_orderAmount - order.totalRefund)
        - (order.p1_distributionPrice - refundP1Part)
        - bigBContribution;
      return sum + Math.max(0, amount);
    }, 0);

  // 应付账款（供应商）：按PRD公式基于订单字段计算
  const payableSupplier = ordersData
    .filter(order => order.orderStatus === 'completed')
    .reduce((sum, order) => {
      const refundP0Part = order.p2_orderAmount > 0
        ? order.totalRefund * order.p0_supplierCost / order.p2_orderAmount
        : 0;
      const amount = order.p0_supplierCost - refundP0Part;
      return sum + Math.max(0, amount);
    }, 0);

  const availableFunds = actualRevenue - payableDistribution - payableSupplier;

  return {
    advancePayment,
    actualRevenue,
    platformProfit,
    payableDistribution,
    payableSupplier,
    availableFunds,
    platformDiscountContribution,
    bigBDiscountContribution,
  };
};

export function PlatformAccount() {
  // 模拟订单数据，包含PRD定义的核心金额、优惠、结算字段
  const [orders] = useState<OrderDetail[]>([
    {
      orderId: 'ORD-2025001',
      merchantName: '华东渠道A',
      hotelName: '上海外滩酒店',
      checkInDate: '2025-10-15',
      checkOutDate: '2025-10-17',
      settlementStatus: 'unsettled',
      orderStatus: 'completed',
      orderType: 'smallB',
      p0_supplierCost: 1200,
      p1_distributionPrice: 1320,
      p2_orderAmount: 1452,
      totalDiscount: 0,
      actualAmount: 1452,
      totalRefund: 0,
      platformDiscountContribution: 0,
      bigBDiscountContribution: 0,
      totalCommission: 69.99,
      commissionRate: 4.82,
    },
    {
      orderId: 'ORD-2025002',
      merchantName: '华北渠道B',
      hotelName: '北京王府井大酒店',
      checkInDate: '2025-11-05',
      checkOutDate: '2025-11-07',
      settlementStatus: 'unsettled',
      orderStatus: 'completed',
      orderType: 'smallB',
      p0_supplierCost: 900,
      p1_distributionPrice: 990,
      p2_orderAmount: 1089,
      totalDiscount: 0,
      actualAmount: 1089,
      totalRefund: 0,
      platformDiscountContribution: 0,
      bigBDiscountContribution: 0,
      totalCommission: 80.04,
      commissionRate: 7.35,
    },
    {
      orderId: 'ORD-2025003',
      merchantName: '华南渠道C',
      hotelName: '杭州西湖宾馆',
      checkInDate: '2025-10-20',
      checkOutDate: '2025-10-22',
      settlementStatus: 'unsettled',
      orderStatus: 'pending_checkin',
      orderType: 'bigB',
      p0_supplierCost: 800,
      p1_distributionPrice: 880,
      p2_orderAmount: 968,
      totalDiscount: 0,
      actualAmount: 968,
      totalRefund: 0,
      platformDiscountContribution: 0,
      bigBDiscountContribution: 0,
      totalCommission: 0,
      markupRate: 10.0,
    },
    {
      orderId: 'ORD-2025004',
      merchantName: '西南渠道D',
      hotelName: '深圳湾大酒店',
      checkInDate: '2025-10-25',
      checkOutDate: '2025-10-28',
      settlementStatus: 'settled',
      orderStatus: 'completed',
      orderType: 'bigB',
      p0_supplierCost: 1500,
      p1_distributionPrice: 1650,
      p2_orderAmount: 1815,
      totalDiscount: 0,
      actualAmount: 1815,
      totalRefund: 200,
      platformDiscountContribution: 0,
      bigBDiscountContribution: 0,
      totalCommission: 120,
      markupRate: 10.0,
    },
  ]);


  const [manualRecharge, setManualRecharge] = useState(0);

  const stats = useMemo(() => {
    const baseStats = computeStats(orders);
    return {
      ...baseStats,
      availableFunds: baseStats.availableFunds + manualRecharge,
    };
  }, [orders, manualRecharge]);

  // 处理充值
  const handleRecharge = (amount: number) => {
    setManualRecharge(prev => prev + amount);
  };


  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>平台账户</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 看板统计 */}
      <PlatformAccountDashboard stats={stats} onRecharge={handleRecharge} />

      {/* 订单明细表格 */}
      <OrderDetailsTable orders={orders} />
    </div>
  );
}

