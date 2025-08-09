import React from 'react';
import { LucideCheck, LucideDice6, LucideCalendar, LucideShield, LucideBomb, LucideSwords, LucideTrophy, LucideDices, LucideAlertTriangle, LucideSettings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LeagueState, Player } from '../../types';
import InfoCard from '../ui/InfoCard';

interface ScheduleConfirmationPageProps {
    leagueState: LeagueState;
    players: Player[];
    onConfirmSchedule: () => void;
    onRerollSchedule: () => void;
}

const ScheduleConfirmationPage: React.FC<ScheduleConfirmationPageProps> = ({
    leagueState,
    players,
    onConfirmSchedule,
    onRerollSchedule
}) => {
    const { theme } = useTheme();

    if (!leagueState || !leagueState.schedule || leagueState.schedule.length === 0) {
        return <div className="text-white">加载中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
                    <div className="relative p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                        <LucideCalendar className="text-orange-400" size={32} />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
                            theme === 'dark' 
                                ? 'bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent'
                                : 'bg-gradient-to-r from-gray-900 via-gray-800 to-orange-500 bg-clip-text text-transparent'
                        }`}>
                            确认赛程安排
                        </h1>
                        <p className={`text-base sm:text-lg font-medium mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                            {leagueState.league_name} - Season {leagueState.season_number}
                        </p>
                    </div>
                </div>
            </div>

            {/* Warning Banner */}
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center gap-3">
                    <LucideAlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
                    <div>
                        <p className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}`}>
                            请仔细检查赛程安排
                        </p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-700'}`}>
                            确认后联赛将正式开始。如果不满意当前安排，可以重新生成赛程。
                        </p>
                    </div>
                </div>
            </div>

            {/* League Info */}
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${
                theme === 'dark' 
                    ? 'bg-gray-800/60 border-gray-700' 
                    : 'bg-white/60 border-gray-200/50'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                        <LucideTrophy className="text-orange-400" size={20} />
                    </div>
                    <div>
                        <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                            联赛信息
                        </h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>参赛人数</p>
                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                            {players.length} 人
                        </p>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>总轮数</p>
                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                            {leagueState.schedule.length} 轮
                        </p>
                    </div>
                    <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'} col-span-2 sm:col-span-1`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>创建时间</p>
                        <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                            {leagueState.created_at && new Date(leagueState.created_at).toLocaleDateString('zh-CN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Special Rules Selection */}
            {leagueState.selected_special_rules && leagueState.selected_special_rules.length > 0 && (
                <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${
                    theme === 'dark' 
                        ? 'bg-gray-800/60 border-gray-700' 
                        : 'bg-white/60 border-gray-200/50'
                }`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                            <LucideSettings className="text-orange-400" size={20} />
                        </div>
                        <div>
                            <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                特殊规则设置
                            </h3>
                            <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                系统将从以下规则中随机选择
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {leagueState.selected_special_rules.map((rule, index) => (
                            <div 
                                key={index}
                                className={`p-3 rounded-lg border text-sm ${
                                    theme === 'dark'
                                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                        : 'bg-orange-50 border-orange-200 text-orange-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <LucideCheck size={14} className="text-orange-400 flex-shrink-0" />
                                    <span>{rule}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-3 text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                        共 {leagueState.selected_special_rules.length} 种可能的特殊规则
                    </div>
                </div>
            )}

            {/* Schedule Preview */}
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${
                theme === 'dark' 
                    ? 'bg-gray-800/60 border-gray-700' 
                    : 'bg-white/60 border-gray-200/50'
            }`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                            <LucideCalendar className="text-blue-400" size={20} />
                        </div>
                        <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                            赛程预览
                        </h3>
                    </div>
                    <button
                        onClick={onRerollSchedule}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
                    >
                        <LucideDice6 size={16} />
                        <span className="text-sm font-medium">重新生成</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {leagueState.schedule.map((round, index) => (
                        <div key={round.round} className={`p-4 rounded-lg border ${
                            theme === 'dark' 
                                ? 'bg-white/5 border-white/10' 
                                : 'bg-gray-100/50 border-gray-200'
                        }`}>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                    第 {round.round} 轮
                                </h4>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    theme === 'dark' 
                                        ? 'bg-blue-500/20 text-blue-400' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {round.vpMode.name}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                <InfoCard 
                                    icon={<LucideShield className="text-blue-400" />} 
                                    title="安全牌" 
                                    value={round.safeCards} 
                                />
                                <InfoCard 
                                    icon={<LucideBomb className="text-red-400" />} 
                                    title="炸弹牌" 
                                    value={round.bombCards} 
                                />
                                <InfoCard 
                                    icon={<LucideSwords className="text-yellow-400" />} 
                                    title="手牌上限" 
                                    value={round.handLimit === Infinity ? "无限制" : round.handLimit} 
                                />
                                <div className="sm:col-span-1 col-span-2">
                                    <InfoCard 
                                        icon={<LucideDices className="text-purple-400" />} 
                                        title="特殊规则" 
                                        value={round.specialRules.join(" + ")} 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onRerollSchedule}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 font-medium"
                >
                    <LucideDice6 size={20} />
                    重新生成赛程
                </button>
                <button
                    onClick={onConfirmSchedule}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all duration-200 shadow-lg"
                >
                    <LucideCheck size={20} />
                    确认并开始联赛
                </button>
            </div>
        </div>
    );
};

export default ScheduleConfirmationPage;
