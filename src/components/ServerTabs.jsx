import React, { useMemo } from 'react';

// Thanh chọn server — đặt phía trên video player (dùng chung desktop + mobile).
// Mỗi nhóm ngôn ngữ (Vietsub, Lồng Tiếng...) là 1 khối co theo nội dung
// (không kéo giãn hết chiều ngang container), nút cố định 1 kích thước
// (không phụ thuộc độ dài chữ, không phình to trên màn hình rộng).
const ServerTabs = ({ episodes, currentServer, onServerChange }) => {
  const groups = useMemo(() => {
    if (!episodes || episodes.length === 0) return [];

    const map = new Map();
    episodes.forEach((server, index) => {
      const key = server.baseName || server.server_name;
      if (!map.has(key)) map.set(key, { label: key, items: [] });
      map.get(key).items.push({
        index,
        // Server gốc không có bản Server 2 (không có link_embed) thì khỏi
        // cần hiện chữ "Server 1" thừa — dùng luôn tên ngôn ngữ.
        buttonLabel: server.variantLabel || server.server_name,
      });
    });
    return Array.from(map.values());
  }, [episodes]);

  if (groups.length === 0) return null;
  if (groups.length === 1 && groups[0].items.length <= 1) return null;

  return (
    <div className="mb-3 flex flex-nowrap gap-x-6 gap-y-3 overflow-x-auto pb-1 scrollbar-hide">
      {groups.map((group) => (
        <div key={group.label} className="flex-shrink-0">
          {(groups.length > 1 || group.items.length > 1) && (
            <p className="text-sm font-semibold text-white/70 mb-1.5 px-0.5 tracking-wide">{group.label}</p>
          )}
          <div className="flex gap-2">
            {group.items.map(({ index, buttonLabel }) => (
              <button
                key={index}
                onClick={() => onServerChange(index)}
                className={`w-[72px] min-h-[28px] px-2 py-1 rounded-md font-medium text-[11px] transition-all duration-200 cursor-pointer truncate ${
                  currentServer === index
                    ? 'bg-gradient-to-r from-iris-500 to-ember-500 text-white shadow-glow'
                    : 'bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {buttonLabel}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServerTabs;