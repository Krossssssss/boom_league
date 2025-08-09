// Supabase Database Field Mapping Utilities
// Maps between TypeScript Player interface and actual database fields

import type { Player, LeagueState, LeagueHistory } from '../types';

// Convert TypeScript Player object to Supabase format
export const playerToSupabase = (player: Partial<Player>): Record<string, any> => {
    const supabasePlayer: Record<string, any> = {};
    
    // Direct database field mappings (exact field names)
    if (player.id !== undefined) supabasePlayer.id = player.id;
    if (player.app_id !== undefined) supabasePlayer.app_id = player.app_id;
    if (player.name !== undefined) supabasePlayer.name = player.name;
    if (player.avatar !== undefined) supabasePlayer.avatar = player.avatar;
    if (player.score !== undefined) supabasePlayer.score = player.score;
    if (player.history !== undefined) supabasePlayer.history = player.history;
    
    // Statistics fields (direct mapping to database fields)
    if (player.championships !== undefined) supabasePlayer.championships = player.championships;
    if (player.runner_up !== undefined) supabasePlayer.runner_up = player.runner_up;
    if (player.third_place !== undefined) supabasePlayer.third_place = player.third_place;
    if (player.total_vp !== undefined) supabasePlayer.total_vp = player.total_vp;
    if (player.total_games !== undefined) supabasePlayer.total_games = player.total_games;
    if (player.average_placement !== undefined) supabasePlayer.average_placement = player.average_placement;
    if (player.win_rate !== undefined) supabasePlayer.win_rate = player.win_rate;
    if (player.single_round_firsts !== undefined) supabasePlayer.single_round_firsts = player.single_round_firsts;
    if (player.single_round_seconds !== undefined) supabasePlayer.single_round_seconds = player.single_round_seconds;
    if (player.single_round_thirds !== undefined) supabasePlayer.single_round_thirds = player.single_round_thirds;
    
    // Timestamp fields
    if (player.created_at !== undefined) supabasePlayer.created_at = player.created_at;
    if (player.updated_at !== undefined) supabasePlayer.updated_at = player.updated_at;
    
    // Handle legacy field mappings for backward compatibility
    if (player.leagueChampionships !== undefined) supabasePlayer.championships = player.leagueChampionships;
    if (player.leagueRunnerUp !== undefined) supabasePlayer.runner_up = player.leagueRunnerUp;
    if (player.leagueThirdPlace !== undefined) supabasePlayer.third_place = player.leagueThirdPlace;
    if (player.roundChampionships !== undefined) supabasePlayer.single_round_firsts = player.roundChampionships;
    if (player.roundRunnerUp !== undefined) supabasePlayer.single_round_seconds = player.roundRunnerUp;
    if (player.roundThirdPlace !== undefined) supabasePlayer.single_round_thirds = player.roundThirdPlace;
    if (player.totalVP !== undefined) supabasePlayer.total_vp = player.totalVP;
    if (player.totalLeagues !== undefined) supabasePlayer.total_games = player.totalLeagues;
    if (player.roundAveragePlacement !== undefined) supabasePlayer.average_placement = player.roundAveragePlacement;
    if (player.roundWinRate !== undefined) supabasePlayer.win_rate = player.roundWinRate;
    if (player.totalGames !== undefined) supabasePlayer.total_games = player.totalGames;
    if (player.averagePlacement !== undefined) supabasePlayer.average_placement = player.averagePlacement;
    if (player.winRate !== undefined) supabasePlayer.win_rate = player.winRate;
    
    return supabasePlayer;
};

// Convert Supabase Player data to TypeScript format
export const playerFromSupabase = (supabasePlayer: Record<string, any>): Player => {
    // Calculate totalRounds from history if available
    const totalRounds = supabasePlayer.history ? supabasePlayer.history.length : 0;
    
    return {
        id: supabasePlayer.id,
        app_id: supabasePlayer.app_id,
        name: supabasePlayer.name,
        avatar: supabasePlayer.avatar,
        score: supabasePlayer.score || 0,
        history: supabasePlayer.history || [],
        
        // Direct database fields
        championships: supabasePlayer.championships || 0,
        runner_up: supabasePlayer.runner_up || 0,
        third_place: supabasePlayer.third_place || 0,
        total_vp: supabasePlayer.total_vp || 0,
        total_games: supabasePlayer.total_games || 0,
        average_placement: supabasePlayer.average_placement || 0,
        win_rate: supabasePlayer.win_rate || 0,
        single_round_firsts: supabasePlayer.single_round_firsts || 0,
        single_round_seconds: supabasePlayer.single_round_seconds || 0,
        single_round_thirds: supabasePlayer.single_round_thirds || 0,
        
        // Timestamp fields
        created_at: supabasePlayer.created_at,
        updated_at: supabasePlayer.updated_at,
        
        // Legacy compatibility fields (mapped from database fields)
        leagueChampionships: supabasePlayer.championships || 0,
        leagueRunnerUp: supabasePlayer.runner_up || 0,
        leagueThirdPlace: supabasePlayer.third_place || 0,
        roundChampionships: supabasePlayer.single_round_firsts || 0,
        roundRunnerUp: supabasePlayer.single_round_seconds || 0,
        roundThirdPlace: supabasePlayer.single_round_thirds || 0,
        totalVP: supabasePlayer.total_vp || 0,
        totalLeagues: supabasePlayer.total_games || 0,
        totalRounds: totalRounds,
        roundAveragePlacement: supabasePlayer.average_placement || 0,
        roundWinRate: supabasePlayer.win_rate || 0,
        totalGames: supabasePlayer.total_games || 0,
        averagePlacement: supabasePlayer.average_placement || 0,
        winRate: supabasePlayer.win_rate || 0,
    };
};

// Convert TypeScript LeagueState object to Supabase format
export const leagueStateToSupabase = (leagueState: Partial<LeagueState>): Record<string, any> => {
    const supabaseLeagueState: Record<string, any> = {};
    
    // Direct mapping fields
    if (leagueState.app_id !== undefined) supabaseLeagueState.app_id = leagueState.app_id;
    if (leagueState.status !== undefined) supabaseLeagueState.status = leagueState.status;
    if (leagueState.current_round !== undefined) supabaseLeagueState.current_round = leagueState.current_round;
    if (leagueState.schedule !== undefined) supabaseLeagueState.schedule = leagueState.schedule;
    if (leagueState.winner !== undefined) supabaseLeagueState.winner = leagueState.winner;
    if (leagueState.league_name !== undefined) supabaseLeagueState.league_name = leagueState.league_name;
    if (leagueState.season_number !== undefined) supabaseLeagueState.season_number = leagueState.season_number;
    if (leagueState.start_date !== undefined) supabaseLeagueState.start_date = leagueState.start_date;
    if (leagueState.end_date !== undefined) supabaseLeagueState.end_date = leagueState.end_date;
    if (leagueState.created_at !== undefined) supabaseLeagueState.created_at = leagueState.created_at;
    if (leagueState.selected_special_rules !== undefined) supabaseLeagueState.selected_special_rules = leagueState.selected_special_rules;
    
    return supabaseLeagueState;
};

// Convert Supabase LeagueState data to TypeScript format
export const leagueStateFromSupabase = (supabaseLeagueState: Record<string, any>): LeagueState => {
    return {
        app_id: supabaseLeagueState.app_id,
        status: supabaseLeagueState.status || 'setup',
        current_round: supabaseLeagueState.current_round || 0,
        schedule: supabaseLeagueState.schedule || [],
        winner: supabaseLeagueState.winner || null,
        league_name: supabaseLeagueState.league_name,
        season_number: supabaseLeagueState.season_number,
        start_date: supabaseLeagueState.start_date,
        end_date: supabaseLeagueState.end_date,
        created_at: supabaseLeagueState.created_at,
        selected_special_rules: supabaseLeagueState.selected_special_rules,
    };
};

// Convert TypeScript LeagueHistory object to Supabase format
export const leagueHistoryToSupabase = (leagueHistory: Partial<LeagueHistory>): Record<string, any> => {
    const supabaseLeagueHistory: Record<string, any> = {};
    
    // Direct mapping fields
    if (leagueHistory.id !== undefined) supabaseLeagueHistory.id = leagueHistory.id;
    if (leagueHistory.app_id !== undefined) supabaseLeagueHistory.app_id = leagueHistory.app_id;
    if (leagueHistory.league_name !== undefined) supabaseLeagueHistory.league_name = leagueHistory.league_name;
    if (leagueHistory.season_number !== undefined) supabaseLeagueHistory.season_number = leagueHistory.season_number;
    if (leagueHistory.start_date !== undefined) supabaseLeagueHistory.start_date = leagueHistory.start_date;
    if (leagueHistory.end_date !== undefined) supabaseLeagueHistory.end_date = leagueHistory.end_date;
    if (leagueHistory.winner !== undefined) supabaseLeagueHistory.winner = leagueHistory.winner;
    if (leagueHistory.final_standings !== undefined) supabaseLeagueHistory.final_standings = leagueHistory.final_standings;
    if (leagueHistory.total_rounds !== undefined) supabaseLeagueHistory.total_rounds = leagueHistory.total_rounds;
    if (leagueHistory.total_players !== undefined) supabaseLeagueHistory.total_players = leagueHistory.total_players;
    if (leagueHistory.created_at !== undefined) supabaseLeagueHistory.created_at = leagueHistory.created_at;
    
    return supabaseLeagueHistory;
};

// Convert Supabase LeagueHistory data to TypeScript format
export const leagueHistoryFromSupabase = (supabaseLeagueHistory: Record<string, any>): LeagueHistory => {
    return {
        id: supabaseLeagueHistory.id,
        app_id: supabaseLeagueHistory.app_id,
        league_name: supabaseLeagueHistory.league_name,
        season_number: supabaseLeagueHistory.season_number,
        start_date: supabaseLeagueHistory.start_date,
        end_date: supabaseLeagueHistory.end_date,
        winner: supabaseLeagueHistory.winner,
        final_standings: supabaseLeagueHistory.final_standings || [],
        total_rounds: supabaseLeagueHistory.total_rounds,
        total_players: supabaseLeagueHistory.total_players,
        created_at: supabaseLeagueHistory.created_at,
    };
};

// Helper function to convert array of players from Supabase
export const playersFromSupabase = (supabasePlayers: Record<string, any>[]): Player[] => {
    return supabasePlayers.map(playerFromSupabase);
};

// Helper function to convert array of league history from Supabase
export const leagueHistoryArrayFromSupabase = (supabaseLeagueHistory: Record<string, any>[]): LeagueHistory[] => {
    return supabaseLeagueHistory.map(leagueHistoryFromSupabase);
};