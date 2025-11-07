import { Card, CardContent } from './ui/card';
import { User, Building2 } from 'lucide-react';
import React from 'react';

export type CertificationType = 'individual' | 'enterprise';

interface CertificationTypeSelectionProps {
  onSelect: (type: CertificationType) => void;
  selectedType?: CertificationType | null;
}

const certificationTypes = [
  {
    id: 'individual' as const,
    title: '个人认证',
    description: '个人身份认证',
    icon: User,
  },
  {
    id: 'enterprise' as const,
    title: '企业认证',
    description: '企业身份认证',
    icon: Building2,
  },
];

export function CertificationTypeSelection({ onSelect, selectedType }: CertificationTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificationTypes.map((type) => (
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

