import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-iris-400 border-r-iris-400 animate-spin" />
        <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-iris-500/20 to-transparent animate-pulse-glow" />
      </div>
    </div>
  );
};

export default Loading;
