// 发票管理相关的 mock 数据

export type InvoiceStatus = 
  | 'pending_invoice' // 待开票
  | 'invoicing' // 开票中
  | 'invoice_success_email_not_sent' // 开票成功邮箱未发送
  | 'invoice_success_email_sent' // 开票成功邮箱已发送
  | 'invoice_success_email_failed' // 开票成功邮箱发送失败
  | 'email_resending' // 邮箱重发中
  | 'invoice_retrying' // 开票重试中
  | 'invoice_failed' // 开票失败
  | 'refund_requested' // 申请退票
  | 'refunding' // 退票中
  | 'refund_success' // 退票成功
  | 'refund_retrying' // 退票重试中
  | 'refund_failed'; // 退票失败

export interface InvoiceOrder {
  orderId: string;
  hotelName: string;
  amount: number;
  createdAt: string;
}

export interface InvoiceTrajectory {
  timestamp: string;
  status: InvoiceStatus;
  description: string;
  operator?: string; // 操作人（系统/人工）
}

export interface Invoice {
  invoiceId: string;
  applicantUserId: string; // 发票申请方用户ID
  applicantUserName: string; // 发票申请方用户名
  applicantUserContact: string; // 用户联系方式
  invoiceApplyTime: string; // 开票申请时间
  invoiceSuccessTime?: string; // 开票成功时间
  emailSendTime?: string; // 邮箱发送时间
  
  invoiceContent: string; // 发票内容：住宿费
  invoiceCode?: string; // 发票代码
  invoiceNumber?: string; // 发票号码
  invoiceIssuer: string; // 开票主体
  
  recipientEmail: string; // 接收人邮箱
  invoiceTitle: string; // 发票抬头：个人姓名/公司名称
  taxNumber?: string; // 发票税号：纳税人识别号，个人用户为--
  
  invoiceAmount: number; // 开票金额
  
  status: InvoiceStatus;
  errorReason?: string; // 异常原因
  
  // 详情页信息
  invoiceType: 'electronic'; // 发票类型：电子发票
  registeredAddress?: string; // 注册地址
  registeredPhone?: string; // 注册电话
  bankName?: string; // 开户银行
  bankAccount?: string; // 银行账号
  remark?: string; // 备注说明
  
  // 订单信息
  orders: InvoiceOrder[]; // 关联的订单列表
  
  // 发票轨迹
  trajectory?: InvoiceTrajectory[]; // 发票状态时间轴
}

/**
 * 获取模拟发票数据
 */
export function getMockInvoices(): Invoice[] {
  return [
    {
      invoiceId: 'INV-20251031-001',
      applicantUserId: 'user-001',
      applicantUserName: '张三',
      applicantUserContact: '13800138000',
      invoiceApplyTime: '2025-10-28 14:30:00',
      invoiceSuccessTime: '2025-10-28 15:05:00',
      emailSendTime: '2025-10-28 15:06:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001234',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'zhangsan@example.com',
      invoiceTitle: '张三',
      taxNumber: '--',
      invoiceAmount: 968.00,
      status: 'invoice_success_email_sent',
      invoiceType: 'electronic',
      registeredAddress: '',
      registeredPhone: '',
      orders: [
        {
          orderId: 'ORD-2025001',
          hotelName: '北京希尔顿酒店',
          amount: 968.00,
          createdAt: '2025-10-15 14:30:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-28 14:30:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-28 14:35:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-28 15:05:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-28 15:06:00',
          status: 'invoice_success_email_sent',
          description: '发票邮件已成功发送',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251030-002',
      applicantUserId: 'user-002',
      applicantUserName: '李四',
      applicantUserContact: '13900139000',
      invoiceApplyTime: '2025-10-27 10:15:00',
      invoiceSuccessTime: '2025-10-27 10:45:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001235',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'lisi@example.com',
      invoiceTitle: '某某科技有限公司',
      taxNumber: '91110000MA01ABCD1E',
      invoiceAmount: 1452.00,
      status: 'invoice_success_email_sent',
      invoiceType: 'electronic',
      registeredAddress: '北京市朝阳区xxx路xxx号',
      registeredPhone: '010-12345678',
      bankName: '中国工商银行',
      bankAccount: '11001234567890123456',
      orders: [
        {
          orderId: 'ORD-2025002',
          hotelName: '上海浦东香格里拉',
          amount: 1452.00,
          createdAt: '2025-10-20 10:15:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-27 10:15:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-27 10:20:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-27 10:45:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-27 10:46:00',
          status: 'invoice_success_email_sent',
          description: '发票邮件已成功发送',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251029-003',
      applicantUserId: 'user-001',
      applicantUserName: '张三',
      applicantUserContact: '13800138000',
      invoiceApplyTime: '2025-10-26 09:20:00',
      invoiceSuccessTime: '2025-10-26 09:50:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001236',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'wrong-email@example.com', // 错误的邮箱
      invoiceTitle: '张三',
      taxNumber: '--',
      invoiceAmount: 1149.50,
      status: 'invoice_success_email_failed',
      errorReason: '邮箱地址不存在，邮件发送失败',
      invoiceType: 'electronic',
      orders: [
        {
          orderId: 'ORD-2025003',
          hotelName: '深圳湾万豪酒店',
          amount: 1149.50,
          createdAt: '2025-10-18 16:20:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-26 09:20:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-26 09:25:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-26 09:50:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-26 09:51:00',
          status: 'invoice_success_email_failed',
          description: '邮箱地址不存在，邮件发送失败',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251028-004',
      applicantUserId: 'user-003',
      applicantUserName: '王五',
      applicantUserContact: '13700137000',
      invoiceApplyTime: '2025-10-25 16:30:00',
      invoiceContent: '住宿费',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'wangwu@example.com',
      invoiceTitle: '王五企业集团',
      taxNumber: '91110000MA02EFGH2F',
      invoiceAmount: 1815.00,
      status: 'invoice_failed',
      errorReason: '税号格式错误，无法开具发票',
      invoiceType: 'electronic',
      orders: [
        {
          orderId: 'ORD-2025005',
          hotelName: '杭州西湖四季酒店',
          amount: 1815.00,
          createdAt: '2025-10-28 09:30:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-25 16:30:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 16:35:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 16:40:00',
          status: 'invoice_retrying',
          description: '首次开票失败，系统自动重试',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 17:00:00',
          status: 'invoice_failed',
          description: '税号格式错误，无法开具发票',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251027-005',
      applicantUserId: 'user-002',
      applicantUserName: '李四',
      applicantUserContact: '13900139000',
      invoiceApplyTime: '2025-10-24 11:00:00',
      invoiceSuccessTime: '2025-10-24 11:30:00',
      emailSendTime: '2025-10-24 11:31:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001237',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'lisi@example.com',
      invoiceTitle: '某某科技有限公司',
      taxNumber: '91110000MA01ABCD1E',
      invoiceAmount: 2904.00,
      status: 'refund_requested',
      invoiceType: 'electronic',
      registeredAddress: '北京市朝阳区xxx路xxx号',
      registeredPhone: '010-12345678',
      bankName: '中国工商银行',
      bankAccount: '11001234567890123456',
      orders: [
        {
          orderId: 'ORD-2025008',
          hotelName: '上海浦东香格里拉',
          amount: 1452.00,
          createdAt: '2025-10-13 15:20:00',
        },
        {
          orderId: 'ORD-2025009',
          hotelName: '成都洲际酒店',
          amount: 1452.00,
          createdAt: '2025-10-15 10:00:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-24 11:00:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 11:05:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 11:30:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 11:31:00',
          status: 'invoice_success_email_sent',
          description: '发票邮件已成功发送',
          operator: '系统',
        },
        {
          timestamp: '2025-10-29 10:00:00',
          status: 'refund_requested',
          description: '订单退款，客服申请退票',
          operator: '财务-张经理',
        },
      ],
    },
    {
      invoiceId: 'INV-20251026-006',
      applicantUserId: 'user-004',
      applicantUserName: '赵六',
      applicantUserContact: '13600136000',
      invoiceApplyTime: '2025-10-25 14:00:00',
      invoiceSuccessTime: '2025-10-25 14:30:00',
      emailSendTime: '2025-10-25 14:31:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001238',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'zhaoliu@example.com',
      invoiceTitle: '赵六',
      taxNumber: '--',
      invoiceAmount: 822.80,
      status: 'refunding',
      invoiceType: 'electronic',
      orders: [
        {
          orderId: 'ORD-2025006',
          hotelName: '成都洲际酒店',
          amount: 822.80,
          createdAt: '2025-10-27 15:45:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-25 14:00:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 14:05:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 14:30:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-25 14:31:00',
          status: 'invoice_success_email_sent',
          description: '发票邮件已成功发送',
          operator: '系统',
        },
        {
          timestamp: '2025-10-30 09:00:00',
          status: 'refund_requested',
          description: '订单退款，客服申请退票',
          operator: '财务-李经理',
        },
        {
          timestamp: '2025-10-30 09:05:00',
          status: 'refunding',
          description: '系统开始处理退票请求',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251025-007',
      applicantUserId: 'user-001',
      applicantUserName: '张三',
      applicantUserContact: '13800138000',
      invoiceApplyTime: '2025-10-24 08:00:00',
      invoiceSuccessTime: '2025-10-24 08:30:00',
      emailSendTime: '2025-10-24 08:31:00',
      invoiceContent: '住宿费',
      invoiceCode: '1234567890',
      invoiceNumber: '00001239',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'zhangsan@example.com',
      invoiceTitle: '张三',
      taxNumber: '--',
      invoiceAmount: 878.00,
      status: 'refund_success',
      invoiceType: 'electronic',
      orders: [
        {
          orderId: 'ORD-2025007',
          hotelName: '杭州西湖国宾馆',
          amount: 878.00,
          createdAt: '2025-10-20 08:45:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-24 08:00:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 08:05:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 08:30:00',
          status: 'invoice_success_email_not_sent',
          description: '开票成功，准备发送邮件',
          operator: '系统',
        },
        {
          timestamp: '2025-10-24 08:31:00',
          status: 'invoice_success_email_sent',
          description: '发票邮件已成功发送',
          operator: '系统',
        },
        {
          timestamp: '2025-10-28 10:00:00',
          status: 'refund_requested',
          description: '订单退款，客服申请退票',
          operator: '财务-王经理',
        },
        {
          timestamp: '2025-10-28 10:05:00',
          status: 'refunding',
          description: '系统开始处理退票请求',
          operator: '系统',
        },
        {
          timestamp: '2025-10-28 10:10:00',
          status: 'refund_success',
          description: '退票成功，发票已作废',
          operator: '系统',
        },
      ],
    },
    {
      invoiceId: 'INV-20251024-008',
      applicantUserId: 'user-005',
      applicantUserName: '钱七',
      applicantUserContact: '13500135000',
      invoiceApplyTime: '2025-10-23 15:00:00',
      invoiceContent: '住宿费',
      invoiceIssuer: '某某酒店预订平台',
      recipientEmail: 'qianqi@example.com',
      invoiceTitle: '钱七',
      taxNumber: '--',
      invoiceAmount: 907.50,
      status: 'invoicing',
      invoiceType: 'electronic',
      orders: [
        {
          orderId: 'ORD-2025004',
          hotelName: '广州白天鹅宾馆',
          amount: 907.50,
          createdAt: '2025-10-24 11:00:00',
        },
      ],
      trajectory: [
        {
          timestamp: '2025-10-23 15:00:00',
          status: 'pending_invoice',
          description: '用户提交开票申请',
          operator: '系统',
        },
        {
          timestamp: '2025-10-23 15:05:00',
          status: 'invoicing',
          description: '系统开始处理开票请求',
          operator: '系统',
        },
      ],
    },
  ];
}

