import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Player } from '../../types';
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../../constants/typography';

interface CardDrawReminderProps {
    players: Player[];
    onClose: () => void;
    round: number;
}

const CardDrawReminder: React.FC<CardDrawReminderProps> = ({ players, onClose, round }) => {
    const { theme } = useTheme();

    // Card drawing rules based on ranking
    const getCardCount = (ranking: number): number => {
        const cardCounts = [2, 3, 4, 5, 6]; // 1st: 2 cards, 2nd: 3 cards, etc.
        return cardCounts[ranking - 1] || 6; // Default to 6 for rankings beyond 5th
    };

    // Sort players by their current score (descending)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl border backdrop-blur-xl ${
                theme === 'dark' 
                    ? 'bg-gray-900/90 border-gray-700' 
                    : 'bg-white/90 border-gray-200'
            }`}>
                {/* Header */}
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                            theme === 'dark' 
                                ? 'bg-orange-500/20 border border-orange-500/30' 
                                : 'bg-orange-100 border border-orange-200'
                        }`}>
                            <span className="text-orange-500 text-lg">🃏</span>
                        </div>
                        <div>
                            <h2 className={`${TYPOGRAPHY.COMBINATIONS.modalTitle} ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            } ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`}>
                                第 {round} 轮抽卡提醒
                            </h2>
                            <p className={`${TYPOGRAPHY.COMBINATIONS.modalBody} ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            } ${LINE_HEIGHTS.normal}`}>
                                请根据本轮排名抽取相应数量的卡片
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Draw Instructions */}
                <div className="p-6">
                    <div className="space-y-3">
                        {sortedPlayers.map((player, index) => {
                            const ranking = index + 1;
                            const cardCount = getCardCount(ranking);
                            
                            return (
                                <div 
                                    key={player.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                                        theme === 'dark'
                                            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Ranking Badge */}
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                            ranking === 1 
                                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                                : ranking === 2
                                                ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                                                : ranking === 3
                                                ? 'bg-orange-600/20 text-orange-600 border border-orange-600/30'
                                                : theme === 'dark'
                                                ? 'bg-gray-600/20 text-gray-300 border border-gray-600/30'
                                                : 'bg-gray-300/50 text-gray-600 border border-gray-300'
                                        }`}>
                                            {ranking}
                                        </div>
                                        
                                        {/* Player Info */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{player.avatar}</span>
                                            <span className={`font-semibold ${
                                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {player.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Count */}
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            抽取
                                        </span>
                                        <div className={`px-3 py-1.5 rounded-lg font-bold text-lg ${
                                            theme === 'dark'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'bg-blue-100 text-blue-600 border border-blue-200'
                                        }`}>
                                            {cardCount} 张
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Rules Summary */}
                    <div className={`mt-6 p-4 rounded-lg ${
                        theme === 'dark' 
                            ? 'bg-gray-800/30 border border-gray-700' 
                            : 'bg-gray-100/50 border border-gray-200'
                    }`}>
                        <h3 className={`text-sm font-semibold mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            📋 抽卡规则
                        </h3>
                        <div className={`text-xs space-y-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            <p>• 第 1 名：2 张卡片</p>
                            <p>• 第 2 名：3 张卡片</p>
                            <p>• 第 3 名：4 张卡片</p>
                            <p>• 第 4 名：5 张卡片</p>
                            <p>• 第 5 名及以后：6 张卡片</p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`w-full mt-6 py-3 px-4 rounded-lg ${TYPOGRAPHY.COMBINATIONS.buttonLarge} transition-all duration-200 ${
                            theme === 'dark'
                                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
                                : 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white'
                        } active:scale-[0.98] ${LINE_HEIGHTS.tight}`}
                    >
                        ✅ 知道了，开始抽卡
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardDrawReminder;
