import React, { useState, useMemo, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { isEpisodeWatched } from '../utils/watchHistory';
import { useParams } from 'react-router-dom';

// Phim dài (vd 3000 tập) không thể chỉ cuộn tuần tự — chia theo block + cho nhảy thẳng tới số tập
const CHUNK_SIZE = 100;
const CHUNK_THRESHOLD = 40;

const EpisodeList = ({
  episodes,
  currentServer,
  currentEpisode,
  setCurrentServer,
  setCurrentEpisode,
  isMobile
}) => {
  const { slug } = useParams();
  const [activeChunk, setActiveChunk] = useState(0);
  const [jumpValue, setJumpValue] = useState('');

  const serverData = episodes?.[currentServer]?.server_data;

  const chunks = useMemo(() => {
    if (!serverData || serverData.length <= CHUNK_THRESHOLD) return null;
    const result = [];
    for (let i = 0; i < serverData.length; i += CHUNK_SIZE) {
      result.push({ start: i, end: Math.min(i + CHUNK_SIZE, serverData.length) - 1 });
    }
    return result;
  }, [serverData]);

  // Tự động nhảy sang block chứa tập đang xem (vd khi player tự chuyển tập kế tiếp)
  useEffect(() => {
    if (!chunks) return;
    const idx = chunks.findIndex((c) => currentEpisode >= c.start && currentEpisode <= c.end);
    if (idx !== -1 && idx !== activeChunk) setActiveChunk(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpisode, chunks]);

  const handleEpisodeClick = (episodeIndex) => {
    setCurrentEpisode(episodeIndex);
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    if (!serverData) return;
    const target = parseInt(jumpValue, 10);
    if (Number.isNaN(target) || target < 1 || target > serverData.length) return;
    handleEpisodeClick(target - 1);
    setJumpValue('');
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className="glass p-6 rounded-xl2 shadow-glass mb-8">
        <p className="text-white/40 text-center text-sm">Không có tập phim nào</p>
      </div>
    );
  }

  // Danh sách thực sự render ra — nếu có chunk thì chỉ render block đang chọn, không bao giờ render cả nghìn nút cùng lúc
  const displayedEpisodes = chunks
    ? serverData.slice(chunks[activeChunk].start, chunks[activeChunk].end + 1)
    : (serverData || []);
  const displayedOffset = chunks ? chunks[activeChunk].start : 0;

  const renderEpisodeButton = (episode, realIndex) => {
    const watched = isEpisodeWatched(slug, currentServer, realIndex);
    const isActive = currentEpisode === realIndex;

    if (isActive) {
      return (
        <button
          key={realIndex}
          onClick={() => handleEpisodeClick(realIndex)}
          className="relative w-full rounded-lg p-[1.5px] bg-gradient-to-r from-iris-400 to-ember-400 shadow-glow transition-transform duration-200 cursor-pointer active:scale-95"
        >
          <span className="flex items-center justify-center w-full h-full min-h-[38px] rounded-[7px] bg-ink-900 text-white text-sm font-semibold px-2 py-2 truncate">
            {episode.name}
          </span>
        </button>
      );
    }

    return (
      <button
        key={realIndex}
        onClick={() => handleEpisodeClick(realIndex)}
        className={`relative w-full min-h-[38px] rounded-lg font-medium text-sm px-2 py-2 truncate transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-y-0.5 ${
          watched
            ? 'bg-ember-500/15 text-ember-300 border border-ember-400/20 hover:bg-ember-500/25'
            : 'bg-white/[0.04] text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80'
        }`}
      >
        <span className="truncate block">{episode.name}</span>
        {watched && (
          <Check className="absolute top-1 right-1 w-3 h-3 text-ember-300/80" />
        )}
      </button>
    );
  };

  return (
    <div className="glass p-4 md:p-6 rounded-xl2 shadow-glass mb-6 md:mb-8">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h3 className="text-base md:text-lg font-display font-bold text-white">Danh Sách Tập</h3>

        {/* Nhảy thẳng tới số tập — cứu cánh cho phim vài nghìn tập, khỏi cuộn mỏi tay */}
        {serverData && serverData.length > CHUNK_THRESHOLD && (
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              max={serverData.length}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              placeholder={`1-${serverData.length}`}
              className="w-24 min-h-[36px] px-3 rounded-full bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-iris-400/60 focus:bg-white/[0.06] outline-none transition-all duration-200"
            />
            <button
              type="submit"
              className="min-h-[36px] w-9 flex items-center justify-center rounded-full bg-gradient-to-r from-iris-500 to-ember-500 text-white transition-all duration-200 cursor-pointer hover:shadow-glow active:scale-95"
              title="Đến tập"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Chọn block tập — chỉ hiện khi phim quá dài (>100 tập), tránh render hàng nghìn nút cùng lúc */}
      {chunks && chunks.length > 1 && (
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {chunks.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChunk(idx)}
              className={`flex-shrink-0 min-h-[32px] px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeChunk === idx
                  ? 'bg-iris-500/25 text-iris-200 border border-iris-400/40'
                  : 'bg-white/[0.03] text-white/45 border border-white/10 hover:bg-white/[0.07] hover:text-white/70'
              }`}
            >
              {c.start + 1}–{c.end + 1}
            </button>
          ))}
        </div>
      )}

      {/* Episode list: wrap-grid cuộn dọc theo trang, cả mobile lẫn desktop */}
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-4 sm:grid-cols-5' : 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10'}`}>
        {displayedEpisodes.map((episode, idx) => renderEpisodeButton(episode, displayedOffset + idx))}
      </div>

      {serverData?.length > 0 && (
        <div className="mt-4 text-xs text-white/40 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-iris-400 to-ember-400"></div>
            <span>Đang xem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-ember-500/25 border border-ember-400/30 rounded"></div>
            <span>Đã xem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-white/[0.06] border border-white/10 rounded"></div>
            <span>Chưa xem</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;