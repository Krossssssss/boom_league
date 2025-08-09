import type { Player, PlayerStats } from '../types';

export const UTILS = {
    getRandomElement: <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)],
    
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
