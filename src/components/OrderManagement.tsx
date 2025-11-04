import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { 
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Download,
  Package,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

// 订单状态 - 根据PRD定义
type OrderStatus = 'pending_payment' | 'pending_confirm' | 'confirmed' | 'completed' | 'completed_settleable' | 'cancelled_free' | 'cancelled_paid' | 'no_show' | 'disputed';

// 结算状态
type SettlementStatus = 'pending' | 'ready' | 'processing' | 'completed';

// 订单详情
export interface Order {
  orderId: string;
  hotelName: string;
  hotelAddress: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  
  // 小B信息
  partnerName: string;
  partnerEmail: string;
  partnerType: 'individual' | 'influencer' | 'enterprise';
  
  // 客户信息
  customerName: string;
  customerPhone: string;
  
  // 价格体系
  p0_supplierCost: number; // 供应商底价
  p1_platformPrice: number; // 平台供货价
  p2_salePrice: number; // 小B销售价
  
  // 利润计算
  platformProfit: number; // 平台利润 = P1 - P0
  partnerProfit: number; // 小B利润 = P2 - P1
  
  // 实付金额和退款金额
  actualAmount: number; // 实付金额
  refundAmount?: number; // 退款金额（可选）
  
  // 订单状态
  orderStatus: OrderStatus;
  
  // 五重门控状态 - 根据PRD定义
  gates: {
    serviceCompleted: boolean; // Gate 1: 服务已完成 - 离店日期 < T(今日)
    coolingOffPassed: boolean; // Gate 2: 冻结期已过 - T(今日) - 离店日期 > 结算冻结期天数 (7-15天)
    noDispute: boolean; // Gate 3: 订单无未决争议 - 不处于争议中、退款处理中等异常挂起状态
    costReconciled: boolean; // Gate 4: 供应商成本已对账 - P0已与上游供应商账单核对并标记为已对账
    accountHealthy: boolean; // Gate 5: 结算对象状态正常 - 小B/供应商账户结算状态为活跃
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

interface OrderManagementProps {
  onViewOrderDetail?: (order: Order) => void;
}

export function OrderManagement({ onViewOrderDetail }: OrderManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<'all' | OrderStatus>('all');
  const [filterSettlementStatus, setFilterSettlementStatus] = useState<'all' | SettlementStatus>('all');
  const [filterPartnerType, setFilterPartnerType] = useState<'all' | 'individual' | 'influencer' | 'enterprise'>('all');
  const [filterHotelName, setFilterHotelName] = useState('');
  const [filterPartnerName, setFilterPartnerName] = useState('');
  const [filterCreateDateStart, setFilterCreateDateStart] = useState('');
  const [filterCreateDateEnd, setFilterCreateDateEnd] = useState('');
  const [filterCheckInDateStart, setFilterCheckInDateStart] = useState('');
  const [filterCheckInDateEnd, setFilterCheckInDateEnd] = useState('');
  const [filterOrderAmountMin, setFilterOrderAmountMin] = useState('');
  const [filterOrderAmountMax, setFilterOrderAmountMax] = useState('');
  const [filterActualAmountMin, setFilterActualAmountMin] = useState('');
  const [filterActualAmountMax, setFilterActualAmountMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // 模拟订单数据
  const orders: Order[] = [
    {
      orderId: 'ORD-2025001',
      hotelName: '北京希尔顿酒店',
      hotelAddress: '北京市朝阳区东三环北路8号',
      roomType: '豪华大床房',
      checkInDate: '2025-10-18',
      checkOutDate: '2025-10-20',
      nights: 2,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      customerName: '王先生',
      customerPhone: '138****5678',
      p0_supplierCost: 800,
      p1_platformPrice: 880,
      p2_salePrice: 968,
      platformProfit: 80,
      partnerProfit: 88,
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
      hotelAddress: '上海市浦东新区富城路33号',
      roomType: '行政套房',
      checkInDate: '2025-10-23',
      checkOutDate: '2025-10-25',
      nights: 2,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '刘女士',
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
      hotelAddress: '深圳市南山区后海滨路3101号',
      roomType: '海景大床房',
      checkInDate: '2025-10-20',
      checkOutDate: '2025-10-22',
      nights: 2,
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      partnerType: 'individual',
      customerName: '赵先生',
      customerPhone: '136****9876',
      p0_supplierCost: 950,
      p1_platformPrice: 1045,
      p2_salePrice: 1149.5,
      platformProfit: 95,
      partnerProfit: 104.5,
      actualAmount: 459.8, // 1149.5 - 689.7 (大量退款)
      refundAmount: 689.7,
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: false,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-18 16:20:00',
    },
    {
      orderId: 'ORD-2025004',
      hotelName: '广州白天鹅宾馆',
      hotelAddress: '广州市荔湾区沙面南街1号',
      roomType: '珠江景观房',
      checkInDate: '2025-10-26',
      checkOutDate: '2025-10-28',
      nights: 2,
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      partnerType: 'influencer',
      customerName: '孙女士',
      customerPhone: '137****5432',
      p0_supplierCost: 750,
      p1_platformPrice: 825,
      p2_salePrice: 907.5,
      platformProfit: 75,
      partnerProfit: 82.5,
      actualAmount: 907.5,
      refundAmount: 0,
      orderStatus: 'completed_settleable',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'completed',
      createdAt: '2025-10-24 11:00:00',
      settledAt: '2025-10-29 10:00:00',
    },
    {
      orderId: 'ORD-2025005',
      hotelName: '杭州西湖四季酒店',
      hotelAddress: '浙江省杭州市西湖区灵隐路5号',
      roomType: '湖景套房',
      checkInDate: '2025-11-01',
      checkOutDate: '2025-11-03',
      nights: 2,
      partnerName: '王五企业集团',
      partnerEmail: 'wangwu@example.com',
      partnerType: 'enterprise',
      customerName: '周先生',
      customerPhone: '135****7890',
      p0_supplierCost: 1500,
      p1_platformPrice: 1650,
      p2_salePrice: 1815,
      platformProfit: 150,
      partnerProfit: 165,
      actualAmount: 1815,
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
      createdAt: '2025-10-28 09:30:00',
    },
    {
      orderId: 'ORD-2025006',
      hotelName: '成都洲际酒店',
      hotelAddress: '四川省成都市锦江区总府路31号',
      roomType: '商务大床房',
      checkInDate: '2025-10-29',
      checkOutDate: '2025-10-30',
      nights: 1,
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      partnerType: 'enterprise',
      customerName: '吴女士',
      customerPhone: '138****2468',
      p0_supplierCost: 680,
      p1_platformPrice: 748,
      p2_salePrice: 822.8,
      platformProfit: 68,
      partnerProfit: 74.8,
      actualAmount: 822.8,
      refundAmount: 0, // 无退款
      orderStatus: 'confirmed',
      gates: {
        serviceCompleted: false,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-27 15:45:00',
    },
  ];

  const getOrderStatusBadge = (status: OrderStatus) => {
    const config = {
      pending_payment: { label: '待支付', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      pending_confirm: { label: '待确认', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      confirmed: { label: '已确认/待入住', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      completed_settleable: { label: '已完成(可结算)', className: 'bg-green-100 text-green-800 border-green-400' },
      cancelled_free: { label: '已取消(免费)', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      cancelled_paid: { label: '已取消(付费)', className: 'bg-red-50 text-red-700 border-red-300' },
      no_show: { label: 'No-Show', className: 'bg-red-100 text-red-800 border-red-400' },
      disputed: { label: '争议中', className: 'bg-red-200 text-red-900 border-red-500' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getSettlementStatusBadge = (status: SettlementStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      ready: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      processing: { label: '处理中', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      completed: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getPartnerTypeBadge = (type: string) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      influencer: { label: '博主', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      enterprise: { label: '企业', className: 'bg-orange-50 text-orange-700 border-orange-300' },
    };
    const { label, className } = config[type as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getGateIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-600" />
    );
  };

  const handleViewOrderDetail = (order: Order) => {
    if (onViewOrderDetail) {
      onViewOrderDetail(order);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOrderStatus = filterOrderStatus === 'all' || order.orderStatus === filterOrderStatus;
    const matchesSettlementStatus = filterSettlementStatus === 'all' || order.settlementStatus === filterSettlementStatus;
    const matchesPartnerType = filterPartnerType === 'all' || order.partnerType === filterPartnerType;
    
    // 酒店名称筛选
    const matchesHotelName = !filterHotelName || order.hotelName.toLowerCase().includes(filterHotelName.toLowerCase());
    
    // 小B商户筛选
    const matchesPartnerName = !filterPartnerName || 
      order.partnerName.toLowerCase().includes(filterPartnerName.toLowerCase()) ||
      order.partnerEmail.toLowerCase().includes(filterPartnerName.toLowerCase());
    
    // 创建时间范围筛选（只比较日期部分）
    const orderCreateDate = order.createdAt.split(' ')[0]; // 提取日期部分
    const matchesCreateDate = (!filterCreateDateStart || orderCreateDate >= filterCreateDateStart) &&
      (!filterCreateDateEnd || orderCreateDate <= filterCreateDateEnd);
    
    // 入住日期范围筛选
    const matchesCheckInDate = (!filterCheckInDateStart || order.checkInDate >= filterCheckInDateStart) &&
      (!filterCheckInDateEnd || order.checkInDate <= filterCheckInDateEnd);
    
    // 订单金额范围筛选
    const minOrderAmount = filterOrderAmountMin ? parseFloat(filterOrderAmountMin) : null;
    const maxOrderAmount = filterOrderAmountMax ? parseFloat(filterOrderAmountMax) : null;
    const matchesOrderAmount = 
      (minOrderAmount === null || !isNaN(minOrderAmount) && order.p2_salePrice >= minOrderAmount) &&
      (maxOrderAmount === null || !isNaN(maxOrderAmount) && order.p2_salePrice <= maxOrderAmount);
    
    // 实付金额范围筛选
    const minActualAmount = filterActualAmountMin ? parseFloat(filterActualAmountMin) : null;
    const maxActualAmount = filterActualAmountMax ? parseFloat(filterActualAmountMax) : null;
    const matchesActualAmount = 
      (minActualAmount === null || !isNaN(minActualAmount) && order.actualAmount >= minActualAmount) &&
      (maxActualAmount === null || !isNaN(maxActualAmount) && order.actualAmount <= maxActualAmount);

    return matchesSearch && matchesOrderStatus && matchesSettlementStatus && matchesPartnerType &&
      matchesHotelName && matchesPartnerName && matchesCreateDate && matchesCheckInDate &&
      matchesOrderAmount && matchesActualAmount;
  });

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>订单管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              订单列表
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索订单号、酒店、商户"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* 筛选器 */}
          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              {/* 第一行：基本状态筛选 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">订单状态</Label>
                  <Select value={filterOrderStatus} onValueChange={(value: any) => setFilterOrderStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending_payment">待支付</SelectItem>
                      <SelectItem value="pending_confirm">待确认</SelectItem>
                      <SelectItem value="confirmed">已确认/待入住</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="completed_settleable">已完成(可结算)</SelectItem>
                      <SelectItem value="cancelled_free">已取消(免费)</SelectItem>
                      <SelectItem value="cancelled_paid">已取消(付费)</SelectItem>
                      <SelectItem value="no_show">No-Show</SelectItem>
                      <SelectItem value="disputed">争议中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结算状态</Label>
                  <Select value={filterSettlementStatus} onValueChange={(value: any) => setFilterSettlementStatus(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待结算</SelectItem>
                      <SelectItem value="ready">可结算</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="completed">已结算</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">商户类型</Label>
                  <Select value={filterPartnerType} onValueChange={(value: any) => setFilterPartnerType(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="individual">个人</SelectItem>
                      <SelectItem value="influencer">博主</SelectItem>
                      <SelectItem value="enterprise">企业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 第二行：名称筛选 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">酒店名称</Label>
                  <Input
                    placeholder="输入酒店名称"
                    value={filterHotelName}
                    onChange={(e) => setFilterHotelName(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">小B商户</Label>
                  <Input
                    placeholder="输入商户名称或邮箱"
                    value={filterPartnerName}
                    onChange={(e) => setFilterPartnerName(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* 第三行：日期范围筛选 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">创建时间</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="date"
                      value={filterCreateDateStart}
                      onChange={(e) => setFilterCreateDateStart(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 flex-shrink-0">至</span>
                    <Input
                      type="date"
                      value={filterCreateDateEnd}
                      onChange={(e) => setFilterCreateDateEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">入住日期</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="date"
                      value={filterCheckInDateStart}
                      onChange={(e) => setFilterCheckInDateStart(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 flex-shrink-0">至</span>
                    <Input
                      type="date"
                      value={filterCheckInDateEnd}
                      onChange={(e) => setFilterCheckInDateEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* 第四行：金额范围筛选 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">订单金额</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="number"
                      placeholder="最小值"
                      value={filterOrderAmountMin}
                      onChange={(e) => setFilterOrderAmountMin(e.target.value)}
                      className="flex-1"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-sm text-gray-500 flex-shrink-0">至</span>
                    <Input
                      type="number"
                      placeholder="最大值"
                      value={filterOrderAmountMax}
                      onChange={(e) => setFilterOrderAmountMax(e.target.value)}
                      className="flex-1"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">实付金额</Label>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="number"
                      placeholder="最小值"
                      value={filterActualAmountMin}
                      onChange={(e) => setFilterActualAmountMin(e.target.value)}
                      className="flex-1"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-sm text-gray-500 flex-shrink-0">至</span>
                    <Input
                      type="number"
                      placeholder="最大值"
                      value={filterActualAmountMax}
                      onChange={(e) => setFilterActualAmountMax(e.target.value)}
                      className="flex-1"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* 清除筛选按钮 */}
              <div className="flex items-center justify-end pt-2">
                {(filterOrderStatus !== 'all' || filterSettlementStatus !== 'all' || filterPartnerType !== 'all' ||
                  filterHotelName || filterPartnerName || filterCreateDateStart || filterCreateDateEnd ||
                  filterCheckInDateStart || filterCheckInDateEnd || filterOrderAmountMin || filterOrderAmountMax ||
                  filterActualAmountMin || filterActualAmountMax) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterOrderStatus('all');
                      setFilterSettlementStatus('all');
                      setFilterPartnerType('all');
                      setFilterHotelName('');
                      setFilterPartnerName('');
                      setFilterCreateDateStart('');
                      setFilterCreateDateEnd('');
                      setFilterCheckInDateStart('');
                      setFilterCheckInDateEnd('');
                      setFilterOrderAmountMin('');
                      setFilterOrderAmountMax('');
                      setFilterActualAmountMin('');
                      setFilterActualAmountMax('');
                    }}
                  >
                    清除所有筛选
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden relative">
            <style>{`
              [data-slot="table-container"] {
                position: relative;
              }
              [data-slot="table"] {
                min-width: 2000px !important;
                width: max-content;
              }
              [data-slot="table"] th:last-child,
              [data-slot="table"] td:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
            `}</style>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] sticky left-0 bg-white z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">订单号</TableHead>
                    <TableHead className="min-w-[150px]">酒店名称</TableHead>
                    <TableHead className="min-w-[120px]">房型</TableHead>
                    <TableHead className="min-w-[120px]">入住日期</TableHead>
                    <TableHead className="min-w-[120px]">离店日期</TableHead>
                    <TableHead className="min-w-[80px]">晚数</TableHead>
                    <TableHead className="min-w-[150px]">小B商户名称</TableHead>
                    <TableHead className="min-w-[100px]">商户类型</TableHead>
                    <TableHead className="min-w-[180px]">商户邮箱</TableHead>
                    <TableHead className="min-w-[100px]">订单金额</TableHead>
                    <TableHead className="min-w-[100px]">实付金额</TableHead>
                    <TableHead className="min-w-[100px]">退款金额</TableHead>
                    <TableHead className="min-w-[120px]">订单状态</TableHead>
                    <TableHead className="min-w-[100px]">结算状态</TableHead>
                    <TableHead className="text-right w-[100px] sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-12 text-gray-500">
                      暂无订单数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-mono text-sm sticky left-0 bg-white z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">{order.orderId}</TableCell>
                        <TableCell>{order.hotelName}</TableCell>
                        <TableCell className="text-gray-600">{order.roomType}</TableCell>
                        <TableCell>{order.checkInDate}</TableCell>
                        <TableCell>{order.checkOutDate}</TableCell>
                        <TableCell className="text-gray-500">{order.nights} 晚</TableCell>
                        <TableCell>{order.partnerName}</TableCell>
                        <TableCell>{getPartnerTypeBadge(order.partnerType)}</TableCell>
                        <TableCell className="text-sm text-gray-500">{order.partnerEmail}</TableCell>
                        <TableCell>
                          ¥{order.p2_salePrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-indigo-600 font-medium">
                          ¥{order.actualAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className={order.refundAmount && order.refundAmount > 0 ? "text-orange-600 font-medium" : "text-gray-400"}>
                          {order.refundAmount && order.refundAmount > 0 ? `¥${order.refundAmount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                        <TableCell>{getSettlementStatusBadge(order.settlementStatus)}</TableCell>
                        <TableCell className="text-right sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewOrderDetail(order)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>查看详情</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 - 暂时省略 */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                共 {filteredOrders.length} 条记录
              </p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
