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
            
            // Increment total games played (leagues)
            player.total_games = (player.total_games || 0) + 1;
            
            // Update league-level championship/runner-up/third place counts based on FINAL league placement
            if (result.finalPlacement === 1) {
                player.championships = (player.championships || 0) + 1;
            } else if (result.finalPlacement === 2) {
                player.runner_up = (player.runner_up || 0) + 1;
            } else if (result.finalPlacement === 3) {
                player.third_place = (player.third_place || 0) + 1;
            }
            
            // Update compatibility fields
            player.leagueChampionships = player.championships;
            player.leagueRunnerUp = player.runner_up;
            player.leagueThirdPlace = player.third_place;
            player.totalLeagues = player.total_games;
            player.totalGames = player.total_games;
        });
        
        return updatedPlayers;
    },

    // Calculate and update round-level statistics when a round finishes
    updateRoundStatistics: (players: Player[], roundResults: { playerId: string, placement: number }[]): Player[] => {
        const updatedPlayers = [...players];
        
        roundResults.forEach(result => {
            const player = updatedPlayers.find(p => p.id === result.playerId);
            if (!player) return;
            
            // Increment total rounds played
            player.totalRounds = (player.totalRounds || 0) + 1;
            
            // Update round-level championship/runner-up/third place counts
            if (result.placement === 1) {
                player.roundChampionships = (player.roundChampionships || 0) + 1;
            } else if (result.placement === 2) {
                player.roundRunnerUp = (player.roundRunnerUp || 0) + 1;
            } else if (result.placement === 3) {
                player.roundThirdPlace = (player.roundThirdPlace || 0) + 1;
            }
            
            // Calculate round average placement
            const currentAvg = player.roundAveragePlacement || 0;
            const totalRounds = player.totalRounds;
            const totalPlacementSum = currentAvg * (totalRounds - 1) + result.placement;
            player.roundAveragePlacement = parseFloat((totalPlacementSum / totalRounds).toFixed(2));
            
            // Calculate round win rate (top 3 finishes count as wins)
            const roundWins = (player.roundChampionships || 0) + (player.roundRunnerUp || 0) + (player.roundThirdPlace || 0);
            player.roundWinRate = parseFloat((roundWins / totalRounds * 100).toFixed(1));
            
            // Update compatibility fields
            player.averagePlacement = player.roundAveragePlacement;
            player.winRate = player.roundWinRate;
        });
        
        return updatedPlayers;
    }
};
