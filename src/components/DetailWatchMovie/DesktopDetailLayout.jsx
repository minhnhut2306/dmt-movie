import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play, Youtube } from 'lucide-react';
import { getSafeImageUrl } from '../../utils/imageHelper';
import { useMovieImages } from '../../hooks/useMovies';
import TrailerModal from './TrailerModal';
import MovieCastSection from './MovieCastSection';

const DesktopDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  const [showTrailer, setShowTrailer] = useState(false);

  // Ảnh TMDB chất lượng cao (nét hơn nhiều) — fallback về ảnh mặc định nếu phim không có tmdb id
  const { data: hiResImages } = useMovieImages(movieData.slug);
  const backdropSrc = hiResImages?.backdrop || getSafeImageUrl(movieData.thumb_url, movieData.name, { width: 1280, quality: 88 });
  const posterSrc = hiResImages?.poster || getSafeImageUrl(movieData.poster_url, movieData.name, { width: 600, quality: 90 });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 py-8 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-iris-300 mb-6 transition-colors duration-200 cursor-pointer focus-signature rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="relative mb-10">
          <div
            className="h-[420px] bg-cover bg-center rounded-xl2 relative overflow-hidden shadow-glass-lg"
            style={{ backgroundImage: `url(${backdropSrc})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-iris-500/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <h1 className="font-display text-4xl font-bold mb-2 text-white tracking-tight">{movieData.name}</h1>
              <p className="text-lg text-white/55 mb-4">{movieData.origin_name}</p>
              <div className="flex items-center gap-5 text-sm text-white/70">
                <div className="flex items-center gap-1.5 text-ember-400 font-semibold">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span>{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{movieData.vote_count} đánh giá</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="rounded-xl2 overflow-hidden shadow-glass-lg ring-1 ring-white/5 transition-transform duration-300 hover:-translate-y-1">
              <img
                src={posterSrc}
                alt={movieData.name}
                className="w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full mt-5 min-h-[52px] btn-signature text-white font-bold py-3.5 px-6 rounded-xl2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer focus-signature"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Xem Phim
            </button>

            {movieData.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full mt-3 min-h-[52px] glass text-white font-semibold py-3.5 px-6 rounded-xl2 transition-all duration-200 hover:bg-white/10 flex items-center justify-center gap-2 cursor-pointer focus-signature"
              >
                <Youtube className="w-5 h-5 text-ember-400" />
                Xem Trailer
              </button>
            )}
          </div>

          <div className="lg:col-span-3 space-y-5">
            <div className="glass p-6 rounded-xl2 shadow-glass">
              <h2 className="text-xl font-display font-bold mb-4 text-white">Thông Tin Phim</h2>
              <p className="text-white/60 mb-6 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: movieData.content }} />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4.5 h-4.5 text-iris-300" />
                    <span className="text-white/45">Thời lượng:</span>
                    <span className="text-white font-medium">{movieData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Film className="w-4.5 h-4.5 text-iris-300" />
                    <span className="text-white/45">Tập phim:</span>
                    <span className="text-white font-medium">{movieData.episode_current}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4.5 h-4.5 text-iris-300" />
                    <span className="text-white/45">Chất lượng:</span>
                    <span className="text-white font-medium">{movieData.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4.5 h-4.5 text-ember-400" />
                    <span className="text-white/45">Ngôn ngữ:</span>
                    <span className="text-white font-medium">{movieData.lang}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4.5 h-4.5 text-ember-400" />
                    <span className="text-white/45">Quốc gia:</span>
                    <span className="text-white font-medium">{movieData.country?.[0]?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl2 shadow-glass">
              <h3 className="text-lg font-display font-bold mb-4 text-white">Thể Loại</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.category?.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-iris-500/20 text-iris-200 border border-iris-400/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-iris-500/30 hover:-translate-y-0.5"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <MovieCastSection slug={movieData.slug} fallbackActors={movieData.actor} />
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movieData.trailer_url}
        movieName={movieData.name}
      />
    </div>
  );
};

export default DesktopDetailLayout;
