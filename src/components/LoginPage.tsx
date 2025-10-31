import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userData: { phone?: string; email?: string }) => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({ onLoginSuccess, onSwitchToRegister }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
      onLoginSuccess({ phone: phoneForm.phone });
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
      onLoginSuccess({ email: emailForm.email });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>登录您的账号继续使用</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'phone' | 'email')}>
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
