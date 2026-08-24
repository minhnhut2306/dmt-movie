import React, { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Smartphone, Trash2 } from 'lucide-react';
import { V1_URL } from '../config/serviceStatus';

// Full-screen thay cho nội dung Home khi server chính tạm dừng hoạt động.
// Hiện riêng ghi chú cho ai đang mở qua bản cài trên điện thoại (PWA/APK)
// vì bản đó không tự redirect được — phải tự gỡ và qua dùng bản V1 bằng trình duyệt.
const ServiceDownScreen = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-ember-500/10 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-ember-400" />
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          DMT Movie tạm dừng hoạt động
        </h1>
        <p className="text-white/55 text-sm leading-relaxed mb-6">
          Web/App phiên bản này đang gặp sự cố và tạm thời chưa xem phim được.
          Mời bạn trải nghiệm tạm bản DMT Movie V1 trong lúc chờ khắc phục.
        </p>

        <a
          href={V1_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-iris-500 to-ember-500 text-white font-semibold text-sm px-5 py-3.5 rounded-xl shadow-glow hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Mở DMT Movie V1
        </a>

        {isStandalone && (
          <div className="mt-5 text-left bg-white/[0.04] border border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <Trash2 className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-xs font-semibold mb-1">
                  Bạn đang mở qua app đã cài trên điện thoại?
                </p>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  App này sẽ không cập nhật được nội dung mới. Hãy gỡ app khỏi
                  màn hình chính (nhấn giữ icon → Gỡ/Xóa), sau đó bấm nút phía
                  trên bằng trình duyệt để dùng bản V1.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-white/30 text-[11px] mt-6 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          Cảm ơn bạn đã thông cảm.
        </p>
      </div>
    </div>
  );
};

export default ServiceDownScreen;