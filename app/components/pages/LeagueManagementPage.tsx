import React, { useState } from 'react';
import { LucideCrown, LucideSettings, LucideCheck, LucideHistory, LucidePlay, LucideTrophy, LucideCalendar, LucideUsers } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GAME_RULES } from '../../constants/gameRules';
import type { LeagueManagementPageProps, LeagueHistory } from '../../types';

const LeagueManagementPage: React.FC<LeagueManagementPageProps> = ({ 
    leagueState, 
    players, 
    handleStartLeague, 
    handleResetLeague,
    currentLeagueName,
    setCurrentLeagueName,
    nextSeasonNumber,
    leagueHistory,
    setCurrentPage
}) => {
    const { theme } = useTheme();
    const [selectedSpecialRules, setSelectedSpecialRules] = useState<string[]>(GAME_RULES.SPECIAL_RULES.slice());
    const [viewMode, setViewMode] = useState<'ongoing' | 'history'>('ongoing');

    const toggleSpecialRule = (rule: string) => {
        setSelectedSpecialRules(prev => 
            prev.includes(rule) 
                ? prev.filter(r => r !== rule)
                : [...prev, rule]
        );
    };

    const handleStartLeagueWithRules = () => {
        if (selectedSpecialRules.length === 0) {
            alert('请至少选择一种特殊规则可能性！');
            return;
        }
        handleStartLeague(selectedSpecialRules);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} 天`;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>创建和管理你的 Boom League</p>
            </div>
            
            {/* Create New League Section - Only show when no league is active */}
            {(!leagueState || leagueState.status === 'setup') && (
                <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'} backdrop-blur-sm shadow-xl`}>
                    <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>创建新联赛</h3>
                    
                    {/* League Name Input */}
                    <div className="mb-6">
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>
                            联赛名称
                        </label>
                        <input
                            type="text"
                            value={currentLeagueName}
                            onChange={(e) => setCurrentLeagueName(e.target.value)}
                            placeholder={`Boom League S${nextSeasonNumber}`}
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm ${
                                theme === 'dark' 
                                    ? 'bg-white/5 text-white border-white/10'
                                    : 'bg-white/80 text-gray-900 border-gray-200'
                            }`}
                        />
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                            留空将使用默认名称: Boom League S{nextSeasonNumber}
                        </p>
                    </div>

                    {/* Special Rules Selection */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <LucideSettings className="text-orange-400" size={20} />
                            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>
                                特殊规则可能性选择
                            </label>
                        </div>
                        <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                            选择联赛中可能出现的特殊规则。系统将从选中的规则中随机选择。
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {GAME_RULES.SPECIAL_RULES.map((rule) => (
                                <button
                                    key={rule}
                                    onClick={() => toggleSpecialRule(rule)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                                        selectedSpecialRules.includes(rule)
                                            ? theme === 'dark'
                                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                                : 'bg-orange-100 border-orange-300 text-orange-700'
                                            : theme === 'dark'
                                                ? 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{rule}</span>
                                        {selectedSpecialRules.includes(rule) && (
                                            <LucideCheck size={16} className="text-orange-400" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                            已选择 {selectedSpecialRules.length} / {GAME_RULES.SPECIAL_RULES.length} 种可能性
                        </div>
                    </div>

                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        当前有 {players.length} 名玩家注册。需要至少 2 名玩家才能开始联赛。
                    </p>
                    <button 
                        onClick={handleStartLeagueWithRules} 
                        disabled={players.length < 2 || selectedSpecialRules.length === 0}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        开始联赛
                    </button>
                </div>
            )}

            {/* Current League Status */}
            {leagueState && leagueState.status !== 'setup' && (
                <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'} backdrop-blur-sm shadow-xl`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>当前联赛状态</h3>
                        {leagueState.status === 'in_progress' && (
                            <button
                                onClick={() => setCurrentPage('in_progress')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                            >
                                <LucidePlay size={16} />
                                进入联赛
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>联赛名称</p>
                            <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                {leagueState.league_name || '未命名联赛'}
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>状态</p>
                            <p className={`font-bold text-lg ${
                                leagueState.status === 'in_progress' ? 'text-green-400' :
                                leagueState.status === 'finished' ? 'text-yellow-400' :
                                leagueState.status === 'pending_confirmation' ? 'text-orange-400' : 'text-gray-400'
                            }`}>
                                {leagueState.status === 'in_progress' ? '进行中' :
                                 leagueState.status === 'finished' ? '已结束' :
                                 leagueState.status === 'pending_confirmation' ? '待确认' : '设置中'}
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>当前轮次</p>
                            <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                {leagueState.current_round} / {leagueState.schedule?.length || 5}
                            </p>
                        </div>
                    </div>

                    {leagueState.status === 'finished' && leagueState.winner && (
                        <div className={`mt-4 p-4 rounded-lg border-2 border-yellow-400 ${theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                            <div className="flex items-center gap-3">
                                <LucideCrown className="text-yellow-400" size={24} />
                                <div>
                                    <p className={`font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                                        🏆 {leagueState.winner.name}
                                    </p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-600'}`}>
                                        {leagueState.winner.reason}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleResetLeague} 
                                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                            >
                                开启新联赛
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Ongoing & Historical Leagues Section */}
            <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60 border border-gray-200/50'} backdrop-blur-sm shadow-xl`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>联赛记录</h3>
                    <div className="flex rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('ongoing')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                viewMode === 'ongoing'
                                    ? 'bg-orange-500 text-white'
                                    : theme === 'dark'
                                        ? 'bg-white/10 text-white/70 hover:bg-white/20'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            正在进行
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                viewMode === 'history'
                                    ? 'bg-orange-500 text-white'
                                    : theme === 'dark'
                                        ? 'bg-white/10 text-white/70 hover:bg-white/20'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            历史记录
                        </button>
                    </div>
                </div>

                {viewMode === 'ongoing' ? (
                    <div className="space-y-4">
                        {leagueState && leagueState.status !== 'setup' && leagueState.status !== 'finished' ? (
                            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {leagueState.league_name || '当前联赛'}
                                        </h4>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                            第 {leagueState.current_round} 轮 / 共 {leagueState.schedule?.length || 5} 轮
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            leagueState.status === 'in_progress' ? 'bg-green-500/20 text-green-400' :
                                            leagueState.status === 'pending_confirmation' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {leagueState.status === 'in_progress' ? '进行中' :
                                             leagueState.status === 'pending_confirmation' ? '待确认' : '未知'}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage('in_progress')}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition-colors"
                                        >
                                            查看
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-8 text-center ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                                <LucidePlay size={48} className="mx-auto mb-3 opacity-50" />
                                <p>暂无正在进行的联赛</p>
                                <p className="text-sm mt-1">创建新联赛开始游戏吧！</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leagueHistory.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {leagueHistory.map((league) => (
                                    <div key={league.id} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {league.league_name}
                                                </h4>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                                    Season {league.season_number}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                                                    {formatDate(league.end_date)}
                                                </p>
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
                                                    {formatDuration(league.start_date, league.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-2xl">{league.winner.avatar}</div>
                                            <div>
                                                <p className={`font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                    🏆 {league.winner.name}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <LucideUsers size={14} className={`mx-auto mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`} />
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                                    {league.total_players}人
                                                </p>
                                            </div>
                                            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <LucideCalendar size={14} className={`mx-auto mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`} />
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                                    {league.total_rounds}轮
                                                </p>
                                            </div>
                                            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                                <LucideTrophy size={14} className={`mx-auto mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`} />
                                                <p className={`text-xs ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                                    完成
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`p-8 text-center ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                                <LucideHistory size={48} className="mx-auto mb-3 opacity-50" />
                                <p>暂无历史联赛记录</p>
                                <p className="text-sm mt-1">完成首场联赛后，记录将显示在这里</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeagueManagementPage;
