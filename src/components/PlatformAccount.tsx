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
import { CustomerCompensationTable, type CustomerCompensation } from './finance/CustomerCompensationTable';
import { TransactionHistoryPanel, type Transaction, type TransactionType } from './finance/TransactionHistoryPanel';

type DashboardAggregate = {
  advancePayment: number;
  actualRevenue: number;
  estimatedProfit: number;
  actualProfit: number;
  payableBigB: number;
  payableSmallB: number;
  payableSupplier: number;
  availableFunds: number;
  platformDiscountContribution: number;
  bigBDiscountContribution: number;
};

const computeStats = (
  ordersData: OrderDetail[],
): DashboardAggregate => {
  // 订单预收款 = 未完结订单的实收金额累加（实收金额 = 实付金额 × (1 - 0.0025)）
  const advancePayment = ordersData
    .filter(order => order.orderStatus === 'pending_checkin')
    .reduce((sum, order) => sum + (order.actualAmount * (1 - 0.0025)), 0);

  const actualRevenue = ordersData
    .filter(order => order.orderStatus === 'completed')
    .reduce((sum, order) => sum + (order.actualAmount - order.totalRefund), 0);

  // 平台预估利润：未完结订单的利润
  const estimatedProfit = ordersData
    .filter(order => order.orderStatus === 'pending_checkin')
    .reduce((sum, order) => {
      const gross = order.p1_distributionPrice - order.p0_supplierCost;
      const refundProfit = order.p2_orderAmount > 0
        ? order.totalRefund * (order.p1_distributionPrice - order.p0_supplierCost) / order.p2_orderAmount
        : 0;
      const platformContribution = order.platformDiscountContribution || 0;
      const paymentFee = order.actualAmount * 0.0025;
      return sum + (gross - refundProfit - platformContribution - paymentFee);
    }, 0);

  // 平台实际利润：已完结订单的利润
  const actualProfit = ordersData
    .filter(order => order.orderStatus === 'completed')
    .reduce((sum, order) => {
      const gross = order.p1_distributionPrice - order.p0_supplierCost;
      const refundProfit = order.p2_orderAmount > 0
        ? order.totalRefund * (order.p1_distributionPrice - order.p0_supplierCost) / order.p2_orderAmount
        : 0;
      const platformContribution = order.platformDiscountContribution || 0;
      const paymentFee = order.actualAmount * 0.0025;
      return sum + (gross - refundProfit - platformContribution - paymentFee);
    }, 0);

  const platformDiscountContribution = ordersData.reduce(
    (sum, order) => sum + order.platformDiscountContribution,
    0,
  );

  const bigBDiscountContribution = ordersData.reduce(
    (sum, order) => sum + order.bigBDiscountContribution,
    0,
  );

  // 应付大B佣金：大B订单的利润部分
  const payableBigB = ordersData
    .filter(order => order.orderStatus === 'completed' && order.orderType === 'bigB')
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

  // 应付小B佣金：小B订单的佣金部分
  const payableSmallB = ordersData
    .filter(order => order.orderStatus === 'completed' && order.orderType === 'smallB')
    .reduce((sum, order) => sum + (order.totalCommission || 0), 0);

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

  const availableFunds = actualRevenue - payableBigB - payableSmallB - payableSupplier;

  return {
    advancePayment,
    actualRevenue,
    estimatedProfit,
    actualProfit,
    payableBigB,
    payableSmallB,
    payableSupplier,
    availableFunds,
    platformDiscountContribution,
    bigBDiscountContribution,
  };
};

export function PlatformAccount() {
  const [showTransactionPanel, setShowTransactionPanel] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType>('payableBigB');
  const [manualRecharge, setManualRecharge] = useState(0);

  // Mock交易历史数据
  const [transactions, setTransactions] = useState<Record<TransactionType, Transaction[]>>({
    payableBigB: [
      {
        id: 'TXN-001',
        timestamp: '2025-12-20 14:30:00',
        type: 'decrease',
        amount: 500.00,
        description: '大B提现申请已打款',
        relatedId: 'WA-2025003',
        operator: '财务-李明',
      },
      {
        id: 'TXN-002',
        timestamp: '2025-12-15 10:20:00',
        type: 'increase',
        amount: 1200.50,
        description: '订单完结，增加应付大B佣金',
        relatedId: 'ORD-2025001',
      },
      {
        id: 'TXN-003',
        timestamp: '2025-12-10 16:45:00',
        type: 'decrease',
        amount: 800.00,
        description: '大B提现申请已打款',
        relatedId: 'WA-2025001',
        operator: '财务-张华',
      },
    ],
    payableSmallB: [
      {
        id: 'TXN-004',
        timestamp: '2025-12-18 11:15:00',
        type: 'decrease',
        amount: 300.00,
        description: '小B提现申请已打款',
        relatedId: 'WA-2025002',
        operator: '财务-李明',
      },
      {
        id: 'TXN-005',
        timestamp: '2025-12-12 09:30:00',
        type: 'increase',
        amount: 450.03,
        description: '订单完结，增加应付小B佣金',
        relatedId: 'ORD-2025002',
      },
    ],
    payableSupplier: [
      {
        id: 'TXN-006',
        timestamp: '2025-12-22 15:20:00',
        type: 'decrease',
        amount: 2100.00,
        description: '供应商账单已支付',
        relatedId: 'BILL-2025-12-道旅',
        operator: '财务-王芳',
      },
      {
        id: 'TXN-007',
        timestamp: '2025-12-19 13:40:00',
        type: 'decrease',
        amount: 1500.00,
        description: '供应商账单已支付',
        relatedId: 'BILL-2025-12-携程',
        operator: '财务-李明',
      },
      {
        id: 'TXN-008',
        timestamp: '2025-12-16 10:00:00',
        type: 'increase',
        amount: 3434.71,
        description: '订单完结，增加应付供应商费用',
        relatedId: 'ORD-2025004',
      },
    ],
    availableFunds: [
      {
        id: 'TXN-009',
        timestamp: '2025-12-21 16:00:00',
        type: 'increase',
        amount: 5000.00,
        description: '平台充值',
        operator: '财务-张华',
      },
      {
        id: 'TXN-010',
        timestamp: '2025-12-20 14:30:00',
        type: 'decrease',
        amount: 500.00,
        description: '客户赔付',
        relatedId: 'COMP-003',
        operator: '财务-李明',
      },
      {
        id: 'TXN-011',
        timestamp: '2025-12-18 11:15:00',
        type: 'decrease',
        amount: 2000.00,
        description: '公司提现',
        operator: '财务-王芳',
      },
      {
        id: 'TXN-012',
        timestamp: '2025-12-15 09:30:00',
        type: 'decrease',
        amount: 300.00,
        description: '客户赔付',
        relatedId: 'COMP-002',
        operator: '财务-张华',
      },
    ],
  });

  // 模拟订单数据，包含PRD定义的核心金额、优惠、结算字段
  // 处理添加新交易记录
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const id = `TXN-${Date.now()}`;

    const transaction: Transaction = {
      ...newTransaction,
      id,
      timestamp,
    };

    setTransactions(prev => ({
      ...prev,
      availableFunds: [transaction, ...prev.availableFunds],
    }));

    // 更新可用资金（减少）
    setManualRecharge(prev => prev - newTransaction.amount);
  };

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



  // Mock数据 - 客户赔付明细
  const [compensations] = useState<CustomerCompensation[]>([
    {
      id: 'COMP-001',
      compensationTime: '2025-10-15 14:30:00',
      compensationTarget: '张三',
      amount: 500,
      reason: '酒店房间设施损坏，客户体验不佳',
      status: 'completed',
    },
    {
      id: 'COMP-002',
      compensationTime: '2025-11-02 10:20:00',
      compensationTarget: '李四',
      amount: 300,
      reason: '酒店超售，导致客户无法入住',
      status: 'completed',
    },
    {
      id: 'COMP-003',
      compensationTime: '2025-11-20 16:45:00',
      compensationTarget: '王五',
      amount: 200,
      reason: '酒店服务态度恶劣，客户投诉',
      status: 'approved',
    },
    {
      id: 'COMP-004',
      compensationTime: '2025-12-05 09:15:00',
      compensationTarget: '赵六',
      amount: 150,
      reason: '酒店房间与描述不符',
      status: 'pending',
    },
  ]);

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

  // 处理查看交易历史
  const handleViewTransactionHistory = (type: TransactionType) => {
    setSelectedTransactionType(type);
    setShowTransactionPanel(true);
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
      <PlatformAccountDashboard 
        stats={stats} 
        onRecharge={handleRecharge}
        onViewTransactionHistory={handleViewTransactionHistory}
      />

      {/* 订单明细表格 */}
      <OrderDetailsTable orders={orders} />

      {/* 客户赔付明细表格 */}
      <CustomerCompensationTable compensations={compensations} />

      {/* 交易历史面板 */}
      <TransactionHistoryPanel
        isOpen={showTransactionPanel}
        onClose={() => setShowTransactionPanel(false)}
        transactionType={selectedTransactionType}
        transactions={transactions[selectedTransactionType]}
        onAddTransaction={selectedTransactionType === 'availableFunds' ? handleAddTransaction : undefined}
      />
    </div>
  );
}

