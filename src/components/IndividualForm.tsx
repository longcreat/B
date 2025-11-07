import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ImageUpload } from './ImageUpload';
import { AgreementCheckbox } from './AgreementCheckbox';
import { FaceVerification } from './FaceVerification';
import { PhoneVerification } from './PhoneVerification';

interface IndividualFormData {
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
  // 旅行代理业务证明（必填）
  businessProofScreenshots?: File[];
  // 独立开发者MCP业务额外字段
  githubAccount?: string;
  portfolioLink?: string;
  appScreenshots?: File[];
  // 独立开发者SaaS业务额外字段
  existingBusinessLink?: string;
  existingBusinessScreenshots?: File[];
  // 个人代理/推广联盟业务额外字段
  businessScenario?: string;
}

interface IndividualFormProps {
  onBack: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
  userType?: 'travel_agent' | 'influencer' | 'travel_app'; // 用户信息类型
  certificationType?: 'individual' | 'enterprise'; // 认证方式
  businessModel?: 'mcp' | 'saas' | 'affiliate'; // 业务模式
  identityType?: 'developer' | 'agent'; // 兼容旧的身份类型
}

const STORAGE_KEY = 'individual_form_data';

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

export function IndividualForm({ onBack, onSubmit: onSubmitProp, initialData, userType, certificationType, businessModel, identityType }: IndividualFormProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [idPhotoFront, setIdPhotoFront] = useState<File | null>(null);
  const [idPhotoBack, setIdPhotoBack] = useState<File | null>(null);
  
  // 兼容旧的身份类型，如果提供了新的userType，则根据userType推断
  const effectiveIdentityType = identityType || (userType === 'travel_agent' ? 'agent' : userType === 'travel_app' ? 'developer' : undefined);
  const [appScreenshots, setAppScreenshots] = useState<File[]>(initialData?.appScreenshots || []);
  const [businessProofScreenshots, setBusinessProofScreenshots] = useState<File[]>(initialData?.businessProofScreenshots || []);
  const [existingBusinessScreenshots, setExistingBusinessScreenshots] = useState<File[]>(initialData?.existingBusinessScreenshots || []);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 判断是否为独立开发者
  const isDeveloper = effectiveIdentityType === 'developer';
  // 判断是否为旅行代理
  const isTravelAgent = userType === 'travel_agent';
  // 判断是否为MCP业务
  const isMCPBusiness = businessModel === 'mcp';
  // 判断是否为SaaS业务
  const isSaaSBusiness = businessModel === 'saas';
  // 判断是否为Affiliate业务
  const isAffiliateBusiness = businessModel === 'affiliate';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IndividualFormData>({
    defaultValues: initialData || {
      phone: '138****8888', // 模拟预填充的注册手机号
      accountType: 'bank',
    },
  });

  const realName = watch('realName');
  const accountType = watch('accountType');
  const bankName = watch('bankName');

  // 自动填充开户人姓名
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
        if (key !== 'idPhotoFront' && key !== 'idPhotoBack') {
          setValue(key as keyof IndividualFormData, initialData[key]);
        }
      });
      return;
    }
    
    // 否则尝试从本地存储恢复
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((key) => {
          if (key !== 'idPhotoFront' && key !== 'idPhotoBack') {
            setValue(key as keyof IndividualFormData, data[key]);
          }
        });
      } catch (e) {
        console.error('Failed to restore form data', e);
      }
    }
  }, [setValue, initialData]);

  // 自动保存到本地存储
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


  const onSubmit = (data: IndividualFormData) => {
    if (!idPhotoFront || !idPhotoBack) {
      toast.error('请上传身份证人像面和国徽面照片');
      return;
    }

    // 旅行代理必填业务证明截图
    if (isTravelAgent && businessProofScreenshots.length === 0) {
      toast.error('请上传业务证明截图');
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
      // 旅行代理业务证明截图
      ...(isTravelAgent && businessProofScreenshots.length > 0 ? {
        businessProofScreenshots: businessProofScreenshots.map(file => URL.createObjectURL(file)),
      } : {}),
      // 独立开发者MCP业务额外字段
      ...(isDeveloper && isMCPBusiness ? {
        githubAccount: formData.githubAccount,
        portfolioLink: formData.portfolioLink,
        ...(appScreenshots.length > 0 ? {
          appScreenshots: appScreenshots.map(file => URL.createObjectURL(file)),
        } : {}),
      } : {}),
      // 独立开发者SaaS业务额外字段
      ...(isDeveloper && isSaaSBusiness ? {
        existingBusinessLink: formData.existingBusinessLink,
        ...(existingBusinessScreenshots.length > 0 ? {
          existingBusinessScreenshots: existingBusinessScreenshots.map(file => URL.createObjectURL(file)),
        } : {}),
      } : {}),
      // 独立开发者Affiliate业务或旅行代理推广联盟业务额外字段
      ...((isDeveloper && isAffiliateBusiness) || (isTravelAgent && isAffiliateBusiness) ? {
        businessScenario: formData.businessScenario,
      } : {}),
      agreementAccepted: {
        accepted: true,
        timestamp: new Date().toISOString(),
        version: 'v1.0',
      },
    };
    
    if (onSubmitProp) {
      onSubmitProp(submissionData);
    }
    
    toast.success('个人认证信息已提交审核');
    localStorage.removeItem(STORAGE_KEY);
    setShowConfirmDialog(false);
  };

  return (
    <>
    <Card className="border-gray-200">
      <CardHeader className="pb-4 border-b bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900">个人认证</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          认证核心：身份真实性、收款账户有效性
        </p>
      </CardHeader>
      <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* A. 身份信息 */}
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
                      {...register('realName', { required: '真实姓名为必��项' })}
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>系统将进行18位格式校验，并用于后续实名核验</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                    <Label>
                      身份证有效期 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>用于判断证件时效性，规避风险</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
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
                    <Label>
                      身份证照片 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>支持JPG/PNG/JPEG，单张不超过5MB，确保文字清晰、无反光、无遮挡</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
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

              {/* B. 业务证明（旅行代理必填） */}
              {isTravelAgent && (
                <div>
                  <h3 className="mb-4 pb-2 border-b">B. 业务证明（必填）</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>
                        业务证明截图 <span className="text-red-500">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>证明从事酒店代订业务的材料，最多5张，JPG/PNG，≤5MB</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []).slice(0, 5);
                            setBusinessProofScreenshots(files);
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {businessProofScreenshots.length > 0 && (
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {businessProofScreenshots.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`业务证明${index + 1}`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newScreenshots = businessProofScreenshots.filter((_, i) => i !== index);
                                    setBusinessProofScreenshots(newScreenshots);
                                  }}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-1">例如：微信群截图、企业内部代订记录等</p>
                      </div>
                      {businessProofScreenshots.length === 0 && (
                        <p className="text-red-500 mt-1">请上传业务证明截图</p>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* 独立开发者MCP业务额外字段 */}
              {isDeveloper && isMCPBusiness && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">技术能力证明（选填）</h4>
                  
                  <div>
                    <Label>GitHub账号</Label>
                    <Input
                      {...register('githubAccount')}
                      placeholder="例如：username"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>作品集链接</Label>
                    <Input
                      {...register('portfolioLink')}
                      placeholder="应用/网站/小程序链接"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>应用截图（最多3张）</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []).slice(0, 3);
                          setAppScreenshots(files);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {appScreenshots.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {appScreenshots.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`截图${index + 1}`}
                                className="w-20 h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newScreenshots = appScreenshots.filter((_, i) => i !== index);
                                  setAppScreenshots(newScreenshots);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 独立开发者SaaS业务额外字段 */}
              {isDeveloper && isSaaSBusiness && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">现有业务证明（选填）</h4>
                  
                  <div>
                    <Label>现有业务链接</Label>
                    <Input
                      {...register('existingBusinessLink')}
                      placeholder="网站、APP链接或相关业务链接"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>现有业务截图（最多3张）</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []).slice(0, 3);
                          setExistingBusinessScreenshots(files);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {existingBusinessScreenshots.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {existingBusinessScreenshots.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`业务截图${index + 1}`}
                                className="w-20 h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newScreenshots = existingBusinessScreenshots.filter((_, i) => i !== index);
                                  setExistingBusinessScreenshots(newScreenshots);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 独立开发者Affiliate业务额外字段 */}
              {isDeveloper && isAffiliateBusiness && (
                <div className="mt-6">
                  <Label>业务场景说明（选填）</Label>
                  <Textarea
                    {...register('businessScenario')}
                    placeholder="请简要描述您的业务场景和需求"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              {/* 旅行代理推广联盟业务额外字段 */}
              {isTravelAgent && isAffiliateBusiness && (
                <div className="mt-6">
                  <Label>业务场景说明（选填）</Label>
                  <Textarea
                    {...register('businessScenario')}
                    placeholder="请简要描述您的业务场景和需求"
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              {/* C. 联系信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">C. 联系信息（用于运营沟通）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>
                      联系手机号 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>默认填充注册手机号，但允许修改。此手机将用于接收业务及财务通知</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
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
                    <Label>
                      电子邮箱 {isTravelAgent && <span className="text-red-500">*</span>}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>用于接收电子对账单和协议文件</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      {...register('email', { 
                        required: isTravelAgent ? '电子邮箱为必填项' : false,
                        validate: validateEmail 
                      })}
                      type="email"
                      placeholder={isTravelAgent ? "请输入邮箱地址" : "选填"}
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
                        <Label>
                          实名认证姓名 <span className="text-red-500">*</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>需与上方"真实姓名"进行前端一致性校验</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
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
    </>
  );
}
