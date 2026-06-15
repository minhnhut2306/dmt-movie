import React from 'react';

const Home = () => {
  return (
    <div className="fixed inset-0 z-[9999] h-full w-full overflow-hidden bg-slate-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-red-500/30 bg-slate-900/95 p-8 shadow-2xl shadow-red-950/20 backdrop-blur-sm">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-red-400 font-semibold">Thông báo</p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white">Website đã đóng vĩnh viễn.</h1>
          <p className="mt-4 text-sm sm:text-base leading-7 text-slate-300">
            Trang này hiện đã đóng vĩnh viễn và không còn phục vụ nội dung xem phim.
            Mọi truy cập vào site này chỉ hiển thị thông báo này.
          </p>
        </div>

        <div className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200 mb-6">
          <p className="font-semibold">Lưu ý:</p>
          <p className="mt-2">Website không còn hoạt động. Không có nội dung nào được cung cấp nữa.</p>
        </div>

        <a
          href="https://dmt-movie.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
        >
          Chuyển sang bản V1
        </a>
      </div>
    </div>
  );
};

export default Home;