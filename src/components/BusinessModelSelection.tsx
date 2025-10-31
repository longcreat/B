import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Code, Globe, Share2 } from 'lucide-react';

type BusinessModel = 'mcp' | 'saas' | 'affiliate';

interface BusinessModelSelectionProps {
  onSelect: (model: BusinessModel) => void;
  selectedModel?: BusinessModel | null;
}

export function BusinessModelSelection({ onSelect, selectedModel }: BusinessModelSelectionProps) {
  const businessModels = [
    {
      id: 'mcp' as const,
      title: 'MCP - 大模型与API集成',
      description: '通过标准化的上下文协议与高性能API，让您的大模型Agent或应用具备酒店查询与预订能力。',
      targetAudience: '开发者、AI工程师、科技公司',
      icon: Code,
      recommended: true,
    },
    {
      id: 'saas' as const,
      title: '品牌预订站 (SaaS方案)',
      description: '（适合建立自有品牌） 无需代码，即可生成一个带有您专属Logo和风格的独立预订网站。为您的粉丝和客户提供一个专业、可信赖的预订平台。',
      targetAudience: '旅游博主、KOL、中小型OTA、旅行顾问、任何希望打造自有预订品牌的用户',
      icon: Globe,
      recommended: false,
    },
    {
      id: 'affiliate' as const,
      title: '联盟推广计划',
      description: '（适合快速流量变现） 获取您的专属推广链接并直接分享。这是将您的内容、社群或客户资源最快、最简单地转化为佣金收入的方式。',
      targetAudience: '内容创作者、社群群主、公司采购代理、任何希望通过简单分享来赚取佣金的用户',
      icon: Share2,
      recommended: false,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {businessModels.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all border-2 relative group ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50 shadow-xl'
                : 'hover:shadow-xl hover:border-blue-300'
            }`}
            onClick={() => onSelect(model.id)}
          >
            {model.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-blue-600 hover:bg-blue-700 px-4 py-1">
                  推荐
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  model.recommended ? 'bg-blue-100' : 'bg-gray-100'
                } group-hover:scale-110 transition-transform`}>
                  <model.icon className={`w-8 h-8 ${
                    model.recommended ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>

              <h3 className="text-center mb-3">{model.title}</h3>
              
              <p className="text-gray-600 mb-4 min-h-[100px]">
                {model.description}
              </p>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-500">
                  <span className="block mb-1">适用人群：</span>
                  <span className="text-gray-700">{model.targetAudience}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  );
}
