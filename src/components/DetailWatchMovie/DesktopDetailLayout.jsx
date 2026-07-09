import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play, Youtube } from 'lucide-react';
import { getSafeImageUrl, getBackdropUrl, getPosterUrl } from '../../utils/imageHelper';
import { useMovieImages } from '../../hooks/useMovies';
import TrailerModal from './TrailerModal';

const DesktopDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const { data: imagesData } = useMovieImages(movieData.slug);
  const backdropUrl = getBackdropUrl(imagesData) || getSafeImageUrl(movieData.thumb_url, movieData.name);
  const posterUrl = getPosterUrl(imagesData) || getSafeImageUrl(movieData.poster_url, movieData.name);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ink-secondary hover:text-brand-hover mb-6 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="relative mb-12">
          <div
            className="h-[28rem] bg-cover bg-center rounded-3xl relative overflow-hidden shadow-cinema-lg"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 poster-scrim"></div>
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 text-ink-primary tracking-tight drop-shadow-lg">{movieData.name}</h1>
              <p className="text-xl text-ink-secondary mb-4">{movieData.origin_name}</p>
              <div className="flex items-center gap-4 text-sm text-ink-secondary">
                <div className="flex items-center gap-1 text-gold-light">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="font-semibold">{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{movieData.vote_count} đánh giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <img
              src={posterUrl}
              alt={movieData.name}
              className="w-full rounded-2xl shadow-cinema-lg transition-transform duration-300 hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full mt-6 bg-brand hover:bg-brand-hover text-white font-bold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-cinema flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Xem Phim
            </button>

            {movieData.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full mt-3 bg-white/10 hover:bg-white/15 border border-subtle text-ink-primary font-bold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Youtube className="w-5 h-5" />
                Xem Trailer
              </button>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
              <h2 className="text-2xl font-bold mb-4 text-ink-primary tracking-tight">Thông Tin Phim</h2>
              <p className="text-ink-secondary mb-6 leading-relaxed">{movieData.content}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-hover" />
                    <span className="text-ink-muted">Thời lượng:</span>
                    <span className="text-ink-primary font-medium">{movieData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-emerald-400" />
                    <span className="text-ink-muted">Tập phim:</span>
                    <span className="text-ink-primary font-medium">{movieData.episode_current}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span className="text-ink-muted">Chất lượng:</span>
                    <span className="text-ink-primary font-medium">{movieData.quality}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gold-light" />
                    <span className="text-ink-muted">Ngôn ngữ:</span>
                    <span className="text-ink-primary font-medium">{movieData.lang}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-hover" />
                    <span className="text-ink-muted">Quốc gia:</span>
                    <span className="text-ink-primary font-medium">{movieData.country?.[0]?.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
              <h3 className="text-xl font-bold mb-4 text-ink-primary tracking-tight">Thể Loại</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.category?.map((cat, index) => (
                  <span
                    key={index}
                    className="bg-white/10 hover:bg-brand text-ink-primary hover:text-white px-4 py-2 rounded-full text-sm font-medium border border-subtle transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-base-elevated p-6 rounded-2xl shadow-cinema border border-subtle">
              <h3 className="text-xl font-bold mb-4 text-ink-primary tracking-tight">Diễn Viên</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.actor?.length > 0 ? movieData.actor.map((actor, index) => (
                  <span
                    key={index}
                    className="bg-white/5 border border-subtle text-ink-secondary px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    {actor}
                  </span>
                )) : <span className="text-ink-muted text-sm">Không có diễn viên nào.</span>}
              </div>
            </div>
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