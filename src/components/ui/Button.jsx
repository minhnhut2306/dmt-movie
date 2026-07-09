import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-brand hover:bg-brand-hover text-white shadow-cinema',
  secondary: 'bg-white/10 hover:bg-white/20 text-ink-primary border border-subtle',
  ghost: 'bg-transparent hover:bg-white/10 text-ink-primary',
  icon: 'bg-white/10 hover:bg-white/20 text-ink-primary',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-11 w-11',
};

const Button = ({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-full font-semibold cursor-pointer
        transition-all duration-200 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </Component>
  );
};

export default Button;
