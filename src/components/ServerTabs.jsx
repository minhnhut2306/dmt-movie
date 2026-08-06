import React from 'react';

// Thanh chọn server — tách riêng để đặt phía trên video player
// thay vì nằm chung với danh sách tập ở dưới.
const ServerTabs = ({ episodes, currentServer, onServerChange }) => {
  if (!episodes || episodes.length <= 1) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {episodes.map((server, serverIndex) => (
        <button
          key={serverIndex}
          onClick={() => onServerChange(serverIndex)}
          className={`min-h-[38px] px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
            currentServer === serverIndex
              ? 'bg-gradient-to-r from-iris-500 to-ember-500 text-white shadow-glow'
              : 'bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {server.server_name}
        </button>
      ))}
    </div>
  );
};

export default ServerTabs;