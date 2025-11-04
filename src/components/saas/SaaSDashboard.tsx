import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  Copy, 
  QrCode, 
  ShoppingCart, 
  Settings, 
  Store,
  ArrowUpRight,
  DollarSign,
  Wallet,
  AlertCircle
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

// 模拟近30天利润数据
const profitTrendData = [
  { date: '10-02', profit: 1200 },
  { date: '10-03', profit: 1450 },
  { date: '10-04', profit: 1100 },
  { date: '10-05', profit: 1680 },
  { date: '10-06', profit: 1520 },
  { date: '10-07', profit: 1890 },
  { date: '10-08', profit: 2150 },
  { date: '10-09', profit: 1980 },
  { date: '10-10', profit: 2340 },
  { date: '10-11', profit: 2100 },
  { date: '10-12', profit: 1850 },
  { date: '10-13', profit: 2200 },
  { date: '10-14', profit: 2450 },
  { date: '10-15', profit: 2180 },
  { date: '10-16', profit: 2560 },
  { date: '10-17', profit: 2380 },
  { date: '10-18', profit: 2720 },
  { date: '10-19', profit: 2890 },
  { date: '10-20', profit: 2650 },
  { date: '10-21', profit: 3100 },
  { date: '10-22', profit: 2980 },
  { date: '10-23', profit: 3250 },
  { date: '10-24', profit: 3180 },
  { date: '10-25', profit: 3420 },
  { date: '10-26', profit: 3680 },
  { date: '10-27', profit: 3520 },
  { date: '10-28', profit: 3890 },
  { date: '10-29', profit: 4120 },
  { date: '10-30', profit: 4350 },
  { date: '10-31', profit: 4580 },
];

export function SaaSDashboard() {
  // 模拟用户数据 - 实际应从后端获取
  const [storeCode] = useState('ethan'); // 店铺代码，如果为null则未设置
  const [showQRCode, setShowQRCode] = useState(false);
  
  // SaaS模式只使用店铺代码，不使用推广ID
  const bookingUrl = storeCode 
    ? `https://aigohotel.com/s/${storeCode}`
    : ''; // 未设置店铺代码时为空
  const hasStoreCode = !!storeCode;

  // 计算KPI数据
  const todayProfit = profitTrendData[profitTrendData.length - 1].profit;
  const monthlyProfit = profitTrendData.reduce((sum, d) => sum + d.profit, 0);
  const availableBalance = 28650; // 可用余额/积分
  const newOrdersCount = 5;

  const copyBookingUrl = () => {
    if (!bookingUrl) {
      toast.error('请先设置店铺代码');
      return;
    }
    navigator.clipboard.writeText(bookingUrl);
    toast.success('专属预订站网址已复制');
  };
  
  const goToStoreConfig = () => {
    toast.info('正在跳转到品牌店铺配置...');
    // 实际应该跳转到配置页面
  };

  const generateQRCode = () => {
    setShowQRCode(true);
    toast.success('二维码已生成');
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

      {/* KPI 指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              今日预估利润
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">¥{todayProfit.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-green-600" />
              较昨日增长 5.3%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              本月累计利润
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">¥{monthlyProfit.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              共 {profitTrendData.length} 天营业数据
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Wallet className="w-4 h-4" />
              当前可用余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-600">¥{availableBalance.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              可提现或兑换积分
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 利润趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            利润趋势（近30天）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitTrendData}>
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
                formatter={(value: number) => [`¥${value.toLocaleString()}`, '利润']}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 专属预订站 - 最顶部最醒目 */}
      <Card className={`border-2 ${hasStoreCode ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${hasStoreCode ? 'text-purple-900' : 'text-orange-900'}`}>
            <Store className="w-5 h-5" />
            您的专属预订站
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasStoreCode ? (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={bookingUrl} 
                    readOnly 
                    className="flex-1 bg-white font-mono text-sm"
                  />
                  <Button onClick={copyBookingUrl} className="shrink-0 bg-purple-600 hover:bg-purple-700">
                    <Copy className="w-4 h-4 mr-2" />
                    复制网址
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
              <h3 className="text-lg font-semibold text-orange-900 mb-2">还未创建您的专属网址</h3>
              <p className="text-sm text-orange-700 mb-4">
                设置一个简短、易记的店铺代码，生成您的专属品牌预订站网址！
              </p>
              <p className="text-xs text-gray-600 mb-4">
                例如：https://aigohotel.com/s/<span className="font-semibold text-orange-700">您的店铺代码</span>
              </p>
              <Button onClick={goToStoreConfig} size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Settings className="w-4 h-4 mr-2" />
                前往品牌店铺配置
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {showQRCode && hasStoreCode && (
            <div className="flex items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed border-purple-300">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">扫描二维码访问您的预订站</p>
                <p className="text-xs text-gray-500 mt-1">{bookingUrl}</p>
              </div>
            </div>
          )}

          {hasStoreCode && (
            <div className="text-sm text-purple-800 bg-purple-100 p-3 rounded-lg">
              <p className="font-medium mb-1">🌟 专属预订站优势</p>
              <ul className="space-y-1 text-xs">
                <li>• 展示您的品牌 Logo 和专属风格</li>
                <li>• 提供完整的酒店预订服务</li>
                <li>• 所有订单自动归属于您，获得佣金</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">新订单</p>
                <p className="text-2xl font-bold">{newOrdersCount}</p>
              </div>
              {newOrdersCount > 0 && (
                <Badge variant="destructive" className="shrink-0">
                  待处理
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">快速设置</p>
                <p className="text-lg font-semibold">加价策略</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">进入配置</p>
                <p className="text-lg font-semibold">品牌店铺</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">账户设置</p>
                <p className="text-lg font-semibold">个人中心</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
