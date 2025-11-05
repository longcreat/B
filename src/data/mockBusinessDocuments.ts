// 业务单据管理 - Mock数据

// ==================== 违约扣费记录 ====================

export type ViolationFeeType = 'dispute_deduction' | 'no_show_fee' | 'violation_fee' | 'other';
export type ViolationFeeStatus = 'pending' | 'deducted' | 'cancelled';
export type AccountType = 'points' | 'cash';

export interface ViolationFeeRecord {
  feeId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  feeType: ViolationFeeType;
  feeReason: string;
  feeAmount: number;
  feeTime: string;
  feeStatus: ViolationFeeStatus;
  accountType: AccountType;
  operatorId: string;
  operatorName: string;
  remark?: string;
}

export function getMockViolationFeeRecords(): ViolationFeeRecord[] {
  const records: ViolationFeeRecord[] = [];
  const feeTypes: ViolationFeeType[] = ['dispute_deduction', 'no_show_fee', 'violation_fee', 'other'];
  const statuses: ViolationFeeStatus[] = ['pending', 'deducted', 'cancelled'];
  const accountTypes: AccountType[] = ['points', 'cash'];
  const customers = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务', '赵六的酒店代理', '孙七的旅游平台'];
  
  for (let i = 0; i < 45; i++) {
    const feeType = feeTypes[i % 4];
    const status = statuses[i % 3];
    const accountType = accountTypes[i % 2];
    const customer = customers[i % 5];
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const feeAmount = Math.floor(Math.random() * 5000) + 100;
    const feeReasonMap = {
      dispute_deduction: '订单结算后发生客诉，全额退款',
      no_show_fee: '客户未入住，产生No-Show费用',
      violation_fee: '违反平台规则，扣除违约金',
      other: '其他违约扣费'
    };
    
    records.push({
      feeId: `FEE-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: `CUSTOMER-${String(i % 5 + 1).padStart(3, '0')}`,
      relatedObjectName: customer,
      feeType,
      feeReason: feeReasonMap[feeType],
      feeAmount: -feeAmount,
      feeTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`,
      feeStatus: status,
      accountType,
      operatorId: 'FINANCE-001',
      operatorName: '财务-李四',
      remark: status === 'deducted' ? '已通知客户' : undefined,
    });
  }
  
  return records;
}

// ==================== 订单交易记录 ====================

export type TransactionType = 'order_payment' | 'order_refund' | 'order_supplement' | 'other';
export type PaymentChannel = 'wechat' | 'alipay' | 'bank' | 'other';
export type PaymentStatus = 'processing' | 'success' | 'failed' | 'refunded';

export interface OrderTransaction {
  transactionId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  transactionType: TransactionType;
  transactionAmount: number;
  paymentChannel: PaymentChannel;
  paymentStatus: PaymentStatus;
  transactionTime: string;
  transactionNo?: string;
  remark?: string;
}

export function getMockOrderTransactions(): OrderTransaction[] {
  const records: OrderTransaction[] = [];
  const transactionTypes: TransactionType[] = ['order_payment', 'order_refund', 'order_supplement', 'other'];
  const paymentChannels: PaymentChannel[] = ['wechat', 'alipay', 'bank', 'other'];
  const paymentStatuses: PaymentStatus[] = ['processing', 'success', 'failed', 'refunded'];
  const customers = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务', '赵六的酒店代理', '孙七的旅游平台'];
  
  for (let i = 0; i < 50; i++) {
    const transactionType = transactionTypes[i % 4];
    const paymentChannel = paymentChannels[i % 4];
    const paymentStatus = paymentStatuses[i % 4];
    const customer = customers[i % 5];
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const amount = Math.floor(Math.random() * 5000) + 500;
    const transactionAmount = transactionType === 'order_refund' ? -amount : amount;
    
    records.push({
      transactionId: `TXN-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: `CUSTOMER-${String(i % 5 + 1).padStart(3, '0')}`,
      relatedObjectName: customer,
      transactionType,
      transactionAmount,
      paymentChannel,
      paymentStatus,
      transactionTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`,
      transactionNo: paymentChannel === 'wechat' ? `WX${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}` : 
                     paymentChannel === 'alipay' ? `ALI${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}` :
                     `BANK${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
      remark: paymentStatus === 'failed' ? '支付失败，请重试' : undefined,
    });
  }
  
  return records;
}

// ==================== 订单改价记录 ====================

export type PriceChangeType = 'price_increase' | 'price_decrease' | 'price_correction';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface OrderPriceChangeRecord {
  priceChangeId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  changeType: PriceChangeType;
  originalAmount: number;
  newAmount: number;
  changeAmount: number;
  changeReason: string;
  changeTime: string;
  operatorId: string;
  operatorName: string;
  approvalStatus: ApprovalStatus;
  approverId?: string;
  approverName?: string;
  remark?: string;
}

export function getMockOrderPriceChangeRecords(): OrderPriceChangeRecord[] {
  const records: OrderPriceChangeRecord[] = [];
  const changeTypes: PriceChangeType[] = ['price_increase', 'price_decrease', 'price_correction'];
  const approvalStatuses: ApprovalStatus[] = ['pending', 'approved', 'rejected'];
  const customers = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务', '赵六的酒店代理', '孙七的旅游平台'];
  
  for (let i = 0; i < 40; i++) {
    const changeType = changeTypes[i % 3];
    const approvalStatus = approvalStatuses[i % 3];
    const customer = customers[i % 5];
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const originalAmount = Math.floor(Math.random() * 5000) + 1000;
    const changePercent = (Math.random() * 0.2 - 0.1); // -10% 到 +10%
    const changeAmount = Math.floor(originalAmount * changePercent);
    const newAmount = originalAmount + changeAmount;
    
    const changeReasonMap = {
      price_increase: '客户要求升级房型，增加费用',
      price_decrease: '客户投诉，补偿差价',
      price_correction: '价格计算错误，修正价格'
    };
    
    records.push({
      priceChangeId: `PRICE-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: `CUSTOMER-${String(i % 5 + 1).padStart(3, '0')}`,
      relatedObjectName: customer,
      changeType,
      originalAmount,
      newAmount,
      changeAmount,
      changeReason: changeReasonMap[changeType],
      changeTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`,
      operatorId: 'SERVICE-001',
      operatorName: '客服-王五',
      approvalStatus,
      approverId: approvalStatus !== 'pending' ? 'FINANCE-001' : undefined,
      approverName: approvalStatus !== 'pending' ? '财务-李四' : undefined,
      remark: approvalStatus === 'rejected' ? '改价原因不充分' : undefined,
    });
  }
  
  return records;
}

// ==================== 订单退款记录 ====================

export type RefundType = 'full_refund' | 'partial_refund' | 'cancel_refund';
export type RefundStatus = 'processing' | 'success' | 'failed';

export interface OrderRefundRecord {
  refundId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  refundType: RefundType;
  originalAmount: number;
  refundAmount: number;
  refundReason: string;
  refundStatus: RefundStatus;
  refundTime: string;
  refundCompletedTime?: string;
  refundNo?: string;
  operatorId: string;
  operatorName: string;
  remark?: string;
}

export function getMockOrderRefundRecords(): OrderRefundRecord[] {
  const records: OrderRefundRecord[] = [];
  const refundTypes: RefundType[] = ['full_refund', 'partial_refund', 'cancel_refund'];
  const refundStatuses: RefundStatus[] = ['processing', 'success', 'failed'];
  const customers = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务', '赵六的酒店代理', '孙七的旅游平台'];
  
  for (let i = 0; i < 45; i++) {
    const refundType = refundTypes[i % 3];
    const refundStatus = refundStatuses[i % 3];
    const customer = customers[i % 5];
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const originalAmount = Math.floor(Math.random() * 5000) + 1000;
    const refundAmount = refundType === 'full_refund' ? originalAmount : Math.floor(originalAmount * (0.3 + Math.random() * 0.5));
    
    const refundReasonMap = {
      full_refund: '客户取消订单',
      partial_refund: '客户投诉，部分退款',
      cancel_refund: '订单取消退款'
    };
    
    const refundTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`;
    const completedTime = refundStatus === 'success' ? 
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(11 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00` : undefined;
    
    records.push({
      refundId: `REFUND-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: `CUSTOMER-${String(i % 5 + 1).padStart(3, '0')}`,
      relatedObjectName: customer,
      refundType,
      originalAmount,
      refundAmount,
      refundReason: refundReasonMap[refundType],
      refundStatus,
      refundTime,
      refundCompletedTime: completedTime,
      refundNo: refundStatus === 'success' ? `RF${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}` : undefined,
      operatorId: 'SERVICE-001',
      operatorName: '客服-王五',
      remark: refundStatus === 'failed' ? '退款失败，请重新发起' : undefined,
    });
  }
  
  return records;
}

// ==================== 结算明细 ====================

export type SettlementObjectType = 'partner' | 'supplier';
export type SettlementType = 'partner_settlement' | 'supplier_settlement';
export type SettlementDetailStatus = 'pending' | 'credited' | 'paid' | 'completed';

export interface SettlementDetail {
  detailId: string;
  batchId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  settlementObjectType: SettlementObjectType;
  settlementType: SettlementType;
  settlementAmount: number;
  settlementPeriodStart: string;
  settlementPeriodEnd: string;
  settlementStatus: SettlementDetailStatus;
  settlementTime: string;
  creditedTime?: string;
  paidTime?: string;
  paymentNo?: string;
}

export function getMockSettlementDetails(): SettlementDetail[] {
  const records: SettlementDetail[] = [];
  const settlementTypes: SettlementType[] = ['partner_settlement', 'supplier_settlement'];
  const objectTypes: SettlementObjectType[] = ['partner', 'supplier'];
  const statuses: SettlementDetailStatus[] = ['pending', 'credited', 'paid', 'completed'];
  const partners = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务'];
  const suppliers = ['北京希尔顿酒店集团', '上海万豪酒店集团', '深圳洲际酒店集团'];
  
  // 预先生成批次ID列表，确保格式与结算批次一致
  const partnerBatchIds: string[] = [];
  const supplierBatchIds: string[] = [];
  
  // 生成客户结算批次ID（格式：BATCH-B-2025MMDD-XXX）
  for (let i = 0; i < 25; i++) {
    const month = Math.floor(1 + i / 4);
    const day = (i % 4) * 7 + 1;
    partnerBatchIds.push(`BATCH-B-2025${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`);
  }
  
  // 生成供应商结算批次ID（格式：BATCH-S-2025MM-XXX）
  for (let i = 0; i < 15; i++) {
    const month = (i % 12) + 1;
    supplierBatchIds.push(`BATCH-S-2025${String(month).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`);
  }
  
  for (let i = 0; i < 60; i++) {
    const settlementType = settlementTypes[i % 2];
    const objectType = objectTypes[i % 2];
    const status = statuses[i % 4];
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const settlementAmount = Math.floor(Math.random() * 10000) + 1000;
    const periodStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const periodEnd = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    
    const relatedObjectName = objectType === 'partner' ? partners[i % 3] : suppliers[i % 3];
    
    const settlementTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 10:00:00`;
    const creditedTime = (status === 'credited' || status === 'paid' || status === 'completed') ?
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 11:00:00` : undefined;
    const paidTime = (status === 'paid' || status === 'completed') ?
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 14:00:00` : undefined;
    
    // 使用与结算批次一致的批次ID格式
    const batchId = settlementType === 'partner_settlement' ? 
      partnerBatchIds[i % partnerBatchIds.length] :
      supplierBatchIds[i % supplierBatchIds.length];
    
    records.push({
      detailId: `SETTLE-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      batchId,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: objectType === 'partner' ? `PARTNER-${String(i % 3 + 1).padStart(3, '0')}` : `SUPPLIER-${String(i % 3 + 1).padStart(3, '0')}`,
      relatedObjectName,
      settlementObjectType: objectType,
      settlementType,
      settlementAmount,
      settlementPeriodStart: periodStart,
      settlementPeriodEnd: periodEnd,
      settlementStatus: status,
      settlementTime,
      creditedTime,
      paidTime,
      paymentNo: paidTime ? `BANK${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}` : undefined,
    });
  }
  
  return records;
}

