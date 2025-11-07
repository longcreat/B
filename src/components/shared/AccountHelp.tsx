// 通用账户说明组件
// 支持大B和小B客户，显示不同的账户说明和帮助信息

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  HelpCircle, 
  DollarSign, 
  Wallet, 
  CreditCard,
  TrendingUp,
  Users,
  ShoppingCart,
  Info,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import type { Partner } from '../../data/mockPartners';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '../ui/breadcrumb';

interface AccountHelpProps {
  currentPartner: Partner | null;
  userType: 'bigb' | 'smallb';
}

export function AccountHelp({ currentPartner, userType }: AccountHelpProps) {
  const isBigB = userType === 'bigb';
  const businessModel = currentPartner?.businessModel || 'affiliate';
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>账户说明</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 账户信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            账户信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">账户类型</span>
              <Badge variant="outline">
                {isBigB ? '大B客户' : '小B客户'}
              </Badge>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">认证方式</span>
              <Badge variant={currentPartner?.certificationType === 'enterprise' ? 'secondary' : 'outline'}>
                {currentPartner?.certificationType === 'enterprise' ? '企业认证' : '个人认证'}
              </Badge>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">业务模式</span>
              <span className="font-medium">
                {businessModel === 'saas' ? 'SaaS模式' : businessModel === 'mcp' ? 'MCP模式' : '推广联盟模式'}
              </span>
            </div>
            {isBigB && currentPartner?.canSetMarkupRate && (
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">加价权限</span>
                <Badge variant="secondary">可设置加价率</Badge>
              </div>
            )}
            {!isBigB && currentPartner?.parentPartnerId && (
              <div className="flex justify-between py-3">
                <span className="text-gray-600">挂载关系</span>
                <span className="font-medium">挂载在大B客户下</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 常见问题 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            常见问题
          </CardTitle>
          <CardDescription>
            点击展开查看详细说明
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {isBigB ? (
              <>
                <AccordionItem value="profit-calculation">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                      利润如何计算？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        {businessModel === 'saas' 
                          ? 'SaaS模式：利润 = 销售价(P2) - 平台供货价(P1)。您可以通过加价策略设置从P1到P2的加价率。'
                          : 'MCP模式：利润 = 销售价(P2) - 供应商供价(P0)。您可以直接设置从P0到P2的加价率。'}
                      </p>
                      <p>
                        挂载在您下的小B客户产生的订单，您将获得：总利润 - 小B佣金 = 您的利润。
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="markup-rate">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      如何设置加价率？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>在"加价策略"页面可以设置您的加价率：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>{businessModel === 'saas' ? 'SaaS模式：设置从P1到P2的加价率（建议5%-30%）' : 'MCP模式：设置从P0到P2的加价率（建议10%-50%）'}</li>
                        <li>加价率修改后，所有小B客户的链接价格会自动更新</li>
                        <li>已生成的订单价格不受影响（保持创建时的价格）</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="smallb-management">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      如何管理小B客户？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>在"小B客户管理"页面可以：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>审核小B客户的申请（通过/驳回）</li>
                        <li>查看所有挂载在您下的小B客户列表</li>
                        <li>修改小B客户的佣金比例</li>
                        <li>停用/启用小B客户</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="withdrawal">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      如何提现？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>在"提现中心"页面可以申请提现：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>最低提现金额：¥1,000</li>
                        <li>支持银行卡提现（企业账户）</li>
                        <li>工作日 9:00-17:00 提交的申请，当日处理</li>
                        <li>处理完成后1-3个工作日到账</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </>
            ) : (
              <>
                <AccordionItem value="commission-calculation">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      佣金如何计算？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>您的佣金由大B客户设置：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>佣金比例由您挂载的大B客户设置（通常在5%-15%之间）</li>
                        <li>佣金 = 订单利润 × 佣金比例</li>
                        <li>您无法修改佣金比例，如有疑问请联系您的大B客户</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="affiliate-link">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      如何使用推广链接？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>在"推广链接"页面可以：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>获取您的专属推广链接</li>
                        <li>通过链接生成的订单，您将获得佣金</li>
                        <li>可以创建多个推广活动，设置不同的参数</li>
                        <li>查看每个链接的点击和转化数据</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="withdrawal">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-600" />
                      如何提现？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>在"提现中心"页面可以申请提现：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>最低提现金额：¥100</li>
                        <li>支持银行卡和支付宝提现（个人账户）</li>
                        <li>每笔提现收取2元手续费</li>
                        <li>工作日 9:00-17:00 提交的申请，当日处理</li>
                        <li>处理完成后1-3个工作日到账</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="commission-settlement">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      佣金何时结算？
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>佣金结算规则：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>订单完成后，佣金进入"待结算"状态</li>
                        <li>订单完成后次月5日自动结算到可用余额</li>
                        <li>结算后的佣金可以申请提现</li>
                        <li>如有退款，相应佣金会被扣除</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* 功能说明 - 可折叠 */}
      <Collapsible open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-blue-900 font-medium">功能说明</span>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {isBigB ? '大B客户系统功能概览' : '小B客户系统功能概览'}
                    </p>
                  </div>
                </div>
                {isFeaturesOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isBigB ? (
              <>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">小B客户管理</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    审核小B申请、设置佣金比例、管理小B客户状态
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">加价策略</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    设置加价率，影响所有小B客户的链接价格
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium">订单管理</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    查看所有订单，包括您直接生成的订单和小B客户生成的订单
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">利润钱包</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    查看利润明细、申请提现、管理银行卡
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">推广链接</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    获取推广链接，通过链接生成的订单将获得佣金
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">佣金明细</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    查看每笔订单的佣金详情和佣金统计
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium">订单查看</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    查看通过您的推广链接生成的订单
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium">提现申请</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    申请提现到银行卡或支付宝账户
                  </p>
                </div>
              </>
            )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* 联系支持 - 可折叠 */}
      <Collapsible open={isContactOpen} onOpenChange={setIsContactOpen}>
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger asChild>
            <CardContent className="py-4 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">需要帮助？</span>
                </div>
                {isContactOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <p className="text-sm text-blue-800 mb-2">
                如果您在使用过程中遇到问题，可以通过以下方式联系我们：
              </p>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• 邮件支持：support@aigohotel.com</li>
                <li>• 在线客服：工作日 9:00-18:00</li>
                <li>• 帮助文档：查看完整的使用文档和API文档</li>
              </ul>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
