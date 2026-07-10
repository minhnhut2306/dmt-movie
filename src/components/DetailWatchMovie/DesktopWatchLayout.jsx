import React from 'react';
import { Star, Calendar, Clock, Globe, Users, Film, Eye } from 'lucide-react';
import { lazy, Suspense } from 'react';

const VideoPlayer = lazy(() => import('./VideoPlayer'));
const EpisodeList = lazy(() => import('../EpisodeList'));

const DesktopWatchLayout = ({
  movieData,
  setActiveLayout,
  currentEpisode,
  currentServer,
  setCurrentEpisode,
  setCurrentServer,
  isFullscreen,
  setIsFullscreen
}) => {
  const currentVideoUrl = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.link_m3u8;
  const currentEmbedUrl = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.link_embed;
  const currentEpisodeName = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.name;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        <div className="mb-6">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-white/60 hover:text-iris-300 mb-2 transition-colors duration-200 cursor-pointer text-sm font-medium flex items-center gap-1.5"
          >
            ← Quay lại chi tiết
          </button>
          <h1 className="text-3xl font-display font-bold text-white">{movieData.name}</h1>
          <p className="text-white/50">{movieData.origin_name}</p>
          <p className="text-sm text-white/35 mt-1">
            Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
          </p>
        </div>


        <div className="mb-6">
          <div className="bg-black rounded-xl2 overflow-hidden shadow-glass-lg ring-1 ring-white/5">
            <Suspense fallback={<div className="aspect-video bg-ink-900 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-iris-400" /></div>}>
              <VideoPlayer
                currentVideoUrl={currentVideoUrl}
                currentEmbedUrl={currentEmbedUrl}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                slug={movieData.slug}
                episodeIndex={currentEpisode}
                serverIndex={currentServer}
              />
            </Suspense>
          </div>


          {currentVideoUrl && (
            <div className="mt-4 p-4 glass rounded-xl2">
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Đang phát: {currentEpisodeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-iris-300" />
                  <span>{movieData.episodes?.[currentServer]?.server_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-ember-400" />
                  <span>{movieData.quality}</span>
                </div>
              </div>
            </div>
          )}
        </div>


        <Suspense fallback={<div className="h-20 skeleton rounded-xl2 mb-6" />}>
          <EpisodeList
            episodes={movieData.episodes}
            currentServer={currentServer}
            currentEpisode={currentEpisode}
            setCurrentServer={setCurrentServer}
            setCurrentEpisode={setCurrentEpisode}
            isMobile={false}
          />
        </Suspense>


        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="glass p-6 rounded-xl2 shadow-glass">
            <h3 className="text-base font-display font-bold text-white mb-4">Thông Tin Phim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-ember-400" fill="currentColor" />
                <span className="text-white/45">Đánh giá:</span>
                <span className="text-white font-medium">{movieData.vote_average}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-iris-300" />
                <span className="text-white/45">Năm:</span>
                <span className="text-white font-medium">{movieData.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-iris-300" />
                <span className="text-white/45">Thời lượng:</span>
                <span className="text-white font-medium">{movieData.time}</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl2 shadow-glass">
            <h3 className="text-base font-display font-bold text-white mb-4">Chi Tiết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-ember-400" />
                <span className="text-white/45">Chất lượng:</span>
                <span className="text-white font-medium">{movieData.quality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-ember-400" />
                <span className="text-white/45">Ngôn ngữ:</span>
                <span className="text-white font-medium">{movieData.lang}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-iris-300" />
                <span className="text-white/45">Số tập:</span>
                <span className="text-white font-medium">{movieData.episode_current}</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl2 shadow-glass">
            <h3 className="text-base font-display font-bold text-white mb-4">Thể Loại</h3>
            <div className="flex flex-wrap gap-2">
              {movieData.category?.slice(0, 4).map((cat, index) => (
                <span
                  key={index}
                  className="bg-iris-500/20 text-iris-200 border border-iris-400/20 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>


        <div className="glass p-6 rounded-xl2 shadow-glass mb-8">
          <h3 className="text-base font-display font-bold text-white mb-4">Nội Dung Phim</h3>
          <p className="text-white/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: movieData.content }} />
        </div>


        <div className="glass p-6 rounded-xl2 shadow-glass mb-8">
          <h3 className="text-base font-display font-bold text-white mb-4">Diễn Viên</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {movieData.actor?.length > 0 ? movieData.actor.map((actor, index) => (
              <div
                key={index}
                className="bg-white/[0.04] border border-white/10 text-white/70 px-3 py-2 rounded-lg text-sm hover:bg-white/[0.08] transition-all duration-200 cursor-pointer text-center"
              >
                {actor}
              </div>
            )) : <span className="text-white/35 text-sm">Không có diễn viên nào.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopWatchLayout;