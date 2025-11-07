import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Store, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Save, 
  HelpCircle,
  Phone,
  Mail,
  Copyright,
  Sparkles,
  CheckCircle,
  Plus,
  Trash2,
  Edit,
  ChevronsUpDown,
  Image,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

// 导入预览图片
import headerPreview from '../../image/header.png';
import backgroundPreview from '../../image/background.png';
import titlePreview from '../../image/title.png';
import specialPreview from '../../image/special.png';

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  isCustom?: boolean;
}

interface BrandConfig {
  storeCode: string; // 店铺代码 - 全局唯一
  storeLogo: string;
  storeName: string;
  showCobranding: boolean;
  heroImage: string;
  mainTitle: string;
  subTitle: string;
  contactPhone: string;
  contactEmail: string;
  copyrightText: string;
  selectedFeatures: string[];
}

// 预置的特色内容库
const defaultFeatureLibrary: FeatureItem[] = [
  { id: 'design', icon: '🎨', title: '独特的设计与主题', description: '精心设计的主题风格，为您的客户提供独特体验' },
  { id: 'luxury', icon: '✨', title: '高端设施与服务', description: '五星级标准的设施和贴心周到的服务' },
  { id: 'location', icon: '📍', title: '优越的地理位置', description: '便捷的交通，周边配套设施完善' },
  { id: 'food', icon: '🍽️', title: '美食与餐饮', description: '多样化的餐饮选择，满足不同口味需求' },
  { id: 'relax', icon: '🧘', title: '休闲与放松', description: 'SPA、健身房等休闲设施一应俱全' },
  { id: 'business', icon: '💼', title: '商务会议设施', description: '专业的会议室和商务中心服务' },
];

export function SaaSBrandConfig() {
  const [config, setConfig] = useState<BrandConfig>({
    storeCode: 'ethan', // 已设置的店铺代码
    storeLogo: '',
    storeName: 'Ethan Travel',
    showCobranding: true,
    heroImage: '',
    mainTitle: '现在出发！',
    subTitle: '与Ethan一起探索世界',
    contactPhone: '',
    contactEmail: '',
    copyrightText: '',
    selectedFeatures: ['design', 'luxury', 'location'],
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [featureLibrary, setFeatureLibrary] = useState<FeatureItem[]>(defaultFeatureLibrary);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [newFeature, setNewFeature] = useState<Partial<FeatureItem>>({
    icon: '⭐',
    title: '',
    description: '',
  });
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(null);

  const emojiOptions = [
    '🎨','✨','📍','🍽️','🧘','💼','⭐','🌟','💎','🎯','📈','🚀','🏖️','🏰','🎵','🛎️','🛫','🏝️','🍷','🛋️','🧴','🪷','🧑‍🤝‍🧑','🤝','💡'
  ];

  const handleEmojiSelect = (emoji: string) => {
    setNewFeature(prev => ({ ...prev, icon: emoji }));
    setEmojiPickerOpen(false);
  };

  // 模拟全局唯一性校验
  const checkCodeAvailability = async (code: string) => {
    if (!code || code.length < 3) {
      setCodeAvailable(null);
      return;
    }
    
    setIsCheckingCode(true);
    // 模拟 API 调用
    setTimeout(() => {
      // 实际应该调用后端 API 检查唯一性
      const isAvailable = !['admin', 'test', 'demo', 'api'].includes(code.toLowerCase());
      setCodeAvailable(isAvailable);
      setIsCheckingCode(false);
    }, 500);
  };

  const handleStoreCodeChange = (value: string) => {
    // 只允许小写字母、数字和连字符
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    updateConfig('storeCode', sanitized);
    checkCodeAvailability(sanitized);
  };

  const updateConfig = (key: keyof BrandConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const toggleFeature = (featureId: string) => {
    const newFeatures = config.selectedFeatures.includes(featureId)
      ? config.selectedFeatures.filter(id => id !== featureId)
      : [...config.selectedFeatures, featureId];
    updateConfig('selectedFeatures', newFeatures);
  };

  const handleAddCustomFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      toast.error('请填写标题和描述');
      return;
    }

    const customFeature: FeatureItem = {
      id: `custom-${Date.now()}`,
      icon: newFeature.icon || '⭐',
      title: newFeature.title,
      description: newFeature.description,
      isCustom: true,
    };

    setFeatureLibrary([...featureLibrary, customFeature]);
    setNewFeature({ icon: '⭐', title: '', description: '' });
    setShowFeatureDialog(false);
    setHasUnsavedChanges(true);
    toast.success('自定义特色已添加');
  };

  const handleEditFeature = (feature: FeatureItem) => {
    setEditingFeature(feature);
    setNewFeature({
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
    });
    setShowFeatureDialog(true);
  };

  const handleUpdateFeature = () => {
    if (!editingFeature || !newFeature.title || !newFeature.description) {
      toast.error('请填写标题和描述');
      return;
    }

    setFeatureLibrary(featureLibrary.map(f => 
      f.id === editingFeature.id 
        ? { ...f, icon: newFeature.icon || '⭐', title: newFeature.title!, description: newFeature.description! }
        : f
    ));
    setEditingFeature(null);
    setNewFeature({ icon: '⭐', title: '', description: '' });
    setShowFeatureDialog(false);
    setHasUnsavedChanges(true);
    toast.success('特色已更新');
  };

  const handleDeleteFeature = (featureId: string) => {
    setFeatureLibrary(featureLibrary.filter(f => f.id !== featureId));
    updateConfig('selectedFeatures', config.selectedFeatures.filter(id => id !== featureId));
    toast.success('特色已删除');
  };

  const openAddFeatureDialog = () => {
    setEditingFeature(null);
    setNewFeature({ icon: '⭐', title: '', description: '' });
    setShowFeatureDialog(true);
  };

  const handleSave = () => {
    if (!config.storeCode) {
      toast.error('请设置店铺代码');
      return;
    }
    if (config.storeCode.length < 3) {
      toast.error('店铺代码至少需要3个字符');
      return;
    }
    if (codeAvailable === false) {
      toast.error('该店铺代码已被使用，请选择其他代码');
      return;
    }
    // 保存配置逻辑
    toast.success('配置已保存！');
    setHasUnsavedChanges(false);
  };

  const handlePreview = () => {
    // 打开预览页面
    window.open('/preview/store', '_blank');
    toast.info('正在新标签页中打开预览');
  };

  const handleLogoUpload = () => {
    toast.info('Logo上传功能开发中');
  };

  const handleHeroImageUpload = () => {
    toast.info('主宣传图上传功能开发中');
  };

  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${config.storeName} All rights reserved.`;

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>品牌配置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              有未保存的更改
            </Badge>
          )}
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            预览我的店铺
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="w-4 h-4 mr-2" />
            保存设置
          </Button>
        </div>
      </div>

      {/* 提示信息 - 可折叠 */}
      <Collapsible open={isTipOpen} onOpenChange={setIsTipOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">打造您的专属品牌预订站</span>
                </div>
                {isTipOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <p className="text-sm text-blue-800">
                无需任何技术背景，通过简单配置即可拥有专业的在线预订门户。所有修改将实时同步到您的H5页面。
              </p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* A. 品牌与身份 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            品牌与身份
          </CardTitle>
          <CardDescription>设置您的店铺基本信息和品牌标识</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo上传 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>店铺Logo/头像</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      建议上传透明背景的PNG格式图片，尺寸128x128px。将显示在页面顶部作为您的品牌标识。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-none">
                    <img src={headerPreview} alt="Logo预览" className="w-96 h-auto rounded-lg shadow-xl border border-gray-200" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {config.storeLogo ? (
                  <img src={config.storeLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <Button variant="outline" onClick={handleLogoUpload}>
                <Upload className="w-4 h-4 mr-2" />
                上传Logo
              </Button>
            </div>
          </div>

          {/* 店铺名称 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="storeName">店铺名称 *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      将作为网站标题和页面主品牌标识，建议使用简短易记的名称。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="storeName"
              value={config.storeName}
              onChange={(e) => updateConfig('storeName', e.target.value)}
              placeholder="请输入店铺名称"
            />
          </div>

          {/* 店铺代码 - 新增 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="storeCode">店铺代码 (专属网址) *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      设置一个简短、易记的代码，将生成您的专属网址：https://aigohotel.com/s/[您的代码]
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">https://aigohotel.com/s/</span>
                <Input
                  id="storeCode"
                  value={config.storeCode}
                  onChange={(e) => handleStoreCodeChange(e.target.value)}
                  placeholder="例如：ethan"
                  className="flex-1"
                />
                {isCheckingCode && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    检查中...
                  </Badge>
                )}
                {!isCheckingCode && codeAvailable === true && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-300">
                    ✓ 可用
                  </Badge>
                )}
                {!isCheckingCode && codeAvailable === false && (
                  <Badge variant="destructive">
                    ✗ 已被使用
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                只能包含小写字母、数字和连字符，至少3个字符。此代码全局唯一，设置后建议不要更改。
              </p>
              {config.storeCode && codeAvailable === true && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-800 font-medium mb-1">您的专属预订站网址：</p>
                  <code className="text-sm text-green-900 break-all">
                    https://aigohotel.com/s/{config.storeCode}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* 联名品牌展示 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label>联名品牌展示</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        开启后，页面顶部将显示"AIGOHOTEL x {config.storeName}"的联名标识，增强品牌信任度。
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-gray-600">
                在页面顶部显示 "AIGOHOTEL x {config.storeName}"
              </p>
            </div>
            <Switch
              checked={config.showCobranding}
              onCheckedChange={(checked: boolean) => updateConfig('showCobranding', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* B. 视觉与内容 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            视觉与内容
          </CardTitle>
          <CardDescription>自定义页面的视觉元素和宣传内容</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 主宣传图 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>主宣传图</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      建议上传高分辨率的横向风景或酒店图片（推荐尺寸1920x600px）。若不上传，系统将使用默认图片。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-none">
                    <img src={backgroundPreview} alt="主宣传图预览" className="w-96 h-auto rounded-lg shadow-xl border border-gray-200" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-3">
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {config.heroImage ? (
                  <img src={config.heroImage} alt="Hero" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">暂未上传，将使用默认图片</p>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={handleHeroImageUpload}>
                <Upload className="w-4 h-4 mr-2" />
                上传主宣传图
              </Button>
            </div>
          </div>

          {/* 主标题 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="mainTitle">主标题</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      显示在主宣传图上的大标题，建议使用简短有力的文案吸引用户。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-none">
                    <img src={titlePreview} alt="标题预览" className="w-96 h-auto rounded-lg shadow-xl border border-gray-200" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="mainTitle"
              value={config.mainTitle}
              onChange={(e) => updateConfig('mainTitle', e.target.value)}
              placeholder="例如：现在出发！"
            />
          </div>

          {/* 副标题 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="subTitle">副标题/Slogan</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      显示在主标题下方的副标题，用于补充说明或展示品牌理念。
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-none">
                    <img src={titlePreview} alt="标题预览" className="w-96 h-auto rounded-lg shadow-xl border border-gray-200" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="subTitle"
              value={config.subTitle}
              onChange={(e) => updateConfig('subTitle', e.target.value)}
              placeholder="例如：与Ethan一起探索世界"
            />
          </div>

          {/* 特色内容模块 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>特色内容模块</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        从内容库中选择您希望展示的特色主题，勾选的模块将显示在页面下方。也可以自定义添加新的特色模块。
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Image className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-none">
                    <img src={specialPreview} alt="特色内容预览" className="w-96 h-auto rounded-lg shadow-xl border border-gray-200" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </div>
              <Button variant="outline" size="sm" onClick={openAddFeatureDialog}>
                <Plus className="w-4 h-4 mr-2" />
                添加自定义特色
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featureLibrary.map((feature) => {
                const isSelected = config.selectedFeatures.includes(feature.id);
                return (
                  <div
                    key={feature.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all relative group
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div 
                      onClick={() => toggleFeature(feature.id)}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <div className="text-2xl">{feature.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{feature.title}</p>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                          {feature.isCustom && (
                            <Badge variant="outline" className="text-xs">自定义</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    {feature.isCustom && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleEditFeature(feature);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDeleteFeature(feature.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">
              已选择 {config.selectedFeatures.length} 个特色模块
            </p>
          </div>
        </CardContent>
      </Card>

      {/* C. 联系与页脚信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            联系与页脚信息
          </CardTitle>
          <CardDescription>设置客户联系方式和页脚版权信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 联系电话 */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input
              id="contactPhone"
              value={config.contactPhone}
              onChange={(e) => updateConfig('contactPhone', e.target.value)}
              placeholder="例如：400-123-4567"
            />
          </div>

          {/* 客服邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">客服邮箱</Label>
            <Input
              id="contactEmail"
              type="email"
              value={config.contactEmail}
              onChange={(e) => updateConfig('contactEmail', e.target.value)}
              placeholder="例如：service@example.com"
            />
          </div>

          {/* 页脚版权信息 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="copyrightText">页脚版权信息</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      留空将使用默认格式：© {currentYear} {config.storeName} All rights reserved.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="copyrightText"
              value={config.copyrightText}
              onChange={(e) => updateConfig('copyrightText', e.target.value)}
              placeholder={defaultCopyright}
            />
            <p className="text-xs text-gray-500">
              预览：{config.copyrightText || defaultCopyright}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg sticky bottom-4">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          预览效果
        </Button>
        <Button onClick={handleSave} disabled={!hasUnsavedChanges} size="lg">
          <Save className="w-4 h-4 mr-2" />
          保存并发布
        </Button>
      </div>

      {/* 自定义特色对话框 */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? '编辑特色模块' : '添加自定义特色'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feature-icon">图标 Emoji</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="feature-icon"
                  value={newFeature.icon}
                  onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                  placeholder="例如：⭐"
                  maxLength={2}
                  className="max-w-[120px]"
                />
                <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="gap-1">
                      <span className="text-lg">{newFeature.icon || '🙂'}</span>
                      <ChevronsUpDown className="w-3 h-3 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="start">
                    <ScrollArea className="h-48">
                      <div className="grid grid-cols-6 gap-2 p-3">
                        {emojiOptions.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className={`
                              flex h-10 w-10 items-center justify-center rounded-lg border transition-colors
                              ${newFeature.icon === emoji ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}
                            `}
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            <span className="text-xl">{emoji}</span>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-gray-500">
                可输入Emoji或使用选择器快速选择
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-title">标题 *</Label>
              <Input
                id="feature-title"
                value={newFeature.title}
                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                placeholder="例如：24小时客服"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature-description">描述 *</Label>
              <Textarea
                id="feature-description"
                value={newFeature.description}
                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                placeholder="例如：全天候在线客服，随时为您解答疑问"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>
              取消
            </Button>
            <Button onClick={editingFeature ? handleUpdateFeature : handleAddCustomFeature}>
              {editingFeature ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
