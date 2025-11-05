import React, { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface AgreementCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function AgreementCheckbox({ checked, onCheckedChange }: AgreementCheckboxProps) {
  const [showServiceAgreement, setShowServiceAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, type: 'service' | 'privacy') => {
    e.preventDefault();
    if (type === 'service') {
      setShowServiceAgreement(true);
    } else {
      setShowPrivacyPolicy(true);
    }
  };

  return (
    <>
      <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg border">
        <Checkbox
          id="agreement"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
        />
        <Label htmlFor="agreement" className="cursor-pointer leading-relaxed">
          我已阅读并同意{' '}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'service')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            《平台服务协议》
          </a>{' '}
          和{' '}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, 'privacy')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            《隐私政策》
          </a>
        </Label>
      </div>

      {/* Service Agreement Dialog */}
      <Dialog open={showServiceAgreement} onOpenChange={setShowServiceAgreement}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>平台服务协议</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2">一、协议的接受与修改</h3>
                <p className="text-gray-700 leading-relaxed">
                  1.1 本协议是您与本平台之间就使用本平台服务所订立的协议。使用本平台服务即表示您同意接受本协议的全部条款。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  1.2 本平台有权随时修改本协议的任何条款，一旦本协议的内容发生变动，本平台将在相关页面上提示修改内容。如果不同意本平台对协议所做的修改，您有权停止使用本平台服务。
                </p>
              </section>

              <section>
                <h3 className="mb-2">二、服务内容</h3>
                <p className="text-gray-700 leading-relaxed">
                  2.1 本平台为用户提供酒店预订相关的技术服务、API接口、SaaS解决方案及联盟推广服务。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.2 用户理解并同意，本平台仅提供技术支持服务，实际的酒店预订服务由第三方酒店供应商提供。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.3 本平台有权根据实际情况随时调整、中止或终止部分或全部服务，并保留最终解释权。
                </p>
              </section>

              <section>
                <h3 className="mb-2">三、用户账号</h3>
                <p className="text-gray-700 leading-relaxed">
                  3.1 用户在使用本平台服务时，必须提供真实、准确、完整的个人或企业资料。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.2 用户应妥善保管账号及密码，因用户保管不善可能导致遭受盗号或密码失窃，责任由用户自行承担。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.3 用户不得将账号转让、出借或出售给他人使用。
                </p>
              </section>

              <section>
                <h3 className="mb-2">四、佣金结算</h3>
                <p className="text-gray-700 leading-relaxed">
                  4.1 用户通过本平台推广产生的有效订单，将按照约定的佣金比例进行结算。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  4.2 佣金结算周期为每月一次，具体结算时间以平台通知为准。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  4.3 用户需提供有效的收款账户信息，因信息错误导致的结算失败，平台不承担责任。
                </p>
              </section>

              <section>
                <h3 className="mb-2">五、用户行为规范</h3>
                <p className="text-gray-700 leading-relaxed">
                  5.1 用户不得利用本平台服务从事违法违规活动。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  5.2 用户不得进行虚假推广、刷单等作弊行为。一经发现，平台有权冻结账户并追究法律责任。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  5.3 用户应遵守平台的运营规则，维护平台的正常秩序。
                </p>
              </section>

              <section>
                <h3 className="mb-2">六、知识产权</h3>
                <p className="text-gray-700 leading-relaxed">
                  6.1 本平台所包含的所有内容，包括但不限于文字、图片、软件、程序、数据等，均受著作权法、商标法等相关法律法规保护。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  6.2 未经本平台书面许可，任何人不得擅自使用、修改、复制、传播本平台的内容。
                </p>
              </section>

              <section>
                <h3 className="mb-2">七、免责声明</h3>
                <p className="text-gray-700 leading-relaxed">
                  7.1 用户理解并同意，本平台不对因网络连接故障、通讯线路、第三方网站、电脑硬件等任何原因造成的服务中断或其他缺陷负责。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  7.2 本平台对用户使用本平台服务所产生的任何直接、间接、偶然、特殊及后续的损害不承担责任。
                </p>
              </section>

              <section>
                <h3 className="mb-2">八、法律适用与争议解决</h3>
                <p className="text-gray-700 leading-relaxed">
                  8.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  8.2 如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向本平台所在地人民法院提起诉讼。
                </p>
              </section>

              <section>
                <h3 className="mb-2">九、其他</h3>
                <p className="text-gray-700 leading-relaxed">
                  9.1 本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  9.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。
                </p>
                <p className="text-gray-500 italic">
                  最后更新时间：2025年10月31日
                </p>
                <p className="text-gray-500 italic">
                  版本号：v1.0
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>隐私政策</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2">一、隐私政策概述</h3>
                <p className="text-gray-700 leading-relaxed">
                  1.1 本隐私政策旨在向您说明我们如何收集、使用、存储、共享和保护您的个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  1.2 我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
                </p>
              </section>

              <section>
                <h3 className="mb-2">二、我们收集的信息</h3>
                <p className="text-gray-700 leading-relaxed">
                  2.1 <strong>账户信息：</strong>包括您的姓名、身份证号、联系电话、电子邮箱等。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.2 <strong>企业信息：</strong>如您以企业身份注册，我们会收集企业名称、统一社会信用代码、营业执照等信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.3 <strong>财务信息：</strong>包括银行账户信息、支付宝账号等，用于佣金结算。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.4 <strong>业务信息：</strong>推广渠道、社交平台账号、粉丝数据等商业信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  2.5 <strong>使用数据：</strong>访问日志、操作记录、设备信息等技术数据。
                </p>
              </section>

              <section>
                <h3 className="mb-2">三、信息的使用</h3>
                <p className="text-gray-700 leading-relaxed">
                  3.1 <strong>身份认证：</strong>验证您的身份，完成账户注册和认证流程。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.2 <strong>服务提供：</strong>为您提供平台服务，包括API接口、预订系统等。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.3 <strong>佣金结算：</strong>处理佣金支付和财务对账。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.4 <strong>业务分析：</strong>分析用户行为和市场趋势，优化服务质量。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  3.5 <strong>客户服务：</strong>响应您的咨询、投诉和建议。
                </p>
              </section>

              <section>
                <h3 className="mb-2">四、信息的存储</h3>
                <p className="text-gray-700 leading-relaxed">
                  4.1 您的个人信息将存储在中华人民共和国境内的服务器上。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  4.2 我们会采用符合业界标准的安全防护措施保护您的信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  4.3 信息保存期限：在您使用服务期间及终止后的合理期限内，或法律法规规定的期限内。
                </p>
              </section>

              <section>
                <h3 className="mb-2">五、信息的共享与披露</h3>
                <p className="text-gray-700 leading-relaxed">
                  5.1 <strong>授权共享：</strong>经您明确同意后，我们会与第三方共享您的信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  5.2 <strong>业务合作：</strong>为完成订单履行，我们可能与酒店供应商、支付机构等共享必要信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  5.3 <strong>法律要求：</strong>根据法律法规、诉讼、政府要求等，我们可能需要披露您的信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  5.4 我们承诺不会向任何第三方出售您的个人信息。
                </p>
              </section>

              <section>
                <h3 className="mb-2">六、您的权利</h3>
                <p className="text-gray-700 leading-relaxed">
                  6.1 <strong>访问权：</strong>您有权访问您的个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  6.2 <strong>更正权：</strong>您有权要求更正不准确的个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  6.3 <strong>删除权：</strong>在特定情况下，您有权要求删除您的个人信息。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  6.4 <strong>撤回同意：</strong>您可以随时撤回对个人信息处理的同意。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  6.5 <strong>注销账户：</strong>您可以申请注销账户，我们将停止提供服务并删除您的个人信息（法律法规另有规定的除外）。
                </p>
              </section>

              <section>
                <h3 className="mb-2">七、未成年人保护</h3>
                <p className="text-gray-700 leading-relaxed">
                  7.1 我们的服务面向成年人，不向未满18周岁的未成年人提供服务。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  7.2 如果我们发现在未事先获得可证实的父母或法定监护人同意的情况下收集了未成年人的个人信息，我们会设法尽快删除相关数据。
                </p>
              </section>

              <section>
                <h3 className="mb-2">八、信息安全</h3>
                <p className="text-gray-700 leading-relaxed">
                  8.1 我们采用行业标准的安全技术和程序来防止信息的丢失、不当使用、未经授权的访问或披露。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  8.2 我们会定期审查信息收集、存储和处理实践，以防止未经授权的访问。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  8.3 尽管我们会尽力保护您的信息安全，但互联网环境并非绝对安全，我们无法保证信息百分之百安全。
                </p>
              </section>

              <section>
                <h3 className="mb-2">九、隐私政策的更新</h3>
                <p className="text-gray-700 leading-relaxed">
                  9.1 我们可能会不时更新本隐私政策。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  9.2 当隐私政策发生重大变更时，我们会通过网站公告、邮件或其他方式通知您。
                </p>
                <p className="text-gray-700 leading-relaxed">
                  9.3 您继续使用我们的服务将被视为接受更新后的隐私政策。
                </p>
              </section>

              <section>
                <h3 className="mb-2">十、联系我们</h3>
                <p className="text-gray-700 leading-relaxed">
                  10.1 如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
                </p>
                <p className="text-gray-700 leading-relaxed ml-4">
                  邮箱：privacy@example.com<br />
                  电话：400-xxx-xxxx<br />
                  地址：北京市朝阳区xxx路xxx号
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  10.2 我们会在15个工作日内回复您的请求。
                </p>
                <p className="text-gray-500 italic">
                  最后更新时间：2025年10月31日
                </p>
                <p className="text-gray-500 italic">
                  版本号：v1.0
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
