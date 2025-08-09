import React from 'react';
import { LucideUsers } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerProfilesProps } from '../../types';

const PlayerProfiles: React.FC<PlayerProfilesProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg sm:rounded-xl ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <LucideUsers size={14} className="text-blue-400 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Player Profiles</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                    {players.map(p => (
                        <div 
                            key={p.id} 
                            className={`group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent active:scale-[0.98] ${
                                theme === 'dark' 
                                    ? 'hover:bg-white/5 hover:border-white/10 active:bg-white/10'
                                    : 'hover:bg-gray-100/50 hover:border-gray-200 active:bg-gray-200/50'
                            }`}
                            onClick={() => onPlayerClick && onPlayerClick(p)}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <span className="text-lg sm:text-xl flex-shrink-0">{p.avatar}</span>
                                <span className={`font-medium text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{p.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs font-medium text-yellow-400">
                                    <span>🏆</span>
                                    <span className="hidden xs:inline">{p.championships || 0} 冠军</span>
                                    <span className="xs:hidden">{p.championships || 0}</span>
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gray-400/10 border border-gray-400/20 rounded text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span>🥈</span>
                                    <span className="hidden xs:inline">{p.runnerUp || 0} 亚军</span>
                                    <span className="xs:hidden">{p.runnerUp || 0}</span>
                                </div>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-xs font-medium text-orange-400">
                                    <span>🥉</span>
                                    <span className="hidden xs:inline">{p.thirdPlace || 0} 季军</span>
                                    <span className="xs:hidden">{p.thirdPlace || 0}</span>
                                </div>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs font-medium text-green-400">
                                    <span>💎</span>
                                    <span className="hidden xs:inline">{p.totalVP || 0} 总VP</span>
                                    <span className="xs:hidden">{p.totalVP || 0}</span>
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                    theme === 'dark' 
                                        ? 'bg-white/5 border-white/10 text-white/70'
                                        : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                } border`}>
                                    <span className="hidden sm:inline">{p.history.length > 0 ? `${p.history.length} Games` : 'New Player'}</span>
                                    <span className="sm:hidden">{p.history.length > 0 ? `${p.history.length}G` : 'New'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerProfiles;
