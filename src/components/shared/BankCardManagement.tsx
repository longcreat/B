// 通用银行卡管理组件
// 支持大B和小B客户，管理银行卡和支付宝账户

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Wallet,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import type { Partner } from '../../data/mockPartners';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';

interface BankCardManagementProps {
  currentPartner: Partner | null;
  userType: 'bigb' | 'smallb';
}

interface BankCard {
  id: string;
  bankName: string;
  bankBranch?: string;
  cardNumber: string;
  holderName: string;
  isDefault: boolean;
}

interface AlipayAccount {
  id: string;
  account: string;
  realName: string;
  isDefault: boolean;
}

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
];

export function BankCardManagement({ currentPartner, userType }: BankCardManagementProps) {
  const [bankCards, setBankCards] = useState<BankCard[]>([
    {
      id: '1',
      bankName: '中国工商银行',
      bankBranch: '北京分行',
      cardNumber: '6222 **** **** 1234',
      holderName: '张三',
      isDefault: true,
    },
    {
      id: '2',
      bankName: '中国建设银行',
      bankBranch: '上海分行',
      cardNumber: '6227 **** **** 5678',
      holderName: '张三',
      isDefault: false,
    },
  ]);

  const [alipayAccounts, setAlipayAccounts] = useState<AlipayAccount[]>([
    {
      id: '1',
      account: 'zhangsan@example.com',
      realName: '张三',
      isDefault: true,
    },
  ]);

  const [showAddBankDialog, setShowAddBankDialog] = useState(false);
  const [showAddAlipayDialog, setShowAddAlipayDialog] = useState(false);
  const [editingBankCard, setEditingBankCard] = useState<BankCard | null>(null);
  const [editingAlipay, setEditingAlipay] = useState<AlipayAccount | null>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    bankName: '',
    bankBranch: '',
    cardNumber: '',
    holderName: '',
    alipayAccount: '',
    alipayRealName: '',
  });

  const handleAddBankCard = () => {
    if (!formData.bankName || !formData.cardNumber || !formData.holderName) {
      toast.error('请填写完整的银行卡信息');
      return;
    }

    const newCard: BankCard = {
      id: Date.now().toString(),
      bankName: formData.bankName,
      bankBranch: formData.bankBranch,
      cardNumber: formData.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 '), // 格式化卡号
      holderName: formData.holderName,
      isDefault: bankCards.length === 0,
    };

    if (newCard.isDefault) {
      setBankCards(bankCards.map(c => ({ ...c, isDefault: false })));
    }

    setBankCards([...bankCards, newCard]);
    setFormData({ ...formData, bankName: '', bankBranch: '', cardNumber: '', holderName: '' });
    setShowAddBankDialog(false);
    toast.success('银行卡添加成功');
  };

  const handleAddAlipay = () => {
    if (!formData.alipayAccount || !formData.alipayRealName) {
      toast.error('请填写完整的支付宝信息');
      return;
    }

    const newAlipay: AlipayAccount = {
      id: Date.now().toString(),
      account: formData.alipayAccount,
      realName: formData.alipayRealName,
      isDefault: alipayAccounts.length === 0,
    };

    if (newAlipay.isDefault) {
      setAlipayAccounts(alipayAccounts.map(a => ({ ...a, isDefault: false })));
    }

    setAlipayAccounts([...alipayAccounts, newAlipay]);
    setFormData({ ...formData, alipayAccount: '', alipayRealName: '' });
    setShowAddAlipayDialog(false);
    toast.success('支付宝账户添加成功');
  };

  const handleSetDefault = (id: string, type: 'bank' | 'alipay') => {
    if (type === 'bank') {
      setBankCards(bankCards.map(card => ({
        ...card,
        isDefault: card.id === id,
      })));
    } else {
      setAlipayAccounts(alipayAccounts.map(account => ({
        ...account,
        isDefault: account.id === id,
      })));
    }
    toast.success('已设置为默认账户');
  };

  const handleDelete = (id: string) => {
    setBankCards(bankCards.filter(c => c.id !== id));
    setCardToDelete(null);
    toast.success('银行卡已删除');
  };

  const maskCardNumber = (cardNumber: string) => {
    // 如果已经是掩码格式，直接返回
    if (cardNumber.includes('*')) return cardNumber;
    // 否则进行掩码处理
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length >= 4) {
      return cleaned.slice(0, 4) + ' **** **** ' + cleaned.slice(-4);
    }
    return cardNumber;
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
            <BreadcrumbPage>银行卡管理</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 银行卡列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                银行卡
              </CardTitle>
              <CardDescription className="mt-2">
                {userType === 'bigb' ? '企业账户可添加多张银行卡' : '个人账户可添加银行卡用于提现'}
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddBankDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加银行卡
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bankCards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>暂无银行卡，请添加银行卡用于提现</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bankCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{card.bankName}</span>
                      {card.isDefault && (
                        <Badge variant="secondary" className="text-xs">默认</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{maskCardNumber(card.cardNumber)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {card.bankBranch && `${card.bankBranch} · `}
                      {card.holderName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(card.id, 'bank')}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBankCard(card);
                        setFormData({
                          ...formData,
                          bankName: card.bankName,
                          bankBranch: card.bankBranch || '',
                          cardNumber: card.cardNumber.replace(/\s/g, '').replace(/\*/g, ''),
                          holderName: card.holderName,
                        });
                        setShowAddBankDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCardToDelete(card.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 支付宝账户列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                支付宝账户
              </CardTitle>
              <CardDescription className="mt-2">
                {userType === 'bigb' ? '企业账户不支持支付宝提现' : '个人账户可添加支付宝用于提现'}
              </CardDescription>
            </div>
            {userType === 'smallb' && (
              <Button onClick={() => setShowAddAlipayDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                添加支付宝
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userType === 'bigb' ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                企业账户仅支持银行卡提现，不支持支付宝提现
              </AlertDescription>
            </Alert>
          ) : alipayAccounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>暂无支付宝账户，请添加支付宝账户用于提现</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alipayAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{account.account}</span>
                      {account.isDefault && (
                        <Badge variant="secondary" className="text-xs">默认</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">实名：{account.realName}</p>
                  </div>
                  <div className="flex gap-2">
                    {!account.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(account.id, 'alipay')}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAlipay(account);
                        setFormData({
                          ...formData,
                          alipayAccount: account.account,
                          alipayRealName: account.realName,
                        });
                        setShowAddAlipayDialog(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAlipayAccounts(alipayAccounts.filter(a => a.id !== account.id));
                        toast.success('支付宝账户已删除');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 添加/编辑银行卡对话框 */}
      <Dialog open={showAddBankDialog} onOpenChange={setShowAddBankDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBankCard ? '编辑银行卡' : '添加银行卡'}</DialogTitle>
            <DialogDescription>
              请填写银行卡信息，用于提现
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>开户银行</Label>
              <Select
                value={formData.bankName}
                onValueChange={(value) => setFormData({ ...formData, bankName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择银行" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_OPTIONS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>开户支行（可选）</Label>
              <Input
                placeholder="例如：北京分行"
                value={formData.bankBranch}
                onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>银行卡号</Label>
              <Input
                placeholder="请输入银行卡号"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                maxLength={19}
              />
            </div>
            <div className="space-y-2">
              <Label>持卡人姓名</Label>
              <Input
                placeholder="请输入持卡人姓名"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddBankDialog(false);
              setEditingBankCard(null);
              setFormData({ ...formData, bankName: '', bankBranch: '', cardNumber: '', holderName: '' });
            }}>
              取消
            </Button>
            <Button onClick={handleAddBankCard}>
              {editingBankCard ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加/编辑支付宝对话框 */}
      <Dialog open={showAddAlipayDialog} onOpenChange={setShowAddAlipayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAlipay ? '编辑支付宝账户' : '添加支付宝账户'}</DialogTitle>
            <DialogDescription>
              请填写支付宝账户信息，用于提现
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>支付宝账号</Label>
              <Input
                placeholder="请输入支付宝账号（手机号或邮箱）"
                value={formData.alipayAccount}
                onChange={(e) => setFormData({ ...formData, alipayAccount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>支付宝实名姓名</Label>
              <Input
                placeholder="请输入支付宝实名认证姓名"
                value={formData.alipayRealName}
                onChange={(e) => setFormData({ ...formData, alipayRealName: e.target.value })}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                支付宝实名姓名必须与账户实名认证信息一致
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddAlipayDialog(false);
              setEditingAlipay(null);
              setFormData({ ...formData, alipayAccount: '', alipayRealName: '' });
            }}>
              取消
            </Button>
            <Button onClick={handleAddAlipay}>
              {editingAlipay ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!cardToDelete} onOpenChange={() => setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除银行卡？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后将无法使用此银行卡进行提现，此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cardToDelete && handleDelete(cardToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

