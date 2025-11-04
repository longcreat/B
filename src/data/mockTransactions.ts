// 交易相关的 mock 数据

export interface Transaction {
  id: string;
  type: 'income' | 'withdraw' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  userName: string;
  userEmail: string;
  businessModel: string;
  createdAt: string;
  completedAt?: string;
  description: string;
}

/**
 * 获取模拟交易数据
 */
export function getMockTransactions(): Transaction[] {
  return [
    {
      id: 'TXN-001',
      type: 'income',
      amount: 15680,
      status: 'completed',
      userName: '张三',
      userEmail: 'zhangsan@example.com',
      businessModel: 'MCP',
      createdAt: '2025-10-30 14:30:00',
      completedAt: '2025-10-30 14:31:00',
      description: 'API调用费用',
    },
    {
      id: 'TXN-002',
      type: 'withdraw',
      amount: 5000,
      status: 'pending',
      userName: '李四',
      userEmail: 'lisi@example.com',
      businessModel: '联盟推广',
      createdAt: '2025-10-31 09:15:00',
      description: '佣金提现',
    },
    {
      id: 'TXN-003',
      type: 'income',
      amount: 28900,
      status: 'completed',
      userName: '王五科技',
      userEmail: 'wangwu@example.com',
      businessModel: '品牌预订站',
      createdAt: '2025-10-29 16:20:00',
      completedAt: '2025-10-29 16:22:00',
      description: 'SaaS订阅年费',
    },
    {
      id: 'TXN-004',
      type: 'refund',
      amount: 3500,
      status: 'completed',
      userName: '赵六',
      userEmail: 'zhaoliu@example.com',
      businessModel: 'MCP',
      createdAt: '2025-10-28 11:45:00',
      completedAt: '2025-10-28 11:50:00',
      description: '服务退款',
    },
    {
      id: 'TXN-005',
      type: 'withdraw',
      amount: 12000,
      status: 'failed',
      userName: '钱七',
      userEmail: 'qianqi@example.com',
      businessModel: '联盟推广',
      createdAt: '2025-10-27 10:00:00',
      completedAt: '2025-10-27 10:05:00',
      description: '佣金提现（银行卡信息错误）',
    },
  ];
}

