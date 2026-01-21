import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Link2, Copy, Edit2, Check, Edit, Lightbulb, Plus, Trash2, QrCode, ChevronDown, ChevronUp, Search, Hotel, Download, Smartphone, Building2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Campaign {
  id: string;
  name: string;
  parameter: string;
  link: string;
  clicks: number;
  orders: number;
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
}

export function AffiliateLink() {
  // 模拟用户数据
  const [referralCode, setReferralCode] = useState('flywithelsa'); // 个性化推广代码
  const [affiliateId] = useState('a8x3p7q'); // 系统生成的推广ID
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(null);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [useCustomLink, setUseCustomLink] = useState(true); // 是否使用自定义链接
  const [promotionTab, setPromotionTab] = useState('h5'); // 推广方式标签页：h5 或 miniprogram
  const [merchantAffiliation] = useState('Dida道旅AI'); // 归属商户，默认Dida道旅AI
  const [showCommissionPolicy, setShowCommissionPolicy] = useState(false); // 显示佣金政策弹窗
  
  // 酒店搜索相关状态
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHotelSearch, setShowHotelSearch] = useState(false);
  
  // 生成链接
  const defaultLink = `https://aigohotel.com/ref?id=${affiliateId}`;
  const mainLink = referralCode 
    ? `https://aigohotel.com/ref/${referralCode}`
    : defaultLink;
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: '微信群推广', parameter: 'wechat_group_1', link: `${mainLink}?campaign=wechat_group_1`, clicks: 245, orders: 12 },
    { id: '2', name: '小红书文章A', parameter: 'xiaohongshu_article_a', link: `${mainLink}?campaign=xiaohongshu_article_a`, clicks: 189, orders: 8 },
  ]);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignParam, setNewCampaignParam] = useState('');
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [showMainQRCode, setShowMainQRCode] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(mainLink);
    toast.success('推广链接已复制到剪贴板');
  };
  
  const copyDefaultLink = () => {
    navigator.clipboard.writeText(defaultLink);
    toast.success('默认链接已复制');
  };

  // 模拟全局唯一性校验
  const checkCodeAvailability = async (code: string) => {
    if (!code || code.length < 3) {
      setCodeAvailable(null);
      return;
    }
    
    setIsCheckingCode(true);
    setTimeout(() => {
      const isAvailable = !['admin', 'test', 'demo', 'api', 'ethan'].includes(code.toLowerCase());
      setCodeAvailable(isAvailable);
      setIsCheckingCode(false);
    }, 500);
  };

  const handleCodeChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setReferralCode(sanitized);
    checkCodeAvailability(sanitized);
  };

  const saveReferralCode = () => {
    if (!referralCode || referralCode.length < 3) {
      toast.error('推广代码至少需要3个字符');
      return;
    }
    if (codeAvailable === false) {
      toast.error('该代码已被使用，请选择其他代码');
      return;
    }
    // 更新所有campaign链接
    const newMainLink = `https://aigohotel.com/ref/${referralCode}`;
    setCampaigns(campaigns.map(c => ({
      ...c,
      link: `${newMainLink}?campaign=${c.parameter}`
    })));
    setIsEditingCode(false);
    toast.success('推广代码已保存');
  };

  const addCampaign = () => {
    if (!newCampaignName.trim() || !newCampaignParam.trim()) {
      toast.error('请填写活动名称和参数');
      return;
    }
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaignName,
      parameter: newCampaignParam,
      link: `${mainLink}?campaign=${newCampaignParam}`,
      clicks: 0,
      orders: 0,
    };
    setCampaigns([...campaigns, newCampaign]);
    setNewCampaignName('');
    setNewCampaignParam('');
    setShowCampaignDialog(false);
    toast.success('推广活动已创建');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('活动已删除');
  };

  // 模拟酒店搜索 - 支持酒店名称和酒店ID
  const searchHotels = (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    // 模拟API调用
    setTimeout(() => {
      const mockHotels: Hotel[] = [
        { id: 'HTL001', name: '上海外滩华尔道夫酒店', city: '上海', country: '中国' },
        { id: 'HTL002', name: '北京瑰丽酒店', city: '北京', country: '中国' },
        { id: 'HTL003', name: '三亚亚特兰蒂斯酒店', city: '三亚', country: '中国' },
        { id: 'HTL004', name: '成都香格里拉大酒店', city: '成都', country: '中国' },
        { id: 'HTL005', name: '广州丽思卡尔顿酒店', city: '广州', country: '中国' },
        { id: 'HTL006', name: '上海浦东丽思卡尔顿酒店', city: '上海', country: '中国' },
        { id: 'HTL007', name: '北京四季酒店', city: '北京', country: '中国' },
        { id: 'HTL008', name: '杭州西湖四季酒店', city: '杭州', country: '中国' },
        { id: 'HTL009', name: '深圳瑞吉酒店', city: '深圳', country: '中国' },
        { id: 'HTL010', name: '苏州W酒店', city: '苏州', country: '中国' },
        { id: 'HTL011', name: '三亚海棠湾康莱德酒店', city: '三亚', country: '中国' },
        { id: 'HTL012', name: '上海浦东香格里拉大酒店', city: '上海', country: '中国' },
        { id: 'HTL013', name: '北京柏悦酒店', city: '北京', country: '中国' },
        { id: 'HTL014', name: '广州四季酒店', city: '广州', country: '中国' },
        { id: 'HTL015', name: '成都尼依格罗酒店', city: '成都', country: '中国' },
      ];
      
      const queryLower = query.toLowerCase();
      // 支持通过酒店名称、城市或酒店ID搜索
      const filtered = mockHotels.filter(h => 
        h.name.toLowerCase().includes(queryLower) ||
        h.city.toLowerCase().includes(queryLower) ||
        h.id.toLowerCase().includes(queryLower)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);
  };

  const selectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setSearchResults([]);
    setHotelSearchQuery(hotel.name);
  };

  const generateHotelLink = () => {
    if (!selectedHotel) {
      toast.error('请先选择酒店');
      return;
    }
    const baseLink = useCustomLink && referralCode ? `https://aigohotel.com/ref/${referralCode}` : `https://aigohotel.com/ref?id=${affiliateId}`;
    const hotelLink = `${baseLink}?hotelId=${selectedHotel.id}`;
    navigator.clipboard.writeText(hotelLink);
    toast.success('酒店推广链接已复制到剪贴板');
  };

  const clearHotelSelection = () => {
    setSelectedHotel(null);
    setHotelSearchQuery('');
    setSearchResults([]);
  };

  // 微信小程序推广相关
  const miniProgramAppId = 'wx336dcaf6a1ecf632';
  const miniProgramPath = `/page/home/index/index?wxrefid=2000192094&tab=1&appid=${miniProgramAppId}`;
  
  const downloadMiniProgramQRCode = () => {
    toast.success('二维码图片已下载');
  };

  const copyCampaignLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('活动链接已复制');
  };

  const generateMainQRCode = () => {
    setShowMainQRCode(true);
    toast.success('主推广链接二维码已生成');
  };

  const generateQRCode = (campaignId: string) => {
    setShowQRCode(campaignId);
    toast.success('活动二维码已生成');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航和归属关系 */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>推广链接</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* 归属关系选择器和佣金政策 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <Label className="text-sm text-gray-600">归属关系：</Label>
            <Select value={merchantAffiliation} disabled>
              <SelectTrigger className="w-[180px] h-9 opacity-70 cursor-not-allowed">
                <SelectValue placeholder="选择商户" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dida道旅AI">Dida道旅AI</SelectItem>
                <SelectItem value="其他商户1">其他商户1</SelectItem>
                <SelectItem value="其他商户2">其他商户2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCommissionPolicy(true)}
            className="flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            佣金政策
          </Button>
        </div>
      </div>

      {/* 推广链接管理 */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Link2 className="w-5 h-5" />
            推广链接
          </CardTitle>
          <CardDescription>
            选择推广方式：H5页面推广或微信小程序推广
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={promotionTab} onValueChange={setPromotionTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="h5">H5页面推广</TabsTrigger>
              <TabsTrigger value="miniprogram">微信小程序推广</TabsTrigger>
            </TabsList>

            {/* H5页面推广 Tab */}
            <TabsContent value="h5" className="space-y-4 mt-4">
              {/* 系统生成的推广链接 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>系统生成的推广链接</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                    className="opacity-50 cursor-not-allowed"
                    title="仅特定用户可修改推广链接"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    修改
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <code className="text-base text-gray-900 break-all">
                    {defaultLink}
                  </code>
                </div>
                <p className="text-sm text-gray-500">
                  系统为您生成的推广链接，确保100%准确归因。
                </p>
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center gap-2">
                <Button onClick={copyDefaultLink} style={{ backgroundColor: '#9333ea', color: 'white' }}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制链接
                </Button>
                <Button onClick={generateMainQRCode} style={{ backgroundColor: '#9333ea', color: 'white' }}>
                  <QrCode className="w-4 h-4 mr-2" />
                  生成二维码
                </Button>
              </div>

              {/* 主推广链接二维码显示 */}
              {showMainQRCode && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-4">
                    {/* 左侧：二维码 */}
                    <div className="flex-shrink-0">
                      <div className="w-36 h-36 bg-white rounded-lg flex items-center justify-center border border-purple-300">
                        <QrCode className="w-24 h-24 text-purple-400" />
                      </div>
                    </div>
                    
                    {/* 右侧：信息区域 */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-purple-900 mb-1">
                          H5推广链接二维码
                        </p>
                        <p className="text-xs text-purple-700 break-all font-mono">
                          {defaultLink}
                        </p>
                      </div>
                      
                      {/* 按钮区域 */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowMainQRCode(false)}
                        >
                          关闭
                        </Button>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: '#9333ea', color: 'white' }}
                        >
                          下载二维码
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* 微信小程序推广 Tab */}
            <TabsContent value="miniprogram" className="space-y-4 mt-4">
              {/* 二维码展示区域 - 紧凑布局 */}
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                {/* 左侧：二维码 */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-white rounded-lg border-2 border-green-300 flex items-center justify-center p-2">
                    {/* Mock 二维码图片 */}
                    <div className="relative w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5 p-1">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-sm ${
                              Math.random() > 0.5 ? 'bg-green-800' : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="relative z-10 w-8 h-8 bg-white rounded flex items-center justify-center border border-green-600">
                        <Smartphone className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧：信息和按钮 */}
                <div className="flex-1 space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">微信小程序链接</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                      <p className="text-xs text-gray-600 mb-1 font-medium">路径：</p>
                      <code className="text-xs text-gray-900 break-all block">
                        {miniProgramPath}
                      </code>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">AppID</Label>
                    <div className="mt-1 p-2 bg-white rounded border">
                      <code className="text-xs text-gray-900 font-mono">
                        {miniProgramAppId}
                      </code>
                    </div>
                  </div>

                  <Button 
                    onClick={downloadMiniProgramQRCode} 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载大图
                  </Button>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-base text-gray-700">
                    <p className="font-medium mb-1 text-gray-900">微信小程序推广链接</p>
                    <p className="text-sm text-gray-600">用户扫描此二维码后会自动进入小程序，推广关系会自动绑定到您的账号。适合线下推广场景使用。</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 酒店推广链接生成 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="w-5 h-5" />
            酒店推广链接
          </CardTitle>
          <CardDescription>
            为特定酒店生成推广链接，提高转化率
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 酒店搜索 */}
          <div className="space-y-2">
            <Label htmlFor="hotel-search">搜索酒店</Label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="hotel-search"
                    value={hotelSearchQuery}
                    onChange={(e) => {
                      setHotelSearchQuery(e.target.value);
                      searchHotels(e.target.value);
                    }}
                    placeholder="输入酒店名称、酒店ID或城市搜索（如：HTL001 或 上海）"
                    className="pl-10"
                  />
                </div>
                {selectedHotel && (
                  <Button variant="outline" size="sm" onClick={clearHotelSelection}>
                    清除
                  </Button>
                )}
              </div>
              
              {/* 搜索结果下拉 */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectHotel(hotel)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{hotel.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{hotel.city}, {hotel.country}</div>
                        </div>
                        <div className="ml-3">
                          <Badge variant="outline" className="text-xs font-mono">{hotel.id}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-3 text-center text-sm text-gray-500">
                  搜索中...
                </div>
              )}
            </div>
          </div>

          {/* 选中的酒店 */}
          {selectedHotel && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">已选择酒店</p>
                  <p className="text-sm text-blue-800">{selectedHotel.name}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    酒店ID: {selectedHotel.id} | {selectedHotel.city}, {selectedHotel.country}
                  </p>
                  <div className="mt-3 p-2 bg-white rounded border">
                    <p className="text-xs text-gray-600 mb-1">生成的链接：</p>
                    <code className="text-xs break-all text-gray-900">
                      {useCustomLink && referralCode 
                        ? `https://aigohotel.com/ref/${referralCode}?hotelId=${selectedHotel.id}`
                        : `https://aigohotel.com/ref?id=${affiliateId}&hotelId=${selectedHotel.id}`
                      }
                    </code>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button onClick={generateHotelLink} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="w-3 h-3 mr-2" />
                  复制酒店链接
                </Button>
              </div>
            </div>
          )}

          {!selectedHotel && (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Hotel className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>搜索并选择酒店以生成专属推广链接</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 自定义推广活动 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>自定义推广活动</CardTitle>
              <CardDescription className="mt-2">
                为不同渠道创建带参数的推广链接，精准追踪每个渠道的效果
              </CardDescription>
            </div>
            <Button onClick={() => setShowCampaignDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              创建活动
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">还没有创建推广活动</p>
              <Button onClick={() => setShowCampaignDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                创建第一个活动
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活动名称</TableHead>
                  <TableHead>参数</TableHead>
                  <TableHead>点击数</TableHead>
                  <TableHead>转化订单</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{campaign.parameter}</code>
                    </TableCell>
                    <TableCell>{campaign.clicks}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.orders} 单</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCampaignLink(campaign.link)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          复制
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateQRCode(campaign.id)}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          二维码
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {showQRCode && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border-2 border-dashed">
              <div className="text-center">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 border">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {campaigns.find(c => c.id === showQRCode)?.name} - 推广二维码
                </p>
                <Button variant="outline" size="sm" onClick={() => setShowQRCode(null)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 推广建议 - 可折叠 */}
      <Collapsible open={isTipsOpen} onOpenChange={setIsTipsOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">推广建议</span>
                </div>
                {isTipsOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mt-0.5">
                1
              </span>
              <div>
                <p className="font-medium mb-1">社交媒体分享</p>
                <p className="text-blue-700">在微信、微博、小红书等平台分享您的专属链接，让更多人看到</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mt-0.5">
                2
              </span>
              <div>
                <p className="font-medium mb-1">内容营销</p>
                <p className="text-blue-700">创建关于酒店推荐、旅行攻略的内容，自然植入推广链接</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mt-0.5">
                3
              </span>
              <div>
                <p className="font-medium mb-1">社群推广</p>
                <p className="text-blue-700">在旅行相关的论坛、群组中分享您的体验和链接</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mt-0.5">
                4
              </span>
              <div>
                <p className="font-medium mb-1">私域流量</p>
                <p className="text-blue-700">向有出行需求的朋友、客户推荐使用您的专属链接预订</p>
              </div>
            </li>
          </ul>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 佣金政策对话框 */}
      <Dialog open={showCommissionPolicy} onOpenChange={setShowCommissionPolicy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              佣金政策 - {merchantAffiliation}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              以下是各国家/地区的酒店预订佣金率，佣金将根据实际成交订单金额计算。
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">国家/地区</TableHead>
                  <TableHead>佣金率</TableHead>
                  <TableHead>备注</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">🇨🇳 中国大陆</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">8%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">含港澳台地区</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇯🇵 日本</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">10%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">热门旅游目的地</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇰🇷 韩国</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">9%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇹🇭 泰国</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">12%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">东南亚热门</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇸🇬 新加坡</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">11%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇲🇾 马来西亚</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">10%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇺🇸 美国</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-blue-100 text-blue-800">7%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">北美地区</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇬🇧 英国</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-blue-100 text-blue-800">8%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">欧洲地区</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇫🇷 法国</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-blue-100 text-blue-800">8%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">欧洲地区</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🇦🇺 澳大利亚</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-purple-100 text-purple-800">9%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">大洋洲</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">🌍 其他国家</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-gray-100 text-gray-800">6%</Badge></TableCell>
                  <TableCell className="text-sm text-gray-600">默认佣金率</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">佣金说明</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 佣金按实际成交订单金额计算，不包含取消订单</li>
                    <li>• 佣金结算周期为每月1日，结算上月已完成入住的订单</li>
                    <li>• 佣金率可能根据市场情况调整，以实际结算时为准</li>
                    <li>• 特殊活动期间可能有额外佣金奖励</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCommissionPolicy(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>如何使用推广链接？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">1. 复制链接</h4>
              <p className="text-gray-600">点击"复制"按钮，将推广链接复制到剪贴板</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. 分享链接</h4>
              <p className="text-gray-600">将链接分享到您的社交媒体、网站、博客或直接发送给朋友</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. 用户预订</h4>
              <p className="text-gray-600">用户通过您的链接访问平台并成功预订酒店</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. 获得佣金</h4>
              <p className="text-gray-600">订单完成后，您将获得相应的佣金收益</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 创建活动对话框 */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>创建推广活动</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">活动名称 *</Label>
              <Input
                id="campaign-name"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="例如：微信群1推广"
              />
              <p className="text-xs text-gray-500">
                给这个活动起一个易识别的名称
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-param">参数标识 *</Label>
              <Input
                id="campaign-param"
                value={newCampaignParam}
                onChange={(e) => setNewCampaignParam(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="例如：wechat_group_1"
              />
              <p className="text-xs text-gray-500">
                只能包含字母、数字和下划线，用于追踪数据
              </p>
            </div>
            {newCampaignParam && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">生成的链接：</p>
                <code className="text-xs break-all">
                  {mainLink}?campaign={newCampaignParam}
                </code>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              取消
            </Button>
            <Button onClick={addCampaign}>
              创建活动
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
