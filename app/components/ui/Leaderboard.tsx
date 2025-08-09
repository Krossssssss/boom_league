import React from 'react';
import { LucideTrophy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LeaderboardProps } from '../../types';
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../../constants/typography';
import { GLASS_EFFECTS, ANIMATIONS, ROUNDED, createGlassCard, createInteractiveGlass } from '../../constants/designSystem';

const Leaderboard: React.FC<LeaderboardProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${createGlassCard('strong')} ${ROUNDED.xl} sm:${ROUNDED['2xl']} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className={`relative p-1.5 sm:p-2 ${GLASS_EFFECTS.BACKGROUNDS.card} bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 ${ROUNDED.lg} ${GLASS_EFFECTS.SHADOWS.orange}`}>
                        <LucideTrophy size={14} className="text-yellow-400 sm:w-4 sm:h-4" />
                    </div>
                    <h3 className={`${TYPOGRAPHY.COMBINATIONS.cardTitle} ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`}>Leaderboard</h3>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                    {players.map((p, index) => (
                        <div 
                            key={p.id} 
                            className={`group relative flex items-center justify-between p-3 sm:p-4 ${ROUNDED.lg} cursor-pointer ${createInteractiveGlass('primary')} ${ANIMATIONS.ACTIVE.press}`}
                            onClick={() => onPlayerClick && onPlayerClick(p)}
                        >
                            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                                <div className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${TYPOGRAPHY.COMBINATIONS.badge} border flex-shrink-0 ${LINE_HEIGHTS.tight} ${
                                    index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 
                                    index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}` : 
                                    index === 2 ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400' : 
                                    theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                }`}>
                                    {index + 1}
                                </div>
                                <span className="text-lg sm:text-xl flex-shrink-0">{p.avatar}</span>
                                <span className={`${TYPOGRAPHY.COMBINATIONS.emphasized} truncate ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'} ${LINE_HEIGHTS.tight}`}>{p.name}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className={`${TYPOGRAPHY.COMBINATIONS.statNumber} text-emerald-400 ${LINE_HEIGHTS.tight}`}>{p.score}</div>
                                <div className={`${TYPOGRAPHY.COMBINATIONS.statLabel} ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`}>VP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
