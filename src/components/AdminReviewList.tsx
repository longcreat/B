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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Eye } from 'lucide-react';

export interface ApplicationData {
  id: string;
  applicantName: string;
  businessModel: 'mcp' | 'saas' | 'affiliate';
  identityType: 'individual' | 'influencer' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  permissionLevel?: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  internalNote?: string;
  userId?: string;
  userEmail?: string;
  data: any;
}

interface AdminReviewListProps {
  applications: ApplicationData[];
  onViewDetail: (application: ApplicationData) => void;
}

export function AdminReviewList({ applications, onViewDetail }: AdminReviewListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterBusinessModel, setFilterBusinessModel] = useState<'all' | 'mcp' | 'saas' | 'affiliate'>('all');
  const [filterIdentityType, setFilterIdentityType] = useState<'all' | 'individual' | 'influencer' | 'enterprise'>('all');

  const getBusinessModelName = (model: string) => {
    const names = {
      mcp: 'MCP',
      saas: '品牌预订站',
      affiliate: '联盟推广',
    };
    return names[model as keyof typeof names] || model;
  };

  const getIdentityTypeName = (type: string) => {
    const names = {
      individual: '个人',
      influencer: '博主',
      enterprise: '企业',
    };
    return names[type as keyof typeof names] || type;
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.userEmail && app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesBusinessModel = filterBusinessModel === 'all' || app.businessModel === filterBusinessModel;
    const matchesIdentityType = filterIdentityType === 'all' || app.identityType === filterIdentityType;

    return matchesSearch && matchesStatus && matchesBusinessModel && matchesIdentityType;
  });

  const statusBadge = (status: string) => {
    const config = {
      pending: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已通过', className: 'bg-green-50 text-green-700 border-green-300' },
      rejected: { label: '已驳回', className: 'bg-red-50 text-red-700 border-red-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>资质审核</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>申请列表</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索申请人、邮箱"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="审核状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="rejected">已驳回</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBusinessModel} onValueChange={(value: any) => setFilterBusinessModel(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="业务模式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部模式</SelectItem>
                  <SelectItem value="mcp">MCP</SelectItem>
                  <SelectItem value="saas">品牌预订站</SelectItem>
                  <SelectItem value="affiliate">联盟推广</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterIdentityType} onValueChange={(value: any) => setFilterIdentityType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="身份类型" />
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
        </CardHeader>

        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border rounded-lg">
              暂无符合条件的申请
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>申请人</TableHead>
                    <TableHead>业务模式</TableHead>
                    <TableHead>身份类型</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p>{app.applicantName}</p>
                          {app.userEmail && (
                            <p className="text-sm text-gray-500">{app.userEmail}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getBusinessModelName(app.businessModel)}</TableCell>
                      <TableCell>{getIdentityTypeName(app.identityType)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{app.submittedAt}</TableCell>
                      <TableCell>{statusBadge(app.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail(app)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
