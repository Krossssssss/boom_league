import React from 'react';
import { LucideCrown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LeagueManagementPageProps } from '../../types';

const LeagueManagementPage: React.FC<LeagueManagementPageProps> = ({ 
    leagueState, 
    players, 
    handleStartLeague, 
    handleResetLeague, 
    renderInProgress, 
    setShowResultsModal 
}) => {
    const { theme } = useTheme();
    
    if (!leagueState || leagueState.status === 'setup') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>创建和管理你的 Boom League</p>
                </div>
                
                <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'}`}>
                    <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>创建新联赛</h3>
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        当前有 {players.length} 名玩家注册。需要至少 2 名玩家才能开始联赛。
                    </p>
                    <button 
                        onClick={handleStartLeague} 
                        disabled={players.length < 2}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        开始联赛
                    </button>
                </div>
            </div>
        );
    }
    
    if (leagueState.status === 'in_progress') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>当前联赛进行中</p>
                </div>
                {renderInProgress()}
            </div>
        );
    }
    
    if (leagueState.status === 'finished') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>联赛已结束</p>
                </div>
                
                <div className={`text-center p-10 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400 ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/80'}`}>
                    <LucideCrown className="text-yellow-400" size={80} />
                    <h2 className="text-3xl font-bold text-yellow-300">联赛结束！</h2>
                    {leagueState.winner && (
                        <>
                            <div className="text-4xl mt-4">{leagueState.winner.avatar}</div>
                            <p className={`text-2xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{leagueState.winner.name}</p>
                            <p className={`text-lg mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{leagueState.winner.reason}</p>
                        </>
                    )}
                    <button 
                        onClick={handleResetLeague} 
                        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        开启新联赛
                    </button>
                </div>
            </div>
        );
    }
    
    return null;
};

export default LeagueManagementPage;
