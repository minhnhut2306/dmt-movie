import { useState, useEffect, useRef } from "react";
import { Bell, Download, Share2, X, Smartphone, Sparkles, ExternalLink } from "lucide-react";
import { LATEST_VERSION, VERSION_STORAGE_KEY } from "../config/appVersion";

const READ_KEY = "dmt-notif-read";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [readSet, setReadSet] = useState(new Set());
  const ref = useRef(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Đọc danh sách đã đọc từ localStorage
    try {
      const saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
      setReadSet(new Set(saved));
    } catch { /* empty */ }

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setOpen(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Danh sách thông báo động
  const notifications = [
    {
      id: "v2-release",
      icon: <Sparkles size={16} className="text-yellow-400" />,
      title: `DMT Movie ${LATEST_VERSION.label} đã ra mắt!`,
      body: LATEST_VERSION.message,
      action: null,
    },
    ...(!isStandalone ? [{
      id: "pwa-install",
      icon: <Smartphone size={16} className="text-sky-400" />,
      title: "Đã có phiên bản dành cho điện thoại!",
      body: isIOS
        ? null  // render riêng bên dưới
        : "Đã có phiên bản DMT Movie V1 dành cho điện thoại, chọn vào đây để tải về!",
      action: "install",
    }] : []),
  ];

  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length;

  const markAllRead = () => {
    const ids = notifications.map((n) => n.id);
    const next = new Set(ids);
    setReadSet(next);
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
  };

  const handleOpen = () => {
    setOpen((p) => !p);
    if (!open) markAllRead();
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
      {/* Bell icon */}
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

      {/* Dropdown — fixed góc phải màn hình */}
      {open && (
        <div className="fixed right-3 top-14 sm:top-16 lg:top-20 w-[calc(100vw-24px)] max-w-sm z-50 animate-slide-up">
          <div className="bg-[#12171f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-orange-400" />
                <span className="text-white text-sm font-semibold">Thông báo</span>
                {unreadCount === 0 && (
                  <span className="text-gray-500 text-xs">· Đã đọc tất cả</span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* Notification items */}
            <div className="divide-y divide-white/5">
              {notifications.map((notif, idx) => (
                <div key={notif.id} className="p-4">
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-white font-semibold text-sm leading-snug">
                          {notif.title}
                        </p>
                        {idx === 0 && (
                          <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                            MỚI
                          </span>
                        )}
                      </div>

                      {/* Body text */}
                      {notif.id === "pwa-install" && isIOS ? (
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Nhấn <Share2 size={10} className="inline mb-0.5 text-blue-400" />{" "}
                          <span className="text-blue-400 font-medium">Chia sẻ</span> → chọn{" "}
                          <span className="text-orange-400 font-medium">"Thêm vào màn hình chính"</span>
                        </p>
                      ) : (
                        <p className="text-gray-400 text-xs leading-relaxed">{notif.body}</p>
                      )}

                      {/* Action button */}
                      {notif.id === "v2-release" && (
                        <a
                          href={LATEST_VERSION.v2Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-orange-500/20"
                        >
                          <Sparkles size={12} />
                          Chuyển sang {LATEST_VERSION.label}
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {notif.id === "pwa-install" && !isIOS && deferredPrompt && (
                        <button
                          onClick={handleInstall}
                          className="inline-flex items-center gap-1.5 mt-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Download size={13} />
                          Tải về
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
