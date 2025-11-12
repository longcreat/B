// 订单相关的 mock 数据

export type OrderStatus =
  | 'pending_payment'
  | 'pending_confirm'
  | 'confirmed'
  | 'pending_checkin'
  | 'completed'
  | 'settleable'
  | 'cancelled_free'
  | 'cancelled_paid'
  | 'no_show'
  | 'after_sale';
export type SettlementStatus = 'pending' | 'settleable' | 'processing' | 'settled';

export interface Order {
  orderId: string;
  hotelName: string;
  hotelNameEn?: string; // 酒店英文名（可选）
  hotelAddress: string;
  hotelPhone?: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  rooms: number;
  roomCount?: number; // 房间数量（可选，默认为1）
  
  // Partner关联信息（根据系统架构图新增）
  bigBPartnerId?: string; // 大B客户ID（订单必须关联大B客户）
  bigBPartnerName?: string;
  bigBPartnerType?: 'mcp' | 'saas' | 'affiliate';
  bigBCertificationType?: 'personal' | 'enterprise';
  bigBContactPhone?: string;
  smallBPartnerId?: string; // 小B客户ID（可选，当订单由小B链接生成时必填）
  partnerBusinessModel: 'mcp' | 'saas' | 'affiliate'; // 业务模式（来自大B客户）
  partnerCanSetMarkupRate: boolean; // 是否允许设置加价率（来自大B客户）
  
  // 小B信息（冗余字段，用于显示）
  partnerId?: string; // 商户ID
  partnerName: string;
  partnerEmail: string;
  partnerType: 'individual' | 'influencer' | 'enterprise';
  partnerPhone: string;
  certificationType: 'personal' | 'enterprise';
  
  // 大B信息（当小B挂载在大B下时）
  parentPartnerName?: string; // 大B名称
  parentPartnerType?: string; // 大B用户信息类型
  parentPartnerBusinessMode?: string; // 大B业务模式
  
  // 客户信息
  customerName: string; // 客户姓名（用于显示）
  guestName?: string; // 入住人姓名（可选，如果没有则使用customerName）
  adultCount?: number; // 成人数量（可选）
  childCount?: number; // 儿童数量（可选）
  customerPhone: string;
  
  // 价格体系
  p0_supplierCost: number; // 供应商底价P0
  p1_platformPrice?: number; // 平台供货价P1（SaaS模式有效，MCP/推广联盟可为空或等于P2）
  p2_salePrice: number; // 销售价P2
  nightlyRates?: {
    date: string;
    p0: number;
    p1?: number;
    p2: number;
    discountAmount?: number; // 该晚优惠金额
    actualAmount?: number; // 该晚实付金额
    refundAmount?: number; // 该晚退款金额
    status?: 'normal' | 'cancelled' | 'refunded' | 'partial_refunded'; // 该晚状态
  }[];
  
  // 价格比例（订单级别）
  platformMarkupRate: number; // 平台加价率（百分比，SaaS模式为P0到P1的加价率；MCP/推广联盟模式为平台从P0直接加价到P2的加价率）
  partnerMarkupRate?: number; // 小B加价率（百分比，从P1到P2的加价率，仅SaaS模式有效）
  partnerCommissionRate?: number; // 小B佣金率（百分比，从P0到P2的总利润中给MCP/推广联盟的分成比例，仅MCP/推广联盟有效）
  
  // 利润计算
  platformProfit: number; // 平台利润
  partnerProfit: number; // 小B利润/佣金（SaaS模式为利润，MCP/推广联盟模式为佣金）
  bigBProfit?: number; // 大B利润（当订单由小B链接生成时，大B利润 = 总利润 - 小B佣金）
  totalDiscountAmount?: number; // 订单总优惠金额
  discountContribution?: {
    platform: number;
    bigB: number;
  };
  commissionAmount?: number; // 实际佣金金额
  
  // 实付金额和退款金额
  actualAmount: number; // 实付金额
  refundAmount?: number; // 退款金额（可选）
  refundRecords?: {
    id: string;
    date: string;
    type: 'cancel' | 'refund'; // 操作类型：取消或退款
    amount: number;
    reason: string;
    proofUrl?: string; // 凭证URL
    affectedDates: string[]; // 影响的日期列表
    handler?: string;
  }[];
  
  // 订单状态
  orderStatus: OrderStatus;
  
  // 五重门控状态
  gates: {
    serviceCompleted: boolean; // Gate 1: 服务已完成
    coolingOffPassed: boolean; // Gate 2: 冻结期已过
    noDispute: boolean; // Gate 3: 订单无未决争议
    costReconciled: boolean; // Gate 4: 供应商成本已对账
    accountHealthy: boolean; // Gate 5: 结算对象状态正常
  };
  
  settlementStatus: SettlementStatus;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  settledAt?: string;
  settlementTime?: string; // 结算时间
  settlementAmount?: number;
  riskReview?: {
    status: 'approved' | 'pending' | 'rejected';
    reviewedAt?: string; // 审核时间
    updatedAt: string;
    reviewer?: string;
  };
  
  // 状态历史时间轴
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    description?: string;
  }[];
}

/**
 * 获取模拟订单数据
 */
export function getMockOrders(): Order[] {
  return [
    {
      orderId: 'ORD-2025001',
      hotelName: '北京希尔顿酒店',
      hotelNameEn: 'Beijing Hilton Hotel',
      hotelAddress: '北京市朝阳区东三环北路8号',
      hotelPhone: '010-8888-0001',
      roomType: '豪华大床房',
      checkInDate: '2025-10-18',
      checkOutDate: '2025-10-20',
      nights: 2,
      rooms: 1,
      bigBPartnerId: 'P002', // 挂载在大B客户P002（旅游达人小李）下
      bigBPartnerName: '旅游达人小李',
      bigBPartnerType: 'saas',
      bigBCertificationType: 'personal',
      bigBContactPhone: '139****5555',
      smallBPartnerId: 'P001', // 小B客户P001（张三）
      partnerBusinessModel: 'affiliate',
      partnerCanSetMarkupRate: false,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      partnerPhone: '138****0001',
      certificationType: 'personal',
      parentPartnerName: '旅游达人小李',
      parentPartnerType: '旅行代理',
      parentPartnerBusinessMode: 'SaaS',
      customerName: '王先生',
      guestName: '王先生',
      adultCount: 2,
      childCount: 0,
      customerPhone: '138****5678',
      p0_supplierCost: 800,
      p1_platformPrice: 880,
      p2_salePrice: 968,
      nightlyRates: [
        { date: '2025-10-18', p0: 400, p1: 440, p2: 484 },
        { date: '2025-10-19', p0: 400, p1: 440, p2: 484 },
      ],
      platformMarkupRate: 10, // 平台加价率10%
      partnerCommissionRate: 1.736, // 小B佣金率1.736%（基于P2，上限=10%/(1+10%)≈9.09%，符合规则✓）
      platformProfit: 80, // 平台利润 = P1 - P0 = 880 - 800 = 80
      partnerProfit: 16.8, // 小B佣金 = P2 × 佣金率 = 968 × 1.736% = 16.8
      bigBProfit: 71.2, // 大B利润 = (P2-P1) - 小B佣金 = (968-880) - 16.8 = 71.2（>0，大B不亏损✓）
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 16.8,
      actualAmount: 968,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settleable',
      createdAt: '2025-10-15 14:30:00',
      confirmedAt: '2025-10-15 15:10:00',
      completedAt: '2025-10-20 12:20:00',
      settlementAmount: 800,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-21 09:15:00',
        reviewer: '风控-张敏',
      },
    },
    {
      orderId: 'ORD-2025002',
      hotelName: '上海浦东香格里拉',
      hotelNameEn: 'Pudong Shangri-La Shanghai',
      hotelAddress: '上海市浦东新区富城路33号',
      hotelPhone: '021-6666-0202',
      roomType: '行政套房',
      checkInDate: '2025-10-23',
      checkOutDate: '2025-10-25',
      nights: 2,
      rooms: 1,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      partnerBusinessModel: 'saas',
      partnerCanSetMarkupRate: true,
      partnerPhone: '021-9999-8888',
      certificationType: 'enterprise',
      customerName: '刘女士',
      guestName: '刘女士',
      adultCount: 1,
      childCount: 1,
      customerPhone: '139****1234',
      p0_supplierCost: 1200,
      p1_platformPrice: 1320,
      p2_salePrice: 1452,
      platformMarkupRate: 10,
      partnerMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-23', p0: 600, p1: 660, p2: 726 },
        { date: '2025-10-24', p0: 600, p1: 660, p2: 726 },
      ],
      platformProfit: 120,
      partnerProfit: 132,
      totalDiscountAmount: 80,
      discountContribution: { platform: 60, bigB: 20 },
      commissionAmount: 132,
      actualAmount: 1306.8, // 1452 - 145.2 (部分退款)
      refundAmount: 145.2,
      refundRecords: [
        {
          id: 'RF-2025002-1',
          date: '2025-10-24 18:30:00',
          type: 'refund',
          amount: 145.2,
          reason: '客户缩短行程退款',
          affectedDates: ['2025-10-24'],
          handler: '客服-王丽',
        },
      ],
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-20 10:15:00',
      confirmedAt: '2025-10-20 11:00:00',
      completedAt: '2025-10-25 10:30:00',
      settlementAmount: 1161.6,
      riskReview: {
        status: 'pending',
        updatedAt: '2025-10-25 12:00:00',
        reviewer: '风控-待分配',
      },
    },
    {
      orderId: 'ORD-2025003',
      hotelName: '深圳湾万豪酒店',
      hotelNameEn: 'Shenzhen Bay Marriott Hotel',
      hotelAddress: '深圳市南山区后海滨路3101号',
      hotelPhone: '0755-7777-0888',
      roomType: '海景大床房',
      checkInDate: '2025-10-20',
      checkOutDate: '2025-10-22',
      nights: 2,
      rooms: 1,
      bigBPartnerId: 'P002', // 挂载在大B客户P002下
      bigBPartnerName: '旅游达人小李',
      bigBPartnerType: 'saas',
      bigBCertificationType: 'personal',
      bigBContactPhone: '139****5555',
      smallBPartnerId: 'P001', // 小B客户P001
      partnerBusinessModel: 'affiliate',
      partnerCanSetMarkupRate: false,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      partnerPhone: '138****0001',
      certificationType: 'personal',
      parentPartnerName: '旅游达人小李',
      parentPartnerType: '旅行代理',
      parentPartnerBusinessMode: 'SaaS',
      customerName: '赵先生',
      guestName: '赵先生',
      adultCount: 2,
      childCount: 1,
      customerPhone: '136****9876',
      p0_supplierCost: 950,
      p1_platformPrice: 1045,
      p2_salePrice: 1149.5,
      nightlyRates: [
        { date: '2025-10-20', p0: 475, p1: 522.5, p2: 574.75 },
        { date: '2025-10-21', p0: 475, p1: 522.5, p2: 574.75 },
      ],
      platformMarkupRate: 10,
      partnerCommissionRate: 1.736, // 小B佣金率1.736%（基于P2，上限=10%/(1+10%)≈9.09%，符合规则✓）
      platformProfit: 95, // 平台利润 = P1 - P0 = 1045 - 950 = 95
      partnerProfit: 19.95, // 小B佣金 = P2 × 佣金率 = 1149.5 × 1.736% = 19.95
      bigBProfit: 84.55, // 大B利润 = (P2-P1) - 小B佣金 = (1149.5-1045) - 19.95 = 84.55（>0，大B不亏损✓）
      totalDiscountAmount: 120,
      discountContribution: { platform: 80, bigB: 40 },
      commissionAmount: 19.95,
      actualAmount: 459.8, // 1149.5 - 689.7 (大量退款)
      refundAmount: 689.7,
      refundRecords: [
        {
          id: 'RF-2025003-1',
          date: '2025-10-21 09:20:00',
          type: 'refund',
          amount: 689.7,
          reason: '客户投诉房间品质，协商退款',
          affectedDates: ['2025-10-20', '2025-10-21'],
          handler: '客服-陈涛',
        },
      ],
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: false,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-18 16:45:00',
      confirmedAt: '2025-10-18 18:10:00',
      completedAt: '2025-10-22 11:00:00',
      riskReview: {
        status: 'pending',
        updatedAt: '2025-10-22 13:30:00',
        reviewer: '风控-李强',
      },
    },
    {
      orderId: 'ORD-2025004',
      hotelName: '广州四季酒店',
      hotelAddress: '广州市天河区珠江新城珠江西路5号',
      hotelPhone: '020-8888-0101',
      roomType: '豪华套房',
      checkInDate: '2025-10-25',
      checkOutDate: '2025-10-27',
      nights: 2,
      rooms: 1,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      partnerBusinessModel: 'mcp',
      partnerCanSetMarkupRate: false,
      partnerPhone: '139****5555',
      certificationType: 'personal',
      customerName: '孙女士',
      customerPhone: '135****2468',
      p0_supplierCost: 1100,
      p1_platformPrice: 1210,
      p2_salePrice: 1331,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-25', p0: 550, p1: 605, p2: 665.5 },
        { date: '2025-10-26', p0: 550, p1: 605, p2: 665.5 },
      ],
      platformProfit: 110,
      partnerProfit: 121,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 121,
      actualAmount: 1331,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'confirmed',
      gates: {
        serviceCompleted: false,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: false,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-22 11:20:00',
      confirmedAt: '2025-10-22 12:00:00',
      riskReview: {
        status: 'pending',
        updatedAt: '2025-10-22 18:45:00',
        reviewer: '风控-待分配',
      },
    },
    {
      orderId: 'ORD-2025005',
      hotelName: '杭州西湖国宾馆',
      hotelAddress: '杭州市西湖区杨公堤18号',
      hotelPhone: '0571-1234-8888',
      roomType: '湖景大床房',
      checkInDate: '2025-10-21',
      checkOutDate: '2025-10-24',
      nights: 3,
      rooms: 1,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      partnerBusinessModel: 'saas',
      partnerCanSetMarkupRate: true,
      partnerPhone: '021-9999-8888',
      certificationType: 'enterprise',
      customerName: '周先生',
      customerPhone: '137****3690',
      p0_supplierCost: 720,
      p1_platformPrice: 792,
      p2_salePrice: 878,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-21', p0: 240, p1: 264, p2: 292.67 },
        { date: '2025-10-22', p0: 240, p1: 264, p2: 292.67 },
        { date: '2025-10-23', p0: 240, p1: 264, p2: 292.67 },
      ],
      platformProfit: 72,
      partnerProfit: 86,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 86,
      actualAmount: 878,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settleable',
      createdAt: '2025-10-19 09:30:00',
      confirmedAt: '2025-10-19 10:20:00',
      completedAt: '2025-10-24 11:30:00',
      settlementAmount: 878,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-25 09:00:00',
        reviewer: '风控-张敏',
      },
    },
    {
      orderId: 'ORD-2025006',
      hotelName: '成都洲际酒店',
      hotelAddress: '成都市锦江区滨江东路9号',
      hotelPhone: '028-5555-6677',
      roomType: '行政大床房',
      checkInDate: '2025-10-19',
      checkOutDate: '2025-10-21',
      nights: 2,
      rooms: 1,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      partnerBusinessModel: 'mcp',
      partnerCanSetMarkupRate: false,
      partnerPhone: '139****5555',
      certificationType: 'personal',
      customerName: '吴女士',
      customerPhone: '134****7890',
      p0_supplierCost: 850,
      p1_platformPrice: 935,
      p2_salePrice: 1028.5,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-19', p0: 425, p1: 467.5, p2: 514.25 },
        { date: '2025-10-20', p0: 425, p1: 467.5, p2: 514.25 },
      ],
      platformProfit: 85,
      partnerProfit: 93.5,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 93.5,
      actualAmount: 1028.5,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settled',
      createdAt: '2025-10-16 13:15:00',
      confirmedAt: '2025-10-16 15:00:00',
      completedAt: '2025-10-21 12:00:00',
      settledAt: '2025-10-30 10:00:00',
      settlementAmount: 1028.5,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-27 09:40:00',
        reviewer: '风控-王强',
      },
    },
    {
      orderId: 'ORD-2025007',
      hotelName: '杭州西湖国宾馆',
      hotelAddress: '杭州市西湖区杨公堤18号',
      hotelPhone: '0571-1234-8888',
      roomType: '湖景大床房',
      checkInDate: '2025-10-22',
      checkOutDate: '2025-10-24',
      nights: 2,
      rooms: 1,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      partnerBusinessModel: 'affiliate',
      partnerCanSetMarkupRate: false,
      partnerPhone: '138****0001',
      certificationType: 'personal',
      parentPartnerName: '旅游达人小李',
      parentPartnerType: '旅行代理',
      parentPartnerBusinessMode: 'SaaS',
      customerName: '郑先生',
      customerPhone: '133****4567',
      p0_supplierCost: 720,
      p1_platformPrice: 792,
      p2_salePrice: 878,
      platformMarkupRate: 10,
      partnerCommissionRate: 1.8, // 小B佣金率1.8%（基于P2，上限=10%/(1+10%)≈9.09%，符合规则✓）
      nightlyRates: [
        { date: '2025-10-22', p0: 360, p1: 396, p2: 439 },
        { date: '2025-10-23', p0: 360, p1: 396, p2: 439 },
      ],
      platformProfit: 72, // 平台利润 = P1 - P0 = 792 - 720 = 72
      partnerProfit: 15.8, // 小B佣金 = P2 × 佣金率 = 878 × 1.8% = 15.8
      bigBProfit: 72.2, // 大B利润 = (P2-P1) - 小B佣金 = (878-792) - 15.8 = 72.2（>0，大B不亏损✓）
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 15.8,
      actualAmount: 878,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settleable',
      createdAt: '2025-10-20 08:45:00',
      confirmedAt: '2025-10-20 09:30:00',
      completedAt: '2025-10-24 10:10:00',
      settlementAmount: 878,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-25 08:00:00',
        reviewer: '风控-张敏',
      },
    },
    {
      orderId: 'ORD-2025008',
      hotelName: '上海浦东香格里拉',
      hotelAddress: '上海市浦东新区富城路33号',
      hotelPhone: '021-6666-0202',
      roomType: '豪华大床房',
      checkInDate: '2025-10-16',
      checkOutDate: '2025-10-18',
      nights: 2,
      rooms: 1,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      partnerBusinessModel: 'saas',
      partnerCanSetMarkupRate: true,
      partnerPhone: '021-9999-8888',
      certificationType: 'enterprise',
      customerName: '冯女士',
      customerPhone: '132****8901',
      p0_supplierCost: 1200,
      p1_platformPrice: 1320,
      p2_salePrice: 1452,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-16', p0: 600, p1: 660, p2: 726 },
        { date: '2025-10-17', p0: 600, p1: 660, p2: 726 },
      ],
      platformProfit: 120,
      partnerProfit: 132,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 132,
      actualAmount: 1452,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settleable',
      createdAt: '2025-10-13 15:20:00',
      confirmedAt: '2025-10-13 16:00:00',
      completedAt: '2025-10-18 09:40:00',
      settlementAmount: 1452,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-19 09:00:00',
        reviewer: '风控-张敏',
      },
    },
    {
      orderId: 'ORD-2025009',
      hotelName: '成都洲际酒店',
      hotelAddress: '成都市锦江区滨江东路9号',
      hotelPhone: '028-5555-6677',
      roomType: '行政大床房',
      checkInDate: '2025-10-18',
      checkOutDate: '2025-10-20',
      nights: 2,
      rooms: 1,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      partnerBusinessModel: 'saas',
      partnerCanSetMarkupRate: true,
      partnerPhone: '021-9999-8888',
      certificationType: 'enterprise',
      customerName: '陈先生',
      customerPhone: '131****2345',
      p0_supplierCost: 850,
      p1_platformPrice: 935,
      p2_salePrice: 1028.5,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-18', p0: 425, p1: 467.5, p2: 514.25 },
        { date: '2025-10-19', p0: 425, p1: 467.5, p2: 514.25 },
      ],
      platformProfit: 85,
      partnerProfit: 93.5,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 93.5,
      actualAmount: 1028.5,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'settleable',
      createdAt: '2025-10-15 10:00:00',
      confirmedAt: '2025-10-15 10:40:00',
      completedAt: '2025-10-20 09:30:00',
      settlementAmount: 1028.5,
      riskReview: {
        status: 'approved',
        updatedAt: '2025-10-21 08:20:00',
        reviewer: '风控-王强',
      },
    },
    {
      orderId: 'ORD-2025010',
      hotelName: '北京希尔顿酒店',
      hotelAddress: '北京市朝阳区东三环北路8号',
      hotelPhone: '010-8888-0001',
      roomType: '标准双床房',
      checkInDate: '2025-10-26',
      checkOutDate: '2025-10-28',
      nights: 2,
      rooms: 1,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      partnerBusinessModel: 'mcp',
      partnerCanSetMarkupRate: false,
      partnerPhone: '139****5555',
      certificationType: 'personal',
      customerName: '褚女士',
      customerPhone: '130****6789',
      p0_supplierCost: 750,
      p1_platformPrice: 825,
      p2_salePrice: 907.5,
      platformMarkupRate: 10,
      nightlyRates: [
        { date: '2025-10-26', p0: 375, p1: 412.5, p2: 453.75 },
        { date: '2025-10-27', p0: 375, p1: 412.5, p2: 453.75 },
      ],
      platformProfit: 75,
      partnerProfit: 82.5,
      totalDiscountAmount: 0,
      discountContribution: { platform: 0, bigB: 0 },
      commissionAmount: 82.5,
      actualAmount: 907.5,
      refundAmount: 0,
      refundRecords: [],
      orderStatus: 'pending_payment',
      gates: {
        serviceCompleted: false,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: false,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-24 14:00:00',
      riskReview: {
        status: 'pending',
        updatedAt: '2025-10-24 16:15:00',
        reviewer: '风控-待分配',
      },
    },
  ];
}
