import React, { useState, useEffect, useMemo } from 'react';
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
  XCircle,
  DollarSign,
  Upload,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { getMockOrders, type Order, type OrderStatus, type SettlementStatus } from '../data/mockOrders';
import { filterOrdersByUserType } from '../utils/orderUtils';

// 导出类型以便其他组件使用
export type { Order, OrderStatus, SettlementStatus };

interface OrderManagementProps {
  onViewOrderDetail?: (order: Order) => void;
  currentPartner?: import('../data/mockPartners').Partner | null; // 当前用户的Partner信息
  userType?: 'admin' | 'bigb' | 'smallb'; // 用户类型
}

export function OrderManagement({ onViewOrderDetail, currentPartner, userType }: OrderManagementProps) {
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

  // 免费取消对话框状态
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState<'hotel_agree' | 'free_period' | 'platform_cover' | ''>('');
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<Order | null>(null);

  // 部分退款对话框状态
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundProof, setRefundProof] = useState<File | null>(null);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);

  // 使用 mock 数据
  const allOrders: Order[] = getMockOrders();
  
  // 根据用户类型和Partner信息过滤订单
  const orders = useMemo(() => {
    if (!userType || userType === 'admin') {
      // 管理员可以查看所有订单
      return allOrders;
    }
    
    return filterOrdersByUserType(allOrders, currentPartner || null, userType);
  }, [allOrders, currentPartner, userType]);

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

  // 打开免费取消对话框
  const handleOpenCancelDialog = (order: Order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('');
    setShowCancelDialog(true);
  };

  // 确认免费取消
  const handleConfirmCancel = () => {
    if (!cancelReason) {
      toast.error('请选择取消原因');
      return;
    }
    if (!selectedOrderForCancel) return;

    // 这里应该调用API更新订单状态
    toast.success(`订单 ${selectedOrderForCancel.orderId} 已免费取消`);
    setShowCancelDialog(false);
    setSelectedOrderForCancel(null);
    setCancelReason('');
  };

  // 打开部分退款对话框
  const handleOpenRefundDialog = (order: Order) => {
    setSelectedOrderForRefund(order);
    setRefundAmount('');
    setRefundProof(null);
    setShowRefundDialog(true);
  };

  // 确认部分退款
  const handleConfirmRefund = () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error('请输入有效的退款金额');
      return;
    }
    if (!refundProof) {
      toast.error('请上传退款凭证');
      return;
    }
    if (!selectedOrderForRefund) return;

    const refundValue = parseFloat(refundAmount);
    if (refundValue > selectedOrderForRefund.p2_salePrice) {
      toast.error('退款金额不能超过订单金额');
      return;
    }

    // 这里应该调用API处理退款
    toast.success(`订单 ${selectedOrderForRefund.orderId} 部分退款 ¥${refundValue.toFixed(2)} 已提交`);
    setShowRefundDialog(false);
    setSelectedOrderForRefund(null);
    setRefundAmount('');
    setRefundProof(null);
  };

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefundProof(file);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.guestName && order.guestName.toLowerCase().includes(searchQuery.toLowerCase()));

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

  // 计算分页数据
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterOrderStatus, filterSettlementStatus, filterPartnerType, filterHotelName, filterPartnerName, filterCreateDateStart, filterCreateDateEnd, filterCheckInDateStart, filterCheckInDateEnd, filterOrderAmountMin, filterOrderAmountMax, filterActualAmountMin, filterActualAmountMax]);

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
                    <TableHead className="min-w-[100px]">入住人姓名</TableHead>
                    <TableHead className="min-w-[100px]">入住人数</TableHead>
                    <TableHead className="min-w-[120px]">入住日期</TableHead>
                    <TableHead className="min-w-[120px]">离店日期</TableHead>
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
                    <TableCell colSpan={16} className="text-center py-12 text-gray-500">
                      暂无订单数据
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-mono text-sm sticky left-0 bg-white z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">{order.orderId}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.hotelName}</span>
                            {order.hotelNameEn && (
                              <span className="text-xs text-gray-500">{order.hotelNameEn}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{order.roomType}</TableCell>
                        <TableCell>{order.guestName || order.customerName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.adultCount !== undefined && (
                              <span>{order.adultCount}成人</span>
                            )}
                            {order.childCount !== undefined && order.childCount > 0 && (
                              <span className="ml-1">{order.childCount}儿童</span>
                            )}
                            {order.adultCount === undefined && order.childCount === undefined && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.checkInDate}</TableCell>
                        <TableCell>{order.checkOutDate}</TableCell>
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
                          <div className="flex items-center justify-end gap-2">
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
                            
                            {/* 免费取消按钮 */}
                            {(order.orderStatus === 'confirmed' || order.orderStatus === 'pending_confirm') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleOpenCancelDialog(order)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>免费取消</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {/* 部分退款按钮 */}
                            {(order.orderStatus === 'completed' || order.orderStatus === 'completed_settleable') && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    onClick={() => handleOpenRefundDialog(order)}
                                  >
                                    <DollarSign className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>部分退款</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页 */}
          {totalPages >= 1 && totalItems > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                共 {totalItems} 条数据，第 {currentPage} / {totalPages} 页
              </div>
              <Pagination>
                <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 免费取消对话框 */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>免费取消预订</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForCancel?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">取消原因 *</Label>
              <Select value={cancelReason} onValueChange={(value: any) => setCancelReason(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择取消原因" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel_agree">酒店同意免费取消</SelectItem>
                  <SelectItem value="free_period">在免费取消时间内</SelectItem>
                  <SelectItem value="platform_cover">平台兜底</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>注意：</strong>免费取消后，订单将无法恢复，请确认操作。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700">
              确认取消订单
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 部分退款对话框 */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>部分退款</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForRefund?.orderId} | 订单金额: ¥{selectedOrderForRefund?.p2_salePrice.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">退款金额 *</Label>
              <Input
                id="refund-amount"
                type="number"
                placeholder="请输入退款金额"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refund-proof">上传凭证 *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="refund-proof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {refundProof && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Upload className="w-4 h-4" />
                    <span>{refundProof.name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">支持图片或PDF格式</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>说明：</strong>退款后，订单底价和订单金额将按比例调整。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmRefund} className="bg-orange-600 hover:bg-orange-700">
              确认退款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
