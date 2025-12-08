// 价格配置规则相关的 mock 数据

// 适用范围类型：全局 < 国家 < 城市 < 品牌 < 酒店（优先级从低到高）
export type PricingScope = 'global' | 'country' | 'city' | 'brand' | 'hotel';

export interface PlatformMarkupRule {
  id: string;
  name: string;
  scope: PricingScope;
  // 目标信息
  countryCode?: string; // 国家代码
  countryName?: string; // 国家名称
  cityCode?: string; // 城市代码
  cityName?: string; // 城市名称
  brandCode?: string; // 品牌代码
  brandName?: string; // 品牌名称
  hotelId?: string; // 酒店ID
  hotelName?: string; // 酒店名称
  markupRate: number; // 平台利润率（百分比）
  priority: number; // 优先级，数字越小越优先
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  description?: string; // 规则描述
}

// 国家列表
export const COUNTRIES = [
  { code: 'CN', name: '中国' },
  { code: 'JP', name: '日本' },
  { code: 'KR', name: '韩国' },
  { code: 'TH', name: '泰国' },
  { code: 'SG', name: '新加坡' },
  { code: 'MY', name: '马来西亚' },
  { code: 'US', name: '美国' },
  { code: 'UK', name: '英国' },
  { code: 'FR', name: '法国' },
  { code: 'DE', name: '德国' },
];

// 城市列表（按国家分组）
export const CITIES: Record<string, { code: string; name: string }[]> = {
  CN: [
    { code: 'BJ', name: '北京' },
    { code: 'SH', name: '上海' },
    { code: 'GZ', name: '广州' },
    { code: 'SZ', name: '深圳' },
    { code: 'HZ', name: '杭州' },
    { code: 'CD', name: '成都' },
    { code: 'CQ', name: '重庆' },
    { code: 'NJ', name: '南京' },
  ],
  JP: [
    { code: 'TYO', name: '东京' },
    { code: 'OSA', name: '大阪' },
    { code: 'KYO', name: '京都' },
  ],
  TH: [
    { code: 'BKK', name: '曼谷' },
    { code: 'CNX', name: '清迈' },
    { code: 'HKT', name: '普吉岛' },
  ],
  SG: [
    { code: 'SIN', name: '新加坡' },
  ],
};

// 品牌列表
export const BRANDS = [
  { code: 'HILTON', name: '希尔顿' },
  { code: 'MARRIOTT', name: '万豪' },
  { code: 'IHG', name: '洲际' },
  { code: 'HYATT', name: '凯悦' },
  { code: 'ACCOR', name: '雅高' },
  { code: 'SHANGRI-LA', name: '香格里拉' },
  { code: 'FOUR-SEASONS', name: '四季' },
  { code: 'RITZ-CARLTON', name: '丽思卡尔顿' },
];

// 酒店列表（示例）
export const HOTELS = [
  { id: 'H001', name: '北京希尔顿酒店', brand: 'HILTON', city: 'BJ', country: 'CN' },
  { id: 'H002', name: '上海浦东香格里拉', brand: 'SHANGRI-LA', city: 'SH', country: 'CN' },
  { id: 'H003', name: '深圳湾万豪酒店', brand: 'MARRIOTT', city: 'SZ', country: 'CN' },
  { id: 'H004', name: '广州四季酒店', brand: 'FOUR-SEASONS', city: 'GZ', country: 'CN' },
  { id: 'H005', name: '杭州西湖国宾馆', brand: 'OTHER', city: 'HZ', country: 'CN' },
  { id: 'H006', name: '成都洲际酒店', brand: 'IHG', city: 'CD', country: 'CN' },
  { id: 'H007', name: '东京帝国酒店', brand: 'OTHER', city: 'TYO', country: 'JP' },
  { id: 'H008', name: '曼谷文华东方', brand: 'OTHER', city: 'BKK', country: 'TH' },
];

/**
 * 获取模拟价格配置规则数据
 */
export function getMockPricingRules(): PlatformMarkupRule[] {
  return [
    // 全局规则（优先级最低）
    {
      id: '1',
      name: '全局基础利润率',
      scope: 'global',
      markupRate: 10,
      priority: 1000,
      status: 'active',
      createdAt: '2025-10-01 00:00:00',
      createdBy: '系统管理员',
      description: '适用于所有未匹配其他规则的订单',
    },
    // 国家级规则
    {
      id: '2',
      name: '日本地区利润率',
      scope: 'country',
      countryCode: 'JP',
      countryName: '日本',
      markupRate: 12,
      priority: 500,
      status: 'active',
      createdAt: '2025-10-05 10:00:00',
      createdBy: '运营-张三',
      description: '日本地区酒店统一加价率',
    },
    {
      id: '3',
      name: '泰国地区利润率',
      scope: 'country',
      countryCode: 'TH',
      countryName: '泰国',
      markupRate: 15,
      priority: 500,
      status: 'active',
      createdAt: '2025-10-06 11:00:00',
      createdBy: '运营-张三',
    },
    // 城市级规则
    {
      id: '4',
      name: '北京地区利润率',
      scope: 'city',
      countryCode: 'CN',
      countryName: '中国',
      cityCode: 'BJ',
      cityName: '北京',
      markupRate: 12,
      priority: 200,
      status: 'active',
      createdAt: '2025-10-10 14:20:00',
      createdBy: '运营-李四',
      description: '北京热门城市加价',
    },
    {
      id: '5',
      name: '上海地区利润率',
      scope: 'city',
      countryCode: 'CN',
      countryName: '中国',
      cityCode: 'SH',
      cityName: '上海',
      markupRate: 12,
      priority: 200,
      status: 'active',
      createdAt: '2025-10-10 14:30:00',
      createdBy: '运营-李四',
    },
    {
      id: '6',
      name: '曼谷地区利润率',
      scope: 'city',
      countryCode: 'TH',
      countryName: '泰国',
      cityCode: 'BKK',
      cityName: '曼谷',
      markupRate: 18,
      priority: 200,
      status: 'active',
      createdAt: '2025-10-12 09:00:00',
      createdBy: '运营-王五',
    },
    // 品牌级规则
    {
      id: '7',
      name: '希尔顿品牌利润率',
      scope: 'brand',
      brandCode: 'HILTON',
      brandName: '希尔顿',
      markupRate: 8,
      priority: 100,
      status: 'active',
      createdAt: '2025-10-15 10:30:00',
      createdBy: '运营-张三',
      description: '希尔顿品牌协议价，利润率较低',
    },
    {
      id: '8',
      name: '万豪品牌利润率',
      scope: 'brand',
      brandCode: 'MARRIOTT',
      brandName: '万豪',
      markupRate: 9,
      priority: 100,
      status: 'active',
      createdAt: '2025-10-15 11:00:00',
      createdBy: '运营-张三',
    },
    {
      id: '9',
      name: '四季品牌利润率',
      scope: 'brand',
      brandCode: 'FOUR-SEASONS',
      brandName: '四季',
      markupRate: 6,
      priority: 100,
      status: 'active',
      createdAt: '2025-10-16 09:00:00',
      createdBy: '运营-李四',
      description: '高端品牌，利润率较低',
    },
    // 酒店级规则（优先级最高）
    {
      id: '10',
      name: '北京希尔顿特殊利润率',
      scope: 'hotel',
      hotelId: 'H001',
      hotelName: '北京希尔顿酒店',
      brandCode: 'HILTON',
      brandName: '希尔顿',
      cityCode: 'BJ',
      cityName: '北京',
      countryCode: 'CN',
      countryName: '中国',
      markupRate: 5,
      priority: 10,
      status: 'active',
      createdAt: '2025-10-20 16:00:00',
      createdBy: '运营-王五',
      description: '与该酒店有特殊合作协议',
    },
    {
      id: '11',
      name: '上海浦东香格里拉利润率',
      scope: 'hotel',
      hotelId: 'H002',
      hotelName: '上海浦东香格里拉',
      brandCode: 'SHANGRI-LA',
      brandName: '香格里拉',
      cityCode: 'SH',
      cityName: '上海',
      countryCode: 'CN',
      countryName: '中国',
      markupRate: 7,
      priority: 10,
      status: 'inactive', // 已停用
      createdAt: '2025-10-22 10:00:00',
      createdBy: '运营-李四',
    },
  ];
}

