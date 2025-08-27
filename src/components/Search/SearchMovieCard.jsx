// components/SearchMovieCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";

const SearchMovieCard = ({ movie }) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  const posterSrc =
    !err && movie?.poster
      ? movie.poster
      : `https://via.placeholder.com/300x450/111827/9CA3AF?text=${encodeURIComponent(
          movie?.title || "No image"
        )}`;

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group block focus:outline-none"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div
        className={[
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-b from-slate-900 to-slate-800",
          "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)]",
          "ring-1 ring-white/5",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.65)]",
          "focus-visible:ring-2 focus-visible:ring-sky-400/60",
        ].join(" ")}
      >
        <div className="relative w-full aspect-[3/3]">

          {!loaded && (
            <div className="absolute inset-0">
              <div className="h-full w-full bg-slate-800 animate-pulse rounded-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.06),transparent)] bg-[length:200%_100%] animate-[shimmer_1.2s_infinite]" />
            </div>
          )}


          <img
            src={posterSrc}
            alt={movie?.title || "Poster"}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setErr(true);
              setLoaded(true);
            }}
            className={[
              "absolute inset-0 h-full w-full object-cover object-center",
              "transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
              "scale-[1.02] group-hover:scale-[1.06] ease-out",
            ].join(" ")}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {loaded && movie?.rating && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur px-2.5 py-1.5 text-amber-300 text-sm font-medium shadow">
              <Star className="h-4 w-4" />
              <span>{movie.rating}</span>
            </div>
          )}

          {loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-black/60 p-4 backdrop-blur">
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative p-4 bg-slate-950/85 backdrop-blur-sm border-t border-white/5">
          <h3 className="mb-2 line-clamp-2 text-white text-base font-bold leading-snug">
            {movie?.title || "Đang cập nhật"}
          </h3>

          <div className="mb-2 flex items-center justify-between text-xs text-slate-200">
            <span className="rounded-md bg-sky-600/90 px-2 py-1 font-semibold">
              {movie?.year || "N/A"}
            </span>
            <span className="rounded-md bg-emerald-600/90 px-2 py-1 font-semibold">
              {movie?.type || "Movie"}
            </span>
          </div>

         
        </div>
      </div>
    </Link>
  );
};

export default SearchMovieCard;
