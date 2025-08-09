import React from 'react';
import { LucideTrophy, LucideUsers } from 'lucide-react';
import { UTILS } from '../../utils/gameUtils';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerRankingsPageProps } from '../../types';

const PlayerRankingsPage: React.FC<PlayerRankingsPageProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    const sortedPlayers = [...players].sort((a, b) => {
        // Sort by championships first, then by current score
        if (b.championships !== a.championships) {
            return (b.championships || 0) - (a.championships || 0);
        }
        return b.score - a.score;
    });

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-orange-400 mb-2">玩家排行榜</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>查看所有玩家的详细统计和排名</p>
            </div>
            
            <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'}`}>
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <LucideTrophy className="text-yellow-400" />
                    总排行榜
                </h3>
                
                <div className="space-y-4">
                    {sortedPlayers.map((player, index) => {
                        const stats = UTILS.calculatePlayerStats(player);
                        return (
                            <div 
                                key={player.id}
                                className={`flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer transition-colors ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700/70 hover:bg-gray-600/70'
                                        : 'bg-white/70 hover:bg-gray-100/70'
                                }`}
                                onClick={() => onPlayerClick(player)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold text-2xl w-8 text-center ${
                                        index === 0 ? 'text-yellow-400' : 
                                        index === 1 ? 'text-gray-300' : 
                                        index === 2 ? 'text-orange-400' : 
                                        'text-gray-500'
                                    }`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-3xl">{player.avatar}</span>
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{player.name}</span>
                                        <div className={`flex gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <span>🏆 {stats.championships}冠</span>
                                            <span>🎮 {stats.totalGames}场</span>
                                            <span>📊 胜率{stats.winRate}%</span>
                                            <span>📈 平均排名{stats.averagePlacement}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-400">{player.score}</div>
                                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>当前分数</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {players.length === 0 && (
                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <LucideUsers size={48} className="mx-auto mb-4 opacity-50" />
                        <p>还没有注册的玩家</p>
                        <p className="text-sm">前往玩家注册页面添加玩家</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerRankingsPage;
