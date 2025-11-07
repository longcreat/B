import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Code, Globe, Share2 } from 'lucide-react';
import React, { useMemo } from 'react';
import type { UserType } from './IdentityTypeSelection';
import type { CertificationType } from './CertificationTypeSelection';
import { getBusinessModelOptions, businessModelMetadata } from '../data/mockBusinessModelConfig';

export type BusinessModel = 'mcp' | 'saas' | 'affiliate';

interface BusinessModelSelectionProps {
  onSelect: (model: BusinessModel) => void;
  selectedModel?: BusinessModel | null;
  userType?: UserType | null; // 用户信息类型
  certificationType?: CertificationType | null; // 认证方式
}

export function BusinessModelSelection({ 
  onSelect, 
  selectedModel, 
  userType,
  certificationType 
}: BusinessModelSelectionProps) {
  // 从配置获取可用的业务模式
  const availableOptions = useMemo(() => {
    if (!userType || !certificationType) {
      return [];
    }
    return getBusinessModelOptions(userType, certificationType);
  }, [userType, certificationType]);

  // 业务模式显示配置
  const businessModelDisplayConfig = {
    mcp: {
      title: 'MCP - 大模型与API集成',
      description: '通过标准化的上下文协议与高性能API，让您的大模型Agent或应用具备酒店查询与预订能力。',
      targetAudience: '开发者、AI工程师、科技公司',
      icon: Code,
    },
    saas: {
      title: '品牌预订站 (SaaS方案)',
      description: '（适合建立自有品牌） 无需代码，即可生成一个带有您专属Logo和风格的独立预订网站。为您的粉丝和客户提供一个专业、可信赖的预订平台。',
      targetAudience: '旅游博主、KOL、中小型OTA、旅行顾问、任何希望打造自有预订品牌的用户',
      icon: Globe,
    },
    affiliate: {
      title: '联盟推广计划',
      description: '（适合快速流量变现） 获取您的专属推广链接并直接分享。这是将您的内容、社群或客户资源最快、最简单地转化为佣金收入的方式。',
      targetAudience: '内容创作者、社群群主、公司采购代理、任何希望通过简单分享来赚取佣金的用户',
      icon: Share2,
    },
  };

  // 如果没有选择用户类型或认证方式，显示提示
  if (!userType || !certificationType) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先完成用户信息类型和认证方式选择</p>
      </div>
    );
  }

  // 如果没有可用的业务模式，显示提示
  if (availableOptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">当前配置下没有可用的业务模式</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {availableOptions.map((option) => {
          const displayConfig = businessModelDisplayConfig[option.businessModel];
          const Icon = displayConfig.icon;
          const isRecommended = option.priority >= 3; // 优先级>=3的标记为推荐
          
          return (
            <Card
              key={option.businessModel}
              className={`cursor-pointer transition-all border relative group ${
                selectedModel === option.businessModel
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-gray-200 hover:shadow-md hover:border-blue-300 bg-white'
              }`}
              onClick={() => onSelect(option.businessModel)}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="outline" className="bg-blue-600 text-white border-blue-700 px-4 py-1">
                    推荐
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    selectedModel === option.businessModel
                      ? 'bg-blue-500'
                      : isRecommended 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      selectedModel === option.businessModel
                        ? 'text-white'
                        : isRecommended 
                          ? 'text-blue-600' 
                          : 'text-gray-600'
                    }`} />
                  </div>
                </div>

                <h3 className="text-center mb-3 text-lg font-semibold text-gray-900">{displayConfig.title}</h3>
                
                <p className="text-gray-600 mb-4 min-h-[100px] text-sm leading-relaxed">
                  {displayConfig.description}
                </p>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">
                    <span className="block mb-1 font-medium">适用人群：</span>
                    <span className="text-gray-700">{displayConfig.targetAudience}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
