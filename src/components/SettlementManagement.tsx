import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WithdrawalProcessing } from './WithdrawalProcessing';
import { type PartnerSettlementBatch } from './PartnerSettlementBatchList';
import { SupplierSettlementBatchList, type SupplierSettlementBatch } from './SupplierSettlementBatchList';
import { SettlementConfig } from './SettlementConfig';

interface SettlementManagementProps {
  onViewPartnerBatchDetail?: (batch: PartnerSettlementBatch) => void;
  onViewSupplierBatchDetail?: (batch: SupplierSettlementBatch) => void;
}

export function SettlementManagement({ 
  onViewPartnerBatchDetail,
  onViewSupplierBatchDetail 
}: SettlementManagementProps) {
  return (
    <div className="space-y-6">
      {/* Tab 切换 - 优化样式 */}
      <Tabs defaultValue="withdrawal" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 h-11">
          <TabsTrigger value="withdrawal" className="text-sm">提现处理</TabsTrigger>
          <TabsTrigger value="supplier" className="text-sm">供应商结算</TabsTrigger>
          <TabsTrigger value="config" className="text-sm">结算配置</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawal" className="mt-0">
          <WithdrawalProcessing />
        </TabsContent>

        <TabsContent value="supplier" className="mt-0">
          <SupplierSettlementBatchList onViewBatchDetail={onViewSupplierBatchDetail} />
        </TabsContent>

        <TabsContent value="config" className="mt-0">
          <SettlementConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
