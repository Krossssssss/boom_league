import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { InfoCardProps } from '../../types';
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../../constants/typography';

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 transition-all duration-200 ${theme === 'dark' ? 'hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]' : 'hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]'} min-h-touch`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-xl sm:rounded-2xl`}></div>
            <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5">
                <div className={`p-3 sm:p-3.5 md:p-4 backdrop-blur-sm border rounded-xl flex-shrink-0 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'}`}>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} truncate ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide} text-sm sm:text-base md:text-lg`}>{title}</p>
                    <p className={`${TYPOGRAPHY.COMBINATIONS.statNumber} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate ${LINE_HEIGHTS.tight} text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
