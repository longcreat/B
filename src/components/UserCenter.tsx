import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { User, Mail, Phone, Calendar, Edit2, Save, X, Lock, Building, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from './ui/breadcrumb';

interface UserCenterProps {
  currentUser: {
    email: string;
    name: string;
    role: string;
    phone?: string;
    company?: string;
    registeredAt?: string;
  };
  onLogout: () => void;
  onUpdateProfile?: (data: { name: string; phone?: string; company?: string }) => void;
  onChangePassword?: (oldPassword: string, newPassword: string) => void;
}

export function UserCenter({ 
  currentUser, 
  onLogout,
  onUpdateProfile,
  onChangePassword,
}: UserCenterProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    phone: currentUser.phone || '',
    company: currentUser.company || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    if (!profileData.name.trim()) {
      toast.error('请输入姓名');
      return;
    }

    if (onUpdateProfile) {
      onUpdateProfile({
        name: profileData.name,
        phone: profileData.phone,
        company: profileData.company,
      });
    }
    
    toast.success('个人信息已更新');
    setIsEditingProfile(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('请填写所有密码字段');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('新密码长度至少为6位');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }

    if (onChangePassword) {
      onChangePassword(passwordData.oldPassword, passwordData.newPassword);
    }

    toast.success('密码修改成功');
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>用户中心</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 账户信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>账户信息</CardTitle>
              <CardDescription>查看和编辑您的个人信息</CardDescription>
            </div>
            {!isEditingProfile && (
              <Button onClick={() => setIsEditingProfile(true)}>
                编辑资料
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingProfile ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="请输入姓名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">联系电话</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">公司/组织</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  placeholder="请输入公司或组织名称"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProfileData({
                      name: currentUser.name,
                      phone: currentUser.phone || '',
                      company: currentUser.company || '',
                    });
                    setIsEditingProfile(false);
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">姓名</p>
                  <p className="text-gray-900">{currentUser.name}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3 py-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="text-gray-900">{currentUser.email}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3 py-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="text-gray-900">{currentUser.phone || '未设置'}</p>
                </div>
              </div>

              {currentUser.company && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3 py-2">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">公司/组织</p>
                      <p className="text-gray-900">{currentUser.company}</p>
                    </div>
                  </div>
                </>
              )}

              {currentUser.registeredAt && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3 py-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">注册时间</p>
                      <p className="text-gray-900">{currentUser.registeredAt}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 安全设置卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>安全设置</CardTitle>
          <CardDescription>修改您的登录密码以保护账户安全</CardDescription>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>
              <Lock className="w-4 h-4 mr-2" />
              修改密码
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  密码长度至少为6位，建议使用字母、数字和符号的组合以提高安全性。
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="oldPassword">当前密码 *</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="请输入当前密码"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码 *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="请输入新密码（至少6位）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码 *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="请再次输入新密码"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPasswordData({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setIsChangingPassword(false);
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleChangePassword}>
                  <Save className="w-4 h-4 mr-2" />
                  确认修改
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 退出登录 */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 mb-1">退出登录</h3>
              <p className="text-sm text-gray-600">退出当前账户，返回登录页面</p>
            </div>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
