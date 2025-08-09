import React from 'react';
import { LucideCat, LucideCrown } from 'lucide-react';
import Leaderboard from '../ui/Leaderboard';
import PlayerProfiles from '../ui/PlayerProfiles';
import { useTheme } from '../../contexts/ThemeContext';
import { GAME_RULES } from '../../constants/gameRules';
import type { HomePageProps } from '../../types';

const HomePage: React.FC<HomePageProps> = ({ 
    leagueState, 
    players, 
    handleStartLeague, 
    handleResetLeague, 
    handlePlayerClick,
    setCurrentPage
}) => {
    const { theme } = useTheme();
    
    if (!leagueState || leagueState.status === 'setup') {
        return (
            <div className="space-y-6 sm:space-y-8">
                <div className="text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                            <LucideCat className="text-orange-400" size={32} />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
                                theme === 'dark' 
                                    ? 'bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent'
                            }`}>
                                Boom League
                            </h1>
                            <p className={`text-base sm:text-lg font-medium mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>Professional Tournament Management</p>
                        </div>
                    </div>
                </div>
                
                {players.length > 0 && (
                    <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'}`}>
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg sm:rounded-xl`}></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>Quick Start</h2>
                            </div>
                            <p className={`text-base sm:text-lg mb-6 sm:mb-8 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                                <span className="text-orange-400 font-semibold">{players.length}</span> players registered and ready to compete
                            </p>
                            <button 
                                onClick={() => setCurrentPage('league')} 
                                disabled={players.length < 2}
                                className={`relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 active:from-orange-500/40 active:to-orange-600/40 text-orange-400 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] active:scale-[0.98] text-sm sm:text-base ${
                                    players.length < 2 
                                        ? 'disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100'
                                        : ''
                                }`}
                            >
                                <span className="relative z-10">Start New Tournament</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    if (leagueState.status === 'in_progress') {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-2">
                        {leagueState.league_name || '联赛进行中'}
                    </h2>
                    <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        第 {leagueState.current_round} / {GAME_RULES.MAX_ROUNDS} 轮
                        {leagueState.season_number && (
                            <span className="ml-2">• Season {leagueState.season_number}</span>
                        )}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Leaderboard players={players} onPlayerClick={handlePlayerClick} />
                    <PlayerProfiles players={players} onPlayerClick={handlePlayerClick} />
                </div>
            </div>
        );
    }
    
    if (leagueState.status === 'finished') {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className={`text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/80'}`}>
                    <LucideCrown className="text-yellow-400" size={60} />
                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300">
                            {leagueState.league_name || '联赛结束！'}
                        </h2>
                        {leagueState.season_number && (
                            <p className={`text-lg sm:text-xl mt-2 ${theme === 'dark' ? 'text-yellow-400/80' : 'text-yellow-600'}`}>
                                Season {leagueState.season_number} 完成
                            </p>
                        )}
                    </div>
                    {leagueState.winner && (
                        <>
                            <div className="text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4">{leagueState.winner.avatar}</div>
                            <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{leagueState.winner.name}</p>
                            <p className={`text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{leagueState.winner.reason}</p>
                        </>
                    )}
                    <button 
                        onClick={handleResetLeague} 
                        className="mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base"
                    >
                        开启新联赛
                    </button>
                </div>
            </div>
        );
    }
    
    return null;
};

export default HomePage;
