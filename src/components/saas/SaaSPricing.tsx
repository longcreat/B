import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Trash2, DollarSign, Info, Settings } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

interface PricingRule {
  id: string;
  name: string;
  dimension: 'country' | 'city' | 'brand';
  target: string;
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  priority: number;
  status: 'active' | 'inactive';
}

export function SaaSPricing() {
  const [globalMarkup, setGlobalMarkup] = useState({ type: 'percentage' as 'percentage' | 'fixed', value: 15 });
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: '北京地区加价',
      dimension: 'city',
      target: '北京',
      markupType: 'percentage',
      markupValue: 12,
      priority: 1,
      status: 'active',
    },
    {
      id: '2',
      name: '希尔顿品牌加价',
      dimension: 'brand',
      target: '希尔顿',
      markupType: 'fixed',
      markupValue: 100,
      priority: 2,
      status: 'active',
    },
  ]);

  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    dimension: 'country',
    markupType: 'percentage',
    priority: pricingRules.length + 1,
    status: 'active',
  });

  const addRule = () => {
    if (!newRule.name || !newRule.target || !newRule.markupValue) {
      toast.error('请填写完整的加价规则信息');
      return;
    }

    const rule: PricingRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      dimension: newRule.dimension!,
      target: newRule.target!,
      markupType: newRule.markupType!,
      markupValue: newRule.markupValue!,
      priority: newRule.priority!,
      status: 'active',
    };

    setPricingRules([...pricingRules, rule]);
    setShowRuleDialog(false);
    setNewRule({
      dimension: 'country',
      markupType: 'percentage',
      priority: pricingRules.length + 2,
      status: 'active',
    });
    toast.success('加价规则创建成功');
  };

  const deleteRule = (id: string) => {
    setPricingRules(pricingRules.filter(r => r.id !== id));
    setRuleToDelete(null);
    toast.success('规则已删除');
  };

  const toggleRuleStatus = (id: string) => {
    setPricingRules(pricingRules.map(r =>
      r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' as const : 'active' as const } : r
    ));
  };

  const saveGlobalMarkup = () => {
    toast.success('全局默认加价已保存');
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>加价策略</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 全局默认加价设置 */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Settings className="w-5 h-5" />
            全局默认加价
          </CardTitle>
          <CardDescription className="text-green-800">
            对所有未被特殊规则覆盖的酒店应用此加价策略
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-green-900">加价方式</Label>
              <Select
                value={globalMarkup.type}
                onValueChange={(value: 'percentage' | 'fixed') => setGlobalMarkup({ ...globalMarkup, type: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">百分比 (%)</SelectItem>
                  <SelectItem value="fixed">固定金额 (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-green-900">加价数值</Label>
              <Input
                type="number"
                value={globalMarkup.value}
                onChange={(e) => setGlobalMarkup({ ...globalMarkup, value: Number(e.target.value) })}
                className="bg-white"
                placeholder="请输入加价数值"
              />
            </div>
            <Button onClick={saveGlobalMarkup} className="bg-green-600 hover:bg-green-700">
              保存设置
            </Button>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <p className="text-sm text-green-900">
              <strong>当前设置：</strong>
              {globalMarkup.type === 'percentage' 
                ? `所有酒店默认加价 ${globalMarkup.value}%` 
                : `所有酒店默认加价 ¥${globalMarkup.value}`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 说明卡片 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">加价规则说明</p>
              <ul className="space-y-1 text-blue-800">
                <li>• 可按国家、城市、酒店品牌等维度设置加价规则</li>
                <li>• 支持百分比加价和固定金额加价两种方式</li>
                <li>• 优先级数字越小，规则优先级越高</li>
                <li>• 多条规则匹配时，按优先级应用第一条规则</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 加价规则列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                加价规则列表
              </CardTitle>
              <CardDescription className="mt-2">
                根据不同维度设置加价规则，优先级数字越小越优先
              </CardDescription>
            </div>
            <Button onClick={() => setShowRuleDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              创建规则
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pricingRules.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">还没有加价规则</p>
              <Button onClick={() => setShowRuleDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                创建第一条规则
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>优先级</TableHead>
                  <TableHead>规则名称</TableHead>
                  <TableHead>维度</TableHead>
                  <TableHead>目标</TableHead>
                  <TableHead>加价方式</TableHead>
                  <TableHead>加价值</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.priority}</TableCell>
                    <TableCell>{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {rule.dimension === 'country' && '国家'}
                        {rule.dimension === 'city' && '城市'}
                        {rule.dimension === 'brand' && '品牌'}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.target}</TableCell>
                    <TableCell>
                      {rule.markupType === 'percentage' ? '百分比' : '固定金额'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {rule.markupType === 'percentage'
                        ? `${rule.markupValue}%`
                        : `¥${rule.markupValue}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status === 'active' ? '启用' : '停用'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRuleStatus(rule.id)}
                        >
                          {rule.status === 'active' ? '停用' : '启用'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setRuleToDelete(rule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* 创建规则对话框 */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>创建加价规则</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>规则名称</Label>
              <Input
                value={newRule.name || ''}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="例如：北京地区加价"
                className="mt-2"
              />
            </div>
            <div>
              <Label>加价维度</Label>
              <Select
                value={newRule.dimension}
                onValueChange={(value: string) => setNewRule({ ...newRule, dimension: value as any })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="country">国家</SelectItem>
                  <SelectItem value="city">城市</SelectItem>
                  <SelectItem value="brand">酒店品牌</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>目标</Label>
              <Input
                value={newRule.target || ''}
                onChange={(e) => setNewRule({ ...newRule, target: e.target.value })}
                placeholder="例如：北京、希尔顿"
                className="mt-2"
              />
            </div>
            <div>
              <Label>加价方式</Label>
              <Select
                value={newRule.markupType}
                onValueChange={(value: string) => setNewRule({ ...newRule, markupType: value as any })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">百分比</SelectItem>
                  <SelectItem value="fixed">固定金额</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>加价值</Label>
              <Input
                type="number"
                value={newRule.markupValue || ''}
                onChange={(e) => setNewRule({ ...newRule, markupValue: Number(e.target.value) })}
                placeholder={newRule.markupType === 'percentage' ? '例如：12' : '例如：100'}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {newRule.markupType === 'percentage' ? '输入百分比数值，如12表示12%' : '输入固定金额，单位：元'}
              </p>
            </div>
            <div>
              <Label>优先级</Label>
              <Input
                type="number"
                value={newRule.priority || ''}
                onChange={(e) => setNewRule({ ...newRule, priority: Number(e.target.value) })}
                placeholder="数字越小优先级越高"
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
              取消
            </Button>
            <Button onClick={addRule}>创建规则</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!ruleToDelete} onOpenChange={() => setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除规则？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销。删除后，该规则将不再生效。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ruleToDelete && deleteRule(ruleToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
