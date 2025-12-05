import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Filter, Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

// 提现申请状态
export type WithdrawalApplicationStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';

// 打款状态
export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

// 大B类型
export type PartnerType = 'individual' | 'enterprise';

// 提现申请
export interface WithdrawalApplication {
  applicationId: string;
  partnerName: string;
  partnerType: PartnerType;
  applicationTime: string;
  amount: number;
  applicationStatus: WithdrawalApplicationStatus;
  paymentStatus: PaymentStatus;
  invoiceUrl?: string; // 电子发票附件URL（仅企业类型）
  processedTime?: string;
  rejectReason?: string;
}

interface WithdrawalProcessingProps {
  applications?: WithdrawalApplication[];
}

// Mock数据
const mockApplications: WithdrawalApplication[] = [
  {
    applicationId: 'WA-2025001',
    partnerName: '华东渠道A',
    partnerType: 'enterprise',
    applicationTime: '2025-12-05 10:30:00',
    amount: 50000,
    applicationStatus: 'pending',
    paymentStatus: 'unpaid',
    invoiceUrl: '/invoices/WA-2025001.pdf',
  },
  {
    applicationId: 'WA-2025002',
    partnerName: '张三',
    partnerType: 'individual',
    applicationTime: '2025-12-04 14:20:00',
    amount: 15000,
    applicationStatus: 'approved',
    paymentStatus: 'unpaid',
  },
  {
    applicationId: 'WA-2025003',
    partnerName: '北京科技有限公司',
    partnerType: 'enterprise',
    applicationTime: '2025-12-03 09:15:00',
    amount: 80000,
    applicationStatus: 'completed',
    paymentStatus: 'paid',
    invoiceUrl: '/invoices/WA-2025003.pdf',
    processedTime: '2025-12-03 16:30:00',
  },
  {
    applicationId: 'WA-2025004',
    partnerName: '李四',
    partnerType: 'individual',
    applicationTime: '2025-12-02 11:45:00',
    amount: 25000,
    applicationStatus: 'rejected',
    paymentStatus: 'unpaid',
    rejectReason: '账户信息不完整',
  },
  {
    applicationId: 'WA-2025005',
    partnerName: '上海贸易公司',
    partnerType: 'enterprise',
    applicationTime: '2025-12-01 15:20:00',
    amount: 120000,
    applicationStatus: 'processing',
    paymentStatus: 'unpaid',
    invoiceUrl: '/invoices/WA-2025005.pdf',
  },
];

export function WithdrawalProcessing({ applications = mockApplications }: WithdrawalProcessingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterApplicationStatus, setFilterApplicationStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterPartnerType, setFilterPartnerType] = useState<string>('all');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // 获取申请状态徽章
  const getApplicationStatusBadge = (status: WithdrawalApplicationStatus) => {
    const config = {
      pending: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已审核', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      rejected: { label: '已拒绝', className: 'bg-red-50 text-red-700 border-red-300' },
      processing: { label: '处理中', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 获取打款状态徽章
  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const config = {
      unpaid: { label: '未打款', className: 'bg-gray-50 text-gray-700 border-gray-300' },
      paid: { label: '已打款', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '打款失败', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 获取类型徽章
  const getPartnerTypeBadge = (type: PartnerType) => {
    const config = {
      individual: { label: '个人', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      enterprise: { label: '企业', className: 'bg-purple-50 text-purple-700 border-purple-300' },
    };
    const { label, className } = config[type];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 筛选逻辑
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!app.applicationId.toLowerCase().includes(query) && 
            !app.partnerName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 申请状态筛选
      if (filterApplicationStatus !== 'all' && app.applicationStatus !== filterApplicationStatus) {
        return false;
      }

      // 打款状态筛选
      if (filterPaymentStatus !== 'all' && app.paymentStatus !== filterPaymentStatus) {
        return false;
      }

      // 类型筛选
      if (filterPartnerType !== 'all' && app.partnerType !== filterPartnerType) {
        return false;
      }

      // 日期筛选
      if (filterDateStart && app.applicationTime < filterDateStart) {
        return false;
      }
      if (filterDateEnd && app.applicationTime > filterDateEnd + ' 23:59:59') {
        return false;
      }

      return true;
    });
  }, [applications, searchQuery, filterApplicationStatus, filterPaymentStatus, filterPartnerType, filterDateStart, filterDateEnd]);

  const hasActiveFilters = filterDateStart !== '' || filterDateEnd !== '';

  // 处理下载发票
  const handleDownloadInvoice = (invoiceUrl: string) => {
    // 实际应用中这里应该触发文件下载
    console.log('下载发票:', invoiceUrl);
    alert('下载发票: ' + invoiceUrl);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">提现处理</CardTitle>

            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="relative w-64 min-w-[16rem]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索申请单号、大B名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filterApplicationStatus}
                onValueChange={setFilterApplicationStatus}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="申请状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="approved">已审核</SelectItem>
                  <SelectItem value="rejected">已拒绝</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterPaymentStatus}
                onValueChange={setFilterPaymentStatus}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="打款状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="unpaid">未打款</SelectItem>
                  <SelectItem value="paid">已打款</SelectItem>
                  <SelectItem value="failed">打款失败</SelectItem>
                </SelectContent>
              </Select>

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
                导出数据
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-4 border-t mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">类型</Label>
                  <Select value={filterPartnerType} onValueChange={setFilterPartnerType}>
                    <SelectTrigger>
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="individual">个人</SelectItem>
                      <SelectItem value="enterprise">企业</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">开始日期</Label>
                  <Input
                    type="date"
                    value={filterDateStart}
                    onChange={(e) => setFilterDateStart(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-gray-700 w-20 flex-shrink-0">结束日期</Label>
                  <Input
                    type="date"
                    value={filterDateEnd}
                    onChange={(e) => setFilterDateEnd(e.target.value)}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterDateStart('');
                      setFilterDateEnd('');
                    }}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">大B名称</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">申请时间</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">申请金额</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">申请状态</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">打款状态</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    暂无提现申请数据
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.applicationId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{app.applicationId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{app.partnerName}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {getPartnerTypeBadge(app.partnerType)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{app.applicationTime}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      ¥{app.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {getApplicationStatusBadge(app.applicationStatus)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {getPaymentStatusBadge(app.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        {app.partnerType === 'enterprise' && app.invoiceUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(app.invoiceUrl!)}
                            className="h-8 px-2"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            发票
                          </Button>
                        )}
                        {app.applicationStatus === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              审核
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              拒绝
                            </Button>
                          </>
                        )}
                        {app.applicationStatus === 'approved' && app.paymentStatus === 'unpaid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            打款
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

        {filteredApplications.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {filteredApplications.length} 条申请 | 申请总金额：¥
            {filteredApplications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
