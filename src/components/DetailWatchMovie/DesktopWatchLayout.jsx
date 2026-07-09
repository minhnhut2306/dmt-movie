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
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-ink-secondary hover:text-brand-hover mb-2 transition-colors duration-200 cursor-pointer"
          >
            ← Quay lại chi tiết
          </button>
          <h1 className="text-3xl font-bold text-ink-primary tracking-tight">{movieData.name}</h1>
          <p className="text-ink-secondary">{movieData.origin_name}</p>
          <p className="text-sm text-ink-muted mt-1">
            Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
          </p>
        </div>


        <div className="mb-6">
          <div className="bg-black rounded-2xl overflow-hidden shadow-cinema-lg">
            <Suspense fallback={<div className="aspect-video bg-base-elevated flex items-center justify-center"><div className="relative h-10 w-10"><div className="absolute inset-0 rounded-full border-2 border-white/10"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin"></div></div></div>}>
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
            <div className="mt-4 p-4 bg-base-elevated/60 backdrop-blur-sm rounded-2xl border border-subtle">
              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Đang phát: {currentEpisodeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-hover" />
                  <span>{movieData.episodes?.[currentServer]?.server_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>{movieData.quality}</span>
                </div>
              </div>
            </div>
          )}
        </div>


        <Suspense fallback={<div className="h-20 bg-base-elevated/60 rounded-2xl animate-skeleton-pulse mb-6" />}>
          <EpisodeList
            episodes={movieData.episodes}
            currentServer={currentServer}
            currentEpisode={currentEpisode}
            setCurrentServer={setCurrentServer}
            setCurrentEpisode={setCurrentEpisode}
            isMobile={false}
          />
        </Suspense>


        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
            <h3 className="text-lg font-bold text-ink-primary mb-4 tracking-tight">Thông Tin Phim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold-light" fill="currentColor" />
                <span className="text-ink-muted">Đánh giá:</span>
                <span className="text-ink-primary font-medium">{movieData.vote_average}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-hover" />
                <span className="text-ink-muted">Năm:</span>
                <span className="text-ink-primary font-medium">{movieData.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-ink-muted">Thời lượng:</span>
                <span className="text-ink-primary font-medium">{movieData.time}</span>
              </div>
            </div>
          </div>

          <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
            <h3 className="text-lg font-bold text-ink-primary mb-4 tracking-tight">Chi Tiết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-ink-muted">Chất lượng:</span>
                <span className="text-ink-primary font-medium">{movieData.quality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-light" />
                <span className="text-ink-muted">Ngôn ngữ:</span>
                <span className="text-ink-primary font-medium">{movieData.lang}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-400" />
                <span className="text-ink-muted">Số tập:</span>
                <span className="text-ink-primary font-medium">{movieData.episode_current}</span>
              </div>
            </div>
          </div>

          <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
            <h3 className="text-lg font-bold text-ink-primary mb-4 tracking-tight">Thể Loại</h3>
            <div className="flex flex-wrap gap-2">
              {movieData.category?.slice(0, 4).map((cat, index) => (
                <span
                  key={index}
                  className="bg-white/10 border border-subtle text-ink-primary px-3 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>


        <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema mb-8 border border-subtle">
          <h3 className="text-lg font-bold text-ink-primary mb-4 tracking-tight">Nội Dung Phim</h3>
          <p className="text-ink-secondary leading-relaxed">{movieData.content}</p>
        </div>


        <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema mb-8 border border-subtle">
          <h3 className="text-lg font-bold text-ink-primary mb-4 tracking-tight">Diễn Viên</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {movieData.actor?.length > 0 ? movieData.actor.map((actor, index) => (
              <div
                key={index}
                className="bg-white/5 border border-subtle text-ink-secondary px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-all duration-200 cursor-pointer text-center"
              >
                {actor}
              </div>
            )) : <span className="text-ink-muted text-sm">Không có diễn viên nào.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopWatchLayout;