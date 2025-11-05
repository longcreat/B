import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';
import { HelpCircle, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ImageUpload } from './ImageUpload';
import { AgreementCheckbox } from './AgreementCheckbox';
import { FaceVerification } from './FaceVerification';
import { PhoneVerification } from './PhoneVerification';

interface SocialPlatform {
  id: string;
  platform: string;
  profileLink: string;
  followersCount: number;
  screenshots: File[];
}

interface InfluencerFormData {
  realName: string;
  idNumber: string;
  idValidityStart: string;
  idValidityEnd: string;
  idPhotoFront: File | null;
  idPhotoBack: File | null;
  phone: string;
  email?: string;
  accountType: 'bank' | 'alipay';
  bankCardholderName?: string;
  bankName?: string;
  bankBranch?: string;
  bankCardNumber?: string;
  alipayAccount?: string;
  alipayRealName?: string;
  mainPlatform: string;
  mainProfileLink: string;
  mainFollowersCount: string;
  cooperationIntro?: string;
}

interface InfluencerFormProps {
  onBack: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
}

const STORAGE_KEY = 'influencer_form_data';

const PLATFORM_OPTIONS = [
  '小红书',
  '抖音',
  '微信公众号',
  '微博',
  'B站',
  'YouTube',
  'Instagram',
  '知乎',
  '快手',
];

const BANK_OPTIONS = [
  '中国工商银行',
  '中国农业银行',
  '中国银行',
  '中国建设银行',
  '交通银行',
  '中国邮政储蓄银行',
  '招商银行',
  '浦发银行',
  '中信银行',
  '中国光大银行',
  '华夏银行',
  '中国民生银行',
  '广发银行',
  '平安银行',
  '兴业银行',
  '浙商银行',
  '上海银行',
  '北京银行',
];

export function InfluencerForm({ onBack, onSubmit: onSubmitProp, initialData }: InfluencerFormProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idPhotoFront, setIdPhotoFront] = useState<File | null>(null);
  const [idPhotoBack, setIdPhotoBack] = useState<File | null>(null);
  const [mainScreenshots, setMainScreenshots] = useState<File[]>([]);
  const [additionalPlatforms, setAdditionalPlatforms] = useState<SocialPlatform[]>(initialData?.additionalPlatforms || []);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InfluencerFormData>({
    defaultValues: initialData || {
      phone: '138****8888',
      accountType: 'bank',
    },
  });

  const realName = watch('realName');
  const accountType = watch('accountType');
  const mainPlatform = watch('mainPlatform');
  const bankName = watch('bankName');

  useEffect(() => {
    if (realName && accountType === 'bank') {
      setValue('bankCardholderName', realName);
    }
  }, [realName, accountType, setValue]);

  // 初始化数据加载（优先使用initialData，然后是本地存储）
  useEffect(() => {
    // 如果有初始数据（被驳回的申请），使用它
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key !== 'idPhotoFront' && key !== 'idPhotoBack' && key !== 'additionalPlatforms') {
          setValue(key as keyof InfluencerFormData, initialData[key]);
        }
      });
      // 设置附加平台
      if (initialData.additionalPlatforms) {
        setAdditionalPlatforms(initialData.additionalPlatforms);
      }
      return;
    }
    
    // 否则尝试从本地存储恢复
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          if (key !== 'idPhotoFront' && key !== 'idPhotoBack') {
            setValue(key as keyof InfluencerFormData, data[key]);
          }
        });
      } catch (e) {
        console.error('Failed to restore form data', e);
      }
    }
  }, [setValue, initialData]);

  useEffect(() => {
    const subscription = watch((value: any) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const validateIdNumber = (value: string) => {
    if (!/^\d{18}$/.test(value)) {
      return '身份证号必须为18位数字';
    }
    return true;
  };

  const validatePhone = (value: string) => {
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '请输入有效的手机号码';
    }
    return true;
  };

  const validateEmail = (value?: string) => {
    if (!value) return true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '请输入有效的邮箱地址';
    }
    return true;
  };

  const validateUrl = (value: string) => {
    if (!value) return '个人主页链接为必填项';
    try {
      new URL(value);
      return true;
    } catch {
      return '请输入有效的URL地址';
    }
  };

  const addPlatform = () => {
    setAdditionalPlatforms([
      ...additionalPlatforms,
      {
        id: Date.now().toString(),
        platform: '',
        profileLink: '',
        followersCount: 0,
        screenshots: [],
      },
    ]);
  };

  const removePlatform = (id: string) => {
    setAdditionalPlatforms(additionalPlatforms.filter((p) => p.id !== id));
  };

  const updatePlatform = (id: string, field: keyof SocialPlatform, value: any) => {
    setAdditionalPlatforms(
      additionalPlatforms.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const onSubmit = (data: InfluencerFormData) => {
    if (!idPhotoFront || !idPhotoBack) {
      toast.error('请上传身份证人像面和国徽面照片');
      return;
    }

    if (mainScreenshots.length === 0) {
      toast.error('请至少上传一张后台数据截图');
      return;
    }

    if (accountType === 'bank') {
      if (!data.bankName || !data.bankBranch || !data.bankCardNumber) {
        toast.error('请完善银行卡信息');
        return;
      }
    } else {
      if (!data.alipayAccount || !data.alipayRealName) {
        toast.error('请完善支付宝信息');
        return;
      }
      if (data.alipayRealName !== realName) {
        toast.error('支付宝实名认证姓名必须与真实姓名一致');
        return;
      }
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    const formData = watch();
    const submissionData = {
      ...formData,
      idPhotoFront: idPhotoFront ? URL.createObjectURL(idPhotoFront) : null,
      idPhotoBack: idPhotoBack ? URL.createObjectURL(idPhotoBack) : null,
      mainScreenshots: mainScreenshots.map(file => URL.createObjectURL(file)),
      agreementAccepted: {
        accepted: true,
        timestamp: new Date().toISOString(),
        version: 'v1.0',
      },
    };
    
    if (onSubmitProp) {
      onSubmitProp(submissionData);
    }
    
    toast.success('博主认证信息已提交审核');
    localStorage.removeItem(STORAGE_KEY);
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>博主认证</CardTitle>
            <p className="text-gray-600 mt-2">
              认证核心：个人身份真实性、商业影响力评估、收款账户有效性
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* A. 身份信息 - 继承个人认证 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">A. 身份信息（用于实名认证）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>
                      真实姓名 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>必须与身份证及银行卡开户名完全一致</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      {...register('realName', { required: '真实姓名为必填项' })}
                      placeholder="请输入真实姓名"
                      className="mt-2"
                    />
                    {errors.realName && (
                      <p className="text-red-500 mt-1">{errors.realName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      身份证号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('idNumber', {
                        required: '身份证号为必填项',
                        validate: validateIdNumber,
                      })}
                      placeholder="请输入18位身份证号"
                      maxLength={18}
                      className="mt-2"
                    />
                    {errors.idNumber && (
                      <p className="text-red-500 mt-1">{errors.idNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>身份证有效期 <span className="text-red-500">*</span></Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Input
                          type="date"
                          {...register('idValidityStart', { required: '请选择起始日期' })}
                        />
                        {errors.idValidityStart && (
                          <p className="text-red-500 mt-1">{errors.idValidityStart.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="date"
                          {...register('idValidityEnd', { required: '请选择结束日期' })}
                        />
                        {errors.idValidityEnd && (
                          <p className="text-red-500 mt-1">{errors.idValidityEnd.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>身份证照片 <span className="text-red-500">*</span></Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <ImageUpload
                        label="身份证人像面"
                        file={idPhotoFront}
                        onChange={setIdPhotoFront}
                        maxSize={5}
                      />
                      <ImageUpload
                        label="身份证国徽面"
                        file={idPhotoBack}
                        onChange={setIdPhotoBack}
                        maxSize={5}
                      />
                    </div>
                  </div>

                  <FaceVerification 
                    onVerified={setFaceVerified}
                    verified={faceVerified}
                  />
                </div>
              </div>

              {/* B. 商业影响力信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">B. 商业影响力信息（用于资质评估）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>主营社交平台 <span className="text-red-500">*</span></Label>
                    <Select
                      value={mainPlatform}
                      onValueChange={(value: string) => setValue('mainPlatform', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="请选择主营社交平台" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.mainPlatform && (
                      <p className="text-red-500 mt-1">{errors.mainPlatform.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>个人主页链接 <span className="text-red-500">*</span></Label>
                    <Input
                      {...register('mainProfileLink', {
                        required: '个人主页链接为必填项',
                        validate: validateUrl,
                      })}
                      placeholder="https://"
                      className="mt-2"
                    />
                    {errors.mainProfileLink && (
                      <p className="text-red-500 mt-1">{errors.mainProfileLink.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>粉丝数/订阅数 <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      {...register('mainFollowersCount', { required: '粉丝数为必填项' })}
                      placeholder="请输入粉丝数"
                      className="mt-2"
                    />
                    {errors.mainFollowersCount && (
                      <p className="text-red-500 mt-1">{errors.mainFollowersCount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      后台数据截图 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              为验证您的影响力，请提供能展示粉丝画像、近期作品平均阅读/播放量、互动率等数据的后台截图
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="mt-2">
                      <MultiImageUpload
                        files={mainScreenshots}
                        onChange={setMainScreenshots}
                        maxFiles={3}
                        maxSize={5}
                      />
                      <p className="text-gray-500 mt-1">最多上传3张截图</p>
                    </div>
                  </div>

                  {additionalPlatforms.length > 0 && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4>额外社交平台</h4>
                      {additionalPlatforms.map((platform, index) => (
                        <div key={platform.id} className="p-4 bg-white rounded border space-y-3">
                          <div className="flex justify-between items-center">
                            <span>平台 {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePlatform(platform.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Select
                            value={platform.platform}
                            onValueChange={(value: string) => updatePlatform(platform.id, 'platform', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择平台" />
                            </SelectTrigger>
                            <SelectContent>
                              {PLATFORM_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="个人主页链接"
                            value={platform.profileLink}
                            onChange={(e) =>
                              updatePlatform(platform.id, 'profileLink', e.target.value)
                            }
                          />
                          <Input
                            type="number"
                            placeholder="粉丝数"
                            value={platform.followersCount || ''}
                            onChange={(e) =>
                              updatePlatform(platform.id, 'followersCount', parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPlatform}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加更多平台
                  </Button>

                  <div>
                    <Label>合作简介</Label>
                    <Textarea
                      {...register('cooperationIntro')}
                      placeholder="您可以介绍粉丝画像、擅长领域和成功案例，有助于加快审核（选填）"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* C. 联系信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">C. 联系信息（用于运营沟通）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>联系手机号 <span className="text-red-500">*</span></Label>
                    <Input
                      {...register('phone', {
                        required: '联系手机号为必填项',
                        validate: validatePhone,
                      })}
                      placeholder="请输入手机号"
                      className="mt-2"
                    />
                    {errors.phone && (
                      <p className="text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>电子邮箱</Label>
                    <Input
                      {...register('email', { validate: validateEmail })}
                      type="email"
                      placeholder="选填"
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <PhoneVerification
                    phoneNumber={watch('phone') || ''}
                    onVerified={setPhoneVerified}
                    verified={phoneVerified}
                  />
                </div>
              </div>

              {/* D. 结算账户信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">D. 结算账户信息（用于支付佣金）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>账户类型 <span className="text-red-500">*</span></Label>
                    <RadioGroup
                      value={accountType}
                      onValueChange={(value: string) => setValue('accountType', value as 'bank' | 'alipay')}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="cursor-pointer">银行卡</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alipay" id="alipay" />
                        <Label htmlFor="alipay" className="cursor-pointer">支付宝</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {accountType === 'bank' && (
                    <div className="space-y-4 pl-6 border-l-2">
                      <div>
                        <Label>开户人姓名 <span className="text-red-500">*</span></Label>
                        <Input
                          {...register('bankCardholderName')}
                          readOnly
                          className="mt-2 bg-gray-100"
                          placeholder="自动填充真实姓名"
                        />
                        <p className="text-gray-500 mt-1">自动填充"真实姓名"且不可修改</p>
                      </div>

                      <div>
                        <Label>开户银行 <span className="text-red-500">*</span></Label>
                        <Select
                          value={bankName}
                          onValueChange={(value: string) => setValue('bankName', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="请选择开户银行" />
                          </SelectTrigger>
                          <SelectContent>
                            {BANK_OPTIONS.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {accountType === 'bank' && !bankName && (
                          <p className="text-red-500 mt-1">开户银行为必填项</p>
                        )}
                      </div>

                      <div>
                        <Label>开户支行 <span className="text-red-500">*</span></Label>
                        <Input
                          {...register('bankBranch', { required: accountType === 'bank' })}
                          placeholder="如：北京市朝阳区支行"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>银行卡号 <span className="text-red-500">*</span></Label>
                        <Input
                          {...register('bankCardNumber', { required: accountType === 'bank' })}
                          placeholder="请输入银行卡号"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {accountType === 'alipay' && (
                    <div className="space-y-4 pl-6 border-l-2">
                      <div>
                        <Label>支付宝账号 <span className="text-red-500">*</span></Label>
                        <Input
                          {...register('alipayAccount', { required: accountType === 'alipay' })}
                          placeholder="手机号或邮箱"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label>实名认证姓名 <span className="text-red-500">*</span></Label>
                        <Input
                          {...register('alipayRealName', { required: accountType === 'alipay' })}
                          placeholder="请输入支付宝实名认证姓名"
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <AgreementCheckbox
                  checked={agreementAccepted}
                  onCheckedChange={setAgreementAccepted}
                />
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={onBack}>
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!agreementAccepted || !faceVerified || !phoneVerified}
                  >
                    提交审核
                  </Button>
                </div>
                {(!faceVerified || !phoneVerified) && (
                  <p className="text-sm text-amber-600 text-right">
                    请完成人脸识别和手机号验证后提交
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认提交</AlertDialogTitle>
            <AlertDialogDescription>
              请仔细检查您填写的信息是否准确无误。提交后，我们将进行审核，审核结果将通过短信和邮件通知您。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>检查信息</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>确认提交</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MultiImageUpload({
  files,
  onChange,
  maxFiles,
  maxSize,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
  maxSize: number;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`文件 ${file.name} 超过 ${maxSize}MB`);
        return false;
      }
      return true;
    });

    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    onChange(newFiles);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {files.length < maxFiles && (
        <div>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            multiple
          />
        </div>
      )}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`截图 ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
