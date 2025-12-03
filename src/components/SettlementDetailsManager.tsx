import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BigBSettlementList, type BigBSettlement } from './BigBSettlementList';
import { BigBSettlementDetail } from './BigBSettlementDetail';
import { SupplierSettlementList, type SupplierSettlement } from './SupplierSettlementList';
import { SupplierSettlementDetail } from './SupplierSettlementDetail';

export function SettlementDetailsManager() {
  const [activeTab, setActiveTab] = useState<'bigb' | 'supplier'>('bigb');
  const [selectedBigBSettlement, setSelectedBigBSettlement] = useState<BigBSettlement | null>(null);
  const [selectedSupplierSettlement, setSelectedSupplierSettlement] = useState<SupplierSettlement | null>(null);

  const handleViewBigBDetail = (settlement: BigBSettlement) => {
    setSelectedBigBSettlement(settlement);
  };

  const handleViewSupplierDetail = (settlement: SupplierSettlement) => {
    setSelectedSupplierSettlement(settlement);
  };

  const handleBackToBigBList = () => {
    setSelectedBigBSettlement(null);
  };

  const handleBackToSupplierList = () => {
    setSelectedSupplierSettlement(null);
  };

  // 如果正在查看详情页，直接显示详情页
  if (selectedBigBSettlement) {
    return (
      <BigBSettlementDetail
        settlement={selectedBigBSettlement}
        onBack={handleBackToBigBList}
      />
    );
  }

  if (selectedSupplierSettlement) {
    return (
      <SupplierSettlementDetail
        settlement={selectedSupplierSettlement}
        onBack={handleBackToSupplierList}
      />
    );
  }

  // 列表页使用Tabs组件
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
            <BreadcrumbPage>业务单据管理</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>结算明细</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 大B/供应商结算明细Tab切换 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'bigb' | 'supplier')}>
        <TabsList>
          <TabsTrigger value="bigb">大B结算明细</TabsTrigger>
          <TabsTrigger value="supplier">供应商结算明细</TabsTrigger>
        </TabsList>

        <TabsContent value="bigb" className="mt-6">
          <BigBSettlementList onViewDetail={handleViewBigBDetail} />
        </TabsContent>

        <TabsContent value="supplier" className="mt-6">
          <SupplierSettlementList onViewDetail={handleViewSupplierDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
