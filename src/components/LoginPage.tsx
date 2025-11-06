import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import { Mail, Phone, Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { formatDateTime } from '../utils/dateFormat';

interface LoginPageProps {
  onLoginSuccess: (userData: { phone?: string; email?: string; role?: 'admin' | 'user'; name?: string; registeredAt?: string }) => void;
  onSwitchToRegister: () => void;
}

// Initialize test accounts and applications
const initializeTestAccounts = () => {
  let existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  
  const registeredAt = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Define test accounts
  const testAccountsDefinition = [
    // 管理员账号
    {
      id: 'admin-001',
      phone: '13800000000',
      email: 'admin@test.com',
      password: 'admin1234',
      role: 'admin',
      type: 'admin',
      name: '系统管理员',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    // 原始账号 - 用于新提交流程
    {
      id: 'test-individual',
      phone: '13800138001',
      email: 'individual@test.com',
      password: 'test1234',
      role: 'user',
      type: 'individual',
      name: '个人用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-influencer',
      phone: '13800138002',
      email: 'influencer@test.com',
      password: 'test1234',
      role: 'user',
      type: 'influencer',
      name: '博主用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-enterprise',
      phone: '13800138003',
      email: 'enterprise@test.com',
      password: 'test1234',
      role: 'user',
      type: 'enterprise',
      name: '企业用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    // 状态测试账号
    {
      id: 'test-pending',
      phone: '13800138011',
      email: 'pending@test.com',
      password: 'test1234',
      role: 'user',
      type: 'pending',
      name: '待审核用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-approved-mcp',
      phone: '13800138012',
      email: 'mcp@test.com',
      password: 'test1234',
      role: 'user',
      type: 'approved',
      name: 'MCP已通过用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-approved-saas',
      phone: '13800138014',
      email: 'saas@test.com',
      password: 'test1234',
      role: 'user',
      type: 'approved',
      name: 'SaaS已通过用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-approved-affiliate',
      phone: '13800138015',
      email: 'affiliate@test.com',
      password: 'test1234',
      role: 'user',
      type: 'approved',
      name: '推广联盟已通过用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
    {
      id: 'test-rejected',
      phone: '13800138013',
      email: 'rejected@test.com',
      password: 'test1234',
      role: 'user',
      type: 'rejected',
      name: '已驳回用户',
      createdAt: new Date().toISOString(),
      registeredAt: registeredAt,
    },
  ];
  
  // Check and add missing test accounts
  let updated = false;
  testAccountsDefinition.forEach(testAccount => {
    const exists = existingUsers.some((u: any) => u.email === testAccount.email);
    if (!exists) {
      existingUsers.push(testAccount);
      updated = true;
    }
  });
  
  // Save if updated
  if (updated || existingUsers.length === 0) {
    localStorage.setItem('users', JSON.stringify(existingUsers));
  }
  
  // Initialize test applications (always check)
  const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
  const now = new Date();
  
  const testApplicationsDefinition = [
    // 待审核申请
    {
      id: 'APP-001',
      userId: 'test-pending',
      userEmail: 'pending@test.com',
      applicantName: '张三',
      businessModel: 'mcp',
      identityType: 'individual',
      status: 'pending',
      submittedAt: formatDateTime(new Date(now.getTime() - 2 * 60 * 60 * 1000)),
      data: {
        realName: '张三',
        idNumber: '110101199001011234',
        phone: '13912345678',
        email: 'pending@test.com',
        channels: ['社交媒体', '博客网站'],
        bankName: '中国工商银行',
        bankAccount: '6222021234567890123',
        accountHolder: '张三',
      },
    },
    // 审核通过申请 - MCP模式
    {
      id: 'APP-002',
      userId: 'test-approved-mcp',
      userEmail: 'mcp@test.com',
      applicantName: '李四',
      businessModel: 'mcp',
      identityType: 'influencer',
      status: 'approved',
      submittedAt: formatDateTime(new Date(now.getTime() - 48 * 60 * 60 * 1000)),
      reviewedAt: formatDateTime(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
      reviewedBy: '系统管理员',
      data: {
        realName: '李四',
        idNumber: '110101199001011235',
        phone: '13912345679',
        email: 'mcp@test.com',
        channels: ['视频平台', '社交媒体'],
        platform: '抖音',
        accountName: '@旅行博主小李',
        fansCount: '10-50万',
        monthlyActive: '50-100万',
        contentType: '旅行探险',
        portfolio: 'https://example.com/portfolio',
        bankName: '中国建设银行',
        bankAccount: '6222021234567890124',
        accountHolder: '李四',
      },
    },
    // 审核通过申请 - SaaS模式
    {
      id: 'APP-003',
      userId: 'test-approved-saas',
      userEmail: 'saas@test.com',
      applicantName: '赵六',
      businessModel: 'saas',
      identityType: 'individual',
      status: 'approved',
      submittedAt: formatDateTime(new Date(now.getTime() - 48 * 60 * 60 * 1000)),
      reviewedAt: formatDateTime(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
      reviewedBy: '系统管理员',
      data: {
        realName: '赵六',
        idNumber: '110101199001011236',
        phone: '13912345681',
        email: 'saas@test.com',
        bankName: '中国工商银行',
        bankAccount: '6222021234567890125',
        accountHolder: '赵六',
      },
    },
    // 审核通过申请 - 推广联盟模式
    {
      id: 'APP-004',
      userId: 'test-approved-affiliate',
      userEmail: 'affiliate@test.com',
      applicantName: '孙七',
      businessModel: 'affiliate',
      identityType: 'influencer',
      status: 'approved',
      submittedAt: formatDateTime(new Date(now.getTime() - 48 * 60 * 60 * 1000)),
      reviewedAt: formatDateTime(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
      reviewedBy: '系统管理员',
      data: {
        realName: '孙七',
        idNumber: '110101199001011237',
        phone: '13912345682',
        email: 'affiliate@test.com',
        mainPlatform: '小红书',
        mainProfileLink: 'https://xiaohongshu.com/user/test',
        mainFollowersCount: '100000',
        bankName: '中国建设银行',
        bankAccount: '6222021234567890126',
        accountHolder: '孙七',
      },
    },
    // 已驳回申请
    {
      id: 'APP-005',
      userId: 'test-rejected',
      userEmail: 'rejected@test.com',
      applicantName: '王五',
      businessModel: 'saas',
      identityType: 'enterprise',
      status: 'rejected',
      submittedAt: formatDateTime(new Date(now.getTime() - 72 * 60 * 60 * 1000)),
      reviewedAt: formatDateTime(new Date(now.getTime() - 48 * 60 * 60 * 1000)),
      reviewedBy: '系统管理员',
      rejectionReason: '营业执照图片不清晰，无法核实企业信息。请重新上传高清营业执照照片，确保所有文字信息清晰可见。',
      data: {
        companyName: '北京测试科技有限公司',
        creditCode: '91110000MA001234XY',
        legalPerson: '王五',
        legalIdNumber: '110101198001011236',
        contactName: '赵六',
        contactPhone: '13912345680',
        contactEmail: 'rejected@test.com',
        bankName: '中国农业银行',
        bankAccount: '1234567890123456789',
        accountName: '北京测试科技有限公司',
      },
    },
  ];
  
  // Add missing test applications
  let appsUpdated = false;
  testApplicationsDefinition.forEach(testApp => {
    const exists = existingApplications.some((app: any) => app.id === testApp.id);
    if (!exists) {
      existingApplications.push(testApp);
      appsUpdated = true;
    }
  });
  
  if (appsUpdated || existingApplications.length === 0) {
    localStorage.setItem('applications', JSON.stringify(existingApplications));
  }
  
  return existingUsers;
};

export function LoginPage({ onLoginSuccess, onSwitchToRegister }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showTestInfo, setShowTestInfo] = useState(true);
  const [showAdminHint, setShowAdminHint] = useState(false);

  // Initialize test accounts on component mount
  useEffect(() => {
    initializeTestAccounts();
  }, []);

  // Phone login form
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
  });

  // Email login form
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
  });

  // Validation functions
  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send SMS verification code
  const sendSmsCode = () => {
    if (!validatePhone(phoneForm.phone)) {
      toast.error('请输入正确的手机号码');
      return;
    }

    // Mock: Check if phone exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (!existingUsers.some((u: any) => u.phone === phoneForm.phone)) {
      toast.error('该手机号未注册，请先注册');
      return;
    }

    // Start countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast.success('验证码已发送（模拟）：123456');
  };

  // Handle phone login
  const handlePhoneLogin = () => {
    if (!validatePhone(phoneForm.phone)) {
      toast.error('请输入正确的手机号码');
      return;
    }

    if (!phoneForm.code) {
      toast.error('请输入验证码');
      return;
    }

    if (phoneForm.code !== '123456') {
      toast.error('验证码错误');
      return;
    }

    // Check if user exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find((u: any) => u.phone === phoneForm.phone);

    if (!user) {
      toast.error('该手机号未注册，请先注册');
      return;
    }

    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      toast.success('登录成功！');
      setIsLoading(false);
      onLoginSuccess({ 
        phone: user.phone,
        email: user.email,
        role: user.role || 'user',
        name: user.name,
        registeredAt: user.registeredAt,
      });
    }, 1000);
  };

  // Handle email login
  const handleEmailLogin = () => {
    if (!validateEmail(emailForm.email)) {
      toast.error('请输入正确的邮箱地址');
      return;
    }

    if (!emailForm.password) {
      toast.error('请输入密码');
      return;
    }

    // Check if user exists and password matches
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find((u: any) => u.email === emailForm.email);

    if (!user) {
      toast.error('该邮箱未注册，请先注册');
      return;
    }

    if (user.password !== emailForm.password) {
      toast.error('密码错误，请重试');
      return;
    }

    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      toast.success('登录成功！');
      setIsLoading(false);
      onLoginSuccess({ 
        email: user.email, 
        phone: user.phone,
        role: user.role || 'user',
        name: user.name,
        registeredAt: user.registeredAt,
      });
    }, 1000);
  };

  const quickLogin = (type: 'individual' | 'influencer' | 'enterprise' | 'pending' | 'mcp' | 'saas' | 'affiliate' | 'rejected' | 'admin') => {
    const testAccounts: Record<string, { email: string; password: string }> = {
      admin: { email: 'admin@test.com', password: 'admin1234' },
      individual: { email: 'individual@test.com', password: 'test1234' },
      influencer: { email: 'influencer@test.com', password: 'test1234' },
      enterprise: { email: 'enterprise@test.com', password: 'test1234' },
      pending: { email: 'pending@test.com', password: 'test1234' },
      mcp: { email: 'mcp@test.com', password: 'test1234' },
      saas: { email: 'saas@test.com', password: 'test1234' },
      affiliate: { email: 'affiliate@test.com', password: 'test1234' },
      rejected: { email: 'rejected@test.com', password: 'test1234' },
    };
    
    const account = testAccounts[type];
    setEmailForm(account);
    setActiveTab('email');
  };

  const handleTabValueChange = (value: string) => {
    setActiveTab(value as 'phone' | 'email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>登录您的账号继续使用</CardDescription>
        </CardHeader>
        <CardContent>
          {showTestInfo && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium mb-2">🎯 新用户测试账号（完整流程）：</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('individual')}
                        className="text-xs"
                      >
                        个人账号
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('influencer')}
                        className="text-xs"
                      >
                        博主账号
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('enterprise')}
                        className="text-xs"
                      >
                        企业账号
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2">📋 状态体验账号：</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('pending')}
                        className="text-xs border-yellow-300 hover:bg-yellow-50"
                      >
                        ⏳ 待审核
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('rejected')}
                        className="text-xs border-red-300 hover:bg-red-50"
                      >
                        ❌ 已驳回
                      </Button>
                    </div>
                    <p className="font-medium mb-2 text-green-700">✅ 已通过账号（不同业务模式）：</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('mcp')}
                        className="text-xs border-green-300 hover:bg-green-50"
                      >
                        MCP
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('saas')}
                        className="text-xs border-green-300 hover:bg-green-50"
                      >
                        SaaS
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin('affiliate')}
                        className="text-xs border-green-300 hover:bg-green-50"
                      >
                        推广联盟
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="font-medium mb-2 text-purple-700">👑 管理员入口：</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => quickLogin('admin')}
                      className="text-xs border-purple-300 hover:bg-purple-50 w-full"
                      onMouseEnter={() => setShowAdminHint(true)}
                      onMouseLeave={() => setShowAdminHint(false)}
                    >
                      🔑 管理员后台
                    </Button>
                    {showAdminHint && (
                      <p className="text-xs text-purple-600 mt-1">
                        💡 邮箱：admin@test.com | 密码：admin1234
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      用户密码：<code className="bg-white px-1 rounded">test1234</code>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (confirm('确定要重置所有数据吗？这将清除所有用户和申请记录，并重新初始化测试账号。')) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                        className="text-xs text-orange-600 hover:underline"
                      >
                        🔄 重置数据
                      </button>
                      <button
                        onClick={() => setShowTestInfo(false)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        关闭提示
                      </button>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={handleTabValueChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone">
                <Phone className="w-4 h-4 mr-2" />
                手机登录
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                邮箱登录
              </TabsTrigger>
            </TabsList>

            {/* Phone Login */}
            <TabsContent value="phone" className="space-y-4">
              <div>
                <Label htmlFor="login-phone">手机号</Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="请输入11位手机号"
                  maxLength={11}
                  value={phoneForm.phone}
                  onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="login-sms-code">短信验证码</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="login-sms-code"
                    placeholder="请输入验证码"
                    maxLength={6}
                    value={phoneForm.code}
                    onChange={(e) => setPhoneForm({ ...phoneForm, code: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendSmsCode}
                    disabled={countdown > 0}
                    className="min-w-[100px]"
                  >
                    {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">验证码有效期5分钟</p>
              </div>

              <Button
                onClick={handlePhoneLogin}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                登录
              </Button>
            </TabsContent>

            {/* Email Login */}
            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="login-email">邮箱地址</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="login-password">密码</Label>
                <div className="relative mt-2">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="请输入密码"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="text-sm text-blue-600 hover:underline">
                  忘记密码？
                </button>
              </div>

              <Button
                onClick={handleEmailLogin}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                登录
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <span className="text-gray-600">还没有账号？</span>
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:underline ml-1"
            >
              立即注册
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
