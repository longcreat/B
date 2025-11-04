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
} from 'lucide-react';
import type { Withdrawal, WithdrawalStatus, BusinessModel } from '../data/mockWithdrawals';

export { type Withdrawal };

interface WithdrawalDetailProps {
  withdrawal: Withdrawal;
  onBack: () => void;
}

export function WithdrawalDetail({ withdrawal, onBack }: WithdrawalDetailProps) {
  const getStatusBadge = (status: WithdrawalStatus) => {
    const config: Record<WithdrawalStatus, { label: string; className: string }> = {
      processing: { label: '处理中', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      success: { label: '提现成功', className: 'bg-green-50 text-green-700 border-green-300' },
      failed: { label: '提现失败', className: 'bg-red-50 text-red-700 border-red-300' },
      pending_review: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      rejected: { label: '已拒绝', className: 'bg-orange-50 text-orange-700 border-orange-300' },
      closed: { label: '提现关闭', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getBusinessModelLabel = (model: BusinessModel) => {
    const labels: Record<BusinessModel, string> = {
      mcp: 'MCP服务',
      saas: 'SaaS方案',
      affiliate: '联盟推广',
    };
    return labels[model];
  };

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onBack} className="cursor-pointer text-sm">
                提现管理
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">提现详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>提现详情</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                {getStatusBadge(withdrawal.status)}
                <span className="text-gray-500">流水号：{withdrawal.withdrawalId}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 用户信息 */}
          <div className="pb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">用户信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">用户ID</Label>
                <p className="text-sm text-gray-900">{withdrawal.userId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">用户名称</Label>
                <p className="text-sm text-gray-900">{withdrawal.userName}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现人电话</Label>
                <p className="text-sm text-gray-900">{withdrawal.phone}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            {/* 提现信息 */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">提现信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">流水号</Label>
                <p className="text-sm text-gray-900 font-medium">{withdrawal.withdrawalId}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现金额</Label>
                <p className="text-sm text-gray-900 font-semibold text-lg">¥{withdrawal.amount.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现状态</Label>
                <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">业务模式</Label>
                <p className="text-sm text-gray-900">{getBusinessModelLabel(withdrawal.businessModel)}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现创建时间</Label>
                <p className="text-sm text-gray-900">{withdrawal.createTime}</p>
              </div>
              {withdrawal.transferTime && (
                <div>
                  <Label className="text-gray-500 text-xs font-medium mb-1.5 block">转账汇款时间</Label>
                  <p className="text-sm text-gray-900">{withdrawal.transferTime}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 pb-6">
            {/* 账户信息 */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">账户信息</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现账户</Label>
                <p className="text-sm text-gray-900">{withdrawal.account}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs font-medium mb-1.5 block">提现用户名</Label>
                <p className="text-sm text-gray-900">{withdrawal.accountName}</p>
              </div>
            </div>
          </div>

          {/* 备注和异常信息 */}
          {(withdrawal.remark || withdrawal.rejectReason || withdrawal.failureReason) && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">备注与异常信息</h3>
              <div className="grid grid-cols-2 gap-6">
                {withdrawal.remark && (
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">备注</Label>
                    <p className="text-sm text-gray-900">{withdrawal.remark}</p>
                  </div>
                )}
                {withdrawal.rejectReason && (
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">拒绝原因</Label>
                    <p className="text-sm text-red-600">{withdrawal.rejectReason}</p>
                  </div>
                )}
                {withdrawal.failureReason && (
                  <div>
                    <Label className="text-gray-500 text-xs font-medium mb-1.5 block">失败原因</Label>
                    <p className="text-sm text-red-600">{withdrawal.failureReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

