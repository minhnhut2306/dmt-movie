import React from 'react';

const EpisodeList = ({
  episodes,
  currentServer,
  currentEpisode,
  setCurrentServer,
  setCurrentEpisode,
  isMobile = false
}) => {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>Không có tập phim nào</p>
      </div>
    );
  }

  const gridClass = isMobile 
    ? "grid grid-cols-4 gap-2" 
    : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2";

  return (
    <div className={isMobile ? "mb-6" : "mb-8"}>
      {episodes.map((server, serverIndex) => (
        <div key={serverIndex} className={isMobile ? "mb-6" : "mb-8"}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent`}>
              {server.server_name}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/30 shadow-xl">
            <div className={gridClass}>
              {server.server_data?.map((episode, episodeIndex) => (
                <button
                  key={episodeIndex}
                  onClick={() => {
                    setCurrentServer(serverIndex);
                    setCurrentEpisode(episodeIndex);
                  }}
                  className={`group relative overflow-hidden rounded-lg font-medium text-xs transition-all duration-300 transform ${
                    currentServer === serverIndex && currentEpisode === episodeIndex
                      ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white shadow-lg shadow-orange-500/30 scale-105 z-10'
                      : 'bg-gradient-to-br from-gray-700 to-gray-600 text-gray-200 hover:from-gray-600 hover:to-gray-500 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/20'
                  } px-2 py-3 min-h-[44px] flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 whitespace-nowrap text-center">
                    {episode.name}
                  </span>

                  {currentServer === serverIndex && currentEpisode === episodeIndex && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;