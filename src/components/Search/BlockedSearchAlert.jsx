import React from 'react';
import { Ban, AlertTriangle, ShieldCheck } from 'lucide-react';

// Danh sách từ khóa bị chặn
const BLOCKED_KEYWORDS = [
  // Cụm cũ
  "hãy để tôi tỏa sáng",
  "hay de toi toa sang",
  "let me shine",

  // 🎬 Phim / series bị cấm do có đường lưỡi bò
  "everest: người tuyết bé nhỏ",
  "everest nguoi tuyet be nho",
  "abominable",
  "uncharted",
  "barbie",
  "pine gap",
  "put your head on my shoulder",
  "hãy để tôi tỏa sáng (love's ambition)",
  "hay de toi toa sang (love's ambition)",
  "love's ambition",
];
// Hàm chuẩn hóa chuỗi: loại bỏ dấu tiếng Việt
const normalizeVietnamese = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
};

// Utility function để kiểm tra từ khóa bị chặn
// eslint-disable-next-line react-refresh/only-export-components
export const isBlockedKeyword = (keyword) => {
  if (!keyword) return false;

  const normalizedKeyword = normalizeVietnamese(keyword);

  return BLOCKED_KEYWORDS.some(blockedPhrase => {
    const normalizedBlocked = normalizeVietnamese(blockedPhrase);
    return normalizedKeyword.includes(normalizedBlocked);
  });
};

const BlockedSearchAlert = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md w-full bg-red-900/50 backdrop-blur-sm rounded-2xl p-8 border">
        <div className="flex flex-col items-center text-center">

          {/* 🇻🇳 Cờ Việt Nam */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
            alt="Cờ Việt Nam"
            className="w-12 h-8 mb-4 rounded-sm border border-yellow-300 shadow-sm"
          />

          {/* Icon & text */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold text-yellow-300 tracking-wide">
              Hoàng Sa và Trường Sa
            </h2>
          </div>

          <p className="text-base text-white font-medium">
            là của <span className="text-yellow-300 font-semibold">Việt Nam</span>
          </p>

          <div className="mt-4 w-20 h-[2px] bg-yellow-400 rounded-full" />

          <p className="mt-2 text-xs text-yellow-200 italic">
            Chủ quyền thiêng liêng – Không thể tách rời.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default BlockedSearchAlert;