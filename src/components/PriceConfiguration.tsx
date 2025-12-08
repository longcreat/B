import React, { useState, useMemo } from 'react';
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
import { Percent, Plus, Edit, Info, ChevronDown, ChevronUp, Pause, Play, Globe, MapPin, Building, Hotel, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

import { 
  getMockPricingRules, 
  type PlatformMarkupRule, 
  type PricingScope,
  COUNTRIES,
  CITIES,
  BRANDS,
  HOTELS,
} from '../data/mockPricingRules';

export { type PlatformMarkupRule };

export function PriceConfiguration() {
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<PlatformMarkupRule | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PricingScope | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 使用 mock 数据
  const [markupRules, setMarkupRules] = useState<PlatformMarkupRule[]>(getMockPricingRules());

  const [formData, setFormData] = useState({
    name: '',
    scope: 'global' as PricingScope,
    countryCode: '',
    cityCode: '',
    brandCode: '',
    hotelId: '',
    markupRate: 10,
    priority: 100,
    description: '',
  });

  // 根据选中的国家获取城市列表
  const availableCities = useMemo(() => {
    if (formData.countryCode && CITIES[formData.countryCode]) {
      return CITIES[formData.countryCode];
    }
    return [];
  }, [formData.countryCode]);

  const getScopeName = (scope: PricingScope) => {
    const names: Record<PricingScope, string> = {
      global: '全局',
      country: '国家',
      city: '城市',
      brand: '品牌',
      hotel: '酒店',
    };
    return names[scope] || scope;
  };

  const getScopeIcon = (scope: PricingScope) => {
    const icons: Record<PricingScope, React.ReactNode> = {
      global: <Globe className="w-4 h-4" />,
      country: <MapPin className="w-4 h-4" />,
      city: <MapPin className="w-4 h-4" />,
      brand: <Building className="w-4 h-4" />,
      hotel: <Hotel className="w-4 h-4" />,
    };
    return icons[scope];
  };

  const getScopeBadgeColor = (scope: PricingScope) => {
    const colors: Record<PricingScope, string> = {
      global: 'bg-gray-100 text-gray-700 border-gray-300',
      country: 'bg-blue-50 text-blue-700 border-blue-300',
      city: 'bg-green-50 text-green-700 border-green-300',
      brand: 'bg-purple-50 text-purple-700 border-purple-300',
      hotel: 'bg-orange-50 text-orange-700 border-orange-300',
    };
    return colors[scope];
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: '启用', className: 'bg-green-50 text-green-700 border-green-300' },
      inactive: { label: '停用', className: 'bg-gray-50 text-gray-700 border-gray-300' },
    };
    const { label, className } = config[status as keyof typeof config];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  // 获取规则的目标显示文本
  const getRuleTarget = (rule: PlatformMarkupRule) => {
    switch (rule.scope) {
      case 'global':
        return '全部';
      case 'country':
        return rule.countryName || rule.countryCode || '-';
      case 'city':
        return `${rule.countryName || ''} - ${rule.cityName || rule.cityCode || '-'}`;
      case 'brand':
        return rule.brandName || rule.brandCode || '-';
      case 'hotel':
        return rule.hotelName || rule.hotelId || '-';
      default:
        return '-';
    }
  };

  // 筛选规则
  const filteredRules = useMemo(() => {
    let rules = markupRules;
    
    // 按tab筛选
    if (activeTab !== 'all') {
      rules = rules.filter(r => r.scope === activeTab);
    }
    
    // 按搜索关键词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rules = rules.filter(r => 
        r.name.toLowerCase().includes(query) ||
        (r.countryName && r.countryName.toLowerCase().includes(query)) ||
        (r.cityName && r.cityName.toLowerCase().includes(query)) ||
        (r.brandName && r.brandName.toLowerCase().includes(query)) ||
        (r.hotelName && r.hotelName.toLowerCase().includes(query))
      );
    }
    
    return rules.sort((a, b) => a.priority - b.priority);
  }, [markupRules, activeTab, searchQuery]);

  // 统计各维度规则数量
  const scopeCounts = useMemo(() => {
    const counts: Record<PricingScope | 'all', number> = {
      all: markupRules.length,
      global: markupRules.filter(r => r.scope === 'global').length,
      country: markupRules.filter(r => r.scope === 'country').length,
      city: markupRules.filter(r => r.scope === 'city').length,
      brand: markupRules.filter(r => r.scope === 'brand').length,
      hotel: markupRules.filter(r => r.scope === 'hotel').length,
    };
    return counts;
  }, [markupRules]);

  const handleOpenDialog = (rule?: PlatformMarkupRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        scope: rule.scope,
        countryCode: rule.countryCode || '',
        cityCode: rule.cityCode || '',
        brandCode: rule.brandCode || '',
        hotelId: rule.hotelId || '',
        markupRate: rule.markupRate,
        priority: rule.priority,
        description: rule.description || '',
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        scope: 'global',
        countryCode: '',
        cityCode: '',
        brandCode: '',
        hotelId: '',
        markupRate: 10,
        priority: 100,
        description: '',
      });
    }
    setShowRuleDialog(true);
  };

  const handleSaveRule = () => {
    if (!formData.name) {
      toast.error('请输入规则名称');
      return;
    }
    
    // 根据scope验证必填字段
    if (formData.scope === 'country' && !formData.countryCode) {
      toast.error('请选择国家');
      return;
    }
    if (formData.scope === 'city' && (!formData.countryCode || !formData.cityCode)) {
      toast.error('请选择国家和城市');
      return;
    }
    if (formData.scope === 'brand' && !formData.brandCode) {
      toast.error('请选择品牌');
      return;
    }
    if (formData.scope === 'hotel' && !formData.hotelId) {
      toast.error('请选择酒店');
      return;
    }
    
    if (formData.markupRate < 0 || formData.markupRate > 100) {
      toast.error('利润率必须在0-100之间');
      return;
    }

    // 获取选中项的名称
    const country = COUNTRIES.find(c => c.code === formData.countryCode);
    const city = availableCities.find(c => c.code === formData.cityCode);
    const brand = BRANDS.find(b => b.code === formData.brandCode);
    const hotel = HOTELS.find(h => h.id === formData.hotelId);

    if (editingRule) {
      // 更新规则
      setMarkupRules(markupRules.map(rule =>
        rule.id === editingRule.id
          ? {
              ...rule,
              name: formData.name,
              scope: formData.scope,
              countryCode: formData.countryCode || undefined,
              countryName: country?.name,
              cityCode: formData.cityCode || undefined,
              cityName: city?.name,
              brandCode: formData.brandCode || undefined,
              brandName: brand?.name,
              hotelId: formData.hotelId || undefined,
              hotelName: hotel?.name,
              markupRate: formData.markupRate,
              priority: formData.priority,
              description: formData.description || undefined,
              updatedAt: new Date().toLocaleString('zh-CN'),
            }
          : rule
      ));
      toast.success('规则更新成功');
    } else {
      // 新增规则
      const newRule: PlatformMarkupRule = {
        id: Date.now().toString(),
        name: formData.name,
        scope: formData.scope,
        countryCode: formData.countryCode || undefined,
        countryName: country?.name,
        cityCode: formData.cityCode || undefined,
        cityName: city?.name,
        brandCode: formData.brandCode || undefined,
        brandName: brand?.name,
        hotelId: formData.hotelId || undefined,
        hotelName: hotel?.name,
        markupRate: formData.markupRate,
        priority: formData.priority,
        description: formData.description || undefined,
        status: 'active',
        createdAt: new Date().toLocaleString('zh-CN'),
        createdBy: '当前用户',
      };
      setMarkupRules([...markupRules, newRule]);
      toast.success('规则创建成功');
    }

    setShowRuleDialog(false);
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('确定要删除该规则吗？')) {
      setMarkupRules(markupRules.filter(rule => rule.id !== id));
      toast.success('规则已删除');
    }
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

      {/* 说明卡片 - 可折叠 */}
      <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <Card className="bg-blue-50 border-blue-200">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-between gap-4 h-6">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-900 font-medium leading-none">价格体系说明</span>
                </div>
                <div className="flex items-center justify-center flex-shrink-0 h-6">
                  {isDescriptionOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <CardContent className="pt-0 pb-6 px-6">
              <div className="space-y-2 text-sm pl-8">
                <p className="text-blue-800">
                  • <strong>P0 (供应商底价)</strong>：从上游供应商获取的成本价
                </p>
                <p className="text-blue-800">
                  • <strong>P1 (平台供货价)</strong> = P0 × (1 + 平台利润率)
                </p>
                <p className="text-blue-800">
                  • <strong>P2 (大B销售价)</strong> = P1 × (1 + 大B加价率)
                </p>
                <p className="text-blue-800 mt-2">
                  <strong>利润分配：</strong>平台利润 = P1 - P0，大B利润 = P2 - P1
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 配置列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>平台利润率配置</CardTitle>
              <CardDescription className="mt-2">
                支持按全局/国家/城市/品牌/酒店设定加价率，优先级数字越小越优先匹配
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              新增规则
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 维度Tab筛选 */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PricingScope | 'all')}>
            <div className="flex items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="all" className="gap-1">
                  全部 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="global" className="gap-1">
                  <Globe className="w-3.5 h-3.5" /> 全局 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.global}</Badge>
                </TabsTrigger>
                <TabsTrigger value="country" className="gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 国家 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.country}</Badge>
                </TabsTrigger>
                <TabsTrigger value="city" className="gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 城市 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.city}</Badge>
                </TabsTrigger>
                <TabsTrigger value="brand" className="gap-1">
                  <Building className="w-3.5 h-3.5" /> 品牌 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.brand}</Badge>
                </TabsTrigger>
                <TabsTrigger value="hotel" className="gap-1">
                  <Hotel className="w-3.5 h-3.5" /> 酒店 <Badge variant="secondary" className="ml-1 h-5 px-1.5">{scopeCounts.hotel}</Badge>
                </TabsTrigger>
              </TabsList>
              
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索规则名称或目标..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </Tabs>

          {/* 规则表格 */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">优先级</TableHead>
                  <TableHead>规则名称</TableHead>
                  <TableHead className="w-[100px]">适用范围</TableHead>
                  <TableHead>目标</TableHead>
                  <TableHead className="w-[120px]">平台利润率</TableHead>
                  <TableHead className="w-[80px]">状态</TableHead>
                  <TableHead className="w-[100px]">创建人</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      暂无规则数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{rule.priority}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{rule.name}</span>
                          {rule.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{rule.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getScopeBadgeColor(rule.scope)}>
                          <span className="flex items-center gap-1">
                            {getScopeIcon(rule.scope)}
                            {getScopeName(rule.scope)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{getRuleTarget(rule)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Percent className="w-4 h-4 text-purple-500" />
                          <span className="text-purple-700 font-medium">{rule.markupRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rule.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {rule.createdBy || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleOpenDialog(rule)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>编辑</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleToggleStatus(rule.id)}
                              >
                                {rule.status === 'active' ? (
                                  <Pause className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{rule.status === 'active' ? '停用' : '启用'}</p>
                            </TooltipContent>
                          </Tooltip>
                          {rule.scope !== 'global' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteRule(rule.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>删除</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
            {/* 规则名称 */}
            <div>
              <Label htmlFor="name">规则名称 <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="例如：北京地区利润率"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* 适用范围 */}
            <div>
              <Label htmlFor="scope">适用范围 <span className="text-red-500">*</span></Label>
              <Select
                value={formData.scope}
                onValueChange={(value: PricingScope) => setFormData({ 
                  ...formData, 
                  scope: value,
                  countryCode: '',
                  cityCode: '',
                  brandCode: '',
                  hotelId: '',
                })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> 全局</span>
                  </SelectItem>
                  <SelectItem value="country">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 国家</span>
                  </SelectItem>
                  <SelectItem value="city">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 城市</span>
                  </SelectItem>
                  <SelectItem value="brand">
                    <span className="flex items-center gap-2"><Building className="w-4 h-4" /> 品牌</span>
                  </SelectItem>
                  <SelectItem value="hotel">
                    <span className="flex items-center gap-2"><Hotel className="w-4 h-4" /> 酒店</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 国家选择 - 国家/城市/酒店范围时显示 */}
            {(formData.scope === 'country' || formData.scope === 'city' || formData.scope === 'hotel') && (
              <div>
                <Label>国家 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.countryCode}
                  onValueChange={(value: string) => setFormData({ ...formData, countryCode: value, cityCode: '' })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="请选择国家" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 城市选择 - 城市/酒店范围时显示 */}
            {(formData.scope === 'city' || formData.scope === 'hotel') && formData.countryCode && (
              <div>
                <Label>城市 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.cityCode}
                  onValueChange={(value: string) => setFormData({ ...formData, cityCode: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="请选择城市" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
                      <SelectItem key={city.code} value={city.code}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 品牌选择 - 品牌范围时显示 */}
            {formData.scope === 'brand' && (
              <div>
                <Label>品牌 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.brandCode}
                  onValueChange={(value: string) => setFormData({ ...formData, brandCode: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="请选择品牌" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map(brand => (
                      <SelectItem key={brand.code} value={brand.code}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 酒店选择 - 酒店范围时显示 */}
            {formData.scope === 'hotel' && (
              <div>
                <Label>酒店 <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.hotelId}
                  onValueChange={(value: string) => setFormData({ ...formData, hotelId: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="请选择酒店" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOTELS.filter(h => 
                      (!formData.countryCode || h.country === formData.countryCode) &&
                      (!formData.cityCode || h.city === formData.cityCode)
                    ).map(hotel => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 利润率和优先级 */}
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

            {/* 规则描述 */}
            <div>
              <Label htmlFor="description">规则描述</Label>
              <Textarea
                id="description"
                placeholder="可选，描述该规则的用途或原因"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                rows={2}
              />
            </div>

            {/* 实时计算示例 */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium mb-3">计算示例</h4>
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
                  <span className="text-blue-600 font-medium">¥{exampleCalc.p1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平台利润</span>
                  <span className="text-green-600 font-medium">¥{exampleCalc.profit.toFixed(2)}</span>
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
