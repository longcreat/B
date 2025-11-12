import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BigBAccountList } from './BigBAccountList';
import { SmallBAccountList } from './SmallBAccountList';

export function MerchantAccounts() {
  const [activeTab, setActiveTab] = useState<'bigb' | 'smallb'>('bigb');

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
            <BreadcrumbPage>商户账户</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 大B/小B账户Tab切换 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'bigb' | 'smallb')}>
        <TabsList>
          <TabsTrigger value="bigb">大B账户</TabsTrigger>
          <TabsTrigger value="smallb">小B账户</TabsTrigger>
        </TabsList>

        <TabsContent value="bigb" className="mt-6">
          <BigBAccountList />
        </TabsContent>

        <TabsContent value="smallb" className="mt-6">
          <SmallBAccountList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
