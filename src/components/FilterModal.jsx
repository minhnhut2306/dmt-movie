import React, { useState } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
import { useDynamicGenres, useDynamicCountries, ALL_YEARS } from '../utils/CategoryConfigDynamic';

const FilterModal = ({ isOpen, onClose, onApplyFilter }) => {
  const { genres } = useDynamicGenres();
  const { countries } = useDynamicCountries();

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-panel w-full max-w-lg sm:max-w-4xl rounded-2xl shadow-cinema-lg max-h-[85vh] overflow-hidden animate-scale-in">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-subtle bg-white/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand rounded-xl">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-ink-primary tracking-tight">Bộ lọc</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-ink-secondary" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(85vh-120px)] scrollbar-hide">
          <div className="space-y-3">
            {/* Loại phim - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-brand-hover mb-2">Loại phim</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('type', filters.type === type.value ? '' : type.value)}
                    className={`px-2 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      filters.type === type.value
                        ? 'bg-brand text-white shadow-cinema'
                        : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ngôn ngữ - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-sky-400 mb-2">Ngôn ngữ</label>
              <div className="grid grid-cols-3 gap-2">
                {langs.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => handleFilterChange('lang', filters.lang === lang.value ? '' : lang.value)}
                    className={`px-2 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      filters.lang === lang.value
                        ? 'bg-sky-500 text-white shadow-cinema'
                        : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thể loại - Collapsible on mobile */}
            <div className="border border-subtle rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('category')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-400">Thể loại</span>
                  {filters.category && (
                    <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      {genres.find(g => g.slug === filters.category)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${expandedSection === 'category' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'category' && (
                <div className="p-3 bg-white/[0.03]">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {genres.map(genre => (
                      <button
                        key={genre.slug}
                        onClick={() => {
                          handleFilterChange('category', filters.category === genre.slug ? '' : genre.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.category === genre.slug
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
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
            <div className="border border-subtle rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('country')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400">Quốc gia</span>
                  {filters.country && (
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      {countries.find(c => c.slug === filters.country)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${expandedSection === 'country' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'country' && (
                <div className="p-3 bg-white/[0.03]">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {countries.map(country => (
                      <button
                        key={country.slug}
                        onClick={() => {
                          handleFilterChange('country', filters.country === country.slug ? '' : country.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.country === country.slug
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
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
            <div className="border border-subtle rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('year')}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-brand-hover">Năm phát hành</span>
                  {filters.year && (
                    <span className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-full">
                      {filters.year}
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${expandedSection === 'year' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'year' && (
                <div className="p-3 bg-white/[0.03]">
                  <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {ALL_YEARS.map(year => (
                      <button
                        key={year.slug}
                        onClick={() => {
                          handleFilterChange('year', filters.year === year.slug ? '' : year.slug);
                          toggleSection(null);
                        }}
                        className={`px-1.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          filters.year === year.slug
                            ? 'bg-brand text-white'
                            : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
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
                <label className="block text-xs font-semibold text-gold-light mb-2">Sắp xếp</label>
                <select
                  value={filters.sortField}
                  onChange={(e) => handleFilterChange('sortField', e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-white/5 text-ink-primary rounded-lg border border-subtle focus:border-brand outline-none transition-colors duration-200"
                >
                  {sortFields.map(field => (
                    <option key={field.value} value={field.value} className="bg-base-elevated">{field.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gold-light mb-2">Thứ tự</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleFilterChange('sortType', 'desc')}
                    className={`px-2 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      filters.sortType === 'desc'
                        ? 'bg-gold text-white shadow-cinema'
                        : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
                    }`}
                  >
                    Giảm
                  </button>
                  <button
                    onClick={() => handleFilterChange('sortType', 'asc')}
                    className={`px-2 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      filters.sortType === 'asc'
                        ? 'bg-gold text-white shadow-cinema'
                        : 'bg-white/5 text-ink-secondary border border-subtle hover:bg-white/10'
                    }`}
                  >
                    Tăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="grid grid-cols-2 gap-2 p-3 sm:p-4 border-t border-subtle bg-black/40">
          <button
            onClick={handleReset}
            className="px-3 py-2.5 text-sm bg-white/10 hover:bg-white/15 text-ink-primary rounded-full font-semibold transition-all duration-200 border border-subtle cursor-pointer"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-2.5 text-sm bg-brand hover:bg-brand-hover text-white rounded-full font-semibold shadow-cinema transition-all duration-200 cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
