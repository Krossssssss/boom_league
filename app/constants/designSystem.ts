// Enhanced Design System for Professional, Elegant, and Glassy UI
// Focused on glassmorphism, premium aesthetics, and sophisticated details

export const GLASS_EFFECTS = {
    // Glassmorphism backgrounds with varying intensities
    BACKGROUNDS: {
        // Primary glass surfaces
        primary: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl',
        secondary: 'bg-white/5 dark:bg-white/3 backdrop-blur-lg',
        tertiary: 'bg-white/3 dark:bg-white/2 backdrop-blur-md',
        
        // Interactive surfaces
        interactive: 'bg-white/8 dark:bg-white/4 backdrop-blur-xl hover:bg-white/12 dark:hover:bg-white/6',
        activeState: 'bg-white/15 dark:bg-white/8 backdrop-blur-xl',
        
        // Card surfaces
        card: 'bg-white/12 dark:bg-white/6 backdrop-blur-2xl',
        cardHover: 'bg-white/16 dark:bg-white/8 backdrop-blur-2xl',
        
        // Modal and overlay surfaces
        modal: 'bg-white/20 dark:bg-white/10 backdrop-blur-3xl',
        overlay: 'bg-black/40 backdrop-blur-sm',
        
        // Sidebar surfaces
        sidebar: 'bg-white/8 dark:bg-black/20 backdrop-blur-3xl',
        sidebarHover: 'bg-white/12 dark:bg-white/5 backdrop-blur-3xl',
    },
    
    // Enhanced border effects
    BORDERS: {
        subtle: 'border border-white/10 dark:border-white/5',
        medium: 'border border-white/15 dark:border-white/8',
        strong: 'border border-white/20 dark:border-white/12',
        accent: 'border border-orange-500/30 dark:border-orange-400/20',
        success: 'border border-green-500/30 dark:border-green-400/20',
        danger: 'border border-red-500/30 dark:border-red-400/20',
        
        // Gradient borders
        gradientOrange: 'border border-transparent bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-600/20 bg-clip-padding',
        gradientGreen: 'border border-transparent bg-gradient-to-r from-green-500/20 via-green-400/15 to-green-600/20 bg-clip-padding',
    },
    
    // Premium shadow system
    SHADOWS: {
        // Subtle depth
        xs: 'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)]',
        sm: 'shadow-[0_2px_4px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.03)]',
        
        // Medium depth
        md: 'shadow-[0_4px_8px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]',
        lg: 'shadow-[0_8px_16px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.06)]',
        
        // Strong depth
        xl: 'shadow-[0_12px_24px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.08)]',
        '2xl': 'shadow-[0_16px_32px_rgba(0,0,0,0.15),0_12px_24px_rgba(0,0,0,0.1)]',
        
        // Colored shadows
        orange: 'shadow-[0_8px_32px_rgba(251,146,60,0.15),0_4px_16px_rgba(251,146,60,0.1)]',
        green: 'shadow-[0_8px_32px_rgba(34,197,94,0.15),0_4px_16px_rgba(34,197,94,0.1)]',
        blue: 'shadow-[0_8px_32px_rgba(59,130,246,0.15),0_4px_16px_rgba(59,130,246,0.1)]',
        
        // Glow effects
        glow: 'shadow-[0_0_20px_rgba(255,255,255,0.1),0_0_40px_rgba(255,255,255,0.05)]',
        glowOrange: 'shadow-[0_0_20px_rgba(251,146,60,0.2),0_0_40px_rgba(251,146,60,0.1)]',
        glowGreen: 'shadow-[0_0_20px_rgba(34,197,94,0.2),0_0_40px_rgba(34,197,94,0.1)]',
    }
} as const;

export const ANIMATIONS = {
    // Micro-interactions
    TRANSITIONS: {
        fast: 'transition-all duration-150 ease-out',
        normal: 'transition-all duration-200 ease-out',
        slow: 'transition-all duration-300 ease-out',
        smooth: 'transition-all duration-500 ease-in-out',
    },
    
    // Hover effects
    HOVER: {
        lift: 'hover:scale-[1.02] hover:-translate-y-0.5',
        liftStrong: 'hover:scale-[1.05] hover:-translate-y-1',
        glow: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        glowOrange: 'hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]',
        shimmer: 'hover:bg-gradient-to-r hover:from-white/5 hover:via-white/10 hover:to-white/5',
    },
    
    // Active states
    ACTIVE: {
        press: 'active:scale-[0.98] active:translate-y-0.5',
        pressStrong: 'active:scale-[0.95] active:translate-y-1',
    },
    
    // Loading states
    LOADING: {
        pulse: 'animate-pulse',
        spin: 'animate-spin',
        bounce: 'animate-bounce',
    }
} as const;

export const GRADIENTS = {
    // Background gradients
    BACKGROUNDS: {
        primary: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
        secondary: 'bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
        accent: 'bg-gradient-to-br from-orange-50 via-orange-25 to-orange-100 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800',
    },
    
    // Text gradients
    TEXT: {
        primary: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent',
        accent: 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent',
        success: 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent',
        premium: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent',
    },
    
    // Border gradients
    BORDERS: {
        subtle: 'bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10',
        accent: 'bg-gradient-to-r from-orange-500/20 via-orange-400/30 to-orange-600/20',
        rainbow: 'bg-gradient-to-r from-violet-500/20 via-blue-500/20 via-green-500/20 via-yellow-500/20 via-orange-500/20 to-red-500/20',
    }
} as const;

export const SPACING = {
    // Enhanced spacing system for premium feel
    MICRO: {
        xs: '0.125rem', // 2px
        sm: '0.25rem',  // 4px
        md: '0.375rem', // 6px
        lg: '0.5rem',   // 8px
    },
    
    // Component spacing
    COMPONENT: {
        xs: '0.75rem',  // 12px
        sm: '1rem',     // 16px
        md: '1.5rem',   // 24px
        lg: '2rem',     // 32px
        xl: '3rem',     // 48px
    },
    
    // Layout spacing
    LAYOUT: {
        xs: '1rem',     // 16px
        sm: '1.5rem',   // 24px
        md: '2rem',     // 32px
        lg: '3rem',     // 48px
        xl: '4rem',     // 64px
        '2xl': '6rem',  // 96px
    }
} as const;

export const ROUNDED = {
    // Refined border radius system
    none: 'rounded-none',
    xs: 'rounded-sm',      // 2px - subtle
    sm: 'rounded',         // 4px - minimal
    md: 'rounded-md',      // 6px - standard
    lg: 'rounded-lg',      // 8px - moderate
    xl: 'rounded-xl',      // 12px - prominent
    '2xl': 'rounded-2xl',  // 16px - strong
    '3xl': 'rounded-3xl',  // 24px - very strong
    full: 'rounded-full',  // circle/pill
} as const;

// Utility function to combine glass effects
export const createGlassCard = (intensity: 'subtle' | 'medium' | 'strong' = 'medium') => {
    const backgrounds = {
        subtle: GLASS_EFFECTS.BACKGROUNDS.tertiary,
        medium: GLASS_EFFECTS.BACKGROUNDS.card,
        strong: GLASS_EFFECTS.BACKGROUNDS.modal,
    };
    
    const borders = {
        subtle: GLASS_EFFECTS.BORDERS.subtle,
        medium: GLASS_EFFECTS.BORDERS.medium,
        strong: GLASS_EFFECTS.BORDERS.strong,
    };
    
    const shadows = {
        subtle: GLASS_EFFECTS.SHADOWS.sm,
        medium: GLASS_EFFECTS.SHADOWS.lg,
        strong: GLASS_EFFECTS.SHADOWS.xl,
    };
    
    return `${backgrounds[intensity]} ${borders[intensity]} ${shadows[intensity]} ${ANIMATIONS.TRANSITIONS.normal}`;
};

// Utility function for interactive elements
export const createInteractiveGlass = (variant: 'primary' | 'accent' | 'success' | 'danger' = 'primary') => {
    const base = `${GLASS_EFFECTS.BACKGROUNDS.interactive} ${ANIMATIONS.TRANSITIONS.normal} ${ANIMATIONS.HOVER.lift}`;
    
    const variants = {
        primary: `${base} ${GLASS_EFFECTS.BORDERS.medium} hover:${GLASS_EFFECTS.SHADOWS.glow}`,
        accent: `${base} ${GLASS_EFFECTS.BORDERS.accent} hover:${GLASS_EFFECTS.SHADOWS.glowOrange}`,
        success: `${base} ${GLASS_EFFECTS.BORDERS.success} hover:${GLASS_EFFECTS.SHADOWS.glowGreen}`,
        danger: `${base} ${GLASS_EFFECTS.BORDERS.danger} hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]`,
    };
    
    return variants[variant];
};

export default {
    GLASS_EFFECTS,
    ANIMATIONS,
    GRADIENTS,
    SPACING,
    ROUNDED,
    createGlassCard,
    createInteractiveGlass,
};
