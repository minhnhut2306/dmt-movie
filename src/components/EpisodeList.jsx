import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { isEpisodeWatched } from '../utils/watchHistory';
import { useParams } from 'react-router-dom';

const EpisodeList = ({
  episodes,
  currentServer,
  currentEpisode,
  setCurrentServer,
  setCurrentEpisode,
  isMobile
}) => {
  const { slug } = useParams();
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleEpisodeClick = (episodeIndex) => {
    setCurrentEpisode(episodeIndex);
  };

  const handleServerChange = (serverIndex) => {
    setCurrentServer(serverIndex);
    setCurrentEpisode(0);
    setExpandedGroups({});
  };

  const toggleGroup = (groupIndex) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex]
    }));
  };

  // Tạo nhóm tập cho phim > 100 tập
  const episodeGroups = useMemo(() => {
    const serverData = episodes?.[currentServer]?.server_data;
    if (!serverData || serverData.length <= 100) {
      return null;
    }

    const groupSize = 20;
    const groups = [];

    for (let i = 0; i < serverData.length; i += groupSize) {
      const groupEpisodes = serverData.slice(i, i + groupSize);
      const startEp = i;
      const endEp = Math.min(i + groupSize - 1, serverData.length - 1);

      const hasWatched = groupEpisodes.some((_, idx) =>
        isEpisodeWatched(slug, currentServer, i + idx)
      );
      const hasCurrent = currentEpisode >= startEp && currentEpisode <= endEp;

      groups.push({
        startEp,
        endEp,
        episodes: groupEpisodes,
        hasWatched,
        hasCurrent,
        label: `Tập ${startEp + 1} - ${endEp + 1}`
      });
    }

    return groups;
  }, [episodes, currentServer, slug, currentEpisode]);

  if (!episodes || episodes.length === 0) {
    return (
      <div className="glass p-6 rounded-xl2 shadow-glass mb-8">
        <p className="text-white/40 text-center text-sm">Không có tập phim nào</p>
      </div>
    );
  }

  const renderGroupedEpisodes = () => {
    return (
      <div className="space-y-3">
        {episodeGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroups[groupIndex];

          return (
            <div
              key={groupIndex}
              className="glass-subtle rounded-xl2 overflow-hidden transition-all duration-300"
            >
              {/* Header của nhóm */}
              <button
                onClick={() => toggleGroup(groupIndex)}
                className={`w-full px-5 py-3.5 flex items-center justify-between transition-colors duration-200 cursor-pointer ${
                  group.hasCurrent
                    ? 'bg-emerald-500/15 hover:bg-emerald-500/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-1 h-8 rounded-full ${
                    group.hasCurrent ? 'bg-emerald-400' : group.hasWatched ? 'bg-ember-400' : 'bg-white/15'
                  }`}></div>
                  <div className="text-left">
                    <div className="font-display font-bold text-white text-base">{group.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {group.episodes.length} tập phim
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {group.hasCurrent && (
                    <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                      ĐANG XEM
                    </span>
                  )}
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5">
                    {isExpanded ?
                      <ChevronUp className="w-4 h-4 text-white/60" /> :
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    }
                  </div>
                </div>
              </button>

              {/* Danh sách tập */}
              {isExpanded && (
                <div className="border-t border-white/5">
                  <div className={`p-4 grid gap-2 ${
                    isMobile
                      ? 'grid-cols-4 sm:grid-cols-5'
                      : 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-14'
                  }`}>
                    {group.episodes.map((episode, idx) => {
                      const episodeIndex = group.startEp + idx;
                      const watched = isEpisodeWatched(slug, currentServer, episodeIndex);
                      const isActive = currentEpisode === episodeIndex;

                      return (
                        <button
                          key={episodeIndex}
                          onClick={() => handleEpisodeClick(episodeIndex)}
                          className={`relative min-h-[44px] py-2.5 px-2 rounded-lg font-bold transition-all duration-200 text-sm cursor-pointer active:scale-95 ${
                            isActive
                              ? 'bg-emerald-500 text-white shadow-glow scale-105 z-10'
                              : watched
                              ? 'bg-ember-500/70 text-white hover:bg-ember-500'
                              : 'bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="block">{episode.name}</span>
                          {watched && !isActive && (
                            <Check className="absolute top-1 right-1 w-3.5 h-3.5 text-white drop-shadow" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderNormalEpisodes = () => {
    const serverData = episodes[currentServer]?.server_data;
    if (!serverData) return null;

    return (
      <div className={`grid gap-2 ${
        isMobile
          ? 'grid-cols-4 sm:grid-cols-5'
          : 'grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12'
      }`}>
        {serverData.map((episode, episodeIndex) => {
          const watched = isEpisodeWatched(slug, currentServer, episodeIndex);
          const isActive = currentEpisode === episodeIndex;

          return (
            <button
              key={episodeIndex}
              onClick={() => handleEpisodeClick(episodeIndex)}
              className={`relative min-h-[44px] py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-glow scale-105 ring-1 ring-emerald-300/50'
                  : watched
                  ? 'bg-ember-500/70 text-white hover:bg-ember-500'
                  : 'bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {episode.name}
              {watched && !isActive && (
                <Check className="absolute top-0 right-0 w-3 h-3 text-white" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass p-4 md:p-6 rounded-xl2 shadow-glass mb-6 md:mb-8">
      <h3 className="text-base md:text-lg font-display font-bold text-white mb-4">Danh Sách Tập</h3>

      {/* Server Selection */}
      {episodes.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {episodes.map((server, serverIndex) => (
              <button
                key={serverIndex}
                onClick={() => handleServerChange(serverIndex)}
                className={`min-h-[40px] px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer ${
                  currentServer === serverIndex
                    ? 'btn-signature text-white'
                    : 'bg-white/[0.05] text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {server.server_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Episode List - Grouped or Normal */}
      {episodeGroups ? renderGroupedEpisodes() : renderNormalEpisodes()}
      {episodes[currentServer]?.server_data?.length > 0 && (
        <div className="mt-4 text-xs text-white/40 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span>Đang xem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-ember-500/70 rounded"></div>
            <span>Đã xem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-white/10 rounded"></div>
            <span>Chưa xem</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
