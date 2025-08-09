import React, { useMemo } from 'react';
import Modal from './Modal';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerProfileModalProps, Player } from '../../types';
import { getRankingSuffix, getRankingColorClass } from '../../utils/rankingUtils';

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, onClose }) => {
    const { theme } = useTheme();
    
    if (!player) return null;

    // Compute placement distribution from history (client-side view only)
    const { totalRounds, placementCounts } = useMemo(() => {
        const history = Array.isArray(player.history) ? player.history : [];
        const counts: Record<number, number> = {};
        for (const h of history) {
            if (!h || typeof h.placement !== 'number') continue;
            counts[h.placement] = (counts[h.placement] || 0) + 1;
        }
        return { totalRounds: history.length, placementCounts: counts };
    }, [player.history]);

    // Small helper to render a stat with ranking badge
    const StatWithRanking: React.FC<{ icon: string; label: string; value: string | number; ranking?: number; className?: string; }>
        = ({ icon, label, value, ranking, className }) => (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${className || ''}`}>
            <span>{icon}</span>
            <span className="hidden sm:inline">{value} {label}</span>
            <span className="sm:hidden">{value}</span>
            {!!ranking && (
                <span className={`ml-1 font-bold ${getRankingColorClass(ranking)}`}>#{getRankingSuffix(ranking)}</span>
            )}
        </div>
    );
    
    return (
        <Modal onClose={onClose} title={`${player.avatar} ${player.name} 的档案`}>
            <div className="space-y-6">
                {/* Header: current score */}
                <div className={`flex items-center justify-between p-4 rounded-lg border ${theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}>⭐ 当前分数</div>
                    <div className="text-2xl font-bold text-emerald-400">{player.score || 0}</div>
                </div>

                {/* League stats */}
                <div className="space-y-2">
                    <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>联赛统计</div>
                    <div className="flex flex-wrap gap-1.5">
                        <StatWithRanking
                            icon="🏆"
                            label="联赛冠军"
                            value={player.championships || 0}
                            ranking={player.rankings?.championships}
                            className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        />
                        <StatWithRanking
                            icon="🥈"
                            label="联赛亚军"
                            value={player.runner_up || 0}
                            ranking={player.rankings?.runner_up}
                            className={`bg-gray-400/10 border-gray-400/20 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                        />
                        <StatWithRanking
                            icon="🥉"
                            label="联赛季军"
                            value={player.third_place || 0}
                            ranking={player.rankings?.third_place}
                            className="bg-orange-500/10 border-orange-500/20 text-orange-400"
                        />
                        <StatWithRanking
                            icon="🎮"
                            label="总联赛数"
                            value={player.total_games || 0}
                            ranking={player.rankings?.total_games}
                            className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                        />
                    </div>
                </div>

                {/* Round stats */}
                <div className="space-y-2">
                    <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>单轮统计</div>
                    <div className="flex flex-wrap gap-1.5">
                        <StatWithRanking
                            icon="🎯"
                            label="单轮冠军"
                            value={player.single_round_firsts || 0}
                            ranking={player.rankings?.single_round_firsts}
                            className="bg-blue-500/10 border-blue-500/20 text-blue-400"
                        />
                        <StatWithRanking
                            icon="🎲"
                            label="单轮亚军"
                            value={player.single_round_seconds || 0}
                            ranking={player.rankings?.single_round_seconds}
                            className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                        />
                        <StatWithRanking
                            icon="⚡"
                            label="单轮季军"
                            value={player.single_round_thirds || 0}
                            ranking={player.rankings?.single_round_thirds}
                            className="bg-purple-500/10 border-purple-500/20 text-purple-400"
                        />
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-100/50 border-gray-200 text-gray-600'}`}>
                            <span>🔄</span>
                            <span className="hidden sm:inline">总轮次: {totalRounds}</span>
                            <span className="sm:hidden">{totalRounds}轮</span>
                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="space-y-2">
                    <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>综合表现</div>
                    <div className="flex flex-wrap gap-1.5">
                        <StatWithRanking
                            icon="💎"
                            label="总VP"
                            value={player.total_vp || 0}
                            ranking={player.rankings?.total_vp}
                            className="bg-green-500/10 border-green-500/20 text-green-400"
                        />
                        <StatWithRanking
                            icon="📊"
                            label="平均排名"
                            value={Number((player.average_placement || 0).toFixed(1))}
                            ranking={player.rankings?.average_placement}
                            className="bg-teal-500/10 border-teal-500/20 text-teal-400"
                        />
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border bg-rose-500/10 border-rose-500/20 text-rose-400`}>
                            <span>🎪</span>
                            <span className="hidden sm:inline">{(player.win_rate || 0).toFixed(0)}% 胜率</span>
                            <span className="sm:hidden">{(player.win_rate || 0).toFixed(0)}%</span>
                            {!!player.rankings?.win_rate && (
                                <span className={`ml-1 font-bold ${getRankingColorClass(player.rankings.win_rate)}`}>
                                    #{getRankingSuffix(player.rankings.win_rate)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Win Rate Bar */}
                <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} p-4 rounded-lg`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>胜率</span>
                        <span className="text-orange-400 font-bold">{(player.win_rate || 0).toFixed(0)}%</span>
                    </div>
                    <div className={`w-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-2`}>
                        <div 
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${Math.max(0, Math.min(100, Number((player.win_rate || 0).toFixed(0))))}%`}}
                        ></div>
                    </div>
                </div>

                {/* Placement Distribution */}
                {totalRounds > 0 && (
                    <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} p-4 rounded-lg`}>
                        <h4 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-3`}>排名分布</h4>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map(place => {
                                const count = placementCounts[place] || 0;
                                const percentage = totalRounds > 0 ? (count / totalRounds * 100).toFixed(1) : 0;
                                return count > 0 ? (
                                    <div key={place} className="flex justify-between items-center">
                                        <span className={`text-sm ${place === 1 ? 'text-yellow-400' : place === 2 ? 'text-gray-300' : place === 3 ? 'text-orange-400' : 'text-gray-500'}`}>
                                            第{place}名
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>{count}次</span>
                                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>({percentage}%)</span>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Games */}
                {player.history && player.history.length > 0 && (
                    <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} p-4 rounded-lg`}>
                        <h4 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-3`}>最近比赛</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {player.history.slice(-5).reverse().map((game, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>第{game.round}轮</span>
                                    <span className={`font-semibold ${game.placement === 1 ? 'text-yellow-400' : game.placement === 2 ? 'text-gray-300' : game.placement === 3 ? 'text-orange-400' : 'text-gray-500'}`}>
                                        第{game.placement}名
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PlayerProfileModal;
