import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Shield, 
  Search, 
  Save, 
  RefreshCw,
  Users,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  FeaturePermission, 
  PermissionRule,
  getMockFeaturePermissions,
  updateFeaturePermission 
} from '../data/mockFeaturePermissions';
import { getMockPartners, Partner } from '../data/mockPartners';
import { PartnerSelector } from './PartnerSelector';

export function FeaturePermissionManagement() {
  const [permissions, setPermissions] = useState<FeaturePermission[]>(getMockFeaturePermissions());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingPermission, setEditingPermission] = useState<FeaturePermission | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [partners] = useState<Partner[]>(getMockPartners());

  // 筛选权限列表
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || permission.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 切换功能启用状态
  const handleToggleEnabled = (code: string, enabled: boolean) => {
    const updated = permissions.map(p => 
      p.code === code ? { ...p, enabled, updatedAt: new Date().toISOString().split('T')[0] } : p
    );
    setPermissions(updated);
    updateFeaturePermission(code as any, { enabled });
    toast.success(enabled ? '功能已启用' : '功能已禁用');
  };

  // 打开编辑对话框
  const handleEdit = (permission: FeaturePermission) => {
    setEditingPermission({ ...permission });
    setShowEditDialog(true);
  };

  // 保存权限配置
  const handleSave = () => {
    if (!editingPermission) return;

    const updated = permissions.map(p => 
      p.code === editingPermission.code ? editingPermission : p
    );
    setPermissions(updated);
    updateFeaturePermission(editingPermission.code, editingPermission);
    setShowEditDialog(false);
    toast.success('权限配置已保存');
  };

  // 获取权限规则显示名称
  const getRuleName = (rule: PermissionRule): string => {
    const ruleNames: Record<PermissionRule, string> = {
      'all': '所有人',
      'bigb-only': '仅大B',
      'smallb-only': '仅小B',
      'saas-only': '仅SaaS业务',
      'mcp-only': '仅MCP业务',
      'affiliate-only': '仅分销业务',
      'whitelist': '白名单模式'
    };
    return ruleNames[rule];
  };

  // 获取分类显示名称
  const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      'business': '业务功能',
      'system': '系统功能',
      'finance': '财务功能'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>功能权限管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 顶部搜索和筛选 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                功能权限配置
              </CardTitle>
              <CardDescription className="mt-1">
                管理系统功能的访问权限，控制不同用户群体可使用的功能
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索功能名称或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="business">业务功能</SelectItem>
                  <SelectItem value="system">系统功能</SelectItem>
                  <SelectItem value="finance">财务功能</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 权限列表 */}
      <div className="grid gap-4">
        {filteredPermissions.map(permission => (
          <Card key={permission.code} className={!permission.enabled ? 'opacity-60' : ''}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{permission.name}</h3>
                    <Badge variant={permission.enabled ? 'default' : 'secondary'}>
                      {permission.enabled ? '已启用' : '已禁用'}
                    </Badge>
                    <Badge variant="outline">{getCategoryName(permission.category)}</Badge>
                    {permission.betaTest && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Beta测试
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{permission.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">权限规则：</span>
                      <span className="font-medium ml-2">{getRuleName(permission.rule)}</span>
                    </div>
                    {permission.requiredBusinessModels && permission.requiredBusinessModels.length > 0 && (
                      <div>
                        <span className="text-gray-500">业务模式：</span>
                        <span className="font-medium ml-2">
                          {permission.requiredBusinessModels.join(', ').toUpperCase()}
                        </span>
                      </div>
                    )}
                    {permission.requiredUserTypes && permission.requiredUserTypes.length > 0 && (
                      <div>
                        <span className="text-gray-500">用户类型：</span>
                        <span className="font-medium ml-2">
                          {permission.requiredUserTypes.map(t => t === 'bigb' ? '大B' : '小B').join(', ')}
                        </span>
                      </div>
                    )}
                    {permission.rule === 'whitelist' && (
                      <div>
                        <span className="text-gray-500">白名单用户：</span>
                        <span className="font-medium ml-2">
                          {permission.whitelistPartnerIds?.length || 0} 个
                        </span>
                        {permission.whitelistPartnerIds && permission.whitelistPartnerIds.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {permission.whitelistPartnerIds.slice(0, 5).map(partnerId => {
                              const partner = partners.find(p => p.id === partnerId);
                              return partner ? (
                                <Badge key={partnerId} variant="outline" className="text-xs">
                                  {partner.displayName} ({partnerId})
                                </Badge>
                              ) : (
                                <Badge key={partnerId} variant="outline" className="text-xs">
                                  {partnerId}
                                </Badge>
                              );
                            })}
                            {permission.whitelistPartnerIds.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{permission.whitelistPartnerIds.length - 5} 个
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">更新时间：</span>
                      <span className="font-medium ml-2">{permission.updatedAt}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">更新人：</span>
                      <span className="font-medium ml-2">{permission.updatedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-6">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`switch-${permission.code}`} className="text-sm">
                      {permission.enabled ? '启用' : '禁用'}
                    </Label>
                    <Switch
                      id={`switch-${permission.code}`}
                      checked={permission.enabled}
                      onCheckedChange={(checked) => handleToggleEnabled(permission.code, checked)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(permission)}
                  >
                    配置权限
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 编辑权限对话框 */}
      {editingPermission && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>配置功能权限 - {editingPermission.name}</DialogTitle>
              <DialogDescription>
                设置该功能的访问权限规则和白名单用户
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* 权限规则 */}
              <div className="space-y-2">
                <Label>权限规则</Label>
                <Select 
                  value={editingPermission.rule} 
                  onValueChange={(value) => setEditingPermission({
                    ...editingPermission,
                    rule: value as PermissionRule
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有人</SelectItem>
                    <SelectItem value="bigb-only">仅大B</SelectItem>
                    <SelectItem value="smallb-only">仅小B</SelectItem>
                    <SelectItem value="saas-only">仅SaaS业务</SelectItem>
                    <SelectItem value="mcp-only">仅MCP业务</SelectItem>
                    <SelectItem value="affiliate-only">仅分销业务</SelectItem>
                    <SelectItem value="whitelist">白名单模式</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  权限规则是基础访问控制，可配合业务模式和用户类型使用
                </p>
              </div>

              {/* 业务模式限制 */}
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <Label className="text-base font-medium">业务模式限制（可选）</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    选择允许使用此功能的业务模式。不选择则不对业务模式进行限制。
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="business-saas"
                      checked={editingPermission.requiredBusinessModels?.includes('saas') || false}
                      onCheckedChange={(checked) => {
                        const current = editingPermission.requiredBusinessModels || [];
                        if (checked) {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: [...current, 'saas']
                          });
                        } else {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: current.filter(m => m !== 'saas')
                          });
                        }
                      }}
                    />
                    <Label htmlFor="business-saas" className="font-normal cursor-pointer">
                      SaaS业务模式
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="business-mcp"
                      checked={editingPermission.requiredBusinessModels?.includes('mcp') || false}
                      onCheckedChange={(checked) => {
                        const current = editingPermission.requiredBusinessModels || [];
                        if (checked) {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: [...current, 'mcp']
                          });
                        } else {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: current.filter(m => m !== 'mcp')
                          });
                        }
                      }}
                    />
                    <Label htmlFor="business-mcp" className="font-normal cursor-pointer">
                      MCP业务模式
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="business-affiliate"
                      checked={editingPermission.requiredBusinessModels?.includes('affiliate') || false}
                      onCheckedChange={(checked) => {
                        const current = editingPermission.requiredBusinessModels || [];
                        if (checked) {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: [...current, 'affiliate']
                          });
                        } else {
                          setEditingPermission({
                            ...editingPermission,
                            requiredBusinessModels: current.filter(m => m !== 'affiliate')
                          });
                        }
                      }}
                    />
                    <Label htmlFor="business-affiliate" className="font-normal cursor-pointer">
                      推广联盟业务模式（Affiliate）
                    </Label>
                  </div>
                </div>
                {editingPermission.requiredBusinessModels && editingPermission.requiredBusinessModels.length > 0 && (
                  <p className="text-sm text-blue-700 mt-2">
                    已选择：{editingPermission.requiredBusinessModels.map(m => 
                      m === 'saas' ? 'SaaS' : m === 'mcp' ? 'MCP' : '推广联盟'
                    ).join('、')}
                  </p>
                )}
              </div>

              {/* 用户类型限制 */}
              <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <Label className="text-base font-medium">用户类型限制（可选）</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    选择允许使用此功能的用户类型。不选择则不对用户类型进行限制。
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="user-bigb"
                      checked={editingPermission.requiredUserTypes?.includes('bigb') || false}
                      onCheckedChange={(checked) => {
                        const current = editingPermission.requiredUserTypes || [];
                        if (checked) {
                          setEditingPermission({
                            ...editingPermission,
                            requiredUserTypes: [...current, 'bigb']
                          });
                        } else {
                          setEditingPermission({
                            ...editingPermission,
                            requiredUserTypes: current.filter(t => t !== 'bigb')
                          });
                        }
                      }}
                    />
                    <Label htmlFor="user-bigb" className="font-normal cursor-pointer">
                      大B用户
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="user-smallb"
                      checked={editingPermission.requiredUserTypes?.includes('smallb') || false}
                      onCheckedChange={(checked) => {
                        const current = editingPermission.requiredUserTypes || [];
                        if (checked) {
                          setEditingPermission({
                            ...editingPermission,
                            requiredUserTypes: [...current, 'smallb']
                          });
                        } else {
                          setEditingPermission({
                            ...editingPermission,
                            requiredUserTypes: current.filter(t => t !== 'smallb')
                          });
                        }
                      }}
                    />
                    <Label htmlFor="user-smallb" className="font-normal cursor-pointer">
                      小B用户
                    </Label>
                  </div>
                </div>
                {editingPermission.requiredUserTypes && editingPermission.requiredUserTypes.length > 0 && (
                  <p className="text-sm text-green-700 mt-2">
                    已选择：{editingPermission.requiredUserTypes.map(t => 
                      t === 'bigb' ? '大B' : '小B'
                    ).join('、')}
                  </p>
                )}
              </div>

              {/* Beta测试标记 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label>Beta测试功能</Label>
                  <p className="text-sm text-gray-600">标记为Beta测试的功能会提示用户该功能正在内测</p>
                </div>
                <Switch
                  checked={editingPermission.betaTest}
                  onCheckedChange={(checked) => setEditingPermission({
                    ...editingPermission,
                    betaTest: checked
                  })}
                />
              </div>

              {/* 白名单用户（仅白名单模式显示） */}
              {editingPermission.rule === 'whitelist' && (
                <div className="space-y-2">
                  <Label>白名单用户</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    从用户列表中选择可以访问此功能的用户。只有选中的用户才能使用此功能。
                  </p>
                  <PartnerSelector
                    selectedPartnerIds={editingPermission.whitelistPartnerIds || []}
                    onSelectionChange={(partnerIds) => setEditingPermission({
                      ...editingPermission,
                      whitelistPartnerIds: partnerIds
                    })}
                    placeholder="搜索用户名称、邮箱或ID..."
                    maxHeight="300px"
                    filterByBusinessModel={editingPermission.requiredBusinessModels}
                    filterByUserType={editingPermission.requiredUserTypes}
                  />
                </div>
              )}

              {/* 黑名单用户 */}
              <div className="space-y-2">
                <Label>黑名单用户</Label>
                <p className="text-sm text-gray-600 mb-2">
                  选择需要禁止访问此功能的用户。黑名单用户将无法访问此功能，即使满足其他所有条件。
                </p>
                <PartnerSelector
                  selectedPartnerIds={editingPermission.blacklistPartnerIds || []}
                  onSelectionChange={(partnerIds) => setEditingPermission({
                    ...editingPermission,
                    blacklistPartnerIds: partnerIds
                  })}
                  placeholder="搜索用户名称、邮箱或ID..."
                  maxHeight="300px"
                />
              </div>

              {/* 上线日期 */}
              <div className="space-y-2">
                <Label>功能上线日期（可选）</Label>
                <Input
                  type="date"
                  value={editingPermission.launchDate || ''}
                  onChange={(e) => setEditingPermission({
                    ...editingPermission,
                    launchDate: e.target.value
                  })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存配置
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

