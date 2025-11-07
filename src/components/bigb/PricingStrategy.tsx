// 大B客户加价策略配置组件
// 功能：设置加价率（影响小B链接价格）

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { TrendingUp, Info, Save, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Partner } from '../../data/mockPartners';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

interface PricingStrategyProps {
  currentPartner: Partner | null;
}

export function PricingStrategy({ currentPartner }: PricingStrategyProps) {
  const [markupRate, setMarkupRate] = useState<number>(10); // 默认加价率10%
  const [isSaving, setIsSaving] = useState(false);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false);
  const [isPriceInfoOpen, setIsPriceInfoOpen] = useState(false);

  if (!currentPartner) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">未找到客户信息</div>
      </div>
    );
  }

  // 只有大B客户（SaaS或MCP模式）可以设置加价率
  if (!currentPartner.canSetMarkupRate) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            您当前无法设置加价率。只有SaaS或MCP模式的大B客户可以设置加价率。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSave = () => {
    if (markupRate < 0 || markupRate > 100) {
      toast.error('加价率必须在0%到100%之间');
      return;
    }

    setIsSaving(true);
    // 模拟保存
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`加价率已更新为 ${markupRate}%`);
      // 这里应该调用API更新Partner的加价率
      // 更新后，所有小B客户的链接价格会自动更新
    }, 1000);
  };

  const isSaaS = currentPartner.businessModel === 'saas';
  const isMCP = currentPartner.businessModel === 'mcp';

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>加价策略</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 当前业务模式说明 - 可折叠 */}
      <Collapsible open={isModelInfoOpen} onOpenChange={setIsModelInfoOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">当前业务模式</span>
                </div>
                {isModelInfoOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {isSaaS ? 'SaaS模式' : isMCP ? 'MCP模式' : '未知模式'}
                </Badge>
                <div className="text-sm text-gray-600">
                  {isSaaS && '您可以设置从P1到P2的加价率'}
                  {isMCP && '您可以设置从P0直接到P2的加价率'}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 加价率设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            加价率设置
          </CardTitle>
          <CardDescription>
            {isSaaS && '设置从平台供货价P1到销售价P2的加价率（建议范围：5% - 30%）'}
            {isMCP && '设置从供应商供价P0到销售价P2的加价率（建议范围：10% - 50%）'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="markup-rate">加价率 (%)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="markup-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={markupRate}
                onChange={(e) => setMarkupRate(parseFloat(e.target.value) || 0)}
                className="w-32"
              />
              <span className="text-sm text-gray-500">%</span>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              加价率范围：0% - 100%，修改后会影响所有小B客户的链接价格
            </p>
          </div>

          {/* 价格链路说明 - 可折叠 */}
          <Collapsible open={isPriceInfoOpen} onOpenChange={setIsPriceInfoOpen}>
            <Alert className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsPriceInfoOpen(!isPriceInfoOpen)}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <p className="font-medium">价格链路说明</p>
                  {isPriceInfoOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </AlertDescription>
            </Alert>
            <CollapsibleContent className="mt-2 ml-6">
              {isSaaS && (
                <div className="text-sm space-y-1">
                  <p>供应商供价P0 → 平台供货价P1（平台加价）→ 销售价P2（您的加价率）</p>
                  <p className="text-gray-600">
                    示例：P0=100元，平台加价10% → P1=110元，您加价10% → P2=121元
                  </p>
                </div>
              )}
              {isMCP && (
                <div className="text-sm space-y-1">
                  <p>供应商供价P0 → 销售价P2（您的加价率，直接加价）</p>
                  <p className="text-gray-600">
                    示例：P0=100元，您加价20% → P2=120元
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* 影响范围说明 */}
      <Card>
        <CardHeader>
          <CardTitle>影响范围</CardTitle>
          <CardDescription>加价率修改后会影响以下内容</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>所有挂载在您下的小B客户的推广链接价格</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>新生成的订单将使用新的加价率计算价格</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>已生成的订单价格不受影响（保持创建时的价格）</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

