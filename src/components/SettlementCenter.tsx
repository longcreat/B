import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { BadgeCheck, Building, Factory, Landmark, ListChecks } from 'lucide-react';

const settlementFeatures = [
  {
    title: '客户结算批次',
    description: '查看大B/小B结算批次，执行审批、计入以及关联订单操作。',
    icon: Building,
  },
  {
    title: '供应商结算批次',
    description: '跟踪供应商结算、导出批次详情，并处理异常批次。',
    icon: Factory,
  },
  {
    title: '结算配置',
    description: '维护结算周期、门槛金额与自动计入策略，确保流程规范。',
    icon: Landmark,
  },
  {
    title: '业务单据对照',
    description: '配合结算明细、订单改价、退款等单据核对结算金额。',
    icon: ListChecks,
  },
];

export function SettlementCenter() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>结算管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">结算管理总览</CardTitle>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              从左侧菜单选择具体模块，可查看结算批次、配置规则或核对相关业务单据。
            </p>
          </div>
          <BadgeCheck className="w-9 h-9 text-blue-500 flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {settlementFeatures.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-medium text-gray-900">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">
                    使用左侧菜单进入
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

