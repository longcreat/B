import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Key, Copy, Eye, EyeOff, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export function MCPConfiguration() {
  const [apiKey] = useState('sk-prod-ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv12wx34yz56');
  const [showFullKey, setShowFullKey] = useState(false);

  const maskKey = (key: string) => {
    if (showFullKey) return key;
    return `${key.substring(0, 12)}...${key.substring(key.length - 6)}`;
  };

  const copyToClipboard = (text: string, message: string = '已复制到剪贴板') => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const mcpConfig = {
    mcpServers: {
      "aigohotel-mcp-test": {
        name: "aigohotel-mcp-test",
        type: "streamableHttp",
        isActive: true,
        baseUrl: "https://mcp-test.aigohotel.com/mcp",
        headers: {
          "X-Secret-Key": apiKey
        }
      }
    }
  };

  const configJson = JSON.stringify(mcpConfig, null, 2);

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>MCP配置</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* A. API密钥管理 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API密钥管理
              </CardTitle>
              <CardDescription className="mt-2">
                这是您的AI Agent调用我们服务的唯一凭证
              </CardDescription>
            </div>
            <Badge variant="outline">生产环境</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 安全提示 */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-900 font-medium mb-1">安全提示</p>
              <p className="text-amber-800">
                请妥善保管您的API密钥，不要在公开代码中暴露。密钥泄露可能导致未授权访问。
              </p>
            </div>
          </div>

          {/* 密钥显示 */}
          <div>
            <label className="text-sm font-medium mb-2 block">您的API密钥</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
              <code className="flex-1 text-sm font-mono break-all">
                {maskKey(apiKey)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullKey(!showFullKey)}
                title={showFullKey ? '隐藏密钥' : '显示完整密钥'}
              >
                {showFullKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(apiKey, '密钥已复制！')}
                title="复制密钥"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              创建时间：2025-10-15 | 最后使用：2025-10-31 14:32
            </p>
          </div>

          {/* V1.1 规划提示 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>即将上线：</strong>完整密钥管理功能，支持创建多个密钥、添加备注、随时停用或删除。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* B. MCP集成协议 */}
      <Card>
        <CardHeader>
          <CardTitle>MCP集成代码</CardTitle>
          <CardDescription>
            即拷即用的JSON配置，API Key已自动填充，直接复制到您的AI系统配置文件中
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* JSON代码块 */}
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <Button
                size="sm"
                onClick={() => copyToClipboard(configJson, 'MCP配置已复制！')}
              >
                <Copy className="w-4 h-4 mr-2" />
                复制配置
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{configJson}</code>
            </pre>
          </div>

          {/* 集成说明 */}
          <div className="space-y-3">
            <h4 className="font-medium">如何使用此配置？</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>复制上方的JSON配置代码</li>
              <li>打开您的AI系统配置文件（通常是 <code className="px-1 py-0.5 bg-gray-100 rounded">config.json</code> 或 <code className="px-1 py-0.5 bg-gray-100 rounded">mcp-config.json</code>）</li>
              <li>将配置粘贴到 <code className="px-1 py-0.5 bg-gray-100 rounded">mcpServers</code> 字段中</li>
              <li>重启您的AI系统，MCP服务即可生效</li>
            </ol>
            <div className="flex items-center gap-2 pt-2">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <a
                href="https://docs.aigohotel.com/mcp/integration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                查看详细集成文档 →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
