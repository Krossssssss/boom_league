import React, { useState } from 'react';
import { LucideTrophy, LucideUsers, LucideCrown, LucideMedal, LucideAward, LucideTarget, LucideDices, LucideZap, LucideGem, LucideBarChart3, LucidePercent } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerRankingsPageProps, Player } from '../../types';
import { getRankingSuffix, getRankingColorClass } from '../../utils/rankingUtils';

// Define ranking categories
type RankingCategory = {
    key: string;
    name: string;
    icon: React.ReactNode;
    getValue: (player: Player) => number;
    isDescending: boolean; // true for higher is better, false for lower is better
    unit: string;
    bgColor: string;
    textColor: string;
};

const PlayerRankingsPage: React.FC<PlayerRankingsPageProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState<string>('championships');

    // Define all ranking categories
    const categories: RankingCategory[] = [
        {
            key: 'championships',
            name: '联赛冠军',
            icon: <LucideCrown className="w-5 h-5" />,
            getValue: (p) => p.championships || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-yellow-500/10 border-yellow-500/20',
            textColor: 'text-yellow-400'
        },
        {
            key: 'runner_up',
            name: '联赛亚军',
            icon: <LucideMedal className="w-5 h-5" />,
            getValue: (p) => p.runner_up || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-gray-400/10 border-gray-400/20',
            textColor: 'text-gray-300'
        },
        {
            key: 'third_place',
            name: '联赛季军',
            icon: <LucideAward className="w-5 h-5" />,
            getValue: (p) => p.third_place || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-orange-500/10 border-orange-500/20',
            textColor: 'text-orange-400'
        },
        {
            key: 'single_round_firsts',
            name: '单轮冠军',
            icon: <LucideTarget className="w-5 h-5" />,
            getValue: (p) => p.single_round_firsts || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-blue-500/10 border-blue-500/20',
            textColor: 'text-blue-400'
        },
        {
            key: 'single_round_seconds',
            name: '单轮亚军',
            icon: <LucideDices className="w-5 h-5" />,
            getValue: (p) => p.single_round_seconds || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-cyan-500/10 border-cyan-500/20',
            textColor: 'text-cyan-400'
        },
        {
            key: 'single_round_thirds',
            name: '单轮季军',
            icon: <LucideZap className="w-5 h-5" />,
            getValue: (p) => p.single_round_thirds || 0,
            isDescending: true,
            unit: '次',
            bgColor: 'bg-purple-500/10 border-purple-500/20',
            textColor: 'text-purple-400'
        },
        {
            key: 'total_vp',
            name: '总VP',
            icon: <LucideGem className="w-5 h-5" />,
            getValue: (p) => p.total_vp || 0,
            isDescending: true,
            unit: 'VP',
            bgColor: 'bg-green-500/10 border-green-500/20',
            textColor: 'text-green-400'
        },
        {
            key: 'total_games',
            name: '总游戏数',
            icon: <LucideTrophy className="w-5 h-5" />,
            getValue: (p) => p.total_games || 0,
            isDescending: true,
            unit: '场',
            bgColor: 'bg-indigo-500/10 border-indigo-500/20',
            textColor: 'text-indigo-400'
        },
        {
            key: 'average_placement',
            name: '平均排名',
            icon: <LucideBarChart3 className="w-5 h-5" />,
            getValue: (p) => p.average_placement || 999,
            isDescending: false, // Lower is better for average placement
            unit: '',
            bgColor: 'bg-teal-500/10 border-teal-500/20',
            textColor: 'text-teal-400'
        },
        {
            key: 'win_rate',
            name: '胜率',
            icon: <LucidePercent className="w-5 h-5" />,
            getValue: (p) => p.win_rate || 0,
            isDescending: true,
            unit: '%',
            bgColor: 'bg-rose-500/10 border-rose-500/20',
            textColor: 'text-rose-400'
        }
    ];

    const currentCategory = categories.find(cat => cat.key === selectedCategory) || categories[0];

    // Sort players by selected category
    const sortedPlayers = [...players]
        .filter(player => currentCategory.getValue(player) > 0 || currentCategory.key === 'roundAveragePlacement') // Show all players for average placement
        .sort((a, b) => {
            const valueA = currentCategory.getValue(a);
            const valueB = currentCategory.getValue(b);
            return currentCategory.isDescending ? valueB - valueA : valueA - valueB;
        });

    // Get ranking for a specific category
    const getRankingForCategory = (player: Player, categoryKey: string): number => {
        if (!player.rankings) return 0;
        return (player.rankings as any)[categoryKey] || 0;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-orange-400 mb-2">玩家排行榜</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>按不同统计项目查看玩家排名</p>
            </div>
            
            {/* Category Selection */}
            <div className={`rounded-2xl p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    选择排名类别
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.key}
                            onClick={() => setSelectedCategory(category.key)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                                selectedCategory === category.key
                                    ? `${category.bgColor} ${category.textColor} border-current`
                                    : theme === 'dark'
                                        ? 'bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/50'
                                        : 'bg-gray-100/50 text-gray-600 border-gray-200/50 hover:bg-gray-200/50'
                            }`}
                        >
                            {category.icon}
                            <span className="hidden sm:inline">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Rankings Display */}
            <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'}`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${currentCategory.textColor}`}>
                    {currentCategory.icon}
                    {currentCategory.name}排行榜
                </h3>
                
                <div className="space-y-3">
                    {sortedPlayers.map((player, index) => {
                        const value = currentCategory.getValue(player);
                        const ranking = getRankingForCategory(player, currentCategory.key);
                        const displayValue = currentCategory.key === 'average_placement' 
                            ? (value === 999 ? '0.0' : value.toFixed(1))
                            : currentCategory.key === 'win_rate'
                                ? value.toFixed(0)
                                : value.toString();

                        return (
                            <div 
                                key={player.id}
                                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border ${
                                    index === 0 
                                        ? `${currentCategory.bgColor} border-current shadow-lg`
                                        : theme === 'dark' 
                                            ? 'bg-gray-700/50 border-gray-600/30 hover:bg-gray-600/50'
                                            : 'bg-white/70 border-gray-200/30 hover:bg-gray-100/70'
                                }`}
                                onClick={() => onPlayerClick(player)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank */}
                                    <div className="flex flex-col items-center">
                                        <span className={`font-bold text-xl w-8 text-center ${
                                            index === 0 ? 'text-yellow-400' : 
                                            index === 1 ? 'text-gray-300' : 
                                            index === 2 ? 'text-orange-400' : 
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            {index + 1}
                                        </span>
                                        {ranking > 0 && (
                                            <span className={`text-xs font-medium ${getRankingColorClass(ranking)}`}>
                                                #{getRankingSuffix(ranking)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Player Info */}
                                    <span className="text-2xl">{player.avatar}</span>
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {player.name}
                                        </span>
                                        <div className={`flex gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <span>🏆 {player.championships || 0}</span>
                                            <span>🎮 {player.total_games || 0}场</span>
                                            <span>⚡ {player.single_round_firsts || 0}单冠</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Value */}
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${
                                        index === 0 ? currentCategory.textColor : 
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {displayValue}{currentCategory.unit}
                                    </div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {currentCategory.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {sortedPlayers.length === 0 && (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <LucideUsers size={48} className="mx-auto mb-4 opacity-50" />
                        <p>该类别暂无数据</p>
                        <p className="text-sm">玩家需要参与游戏后才会有统计数据</p>
                    </div>
                )}
            </div>
            
            {players.length === 0 && (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <LucideUsers size={48} className="mx-auto mb-4 opacity-50" />
                    <p>还没有注册的玩家</p>
                    <p className="text-sm">前往玩家注册页面添加玩家</p>
                </div>
            )}
        </div>
    );
};

export default PlayerRankingsPage;
