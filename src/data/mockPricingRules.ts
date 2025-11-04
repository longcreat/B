// 价格配置规则相关的 mock 数据

export interface PlatformMarkupRule {
  id: string;
  name: string;
  scope: 'global' | 'brand' | 'city' | 'supplier';
  target?: string; // 品牌名、城市名或供应商ID
  markupRate: number; // 平台利润率（百分比）
  priority: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

/**
 * 获取模拟价格配置规则数据
 */
export function getMockPricingRules(): PlatformMarkupRule[] {
  return [
    {
      id: '1',
      name: '全局基础利润率',
      scope: 'global',
      markupRate: 10,
      priority: 999,
      status: 'active',
      createdAt: '2025-10-01 00:00:00',
    },
    {
      id: '2',
      name: '希尔顿品牌利润率',
      scope: 'brand',
      target: '希尔顿',
      markupRate: 12,
      priority: 10,
      status: 'active',
      createdAt: '2025-10-15 10:30:00',
    },
    {
      id: '3',
      name: '北京地区利润率',
      scope: 'city',
      target: '北京',
      markupRate: 15,
      priority: 20,
      status: 'active',
      createdAt: '2025-10-20 14:20:00',
    },
  ];
}

