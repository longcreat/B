import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WithdrawalProcessing } from './WithdrawalProcessing';
import { type PartnerSettlementBatch } from './PartnerSettlementBatchList';
import { MonthlyReconciliation } from './MonthlyReconciliation';
import { SettlementConfig } from './SettlementConfig';

interface SettlementManagementProps {
  onViewPartnerBatchDetail?: (batch: PartnerSettlementBatch) => void;
}

export function SettlementManagement({ 
  onViewPartnerBatchDetail,
}: SettlementManagementProps) {
  return (
    <div className="space-y-6">
      {/* Tab 切换 - 优化样式 */}
      <Tabs defaultValue="withdrawal" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-11">
          <TabsTrigger value="withdrawal" className="text-sm">提现处理</TabsTrigger>
          <TabsTrigger value="supplier" className="text-sm">对账管理</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawal" className="mt-0">
          <WithdrawalProcessing />
        </TabsContent>

        <TabsContent value="supplier" className="mt-0">
          <MonthlyReconciliation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
