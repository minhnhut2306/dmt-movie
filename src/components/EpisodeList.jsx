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
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl mb-8">
        <p className="text-gray-400 text-center">Không có tập phim nào</p>
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
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300"
            >
              {/* Header của nhóm */}
              <button
                onClick={() => toggleGroup(groupIndex)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors duration-200 ${
                  group.hasCurrent
                    ? 'bg-green-600/20 hover:bg-green-600/30'
                    : 'hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-8 rounded-full ${
                    group.hasCurrent ? 'bg-green-500' : group.hasWatched ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}></div>
                  <div className="text-left">
                    <div className="font-bold text-white text-lg">{group.label}</div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {group.episodes.length} tập phim
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {group.hasCurrent && (
                    <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full">
                      ĐANG XEM
                    </span>
                  )}
                  <div className={`p-2 rounded-lg transition-colors ${
                    isExpanded ? 'bg-gray-700' : 'bg-gray-700/50'
                  }`}>
                    {isExpanded ? 
                      <ChevronUp className="w-5 h-5 text-gray-300" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-300" />
                    }
                  </div>
                </div>
              </button>
              
              {/* Danh sách tập */}
              {isExpanded && (
                <div className="border-t border-gray-700/50">
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
                          className={`relative py-3 px-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                            isActive
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110 z-10'
                              : watched
                              ? 'bg-yellow-600 text-white hover:bg-yellow-500'
                              : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white'
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
              className={`relative py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105 ring-2 ring-green-400'
                  : watched
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
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
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Danh Sách Tập</h3>
      
      {/* Server Selection */}
      {episodes.length > 1 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {episodes.map((server, serverIndex) => (
              <button
                key={serverIndex}
                onClick={() => handleServerChange(serverIndex)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentServer === serverIndex
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
        <div className="mt-4 text-xs text-gray-400 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-600 to-green-700 rounded"></div>
            <span>Đang xem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded"></div>
            <span>Đã xem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded"></div>
            <span>Chưa xem</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;