// 订单相关的 mock 数据

export type OrderStatus = 'pending_payment' | 'pending_confirm' | 'confirmed' | 'completed' | 'completed_settleable' | 'cancelled_free' | 'cancelled_paid' | 'no_show' | 'disputed';
export type SettlementStatus = 'pending' | 'ready' | 'processing' | 'completed';

export interface Order {
  orderId: string;
  hotelName: string;
  hotelNameEn?: string; // 酒店英文名（可选）
  hotelAddress: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  
  // Partner关联信息（根据系统架构图新增）
  bigBPartnerId?: string; // 大B客户ID（订单必须关联大B客户）
  smallBPartnerId?: string; // 小B客户ID（可选，当订单由小B链接生成时必填）
  partnerBusinessModel: 'mcp' | 'saas' | 'affiliate'; // 业务模式（来自大B客户）
  partnerCanSetMarkupRate: boolean; // 是否允许设置加价率（来自大B客户）
  
  // 小B信息（冗余字段，用于显示）
  partnerName: string;
  partnerEmail: string;
  partnerType: 'individual' | 'influencer' | 'enterprise';
  
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
  
  // 价格比例（订单级别）
  platformMarkupRate: number; // 平台加价率（百分比，SaaS模式为P0到P1的加价率；MCP/推广联盟模式为平台从P0直接加价到P2的加价率）
  partnerMarkupRate?: number; // 小B加价率（百分比，从P1到P2的加价率，仅SaaS模式有效）
  partnerCommissionRate?: number; // 小B佣金率（百分比，从P0到P2的总利润中给MCP/推广联盟的分成比例，仅MCP/推广联盟有效）
  
  // 利润计算
  platformProfit: number; // 平台利润
  partnerProfit: number; // 小B利润/佣金（SaaS模式为利润，MCP/推广联盟模式为佣金）
  bigBProfit?: number; // 大B利润（当订单由小B链接生成时，大B利润 = 总利润 - 小B佣金）
  
  // 实付金额和退款金额
  actualAmount: number; // 实付金额
  refundAmount?: number; // 退款金额（可选）
  
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
  settledAt?: string;
  
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
      roomType: '豪华大床房',
      checkInDate: '2025-10-18',
      checkOutDate: '2025-10-20',
      nights: 2,
      bigBPartnerId: 'P002', // 挂载在大B客户P002（旅游达人小李）下
      smallBPartnerId: 'P001', // 小B客户P001（张三）
      partnerBusinessModel: 'affiliate',
      partnerCanSetMarkupRate: false,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      customerName: '王先生',
      guestName: '王先生',
      adultCount: 2,
      childCount: 0,
      customerPhone: '138****5678',
      p0_supplierCost: 800,
      p1_platformPrice: 880,
      p2_salePrice: 968,
      platformMarkupRate: 10, // 平台加价率10%
      partnerCommissionRate: 10, // 小B佣金率10%
      platformProfit: 80,
      partnerProfit: 16.8, // 小B佣金 = (968-800) * 10% = 16.8
      bigBProfit: 151.2, // 大B利润 = 总利润 - 小B佣金 = 168 - 16.8 = 151.2
      actualAmount: 968,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'ready',
      createdAt: '2025-10-15 14:30:00',
    },
    {
      orderId: 'ORD-2025002',
      hotelName: '上海浦东香格里拉',
      hotelNameEn: 'Pudong Shangri-La Shanghai',
      hotelAddress: '上海市浦东新区富城路33号',
      roomType: '行政套房',
      checkInDate: '2025-10-23',
      checkOutDate: '2025-10-25',
      nights: 2,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '刘女士',
      guestName: '刘女士',
      adultCount: 1,
      childCount: 1,
      customerPhone: '139****1234',
      p0_supplierCost: 1200,
      p1_platformPrice: 1320,
      p2_salePrice: 1452,
      platformProfit: 120,
      partnerProfit: 132,
      actualAmount: 1306.8, // 1452 - 145.2 (部分退款)
      refundAmount: 145.2,
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
    },
    {
      orderId: 'ORD-2025003',
      hotelName: '深圳湾万豪酒店',
      hotelNameEn: 'Shenzhen Bay Marriott Hotel',
      hotelAddress: '深圳市南山区后海滨路3101号',
      roomType: '海景大床房',
      checkInDate: '2025-10-20',
      checkOutDate: '2025-10-22',
      nights: 2,
      bigBPartnerId: 'P002', // 挂载在大B客户P002下
      smallBPartnerId: 'P001', // 小B客户P001
      partnerBusinessModel: 'affiliate',
      partnerCanSetMarkupRate: false,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      customerName: '赵先生',
      guestName: '赵先生',
      adultCount: 2,
      childCount: 1,
      customerPhone: '136****9876',
      p0_supplierCost: 950,
      p1_platformPrice: 1045,
      p2_salePrice: 1149.5,
      platformMarkupRate: 10,
      partnerCommissionRate: 10,
      platformProfit: 95,
      partnerProfit: 19.95, // 小B佣金 = (1149.5-950) * 10% = 19.95
      bigBProfit: 179.55, // 大B利润 = 总利润 - 小B佣金 = 199.5 - 19.95 = 179.55
      actualAmount: 459.8, // 1149.5 - 689.7 (大量退款)
      refundAmount: 689.7,
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
    },
    {
      orderId: 'ORD-2025004',
      hotelName: '广州四季酒店',
      hotelAddress: '广州市天河区珠江新城珠江西路5号',
      roomType: '豪华套房',
      checkInDate: '2025-10-25',
      checkOutDate: '2025-10-27',
      nights: 2,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      customerName: '孙女士',
      customerPhone: '135****2468',
      p0_supplierCost: 1100,
      p1_platformPrice: 1210,
      p2_salePrice: 1331,
      platformProfit: 110,
      partnerProfit: 121,
      actualAmount: 1331,
      refundAmount: 0,
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
    },
    {
      orderId: 'ORD-2025005',
      hotelName: '杭州西湖国宾馆',
      hotelAddress: '杭州市西湖区杨公堤18号',
      roomType: '湖景大床房',
      checkInDate: '2025-10-21',
      checkOutDate: '2025-10-24',
      nights: 3,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '周先生',
      customerPhone: '137****3690',
      p0_supplierCost: 720,
      p1_platformPrice: 792,
      p2_salePrice: 878,
      platformProfit: 72,
      partnerProfit: 86,
      actualAmount: 878,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'ready',
      createdAt: '2025-10-19 09:30:00',
    },
    {
      orderId: 'ORD-2025006',
      hotelName: '成都洲际酒店',
      hotelAddress: '成都市锦江区滨江东路9号',
      roomType: '行政大床房',
      checkInDate: '2025-10-19',
      checkOutDate: '2025-10-21',
      nights: 2,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      customerName: '吴女士',
      customerPhone: '134****7890',
      p0_supplierCost: 850,
      p1_platformPrice: 935,
      p2_salePrice: 1028.5,
      platformProfit: 85,
      partnerProfit: 93.5,
      actualAmount: 1028.5,
      refundAmount: 0,
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'completed',
      createdAt: '2025-10-16 13:15:00',
      settledAt: '2025-10-30 10:00:00',
    },
    {
      orderId: 'ORD-2025007',
      hotelName: '杭州西湖国宾馆',
      hotelAddress: '杭州市西湖区杨公堤18号',
      roomType: '湖景大床房',
      checkInDate: '2025-10-22',
      checkOutDate: '2025-10-24',
      nights: 2,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      customerName: '郑先生',
      customerPhone: '133****4567',
      p0_supplierCost: 720,
      p1_platformPrice: 792,
      p2_salePrice: 878,
      platformProfit: 72,
      partnerProfit: 86,
      actualAmount: 878,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'ready',
      createdAt: '2025-10-20 08:45:00',
    },
    {
      orderId: 'ORD-2025008',
      hotelName: '上海浦东香格里拉',
      hotelAddress: '上海市浦东新区富城路33号',
      roomType: '豪华大床房',
      checkInDate: '2025-10-16',
      checkOutDate: '2025-10-18',
      nights: 2,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '冯女士',
      customerPhone: '132****8901',
      p0_supplierCost: 1200,
      p1_platformPrice: 1320,
      p2_salePrice: 1452,
      platformProfit: 120,
      partnerProfit: 132,
      actualAmount: 1452,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'ready',
      createdAt: '2025-10-13 15:20:00',
    },
    {
      orderId: 'ORD-2025009',
      hotelName: '成都洲际酒店',
      hotelAddress: '成都市锦江区滨江东路9号',
      roomType: '行政大床房',
      checkInDate: '2025-10-18',
      checkOutDate: '2025-10-20',
      nights: 2,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '陈先生',
      customerPhone: '131****2345',
      p0_supplierCost: 850,
      p1_platformPrice: 935,
      p2_salePrice: 1028.5,
      platformProfit: 85,
      partnerProfit: 93.5,
      actualAmount: 1028.5,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'ready',
      createdAt: '2025-10-15 10:00:00',
    },
    {
      orderId: 'ORD-2025010',
      hotelName: '北京希尔顿酒店',
      hotelAddress: '北京市朝阳区东三环北路8号',
      roomType: '标准双床房',
      checkInDate: '2025-10-26',
      checkOutDate: '2025-10-28',
      nights: 2,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      customerName: '褚女士',
      customerPhone: '130****6789',
      p0_supplierCost: 750,
      p1_platformPrice: 825,
      p2_salePrice: 907.5,
      platformProfit: 75,
      partnerProfit: 82.5,
      actualAmount: 907.5,
      refundAmount: 0,
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
    },
  ];
}

