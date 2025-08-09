import React from 'react';
import { LucideHistory, LucideTrophy, LucideCrown, LucideCalendar, LucideUsers, LucideTarget } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LeagueHistory } from '../../types';

interface LeagueHistoryPageProps {
    leagueHistory: LeagueHistory[];
}

const LeagueHistoryPage: React.FC<LeagueHistoryPageProps> = ({ leagueHistory }) => {
    const { theme } = useTheme();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1 ? '1 天' : `${diffDays} 天`;
    };

    if (leagueHistory.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className="inline-flex items-center gap-4 mb-6">
                        <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]">
                            <LucideHistory className="text-purple-400" size={32} />
                        </div>
                        <div className="text-left">
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
                                theme === 'dark' 
                                    ? 'bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent'
                                    : 'bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent'
                            }`}>
                                联赛历史
                            </h1>
                            <p className={`text-base sm:text-lg font-medium mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>League History</p>
                        </div>
                    </div>
                </div>

                <div className={`text-center p-10 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg shadow-lg`}>
                    <LucideHistory className={`mx-auto mb-4 ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`} size={64} />
                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>暂无历史记录</h3>
                    <p className={`${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>完成第一个联赛后，历史记录将在这里显示</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                    <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-[0_0_40px_rgba(147,51,234,0.3)]">
                        <LucideHistory className="text-purple-400" size={32} />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
                            theme === 'dark' 
                                ? 'bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-gray-900 via-gray-800 to-purple-500 bg-clip-text text-transparent'
                        }`}>
                            联赛历史
                        </h1>
                        <p className={`text-base sm:text-lg font-medium mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                            {leagueHistory.length} 个已完成的联赛
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {leagueHistory.map((league, index) => (
                    <div key={league.id} className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg sm:rounded-xl shadow-lg overflow-hidden`}>
                        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg sm:rounded-xl`}></div>
                        
                        <div className="relative z-10 p-4 sm:p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' : theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                                        <LucideTrophy className={index === 0 ? 'text-yellow-400' : theme === 'dark' ? 'text-white/70' : 'text-gray-600'} size={16} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                            {league.league_name}
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                            Season {league.season_number}
                                        </p>
                                    </div>
                                </div>
                                {index === 0 && (
                                    <div className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded text-xs font-medium text-yellow-400">
                                        最新
                                    </div>
                                )}
                            </div>

                            {/* Winner */}
                            <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                                <div className="flex items-center gap-3">
                                    <LucideCrown className="text-yellow-400" size={20} />
                                    <div>
                                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>冠军</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{league.winner.avatar}</span>
                                            <span className={`font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                                {league.winner.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <LucideUsers size={14} className={theme === 'dark' ? 'text-white/60' : 'text-gray-500'} />
                                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>参赛人数</span>
                                    </div>
                                    <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                        {league.total_players}
                                    </span>
                                </div>
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <LucideTarget size={14} className={theme === 'dark' ? 'text-white/60' : 'text-gray-500'} />
                                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>总轮数</span>
                                    </div>
                                    <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                        {league.total_rounds}
                                    </span>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <LucideCalendar size={14} className={theme === 'dark' ? 'text-white/60' : 'text-gray-500'} />
                                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>时间信息</span>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>创建：</span>
                                        <span className={`ml-1 ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                            {formatDate(league.created_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>比赛：</span>
                                        <span className={`ml-1 ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                            {formatDate(league.start_date)} - {formatDate(league.end_date)}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                        持续 {formatDuration(league.start_date, league.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeagueHistoryPage;
