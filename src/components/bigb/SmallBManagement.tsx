// 大B客户管理小B的功能组件
// 功能：审核小B申请、查看小B列表、修改佣金比例、停用/启用小B

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Users, CheckCircle, XCircle, Pause, Play, Edit, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getMockPartners, type Partner } from '../../data/mockPartners';
import type { ApplicationData } from '../../data/mockApplications';
import { getMockApplications } from '../../data/mockApplications';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

export function SmallBManagement() {
  const [partners, setPartners] = useState<Partner[]>(getMockPartners());
  const [applications, setApplications] = useState<ApplicationData[]>(getMockApplications());
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');

  // 获取待审核的小B申请（挂载在当前大B下）
  const pendingApplications = applications.filter(app => 
    app.status === 'pending' && 
    app.businessModel === 'affiliate'
  );

  // 获取已审核通过的小B客户（挂载在当前大B下）
  const approvedSmallBs = partners.filter(p => 
    p.businessModel === 'affiliate' && 
    p.parentPartnerId !== null &&
    p.certificationStatus === 'approved'
  );

  // 审核小B申请
  const handleReviewApplication = (appId: string, approved: boolean, reason?: string) => {
    setApplications(applications.map(app => 
      app.id === appId
        ? {
            ...app,
            status: approved ? 'approved' : 'rejected',
            reviewedAt: new Date().toLocaleString('zh-CN'),
            rejectionReason: reason,
          }
        : app
    ));
    
    if (approved) {
      // 审核通过后，创建Partner并设置挂载关系
      const app = applications.find(a => a.id === appId);
      if (app) {
        // 这里应该调用API创建Partner，暂时使用mock数据
        toast.success('小B申请已审核通过');
      }
    } else {
      toast.error('小B申请已驳回');
    }
  };

  // 修改小B佣金比例
  const handleUpdateCommission = () => {
    if (!selectedPartner) return;
    
    setPartners(partners.map(p => 
      p.id === selectedPartner.id
        ? { ...p, defaultCommissionRate: newCommissionRate }
        : p
    ));
    
    toast.success(`已更新佣金比例为 ${newCommissionRate}%`);
    setShowCommissionDialog(false);
    setSelectedPartner(null);
  };

  // 停用/启用小B
  const handleToggleSmallBStatus = (partnerId: string, suspend: boolean) => {
    setPartners(partners.map(p => 
      p.id === partnerId
        ? {
            ...p,
            smallbStatus: suspend ? 'suspended' : 'active',
            smallbSuspendedAt: suspend ? new Date().toLocaleString('zh-CN') : null,
            smallbSuspendedBy: suspend ? 'CURRENT_BIGB_ID' : null, // 应该使用当前大B的ID
          }
        : p
    ));
    
    toast.success(suspend ? '小B客户已停用' : '小B客户已启用');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>小B客户管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="pending">
            待审核申请
            {pendingApplications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingApplications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">已审核小B ({approvedSmallBs.length})</TabsTrigger>
          <TabsTrigger value="all">全部小B ({partners.filter(p => p.businessModel === 'affiliate').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>待审核的小B申请</CardTitle>
              <CardDescription>审核申请推广联盟链接的用户</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  暂无待审核的申请
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>申请人</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.applicantName}</TableCell>
                        <TableCell>{app.userEmail}</TableCell>
                        <TableCell>{app.submittedAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReviewApplication(app.id, true)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              通过
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReviewApplication(app.id, false, '不符合要求')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              驳回
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>已审核通过的小B客户</CardTitle>
              <CardDescription>管理已审核通过的小B客户，可以修改佣金比例、停用/启用</CardDescription>
            </CardHeader>
            <CardContent>
              {approvedSmallBs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  暂无已审核通过的小B客户
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>小B名称</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>佣金比例</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedSmallBs.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>{partner.displayName}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {partner.defaultCommissionRate || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={partner.smallbStatus === 'active' ? 'default' : 'secondary'}>
                            {partner.smallbStatus === 'active' ? '启用' : '停用'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPartner(partner);
                                setNewCommissionRate(partner.defaultCommissionRate || 10);
                                setShowCommissionDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              修改佣金
                            </Button>
                            {partner.smallbStatus === 'active' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleSmallBStatus(partner.id, true)}
                              >
                                <Pause className="w-4 h-4 mr-1" />
                                停用
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleSmallBStatus(partner.id, false)}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                启用
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>全部小B客户</CardTitle>
              <CardDescription>查看所有挂载在您下的小B客户</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>小B名称</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>佣金比例</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners
                    .filter(p => p.businessModel === 'affiliate')
                    .map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>{partner.displayName}</TableCell>
                        <TableCell>{partner.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {partner.defaultCommissionRate || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={partner.smallbStatus === 'active' ? 'default' : 'secondary'}>
                            {partner.smallbStatus === 'active' ? '启用' : '停用'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPartner(partner);
                                setNewCommissionRate(partner.defaultCommissionRate || 10);
                                setShowCommissionDialog(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              修改佣金
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 修改佣金比例对话框 */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改佣金比例</DialogTitle>
            <DialogDescription>
              为 {selectedPartner?.displayName} 设置佣金比例（百分比）
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="commission-rate">佣金比例 (%)</Label>
              <Input
                id="commission-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newCommissionRate}
                onChange={(e) => setNewCommissionRate(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500">
                佣金比例范围：0% - 100%，建议设置为 5% - 30%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionDialog(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateCommission}>
              <DollarSign className="w-4 h-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

