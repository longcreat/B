import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { 
  Search,
  Eye,
  Mail,
  RefreshCw,
  FileText,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  User,
  Building2,
  Phone,
  Mail as MailIcon,
  Calendar,
  DollarSign,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMockInvoices, type Invoice, type InvoiceStatus } from '../data/mockInvoices';

export { type Invoice };

interface InvoiceManagementProps {
  onViewInvoiceDetail?: (invoice: Invoice) => void;
}

export function InvoiceManagement({ onViewInvoiceDetail }: InvoiceManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'invoice_failed' | 'invoice_success_email_failed'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showForceRefundSuccessDialog, setShowForceRefundSuccessDialog] = useState(false);
  const [showResendEmailDialog, setShowResendEmailDialog] = useState(false);

  // 筛选条件
  const [filterInvoiceId, setFilterInvoiceId] = useState('');
  const [filterApplicantName, setFilterApplicantName] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterApplyDateStart, setFilterApplyDateStart] = useState('');
  const [filterApplyDateEnd, setFilterApplyDateEnd] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');

  // 使用 mock 数据
  const invoices: Invoice[] = getMockInvoices();

  // 根据tab过滤数据
  const getFilteredInvoices = () => {
    let filtered = invoices;

    // Tab过滤
    if (activeTab === 'invoice_failed') {
      filtered = filtered.filter(inv => inv.status === 'invoice_failed');
    } else if (activeTab === 'invoice_success_email_failed') {
      filtered = filtered.filter(inv => inv.status === 'invoice_success_email_failed');
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceId.toLowerCase().includes(query) ||
        inv.applicantUserName.toLowerCase().includes(query) ||
        inv.recipientEmail.toLowerCase().includes(query) ||
        inv.invoiceTitle.toLowerCase().includes(query) ||
        (inv.invoiceCode && inv.invoiceCode.toLowerCase().includes(query)) ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(query))
      );
    }

    // 筛选条件
    if (filterInvoiceId) {
      filtered = filtered.filter(inv => inv.invoiceId.includes(filterInvoiceId));
    }
    if (filterApplicantName) {
      filtered = filtered.filter(inv => inv.applicantUserName.includes(filterApplicantName));
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }
    if (filterApplyDateStart) {
      filtered = filtered.filter(inv => inv.invoiceApplyTime >= filterApplyDateStart);
    }
    if (filterApplyDateEnd) {
      filtered = filtered.filter(inv => inv.invoiceApplyTime <= filterApplyDateEnd + ' 23:59:59');
    }
    if (filterAmountMin) {
      const min = parseFloat(filterAmountMin);
      if (!isNaN(min)) {
        filtered = filtered.filter(inv => inv.invoiceAmount >= min);
      }
    }
    if (filterAmountMax) {
      const max = parseFloat(filterAmountMax);
      if (!isNaN(max)) {
        filtered = filtered.filter(inv => inv.invoiceAmount <= max);
      }
    }

    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  // 获取状态徽章
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

  const handleViewDetail = (invoice: Invoice) => {
    if (onViewInvoiceDetail) {
      onViewInvoiceDetail(invoice);
    }
  };

  const handleConfirmRefund = () => {
    if (selectedInvoice) {
      toast.success('退票申请已提交');
      setShowRefundDialog(false);
      setSelectedInvoice(null);
    }
  };

  const handleConfirmForceRefundSuccess = () => {
    if (selectedInvoice) {
      toast.success('发票状态已更新为退票成功');
      setShowForceRefundSuccessDialog(false);
      setSelectedInvoice(null);
    }
  };

  const handleConfirmResendEmail = () => {
    if (selectedInvoice) {
      toast.success('邮件已重新发送');
      setShowResendEmailDialog(false);
      setSelectedInvoice(null);
    }
  };

  const clearAllFilters = () => {
    setFilterInvoiceId('');
    setFilterApplicantName('');
    setFilterStatus('all');
    setFilterApplyDateStart('');
    setFilterApplyDateEnd('');
    setFilterAmountMin('');
    setFilterAmountMax('');
  };

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 计算分页数据
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filterInvoiceId, filterApplicantName, filterStatus, filterApplyDateStart, filterApplyDateEnd, filterAmountMin, filterAmountMax]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* 面包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>发票管理</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>电子发票</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="invoice_failed">开票失败</TabsTrigger>
            <TabsTrigger value="invoice_success_email_failed">邮箱发送失败</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <CardContent className={showFilters ? "py-4" : "py-3"}>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索发票ID、申请方、邮箱..."
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
            </div>
            
            {/* 筛选条件 */}
            {showFilters && (
              <div className="pt-4 border-t mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">发票ID</Label>
                    <Input
                      placeholder="请输入发票ID"
                      value={filterInvoiceId}
                      onChange={(e) => setFilterInvoiceId(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">申请方</Label>
                    <Input
                      placeholder="请输入申请方名称"
                      value={filterApplicantName}
                      onChange={(e) => setFilterApplicantName(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">发票状态</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending_invoice">待开票</SelectItem>
                        <SelectItem value="invoicing">开票中</SelectItem>
                        <SelectItem value="invoice_success_email_not_sent">开票成功邮箱未发送</SelectItem>
                        <SelectItem value="invoice_success_email_sent">开票成功邮箱已发送</SelectItem>
                        <SelectItem value="invoice_success_email_failed">开票成功邮箱发送失败</SelectItem>
                        <SelectItem value="email_resending">邮箱重发中</SelectItem>
                        <SelectItem value="invoice_retrying">开票重试中</SelectItem>
                        <SelectItem value="invoice_failed">开票失败</SelectItem>
                        <SelectItem value="refund_requested">申请退票</SelectItem>
                        <SelectItem value="refunding">退票中</SelectItem>
                        <SelectItem value="refund_success">退票成功</SelectItem>
                        <SelectItem value="refund_retrying">退票重试中</SelectItem>
                        <SelectItem value="refund_failed">退票失败</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">申请时间</Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="date"
                        value={filterApplyDateStart}
                        onChange={(e) => setFilterApplyDateStart(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-gray-500">至</span>
                      <Input
                        type="date"
                        value={filterApplyDateEnd}
                        onChange={(e) => setFilterApplyDateEnd(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-20 flex-shrink-0 text-gray-700">开票金额</Label>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="number"
                        placeholder="最小金额"
                        value={filterAmountMin}
                        onChange={(e) => setFilterAmountMin(e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-gray-500">至</span>
                      <Input
                        type="number"
                        placeholder="最大金额"
                        value={filterAmountMax}
                        onChange={(e) => setFilterAmountMax(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearAllFilters}>
                    清除所有筛选
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 发票列表 */}
        <Card>
          <CardHeader>
            <CardTitle>发票列表</CardTitle>
          </CardHeader>
          <CardContent>
            <style>{`
              .invoice-table-container {
                position: relative;
              }
              .invoice-table-container table {
                min-width: 2400px !important;
                width: max-content;
              }
              .invoice-table-container table th:last-child,
              .invoice-table-container table td:last-child {
                position: sticky !important;
                right: 0 !important;
                background: white !important;
                z-index: 10 !important;
                box-shadow: -2px 0 4px rgba(0,0,0,0.05) !important;
              }
              .invoice-table-container table th:last-child {
                background: #f9fafb !important;
              }
            `}</style>
            <div className="overflow-x-auto invoice-table-container">
              <table className="w-full border-collapse" style={{ minWidth: '2400px' }}>
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky left-0 z-10" style={{ minWidth: '150px' }}>发票ID</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>发票申请方</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>开票申请时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>开票成功时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>邮箱发送时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>用户联系方式</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '100px' }}>发票内容</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>发票代码</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>发票号码</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>开票主体</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '180px' }}>接收人邮箱</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>发票抬头</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>开票金额</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '180px' }}>发票状态</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '200px' }}>异常原因</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]" style={{ minWidth: '150px' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="text-center py-12 text-gray-500">
                        暂无发票数据
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((invoice) => (
                      <tr key={invoice.invoiceId} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm sticky left-0 bg-white z-10">{invoice.invoiceId}</td>
                        <td className="p-3 text-sm">{invoice.applicantUserName}</td>
                        <td className="p-3 text-sm">{invoice.invoiceApplyTime}</td>
                        <td className="p-3 text-sm">{invoice.invoiceSuccessTime || '--'}</td>
                        <td className="p-3 text-sm">{invoice.emailSendTime || '--'}</td>
                        <td className="p-3 text-sm">{invoice.applicantUserContact}</td>
                        <td className="p-3 text-sm">{invoice.invoiceContent}</td>
                        <td className="p-3 text-sm">{invoice.invoiceCode || '--'}</td>
                        <td className="p-3 text-sm">{invoice.invoiceNumber || '--'}</td>
                        <td className="p-3 text-sm">{invoice.invoiceIssuer}</td>
                        <td className="p-3 text-sm">{invoice.recipientEmail}</td>
                        <td className="p-3 text-sm">{invoice.invoiceTitle}</td>
                        <td className="p-3 text-sm font-medium">¥{invoice.invoiceAmount.toFixed(2)}</td>
                        <td className="p-3 text-sm">{getStatusBadge(invoice.status)}</td>
                        <td className="p-3 text-sm text-red-600">{invoice.errorReason || '--'}</td>
                        <td className="p-3 text-sm">
                          <div className="flex items-center gap-1 flex-wrap">
                            {/* 详情按钮 - 所有状态都显示 */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetail(invoice)}
                              className="h-8 px-2"
                            >
                              详情
                            </Button>
                            
                            {/* 根据状态矩阵显示操作按钮 */}
                            {/* 开票成功邮箱未发送：详情、退票、重发邮件 */}
                            {invoice.status === 'invoice_success_email_not_sent' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowRefundDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  退票
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowResendEmailDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  重发邮件
                                </Button>
                              </>
                            )}
                            
                            {/* 开票成功邮箱已发送：详情、置为退票成功、退票、重发邮件 */}
                            {invoice.status === 'invoice_success_email_sent' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowForceRefundSuccessDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  置为退票成功
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowRefundDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  退票
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowResendEmailDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  重发邮件
                                </Button>
                              </>
                            )}
                            
                            {/* 开票成功邮箱发送失败：详情、退票、重发邮件 */}
                            {invoice.status === 'invoice_success_email_failed' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowRefundDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  退票
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowResendEmailDialog(true);
                                  }}
                                  className="h-8 px-2"
                                >
                                  重发邮件
                                </Button>
                              </>
                            )}
                            
                            {/* 退票中：详情、置为退票成功 */}
                            {invoice.status === 'refunding' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowForceRefundSuccessDialog(true);
                                }}
                                className="h-8 px-2"
                              >
                                置为退票成功
                              </Button>
                            )}
                            
                            {/* 退票成功：详情、重发邮件 */}
                            {invoice.status === 'refund_success' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowResendEmailDialog(true);
                                }}
                                className="h-8 px-2"
                              >
                                重发邮件
                              </Button>
                            )}
                            
                            {/* 退票重试中：详情、置为退票成功 */}
                            {invoice.status === 'refund_retrying' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowForceRefundSuccessDialog(true);
                                }}
                                className="h-8 px-2"
                              >
                                置为退票成功
                              </Button>
                            )}
                            
                            {/* 退票失败：详情、置为退票成功 */}
                            {invoice.status === 'refund_failed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowForceRefundSuccessDialog(true);
                                }}
                                className="h-8 px-2"
                              >
                                置为退票成功
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

        {/* 退票确认对话框 */}
        <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认退票</DialogTitle>
              <DialogDescription>
                确定要对发票 {selectedInvoice?.invoiceId} 申请退票吗？此操作将触发自动退票流程。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                取消
              </Button>
              <Button onClick={handleConfirmRefund}>
                确认退票
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 置为退票成功确认对话框 */}
        <Dialog open={showForceRefundSuccessDialog} onOpenChange={setShowForceRefundSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认置为退票成功</DialogTitle>
              <DialogDescription>
                确定要将发票 {selectedInvoice?.invoiceId} 的状态强制更新为"退票成功"吗？此操作需要高级财务权限。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForceRefundSuccessDialog(false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleConfirmForceRefundSuccess}>
                确认更新
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 重发邮件确认对话框 */}
        <Dialog open={showResendEmailDialog} onOpenChange={setShowResendEmailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认重发邮件</DialogTitle>
              <DialogDescription>
                确定要重新发送发票邮件到 {selectedInvoice?.recipientEmail} 吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResendEmailDialog(false)}>
                取消
              </Button>
              <Button onClick={handleConfirmResendEmail}>
                确认重发
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

