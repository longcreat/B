// 业务单据管理 - Mock数据

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

// ==================== 订单退款记录 ====================

export type RefundType = 'full_refund' | 'partial_refund' | 'cancel_refund';
export type RefundStatus = 'processing' | 'success' | 'failed';
export type RefundTriggerMethod = 'auto' | 'manual';
export type RefundChannel = 'wechat' | 'alipay' | 'bank' | 'other';
export type RefundPath = 'original' | 'offline';
export type RelatedObjectType = 'bigb' | 'smallb';
export type BusinessModel = 'saas' | 'mcp' | 'affiliate';
export type OperatorRole = 'customer_service' | 'finance' | 'system';

export interface OrderRefundRecord {
  refundId: string;
  orderId: string;
  relatedObjectId: string;
  relatedObjectName: string;
  relatedObjectType: RelatedObjectType;
  managingBigB?: string;
  businessModel: BusinessModel;
  refundType: RefundType;
  refundTriggerMethod: RefundTriggerMethod;
  affectsSettlement: boolean;
  orderTotalPrice: number;
  customerActualPayment: number;
  refundAmount: number;
  refundSupplierPrice: number;
  refundDistributionPrice: number;
  refundCommission?: number;
  refundChannel: RefundChannel;
  refundPath: RefundPath;
  refundStatus: RefundStatus;
  refundTime: string;
  refundCompletedTime?: string;
  refundNo?: string;
  refundProof?: string;
  refundReason: string;
  operatorId: string;
  operatorName: string;
  operatorRole: OperatorRole;
  remark?: string;
}

export function getMockOrderRefundRecords(): OrderRefundRecord[] {
  const records: OrderRefundRecord[] = [];
  const refundTypes: RefundType[] = ['full_refund', 'partial_refund', 'cancel_refund'];
  const refundStatuses: RefundStatus[] = ['processing', 'success', 'failed'];
  const refundTriggerMethods: RefundTriggerMethod[] = ['auto', 'manual'];
  const refundChannels: RefundChannel[] = ['wechat', 'alipay', 'bank', 'other'];
  const refundPaths: RefundPath[] = ['original', 'offline'];
  const relatedObjectTypes: RelatedObjectType[] = ['bigb', 'smallb'];
  const businessModels: BusinessModel[] = ['saas', 'mcp', 'affiliate'];
  const operatorRoles: OperatorRole[] = ['customer_service', 'finance', 'system'];
  const customers = ['张三的旅游工作室', '李四的酒店预订', '王五的旅游服务', '赵六的酒店代理', '孙七的旅游平台'];
  const managingBigBs = ['AIGO渠道大B', '华东渠道大B', '华北渠道大B'];
  
  for (let i = 0; i < 45; i++) {
    const refundType = refundTypes[i % 3];
    const refundStatus = refundStatuses[i % 3];
    const refundTriggerMethod = refundTriggerMethods[i % 2];
    const refundChannel = refundChannels[i % 4];
    const refundPath = refundPaths[i % 2];
    const relatedObjectType = relatedObjectTypes[i % 2];
    const businessModel = businessModels[i % 3];
    const operatorRole = operatorRoles[i % 3];
    const customer = customers[i % 5];
    const managingBigB = relatedObjectType === 'smallb' ? managingBigBs[i % 3] : undefined;
    const day = (i % 30) + 1;
    const month = Math.floor(i / 30) % 12 + 1;
    const year = 2025;
    
    const orderTotalPrice = Math.floor(Math.random() * 5000) + 1000;
    const customerActualPayment = orderTotalPrice - Math.floor(Math.random() * 200);
    const refundAmount = refundType === 'full_refund' ? orderTotalPrice : Math.floor(orderTotalPrice * (0.3 + Math.random() * 0.5));
    
    // 计算退款金额拆分
    const supplierCostRatio = 0.75; // P0/P2比例
    const distributionPriceRatio = 0.85; // P1/P2比例
    const refundSupplierPrice = Math.floor(refundAmount * supplierCostRatio);
    const refundDistributionPrice = Math.floor(refundAmount * distributionPriceRatio);
    const refundCommission = relatedObjectType === 'smallb' && businessModel === 'affiliate' ? 
      Math.floor(refundAmount * 0.05) : undefined;
    
    const affectsSettlement = i % 3 !== 0; // 大部分影响结算
    
    const refundReasonMap = {
      full_refund: '客户取消订单',
      partial_refund: '客户投诉，部分退款',
      cancel_refund: '订单取消退款'
    };
    
    const refundTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`;
    const completedTime = refundStatus === 'success' ? 
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(11 + (i % 10)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00` : undefined;
    
    const operatorNameMap = {
      customer_service: '客服-王五',
      finance: '财务-李四',
      system: '系统'
    };
    
    records.push({
      refundId: `REFUND-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      orderId: `ORD-${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      relatedObjectId: `CUSTOMER-${String(i % 5 + 1).padStart(3, '0')}`,
      relatedObjectName: customer,
      relatedObjectType,
      managingBigB,
      businessModel,
      refundType,
      refundTriggerMethod,
      affectsSettlement,
      orderTotalPrice,
      customerActualPayment,
      refundAmount,
      refundSupplierPrice,
      refundDistributionPrice,
      refundCommission,
      refundChannel,
      refundPath,
      refundStatus,
      refundTime,
      refundCompletedTime: completedTime,
      refundNo: refundStatus === 'success' ? `RF${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}` : undefined,
      refundProof: refundPath === 'offline' ? `https://example.com/proof/${i + 1}.jpg` : undefined,
      refundReason: refundReasonMap[refundType],
      operatorId: 'SERVICE-001',
      operatorName: operatorNameMap[operatorRole],
      operatorRole,
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

