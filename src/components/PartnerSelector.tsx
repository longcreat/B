// Partner选择器组件 - 用于白名单/黑名单选择

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Users, Building2, User, X } from 'lucide-react';
import { Partner, getMockPartners } from '../data/mockPartners';
import { Card, CardContent } from './ui/card';

interface PartnerSelectorProps {
  selectedPartnerIds: string[];
  onSelectionChange: (partnerIds: string[]) => void;
  placeholder?: string;
  maxHeight?: string;
  filterByBusinessModel?: ('saas' | 'mcp' | 'affiliate')[];
  filterByUserType?: ('bigb' | 'smallb')[];
}

export function PartnerSelector({
  selectedPartnerIds,
  onSelectionChange,
  placeholder = '搜索用户名称、邮箱或ID...',
  maxHeight = '400px',
  filterByBusinessModel,
  filterByUserType,
}: PartnerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const allPartners = getMockPartners();

  // 筛选Partner列表
  const filteredPartners = allPartners.filter(partner => {
    // 业务模式筛选
    if (filterByBusinessModel && filterByBusinessModel.length > 0) {
      if (!filterByBusinessModel.includes(partner.businessModel)) {
        return false;
      }
    }

    // 用户类型筛选（大B/小B）
    if (filterByUserType && filterByUserType.length > 0) {
      const isBigBPartner = !partner.parentPartnerId || partner.parentPartnerId === null;
      const userType = isBigBPartner ? 'bigb' : 'smallb';
      if (!filterByUserType.includes(userType)) {
        return false;
      }
    }

    // 搜索筛选 - 必须有搜索关键词才显示
    if (!searchTerm || searchTerm.trim() === '') {
      return false;
    }

    const term = searchTerm.toLowerCase();
    return (
      partner.displayName.toLowerCase().includes(term) ||
      partner.email.toLowerCase().includes(term) ||
      partner.id.toLowerCase().includes(term) ||
      partner.phone.includes(term)
    );
  });

  // 添加用户到选择列表
  const addPartner = (partnerId: string) => {
    if (!selectedPartnerIds.includes(partnerId)) {
      onSelectionChange([...selectedPartnerIds, partnerId]);
      // 添加后清空搜索框
      setSearchTerm('');
    }
  };

  // 从选择列表移除用户
  const removePartner = (partnerId: string) => {
    onSelectionChange(selectedPartnerIds.filter(id => id !== partnerId));
  };

  // 判断是否为BigB（根据系统架构：parentPartnerId为null的是大B）
  const isBigB = (partner: Partner): boolean => {
    return !partner.parentPartnerId || partner.parentPartnerId === null;
  };

  // 获取业务模式显示名称
  const getBusinessModelName = (model: string): string => {
    const names: Record<string, string> = {
      'saas': 'SaaS',
      'mcp': 'MCP',
      'affiliate': '分销',
    };
    return names[model] || model;
  };

  // 获取已选择的Partner信息
  const selectedPartners = allPartners.filter(p => selectedPartnerIds.includes(p.id));

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 已选择的用户列表 */}
      {selectedPartners.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            已选择 <span className="font-semibold text-blue-600">{selectedPartners.length}</span> 个用户
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPartners.map(partner => {
              const isBigBPartner = isBigB(partner);
              return (
                <Badge
                  key={partner.id}
                  variant="outline"
                  className="px-3 py-1.5 bg-blue-50 border-blue-200 text-blue-700"
                >
                  <div className="flex items-center gap-2">
                    {isBigBPartner ? (
                      <Building2 className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span>{partner.displayName}</span>
                    <span className="text-xs text-gray-500">({partner.id})</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePartner(partner.id);
                      }}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* 搜索结果列表 - 只有输入搜索关键词时才显示 */}
      {searchTerm && searchTerm.trim() !== '' && (
        <Card>
          <CardContent className="p-0">
            <div 
              className="overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredPartners.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>未找到匹配的用户</p>
                  <p className="text-xs text-gray-400 mt-1">请尝试其他关键词</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPartners.map(partner => {
                    const isSelected = selectedPartnerIds.includes(partner.id);
                    const isBigBPartner = isBigB(partner);

                    return (
                      <div
                        key={partner.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                        }`}
                        onClick={() => {
                          if (!isSelected) {
                            addPartner(partner.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {isSelected ? (
                            <div className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-green-500 text-white">
                              <X className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border-2 border-gray-300">
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isBigBPartner ? (
                                <Building2 className="w-4 h-4 text-blue-600" />
                              ) : (
                                <User className="w-4 h-4 text-green-600" />
                              )}
                              <span className="font-medium text-gray-900">
                                {partner.displayName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {isBigBPartner ? '大B' : '小B'}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {getBusinessModelName(partner.businessModel)}
                              </Badge>
                              {isSelected && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  已选择
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-0.5">
                              <div>ID: <span className="font-mono">{partner.id}</span></div>
                              <div>邮箱: {partner.email}</div>
                              {partner.phone && <div>电话: {partner.phone}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 提示信息 - 未输入搜索关键词时显示 */}
      {!searchTerm || searchTerm.trim() === '' ? (
        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">在搜索框中输入关键词搜索用户</p>
          <p className="text-xs text-gray-400 mt-1">支持搜索用户名称、邮箱、ID或电话</p>
        </div>
      ) : null}
    </div>
  );
}

