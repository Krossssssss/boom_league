import React from 'react';
import { LucidePlus, LucideTrash2 } from 'lucide-react';
import { UTILS } from '../../utils/gameUtils';
import { useTheme } from '../../contexts/ThemeContext';
import type { PlayerRegistrationPageProps } from '../../types';

const PlayerRegistrationPage: React.FC<PlayerRegistrationPageProps> = ({ 
    players, 
    handleAddPlayer, 
    handleDeletePlayer, 
    handlePlayerClick, 
    newPlayerName, 
    setNewPlayerName, 
    selectedAvatar, 
    setSelectedAvatar, 
    showPlayerModal, 
    setShowPlayerModal 
}) => {
    const { theme } = useTheme();
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-4xl font-bold mb-3 ${
                    theme === 'dark' 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent'
                        : 'bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent'
                }`}>
                    玩家注册
                </h2>
                <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>管理参与联赛的玩家</p>
            </div>
            
            <div className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl ${
                theme === 'dark' 
                    ? 'bg-slate-800/40 border-slate-700/30'
                    : 'bg-white/60 border-gray-200/50'
            }`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-2xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                        已注册玩家 
                        <span className="text-orange-400">({players.length})</span>
                    </h3>
                    <button 
                        onClick={() => setShowPlayerModal(true)} 
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
                    >
                        <LucidePlus size={18} /> 添加玩家
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {players.map(p => {
                        const stats = UTILS.calculatePlayerStats(p);
                        return (
                            <div key={p.id} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg ${
                                theme === 'dark' 
                                    ? 'bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/30'
                                    : 'bg-white/50 hover:bg-gray-100/60 border-gray-200/30'
                            }`}>
                                <div 
                                    className="flex items-center gap-4 flex-1"
                                    onClick={() => handlePlayerClick(p)}
                                >
                                    <div className="text-4xl">{p.avatar}</div>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{p.name}</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {stats.championships > 0 && (
                                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                                    🏆 {stats.championships}冠
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                theme === 'dark' 
                                                    ? 'bg-slate-700/50 text-slate-300'
                                                    : 'bg-gray-200/50 text-gray-600'
                                            }`}>
                                                {stats.totalGames > 0 ? `${stats.totalGames}场 • ${stats.winRate}%胜率` : '新玩家'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlayer(p.id);
                                    }} 
                                    className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
                                >
                                    <LucideTrash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlayerRegistrationPage;
