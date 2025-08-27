export const CATEGORY_TYPES = {
  // Thể loại phim
  'the-loai': {
    title: 'Thể Loại',
    apiEndpoint: (slug, page) => `/v1/api/the-loai/${slug}?page=${page}`,
    categories: {
      'hanh-dong': { name: 'Hành Động', color: 'bg-red-600' },
      'phieu-luu': { name: 'Phiêu Lưu', color: 'bg-blue-600' },
      'kinh-di': { name: 'Kinh Dị', color: 'bg-purple-900' },
      'hai-huoc': { name: 'Hài Hước', color: 'bg-yellow-600' },
      'tinh-cam': { name: 'Tình Cảm', color: 'bg-pink-600' },
      'khoa-hoc-vien-tuong': { name: 'Khoa Học Viễn Tưởng', color: 'bg-indigo-600' },
      'gia-dinh': { name: 'Gia Đình', color: 'bg-green-600' },
      'hoat-hinh': { name: 'Hoạt Hình', color: 'bg-orange-600' },
      'am-nhac': { name: 'Âm Nhạc', color: 'bg-purple-600' },
      'chien-tranh': { name: 'Chiến Tranh', color: 'bg-gray-700' },
      'hinh-su': { name: 'Hình Sự', color: 'bg-red-800' },
      'co-trang': { name: 'Cổ Trang', color: 'bg-amber-700' },
      'tam-ly': { name: 'Tâm Lý', color: 'bg-teal-600' },
      'the-thao': { name: 'Thể Thao', color: 'bg-emerald-600' },
      'bi-an': { name: 'Bí Ẩn', color: 'bg-slate-600' },
      'lich-su': { name: 'Lịch Sử', color: 'bg-brown-600' },
      'than-thoai': { name: 'Thần Thoại', color: 'bg-violet-600' },
      'vo-thuat': { name: 'Võ Thuật', color: 'bg-red-700' },
      'hoc-duong': { name: 'Học Đường', color: 'bg-blue-500' },
      'doi-thuong': { name: 'Đời Thường', color: 'bg-gray-600' }
    }
  },
  
  // Quốc gia
  'quoc-gia': {
    title: 'Quốc Gia',
    apiEndpoint: (slug, page) => `/v1/api/quoc-gia/${slug}?page=${page}`,
    categories: {
      'viet-nam': { name: 'Việt Nam', color: 'bg-red-600' },
      'han-quoc': { name: 'Hàn Quốc', color: 'bg-blue-600' },
      'trung-quoc': { name: 'Trung Quốc', color: 'bg-red-700' },
      'nhat-ban': { name: 'Nhật Bản', color: 'bg-red-500' },
      'my': { name: 'Mỹ', color: 'bg-blue-700' },
      'thai-lan': { name: 'Thái Lan', color: 'bg-red-600' },
      'an-do': { name: 'Ấn Độ', color: 'bg-orange-600' },
      'anh': { name: 'Anh', color: 'bg-blue-800' },
      'phap': { name: 'Pháp', color: 'bg-blue-600' },
      'duc': { name: 'Đức', color: 'bg-gray-800' },
      'nga': { name: 'Nga', color: 'bg-blue-900' },
      'philippines': { name: 'Philippines', color: 'bg-blue-600' },
      'hong-kong': { name: 'Hồng Kông', color: 'bg-red-700' },
      'dai-loan': { name: 'Đài Loan', color: 'bg-green-600' },
      'singapore': { name: 'Singapore', color: 'bg-red-500' },
      'malaysia': { name: 'Malaysia', color: 'bg-blue-500' },
      'indonesia': { name: 'Indonesia', color: 'bg-red-600' },
      'brazil': { name: 'Brazil', color: 'bg-green-700' },
      'mexico': { name: 'Mexico', color: 'bg-green-600' },
      'canada': { name: 'Canada', color: 'bg-red-700' },
      'australia': { name: 'Australia', color: 'bg-blue-600' },
      'tay-ban-nha': { name: 'Tây Ban Nha', color: 'bg-red-600' },
      'y': { name: 'Ý', color: 'bg-green-600' },
      'thuy-dien': { name: 'Thụy Điển', color: 'bg-blue-700' },
      'na-uy': { name: 'Na Uy', color: 'bg-blue-800' },
      'dan-mach': { name: 'Đan Mạch', color: 'bg-red-700' },
      'phan-lan': { name: 'Phần Lan', color: 'bg-blue-600' }
    }
  },

  'nam': {
    title: 'Năm Phát Hành',
    apiEndpoint: (slug, page) => `/v1/api/nam/${slug}?page=${page}`,
    categories: {
      '2024': { name: '2024', color: 'bg-blue-600' },
      '2023': { name: '2023', color: 'bg-purple-600' },
      '2022': { name: '2022', color: 'bg-green-600' },
      '2021': { name: '2021', color: 'bg-red-600' },
      '2020': { name: '2020', color: 'bg-yellow-600' },
      '2019': { name: '2019', color: 'bg-indigo-600' },
      '2018': { name: '2018', color: 'bg-pink-600' },
      '2017': { name: '2017', color: 'bg-orange-600' },
      '2016': { name: '2016', color: 'bg-teal-600' },
      '2015': { name: '2015', color: 'bg-cyan-600' },
      '2014': { name: '2014', color: 'bg-lime-600' },
      '2013': { name: '2013', color: 'bg-emerald-600' },
      '2012': { name: '2012', color: 'bg-sky-600' },
      '2011': { name: '2011', color: 'bg-violet-600' },
      '2010': { name: '2010', color: 'bg-rose-600' },
      '2009': { name: '2009', color: 'bg-amber-600' },
      '2008': { name: '2008', color: 'bg-slate-600' },
      '2007': { name: '2007', color: 'bg-zinc-600' },
      '2006': { name: '2006', color: 'bg-stone-600' },
      '2005': { name: '2005', color: 'bg-neutral-600' }
    }
  },
  'danh-sach': {
    title: 'Danh Sách',
    apiEndpoint: (slug, page) => {
      if (slug === 'phim-moi-cap-nhat') {
        return `/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
      }
      return `/v1/api/danh-sach/${slug}?page=${page}`;
    },
    categories: {
      'phim-moi-cap-nhat': { name: 'Phim Mới Cập Nhật', color: 'bg-red-600' },
      'phim-bo': { name: 'Phim Bộ', color: 'bg-blue-600' },
      'phim-le': { name: 'Phim Lẻ', color: 'bg-green-600' },
      'tv-shows': { name: 'TV Shows', color: 'bg-purple-600' },
      'hoat-hinh': { name: 'Hoạt Hình', color: 'bg-orange-600' },
      'phim-chieu-rap': { name: 'Phim Chiếu Rạp', color: 'bg-yellow-600' },
      'phim-thuyet-minh': { name: 'Phim Thuyết Minh', color: 'bg-indigo-600' },
      'phim-vietsub': { name: 'Phim Vietsub', color: 'bg-pink-600' }
    }
  }
};

export const getCategoryInfo = (categoryType, categorySlug) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return null;
  
  const categoryInfo = categoryConfig.categories[categorySlug];
  if (!categoryInfo) return null;
  
  return {
    ...categoryInfo,
    type: categoryConfig.title,
    apiEndpoint: categoryConfig.apiEndpoint(categorySlug, 1)
  };
};

export const getCategoriesByType = (categoryType) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return [];
  
  return Object.entries(categoryConfig.categories).map(([slug, info]) => ({
    slug,
    ...info,
    categoryType,
    fullPath: `/category/${categoryType}/${slug}`
  }));
};

export const ALL_GENRES = getCategoriesByType('the-loai');
export const ALL_COUNTRIES = getCategoriesByType('quoc-gia');
export const ALL_YEARS = getCategoriesByType('nam');
export const ALL_SPECIAL_LISTS = getCategoriesByType('danh-sach');