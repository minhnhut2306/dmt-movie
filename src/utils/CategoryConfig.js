export const CATEGORY_TYPES = {
  // Thể loại phim
  "the-loai": {
    title: "Thể Loại",
    apiEndpoint: (slug, page) => `/v1/api/the-loai/${slug}?page=${page}`,
    categories: {
      "hanh-dong": { name: "Hành Động", color: "bg-gray-700" },
      "co-trang": { name: "Cổ Trang", color: "bg-gray-700" },
      "chien-tranh": { name: "Chiến Tranh", color: "bg-gray-700" },
      "vien-tuong": { name: "Viễn Tưởng", color: "bg-gray-700" },
      "kinh-di": { name: "Kinh Dị", color: "bg-gray-700" },
      "tai-lieu": { name: "Tài Liệu", color: "bg-gray-700" },
      "bi-an": { name: "Bí Ẩn", color: "bg-gray-700" },
      "phim-18": { name: "Phim 18+", color: "bg-gray-700" },
      "tinh-cam": { name: "Tình Cảm", color: "bg-gray-700" },
      "tam-ly": { name: "Tâm Lý", color: "bg-gray-700" },
      "the-thao": { name: "Thể Thao", color: "bg-gray-700" },
      "phieu-luu": { name: "Phiêu Lưu", color: "bg-gray-700" },
      "am-nhac": { name: "Âm Nhạc", color: "bg-gray-700" },
      "gia-dinh": { name: "Gia Đình", color: "bg-gray-700" },
      "hoc-duong": { name: "Học Đường", color: "bg-gray-700" },
      "hai-huoc": { name: "Hài Hước", color: "bg-gray-700" },
      "hinh-su": { name: "Hình Sự", color: "bg-gray-700" },
      "vo-thuat": { name: "Võ Thuật", color: "bg-gray-700" },
      "khoa-hoc": { name: "Khoa Học", color: "bg-gray-700" },
      "than-thoai": { name: "Thần Thoại", color: "bg-gray-700" },
      "chinh-kich": { name: "Chính Kịch", color: "bg-gray-700" },
      "kinh-dien": { name: "Kinh Điển", color: "bg-gray-700" },
    },
  },

  // Quốc gia
  "quoc-gia": {
    title: "Quốc Gia",
    apiEndpoint: (slug, page) => `/v1/api/quoc-gia/${slug}?page=${page}`,
    categories: {
      "trung-quoc": { name: "Trung Quốc", color: "bg-gray-700" },
      "thai-lan": { name: "Thái Lan", color: "bg-gray-700" },
      "hong-kong": { name: "Hồng Kông", color: "bg-gray-700" },
      phap: { name: "Pháp", color: "bg-gray-700" },
      duc: { name: "Đức", color: "bg-gray-700" },
      "ha-lan": { name: "Hà Lan", color: "bg-gray-700" },
      mexico: { name: "Mexico", color: "bg-gray-700" },
      "thuy-dien": { name: "Thụy Điển", color: "bg-gray-700" },
      philippines: { name: "Philippines", color: "bg-gray-700" },
      "dan-mach": { name: "Đan Mạch", color: "bg-gray-700" },
      "thuy-si": { name: "Thụy Sĩ", color: "bg-gray-700" },
      ukraina: { name: "Ukraina", color: "bg-gray-700" },
      "han-quoc": { name: "Hàn Quốc", color: "bg-gray-700" },
      "au-my": { name: "Âu Mỹ", color: "bg-gray-700" },
      "an-do": { name: "Ấn Độ", color: "bg-gray-700" },
      canada: { name: "Canada", color: "bg-gray-700" },
      "tay-ban-nha": { name: "Tây Ban Nha", color: "bg-gray-700" },
      indonesia: { name: "Indonesia", color: "bg-gray-700" },
      "ba-lan": { name: "Ba Lan", color: "bg-gray-700" },
      malaysia: { name: "Malaysia", color: "bg-gray-700" },
      "bo-dao-nha": { name: "Bồ Đào Nha", color: "bg-gray-700" },
      uae: { name: "UAE", color: "bg-gray-700" },
      "chau-phi": { name: "Châu Phi", color: "bg-gray-700" },
      "a-rap-xe-ut": { name: "Ả Rập Xê Út", color: "bg-gray-700" },
      "nhat-ban": { name: "Nhật Bản", color: "bg-gray-700" },
      "dai-loan": { name: "Đài Loan", color: "bg-gray-700" },
      anh: { name: "Anh", color: "bg-gray-700" },
      "tho-nhi-ky": { name: "Thổ Nhĩ Kỳ", color: "bg-gray-700" },
      nga: { name: "Nga", color: "bg-gray-700" },
      uc: { name: "Úc", color: "bg-gray-700" },
      brazil: { name: "Brazil", color: "bg-gray-700" },
      y: { name: "Ý", color: "bg-gray-700" },
      "na-uy": { name: "Na Uy", color: "bg-gray-700" },
      "nam-phi": { name: "Nam Phi", color: "bg-gray-700" },
      "viet-nam": { name: "Việt Nam", color: "bg-gray-700" },
      "quoc-gia-khac": { name: "Khác", color: "bg-gray-700" },
    },
  },

  nam: {
    title: "Năm Phát Hành",
    apiEndpoint: (slug, page) => `/v1/api/nam/${slug}?page=${page}`,
    categories: {
      2025: { name: "2025", color: "bg-gray-700" },
      2024: { name: "2024", color: "bg-gray-700" },
      2023: { name: "2023", color: "bg-gray-700" },
      2022: { name: "2022", color: "bg-gray-700" },
      2021: { name: "2021", color: "bg-gray-700" },
      2020: { name: "2020", color: "bg-gray-700" },
      2019: { name: "2019", color: "bg-gray-700" },
      2018: { name: "2018", color: "bg-gray-700" },
      2017: { name: "2017", color: "bg-gray-700" },
      2016: { name: "2016", color: "bg-gray-700" },
      2015: { name: "2015", color: "bg-gray-700" },
      2014: { name: "2014", color: "bg-gray-700" },
      2013: { name: "2013", color: "bg-gray-700" },
      2012: { name: "2012", color: "bg-gray-700" },
      2011: { name: "2011", color: "bg-gray-700" },
      2010: { name: "2010", color: "bg-gray-700" },
      2009: { name: "2009", color: "bg-gray-700" },
      2008: { name: "2008", color: "bg-gray-700" },
      2007: { name: "2007", color: "bg-gray-700" },
      2006: { name: "2006", color: "bg-gray-700" },
      2005: { name: "2005", color: "bg-gray-700" },
      2004: { name: "2004", color: "bg-gray-700" },
      2003: { name: "2003", color: "bg-gray-700" },
      2002: { name: "2002", color: "bg-gray-700" },
      2001: { name: "2001", color: "bg-gray-700" },
      2000: { name: "2000", color: "bg-gray-700" },
      1999: { name: "1999", color: "bg-gray-700" },
      1998: { name: "1998", color: "bg-gray-700" },
      1997: { name: "1997", color: "bg-gray-700" },
      1996: { name: "1996", color: "bg-gray-700" },
      1995: { name: "1995", color: "bg-gray-700" },
      1994: { name: "1994", color: "bg-gray-700" },
      1993: { name: "1993", color: "bg-gray-700" },
      1992: { name: "1992", color: "bg-gray-700" },
      1991: { name: "1991", color: "bg-gray-700" },
      1990: { name: "1990", color: "bg-gray-700" },
    },
  },
  "danh-sach": {
    title: "Danh Sách",
    apiEndpoint: (slug, page) => {
      if (slug === "phim-moi-cap-nhat") {
        return `/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
      }
      return `/v1/api/danh-sach/${slug}?page=${page}`;
    },
    categories: {
      "phim-bo": { name: "Phim Bộ", color: "bg-gray-700" },
      "phim-le": { name: "Phim Lẻ", color: "bg-gray-700" },
      "tv-shows": { name: "TV Shows", color: "bg-gray-700" },
      "hoat-hinh": { name: "Hoạt Hình", color: "bg-gray-700" },
      "phim-vietsub": { name: "Phim Vietsub", color: "bg-gray-700" },
      "phim-thuyet-minh": { name: "Phim Thuyết Minh", color: "bg-gray-700" },
      "phim-long-tieng": { name: "Phim Lồng Tiếng", color: "bg-gray-700" },
    },
  },
};

export const getCategoryInfo = (categoryType, categorySlug) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return null;

  const categoryInfo = categoryConfig.categories[categorySlug];
  if (!categoryInfo) return null;

  return {
    ...categoryInfo,
    type: categoryConfig.title,
    apiEndpoint: categoryConfig.apiEndpoint(categorySlug, 1),
  };
};

export const getCategoriesByType = (categoryType) => {
  const categoryConfig = CATEGORY_TYPES[categoryType];
  if (!categoryConfig) return [];

  return Object.entries(categoryConfig.categories).map(([slug, info]) => ({
    slug,
    ...info,
    categoryType,
    fullPath: `/category/${categoryType}/${slug}`,
  }));
};

export const ALL_GENRES = getCategoriesByType("the-loai");
export const ALL_COUNTRIES = getCategoriesByType("quoc-gia");
export const ALL_YEARS = getCategoriesByType("nam");
export const ALL_SPECIAL_LISTS = getCategoriesByType("danh-sach");
