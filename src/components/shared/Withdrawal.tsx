// 通用提现中心组件
// 支持大B和小B客户，根据用户类型显示不同的提现功能
// 支持个人版/企业版/积分版三种提现方式

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { 
  Wallet, 
  ArrowUpRight, 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  Clock,
  XCircle,
  Info,
  DollarSign,
  ChevronDown,
  ChevronUp,
  History,
  User,
  Building2,
  Gift,
  Receipt,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import type { Partner } from '../../data/mockPartners';
import { formatCurrency } from '../../utils/format';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

interface WithdrawalProps {
  currentPartner: Partner | null;
  userType: 'bigb' | 'smallb';
}

type WithdrawalVersion = 'individual' | 'enterprise' | 'points';

// 个人版提现记录
interface IndividualWithdrawalRecord {
  id: string;
  version: 'individual';
  amount: number; // 提现金额
  personalTax: number; // 个人所得税
  actualAmount: number; // 实际到账
  type: 'bank' | 'alipay';
  accountInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string; // 申请时间
  completedAt?: string; // 到账时间
  failureReason?: string;
  remark?: string; // 备注
}

// 企业版提现记录
interface EnterpriseWithdrawalRecord {
  id: string;
  version: 'enterprise';
  amount: number; // 提现金额
  enterpriseTax: number; // 企业税
  actualAmount: number; // 实际到账
  invoiceRequired: boolean; // 是否需要发票
  invoiceStatus?: 'pending' | 'submitted' | 'approved'; // 发票状态
  invoiceNumber?: string; // 发票号码
  type: 'bank';
  accountInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string; // 申请时间
  completedAt?: string; // 到账时间
  failureReason?: string;
  remark?: string; // 备注
}

// 积分版兑换记录
interface PointsExchangeRecord {
  id: string;
  version: 'points';
  points: number; // 兑换积分
  amount: number; // 对应金额（1元=1积分）
  productType: 'jd_card' | 'tmall_card' | 'meituan_voucher' | 'iqiyi_member' | 'other';
  productName: string; // 商品名称
  productValue: number; // 商品面额
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string; // 申请时间
  completedAt?: string; // 到账时间
  cardNumber?: string; // 卡号/券码
  failureReason?: string;
}

type WithdrawalRecord = IndividualWithdrawalRecord | EnterpriseWithdrawalRecord | PointsExchangeRecord;

export function Withdrawal({ currentPartner, userType }: WithdrawalProps) {
  // 获取认证方式
  const certificationType = currentPartner?.certificationType || 'individual';
  
  // 积分兑换确认弹窗状态
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof pointsProducts[0] | null>(null);
  const [isWithdrawalInfoOpen, setIsWithdrawalInfoOpen] = useState(false);
  const isEnterprise = certificationType === 'enterprise';
  
  // 版本选择：个人用户默认显示个人版，企业用户只能使用企业版
  const [selectedVersion, setSelectedVersion] = useState<WithdrawalVersion>(
    isEnterprise ? 'enterprise' : 'individual'
  );
  
  // 个人版/企业版提现表单
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalType, setWithdrawalType] = useState<'bank' | 'alipay'>(isEnterprise ? 'bank' : 'bank');
  const [bankCardId, setBankCardId] = useState<string>('');

  // 模拟数据
  const totalCommission = 125680; // 累计佣金/利润
  const availableBalance = 28650; // 可提现余额
  const pendingCommission = 15600; // 待发放佣金/利润（冻结中）
  const totalWithdrawn = 81530; // 已提现金额（历史累计）
  const availablePoints = Math.floor(availableBalance); // 可用积分（1元=1积分）
  const minWithdrawal = userType === 'bigb' ? 1000 : 100; // 大B最低1000，小B最低100
  const minPointsExchange = 100; // 最低兑换积分

  // 模拟银行卡列表
  const bankCards = [
    { id: '1', bankName: '中国工商银行', cardNumber: '6222 **** **** 1234', holderName: '张三' },
    { id: '2', bankName: '中国建设银行', cardNumber: '6227 **** **** 5678', holderName: '张三' },
  ];

  // 积分商城商品列表
  const pointsProducts = [
    { 
      id: 'jd_50', 
      type: 'jd_card' as const, 
      name: '京东E卡', 
      value: 50, 
      points: 50,
      description: '可在京东商城使用',
      validity: '有效期12个月',
      stock: 50
    },
    { 
      id: 'jd_100', 
      type: 'jd_card' as const, 
      name: '京东E卡', 
      value: 100, 
      points: 100,
      description: '可在京东商城使用',
      validity: '有效期12个月',
      stock: 30
    },
    { 
      id: 'jd_200', 
      type: 'jd_card' as const, 
      name: '京东E卡', 
      value: 200, 
      points: 200,
      description: '可在京东商城使用',
      validity: '有效期12个月',
      stock: 20
    },
    { 
      id: 'tmall_50', 
      type: 'tmall_card' as const, 
      name: '天猫超市卡', 
      value: 50, 
      points: 50,
      description: '可在天猫超市使用',
      validity: '有效期12个月',
      stock: 40
    },
    { 
      id: 'tmall_100', 
      type: 'tmall_card' as const, 
      name: '天猫超市卡', 
      value: 100, 
      points: 100,
      description: '可在天猫超市使用',
      validity: '有效期12个月',
      stock: 25
    },
    { 
      id: 'meituan_20', 
      type: 'meituan_voucher' as const, 
      name: '美团外卖无门槛券', 
      value: 20, 
      points: 20,
      description: '可在美团外卖使用',
      validity: '有效期6个月',
      stock: 100
    },
    { 
      id: 'meituan_50', 
      type: 'meituan_voucher' as const, 
      name: '美团外卖无门槛券', 
      value: 50, 
      points: 50,
      description: '可在美团外卖使用',
      validity: '有效期6个月',
      stock: 60
    },
    { 
      id: 'iqiyi_1', 
      type: 'iqiyi_member' as const, 
      name: '爱奇艺会员月卡', 
      value: 19, 
      points: 19,
      description: '可在爱奇艺使用',
      validity: '激活后30天有效',
      stock: 80
    },
  ];

  // 模拟提现记录
  const withdrawalRecords: WithdrawalRecord[] = [
    {
      id: '1',
      version: 'individual',
      amount: 5000,
      personalTax: 500,
      actualAmount: 4500,
      type: 'bank',
      accountInfo: '工商银行 ****1234',
      status: 'completed',
      createdAt: '2025-10-25 10:30',
      completedAt: '2025-10-25 14:20',
      remark: '正常提现',
    },
    {
      id: '2',
      version: 'enterprise',
      amount: 10000,
      enterpriseTax: 1000,
      actualAmount: 9000,
      invoiceRequired: true,
      invoiceStatus: 'approved',
      invoiceNumber: 'INV-2025-001',
      type: 'bank',
      accountInfo: '建设银行 ****5678',
      status: 'completed',
      createdAt: '2025-10-28 09:15',
      completedAt: '2025-10-28 15:30',
    },
    {
      id: '3',
      version: 'points',
      points: 100,
      amount: 100,
      productType: 'jd_card',
      productName: '京东E卡',
      productValue: 100,
      status: 'completed',
      createdAt: '2025-10-30 14:20',
      completedAt: '2025-10-30 14:25',
      cardNumber: 'JD1234567890123456',
    },
  ];

  // 根据版本过滤记录
  const getFilteredRecords = () => {
    return withdrawalRecords.filter(r => r.version === selectedVersion);
  };

  // 个人版提现处理
  const handleIndividualWithdraw = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (!amount || amount < minWithdrawal) {
      toast.error(`最低提现金额为 ${formatCurrency(minWithdrawal)}`);
      return;
    }
    
    if (amount > availableBalance) {
      toast.error('提现金额不能超过可用余额');
      return;
    }
    
    if (withdrawalType === 'bank' && !bankCardId) {
      toast.error('请选择银行卡');
      return;
    }

    // 计算个人所得税（假设20%）
    const personalTax = amount * 0.2;
    const actualAmount = amount - personalTax;

    toast.success(`提现申请已提交，提现金额：${formatCurrency(amount)}，个人所得税：${formatCurrency(personalTax)}，实际到账：${formatCurrency(actualAmount)}`);
    setWithdrawalAmount('');
    setBankCardId('');
  };

  // 企业版提现处理
  const handleEnterpriseWithdraw = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (!amount || amount < minWithdrawal) {
      toast.error(`最低提现金额为 ${formatCurrency(minWithdrawal)}`);
      return;
    }
    
    if (amount > availableBalance) {
      toast.error('提现金额不能超过可用余额');
      return;
    }
    
    if (!bankCardId) {
      toast.error('请选择银行卡');
      return;
    }

    // 计算企业税（假设10%）
    const enterpriseTax = amount * 0.1;
    const actualAmount = amount - enterpriseTax;

    toast.success(`企业提现申请已提交，提现金额：${formatCurrency(amount)}，企业税：${formatCurrency(enterpriseTax)}，实际到账：${formatCurrency(actualAmount)}。请及时提交发票。`);
    setWithdrawalAmount('');
    setBankCardId('');
  };

  // 打开兑换确认弹窗
  const openExchangeDialog = (productId: string) => {
    const product = pointsProducts.find(p => p.id === productId);
    if (!product) {
      toast.error('商品不存在');
      return;
    }

    if (product.points > availablePoints) {
      toast.error(`积分不足，当前可用积分：${availablePoints}`);
      return;
    }

    if (product.stock <= 0) {
      toast.error('商品库存不足');
      return;
    }

    setSelectedProduct(product);
    setShowExchangeDialog(true);
  };

  // 确认积分兑换
  const confirmPointsExchange = () => {
    if (!selectedProduct) return;

    // 扣除积分
    const newBalance = availablePoints - selectedProduct.points;
    
    toast.success(
      <div>
        <p className="font-semibold">兑换成功！</p>
        <p className="text-sm mt-1">商品：{selectedProduct.name} {selectedProduct.value}元</p>
        <p className="text-sm">消耗积分：{selectedProduct.points}</p>
        <p className="text-sm">剩余积分：{newBalance}</p>
      </div>
    );
    
    setShowExchangeDialog(false);
    setSelectedProduct(null);
  };

  const getStatusBadge = (status: WithdrawalRecord['status']) => {
    const config = {
      pending: { label: '待处理', variant: 'default' as const, icon: Clock },
      processing: { label: '处理中', variant: 'default' as const, icon: Clock },
      completed: { label: '已完成', variant: 'secondary' as const, icon: CheckCircle },
      failed: { label: '失败', variant: 'destructive' as const, icon: XCircle },
    };
    const { label, variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  // 计算个人所得税（个人版）
  const calculatePersonalTax = (amount: number): number => {
    // 假设个人所得税率为20%
    return amount * 0.2;
  };

  // 计算企业税（企业版）
  const calculateEnterpriseTax = (amount: number): number => {
    // 假设企业税率为10%
    return amount * 0.1;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>提现管理</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>提现中心</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 累计佣金/利润 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              {userType === 'bigb' ? '累计利润' : '累计佣金'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalCommission)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {userType === 'bigb' ? '历史累计总利润' : '历史累计总佣金'}
            </p>
          </CardContent>
        </Card>

        {/* 可提现余额 */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <Wallet className="w-4 h-4" />
              可提现余额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(availableBalance)}
            </div>
            <p className="text-xs text-green-700 mt-1">
              {userType === 'bigb' ? '可提现利润余额' : '可提现佣金余额'}
            </p>
          </CardContent>
        </Card>

        {/* 待发放佣金/利润 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              {userType === 'bigb' ? '待发放利润' : '待发放佣金'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(pendingCommission)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {userType === 'bigb' ? '订单完成待结算' : '订单完成待结算'}
            </p>
          </CardContent>
        </Card>

        {/* 已提现金额 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <History className="w-4 h-4" />
              已提现金额
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalWithdrawn)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              历史累计提现金额
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 版本选择标签页 */}
      <Card>
        <CardHeader>
          <CardTitle>提现方式</CardTitle>
          <CardDescription>
            {isEnterprise 
              ? '企业用户仅支持企业版提现' 
              : '个人用户可选择个人版提现或积分兑换'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as WithdrawalVersion)}>
            <TabsList className="grid w-full" style={{ gridTemplateColumns: isEnterprise ? '1fr' : '1fr 1fr' }}>
              {!isEnterprise && (
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  个人版
                </TabsTrigger>
              )}
              {isEnterprise && (
                <TabsTrigger value="enterprise" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  企业版
                </TabsTrigger>
              )}
              {!isEnterprise && (
                <TabsTrigger value="points" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  积分版
                </TabsTrigger>
              )}
            </TabsList>

            {/* 个人版提现表单 */}
            {!isEnterprise && (
              <TabsContent value="individual" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label>提现金额</Label>
                  <Input
                    type="number"
                    placeholder={`请输入提现金额（最低 ${formatCurrency(minWithdrawal)}）`}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>可提现余额：{formatCurrency(availableBalance)}</p>
                    {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="flex justify-between">
                          <span>提现金额：</span>
                          <span className="font-medium">{formatCurrency(parseFloat(withdrawalAmount))}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>个人所得税（20%）：</span>
                          <span className="font-medium">-{formatCurrency(calculatePersonalTax(parseFloat(withdrawalAmount)))}</span>
                        </div>
                        <div className="flex justify-between text-green-600 mt-1 pt-1 border-t">
                          <span>实际到账：</span>
                          <span className="font-bold">{formatCurrency(parseFloat(withdrawalAmount) - calculatePersonalTax(parseFloat(withdrawalAmount)))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>提现方式</Label>
                  <Select value={withdrawalType} onValueChange={(v: 'bank' | 'alipay') => setWithdrawalType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          银行卡
                        </div>
                      </SelectItem>
                      <SelectItem value="alipay">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          支付宝
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {withdrawalType === 'bank' && (
                  <div className="space-y-2">
                    <Label>选择银行卡</Label>
                    <Select value={bankCardId} onValueChange={setBankCardId}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择银行卡" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            <div>
                              <div className="font-medium">{card.bankName}</div>
                              <div className="text-xs text-gray-500">{card.cardNumber}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => toast.info('跳转到银行卡管理页面')}
                    >
                      管理银行卡
                    </Button>
                  </div>
                )}

                {withdrawalType === 'alipay' && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      支付宝提现将在银行卡管理页面设置支付宝账户信息
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleIndividualWithdraw} 
                  className="w-full" 
                  size="lg"
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < minWithdrawal}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  提交提现申请
                </Button>
              </TabsContent>
            )}

            {/* 企业版提现表单 */}
            {isEnterprise && (
              <TabsContent value="enterprise" className="space-y-4 mt-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    企业版提现需要提供发票，企业税率为10%
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>提现金额</Label>
                  <Input
                    type="number"
                    placeholder={`请输入提现金额（最低 ${formatCurrency(minWithdrawal)}）`}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>可提现余额：{formatCurrency(availableBalance)}</p>
                    {withdrawalAmount && parseFloat(withdrawalAmount) > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="flex justify-between">
                          <span>提现金额：</span>
                          <span className="font-medium">{formatCurrency(parseFloat(withdrawalAmount))}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>企业税（10%）：</span>
                          <span className="font-medium">-{formatCurrency(calculateEnterpriseTax(parseFloat(withdrawalAmount)))}</span>
                        </div>
                        <div className="flex justify-between text-green-600 mt-1 pt-1 border-t">
                          <span>实际到账：</span>
                          <span className="font-bold">{formatCurrency(parseFloat(withdrawalAmount) - calculateEnterpriseTax(parseFloat(withdrawalAmount)))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>选择银行卡</Label>
                  <Select value={bankCardId} onValueChange={setBankCardId}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择银行卡" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankCards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          <div>
                            <div className="font-medium">{card.bankName}</div>
                            <div className="text-xs text-gray-500">{card.cardNumber}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => toast.info('跳转到银行卡管理页面')}
                  >
                    管理银行卡
                  </Button>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    企业提现需要提供发票，请在提现完成后及时提交发票信息
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleEnterpriseWithdraw} 
                  className="w-full" 
                  size="lg"
                  disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < minWithdrawal || !bankCardId}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  提交企业提现申请
                </Button>
              </TabsContent>
            )}

             {/* 积分版兑换表单 */}
             {!isEnterprise && (
               <TabsContent value="points" className="mt-6">
                 {/* 积分商城标题 */}
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-2">
                     <Gift className="w-6 h-6 text-purple-600" />
                     <h3 className="text-xl font-semibold text-gray-900">积分商城</h3>
                   </div>
                   <div className="text-sm text-gray-600">
                     可用积分：<span className="font-bold text-purple-600">{availablePoints}</span> 分
                   </div>
                 </div>

                 {/* 商品卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pointsProducts.map((product) => {
                    const canExchange = availablePoints >= product.points && product.stock > 0;
                    return (
                      <div 
                        key={product.id} 
                        className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden bg-white"
                      >
                        {/* 顶部图标区域 */}
                        <div className="bg-purple-100 py-8 flex justify-center items-center">
                          <Gift className="w-16 h-16 text-purple-600" strokeWidth={1.5} />
                        </div>

                        {/* 商品信息区域 */}
                        <div className="p-4 space-y-3 bg-white">
                          {/* 商品名称 */}
                          <div className="pb-2 border-b border-gray-100">
                            <h4 className="font-bold text-base text-gray-900 leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-xl font-bold text-purple-600 mt-1">
                              ¥{product.value}
                            </p>
                          </div>

                          {/* 使用说明和有效期 */}
                          <div className="text-xs text-gray-600 space-y-1 min-h-[32px]">
                            <div className="flex items-start gap-1.5">
                              <span className="text-gray-400">•</span>
                              <span className="line-clamp-1">{product.description}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-gray-400">•</span>
                              <span className="line-clamp-1">{product.validity}</span>
                            </div>
                          </div>

                          {/* 积分和库存信息 */}
                          <div className="flex items-center justify-between py-2 border-t border-gray-100">
                            <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                              <Gift className="w-3.5 h-3.5 text-purple-600" />
                              <span className="font-semibold text-xs text-purple-600">{product.points}</span>
                              <span className="text-[10px] text-purple-500">积分</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-gray-500">库存:</span>
                              <span className={`ml-1 font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                {product.stock}
                              </span>
                            </div>
                          </div>

                          {/* 立即兑换按钮 */}
                          <Button
                            onClick={() => openExchangeDialog(product.id)}
                            disabled={!canExchange}
                            className="w-full"
                            style={
                              canExchange
                                ? {
                                    background: 'linear-gradient(to right, #9333ea, #7c3aed)',
                                    color: '#ffffff',
                                  }
                                : {
                                    backgroundColor: '#e5e7eb',
                                    color: '#6b7280',
                                  }
                            }
                          >
                            {!canExchange && product.stock <= 0 ? '库存不足' : !canExchange ? '积分不足' : '立即兑换'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
               </TabsContent>
             )}
          </Tabs>
        </CardContent>
      </Card>

      {/* 提现说明 - 可折叠 */}
      <Collapsible open={isWithdrawalInfoOpen} onOpenChange={setIsWithdrawalInfoOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">提现说明</span>
                </div>
                {isWithdrawalInfoOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">提现时间：</span>
                  <span>工作日 9:00-17:00 提交的申请，当日处理；其他时间次日处理</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">到账时间：</span>
                  <span>处理完成后1-3个工作日到账</span>
                </div>
                {selectedVersion === 'individual' && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">个人所得税：</span>
                    <span>个人版提现需缴纳20%个人所得税</span>
                  </div>
                )}
                {selectedVersion === 'enterprise' && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">企业税：</span>
                    <span>企业版提现需缴纳10%企业税，需提供发票</span>
                  </div>
                )}
                {selectedVersion === 'points' && (
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">积分兑换：</span>
                    <span>1元 = 1积分，兑换后立即发放卡券</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="font-medium min-w-[100px]">最低金额：</span>
                  <span>{formatCurrency(minWithdrawal)}</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 提现明细 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            提现明细
          </CardTitle>
          <CardDescription>查看历史提现申请记录和明细</CardDescription>
        </CardHeader>
        <CardContent>
          {getFilteredRecords().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无{selectedVersion === 'individual' ? '个人版' : selectedVersion === 'enterprise' ? '企业版' : '积分版'}提现记录
            </div>
          ) : (
            <div className="space-y-4">
              {/* 统计汇总 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500 mb-1">总记录数</div>
                  <div className="text-lg font-semibold">{getFilteredRecords().length} 条</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">总金额/积分</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {selectedVersion === 'points' 
                      ? `${getFilteredRecords().reduce((sum, r) => sum + (r.version === 'points' ? r.points : 0), 0)} 积分`
                      : formatCurrency(getFilteredRecords().reduce((sum, r) => sum + (r.version !== 'points' ? r.amount : 0), 0))
                    }
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">已完成</div>
                  <div className="text-lg font-semibold text-green-600">
                    {getFilteredRecords().filter(r => r.status === 'completed').length} 条
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">处理中</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {getFilteredRecords().filter(r => r.status === 'pending' || r.status === 'processing').length} 条
                  </div>
                </div>
              </div>

              {/* 个人版提现记录表格 */}
              {selectedVersion === 'individual' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>提现记录ID</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>提现金额</TableHead>
                      <TableHead>个人所得税</TableHead>
                      <TableHead>实际到账</TableHead>
                      <TableHead>提现方式</TableHead>
                      <TableHead>收款账户</TableHead>
                      <TableHead>到账时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredRecords().map((record) => {
                      if (record.version !== 'individual') return null;
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm font-mono">{record.id}</TableCell>
                          <TableCell className="text-sm">{record.createdAt}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.amount)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            {formatCurrency(record.personalTax)}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(record.actualAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {record.type === 'bank' ? (
                                <CreditCard className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Wallet className="w-4 h-4 text-gray-400" />
                              )}
                              <span>{record.type === 'bank' ? '银行卡' : '支付宝'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{record.accountInfo}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.completedAt || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.remark || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* 企业版提现记录表格 */}
              {selectedVersion === 'enterprise' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>提现记录ID</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>提现金额</TableHead>
                      <TableHead>企业税</TableHead>
                      <TableHead>实际到账</TableHead>
                      <TableHead>收款账户</TableHead>
                      <TableHead>发票状态</TableHead>
                      <TableHead>发票号码</TableHead>
                      <TableHead>到账时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredRecords().map((record) => {
                      if (record.version !== 'enterprise') return null;
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm font-mono">{record.id}</TableCell>
                          <TableCell className="text-sm">{record.createdAt}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.amount)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            {formatCurrency(record.enterpriseTax)}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(record.actualAmount)}
                          </TableCell>
                          <TableCell className="text-sm">{record.accountInfo}</TableCell>
                          <TableCell>
                            {record.invoiceStatus ? (
                              <Badge variant={record.invoiceStatus === 'approved' ? 'secondary' : 'default'}>
                                {record.invoiceStatus === 'pending' ? '待提交' : 
                                 record.invoiceStatus === 'submitted' ? '已提交' : '已审核'}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {record.invoiceNumber || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.completedAt || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.remark || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* 积分版兑换记录表格 */}
              {selectedVersion === 'points' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>兑换记录ID</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>兑换商品</TableHead>
                      <TableHead>商品面额</TableHead>
                      <TableHead>消耗积分</TableHead>
                      <TableHead>卡号/券码</TableHead>
                      <TableHead>完成时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredRecords().map((record) => {
                      if (record.version !== 'points') return null;
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="text-sm font-mono">{record.id}</TableCell>
                          <TableCell className="text-sm">{record.createdAt}</TableCell>
                          <TableCell className="font-medium">
                            {record.productName}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(record.productValue)}
                          </TableCell>
                          <TableCell className="text-purple-600 font-medium">
                            {record.points} 积分
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {record.cardNumber || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {record.completedAt || '-'}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 积分兑换确认弹窗 */}
      <Dialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              确认兑换
            </DialogTitle>
            <DialogDescription>
              请确认以下兑换信息
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 py-2">
              {/* 商品信息 */}
              <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">兑换商品</span>
                  <span className="font-semibold text-gray-900">{selectedProduct.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">商品面额</span>
                  <span className="font-bold text-lg text-purple-600">¥{selectedProduct.value}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                  <span className="text-sm text-gray-600">消耗积分</span>
                  <span className="font-bold text-purple-600">{selectedProduct.points} 积分</span>
                </div>
              </div>

              {/* 积分余额 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">当前可用积分</span>
                  <span className="font-semibold text-gray-900">{availablePoints} 积分</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">兑换后剩余</span>
                  <span className="font-semibold text-green-600">
                    {availablePoints - selectedProduct.points} 积分
                  </span>
                </div>
              </div>

              {/* 提示信息 */}
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  兑换成功后，兑换码将在1-3个工作日内发送至您的账户邮箱，请注意查收。
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowExchangeDialog(false);
                setSelectedProduct(null);
              }}
              className="flex-1"
              style={{ color: '#6b7280' }}
            >
              取消
            </Button>
            <Button
              onClick={confirmPointsExchange}
              className="flex-1"
              style={{
                background: 'linear-gradient(to right, #9333ea, #7c3aed)',
                color: '#ffffff',
              }}
            >
              <Gift className="w-4 h-4 mr-1" />
              确认兑换
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
