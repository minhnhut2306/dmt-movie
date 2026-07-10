import { useState, useEffect } from "react";
import { Home, X, Search, ChevronDown, Filter, History, Play, Trash2, Compass } from "lucide-react";
import logoDmt from "../assets/logodmt.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FilterModal from "./FilterModal";
import {
  useDynamicGenres,
  useDynamicCountries,
  ALL_YEARS
} from "../utils/CategoryConfigDynamic";
import NotificationBell from "./NotificationBell";
import { getAllWatchHistory, removeFromWatchHistory } from "../utils/watchHistory";
import { getSafeImageUrl } from "../utils/imageHelper";

const NAV_LINKS = [
  { to: "/category/danh-sach/phim-bo", label: "Phim Bộ" },
  { to: "/category/danh-sach/phim-le", label: "Phim Lẻ" },
  { to: "/category/danh-sach/phim-chieu-rap", label: "Chiếu Rạp" },
  { to: "/category/danh-sach/hoat-hinh", label: "Hoạt Hình" },
  { to: "/category/danh-sach/phim-vietsub", label: "Vietsub" },
  { to: "/category/danh-sach/phim-thuyet-minh", label: "Thuyết Minh" },
  { to: "/category/danh-sach/phim-long-tieng", label: "Lồng Tiếng" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowSearchDropdown(false);
    setShowHistory(false);
    setShowMobileSheet(false);
  }, [location.pathname]);

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

  const formatAgo = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - timestamp;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Vừa xem';
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  };

  return (
    <>
      <style>{`
        body {
          padding-top: 60px;
          padding-bottom: 68px;
        }
        @media (min-width: 1024px) {
          body { padding-bottom: 0; }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ================= TOP BAR ================= */}
      <nav className="glass-strong text-white fixed top-0 left-0 right-0 z-[9999] shadow-glass">
        {/* Signature gradient hairline — subtle depth cue at the base of the bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-iris-400/50 to-transparent pointer-events-none" />

        <div className="max-w-full px-3 lg:px-6">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link to="/" className="group flex items-center shrink-0 focus-signature rounded-lg">
              <img
                src={logoDmt}
                alt="DMT Movie"
                className="h-9 w-auto object-contain transition-transform duration-200 ease-out group-hover:scale-105"
              />
            </Link>

            {/* Desktop Menu chính */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(link => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-signature ${
                      isActive ? 'text-white bg-white/[0.06]' : 'text-white/65 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute left-3.5 right-3.5 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-iris-400 to-ember-400 origin-center transition-transform duration-200 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Thể loại Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'genres-desktop' ? null : 'genres-desktop')}
                  className={`group relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus-signature ${
                    activeDropdown === 'genres-desktop' ? 'text-white bg-white/[0.06]' : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Thể Loại
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'genres-desktop' ? 'rotate-180 text-iris-300' : ''}`} />
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-iris-400 to-ember-400 origin-center transition-transform duration-200 ease-out ${
                      activeDropdown === 'genres-desktop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
                {activeDropdown === 'genres-desktop' && (
                  <>
                    <div
                      className="fixed inset-0 z-[99998]"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div
                      className="fixed glass-strong rounded-card shadow-glass-lg w-96 z-[99999] right-4 animate-scale-in origin-top-right overflow-hidden"
                      style={{ top: '68px' }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-iris-400 via-iris-300 to-ember-400" />
                      <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-thin-iris">
                        {displayGenres.map(genre => (
                          <Link
                            key={genre.slug}
                            to={genre.fullPath}
                            onClick={() => setActiveDropdown(null)}
                            className="px-3 py-2 bg-white/[0.03] hover:bg-iris-500/20 hover:text-iris-200 rounded-lg text-sm transition-all duration-200 text-center border border-white/5 cursor-pointer"
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
                  className={`group relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus-signature ${
                    activeDropdown === 'countries-desktop' ? 'text-white bg-white/[0.06]' : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Quốc Gia
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'countries-desktop' ? 'rotate-180 text-iris-300' : ''}`} />
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-iris-400 to-ember-400 origin-center transition-transform duration-200 ease-out ${
                      activeDropdown === 'countries-desktop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
                {activeDropdown === 'countries-desktop' && (
                  <>
                    <div
                      className="fixed inset-0 z-[99998]"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div
                      className="fixed glass-strong rounded-card shadow-glass-lg w-96 z-[99999] right-4 animate-scale-in origin-top-right overflow-hidden"
                      style={{ top: '68px' }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-iris-400 via-iris-300 to-ember-400" />
                      <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-thin-iris">
                        {displayCountries.map(country => (
                          <Link
                            key={country.slug}
                            to={country.fullPath}
                            onClick={() => setActiveDropdown(null)}
                            className="px-3 py-2 bg-white/[0.03] hover:bg-iris-500/20 hover:text-iris-200 rounded-lg text-sm transition-all duration-200 text-center border border-white/5 cursor-pointer"
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
                  className={`group relative flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus-signature ${
                    activeDropdown === 'years-desktop' ? 'text-white bg-white/[0.06]' : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Năm
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'years-desktop' ? 'rotate-180 text-iris-300' : ''}`} />
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-iris-400 to-ember-400 origin-center transition-transform duration-200 ease-out ${
                      activeDropdown === 'years-desktop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
                {activeDropdown === 'years-desktop' && (
                  <>
                    <div
                      className="fixed inset-0 z-[99998]"
                      onClick={() => setActiveDropdown(null)}
                    />
                    <div
                      className="fixed glass-strong rounded-card shadow-glass-lg w-80 max-h-96 overflow-y-auto scrollbar-thin-iris z-[99999] right-4 animate-scale-in origin-top-right overflow-hidden"
                      style={{ top: '68px' }}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-iris-400 via-iris-300 to-ember-400" />
                      <div className="p-4 grid grid-cols-4 gap-2">
                        {displayYears.map(year => (
                          <Link
                            key={year.slug}
                            to={year.fullPath}
                            onClick={() => setActiveDropdown(null)}
                            className="px-2 py-2 bg-white/[0.03] hover:bg-iris-500/20 hover:text-iris-200 rounded-lg text-sm transition-all duration-200 text-center border border-white/5 cursor-pointer"
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

            <div className="flex items-center gap-1">
              <NotificationBell />

              {/* History Dropdown — desktop only (mobile uses bottom nav sheet) */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => showHistory ? setShowHistory(false) : openHistory()}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-iris-300 hover:bg-iris-500/10 rounded-xl2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 focus-signature"
                  title="Lịch sử xem"
                >
                  <History size={19} />
                </button>

                {showHistory && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                    <div className="absolute right-0 mt-2 w-80 glass-strong rounded-card shadow-glass-lg z-50 overflow-hidden top-full animate-scale-in origin-top-right">
                      <div className="h-0.5 bg-gradient-to-r from-iris-400 via-iris-300 to-ember-400" />
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <span className="text-sm font-semibold text-white">Xem gần đây</span>
                        <Link
                          to="/history"
                          onClick={() => setShowHistory(false)}
                          className="text-xs text-iris-300 hover:text-iris-200 transition-colors"
                        >
                          Xem tất cả →
                        </Link>
                      </div>

                      {historyItems.length === 0 ? (
                        <div className="py-10 text-center text-white/40 text-sm">
                          Chưa có lịch sử xem
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto scrollbar-thin-iris">
                          {historyItems.map(item => (
                            <div
                              key={item.slug}
                              className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer transition-colors"
                              onClick={() => { navigate(`/movie/${item.slug}`); setShowHistory(false); }}
                            >
                              <div className="relative flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-ink-700">
                                <img
                                  src={getSafeImageUrl(item.poster, item.title)}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                {item.lastEpisodeName && (
                                  <p className="text-iris-300 text-xs truncate">{item.lastEpisodeName}</p>
                                )}
                                <p className="text-white/35 text-xs mt-0.5">{formatAgo(item.timestamp)}</p>
                              </div>
                              <button
                                onClick={(e) => handleRemoveHistory(e, item.slug)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 text-white/30 rounded-lg transition-all flex-shrink-0 cursor-pointer"
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

              {/* Search Icon - Desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                  className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-iris-300 hover:bg-iris-500/10 rounded-xl2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 focus-signature"
                  title="Tìm kiếm"
                >
                  <Search size={19} />
                </button>

                {showSearchDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSearchDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 glass-strong rounded-card shadow-glass-lg z-50 overflow-hidden top-full animate-scale-in origin-top-right">
                      <div className="h-0.5 bg-gradient-to-r from-iris-400 via-iris-300 to-ember-400" />
                      <form onSubmit={handleSearch} className="p-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                          <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Nhập tên phim..."
                            className="w-full bg-ink-900/80 text-white pl-10 pr-4 py-2.5 rounded-lg border border-white/10 focus:border-iris-400 outline-none transition-all placeholder:text-white/30"
                            autoFocus
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full mt-3 btn-signature text-white py-2.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-px"
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
                className="hidden lg:flex w-10 h-10 items-center justify-center text-white/70 hover:text-iris-300 hover:bg-iris-500/10 rounded-xl2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 focus-signature"
                title="Bộ lọc"
              >
                <Filter size={19} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU (bottom sheet) ================= */}
      <div className={`lg:hidden fixed inset-0 z-[9998] transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleMenu}
        />

        <div className={`absolute left-0 right-0 bottom-0 max-h-[85vh] glass-strong rounded-t-sheet shadow-glass-lg transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3" />

          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h2 className="text-lg font-display font-bold text-white">Khám phá</h2>
            <button onClick={toggleMenu} className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="px-5 pb-8 overflow-y-auto scrollbar-thin-iris" style={{ maxHeight: 'calc(85vh - 60px)' }}>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={toggleMenu}
                  className="min-h-[44px] flex items-center justify-center px-3 py-2.5 text-sm font-medium bg-white/[0.04] hover:bg-iris-500/20 hover:text-iris-200 rounded-lg transition-all duration-200 text-center border border-white/5 cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => { setShowFilterModal(true); setIsMenuOpen(false); }}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-4 py-3 btn-signature text-white rounded-lg font-semibold transition-all duration-200 mt-4 cursor-pointer active:scale-[0.98]"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc nâng cao
            </button>

            <div className="mt-4 space-y-2">
              {[
                { key: 'genres', label: 'Thể Loại', items: displayGenres, colsClass: 'grid-cols-2' },
                { key: 'countries', label: 'Quốc Gia', items: displayCountries, colsClass: 'grid-cols-2' },
                { key: 'years', label: 'Năm Phát Hành', items: displayYears, colsClass: 'grid-cols-3' },
              ].map(section => (
                <div key={section.key}>
                  <button
                    onClick={() => toggleDropdown(section.key)}
                    className="min-h-[48px] flex items-center justify-between w-full px-4 py-3 text-base font-medium text-white/85 hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>{section.label}</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === section.key ? 'rotate-180 text-iris-300' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === section.key ? 'max-h-64' : 'max-h-0'}`}>
                    <div className="mt-2 p-2 bg-white/[0.03] rounded-lg border border-white/5">
                      <div className="max-h-48 overflow-y-auto scrollbar-thin-iris">
                        <div className={`grid ${section.colsClass} gap-2`}>
                          {section.items.map(entry => (
                            <Link
                              key={entry.slug}
                              to={entry.fullPath}
                              onClick={toggleMenu}
                              className="min-h-[40px] flex items-center justify-center px-2 py-2 text-sm text-white/70 hover:bg-iris-500/20 hover:text-iris-200 rounded-lg transition-all duration-200 text-center cursor-pointer"
                            >
                              {entry.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH SHEET ================= */}
      <div className={`lg:hidden fixed inset-0 z-[9998] transition-all duration-300 ${showSearchDropdown ? 'visible' : 'invisible pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${showSearchDropdown ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowSearchDropdown(false)}
        />
        <div className={`absolute left-0 right-0 bottom-0 glass-strong rounded-t-sheet shadow-glass-lg transform transition-transform duration-300 ease-out ${showSearchDropdown ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3" />
          <form onSubmit={handleSearch} className="px-5 pt-4 pb-8">
            <h2 className="text-lg font-display font-bold text-white mb-3">Tìm kiếm</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nhập tên phim..."
                className="w-full bg-ink-900/80 text-white pl-10 pr-4 py-3.5 rounded-lg border border-white/10 focus:border-iris-400 outline-none text-base placeholder:text-white/30"
                autoFocus={showSearchDropdown}
              />
            </div>
            <button
              type="submit"
              className="w-full mt-3 min-h-[48px] btn-signature text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* ================= MOBILE HISTORY SHEET ================= */}
      <div className={`lg:hidden fixed inset-0 z-[9998] transition-all duration-300 ${showHistory ? 'visible' : 'invisible pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${showHistory ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowHistory(false)}
        />
        <div className={`absolute left-0 right-0 bottom-0 max-h-[75vh] glass-strong rounded-t-sheet shadow-glass-lg transform transition-transform duration-300 ease-out ${showHistory ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3" />
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h2 className="text-lg font-display font-bold text-white">Xem gần đây</h2>
            <Link to="/history" onClick={() => setShowHistory(false)} className="text-xs text-iris-300 hover:text-iris-200 transition-colors">
              Xem tất cả →
            </Link>
          </div>
          {historyItems.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-sm">Chưa có lịch sử xem</div>
          ) : (
            <div className="px-3 pb-8 overflow-y-auto scrollbar-thin-iris" style={{ maxHeight: 'calc(75vh - 60px)' }}>
              {historyItems.map(item => (
                <div
                  key={item.slug}
                  className="group flex items-center gap-3 px-2 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors active:scale-[0.99]"
                  onClick={() => { navigate(`/movie/${item.slug}`); setShowHistory(false); }}
                >
                  <div className="relative flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-ink-700">
                    <img
                      src={getSafeImageUrl(item.poster, item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    {item.lastEpisodeName && (
                      <p className="text-iris-300 text-xs truncate">{item.lastEpisodeName}</p>
                    )}
                    <p className="text-white/35 text-xs mt-0.5">{formatAgo(item.timestamp)}</p>
                  </div>
                  <button
                    onClick={(e) => handleRemoveHistory(e, item.slug)}
                    className="w-9 h-9 flex items-center justify-center text-white/30 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all flex-shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= BOTTOM NAV (mobile only) — thay thế hoàn toàn hamburger menu ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[9997] glass-strong shadow-glass-lg pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-[60px]">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors duration-200 ${location.pathname === '/' ? 'text-iris-300' : 'text-white/55'}`}
          >
            <Home size={19} />
            <span className="text-[9px] font-medium">Trang Chủ</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 cursor-pointer ${isMenuOpen ? 'text-iris-300' : 'text-white/55'}`}
          >
            <Compass size={19} />
            <span className="text-[9px] font-medium">Khám Phá</span>
          </button>
          <button
            onClick={() => setShowSearchDropdown(true)}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 cursor-pointer ${showSearchDropdown ? 'text-iris-300' : 'text-white/55'}`}
          >
            <Search size={19} />
            <span className="text-[9px] font-medium">Tìm Kiếm</span>
          </button>
          <button
            onClick={() => { setShowFilterModal(true); }}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 cursor-pointer ${showFilterModal ? 'text-iris-300' : 'text-white/55'}`}
          >
            <Filter size={19} />
            <span className="text-[9px] font-medium">Bộ Lọc</span>
          </button>
          <button
            onClick={openHistory}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 cursor-pointer ${showHistory ? 'text-iris-300' : 'text-white/55'}`}
          >
            <History size={19} />
            <span className="text-[9px] font-medium">Lịch Sử</span>
          </button>
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
