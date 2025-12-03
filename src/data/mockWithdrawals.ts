// 提现管理相关的 mock 数据

export type WithdrawalStatus = 
  | 'pending_review' // 待审核
  | 'reviewing' // 审核中
  | 'approved' // 已通过
  | 'rejected' // 已拒绝
  | 'processing' // 处理中
  | 'success' // 提现成功
  | 'failed' // 提现失败
  | 'closed'; // 提现关闭

export type UserType = 'bigb' | 'smallb';
export type BusinessModel = 'saas' | 'mcp' | 'affiliate';
export type AccountType = 'bank' | 'alipay' | 'wechat';
export type InvoiceType = 'vat_special' | 'vat_normal';
export type InvoiceStatus = 'uploaded' | 'pending' | 'approved' | 'rejected';

export interface Invoice {
  type: InvoiceType;
  code: string;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  fileUrl: string;
  reviewComment?: string;
}

export interface Withdrawal {
  withdrawalId: string; // 提现单号
  userId: string; // 用户ID
  userName: string; // 用户名称
  userType: UserType; // 用户类型
  businessModel: BusinessModel; // 业务模式
  amount: number; // 提现金额
  availableBalance: number; // 可用余额
  accountType: AccountType; // 提现账户类型
  account: string; // 提现账户
  accountName: string; // 提现用户名
  phone: string; // 提现人电话
  createTime: string; // 申请时间
  reviewTime?: string; // 审核时间
  reviewer?: string; // 审核人
  reviewComment?: string; // 审核意见
  transferTime?: string; // 转账汇款时间
  transactionNo?: string; // 流水号
  status: WithdrawalStatus; // 提现状态
  remark?: string; // 申请备注
  invoice?: Invoice; // 发票信息（仅企业用户）
  failureReason?: string; // 失败原因
}

/**
 * 获取模拟提现数据
 */
export function getMockWithdrawals(): Withdrawal[] {
  const now = new Date();
  const baseTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30天前

  const withdrawals: Withdrawal[] = [];

  // 生成不同状态的提现记录
  const statuses: WithdrawalStatus[] = [
    'pending_review',
    'reviewing',
    'approved',
    'rejected',
    'processing',
    'success',
    'failed',
    'closed',
  ];

  const users = [
    { id: 'BIGB-001', name: '张三旅行社', phone: '13800138000', type: 'bigb' as UserType },
    { id: 'BIGB-002', name: '李四国际旅游', phone: '13900139000', type: 'bigb' as UserType },
    { id: 'SMALLB-001', name: '王五旅游工作室', phone: '13700137000', type: 'smallb' as UserType },
    { id: 'SMALLB-002', name: '赵六旅行代理', phone: '13600136000', type: 'smallb' as UserType },
    { id: 'BIGB-003', name: '钱七旅游公司', phone: '13500135000', type: 'bigb' as UserType },
    { id: 'SMALLB-003', name: '孙八旅游博主', phone: '13400134000', type: 'smallb' as UserType },
  ];

  const businessModels: BusinessModel[] = ['saas', 'mcp', 'affiliate'];
  const accountTypes: AccountType[] = ['bank', 'alipay', 'wechat'];

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createTime = new Date(baseTime.getTime() + daysAgo * 24 * 60 * 60 * 1000);
    const userIndex = Math.floor(Math.random() * users.length);
    const user = users[userIndex];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const businessModel = businessModels[Math.floor(Math.random() * businessModels.length)];
    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
    const amount = Math.floor(Math.random() * 50000) + 1000; // 1000-51000
    const availableBalance = amount + Math.floor(Math.random() * 100000);

    const withdrawalId = `WD${createTime.getFullYear()}${String(createTime.getMonth() + 1).padStart(2, '0')}${String(createTime.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`;

    let reviewTime: string | undefined;
    let reviewer: string | undefined;
    let reviewComment: string | undefined;
    let transferTime: string | undefined;
    let transactionNo: string | undefined;
    let failureReason: string | undefined;
    let invoice: Invoice | undefined;

    // 根据状态设置相关字段
    if (['approved', 'rejected', 'processing', 'success', 'failed'].includes(status)) {
      const hoursAfterCreate = Math.floor(Math.random() * 24) + 1;
      reviewTime = new Date(createTime.getTime() + hoursAfterCreate * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
      reviewer = ['张财务', '李主管', '王审核'][Math.floor(Math.random() * 3)];
      if (status === 'rejected') {
        reviewComment = ['账户信息不完整', '发票信息错误', '金额不符'][Math.floor(Math.random() * 3)];
      }
    }

    if (['success', 'failed'].includes(status)) {
      const hoursAfterReview = Math.floor(Math.random() * 48) + 1;
      transferTime = new Date(new Date(reviewTime!).getTime() + hoursAfterReview * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
      transactionNo = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
    }

    if (status === 'failed') {
      failureReason = ['银行账户异常，请核实后重试', '收款账户信息错误', '银行系统维护中'][Math.floor(Math.random() * 3)];
    }

    // 大B用户添加发票信息
    if (user.type === 'bigb' && i % 2 === 0) {
      invoice = {
        type: Math.random() > 0.5 ? 'vat_special' : 'vat_normal',
        code: `${Math.floor(Math.random() * 900000000) + 100000000}`,
        number: `${Math.floor(Math.random() * 90000000) + 10000000}`,
        date: new Date(createTime.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: amount,
        status: status === 'rejected' ? 'rejected' : 'approved',
        fileUrl: '/invoices/invoice-sample.pdf',
        reviewComment: status === 'rejected' ? '发票验证失败' : undefined,
      };
    }

    withdrawals.push({
      withdrawalId,
      userId: user.id,
      userName: user.name,
      userType: user.type,
      businessModel,
      amount,
      availableBalance,
      accountType,
      account: accountType === 'bank' ? `6228480402637${String(i).padStart(6, '0')}` : `${user.phone}`,
      accountName: user.name,
      phone: user.phone,
      createTime: createTime.toISOString().replace('T', ' ').substring(0, 19),
      reviewTime,
      reviewer,
      reviewComment,
      transferTime,
      transactionNo,
      status,
      remark: i % 3 === 0 ? `申请备注 ${i + 1}` : undefined,
      invoice,
      failureReason,
    });
  }

  // 按创建时间倒序排列
  return withdrawals.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
}

