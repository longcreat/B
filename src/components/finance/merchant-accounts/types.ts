// 商户账户相关类型定义

// 用户信息类型
export type UserType = 'travel_agent' | 'influencer' | 'travel_app';

// 认证方式
export type AuthType = 'individual' | 'enterprise';

// 账户状态
export type AccountStatus = 'active' | 'frozen' | 'closed';

// 业务模式
export type BusinessMode = 'saas' | 'mcp' | 'platform_self_operated';

// 结算模式
export type SettlementMode = 'batch' | 'per_order';

// 结算状态
export type SettlementStatus = 'pending' | 'settleable' | 'processing' | 'settled';

// 结算类型
export type SettlementType = 'batch' | 'per_order';

// 对账状态
export type ReconciliationStatus = 'pending' | 'reconciled' | 'difference' | 'adjusted';

// 流水类型
export type TransactionType = 
  | 'settlement_income'    // 订单结算入账
  | 'withdrawal_deduction' // 提现扣款
  | 'refund_deduction'     // 退款扣款
  | 'commission_expense'   // 佣金支出
  | 'balance_adjustment'   // 余额调整
  | 'freeze'               // 冻结
  | 'unfreeze';            // 解冻

// 提现状态
export type WithdrawalStatus = 
  | 'pending_review'   // 待审核
  | 'approved'         // 审核通过
  | 'processing'       // 处理中
  | 'success'          // 提现成功
  | 'failed'           // 提现失败
  | 'rejected';        // 已拒绝

// 提现账户类型
export type WithdrawalAccountType = 'bank' | 'alipay' | 'wechat';

// 余额调整类型
export type AdjustmentType = 
  | 'reconciliation_diff' // 对账差异
  | 'compensation'        // 补偿
  | 'deduction'           // 扣款
  | 'penalty'             // 违约扣费
  | 'other';              // 其他

// 风控等级
export type RiskLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

// 异常类型
export type AnomalyType = 
  | 'large_withdrawal'    // 大额提现
  | 'high_refund_rate'    // 频繁退款
  | 'abnormal_order'      // 异常订单
  | 'account_anomaly';    // 账户异常

// 争议状态
export type DisputeStatus = 'pending' | 'investigating' | 'resolved' | 'closed';

// 大B账户
export interface BigBAccount {
  id: string;
  name: string;
  userType: UserType;
  authType: AuthType;
  businessMode: BusinessMode;
  accountStatus: AccountStatus;
  contactInfo: {
    email: string;
    phone: string;
  };
  registeredAt: string;
  lastLoginAt?: string;
  
  // 业务数据
  businessStats: {
    totalSalesAmount: number;      // 累计销售金额（订单总金额P2的总和）
    settledAmount: number;         // 已结算金额
    pendingAmount: number;         // 待结金额
    accountBalance: number;        // 账户余额
    availableBalance: number;      // 可提现金额
    frozenBalance: number;         // 冻结金额
    totalOrderCount: number;       // 累计订单数量
    totalCustomerCount: number;    // 累计客户数量
    refundRate: number;            // 退款率（百分比）
    monthlyAvgSales: number;       // 月均销售额
    registrationDays: number;      // 注册时长（天数）
  };
  
  // 推广联盟权限
  canManageAffiliate: boolean;
  
  // 风控等级
  riskLevel: RiskLevel;
  
  // 结算模式
  settlementMode: SettlementMode;
}

// 账户流水明细
export interface AccountTransaction {
  transactionId: string;
  transactionTime: string;
  transactionType: TransactionType;
  amount: number; // 正数为入账，负数为扣款
  balanceBefore: number; // 变动前余额
  balanceAfter: number; // 变动后余额
  relatedObjectId?: string; // 关联对象ID（订单号/提现单号/调整单号）
  relatedObjectType?: 'order' | 'withdrawal' | 'adjustment';
  operator: string; // 操作人（系统/管理员/大B自己）
  remark?: string; // 备注说明
}

// 订单类型
export type OrderType = 'direct' | 'smallb_promotion';

// 大B订单明细
export interface BigBOrderDetail {
  orderId: string;
  orderType: OrderType;          // 订单类型：直接订单/小B推广订单
  orderAmount: number;           // 订单金额P2
  refundAmount: number;          // 退款金额
  settlementAmount: number;      // 结算金额
  orderStatus: string;           // 订单状态
  settlementStatus: SettlementStatus; // 结算状态
  orderTime: string;             // 订单时间
  settlementTime?: string;       // 结算时间
}

// 大B结算明细（按订单汇总）
export interface BigBSettlementDetail {
  orderId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  p2_orderAmount: number; // 订单总金额P2
  totalRefund: number; // 订单总退款金额
  p1_distributionPrice: number; // 订单总分销价P1
  p0_supplierCost: number; // 订单总底价P0
  totalCommission: number; // 订单总佣金
  bigBDiscountContribution: number; // 大B出资的优惠金额
  settlementAmount: number; // 结算金额
  settlementStatus: SettlementStatus;
  reconciliationStatus: ReconciliationStatus; // 对账状态
  reconciliationTime?: string; // 对账时间
  reconciliationDifference?: number; // 对账差异金额
  settlementTime?: string;
}

// 大B结算批次记录（周期结算模式）
export interface BigBSettlementBatch {
  batchId: string;
  batchNumber: string;
  settlementAmount: number;
  orderCount: number;
  status: SettlementStatus;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  approvalComment?: string;
  rejectionReason?: string;
  settledAt?: string;
  settledBy?: string;
  operator?: string;
  orders?: BigBSettlementDetail[]; // 批次包含的订单明细
}

// 大B结算记录（按单结算模式）
export interface BigBSettlementRecord {
  id: string;
  orderId: string;
  settlementAmount: number;
  settlementTime: string;
  settlementStatus: SettlementStatus;
  operator: string;
}

// 余额变动类型
export type BalanceChangeType = 'income' | 'expense' | 'freeze' | 'unfreeze';

// 大B余额明细（余额变动记录）
export interface BigBBalanceDetail {
  id: string;
  changeTime: string;
  changeType: BalanceChangeType;
  changeAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  relatedOrderId?: string;
  operator: string;
  remark?: string;
}

// 提现记录
export interface WithdrawalRecord {
  withdrawalId: string;
  amount: number;
  accountType: WithdrawalAccountType;
  accountInfo: {
    accountNumber: string;
    accountName: string;
  };
  status: WithdrawalStatus;
  applyTime: string;
  reviewTime?: string;
  transferTime?: string;
  reviewer?: string;
  rejectReason?: string;
  failureReason?: string;
  invoiceRequired: boolean; // 企业用户需上传发票
  invoiceUrl?: string;
}

// 余额调整记录
export interface BalanceAdjustmentRecord {
  adjustmentId: string;
  adjustmentTime: string;
  adjustmentType: AdjustmentType;
  amount: number; // 正数为增加，负数为扣减
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  relatedOrderId?: string;
  operator: string;
  approver?: string;
  proofUrl?: string; // 调整凭证
}

// 冻结/解冻记录
export interface FreezeRecord {
  recordId: string;
  operationType: 'freeze' | 'unfreeze';
  amount: number;
  reason: string;
  operationTime: string;
  operator: string;
  relatedOrderId?: string;
  currentFrozenBalance: number;
}

// 风控信息
export interface RiskControlInfo {
  riskLevel: RiskLevel;
  
  // 风控预警
  alerts: {
    largeWithdrawal: boolean;      // 大额提现预警（单笔 > 10万）
    highRefundRate: boolean;       // 频繁退款预警（退款率 > 20%）
    abnormalOrder: boolean;        // 异常订单预警
    accountAnomaly: boolean;       // 账户异常预警
  };
  
  // 账户限制
  restrictions: {
    withdrawalLimits: {
      singleLimit: number;   // 单笔限额
      dailyLimit: number;    // 日限额
      monthlyLimit: number;  // 月限额
    };
    requireManualReview: boolean;  // 是否需要人工审核
    withdrawalDisabled: boolean;   // 是否禁止提现
    settlementDisabled: boolean;   // 是否禁止结算
  };
  
  // 异常记录统计
  anomalyStats: {
    abnormalOrderCount: number;
    disputeOrderCount: number;
    violationCount: number;
  };
}

// 异常订单记录
export interface AnomalyOrderRecord {
  orderId: string;
  anomalyType: AnomalyType;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

// 争议订单记录
export interface DisputeOrderRecord {
  orderId: string;
  disputeReason: string;
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
}

// 违规记录
export interface ViolationRecord {
  violationId: string;
  violationType: string;
  violationTime: string;
  penaltyAmount?: number;
  status: 'pending' | 'processed';
  description: string;
}

// 大B管理的小B
export interface ManagedSmallB {
  id: string;
  name: string;
  userType: UserType;
  authType: AuthType;
  mountedTime: string;
  accountStatus: AccountStatus;
  currentCommissionRate: number; // 当前佣金比例（百分比）
  shopConfigEnabled: boolean; // 是否拥有店铺配置权限
  totalOrderAmount: number;
  totalCommission: number;
  settledCommission: number;
  pendingCommission: number;
}

// 小B佣金明细（按订单汇总）
export interface SmallBCommissionDetail {
  orderId: string;
  orderAmount: number;
  commissionAmount: number;
  commissionStatus: SettlementStatus;
  settlementTime?: string;
}

// 小B账户
export interface SmallBAccount {
  id: string;
  name: string;
  userType: UserType;
  authType: AuthType;
  parentBigBId: string;
  parentBigBName: string;
  accountStatus: AccountStatus;
  contactInfo: {
    email: string;
    phone: string;
  };
  lastLoginAt?: string; // 最近登录时间
  
  // 业务统计
  stats: {
    totalOrderAmount: number; // 累计订单总金额P2
    totalRefund: number; // 累计订单总退款
    totalProfit: number; // 累计订单总利润
    totalCommission: number; // 累计订单总佣金
    settledCommission: number; // 已结算佣金
    pendingCommission: number; // 待结算佣金
    commissionRate: number; // 当前佣金比例（百分比）
  };
}

// 小B订单明细
export interface SmallBOrderDetail {
  orderId: string;
  p2_orderAmount: number; // 订单总金额P2
  orderProfit: number; // 订单总利润
  commissionRate: number; // 佣金率
  totalCommission: number; // 订单总佣金
  settlementStatus: SettlementStatus;
  settlementTime?: string;
  settledBy: string; // 结算方（挂载大B名称）
}

// 小B佣金结算记录
export interface SmallBCommissionRecord {
  id: string;
  settlementType: SettlementType; // 结算类型：周期结算/按单结算
  batchNumber: string; // 结算批次号（周期结算）或订单号（按单结算）
  settlementAmount: number;
  settlementTime: string;
  settlementStatus: SettlementStatus;
  settledBy: string; // 结算方（挂载大B名称）
  orders?: SmallBSettlementOrderDetail[]; // 结算包含的订单明细
}

// 小B结算订单明细
export interface SmallBSettlementOrderDetail {
  orderId: string;
  orderAmount: number; // 订单总金额P2
  totalCommission: number; // 订单总佣金
  settlementAmount: number; // 结算金额
}

// 筛选条件
export interface MerchantAccountFilters {
  search?: string;
  userType?: UserType | 'all';
  authType?: AuthType | 'all';
  businessMode?: BusinessMode | 'all'; // 仅大B
  accountStatus?: AccountStatus | 'all';
  parentBigBId?: string; // 仅小B
  riskLevel?: RiskLevel | 'all'; // 风控等级筛选
}

// 流水筛选条件
export interface TransactionFilters {
  transactionType?: TransactionType | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  operator?: string;
  relatedObjectId?: string;
}

// 提现筛选条件
export interface WithdrawalFilters {
  status?: WithdrawalStatus | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// 结算明细筛选条件
export interface SettlementDetailFilters {
  orderId?: string;
  settlementStatus?: SettlementStatus | 'all';
  reconciliationStatus?: ReconciliationStatus | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// 余额调整筛选条件
export interface AdjustmentFilters {
  adjustmentType?: AdjustmentType | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}
