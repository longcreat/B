// 对账管理相关的 mock 数据

export type ReconciliationType = 
  | 'supplier_cost' // 供应商成本对账
  | 'payment_channel' // 支付渠道对账
  | 'withdrawal' // 提现对账
  | 'invoice'; // 开票对账

// 供应商成本对账状态
export type SupplierCostReconciliationStatus = 
  | 'pending' // 未对账
  | 'reconciling' // 对账中
  | 'reconciled' // 已对账
  | 'difference' // 对账差异
  | 'resolved'; // 已处理

// 支付渠道对账状态
export type PaymentChannelReconciliationStatus = 
  | 'reconciling' // 对账中
  | 'balanced' // 已对平
  | 'platform_more' // 平台多
  | 'channel_more' // 渠道多
  | 'resolved'; // 已处理

// 提现对账状态
export type WithdrawalReconciliationStatus = 
  | 'balanced' // 已对平
  | 'withdrawal_more' // 打款多
  | 'account_more' // 账本多
  | 'resolved'; // 已处理

// 开票对账状态
export type InvoiceReconciliationStatus = 
  | 'balanced' // 已对平
  | 'invoice_more' // 开票多
  | 'cost_more' // 成本多
  | 'resolved'; // 已处理

// 统一的对账状态类型（用于类型兼容）
export type ReconciliationStatus = 
  | SupplierCostReconciliationStatus
  | PaymentChannelReconciliationStatus
  | WithdrawalReconciliationStatus
  | InvoiceReconciliationStatus;

// 供应商成本对账
export interface SupplierCostReconciliation {
  id: string;
  type: 'supplier_cost';
  orderId: string;
  supplierName: string;
  supplierBillNo?: string;
  systemP0: number;
  supplierBillAmount: number;
  difference: number;
  status: SupplierCostReconciliationStatus;
  reconciledAt?: string; // 对账日期时间 YYYY-MM-DD HH:mm:ss
  reconciledBy?: string;
  differenceReason?: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string; // 创建日期时间 YYYY-MM-DD HH:mm:ss，列表显示时取日期部分 YYYY-MM-DD
}

// 支付渠道差异订单
export interface PaymentChannelDifferenceOrder {
  orderId: string;
  platformAmount: number;
  channelAmount: number;
  difference: number;
  type: 'platform_only' | 'channel_only' | 'amount_diff'; // 平台独有、渠道独有、金额差异
  platformOrderTime?: string;
  channelOrderTime?: string;
}

// 支付渠道对账
export interface PaymentChannelReconciliation {
  id: string;
  type: 'payment_channel';
  reconciliationDate: string; // 对账日期 YYYY-MM-DD（年月日）
  channel: 'wechat' | 'alipay' | 'bank';
  platformOrderCount: number;
  platformOrderAmount: number;
  channelOrderCount: number;
  channelOrderAmount: number;
  differenceAmount: number;
  differenceOrderCount: number;
  status: PaymentChannelReconciliationStatus;
  reconciledAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  // 差异明细（仅当有差异时）
  differenceOrders?: PaymentChannelDifferenceOrder[];
}

// 提现打款记录
export interface WithdrawalRecord {
  withdrawalId: string;
  amount: number;
  createdAt: string;
  status: string;
}

// 账本扣减记录
export interface AccountDeductionRecord {
  orderId: string;
  amount: number;
  deductedAt: string;
  orderStatus: string;
}

// 提现对账
export interface WithdrawalReconciliation {
  id: string;
  type: 'withdrawal';
  reconciliationMonth: string; // 对账月份 YYYY-MM（年月格式）
  partnerId: string;
  partnerName: string;
  withdrawalAmount: number;
  accountDeductionAmount: number;
  differenceAmount: number;
  status: WithdrawalReconciliationStatus;
  reconciledAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  // 明细（仅当有差异时显示）
  withdrawalRecords?: WithdrawalRecord[];
  accountDeductions?: AccountDeductionRecord[];
}

// 开票明细
export interface InvoiceDetail {
  invoiceId: string;
  amount: number;
  invoiceTime: string;
  status: string;
}

// 成本/利润明细
export interface CostProfitDetail {
  orderId: string;
  amount: number;
  type: 'supplier_cost' | 'partner_profit' | 'platform_profit';
  orderTime: string;
}

// 开票对账
export interface InvoiceReconciliation {
  id: string;
  type: 'invoice';
  reconciliationMonth: string; // 对账月份 YYYY-MM（年月格式）
  customerInvoiceAmount: number;
  supplierCostAmount: number;
  partnerProfitAmount: number;
  platformProfitAmount: number;
  totalCostProfit: number;
  differenceAmount: number;
  status: InvoiceReconciliationStatus;
  reconciledAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  // 明细（仅当有差异时显示）
  invoiceDetails?: InvoiceDetail[];
  costProfitDetails?: CostProfitDetail[];
}

export type Reconciliation = 
  | SupplierCostReconciliation
  | PaymentChannelReconciliation
  | WithdrawalReconciliation
  | InvoiceReconciliation;

/**
 * 获取模拟对账数据
 */
export function getMockReconciliations(): Reconciliation[] {
  const reconciliations: Reconciliation[] = [];
  const now = new Date();
  const baseTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90天前

  // 供应商成本对账数据
  const suppliers = ['供应商A', '供应商B', '供应商C', '供应商D'];
  const orders = ['ORD-2025001', 'ORD-2025002', 'ORD-2025003', 'ORD-2025004', 'ORD-2025005'];
  
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(baseTime.getTime() + daysAgo * 24 * 60 * 60 * 1000);
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const orderId = orders[Math.floor(Math.random() * orders.length)];
    const systemP0 = Math.floor(Math.random() * 5000) + 500;
    const difference = Math.random() < 0.3 ? (Math.random() * 100 - 50) : 0; // 30%概率有差异
    const supplierBillAmount = systemP0 + difference;
    
    let status: SupplierCostReconciliationStatus = 'pending';
    if (daysAgo < 30) {
      status = Math.random() < 0.3 ? 'difference' : 'reconciled';
    } else if (daysAgo < 60) {
      status = Math.random() < 0.2 ? 'resolved' : 'reconciled';
    } else {
      status = 'reconciled';
    }

    reconciliations.push({
      id: `SCR-${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`,
      type: 'supplier_cost',
      orderId,
      supplierName: supplier,
      supplierBillNo: `BILL-${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      systemP0,
      supplierBillAmount,
      difference,
      status,
      reconciledAt: status !== 'pending' ? createdAt.toISOString().replace('T', ' ').substring(0, 19) : undefined,
      reconciledBy: status !== 'pending' ? '财务人员' : undefined,
      differenceReason: status === 'difference' ? '供应商账单包含附加费用' : undefined,
      resolution: status === 'resolved' ? '已与供应商确认，补充记录' : undefined,
      resolvedAt: status === 'resolved' ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : undefined,
      resolvedBy: status === 'resolved' ? '财务主管' : undefined,
      createdAt: createdAt.toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  // 支付渠道对账数据（每日一条）
  const channels: ('wechat' | 'alipay' | 'bank')[] = ['wechat', 'alipay', 'bank'];
  for (let i = 0; i < 30; i++) {
    const daysAgo = i;
    const reconciliationDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const platformOrderCount = Math.floor(Math.random() * 100) + 50;
    const platformOrderAmount = Math.floor(Math.random() * 500000) + 100000;
    const difference = Math.random() < 0.1 ? (Math.random() * 1000 - 500) : 0; // 10%概率有差异
    const channelOrderAmount = platformOrderAmount + difference;
    const channelOrderCount = platformOrderCount + (difference !== 0 ? (Math.random() < 0.5 ? -1 : 1) : 0);
    
    let status: PaymentChannelReconciliationStatus = 'reconciling';
    if (daysAgo === 0) {
      status = 'reconciling';
    } else if (difference === 0) {
      status = 'balanced';
    } else {
      // 根据差异方向判断是平台多还是渠道多
      if (difference > 0) {
        status = daysAgo < 3 ? 'platform_more' : 'resolved';
      } else {
        status = daysAgo < 3 ? 'channel_more' : 'resolved';
      }
    }

    reconciliations.push({
      id: `PCR-${reconciliationDate.getFullYear()}${String(reconciliationDate.getMonth() + 1).padStart(2, '0')}${String(reconciliationDate.getDate()).padStart(2, '0')}-${channel}`,
      type: 'payment_channel',
      reconciliationDate: reconciliationDate.toISOString().split('T')[0],
      channel,
      platformOrderCount,
      platformOrderAmount,
      channelOrderCount,
      channelOrderAmount,
      differenceAmount: Math.abs(difference),
      differenceOrderCount: difference !== 0 ? Math.abs(channelOrderCount - platformOrderCount) : 0,
      status,
      reconciledAt: status !== 'reconciling' ? reconciliationDate.toISOString().replace('T', ' ').substring(0, 19) : undefined,
      resolvedAt: status === 'resolved' ? new Date(reconciliationDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : undefined,
      resolvedBy: status === 'resolved' ? '财务人员' : undefined,
      createdAt: reconciliationDate.toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  // 提现对账数据（每月一条，按用户）
  const partners = [
    { id: 'P001', name: '张三的旅游工作室' },
    { id: 'P002', name: '旅游达人小李' },
    { id: 'P003', name: '某某商旅服务有限公司' },
    { id: 'P004', name: '赵六' },
  ];
  
  for (let month = 0; month < 3; month++) {
    const reconciliationMonth = new Date(now.getFullYear(), now.getMonth() - month, 1);
    const monthStr = `${reconciliationMonth.getFullYear()}-${String(reconciliationMonth.getMonth() + 1).padStart(2, '0')}`;
    
    for (const partner of partners) {
      const withdrawalAmount = Math.floor(Math.random() * 50000) + 10000;
      const difference = Math.random() < 0.15 ? (Math.random() * 1000 - 500) : 0; // 15%概率有差异
      const accountDeductionAmount = withdrawalAmount + difference;
      
      let status: WithdrawalReconciliationStatus = 'balanced';
      if (difference !== 0) {
        if (difference > 0) {
          status = month === 0 ? 'withdrawal_more' : 'resolved';
        } else {
          status = month === 0 ? 'account_more' : 'resolved';
        }
      }

      // 生成明细（如果有差异）
      let withdrawalRecords: WithdrawalRecord[] | undefined;
      let accountDeductions: AccountDeductionRecord[] | undefined;
      if (difference !== 0 && (status === 'withdrawal_more' || status === 'account_more')) {
        withdrawalRecords = [
          {
            withdrawalId: `WD-${monthStr}-${partner.id}-001`,
            amount: Math.floor(withdrawalAmount * 0.6),
            createdAt: new Date(reconciliationMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            status: 'success',
          },
          {
            withdrawalId: `WD-${monthStr}-${partner.id}-002`,
            amount: Math.floor(withdrawalAmount * 0.4),
            createdAt: new Date(reconciliationMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            status: 'success',
          },
        ];
        accountDeductions = [
          {
            orderId: 'ORD-2025001',
            amount: Math.floor(accountDeductionAmount * 0.3),
            deductedAt: new Date(reconciliationMonth.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            orderStatus: 'completed',
          },
          {
            orderId: 'ORD-2025002',
            amount: Math.floor(accountDeductionAmount * 0.4),
            deductedAt: new Date(reconciliationMonth.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            orderStatus: 'completed',
          },
          {
            orderId: 'ORD-2025003',
            amount: Math.floor(accountDeductionAmount * 0.3),
            deductedAt: new Date(reconciliationMonth.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
            orderStatus: 'completed',
          },
        ];
      }

      reconciliations.push({
        id: `WR-${monthStr}-${partner.id}`,
        type: 'withdrawal',
        reconciliationMonth: monthStr,
        partnerId: partner.id,
        partnerName: partner.name,
        withdrawalAmount,
        accountDeductionAmount,
        differenceAmount: Math.abs(difference),
        status,
        reconciledAt: reconciliationMonth.toISOString().replace('T', ' ').substring(0, 19),
        resolvedAt: status === 'resolved' ? new Date(reconciliationMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : undefined,
        resolvedBy: status === 'resolved' ? '财务人员' : undefined,
        createdAt: reconciliationMonth.toISOString().replace('T', ' ').substring(0, 19),
        withdrawalRecords,
        accountDeductions,
      });
    }
  }

  // 开票对账数据（每月一条）
  for (let month = 0; month < 3; month++) {
    const reconciliationMonth = new Date(now.getFullYear(), now.getMonth() - month, 1);
    const monthStr = `${reconciliationMonth.getFullYear()}-${String(reconciliationMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const customerInvoiceAmount = Math.floor(Math.random() * 1000000) + 500000;
    const supplierCostAmount = Math.floor(customerInvoiceAmount * 0.7);
    const partnerProfitAmount = Math.floor(customerInvoiceAmount * 0.15);
    const platformProfitAmount = customerInvoiceAmount - supplierCostAmount - partnerProfitAmount;
    const totalCostProfit = supplierCostAmount + partnerProfitAmount + platformProfitAmount;
    const difference = Math.random() < 0.1 ? (Math.random() * 10000 - 5000) : 0; // 10%概率有差异
    const adjustedTotal = totalCostProfit + difference;
    
    let status: InvoiceReconciliationStatus = 'balanced';
    if (difference !== 0) {
      if (difference > 0) {
        status = month === 0 ? 'invoice_more' : 'resolved';
      } else {
        status = month === 0 ? 'cost_more' : 'resolved';
      }
    }

    // 生成明细（如果有差异）
    let invoiceDetails: InvoiceDetail[] | undefined;
    let costProfitDetails: CostProfitDetail[] | undefined;
    if (difference !== 0 && (status === 'invoice_more' || status === 'cost_more')) {
      invoiceDetails = [
        {
          invoiceId: 'INV-20251001-001',
          amount: Math.floor(customerInvoiceAmount * 0.3),
          invoiceTime: new Date(reconciliationMonth.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
          status: 'invoice_success_email_sent',
        },
        {
          invoiceId: 'INV-20251015-002',
          amount: Math.floor(customerInvoiceAmount * 0.4),
          invoiceTime: new Date(reconciliationMonth.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
          status: 'invoice_success_email_sent',
        },
        {
          invoiceId: 'INV-20251028-003',
          amount: Math.floor(customerInvoiceAmount * 0.3),
          invoiceTime: new Date(reconciliationMonth.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
          status: 'invoice_success_email_sent',
        },
      ];
      costProfitDetails = [
        {
          orderId: 'ORD-2025001',
          amount: Math.floor(supplierCostAmount * 0.2),
          type: 'supplier_cost',
          orderTime: new Date(reconciliationMonth.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          orderId: 'ORD-2025002',
          amount: Math.floor(partnerProfitAmount * 0.3),
          type: 'partner_profit',
          orderTime: new Date(reconciliationMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
        {
          orderId: 'ORD-2025003',
          amount: Math.floor(platformProfitAmount * 0.25),
          type: 'platform_profit',
          orderTime: new Date(reconciliationMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        },
      ];
    }

    reconciliations.push({
      id: `IR-${monthStr}`,
      type: 'invoice',
      reconciliationMonth: monthStr,
      customerInvoiceAmount,
      supplierCostAmount,
      partnerProfitAmount,
      platformProfitAmount,
      totalCostProfit: adjustedTotal,
      differenceAmount: Math.abs(difference),
      status,
      reconciledAt: reconciliationMonth.toISOString().replace('T', ' ').substring(0, 19),
      resolvedAt: status === 'resolved' ? new Date(reconciliationMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19) : undefined,
      resolvedBy: status === 'resolved' ? '财务人员' : undefined,
      createdAt: reconciliationMonth.toISOString().replace('T', ' ').substring(0, 19),
      invoiceDetails,
      costProfitDetails,
    });
  }

  // 按创建时间倒序排列
  return reconciliations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

