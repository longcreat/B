import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: (verified: boolean) => void;
  verified: boolean;
}

export function PhoneVerification({ phoneNumber, onVerified, verified }: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
      toast.error('请先填写有效的手机号码');
      return;
    }

    // 模拟发送验证码
    setCodeSent(true);
    setCountdown(60);
    toast.success(`验证码已发送至 ${phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`);
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }

    setIsVerifying(true);

    // 模拟验证过程
    setTimeout(() => {
      // 模拟验证码：123456
      if (verificationCode === '123456') {
        toast.success('手机号验证成功');
        onVerified(true);
      } else {
        toast.error('验证码错误，请重新输入');
      }
      setIsVerifying(false);
    }, 1000);
  };

  const resetVerification = () => {
    setVerificationCode('');
    setCodeSent(false);
    setCountdown(0);
    onVerified(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          手机号验证 <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          向您的联系手机号发送验证码以确认号码有效性
        </p>
      </div>

      {!verified && (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>手机号码</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={phoneNumber}
                  readOnly
                  className="flex-1 bg-muted"
                  placeholder="请先填写联系手机号"
                />
                <Button
                  onClick={sendVerificationCode}
                  disabled={countdown > 0 || !phoneNumber}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  {countdown > 0 ? `${countdown}秒后重发` : codeSent ? '重新发送' : '发送验证码'}
                </Button>
              </div>
            </div>

            {codeSent && (
              <div>
                <Label>验证码</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button
                    onClick={verifyCode}
                    disabled={verificationCode.length !== 6 || isVerifying}
                    className="min-w-[100px]"
                  >
                    {isVerifying ? '验证中...' : '验证'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  测试验证码：123456
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {verified && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-900">手机号验证成功</p>
              <p className="text-sm text-green-700 mt-1">
                {phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} 已验证
              </p>
            </div>
            <Button onClick={resetVerification} variant="outline" size="sm">
              重新验证
            </Button>
          </div>
        </Card>
      )}

      {!verified && !codeSent && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            手机号验证是必需的步骤，用于确保联系方式的有效性
          </p>
        </div>
      )}
    </div>
  );
}
