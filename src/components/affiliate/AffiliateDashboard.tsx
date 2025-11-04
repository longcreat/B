import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Link2, 
  Copy, 
  QrCode, 
  Wallet, 
  Lock, 
  TrendingUp,
  Gift,
  ArrowUpRight,
  AlertCircle,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 模拟近30天积分收益数据
const pointsTrendData = [
  { date: '10-02', points: 120 },
  { date: '10-03', points: 145 },
  { date: '10-04', points: 110 },
  { date: '10-05', points: 168 },
  { date: '10-06', points: 152 },
  { date: '10-07', points: 189 },
  { date: '10-08', points: 215 },
  { date: '10-09', points: 198 },
  { date: '10-10', points: 234 },
  { date: '10-11', points: 210 },
  { date: '10-12', points: 185 },
  { date: '10-13', points: 220 },
  { date: '10-14', points: 245 },
  { date: '10-15', points: 218 },
  { date: '10-16', points: 256 },
  { date: '10-17', points: 238 },
  { date: '10-18', points: 272 },
  { date: '10-19', points: 289 },
  { date: '10-20', points: 265 },
  { date: '10-21', points: 310 },
  { date: '10-22', points: 298 },
  { date: '10-23', points: 325 },
  { date: '10-24', points: 318 },
  { date: '10-25', points: 342 },
  { date: '10-26', points: 368 },
  { date: '10-27', points: 352 },
  { date: '10-28', points: 389 },
  { date: '10-29', points: 412 },
  { date: '10-30', points: 435 },
  { date: '10-31', points: 458 },
];

export function AffiliateDashboard() {
  // 模拟用户数据 - 实际应从后端获取
  const [referralCode] = useState('flywithelsa'); // 个性化推广代码，如果为null则未设置
  const [affiliateId] = useState('a8x3p7q'); // 系统生成的推广ID
  const [showQRCode, setShowQRCode] = useState(false);
  
  // 根据是否设置了推广代码生成不同的链接
  const defaultLink = `https://aigohotel.com/ref?id=${affiliateId}`;
  const mainLink = referralCode 
    ? `https://aigohotel.com/ref/${referralCode}`
    : defaultLink;
  const hasReferralCode = !!referralCode;

  // 积分账户数据
  const availablePoints = 28650; // 可用积分
  const frozenPoints = 1600; // 冻结积分
  const totalPoints = 45280; // 累计总积分

  const copyLink = () => {
    navigator.clipboard.writeText(mainLink);
    toast.success(hasReferralCode ? '个性化链接已复制' : '默认链接已复制');
  };
  
  const goToLinkConfig = () => {
    toast.info('正在跳转到推广物料配置...');
    // 实际应该跳转到配置页面
  };

  const generateQRCode = () => {
    setShowQRCode(true);
    toast.success('二维码已生成');
  };

  const goToPointsMall = () => {
    toast.info('正在跳转到积分商城...');
    // window.open('/points-mall', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>业务概览</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 专属推广链接 - 最顶部最醒目 */}
      <Card className={`border-2 ${hasReferralCode ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${hasReferralCode ? 'text-purple-900' : 'text-orange-900'}`}>
            <Link2 className="w-5 h-5" />
            {hasReferralCode ? '您的个性化推广链接' : '您的推广链接'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasReferralCode ? (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={mainLink} 
                    readOnly 
                    className="flex-1 bg-white font-mono text-sm"
                  />
                  <Button onClick={copyLink} className="shrink-0 bg-purple-600 hover:bg-purple-700">
                    <Copy className="w-4 h-4 mr-2" />
                    复制链接
                  </Button>
                  <Button onClick={generateQRCode} variant="outline" className="shrink-0">
                    <QrCode className="w-4 h-4 mr-2" />
                    生成二维码
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-orange-900 mb-2">还未创建个性化链接</h3>
              <p className="text-sm text-orange-700 mb-4">
                设置一个简短、易记的推广代码，体现您的个人品牌，提升点击率！
              </p>
              <div className="bg-white p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-600 mb-1">当前使用默认推广链接：</p>
                <code className="text-xs break-all text-gray-700">{defaultLink}</code>
                <p className="text-xs text-gray-500 mt-2">此链接作为备用和内部追踪依据</p>
              </div>
              <Button onClick={goToLinkConfig} size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Settings className="w-4 h-4 mr-2" />
                前往推广物料配置
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {showQRCode && hasReferralCode && (
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed border-purple-300">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">扫描二维码访问您的推广链接</p>
                <p className="text-xs text-gray-500 mt-1">{mainLink}</p>
              </div>
            </div>
          )}

          {hasReferralCode && (
            <div className="text-sm text-purple-800 bg-purple-100 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 推广技巧</p>
              <ul className="space-y-1 text-xs">
                <li>• 在社交媒体（微信、微博、小红书）分享您的链接</li>
                <li>• 创建旅行攻略内容，自然植入推广链接</li>
                <li>• 打印二维码海报，放置在线下活动现场</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 核心收益指标 (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <Wallet className="w-4 h-4" />
              可用积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-green-600">{availablePoints.toLocaleString()}</span>
              <span className="text-sm text-green-600">分</span>
            </div>
            <p className="text-xs text-green-700">可立即兑换商品或服务</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Lock className="w-4 h-4" />
              冻结积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-orange-600">{frozenPoints.toLocaleString()}</span>
              <span className="text-sm text-orange-600">分</span>
            </div>
            <p className="text-xs text-orange-700">待过安全期后解冻</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <TrendingUp className="w-4 h-4" />
              累计总积分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-blue-600">{totalPoints.toLocaleString()}</span>
              <span className="text-sm text-blue-600">分</span>
            </div>
            <p className="text-xs text-blue-700">历史累计收益</p>
          </CardContent>
        </Card>
      </div>

      {/* 业绩趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            积分收益趋势（近30天）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} 积分`, '新增收益']}
              />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 核心行动召唤 (CTA) */}
      <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-pink-900 mb-1 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                立即兑换您的积分收益
              </h3>
              <p className="text-sm text-pink-700">
                当前可用积分 <span className="font-bold text-lg">{availablePoints.toLocaleString()}</span> 分，可兑换精选商品、酒店券、现金等
              </p>
            </div>
            <Button 
              onClick={goToPointsMall} 
              size="lg" 
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shrink-0"
            >
              <Gift className="w-4 h-4 mr-2" />
              前往积分商城
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">今日新增积分</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{pointsTrendData[pointsTrendData.length - 1].points}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">本月累计积分</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pointsTrendData.reduce((sum, d) => sum + d.points, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">推广转化率</p>
                <p className="text-2xl font-bold text-green-600">7.2%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
