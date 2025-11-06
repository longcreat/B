import { Card, CardContent } from './ui/card';
import { Code, Users, Building2, User } from 'lucide-react';
import React from 'react';

export type IdentityType = 'developer' | 'influencer' | 'enterprise' | 'agent';

interface IdentityTypeSelectionProps {
  onSelect: (type: IdentityType) => void;
  selectedType?: IdentityType | null;
}

const identityTypes = [
  {
    id: 'developer' as const,
    title: '独立开发者',
    description: '独立开发应用/网站/小程序的个人',
    icon: Code,
  },
  {
    id: 'influencer' as const,
    title: '旅行达人',
    description: '有公众号、小红书账号，且拥有一定粉丝的博主',
    icon: Users,
  },
  {
    id: 'enterprise' as const,
    title: '旅行相关企业',
    description: '如旅行社、旅行类app、旅行相关网站的企业',
    icon: Building2,
  },
  {
    id: 'agent' as const,
    title: '个人旅行代理',
    description: '有酒店预订、代订、分销需求的个人',
    icon: User,
  },
];

export function IdentityTypeSelection({ onSelect, selectedType }: IdentityTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {identityTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all border ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-50/50 shadow-md'
                : 'border-gray-200 hover:shadow-md hover:border-blue-300 bg-white'
            }`}
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  selectedType === type.id
                    ? 'bg-blue-500'
                    : 'bg-blue-100'
                }`}>
                  <type.icon className={`w-8 h-8 ${
                    selectedType === type.id
                      ? 'text-white'
                      : 'text-blue-600'
                  }`} />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

