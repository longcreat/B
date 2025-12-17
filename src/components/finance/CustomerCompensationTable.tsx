import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DollarSign } from 'lucide-react';

export interface CustomerCompensation {
  id: string;
  compensationTime: string; // 赔付时间
  compensationTarget: string; // 赔付对象
  amount: number; // 赔付金额
  reason: string; // 赔付原因
  status: 'pending' | 'approved' | 'rejected' | 'completed'; // 状态
}

interface CustomerCompensationTableProps {
  compensations: CustomerCompensation[];
}

export function CustomerCompensationTable({ compensations }: CustomerCompensationTableProps) {
  const getStatusBadge = (status: CustomerCompensation['status']) => {
    const config = {
      pending: { label: '待审核', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      approved: { label: '已批准', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      rejected: { label: '已拒绝', className: 'bg-red-50 text-red-700 border-red-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status];
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-600" />
          客户赔付明细
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <table className="border-collapse w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">赔付时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">赔付对象</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">赔付金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">赔付原因</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {compensations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    暂无赔付记录
                  </td>
                </tr>
              ) : (
                compensations.map((compensation) => (
                  <tr key={compensation.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{compensation.compensationTime}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{compensation.compensationTarget}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                      ¥{compensation.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{compensation.reason}</td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(compensation.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {compensations.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            共 {compensations.length} 条赔付记录 | 赔付总金额：¥
            {compensations.reduce((sum, comp) => sum + comp.amount, 0).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
