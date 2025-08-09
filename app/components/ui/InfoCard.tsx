import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { InfoCardProps } from '../../types';

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg p-3 sm:p-4 lg:p-5 transition-all duration-200 ${theme === 'dark' ? 'hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]' : 'hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]'}`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg`}></div>
            <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 lg:gap-4">
                <div className={`p-2 sm:p-2.5 backdrop-blur-sm border rounded-lg flex-shrink-0 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'}`}>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} truncate`}>{title}</p>
                    <p className={`font-semibold text-base sm:text-lg lg:text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
