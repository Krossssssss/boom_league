import React from 'react';
import { LucideScrollText, LucideShield, LucideBomb, LucideSwords } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { ScheduleTimelineProps } from '../../types';

const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ schedule, currentRound }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <LucideScrollText size={16} className="text-indigo-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Tournament Schedule</h3>
                </div>
                <div className="space-y-2">
                    {schedule.map(roundInfo => {
                        const isActive = roundInfo.round === currentRound;
                        return (
                            <div key={roundInfo.round} className={`relative p-4 rounded-lg transition-all duration-300 border ${
                                isActive 
                                    ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]' 
                                    : theme === 'dark'
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                        : 'bg-gray-100/50 border-gray-200 hover:bg-gray-200/50'
                            }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className={`font-semibold text-base ${isActive ? 'text-orange-400' : theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                        Round {roundInfo.round}
                                    </p>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                                    )}
                                </div>
                                
                                {/* Game Parameters Overview */}
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${
                                        theme === 'dark' 
                                            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                            : 'bg-blue-100/80 border border-blue-200 text-blue-600'
                                    }`}>
                                        <LucideShield size={12} />
                                        <span className="hidden sm:inline">安全牌</span>
                                        <span className="font-bold">{roundInfo.safeCards}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${
                                        theme === 'dark' 
                                            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                            : 'bg-red-100/80 border border-red-200 text-red-600'
                                    }`}>
                                        <LucideBomb size={12} />
                                        <span className="hidden sm:inline">炸弹牌</span>
                                        <span className="font-bold">{roundInfo.bombCards}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium ${
                                        theme === 'dark' 
                                            ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                                            : 'bg-yellow-100/80 border border-yellow-200 text-yellow-600'
                                    }`}>
                                        <LucideSwords size={12} />
                                        <span className="hidden sm:inline">手牌</span>
                                        <span className="font-bold">{roundInfo.handLimit === Infinity ? '∞' : roundInfo.handLimit}</span>
                                    </div>
                                </div>
                                
                                {/* VP Mode and Special Rule */}
                                <div className="space-y-1">
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'}`}>
                                        🏆 {roundInfo.vpMode.name}
                                    </p>
                                    <p className={`text-xs font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                        🎯 {roundInfo.specialRule}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ScheduleTimeline;
