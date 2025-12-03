import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WithdrawalReviewList } from './WithdrawalReviewList';
import { WithdrawalRecordList } from './WithdrawalRecordList';
import { WithdrawalDetailPage } from './WithdrawalDetailPage';
import { type Withdrawal } from '../data/mockWithdrawals';

export function WithdrawalManager() {
  const [activeTab, setActiveTab] = useState<'review' | 'record'>('review');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);

  const handleViewDetail = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
  };

  const handleBackToList = () => {
    setSelectedWithdrawal(null);
  };

  // 如果选中了提现记录，显示详情页
  if (selectedWithdrawal) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">财务中心</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={handleBackToList} className="cursor-pointer text-sm hover:text-blue-600">
                  提现管理
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">详情</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <WithdrawalDetailPage withdrawal={selectedWithdrawal} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">财务中心</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm">提现管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'review' | 'record')}>
        <TabsList>
          <TabsTrigger value="review">提现申请审核</TabsTrigger>
          <TabsTrigger value="record">提现记录管理</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="mt-6">
          <WithdrawalReviewList onViewDetail={handleViewDetail} />
        </TabsContent>

        <TabsContent value="record" className="mt-6">
          <WithdrawalRecordList onViewDetail={handleViewDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
