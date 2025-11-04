// 结算批次相关的 mock 数据

export interface BatchOrder {
  orderId: string;
  hotelName: string;
  checkOutDate: string;
  
  // 价格体系
  p0_supplierCost: number;
  p1_platformPrice: number;
  p2_salePrice: number;
  
  // 利润
  platformProfit: number;
  partnerProfit: number;
  
  // 五重门控状态
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
 * 获取模拟结算批次数据
 */
export function getMockSettlementBatches(): SettlementBatch[] {
  return [
    {
      batchId: 'BATCH-20251030-001',
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      orderCount: 3,
      totalProfit: 278.5,
      status: 'pending',
      createdAt: '2025-10-30 01:00:00',
      orders: [
        {
          orderId: 'ORD-2025001',
          hotelName: '北京希尔顿酒店',
          checkOutDate: '2025-10-20',
          p0_supplierCost: 800,
          p1_platformPrice: 880,
          p2_salePrice: 968,
          platformProfit: 80,
          partnerProfit: 88,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025003',
          hotelName: '深圳湾万豪酒店',
          checkOutDate: '2025-10-22',
          p0_supplierCost: 950,
          p1_platformPrice: 1045,
          p2_salePrice: 1149.5,
          platformProfit: 95,
          partnerProfit: 104.5,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025007',
          hotelName: '杭州西湖国宾馆',
          checkOutDate: '2025-10-24',
          p0_supplierCost: 720,
          p1_platformPrice: 792,
          p2_salePrice: 878,
          platformProfit: 72,
          partnerProfit: 86,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
    {
      batchId: 'BATCH-20251023-002',
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      orderCount: 2,
      totalProfit: 207.3,
      status: 'credited',
      createdAt: '2025-10-23 01:00:00',
      approvedAt: '2025-10-23 09:30:00',
      creditedAt: '2025-10-23 09:31:00',
      orders: [
        {
          orderId: 'ORD-2025008',
          hotelName: '上海浦东香格里拉',
          checkOutDate: '2025-10-18',
          p0_supplierCost: 1200,
          p1_platformPrice: 1320,
          p2_salePrice: 1452,
          platformProfit: 120,
          partnerProfit: 132,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025009',
          hotelName: '成都洲际酒店',
          checkOutDate: '2025-10-20',
          p0_supplierCost: 850,
          p1_platformPrice: 935,
          p2_salePrice: 1028.5,
          platformProfit: 85,
          partnerProfit: 93.5,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
    {
      batchId: 'BATCH-20251025-003',
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      orderCount: 2,
      totalProfit: 157.5,
      status: 'approved',
      createdAt: '2025-10-25 01:00:00',
      approvedAt: '2025-10-25 10:15:00',
      orders: [
        {
          orderId: 'ORD-2025010',
          hotelName: '广州白天鹅宾馆',
          checkOutDate: '2025-10-21',
          p0_supplierCost: 750,
          p1_platformPrice: 825,
          p2_salePrice: 907.5,
          platformProfit: 75,
          partnerProfit: 82.5,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025011',
          hotelName: '南京金陵饭店',
          checkOutDate: '2025-10-23',
          p0_supplierCost: 650,
          p1_platformPrice: 715,
          p2_salePrice: 790,
          platformProfit: 65,
          partnerProfit: 75,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
  ];
}

