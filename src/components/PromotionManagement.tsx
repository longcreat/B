import React, { useEffect, useMemo, useState } from 'react';
import { Percent, Filter, Search, ArrowLeft, Edit2, MoreHorizontal, Copy, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from './ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import type { CheckedState } from '@radix-ui/react-checkbox';

export interface Promotion {
  id: string;
  name: string;
  type: '满减' | '折扣' | '立减' | '优惠券';
  couponForm?: '满减券' | '直减券' | '折扣券'; // 当类型为优惠券时的券形态
  ownerType: '平台级' | '大B级';
  ownerName?: string;
  fundingMode: '平台全资' | '大B全资' | '平台+大B按比例';
  status:
    | 'draft'
    | 'pending_partner_confirm'
    | 'pending_effective'
    | 'active'
    | 'finished'
    | 'closed'
    | 'risk_control';
  // 任务与时间相关
  taskCycle?: 'daily' | 'weekly' | 'monthly'; // 任务周期：每日/每周/每月
  activationMode: 'auto' | 'manual_claim'; // 自动生效 / 手动领取
  startTime: string;
  endTime: string;
  // 手动领取活动专用时间：领取窗口 + 生效窗口
  claimStartTime?: string;
  claimEndTime?: string;
  effectStartTime?: string;
  effectEndTime?: string;
  // 实际开启时间（第一次进入进行中）
  activatedAt?: string;
  activityBudgetLimitPlatform?: number;
  activityBudgetLimitBigB?: number;
  usedForActivityPlatform?: number;
  usedForActivityBigB?: number;
  // 详情页扩展字段
  description?: string; // 活动说明
  priority?: number; // 活动优先级（数值越大优先级越高）
  allowStackWithOthers?: boolean; // 是否可与其他活动叠加
  exclusivePromotionIds?: string[]; // 互斥活动ID列表
  mutexGroup?: string; // 互斥组标识（兼容旧数据）
  stackRuleDescription?: string; // 与其他活动/券叠加规则说明（兼容旧数据）
  thresholdAmount?: number; // 满减/门槛金额
  discountAmount?: number; // 直减金额
  discountPercent?: number; // 折扣百分比，如 20 表示 20%
  maxDiscountPerOrder?: number; // 单笔订单优惠上限
  maxTimesPerUser?: number; // 单用户可参与次数上限
  applicableBusinessScope?: string; // 适用业务模式/渠道范围
  applicableProductScope?: string; // 适用产品范围
  applicableCrowdSummary?: string; // 人群圈选摘要说明
  applicableChannelScope?: 'all' | 'self' | 'bigb_shops' | 'smallb_links'; // 适用渠道范围
  crowdType?: 'all' | 'custom'; // 人群类型
  crowdTagId?: string; // 人群标签ID
  crowdTagName?: string; // 人群标签名称
  crowdVipLevels?: string[]; // 适用会员等级
  crowdCountries?: string[]; // 客户国家/地区
  crowdMinOrders?: number; // 历史下单次数下限
  crowdMaxOrders?: number; // 历史下单次数上限
  crowdMinGmv?: number; // 历史 GMV 下限
  crowdMaxGmv?: number; // 历史 GMV 上限
  scopeCountries?: string[]; // 商品维度：国家
  scopeCities?: string[]; // 商品维度：城市/区域
  scopeBrands?: string[]; // 商品维度：品牌
  scopeHotels?: string[]; // 商品维度：酒店
  scopeRoomTypes?: string[]; // 商品维度：房型
  minNights?: number; // 订单属性：连住晚数门槛
  minOrderAmount?: number; // 订单属性：订单金额门槛
  supportSupplementOrder?: boolean; // 订单属性：是否支持补充订单
  platformFundingRatio?: number; // 平台出资比例（%）
  bigBFundingRatio?: number; // 大B出资比例（%）
  perOrderPlatformLimit?: number; // 单订单平台出资封顶
  perOrderBigBLimit?: number; // 单订单大B出资封顶
  autoUsedUserCount?: number;
  autoTotalDiscountAmount?: number;
  couponPlannedQuantity?: number;
  couponClaimedQuantity?: number;
  couponUsedQuantity?: number;
  couponClaimUserCount?: number;
  couponUseUserCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

const formatPromotionStatus = (status: Promotion['status']) => {
  const map: Record<Promotion['status'], { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-50 text-gray-700 border-gray-300' },
    pending_partner_confirm: { label: '待大B确认', color: 'bg-orange-50 text-orange-700 border-orange-300' },
    pending_effective: { label: '待生效', color: 'bg-blue-50 text-blue-700 border-blue-300' },
    active: { label: '进行中', color: 'bg-green-50 text-green-700 border-green-300' },
    finished: { label: '已结束', color: 'bg-gray-50 text-gray-600 border-gray-300' },
    closed: { label: '关闭', color: 'bg-red-50 text-red-700 border-red-300' },
    risk_control: { label: '风控中', color: 'bg-purple-50 text-purple-700 border-purple-300' },
  };
  const cfg = map[status];
  return (
    <Badge variant="outline" className={cfg.color}>
      {cfg.label}
    </Badge>
  );
};

const formatApplicableChannelScope = (
  scope: Promotion['applicableChannelScope'] | undefined
) => {
  if (!scope || scope === 'all') return '全部渠道';
  if (scope === 'self') return '自营（官网/小程序）';
  if (scope === 'bigb_shops') return '指定大B店铺';
  if (scope === 'smallb_links') return '指定大B名下小B推广链接';
  return '-';
};

const CROWD_TAG_OPTIONS: { id: string; name: string }[] = [
  { id: 'new_users_30d', name: '注册 ≤ 30 天新客' },
  { id: 'high_value_vip', name: '高价值会员人群' },
  { id: 'inactive_90d', name: '90 天未下单沉睡用户' },
];

export function PromotionManagement() {
  // 平台营销账户余额（从营销账户管理获取）
  const platformMarketingAccount = useMemo(() => {
    return {
      currentBalance: 800000, // 当前余额（即可用余额）
      frozenMarketingAmount: 50000, // 冻结金额（已冻结的部分，不影响当前余额）
      availableBalance: 800000, // 可用余额 = 当前余额
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOwnerType, setFilterOwnerType] = useState<string>('all');
  const [filterFundingMode, setFilterFundingMode] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [pageMode, setPageMode] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
   const [detailTab, setDetailTab] = useState<'detail' | 'effect'>('detail');

  const [promotions, setPromotions] = useState<Promotion[]>(() => [
      {
        id: 'PROMO-001',
        name: '新用户首单立减 50 元（优惠券）',
        type: '优惠券',
        couponForm: '直减券',
        ownerType: '平台级',
        taskCycle: 'daily',
        activationMode: 'manual_claim',
        fundingMode: '平台全资',
        status: 'active',
        startTime: '2025-01-01 00:00',
        endTime: '2025-03-31 23:59',
        claimStartTime: '2024-12-20 00:00',
        claimEndTime: '2025-01-31 23:59',
        effectStartTime: '2025-01-01 00:00',
        effectEndTime: '2025-03-31 23:59',
        activatedAt: '2025-01-01 00:00',
        activityBudgetLimitPlatform: 500000,
        usedForActivityPlatform: 120000,
        description: '面向新注册用户的首单优惠，用于提升首单转化率。',
        priority: 90,
        mutexGroup: 'new-user',
        stackRuleDescription: '与其他平台活动互斥，可与优惠券叠加。',
        thresholdAmount: 100,
        discountAmount: 50,
        maxDiscountPerOrder: 50,
        maxTimesPerUser: 1,
        applicableBusinessScope: '推广联盟 / 小B直连渠道',
        applicableProductScope: '全站酒店产品',
        applicableCrowdSummary: '注册 ≤ 30 天且历史无订单的新客',
        platformFundingRatio: 100,
        bigBFundingRatio: 0,
        perOrderPlatformLimit: 50,
        perOrderBigBLimit: 0,
        couponPlannedQuantity: 10000,
        couponClaimedQuantity: 6000,
        couponUsedQuantity: 2400,
        couponClaimUserCount: 5800,
        couponUseUserCount: 2400,
        createdBy: '运营-张三',
        createdAt: '2024-12-20 10:00',
        updatedBy: '运营-张三',
        updatedAt: '2024-12-20 10:00',
      },
      {
        id: 'PROMO-002',
        name: '大B A 联合补贴 - 满 1000 减 150',
        type: '满减',
        ownerType: '平台级',
        ownerName: '大B A',
        taskCycle: 'daily',
        activationMode: 'auto',
        fundingMode: '平台+大B按比例',
        status: 'pending_partner_confirm',
        startTime: '2025-02-01 00:00',
        endTime: '2025-04-30 23:59',
        activatedAt: '2025-02-01 00:00',
        activityBudgetLimitPlatform: 200000,
        activityBudgetLimitBigB: 200000,
        usedForActivityPlatform: 60000,
        usedForActivityBigB: 60000,
        description: '与大B A 联合出资的满减活动，用于冲刺 Q1 大促。',
        priority: 80,
        mutexGroup: 'q1-campaign',
        stackRuleDescription: '与其他活动互斥，不与优惠券叠加。',
        thresholdAmount: 1000,
        discountAmount: 150,
        maxDiscountPerOrder: 150,
        maxTimesPerUser: 5,
        applicableBusinessScope: '推广联盟渠道（大B A 名下小B）',
        applicableProductScope: '全国一线城市酒店',
        applicableCrowdSummary: '全部用户',
        platformFundingRatio: 50,
        bigBFundingRatio: 50,
        perOrderPlatformLimit: 100,
        perOrderBigBLimit: 100,
        autoUsedUserCount: 800,
        autoTotalDiscountAmount: 120000,
        createdBy: '运营-李四',
        createdAt: '2025-01-10 09:00',
        updatedBy: '运营-李四',
        updatedAt: '2025-01-10 09:00',
      },
      {
        id: 'PROMO-003',
        name: '大B B 自建活动 - 连住 3 晚 8 折',
        type: '折扣',
        ownerType: '大B级',
        ownerName: '大B B',
        taskCycle: 'monthly',
        activationMode: 'auto',
        fundingMode: '大B全资',
        status: 'finished',
        startTime: '2024-11-01 00:00',
        endTime: '2024-12-31 23:59',
        activatedAt: '2024-11-01 00:00',
        activityBudgetLimitBigB: 100000,
        usedForActivityBigB: 96000,
        description: '大B B 自定义折扣活动，提升淡季入住率。',
        priority: 70,
        mutexGroup: 'bigB-B-private',
        stackRuleDescription: '与平台活动互斥，可与优惠券叠加。',
        discountPercent: 20,
        maxTimesPerUser: 10,
        applicableBusinessScope: 'SaaS / 分销模式',
        applicableProductScope: '大B B 名下全部酒店',
        applicableCrowdSummary: '历史下单 ≥ 1 次的老客',
        platformFundingRatio: 0,
        bigBFundingRatio: 100,
        perOrderPlatformLimit: 0,
        perOrderBigBLimit: 500,
        autoUsedUserCount: 1200,
        autoTotalDiscountAmount: 96000,
        createdBy: '大B B-运营',
        createdAt: '2024-10-15 15:30',
        updatedBy: '大B B-运营',
        updatedAt: '2024-11-01 09:00',
      },
    ]);

  const filteredPromotions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return promotions.filter((p) => {
      const matchesSearch = q
        ? [p.id, p.name, p.ownerName]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(q))
        : true;
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesOwnerType = filterOwnerType === 'all' || p.ownerType === filterOwnerType;
      const matchesFundingMode = filterFundingMode === 'all' || p.fundingMode === filterFundingMode;
      return matchesSearch && matchesStatus && matchesOwnerType && matchesFundingMode;
    });
  }, [promotions, searchQuery, filterStatus, filterOwnerType, filterFundingMode]);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage) || 1;
  const paginatedPromotions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPromotions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPromotions, currentPage]);

  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterOwnerType('all');
    setFilterFundingMode('all');
  };
  if (pageMode === 'detail' && selectedPromotion) {
    return (
      <PromotionDetail
        promotion={selectedPromotion}
        onBack={() => {
          setSelectedPromotion(null);
          setPageMode('list');
        }}
        onEdit={() => {
          setPageMode('edit');
        }}
        initialTab={detailTab}
      />
    );
  }

  if (pageMode === 'create') {
    return (
      <PromotionForm
        onCancel={() => {
          setPageMode('list');
        }}
        onSubmit={(promotion) => {
          setPromotions((prev) => [
            {
              ...promotion,
              id: promotion.id || `PROMO-${prev.length + 1}`,
            },
            ...prev,
          ]);
          setPageMode('list');
        }}
        allPromotions={promotions}
        platformAvailableBalance={platformMarketingAccount.availableBalance}
      />
    );
  }

  if (pageMode === 'edit' && selectedPromotion) {
    return (
      <PromotionForm
        initialPromotion={selectedPromotion}
        onCancel={() => {
          setPageMode('detail');
        }}
        onSubmit={(updated) => {
          setPromotions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSelectedPromotion(updated);
          setDetailTab('detail');
          setPageMode('detail');
        }}
        allPromotions={promotions}
        platformAvailableBalance={platformMarketingAccount.availableBalance}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>营销</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>优惠活动管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              优惠活动列表
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setPageMode('create');
                  setSelectedPromotion(null);
                }}
              >
                新建活动
              </Button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索活动名称、活动ID、出资方"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-20 flex-shrink-0">活动状态</span>
                  <Select
                    value={filterStatus}
                    onValueChange={(v: string) => {
                      setFilterStatus(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="pending_partner_confirm">待大B确认</SelectItem>
                      <SelectItem value="pending_effective">待生效</SelectItem>
                      <SelectItem value="active">进行中</SelectItem>
                      <SelectItem value="finished">已结束</SelectItem>
                      <SelectItem value="risk_control">风控中</SelectItem>
                      <SelectItem value="closed">关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-20 flex-shrink-0">所有者</span>
                  <Select
                    value={filterOwnerType}
                    onValueChange={(v: string) => {
                      setFilterOwnerType(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部所有者" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部所有者</SelectItem>
                      <SelectItem value="平台级">平台级</SelectItem>
                      <SelectItem value="大B级">大B级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">出资模式</span>
                  <Select
                    value={filterFundingMode}
                    onValueChange={(v: string) => {
                      setFilterFundingMode(v);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部模式</SelectItem>
                      <SelectItem value="平台全资">平台全资</SelectItem>
                      <SelectItem value="大B全资">大B全资</SelectItem>
                      <SelectItem value="平台+大B按比例">平台+大B按比例</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(filterStatus !== 'all' || filterOwnerType !== 'all' || filterFundingMode !== 'all') && (
                <div className="flex items-center justify-end pt-2">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className={showFilters ? 'py-4' : 'py-3'}>
          <style>{`
            .promotion-table-container table {
              table-layout: auto;
              min-width: 100%;
              width: max-content;
            }
            .promotion-table-container table td:last-child,
            .promotion-table-container table th:last-child {
              position: sticky;
              right: 0;
              background: white;
              z-index: 10;
              box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
            }
            .promotion-table-container table td,
            .promotion-table-container table th {
              white-space: nowrap;
            }
          `}</style>
          <div className="promotion-table-container overflow-x-auto">
            <table className="border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">活动ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">活动名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">所有者</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">出资模式</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">任务周期</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">活动时间</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">开启时间</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">创建人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                      暂无符合条件的优惠活动
                    </td>
                  </tr>
                ) : (
                  paginatedPromotions.map((p) => {
                    const ownerLabel =
                      p.ownerType === '平台级'
                        ? '平台级'
                        : p.ownerName
                        ? `大B级 · ${p.ownerName}`
                        : '大B级';

                    const taskCycleLabel =
                      p.taskCycle === 'daily'
                        ? '每日'
                        : p.taskCycle === 'weekly'
                        ? '每周'
                        : p.taskCycle === 'monthly'
                        ? '每月'
                        : '-';

                    return (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-gray-700">{p.id}</td>
                        <td className="px-4 py-3 text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 text-gray-700">{p.type}</td>
                        <td className="px-4 py-3 text-gray-700">{ownerLabel}</td>
                        <td className="px-4 py-3 text-gray-700">{p.fundingMode}</td>
                        <td className="px-4 py-3 text-gray-700">{taskCycleLabel}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <div className="flex flex-col">
                            <span>{p.startTime}</span>
                            <span className="text-xs text-gray-500">至 {p.endTime}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{p.activatedAt || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{p.createdAt || '-'}</td>
                        <td className="px-4 py-3">{formatPromotionStatus(p.status)}</td>
                        <td className="px-4 py-3 text-gray-700">{p.createdBy || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => {
                                setSelectedPromotion(p);
                                setDetailTab('detail');
                                setPageMode('detail');
                              }}
                            >
                              详情
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 gap-1"
                              onClick={() => {
                                setPromotions((prev) => {
                                  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
                                  const newId = `${p.id}-COPY`;
                                  return [
                                    {
                                      ...p,
                                      id: newId,
                                      status: 'draft',
                                      createdAt: now,
                                      updatedAt: now,
                                    },
                                    ...prev,
                                  ];
                                });
                              }}
                            >
                              <Copy className="w-3 h-3" />
                              复制
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  推送消息
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log('push sms for promotion', p.id);
                                  }}
                                >
                                  短信
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log('push email for promotion', p.id);
                                  }}
                                >
                                  邮件
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    console.log('push in-app message for promotion', p.id);
                                  }}
                                >
                                  端内消息
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPromotion(p);
                                    setPageMode('edit');
                                  }}
                                >
                                  编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    const link = `https://example.com/promotion/${p.id}`;
                                    if (navigator.clipboard) {
                                      navigator.clipboard.writeText(link).catch(() => {
                                        console.warn('复制链接失败');
                                      });
                                    }
                                  }}
                                >
                                  复制链接
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setPromotions((prev) =>
                                      prev.map((item) => {
                                        if (item.id !== p.id) return item;

                                        // active / pending_effective → 关闭活动
                                        if (item.status === 'active' || item.status === 'pending_effective') {
                                          return {
                                            ...item,
                                            status: 'closed',
                                          };
                                        }

                                        // draft / closed → 上线/启用
                                        if (item.status === 'draft' || item.status === 'closed') {
                                          const now = new Date();
                                          const nowStr = now.toISOString().slice(0, 16).replace('T', ' ');
                                          const start = new Date(item.startTime.replace(' ', 'T'));

                                          // 如果能解析出开始时间且当前时间早于开始时间 → 待生效
                                          if (!Number.isNaN(start.getTime()) && now < start) {
                                            return {
                                              ...item,
                                              status: 'pending_effective',
                                              // 尚未真正生效，不写 activatedAt
                                            };
                                          }

                                          // 否则直接进入进行中，并记录首次激活时间
                                          return {
                                            ...item,
                                            status: 'active',
                                            activatedAt: nowStr,
                                          };
                                        }

                                        // 其他状态（如 finished / risk_control / pending_partner_confirm）暂不切换
                                        return item;
                                      })
                                    );
                                  }}
                                >
                                  {p.status === 'active' ? '关闭活动' : '开启活动'}
                                </DropdownMenuItem>
                                {p.status === 'draft' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() => {
                                        setPromotions((prev) => prev.filter((item) => item.id !== p.id));
                                      }}
                                    >
                                      删除活动
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPromotion(p);
                                    setDetailTab('effect');
                                    setPageMode('detail');
                                  }}
                                >
                                  活动效果
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredPromotions.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                共 {filteredPromotions.length} 条记录，第 {currentPage} / {totalPages} 页
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface PromotionFormProps {
  onCancel: () => void;
  onSubmit: (promotion: Promotion) => void;
  initialPromotion?: Promotion;
  allPromotions: Promotion[];
  platformAvailableBalance: number; // 平台营销账户可用余额
}

function PromotionForm({ onCancel, onSubmit, initialPromotion, allPromotions, platformAvailableBalance }: PromotionFormProps) {
  const isEdit = !!initialPromotion;
  
  // 格式化货币显示
  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
  };

  const [name, setName] = useState(initialPromotion?.name ?? '');
  const [type, setType] = useState<Promotion['type']>(initialPromotion?.type ?? '满减');
  const [couponForm, setCouponForm] = useState<Promotion['couponForm']>(
    initialPromotion?.couponForm ?? '满减券'
  );
  const [ownerType, setOwnerType] = useState<Promotion['ownerType']>(initialPromotion?.ownerType ?? '平台级');
  const [ownerName, setOwnerName] = useState(initialPromotion?.ownerName ?? '');
  const [fundingMode, setFundingMode] = useState<Promotion['fundingMode']>(initialPromotion?.fundingMode ?? '平台全资');
  const [taskCycle, setTaskCycle] = useState<'daily' | 'weekly' | 'monthly'>(
    initialPromotion?.taskCycle ?? 'daily'
  );
  const [activationMode, setActivationMode] = useState<Promotion['activationMode']>(
    initialPromotion?.activationMode ?? 'auto'
  );
  const [startTime, setStartTime] = useState(
    initialPromotion?.startTime ? initialPromotion.startTime.replace(' ', 'T') : ''
  );
  const [endTime, setEndTime] = useState(
    initialPromotion?.endTime ? initialPromotion.endTime.replace(' ', 'T') : ''
  );
  const [claimStartTime, setClaimStartTime] = useState(
    initialPromotion?.claimStartTime ? initialPromotion.claimStartTime.replace(' ', 'T') : ''
  );
  const [claimEndTime, setClaimEndTime] = useState(
    initialPromotion?.claimEndTime ? initialPromotion.claimEndTime.replace(' ', 'T') : ''
  );
  const [effectStartTime, setEffectStartTime] = useState(
    initialPromotion?.effectStartTime ? initialPromotion.effectStartTime.replace(' ', 'T') : ''
  );
  const [effectEndTime, setEffectEndTime] = useState(
    initialPromotion?.effectEndTime ? initialPromotion.effectEndTime.replace(' ', 'T') : ''
  );
  const [description, setDescription] = useState(initialPromotion?.description ?? '');
  const [priority, setPriority] = useState(
    initialPromotion?.priority != null ? String(initialPromotion.priority) : ''
  );
  const [allowStackSelect, setAllowStackSelect] = useState<'yes' | 'no'>(
    initialPromotion?.allowStackWithOthers === false ? 'no' : 'yes'
  );
  const [exclusivePromotionIds, setExclusivePromotionIds] = useState<string[]>(
    initialPromotion?.exclusivePromotionIds ?? []
  );
  const [thresholdAmount, setThresholdAmount] = useState(
    initialPromotion?.thresholdAmount != null ? String(initialPromotion.thresholdAmount) : ''
  );
  const [discountAmount, setDiscountAmount] = useState(
    initialPromotion?.discountAmount != null ? String(initialPromotion.discountAmount) : ''
  );
  const [discountPercent, setDiscountPercent] = useState(
    initialPromotion?.discountPercent != null ? String(initialPromotion.discountPercent) : ''
  );
  const [maxDiscountPerOrder, setMaxDiscountPerOrder] = useState(
    initialPromotion?.maxDiscountPerOrder != null ? String(initialPromotion.maxDiscountPerOrder) : ''
  );
  const [maxTimesPerUser, setMaxTimesPerUser] = useState(
    initialPromotion?.maxTimesPerUser != null ? String(initialPromotion.maxTimesPerUser) : ''
  );
  const [applicableChannelScope, setApplicableChannelScope] = useState<
    Promotion['applicableChannelScope']
  >(
    initialPromotion?.applicableChannelScope ?? 'all'
  );
  const [scopeCountriesInput, setScopeCountriesInput] = useState(
    initialPromotion?.scopeCountries ? initialPromotion.scopeCountries.join(',') : ''
  );
  const [scopeCitiesInput, setScopeCitiesInput] = useState(
    initialPromotion?.scopeCities ? initialPromotion.scopeCities.join(',') : ''
  );
  const [scopeBrandsInput, setScopeBrandsInput] = useState(
    initialPromotion?.scopeBrands ? initialPromotion.scopeBrands.join(',') : ''
  );
  const [scopeHotelsInput, setScopeHotelsInput] = useState(
    initialPromotion?.scopeHotels ? initialPromotion.scopeHotels.join(',') : ''
  );
  const [scopeRoomTypesInput, setScopeRoomTypesInput] = useState(
    initialPromotion?.scopeRoomTypes ? initialPromotion.scopeRoomTypes.join(',') : ''
  );
  const [minNightsInput, setMinNightsInput] = useState(
    initialPromotion?.minNights != null ? String(initialPromotion.minNights) : ''
  );
  const [minOrderAmountInput, setMinOrderAmountInput] = useState(
    initialPromotion?.minOrderAmount != null ? String(initialPromotion.minOrderAmount) : ''
  );
  const [supportSupplementOrderSelect, setSupportSupplementOrderSelect] = useState<
    'unset' | 'yes' | 'no'
  >(
    initialPromotion?.supportSupplementOrder === true
      ? 'yes'
      : initialPromotion?.supportSupplementOrder === false
      ? 'no'
      : 'unset'
  );
  const [crowdType, setCrowdType] = useState<Promotion['crowdType']>(
    initialPromotion?.crowdType ?? 'all'
  );
  const [crowdTagId, setCrowdTagId] = useState(initialPromotion?.crowdTagId ?? '');
  const [crowdVipLevelsInput, setCrowdVipLevelsInput] = useState(
    initialPromotion?.crowdVipLevels ? initialPromotion.crowdVipLevels.join(',') : ''
  );
  const [crowdCountriesInput, setCrowdCountriesInput] = useState(
    initialPromotion?.crowdCountries ? initialPromotion.crowdCountries.join(',') : ''
  );
  const [crowdMinOrdersInput, setCrowdMinOrdersInput] = useState(
    initialPromotion?.crowdMinOrders != null ? String(initialPromotion.crowdMinOrders) : ''
  );
  const [crowdMaxOrdersInput, setCrowdMaxOrdersInput] = useState(
    initialPromotion?.crowdMaxOrders != null ? String(initialPromotion.crowdMaxOrders) : ''
  );
  const [crowdMinGmvInput, setCrowdMinGmvInput] = useState(
    initialPromotion?.crowdMinGmv != null ? String(initialPromotion.crowdMinGmv) : ''
  );
  const [crowdMaxGmvInput, setCrowdMaxGmvInput] = useState(
    initialPromotion?.crowdMaxGmv != null ? String(initialPromotion.crowdMaxGmv) : ''
  );
  const [platformFundingRatio, setPlatformFundingRatio] = useState(
    initialPromotion?.platformFundingRatio != null ? String(initialPromotion.platformFundingRatio) : ''
  );
  const [bigBFundingRatio, setBigBFundingRatio] = useState(
    initialPromotion?.bigBFundingRatio != null ? String(initialPromotion.bigBFundingRatio) : ''
  );
  const [activityBudgetPlatform, setActivityBudgetPlatform] = useState(
    initialPromotion?.activityBudgetLimitPlatform != null
      ? String(initialPromotion.activityBudgetLimitPlatform)
      : ''
  );
  const [activityBudgetBigB, setActivityBudgetBigB] = useState(
    initialPromotion?.activityBudgetLimitBigB != null
      ? String(initialPromotion.activityBudgetLimitBigB)
      : ''
  );
  const [perOrderPlatformLimit, setPerOrderPlatformLimit] = useState(
    initialPromotion?.perOrderPlatformLimit != null ? String(initialPromotion.perOrderPlatformLimit) : ''
  );
  const [perOrderBigBLimit, setPerOrderBigBLimit] = useState(
    initialPromotion?.perOrderBigBLimit != null ? String(initialPromotion.perOrderBigBLimit) : ''
  );

  useEffect(() => {
    // 活动类型与生效方式联动：优惠券 = 手动领取，其它 = 自动生效
    if (type === '优惠券') {
      setActivationMode('manual_claim');
    } else {
      setActivationMode('auto');
    }
  }, [type]);

  const parseNumber = (value: string): number | undefined => {
    const n = parseFloat(value);
    return Number.isNaN(n) ? undefined : n;
  };

  const parseList = (value: string): string[] | undefined => {
    const items = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return items.length ? items : undefined;
  };

  const exclusiveOptions = allPromotions.filter((p) => !initialPromotion || p.id !== initialPromotion.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activationMode === 'auto') {
      // 自动生效：必须配置活动时间
      if (!startTime || !endTime) {
        return;
      }
    } else {
      // 手动领取：必须至少有券生效时间
      if (!effectStartTime || !effectEndTime) {
        return;
      }
    }

    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const formattedClaimStart = claimStartTime ? claimStartTime.replace('T', ' ') : undefined;
    const formattedClaimEnd = claimEndTime ? claimEndTime.replace('T', ' ') : undefined;

    let formattedStart: string;
    let formattedEnd: string;
    let formattedEffectStart: string;
    let formattedEffectEnd: string;

    if (activationMode === 'auto') {
      formattedStart = startTime!.replace('T', ' ');
      formattedEnd = endTime!.replace('T', ' ');
      formattedEffectStart = formattedStart;
      formattedEffectEnd = formattedEnd;
    } else {
      formattedEffectStart = effectStartTime!.replace('T', ' ');
      formattedEffectEnd = effectEndTime!.replace('T', ' ');
      // 手动领取模式下，活动时间由券生效时间推导
      formattedStart = formattedEffectStart;
      formattedEnd = formattedEffectEnd;
    }
    const selectedCrowdTag = CROWD_TAG_OPTIONS.find((t) => t.id === crowdTagId);

    const activityBudgetPlatformNumber = parseNumber(activityBudgetPlatform);
    const activityBudgetBigBNumber = parseNumber(activityBudgetBigB);

    const promotion: Promotion = {
      ...(initialPromotion ?? {}),
      id: initialPromotion?.id ?? '',
      name: name.trim(),
      type,
      ownerType,
      ownerName: ownerName.trim() || undefined,
      fundingMode,
      taskCycle,
      activationMode,
      status: initialPromotion?.status ?? 'draft',
      startTime: formattedStart,
      endTime: formattedEnd,
      claimStartTime: activationMode === 'manual_claim' ? formattedClaimStart : undefined,
      claimEndTime: activationMode === 'manual_claim' ? formattedClaimEnd : undefined,
      effectStartTime: formattedEffectStart,
      effectEndTime: formattedEffectEnd,
      activityBudgetLimitPlatform:
        fundingMode === '平台全资' || fundingMode === '平台+大B按比例'
          ? activityBudgetPlatformNumber
          : undefined,
      activityBudgetLimitBigB:
        fundingMode === '大B全资' || fundingMode === '平台+大B按比例'
          ? activityBudgetBigBNumber
          : undefined,
      usedForActivityPlatform: initialPromotion?.usedForActivityPlatform,
      usedForActivityBigB: initialPromotion?.usedForActivityBigB,
      description: description.trim() || undefined,
      thresholdAmount: parseNumber(thresholdAmount),
      discountAmount: parseNumber(discountAmount),
      discountPercent: parseNumber(discountPercent),
      maxDiscountPerOrder: parseNumber(maxDiscountPerOrder),
      maxTimesPerUser: parseNumber(maxTimesPerUser),
      applicableChannelScope,
      scopeCountries: parseList(scopeCountriesInput),
      scopeCities: parseList(scopeCitiesInput),
      scopeBrands: parseList(scopeBrandsInput),
      scopeHotels: parseList(scopeHotelsInput),
      scopeRoomTypes: parseList(scopeRoomTypesInput),
      minNights: parseNumber(minNightsInput),
      minOrderAmount: parseNumber(minOrderAmountInput),
      supportSupplementOrder:
        supportSupplementOrderSelect === 'yes'
          ? true
          : supportSupplementOrderSelect === 'no'
          ? false
          : undefined,
      crowdType,
      crowdTagId: crowdType === 'custom' ? (crowdTagId || undefined) : undefined,
      crowdTagName:
        crowdType === 'custom' && selectedCrowdTag ? selectedCrowdTag.name : undefined,
      crowdVipLevels: parseList(crowdVipLevelsInput),
      crowdCountries: parseList(crowdCountriesInput),
      crowdMinOrders: parseNumber(crowdMinOrdersInput),
      crowdMaxOrders: parseNumber(crowdMaxOrdersInput),
      crowdMinGmv: parseNumber(crowdMinGmvInput),
      crowdMaxGmv: parseNumber(crowdMaxGmvInput),
      platformFundingRatio:
        fundingMode === '平台+大B按比例' ? parseNumber(platformFundingRatio) : undefined,
      bigBFundingRatio:
        fundingMode === '平台+大B按比例' ? parseNumber(bigBFundingRatio) : undefined,
      perOrderPlatformLimit:
        fundingMode === '平台+大B按比例' ? parseNumber(perOrderPlatformLimit) : undefined,
      perOrderBigBLimit:
        fundingMode === '平台+大B按比例' ? parseNumber(perOrderBigBLimit) : undefined,
      createdBy: initialPromotion?.createdBy,
      createdAt: initialPromotion?.createdAt ?? now,
      updatedBy: initialPromotion?.updatedBy,
      updatedAt: now,
      priority: parseNumber(priority),
      couponForm: type === '优惠券' ? couponForm : undefined,
      allowStackWithOthers: allowStackSelect === 'yes',
      exclusivePromotionIds: exclusivePromotionIds.length ? exclusivePromotionIds : undefined,
    };

    onSubmit(promotion);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>营销</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onCancel}
            >
              优惠活动管理
            </button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{isEdit ? '编辑活动' : '新建活动'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            {isEdit ? '编辑优惠活动' : '新建优惠活动'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* 基础信息 */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">基础信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>活动名称 *</Label>
                  <Input
                    placeholder="请输入活动名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>活动类型 *</Label>
                  <Select value={type} onValueChange={(v: Promotion['type']) => setType(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="满减">满减</SelectItem>
                      <SelectItem value="折扣">折扣</SelectItem>
                      <SelectItem value="立减">立减</SelectItem>
                      <SelectItem value="优惠券">优惠券</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>所有者类型 *</Label>
                  <Select value={ownerType} onValueChange={(v: Promotion['ownerType']) => setOwnerType(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择所有者类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="平台级">平台级</SelectItem>
                      <SelectItem value="大B级">大B级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>所有者名称（可选）</Label>
                  <Input
                    placeholder="如：某大B名称"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>出资模式 *</Label>
                  <Select value={fundingMode} onValueChange={(v: Promotion['fundingMode']) => setFundingMode(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择出资模式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="平台全资">平台全资</SelectItem>
                      <SelectItem value="大B全资">大B全资</SelectItem>
                      <SelectItem value="平台+大B按比例">平台+大B按比例</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>任务周期 *</Label>
                  <Select
                    value={taskCycle}
                    onValueChange={(v: 'daily' | 'weekly' | 'monthly') => setTaskCycle(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择任务周期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每日</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>生效方式</Label>
                  <p className="text-sm text-gray-900">
                    {type === '优惠券'
                      ? '手动领取（含领取时间和券生效时间）'
                      : '自动生效（仅按活动时间）'}
                  </p>
                </div>
              </div>
              {activationMode === 'auto' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>开始时间 *</Label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>结束时间 *</Label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            )}
            {activationMode === 'manual_claim' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>领取开始时间</Label>
                    <Input
                      type="datetime-local"
                      value={claimStartTime}
                      onChange={(e) => setClaimStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>领取结束时间</Label>
                    <Input
                      type="datetime-local"
                      value={claimEndTime}
                      onChange={(e) => setClaimEndTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>券生效开始时间 *</Label>
                    <Input
                      type="datetime-local"
                      value={effectStartTime}
                      onChange={(e) => setEffectStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>券生效结束时间 *</Label>
                    <Input
                      type="datetime-local"
                      value={effectEndTime}
                      onChange={(e) => setEffectEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            </section>

            <div className="border-t border-gray-100" />

            {/* 活动规则配置（含出资与限额） */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">活动规则配置</h3>

              <div className="space-y-2">
                <Label>活动说明</Label>
                <Textarea
                  placeholder="用于内部说明活动目的、执行策略等"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* 叠加与互斥 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>活动优先级</Label>
                  <Input
                    type="number"
                    placeholder="数值越大优先级越高"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>是否可叠加</Label>
                  <Select
                    value={allowStackSelect}
                    onValueChange={(v: 'yes' | 'no') => setAllowStackSelect(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">是（可与其他活动叠加）</SelectItem>
                      <SelectItem value="no">否（与其他活动互斥）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>互斥活动</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className="truncate text-left">
                          {exclusivePromotionIds.length
                            ? `已选择 ${exclusivePromotionIds.length} 个活动`
                            : '请选择互斥活动'}
                        </span>
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 max-h-64 overflow-auto">
                      {exclusiveOptions.length === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-gray-500">
                          暂无可选活动
                        </div>
                      ) : (
                        exclusiveOptions.map((p) => {
                          const checked = exclusivePromotionIds.includes(p.id);
                          return (
                            <DropdownMenuCheckboxItem
                              key={p.id}
                              checked={checked}
                              onCheckedChange={(checkedState: CheckedState) => {
                                setExclusivePromotionIds((prev) => {
                                  if (checkedState) {
                                    if (prev.includes(p.id)) return prev;
                                    return [...prev, p.id];
                                  }
                                  return prev.filter((id) => id !== p.id);
                                });
                              }}
                            >
                              <span className="truncate text-sm">
                                {p.name}（{p.id}）
                              </span>
                            </DropdownMenuCheckboxItem>
                          );
                        })
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* 优惠规则 */}
              {type === '优惠券' && (
                <div className="space-y-2">
                  <Label>券类型 *</Label>
                  <Select
                    value={couponForm ?? '满减券'}
                    onValueChange={(v: Promotion['couponForm']) => setCouponForm(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择券类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="满减券">满减券</SelectItem>
                      <SelectItem value="直减券">直减券</SelectItem>
                      <SelectItem value="折扣券">折扣券</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {((type === '满减') || (type === '优惠券' && couponForm === '满减券')) && (
                <div className="space-y-2">
                  <Label>门槛金额（满多少） *</Label>
                  <Input
                    type="number"
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    placeholder="例如 1000"
                  />
                </div>
              )}
              {(type === '满减' || type === '立减' ||
                (type === '优惠券' && (couponForm === '满减券' || couponForm === '直减券'))) && (
                <div className="space-y-2">
                  <Label>立减金额 *</Label>
                  <Input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder="例如 150"
                  />
                </div>
              )}
              {(type === '折扣' || (type === '优惠券' && couponForm === '折扣券')) && (
                <div className="space-y-2">
                  <Label>折扣百分比（%） *</Label>
                  <Input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="例如 20 表示 8 折"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>单笔优惠上限 *</Label>
                <Input
                  type="number"
                  value={maxDiscountPerOrder}
                  onChange={(e) => setMaxDiscountPerOrder(e.target.value)}
                  placeholder="例如 200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>单用户参与次数上限</Label>
                <Input
                  type="number"
                  value={maxTimesPerUser}
                  onChange={(e) => setMaxTimesPerUser(e.target.value)}
                  placeholder="例如 5"
                />
              </div>
              {fundingMode === '平台+大B按比例' && (
                <div className="space-y-2">
                  <Label>平台出资比例（%） *</Label>
                  <Input
                    type="number"
                    value={platformFundingRatio}
                    onChange={(e) => setPlatformFundingRatio(e.target.value)}
                    placeholder="例如 50"
                  />
                </div>
              )}
              {fundingMode === '平台+大B按比例' && (
                <div className="space-y-2">
                  <Label>大B出资比例（%） *</Label>
                  <Input
                    type="number"
                    value={bigBFundingRatio}
                    onChange={(e) => setBigBFundingRatio(e.target.value)}
                    placeholder="例如 50"
                  />
                </div>
              )}
            </div>

            {/* 活动预算 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(fundingMode === '平台全资' || fundingMode === '平台+大B按比例') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>活动预算（平台） *</Label>
                    <span className="text-xs text-gray-500">
                      可用余额：<span className="font-medium text-gray-700">{formatCurrency(platformAvailableBalance)}</span>
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={activityBudgetPlatform}
                    onChange={(e) => {
                      setActivityBudgetPlatform(e.target.value);
                    }}
                    placeholder="例如 500000"
                    className={
                      activityBudgetPlatform && parseFloat(activityBudgetPlatform) > platformAvailableBalance
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  {activityBudgetPlatform && parseFloat(activityBudgetPlatform) > platformAvailableBalance && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠ 预算不能超过可用余额 {formatCurrency(platformAvailableBalance)}
                    </p>
                  )}
                </div>
              )}
              {(fundingMode === '大B全资' || fundingMode === '平台+大B按比例') && (
                <div className="space-y-2">
                  <Label>活动预算（大B） *</Label>
                  <Input
                    type="number"
                    value={activityBudgetBigB}
                    onChange={(e) => setActivityBudgetBigB(e.target.value)}
                    placeholder="例如 500000"
                  />
                  <p className="text-xs text-gray-500">大B预算由大B方设置和管理</p>
                </div>
              )}
            </div>

            {/* 出资与限额（合并到活动规则配置） */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fundingMode === '平台+大B按比例' && (
                <div className="space-y-2">
                  <Label>单订单平台出资封顶</Label>
                  <Input
                    type="number"
                    value={perOrderPlatformLimit}
                    onChange={(e) => setPerOrderPlatformLimit(e.target.value)}
                    placeholder="例如 100"
                  />
                </div>
              )}
              {fundingMode === '平台+大B按比例' && (
                <div className="space-y-2">
                  <Label>单订单大B出资封顶</Label>
                  <Input
                    type="number"
                    value={perOrderBigBLimit}
                    onChange={(e) => setPerOrderBigBLimit(e.target.value)}
                    placeholder="例如 100"
                  />
                </div>
              )}
            </div>
            </section>

            <div className="border-t border-gray-100" />
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">适用范围与人群</h3>

              {/* 渠道维度 */}
              <div className="space-y-2">
                <Label>适用渠道</Label>
                <Select
                  value={applicableChannelScope ?? 'all'}
                  onValueChange={(v: Promotion['applicableChannelScope']) =>
                    setApplicableChannelScope(v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择适用渠道" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部渠道</SelectItem>
                    <SelectItem value="self">自营（官网/小程序）</SelectItem>
                    <SelectItem value="bigb_shops">指定大B店铺</SelectItem>
                    <SelectItem value="smallb_links">指定大B名下小B推广链接</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 商品维度 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>商品国家</Label>
                  <Select
                    value={scopeCountriesInput}
                    onValueChange={(v: string) => setScopeCountriesInput(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择国家" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CN">中国（CN）</SelectItem>
                      <SelectItem value="US">美国（US）</SelectItem>
                      <SelectItem value="JP">日本（JP）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>城市/区域</Label>
                  <Select
                    value={scopeCitiesInput}
                    onValueChange={(v: string) => setScopeCitiesInput(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择城市/区域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="上海">上海</SelectItem>
                      <SelectItem value="北京">北京</SelectItem>
                      <SelectItem value="广州">广州</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>品牌</Label>
                  <Select
                    value={scopeBrandsInput}
                    onValueChange={(v: string) => setScopeBrandsInput(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择品牌" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="品牌A">品牌A</SelectItem>
                      <SelectItem value="品牌B">品牌B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>酒店</Label>
                  <Select
                    value={scopeHotelsInput}
                    onValueChange={(v: string) => setScopeHotelsInput(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择酒店" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="酒店A">酒店A</SelectItem>
                      <SelectItem value="酒店B">酒店B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>房型</Label>
                  <Select
                    value={scopeRoomTypesInput}
                    onValueChange={(v: string) => setScopeRoomTypesInput(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择房型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="大床房">大床房</SelectItem>
                      <SelectItem value="双床房">双床房</SelectItem>
                      <SelectItem value="套房">套房</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 订单属性 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>连住晚数门槛</Label>
                  <Input
                    type="number"
                    placeholder="例如：2"
                    value={minNightsInput}
                    onChange={(e) => setMinNightsInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>订单金额门槛（¥）</Label>
                  <Input
                    type="number"
                    placeholder="例如：1000"
                    value={minOrderAmountInput}
                    onChange={(e) => setMinOrderAmountInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>是否支持补充订单</Label>
                  <Select
                    value={supportSupplementOrderSelect}
                    onValueChange={(v: 'unset' | 'yes' | 'no') => setSupportSupplementOrderSelect(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">不限</SelectItem>
                      <SelectItem value="yes">仅支持补充订单</SelectItem>
                      <SelectItem value="no">不支持补充订单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 人群维度 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>人群类型</Label>
                  <Select
                    value={crowdType ?? 'all'}
                    onValueChange={(v: Promotion['crowdType']) => setCrowdType(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择人群类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部人群</SelectItem>
                      <SelectItem value="custom">自定义人群</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {crowdType === 'custom' && (
                  <div className="space-y-2">
                    <Label>人群标签</Label>
                    <Select value={crowdTagId} onValueChange={(v: string) => setCrowdTagId(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择人群标签" />
                      </SelectTrigger>
                      <SelectContent>
                        {CROWD_TAG_OPTIONS.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </section>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit">保存草稿</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

interface PromotionDetailProps {
  promotion: Promotion;
  onBack: () => void;
  onEdit: () => void;
  initialTab?: 'detail' | 'effect';
}

function PromotionDetail({ promotion, onBack, onEdit, initialTab }: PromotionDetailProps) {
  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return `¥${value.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;
  };

  const platformBudgetText = promotion.activityBudgetLimitPlatform
    ? `${formatCurrency(promotion.usedForActivityPlatform)} / ${formatCurrency(promotion.activityBudgetLimitPlatform)}`
    : '-';

  const bigBBudgetText = promotion.activityBudgetLimitBigB
    ? `${formatCurrency(promotion.usedForActivityBigB)} / ${formatCurrency(promotion.activityBudgetLimitBigB)}`
    : '-';

  const ownerLabel =
    promotion.ownerType === '平台级'
      ? '平台级'
      : promotion.ownerName
      ? `大B级 · ${promotion.ownerName}`
      : '大B级';

  const [activeTab, setActiveTab] = useState<'detail' | 'effect' | 'data'>(initialTab ?? 'detail');
  const [dataSubTab, setDataSubTab] = useState<'orders' | 'usage'>('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [usageSearch, setUsageSearch] = useState('');
  const [usageStatusFilter, setUsageStatusFilter] = useState<string>('all');

  const totalBudget =
    (promotion.activityBudgetLimitPlatform ?? 0) + (promotion.activityBudgetLimitBigB ?? 0);
  const totalUsed =
    (promotion.usedForActivityPlatform ?? 0) + (promotion.usedForActivityBigB ?? 0);
  const budgetUsageRate =
    totalBudget > 0 ? `${Math.round((totalUsed / totalBudget) * 100)}%` : '-';

  const isCouponPromotion = promotion.type === '优惠券';
  const remainingCouponQuantity =
    promotion.couponPlannedQuantity != null && promotion.couponClaimedQuantity != null
      ? Math.max(0, promotion.couponPlannedQuantity - promotion.couponClaimedQuantity)
      : undefined;

  const mockOrders = 1200;
  const mockGmv = 3200000;
  const mockRoi = '3.2';

  const couponTypeLabel =
    promotion.type === '优惠券' && promotion.couponForm
      ? `优惠券（${promotion.couponForm}）`
      : promotion.type;

  const allowStackText =
    promotion.allowStackWithOthers === true
      ? '是（可与其他活动叠加）'
      : promotion.allowStackWithOthers === false
      ? '否（与其他活动互斥）'
      : promotion.stackRuleDescription || '-';

  const exclusiveText =
    promotion.exclusivePromotionIds && promotion.exclusivePromotionIds.length
      ? promotion.exclusivePromotionIds.join(', ')
      : promotion.mutexGroup || '-';

  // Mock 数据：订单维度（根据活动类型和出资模式动态生成）
  const mockOrderData = isCouponPromotion
    ? [
        {
          orderId: 'ORD-2025-001',
          orderTime: '2025-01-15 14:30:00',
          channel: '推广联盟',
          partner: '小B-华东A',
          originalAmount: 1200,
          discountAmount: 50,
          platformFunding: 50,
          bigBFunding: 0,
          paidAmount: 1150,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2025-002',
          orderTime: '2025-01-16 10:15:00',
          channel: '推广联盟',
          partner: '小B-华北B',
          originalAmount: 1500,
          discountAmount: 50,
          platformFunding: 50,
          bigBFunding: 0,
          paidAmount: 1450,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2025-003',
          orderTime: '2025-01-17 16:45:00',
          channel: '推广联盟',
          partner: '小B-华南C',
          originalAmount: 1100,
          discountAmount: 50,
          platformFunding: 50,
          bigBFunding: 0,
          paidAmount: 1050,
          status: 'completed' as const,
        },
      ]
    : promotion.fundingMode === '大B全资'
    ? [
        {
          orderId: 'ORD-2024-201',
          orderTime: '2024-11-15 14:30:00',
          channel: 'SaaS',
          partner: '大B B',
          originalAmount: 500,
          discountAmount: 80,
          platformFunding: 0,
          bigBFunding: 80,
          paidAmount: 420,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2024-202',
          orderTime: '2024-11-16 10:15:00',
          channel: 'SaaS',
          partner: '大B B',
          originalAmount: 600,
          discountAmount: 80,
          platformFunding: 0,
          bigBFunding: 80,
          paidAmount: 520,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2024-203',
          orderTime: '2024-11-17 16:45:00',
          channel: 'SaaS',
          partner: '大B B',
          originalAmount: 450,
          discountAmount: 80,
          platformFunding: 0,
          bigBFunding: 80,
          paidAmount: 370,
          status: 'completed' as const,
        },
      ]
    : [
        {
          orderId: 'ORD-2025-101',
          orderTime: '2025-02-05 14:30:00',
          channel: '推广联盟',
          partner: '小B-华东A',
          originalAmount: 1200,
          discountAmount: 150,
          platformFunding: 75,
          bigBFunding: 75,
          paidAmount: 1050,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2025-102',
          orderTime: '2025-02-06 10:15:00',
          channel: '推广联盟',
          partner: '小B-华北B',
          originalAmount: 1500,
          discountAmount: 150,
          platformFunding: 75,
          bigBFunding: 75,
          paidAmount: 1350,
          status: 'completed' as const,
        },
        {
          orderId: 'ORD-2025-103',
          orderTime: '2025-02-07 16:45:00',
          channel: '推广联盟',
          partner: '小B-华南C',
          originalAmount: 1100,
          discountAmount: 150,
          platformFunding: 75,
          bigBFunding: 75,
          paidAmount: 950,
          status: 'refunded' as const,
        },
      ];

  // Mock 数据：优惠券领用明细
  const mockCouponUsageData = [
    {
      couponCode: 'CPN-2025-001',
      userId: 'U-12345',
      claimTime: '2025-01-10 09:30:00',
      claimChannel: 'App',
      status: 'used' as const,
      useTime: '2025-01-15 14:30:00',
      orderId: 'ORD-2025-001',
      discountAmount: 50,
      platformFunding: 50,
      bigBFunding: 0,
    },
    {
      couponCode: 'CPN-2025-002',
      userId: 'U-12346',
      claimTime: '2025-01-11 10:15:00',
      claimChannel: '小程序',
      status: 'used' as const,
      useTime: '2025-01-16 10:15:00',
      orderId: 'ORD-2025-002',
      discountAmount: 50,
      platformFunding: 50,
      bigBFunding: 0,
    },
    {
      couponCode: 'CPN-2025-003',
      userId: 'U-12347',
      claimTime: '2025-01-12 11:20:00',
      claimChannel: 'App',
      status: 'unused' as const,
      useTime: undefined,
      orderId: undefined,
      discountAmount: undefined,
      platformFunding: undefined,
      bigBFunding: undefined,
    },
  ];

  // Mock 数据：自动发放使用明细（根据活动出资模式动态生成）
  const mockAutoUsageData =
    promotion.fundingMode === '大B全资'
      ? [
          {
            userId: 'U-30001',
            orderId: 'ORD-2024-201',
            useTime: '2024-11-15 14:30:00',
            channel: 'SaaS',
            partner: '大B B',
            orderAmount: 500,
            discountAmount: 80,
            platformFunding: 0,
            bigBFunding: 80,
            status: 'completed' as const,
          },
          {
            userId: 'U-30002',
            orderId: 'ORD-2024-202',
            useTime: '2024-11-16 10:15:00',
            channel: 'SaaS',
            partner: '大B B',
            orderAmount: 600,
            discountAmount: 80,
            platformFunding: 0,
            bigBFunding: 80,
            status: 'completed' as const,
          },
        ]
      : promotion.fundingMode === '平台+大B按比例'
      ? [
          {
            userId: 'U-20001',
            orderId: 'ORD-2025-101',
            useTime: '2025-02-05 14:30:00',
            channel: '推广联盟',
            partner: '小B-华东A',
            orderAmount: 1200,
            discountAmount: 150,
            platformFunding: 75,
            bigBFunding: 75,
            status: 'completed' as const,
          },
          {
            userId: 'U-20002',
            orderId: 'ORD-2025-102',
            useTime: '2025-02-06 10:15:00',
            channel: '推广联盟',
            partner: '小B-华北B',
            orderAmount: 1500,
            discountAmount: 150,
            platformFunding: 75,
            bigBFunding: 75,
            status: 'completed' as const,
          },
        ]
      : [];

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>营销</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={onBack}
            >
              优惠活动管理
            </button>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>活动详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 详情 Tabs：活动详情 / 效果分析 */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'detail' | 'effect' | 'data')}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="detail">活动详情</TabsTrigger>
            <TabsTrigger value="effect">效果分析</TabsTrigger>
            <TabsTrigger value="data">活动数据</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Button>
        </div>

        <TabsContent value="detail" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    优惠活动详情
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {formatPromotionStatus(promotion.status)}
                    <span className="text-sm text-gray-500">活动ID：{promotion.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={onEdit}
                  >
                    <Edit2 className="w-4 h-4" />
                    编辑活动
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 基础信息 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">基础信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">活动名称</Label>
                    <p className="text-sm text-gray-900">{promotion.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">活动类型</Label>
                    <p className="text-sm text-gray-900">{couponTypeLabel}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">所有者</Label>
                    <p className="text-sm text-gray-900">{ownerLabel}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">出资模式</Label>
                    <p className="text-sm text-gray-900">{promotion.fundingMode}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">任务周期</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.taskCycle === 'daily'
                        ? '每日'
                        : promotion.taskCycle === 'weekly'
                        ? '每周'
                        : promotion.taskCycle === 'monthly'
                        ? '每月'
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">生效方式</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.activationMode === 'manual_claim'
                        ? '手动领取'
                        : '自动生效'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">领取时间</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.activationMode === 'manual_claim' && promotion.claimStartTime
                        ? `${promotion.claimStartTime} ~ ${promotion.claimEndTime ?? '-'}`
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">券生效时间</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.activationMode === 'manual_claim' && promotion.effectStartTime
                        ? `${promotion.effectStartTime} ~ ${promotion.effectEndTime ?? '-'}`
                        : '-'}
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* 预算与消耗 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">预算与消耗</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">平台预算使用</Label>
                    <p className="text-sm text-gray-900">{platformBudgetText}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">大B预算使用</Label>
                    <p className="text-sm text-gray-900">{bigBBudgetText}</p>
                  </div>
                </div>

                {!isCouponPromotion && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">使用人数（自动发放）</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.autoUsedUserCount != null
                          ? `${promotion.autoUsedUserCount.toLocaleString('zh-CN')} 人`
                          : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">累计优惠金额</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.autoTotalDiscountAmount != null
                          ? formatCurrency(promotion.autoTotalDiscountAmount)
                          : formatCurrency(totalUsed || undefined)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">预算使用率</Label>
                      <p className="text-sm text-gray-900">{budgetUsageRate}</p>
                    </div>
                  </div>
                )}

                {isCouponPromotion && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">计划发券总量</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponPlannedQuantity != null
                          ? `${promotion.couponPlannedQuantity.toLocaleString('zh-CN')} 张`
                          : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">已领取 / 剩余</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponClaimedQuantity != null
                          ? `${promotion.couponClaimedQuantity.toLocaleString('zh-CN')} 张${
                              remainingCouponQuantity != null
                                ? ` / 剩余 ${remainingCouponQuantity.toLocaleString('zh-CN')} 张`
                                : ''
                            }`
                          : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">已使用张数</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponUsedQuantity != null
                          ? `${promotion.couponUsedQuantity.toLocaleString('zh-CN')} 张`
                          : '-'}
                      </p>
                    </div>
                  </div>
                )}

                {isCouponPromotion && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">领取人数</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponClaimUserCount != null
                          ? `${promotion.couponClaimUserCount.toLocaleString('zh-CN')} 人`
                          : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">使用人数</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponUseUserCount != null
                          ? `${promotion.couponUseUserCount.toLocaleString('zh-CN')} 人`
                          : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">券使用率</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.couponClaimedQuantity && promotion.couponUsedQuantity != null
                          ? `${Math.round(
                              (promotion.couponUsedQuantity / promotion.couponClaimedQuantity) * 100,
                            )}%`
                          : '-'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <div className="border-t border-gray-100" />

              {/* 活动规则配置 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">活动规则配置</h3>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide text-gray-600">活动说明</Label>
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {promotion.description || '-'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">活动优先级</Label>
                    <p className="text-sm text-gray-900">{promotion.priority ?? '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">是否可叠加</Label>
                    <p className="text-sm text-gray-900">{allowStackText}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">互斥活动</Label>
                    <p className="text-sm text-gray-900">{exclusiveText}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">门槛金额</Label>
                    <p className="text-sm text-gray-900">
                      {(promotion.type === '满减' ||
                        (promotion.type === '优惠券' && promotion.couponForm === '满减券')) &&
                      promotion.thresholdAmount != null
                        ? `满 ¥${promotion.thresholdAmount}`
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">优惠规则</Label>
                    <p className="text-sm text-gray-900">
                      {((promotion.type === '满减' || promotion.type === '立减') ||
                        (promotion.type === '优惠券' &&
                          (promotion.couponForm === '满减券' || promotion.couponForm === '直减券')))
                        && promotion.discountAmount != null
                        ? `立减 ¥${promotion.discountAmount}`
                        : (promotion.type === '折扣' ||
                            (promotion.type === '优惠券' && promotion.couponForm === '折扣券')) &&
                          promotion.discountPercent != null
                        ? `折扣 ${promotion.discountPercent}%`
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">单笔优惠上限</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.maxDiscountPerOrder != null ? `¥${promotion.maxDiscountPerOrder}` : '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">单用户参与次数上限</Label>
                    <p className="text-sm text-gray-900">{promotion.maxTimesPerUser ?? '-'}</p>
                  </div>
                </div>

                {promotion.fundingMode === '平台+大B按比例' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">平台出资比例</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.platformFundingRatio != null ? `${promotion.platformFundingRatio}%` : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">大B出资比例</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.bigBFundingRatio != null ? `${promotion.bigBFundingRatio}%` : '-'}
                      </p>
                    </div>
                  </div>
                )}

                {promotion.fundingMode === '平台+大B按比例' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">单订单平台出资封顶</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.perOrderPlatformLimit != null ? `¥${promotion.perOrderPlatformLimit}` : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wide text-gray-600">单订单大B出资封顶</Label>
                      <p className="text-sm text-gray-900">
                        {promotion.perOrderBigBLimit != null ? `¥${promotion.perOrderBigBLimit}` : '-'}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <div className="border-t border-gray-100" />

              {/* 适用范围与人群 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">适用范围与人群</h3>

                {/* 商品维度 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">商品国家</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.scopeCountries && promotion.scopeCountries.length
                        ? promotion.scopeCountries.join(', ')
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">城市/区域</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.scopeCities && promotion.scopeCities.length
                        ? promotion.scopeCities.join(', ')
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">品牌</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.scopeBrands && promotion.scopeBrands.length
                        ? promotion.scopeBrands.join(', ')
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">酒店</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.scopeHotels && promotion.scopeHotels.length
                        ? promotion.scopeHotels.join(', ')
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">房型</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.scopeRoomTypes && promotion.scopeRoomTypes.length
                        ? promotion.scopeRoomTypes.join(', ')
                        : '-'}
                    </p>
                  </div>
                </div>

                {/* 订单属性 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">连住晚数门槛</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.minNights != null ? `≥ ${promotion.minNights} 晚` : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">订单金额门槛</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.minOrderAmount != null ? `≥ ¥${promotion.minOrderAmount}` : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">是否支持补充订单</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.supportSupplementOrder === true
                        ? '仅支持补充订单'
                        : promotion.supportSupplementOrder === false
                        ? '不支持补充订单'
                        : '不限'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">人群类型</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.crowdType === 'custom' ? '自定义人群' : '全部人群'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">人群标签</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.crowdTagName || '-'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">适用渠道</Label>
                    <p className="text-sm text-gray-900">
                      {formatApplicableChannelScope(promotion.applicableChannelScope)}
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-100" />

              {/* 创建与更新信息 */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">创建与更新信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">创建人 / 创建时间</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.createdBy || '-'}
                      {promotion.createdAt ? ` / ${promotion.createdAt}` : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">最后更新人 / 更新时间</Label>
                    <p className="text-sm text-gray-900">
                      {promotion.updatedBy || '-'}
                      {promotion.updatedAt ? ` / ${promotion.updatedAt}` : ''}
                    </p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effect" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                活动效果分析（Mock）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">效果概览</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">累计订单数（Mock）</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {mockOrders.toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">订单GMV（Mock）</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(mockGmv)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">预估ROI（Mock）</Label>
                    <p className="text-lg font-semibold text-gray-900">{mockRoi}</p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-100" />

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">预算与消耗概览</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">累计优惠金额</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(totalUsed || undefined)}
                    </p>
                    <p className="text-xs text-gray-500">平台出资 + 大B出资</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">平台出资（已用）</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(promotion.usedForActivityPlatform)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">大B出资（已用）</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(promotion.usedForActivityBigB)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">活动预算总额</Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(totalBudget || undefined)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">预算使用率</Label>
                    <p className="text-lg font-semibold text-gray-900">{budgetUsageRate}</p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-100" />

              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">趋势图（占位）</h3>
                <div className="h-48 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
                  这里预留折线图/柱状图，展示每日订单数、优惠金额等趋势（Mock）
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">
                活动数据明细
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 数据概览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">参与订单数</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {isCouponPromotion
                      ? (promotion.couponUseUserCount || 0).toLocaleString('zh-CN')
                      : (promotion.autoUsedUserCount || 0).toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">累计优惠金额</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      isCouponPromotion
                        ? totalUsed || undefined
                        : promotion.autoTotalDiscountAmount || totalUsed || undefined
                    )}
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <div className="text-sm text-gray-500">平台出资 / 大B出资</div>
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    {formatCurrency(promotion.usedForActivityPlatform)} /{' '}
                    {formatCurrency(promotion.usedForActivityBigB)}
                  </div>
                </div>
                {isCouponPromotion && (
                  <div className="rounded-lg border bg-white p-4">
                    <div className="text-sm text-gray-500">领取人数 / 使用人数</div>
                    <div className="mt-2 text-lg font-bold text-gray-900">
                      {(promotion.couponClaimUserCount || 0).toLocaleString('zh-CN')} /{' '}
                      {(promotion.couponUseUserCount || 0).toLocaleString('zh-CN')}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* 维度切换 Tabs */}
              <Tabs value={dataSubTab} onValueChange={(value) => setDataSubTab(value as 'orders' | 'usage')}>
                <TabsList>
                  <TabsTrigger value="orders">订单维度</TabsTrigger>
                  <TabsTrigger value="usage">
                    {isCouponPromotion ? '领用明细' : '使用明细'}
                  </TabsTrigger>
                </TabsList>

                {/* 订单维度 */}
                <TabsContent value="orders" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="搜索订单号或用户ID"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="订单状态" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部状态</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="refunded">已退款</SelectItem>
                          <SelectItem value="partial_refund">部分退款</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="sm">
                      导出数据
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">订单号</TableHead>
                          <TableHead className="w-[150px]">下单时间</TableHead>
                          <TableHead className="w-[100px]">渠道</TableHead>
                          <TableHead className="w-[120px]">大B/小B</TableHead>
                          <TableHead className="w-[120px] text-right">原价金额</TableHead>
                          <TableHead className="w-[120px] text-right">优惠金额</TableHead>
                          <TableHead className="w-[120px] text-right">平台出资</TableHead>
                          <TableHead className="w-[120px] text-right">大B出资</TableHead>
                          <TableHead className="w-[120px] text-right">实付金额</TableHead>
                          <TableHead className="w-[100px]">订单状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockOrderData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="py-10 text-center text-gray-500">
                              暂无订单数据
                            </TableCell>
                          </TableRow>
                        ) : (
                          mockOrderData.map((order) => (
                            <TableRow key={order.orderId} className="odd:bg-white even:bg-gray-50">
                              <TableCell className="font-mono text-xs text-gray-700">
                                {order.orderId}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {order.orderTime}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {order.channel}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {order.partner}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(order.originalAmount)}
                              </TableCell>
                              <TableCell className="text-right text-rose-700">
                                {formatCurrency(order.discountAmount)}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(order.platformFunding)}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(order.bigBFunding)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-gray-900">
                                {formatCurrency(order.paidAmount)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    order.status === 'completed'
                                      ? 'bg-green-50 text-green-700 border-green-300'
                                      : order.status === 'refunded'
                                      ? 'bg-red-50 text-red-700 border-red-300'
                                      : 'bg-orange-50 text-orange-700 border-orange-300'
                                  }
                                >
                                  {order.status === 'completed'
                                    ? '已完成'
                                    : order.status === 'refunded'
                                    ? '已退款'
                                    : '部分退款'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* 领用/使用明细 */}
                <TabsContent value="usage" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={isCouponPromotion ? '搜索券码或用户ID' : '搜索用户ID或订单号'}
                          value={usageSearch}
                          onChange={(e) => setUsageSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {isCouponPromotion && (
                        <Select value={usageStatusFilter} onValueChange={setUsageStatusFilter}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="券状态" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部状态</SelectItem>
                            <SelectItem value="unused">未使用</SelectItem>
                            <SelectItem value="used">已使用</SelectItem>
                            <SelectItem value="expired">已过期</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      导出数据
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {isCouponPromotion ? (
                            <>
                              <TableHead className="w-[140px]">券码</TableHead>
                              <TableHead className="w-[120px]">用户ID</TableHead>
                              <TableHead className="w-[150px]">领取时间</TableHead>
                              <TableHead className="w-[100px]">领取渠道</TableHead>
                              <TableHead className="w-[100px]">券状态</TableHead>
                              <TableHead className="w-[150px]">使用时间</TableHead>
                              <TableHead className="w-[140px]">关联订单号</TableHead>
                              <TableHead className="w-[120px] text-right">优惠金额</TableHead>
                              <TableHead className="w-[120px] text-right">平台出资</TableHead>
                              <TableHead className="w-[120px] text-right">大B出资</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="w-[120px]">用户ID</TableHead>
                              <TableHead className="w-[140px]">订单号</TableHead>
                              <TableHead className="w-[150px]">使用时间</TableHead>
                              <TableHead className="w-[100px]">渠道</TableHead>
                              <TableHead className="w-[120px]">大B/小B</TableHead>
                              <TableHead className="w-[120px] text-right">订单金额</TableHead>
                              <TableHead className="w-[120px] text-right">优惠金额</TableHead>
                              <TableHead className="w-[120px] text-right">平台出资</TableHead>
                              <TableHead className="w-[120px] text-right">大B出资</TableHead>
                              <TableHead className="w-[100px]">订单状态</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(isCouponPromotion ? mockCouponUsageData : mockAutoUsageData).length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={isCouponPromotion ? 10 : 10}
                              className="py-10 text-center text-gray-500"
                            >
                              暂无使用数据
                            </TableCell>
                          </TableRow>
                        ) : isCouponPromotion ? (
                          mockCouponUsageData.map((usage) => (
                            <TableRow key={usage.couponCode} className="odd:bg-white even:bg-gray-50">
                              <TableCell className="font-mono text-xs text-gray-700">
                                {usage.couponCode}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.userId}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.claimTime}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.claimChannel}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    usage.status === 'used'
                                      ? 'bg-green-50 text-green-700 border-green-300'
                                      : usage.status === 'unused'
                                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                                      : 'bg-gray-50 text-gray-700 border-gray-300'
                                  }
                                >
                                  {usage.status === 'used'
                                    ? '已使用'
                                    : usage.status === 'unused'
                                    ? '未使用'
                                    : '已过期'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.useTime || '-'}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-gray-700">
                                {usage.orderId || '-'}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {usage.discountAmount ? formatCurrency(usage.discountAmount) : '-'}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {usage.platformFunding ? formatCurrency(usage.platformFunding) : '-'}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {usage.bigBFunding ? formatCurrency(usage.bigBFunding) : '-'}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          mockAutoUsageData.map((usage) => (
                            <TableRow key={usage.orderId} className="odd:bg-white even:bg-gray-50">
                              <TableCell className="text-sm text-gray-700">
                                {usage.userId}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-gray-700">
                                {usage.orderId}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.useTime}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.channel}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {usage.partner}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(usage.orderAmount)}
                              </TableCell>
                              <TableCell className="text-right text-rose-700">
                                {formatCurrency(usage.discountAmount)}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(usage.platformFunding)}
                              </TableCell>
                              <TableCell className="text-right text-gray-900">
                                {formatCurrency(usage.bigBFunding)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    usage.status === 'completed'
                                      ? 'bg-green-50 text-green-700 border-green-300'
                                      : 'bg-red-50 text-red-700 border-red-300'
                                  }
                                >
                                  {usage.status === 'completed' ? '已完成' : '已退款'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
