import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronDown, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Order {
  orderId: string;
  checkOutDate: string;
  supplierAmount: number;
  supplierName: string;
}

interface SupplierBill {
  supplierName: string;
  orders: Order[];
  totalSupplierPayable: number;
  isPaid: boolean;
  paidAt?: string;
  transactionNumber?: string;
}

interface MonthlyBill {
  month: string;
  suppliers: SupplierBill[];
  totalSupplierPayable: number;
}

export function MonthlyReconciliation() {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set());
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{ month: string; supplierName: string } | null>(null);
  const [paymentTime, setPaymentTime] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [paidSuppliers, setPaidSuppliers] = useState<Map<string, { paidAt: string; transactionNumber: string }>>(new Map());

  // Mock订单数据 - 按离店日期分组
  const mockOrders: Order[] = [
    { orderId: 'ORD-2025001', checkOutDate: '2025-01-15', supplierAmount: 1200.50, supplierName: '道旅' },
    { orderId: 'ORD-2025002', checkOutDate: '2025-01-20', supplierAmount: 900.00, supplierName: '携程' },
    { orderId: 'ORD-2025003', checkOutDate: '2025-01-28', supplierAmount: 800.75, supplierName: '道旅' },
    { orderId: 'ORD-2025004', checkOutDate: '2025-02-05', supplierAmount: 1500.00, supplierName: '携程' },
    { orderId: 'ORD-2025005', checkOutDate: '2025-02-12', supplierAmount: 1100.25, supplierName: '道旅' },
    { orderId: 'ORD-2025006', checkOutDate: '2025-02-25', supplierAmount: 950.50, supplierName: '携程' },
    { orderId: 'ORD-2025007', checkOutDate: '2025-03-08', supplierAmount: 1300.00, supplierName: '道旅' },
    { orderId: 'ORD-2025008', checkOutDate: '2025-03-15', supplierAmount: 880.00, supplierName: '携程' },
  ];

  // 按月份和供应商归集订单
  const monthlyBills = useMemo(() => {
    const billsMap = new Map<string, Map<string, Order[]>>();

    mockOrders.forEach(order => {
      const month = order.checkOutDate.substring(0, 7); // 提取 YYYY-MM
      if (!billsMap.has(month)) {
        billsMap.set(month, new Map<string, Order[]>());
      }
      const monthMap = billsMap.get(month)!;
      if (!monthMap.has(order.supplierName)) {
        monthMap.set(order.supplierName, []);
      }
      monthMap.get(order.supplierName)!.push(order);
    });

    const bills: MonthlyBill[] = [];
    billsMap.forEach((supplierMap, month) => {
      const suppliers: SupplierBill[] = [];
      let monthTotal = 0;

      supplierMap.forEach((orders, supplierName) => {
        const totalSupplierPayable = orders.reduce((sum, order) => sum + order.supplierAmount, 0);
        monthTotal += totalSupplierPayable;
        
        const key = `${month}-${supplierName}`;
        const paymentInfo = paidSuppliers.get(key);
        
        suppliers.push({
          supplierName,
          orders,
          totalSupplierPayable,
          isPaid: !!paymentInfo,
          paidAt: paymentInfo?.paidAt,
          transactionNumber: paymentInfo?.transactionNumber,
        });
      });

      // 按供应商名称排序
      suppliers.sort((a, b) => a.supplierName.localeCompare(b.supplierName));

      bills.push({
        month,
        suppliers,
        totalSupplierPayable: monthTotal,
      });
    });

    // 按月份倒序排列
    bills.sort((a, b) => b.month.localeCompare(a.month));

    return bills;
  }, [paidSuppliers]);

  const toggleMonth = (month: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const toggleSupplier = (key: string) => {
    const newExpanded = new Set(expandedSuppliers);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSuppliers(newExpanded);
  };

  const handlePaymentClick = (month: string, supplierName: string) => {
    setSelectedSupplier({ month, supplierName });
    setPaymentTime('');
    setTransactionNumber('');
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    if (!paymentTime || !transactionNumber) {
      toast.error('请填写打款时间和流水号');
      return;
    }

    if (!selectedSupplier) return;

    const key = `${selectedSupplier.month}-${selectedSupplier.supplierName}`;
    const newPaidSuppliers = new Map(paidSuppliers);
    newPaidSuppliers.set(key, {
      paidAt: paymentTime,
      transactionNumber,
    });
    setPaidSuppliers(newPaidSuppliers);

    toast.success('账单支付完成');
    setShowPaymentDialog(false);
    setSelectedSupplier(null);
    setPaymentTime('');
    setTransactionNumber('');
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    return `${year}年${monthNum}月`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>对账管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">对账管理</h1>
          <p className="text-sm text-gray-600 mt-1">按月份和供应商维度归集订单账单，展示供应商应付款总计</p>
        </div>
        <FileText className="w-8 h-8 text-blue-500" />
      </div>

      {/* 月度账单列表 */}
      <Card>
        <CardHeader>
          <CardTitle>月度账单汇总</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyBills.map((bill) => {
              const isExpanded = expandedMonths.has(bill.month);
              
              return (
                <div key={bill.month} className="border rounded-lg overflow-hidden">
                  {/* 月份汇总行 */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => toggleMonth(bill.month)}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {formatMonth(bill.month)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {bill.suppliers.length} 个供应商
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">本月应付款总计</p>
                      <p className="text-xl font-bold text-purple-600">
                        ¥{bill.totalSupplierPayable.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* 供应商维度账单 */}
                  {isExpanded && (
                    <div className="border-t">
                      {bill.suppliers.map((supplier) => {
                        const supplierKey = `${bill.month}-${supplier.supplierName}`;
                        const isSupplierExpanded = expandedSuppliers.has(supplierKey);
                        
                        return (
                          <div key={supplierKey} className="border-b last:border-b-0">
                            {/* 供应商汇总行 */}
                            <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                              <div 
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => toggleSupplier(supplierKey)}
                              >
                                {isSupplierExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900">{supplier.supplierName}</h4>
                                    {supplier.isPaid && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        已支付
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    共 {supplier.orders.length} 笔订单
                                    {supplier.isPaid && supplier.paidAt && (
                                      <span className="ml-2">• 打款时间: {supplier.paidAt}</span>
                                    )}
                                    {supplier.isPaid && supplier.transactionNumber && (
                                      <span className="ml-2">• 流水号: {supplier.transactionNumber}</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">应付款</p>
                                  <p className="text-lg font-bold text-purple-600">
                                    ¥{supplier.totalSupplierPayable.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </p>
                                </div>
                                {!supplier.isPaid && (
                                  <Button
                                    size="sm"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      handlePaymentClick(bill.month, supplier.supplierName);
                                    }}
                                  >
                                    完成账单支付
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* 订单明细 */}
                            {isSupplierExpanded && (
                              <div className="bg-gray-50">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>订单号</TableHead>
                                      <TableHead>离店日期</TableHead>
                                      <TableHead className="text-right">供应商金额</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {supplier.orders.map((order) => (
                                      <TableRow key={order.orderId}>
                                        <TableCell className="font-medium">
                                          <Badge variant="outline">{order.orderId}</Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                          {order.checkOutDate}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-purple-600">
                                          ¥{order.supplierAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {monthlyBills.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>暂无账单数据</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 支付确认对话框 */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>完成账单支付</DialogTitle>
            <DialogDescription>
              请输入打款时间和流水号以确认支付
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedSupplier && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">月份:</span>
                  <span className="font-medium">{formatMonth(selectedSupplier.month)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">供应商:</span>
                  <span className="font-medium">{selectedSupplier.supplierName}</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="payment-time">打款时间 *</Label>
              <Input
                id="payment-time"
                type="datetime-local"
                value={paymentTime}
                onChange={(e) => setPaymentTime(e.target.value)}
                placeholder="选择打款时间"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-number">流水号 *</Label>
              <Input
                id="transaction-number"
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                placeholder="请输入银行流水号"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              取消
            </Button>
            <Button onClick={handlePaymentSubmit}>
              确认支付
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
