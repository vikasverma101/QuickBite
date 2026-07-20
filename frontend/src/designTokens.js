export const appTheme = {
  colors: {
    brand: {
      50: '#fff7f2',
      100: '#ffe3d6',
      500: '#ff4d2d',
      600: '#e64526',
      700: '#bf3d22',
    },
    surface: {
      50: '#fffaf7',
      100: '#fef2e8',
      200: '#fce7d9',
      900: '#111827',
    },
    slate: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      500: '#64748b',
      700: '#334155',
      900: '#0f172a',
    },
    success: '#10b981',
    danger: '#ef4444',
  },
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-[1.25rem]',
    full: 'rounded-full',
  },
  shadows: {
    soft: 'shadow-[0_12px_40px_rgba(15,23,42,0.06)]',
    md: 'shadow-[0_16px_46px_rgba(15,23,42,0.08)]',
    lg: 'shadow-[0_24px_70px_rgba(15,23,42,0.12)]',
  },
  transitions: 'transition-all duration-300 ease-out',
  typography: {
    title: 'text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900',
    subtitle: 'text-sm sm:text-base text-slate-600',
    sectionTitle: 'text-lg sm:text-xl font-semibold text-slate-900',
  },
  spacing: {
    page: 'px-4 sm:px-6 lg:px-8',
    section: 'py-4 sm:py-6',
    card: 'p-4 sm:p-5',
  },
  navShell: 'border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]',
};

export const cardSurface = `bg-white border border-slate-200/70 ${appTheme.shadows.soft} ${appTheme.radius.xl}`;

export const pageShell = 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,77,45,0.08),_transparent_35%),linear-gradient(135deg,_#fffaf7_0%,_#fff7f2_100%)]';
