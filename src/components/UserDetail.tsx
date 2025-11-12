import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { toast } from 'sonner';
import { ArrowLeft, User, Phone, Mail, Store, FileText, History, Copy } from 'lucide-react';
import type { Partner } from '../data/mockPartners';
import { cn } from './ui/utils';

interface UserDetailProps {
  partner: Partner;
  onBack: () => void;
}

export function UserDetail({ partner, onBack }: UserDetailProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('已复制到剪贴板');
    });
  };

  const CopyableField = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-gray-600">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{value || '-'}</span>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleCopy(value)}
          >
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-gray-500 hover:text-gray-700">
              用户管理
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-gray-500 hover:text-gray-700" onClick={onBack}>
              用户列表
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">用户详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 返回按钮 */}
      <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Button>

      {/* 基本信息区块 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <CopyableField label="用户 ID" value={partner.id} />
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">显示名称</Label>
              <p className="text-sm text-gray-900">{partner.displayName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">用户信息类型</Label>
              <Badge variant="outline" className="w-fit px-2 py-0.5 text-xs">
                {partner.type === 'individual' ? '旅行代理' : partner.type === 'influencer' ? '网络博主' : '旅游类相关应用'}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">认证方式</Label>
              <Badge variant="outline" className="w-fit px-2 py-0.5 text-xs">
                {partner.certificationType === 'enterprise' ? '企业认证' : '个人认证'}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">业务模式</Label>
              <Badge variant="outline" className="w-fit px-2 py-0.5 text-xs">
                {partner.businessModel.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">B 端类型</Label>
              <p className="text-sm text-gray-900">{partner.businessModel === 'affiliate' ? '小B' : '大B'}</p>
            </div>
            {partner.businessModel === 'affiliate' && (
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">挂载大B</Label>
                <p className="text-sm text-gray-900">{partner.parentPartnerId || '-'}</p>
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">风控等级</Label>
              <Badge variant="outline" className="w-fit px-2 py-0.5 text-xs">
                {partner.permissionLevel}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">账户状态</Label>
              <Badge 
                variant="outline" 
                className={cn('w-fit px-2 py-0.5 text-xs', {
                  'bg-emerald-50 text-emerald-700 border-emerald-200': partner.accountStatus === 'active',
                  'bg-amber-50 text-amber-700 border-amber-200': partner.accountStatus === 'frozen',
                  'bg-rose-50 text-rose-700 border-rose-200': partner.accountStatus === 'closed',
                })}
              >
                {partner.accountStatus === 'active' ? '正常' : partner.accountStatus === 'frozen' ? '冻结' : '关闭'}
              </Badge>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">注册时间</Label>
              <p className="text-sm text-gray-900">{partner.registeredAt}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">最后登录时间</Label>
              <p className="text-sm text-gray-900">{partner.lastLoginAt || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 联系方式区块 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            联系方式
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <CopyableField label="邮箱" value={partner.email} />
            <CopyableField label="手机号" value={partner.phone} />
          </div>
        </CardContent>
      </Card>

      {/* 店铺信息区块（若无则隐藏） */}
      {partner.storeConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              店铺信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">店铺名称</Label>
                <p className="text-sm text-gray-900">{partner.storeConfig.storeName}</p>
              </div>
              <CopyableField label="自定义域名" value={partner.storeConfig.customDomain || ''} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 认证信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            认证信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {partner.certificationType === 'individual' ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">身份信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <CopyableField label="真实姓名" value={partner.specificInfo.realName || ''} />
                  <CopyableField label="身份证号" value={partner.specificInfo.idNumber || ''} />
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">身份证有效期</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">身份证照片</Label>
                    <p className="text-sm text-gray-500">正面、反面</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">联系方式</h4>
                <div className="grid grid-cols-2 gap-6">
                  <CopyableField label="联系手机号" value={partner.phone} />
                  <CopyableField label="电子邮箱" value={partner.email} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">结算账户</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">账户类型</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">账户信息</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">业务证明</h4>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide text-gray-600">业务证明材料</Label>
                  <p className="text-sm text-gray-500">最多5张图片</p>
                </div>
              </div>
            </div>
          ) : partner.certificationType === 'enterprise' ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">企业主体信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">公司名称</Label>
                    <p className="text-sm text-gray-900">{partner.specificInfo.companyName || '-'}</p>
                  </div>
                  <CopyableField label="统一社会信用代码" value={partner.specificInfo.socialCreditCode || ''} />
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">营业执照照片</Label>
                    <p className="text-sm text-gray-500">JPG/PNG</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">法人信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">法定代表人</Label>
                    <p className="text-sm text-gray-900">{partner.specificInfo.legalRepresentative || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">法人身份证号</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">法人身份证照片</Label>
                    <p className="text-sm text-gray-500">正面、反面</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">联系人信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">联系人姓名</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <CopyableField label="联系人手机号" value={partner.phone} />
                  <CopyableField label="联系人邮箱" value={partner.email} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">结算账户（对公）</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">开户主体</Label>
                    <p className="text-sm text-gray-900">{partner.specificInfo.companyName || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">银行账号</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">业务证明</h4>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wide text-gray-600">业务证明材料</Label>
                  <p className="text-sm text-gray-500">最多5张图片</p>
                </div>
              </div>
            </div>
          ) : partner.type === 'influencer' ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">身份信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <CopyableField label="真实姓名" value={partner.specificInfo.realName || ''} />
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">身份证号</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">身份证有效期</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">身份证照片</Label>
                    <p className="text-sm text-gray-500">正面、反面</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">平台信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">主营社交平台</Label>
                    <p className="text-sm text-gray-900">{partner.specificInfo.platformName || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">个人主页链接</Label>
                    <p className="text-sm text-gray-500">可点击打开</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">粉丝数</Label>
                    <p className="text-sm text-gray-900">{partner.specificInfo.followersCount?.toLocaleString() || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">后台数据截图</Label>
                    <p className="text-sm text-gray-500">最多3张</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">联系方式</h4>
                <div className="grid grid-cols-2 gap-6">
                  <CopyableField label="联系手机号" value={partner.phone} />
                  <CopyableField label="电子邮箱" value={partner.email} />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">结算账户</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">账户类型</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">账户信息</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 业务信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            业务信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {partner.businessModel === 'saas' ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">加价率设置</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">当前加价率</Label>
                    <p className="text-sm text-gray-900">{partner.businessData.avgMarkupRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">允许自设</Label>
                    <Badge variant="outline" className="w-fit px-2 py-0.5 text-xs">
                      {partner.canSetMarkupRate ? '是' : '否'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : partner.businessModel === 'mcp' ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">MCP 信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">GitHub 账号</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">作品集链接</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                </div>
              </div>
            </div>
          ) : partner.businessModel === 'affiliate' ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">推广联盟信息</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">推广场景说明</Label>
                    <p className="text-sm text-gray-900">-</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">佣金率</Label>
                    <p className="text-sm text-gray-900">{partner.defaultCommissionRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-gray-600">挂载大B</Label>
                    <p className="text-sm text-gray-900">{partner.parentPartnerId || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 操作记录卡片（占位） */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            操作记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            暂无操作记录
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
