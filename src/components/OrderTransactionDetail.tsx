import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { Label } from './ui/label';
import { type OrderTransaction, type TransactionType, type PaymentChannel, type PaymentStatus } from '../data/mockBusinessDocuments';

interface OrderTransactionDetailProps {
  transaction: OrderTransaction;
  onBack: () => void;
  onViewOrder?: (orderId: string) => void;
}

export function OrderTransactionDetail({ transaction, onBack, onViewOrder }: OrderTransactionDetailProps) {
  // 交易类型标签
  const getTransactionTypeLabel = (type: TransactionType) => {
    const typeMap: Record<TransactionType, string> = {
      order_payment: '订单支付',
      order_refund: '订单退款',
      order_supplement: '订单补款',
      other: '其他',
    };
    return typeMap[type] || type;
  };

  // 支付渠道标签
  const getPaymentChannelLabel = (channel: PaymentChannel) => {
    const channelMap: Record<PaymentChannel, string> = {
      wechat: '微信支付',
      alipay: '支付宝',
      bank: '银行转账',
      other: '其他',
    };
    return channelMap[channel] || channel;
  };

  // 支付状态Badge
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const config = {
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      success: { label: '支付成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '支付失败', className: 'bg-red-50 text-red-700 border-red-300' },
      refunded: { label: '已退款', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                订单交易
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 交易基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>交易基本信息</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getPaymentStatusBadge(transaction.paymentStatus)}
                <span className="text-gray-500">交易记录ID：{transaction.transactionId}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 交易信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">交易信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易记录ID</Label>
                <p className="text-sm text-gray-900">{transaction.transactionId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联订单号</Label>
                <p className="text-sm text-gray-900">{transaction.orderId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
                <p className="text-sm text-gray-900">{transaction.relatedObjectName}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易类型</Label>
                <p className="text-sm text-gray-900">{getTransactionTypeLabel(transaction.transactionType)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易金额</Label>
                <p className={`text-sm text-gray-900 font-semibold text-lg ${transaction.transactionAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transactionAmount >= 0 ? '+' : ''}
                  ¥{Math.abs(transaction.transactionAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">支付渠道</Label>
                <p className="text-sm text-gray-900">{getPaymentChannelLabel(transaction.paymentChannel)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">支付状态</Label>
                <div>{getPaymentStatusBadge(transaction.paymentStatus)}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易时间</Label>
                <p className="text-sm text-gray-900">{transaction.transactionTime}</p>
              </div>
              {transaction.transactionNo && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易流水号</Label>
                  <p className="text-sm text-gray-900">{transaction.transactionNo}</p>
                </div>
              )}
            </div>
          </div>

          {transaction.remark && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">备注</h3>
              <p className="text-sm text-gray-900">{transaction.remark}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 关联订单信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>关联订单信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单号</Label>
              <p className="text-sm text-gray-900">{transaction.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">关联对象</Label>
              <p className="text-sm text-gray-900">{transaction.relatedObjectName}</p>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewOrder?.(transaction.orderId)}
            >
              查看订单详情
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 支付渠道信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>支付渠道信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">支付渠道</Label>
              <p className="text-sm text-gray-900">{getPaymentChannelLabel(transaction.paymentChannel)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">交易流水号</Label>
              <p className="text-sm text-gray-900">{transaction.transactionNo || '-'}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">支付状态</Label>
              <div>{getPaymentStatusBadge(transaction.paymentStatus)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作历史记录卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>操作历史记录</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <div className="text-sm font-medium">交易</div>
                <div className="text-xs text-gray-500 mt-1">{transaction.transactionTime}</div>
              </div>
              <div className="text-sm text-gray-600">系统</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

