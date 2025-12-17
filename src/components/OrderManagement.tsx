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
  Edit,
  RefreshCw,
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
  const [filterUserInfoType, setFilterUserInfoType] = useState<'all' | 'travel_agent' | 'influencer' | 'app'>('all');
  const [filterCertificationType, setFilterCertificationType] = useState<'all' | 'personal' | 'enterprise'>('all');
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
  const [selectedCancelDates, setSelectedCancelDates] = useState<string[]>([]);

  // 部分退款对话框状态（每晚独立设置）
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundProof, setRefundProof] = useState<File | null>(null);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  // 每晚退款设置：{ date: string, mode: 'fixed' | 'percentage', value: string }
  const [nightlyRefundSettings, setNightlyRefundSettings] = useState<Record<string, { mode: 'fixed' | 'percentage', value: string }>>({});

  // 修改订单对话框状态
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [selectedOrderForModify, setSelectedOrderForModify] = useState<Order | null>(null);
  const [modifyCheckInDate, setModifyCheckInDate] = useState('');
  const [modifyCheckOutDate, setModifyCheckOutDate] = useState('');
  const [modifyRoomCount, setModifyRoomCount] = useState(1);

  // 简化退款对话框状态（按每晚退款）
  const [showSimpleRefundDialog, setShowSimpleRefundDialog] = useState(false);
  const [selectedOrderForSimpleRefund, setSelectedOrderForSimpleRefund] = useState<Order | null>(null);
  // 每晚供应商退款金额: { date: string, amount: string }
  const [nightlySupplierRefunds, setNightlySupplierRefunds] = useState<Record<string, string>>({});

  // 修改/退款弹窗状态
  const [showModifyRefundDialog, setShowModifyRefundDialog] = useState(false);
  const [selectedOrderForModifyRefund, setSelectedOrderForModifyRefund] = useState<Order | null>(null);
  const [modifyRefundCheckInDate, setModifyRefundCheckInDate] = useState('');
  const [modifyRefundCheckOutDate, setModifyRefundCheckOutDate] = useState('');
  const [modifyRefundGuestCount, setModifyRefundGuestCount] = useState(1);
  const [supplierRefundAmount, setSupplierRefundAmount] = useState('');
  const [refundProofFile, setRefundProofFile] = useState<File | null>(null);

  // 二次确认弹窗状态
  const [showConfirmRefundDialog, setShowConfirmRefundDialog] = useState(false);

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
      confirmed: { label: '已确认', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      pending_checkin: { label: '待入住', className: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      settleable: { label: '可结算', className: 'bg-teal-50 text-teal-700 border-teal-300' },
      cancelled_free: { label: '已取消(免费)', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      cancelled_paid: { label: '已取消(付费)', className: 'bg-red-50 text-red-700 border-red-300' },
      no_show: { label: '未入住', className: 'bg-slate-50 text-slate-700 border-slate-300' },
      after_sale: { label: '售后中', className: 'bg-rose-50 text-rose-700 border-rose-300' },
    } as const;
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getSettlementStatusBadge = (status: SettlementStatus) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      settleable: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      processing: { label: '处理中', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      settled: { label: '已结算', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const userInfoTypeConfig = {
    individual: { label: '旅行代理', value: 'travel_agent', className: 'bg-blue-50 text-blue-700 border-blue-300' },
    influencer: { label: '网络博主', value: 'influencer', className: 'bg-purple-50 text-purple-700 border-purple-300' },
    enterprise: { label: '旅游类应用', value: 'app', className: 'bg-orange-50 text-orange-700 border-orange-300' },
  };

  const getUserInfoTypeValue = (type: string) => {
    return userInfoTypeConfig[type as keyof typeof userInfoTypeConfig]?.value ?? 'travel_agent';
  };

  const getUserInfoTypeBadge = (type: string) => {
    const config = userInfoTypeConfig[type as keyof typeof userInfoTypeConfig];
    if (!config) return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">-</Badge>;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getCertificationBadge = (type?: 'personal' | 'enterprise') => {
    if (!type) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">-</Badge>;
    }
    const config = {
      personal: { label: '个人认证', className: 'bg-sky-50 text-sky-700 border-sky-300' },
      enterprise: { label: '企业认证', className: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return '-';
    }
    return `¥${value.toFixed(2)}`;
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

  // 打开修改/退款对话框
  const handleOpenModifyRefundDialog = (order: Order) => {
    setSelectedOrderForModifyRefund(order);
    setModifyRefundCheckInDate(order.checkInDate);
    setModifyRefundCheckOutDate(order.checkOutDate);
    setModifyRefundGuestCount(1); // 默认1人
    setShowModifyRefundDialog(true);
  };

  // 发起退款（显示二次确认弹窗）
  const handleInitiateRefund = () => {
    setShowModifyRefundDialog(false);
    setShowConfirmRefundDialog(true);
  };

  // 最终确认退款
  const handleFinalConfirmRefund = () => {
    if (!selectedOrderForModifyRefund) return;
    
    const refundAmountValue = parseFloat(supplierRefundAmount) || 0;
    
    // 这里应该调用API保存退款信息
    // 临时模拟：更新订单的退款金额
    selectedOrderForModifyRefund.refundAmount = refundAmountValue;
    
    toast.success(`订单 ${selectedOrderForModifyRefund.orderId} 退款成功！退款金额：¥${refundAmountValue.toFixed(2)}`);
    setShowConfirmRefundDialog(false);
    setSelectedOrderForModifyRefund(null);
    setModifyRefundCheckInDate('');
    setModifyRefundCheckOutDate('');
    setModifyRefundGuestCount(1);
    setSupplierRefundAmount('');
    setRefundProofFile(null);
  };

  // 打开免费取消对话框
  const handleOpenCancelDialog = (order: Order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('');
    setSelectedCancelDates([]);
    setShowCancelDialog(true);
  };

  // 确认免费取消
  const handleConfirmCancel = () => {
    if (!cancelReason) {
      toast.error('请选择取消原因');
      return;
    }
    if (selectedCancelDates.length === 0) {
      toast.error('请至少选择一个取消日期');
      return;
    }
    if (!selectedOrderForCancel) return;

    const isFullCancel = selectedCancelDates.length === selectedOrderForCancel.nights;
    const cancelType = isFullCancel ? '全部取消' : '部分取消';
    
    // 这里应该调用API更新订单状态
    toast.success(`订单 ${selectedOrderForCancel.orderId} ${cancelType}成功，取消日期：${selectedCancelDates.join(', ')}`);
    setShowCancelDialog(false);
    setSelectedOrderForCancel(null);
    setCancelReason('');
    setSelectedCancelDates([]);
  };

  // 打开部分退款对话框
  const handleOpenRefundDialog = (order: Order) => {
    setSelectedOrderForRefund(order);
    setRefundReason('');
    setRefundProof(null);
    setNightlyRefundSettings({});
    setShowRefundDialog(true);
  };

  // 确认部分退款（每晚独立设置）
  const handleConfirmRefund = () => {
    if (!selectedOrderForRefund) return;
    
    // 验证至少有一晚设置了退款
    const selectedDates = Object.keys(nightlyRefundSettings);
    if (selectedDates.length === 0) {
      toast.error('请至少为一晚设置退款金额或比例');
      return;
    }
    
    // 验证每晚的设置
    for (const date of selectedDates) {
      const setting = nightlyRefundSettings[date];
      if (!setting.value || parseFloat(setting.value) <= 0) {
        toast.error(`请为 ${date} 设置有效的退款金额或比例`);
        return;
      }
      if (setting.mode === 'percentage' && parseFloat(setting.value) > 100) {
        toast.error(`${date} 的退款比例不能超过100%`);
        return;
      }
    }
    
    if (!refundReason) {
      toast.error('请填写退款原因');
      return;
    }
    if (!refundProof) {
      toast.error('请上传退款凭证');
      return;
    }

    // 计算总退款金额（每晚独立计算）
    let calculatedRefundAmount = 0;
    const nightly = selectedOrderForRefund.nightlyRates || [];
    const refundDetails: { date: string, amount: number }[] = [];
    
    for (const date of selectedDates) {
      const setting = nightlyRefundSettings[date];
      const night = nightly.find(n => n.date === date);
      const actualAmount = night ? (night.actualAmount ?? night.p2 ?? 0) : 0;
      
      let refundForNight = 0;
      if (setting.mode === 'fixed') {
        refundForNight = Math.min(parseFloat(setting.value), actualAmount);
      } else { // percentage
        refundForNight = actualAmount * (parseFloat(setting.value) / 100);
      }
      
      calculatedRefundAmount += refundForNight;
      refundDetails.push({ date, amount: refundForNight });
    }

    if (calculatedRefundAmount > selectedOrderForRefund.actualAmount) {
      toast.error('总退款金额不能超过订单实付金额');
      return;
    }

    // 这里应该调用API处理退款
    const refundInfo = refundDetails.map(d => `${d.date}: ¥${d.amount.toFixed(2)}`).join(', ');
    toast.success(`订单 ${selectedOrderForRefund.orderId} 部分退款 ¥${calculatedRefundAmount.toFixed(2)} 已提交。明细：${refundInfo}`);
    
    setShowRefundDialog(false);
    setSelectedOrderForRefund(null);
    setRefundReason('');
    setRefundProof(null);
    setNightlyRefundSettings({});
  };

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRefundProof(file);
    }
  };

  // 打开修改订单对话框
  const handleOpenModifyDialog = (order: Order) => {
    setSelectedOrderForModify(order);
    setModifyCheckInDate(order.checkInDate);
    setModifyCheckOutDate(order.checkOutDate);
    setModifyRoomCount(order.roomCount || order.rooms || 1);
    setShowModifyDialog(true);
  };

  // 确认修改订单
  const handleConfirmModify = () => {
    if (!selectedOrderForModify) return;
    
    if (!modifyCheckInDate || !modifyCheckOutDate) {
      toast.error('请填写入住和离店日期');
      return;
    }
    
    if (modifyCheckInDate >= modifyCheckOutDate) {
      toast.error('离店日期必须大于入住日期');
      return;
    }
    
    if (modifyRoomCount < 1) {
      toast.error('房间数必须大于0');
      return;
    }
    
    // 这里应该调用API更新订单
    toast.success(`订单 ${selectedOrderForModify.orderId} 修改成功，入住: ${modifyCheckInDate}，离店: ${modifyCheckOutDate}，房间数: ${modifyRoomCount}`);
    setShowModifyDialog(false);
    setSelectedOrderForModify(null);
  };

  // 打开简化退款对话框（按每晚退款）
  const handleOpenSimpleRefundDialog = (order: Order) => {
    setSelectedOrderForSimpleRefund(order);
    setNightlySupplierRefunds({});
    setShowSimpleRefundDialog(true);
  };

  // 确认简化退款（按每晚退款，只填供应商退款金额，其他按比例自动计算）
  const handleConfirmSimpleRefund = () => {
    if (!selectedOrderForSimpleRefund) return;
    
    const order = selectedOrderForSimpleRefund;
    const nightly = order.nightlyRates || [];
    
    // 检查是否至少有一晚设置了退款
    const refundDates = Object.keys(nightlySupplierRefunds).filter(
      date => nightlySupplierRefunds[date] && parseFloat(nightlySupplierRefunds[date]) > 0
    );
    
    if (refundDates.length === 0) {
      toast.error('请至少为一晚设置退款金额');
      return;
    }
    
    // 验证每晚退款金额
    let totalSupplierRefund = 0;
    let totalBigBRefund = 0;
    const refundDetails: string[] = [];
    
    for (const date of refundDates) {
      const refundAmount = parseFloat(nightlySupplierRefunds[date]) || 0;
      const night = nightly.find(n => n.date === date);
      if (!night) continue;
      
      if (refundAmount > night.p0) {
        toast.error(`${date} 的退款金额不能超过该晚供应商价 ¥${night.p0.toFixed(2)}`);
        return;
      }
      
      // 按比例计算大B退款
      const refundRatio = refundAmount / night.p0;
      const bigBRefund = night.p2 * refundRatio;
      
      totalSupplierRefund += refundAmount;
      totalBigBRefund += bigBRefund;
      refundDetails.push(`${date}: 供应商¥${refundAmount.toFixed(2)}, 大B¥${bigBRefund.toFixed(2)}`);
    }
    
    toast.success(`订单 ${order.orderId} 退款成功！共${refundDates.length}晚，供应商退款: ¥${totalSupplierRefund.toFixed(2)}，大B退款: ¥${totalBigBRefund.toFixed(2)}`);
    setShowSimpleRefundDialog(false);
    setSelectedOrderForSimpleRefund(null);
    setNightlySupplierRefunds({});
  };

  // 取消订单
  const handleCancelOrder = (order: Order) => {
    if (window.confirm(`确定要取消订单 ${order.orderId} 吗？`)) {
      toast.success(`订单 ${order.orderId} 已取消`);
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
    const matchesUserInfoType = filterUserInfoType === 'all' || getUserInfoTypeValue(order.partnerType) === filterUserInfoType;
    const matchesCertificationType = filterCertificationType === 'all' || order.certificationType === filterCertificationType;
    
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

    return matchesSearch && matchesOrderStatus && matchesSettlementStatus && matchesUserInfoType && matchesCertificationType &&
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
  }, [searchQuery, filterOrderStatus, filterSettlementStatus, filterUserInfoType, filterCertificationType, filterHotelName, filterPartnerName, filterCreateDateStart, filterCreateDateEnd, filterCheckInDateStart, filterCheckInDateEnd, filterOrderAmountMin, filterOrderAmountMax, filterActualAmountMin, filterActualAmountMax]);

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
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索订单号、酒店、商户、客户或入住人"
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
                      <SelectItem value="confirmed">已确认</SelectItem>
                      <SelectItem value="pending_checkin">待入住</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="settleable">可结算</SelectItem>
                      <SelectItem value="cancelled_free">已取消(免费)</SelectItem>
                      <SelectItem value="cancelled_paid">已取消(付费)</SelectItem>
                      <SelectItem value="no_show">未入住</SelectItem>
                      <SelectItem value="after_sale">售后中</SelectItem>
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
                      <SelectItem value="settleable">可结算</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="settled">已结算</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-24 flex-shrink-0">用户信息类型</Label>
                  <Select value={filterUserInfoType} onValueChange={(value: any) => setFilterUserInfoType(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="travel_agent">旅行代理</SelectItem>
                      <SelectItem value="influencer">网络博主</SelectItem>
                      <SelectItem value="app">旅游类应用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 第二行：名称筛选 */}
              <div className="grid grid-cols-3 gap-4">
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
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">商户名称</Label>
                  <Input
                    placeholder="输入商户名称或邮箱"
                    value={filterPartnerName}
                    onChange={(e) => setFilterPartnerName(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">认证方式</Label>
                  <Select value={filterCertificationType} onValueChange={(value: any) => setFilterCertificationType(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="全部认证" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部认证</SelectItem>
                      <SelectItem value="personal">个人认证</SelectItem>
                      <SelectItem value="enterprise">企业认证</SelectItem>
                    </SelectContent>
                  </Select>
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
                {(filterOrderStatus !== 'all' || filterSettlementStatus !== 'all' || filterUserInfoType !== 'all' || filterCertificationType !== 'all' ||
                  filterHotelName || filterPartnerName || filterCreateDateStart || filterCreateDateEnd ||
                  filterCheckInDateStart || filterCheckInDateEnd || filterOrderAmountMin || filterOrderAmountMax ||
                  filterActualAmountMin || filterActualAmountMax) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterOrderStatus('all');
                      setFilterSettlementStatus('all');
                      setFilterUserInfoType('all');
                      setFilterCertificationType('all');
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
                    <TableHead className="min-w-[170px]">酒店名称</TableHead>
                    <TableHead className="min-w-[120px]">房型</TableHead>
                    <TableHead className="min-w-[100px]">入住人姓名</TableHead>
                    <TableHead className="min-w-[120px]">人数</TableHead>
                    <TableHead className="min-w-[100px]">供应商价</TableHead>
                    <TableHead className="min-w-[100px]">底价</TableHead>
                    <TableHead className="min-w-[100px]">大B售价</TableHead>
                    <TableHead className="min-w-[100px]">优惠金额</TableHead>
                    <TableHead className="min-w-[100px]">实付金额</TableHead>
                    <TableHead className="min-w-[100px]">订单状态</TableHead>
                    <TableHead className="min-w-[100px]">结算状态</TableHead>
                    <TableHead className="text-right w-[140px] sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">操作</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-12 text-gray-500">
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
                          {(() => {
                            const segments: string[] = [];
                            if (order.adultCount !== undefined) {
                              segments.push(`${order.adultCount}成人`);
                            }
                            if (order.childCount !== undefined && order.childCount > 0) {
                              segments.push(`${order.childCount}儿童`);
                            }
                            return segments.length > 0 ? (
                              <span className="text-sm text-gray-700">{segments.join('/')}</span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span>{formatCurrency(order.p0_supplierCost)}</span>
                            {(() => {
                              if (!order.refundAmount || order.refundAmount <= 0) return null;
                              return <span className="text-xs text-red-600 mt-0.5">已退款{formatCurrency(order.refundAmount)}</span>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span>{formatCurrency(order.p1_platformPrice)}</span>
                            {(() => {
                              if (!order.refundAmount || order.refundAmount <= 0 || !order.p1_platformPrice) return null;
                              const refundP1 = (order.refundAmount / order.p0_supplierCost) * order.p1_platformPrice;
                              if (refundP1 <= 0) return null;
                              return <span className="text-xs text-red-600 mt-0.5">已退款{formatCurrency(refundP1)}</span>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span>{formatCurrency(order.p2_salePrice)}</span>
                            {(() => {
                              if (!order.refundAmount || order.refundAmount <= 0) return null;
                              const refundP2 = (order.refundAmount / order.p0_supplierCost) * order.p2_salePrice;
                              if (refundP2 <= 0) return null;
                              return <span className="text-xs text-red-600 mt-0.5">已退款{formatCurrency(refundP2)}</span>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-900">
                          <div className="flex flex-col">
                            <span>{formatCurrency(order.totalDiscountAmount)}</span>
                            {(() => {
                              if (!order.refundAmount || order.refundAmount <= 0 || !order.totalDiscountAmount) return null;
                              const refundDiscount = (order.refundAmount / order.p0_supplierCost) * order.totalDiscountAmount;
                              if (refundDiscount <= 0) return null;
                              return <span className="text-xs text-red-600 mt-0.5">已退款{formatCurrency(refundDiscount)}</span>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-indigo-600 font-semibold">
                          <div className="flex flex-col">
                            <span>{formatCurrency(order.actualAmount)}</span>
                            {(() => {
                              if (!order.refundAmount || order.refundAmount <= 0) return null;
                              const refundActual = (order.refundAmount / order.p0_supplierCost) * order.actualAmount;
                              if (refundActual <= 0) return null;
                              return <span className="text-xs text-red-600 mt-0.5">已退款{formatCurrency(refundActual)}</span>;
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                        <TableCell>{getSettlementStatusBadge(order.settlementStatus)}</TableCell>
                        <TableCell className="text-right sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-blue-600 hover:text-blue-700"
                              onClick={() => handleViewOrderDetail(order)}
                            >
                              查看详情
                            </Button>
                            
                            {/* 修改/退款按钮 */}
                            {(order.orderStatus !== 'cancelled_free' && order.orderStatus !== 'cancelled_paid') && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-orange-600 hover:text-orange-700"
                                onClick={() => handleOpenModifyRefundDialog(order)}
                              >
                                修改/退款
                              </Button>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>免费取消预订（支持按晚选择）</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForCancel?.orderId} | 入住日期: {selectedOrderForCancel?.checkInDate} 至 {selectedOrderForCancel?.checkOutDate} ({selectedOrderForCancel?.nights}晚)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>选择取消日期 *</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                {selectedOrderForCancel?.nightlyRates?.map((night) => (
                  <label key={night.date} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCancelDates.includes(night.date)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCancelDates([...selectedCancelDates, night.date]);
                        } else {
                          setSelectedCancelDates(selectedCancelDates.filter(d => d !== night.date));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="flex-1 text-sm">{night.date}</span>
                    <span className="text-sm text-gray-600">¥{night.p2.toFixed(2)}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                已选择 {selectedCancelDates.length} 晚，
                {selectedCancelDates.length === selectedOrderForCancel?.nights ? '全部取消' : '部分取消'}
              </p>
            </div>
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
                <strong>注意：</strong>
                {selectedCancelDates.length === selectedOrderForCancel?.nights 
                  ? '全部取消后，订单状态将变为"已取消(免费)"，订单将无法恢复。' 
                  : '部分取消后，订单将保持原状态，生成退款记录并更新订单金额。'}
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

      {/* 部分退款对话框（每晚独立设置） */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>部分退款（每晚独立设置）</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForRefund?.orderId} | 实付金额: ¥{selectedOrderForRefund ? selectedOrderForRefund.actualAmount.toFixed(2) : '0.00'} | 入住: {selectedOrderForRefund?.checkInDate} 至 {selectedOrderForRefund?.checkOutDate} ({selectedOrderForRefund?.nights}晚)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* 快速操作按钮 */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSettings: Record<string, { mode: 'fixed' | 'percentage', value: string }> = {};
                  selectedOrderForRefund?.nightlyRates?.forEach(night => {
                    newSettings[night.date] = { mode: 'fixed', value: '' };
                  });
                  setNightlyRefundSettings(newSettings);
                }}
              >
                全部按固定金额
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSettings: Record<string, { mode: 'fixed' | 'percentage', value: string }> = {};
                  selectedOrderForRefund?.nightlyRates?.forEach(night => {
                    newSettings[night.date] = { mode: 'percentage', value: '' };
                  });
                  setNightlyRefundSettings(newSettings);
                }}
              >
                全部按比例
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNightlyRefundSettings({})}
              >
                清空设置
              </Button>
            </div>

            {/* 每晚退款设置表格 */}
            <div className="space-y-2">
              <Label>每晚退款设置 *</Label>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">日期</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">实付金额</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">退款方式</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">退款金额/比例</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">预估退款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForRefund?.nightlyRates?.map((night) => {
                      const actualAmount = night.actualAmount ?? night.p2 ?? 0;
                      const setting = nightlyRefundSettings[night.date];
                      const hasRefund = setting && setting.value;
                      
                      let estimatedRefund = 0;
                      if (hasRefund) {
                        if (setting.mode === 'fixed') {
                          estimatedRefund = Math.min(parseFloat(setting.value) || 0, actualAmount);
                        } else {
                          estimatedRefund = actualAmount * ((parseFloat(setting.value) || 0) / 100);
                        }
                      }
                      
                      return (
                        <tr key={night.date} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono">{night.date}</td>
                          <td className="px-3 py-2 text-right">¥{actualAmount.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <Select
                              value={setting?.mode || ''}
                              onValueChange={(value: 'fixed' | 'percentage') => {
                                setNightlyRefundSettings(prev => ({
                                  ...prev,
                                  [night.date]: { mode: value, value: prev[night.date]?.value || '' }
                                }));
                              }}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="选择方式" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">固定金额</SelectItem>
                                <SelectItem value="percentage">比例</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2">
                            {setting && (
                              <Input
                                type="number"
                                placeholder={setting.mode === 'fixed' ? '金额' : '比例%'}
                                value={setting.value}
                                onChange={(e) => {
                                  setNightlyRefundSettings(prev => ({
                                    ...prev,
                                    [night.date]: { ...setting, value: e.target.value }
                                  }));
                                }}
                                min="0"
                                max={setting.mode === 'percentage' ? '100' : undefined}
                                step={setting.mode === 'fixed' ? '0.01' : '0.1'}
                                className="h-8 text-xs"
                              />
                            )}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-blue-600">
                            {hasRefund ? `¥${estimatedRefund.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">
                已设置 {Object.keys(nightlyRefundSettings).filter(d => nightlyRefundSettings[d].value).length} 晚
              </p>
            </div>

            {/* 总退款金额预估 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">预估总退款金额：</span>
                <span className="text-lg font-bold text-blue-700">
                  ¥{
                    (() => {
                      if (!selectedOrderForRefund) return '0.00';
                      let total = 0;
                      const nightly = selectedOrderForRefund.nightlyRates || [];
                      Object.keys(nightlyRefundSettings).forEach(date => {
                        const setting = nightlyRefundSettings[date];
                        if (!setting.value) return;
                        const night = nightly.find(n => n.date === date);
                        const actualAmount = night ? (night.actualAmount ?? night.p2 ?? 0) : 0;
                        if (setting.mode === 'fixed') {
                          total += Math.min(parseFloat(setting.value) || 0, actualAmount);
                        } else {
                          total += actualAmount * ((parseFloat(setting.value) || 0) / 100);
                        }
                      });
                      return total.toFixed(2);
                    })()
                  }
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refund-reason">退款原因 *</Label>
              <Input
                id="refund-reason"
                type="text"
                placeholder="请输入退款原因"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
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
                <strong>说明：</strong>退款后将生成退款记录，更新订单实付金额和退款金额。
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

      {/* 修改订单对话框 */}
      <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>修改订单</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForModify?.orderId} | 酒店: {selectedOrderForModify?.hotelName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modify-checkin">入住日期 *</Label>
                <Input
                  id="modify-checkin"
                  type="date"
                  value={modifyCheckInDate}
                  onChange={(e) => setModifyCheckInDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modify-checkout">离店日期 *</Label>
                <Input
                  id="modify-checkout"
                  type="date"
                  value={modifyCheckOutDate}
                  onChange={(e) => setModifyCheckOutDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modify-rooms">房间数 *</Label>
              <Input
                id="modify-rooms"
                type="number"
                min="1"
                value={modifyRoomCount}
                onChange={(e) => setModifyRoomCount(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModifyDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmModify}>
              确认修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 简化退款对话框（按每晚退款） */}
      <Dialog open={showSimpleRefundDialog} onOpenChange={setShowSimpleRefundDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>订单退款（按每晚）</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForSimpleRefund?.orderId} | 入住: {selectedOrderForSimpleRefund?.checkInDate} 至 {selectedOrderForSimpleRefund?.checkOutDate} ({selectedOrderForSimpleRefund?.nights}晚)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 每晚退款设置表格 */}
            <div className="space-y-2">
              <Label>每晚供应商退款金额 *</Label>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">日期</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">供应商价(P0)</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">底价(P1)</th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">大B售价(P2)</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700">
                        <div className="flex items-center gap-1">
                          <span>供应商退款</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="w-3 h-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>输入退款金额不能大于供应商价格</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                      <th className="px-3 py-2 text-right font-medium text-gray-700">预估退款</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForSimpleRefund?.nightlyRates?.map((night) => {
                      const refundValue = nightlySupplierRefunds[night.date] || '';
                      const refundAmount = parseFloat(refundValue) || 0;
                      const bigBRefund = refundAmount > 0 ? (night.p2 * (refundAmount / night.p0)) : 0;
                      
                      return (
                        <tr key={night.date} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono">{night.date}</td>
                          <td className="px-3 py-2 text-right">¥{night.p0.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">¥{night.p1?.toFixed(2) || '-'}</td>
                          <td className="px-3 py-2 text-right">¥{night.p2.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min="0"
                              max={night.p0}
                              step="0.01"
                              placeholder="退款金额"
                              value={refundValue}
                              onChange={(e) => {
                                const raw = parseFloat(e.target.value);
                                const safeValue = Number.isNaN(raw) ? '' : Math.min(raw, night.p0).toString();
                                setNightlySupplierRefunds(prev => ({
                                  ...prev,
                                  [night.date]: safeValue,
                                }));
                              }}
                              className="h-8 text-xs w-24"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-orange-600">
                            {refundAmount > 0 ? `¥${bigBRefund.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 退款汇总 */}
            {(() => {
              const nightly = selectedOrderForSimpleRefund?.nightlyRates || [];
              let totalSupplierRefund = 0;
              let totalBigBRefund = 0;
              
              Object.keys(nightlySupplierRefunds).forEach(date => {
                const refundAmount = parseFloat(nightlySupplierRefunds[date]) || 0;
                if (refundAmount > 0) {
                  const night = nightly.find(n => n.date === date);
                  if (night) {
                    totalSupplierRefund += refundAmount;
                    totalBigBRefund += night.p2 * (refundAmount / night.p0);
                  }
                }
              });
              
              if (totalSupplierRefund > 0) {
                return (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium text-orange-800">退款汇总：</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-700">供应商退款合计：</span>
                      <span className="font-mono font-medium">¥{totalSupplierRefund.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-700">大B退款合计：</span>
                      <span className="font-mono font-medium">¥{totalBigBRefund.toFixed(2)}</span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSimpleRefundDialog(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmSimpleRefund}>
              确认退款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 修改/退款对话框 */}
      <Dialog open={showModifyRefundDialog} onOpenChange={setShowModifyRefundDialog}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>修改订单/退款</DialogTitle>
            <DialogDescription>
              订单号: {selectedOrderForModifyRefund?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* 入住日期、离店日期、入住人数放在一行 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="modify-checkin" className="text-xs">入住日期</Label>
                <Input
                  id="modify-checkin"
                  type="date"
                  value={modifyRefundCheckInDate}
                  onChange={(e) => setModifyRefundCheckInDate(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="modify-checkout" className="text-xs">离店日期</Label>
                <Input
                  id="modify-checkout"
                  type="date"
                  value={modifyRefundCheckOutDate}
                  onChange={(e) => setModifyRefundCheckOutDate(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="modify-guest-count" className="text-xs">入住人数</Label>
                <Input
                  id="modify-guest-count"
                  type="number"
                  min="1"
                  value={modifyRefundGuestCount}
                  onChange={(e) => setModifyRefundGuestCount(parseInt(e.target.value) || 1)}
                  className="text-xs h-8"
                />
              </div>
            </div>

            {/* 供应商金额信息 */}
            <div className="space-y-1">
              <Label className="text-xs">原单供应商金额</Label>
              <div className="p-2 bg-gray-50 rounded-md border">
                <p className="text-sm font-medium">
                  ¥{selectedOrderForModifyRefund?.p0_supplierCost.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* 供应商同意退款金额 */}
            <div className="space-y-1">
              <Label htmlFor="supplier-refund-amount" className="text-xs">供应商同意退款金额</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">¥</span>
                <Input
                  id="supplier-refund-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={supplierRefundAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                      setSupplierRefundAmount(value);
                    }
                  }}
                  className="pl-8 h-9"
                />
              </div>
            </div>

            {/* 凭证截图上传 */}
            <div className="space-y-1">
              <Label htmlFor="refund-proof" className="text-xs">凭证截图</Label>
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="refund-proof" 
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  选择文件
                </label>
                <Input
                  id="refund-proof"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setRefundProofFile(file);
                    }
                  }}
                />
                <span className="text-xs text-gray-500 flex-1 truncate">
                  {refundProofFile ? refundProofFile.name : '未选择任何文件'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModifyRefundDialog(false)} className="text-sm h-8">
              取消
            </Button>
            <Button onClick={handleInitiateRefund} className="text-sm h-8">
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 二次确认退款对话框 */}
      <Dialog open={showConfirmRefundDialog} onOpenChange={setShowConfirmRefundDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">⚠️ 确认退款操作</DialogTitle>
            <DialogDescription>
              此操作不可撤销，请仔细确认！
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-red-800">您即将对以下订单进行退款：</p>
              <div className="space-y-1 text-sm text-red-700">
                <p>• 订单号：{selectedOrderForModifyRefund?.orderId}</p>
                <p>• 酒店：{selectedOrderForModifyRefund?.hotelName}</p>
                <p>• 入住时间：{modifyRefundCheckInDate} 至 {modifyRefundCheckOutDate}</p>
                <p>• 入住人数：{modifyRefundGuestCount}人</p>
                <p>• 供应商退款金额：¥{supplierRefundAmount || '0.00'}</p>
              </div>
              <p className="text-sm font-bold text-red-900 mt-3">
                请再次确认是否要执行退款操作？
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmRefundDialog(false)}>
              取消
            </Button>
            <Button onClick={handleFinalConfirmRefund} className="bg-red-600 hover:bg-red-700">
              确认退款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
