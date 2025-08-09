import type { Player, PlayerStats } from '../types';
import { GAME_RULES } from '../constants/gameRules';

export const UTILS = {
    getRandomElement: <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)],
    
    /**
     * 选择特殊规则，考虑概率和互斥关系
     * 60%概率选择1条规则，40%概率选择2条规则
     */
    selectSpecialRules: (availableRules: string[] = GAME_RULES.SPECIAL_RULES): string[] => {
        // 过滤出可用的规则（排除"无特殊规则"，除非它是唯一选项）
        const nonNullRules = availableRules.filter(rule => rule !== "无特殊规则");
        
        // 如果没有可用规则或用户明确选择了"无特殊规则"
        if (nonNullRules.length === 0 || availableRules.includes("无特殊规则") && availableRules.length === 1) {
            return ["无特殊规则"];
        }
        
        // 决定选择1条还是2条规则：60%概率1条，40%概率2条
        const shouldSelectTwo = Math.random() < 0.4;
        
        if (!shouldSelectTwo || nonNullRules.length < 2) {
            // 选择1条规则
            return [UTILS.getRandomElement(nonNullRules)];
        }
        
        // 选择2条不冲突的规则
        const firstRule = UTILS.getRandomElement(nonNullRules);
        const conflictingRules = GAME_RULES.RULE_CONFLICTS[firstRule] || [];
        const compatibleRules = nonNullRules.filter(rule => 
            rule !== firstRule && !conflictingRules.includes(rule)
        );
        
        if (compatibleRules.length === 0) {
            // 如果没有兼容的规则，只返回第一条
            return [firstRule];
        }
        
        const secondRule = UTILS.getRandomElement(compatibleRules);
        return [firstRule, secondRule];
    },
    
    calculatePlayerStats: (player: Player): PlayerStats => {
        const history = player.history || [];
        const totalGames = history.length;
        const placements: Record<number, number> = history.reduce((acc, game) => {
            acc[game.placement] = (acc[game.placement] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
        
        const averagePlacement = totalGames > 0 
            ? (history.reduce((sum, game) => sum + game.placement, 0) / totalGames).toFixed(1)
            : 'N/A';
            
        const winRate = totalGames > 0 
            ? ((placements[1] || 0) / totalGames * 100).toFixed(1)
            : '0';
            
        return {
            totalGames,
            placements,
            averagePlacement,
            winRate,
            championships: player.championships || 0,
            totalVP: player.totalVP || 0
        };
    }
};
