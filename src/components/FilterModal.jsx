import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
import { useDynamicGenres, useDynamicCountries, ALL_YEARS } from '../utils/CategoryConfigDynamic';

const FilterModal = ({ isOpen, onClose, onApplyFilter }) => {
  const { genres } = useDynamicGenres();
  const { countries } = useDynamicCountries();

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', prevent, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', prevent);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('touchmove', prevent);
    };
  }, [isOpen]);

  const [filters, setFilters] = useState({
    type: '',
    category: '',
    country: '',
    year: '',
    lang: '',
    sortField: 'modified.time',
    sortType: 'desc'
  });

  // Accordion state for mobile
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const types = [
    { value: 'phim-bo', label: 'Phim Bộ' },
    { value: 'phim-le', label: 'Phim Lẻ' },
    { value: 'tv-shows', label: 'TV Shows' },
    { value: 'hoat-hinh', label: 'Hoạt Hình' },
  ];

  const langs = [
    { value: 'vietsub', label: 'Vietsub' },
    { value: 'thuyet-minh', label: 'Thuyết Minh' },
    { value: 'long-tieng', label: 'Lồng Tiếng' },
  ];

  const sortFields = [
    { value: 'modified.time', label: 'Mới cập nhật' },
    { value: 'year', label: 'Năm phát hành' },
    { value: '_id', label: 'Mặc định' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      type: '',
      category: '',
      country: '',
      year: '',
      lang: '',
      sortField: 'modified.time',
      sortType: 'desc'
    });
  };

  if (!isOpen) return null;

  const pillBase = "min-h-[40px] px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer";
  const pillActive = "btn-signature text-white";
  const pillInactive = "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/[0.08]";

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-strong w-full sm:max-w-4xl rounded-t-sheet sm:rounded-xl2 shadow-glass-lg max-h-[88vh] sm:max-h-[85vh] overflow-hidden flex flex-col animate-slide-up sm:animate-scale-in">
        <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3 sm:hidden flex-shrink-0" />

        {/* Header - Compact */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-iris-400 to-iris-600 shadow-glow">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-display font-bold text-white">Bộ lọc</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Content - Scrollable, chiếm hết phần không gian còn lại giữa header/footer */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 scrollbar-thin-iris">
          <div className="space-y-3.5">
            {/* Loại phim - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-iris-300 mb-2">Loại phim</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('type', filters.type === type.value ? '' : type.value)}
                    className={`${pillBase} ${filters.type === type.value ? pillActive : pillInactive}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ngôn ngữ - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-iris-300 mb-2">Ngôn ngữ</label>
              <div className="grid grid-cols-3 gap-2">
                {langs.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => handleFilterChange('lang', filters.lang === lang.value ? '' : lang.value)}
                    className={`${pillBase} ${filters.lang === lang.value ? pillActive : pillInactive}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thể loại - Collapsible on mobile */}
            <div className="border border-white/5 rounded-xl2 overflow-hidden">
              <button
                onClick={() => toggleSection('category')}
                className="w-full min-h-[48px] flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-iris-300">Thể loại</span>
                  {filters.category && (
                    <span className="text-[10px] bg-iris-500/30 text-iris-200 px-2 py-0.5 rounded-full">
                      {genres.find(g => g.slug === filters.category)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 transition-transform duration-200 ${expandedSection === 'category' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'category' && (
                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-thin-iris">
                    {genres.map(genre => (
                      <button
                        key={genre.slug}
                        onClick={() => {
                          handleFilterChange('category', filters.category === genre.slug ? '' : genre.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.category === genre.slug
                            ? 'bg-iris-500 text-white'
                            : 'bg-white/[0.04] text-white/60 border border-white/10'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quốc gia - Collapsible on mobile */}
            <div className="border border-white/5 rounded-xl2 overflow-hidden">
              <button
                onClick={() => toggleSection('country')}
                className="w-full min-h-[48px] flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">Quốc gia</span>
                  {filters.country && (
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                      {countries.find(c => c.slug === filters.country)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 transition-transform duration-200 ${expandedSection === 'country' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'country' && (
                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-thin-iris">
                    {countries.map(country => (
                      <button
                        key={country.slug}
                        onClick={() => {
                          handleFilterChange('country', filters.country === country.slug ? '' : country.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.country === country.slug
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/[0.04] text-white/60 border border-white/10'
                        }`}
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Năm - Collapsible on mobile */}
            <div className="border border-white/5 rounded-xl2 overflow-hidden">
              <button
                onClick={() => toggleSection('year')}
                className="w-full min-h-[48px] flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ember-400">Năm phát hành</span>
                  {filters.year && (
                    <span className="text-[10px] bg-ember-500/30 text-ember-300 px-2 py-0.5 rounded-full">
                      {filters.year}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 transition-transform duration-200 ${expandedSection === 'year' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'year' && (
                <div className="p-3 bg-white/[0.02] border-t border-white/5">
                  <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto scrollbar-thin-iris">
                    {ALL_YEARS.map(year => (
                      <button
                        key={year.slug}
                        onClick={() => {
                          handleFilterChange('year', filters.year === year.slug ? '' : year.slug);
                          toggleSection(null);
                        }}
                        className={`px-1.5 py-1.5 rounded text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.year === year.slug
                            ? 'bg-ember-500 text-white'
                            : 'bg-white/[0.04] text-white/60 border border-white/10'
                        }`}
                      >
                        {year.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sắp xếp - Compact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ember-400 mb-2">Sắp xếp</label>
                <select
                  value={filters.sortField}
                  onChange={(e) => handleFilterChange('sortField', e.target.value)}
                  className="w-full min-h-[40px] px-2 py-2 text-xs bg-white/[0.04] text-white rounded-lg border border-white/10 focus:border-iris-400 outline-none cursor-pointer"
                >
                  {sortFields.map(field => (
                    <option key={field.value} value={field.value} className="bg-ink-900">{field.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ember-400 mb-2">Thứ tự</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleFilterChange('sortType', 'desc')}
                    className={`${pillBase} ${filters.sortType === 'desc' ? 'bg-ember-500 text-white' : pillInactive}`}
                  >
                    Giảm
                  </button>
                  <button
                    onClick={() => handleFilterChange('sortType', 'asc')}
                    className={`${pillBase} ${filters.sortType === 'asc' ? 'bg-ember-500 text-white' : pillInactive}`}
                  >
                    Tăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - luôn giữ nguyên chiều cao, không bị content phía trên đẩy che mất */}
        <div className="grid grid-cols-2 gap-2 p-4 border-t border-white/5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4 flex-shrink-0">
          <button
            onClick={handleReset}
            className="min-h-[48px] px-3 py-2.5 text-sm glass hover:bg-white/10 text-white rounded-xl2 font-medium transition-all duration-200 cursor-pointer"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApply}
            className="min-h-[48px] px-3 py-2.5 text-sm btn-signature text-white rounded-xl2 font-semibold transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
