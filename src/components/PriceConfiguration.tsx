import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Percent, Settings, Plus, Edit, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 平台利润率配置
interface PlatformMarkupRule {
  id: string;
  name: string;
  scope: 'global' | 'brand' | 'city' | 'supplier';
  target?: string; // 品牌名、城市名或供应商ID
  markupRate: number; // 平台利润率（百分比）
  priority: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export function PriceConfiguration() {
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<PlatformMarkupRule | null>(null);

  // 模拟配置数据
  const [markupRules, setMarkupRules] = useState<PlatformMarkupRule[]>([
    {
      id: '1',
      name: '全局基础利润率',
      scope: 'global',
      markupRate: 10,
      priority: 999,
      status: 'active',
      createdAt: '2025-10-01 00:00:00',
    },
    {
      id: '2',
      name: '希尔顿品牌利润率',
      scope: 'brand',
      target: '希尔顿',
      markupRate: 12,
      priority: 10,
      status: 'active',
      createdAt: '2025-10-15 10:30:00',
    },
    {
      id: '3',
      name: '北京地区利润率',
      scope: 'city',
      target: '北京',
      markupRate: 15,
      priority: 20,
      status: 'active',
      createdAt: '2025-10-20 14:20:00',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    scope: 'global' as 'global' | 'brand' | 'city' | 'supplier',
    target: '',
    markupRate: 10,
    priority: 100,
  });

  const getScopeName = (scope: string) => {
    const names = {
      global: '全局',
      brand: '品牌',
      city: '城市',
      supplier: '供应商',
    };
    return names[scope as keyof typeof names] || scope;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: '启用', className: 'bg-green-50 text-green-700 border-green-300' },
      inactive: { label: '停用', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const handleOpenDialog = (rule?: PlatformMarkupRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        scope: rule.scope,
        target: rule.target || '',
        markupRate: rule.markupRate,
        priority: rule.priority,
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        scope: 'global',
        target: '',
        markupRate: 10,
        priority: 100,
      });
    }
    setShowRuleDialog(true);
  };

  const handleSaveRule = () => {
    if (!formData.name) {
      toast.error('请输入规则名称');
      return;
    }
    if (formData.scope !== 'global' && !formData.target) {
      toast.error('请输入目标名称');
      return;
    }
    if (formData.markupRate <= 0 || formData.markupRate > 100) {
      toast.error('利润率必须在0-100之间');
      return;
    }

    if (editingRule) {
      // 更新规则
      setMarkupRules(markupRules.map(rule =>
        rule.id === editingRule.id
          ? {
              ...rule,
              ...formData,
              updatedAt: new Date().toLocaleString('zh-CN'),
            }
          : rule
      ));
      toast.success('规则更新成功');
    } else {
      // 新增规则
      const newRule: PlatformMarkupRule = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        createdAt: new Date().toLocaleString('zh-CN'),
      };
      setMarkupRules([...markupRules, newRule]);
      toast.success('规则创建成功');
    }

    setShowRuleDialog(false);
  };

  const handleToggleStatus = (id: string) => {
    setMarkupRules(markupRules.map(rule =>
      rule.id === id
        ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
        : rule
    ));
    toast.success('状态已更新');
  };

  // 计算示例
  const calculateExample = (p0: number, rate: number) => {
    const p1 = p0 * (1 + rate / 100);
    const profit = p1 - p0;
    return { p1, profit };
  };

  const exampleP0 = 800;
  const exampleCalc = calculateExample(exampleP0, formData.markupRate);

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>价格配置</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 说明卡片 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-900">
                <strong>价格体系说明：</strong>
              </p>
              <p className="text-blue-800">
                • <strong>P0 (供应商底价)</strong>：从上游供应商获取的成本价
              </p>
              <p className="text-blue-800">
                • <strong>P1 (平台供货价)</strong> = P0 × (1 + 平台利润率)
              </p>
              <p className="text-blue-800">
                • <strong>P2 (小B销售价)</strong> = P1 × (1 + 小B加价率)
              </p>
              <p className="text-blue-800 mt-2">
                <strong>利润分配：</strong>平台利润 = P1 - P0，小B利润 = P2 - P1
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配置列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>平台利润率配置</CardTitle>
              <CardDescription className="mt-2">
                配置不同维度的平台利润率，优先级数字越小越优先
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              新增规则
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>优先级</TableHead>
                  <TableHead>规则名称</TableHead>
                  <TableHead>适用范围</TableHead>
                  <TableHead>目标</TableHead>
                  <TableHead>平台利润率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markupRules
                  .sort((a, b) => a.priority - b.priority)
                  .map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getScopeName(rule.scope)}</Badge>
                      </TableCell>
                      <TableCell>{rule.target || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-purple-500" />
                          <span className="text-purple-700">{rule.markupRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rule.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {rule.createdAt}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(rule)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(rule.id)}
                        >
                          {rule.status === 'active' ? '停用' : '启用'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 规则配置对话框 */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? '编辑利润率规则' : '新增利润率规则'}
            </DialogTitle>
            <DialogDescription>
              配置平台从P0到P1的利润率，系统将自动计算P1供货价
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">规则名称 <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="例如：全局基础利润率"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scope">适用范围 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.scope}
                  onValueChange={(value: any) => setFormData({ ...formData, scope: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">全局</SelectItem>
                    <SelectItem value="brand">品牌</SelectItem>
                    <SelectItem value="city">城市</SelectItem>
                    <SelectItem value="supplier">供应商</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.scope !== 'global' && (
                <div>
                  <Label htmlFor="target">
                    目标{getScopeName(formData.scope)} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="target"
                    placeholder={`例如：${formData.scope === 'brand' ? '希尔顿' : formData.scope === 'city' ? '北京' : '供应商ID'}`}
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="mt-2"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="markupRate">
                  平台利润率 (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="markupRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.markupRate}
                  onChange={(e) => setFormData({ ...formData, markupRate: parseFloat(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="priority">优先级</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 100 })}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">数字越小优先级越高</p>
              </div>
            </div>

            {/* 实时计算示例 */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="mb-3">计算示例</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">P0 (供应商底价)</span>
                  <span>¥{exampleP0.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平台利润率</span>
                  <span className="text-purple-600">{formData.markupRate}%</span>
                </div>
                <div className="h-px bg-gray-300 my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-600">P1 (平台供货价)</span>
                  <span className="text-blue-600">¥{exampleCalc.p1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平台利润</span>
                  <span className="text-green-600">¥{exampleCalc.profit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRuleDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? '保存修改' : '创建规则'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
