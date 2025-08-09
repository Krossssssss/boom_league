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
import SoundEffectsBox from '../components/ui/SoundEffectsBox';

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
    const [appId, setAppId] = useState<string>('default');
    const [currentPage, setCurrentPage] = useState<string>('home');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [musicPlaying, setMusicPlaying] = useState<boolean>(false);
    const [musicMuted, setMusicMuted] = useState<boolean>(true);
    const [leagueHistory, setLeagueHistory] = useState<LeagueHistory[]>([]);
    const [currentLeagueName, setCurrentLeagueName] = useState<string>('');
    const [nextSeasonNumber, setNextSeasonNumber] = useState<number>(1);

    // Load sidebar collapsed state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCollapsed = localStorage.getItem('sidebarCollapsed');
            if (savedCollapsed !== null) {
                setSidebarCollapsed(JSON.parse(savedCollapsed));
            }
        }
    }, []);

    // Save sidebar collapsed state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        }
    }, [sidebarCollapsed]);

    // Load music muted state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMuted = localStorage.getItem('musicMuted');
            if (savedMuted !== null) {
                setMusicMuted(JSON.parse(savedMuted));
            }
        }
    }, []);

    // Save music muted state to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('musicMuted', JSON.stringify(musicMuted));
        }
    }, [musicMuted]);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const canvasAppId = urlParams.get('app_id') || 'default';
            setAppId(canvasAppId);

            // Initialize theme from localStorage
            const savedTheme = localStorage.getItem('boom-league-theme') as 'light' | 'dark' | null;
            if (savedTheme) {
                setTheme(savedTheme);
            }

            supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

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
        }
    }, [])

    useEffect(() => {
        if (!isAuthReady || !supabase) return;

        // Load league history and set next season number
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
                    setLeagueHistory(historyData);
                    // Set next season number based on latest season
                    const latestSeason = historyData.length > 0 ? historyData[0].season_number : 0;
                    setNextSeasonNumber(latestSeason + 1);
                    setCurrentLeagueName(`Boom League S${latestSeason + 1}`);
                }
            } catch (error) {
                console.error('Error in loadLeagueHistory:', error);
            }
        };

        const fetchInitialData = async () => {
            const { data: leagueData, error: leagueError } = await supabase
                .from('league_state')
                .select('*')
                .eq('app_id', appId)
                .single();
            
            if (leagueData) {
                setLeagueState(leagueData);
                if (leagueData.winner) setWinner(leagueData.winner);
                else setWinner(null);
            } else {
                 setLeagueState(null);
            }
             if(leagueError && leagueError.code !== 'PGRST116') console.error("Error fetching league state:", leagueError);

            const { data: playersData, error: playersError } = await supabase
                .from('players')
                .select('*')
                .eq('app_id', appId)
                .order('score', { ascending: false });

            if (playersData) setPlayers(playersData);
            if (playersError) console.error("Error fetching players:", playersError);
        };

        fetchInitialData();
        loadLeagueHistory();

        const leagueChannel = supabase.channel(`league-state:${appId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'league_state', filter: `app_id=eq.${appId}` }, (payload: any) => {
                const updatedState = payload.new;
                setLeagueState(updatedState);
                if (updatedState.winner) setWinner(updatedState.winner);
                else setWinner(null);
            })
            .subscribe();

        const playersChannel = supabase.channel(`players:${appId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `app_id=eq.${appId}` }, 
            (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setPlayers(currentPlayers => {
                        const exists = currentPlayers.some(p => p.id === payload.new.id);
                        const next = exists ? currentPlayers : [...currentPlayers, payload.new];
                        return next.sort((a, b) => b.score - a.score);
                    });
                }
                if (payload.eventType === 'UPDATE') {
                    setPlayers(currentPlayers => currentPlayers.map(p => p.id === payload.new.id ? payload.new : p).sort((a, b) => b.score - a.score));
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
    }, [isAuthReady, appId]);

    const handleAddPlayer = async () => {
        console.log('handleAddPlayer called with:', { newPlayerName, selectedAvatar, playersLength: players.length });
        
        if (newPlayerName.trim() === "" || players.length >= 6) {
            console.log('handleAddPlayer early return:', { nameEmpty: newPlayerName.trim() === "", tooManyPlayers: players.length >= 6 });
            return;
        }

        const tempPlayer = {
            id: `temp_${Date.now()}`,
            app_id: appId,
            name: newPlayerName.trim(),
            avatar: selectedAvatar,
            score: 0,
            history: [],
            championships: 0,
            runnerUp: 0,
            thirdPlace: 0,
        } as any;

        console.log('Adding temp player:', tempPlayer);
        setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));

        console.log('Inserting into Supabase...');
        const { data, error } = await supabase
            .from('players')
            .insert({
                app_id: appId,
                name: tempPlayer.name,
                avatar: selectedAvatar,
                score: 0,
                history: [],
                championships: 0,
                runnerUp: 0,
                thirdPlace: 0,
            })
            .select()
            .single();

        console.log('Supabase insert result:', { data, error });

        if (error) {
            setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id));
            console.error('Add player failed:', error);
        } else if (data) {
            console.log('Successfully added player, updating temp player with real data:', data);
            setPlayers((curr) =>
                curr
                    .map((p) => (p.id === tempPlayer.id ? data : p))
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
            const safeCardMultipliers = [1, 2, 3, 4];
            // 炸弹牌数量只有两种可能：玩家数 × 1 或 玩家数 + 1
            const bombCardOptions = [playerCount, playerCount + 1];
            const handLimits = [4, 5, 6, Infinity];

            schedule.push({
                round: i + 1,
                safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
                bombCards: UTILS.getRandomElement(bombCardOptions),
                handLimit: UTILS.getRandomElement(handLimits),
                vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
                specialRule: UTILS.getRandomElement(selectedSpecialRules),
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
            status: 'pending_confirmation',
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
            .upsert(newLeagueState, { onConflict: 'app_id' });

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
        // Save current league to history before aborting (if it has made progress)
        if (leagueState && leagueState.current_round > 1) {
            await saveLeagueToHistory();
        }

        // Reset player scores and go back to setup
        setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
        setLeagueState({
            app_id: appId,
            status: 'setup',
            current_round: 0,
            schedule: [],
            winner: null,
        } as any);
        setWinner(null);
        setCurrentPage('league'); // Go back to league management

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
            console.error('Abort league errors:', pErr, lErr);
        }
    };

    const handleBackToLeagueManagement = () => {
        setCurrentPage('league');
    };

    const handlePlayerClick = (player: Player) => {
        setSelectedPlayerForProfile(player);
        setShowPlayerProfileModal(true);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        if (typeof window !== 'undefined') {
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
            .insert(historyEntry);

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
            
            player.score = newScore;
            player.history = [...player.history, { round: leagueState.current_round, placement: index + 1 }];

            playerUpdates.push(
                supabase
                    .from('players')
                    .update({ score: newScore, history: player.history })
                    .match({ id: playerId, app_id: appId })
            );
        }
        
        setPlayers(updatedPlayersData.sort((a, b) => b.score - a.score));
        await Promise.all(playerUpdates);
        
        const potentialWinners = updatedPlayersData
            .filter(p => p.score >= GAME_RULES.WIN_SCORE)
            .sort((a, b) => b.score - a.score);
        
        let potentialWinner = potentialWinners.length > 0 ? potentialWinners[0] : null;
        let nextRound = leagueState.current_round + 1;
        let newStatus = leagueState.status;
        let finalWinner = null;

        if (potentialWinner) {
            finalWinner = { name: potentialWinner.name, avatar: potentialWinner.avatar, reason: `在第 ${leagueState.current_round} 轮率先达到 ${potentialWinner.score} 分！` };
            newStatus = 'finished';
            
            potentialWinner.championships += 1;
            playerUpdates.push(
                supabase
                    .from('players')
                    .update({ championships: potentialWinner.championships })
                    .match({ id: potentialWinner.id, app_id: appId })
            );
        } else if (nextRound > GAME_RULES.MAX_ROUNDS) {
            newStatus = 'finished';
            const sortedPlayers = updatedPlayersData.sort((a, b) => b.score - a.score);
            const topScore = sortedPlayers[0].score;
            const winners = sortedPlayers.filter(p => p.score === topScore);
            if (winners.length > 1) {
                finalWinner = { name: winners.map(w => w.name).join(' 和 '), avatar: '⚔️', reason: `5轮后平分 (${topScore}分)，需要进行加赛对决！` };
            } else {
                finalWinner = { name: sortedPlayers[0].name, avatar: sortedPlayers[0].avatar, reason: `5轮后以最高分 (${topScore}分) 获胜！` };
                
                const champion = sortedPlayers[0];
                champion.championships += 1;
                playerUpdates.push(
                    supabase
                        .from('players')
                        .update({ championships: champion.championships })
                        .match({ id: champion.id, app_id: appId })
                );
                
                if (sortedPlayers.length >= 2) {
                    const runnerUp = sortedPlayers[1];
                    runnerUp.runnerUp += 1;
                    playerUpdates.push(
                        supabase
                            .from('players')
                            .update({ runnerUp: runnerUp.runnerUp })
                            .match({ id: runnerUp.id, app_id: appId })
                    );
                }
                
                if (sortedPlayers.length >= 3) {
                    const thirdPlace = sortedPlayers[2];
                    thirdPlace.thirdPlace += 1;
                    playerUpdates.push(
                        supabase
                            .from('players')
                            .update({ thirdPlace: thirdPlace.thirdPlace })
                            .match({ id: thirdPlace.id, app_id: appId })
                    );
                }
            }
        }
        
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

        // Save to history if league is finished
        if (newStatus === 'finished' && finalWinner) {
            const finalLeagueState = {
                ...leagueState,
                current_round: nextRound,
                status: newStatus,
                winner: finalWinner,
                end_date: new Date().toISOString(),
            } as LeagueState;
            await saveLeagueToHistory(finalLeagueState, updatedPlayersData);
        }

        setShowResultsModal(false);
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
                {/* League Navigation Header */}
                <div className={`backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-gray-200/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                                <LucideGamepad2 className="text-orange-400" size={20} />
                            </div>
                            <div>
                                <h1 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                    联赛进行中
                                </h1>
                                <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                    第 {leagueState.current_round} 轮 / 共 {GAME_RULES.MAX_ROUNDS} 轮
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={handleBackToLeagueManagement}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                                    theme === 'dark'
                                        ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/50'
                                        : 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 hover:text-gray-900 border border-gray-300/50'
                                }`}
                            >
                                <LucideChevronLeft size={16} />
                                <span className="hidden xs:inline">返回管理</span>
                                <span className="xs:hidden">返回</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('确定要中止当前联赛吗？进度将会保存到历史记录中。')) {
                                        handleAbortLeague();
                                    }
                                }}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                                    theme === 'dark'
                                        ? 'bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800/50'
                                        : 'bg-red-100/50 hover:bg-red-200/50 text-red-700 hover:text-red-800 border border-red-300/50'
                                }`}
                            >
                                <LucideX size={16} />
                                <span className="hidden xs:inline">中止联赛</span>
                                <span className="xs:hidden">中止</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Mobile: Stack everything vertically, Desktop: Sidebar layout */}
                    <div className="xl:col-span-1 flex flex-col gap-4 sm:gap-6 order-2 xl:order-1">
                        <Leaderboard players={players} onPlayerClick={handlePlayerClick} />
                    </div>
                    <div className="xl:col-span-2 flex flex-col gap-4 sm:gap-6 order-1 xl:order-2">
                    {/* Round Info Card */}
                    <div className={`backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-gray-200/50'}`}>
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-orange-400`}>第 {leagueState.current_round} / {GAME_RULES.MAX_ROUNDS} 轮</h2>
                            <button 
                                onClick={() => setShowResultsModal(true)} 
                                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
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
                    
                    {/* League Info Card */}
                    {leagueState.league_name && (
                        <div className={`backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-gray-200/50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'} border`}>
                                    <LucideTrophy className="text-orange-400" size={20} />
                                </div>
                                <div>
                                    <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'}`}>
                                        {leagueState.league_name}
                                    </h3>
                                    {leagueState.season_number && (
                                        <p className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
                                            Season {leagueState.season_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {leagueState.created_at && (
                                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'}`}>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>创建时间：</span>
                                        <span className={`${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                            {new Date(leagueState.created_at).toLocaleDateString('zh-CN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                     <ScheduleTimeline schedule={leagueState.schedule} currentRound={leagueState.current_round} />
                     <SoundEffectsBox />
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentPage = () => {
        if (!isAuthReady) {
            return <div className="text-center text-2xl p-8">正在连接服务器...</div>;
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
                />

                <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-0'} relative`}>
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

                {/* Background Music Player - Hidden iframe for audio-only playback */}
                {!musicMuted && (
                    <iframe
                        width="1"
                        height="1"
                        src={`https://www.youtube.com/embed/FeJKBFWYB0o?autoplay=${musicPlaying ? '1' : '0'}&loop=1&playlist=FeJKBFWYB0o&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&volume=30`}
                        title="Background Music"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        className="fixed top-0 left-0 opacity-0 pointer-events-none"
                        style={{ width: '1px', height: '1px', position: 'fixed', top: '-9999px', left: '-9999px' }}
                    ></iframe>
                )}
            </div>
        </ThemeContext.Provider>
    );
}