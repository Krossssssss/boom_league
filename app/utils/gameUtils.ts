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
    },

    // Calculate player statistics based on league history (not round history)
    // This should only be called with league-level data, not round-level data
    updatePlayerStatistics: (player: Player): Player => {
        // For now, just return the player with existing stats
        // The real statistics update should happen when leagues finish
        return {
            ...player,
            totalGames: player.totalGames || 0,
            averagePlacement: player.averagePlacement || 0,
            winRate: player.winRate || 0
        };
    },

    // Calculate and update league-level statistics when a league finishes
    updateLeagueStatistics: (players: Player[], leagueResults: { playerId: string, finalPlacement: number }[]): Player[] => {
        const updatedPlayers = [...players];
        
        leagueResults.forEach(result => {
            const player = updatedPlayers.find(p => p.id === result.playerId);
            if (!player) return;
            
            // Increment total leagues played
            player.totalGames = (player.totalGames || 0) + 1;
            
            // Update championship/runner-up/third place counts based on FINAL league placement
            if (result.finalPlacement === 1) {
                player.championships = (player.championships || 0) + 1;
            } else if (result.finalPlacement === 2) {
                player.runnerUp = (player.runnerUp || 0) + 1;
            } else if (result.finalPlacement === 3) {
                player.thirdPlace = (player.thirdPlace || 0) + 1;
            }
            
            // Calculate average placement across all leagues
            // We need to track cumulative placement to calculate this properly
            const totalPlacementSum = (player.averagePlacement || 0) * ((player.totalGames || 1) - 1) + result.finalPlacement;
            player.averagePlacement = parseFloat((totalPlacementSum / player.totalGames).toFixed(2));
            
            // Calculate win rate (percentage of leagues won)
            player.winRate = parseFloat(((player.championships || 0) / player.totalGames * 100).toFixed(1));
        });
        
        return updatedPlayers;
    }
};
