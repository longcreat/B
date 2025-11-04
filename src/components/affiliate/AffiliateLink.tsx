import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Link2, Copy, Edit2, Check, Edit, Lightbulb, Plus, Trash2, QrCode } from 'lucide-react';
import { toast } from 'sonner';
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

interface Campaign {
  id: string;
  name: string;
  parameter: string;
  link: string;
  clicks: number;
  orders: number;
}

export function AffiliateLink() {
  // 模拟用户数据
  const [referralCode, setReferralCode] = useState('flywithelsa'); // 个性化推广代码
  const [affiliateId] = useState('a8x3p7q'); // 系统生成的推广ID
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeAvailable, setCodeAvailable] = useState<boolean | null>(null);
  
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

  const copyCampaignLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('活动链接已复制');
  };

  const generateQRCode = (campaignId: string) => {
    setShowQRCode(campaignId);
    toast.success('二维码已生成');
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>推广物料</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* A. 默认推广链接 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            A. 默认推广链接
          </CardTitle>
          <CardDescription>
            系统为您生成的推广链接，确保100%准确归因。此链接作为备用和内部追踪依据。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={defaultLink} readOnly className="flex-1 font-mono text-sm bg-gray-50" />
            <Button onClick={copyDefaultLink} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              复制
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* B. 主推广链接（个性化） */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Link2 className="w-5 h-5" />
            B. 主推广链接（个性化）
          </CardTitle>
          <CardDescription>
            这是您最主要的推广工具。设置一个简短、易记的个性化代码，体现您的个人品牌。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 推广代码设置 */}
          <div className="space-y-2">
            <Label htmlFor="referralCode">推广代码 *</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">https://aigohotel.com/ref/</span>
                <Input
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  disabled={!isEditingCode}
                  placeholder="例如：flywithelsa"
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
                {isEditingCode ? (
                  <>
                    <Button onClick={saveReferralCode} size="sm">保存</Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingCode(false)}>取消</Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingCode(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                只能包含小写字母、数字和连字符，至少3个字符。此代码全局唯一。
              </p>
              {referralCode && codeAvailable === true && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-800 font-medium mb-1">您的个性化推广链接：</p>
                  <code className="text-sm text-purple-900 break-all">
                    {mainLink}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="flex items-center gap-2">
            <Button onClick={copyLink} className="bg-purple-600 hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-2" />
              复制个性化链接
            </Button>
            <Button onClick={generateQRCode} variant="outline">
              <QrCode className="w-4 h-4 mr-2" />
              生成二维码
            </Button>
          </div>
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

      {/* 推广建议 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Lightbulb className="w-5 h-5" />
            推广建议
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      </Card>

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
