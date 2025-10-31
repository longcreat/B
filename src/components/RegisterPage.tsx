import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Mail, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegisterPageProps {
  onRegisterSuccess: (userData: { phone?: string; email?: string }) => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState<'service' | 'privacy' | null>(null);

  // Phone registration form
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  });

  // Email registration form
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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

  const validatePassword = (password: string) => {
    // 8-16位，必须包含字母和数字
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return passwordRegex.test(password);
  };

  // Send SMS verification code
  const sendSmsCode = () => {
    if (!validatePhone(phoneForm.phone)) {
      toast.error('请输入正确的手机号码');
      return;
    }

    // Mock: Check if phone already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: any) => u.phone === phoneForm.phone)) {
      toast.error('该手机号已注册，请直接登录');
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

  // Handle phone registration
  const handlePhoneRegister = () => {
    // Validation
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

    if (!validatePassword(phoneForm.password)) {
      toast.error('密码需为8-16位，且包含字母和数字');
      return;
    }

    if (phoneForm.password !== phoneForm.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (!agreedToTerms) {
      toast.error('请阅读并同意用户服务协议和隐私政策');
      return;
    }

    // Check if phone already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: any) => u.phone === phoneForm.phone)) {
      toast.error('该手机号已注册，请直接登录');
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        phone: phoneForm.phone,
        password: phoneForm.password,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      toast.success('注册成功！');
      setIsLoading(false);
      onRegisterSuccess({ phone: phoneForm.phone });
    }, 1000);
  };

  // Handle email registration
  const handleEmailRegister = () => {
    // Validation
    if (!validateEmail(emailForm.email)) {
      toast.error('请输入正确的邮箱地址');
      return;
    }

    if (!validatePassword(emailForm.password)) {
      toast.error('密码需为8-16位，且包含字母和数字');
      return;
    }

    if (emailForm.password !== emailForm.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (!agreedToTerms) {
      toast.error('请阅读并同意用户服务协议和隐私政策');
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: any) => u.email === emailForm.email)) {
      toast.error('该邮箱已注册，请直接登录');
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        email: emailForm.email,
        password: emailForm.password,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      toast.success('注册成功！');
      setIsLoading(false);
      onRegisterSuccess({ email: emailForm.email });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">创建账号</CardTitle>
          <CardDescription>选择您喜欢的注册方式开始使用</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'phone' | 'email')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone">
                <Phone className="w-4 h-4 mr-2" />
                手机注册
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                邮箱注册
              </TabsTrigger>
            </TabsList>

            {/* Phone Registration */}
            <TabsContent value="phone" className="space-y-4">
              <div>
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入11位手机号"
                  maxLength={11}
                  value={phoneForm.phone}
                  onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sms-code">短信验证码</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="sms-code"
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

              <div>
                <Label htmlFor="phone-password">设置密码</Label>
                <div className="relative mt-2">
                  <Input
                    id="phone-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8-16位，包含字母和数字"
                    value={phoneForm.password}
                    onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
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

              <div>
                <Label htmlFor="phone-confirm-password">确认密码</Label>
                <div className="relative mt-2">
                  <Input
                    id="phone-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入密码"
                    value={phoneForm.confirmPassword}
                    onChange={(e) =>
                      setPhoneForm({ ...phoneForm, confirmPassword: e.target.value })
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="phone-terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="phone-terms" className="text-sm text-gray-600 leading-tight">
                  我已阅读并同意
                  <button
                    type="button"
                    onClick={() => setShowAgreement('service')}
                    className="text-blue-600 hover:underline mx-1"
                  >
                    《用户服务协议》
                  </button>
                  和
                  <button
                    type="button"
                    onClick={() => setShowAgreement('privacy')}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    《隐私政策》
                  </button>
                </label>
              </div>

              <Button
                onClick={handlePhoneRegister}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                注册
              </Button>
            </TabsContent>

            {/* Email Registration */}
            <TabsContent value="email" className="space-y-4">
              <div>
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email-password">设置密码</Label>
                <div className="relative mt-2">
                  <Input
                    id="email-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8-16位，包含字母和数字"
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

              <div>
                <Label htmlFor="email-confirm-password">确认密码</Label>
                <div className="relative mt-2">
                  <Input
                    id="email-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入密码"
                    value={emailForm.confirmPassword}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, confirmPassword: e.target.value })
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="email-terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="email-terms" className="text-sm text-gray-600 leading-tight">
                  我已阅读并同意
                  <button
                    type="button"
                    onClick={() => setShowAgreement('service')}
                    className="text-blue-600 hover:underline mx-1"
                  >
                    《用户服务协议》
                  </button>
                  和
                  <button
                    type="button"
                    onClick={() => setShowAgreement('privacy')}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    《隐私政策》
                  </button>
                </label>
              </div>

              <Button
                onClick={handleEmailRegister}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                注册
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <span className="text-gray-600">已有账号？</span>
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline ml-1"
            >
              立即登录
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Dialog */}
      <Dialog open={!!showAgreement} onOpenChange={() => setShowAgreement(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showAgreement === 'service' ? '用户服务协议' : '隐私政策'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700">
            {showAgreement === 'service' ? (
              <>
                <h3>一、服务条款的确认和接纳</h3>
                <p>
                  本平台的各项服务的所有权和运营权归本平台所有。用户在使用本平台提供的各项服务之前，应仔细阅读本服务协议。用户使用服务即视为已阅读并同意受本服务协议的约束。
                </p>

                <h3>二、用户账号</h3>
                <p>
                  1. 用户有义务保证密码和账号的安全，用户利用该密码和账号所进行的一切活动引起的任何损失或损害，由用户自行承担全部责任。
                </p>
                <p>
                  2. 用户账号在丢失或遗忘密码后，须遵照本平台的申诉途径进行账号找回。用户应不断提供能增加账号安全性的个人密码保护资料。
                </p>

                <h3>三、用户的权利和义务</h3>
                <p>
                  1. 用户有权根据本协议及本平台发布的相关规则，利用本平台服务进行各种商务、非商务活动。
                </p>
                <p>
                  2. 用户承诺不得以任何方式利用本平台直接或间接从事违反中国法律法规及社会公德的行为。
                </p>

                <h3>四、服务的中断和终止</h3>
                <p>
                  在下列情况下，本平台有权中断或终止向用户提供服务：
                </p>
                <p>
                  1. 用户违反本服务协议中规定的使用规则；
                </p>
                <p>
                  2. 按照法律规定或有权机关的要求；
                </p>
                <p>
                  3. 其他本平台认为需要终止服务的情况。
                </p>
              </>
            ) : (
              <>
                <h3>一、信息收集</h3>
                <p>
                  我们会收集您在注册、使用服务时主动提供的信息，包括但不限于：手机号码、邮箱地址、身份证信息、企业信息等。
                </p>

                <h3>二、信息使用</h3>
                <p>
                  我们收集的信息将用于：
                </p>
                <p>
                  1. 提供、维护和改进我们的服务；
                </p>
                <p>
                  2. 处理您的交易和发送相关信息；
                </p>
                <p>
                  3. 发送技术通知、更新、安全警报等；
                </p>
                <p>
                  4. 符合法律法规要求的其他用途。
                </p>

                <h3>三、信息保护</h3>
                <p>
                  我们采用业界标准的安全措施保护您的个人信息，防止数据遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。
                </p>

                <h3>四、信息共享</h3>
                <p>
                  除非获得您的明确同意，我们不会与第三方共享您的个人信息，以下情况除外：
                </p>
                <p>
                  1. 根据法律法规或政府要求；
                </p>
                <p>
                  2. 为提供您要求的服务所必需；
                </p>
                <p>
                  3. 经过匿名化处理的统计数据。
                </p>

                <h3>五、您的权利</h3>
                <p>
                  您有权访问、更正、删除您的个人信息，或撤回您的同意。如需行使这些权利，请联系我们的客服。
                </p>
              </>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowAgreement(null)}>我已了解</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
