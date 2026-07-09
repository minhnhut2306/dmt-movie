import { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown, Filter, History, Play, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import FilterModal from "./FilterModal";
import {
  useDynamicGenres,
  useDynamicCountries,
  ALL_YEARS
} from "../utils/CategoryConfigDynamic";
import NotificationBell from "./NotificationBell";
import { getAllWatchHistory, removeFromWatchHistory } from "../utils/watchHistory";
import { getSafeImageUrl } from "../utils/imageHelper";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const openHistory = () => {
    setHistoryItems(getAllWatchHistory().slice(0, 12));
    setShowHistory(true);
  };

  const handleRemoveHistory = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchHistory(slug);
    setHistoryItems(prev => prev.filter(h => h.slug !== slug));
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleApplyFilter = (filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.year) params.append('year', filters.year);
    if (filters.lang) params.append('lang', filters.lang);
    params.append('sort_field', filters.sortField);
    params.append('sort_type', filters.sortType);

    navigate(`/filter?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSearchDropdown(false);
      setSearchInput('');
    }
  };

  const { genres: displayGenres } = useDynamicGenres();
  const { countries: displayCountries } = useDynamicCountries();
  const displayYears = ALL_YEARS;

  const navLinkClass = "text-sm font-medium text-ink-secondary hover:text-ink-primary transition-colors duration-200 cursor-pointer";
  const dropdownItemClass = "px-3 py-2 bg-white/5 hover:bg-brand rounded-lg text-sm transition-all duration-200 text-center border border-subtle text-ink-secondary hover:text-white cursor-pointer";

  return (
    <>
      <style>{`
        body {
          padding-top: 56px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <nav className="bg-black/95 backdrop-blur-md text-ink-primary shadow-cinema fixed top-0 left-0 right-0 z-[9999] border-b border-subtle">
        {/* Hàng 1: Logo + Menu chính + Actions */}
        <div>
          <div className="max-w-full px-2">
            <div className="flex items-center justify-between h-14">

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  <span className="text-brand">DMT</span>
                  <span className="text-ink-primary">Movie</span>
                </h1>
              </Link>

              {/* Desktop Menu chính */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link to="/category/danh-sach/phim-bo" className={navLinkClass}>
                  Phim Bộ
                </Link>
                <Link to="/category/danh-sach/phim-le" className={navLinkClass}>
                  Phim Lẻ
                </Link>
                <Link to="/category/danh-sach/phim-chieu-rap" className={navLinkClass}>
                  Phim Chiếu Rạp
                </Link>
                <Link to="/category/danh-sach/hoat-hinh" className={navLinkClass}>
                  Hoạt Hình
                </Link>
                <Link to="/category/danh-sach/phim-vietsub" className={navLinkClass}>
                  Vietsub
                </Link>
                <Link to="/category/danh-sach/phim-thuyet-minh" className={navLinkClass}>
                  Thuyết Minh
                </Link>
                <Link to="/category/danh-sach/phim-long-tieng" className={navLinkClass}>
                  Lồng Tiếng
                </Link>

                {/* Thể loại Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'genres-desktop' ? null : 'genres-desktop')}
                    className={`flex items-center whitespace-nowrap cursor-pointer ${navLinkClass}`}
                  >
                    Thể Loại
                    <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${activeDropdown === 'genres-desktop' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'genres-desktop' && (
                    <>
                      <div
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div
                        className="fixed glass-panel rounded-2xl shadow-cinema-lg w-96 z-[99999] right-4 animate-scale-in"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                          {displayGenres.map(genre => (
                            <Link
                              key={genre.slug}
                              to={genre.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className={dropdownItemClass}
                            >
                              {genre.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quốc gia Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'countries-desktop' ? null : 'countries-desktop')}
                    className={`flex items-center whitespace-nowrap cursor-pointer ${navLinkClass}`}
                  >
                    Quốc Gia
                    <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${activeDropdown === 'countries-desktop' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'countries-desktop' && (
                    <>
                      <div
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div
                        className="fixed glass-panel rounded-2xl shadow-cinema-lg w-96 z-[99999] right-4 animate-scale-in"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                          {displayCountries.map(country => (
                            <Link
                              key={country.slug}
                              to={country.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className={dropdownItemClass}
                            >
                              {country.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Năm Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'years-desktop' ? null : 'years-desktop')}
                    className={`flex items-center whitespace-nowrap cursor-pointer ${navLinkClass}`}
                  >
                    Năm
                    <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${activeDropdown === 'years-desktop' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === 'years-desktop' && (
                    <>
                      <div
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div
                        className="fixed glass-panel rounded-2xl w-80 max-h-96 overflow-y-auto scrollbar-hide shadow-cinema-lg z-[99999] right-4 animate-scale-in"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-4 gap-2">
                          {displayYears.map(year => (
                            <Link
                              key={year.slug}
                              to={year.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className={dropdownItemClass}
                            >
                              {year.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <NotificationBell />

                {/* History Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => showHistory ? setShowHistory(false) : openHistory()}
                    className="p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
                    title="Lịch sử xem"
                  >
                    <History size={20} />
                  </button>

                  {showHistory && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                      <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-cinema-lg z-50 overflow-hidden top-full animate-scale-in">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
                          <span className="text-sm font-semibold text-ink-primary">Xem gần đây</span>
                          <Link
                            to="/history"
                            onClick={() => setShowHistory(false)}
                            className="text-xs text-brand-hover hover:text-brand transition-colors duration-200 cursor-pointer"
                          >
                            Xem tất cả →
                          </Link>
                        </div>

                        {historyItems.length === 0 ? (
                          <div className="py-10 text-center text-ink-muted text-sm">
                            Chưa có lịch sử xem
                          </div>
                        ) : (
                          <div className="max-h-96 overflow-y-auto scrollbar-hide">
                            {historyItems.map(item => (
                              <div
                                key={item.slug}
                                className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                                onClick={() => { navigate(`/movie/${item.slug}`); setShowHistory(false); }}
                              >
                                <div className="relative flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-base-elevated">
                                  <img
                                    src={getSafeImageUrl(item.poster, item.title)}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-ink-primary text-sm font-medium truncate">{item.title}</p>
                                  {item.lastEpisodeName && (
                                    <p className="text-brand-hover text-xs truncate">{item.lastEpisodeName}</p>
                                  )}
                                  <p className="text-ink-muted text-xs mt-0.5">
                                    {item.timestamp ? (() => {
                                      const diff = Date.now() - item.timestamp;
                                      const m = Math.floor(diff / 60000);
                                      if (m < 1) return 'Vừa xem';
                                      if (m < 60) return `${m} phút trước`;
                                      const h = Math.floor(m / 60);
                                      if (h < 24) return `${h} giờ trước`;
                                      return `${Math.floor(h / 24)} ngày trước`;
                                    })() : ''}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => handleRemoveHistory(e, item.slug)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-brand/20 hover:text-brand-hover text-ink-muted rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Search Icon - Mobile */}
                <div className="lg:hidden relative">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
                  >
                    <Search size={20} />
                  </button>

                  {showSearchDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSearchDropdown(false)}
                      />
                      <div
                        className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl shadow-cinema-lg z-50 p-3 animate-scale-in"
                      >
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={15} />
                            <input
                              type="text"
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              placeholder="Nhập tên phim..."
                              className="w-full bg-white/5 text-ink-primary placeholder:text-ink-muted pl-9 pr-16 py-2 rounded-full border border-subtle focus:border-brand outline-none text-sm transition-colors duration-200"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand hover:bg-brand-hover text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                            >
                              Tìm
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </div>

                {/* Search Icon - Desktop */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
                    title="Tìm kiếm"
                  >
                    <Search size={20} />
                  </button>

                  {showSearchDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSearchDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl shadow-cinema-lg z-50 p-4 top-full animate-scale-in">
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted" size={18} />
                            <input
                              type="text"
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              placeholder="Nhập tên phim..."
                              className="w-full bg-white/5 text-ink-primary placeholder:text-ink-muted pl-10 pr-4 py-2.5 rounded-full border border-subtle focus:border-brand outline-none transition-colors duration-200"
                              autoFocus
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full mt-3 bg-brand hover:bg-brand-hover text-white py-2.5 rounded-full font-semibold transition-all duration-200 cursor-pointer shadow-cinema"
                          >
                            Tìm kiếm
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>

                {/* Filter Icon - Desktop */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="hidden lg:block p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
                  title="Bộ lọc"
                >
                  <Filter size={20} />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="lg:hidden p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
          <div
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={toggleMenu}
          />

          <div className={`absolute left-0 top-0 h-full w-80 bg-black shadow-cinema-lg transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-subtle`}>

            <div className="flex items-center justify-between p-4 border-b border-subtle">
              <h2 className="text-xl font-extrabold tracking-tight">
                <span className="text-brand">DMT</span>
                <span className="text-ink-primary">Movie</span>
              </h2>
              <button onClick={toggleMenu} className="p-2 text-ink-secondary hover:text-brand-hover transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search đã có trên navbar rồi, bỏ ở đây */}

            <div className="p-4 overflow-y-auto h-full pb-32">
              <div className="space-y-2">
                {/* Grid 2 cột cho mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/category/danh-sach/phim-bo" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Phim Bộ
                  </Link>
                  <Link to="/category/danh-sach/phim-le" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Phim Lẻ
                  </Link>
                  <Link to="/category/danh-sach/phim-chieu-rap" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Phim Chiếu Rạp
                  </Link>
                  <Link to="/category/danh-sach/hoat-hinh" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Hoạt Hình
                  </Link>
                  <Link to="/category/danh-sach/phim-vietsub" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Vietsub
                  </Link>
                  <Link to="/category/danh-sach/phim-thuyet-minh" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Thuyết Minh
                  </Link>
                  <Link to="/category/danh-sach/phim-long-tieng" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 hover:text-brand-hover rounded-xl transition-all duration-200 text-center border border-subtle cursor-pointer">
                    Lồng Tiếng
                  </Link>
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:bg-brand-hover text-white rounded-full font-semibold transition-all duration-200 mt-4 cursor-pointer shadow-cinema active:scale-95"
                >
                  <Filter className="w-4 h-4" />
                  Bộ lọc nâng cao
                </button>

                <div className="mt-4 space-y-2">
                  <div>
                    <button
                      onClick={() => toggleDropdown('genres')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-ink-secondary hover:bg-white/5 hover:text-brand-hover rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <span>Thể Loại</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'genres' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'genres' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-white/5 rounded-xl border border-subtle">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayGenres.map(genre => (
                              <Link
                                key={genre.slug}
                                to={genre.fullPath}
                                onClick={toggleMenu}
                                className="block px-2 py-2 text-sm text-ink-secondary hover:bg-brand hover:text-white rounded-lg transition-all duration-200 text-center cursor-pointer"
                              >
                                {genre.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDropdown('countries')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-ink-secondary hover:bg-white/5 hover:text-brand-hover rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <span>Quốc Gia</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'countries' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'countries' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-white/5 rounded-xl border border-subtle">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayCountries.map(country => (
                              <Link
                                key={country.slug}
                                to={country.fullPath}
                                onClick={toggleMenu}
                                className="block px-2 py-2 text-sm text-ink-secondary hover:bg-brand hover:text-white rounded-lg transition-all duration-200 text-center cursor-pointer"
                              >
                                {country.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDropdown('years')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-ink-secondary hover:bg-white/5 hover:text-brand-hover rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <span>Năm Phát Hành</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'years' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'years' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-3 gap-2">
                          {displayYears.map(year => (
                            <Link
                              key={year.slug}
                              to={year.fullPath}
                              onClick={toggleMenu}
                              className="block px-2 py-2 text-sm text-ink-secondary hover:bg-brand hover:text-white rounded-lg transition-all duration-200 text-center cursor-pointer"
                            >
                              {year.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
      />
    </>
  );
};

export default Navbar;
