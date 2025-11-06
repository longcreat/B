/**
 * 统一的时间格式化工具函数
 * 将时间转换为 YYYY-MM-DD HH:mm:ss 格式
 */

/**
 * 格式化日期时间为统一格式：YYYY-MM-DD HH:mm:ss
 * @param date 日期对象或ISO字符串
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(date: Date | string): string {
  let d: Date;
  if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = date;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

