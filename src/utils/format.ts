// 格式化工具函数

/**
 * 格式化货币金额
 * @param amount 金额
 * @returns 格式化后的金额字符串，例如：¥1,234.56
 */
export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * 格式化百分比
 * @param rate 比例（0-100）
 * @param decimals 小数位数，默认1位
 * @returns 格式化后的百分比字符串，例如：10.5%
 */
export function formatPercentage(rate: number, decimals: number = 1): string {
  return `${rate.toFixed(decimals)}%`;
}

