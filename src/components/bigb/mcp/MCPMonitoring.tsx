import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { TrendingUp, Activity, AlertCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb';

// 近7天的API调用数据
const apiCallsData = [
  { date: '10-25', calls: 1200 },
  { date: '10-26', calls: 1450 },
  { date: '10-27', calls: 1100 },
  { date: '10-28', calls: 1680 },
  { date: '10-29', calls: 1520 },
  { date: '10-30', calls: 1890 },
  { date: '10-31', calls: 2150 },
];

export function MCPMonitoring() {
  const totalCalls = apiCallsData.reduce((sum, d) => sum + d.calls, 0);
  const currentRequests = 5;
  const maxConcurrent = 20;
  const usageRate = (currentRequests / maxConcurrent) * 100;
  const isWarning = usageRate >= 80;

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>用量监控</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 1. API调用量图表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                API调用量（近7天）
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                每日API调用次数统计
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">总调用量</p>
              <p className="text-3xl font-bold text-blue-600">{totalCalls.toLocaleString()}</p>
              <p className="text-xs text-gray-500">次</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiCallsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [`${value.toLocaleString()} 次`, 'API调用']}
              />
              <Bar 
                dataKey="calls" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center mt-4">
            鼠标悬停在柱状图上查看每日详细数据
          </p>
        </CardContent>
      </Card>

      {/* 2. 并发请求数状态 */}
      <Card className={isWarning ? 'border-amber-300' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            并发请求监控
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            实时监控当前活跃的API请求数量
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 并发数显示 */}
          <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-2">当前并发请求数</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
                  {currentRequests}
                </span>
                <span className="text-2xl text-gray-400">/</span>
                <span className="text-2xl text-gray-600">{maxConcurrent}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={isWarning ? 'destructive' : 'secondary'} className="mb-2">
                {usageRate.toFixed(0)}% 使用率
              </Badge>
              <p className="text-xs text-gray-500">套餐并发上限</p>
            </div>
          </div>

          {/* 进度条 */}
          <div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isWarning ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${usageRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{maxConcurrent} 请求/秒</span>
            </div>
          </div>

          {/* 预警提示 */}
          {isWarning && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 mb-1">
                  并发使用率较高
                </p>
                <p className="text-sm text-amber-800">
                  当前并发使用率已超过80%，建议升级套餐以获得更高的并发处理能力。
                </p>
              </div>
            </div>
          )}

          {/* 升级套餐按钮 */}
          <div className="pt-2">
            <Button className="w-full" size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              升级套餐，提升并发上限
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              升级至专业版可获得100并发/秒的处理能力
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 套餐信息 */}
      <Card>
        <CardHeader>
          <CardTitle>当前套餐</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">套餐类型</span>
              <Badge>基础版</Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">并发上限</span>
              <span className="font-medium">{maxConcurrent} 请求/秒</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">调用限制</span>
              <span className="font-medium">无限制</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">数据更新</span>
              <span className="font-medium">实时更新</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
