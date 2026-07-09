import React from 'react';

/**
 * Consistent section title row used across Home sections and listing pages.
 */
const SectionHeader = ({ title, subtitle, badge, count, action, className = '' }) => (
  <div className={`flex items-end justify-between gap-4 mb-4 sm:mb-6 ${className}`}>
    <div className="min-w-0">
      <div className="flex items-center gap-2.5 flex-wrap">
        {badge}
        <h2 className="text-lg sm:text-2xl font-bold text-ink-primary tracking-tight truncate">
          {title}
        </h2>
        {typeof count === 'number' && (
          <span className="text-sm text-ink-muted font-medium">({count})</span>
        )}
      </div>
      {subtitle && <p className="text-sm text-ink-secondary mt-1">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
