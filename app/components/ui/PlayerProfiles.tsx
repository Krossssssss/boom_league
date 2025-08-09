import React from 'react';
import { LucideUsers } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerProfilesProps } from '../../types';
import { getRankingSuffix, getRankingColorClass, getRankingBgClass } from '../../utils/rankingUtils';

const PlayerProfiles: React.FC<PlayerProfilesProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    // Helper component to display statistic with ranking
    const StatWithRanking: React.FC<{
        icon: string;
        value: number;
        label: string;
        shortLabel: string;
        ranking?: number;
        bgClass?: string;
    }> = ({ icon, value, label, shortLabel, ranking, bgClass }) => (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
            bgClass || (theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-100/50 border-gray-200 text-gray-600')
        }`}>
            <span>{icon}</span>
            <span className="hidden xs:inline">
                {value} {label}
                {ranking && (
                    <span className={`ml-1 font-bold ${getRankingColorClass(ranking)}`}>
                        #{getRankingSuffix(ranking)}
                    </span>
                )}
            </span>
            <span className="xs:hidden">
                {value}
                {ranking && (
                    <span className={`ml-0.5 font-bold ${getRankingColorClass(ranking)}`}>
                        #{ranking}
                    </span>
                )}
            </span>
        </div>
    );
    
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
                            <div className="space-y-2">
                                {/* 联赛级别统计 */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    <StatWithRanking
                                        icon="🏆"
                                        value={p.championships || 0}
                                        label="联赛冠军"
                                        shortLabel="冠军"
                                        ranking={p.rankings?.championships}
                                        bgClass="bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    />
                                    <StatWithRanking
                                        icon="🥈"
                                        value={p.runner_up || 0}
                                        label="联赛亚军"
                                        shortLabel="亚军"
                                        ranking={p.rankings?.runner_up}
                                        bgClass={`bg-gray-400/10 border-gray-400/20 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                    />
                                    <StatWithRanking
                                        icon="🥉"
                                        value={p.third_place || 0}
                                        label="联赛季军"
                                        shortLabel="季军"
                                        ranking={p.rankings?.third_place}
                                        bgClass="bg-orange-500/10 border-orange-500/20 text-orange-400"
                                    />
                                </div>
                                
                                {/* 单轮级别统计 */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    <StatWithRanking
                                        icon="🎯"
                                        value={p.single_round_firsts || 0}
                                        label="单轮冠军"
                                        shortLabel="单冠"
                                        ranking={p.rankings?.single_round_firsts}
                                        bgClass="bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    />
                                    <StatWithRanking
                                        icon="🎲"
                                        value={p.single_round_seconds || 0}
                                        label="单轮亚军"
                                        shortLabel="单亚"
                                        ranking={p.rankings?.single_round_seconds}
                                        bgClass="bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                    />
                                    <StatWithRanking
                                        icon="⚡"
                                        value={p.single_round_thirds || 0}
                                        label="单轮季军"
                                        shortLabel="单季"
                                        ranking={p.rankings?.single_round_thirds}
                                        bgClass="bg-purple-500/10 border-purple-500/20 text-purple-400"
                                    />
                                </div>
                                
                                {/* 分数和游戏统计 */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    <StatWithRanking
                                        icon="💎"
                                        value={p.total_vp || 0}
                                        label="总VP"
                                        shortLabel="VP"
                                        ranking={p.rankings?.total_vp}
                                        bgClass="bg-green-500/10 border-green-500/20 text-green-400"
                                    />
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                        theme === 'dark' 
                                            ? 'bg-white/5 border-white/10 text-white/70'
                                            : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                    }`}>
                                        <span className="hidden sm:inline">
                                            {p.total_games || 0} 联赛 / {p.totalRounds || 0} 轮次
                                            {p.rankings?.total_games && (
                                                <span className={`ml-1 font-bold ${getRankingColorClass(p.rankings.total_games)}`}>
                                                    #{getRankingSuffix(p.rankings.total_games)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="sm:hidden">
                                            {p.total_games || 0}L/{p.totalRounds || 0}R
                                            {p.rankings?.total_games && (
                                                <span className={`ml-0.5 font-bold ${getRankingColorClass(p.rankings.total_games)}`}>
                                                    #{p.rankings.total_games}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                        theme === 'dark' 
                                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                            : 'bg-indigo-100/50 border-indigo-200 text-indigo-600'
                                    }`}>
                                        <span>📊</span>
                                        <span className="hidden sm:inline">
                                            平均: {p.average_placement?.toFixed(1) || '0.0'}
                                            {p.rankings?.average_placement && (
                                                <span className={`ml-1 font-bold ${getRankingColorClass(p.rankings.average_placement)}`}>
                                                    #{getRankingSuffix(p.rankings.average_placement)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="sm:hidden">
                                            {p.average_placement?.toFixed(1) || '0.0'}
                                            {p.rankings?.average_placement && (
                                                <span className={`ml-0.5 font-bold ${getRankingColorClass(p.rankings.average_placement)}`}>
                                                    #{p.rankings.average_placement}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                        theme === 'dark' 
                                            ? 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                                            : 'bg-pink-100/50 border-pink-200 text-pink-600'
                                    }`}>
                                        <span>🎪</span>
                                        <span className="hidden sm:inline">
                                            胜率: {p.win_rate?.toFixed(0) || '0'}%
                                            {p.rankings?.win_rate && (
                                                <span className={`ml-1 font-bold ${getRankingColorClass(p.rankings.win_rate)}`}>
                                                    #{getRankingSuffix(p.rankings.win_rate)}
                                                </span>
                                            )}
                                        </span>
                                        <span className="sm:hidden">
                                            {p.win_rate?.toFixed(0) || '0'}%
                                            {p.rankings?.win_rate && (
                                                <span className={`ml-0.5 font-bold ${getRankingColorClass(p.rankings.win_rate)}`}>
                                                    #{p.rankings.win_rate}
                                                </span>
                                            )}
                                        </span>
                                    </div>
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
