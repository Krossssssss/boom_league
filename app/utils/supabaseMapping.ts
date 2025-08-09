// Supabase Database Field Mapping Utilities
// Handles conversion between TypeScript camelCase and SQL snake_case

import type { Player, LeagueState, LeagueHistory } from '../types';

// Convert TypeScript Player object to Supabase format
export const playerToSupabase = (player: Partial<Player>): Record<string, any> => {
    const supabasePlayer: Record<string, any> = {};
    
    // Direct mapping fields
    if (player.id !== undefined) supabasePlayer.id = player.id;
    if (player.app_id !== undefined) supabasePlayer.app_id = player.app_id;
    if (player.name !== undefined) supabasePlayer.name = player.name;
    if (player.avatar !== undefined) supabasePlayer.avatar = player.avatar;
    if (player.score !== undefined) supabasePlayer.score = player.score;
    if (player.history !== undefined) supabasePlayer.history = player.history;
    if (player.championships !== undefined) supabasePlayer.championships = player.championships;
    
    // camelCase to snake_case mapping
    if (player.runnerUp !== undefined) supabasePlayer.runner_up = player.runnerUp;
    if (player.thirdPlace !== undefined) supabasePlayer.third_place = player.thirdPlace;
    if (player.totalVP !== undefined) supabasePlayer.total_vp = player.totalVP;
    if (player.totalGames !== undefined) supabasePlayer.total_games = player.totalGames;
    if (player.averagePlacement !== undefined) supabasePlayer.average_placement = player.averagePlacement;
    if (player.winRate !== undefined) supabasePlayer.win_rate = player.winRate;
    
    return supabasePlayer;
};

// Convert Supabase Player data to TypeScript format
export const playerFromSupabase = (supabasePlayer: Record<string, any>): Player => {
    return {
        id: supabasePlayer.id,
        app_id: supabasePlayer.app_id,
        name: supabasePlayer.name,
        avatar: supabasePlayer.avatar,
        score: supabasePlayer.score || 0,
        history: supabasePlayer.history || [],
        championships: supabasePlayer.championships || 0,
        // snake_case to camelCase mapping
        runnerUp: supabasePlayer.runner_up || 0,
        thirdPlace: supabasePlayer.third_place || 0,
        totalVP: supabasePlayer.total_vp || 0,
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
