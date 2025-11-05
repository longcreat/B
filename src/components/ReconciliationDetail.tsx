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
  ArrowLeft,
  ExternalLink,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import type { 
  Reconciliation, 
  SupplierCostReconciliation,
  PaymentChannelReconciliation,
  WithdrawalReconciliation,
  InvoiceReconciliation,
} from '../data/mockReconciliations';

export { type Reconciliation };

interface ReconciliationDetailProps {
  reconciliation: Reconciliation;
  onBack: () => void;
  onViewOrderDetail?: (orderId: string) => void;
}

export function ReconciliationDetail({ reconciliation, onBack, onViewOrderDetail }: ReconciliationDetailProps) {
  const [showResolveDialog, setShowResolveDialog] = React.useState(false);
  const [resolutionText, setResolutionText] = React.useState('');

  const handleResolve = () => {
    if (!resolutionText.trim()) {
      toast.error('请填写处理结果');
      return;
    }
    // TODO: 调用API处理差异
    toast.success('差异已处理');
    setShowResolveDialog(false);
    setResolutionText('');
  };

  // 判断是否应该显示"处理差异"按钮
  const shouldShowResolveButton = (): boolean => {
    if (reconciliation.type === 'supplier_cost') {
      return reconciliation.status === 'difference';
    } else if (reconciliation.type === 'payment_channel') {
      return reconciliation.status === 'platform_more' || reconciliation.status === 'channel_more';
    } else if (reconciliation.type === 'withdrawal') {
      return reconciliation.status === 'withdrawal_more' || reconciliation.status === 'account_more';
    } else if (reconciliation.type === 'invoice') {
      return reconciliation.status === 'invoice_more' || reconciliation.status === 'cost_more';
    }
    return false;
  };
  const getStatusBadge = (reconciliation: Reconciliation) => {
    if (reconciliation.type === 'supplier_cost') {
      const config: Record<string, { label: string; className: string }> = {
        pending: { label: '未对账', className: 'bg-gray-50 text-gray-700 border-gray-300' },
        reconciling: { label: '对账中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
        reconciled: { label: '已对账', className: 'bg-green-50 text-green-700 border-green-300' },
        difference: { label: '对账差异', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.pending;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'payment_channel') {
      const config: Record<string, { label: string; className: string }> = {
        reconciling: { label: '对账中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        platform_more: { label: '平台多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        channel_more: { label: '渠道多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.reconciling;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'withdrawal') {
      const config: Record<string, { label: string; className: string }> = {
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        withdrawal_more: { label: '打款多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        account_more: { label: '账本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.balanced;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    } else if (reconciliation.type === 'invoice') {
      const config: Record<string, { label: string; className: string }> = {
        balanced: { label: '已对平', className: 'bg-green-50 text-green-700 border-green-300' },
        invoice_more: { label: '开票多', className: 'bg-orange-50 text-orange-700 border-orange-300' },
        cost_more: { label: '成本多', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
        resolved: { label: '已处理', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      };
      const { label, className } = config[reconciliation.status] || config.balanced;
      return <Badge variant="outline" className={className}>{label}</Badge>;
    }
    return null;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      supplier_cost: '供应商成本对账',
      payment_channel: '支付渠道对账',
      withdrawal: '提现对账',
      invoice: '开票对账',
    };
    return labels[type] || type;
  };

  const renderSupplierCostDetail = (reconciliation: SupplierCostReconciliation) => {
    return (
      <>
        <div className="pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">订单信息</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">订单ID</Label>
              <p className="text-sm text-gray-900 font-medium">{reconciliation.orderId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">供应商名称</Label>
              <p className="text-sm text-gray-900">{reconciliation.supplierName}</p>
            </div>
            {reconciliation.supplierBillNo && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">供应商账单编号</Label>
                <p className="text-sm text-gray-900">{reconciliation.supplierBillNo}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">对账信息</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">系统P0（供应商底价）</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.systemP0.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">供应商账单金额</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.supplierBillAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异金额</Label>
              <p className={`text-sm font-semibold ${reconciliation.difference !== 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {reconciliation.difference !== 0 ? (reconciliation.difference > 0 ? '+' : '') : ''}
                ¥{reconciliation.difference.toFixed(2)}
              </p>
            </div>
            {reconciliation.reconciledAt && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账时间</Label>
                <p className="text-sm text-gray-900">{reconciliation.reconciledAt}</p>
              </div>
            )}
            {reconciliation.reconciledBy && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账人</Label>
                <p className="text-sm text-gray-900">{reconciliation.reconciledBy}</p>
              </div>
            )}
          </div>
        </div>

        {(reconciliation.type === 'supplier_cost' && reconciliation.status === 'difference') && (
          <div className="border-t border-gray-200 pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">差异信息</h3>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                处理差异
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              {reconciliation.differenceReason && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异原因</Label>
                  <p className="text-sm text-orange-600">{reconciliation.differenceReason}</p>
                </div>
              )}
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">差异追溯建议</p>
                  <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                    <li>检查订单详情中的价格信息，确认系统P0是否正确</li>
                    <li>联系供应商核对账单编号 {reconciliation.supplierBillNo} 的明细</li>
                    <li>确认是否存在未记录的附加费用（如服务费、税费等）</li>
                    <li>如确认无误，更新系统P0记录</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {reconciliation.status === 'resolved' && (
          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">处理信息</h3>
            <div className="grid grid-cols-2 gap-6">
              {reconciliation.resolution && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">处理结果</Label>
                  <p className="text-sm text-gray-900">{reconciliation.resolution}</p>
                </div>
              )}
              {reconciliation.resolvedAt && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">处理时间</Label>
                  <p className="text-sm text-gray-900">{reconciliation.resolvedAt}</p>
                </div>
              )}
              {reconciliation.resolvedBy && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">处理人</Label>
                  <p className="text-sm text-gray-900">{reconciliation.resolvedBy}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderPaymentChannelDetail = (reconciliation: PaymentChannelReconciliation) => {
    const channelLabels: Record<string, string> = {
      wechat: '微信支付',
      alipay: '支付宝',
      bank: '银行',
    };

    const getDifferenceTypeLabel = (type: string) => {
      const labels: Record<string, string> = {
        platform_only: '平台独有',
        channel_only: '渠道独有',
        amount_diff: '金额差异',
      };
      return labels[type] || type;
    };

    return (
      <>
        <div className="pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">对账基本信息</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账日期</Label>
              <p className="text-sm text-gray-900 font-medium">{reconciliation.reconciliationDate}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">支付渠道</Label>
              <p className="text-sm text-gray-900">{channelLabels[reconciliation.channel]}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">对账汇总</h3>
            {shouldShowResolveButton() && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                处理差异
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">平台订单数</Label>
              <p className="text-sm text-gray-900">{reconciliation.platformOrderCount} 笔</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">平台订单金额</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.platformOrderAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">渠道订单数</Label>
              <p className="text-sm text-gray-900">{reconciliation.channelOrderCount} 笔</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">渠道实际金额</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.channelOrderAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异金额</Label>
              <p className={`text-sm font-semibold ${reconciliation.differenceAmount !== 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {reconciliation.differenceAmount !== 0 ? (reconciliation.platformOrderAmount > reconciliation.channelOrderAmount ? '+' : '') : ''}
                ¥{reconciliation.differenceAmount.toFixed(2)}
              </p>
            </div>
            {reconciliation.differenceOrderCount > 0 && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异订单数</Label>
                <p className="text-sm text-orange-600">{reconciliation.differenceOrderCount} 笔</p>
              </div>
            )}
            {reconciliation.reconciledAt && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账时间</Label>
                <p className="text-sm text-gray-900">{reconciliation.reconciledAt}</p>
              </div>
            )}
          </div>
        </div>

        {/* 差异订单明细 */}
        {((reconciliation.status === 'platform_more' || reconciliation.status === 'channel_more') && reconciliation.differenceOrders && reconciliation.differenceOrders.length > 0) && (
          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">差异订单明细</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">差异追溯建议</p>
                  <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                    <li>平台独有订单：检查订单是否已支付，确认支付渠道是否匹配</li>
                    <li>渠道独有订单：检查是否有遗漏的订单记录，需要补充到平台</li>
                    <li>金额差异订单：核对订单金额是否正确，检查是否有退款或部分退款</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ minWidth: '150px' }}>订单ID</TableHead>
                    <TableHead style={{ minWidth: '120px' }}>差异类型</TableHead>
                    <TableHead style={{ minWidth: '120px' }}>平台金额</TableHead>
                    <TableHead style={{ minWidth: '120px' }}>渠道金额</TableHead>
                    <TableHead style={{ minWidth: '120px' }}>差异金额</TableHead>
                    <TableHead style={{ minWidth: '150px' }}>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliation.differenceOrders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          order.type === 'platform_only' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                          order.type === 'channel_only' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                          'bg-orange-50 text-orange-700 border-orange-300'
                        }>
                          {getDifferenceTypeLabel(order.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.platformAmount ? `¥${order.platformAmount.toFixed(2)}` : '--'}</TableCell>
                      <TableCell>{order.channelAmount ? `¥${order.channelAmount.toFixed(2)}` : '--'}</TableCell>
                      <TableCell className={order.difference !== 0 ? 'text-orange-600 font-medium' : ''}>
                        {order.difference !== 0 ? (order.difference > 0 ? '+' : '') : ''}
                        {order.difference !== 0 ? `¥${order.difference.toFixed(2)}` : '--'}
                      </TableCell>
                      <TableCell>
                        {onViewOrderDetail && order.orderId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewOrderDetail(order.orderId)}
                            className="h-8 px-2"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            查看订单
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderWithdrawalDetail = (reconciliation: WithdrawalReconciliation) => {
    return (
      <>
        <div className="pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">对账基本信息</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账月份</Label>
              <p className="text-sm text-gray-900 font-medium">{reconciliation.reconciliationMonth}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">B端用户ID</Label>
              <p className="text-sm text-gray-900">{reconciliation.partnerId}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">B端用户名称</Label>
              <p className="text-sm text-gray-900">{reconciliation.partnerName}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">对账汇总</h3>
            {shouldShowResolveButton() && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                处理差异
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现打款总额</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.withdrawalAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">账本扣减总额</Label>
              <p className="text-sm text-gray-900 font-semibold">¥{reconciliation.accountDeductionAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异金额</Label>
              <p className={`text-sm font-semibold ${reconciliation.differenceAmount !== 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {reconciliation.differenceAmount !== 0 ? (reconciliation.withdrawalAmount > reconciliation.accountDeductionAmount ? '+' : '') : ''}
                ¥{reconciliation.differenceAmount.toFixed(2)}
              </p>
            </div>
            {reconciliation.reconciledAt && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账时间</Label>
                <p className="text-sm text-gray-900">{reconciliation.reconciledAt}</p>
              </div>
            )}
          </div>
        </div>

        {/* 明细列表（有差异时显示） */}
        {((reconciliation.status === 'withdrawal_more' || reconciliation.status === 'account_more') && (reconciliation.withdrawalRecords || reconciliation.accountDeductions)) && (
          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">明细列表</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">差异追溯建议</p>
                  <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                    <li>核对打款记录与账本扣减记录，确认每笔金额是否匹配</li>
                    <li>检查是否有重复扣减或遗漏扣减的情况</li>
                    <li>确认提现记录和账本扣减的时间顺序是否合理</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {reconciliation.withdrawalRecords && reconciliation.withdrawalRecords.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">打款记录</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>流水号</TableHead>
                        <TableHead>打款金额</TableHead>
                        <TableHead>打款时间</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliation.withdrawalRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.withdrawalId}</TableCell>
                          <TableCell>¥{record.amount.toFixed(2)}</TableCell>
                          <TableCell>{record.createdAt}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              {record.status === 'success' ? '成功' : record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {reconciliation.accountDeductions && reconciliation.accountDeductions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">账本扣减记录</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单ID</TableHead>
                        <TableHead>扣减金额</TableHead>
                        <TableHead>扣减时间</TableHead>
                        <TableHead>订单状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliation.accountDeductions.map((deduction, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{deduction.orderId}</TableCell>
                          <TableCell>¥{deduction.amount.toFixed(2)}</TableCell>
                          <TableCell>{deduction.deductedAt}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{deduction.orderStatus}</Badge>
                          </TableCell>
                          <TableCell>
                            {onViewOrderDetail && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewOrderDetail(deduction.orderId)}
                                className="h-8 px-2"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                查看订单
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderInvoiceDetail = (reconciliation: InvoiceReconciliation) => {
    return (
      <>
        <div className="pb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">对账基本信息</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账月份</Label>
              <p className="text-sm text-gray-900 font-medium">{reconciliation.reconciliationMonth}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">对账汇总</h3>
            {shouldShowResolveButton() && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowResolveDialog(true)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                处理差异
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">C端开票总额</Label>
              <p className="text-sm text-gray-900 font-semibold text-lg">¥{reconciliation.customerInvoiceAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">成本+利润总额</Label>
              <p className="text-sm text-gray-900 font-semibold text-lg">¥{reconciliation.totalCostProfit.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">供应商成本总额</Label>
              <p className="text-sm text-gray-900">¥{reconciliation.supplierCostAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">B端利润总额</Label>
              <p className="text-sm text-gray-900">¥{reconciliation.partnerProfitAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">平台利润总额</Label>
              <p className="text-sm text-gray-900">¥{reconciliation.platformProfitAmount.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-gray-500 text-xs font-medium mb-1.5 block">差异金额</Label>
              <p className={`text-sm font-semibold ${reconciliation.differenceAmount !== 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {reconciliation.differenceAmount !== 0 ? (reconciliation.customerInvoiceAmount > reconciliation.totalCostProfit ? '+' : '') : ''}
                ¥{reconciliation.differenceAmount.toFixed(2)}
              </p>
            </div>
            {reconciliation.reconciledAt && (
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">对账时间</Label>
                <p className="text-sm text-gray-900">{reconciliation.reconciledAt}</p>
              </div>
            )}
          </div>
        </div>

        {/* 明细列表（有差异时显示） */}
        {((reconciliation.status === 'invoice_more' || reconciliation.status === 'cost_more') && (reconciliation.invoiceDetails || reconciliation.costProfitDetails)) && (
          <div className="border-t border-gray-200 pt-6 pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">明细列表</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">差异追溯建议</p>
                  <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                    <li>核对C端开票明细与成本/利润明细，确认每笔金额是否匹配</li>
                    <li>检查是否有遗漏的开票或成本/利润记录</li>
                    <li>确认开票时间和订单完成时间是否在合理范围内</li>
                  </ul>
                </div>
              </div>
            </div>

            {reconciliation.invoiceDetails && reconciliation.invoiceDetails.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">C端开票明细</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>发票ID</TableHead>
                        <TableHead>开票金额</TableHead>
                        <TableHead>开票时间</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliation.invoiceDetails.map((invoice, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                          <TableCell>¥{invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>{invoice.invoiceTime}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{invoice.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {reconciliation.costProfitDetails && reconciliation.costProfitDetails.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">成本/利润明细</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单ID</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>订单时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reconciliation.costProfitDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{detail.orderId}</TableCell>
                          <TableCell>¥{detail.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {detail.type === 'supplier_cost' ? '供应商成本' :
                               detail.type === 'partner_profit' ? 'B端利润' :
                               '平台利润'}
                            </Badge>
                          </TableCell>
                          <TableCell>{detail.orderTime}</TableCell>
                          <TableCell>
                            {onViewOrderDetail && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewOrderDetail(detail.orderId)}
                                className="h-8 px-2"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                查看订单
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                对账管理
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">对账详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>对账详情</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(reconciliation)}
                <span className="text-gray-500">{getTypeLabel(reconciliation.type)}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {reconciliation.type === 'supplier_cost' && renderSupplierCostDetail(reconciliation as SupplierCostReconciliation)}
          {reconciliation.type === 'payment_channel' && renderPaymentChannelDetail(reconciliation as PaymentChannelReconciliation)}
          {reconciliation.type === 'withdrawal' && renderWithdrawalDetail(reconciliation as WithdrawalReconciliation)}
          {reconciliation.type === 'invoice' && renderInvoiceDetail(reconciliation as InvoiceReconciliation)}
        </CardContent>
      </Card>

      {/* 处理差异对话框 */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>处理差异</DialogTitle>
            <DialogDescription>
              请填写差异处理结果，处理完成后该对账记录将标记为"已处理"状态。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">处理结果</Label>
              <Textarea
                placeholder="请详细说明差异的原因和处理方式，例如：已与供应商确认，补充记录；已联系支付渠道，确认为延迟到账等..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowResolveDialog(false);
              setResolutionText('');
            }}>
              取消
            </Button>
            <Button onClick={handleResolve}>
              确认处理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

