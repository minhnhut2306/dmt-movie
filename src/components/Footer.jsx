import React from 'react';
import { Film, Tv, Compass } from 'lucide-react';
import {
  STATIC_SPECIAL_LISTS,
  useDynamicGenres
} from '../utils/CategoryConfigDynamic';

const Footer = () => {
  const { genres } = useDynamicGenres();

  const popularMovieCategories = STATIC_SPECIAL_LISTS.slice(0, 6);
  const popularGenres = genres.slice(0, 6);

  return (
    <footer className="mt-12 border-t border-white/5 bg-ink-900/60">
      <div className="container mx-auto px-4 py-10 lg:py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="space-y-4 md:pr-6 md:border-r md:border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-iris-400 to-iris-600 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-white" />
              </span>
              <span className="text-xl font-display font-bold">
                <span className="text-gradient-signature">DMT</span>
                <span className="text-white/90"> Movie</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Khám phá thế giới điện ảnh với hàng ngàn bộ phim chất lượng cao.
              Từ phim bộ đình đám đến những tác phẩm kinh điển, chúng tôi mang đến
              trải nghiệm giải trí tuyệt vời nhất.
            </p>
          </div>

          {/* Mobile version */}
          <div className="md:hidden grid grid-cols-2 gap-8 pt-2 border-t border-white/5">
            <div className="space-y-3">
              <h3 className="text-sm font-display font-semibold text-iris-300 flex items-center gap-1.5">
                <Tv className="w-4 h-4" />
                Danh Mục
              </h3>
              <ul className="space-y-2.5">
                {popularMovieCategories.map((category) => (
                  <li key={category.slug}>
                    <a
                      href={`/category/danh-sach/${category.slug}`}
                      className="text-xs leading-relaxed text-white/50 hover:text-iris-300 transition-colors duration-200 inline-block"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-display font-semibold text-iris-300 flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                Thể Loại
              </h3>
              <ul className="space-y-2.5">
                {popularGenres.map((genre) => (
                  <li key={genre.slug}>
                    <a
                      href={`/category/the-loai/${genre.slug}`}
                      className="text-xs leading-relaxed text-white/50 hover:text-iris-300 transition-colors duration-200 inline-block"
                    >
                      {genre.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop Movie Categories */}
          <div className="hidden md:block space-y-4 md:px-6 md:border-r md:border-white/5">
            <h3 className="text-base font-display font-semibold text-iris-300 flex items-center gap-2">
              <Tv className="w-4.5 h-4.5" />
              <span>Danh Mục Phim</span>
            </h3>
            <ul className="space-y-2.5">
              {popularMovieCategories.map((category) => (
                <li key={category.slug}>
                  <a
                    href={`/category/danh-sach/${category.slug}`}
                    className="text-sm text-white/50 hover:text-iris-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Genres */}
          <div className="hidden md:block space-y-4 md:px-6">
            <h3 className="text-base font-display font-semibold text-iris-300 flex items-center gap-2">
              <Film className="w-4.5 h-4.5" />
              <span>Thể Loại</span>
            </h3>
            <ul className="space-y-2.5">
              {popularGenres.map((genre) => (
                <li key={genre.slug}>
                  <a
                    href={`/category/the-loai/${genre.slug}`}
                    className="text-sm text-white/50 hover:text-iris-300 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {genre.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <div className="text-sm text-white/35">
              Được tạo bởi <span className="text-iris-300 font-semibold">nhut-dev</span>
              <p className="mt-1">Web này làm chơi cho vui</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
