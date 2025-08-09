import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { InfoCardProps } from '../../types';
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../../constants/typography';
import { GLASS_EFFECTS, ANIMATIONS, ROUNDED, createGlassCard, createInteractiveGlass } from '../../constants/designSystem';

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${createInteractiveGlass('primary')} ${ROUNDED.lg} p-3 sm:p-4 lg:p-5 ${ANIMATIONS.HOVER.lift}`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg`}></div>
            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 lg:gap-4">
                <div className={`p-2 sm:p-2.5 ${GLASS_EFFECTS.BACKGROUNDS.secondary} ${GLASS_EFFECTS.BORDERS.subtle} ${ROUNDED.lg} flex-shrink-0`}>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} truncate ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`}>{title}</p>
                    <p className={`${TYPOGRAPHY.COMBINATIONS.statNumber} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate ${LINE_HEIGHTS.tight}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
