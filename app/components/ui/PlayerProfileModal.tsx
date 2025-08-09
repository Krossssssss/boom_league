import React from 'react';
import Modal from './Modal';
import { UTILS } from '../../utils/gameUtils';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerProfileModalProps } from '../../types';

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, onClose }) => {
    const { theme } = useTheme();
    
    if (!player) return null;
    
    const stats = UTILS.calculatePlayerStats(player);
    
    return (
        <Modal onClose={onClose} title={`${player.avatar} ${player.name} 的档案`}>
            <div className="space-y-6">
                {/* Basic Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-yellow-400">{player.championships || 0}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>🏆 冠军次数</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{player.runnerUp || 0}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>🥈 亚军次数</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-orange-400">{player.thirdPlace || 0}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>🥉 季军次数</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-emerald-400">{player.score}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>当前分数</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-green-400">{stats.totalVP}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>💎 总VP获得</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-blue-400">{stats.totalGames}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>总游戏数</p>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border p-4 rounded-lg text-center`}>
                        <p className="text-2xl font-bold text-purple-400">{stats.averagePlacement}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>平均排名</p>
                    </div>
                </div>

                {/* Win Rate */}
                <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} p-4 rounded-lg`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>胜率</span>
                        <span className="text-orange-400 font-bold">{stats.winRate}%</span>
                    </div>
                    <div className={`w-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-2`}>
                        <div 
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${stats.winRate}%`}}
                        ></div>
                    </div>
                </div>

                {/* Placement Distribution */}
                {stats.totalGames > 0 && (
                    <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'} p-4 rounded-lg`}>
                        <h4 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold mb-3`}>排名分布</h4>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map(place => {
                                const count = stats.placements[place] || 0;
                                const percentage = stats.totalGames > 0 ? (count / stats.totalGames * 100).toFixed(1) : 0;
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
