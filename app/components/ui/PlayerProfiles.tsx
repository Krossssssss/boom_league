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
                            <div className="space-y-3">
                                {/* 当前分数 */}
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
                                    <span className="text-lg">⭐</span>
                                    <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        当前分数: {p.score || 0}
                                    </span>
                                </div>

                                {/* 联赛级别统计 */}
                                <div>
                                    <h4 className={`text-xs font-semibold mb-1.5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>联赛统计</h4>
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
                                        <StatWithRanking
                                            icon="🎮"
                                            value={p.total_games || 0}
                                            label="总联赛数"
                                            shortLabel="联赛"
                                            ranking={p.rankings?.total_games}
                                            bgClass="bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                        />
                                    </div>
                                </div>
                                
                                {/* 单轮级别统计 */}
                                <div>
                                    <h4 className={`text-xs font-semibold mb-1.5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>单轮统计</h4>
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
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                            theme === 'dark' 
                                                ? 'bg-white/5 border-white/10 text-white/70'
                                                : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                        }`}>
                                            <span>🔄</span>
                                            <span className="hidden sm:inline">
                                                总轮次: {(p.history || []).length}
                                            </span>
                                            <span className="sm:hidden">
                                                {(p.history || []).length}轮
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 综合表现统计 */}
                                <div>
                                    <h4 className={`text-xs font-semibold mb-1.5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>综合表现</h4>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        <StatWithRanking
                                            icon="💎"
                                            value={p.total_vp || 0}
                                            label="总VP"
                                            shortLabel="VP"
                                            ranking={p.rankings?.total_vp}
                                            bgClass="bg-green-500/10 border-green-500/20 text-green-400"
                                        />
                                        <StatWithRanking
                                            icon="📊"
                                            value={parseFloat((p.average_placement || 0).toFixed(1))}
                                            label="平均排名"
                                            shortLabel="平均"
                                            ranking={p.rankings?.average_placement}
                                            bgClass="bg-teal-500/10 border-teal-500/20 text-teal-400"
                                        />
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400`}>
                                            <span>🎪</span>
                                            <span className="hidden xs:inline">
                                                {(p.win_rate || 0).toFixed(0)}% 胜率
                                                {p.rankings?.win_rate && (
                                                    <span className={`ml-1 font-bold ${getRankingColorClass(p.rankings.win_rate)}`}>
                                                        #{getRankingSuffix(p.rankings.win_rate)}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="xs:hidden">
                                                {(p.win_rate || 0).toFixed(0)}%
                                                {p.rankings?.win_rate && (
                                                    <span className={`ml-0.5 font-bold ${getRankingColorClass(p.rankings.win_rate)}`}>
                                                        #{p.rankings.win_rate}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 时间信息 */}
                                {(p.created_at || p.updated_at) && (
                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} pt-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                                        {p.created_at && (
                                            <div>注册时间: {new Date(p.created_at).toLocaleDateString('zh-CN')}</div>
                                        )}
                                        {p.updated_at && (
                                            <div>最后更新: {new Date(p.updated_at).toLocaleDateString('zh-CN')}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerProfiles;
