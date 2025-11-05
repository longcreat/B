// 结算批次相关的 mock 数据

export type PartnerBatchStatus = 'pending' | 'pending_approval' | 'approved' | 'credited' | 'completed' | 'rejected';
export type SupplierBatchStatus = 'pending' | 'pending_approval' | 'approved' | 'paid' | 'completed' | 'rejected';
export type PartnerType = 'individual' | 'influencer' | 'enterprise'; // 个人、博主、企业

export interface PartnerBatchOrder {
  orderId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  c2cAmount: number; // C端支付金额
  platformProfit: number; // 平台利润
  partnerProfit: number; // 小B利润
  orderStatus: string; // 订单状态
}

export interface SupplierBatchOrder {
  orderId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  c2cAmount: number; // C端支付金额
  supplierCost: number; // 供应商成本P0
  orderStatus: string; // 订单状态
}

// 小B结算批次
export interface PartnerSettlementBatch {
  batchId: string; // 批次号，格式：BATCH-B-YYYYMMDD-XXX
  partnerId: string; // 小B客户ID
  partnerName: string; // 小B客户名称
  partnerType: PartnerType; // 小B类型：个人、博主、企业
  settlementPeriodStart: string; // 结算周期开始日期 YYYY-MM-DD
  settlementPeriodEnd: string; // 结算周期结束日期 YYYY-MM-DD
  orderCount: number; // 订单数量
  settlementAmount: number; // 结算金额（小B利润）
  status: PartnerBatchStatus; // 批次状态
  createdAt: string; // 创建时间
  approvedAt?: string; // 审核时间
  approvedBy?: string; // 审核人ID
  approvalComment?: string; // 审核意见
  rejectionReason?: string; // 驳回原因
  creditedAt?: string; // 计入账户时间
  creditedBy?: string; // 计入操作人ID
  completedAt?: string; // 完成时间
  orders?: PartnerBatchOrder[]; // 批次包含的订单列表
  // 统计字段
  totalC2cAmount?: number; // 订单金额小计
  totalPlatformProfit?: number; // 平台利润总和
}

// 供应商结算批次
export interface SupplierSettlementBatch {
  batchId: string; // 批次号，格式：BATCH-S-YYYYMM-XXX
  supplierId: string; // 供应商ID
  supplierName: string; // 供应商名称
  settlementPeriodStart: string; // 结算周期开始日期 YYYY-MM-DD
  settlementPeriodEnd: string; // 结算周期结束日期 YYYY-MM-DD
  orderCount: number; // 订单数量
  settlementAmount: number; // 结算金额（供应商成本P0）
  status: SupplierBatchStatus; // 批次状态
  createdAt: string; // 创建时间
  approvedAt?: string; // 审核时间
  approvedBy?: string; // 审核人ID
  approvalComment?: string; // 审核意见
  rejectionReason?: string; // 驳回原因
  paidAt?: string; // 打款时间
  paidBy?: string; // 打款操作人ID
  paymentOrderId?: string; // 打款单号
  paymentStatus?: 'processing' | 'success' | 'failed'; // 打款状态
  completedAt?: string; // 完成时间
  orders?: SupplierBatchOrder[]; // 批次包含的订单列表
  // 统计字段
  totalC2cAmount?: number; // 订单金额小计
}

/**
 * 获取小B结算批次mock数据
 */
export function getMockPartnerSettlementBatches(): PartnerSettlementBatch[] {
  const batches: PartnerSettlementBatch[] = [];
  const partners = ['张三的旅游工作室', '李四商旅服务', '旅游达人小李', '王五的酒店预订', '赵六旅行社'];
  const partnerTypes: PartnerType[] = ['individual', 'influencer', 'enterprise', 'individual', 'influencer'];
  const partnerIds = ['PARTNER-001', 'PARTNER-002', 'PARTNER-003', 'PARTNER-004', 'PARTNER-005'];
  
  const statuses: PartnerBatchStatus[] = ['pending', 'pending_approval', 'approved', 'credited', 'completed', 'rejected'];
  
  for (let i = 0; i < 25; i++) {
    const partnerIndex = i % 5;
    const status = statuses[i % 6];
    const periodStart = new Date(2025, 0, 1 + i * 7);
    const periodEnd = new Date(2025, 0, 7 + i * 7);
    
    const orderCount = Math.floor(Math.random() * 20) + 5;
    const settlementAmount = Math.floor(Math.random() * 50000) + 5000;
    const totalC2cAmount = settlementAmount * 4 + Math.floor(Math.random() * 20000);
    const totalPlatformProfit = Math.floor(totalC2cAmount * 0.1);
    
    const batch: PartnerSettlementBatch = {
      batchId: `BATCH-B-2025${String(Math.floor(1 + i / 4)).padStart(2, '0')}${String((i % 4) * 7 + 1).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      partnerId: partnerIds[partnerIndex],
      partnerName: partners[partnerIndex],
      partnerType: partnerTypes[partnerIndex],
      settlementPeriodStart: periodStart.toISOString().split('T')[0],
      settlementPeriodEnd: periodEnd.toISOString().split('T')[0],
      orderCount,
      settlementAmount,
      status,
      createdAt: new Date(2025, 0, 8 + i * 7, 0, 0, 0).toISOString().replace('T', ' ').substring(0, 19),
      totalC2cAmount,
      totalPlatformProfit,
    };
    
    if (status === 'approved' || status === 'credited' || status === 'completed') {
      batch.approvedAt = new Date(2025, 0, 8 + i * 7, 10, 30, 0).toISOString().replace('T', ' ').substring(0, 19);
      batch.approvedBy = 'FINANCE-001';
      batch.approvalComment = '金额核对无误';
    }
    
    if (status === 'credited' || status === 'completed') {
      batch.creditedAt = new Date(2025, 0, 8 + i * 7, 11, 0, 0).toISOString().replace('T', ' ').substring(0, 19);
      batch.creditedBy = 'SYSTEM';
    }
    
    if (status === 'rejected') {
      batch.rejectionReason = '订单金额异常，需要核查';
    }
    
    // 生成订单列表
    batch.orders = [];
    for (let j = 0; j < Math.min(orderCount, 5); j++) {
      batch.orders.push({
        orderId: `ORDER-2025${String(i + 1).padStart(4, '0')}-${String(j + 1).padStart(3, '0')}`,
        hotelName: ['北京希尔顿酒店', '上海浦东香格里拉', '深圳湾万豪酒店', '杭州西湖国宾馆', '成都洲际酒店'][j % 5],
        checkInDate: new Date(2025, 0, 1 + i * 7 + j).toISOString().split('T')[0],
        checkOutDate: new Date(2025, 0, 3 + i * 7 + j).toISOString().split('T')[0],
        c2cAmount: Math.floor(Math.random() * 3000) + 1000,
        platformProfit: Math.floor(Math.random() * 300) + 100,
        partnerProfit: Math.floor(Math.random() * 400) + 200,
        orderStatus: '已完成',
      });
    }
    
    batches.push(batch);
  }
  
  return batches;
}

/**
 * 获取供应商结算批次mock数据
 */
export function getMockSupplierSettlementBatches(): SupplierSettlementBatch[] {
  const batches: SupplierSettlementBatch[] = [];
  const suppliers = ['北京希尔顿酒店集团', '上海万豪酒店集团', '深圳洲际酒店集团', '杭州香格里拉集团', '成都凯悦酒店集团'];
  const supplierIds = ['SUPPLIER-001', 'SUPPLIER-002', 'SUPPLIER-003', 'SUPPLIER-004', 'SUPPLIER-005'];
  
  const statuses: SupplierBatchStatus[] = ['pending', 'pending_approval', 'approved', 'paid', 'completed', 'rejected'];
  
  for (let i = 0; i < 15; i++) {
    const supplierIndex = i % 5;
    const status = statuses[i % 6];
    const month = (i % 12) + 1;
    const year = 2025;
    
    const orderCount = Math.floor(Math.random() * 150) + 50;
    const settlementAmount = Math.floor(Math.random() * 500000) + 100000;
    const totalC2cAmount = settlementAmount * 3 + Math.floor(Math.random() * 200000);
    
    const batch: SupplierSettlementBatch = {
      batchId: `BATCH-S-${year}${String(month).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
      supplierId: supplierIds[supplierIndex],
      supplierName: suppliers[supplierIndex],
      settlementPeriodStart: `${year}-${String(month).padStart(2, '0')}-01`,
      settlementPeriodEnd: `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`,
      orderCount,
      settlementAmount,
      status,
      createdAt: new Date(year, month, 1, 0, 0, 0).toISOString().replace('T', ' ').substring(0, 19),
      totalC2cAmount,
    };
    
    if (status === 'approved' || status === 'paid' || status === 'completed') {
      batch.approvedAt = new Date(year, month, 1, 10, 30, 0).toISOString().replace('T', ' ').substring(0, 19);
      batch.approvedBy = 'FINANCE-001';
      batch.approvalComment = '金额核对无误';
    }
    
    if (status === 'paid' || status === 'completed') {
      batch.paidAt = new Date(year, month, 5, 14, 20, 0).toISOString().replace('T', ' ').substring(0, 19);
      batch.paidBy = 'SYSTEM';
      batch.paymentOrderId = `BANK-${year}${String(month).padStart(2, '0')}05-${String(i + 1).padStart(3, '0')}`;
      batch.paymentStatus = 'success';
    }
    
    if (status === 'rejected') {
      batch.rejectionReason = '订单金额异常，需要核查';
    }
    
    // 生成订单列表
    batch.orders = [];
    for (let j = 0; j < Math.min(orderCount, 5); j++) {
      batch.orders.push({
        orderId: `ORDER-${year}${String(month).padStart(2, '0')}${String(j + 1).padStart(4, '0')}`,
        hotelName: suppliers[supplierIndex],
        checkInDate: new Date(year, month - 1, 1 + j * 5).toISOString().split('T')[0],
        checkOutDate: new Date(year, month - 1, 3 + j * 5).toISOString().split('T')[0],
        c2cAmount: Math.floor(Math.random() * 3000) + 1000,
        supplierCost: Math.floor(Math.random() * 2500) + 800,
        orderStatus: '已完成',
      });
    }
    
    batches.push(batch);
  }
  
  return batches;
}

// 兼容旧接口
export interface BatchOrder {
  orderId: string;
  hotelName: string;
  checkOutDate: string;
  p0_supplierCost: number;
  p1_platformPrice: number;
  p2_salePrice: number;
  platformProfit: number;
  partnerProfit: number;
  gates: {
    serviceCompleted: boolean;
    coolingOffPassed: boolean;
    noDispute: boolean;
    costReconciled: boolean;
    accountHealthy: boolean;
    thresholdMet: boolean;
  };
}

export interface SettlementBatch {
  batchId: string;
  partnerName: string;
  partnerEmail: string;
  orderCount: number;
  totalProfit: number;
  status: 'pending' | 'approved' | 'credited';
  createdAt: string;
  approvedAt?: string;
  creditedAt?: string;
  orders?: BatchOrder[];
}

/**
 * 获取模拟结算批次数据（兼容旧接口）
 */
export function getMockSettlementBatches(): SettlementBatch[] {
  return getMockPartnerSettlementBatches().slice(0, 3).map(batch => ({
    batchId: batch.batchId,
    partnerName: batch.partnerName,
    partnerEmail: `${batch.partnerId.toLowerCase()}@example.com`,
    orderCount: batch.orderCount,
    totalProfit: batch.settlementAmount,
    status: batch.status === 'pending' ? 'pending' : batch.status === 'pending_approval' ? 'pending' : batch.status === 'approved' ? 'approved' : 'credited',
    createdAt: batch.createdAt,
    approvedAt: batch.approvedAt,
    creditedAt: batch.creditedAt,
    orders: batch.orders?.map(order => ({
      orderId: order.orderId,
      hotelName: order.hotelName,
      checkOutDate: order.checkOutDate,
      p0_supplierCost: order.c2cAmount - order.platformProfit - order.partnerProfit,
      p1_platformPrice: order.c2cAmount - order.partnerProfit,
      p2_salePrice: order.c2cAmount,
      platformProfit: order.platformProfit,
      partnerProfit: order.partnerProfit,
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
    })),
  }));
}
