import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Bot, Globe, Share2 } from 'lucide-react';
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
    if (!certificationType) {
      return [];
    }
    // 使用默认的 userType 'travel_agent' 来获取业务模式选项
    const defaultUserType: UserType = userType || 'travel_agent';
    return getBusinessModelOptions(defaultUserType, certificationType);
  }, [userType, certificationType]);

  // 业务模式显示配置
  const businessModelDisplayConfig = {
    mcp: {
      title: 'MCP',
      description: 'AI类应用的开发者',
      icon: Bot,
    },
    saas: {
      title: '联名独立站',
      description: '不具备技术能力的旅行博主、达人',
      icon: Globe,
    },
    affiliate: {
      title: '链接分销',
      description: '旅行从业人员或有预订需求的人员',
      icon: Share2,
    },
  };

  // 如果没有选择认证方式，显示提示
  if (!certificationType) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先完成认证方式选择</p>
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
          
          return (
            <Card
              key={option.businessModel}
              className={`cursor-pointer transition-all border ${
                selectedModel === option.businessModel
                  ? 'border-blue-500 bg-blue-50/50 shadow-md'
                  : 'border-gray-200 hover:shadow-md hover:border-blue-300 bg-white'
              }`}
              onClick={() => onSelect(option.businessModel)}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    selectedModel === option.businessModel
                      ? 'bg-blue-500'
                      : 'bg-blue-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      selectedModel === option.businessModel
                        ? 'text-white'
                        : 'text-blue-600'
                    }`} />
                  </div>
                </div>

                <h3 className="text-center mb-3 text-lg font-semibold text-gray-900">{displayConfig.title}</h3>
                
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {displayConfig.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
