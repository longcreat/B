import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Filter,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getBusinessModelConfigs,
  saveBusinessModelConfigs,
  businessModelMetadata,
  userTypeMetadata,
  type BusinessModelConfig,
  type UserType,
  type CertificationType,
  type BusinessModel,
  type ConfigStatus,
} from '../data/mockBusinessModelConfig';

export function BusinessModelConfigManagement() {
  const [configs, setConfigs] = useState<BusinessModelConfig[]>(getBusinessModelConfigs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUserType, setFilterUserType] = useState<'all' | UserType>('all');
  const [filterCertificationType, setFilterCertificationType] = useState<'all' | CertificationType>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ConfigStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<BusinessModelConfig | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState<Partial<BusinessModelConfig>>({
    userType: 'travel_agent',
    certificationType: 'individual',
    businessModel: 'affiliate',
    isEnabled: true,
    priority: 1,
    configStatus: 'active',
  });

  // 加载配置
  useEffect(() => {
    setConfigs(getBusinessModelConfigs());
  }, []);

  // 保存配置
  const handleSave = () => {
    if (!formData.userType || !formData.certificationType || !formData.businessModel) {
      toast.error('请填写完整信息');
      return;
    }

    const updatedConfigs = [...configs];

    if (editingConfig) {
      // 更新现有配置
      const index = updatedConfigs.findIndex(c => c.configId === editingConfig.configId);
      if (index !== -1) {
        updatedConfigs[index] = {
          ...editingConfig,
          ...formData,
          updatedAt: new Date().toISOString(),
        } as BusinessModelConfig;
      }
    } else {
      // 创建新配置
      const newConfig: BusinessModelConfig = {
        configId: `config_${Date.now()}`,
        userType: formData.userType!,
        certificationType: formData.certificationType!,
        businessModel: formData.businessModel!,
        isEnabled: formData.isEnabled ?? true,
        priority: formData.priority ?? 1,
        displayName: formData.displayName,
        description: formData.description,
        configStatus: formData.configStatus ?? 'active',
        effectiveAt: formData.effectiveAt,
        expiresAt: formData.expiresAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedConfigs.push(newConfig);
    }

    saveBusinessModelConfigs(updatedConfigs);
    setConfigs(updatedConfigs);
    setShowEditDialog(false);
    setEditingConfig(null);
    toast.success(editingConfig ? '配置更新成功' : '配置创建成功');
  };

  // 删除配置
  const handleDelete = (configId: string) => {
    if (!confirm('确定要删除该配置吗？')) {
      return;
    }

    const updatedConfigs = configs.filter(c => c.configId !== configId);
    saveBusinessModelConfigs(updatedConfigs);
    setConfigs(updatedConfigs);
    toast.success('配置删除成功');
  };

  // 启用/禁用配置
  const handleToggleEnabled = (configId: string) => {
    const updatedConfigs = configs.map(config =>
      config.configId === configId
        ? { ...config, isEnabled: !config.isEnabled, updatedAt: new Date().toISOString() }
        : config
    );
    saveBusinessModelConfigs(updatedConfigs);
    setConfigs(updatedConfigs);
    toast.success('配置状态已更新');
  };

  // 打开编辑对话框
  const handleEdit = (config: BusinessModelConfig) => {
    setEditingConfig(config);
    setFormData({
      userType: config.userType,
      certificationType: config.certificationType,
      businessModel: config.businessModel,
      isEnabled: config.isEnabled,
      priority: config.priority,
      displayName: config.displayName,
      description: config.description,
      configStatus: config.configStatus,
      effectiveAt: config.effectiveAt,
      expiresAt: config.expiresAt,
    });
    setShowEditDialog(true);
  };

  // 打开新建对话框
  const handleNew = () => {
    setEditingConfig(null);
    setFormData({
      userType: 'travel_agent',
      certificationType: 'individual',
      businessModel: 'affiliate',
      isEnabled: true,
      priority: 1,
      configStatus: 'active',
    });
    setShowEditDialog(true);
  };

  // 获取显示名称
  const getUserTypeName = (userType: UserType) => {
    return userTypeMetadata.find(m => m.userType === userType)?.displayName || userType;
  };

  const getBusinessModelName = (businessModel: BusinessModel) => {
    return businessModelMetadata.find(m => m.businessModel === businessModel)?.displayName || businessModel;
  };

  // 过滤配置
  const filteredConfigs = configs.filter(config => {
    const matchesSearch = 
      config.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUserType = filterUserType === 'all' || config.userType === filterUserType;
    const matchesCertificationType = filterCertificationType === 'all' || config.certificationType === filterCertificationType;
    const matchesStatus = filterStatus === 'all' || config.configStatus === filterStatus;

    return matchesSearch && matchesUserType && matchesCertificationType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>业务模式配置管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>业务模式配置列表</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索配置名称、描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
              <Button onClick={handleNew}>
                <Plus className="w-4 h-4 mr-2" />
                新增配置
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t mt-4">
              <Select value={filterUserType} onValueChange={(value: any) => setFilterUserType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="用户类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {userTypeMetadata.map(type => (
                    <SelectItem key={type.userType} value={type.userType}>
                      {type.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCertificationType} onValueChange={(value: any) => setFilterCertificationType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="认证方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方式</SelectItem>
                  <SelectItem value="individual">个人认证</SelectItem>
                  <SelectItem value="enterprise">企业认证</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">启用</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                </SelectContent>
              </Select>

              {(filterUserType !== 'all' || filterCertificationType !== 'all' || filterStatus !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterUserType('all');
                    setFilterCertificationType('all');
                    setFilterStatus('all');
                  }}
                >
                  清除筛选
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户类型</TableHead>
                  <TableHead>认证方式</TableHead>
                  <TableHead>业务模式</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>启用</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredConfigs.map((config) => (
                    <TableRow key={config.configId}>
                      <TableCell>{getUserTypeName(config.userType)}</TableCell>
                      <TableCell>
                        {config.certificationType === 'individual' ? '个人认证' : '企业认证'}
                      </TableCell>
                      <TableCell>{getBusinessModelName(config.businessModel)}</TableCell>
                      <TableCell>{config.priority}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            config.configStatus === 'active'
                              ? 'bg-green-50 text-green-700 border-green-300'
                              : config.configStatus === 'inactive'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-gray-50 text-gray-700 border-gray-300'
                          }
                        >
                          {config.configStatus === 'active' ? '启用' : config.configStatus === 'inactive' ? '禁用' : '草稿'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={config.isEnabled}
                          onCheckedChange={() => handleToggleEnabled(config.configId)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(config)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(config.configId)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 编辑/新建对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConfig ? '编辑配置' : '新增配置'}</DialogTitle>
            <DialogDescription>
              {editingConfig ? '修改业务模式配置规则' : '创建新的业务模式配置规则'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userType">用户信息类型 *</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value: UserType) => setFormData({ ...formData, userType: value })}
                >
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypeMetadata.map(type => (
                      <SelectItem key={type.userType} value={type.userType}>
                        {type.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="certificationType">认证方式 *</Label>
                <Select
                  value={formData.certificationType}
                  onValueChange={(value: CertificationType) => setFormData({ ...formData, certificationType: value })}
                >
                  <SelectTrigger id="certificationType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">个人认证</SelectItem>
                    <SelectItem value="enterprise">企业认证</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="businessModel">业务模式 *</Label>
              <Select
                value={formData.businessModel}
                onValueChange={(value: BusinessModel) => setFormData({ ...formData, businessModel: value })}
              >
                <SelectTrigger id="businessModel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessModelMetadata.map(model => (
                    <SelectItem key={model.businessModel} value={model.businessModel}>
                      {model.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">优先级</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500 mt-1">数字越大优先级越高</p>
              </div>

              <div>
                <Label htmlFor="configStatus">配置状态 *</Label>
                <Select
                  value={formData.configStatus}
                  onValueChange={(value: ConfigStatus) => setFormData({ ...formData, configStatus: value })}
                >
                  <SelectTrigger id="configStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="inactive">禁用</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })}
              />
              <Label>是否启用</Label>
            </div>

            <div>
              <Label htmlFor="displayName">显示名称（可选）</Label>
              <Input
                id="displayName"
                value={formData.displayName || ''}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="例如：旅行代理-个人认证-推广联盟"
              />
            </div>

            <div>
              <Label htmlFor="description">配置说明</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入配置说明..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              {editingConfig ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

