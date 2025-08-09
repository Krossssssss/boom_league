import React from 'react';
import { LucideTrophy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LeaderboardProps } from '../../types';

const Leaderboard: React.FC<LeaderboardProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg sm:rounded-xl ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                        <LucideTrophy size={14} className="text-yellow-400 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Leaderboard</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                    {players.map((p, index) => (
                        <div 
                            key={p.id} 
                            className={`group relative flex items-center justify-between p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${
                                theme === 'dark' 
                                    ? 'hover:bg-white/5 hover:border-white/10 active:bg-white/10'
                                    : 'hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50'
                            }`}
                            onClick={() => onPlayerClick && onPlayerClick(p)}
                        >
                            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                                <div className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm border flex-shrink-0 ${
                                    index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 
                                    index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}` : 
                                    index === 2 ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400' : 
                                    theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                }`}>
                                    {index + 1}
                                </div>
                                <span className="text-lg sm:text-xl flex-shrink-0">{p.avatar}</span>
                                <span className={`font-medium text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{p.name}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="font-semibold text-base sm:text-lg text-emerald-400">{p.score}</div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} font-medium`}>VP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
