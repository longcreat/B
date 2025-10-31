import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Plus, Trash2, Settings, DollarSign, FileText, Download, Upload, Store } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

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

interface Order {
  id: string;
  orderNo: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  cost: number;
  commission: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD20251031001',
    hotelName: '北京希尔顿酒店',
    checkIn: '2025-11-05',
    checkOut: '2025-11-07',
    amount: 2180,
    cost: 1800,
    commission: 380,
    status: 'confirmed',
    createdAt: '2025-10-31 10:30',
  },
  {
    id: '2',
    orderNo: 'ORD20251030002',
    hotelName: '上海万豪酒店',
    checkIn: '2025-11-10',
    checkOut: '2025-11-12',
    amount: 3420,
    cost: 2850,
    commission: 570,
    status: 'confirmed',
    createdAt: '2025-10-30 15:22',
  },
  {
    id: '3',
    orderNo: 'ORD20251029003',
    hotelName: '深圳洲际酒店',
    checkIn: '2025-10-28',
    checkOut: '2025-10-30',
    amount: 4150,
    cost: 3500,
    commission: 650,
    status: 'completed',
    createdAt: '2025-10-29 09:15',
  },
];

export function SmallBAdmin() {
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
  const [showStoreConfig, setShowStoreConfig] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [storeConfig, setStoreConfig] = useState({
    storeName: '我的酒店预订站',
    contactPhone: '',
    contactEmail: '',
    customDomain: '',
  });

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

  const exportFinancialReport = () => {
    toast.success('财务报表导出中，请稍候...');
    setTimeout(() => {
      toast.success('报表已导出到下载文件夹');
    }, 1500);
  };

  const saveStoreConfig = () => {
    toast.success('店铺配置已保存');
    setShowStoreConfig(false);
  };

  const calculateTotals = () => {
    return {
      totalRevenue: mockOrders.reduce((sum, o) => sum + o.amount, 0),
      totalCost: mockOrders.reduce((sum, o) => sum + o.cost, 0),
      totalCommission: mockOrders.reduce((sum, o) => sum + o.commission, 0),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">小B管理后台</h1>
            <p className="text-gray-600">管理加价策略，查看订单和财务数据</p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <Store className="w-4 h-4 mr-2" />
            PaaS模式
          </Badge>
        </div>

        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pricing">
              <DollarSign className="w-4 h-4 mr-2" />
              加价策略管理
            </TabsTrigger>
            <TabsTrigger value="orders">
              <FileText className="w-4 h-4 mr-2" />
              订单与财务
            </TabsTrigger>
            <TabsTrigger value="store">
              <Settings className="w-4 h-4 mr-2" />
              品牌店铺配置
            </TabsTrigger>
          </TabsList>

          {/* Pricing Strategy */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>加价规则列表</CardTitle>
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
                        <TableCell>{rule.priority}</TableCell>
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
                        <TableCell>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders & Finance */}
          <TabsContent value="orders" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">总收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">¥{totals.totalRevenue.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">客户支付金额</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">总成本</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">¥{totals.totalCost.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">供应商结算价</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">总佣金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-green-600">
                      ¥{totals.totalCommission.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">您的收益</p>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>订单列表</CardTitle>
                    <CardDescription className="mt-2">
                      查看所有通过您渠道产生的订单
                    </CardDescription>
                  </div>
                  <Button onClick={exportFinancialReport}>
                    <Download className="w-4 h-4 mr-2" />
                    导出报表
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead>酒店名称</TableHead>
                      <TableHead>入住日期</TableHead>
                      <TableHead>离店日期</TableHead>
                      <TableHead>收入</TableHead>
                      <TableHead>成本</TableHead>
                      <TableHead>佣金</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.orderNo}</TableCell>
                        <TableCell>{order.hotelName}</TableCell>
                        <TableCell>{order.checkIn}</TableCell>
                        <TableCell>{order.checkOut}</TableCell>
                        <TableCell>¥{order.amount.toLocaleString()}</TableCell>
                        <TableCell>¥{order.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">
                          ¥{order.commission.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'default'
                                : order.status === 'confirmed'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {order.status === 'confirmed' && '已确认'}
                            {order.status === 'completed' && '已完成'}
                            {order.status === 'cancelled' && '已取消'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {order.createdAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Configuration */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>品牌店铺配置</CardTitle>
                <CardDescription>
                  自定义您的品牌预订页面，提升品牌形象
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>店铺名称</Label>
                    <Input
                      value={storeConfig.storeName}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, storeName: e.target.value })
                      }
                      placeholder="请输入店铺名称"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>品牌Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {storeLogo ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={URL.createObjectURL(storeLogo)}
                            alt="Logo"
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setStoreLogo(null)}
                          >
                            移除
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8" />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) setStoreLogo(file);
                              };
                              input.click();
                            }}
                          >
                            上传Logo
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      建议尺寸：200x200px，支持JPG/PNG格式
                    </p>
                  </div>

                  <div>
                    <Label>联系电话</Label>
                    <Input
                      value={storeConfig.contactPhone}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, contactPhone: e.target.value })
                      }
                      placeholder="400-xxx-xxxx"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>联系邮箱</Label>
                    <Input
                      value={storeConfig.contactEmail}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, contactEmail: e.target.value })
                      }
                      placeholder="contact@example.com"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>自定义域名（可选）</Label>
                    <Input
                      value={storeConfig.customDomain}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, customDomain: e.target.value })
                      }
                      placeholder="booking.yourdomain.com"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      配置自定义域名后，您的客户将通过您的专属域名访问预订页面
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline">预览</Button>
                    <Button onClick={saveStoreConfig}>保存配置</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>预订页面链接</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                  <code className="flex-1 text-sm">
                    https://booking.platform.com/store/your-store-id
                  </code>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('https://booking.platform.com/store/your-store-id');
                      toast.success('链接已复制');
                    }}
                  >
                    复制链接
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl">
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
                onValueChange={(value) =>
                  setNewRule({ ...newRule, dimension: value as PricingRule['dimension'] })
                }
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
              <Label>目标值</Label>
              <Input
                value={newRule.target || ''}
                onChange={(e) => setNewRule({ ...newRule, target: e.target.value })}
                placeholder={
                  newRule.dimension === 'country'
                    ? '例如：中国'
                    : newRule.dimension === 'city'
                    ? '例如：北京'
                    : '例如：希尔顿'
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label>加价方式</Label>
              <Select
                value={newRule.markupType}
                onValueChange={(value) =>
                  setNewRule({ ...newRule, markupType: value as PricingRule['markupType'] })
                }
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
              <Label>
                加价值 {newRule.markupType === 'percentage' ? '(%)' : '(¥)'}
              </Label>
              <Input
                type="number"
                value={newRule.markupValue || ''}
                onChange={(e) =>
                  setNewRule({ ...newRule, markupValue: parseFloat(e.target.value) })
                }
                placeholder={newRule.markupType === 'percentage' ? '例如：12' : '例如：100'}
                className="mt-2"
              />
            </div>

            <div>
              <Label>优先级</Label>
              <Input
                type="number"
                value={newRule.priority || ''}
                onChange={(e) =>
                  setNewRule({ ...newRule, priority: parseInt(e.target.value) })
                }
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

      {/* Delete Rule Confirmation */}
      <AlertDialog open={!!ruleToDelete} onOpenChange={() => setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除规则？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后，此规则将不再生效。此操作不可撤销。
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
