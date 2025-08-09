import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LucideCat, LucideShield, LucideBomb, LucideSwords, LucideTrophy, LucideDices, LucideClipboardList, LucideMenu, LucidePlus, LucideGamepad2, LucideChevronLeft, LucideX, LucideCrown } from 'lucide-react';

// Import types
import type { Player, LeagueState, Winner, RoundConfig, LeagueHistory } from '../types';

// Import constants
import { GAME_RULES } from '../constants/gameRules';
import { SUPABASE_CONFIG } from '../constants/supabase';

// Import utils
import { UTILS } from '../utils/gameUtils';
import { calculatePlayerRankings } from '../utils/rankingUtils';
import { 
    playerToSupabase, 
    playerFromSupabase, 
    playersFromSupabase,
    leagueStateToSupabase, 
    leagueStateFromSupabase,
    leagueHistoryToSupabase,
    leagueHistoryArrayFromSupabase
} from '../utils/supabaseMapping';

// Import context
import { ThemeContext, useTheme } from '../contexts/ThemeContext';

// Import components
import Sidebar from '../components/layout/Sidebar';
import Leaderboard from '../components/ui/Leaderboard';
import PlayerProfiles from '../components/ui/PlayerProfiles';
import InfoCard from '../components/ui/InfoCard';
import ScheduleTimeline from '../components/ui/ScheduleTimeline';
import Modal from '../components/ui/Modal';
import PlayerProfileModal from '../components/ui/PlayerProfileModal';
import ResultsModal from '../components/ui/ResultsModal';
import CardDrawReminder from '../components/ui/CardDrawReminder';

// Import constants
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../constants/typography';

// Import utilities
import { selectSpecialRules, formatSpecialRules } from '../utils/specialRulesUtils';
import { getAudioManager } from '../utils/audioUtils';

// Import pages
import HomePage from '../components/pages/HomePage';
import PlayerRegistrationPage from '../components/pages/PlayerRegistrationPage';
import LeagueManagementPage from '../components/pages/LeagueManagementPage';
import PlayerRankingsPage from '../components/pages/PlayerRankingsPage';
import LeagueHistoryPage from '../components/pages/LeagueHistoryPage';
import ScheduleConfirmationPage from '../components/pages/ScheduleConfirmationPage';

let supabase: any;

export default function Index() {
    const [leagueState, setLeagueState] = useState<LeagueState | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [session, setSession] = useState<any>(null);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
    const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
    const [newPlayerName, setNewPlayerName] = useState<string>("");
    const [selectedAvatar, setSelectedAvatar] = useState<string>(GAME_RULES.AVATARS[0]);
    const [showPlayerProfileModal, setShowPlayerProfileModal] = useState<boolean>(false);
    const [selectedPlayerForProfile, setSelectedPlayerForProfile] = useState<Player | null>(null);
    const [winner, setWinner] = useState<Winner | null>(null);
    const [showCardDrawReminder, setShowCardDrawReminder] = useState<boolean>(false);
    const [cardDrawRound, setCardDrawRound] = useState<number>(1);
    const [appId, setAppId] = useState<string>('default');
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
    const [musicMuted, setMusicMuted] = useState<boolean>(true);
    const [leagueHistory, setLeagueHistory] = useState<LeagueHistory[]>([]);
    const [currentLeagueName, setCurrentLeagueName] = useState<string>('');
    const [nextSeasonNumber, setNextSeasonNumber] = useState<number>(1);
    const [isHydrated, setIsHydrated] = useState<boolean>(false);
    const [audioManager] = useState(() => getAudioManager());
    const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

    // Helper function to update players with rankings
    const updatePlayersWithRankings = (newPlayers: Player[]) => {
        const playersWithRankings = calculatePlayerRankings(newPlayers);
        setPlayers(playersWithRankings);
    };

    // Hydration effect - runs only on client after hydration
    useEffect(() => {
        setIsHydrated(true);
        
        // Load sidebar collapsed state from localStorage
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsed !== null) {
            setSidebarCollapsed(JSON.parse(savedCollapsed));
        }
        
        // Load music muted state from localStorage
        const savedMuted = localStorage.getItem('musicMuted');
        if (savedMuted !== null) {
            setMusicMuted(JSON.parse(savedMuted));
        }
        
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('boom-league-theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
        
        // Initialize app ID from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const canvasAppId = urlParams.get('app_id') || 'default';
        setAppId(canvasAppId);
        
        // Initialize audio manager
        audioManager.setMuted(savedMuted !== null ? JSON.parse(savedMuted) : true);
    }, [audioManager]);

    // Save sidebar collapsed state to localStorage (only after hydration)
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        }
    }, [sidebarCollapsed, isHydrated]);

    // Save music muted state to localStorage (only after hydration)
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('musicMuted', JSON.stringify(musicMuted));
            audioManager.setMuted(musicMuted);
        }
    }, [musicMuted, isHydrated, audioManager]);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // Supabase initialization effect (only after hydration)
    useEffect(() => {
        if (!isHydrated) return;
        
        // Only initialize Supabase on client side
        if (!supabase) {
            supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        }

        supabase.auth.getSession().then(({ data: { session } }: any) => {
            setSession(session)
            if(!session){
                supabase.auth.signInAnonymously();
            }
            setIsAuthReady(true);
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setSession(session)
            setIsAuthReady(true);
        })

        return () => subscription.unsubscribe()
    }, [isHydrated])

    // Load league history function
    const loadLeagueHistory = async () => {
        if (!supabase || !appId) return;
        
        try {
            const { data: historyData, error } = await supabase
                .from('league_history')
                .select('*')
                .eq('app_id', appId)
                .order('season_number', { ascending: false });

            if (error) {
                console.error('Error loading league history:', error);
                return;
            }

            if (historyData) {
                const mappedHistory = leagueHistoryArrayFromSupabase(historyData);
                setLeagueHistory(mappedHistory);
                // Set next season number based on latest season
                const latestSeason = mappedHistory.length > 0 ? mappedHistory[0].season_number : 0;
                setNextSeasonNumber(latestSeason + 1);
                setCurrentLeagueName(`Boom League S${latestSeason + 1}`);
            }
        } catch (error) {
            console.error('Error in loadLeagueHistory:', error);
        }
    };

    useEffect(() => {
        if (!isAuthReady || !supabase || !isHydrated) return;

        const fetchInitialData = async () => {
            const { data: leagueData, error: leagueError } = await supabase
                .from('league_state')
                .select('*')
                .eq('app_id', appId)
                .single();
            
            if (leagueData) {
                const mappedLeagueState = leagueStateFromSupabase(leagueData);
                setLeagueState(mappedLeagueState);
                if (mappedLeagueState.winner) setWinner(mappedLeagueState.winner);
                else setWinner(null);
            } else {
                 setLeagueState(null);
            }
             if(leagueError && leagueError.code !== 'PGRST116') console.error("Error fetching league state:", leagueError);

            // Load players data from main players table
            const { data: playersData, error: playersError } = await supabase
                .from('players')
                .select('*')
                .eq('app_id', appId);
            
            if (playersError) console.error("Error fetching players:", playersError);
            
            if (playersData) {
                // Map data from players table only
                const mappedPlayers = playersData.map((playerData: any) => {
                    return playerFromSupabase(playerData);
                });
                
                // Sort by score (descending)
                mappedPlayers.sort((a: Player, b: Player) => b.score - a.score);
                
                // Calculate rankings for all players
                updatePlayersWithRankings(mappedPlayers);
            }
        };

        fetchInitialData();
                        // loadLeagueHistory(); // 这个函数需要在别的地方定义

        const leagueChannel = supabase.channel(`league-state:${appId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'league_state', filter: `app_id=eq.${appId}` }, (payload: any) => {
                const updatedState = leagueStateFromSupabase(payload.new);
                setLeagueState(updatedState);
                if (updatedState.winner) setWinner(updatedState.winner);
                else setWinner(null);
            })
            .subscribe();

        const playersChannel = supabase.channel(`players:${appId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `app_id=eq.${appId}` }, 
            (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    const mappedPlayer = playerFromSupabase(payload.new);
                    setPlayers(currentPlayers => {
                        const exists = currentPlayers.some(p => p.id === mappedPlayer.id);
                        const next = exists ? currentPlayers : [...currentPlayers, mappedPlayer];
                        return next.sort((a, b) => b.score - a.score);
                    });
                }
                if (payload.eventType === 'UPDATE') {
                    const mappedPlayer = playerFromSupabase(payload.new);
                    setPlayers(currentPlayers => currentPlayers.map(p => p.id === mappedPlayer.id ? mappedPlayer : p).sort((a, b) => b.score - a.score));
                }
                if (payload.eventType === 'DELETE') {
                    setPlayers(currentPlayers => currentPlayers.filter(p => p.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(leagueChannel);
            supabase.removeChannel(playersChannel);
        };
    }, [isAuthReady, appId, isHydrated]);

    const handleAddPlayer = async () => {
        console.log('handleAddPlayer called with:', { newPlayerName, selectedAvatar, playersLength: players.length });
        
        if (newPlayerName.trim() === "") {
            console.log('handleAddPlayer early return:', { nameEmpty: newPlayerName.trim() === "" });
            return;
        }

        const tempPlayer = {
            id: `temp_${Date.now()}`,
            app_id: appId,
            name: newPlayerName.trim(),
            avatar: selectedAvatar,
            score: 0,
            history: [],
            
            // Database fields
            championships: 0,
            runner_up: 0,
            third_place: 0,
            total_vp: 0,
            total_games: 0,
            average_placement: 0,
            win_rate: 0,
            single_round_firsts: 0,
            single_round_seconds: 0,
            single_round_thirds: 0,
            
            // Compatibility fields
            leagueChampionships: 0,
            leagueRunnerUp: 0,
            leagueThirdPlace: 0,
            roundChampionships: 0,
            roundRunnerUp: 0,
            roundThirdPlace: 0,
            totalVP: 0,
            totalLeagues: 0,
            totalRounds: 0,
            roundAveragePlacement: 0,
            roundWinRate: 0,
            totalGames: 0,
            averagePlacement: 0,
            winRate: 0,
        } as any;

        console.log('Adding temp player:', tempPlayer);
        setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));

        console.log('Inserting into Supabase...');
        const playerData = {
            app_id: appId,
            name: tempPlayer.name,
            avatar: selectedAvatar,
            score: 0,
            history: [],
            championships: 0,
            runnerUp: 0,
            thirdPlace: 0,
            totalVP: 0,
        };
        
        // Insert into players table
        const { data, error } = await supabase
            .from('players')
            .insert(playerToSupabase(playerData))
            .select()
            .single();



        console.log('Supabase insert result:', { data, error });

        if (error) {
            setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id));
            console.error('Add player failed:', error);
        } else if (data) {
            console.log('Successfully added player, updating temp player with real data:', data);
            const mappedPlayer = playerFromSupabase(data);
            setPlayers((curr) =>
                curr
                    .map((p) => (p.id === tempPlayer.id ? mappedPlayer : p))
                    .sort((a, b) => b.score - a.score)
            );
        }

        setNewPlayerName("");
        setSelectedAvatar(GAME_RULES.AVATARS[0]);
        setShowPlayerModal(false);
    };

    const handleDeletePlayer = async (playerId: string) => {
        const previous = players;
        setPlayers((curr) => curr.filter((p) => p.id !== playerId));

        // Delete from players table
        const { error } = await supabase
            .from('players')
            .delete()
            .match({ id: playerId, app_id: appId });

        if (error) {
            console.error('Delete player failed:', error);
            setPlayers(previous);
        }
    };

    const generateSchedule = (playerCount: number, selectedSpecialRules: string[] = GAME_RULES.SPECIAL_RULES): RoundConfig[] => {
        let schedule: RoundConfig[] = [];
        for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
            const safeCardMultipliers = [1, 2, 3, 4, 5];
            // 炸弹牌数量只有两种可能：玩家数 × 1 或 玩家数 + 1
            const bombCardOptions = [playerCount, playerCount + 1];
            const handLimits = [4, 5, 6, Infinity];

            // 选择特殊规则（60%概率1条，40%概率2条，确保不冲突）
            const roundSpecialRules = selectSpecialRules(selectedSpecialRules);
            const specialRuleText = formatSpecialRules(roundSpecialRules);

            schedule.push({
                round: i + 1,
                safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
                bombCards: UTILS.getRandomElement(bombCardOptions),
                handLimit: UTILS.getRandomElement(handLimits),
                vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
                specialRule: specialRuleText,
                specialRules: roundSpecialRules, // 保存原始规则数组
            });
        }
        return schedule;
    };

    const handleConfirmSchedule = async () => {
        if (!leagueState) return;

        const confirmedLeagueState = {
            ...leagueState,
            status: 'in_progress',
            current_round: 1,
        };

        setLeagueState(confirmedLeagueState as any);

        const { error } = await supabase
            .from('league_state')
            .update({
                status: 'in_progress',
                current_round: 1,
            })
            .eq('app_id', appId);

        if (error) {
            console.error('Confirm schedule failed:', error);
        }
    };

    const handleRerollSchedule = async () => {
        if (!leagueState) return;

        const selectedRules = leagueState.selected_special_rules || GAME_RULES.SPECIAL_RULES;
        const newSchedule = generateSchedule(players.length, selectedRules);
        const rerolledLeagueState = {
            ...leagueState,
            schedule: newSchedule,
        };

        setLeagueState(rerolledLeagueState as any);

        const { error } = await supabase
            .from('league_state')
            .update({
                schedule: newSchedule,
            })
            .eq('app_id', appId);

        if (error) {
            console.error('Reroll schedule failed:', error);
        }
    };

    const handleStartLeague = async (selectedSpecialRules: string[]) => {
        if (players.length < 2) return;

        const schedule = generateSchedule(players.length, selectedSpecialRules);
        const currentDate = new Date().toISOString();
        const leagueName = currentLeagueName || `Boom League S${nextSeasonNumber}`;

        const newLeagueState = {
            app_id: appId,
            status: 'pending_confirmation' as const,
            current_round: 0,
            schedule,
            winner: null,
            league_name: leagueName,
            season_number: nextSeasonNumber,
            start_date: currentDate,
            created_at: currentDate,
            selected_special_rules: selectedSpecialRules,
        };

        setLeagueState(newLeagueState as any);

        const { error } = await supabase
            .from('league_state')
            .upsert(leagueStateToSupabase(newLeagueState), { onConflict: 'app_id' });

        if (error) {
            console.error('Start league failed:', error);
        }
    };

    const handleResetLeague = async () => {
        setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
        setLeagueState({
            app_id: appId,
            status: 'setup',
            current_round: 0,
            schedule: [],
            winner: null,
        } as any);
        setWinner(null);

        const [{ error: pErr }, { error: lErr }] = await Promise.all([
            supabase.from('players').update({ score: 0, history: [] }).eq('app_id', appId),
            supabase
                .from('league_state')
                .upsert(
                    {
                        app_id: appId,
                        status: 'setup',
                        current_round: 0,
                        schedule: [],
                        winner: null,
                    },
                    { onConflict: 'app_id' }
                ),
        ]);

        if (pErr || lErr) {
            console.error('Reset league errors:', pErr, lErr);
        }
    };

    const handleAbortLeague = async () => {
        if (!leagueState) return;
        
        // Save current league to history before aborting (if it has made progress)
        if (leagueState.current_round > 1) {
            // Create an aborted league state for history
            const abortedLeagueState = {
                ...leagueState,
                status: 'finished',
                winner: {
                    name: '联赛中止',
                    avatar: '⚠️',
                    reason: `联赛在第 ${leagueState.current_round - 1} 轮后被中止`
                },
                end_date: new Date().toISOString()
            } as LeagueState;
            
            await saveLeagueToHistory(abortedLeagueState, players);
        }

        // Reset player scores in local state
        setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
        
        // Clear league state completely
        setLeagueState(null);
        setWinner(null);
        setCurrentPage('league'); // Go back to league management

        // Delete the league from database and reset player scores
        const [{ error: pErr }, { error: lErr }] = await Promise.all([
            supabase.from('players').update({ score: 0, history: [] }).eq('app_id', appId),
            supabase.from('league_state').delete().eq('app_id', appId)
        ]);

        if (pErr || lErr) {
            console.error('Abort league errors:', pErr, lErr);
        } else {
            // Reload history after successful abort
            await loadLeagueHistory();
        }
    };

    const handleBackToLeagueManagement = () => {
        setCurrentPage('league');
    };

    // Enable audio on first user interaction
    const enableAudioOnInteraction = async () => {
        if (!audioEnabled) {
            const success = await audioManager.enableAudio();
            if (success) {
                setAudioEnabled(true);
            }
        }
    };

    // Function to play happy sound effect (mobile-friendly)
    const playHappySound = async () => {
        await enableAudioOnInteraction();
        await audioManager.playSoundEffect('happy');
    };

    // Function to toggle background music
    const toggleBackgroundMusic = async () => {
        await enableAudioOnInteraction();
        
        if (musicPlaying) {
            audioManager.pauseBackgroundMusic();
            setMusicPlaying(false);
        } else {
            const success = await audioManager.playBackgroundMusic();
            if (success) {
                setMusicPlaying(true);
            }
        }
    };

    const handlePlayerClick = (player: Player) => {
        setSelectedPlayerForProfile(player);
        setShowPlayerProfileModal(true);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        if (isHydrated) {
            localStorage.setItem('boom-league-theme', newTheme);
        }
    };

    // Save completed league to history
    const saveLeagueToHistory = async (finalLeagueState: LeagueState, finalPlayers: Player[]) => {
        if (!finalLeagueState.winner || !finalLeagueState.league_name) return;

        const historyEntry: Omit<LeagueHistory, 'id'> = {
            app_id: appId,
            league_name: finalLeagueState.league_name,
            season_number: finalLeagueState.season_number || nextSeasonNumber,
            start_date: finalLeagueState.start_date || new Date().toISOString(),
            end_date: new Date().toISOString(),
            winner: finalLeagueState.winner,
            final_standings: [...finalPlayers].sort((a, b) => b.score - a.score),
            total_rounds: finalLeagueState.current_round,
            total_players: finalPlayers.length,
            created_at: finalLeagueState.created_at || finalLeagueState.start_date || new Date().toISOString(),
        };

        const { error } = await supabase
            .from('league_history')
            .insert(leagueHistoryToSupabase(historyEntry));

        if (error) {
            console.error('Error saving league to history:', error);
        } else {
            // Reload history and increment season number
            await loadLeagueHistory();
        }
    };

    const handleAdvanceRound = async (results: string[]) => {
        if (!leagueState) return;
        
        const currentRoundIndex = leagueState.current_round - 1;
        const vpMode = leagueState.schedule[currentRoundIndex].vpMode;
        
        const updatedPlayersData = [...players];
        const playerUpdates = [];

        for(const [index, playerId] of results.entries()) {
            const player = updatedPlayersData.find(p => p.id === playerId);
            if (!player) continue;

            const points = vpMode.scores[index] || 0;
            const newScore = player.score + points;
            const newTotalVP = (player.totalVP || 0) + points;
            
            // Update basic round data only
            player.score = newScore;
            player.totalVP = newTotalVP;
            player.history = [...player.history, { round: leagueState.current_round, placement: index + 1 }];

            // Update only basic data in players table (no statistics calculation during rounds)
            playerUpdates.push(
                supabase
                    .from('players')
                    .update({
                        score: newScore,
                        total_vp: newTotalVP,
                        history: player.history
                    })
                    .match({ id: playerId, app_id: appId })
            );
        }
        
        // Update round-level statistics for all players
        const roundResults = results.map((playerId, index) => ({
            playerId,
            placement: index + 1
        }));
        
        const playersWithRoundStats = UTILS.updateRoundStatistics(updatedPlayersData, roundResults);
        
        // Update database with round statistics
        const roundStatUpdates = playersWithRoundStats.map(player => {
            const roundStatsData = playerToSupabase({
                roundChampionships: player.roundChampionships,
                roundRunnerUp: player.roundRunnerUp,
                roundThirdPlace: player.roundThirdPlace,
                totalRounds: player.totalRounds,
                roundAveragePlacement: player.roundAveragePlacement,
                roundWinRate: player.roundWinRate
            });
            
            return supabase
                .from('players')
                .update(roundStatsData)
                .match({ id: player.id, app_id: appId });
        });
        
        // Add round stats updates to the player updates array
        playerUpdates.push(...roundStatUpdates);
        
        updatePlayersWithRankings(playersWithRoundStats.sort((a, b) => b.score - a.score));
        
        const potentialWinners = playersWithRoundStats
            .filter(p => p.score >= GAME_RULES.WIN_SCORE)
            .sort((a, b) => b.score - a.score);
        
        let potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null;
        let nextRound = leagueState.current_round + 1;
        let newStatus = leagueState.status;
        let finalWinner = null;

        if (potentialWinner) {
            finalWinner = { name: potentialWinner.name, avatar: potentialWinner.avatar, reason: `在第 ${leagueState.current_round} 轮率先达到 ${potentialWinner.score} 分！` };
            newStatus = 'finished';
        } else if (nextRound > GAME_RULES.MAX_ROUNDS) {
            newStatus = 'finished';
            const sortedPlayers = playersWithRoundStats.sort((a, b) => b.score - a.score);
            const topScore = sortedPlayers[0].score;
            const winners = sortedPlayers.filter(p => p.score === topScore);
            if (winners.length > 1) {
                finalWinner = { name: winners.map(w => w.name).join(' 和 '), avatar: '⚔️', reason: `5轮后平分 (${topScore}分)，需要进行加赛对决！` };
            } else {
                finalWinner = { name: sortedPlayers[0].name, avatar: sortedPlayers[0].avatar, reason: `5轮后以最高分 (${topScore}分) 获胜！` };
            }
        }

        // Execute all player updates (including statistics that were already calculated above)
        await Promise.all(playerUpdates);
        
        setLeagueState((curr: any) => ({
            ...(curr ?? {}),
            app_id: appId,
            current_round: nextRound,
            status: newStatus,
            winner: finalWinner,
            schedule: curr?.schedule ?? leagueState.schedule,
        }));

        await supabase
            .from('league_state')
            .update({
                current_round: nextRound,
                status: newStatus,
                winner: finalWinner,
            })
            .eq('app_id', appId);

        // Update player statistics and save to history if league is finished
        if (newStatus === 'finished' && finalWinner) {
            // Calculate final league placements using the updated players with round stats
            const finalStandings = playersWithRoundStats.sort((a, b) => b.score - a.score);
            const leagueResults = finalStandings.map((player, index) => ({
                playerId: player.id,
                finalPlacement: index + 1
            }));
            
            // Update league-level statistics for all players
            const playersWithUpdatedStats = UTILS.updateLeagueStatistics(playersWithRoundStats, leagueResults);
            updatePlayersWithRankings(playersWithUpdatedStats);
            
            // Update database with new statistics
            const statisticsUpdates = playersWithUpdatedStats.map(player => {
                const playerUpdateData = playerToSupabase({
                    // League-level statistics
                    leagueChampionships: player.leagueChampionships,
                    leagueRunnerUp: player.leagueRunnerUp,
                    leagueThirdPlace: player.leagueThirdPlace,
                    
                    // Round-level statistics
                    roundChampionships: player.roundChampionships,
                    roundRunnerUp: player.roundRunnerUp,
                    roundThirdPlace: player.roundThirdPlace,
                    
                    // Game statistics
                    totalLeagues: player.totalLeagues,
                    totalRounds: player.totalRounds,
                    
                    // Average and win rate statistics
                    roundAveragePlacement: player.roundAveragePlacement,
                    roundWinRate: player.roundWinRate,
                    
                    // Compatibility fields
                    championships: player.championships,
                    runner_up: player.runner_up,
                    third_place: player.third_place,
                    total_games: player.total_games,
                    average_placement: player.average_placement,
                    win_rate: player.win_rate
                });
                
                return [
                    // Update players table
                    supabase
                        .from('players')
                        .update(playerUpdateData)
                        .match({ id: player.id, app_id: appId })
                ];
            }).flat();
            
            // Execute all statistics updates
            await Promise.all(statisticsUpdates);
            
            const finalLeagueState = {
                ...leagueState,
                current_round: nextRound,
                status: newStatus,
                winner: finalWinner,
                end_date: new Date().toISOString(),
            } as LeagueState;
            await saveLeagueToHistory(finalLeagueState, playersWithUpdatedStats);
        }

        // Close results modal and show card draw reminder
        setShowResultsModal(false);
        setCardDrawRound(leagueState.current_round);
        setShowCardDrawReminder(true);
    };

    const renderInProgress = () => {
        if (!leagueState) return <div className="text-white">加载中...</div>;
        
        // If league is not in progress or pending confirmation, redirect to league management
        if (leagueState.status === 'setup') {
            setCurrentPage('league');
            return <div className="text-white">重定向到联赛管理...</div>;
        }
        
        if (leagueState.status === 'finished') {
            return (
                <div className="space-y-4 sm:space-y-6">
                    <div className={`text-center p-6 sm:p-8 lg:p-10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg flex flex-col items-center gap-3 sm:gap-4 border-2 border-yellow-400 ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/80'}`}>
                        <LucideCrown className="text-yellow-400" size={60} />
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-300">
                                {leagueState.league_name || '联赛结束！'}
                            </h2>
                            {leagueState.season_number && (
                                <p className={`text-lg sm:text-xl mt-2 ${theme === 'dark' ? 'text-yellow-400/80' : 'text-yellow-600'}`}>
                                    Season {leagueState.season_number} 完成
                                </p>
                            )}
                        </div>
                        {leagueState.winner && (
                            <>
                                <div className="text-4xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4">{leagueState.winner.avatar}</div>
                                <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{leagueState.winner.name}</p>
                                <p className={`text-base sm:text-lg lg:text-xl mt-2 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{leagueState.winner.reason}</p>
                            </>
                        )}
                        <button 
                            onClick={handleResetLeague} 
                            className="mt-6 sm:mt-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base"
                        >
                            开启新联赛
                        </button>
                    </div>
                </div>
            );
        }
        
        if (!leagueState.schedule || leagueState.schedule.length === 0) return <div className="text-white">加载中...</div>;
        const currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
        if (!currentRoundConfig) return <div className="text-white">比赛结束！</div>;
        
        return (
            <div className="space-y-4 sm:space-y-6">
                {/* Combined League Header & Info */}
                <div className={`backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-gray-200/50'}`}>
                    {/* League Info Section */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`p-2.5 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                                <LucideTrophy className="text-orange-400" size={22} />
                            </div>
                            <div className="flex-1">
                                <h1 className={`${TYPOGRAPHY.COMBINATIONS.pageTitle} ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`}>
                                    {leagueState.league_name || 'Boom League'}
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                                    {leagueState.season_number && (
                                        <p className={`${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} ${LINE_HEIGHTS.normal}`}>
                                            Season {leagueState.season_number}
                                        </p>
                                    )}
                                    {leagueState.season_number && leagueState.created_at && (
                                        <span className={`hidden sm:inline ${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>•</span>
                                    )}
                                    {leagueState.created_at && (
                                        <p className={`${TYPOGRAPHY.COMBINATIONS.bodySmall} ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} ${LINE_HEIGHTS.normal}`}>
                                            创建于 {new Date(leagueState.created_at).toLocaleDateString('zh-CN', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={handleBackToLeagueManagement}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${
                                    theme === 'dark'
                                        ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50'
                                        : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 hover:text-gray-900 border border-gray-300/50'
                                } ${LINE_HEIGHTS.tight}`}
                            >
                                <LucideChevronLeft size={16} />
                                <span className="hidden xs:inline">返回管理</span>
                                <span className="xs:hidden">返回</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('确定要中止当前联赛吗？\n\n• 当前联赛将被删除\n• 如果已进行多轮比赛，进度将保存到历史记录\n• 玩家分数将被重置\n• 您将返回到联赛管理主页')) {
                                        handleAbortLeague();
                                    }
                                }}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.button} transition-all duration-200 ${
                                    theme === 'dark'
                                        ? 'bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800/50'
                                        : 'bg-red-100/50 hover:bg-red-200/50 text-red-700 hover:text-red-800 border border-red-300/50'
                                } ${LINE_HEIGHTS.tight}`}
                            >
                                <LucideX size={16} />
                                <span className="hidden xs:inline">中止联赛</span>
                                <span className="xs:hidden">中止</span>
                            </button>
                        </div>
                    </div>

                    {/* League Status Section */}
                    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100/50 border border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${theme === 'dark' ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-200'} border`}>
                                <LucideGamepad2 className="text-green-500" size={18} />
                            </div>
                            <div>
                                <p className={`${TYPOGRAPHY.COMBINATIONS.emphasized} ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'} ${LINE_HEIGHTS.tight}`}>
                                    联赛进行中
                                </p>
                                <p className={`${TYPOGRAPHY.COMBINATIONS.caption} ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} ${LINE_HEIGHTS.normal}`}>
                                    第 {leagueState.current_round} 轮 / 共 {GAME_RULES.MAX_ROUNDS} 轮
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg ${TYPOGRAPHY.COMBINATIONS.badge} ${
                            theme === 'dark' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-green-100 text-green-700 border border-green-200'
                        } ${LINE_HEIGHTS.tight} ${LETTER_SPACING.wide}`}>
                            ROUND {leagueState.current_round}
                        </div>
                    </div>
                </div>

                {/* Player Leaderboard - Always at the top */}
                <Leaderboard players={players} onPlayerClick={handlePlayerClick} />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Round Info Card */}
                    <div className={`backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-gray-200/50'}`}>
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <h2 className={`${TYPOGRAPHY.COMBINATIONS.sectionTitle} text-orange-400 ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`}>第 {leagueState.current_round} / {GAME_RULES.MAX_ROUNDS} 轮</h2>
                            <button 
                                onClick={() => setShowResultsModal(true)} 
                                className={`bg-green-500 hover:bg-green-600 active:bg-green-700 text-white ${TYPOGRAPHY.COMBINATIONS.button} py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${LINE_HEIGHTS.tight}`}
                            >
                                <LucideClipboardList size={18} className="flex-shrink-0" /> 
                                <span className="hidden xs:inline">输入本轮结果</span>
                                <span className="xs:hidden">结果</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base lg:text-lg">
                            <InfoCard icon={<LucideShield className="text-blue-400" />} title="安全牌数量" value={currentRoundConfig.safeCards} />
                            <InfoCard icon={<LucideBomb className="text-red-400" />} title="炸弹牌数量" value={currentRoundConfig.bombCards} />
                            <InfoCard icon={<LucideSwords className="text-yellow-400" />} title="出战手牌上限" value={currentRoundConfig.handLimit === Infinity ? "无限制" : currentRoundConfig.handLimit} />
                            <InfoCard icon={<LucideTrophy className="text-green-400" />} title="VP 奖励模式" value={currentRoundConfig.vpMode.name} />
                            <InfoCard icon={<LucideDices className="text-purple-400" />} title="特殊规则" value={currentRoundConfig.specialRule} />
                        </div>
                    </div>
                    
                    </div>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <ScheduleTimeline schedule={leagueState.schedule} currentRound={leagueState.current_round} />
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentPage = () => {
        if (!isHydrated || !isAuthReady) {
            return <div className="text-center text-2xl p-8">正在加载...</div>;
        }

        // If league is pending confirmation, show schedule confirmation page regardless of current page
        if (leagueState && leagueState.status === 'pending_confirmation') {
            return <ScheduleConfirmationPage 
                leagueState={leagueState}
                players={players}
                onConfirmSchedule={handleConfirmSchedule}
                onRerollSchedule={handleRerollSchedule}
            />;
        }

        switch (currentPage) {
            case 'home':
                return <HomePage 
                    leagueState={leagueState} 
                    players={players} 
                    handleStartLeague={handleStartLeague}
                    handleResetLeague={handleResetLeague}
                    handlePlayerClick={handlePlayerClick}
                    setCurrentPage={setCurrentPage}
                />;
            case 'registration':
                return <PlayerRegistrationPage 
                    players={players}
                    handleAddPlayer={handleAddPlayer}
                    handleDeletePlayer={handleDeletePlayer}
                    handlePlayerClick={handlePlayerClick}
                    newPlayerName={newPlayerName}
                    setNewPlayerName={setNewPlayerName}
                    selectedAvatar={selectedAvatar}
                    setSelectedAvatar={setSelectedAvatar}
                    showPlayerModal={showPlayerModal}
                    setShowPlayerModal={setShowPlayerModal}
                />;
            case 'league':
                return <LeagueManagementPage 
                    leagueState={leagueState}
                    players={players}
                    handleStartLeague={handleStartLeague}
                    handleResetLeague={handleResetLeague}
                    currentLeagueName={currentLeagueName}
                    setCurrentLeagueName={setCurrentLeagueName}
                    nextSeasonNumber={nextSeasonNumber}
                    leagueHistory={leagueHistory}
                    setCurrentPage={setCurrentPage}
                />;
            case 'in_progress':
                return renderInProgress();
            case 'rankings':
                return <PlayerRankingsPage 
                    players={players} 
                    onPlayerClick={handlePlayerClick}
                />;
            case 'history':
                return <LeagueHistoryPage 
                    leagueHistory={leagueHistory}
                />;
            default:
                return <HomePage 
                    leagueState={leagueState} 
                    players={players} 
                    handleStartLeague={handleStartLeague}
                    handleResetLeague={handleResetLeague}
                    handlePlayerClick={handlePlayerClick}
                    setCurrentPage={setCurrentPage}
                />;
        }
    };

    const themeClasses = {
        container: theme === 'dark' 
            ? "min-h-screen bg-[#0a0a0a] text-white font-sans flex relative overflow-hidden"
            : "min-h-screen bg-gray-50 text-gray-900 font-sans flex relative overflow-hidden",
        background: theme === 'dark' 
            ? "absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900"
            : "absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100",
        radialGlow1: theme === 'dark'
            ? "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.03)_0%,_transparent_50%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(0,0,0,0.02)_0%,_transparent_50%)]",
        radialGlow2: theme === 'dark'
            ? "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.08)_0%,_transparent_50%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(251,146,60,0.06)_0%,_transparent_50%)]",
        pattern: theme === 'dark'
            ? "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(255,255,255,0.02)_49%,_rgba(255,255,255,0.02)_51%,_transparent_52%)] bg-[length:20px_20px]"
            : "absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(0,0,0,0.01)_49%,_rgba(0,0,0,0.01)_51%,_transparent_52%)] bg-[length:20px_20px]"
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={themeClasses.container}>
                <div className={themeClasses.background}></div>
                <div className={themeClasses.radialGlow1}></div>
                <div className={themeClasses.radialGlow2}></div>
                <div className={themeClasses.pattern}></div>
            
                <Sidebar 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    musicPlaying={musicPlaying}
                    setMusicPlaying={setMusicPlaying}
                    musicMuted={musicMuted}
                    setMusicMuted={setMusicMuted}
                    onMusicToggle={toggleBackgroundMusic}
                />

                <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} relative`}>
                    {/* Mobile Header */}
                    <header className={`lg:hidden flex items-center justify-between p-3 sm:p-4 border-b ${theme === 'dark' ? 'border-white/10 bg-black/40' : 'border-gray-200/50 bg-white/80'} backdrop-blur-2xl sticky top-0 z-40`}>
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-200 border border-transparent active:scale-95 ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                        >
                            <LucideMenu size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg">
                                <LucideCat className="text-orange-400" size={16} />
                            </div>
                            <h1 className={`text-sm sm:text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} tracking-tight`}>Boom League</h1>
                        </div>
                        <div className="w-8 sm:w-10"></div> {/* Spacer for centering */}
                    </header>

                    {/* Main Content */}
                    <main className="p-3 sm:p-4 md:p-6 lg:p-8 relative z-10 min-h-screen">
                        {renderCurrentPage()}
                    </main>
                </div>

                {showPlayerModal && (
                    <Modal onClose={() => setShowPlayerModal(false)} title="Add New Player">
                        <div>
                            <div className="mb-4 sm:mb-6">
                                <label className={`font-medium mb-2 block text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>Player Name</label>
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    placeholder="Enter player name"
                                    className={`w-full p-3 sm:p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm text-base ${
                                        theme === 'dark' 
                                            ? 'bg-white/5 text-white border-white/10'
                                            : 'bg-white/80 text-gray-900 border-gray-200'
                                    }`}
                                />
                            </div>
                            
                            <div className="mb-4 sm:mb-6">
                                <label className={`font-medium mb-2 sm:mb-3 block text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-700'}`}>Choose Avatar</label>
                                <div className={`grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 sm:max-h-48 overflow-y-auto p-3 sm:p-4 rounded-lg border ${
                                    theme === 'dark' 
                                        ? 'bg-white/5 border-white/10'
                                        : 'bg-gray-50/80 border-gray-200'
                                }`}>
                                    {GAME_RULES.AVATARS.map((avatar, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`text-lg sm:text-xl p-2 sm:p-2.5 rounded-lg transition-all duration-200 border active:scale-95 ${
                                                selectedAvatar === avatar 
                                                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110' 
                                                    : theme === 'dark'
                                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                                                        : 'bg-white/50 border-gray-200 hover:bg-gray-100/50 hover:scale-105'
                                            }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAddPlayer} 
                                className="relative group w-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 active:from-emerald-500/40 active:to-emerald-600/40 text-emerald-400 font-semibold py-3 sm:py-4 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <LucidePlus size={18} />
                                    Add Player
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>
                        </div>
                    </Modal>
                )}

                {showResultsModal && leagueState && (
                    <ResultsModal
                        players={players}
                        onClose={() => setShowResultsModal(false)}
                        onSubmit={handleAdvanceRound}
                        round={leagueState.current_round}
                    />
                )}

                {showPlayerProfileModal && selectedPlayerForProfile && (
                    <PlayerProfileModal
                        player={selectedPlayerForProfile}
                        onClose={() => {
                            setShowPlayerProfileModal(false);
                            setSelectedPlayerForProfile(null);
                        }}
                    />
                )}

                {showCardDrawReminder && (
                    <CardDrawReminder
                        players={players}
                        round={cardDrawRound}
                        onClose={() => setShowCardDrawReminder(false)}
                    />
                )}

                {/* Audio enable prompt for mobile devices */}
                {!audioEnabled && isHydrated && (
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={enableAudioOnInteraction}
                    >
                        <div className={`p-6 rounded-xl max-w-sm text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                            <div className="text-4xl mb-4">🔊</div>
                            <h3 className="text-lg font-semibold mb-2">Enable Audio</h3>
                            <p className="text-sm opacity-75 mb-4">
                                Tap anywhere to enable music and sound effects on this device
                            </p>
                            <div className="text-xs opacity-50">
                                Required for mobile browsers
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ThemeContext.Provider>
    );
}