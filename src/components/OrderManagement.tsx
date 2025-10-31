import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
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
} from 'lucide-react';

// 订单状态
type OrderStatus = 'confirmed' | 'checkin' | 'checkout' | 'completed' | 'cancelled' | 'refunded';

// 结算状态
type SettlementStatus = 'pending' | 'ready' | 'processing' | 'completed';

// 订单详情
interface Order {
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
  
  // 订单状态
  orderStatus: OrderStatus;
  
  // 六重门控状态
  gates: {
    serviceCompleted: boolean; // Gate 1: 服务已完成
    coolingOffPassed: boolean; // Gate 2: 冻结期已过
    noDispute: boolean; // Gate 3: 无争议
    costReconciled: boolean; // Gate 4: 成本已对账
    accountHealthy: boolean; // Gate 5: 账户状态正常
    thresholdMet: boolean; // Gate 6: 达到起付线
  };
  
  settlementStatus: SettlementStatus;
  createdAt: string;
  settledAt?: string;
}

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<'all' | OrderStatus>('all');
  const [filterSettlementStatus, setFilterSettlementStatus] = useState<'all' | SettlementStatus>('all');
  const [filterPartnerType, setFilterPartnerType] = useState<'all' | 'individual' | 'influencer' | 'enterprise'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
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
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
        thresholdMet: true,
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
      orderStatus: 'checkout',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
        thresholdMet: false,
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
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: false,
        accountHealthy: true,
        thresholdMet: false,
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
      orderStatus: 'completed',
      gates: {
        serviceCompleted: true,
        coolingOffPassed: true,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
        thresholdMet: true,
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
      orderStatus: 'confirmed',
      gates: {
        serviceCompleted: false,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: false,
        accountHealthy: true,
        thresholdMet: false,
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
      orderStatus: 'checkin',
      gates: {
        serviceCompleted: false,
        coolingOffPassed: false,
        noDispute: true,
        costReconciled: true,
        accountHealthy: true,
        thresholdMet: false,
      },
      settlementStatus: 'pending',
      createdAt: '2025-10-27 15:45:00',
    },
  ];

  const getOrderStatusBadge = (status: OrderStatus) => {
    const config = {
      confirmed: { label: '已确认', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      checkin: { label: '已入住', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      checkout: { label: '已离店', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      cancelled: { label: '已取消', className: 'bg-red-50 text-red-700 border-red-300' },
      refunded: { label: '已退款', className: 'bg-gray-50 text-gray-700 border-gray-300' },
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
    setSelectedOrder(order);
    setShowOrderDetail(true);
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

    return matchesSearch && matchesOrderStatus && matchesSettlementStatus && matchesPartnerType;
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
            <div className="flex items-center gap-3 pt-4 border-t mt-4">
              <Select value={filterOrderStatus} onValueChange={(value: any) => setFilterOrderStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="订单状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="checkin">已入住</SelectItem>
                  <SelectItem value="checkout">已离店</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                  <SelectItem value="refunded">已退款</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSettlementStatus} onValueChange={(value: any) => setFilterSettlementStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="结算状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待结算</SelectItem>
                  <SelectItem value="ready">可结算</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已结算</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPartnerType} onValueChange={(value: any) => setFilterPartnerType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="商户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="individual">个人</SelectItem>
                  <SelectItem value="influencer">博主</SelectItem>
                  <SelectItem value="enterprise">企业</SelectItem>
                </SelectContent>
              </Select>

              {(filterOrderStatus !== 'all' || filterSettlementStatus !== 'all' || filterPartnerType !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterOrderStatus('all');
                    setFilterSettlementStatus('all');
                    setFilterPartnerType('all');
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>酒店信息</TableHead>
                  <TableHead>入住信息</TableHead>
                  <TableHead>小B商户</TableHead>
                  <TableHead>订单金额</TableHead>
                  <TableHead>小B利润</TableHead>
                  <TableHead>订单状态</TableHead>
                  <TableHead>结算状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      暂无订单数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const passedGates = Object.values(order.gates).filter(Boolean).length;
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <p>{order.hotelName}</p>
                            <p className="text-sm text-gray-500">{order.roomType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{order.checkInDate} ~ {order.checkOutDate}</p>
                            <p className="text-gray-500">{order.nights} 晚</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <p>{order.partnerName}</p>
                              {getPartnerTypeBadge(order.partnerType)}
                            </div>
                            <p className="text-sm text-gray-500">{order.partnerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          ¥{order.p2_salePrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-green-600">
                          ¥{order.partnerProfit.toFixed(2)}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getSettlementStatusBadge(order.settlementStatus)}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{passedGates}/6</span>
                              {passedGates === 6 ? (
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-yellow-600" />
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrderDetail(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* 订单详情弹窗 */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              订单详情
            </DialogTitle>
            <DialogDescription>查看订单的完整信息、价格体系和六重门控状态</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* 订单基本信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">订单基本信息</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">订单号</Label>
                    <p className="mt-1 font-mono">{selectedOrder.orderId}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">创建时间</Label>
                    <p className="mt-1">{selectedOrder.createdAt}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">订单状态</Label>
                    <div className="mt-1">{getOrderStatusBadge(selectedOrder.orderStatus)}</div>
                  </div>
                </div>
              </div>

              {/* 酒店信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">酒店信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">酒店名称</Label>
                    <p className="mt-1">{selectedOrder.hotelName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">酒店地址</Label>
                    <p className="mt-1">{selectedOrder.hotelAddress}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">房型</Label>
                    <p className="mt-1">{selectedOrder.roomType}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">入住时间</Label>
                    <p className="mt-1">{selectedOrder.checkInDate} ~ {selectedOrder.checkOutDate} ({selectedOrder.nights}晚)</p>
                  </div>
                </div>
              </div>

              {/* 客户信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">客户信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">客户姓名</Label>
                    <p className="mt-1">{selectedOrder.customerName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">联系电话</Label>
                    <p className="mt-1">{selectedOrder.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* 小B商户信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">小B商户信息</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">商户名称</Label>
                    <p className="mt-1">{selectedOrder.partnerName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">商户邮箱</Label>
                    <p className="mt-1">{selectedOrder.partnerEmail}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">商户类型</Label>
                    <div className="mt-1">{getPartnerTypeBadge(selectedOrder.partnerType)}</div>
                  </div>
                </div>
              </div>

              {/* 价格体系 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">价格体系</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">P0 - 供应商底价</span>
                    <span>¥{selectedOrder.p0_supplierCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-gray-600">P1 - 平台供货价</span>
                    <span className="text-blue-700">¥{selectedOrder.p1_platformPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-600">P2 - 小B销售价</span>
                    <span className="text-green-700">¥{selectedOrder.p2_salePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 利润分配 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">利润分配</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="text-gray-600">平台利润 (P1-P0)</span>
                    <span className="text-purple-700">¥{selectedOrder.platformProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-600">小B利润 (P2-P1)</span>
                    <span className="text-green-700">¥{selectedOrder.partnerProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 六重门控状态 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">六重门控状态</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.serviceCompleted)}
                      <span>Gate 1: 服务已完成</span>
                    </div>
                    <Badge variant={selectedOrder.gates.serviceCompleted ? 'default' : 'secondary'}>
                      {selectedOrder.gates.serviceCompleted ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.coolingOffPassed)}
                      <span>Gate 2: 冻结期已过 (7-15天)</span>
                    </div>
                    <Badge variant={selectedOrder.gates.coolingOffPassed ? 'default' : 'secondary'}>
                      {selectedOrder.gates.coolingOffPassed ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.noDispute)}
                      <span>Gate 3: 订单无未决争议</span>
                    </div>
                    <Badge variant={selectedOrder.gates.noDispute ? 'default' : 'secondary'}>
                      {selectedOrder.gates.noDispute ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.costReconciled)}
                      <span>Gate 4: 供应商成本已对账</span>
                    </div>
                    <Badge variant={selectedOrder.gates.costReconciled ? 'default' : 'secondary'}>
                      {selectedOrder.gates.costReconciled ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.accountHealthy)}
                      <span>Gate 5: 结算对象状态正常</span>
                    </div>
                    <Badge variant={selectedOrder.gates.accountHealthy ? 'default' : 'secondary'}>
                      {selectedOrder.gates.accountHealthy ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.thresholdMet)}
                      <span>Gate 6: 达到最低起付金额</span>
                    </div>
                    <Badge variant={selectedOrder.gates.thresholdMet ? 'default' : 'secondary'}>
                      {selectedOrder.gates.thresholdMet ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 结算信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">结算信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">结算状态</Label>
                    <div className="mt-1">{getSettlementStatusBadge(selectedOrder.settlementStatus)}</div>
                  </div>
                  {selectedOrder.settledAt && (
                    <div className="p-3 bg-gray-50 rounded">
                      <Label className="text-gray-600">结算时间</Label>
                      <p className="mt-1">{selectedOrder.settledAt}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetail(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
