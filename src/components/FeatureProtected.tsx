// 功能权限保护组件
// 用于包装需要权限验证的功能页面

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, AlertCircle } from 'lucide-react';
import { hasFeaturePermission, getFeatureDisabledReason } from '../utils/featurePermissionUtils';
import { FeatureCode } from '../data/mockFeaturePermissions';
import { Partner } from '../data/mockPartners';

interface FeatureProtectedProps {
  featureCode: FeatureCode;
  currentPartner: Partner | null;
  userType: 'admin' | 'bigb' | 'smallb';
  children: React.ReactNode;
  fallback?: React.ReactNode; // 自定义无权限时的显示内容
}

export function FeatureProtected({
  featureCode,
  currentPartner,
  userType,
  children,
  fallback,
}: FeatureProtectedProps) {
  // 检查权限
  const hasPermission = hasFeaturePermission(featureCode, currentPartner, userType);
  
  // 如果有权限，直接渲染子组件
  if (hasPermission) {
    return <>{children}</>;
  }
  
  // 如果有自定义fallback，使用它
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // 默认的无权限提示
  const reason = getFeatureDisabledReason(featureCode, currentPartner, userType);
  
  return (
    <div className="space-y-6 p-6">
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Lock className="w-5 h-5" />
            功能暂未开放
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-white border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {reason || '您暂时无法访问此功能'}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p>如果您认为这是一个错误，或希望申请开通此功能，请：</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>联系您的客户经理</li>
              <li>发送邮件至 support@aigohotel.com</li>
              <li>在"账户说明"页面查看更多帮助信息</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 简化版本的权限检查Hook，用于组件内部逻辑
export function useFeaturePermission(
  featureCode: FeatureCode,
  currentPartner: Partner | null,
  userType: 'admin' | 'bigb' | 'smallb'
): {
  hasPermission: boolean;
  reason: string | null;
} {
  const hasPermission = hasFeaturePermission(featureCode, currentPartner, userType);
  const reason = hasPermission ? null : getFeatureDisabledReason(featureCode, currentPartner, userType);
  
  return { hasPermission, reason };
}

