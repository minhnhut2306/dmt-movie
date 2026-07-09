import React from 'react';

/**
 * Shared glass surface for dropdowns, modals, and toasts.
 */
const GlassPanel = ({ as: Component = 'div', className = '', children, ...props }) => (
  <Component
    className={`glass-panel rounded-2xl shadow-cinema-lg animate-scale-in ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export default GlassPanel;
