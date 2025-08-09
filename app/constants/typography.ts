// Typography Design System
// Professional and elegant font weight and size choices

export const TYPOGRAPHY = {
    // Font Weights - Limited palette for consistency
    WEIGHTS: {
        light: 'font-light',      // 300 - For subtle text
        normal: 'font-normal',    // 400 - Default body text
        medium: 'font-medium',    // 500 - Emphasized text
        semibold: 'font-semibold', // 600 - Section headers
        bold: 'font-bold',        // 700 - Main titles
        extrabold: 'font-extrabold' // 800 - Hero elements (rare use)
    },

    // Font Sizes - Responsive scale system
    SIZES: {
        // Body text sizes
        xs: 'text-xs',           // 12px - Fine print, captions
        sm: 'text-sm',           // 14px - Secondary text
        base: 'text-base',       // 16px - Primary body text
        lg: 'text-lg',           // 18px - Emphasized body text

        // Heading sizes
        xl: 'text-xl',           // 20px - Small headings
        '2xl': 'text-2xl',       // 24px - Section headings
        '3xl': 'text-3xl',       // 30px - Page headings
        '4xl': 'text-4xl',       // 36px - Main titles
        '5xl': 'text-5xl',       // 48px - Hero titles (rare)
    },

    // Responsive combinations for common use cases
    COMBINATIONS: {
        // Display text (main titles, hero elements)
        hero: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
        
        // Page titles
        pageTitle: 'text-2xl sm:text-3xl font-bold',
        
        // Section headings
        sectionTitle: 'text-xl sm:text-2xl font-semibold',
        
        // Card titles
        cardTitle: 'text-lg sm:text-xl font-semibold',
        
        // Subsection headings
        subheading: 'text-lg font-medium',
        
        // Body text variations
        bodyLarge: 'text-base sm:text-lg font-normal',
        body: 'text-sm sm:text-base font-normal',
        bodySmall: 'text-xs sm:text-sm font-normal',
        
        // Emphasized text
        emphasized: 'text-sm sm:text-base font-medium',
        
        // Labels and captions
        label: 'text-xs sm:text-sm font-medium',
        caption: 'text-xs font-normal',
        
        // Button text
        buttonLarge: 'text-base font-semibold',
        button: 'text-sm font-semibold',
        buttonSmall: 'text-xs font-medium',
        
        // Navigation
        navItem: 'text-sm font-medium',
        navTitle: 'text-base font-semibold',
        
        // Status and badges
        badge: 'text-xs font-semibold',
        status: 'text-sm font-medium',
        
        // Numbers and stats
        statNumber: 'text-lg sm:text-xl font-bold',
        statLabel: 'text-xs sm:text-sm font-medium',
        
        // Form elements
        formLabel: 'text-sm font-medium',
        formInput: 'text-sm font-normal',
        formHelper: 'text-xs font-normal',
        
        // Modal and dialog
        modalTitle: 'text-xl font-semibold',
        modalBody: 'text-sm font-normal',
        
        // Table elements
        tableHeader: 'text-xs font-semibold',
        tableCell: 'text-sm font-normal',
        
        // Sidebar elements
        sidebarTitle: 'text-sm font-semibold',
        sidebarItem: 'text-sm font-medium',
        sidebarCaption: 'text-xs font-normal',
    }
} as const;

// Utility function to get typography classes
export const getTypography = (variant: keyof typeof TYPOGRAPHY.COMBINATIONS): string => {
    return TYPOGRAPHY.COMBINATIONS[variant];
};

// Line height recommendations for better readability
export const LINE_HEIGHTS = {
    tight: 'leading-tight',      // 1.25 - For headings
    snug: 'leading-snug',        // 1.375 - For large text
    normal: 'leading-normal',    // 1.5 - For body text
    relaxed: 'leading-relaxed',  // 1.625 - For comfortable reading
    loose: 'leading-loose'       // 2 - For very spaced text
} as const;

// Letter spacing for professional appearance
export const LETTER_SPACING = {
    tighter: 'tracking-tighter', // -0.05em
    tight: 'tracking-tight',     // -0.025em
    normal: 'tracking-normal',   // 0em
    wide: 'tracking-wide',       // 0.025em
    wider: 'tracking-wider',     // 0.05em
    widest: 'tracking-widest'    // 0.1em
} as const;
