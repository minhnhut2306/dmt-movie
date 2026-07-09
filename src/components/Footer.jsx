import React from 'react';
import { Film, Tv } from 'lucide-react';
import { 
  CATEGORY_TYPES, 
  STATIC_SPECIAL_LISTS,
  useDynamicGenres 
} from '../utils/CategoryConfigDynamic';

const Footer = () => {
  // ✅ Fetch từ API
  const { genres } = useDynamicGenres();

  const popularMovieCategories = STATIC_SPECIAL_LISTS.slice(0, 6);
  const popularGenres = genres.slice(0, 6);

  return (
    <footer className="bg-base-surface text-ink-secondary border-t border-subtle">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="space-y-4 md:pr-8 md:border-r md:border-subtle">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-brand">DMT</span>
                <span className="text-ink-primary">Movie</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Khám phá thế giới điện ảnh với hàng ngàn bộ phim chất lượng cao.
              Từ phim bộ đình đám đến những tác phẩm kinh điển, chúng tôi mang đến
              trải nghiệm giải trí tuyệt vời nhất.
            </p>
            <div className="md:hidden border-b border-subtle pb-4"></div>
          </div>

          {/* Mobile version */}
          <div className="md:hidden space-y-4">
            <div className="grid grid-cols-2 gap-8">
              {/* Movie Categories */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-brand-hover">
                  <span className="text-sm">Danh Mục Phim</span>
                </h3>
                <ul className="space-y-3">
                  {popularMovieCategories.map((category) => (
                    <li key={category.slug}>
                      <a
                        href={`/category/danh-sach/${category.slug}`}
                        className="text-xs leading-relaxed hover:text-brand-hover transition-colors duration-200 hover:translate-x-1 inline-block cursor-pointer"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Genres */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-brand-hover">
                  <span className="text-sm">Thể Loại</span>
                </h3>
                <ul className="space-y-3">
                  {popularGenres.map((genre) => (
                    <li key={genre.slug}>
                      <a
                        href={`/category/the-loai/${genre.slug}`}
                        className="text-xs leading-relaxed hover:text-brand-hover transition-colors duration-200 hover:translate-x-1 inline-block cursor-pointer"
                      >
                        {genre.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-b border-subtle pb-4"></div>
          </div>

          {/* Desktop Movie Categories */}
          <div className="hidden md:block space-y-4 md:px-8 md:border-r md:border-subtle">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center space-x-2">
              <Tv className="w-5 h-5 text-brand-hover" />
              <span>Danh Mục Phim</span>
            </h3>
            <ul className="space-y-2.5">
              {popularMovieCategories.map((category) => (
                <li key={category.slug}>
                  <a
                    href={`/category/danh-sach/${category.slug}`}
                    className="text-sm hover:text-brand-hover transition-colors duration-200 hover:translate-x-1 inline-block cursor-pointer"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Genres */}
          <div className="hidden md:block space-y-4 md:px-8">
            <h3 className="text-lg font-semibold text-ink-primary flex items-center space-x-2">
              <Film className="w-5 h-5 text-brand-hover" />
              <span>Thể Loại</span>
            </h3>
            <ul className="space-y-2.5">
              {popularGenres.map((genre) => (
                <li key={genre.slug}>
                  <a
                    href={`/category/the-loai/${genre.slug}`}
                    className="text-sm hover:text-brand-hover transition-colors duration-200 hover:translate-x-1 inline-block cursor-pointer"
                  >
                    {genre.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-subtle">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-center md:text-left">
              <div className="text-ink-muted">
                Được tạo bởi <span className="text-brand-hover font-semibold">nhut-dev</span>
                <p className="mt-1">Web này làm chơi cho vui </p>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="h-safe-bottom md:h-0"></div>
    </footer>
  );
};

export default Footer;