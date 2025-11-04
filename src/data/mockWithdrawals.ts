// 提现管理相关的 mock 数据

export type WithdrawalStatus = 
  | 'processing' // 处理中
  | 'success' // 提现成功
  | 'failed' // 提现失败
  | 'pending_review' // 待审核
  | 'rejected' // 已拒绝
  | 'closed'; // 提现关闭

export type BusinessModel = 'mcp' | 'saas' | 'affiliate';

export interface Withdrawal {
  withdrawalId: string; // 提现ID（流水号）
  userId: string; // 用户ID
  userName: string; // 用户名称
  createTime: string; // 提现创建时间
  transferTime?: string; // 转账汇款时间
  phone: string; // 提现人电话
  account: string; // 提现账户
  accountName: string; // 提现用户名
  amount: number; // 提现金额
  status: WithdrawalStatus; // 提现状态
  businessModel: BusinessModel; // 业务模式
  remark?: string; // 备注
  rejectReason?: string; // 拒绝原因
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
    'processing',
    'success',
    'failed',
    'pending_review',
    'rejected',
    'closed',
  ];

  const users = [
    { id: 'user-001', name: '张三', phone: '13800138000' },
    { id: 'user-002', name: '李四', phone: '13900139000' },
    { id: 'user-003', name: '王五', phone: '13700137000' },
    { id: 'user-004', name: '赵六', phone: '13600136000' },
    { id: 'user-005', name: '钱七', phone: '13500135000' },
    { id: 'user-006', name: '孙八', phone: '13400134000' },
    { id: 'user-007', name: '周九', phone: '13300133000' },
    { id: 'user-008', name: '吴十', phone: '13200132000' },
  ];

  const businessModels: BusinessModel[] = ['mcp', 'saas', 'affiliate'];

  const accounts = [
    { account: '6228480402637874213', accountName: '张三' },
    { account: '6228480402637874214', accountName: '李四' },
    { account: '6228480402637874215', accountName: '王五' },
    { account: '6228480402637874216', accountName: '赵六' },
    { account: '6228480402637874217', accountName: '钱七' },
    { account: '6228480402637874218', accountName: '孙八' },
    { account: '6228480402637874219', accountName: '周九' },
    { account: '6228480402637874220', accountName: '吴十' },
  ];

  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createTime = new Date(baseTime.getTime() + daysAgo * 24 * 60 * 60 * 1000);
    const userIndex = Math.floor(Math.random() * users.length);
    const user = users[userIndex];
    const accountInfo = accounts[userIndex];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const businessModel = businessModels[Math.floor(Math.random() * businessModels.length)];
    const amount = Math.floor(Math.random() * 50000) + 1000; // 1000-51000

    let transferTime: string | undefined;
    if (status === 'success' || status === 'failed') {
      const hoursAfter = Math.floor(Math.random() * 48) + 1; // 1-48小时后
      transferTime = new Date(createTime.getTime() + hoursAfter * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19);
    }

    const withdrawalId = `WD${createTime.getFullYear()}${String(createTime.getMonth() + 1).padStart(2, '0')}${String(createTime.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`;

    withdrawals.push({
      withdrawalId,
      userId: user.id,
      userName: user.name,
      createTime: createTime.toISOString().replace('T', ' ').substring(0, 19),
      transferTime,
      phone: user.phone,
      account: accountInfo.account,
      accountName: accountInfo.accountName,
      amount,
      status,
      businessModel,
      remark: i % 3 === 0 ? `备注信息 ${i + 1}` : undefined,
      rejectReason: status === 'rejected' ? '账户信息不完整' : undefined,
      failureReason: status === 'failed' ? '银行账户异常，请核实后重试' : undefined,
    });
  }

  // 按创建时间倒序排列
  return withdrawals.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
}

