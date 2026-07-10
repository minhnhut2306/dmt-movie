import { useState, useEffect, useRef } from "react";
import { Bell, Download, Share2, X, Smartphone, Rocket } from "lucide-react";

const READ_KEY = "dmt-notif-read";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [readSet, setReadSet] = useState(new Set());
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    try {
      const saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
      setReadSet(new Set(saved));
    } catch { /* empty */ }

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setOpen(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const STATIC_NOTIFS = [
    {
      id: "v1-release",
      icon: Rocket,
      iconBg: "bg-iris-500/10",
      iconColor: "text-iris-400",
      badge: "V1",
      badgeBg: "bg-iris-600",
      title: "DMT Movie V1 chính thức ra mắt!",
      desc: "Trải nghiệm phiên bản V1 tại đây.",
      link: "https://dmt-movie.vercel.app/",
      linkLabel: "Xem ngay →",
      time: "Hôm nay",
    },
  ];

  const notifications = [
    ...STATIC_NOTIFS,
    ...(!isStandalone ? [{ id: "pwa-install" }] : []),
  ];
  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length;

  const handleOpen = () => {
    setOpen((p) => !p);
    if (!open) {
      const ids = notifications.map((n) => n.id);
      const next = new Set(ids);
      setReadSet(next);
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setOpen(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-1.5 hover:bg-gray-700 rounded-md transition-colors"
        aria-label="Thông báo"
      >
        <Bell size={19} className={open ? "text-orange-400" : "text-gray-300"} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed right-2 top-12 sm:top-14 lg:top-[72px] z-[999] animate-slide-up"
          style={{ width: "min(340px, calc(100vw - 16px))" }}
        >
          <div className="bg-[#12171f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Bell size={13} className="text-orange-400" />
                <span className="text-white text-sm font-semibold">Thông báo</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell size={28} className="text-gray-600 mb-2" />
                  <p className="text-gray-500 text-xs">Hiện tại chưa có thông báo nào.</p>
                </div>
              )}

            {STATIC_NOTIFS.map((n) => {
              const Icon = n.icon;
              const isUnread = !readSet.has(n.id);
              return (
                <div key={n.id} className={`p-3 border-b border-white/5 ${isUnread ? 'bg-white/[0.02]' : ''}`}>
                  <div className="flex gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${n.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={15} className={n.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-semibold text-xs leading-tight">{n.title}</p>
                        {n.badge && (
                          <span className={`${n.badgeBg || 'bg-iris-600'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0`}>{n.badge}</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-[11px] leading-relaxed">{n.desc}</p>
                      {n.link && (
                        <a href={n.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 text-iris-400 hover:text-iris-300 text-[11px] font-semibold transition-colors">
                          {n.linkLabel}
                        </a>
                      )}
                      <p className="text-gray-600 text-[10px] mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {!isStandalone && (
              <div className="p-3">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone size={15} className="text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-xs">Đã có ứng dụng cho điện thoại!</p>
                      <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">MỚI</span>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-relaxed mb-2">
                      Cài DMT Movie lên điện thoại để xem phim nhanh hơn, không cần mở trình duyệt.
                    </p>
                    <button
                      onClick={isIOS ? () => setShowIOSGuide(true) : handleInstall}
                      className="w-full flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-[11px] font-semibold px-3 py-2 rounded-lg transition-all"
                    >
                      <Download size={12} />
                      Ấn vào đây để cài đặt
                    </button>
                    {isIOS && showIOSGuide && (
                      <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-start gap-2">
                        <Share2 size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          Nhấn <span className="text-blue-400 font-medium">Chia sẻ</span>{" "}
                          ở thanh dưới → chọn{" "}
                          <span className="text-orange-400 font-medium">"Thêm vào màn hình chính"</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
