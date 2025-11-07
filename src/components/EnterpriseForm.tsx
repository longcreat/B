import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ImageUpload } from './ImageUpload';
import { AgreementCheckbox } from './AgreementCheckbox';
import { FaceVerification } from './FaceVerification';
import { PhoneVerification } from './PhoneVerification';

interface EnterpriseFormData {
  companyName: string;
  creditCode: string;
  businessLicense: File | null;
  legalRepName: string;
  legalRepIdNumber: string;
  legalRepIdPhotoFront: File | null;
  legalRepIdPhotoBack: File | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  accountHolderName: string;
  bankName: string;
  bankBranch: string;
  accountNumber: string;
  // MCP业务额外字段
  techTeamSize?: number;
  techTeamDescription?: string;
  companyScale?: string;
  applicationLink?: string;
  applicationScreenshots?: File[];
  // SaaS业务额外字段
  existingBusinessLink?: string;
  existingBusinessScreenshots?: File[];
  // Affiliate业务额外字段
  businessScenario?: string;
  // 旅行代理业务证明材料（必填）
  businessProofMaterials?: File[];
}

interface EnterpriseFormProps {
  onBack: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
  userType?: 'travel_agent' | 'influencer' | 'travel_app'; // 用户信息类型
  certificationType?: 'individual' | 'enterprise'; // 认证方式
  businessModel?: 'mcp' | 'saas' | 'affiliate'; // 业务模式
}

const STORAGE_KEY = 'enterprise_form_data';

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

export function EnterpriseForm({ onBack, onSubmit: onSubmitProp, initialData, userType, certificationType, businessModel }: EnterpriseFormProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [legalRepIdPhotoFront, setLegalRepIdPhotoFront] = useState<File | null>(null);
  const [legalRepIdPhotoBack, setLegalRepIdPhotoBack] = useState<File | null>(null);
  const [existingBusinessScreenshots, setExistingBusinessScreenshots] = useState<File[]>(initialData?.existingBusinessScreenshots || []);
  const [businessProofMaterials, setBusinessProofMaterials] = useState<File[]>(initialData?.businessProofMaterials || []);
  const [applicationScreenshots, setApplicationScreenshots] = useState<File[]>(initialData?.applicationScreenshots || []);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  
  // 判断是否为旅行代理
  const isTravelAgent = userType === 'travel_agent';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EnterpriseFormData>({
    defaultValues: initialData || {},
  });

  const companyName = watch('companyName');
  const bankName = watch('bankName');

  // 自动填充账户持有人名称
  useEffect(() => {
    if (companyName) {
      setValue('accountHolderName', companyName);
    }
  }, [companyName, setValue]);

  // 初始化数据加载（优先使用initialData，然后是本地存储）
  useEffect(() => {
    // 如果有初始数据（被驳回的申请），使用它
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (key !== 'businessLicense') {
          setValue(key as keyof EnterpriseFormData, initialData[key]);
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
          if (key !== 'businessLicense') {
            setValue(key as keyof EnterpriseFormData, data[key]);
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

  const validateCreditCode = (value: string) => {
    if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(value)) {
      return '请输入有效的统一社会信用代码（18位）';
    }
    return true;
  };

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

  const validateEmail = (value: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '请输入有效的邮箱地址';
    }
    return true;
  };

  const onSubmit = (data: EnterpriseFormData) => {
    if (!businessLicense) {
      toast.error('请上传营业执照照片');
      return;
    }

    if (!legalRepIdPhotoFront || !legalRepIdPhotoBack) {
      toast.error('请上传法人身份证人像面和国徽面照片');
      return;
    }

    // 旅行代理必填业务证明材料
    if (isTravelAgent && businessProofMaterials.length === 0) {
      toast.error('请上传业务证明材料');
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    const formData = watch();
    const submissionData = {
      ...formData,
      businessLicense: businessLicense ? URL.createObjectURL(businessLicense) : null,
      legalRepIdPhotoFront: legalRepIdPhotoFront ? URL.createObjectURL(legalRepIdPhotoFront) : null,
      legalRepIdPhotoBack: legalRepIdPhotoBack ? URL.createObjectURL(legalRepIdPhotoBack) : null,
      // MCP业务额外字段
      ...(businessModel === 'mcp' ? {
        techTeamSize: formData.techTeamSize,
        techTeamDescription: formData.techTeamDescription,
        companyScale: formData.companyScale,
        applicationLink: formData.applicationLink,
        ...(applicationScreenshots.length > 0 ? {
          applicationScreenshots: applicationScreenshots.map(file => URL.createObjectURL(file)),
        } : {}),
      } : {}),
      // SaaS业务额外字段
      ...(businessModel === 'saas' ? {
        existingBusinessLink: formData.existingBusinessLink,
        existingBusinessScreenshots: existingBusinessScreenshots.map(file => URL.createObjectURL(file)),
      } : {}),
      // 旅行代理业务证明材料
      ...(isTravelAgent && businessProofMaterials.length > 0 ? {
        businessProofMaterials: businessProofMaterials.map(file => URL.createObjectURL(file)),
      } : {}),
      // Affiliate业务额外字段
      ...(businessModel === 'affiliate' ? {
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
    
    toast.success('企业认证信息已提交审核');
    localStorage.removeItem(STORAGE_KEY);
    setShowConfirmDialog(false);
  };

  return (
    <>
    <Card className="border-gray-200">
      <CardHeader className="pb-4 border-b bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900">企业认证</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          认证核心：企业主体合法性、业务操作人授权、对公账户有效性
        </p>
      </CardHeader>
      <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* A. 企业主体信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">A. 企业主体信息（用于KYB认证）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>
                      企业名称 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>需与营业执照完全一致</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      {...register('companyName', { required: '企业名称为必填项' })}
                      placeholder="请输入企业全称"
                      className="mt-2"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 mt-1">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      统一社会信用代码 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('creditCode', {
                        required: '统一社会信用代码为必填项',
                        validate: validateCreditCode,
                      })}
                      placeholder="请输入18位统一社会信用代码"
                      maxLength={18}
                      className="mt-2"
                    />
                    {errors.creditCode && (
                      <p className="text-red-500 mt-1">{errors.creditCode.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      营业执照照片 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>要求上传清晰的彩色扫描件或照片</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="mt-2">
                      <ImageUpload
                        label="营业执照"
                        file={businessLicense}
                        onChange={setBusinessLicense}
                        maxSize={5}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>
                      法人代表姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('legalRepName', { required: '法人代表姓名为必填项' })}
                      placeholder="请输入法人代表姓名"
                      className="mt-2"
                    />
                    {errors.legalRepName && (
                      <p className="text-red-500 mt-1">{errors.legalRepName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      法人身份证号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('legalRepIdNumber', {
                        required: '法人身份证号为必填项',
                        validate: validateIdNumber,
                      })}
                      placeholder="请输入18位身份证号"
                      maxLength={18}
                      className="mt-2"
                    />
                    {errors.legalRepIdNumber && (
                      <p className="text-red-500 mt-1">{errors.legalRepIdNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      法人身份证照片 <span className="text-red-500">*</span>
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
                        file={legalRepIdPhotoFront}
                        onChange={setLegalRepIdPhotoFront}
                        maxSize={5}
                      />
                      <ImageUpload
                        label="身份证国徽面"
                        file={legalRepIdPhotoBack}
                        onChange={setLegalRepIdPhotoBack}
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

              {/* B. 业务联系人信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">B. 业务联系人信息（平台日常对接人）</h3>
                <div className="space-y-4">
                  <div>
                    <Label>
                      联系人姓名 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('contactName', { required: '联系人姓名为必填项' })}
                      placeholder="请输入联系人姓名"
                      className="mt-2"
                    />
                    {errors.contactName && (
                      <p className="text-red-500 mt-1">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      联系人手机号 <span className="text-red-500">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>用于接收所有业务、技术和财务通知</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      {...register('contactPhone', {
                        required: '联系人手机号为必填项',
                        validate: validatePhone,
                      })}
                      placeholder="请输入手机号"
                      className="mt-2"
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 mt-1">{errors.contactPhone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      联系人电子邮箱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('contactEmail', {
                        required: '联系人电子邮箱为必填项',
                        validate: validateEmail,
                      })}
                      type="email"
                      placeholder="请输入邮箱地址"
                      className="mt-2"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>

                  <PhoneVerification
                    phoneNumber={watch('contactPhone') || ''}
                    onVerified={setPhoneVerified}
                    verified={phoneVerified}
                  />
                </div>
              </div>

              {/* C. 对公结算账户信息 */}
              <div>
                <h3 className="mb-4 pb-2 border-b">C. 对公结算账户信息</h3>
                <div className="space-y-4">
                  <div>
                    <Label>
                      开户主体名称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('accountHolderName')}
                      readOnly
                      className="mt-2 bg-gray-100"
                      placeholder="自动填充企业名称"
                    />
                    <p className="text-gray-500 mt-1">自动填充"企业名称"且不可修改</p>
                  </div>

                  <div>
                    <Label>
                      开户银行 <span className="text-red-500">*</span>
                    </Label>
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
                    {!bankName && (
                      <p className="text-red-500 mt-1">开户银行为必填项</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      开户支行 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('bankBranch', { required: '开户支行为必填项' })}
                      placeholder="如：北京市朝阳区支行"
                      className="mt-2"
                    />
                    {errors.bankBranch && (
                      <p className="text-red-500 mt-1">{errors.bankBranch.message}</p>
                    )}
                  </div>

                  <div>
                    <Label>
                      对公银行账号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register('accountNumber', { required: '对公银行账号为必填项' })}
                      placeholder="请输入对公银行账号"
                      className="mt-2"
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 mt-1">{errors.accountNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* D. 业务模式额外信息 */}
              {businessModel && (
                <div>
                  <h3 className="mb-4 pb-2 border-b">D. 业务模式补充信息（选填）</h3>
                  
                  {/* MCP业务额外字段 */}
                  {businessModel === 'mcp' && (
                    <div className="space-y-4">
                      <div>
                        <Label>技术团队规模</Label>
                        <Input
                          type="number"
                          {...register('techTeamSize', { valueAsNumber: true })}
                          placeholder="请输入技术团队人数"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>技术团队说明</Label>
                        <Textarea
                          {...register('techTeamDescription')}
                          placeholder="请简要描述技术团队情况，如技术负责人、主要技术栈等"
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>企业规模说明</Label>
                        <Textarea
                          {...register('companyScale')}
                          placeholder="请简要描述企业规模，如员工总数、业务范围等"
                          className="mt-2"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>应用链接</Label>
                        <Input
                          {...register('applicationLink')}
                          placeholder="应用截图、官网链接"
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
                              setApplicationScreenshots(files);
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {applicationScreenshots.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {applicationScreenshots.map((file, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`应用截图${index + 1}`}
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newScreenshots = applicationScreenshots.filter((_, i) => i !== index);
                                      setApplicationScreenshots(newScreenshots);
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

                  {/* SaaS业务额外字段 */}
                  {businessModel === 'saas' && (
                    <div className="space-y-4">
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

                  {/* 旅行代理业务证明材料（必填） */}
                  {isTravelAgent && (
                    <div className="mt-6">
                      <h3 className="mb-4 pb-2 border-b">业务证明（必填）</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>
                            业务证明材料 <span className="text-red-500">*</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>旅行社经营许可证、从事旅游订酒店业务的材料，最多5张，JPG/PNG，≤5MB</p>
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
                                setBusinessProofMaterials(files);
                              }}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {businessProofMaterials.length > 0 && (
                              <div className="mt-2 flex gap-2 flex-wrap">
                                {businessProofMaterials.map((file, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`业务证明${index + 1}`}
                                      className="w-20 h-20 object-cover rounded border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newMaterials = businessProofMaterials.filter((_, i) => i !== index);
                                        setBusinessProofMaterials(newMaterials);
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
                          {businessProofMaterials.length === 0 && (
                            <p className="text-red-500 mt-1">请上传业务证明材料</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Affiliate业务额外字段 */}
                  {businessModel === 'affiliate' && (
                    <div>
                      <Label>业务场景说明（选填）</Label>
                      <Textarea
                        {...register('businessScenario')}
                        placeholder={isTravelAgent ? "预订场景描述" : "B2B分销场景描述"}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

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
