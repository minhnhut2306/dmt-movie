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
      <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema mb-8 border border-subtle">
        <p className="text-ink-muted text-center">Không có tập phim nào</p>
      </div>
    );
  }

  // Render cho phim > 100 tập (có nhóm)
 // Render cho phim > 100 tập (có nhóm)
  // Render cho phim > 100 tập (có nhóm)
  const renderGroupedEpisodes = () => {
    return (
      <div className="space-y-4">
        {episodeGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroups[groupIndex];
          
          return (
            <div
              key={groupIndex}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-subtle overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              {/* Header của nhóm */}
              <button
                onClick={() => toggleGroup(groupIndex)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors duration-200 cursor-pointer ${
                  group.hasCurrent
                    ? 'bg-emerald-600/15 hover:bg-emerald-600/25'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-8 rounded-full ${
                    group.hasCurrent ? 'bg-emerald-500' : group.hasWatched ? 'bg-amber-500' : 'bg-white/20'
                  }`}></div>
                  <div className="text-left">
                    <div className="font-bold text-ink-primary text-lg">{group.label}</div>
                    <div className="text-sm text-ink-muted mt-0.5">
                      {group.episodes.length} tập phim
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {group.hasCurrent && (
                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      ĐANG XEM
                    </span>
                  )}
                  <div className={`p-2 rounded-full transition-colors ${
                    isExpanded ? 'bg-white/15' : 'bg-white/5'
                  }`}>
                    {isExpanded ?
                      <ChevronUp className="w-5 h-5 text-ink-secondary" /> :
                      <ChevronDown className="w-5 h-5 text-ink-secondary" />
                    }
                  </div>
                </div>
              </button>

              {/* Danh sách tập */}
              {isExpanded && (
                <div className="border-t border-subtle">
                  <div className={`p-5 grid gap-2 ${
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
                          className={`relative py-3 px-2 rounded-xl font-bold transition-all duration-200 text-sm cursor-pointer ${
                            isActive
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110 z-10'
                              : watched
                              ? 'bg-amber-600/90 text-white hover:bg-amber-500'
                              : 'bg-white/5 text-ink-secondary hover:bg-white/10 hover:text-ink-primary border border-subtle'
                          }`}
                        >
                          <span className="block">{episode.name}</span>
                          {watched && !isActive && (
                            <Check className="absolute top-1 right-1 w-3.5 h-3.5 text-white drop-shadow-lg" />
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
              className={`relative py-2 px-3 rounded-xl font-semibold transition-all duration-200 text-sm cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg scale-105 ring-2 ring-emerald-400/50'
                  : watched
                  ? 'bg-amber-600/90 text-white hover:bg-amber-500'
                  : 'bg-white/5 text-ink-secondary hover:bg-white/10 hover:text-ink-primary border border-subtle'
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
    <div className="bg-base-elevated p-4 md:p-6 rounded-2xl shadow-cinema mb-6 md:mb-8 border border-subtle">
      <h3 className="text-lg md:text-xl font-bold text-ink-primary mb-4 tracking-tight">Danh Sách Tập</h3>

      {/* Server Selection */}
      {episodes.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {episodes.map((server, serverIndex) => (
              <button
                key={serverIndex}
                onClick={() => handleServerChange(serverIndex)}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                  currentServer === serverIndex
                    ? 'bg-brand text-white shadow-cinema scale-105'
                    : 'bg-white/5 text-ink-secondary hover:bg-white/10 border border-subtle'
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
        <div className="mt-4 text-xs text-ink-muted flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Đang xem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
            <span>Đã xem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/20 rounded-full"></div>
            <span>Chưa xem</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;