// config/movieSections.js
import {
  useMovies,
  useVietnamMovies,
  useChinaMovies,
  useJapanMovies,
  useSeriesMovies,
  useSingleMovies,
  useTVShows,
  useAnimationMovies,
  useActionMovies,
  useHorrorMovies,
  useHistoryMovies,
  transformLatestMovies,
  transformVietnamMovies,
  transformChinaMovies,
  transformJapanMovies,
  transformSeriesMovies,
  transformSingleMovies,
  transformTVShows,
  transformAnimationMovies,
  transformActionMovies,
  transformHorrorMovies,
  transformHistoryMovies,
} from '../hooks/useMovies';

export const MOVIE_SECTIONS = [
  {
    title: "Phim Mới Nhất",
    emoji: "🔥",
    sectionKey: "latest",
    badgeColor: "bg-red-600",
    useDataHook: () => useMovies(1),
    transformFunction: transformLatestMovies,
    viewMoreLink: "/category/danh-sach/phim-moi-cap-nhat"
  },
  {
    title: "Phim Việt Nam",
    emoji: "🇻🇳",
    sectionKey: "vietnam",
    badgeColor: "bg-red-600",
    useDataHook: () => useVietnamMovies(1),
    transformFunction: transformVietnamMovies,
    viewMoreLink: "/category/quoc-gia/viet-nam"
  },
  {
    title: "Phim Trung Quốc",
    emoji: "🇨🇳",
    sectionKey: "china",
    badgeColor: "bg-red-600",
    useDataHook: useChinaMovies,
    transformFunction: transformChinaMovies,
    viewMoreLink: "/category/quoc-gia/trung-quoc"
  },
  {
    title: "Phim Nhật Bản",
    emoji: "🇯🇵",
    sectionKey: "japan",
    badgeColor: "bg-red-600",
    useDataHook: useJapanMovies,
    transformFunction: transformJapanMovies,
    viewMoreLink: "/category/quoc-gia/nhat-ban"
  },
  {
    title: "Phim Bộ",
    emoji: "📺",
    sectionKey: "series",
    badgeColor: "bg-blue-600",
    useDataHook: useSeriesMovies,
    transformFunction: transformSeriesMovies,
    viewMoreLink: "/category/danh-sach/phim-bo"
  },
  {
    title: "Phim Lẻ",
    emoji: "🎬",
    sectionKey: "single",
    badgeColor: "bg-green-600",
    useDataHook: useSingleMovies,
    transformFunction: transformSingleMovies,
    viewMoreLink: "/category/danh-sach/phim-le"
  },
  {
    title: "TV Shows",
    emoji: "📻",
    sectionKey: "tvshows",
    badgeColor: "bg-purple-600",
    useDataHook: useTVShows,
    transformFunction: transformTVShows,
    viewMoreLink: "/category/danh-sach/tv-shows"
  },
  {
    title: "Phim Hoạt Hình",
    emoji: "🎨",
    sectionKey: "animation",
    badgeColor: "bg-pink-600",
    useDataHook: useAnimationMovies,
    transformFunction: transformAnimationMovies,
    viewMoreLink: "/category/danh-sach/hoat-hinh"
  },
  {
    title: "Phim Hành Động",
    emoji: "💥",
    sectionKey: "action",
    badgeColor: "bg-orange-600",
    useDataHook: useActionMovies,
    transformFunction: transformActionMovies,
    viewMoreLink: "/category/the-loai/hanh-dong"
  },
  {
    title: "Phim Kinh Dị",
    emoji: "👻",
    sectionKey: "horror",
    badgeColor: "bg-gray-800",
    useDataHook: useHorrorMovies,
    transformFunction: transformHorrorMovies,
    viewMoreLink: "/category/the-loai/kinh-di"
  },
  {
    title: "Phim Cổ Trang",
    emoji: "🏛️",
    sectionKey: "history",
    badgeColor: "bg-amber-600",
    useDataHook: useHistoryMovies,
    transformFunction: transformHistoryMovies,
    viewMoreLink: "/category/the-loai/co-trang"
  }
];