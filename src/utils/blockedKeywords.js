// utils/blockedKeywords.js

/**
 * Danh sách các từ khóa bị chặn
 * Có thể dễ dàng mở rộng thêm các từ khóa khác
 */
export const BLOCKED_KEYWORDS = [
  "hãy để tôi tỏa sáng",
  "hay de toi toa sang",
  "let me shine",
  // Thêm các từ khóa khác cần chặn ở đây
];

/**
 * Chuẩn hóa chuỗi: loại bỏ dấu, chuyển thường, loại bỏ khoảng trắng thừa
 */
const normalizeString = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD') // Tách dấu ra khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd') // Thay thế đ
    .replace(/\s+/g, ' ') // Loại bỏ khoảng trắng thừa
    .trim();
};

/**
 * Kiểm tra xem từ khóa có bị chặn hay không
 * Không phân biệt hoa thường, có dấu/không dấu
 */
export const isBlockedKeyword = (keyword) => {
  if (!keyword || typeof keyword !== 'string') return false;
  
  const normalizedKeyword = normalizeString(keyword);
  
  return BLOCKED_KEYWORDS.some(blockedWord => {
    const normalizedBlocked = normalizeString(blockedWord);
    return normalizedKeyword.includes(normalizedBlocked);
  });
};

/**
 * Lấy từ khóa bị chặn đầu tiên được tìm thấy trong chuỗi
 */
export const getBlockedKeywordMatch = (keyword) => {
  if (!keyword || typeof keyword !== 'string') return null;
  
  const normalizedKeyword = normalizeString(keyword);
  
  for (const blockedWord of BLOCKED_KEYWORDS) {
    const normalizedBlocked = normalizeString(blockedWord);
    if (normalizedKeyword.includes(normalizedBlocked)) {
      return blockedWord;
    }
  }
  
  return null;
};

/**
 * Thêm từ khóa mới vào danh sách chặn (runtime)
 */
export const addBlockedKeyword = (keyword) => {
  if (keyword && typeof keyword === 'string') {
    const normalized = normalizeString(keyword);
    if (!BLOCKED_KEYWORDS.some(kw => normalizeString(kw) === normalized)) {
      BLOCKED_KEYWORDS.push(keyword.toLowerCase().trim());
    }
  }
};

/**
 * Xóa từ khóa khỏi danh sách chặn (runtime)
 */
export const removeBlockedKeyword = (keyword) => {
  if (!keyword || typeof keyword !== 'string') return false;
  
  const normalized = normalizeString(keyword);
  const index = BLOCKED_KEYWORDS.findIndex(
    kw => normalizeString(kw) === normalized
  );
  
  if (index > -1) {
    BLOCKED_KEYWORDS.splice(index, 1);
    return true;
  }
  
  return false;
};

export default {
  BLOCKED_KEYWORDS,
  isBlockedKeyword,
  getBlockedKeywordMatch,
  addBlockedKeyword,
  removeBlockedKeyword,
};