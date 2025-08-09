// Player Rankings Calculation Utilities
// Calculates rankings for each player statistic among all players

import type { Player } from '../types';

export interface PlayerRankings {
    championships: number;           // 联赛冠军次数排名
    runner_up: number;               // 联赛亚军次数排名
    third_place: number;             // 联赛季军次数排名
    single_round_firsts: number;     // 单轮冠军次数排名
    single_round_seconds: number;    // 单轮亚军次数排名
    single_round_thirds: number;     // 单轮季军次数排名
    total_vp: number;                // 总VP排名
    total_games: number;             // 总游戏数排名
    average_placement: number;       // 平均排名的排名 (越小越好)
    win_rate: number;                // 胜率排名
}

/**
 * Calculate rankings for all players based on their statistics
 * @param players Array of all players
 * @returns Array of players with rankings added
 */
export const calculatePlayerRankings = (players: Player[]): Player[] => {
    if (!players || players.length === 0) return [];
    
    // Create a copy to avoid mutating the original array
    const playersWithRankings = [...players];
    
    // Helper function to calculate ranking for a specific statistic
    const calculateRanking = (
        statGetter: (player: Player) => number,
        descending: boolean = true // true for higher is better, false for lower is better
    ): number[] => {
        // Get all values and sort them
        const values = players.map(statGetter);
        const sortedUniqueValues = [...new Set(values)].sort((a, b) => 
            descending ? b - a : a - b
        );
        
        // Calculate ranking for each player
        return values.map(value => {
            const rank = sortedUniqueValues.indexOf(value) + 1;
            return rank;
        });
    };
    
    // Calculate rankings for each statistic
    const championshipsRanks = calculateRanking(p => p.championships || 0);
    const runnerUpRanks = calculateRanking(p => p.runner_up || 0);
    const thirdPlaceRanks = calculateRanking(p => p.third_place || 0);
    const singleRoundFirstsRanks = calculateRanking(p => p.single_round_firsts || 0);
    const singleRoundSecondsRanks = calculateRanking(p => p.single_round_seconds || 0);
    const singleRoundThirdsRanks = calculateRanking(p => p.single_round_thirds || 0);
    const totalVPRanks = calculateRanking(p => p.total_vp || 0);
    const totalGamesRanks = calculateRanking(p => p.total_games || 0);
    
    // For average placement, lower is better (so ascending = true)
    const averagePlacementRanks = calculateRanking(
        p => p.average_placement || 999, // Use 999 as default for players with no games
        false // ascending order (lower average placement is better)
    );
    
    const winRateRanks = calculateRanking(p => p.win_rate || 0);
    
    // Add rankings to each player
    playersWithRankings.forEach((player, index) => {
        player.rankings = {
            championships: championshipsRanks[index],
            runner_up: runnerUpRanks[index],
            third_place: thirdPlaceRanks[index],
            single_round_firsts: singleRoundFirstsRanks[index],
            single_round_seconds: singleRoundSecondsRanks[index],
            single_round_thirds: singleRoundThirdsRanks[index],
            total_vp: totalVPRanks[index],
            total_games: totalGamesRanks[index],
            average_placement: averagePlacementRanks[index],
            win_rate: winRateRanks[index],
        };
    });
    
    return playersWithRankings;
};

/**
 * Get ranking suffix for display (1st, 2nd, 3rd, 4th, etc.)
 * @param rank The ranking number
 * @returns Formatted ranking string
 */
export const getRankingSuffix = (rank: number): string => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `${rank}th`;
};

/**
 * Get ranking color class based on ranking position
 * @param rank The ranking number
 * @returns CSS color class string
 */
export const getRankingColorClass = (rank: number): string => {
    if (rank === 1) return 'text-yellow-400'; // Gold for 1st
    if (rank === 2) return 'text-gray-300';   // Silver for 2nd
    if (rank === 3) return 'text-orange-400'; // Bronze for 3rd
    if (rank <= 5) return 'text-blue-400';    // Blue for top 5
    if (rank <= 10) return 'text-green-400';  // Green for top 10
    return 'text-gray-500';                   // Gray for others
};

/**
 * Get ranking background class based on ranking position
 * @param rank The ranking number
 * @returns CSS background class string
 */
export const getRankingBgClass = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400/20';
    if (rank === 3) return 'bg-orange-500/10 border-orange-500/20';
    if (rank <= 5) return 'bg-blue-500/10 border-blue-500/20';
    if (rank <= 10) return 'bg-green-500/10 border-green-500/20';
    return 'bg-gray-500/10 border-gray-500/20';
};
