import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { Copy, Link2, TrendingUp, DollarSign, MousePointerClick, ShoppingCart, Percent, Edit, Eye, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SettlementRecord {
  id: string;
  month: string;
  amount: number;
  status: 'pending' | 'completed';
  settledAt?: string;
}

const performanceData = [
  { date: '10-25', clicks: 120, orders: 8, conversion: 6.67, commission: 680 },
  { date: '10-26', clicks: 145, orders: 10, conversion: 6.90, commission: 850 },
  { date: '10-27', clicks: 98, orders: 6, conversion: 6.12, commission: 520 },
  { date: '10-28', clicks: 168, orders: 12, conversion: 7.14, commission: 1020 },
  { date: '10-29', clicks: 152, orders: 11, conversion: 7.24, commission: 950 },
  { date: '10-30', clicks: 189, orders: 14, conversion: 7.41, commission: 1180 },
  { date: '10-31', clicks: 203, orders: 16, conversion: 7.88, commission: 1360 },
];

const settlementRecords: SettlementRecord[] = [
  { id: '1', month: '2025-09', amount: 12580, status: 'completed', settledAt: '2025-10-05' },
  { id: '2', month: '2025-10', amount: 8560, status: 'pending' },
];

export function AffiliateBackend() {
  const [affiliateLink, setAffiliateLink] = useState('https://booking.platform.com/ref/ABC123XYZ');
  const [customSuffix, setCustomSuffix] = useState('ABC123XYZ');
  const [isEditingSuffix, setIsEditingSuffix] = useState(false);
  const [dateRange, setDateRange] = useState('7');
  const [accountInfo, setAccountInfo] = useState({
    accountType: 'bank',
    bankName: '工商银行',
    bankBranch: '北京分行',
    bankCardNumber: '6222 **** **** 1234',
    accountHolder: '张三',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success('推广链接已复制到剪贴板');
  };

  const generateShortLink = () => {
    const shortLink = `https://bk.pt/ref/${customSuffix}`;
    toast.success('短链接已生成');
    return shortLink;
  };

  const updateCustomSuffix = () => {
    if (!customSuffix.trim()) {
      toast.error('请输入自定义后缀');
      return;
    }
    setAffiliateLink(`https://booking.platform.com/ref/${customSuffix}`);
    setIsEditingSuffix(false);
    toast.success('推广链接已更新');
  };

  const getDataByRange = () => {
    const days = parseInt(dateRange);
    return performanceData.slice(-days);
  };

  const calculateMetrics = () => {
    const data = getDataByRange();
    return {
      totalClicks: data.reduce((sum, d) => sum + d.clicks, 0),
      totalOrders: data.reduce((sum, d) => sum + d.orders, 0),
      totalCommission: data.reduce((sum, d) => sum + d.commission, 0),
      avgConversion: (data.reduce((sum, d) => sum + d.conversion, 0) / data.length).toFixed(2),
    };
  };

  const metrics = calculateMetrics();

  const pendingCommission = settlementRecords
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const settledCommission = settlementRecords
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">推广联盟后台</h1>
            <p className="text-gray-600">管理推广链接，查看效果数据和佣金收益</p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <Link2 className="w-4 h-4 mr-2" />
            直接挂链接模式
          </Badge>
        </div>

        <Tabs defaultValue="links" className="space-y-6">
          <TabsList>
            <TabsTrigger value="links">
              <Link2 className="w-4 h-4 mr-2" />
              推广链接
            </TabsTrigger>
            <TabsTrigger value="performance">
              <TrendingUp className="w-4 h-4 mr-2" />
              效果报表
            </TabsTrigger>
            <TabsTrigger value="commission">
              <DollarSign className="w-4 h-4 mr-2" />
              佣金与结算
            </TabsTrigger>
          </TabsList>

          {/* Promotion Links */}
          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>您的专属推广链接</CardTitle>
                <CardDescription>
                  分享此链接，用户通过链接预订成功后，您将获得佣金
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>推广链接</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={affiliateLink} readOnly className="flex-1" />
                    <Button onClick={copyLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>自定义链接后缀</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={customSuffix}
                      onChange={(e) => setCustomSuffix(e.target.value)}
                      disabled={!isEditingSuffix}
                      placeholder="自定义后缀（字母数字组合）"
                      className="flex-1"
                    />
                    {isEditingSuffix ? (
                      <>
                        <Button onClick={updateCustomSuffix}>保存</Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingSuffix(false)}
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingSuffix(true)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    自定义后缀让您的链接更容易记忆和分享
                  </p>
                </div>

                <div>
                  <Label>短链接生成</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={`https://bk.pt/ref/${customSuffix}`}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const shortLink = generateShortLink();
                        navigator.clipboard.writeText(shortLink);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制短链
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    短链接更适合在社交媒体和短信中分享
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>推广建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>在社交媒体上分享您的专属链接，让更多人看到</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>创建关于酒店推荐、旅行攻略的内容，自然植入推广链接</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>在旅行相关的论坛、群组中分享您的体验和链接</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>向有出行需求的朋友、客户推荐使用您的专属链接预订</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Report */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>效果数据概览</CardTitle>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">昨日</SelectItem>
                      <SelectItem value="7">近7日</SelectItem>
                      <SelectItem value="30">近30日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointerClick className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-900">链接点击数</span>
                    </div>
                    <p className="text-2xl text-blue-600">{metrics.totalClicks.toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-900">预订订单数</span>
                    </div>
                    <p className="text-2xl text-green-600">{metrics.totalOrders}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-900">平均转化率</span>
                    </div>
                    <p className="text-2xl text-purple-600">{metrics.avgConversion}%</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-900">预估佣金收入</span>
                    </div>
                    <p className="text-2xl text-orange-600">
                      ¥{metrics.totalCommission.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={getDataByRange()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="点击数"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="orders"
                      stackId="2"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                      name="订单数"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="commission"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                      name="佣金 (¥)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>每日详细数据</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead>点击数</TableHead>
                      <TableHead>订单数</TableHead>
                      <TableHead>转化率</TableHead>
                      <TableHead>预估佣金</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getDataByRange().reverse().map((day, index) => (
                      <TableRow key={index}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>{day.clicks}</TableCell>
                        <TableCell>{day.orders}</TableCell>
                        <TableCell>{day.conversion}%</TableCell>
                        <TableCell className="text-green-600">
                          ¥{day.commission.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission & Settlement */}
          <TabsContent value="commission" className="space-y-6">
            {/* Commission Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">可结算佣金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl text-orange-600">
                      ¥{pendingCommission.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    将在下个结算周期自动结算到您的账户
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">已结算佣金</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl text-green-600">
                      ¥{settledCommission.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">累计已结算到您账户的佣金</p>
                </CardContent>
              </Card>
            </div>

            {/* Settlement Records */}
            <Card>
              <CardHeader>
                <CardTitle>结算记录</CardTitle>
                <CardDescription>
                  每月1日结算上月佣金，3-5个工作日到账
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>结算月份</TableHead>
                      <TableHead>佣金金额</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>结算时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlementRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.month}</TableCell>
                        <TableCell className="text-green-600">
                          ¥{record.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={record.status === 'completed' ? 'default' : 'secondary'}
                          >
                            {record.status === 'completed' ? '已结算' : '待结算'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.settledAt || '预计 11月5日'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>收款账户信息</CardTitle>
                    <CardDescription className="mt-2">
                      佣金将结算到此账户，请确保信息准确
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    修改账户
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">账户类型</span>
                    <span>{accountInfo.accountType === 'bank' ? '银行卡' : '支付宝'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">开户银行</span>
                    <span>{accountInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">开户支行</span>
                    <span>{accountInfo.bankBranch}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">银行卡号</span>
                    <span>{accountInfo.bankCardNumber}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">开户人姓名</span>
                    <span>{accountInfo.accountHolder}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
