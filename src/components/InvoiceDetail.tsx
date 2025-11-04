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
import {
  CheckCircle2,
  Mail,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import type { Invoice, InvoiceStatus } from '../data/mockInvoices';

export { type Invoice };

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
}

export function InvoiceDetail({ invoice, onBack }: InvoiceDetailProps) {
  const getStatusBadge = (status: InvoiceStatus) => {
    const config: Record<InvoiceStatus, { label: string; className: string }> = {
      pending_invoice: { label: '待开票', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      invoicing: { label: '开票中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      invoice_success_email_not_sent: { label: '开票成功邮箱未发送', className: 'bg-green-50 text-green-700 border-green-300' },
      invoice_success_email_sent: { label: '开票成功邮箱已发送', className: 'bg-green-100 text-green-800 border-green-400' },
      invoice_success_email_failed: { label: '开票成功邮箱发送失败', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      email_resending: { label: '邮箱重发中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      invoice_retrying: { label: '开票重试中', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      invoice_failed: { label: '开票失败', className: 'bg-red-50 text-red-700 border-red-300' },
      refund_requested: { label: '申请退票', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      refunding: { label: '退票中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      refund_success: { label: '退票成功', className: 'bg-green-50 text-green-700 border-green-300' },
      refund_retrying: { label: '退票重试中', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      refund_failed: { label: '退票失败', className: 'bg-red-50 text-red-700 border-red-300' },
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
                发票管理
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">发票详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>发票详情</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(invoice.status)}
                <span className="text-gray-500">发票ID：{invoice.invoiceId}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 用户信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">用户信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">申请方</Label>
                <p className="text-sm text-gray-900">{invoice.applicantUserName}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">联系方式</Label>
                <p className="text-sm text-gray-900">{invoice.applicantUserContact}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            {/* 发票信息 */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">发票信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票类型</Label>
                <p className="text-sm text-gray-900">{invoice.invoiceType === 'electronic' ? '电子发票' : invoice.invoiceType}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票抬头</Label>
                <p className="text-sm text-gray-900 font-medium">{invoice.invoiceTitle}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票税号</Label>
                <p className="text-sm text-gray-900">{invoice.taxNumber || '--'}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票内容</Label>
                <p className="text-sm text-gray-900">{invoice.invoiceContent}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg">¥{invoice.invoiceAmount.toFixed(2)}</p>
              </div>
              {invoice.invoiceCode && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票代码</Label>
                  <p className="text-sm text-gray-900">{invoice.invoiceCode}</p>
                </div>
              )}
              {invoice.invoiceNumber && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">发票号码</Label>
                  <p className="text-sm text-gray-900">{invoice.invoiceNumber}</p>
                </div>
              )}
              {invoice.registeredAddress && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">注册地址</Label>
                  <p className="text-sm text-gray-900">{invoice.registeredAddress}</p>
                </div>
              )}
              {invoice.registeredPhone && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">注册电话</Label>
                  <p className="text-sm text-gray-900">{invoice.registeredPhone}</p>
                </div>
              )}
              {invoice.bankName && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">开户银行</Label>
                  <p className="text-sm text-gray-900">{invoice.bankName}</p>
                </div>
              )}
              {invoice.bankAccount && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">银行账号</Label>
                  <p className="text-sm text-gray-900">{invoice.bankAccount}</p>
                </div>
              )}
              {invoice.remark && (
                <div className="col-span-2">
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">备注说明</Label>
                  <p className="text-sm text-gray-900">{invoice.remark}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            {/* 收件邮箱 */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">收件邮箱</h3>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{invoice.recipientEmail}</span>
            </div>
          </div>

          {/* 发票轨迹 */}
          {invoice.trajectory && invoice.trajectory.length > 0 && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">发票轨迹</h3>
              <div className="space-y-4">
                {invoice.trajectory.map((traj, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === invoice.trajectory!.length - 1 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      {index < invoice.trajectory!.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span>{getStatusBadge(traj.status)}</span>
                        <span className="text-sm text-gray-500">{traj.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{traj.description}</p>
                      {traj.operator && (
                        <p className="text-xs text-gray-500 mt-1">操作人：{traj.operator}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 订单信息 */}
          {invoice.orders && invoice.orders.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                订单信息
                <span className="ml-2 text-sm font-normal text-gray-600">
                  {invoice.orders.length} 笔订单，共 ¥{invoice.orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}元
                </span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">订单ID</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">酒店名称</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">订单金额</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.orders.map((order) => (
                      <tr key={order.orderId} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{order.orderId}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{order.hotelName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">¥{order.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{order.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

