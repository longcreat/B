import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eye } from 'lucide-react';

export interface ApplicationData {
  id: string;
  applicantName: string;
  businessModel: 'mcp' | 'saas' | 'affiliate';
  identityType: 'individual' | 'influencer' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  data: any;
}

interface AdminReviewListProps {
  applications: ApplicationData[];
  onViewDetail: (application: ApplicationData) => void;
}

export function AdminReviewList({ applications, onViewDetail }: AdminReviewListProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

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

  const filteredApplications = applications.filter((app) => app.status === activeTab);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>资质审核管理</CardTitle>
            <p className="text-gray-600 mt-2">管理和审核用户提交的认证申请</p>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  待审核 ({applications.filter((a) => a.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  已通过 ({applications.filter((a) => a.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  已驳回 ({applications.filter((a) => a.status === 'rejected').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已驳回'}的申请
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
                            <TableCell>{app.applicantName}</TableCell>
                            <TableCell>{getBusinessModelName(app.businessModel)}</TableCell>
                            <TableCell>{getIdentityTypeName(app.identityType)}</TableCell>
                            <TableCell>{app.submittedAt}</TableCell>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
