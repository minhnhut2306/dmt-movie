import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
