import React, { useState } from 'react';
import { ArrowLeft, Copy, Lock, LockOpen, RotateCcw, Edit2, ExternalLink, Link2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { toast } from 'sonner';
import type { PromotionLink } from './PromotionLinkManagement';

interface PromotionLinkDetailProps {
  link: PromotionLink;
  onBack: () => void;
}

interface CopyableFieldProps {
  label: string;
  value: string;
}

function CopyableField({ label, value }: CopyableFieldProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('已复制到剪贴板');
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-gray-600">{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{value || '-'}</span>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleCopy}
          >
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function PromotionLinkDetail({ link, onBack }: PromotionLinkDetailProps) {
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [newCode, setNewCode] = useState(link.promotionCode || '');
  const [modifyReason, setModifyReason] = useState('');

  const getUserTypeBadge = (type: string) => {
    const config = {
      '旅行代理': { className: 'bg-orange-50 text-orange-700 border-orange-300' },
      '网络博主': { className: 'bg-pink-50 text-pink-700 border-pink-300' },
      '旅游类相关应用': { className: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
    };
    const { className } = config[type as keyof typeof config] || { className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{type}</Badge>;
  };

  const getBusinessModelBadge = (model: string) => {
    const config = {
      'SaaS': { className: 'bg-purple-50 text-purple-700 border-purple-300' },
      '推广联盟': { className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { className } = config[model as keyof typeof config] || { className: 'bg-gray-50 text-gray-700 border-gray-300' };
    return <Badge variant="outline" className={className}>{model}</Badge>;
  };

  const handleModifyCode = () => {
    if (!newCode.trim()) {
      toast.error('请输入新的推广代码');
      return;
    }
    if (modifyReason.trim().length < 10) {
      toast.error('操作原因至少需要10个字符');
      return;
    }
    toast.success('推广代码已修改');
    setShowModifyDialog(false);
    setNewCode('');
    setModifyReason('');
  };

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
              推广链接管理
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900">推广链接详情</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 返回按钮 */}
      <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        返回列表
      </Button>

      {/* 用户信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            用户信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">用户名称</Label>
              <p className="text-sm text-gray-900">{link.partnerName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">用户信息类型</Label>
              {getUserTypeBadge(link.userType)}
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">业务模式</Label>
              {getBusinessModelBadge(link.businessModel)}
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-gray-600">链接状态</Label>
              <Badge variant={link.status === 'enabled' ? 'default' : 'secondary'}>
                {link.status === 'enabled' ? '启用' : '禁用'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 链接信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            链接信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <CopyableField label="用户 ID" value={link.partnerId} />
            <CopyableField label="推广 ID" value={link.promotionId} />
            <CopyableField label="推广代码" value={link.promotionCode || ''} />
            <div className="space-y-1 col-span-2 md:col-span-3">
              <Label className="text-xs uppercase tracking-wide text-gray-600">默认链接</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 flex-1 break-all">{link.defaultLink}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(link.defaultLink);
                    toast.success('已复制到剪贴板');
                  }}
                >
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(link.defaultLink, '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Button>
              </div>
            </div>
            {link.mainLink && (
              <div className="space-y-1 col-span-2 md:col-span-3">
                <Label className="text-xs uppercase tracking-wide text-gray-600">主推广链接</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 flex-1 break-all">{link.mainLink}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      navigator.clipboard.writeText(link.mainLink!);
                      toast.success('已复制到剪贴板');
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(link.mainLink!, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 活动链接列表 */}
      <Card>
        <CardHeader>
          <CardTitle>活动链接列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            暂无活动链接数据
          </div>
        </CardContent>
      </Card>

      {/* 价格关联信息（仅小 B 链接显示） */}
      {link.businessModel === '推广联盟' && (
        <Card>
          <CardHeader>
            <CardTitle>价格关联信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">挂载大B名称</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">挂载大B ID</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">挂载大B加价率</Label>
                <p className="text-sm text-gray-900">-</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wide text-gray-600">佣金比例</Label>
                <p className="text-sm text-gray-900">{link.commissionRate ?? '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作区域 */}
      <Card>
        <CardHeader>
          <CardTitle>操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={() => toast.success(`链接已${link.status === 'enabled' ? '禁用' : '启用'}`)}
              className="gap-2"
            >
              {link.status === 'enabled' ? (
                <>
                  <Lock className="w-4 h-4" />
                  禁用链接
                </>
              ) : (
                <>
                  <LockOpen className="w-4 h-4" />
                  启用链接
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success('推广代码已重置')}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重置推广代码
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowModifyDialog(true)}
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" />
              强制修改推广代码
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 修改推广代码对话框 */}
      <Dialog open={showModifyDialog} onOpenChange={setShowModifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改推广代码</DialogTitle>
            <DialogDescription>
              输入新的推广代码和操作原因
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-code">新推广代码</Label>
              <Input
                id="new-code"
                placeholder="输入新的推广代码"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                3-20字符，仅支持字母、数字、下划线、连字符，不能以数字开头
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">操作原因</Label>
              <Textarea
                id="reason"
                placeholder="请输入操作原因（至少10个字符）"
                value={modifyReason}
                onChange={(e) => setModifyReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModifyDialog(false)}>
              取消
            </Button>
            <Button onClick={handleModifyCode}>
              确认修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
