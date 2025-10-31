import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { 
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Download,
  Package
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 批次中的订单简要信息
interface BatchOrder {
  orderId: string;
  hotelName: string;
  checkOutDate: string;
  
  // 价格体系
  p0_supplierCost: number;
  p1_platformPrice: number;
  p2_salePrice: number;
  
  // 利润
  platformProfit: number;
  partnerProfit: number;
  
  // 六重门控状态
  gates: {
    serviceCompleted: boolean;
    coolingOffPassed: boolean;
    noDispute: boolean;
    costReconciled: boolean;
    accountHealthy: boolean;
    thresholdMet: boolean;
  };
}

// 结算批次
interface SettlementBatch {
  batchId: string;
  partnerName: string;
  partnerEmail: string;
  orderCount: number;
  totalProfit: number;
  status: 'pending' | 'approved' | 'credited'; // 待审核、已批准、已计入账户
  createdAt: string;
  approvedAt?: string;
  creditedAt?: string;
  orders?: BatchOrder[]; // 批次包含的订单
}

export function SettlementCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<SettlementBatch | null>(null);
  const [showBatchDetail, setShowBatchDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<BatchOrder | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // 模拟结算批次数据
  const batches: SettlementBatch[] = [
    {
      batchId: 'BATCH-20251030-001',
      partnerName: '张三的旅游工作室',
      partnerEmail: 'zhangsan@example.com',
      orderCount: 3,
      totalProfit: 278.5,
      status: 'pending',
      createdAt: '2025-10-30 01:00:00',
      orders: [
        {
          orderId: 'ORD-2025001',
          hotelName: '北京希尔顿酒店',
          checkOutDate: '2025-10-20',
          p0_supplierCost: 800,
          p1_platformPrice: 880,
          p2_salePrice: 968,
          platformProfit: 80,
          partnerProfit: 88,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025003',
          hotelName: '深圳湾万豪酒店',
          checkOutDate: '2025-10-22',
          p0_supplierCost: 950,
          p1_platformPrice: 1045,
          p2_salePrice: 1149.5,
          platformProfit: 95,
          partnerProfit: 104.5,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025007',
          hotelName: '杭州西湖国宾馆',
          checkOutDate: '2025-10-24',
          p0_supplierCost: 720,
          p1_platformPrice: 792,
          p2_salePrice: 878,
          platformProfit: 72,
          partnerProfit: 86,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
    {
      batchId: 'BATCH-20251023-002',
      partnerName: '李四商旅服务',
      partnerEmail: 'lisi@example.com',
      orderCount: 2,
      totalProfit: 207.3,
      status: 'credited',
      createdAt: '2025-10-23 01:00:00',
      approvedAt: '2025-10-23 09:30:00',
      creditedAt: '2025-10-23 09:31:00',
      orders: [
        {
          orderId: 'ORD-2025008',
          hotelName: '上海浦东香格里拉',
          checkOutDate: '2025-10-18',
          p0_supplierCost: 1200,
          p1_platformPrice: 1320,
          p2_salePrice: 1452,
          platformProfit: 120,
          partnerProfit: 132,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025009',
          hotelName: '成都洲际酒店',
          checkOutDate: '2025-10-20',
          p0_supplierCost: 680,
          p1_platformPrice: 748,
          p2_salePrice: 822.8,
          platformProfit: 68,
          partnerProfit: 74.8,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
    {
      batchId: 'BATCH-20251025-003',
      partnerName: '旅游达人小李',
      partnerEmail: 'xiaoli@example.com',
      orderCount: 2,
      totalProfit: 157.5,
      status: 'approved',
      createdAt: '2025-10-25 01:00:00',
      approvedAt: '2025-10-25 10:15:00',
      orders: [
        {
          orderId: 'ORD-2025010',
          hotelName: '广州白天鹅宾馆',
          checkOutDate: '2025-10-21',
          p0_supplierCost: 750,
          p1_platformPrice: 825,
          p2_salePrice: 907.5,
          platformProfit: 75,
          partnerProfit: 82.5,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
        {
          orderId: 'ORD-2025011',
          hotelName: '南京金陵饭店',
          checkOutDate: '2025-10-23',
          p0_supplierCost: 650,
          p1_platformPrice: 715,
          p2_salePrice: 790,
          platformProfit: 65,
          partnerProfit: 75,
          gates: {
            serviceCompleted: true,
            coolingOffPassed: true,
            noDispute: true,
            costReconciled: true,
            accountHealthy: true,
            thresholdMet: true,
          },
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: '待结算', className: 'bg-yellow-50 text-yellow-700 border-yellow-300' },
      ready: { label: '可结算', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      processing: { label: '处理中', className: 'bg-purple-50 text-purple-700 border-purple-300' },
      completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-300' },
      approved: { label: '已批准', className: 'bg-blue-50 text-blue-700 border-blue-300' },
      credited: { label: '已计入', className: 'bg-green-50 text-green-700 border-green-300' },
    };
    const { label, className } = config[status as keyof typeof config] || config.pending;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getGateIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-yellow-600" />
    );
  };

  const handleViewBatchDetail = (batch: SettlementBatch) => {
    setSelectedBatch(batch);
    setShowBatchDetail(true);
  };

  const handleViewOrderDetail = (order: BatchOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleApproveBatch = (batchId: string) => {
    toast.success(`结算批次 ${batchId} 已批准并计入小B账户`);
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.partnerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* 面包屑导航 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>结算中心</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 主内容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>结算批次管理</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索批次号或小B商户"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterStatus} onValueChange={(value: string) => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="approved">已批准</SelectItem>
                  <SelectItem value="credited">已计入</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>批次号</TableHead>
                  <TableHead>小B商户</TableHead>
                  <TableHead>订单数量</TableHead>
                  <TableHead>总利润</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      暂无结算批次
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => (
                    <TableRow key={batch.batchId}>
                      <TableCell className="font-mono text-sm">{batch.batchId}</TableCell>
                      <TableCell>
                        <div>
                          <p>{batch.partnerName}</p>
                          <p className="text-sm text-gray-500">{batch.partnerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{batch.orderCount} 笔</TableCell>
                      <TableCell className="text-green-600">
                        ¥{batch.totalProfit.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{batch.createdAt}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBatchDetail(batch)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </Button>
                          {batch.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveBatch(batch.batchId)}
                            >
                              批准并计入
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 批次详情弹窗 */}
      <Dialog open={showBatchDetail} onOpenChange={setShowBatchDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>结算批次详情</DialogTitle>
            <DialogDescription>查看批次的完整信息和包含的订单列表</DialogDescription>
          </DialogHeader>
          
          {selectedBatch && (
            <div className="space-y-6">
              {/* 批次基本信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">批次信息</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">批次号</Label>
                    <p className="mt-1 font-mono">{selectedBatch.batchId}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">创建时间</Label>
                    <p className="mt-1">{selectedBatch.createdAt}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">批次状态</Label>
                    <div className="mt-1">{getStatusBadge(selectedBatch.status)}</div>
                  </div>
                </div>
              </div>

              {/* 小B商户信息 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">小B商户</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">商户名称</Label>
                    <p className="mt-1">{selectedBatch.partnerName}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <Label className="text-gray-600">商户邮箱</Label>
                    <p className="mt-1">{selectedBatch.partnerEmail}</p>
                  </div>
                </div>
              </div>

              {/* 结算汇总 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">结算汇总</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Label className="text-gray-600">订单数量</Label>
                    <p className="text-3xl mt-2 text-blue-700">{selectedBatch.orderCount} 笔</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Label className="text-gray-600">结算总额</Label>
                    <p className="text-3xl mt-2 text-green-700">¥{selectedBatch.totalProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* 批次订单列表 */}
              {selectedBatch.orders && selectedBatch.orders.length > 0 && (
                <div>
                  <h3 className="mb-3 pb-2 border-b flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    订单明细 ({selectedBatch.orders.length} 笔)
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>订单号</TableHead>
                          <TableHead>酒店</TableHead>
                          <TableHead>离店日期</TableHead>
                          <TableHead>销售价</TableHead>
                          <TableHead>小B利润</TableHead>
                          <TableHead>门控</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBatch.orders.map((order) => {
                          const passedGates = Object.values(order.gates).filter(Boolean).length;
                          return (
                            <TableRow key={order.orderId}>
                              <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                              <TableCell>{order.hotelName}</TableCell>
                              <TableCell className="text-sm">{order.checkOutDate}</TableCell>
                              <TableCell>¥{order.p2_salePrice.toFixed(2)}</TableCell>
                              <TableCell className="text-green-600">
                                ¥{order.partnerProfit.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm">{passedGates}/6</span>
                                  {passedGates === 6 ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewOrderDetail(order)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  查看
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* 审核时间线 */}
              {(selectedBatch.approvedAt || selectedBatch.creditedAt) && (
                <div>
                  <h3 className="mb-3 pb-2 border-b">处理时间线</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">批次创建</p>
                        <p className="text-sm text-gray-500">{selectedBatch.createdAt}</p>
                      </div>
                    </div>
                    {selectedBatch.approvedAt && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">批次批准</p>
                          <p className="text-sm text-gray-500">{selectedBatch.approvedAt}</p>
                        </div>
                      </div>
                    )}
                    {selectedBatch.creditedAt && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">计入账户</p>
                          <p className="text-sm text-gray-500">{selectedBatch.creditedAt}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 提示信息 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>说明：</strong>此批次包含 {selectedBatch.orderCount} 笔已通过六重门控的订单，总结算金额为 ¥{selectedBatch.totalProfit.toFixed(2)}。
                  {selectedBatch.status === 'pending' && ' 批准后将自动计入小B的收益账户。'}
                  {selectedBatch.status === 'credited' && ' 该批次已完成结算，金额已计入小B账户。'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedBatch?.status === 'pending' && (
              <Button onClick={() => {
                handleApproveBatch(selectedBatch.batchId);
                setShowBatchDetail(false);
              }}>
                批准并计入账户
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowBatchDetail(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 订单详情弹窗 */}
      <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              订单详情
            </DialogTitle>
            <DialogDescription>查看订单的完整结算信息和六重门控状态</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-gray-600">订单号</Label>
                  <p className="mt-1 font-mono">{selectedOrder.orderId}</p>
                </div>
                <div>
                  <Label className="text-gray-600">酒店</Label>
                  <p className="mt-1">{selectedOrder.hotelName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">离店日期</Label>
                  <p className="mt-1">{selectedOrder.checkOutDate}</p>
                </div>
                <div>
                  <Label className="text-gray-600">所属批次</Label>
                  <p className="mt-1 font-mono">{selectedBatch?.batchId}</p>
                </div>
              </div>

              {/* 价格体系 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">价格体系</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-gray-600">P0 - 供应商底价</span>
                    <span>¥{selectedOrder.p0_supplierCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-gray-600">P1 - 平台供货价</span>
                    <span className="text-blue-700">¥{selectedOrder.p1_platformPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-600">P2 - 小B销售价</span>
                    <span className="text-green-700">¥{selectedOrder.p2_salePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 利润分配 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">利润分配</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="text-gray-600">平台利润 (P1-P0)</span>
                    <span className="text-purple-700">¥{selectedOrder.platformProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-gray-600">小B利润 (P2-P1)</span>
                    <span className="text-green-700">¥{selectedOrder.partnerProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 六重门控状态 */}
              <div>
                <h3 className="mb-3 pb-2 border-b">六重门控状态</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.serviceCompleted)}
                      <span>Gate 1: 服务已完成</span>
                    </div>
                    <Badge variant={selectedOrder.gates.serviceCompleted ? 'default' : 'secondary'}>
                      {selectedOrder.gates.serviceCompleted ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.coolingOffPassed)}
                      <span>Gate 2: 冻结期已过 (7-15天)</span>
                    </div>
                    <Badge variant={selectedOrder.gates.coolingOffPassed ? 'default' : 'secondary'}>
                      {selectedOrder.gates.coolingOffPassed ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.noDispute)}
                      <span>Gate 3: 订单无未决争议</span>
                    </div>
                    <Badge variant={selectedOrder.gates.noDispute ? 'default' : 'secondary'}>
                      {selectedOrder.gates.noDispute ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.costReconciled)}
                      <span>Gate 4: 供应商成本已对账</span>
                    </div>
                    <Badge variant={selectedOrder.gates.costReconciled ? 'default' : 'secondary'}>
                      {selectedOrder.gates.costReconciled ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.accountHealthy)}
                      <span>Gate 5: 结算对象状态正常</span>
                    </div>
                    <Badge variant={selectedOrder.gates.accountHealthy ? 'default' : 'secondary'}>
                      {selectedOrder.gates.accountHealthy ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getGateIcon(selectedOrder.gates.thresholdMet)}
                      <span>Gate 6: 达到最低起付金额</span>
                    </div>
                    <Badge variant={selectedOrder.gates.thresholdMet ? 'default' : 'secondary'}>
                      {selectedOrder.gates.thresholdMet ? '已通过' : '未通过'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetail(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
