import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { toast } from 'sonner';

interface SettlementConfig {
  // 小B结算配置
  partnerCycleType: 'weekly' | 'monthly' | 'custom';
  partnerCycleValue: string;
  partnerFreezeDays: number;
  partnerMinAmount: number;
  partnerAutoGenerate: boolean;
  partnerAutoApprove: boolean;
  partnerAutoCredit: boolean;
  
  // 供应商结算配置
  supplierCycleType: 'monthly' | 'quarterly' | 'custom';
  supplierCycleValue: string;
  supplierFreezeDays: number;
  supplierMinAmount: number;
  supplierAutoGenerate: boolean;
  supplierAutoApprove: boolean;
  supplierAutoPay: boolean;
}

interface ConfigLog {
  logTime: string;
  logUser: string;
  configType: '小B结算' | '供应商结算';
  configKey: string;
  oldValue: string;
  newValue: string;
}

export function SettlementConfig() {
  const [config, setConfig] = useState<SettlementConfig>({
    partnerCycleType: 'weekly',
    partnerCycleValue: 'monday',
    partnerFreezeDays: 7,
    partnerMinAmount: 100.00,
    partnerAutoGenerate: true,
    partnerAutoApprove: false,
    partnerAutoCredit: false,
    supplierCycleType: 'monthly',
    supplierCycleValue: '1',
    supplierFreezeDays: 15,
    supplierMinAmount: 1000.00,
    supplierAutoGenerate: true,
    supplierAutoApprove: false,
    supplierAutoPay: false,
  });

  const [originalConfig, setOriginalConfig] = useState<SettlementConfig>(config);
  const [configLogs, setConfigLogs] = useState<ConfigLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 生成mock配置修改记录
  useEffect(() => {
    const logs: ConfigLog[] = [];
    for (let i = 0; i < 50; i++) {
      logs.push({
        logTime: new Date(2025, 0, 8 - i, 10, 30, 0).toISOString().replace('T', ' ').substring(0, 19),
        logUser: '李财务',
        configType: i % 2 === 0 ? '小B结算' : '供应商结算',
        configKey: ['结算冻结期天数', '最低起付金额', '自动生成批次', '自动审批'][i % 4],
        oldValue: String(7 - (i % 3)),
        newValue: String(7 - (i % 3) + 1),
      });
    }
    setConfigLogs(logs);
  }, []);

  // 分页
  const totalItems = configLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = configLogs.slice(startIndex, endIndex);

  // 检查是否有修改
  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

  // 保存配置
  const handleSave = () => {
    if (confirm('确定要保存配置修改吗？')) {
      setOriginalConfig({ ...config });
      toast.success('配置已保存');
      // 这里应该调用API保存配置
    }
  };

  // 重置为默认值
  const handleReset = () => {
    if (confirm('确定要重置为默认值吗？此操作将覆盖当前配置。')) {
      const defaultConfig: SettlementConfig = {
        partnerCycleType: 'weekly',
        partnerCycleValue: 'monday',
        partnerFreezeDays: 7,
        partnerMinAmount: 100.00,
        partnerAutoGenerate: true,
        partnerAutoApprove: false,
        partnerAutoCredit: false,
        supplierCycleType: 'monthly',
        supplierCycleValue: '1',
        supplierFreezeDays: 15,
        supplierMinAmount: 1000.00,
        supplierAutoGenerate: true,
        supplierAutoApprove: false,
        supplierAutoPay: false,
      };
      setConfig(defaultConfig);
      setOriginalConfig(defaultConfig);
      toast.success('配置已重置为默认值');
    }
  };

  // 更新配置
  const updateConfig = <K extends keyof SettlementConfig>(key: K, value: SettlementConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* 面包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>财务中心</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>结算管理</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>结算配置</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 小B结算配置 */}
        <Card>
          <CardHeader>
            <CardTitle>小B结算配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm">结算周期类型</Label>
                <Select value={config.partnerCycleType} onValueChange={(value: 'weekly' | 'monthly' | 'custom') => updateConfig('partnerCycleType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">结算周期</Label>
                {config.partnerCycleType === 'weekly' ? (
                  <Select value={config.partnerCycleValue} onValueChange={(value) => updateConfig('partnerCycleValue', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">周一</SelectItem>
                      <SelectItem value="tuesday">周二</SelectItem>
                      <SelectItem value="wednesday">周三</SelectItem>
                      <SelectItem value="thursday">周四</SelectItem>
                      <SelectItem value="friday">周五</SelectItem>
                      <SelectItem value="saturday">周六</SelectItem>
                      <SelectItem value="sunday">周日</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    value={config.partnerCycleValue}
                    onChange={(e) => updateConfig('partnerCycleValue', e.target.value)}
                    placeholder="每月1号"
                  />
                )}
              </div>
              <div>
                <Label className="text-sm">结算冻结期天数</Label>
                <Input
                  type="number"
                  value={config.partnerFreezeDays}
                  onChange={(e) => updateConfig('partnerFreezeDays', parseInt(e.target.value) || 7)}
                  min={1}
                  max={30}
                />
              </div>
              <div>
                <Label className="text-sm">最低起付金额（元）</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={config.partnerMinAmount}
                  onChange={(e) => updateConfig('partnerMinAmount', parseFloat(e.target.value) || 100)}
                  min={0.01}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动生成批次</Label>
                <Switch
                  checked={config.partnerAutoGenerate}
                  onCheckedChange={(checked) => updateConfig('partnerAutoGenerate', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动审批</Label>
                <Switch
                  checked={config.partnerAutoApprove}
                  onCheckedChange={(checked) => updateConfig('partnerAutoApprove', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动计入账户</Label>
                <Switch
                  checked={config.partnerAutoCredit}
                  onCheckedChange={(checked) => updateConfig('partnerAutoCredit', checked)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={!hasChanges}>
                保存配置
              </Button>
              <Button variant="outline" onClick={handleReset}>
                重置为默认值
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 供应商结算配置 */}
        <Card>
          <CardHeader>
            <CardTitle>供应商结算配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm">结算周期类型</Label>
                <Select value={config.supplierCycleType} onValueChange={(value: 'monthly' | 'quarterly' | 'custom') => updateConfig('supplierCycleType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="quarterly">每季度</SelectItem>
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">结算周期</Label>
                {config.supplierCycleType === 'monthly' ? (
                  <Input
                    type="text"
                    value={config.supplierCycleValue}
                    onChange={(e) => updateConfig('supplierCycleValue', e.target.value)}
                    placeholder="每月1号"
                  />
                ) : (
                  <Input
                    type="text"
                    value={config.supplierCycleValue}
                    onChange={(e) => updateConfig('supplierCycleValue', e.target.value)}
                    placeholder="季度首月1号"
                  />
                )}
              </div>
              <div>
                <Label className="text-sm">结算冻结期天数</Label>
                <Input
                  type="number"
                  value={config.supplierFreezeDays}
                  onChange={(e) => updateConfig('supplierFreezeDays', parseInt(e.target.value) || 15)}
                  min={1}
                  max={60}
                />
              </div>
              <div>
                <Label className="text-sm">最低起付金额（元）</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={config.supplierMinAmount}
                  onChange={(e) => updateConfig('supplierMinAmount', parseFloat(e.target.value) || 1000)}
                  min={0.01}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动生成批次</Label>
                <Switch
                  checked={config.supplierAutoGenerate}
                  onCheckedChange={(checked) => updateConfig('supplierAutoGenerate', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动审批</Label>
                <Switch
                  checked={config.supplierAutoApprove}
                  onCheckedChange={(checked) => updateConfig('supplierAutoApprove', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">自动打款</Label>
                <Switch
                  checked={config.supplierAutoPay}
                  onCheckedChange={(checked) => updateConfig('supplierAutoPay', checked)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={!hasChanges}>
                保存配置
              </Button>
              <Button variant="outline" onClick={handleReset}>
                重置为默认值
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 配置修改记录 */}
        <Card>
          <CardHeader>
            <CardTitle>配置修改记录</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>修改时间</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>修改人</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '120px' }}>配置类型</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>修改项</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>修改前值</th>
                    <th className="text-left p-3 font-medium text-sm bg-gray-50" style={{ minWidth: '150px' }}>修改后值</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        暂无配置修改记录
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm">{log.logTime}</td>
                        <td className="p-3 text-sm">{log.logUser}</td>
                        <td className="p-3 text-sm">{log.configType}</td>
                        <td className="p-3 text-sm">{log.configKey}</td>
                        <td className="p-3 text-sm">{log.oldValue}</td>
                        <td className="p-3 text-sm font-medium">{log.newValue}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages >= 1 && totalItems > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-600">
                  共 {totalItems} 条记录，第 {currentPage} / {totalPages} 页
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

