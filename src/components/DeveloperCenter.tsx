import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Copy, Eye, EyeOff, Key, Trash2, AlertCircle, ExternalLink, TrendingUp, Activity, Clock, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

// Mock data for usage monitoring
const usageData = [
  { date: '10-01', calls: 1200, success: 1150, errors: 50, avgResponse: 245 },
  { date: '10-03', calls: 1450, success: 1420, errors: 30, avgResponse: 238 },
  { date: '10-05', calls: 1100, success: 1080, errors: 20, avgResponse: 252 },
  { date: '10-07', calls: 1680, success: 1650, errors: 30, avgResponse: 241 },
  { date: '10-09', calls: 1520, success: 1495, errors: 25, avgResponse: 236 },
  { date: '10-11', calls: 1390, success: 1365, errors: 25, avgResponse: 243 },
  { date: '10-13', calls: 1610, success: 1590, errors: 20, avgResponse: 239 },
  { date: '10-15', calls: 1730, success: 1710, errors: 20, avgResponse: 234 },
  { date: '10-17', calls: 1820, success: 1800, errors: 20, avgResponse: 237 },
  { date: '10-19', calls: 1560, success: 1540, errors: 20, avgResponse: 241 },
  { date: '10-21', calls: 1670, success: 1650, errors: 20, avgResponse: 238 },
  { date: '10-23', calls: 1890, success: 1870, errors: 20, avgResponse: 235 },
  { date: '10-25', calls: 1750, success: 1735, errors: 15, avgResponse: 240 },
  { date: '10-27', calls: 1920, success: 1905, errors: 15, avgResponse: 233 },
  { date: '10-29', calls: 2010, success: 1995, errors: 15, avgResponse: 231 },
  { date: '10-31', calls: 2150, success: 2138, errors: 12, avgResponse: 229 },
];

export function DeveloperCenter() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: '生产环境密钥',
      key: 'sk_live_4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0',
      createdAt: '2025-10-15',
      lastUsed: '2025-10-31 14:32',
      status: 'active',
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const generateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('请输入密钥名称');
      return;
    }

    const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '从未使用',
      status: 'active',
    };

    setApiKeys([...apiKeys, newKey]);
    setNewlyCreatedKey(key);
    setNewKeyName('');
    setShowCreateDialog(false);
    toast.success('API密钥创建成功');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(k => 
      k.id === keyId ? { ...k, status: 'revoked' as const } : k
    ));
    toast.success('密钥已停用');
  };

  const deleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== keyId));
    setKeyToDelete(null);
    toast.success('密钥已删除');
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(56);
  };

  const calculateSuccessRate = () => {
    const totalCalls = usageData.reduce((sum, d) => sum + d.calls, 0);
    const totalSuccess = usageData.reduce((sum, d) => sum + d.success, 0);
    return ((totalSuccess / totalCalls) * 100).toFixed(2);
  };

  const calculateAvgResponse = () => {
    const avg = usageData.reduce((sum, d) => sum + d.avgResponse, 0) / usageData.length;
    return avg.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">开发者中心</h1>
            <p className="text-gray-600">管理您的API密钥，监控使用情况，查看技术文档</p>
          </div>
          <Badge variant="outline" className="px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            MCP模式
          </Badge>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys">
              <Key className="w-4 h-4 mr-2" />
              API密钥管理
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <TrendingUp className="w-4 h-4 mr-2" />
              用量监控
            </TabsTrigger>
            <TabsTrigger value="docs">
              <ExternalLink className="w-4 h-4 mr-2" />
              文档与配置
            </TabsTrigger>
          </TabsList>

          {/* API Key Management */}
          <TabsContent value="keys" className="space-y-6">
            {/* Newly Created Key Alert */}
            {newlyCreatedKey && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-blue-900 mb-1">密钥已创建成功！</p>
                        <p className="text-blue-700 text-sm">
                          请立即复制并妥善保存此密钥。出于安全考虑，密钥仅完整显示一次。
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-white rounded border border-blue-200">
                        <code className="flex-1 text-sm break-all">{newlyCreatedKey}</code>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(newlyCreatedKey)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          复制
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewlyCreatedKey(null)}
                      >
                        我已保存
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API密钥列表</CardTitle>
                    <CardDescription className="mt-2">
                      管理您的API密钥，每个密钥都可以独立停用或删除
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Key className="w-4 h-4 mr-2" />
                    创建新密钥
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span>{apiKey.name}</span>
                          <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                            {apiKey.status === 'active' ? '活跃' : '已停用'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-gray-600">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>创建时间: {apiKey.createdAt}</span>
                          <span>最后使用: {apiKey.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {apiKey.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => revokeKey(apiKey.id)}
                          >
                            停用
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setKeyToDelete(apiKey.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">总调用量</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">
                      {usageData.reduce((sum, d) => sum + d.calls, 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">次</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">成功率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-green-600">{calculateSuccessRate()}%</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">错误总数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-red-600">
                      {usageData.reduce((sum, d) => sum + d.errors, 0)}
                    </span>
                    <span className="text-sm text-gray-500">次</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">平均响应时间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl">{calculateAvgResponse()}</span>
                    <span className="text-sm text-gray-500">ms</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Calls Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API调用趋势（近30天）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calls" stroke="#3b82f6" name="总调用量" strokeWidth={2} />
                    <Line type="monotone" dataKey="success" stroke="#22c55e" name="成功调用" strokeWidth={2} />
                    <Line type="monotone" dataKey="errors" stroke="#ef4444" name="错误调用" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>平均响应时间（近30天）</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgResponse" fill="#8b5cf6" name="响应时间 (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation & Configuration */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API技术文档</CardTitle>
                <CardDescription>
                  完整的API接口文档、集成指南和最佳实践
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://docs.example.com/api/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="mb-1">快速开始指南</h4>
                      <p className="text-sm text-gray-600">了解如何在5分钟内集成我们的API</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  <a
                    href="https://docs.example.com/api/reference"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="mb-1">API接口文档</h4>
                      <p className="text-sm text-gray-600">完整的接口说明和参数定义</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  <a
                    href="https://docs.example.com/api/examples"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="mb-1">代码示例</h4>
                      <p className="text-sm text-gray-600">多语言SDK和代码示例</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  <a
                    href="https://docs.example.com/api/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="mb-1">Webhook配置</h4>
                      <p className="text-sm text-gray-600">实时接收订单状态更新</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>基础配置信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">结算方式</span>
                    <span>按实际成交订单佣金结算</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">默认佣金比例</span>
                    <span>8% - 15%（根据酒店类型浮动）</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">结算周期</span>
                    <span>每月1日结算上月佣金</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">API请求限制</span>
                    <span>1000次/分钟</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">技术支持</span>
                    <span>7x24小时 | support@example.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Key Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>创建新的API密钥</AlertDialogTitle>
            <AlertDialogDescription>
              请为新密钥设置一个易于识别的名称，以便管理。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="keyName">密钥名称</Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="例如：生产环境密钥"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={generateApiKey}>创建</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Key Confirmation */}
      <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除密钥？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可撤销。删除后，使用此密钥的应用将无法继续访问API。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => keyToDelete && deleteKey(keyToDelete)}
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
