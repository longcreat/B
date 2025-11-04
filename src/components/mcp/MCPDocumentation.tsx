import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ExternalLink, BookOpen, FileText, Code, HelpCircle, Mail, MessageCircle } from 'lucide-react';

export function MCPDocumentation() {
  const docLinks = [
    {
      title: 'MCP快速开始',
      description: '了解如何在5分钟内接入MCP服务',
      url: 'https://docs.aigohotel.com/mcp/getting-started',
      icon: BookOpen,
    },
    {
      title: 'MCP接口文档',
      description: '完整的接口说明和参数定义',
      url: 'https://docs.aigohotel.com/mcp/reference',
      icon: FileText,
    },
    {
      title: '酒店资源查询',
      description: '查询酒店信息、价格、库存接口',
      url: 'https://docs.aigohotel.com/mcp/hotel-query',
      icon: Code,
    },
    {
      title: '代码示例',
      description: '多语言SDK和实际应用示例',
      url: 'https://docs.aigohotel.com/mcp/examples',
      icon: Code,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-2">文档与支持</h2>
        <p className="text-gray-600">获取技术文档、查看服务信息、联系技术支持</p>
      </div>

      {/* 1. 集成文档入口 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            MCP技术文档
          </CardTitle>
          <CardDescription>
            完整的MCP接口文档、集成指南和最佳实践
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docLinks.map((doc) => {
              const Icon = doc.icon;
              return (
                <a
                  key={doc.title}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </a>
              );
            })}
          </div>

          {/* 主文档入口 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">完整API文档站</h4>
                <p className="text-sm text-blue-700">
                  访问我们的完整技术文档，包含所有接口定义、参数说明和使用示例
                </p>
              </div>
              <Button asChild>
                <a
                  href="https://docs.aigohotel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  访问文档
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 基础信息展示 */}
      <Card>
        <CardHeader>
          <CardTitle>服务信息</CardTitle>
          <CardDescription>
            您的当前套餐计划、结算方式和佣金策略
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">服务类型</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">MCP模式</Badge>
                <span className="font-medium">酒店资源查询服务</span>
              </div>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">当前套餐</span>
              <span className="font-medium">基础版</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">API端点</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                https://api.aigohotel.com/mcp/v1
              </code>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">调用限制</span>
              <span className="font-medium">无限制（监控异常模式）</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">并发上限</span>
              <span className="font-medium">20 请求/秒</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">数据更新频率</span>
              <span className="font-medium">实时更新</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">结算方式</span>
              <span className="font-medium">按订单结算</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">默认佣金策略</span>
              <span className="font-medium">订单金额的 8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. 技术支持 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            技术支持
          </CardTitle>
          <CardDescription>
            遇到问题？我们的技术团队随时为您提供帮助
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">邮件支持</h4>
                  <p className="text-sm text-gray-600">24小时内响应</p>
                </div>
              </div>
              <a
                href="mailto:mcp-support@aigohotel.com"
                className="text-blue-600 hover:underline text-sm"
              >
                mcp-support@aigohotel.com
              </a>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">在线客服</h4>
                  <p className="text-sm text-gray-600">工作日 9:00-18:00</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                开始对话
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">常见问题</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  如何处理API调用失败？
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  如何优化API响应速度？
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  如何升级套餐？
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  查看更多常见问题 →
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
