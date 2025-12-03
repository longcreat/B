import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from './ui/card';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table';
import { Plus, Users } from 'lucide-react';

interface CrowdTag {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
}

const initialTags: CrowdTag[] = [
  {
    id: '1',
    code: 'new_users_30d',
    name: '注册 ≤ 30 天新客',
    description: '最近 30 天内注册且无历史订单的用户',
    createdAt: '2025-01-01 10:00',
  },
  {
    id: '2',
    code: 'high_value_vip',
    name: '高价值会员人群',
    description: '近 90 天 GMV ≥ 5000 且会员等级为金卡及以上',
    createdAt: '2025-01-05 15:30',
  },
];

export function CrowdTagManagement() {
  const [tags, setTags] = useState<CrowdTag[]>(initialTags);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!code.trim() || !name.trim()) return;
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newTag: CrowdTag = {
      id: String(tags.length + 1),
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: now,
    };
    setTags((prev) => [newTag, ...prev]);
    setOpen(false);
    setCode('');
    setName('');
    setDescription('');
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>营销</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>人群标签</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <CardTitle>人群标签管理</CardTitle>
          </div>
          <Button size="sm" className="gap-1" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            新增人群标签
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[160px]">标签编码</TableHead>
                  <TableHead className="w-[200px]">标签名称</TableHead>
                  <TableHead>说明</TableHead>
                  <TableHead className="w-[180px] text-right">创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-mono text-xs text-gray-700">
                      {tag.code}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">{tag.name}</TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {tag.description || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 text-right">
                      {tag.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
                {tags.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-sm text-gray-500"
                    >
                      暂无人群标签，请点击右上角“新增人群标签”进行创建
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>新增人群标签</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>标签编码</Label>
              <Input
                placeholder="例如：new_users_30d"
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCode(e.target.value)
                }
              />
              <p className="text-xs text-gray-500">
                建议使用英文小写+下划线，作为唯一标识
              </p>
            </div>
            <div className="space-y-2">
              <Label>标签名称</Label>
              <Input
                placeholder="例如：注册 ≤ 30 天新客"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>说明（可选）</Label>
              <Textarea
                placeholder="简单描述该人群的圈选逻辑，便于运营理解"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreate}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
