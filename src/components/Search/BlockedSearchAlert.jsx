import React from 'react';
import { Ban, AlertTriangle } from 'lucide-react';

// Danh sách từ khóa bị chặn
const BLOCKED_KEYWORDS = [
  "hãy để tôi tỏa sáng",
  "hay de toi toa sang",
  "let me shine"
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
      <div className="max-w-md w-full bg-gradient-to-br from-red-900/50 to-red-950/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative bg-red-600/30 p-4 rounded-full border-2 border-red-500">
              <Ban className="w-16 h-16 text-red-400" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              Nội dung bị hạn chế
            </h2>
            <p className="text-red-300 font-semibold text-lg">
              Phim này đã bị cấm chiếu
            </p>
          </div>
          
          <div className="bg-red-950/50 rounded-lg p-4 border border-red-500/20">
            <p className="text-gray-300 text-sm leading-relaxed">
              Phim có chứa <span className="text-red-400 font-semibold">đường lưỡi bò</span> vi phạm chủ quyền lãnh thổ Việt Nam, do đó đã bị chặn hiển thị trên hệ thống của chúng tôi.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="text-gray-400 text-xs">
              Vui lòng tìm kiếm nội dung khác
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedSearchAlert;