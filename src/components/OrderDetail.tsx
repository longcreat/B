import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Shield,
  UserCheck,
} from 'lucide-react';
import { type Order, type OrderStatus, type SettlementStatus } from '../data/mockOrders';
import { PricingTab } from './OrderDetail_PricingTab';

export { type Order };

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

// 订单状态历史时间轴
function OrderStatusTimeline({ order }: { order: Order }) {
  // 订单状态顺序（按生命周期）
  const statusOrder: OrderStatus[] = [
    'pending_payment',
    'pending_confirm',
    'confirmed',
    'pending_checkin',
    'completed',
    'settleable',
  ];

  // 状态配置
  const statusConfig = {
    pending_payment: {
      label: '待支付',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
    },
    pending_confirm: {
      label: '待确认',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
    },
    confirmed: {
      label: '已确认/待入住',
      icon: CheckCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
    },
    completed: {
      label: '已完成',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
    },
    pending_checkin: {
      label: '待入住',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
    },
    settleable: {
      label: '可结算',
      icon: DollarSign,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300',
    },
    cancelled_free: {
      label: '已取消(免费)',
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
    },
    cancelled_paid: {
      label: '已取消(付费)',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
    },
    no_show: {
      label: 'No-Show',
      icon: AlertTriangle,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
    },
    after_sale: {
      label: '售后中',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
    },
  };

  // 获取状态历史（如果有，否则根据当前状态推断）
  const getStatusHistory = (): { status: OrderStatus; timestamp: string; description: string }[] => {
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory.map(item => ({
        status: item.status,
        timestamp: item.timestamp,
        description: item.description || '',
      }));
    }

    // 如果没有历史记录，根据当前状态和创建时间推断
    const history: { status: OrderStatus; timestamp: string; description: string }[] = [];
    
    // 订单创建 - 待支付
    history.push({
      status: 'pending_payment',
      timestamp: order.createdAt,
      description: 'C端下单',
    });

    // 根据当前状态推断历史
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    if (currentIndex > 0) {
      // 支付成功 - 待确认
      history.push({
        status: 'pending_confirm',
        timestamp: order.createdAt,
        description: 'C端支付成功',
      });
    }
    if (currentIndex > 1) {
      // 供应商确认 - 已确认
      history.push({
        status: 'confirmed',
        timestamp: order.createdAt,
        description: '供应商确认占房',
      });
    }
    if (currentIndex > 2) {
      // 离店 - 已完成
      history.push({
        status: 'completed',
        timestamp: order.checkOutDate || order.createdAt,
        description: 'C端离店（Check-out）',
      });
    }
    if (currentIndex > 4 || order.orderStatus === 'settleable') {
      // 可结算
      history.push({
        status: 'settleable',
        timestamp: order.checkOutDate || order.createdAt,
        description: '已完成 + 售后期（T+N天）',
      });
    }

    // 处理特殊状态
    if (order.orderStatus === 'cancelled_free') {
      history.push({
        status: 'cancelled_free',
        timestamp: order.createdAt,
        description: 'C端在免费取消期内取消',
      });
    } else if (order.orderStatus === 'cancelled_paid') {
      history.push({
        status: 'cancelled_paid',
        timestamp: order.createdAt,
        description: 'C端在付费取消期内取消，产生扣损',
      });
    } else if (order.orderStatus === 'no_show') {
      history.push({
        status: 'no_show',
        timestamp: order.checkInDate || order.createdAt,
        description: 'C端未入住',
      });
    } else if (order.orderStatus === 'after_sale') {
      history.push({
        status: 'after_sale',
        timestamp: order.createdAt,
        description: 'C端发起售后',
      });
    }

    return history;
  };

  const history = getStatusHistory();
  const currentStatusIndex = statusOrder.indexOf(order.orderStatus);

  return (
    <Card className="border border-t-0 border-gray-200 rounded-t-none rounded-b-sm">
      <CardHeader className="pb-4 border-b bg-gray-50/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Clock className="w-5 h-5 text-blue-600" />
          订单状态时间轴
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative pl-2">
          {/* 时间轴线条 */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-gray-200" />
          
          <div className="space-y-8">
            {history.map((item, index) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;
              const isActive = item.status === order.orderStatus;
              const isPast = statusOrder.indexOf(item.status) <= currentStatusIndex;

              return (
                <div key={index} className="relative flex items-start gap-4">
                  {/* 状态图标 */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    isActive
                      ? `${config.bgColor} ${config.borderColor} border-2 shadow-md`
                      : isPast
                      ? 'bg-gray-100 border-gray-300 text-gray-600'
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    <Icon className={`${isActive ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  </div>

                  {/* 状态内容 */}
                  <div className="flex-1 pt-0.5 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${
                          isActive
                            ? `${config.bgColor} ${config.color} ${config.borderColor} border`
                            : isPast
                            ? 'bg-gray-50 text-gray-700 border-gray-300'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        {config.label}
                      </Badge>
                      {isActive && (
                        <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5">
                          当前状态
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-1.5 font-medium">{item.description}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderDetail({ order, onBack }: OrderDetailProps) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 面包屑和返回按钮 */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="cursor-pointer hover:text-blue-600 transition-colors">
                  订单管理
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>订单详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
        </div>

        {/* 页面标题区域 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">订单详情</h1>
              <p className="text-sm text-gray-500 font-mono">订单号: {order.orderId}</p>
            </div>
          </div>
          <div className="mt-1">
            {getOrderStatusBadge(order.orderStatus)}
          </div>
        </div>
        <Tabs defaultValue="timeline" className="w-full gap-0">
          <TabsList className="bg-white mb-6 w-full justify-start h-12 rounded-none border-b border-gray-200">
            <TabsTrigger value="timeline" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              状态时间轴
            </TabsTrigger>
            <TabsTrigger value="basic" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              基本信息
            </TabsTrigger>
            <TabsTrigger value="pricing" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              价格与利润
            </TabsTrigger>
            <TabsTrigger value="gates" className="px-6 h-full font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:font-semibold hover:text-gray-700 hover:bg-gray-50/50 rounded-t-md">
              门控状态
            </TabsTrigger>
          </TabsList>

        {/* 状态时间轴 */}
        <TabsContent value="timeline" className="mt-0">
          <OrderStatusTimeline order={order} />
        </TabsContent>

        {/* 基本信息 */}
        <TabsContent value="basic" className="mt-0">
          <Card className="border border-t-0 border-gray-200 rounded-t-none rounded-b-sm">
            <CardContent className="pt-6">
              {/* 订单基本信息 */}
              <div className="pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">订单基本信息</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
                    <p className="font-mono text-sm text-gray-900">{order.orderId}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单状态</Label>
                    <div className="mt-1">{getOrderStatusBadge(order.orderStatus)}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算状态</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={order.settlementStatus === 'settled' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}>
                        {order.settlementStatus === 'pending' ? '待结算' : order.settlementStatus === 'settleable' ? '可结算' : order.settlementStatus === 'processing' ? '处理中' : '已结算'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">创建时间</Label>
                    <p className="text-sm text-gray-900">{order.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">确认时间</Label>
                    <p className="text-sm text-gray-900">{order.confirmedAt || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">完成时间</Label>
                    <p className="text-sm text-gray-900">{order.completedAt || '-'}</p>
                  </div>
                </div>
              </div>

              
              <div className="border-t border-gray-200 pt-6 pb-6">
                {/* 酒店信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">酒店信息</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">酒店名称</Label>
                    <p className="text-sm text-gray-900">{order.hotelName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">联系方式</Label>
                    <p className="text-sm text-gray-900">{order.hotelPhone || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">酒店地址</Label>
                    <p className="text-sm text-gray-900">{order.hotelAddress}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 pb-6">
                {/* 入住信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">入住信息</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">入住日期</Label>
                    <p className="text-sm text-gray-900">{order.checkInDate}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">离店日期</Label>
                    <p className="text-sm text-gray-900">{order.checkOutDate}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">入住晚数</Label>
                    <p className="text-sm text-gray-900">{order.nights}晚</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">入住人姓名</Label>
                    <p className="text-sm text-gray-900">{order.guestName || order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">入住人数</Label>
                    <p className="text-sm text-gray-900">{order.adultCount}成人 {(order.childCount || 0) > 0 ? `${order.childCount}小孩` : ''}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">房型</Label>
                    <p className="text-sm text-gray-900">{order.roomType}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">房间数量</Label>
                    <p className="text-sm text-gray-900">{order.roomCount || 1}间</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 pb-6">
                {/* 客户信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">客户信息（下单人）</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">客户姓名</Label>
                    <p className="text-sm text-gray-900">{order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">联系电话</Label>
                    <p className="text-sm text-gray-900">{order.customerPhone}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">提醒：入住人与客户（下单人）可能不同</p>
              </div>

              <div className="border-t border-gray-200 pt-6 pb-6">
                {/* 商户信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">商户信息</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">商户名称</Label>
                    <p className="text-sm text-gray-900">{order.partnerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">商户ID</Label>
                    <p className="text-sm text-gray-900 font-mono">{order.partnerId || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">商户电话</Label>
                    <p className="text-sm text-gray-900">{order.partnerPhone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">商户邮箱</Label>
                    <p className="text-sm text-gray-900">{order.partnerEmail}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">用户信息类型</Label>
                    <div className="mt-1">{getPartnerTypeBadge(order.partnerType)}</div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">认证方式</Label>
                    <p className="text-sm text-gray-900">{order.certificationType === 'personal' ? '个人认证' : '企业认证'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">业务模式</Label>
                    <p className="text-sm text-gray-900">
                      {order.partnerBusinessModel === 'saas' ? 'SaaS' : order.partnerBusinessModel === 'mcp' ? 'MCP' : '推广联盟'}
                    </p>
                  </div>
                </div>
                {order.parentPartnerName && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">管理大B信息</h4>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <Label className="text-gray-500 text-xs font-medium mb-1.5 block">大B名称</Label>
                        <p className="text-sm text-gray-900">{order.parentPartnerName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs font-medium mb-1.5 block">用户信息类型</Label>
                        <p className="text-sm text-gray-900">{order.parentPartnerType || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs font-medium mb-1.5 block">业务模式</Label>
                        <p className="text-sm text-gray-900">{order.parentPartnerBusinessMode || '-'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 pb-6">
                {/* 风控审核信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">风控审核信息</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审核状态</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={order.riskReview?.status === 'approved' ? 'bg-green-50 text-green-700 border-green-300' : order.riskReview?.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-300' : 'bg-yellow-50 text-yellow-700 border-yellow-300'}>
                        {order.riskReview?.status === 'approved' ? '已通过' : order.riskReview?.status === 'rejected' ? '已拒绝' : '待审核'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">审核时间</Label>
                    <p className="text-sm text-gray-900">{order.riskReview?.reviewedAt || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                {/* 结算信息 */}
                <h3 className="text-base font-semibold text-gray-900 mb-4">结算信息</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算状态</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={order.settlementStatus === 'settled' ? 'bg-green-50 text-green-700 border-green-300' : 'bg-gray-50 text-gray-700 border-gray-300'}>
                        {order.settlementStatus === 'pending' ? '待结算' : order.settlementStatus === 'settleable' ? '可结算' : order.settlementStatus === 'processing' ? '处理中' : '已结算'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算时间</Label>
                    <p className="text-sm text-gray-900">{order.settlementTime || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">结算金额</Label>
                    <p className="text-sm text-gray-900 font-medium">{order.settlementAmount ? `¥${order.settlementAmount.toFixed(2)}` : '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 价格与利润 */}
        <TabsContent value="pricing" className="mt-0">
          <PricingTab order={order} />
        </TabsContent>

        {/* 门控状态 */}
        <TabsContent value="gates" className="mt-0">
          <Card className="border border-t-0 border-gray-200 rounded-t-none rounded-b-sm">
            <CardContent className="pt-6">
              <div className="pb-6 mb-6 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-1">五重门控状态</h3>
                <p className="text-sm text-gray-500">
                  订单进入可结算状态，必须依次通过以下门控
                </p>
              </div>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  order.gates.serviceCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getGateIcon(order.gates.serviceCompleted)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-semibold text-gray-900">Gate 1: 服务已完成</Label>
                      <p className="text-xs text-gray-500 mt-1">离店日期 &lt; T(今日)</p>
                    </div>
                  </div>
                  <Badge variant={order.gates.serviceCompleted ? 'default' : 'secondary'} className="flex-shrink-0">
                    {order.gates.serviceCompleted ? '已通过' : '未通过'}
                  </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  order.gates.coolingOffPassed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getGateIcon(order.gates.coolingOffPassed)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-semibold text-gray-900">Gate 2: 冻结期已过</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        T(今日) - 离店日期 &gt; 结算冻结期天数 (建议7-15天)
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.gates.coolingOffPassed ? 'default' : 'secondary'} className="flex-shrink-0">
                    {order.gates.coolingOffPassed ? '已通过' : '未通过'}
                  </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  order.gates.noDispute
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getGateIcon(order.gates.noDispute)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-semibold text-gray-900">Gate 3: 订单无未决争议</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        订单状态不处于争议中、退款处理中等异常挂起状态
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.gates.noDispute ? 'default' : 'secondary'} className="flex-shrink-0">
                    {order.gates.noDispute ? '已通过' : '未通过'}
                  </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  order.gates.costReconciled
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getGateIcon(order.gates.costReconciled)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-semibold text-gray-900">Gate 4: 供应商成本已对账</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        订单的P0已与上游供应商账单核对并标记为已对账（核心风控）
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.gates.costReconciled ? 'default' : 'secondary'} className="flex-shrink-0">
                    {order.gates.costReconciled ? '已通过' : '未通过'}
                  </Badge>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  order.gates.accountHealthy
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getGateIcon(order.gates.accountHealthy)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label className="text-sm font-semibold text-gray-900">Gate 5: 结算对象状态正常</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        小B/供应商的账户结算状态为活跃，未被冻结或关闭
                      </p>
                    </div>
                  </div>
                  <Badge variant={order.gates.accountHealthy ? 'default' : 'secondary'} className="flex-shrink-0">
                    {order.gates.accountHealthy ? '已通过' : '未通过'}
                  </Badge>
                </div>
              </div>

              {/* 门控汇总 */}
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-blue-900 font-semibold text-sm">门控通过情况</Label>
                    <p className="text-sm text-blue-700 mt-1.5 font-medium">
                      已通过 <span className="text-blue-900 font-bold">{Object.values(order.gates).filter(Boolean).length}</span> / <span className="text-blue-900 font-bold">{Object.keys(order.gates).length}</span> 个门控
                    </p>
                  </div>
                  {Object.values(order.gates).every(Boolean) ? (
                    <Badge className="bg-green-600 text-white font-medium px-3 py-1">
                      全部通过
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 font-medium px-3 py-1">
                      未全部通过
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

