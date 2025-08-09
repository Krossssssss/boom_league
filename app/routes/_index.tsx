import React, { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LucideCat, LucideSwords, LucideCrown, LucideShield, LucideBomb, LucideScrollText, LucideUsers, LucidePlus, LucideTrash2, LucideTrophy, LucideDices, LucideClipboardList, LucideUser, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideMenu, LucideX, LucideSun, LucideMoon } from 'lucide-react';

// Theme Context
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Type definitions
interface Player {
    id: string;
    app_id: string;
    name: string;
    avatar: string;
    score: number;
    history: GameHistory[];
    championships: number;
    runnerUp: number;      // 亚军次数
    thirdPlace: number;    // 季军次数
}

interface GameHistory {
    round: number;
    placement: number;
}

interface LeagueState {
    app_id: string;
    status: 'setup' | 'in_progress' | 'finished';
    current_round: number;
    schedule: RoundConfig[];
    winner: Winner | null;
}

interface Winner {
    name: string;
    avatar: string;
    reason: string;
}

interface RoundConfig {
    round: number;
    safeCards: number;
    bombCards: number;
    handLimit: number;
    vpMode: VPMode;
    specialRule: string;
}

interface VPMode {
    name: string;
    scores: number[];
}

interface PlayerStats {
    totalGames: number;
    placements: Record<number, number>;
    averagePlacement: string;
    winRate: string;
    championships: number;
}

// Component prop interfaces
interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    players: Player[];
    onPlayerClick: (player: Player) => void;
}

interface LeaderboardProps {
    players: Player[];
    onPlayerClick?: (player: Player) => void;
}

interface PlayerProfilesProps {
    players: Player[];
    onPlayerClick?: (player: Player) => void;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
}

interface ScheduleTimelineProps {
    schedule: RoundConfig[];
    currentRound: number;
}

interface HomePageProps {
    leagueState: LeagueState | null;
    players: Player[];
    handleStartLeague: () => void;
    handleResetLeague: () => void;
    handlePlayerClick: (player: Player) => void;
}

interface PlayerRegistrationPageProps {
    players: Player[];
    handleAddPlayer: () => void;
    handleDeletePlayer: (playerId: string) => void;
    handlePlayerClick: (player: Player) => void;
    newPlayerName: string;
    setNewPlayerName: (name: string) => void;
    selectedAvatar: string;
    setSelectedAvatar: (avatar: string) => void;
    showPlayerModal: boolean;
    setShowPlayerModal: (show: boolean) => void;
}

interface LeagueManagementPageProps {
    leagueState: LeagueState | null;
    players: Player[];
    handleStartLeague: () => void;
    handleResetLeague: () => void;
    renderInProgress: () => React.ReactNode;
    setShowResultsModal: (show: boolean) => void;
}

interface PlayerRankingsPageProps {
    players: Player[];
    onPlayerClick: (player: Player) => void;
}

interface PlayerProfileModalProps {
    player: Player;
    onClose: () => void;
}

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
}

interface ResultsModalProps {
    players: Player[];
    onClose: () => void;
    onSubmit: (results: string[]) => void;
    round: number;
}

// --- Supabase 配置 ---
const supabaseUrl = 'https://gatiuwpldvmxeeraldue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdGl1d3BsZHZteGVlcmFsZHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MDAwNjQsImV4cCI6MjA3MDI3NjA2NH0.Ncs_pWIXZJ5gVw9PasggTAGWgQX9OnUGTnpjHg1eZvE';

let supabase: any;

// --- 随机数据生成器 ---
const UTILS = {
    getRandomElement: (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)],
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
            championships: player.championships || 0
        };
    }
};

// --- 游戏规则常量 ---
const GAME_RULES = {
    WIN_SCORE: 12,
    MAX_ROUNDS: 5,
    VP_MODES: [
        { name: "5分局 (5/3/1)", scores: [5, 3, 1, 0, 0, 0] },
        { name: "5分局 (5/4/3)", scores: [5, 4, 3, 0, 0, 0] },
        { name: "4分局 (4/2/1)", scores: [4, 2, 1, 0, 0, 0] },
        { name: "4分局 (4/3/2)", scores: [4, 3, 2, 0, 0, 0] },
        { name: "3分局 (3/2/1)", scores: [3, 2, 1, 0, 0, 0] },
        { name: "3分局 (3/1/0)", scores: [3, 1, 0, 0, 0, 0] },
    ],
    SPECIAL_RULES: [
        "无特殊规则",
        "手牌明牌",
        "禁止使用 Skip",
        "猫牌视为 Skip",
    ],
    AVATARS: [
        '😼', '😻', '🙀', '😿', '😾', '😸', '😹', '😺', '😽',
        '🐱', '🐈', '🐈‍⬛', '🦁', '🐅', '🐆', '🐯', '🙈', '🙉', 
        '🙊', '🐵', '🦊', '🐺', '🐶', '🐕', '🦝', '🐨', '🐼',
        '🐹', '🐭', '🐰', '🐻', '🐻‍❄️', '🐸', '🐲', '🦄', '🎭'
    ],
};

// --- 主应用组件 ---
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

            supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    // --- 联赛管理功能 ---
    const handleAddPlayer = async () => {
        if (newPlayerName.trim() === "" || players.length >= 6) return;

        const tempPlayer = {
            id: `temp_${Date.now()}`,
            app_id: appId,
            name: newPlayerName.trim(),
            avatar: selectedAvatar,
            score: 0,
            history: [],
            championships: 0,
            runnerUp: 0,      // 亚军次数
            thirdPlace: 0,    // 季军次数
        } as any;

        // Optimistic add
        setPlayers((curr) => [...curr, tempPlayer].sort((a, b) => b.score - a.score));

        const { data, error } = await supabase
            .from('players')
            .insert({
                app_id: appId,
                name: tempPlayer.name,
                avatar: selectedAvatar,
                score: 0,
                history: [],
                championships: 0,
                runnerUp: 0,      // 亚军次数
                thirdPlace: 0,    // 季军次数
            })
            .select()
            .single();

        if (error) {
            // Rollback optimistic add on error
            setPlayers((curr) => curr.filter((p) => p.id !== tempPlayer.id));
            console.error('Add player failed:', error);
        } else if (data) {
            // Replace temp with real row
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
        // Optimistic remove
        const previous = players;
        setPlayers((curr) => curr.filter((p) => p.id !== playerId));

        const { error } = await supabase
            .from('players')
            .delete()
            .match({ id: playerId, app_id: appId });

        if (error) {
            console.error('Delete player failed:', error);
            // Rollback on error
            setPlayers(previous);
        }
    };

    const generateSchedule = (playerCount: number): RoundConfig[] => {
        let schedule: RoundConfig[] = [];
        for (let i = 0; i < GAME_RULES.MAX_ROUNDS; i++) {
            const safeCardMultipliers = [1, 2, 3, 4];
            const bombCardAdditions = [1, playerCount + 1];
            const handLimits = [4, 5, 6, Infinity];

            schedule.push({
                round: i + 1,
                safeCards: playerCount * UTILS.getRandomElement(safeCardMultipliers),
                bombCards: UTILS.getRandomElement(bombCardAdditions),
                handLimit: UTILS.getRandomElement(handLimits),
                vpMode: UTILS.getRandomElement(GAME_RULES.VP_MODES),
                specialRule: UTILS.getRandomElement(GAME_RULES.SPECIAL_RULES),
            });
        }
        return schedule;
    };

    const handleStartLeague = async () => {
        if (players.length < 2) return;

        const schedule = generateSchedule(players.length);

        // Optimistic state update
        setLeagueState({
            app_id: appId,
            status: 'in_progress',
            current_round: 1,
            schedule,
            winner: null,
        } as any);

        const { error } = await supabase
            .from('league_state')
            .upsert(
                {
                    app_id: appId,
                    status: 'in_progress',
                    current_round: 1,
                    schedule: schedule,
                    winner: null,
                },
                { onConflict: 'app_id' }
            );

        if (error) {
            console.error('Start league failed:', error);
        }
    };

    const handleResetLeague = async () => {
        // Optimistic players reset
        setPlayers((curr) => curr.map((p) => ({ ...p, score: 0, history: [] })));
        // Optimistic league state reset
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
        // Optimistic players update
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
            
            // Update championship count for winner
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
                
                // Update championship count for winner
                const champion = sortedPlayers[0];
                champion.championships += 1;
                playerUpdates.push(
                    supabase
                        .from('players')
                        .update({ championships: champion.championships })
                        .match({ id: champion.id, app_id: appId })
                );
                
                // Update runner-up and third place counts
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
        
        // Optimistic league state update
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

        setShowResultsModal(false);
    };


    // --- 渲染组件 ---
    const renderInProgress = () => {
        if (!leagueState || !leagueState.schedule || leagueState.schedule.length === 0) return <div className="text-white">加载中...</div>;
        const currentRoundConfig = leagueState.schedule[leagueState.current_round - 1];
        if (!currentRoundConfig) return <div className="text-white">比赛结束！</div>;
        
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <Leaderboard players={players} onPlayerClick={handlePlayerClick} />
                    <PlayerProfiles players={players} onPlayerClick={handlePlayerClick} />
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-bold text-orange-400">第 {leagueState.current_round} / {GAME_RULES.MAX_ROUNDS} 轮</h2>
                            <button onClick={() => setShowResultsModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2">
                                <LucideClipboardList size={20} /> 输入本轮结果
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            <InfoCard icon={<LucideShield className="text-blue-400" />} title="安全牌数量" value={currentRoundConfig.safeCards} />
                            <InfoCard icon={<LucideBomb className="text-red-400" />} title="炸弹牌数量" value={currentRoundConfig.bombCards} />
                            <InfoCard icon={<LucideSwords className="text-yellow-400" />} title="出战手牌上限" value={currentRoundConfig.handLimit === Infinity ? "无限制" : currentRoundConfig.handLimit} />
                            <InfoCard icon={<LucideTrophy className="text-green-400" />} title="VP 奖励模式" value={currentRoundConfig.vpMode.name} />
                            <InfoCard icon={<LucideDices className="text-purple-400" />} title="特殊规则" value={currentRoundConfig.specialRule} />
                        </div>
                    </div>
                     <ScheduleTimeline schedule={leagueState.schedule} currentRound={leagueState.current_round} />
                </div>
            </div>
        );
    };

    const renderCurrentPage = () => {
        if (!isAuthReady) {
            return <div className="text-center text-2xl p-8">正在连接服务器...</div>;
        }

        switch (currentPage) {
            case 'home':
                return <HomePage 
                    leagueState={leagueState} 
                    players={players} 
                    handleStartLeague={handleStartLeague}
                    handleResetLeague={handleResetLeague}
                    handlePlayerClick={handlePlayerClick}
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
                    renderInProgress={renderInProgress}
                    setShowResultsModal={setShowResultsModal}
                />;
            case 'rankings':
                return <PlayerRankingsPage 
                    players={players} 
                    onPlayerClick={handlePlayerClick}
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
                {/* Premium background with multiple layers */}
                <div className={themeClasses.background}></div>
                <div className={themeClasses.radialGlow1}></div>
                <div className={themeClasses.radialGlow2}></div>
                <div className={themeClasses.pattern}></div>
            
            {/* Sidebar */}
            <Sidebar 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                players={players}
                onPlayerClick={handlePlayerClick}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ml-0 relative">
                {/* Mobile header */}
                <header className={`lg:hidden flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-white/10 bg-black/40' : 'border-gray-200/50 bg-white/80'} backdrop-blur-2xl`}>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className={`p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                    >
                        <LucideMenu size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg">
                            <LucideCat className="text-orange-400" size={18} />
                        </div>
                        <h1 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} tracking-tight`}>Boom League</h1>
                    </div>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-8 relative z-10">
                    {renderCurrentPage()}
                </main>
            </div>

                {showPlayerModal && (
                    <Modal onClose={() => setShowPlayerModal(false)} title="Add New Player">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="text-white/90 font-medium mb-2 block text-sm">Player Name</label>
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    placeholder="Enter player name"
                                    className="w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all duration-200 backdrop-blur-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="text-white/90 font-medium mb-3 block text-sm">Choose Avatar</label>
                                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto bg-white/5 p-4 rounded-lg border border-white/10">
                                    {GAME_RULES.AVATARS.map((avatar, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedAvatar(avatar)}
                                            className={`text-xl p-2.5 rounded-lg transition-all duration-200 border ${
                                                selectedAvatar === avatar 
                                                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.3)] scale-110' 
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                                            }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAddPlayer} 
                                className="relative group bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 text-emerald-400 font-semibold py-3 px-6 rounded-lg border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                            >
                                <span className="relative z-10">Add Player</span>
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
            </div>
        </ThemeContext.Provider>
    );
}

// --- 子组件 ---

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, players, onPlayerClick }) => {
    const { theme, toggleTheme } = useTheme();
    
    const menuItems = [
        { id: 'home', name: '首页', icon: LucideHome },
        { id: 'registration', name: '玩家注册', icon: LucideUserPlus },
        { id: 'league', name: '联赛管理', icon: LucideGamepad2 },
        { id: 'rankings', name: '排行榜', icon: LucideBarChart3 },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full ${theme === 'dark' ? 'bg-black/40' : 'bg-white/80'} backdrop-blur-2xl border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto w-64 ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'}`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-white/5 to-transparent' : 'bg-gradient-to-b from-gray-50/50 to-transparent'}`}></div>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`relative p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                                    <LucideCat className="text-orange-400" size={20} />
                                </div>
                                <div>
                                    <h2 className={`text-base font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Boom League</h2>
                                    <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} font-medium`}>Tournament Tracker</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                >
                                    {theme === 'dark' ? <LucideSun size={18} /> : <LucideMoon size={18} />}
                                </button>
                                <button 
                                    onClick={() => setSidebarOpen(false)}
                                    className={`lg:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <LucideX size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 relative z-10">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => {
                                                setCurrentPage(item.id);
                                                setSidebarOpen(false);
                                            }}
                                            className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 overflow-hidden ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]'
                                                    : theme === 'dark' 
                                                        ? 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                                                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                                            }`}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm"></div>
                                            )}
                                            <Icon size={16} className="relative z-10" />
                                            <span className="font-medium text-sm relative z-10">{item.name}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Quick Player List (only show when not on rankings page) */}
                    {currentPage !== 'rankings' && players.length > 0 && (
                        <div className={`relative p-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
                            <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} mb-3 uppercase tracking-wider`}>Quick Access</h3>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {players.slice(0, 4).map((player) => (
                                    <button
                                        key={player.id}
                                        onClick={() => onPlayerClick(player)}
                                        className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 border border-transparent ${
                                            theme === 'dark' 
                                                ? 'text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10'
                                                : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 hover:border-gray-200'
                                        }`}
                                    >
                                        <span className="text-base">{player.avatar}</span>
                                        <span className="truncate font-medium">{player.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-6">
                <div className="relative p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                    <LucideTrophy size={16} className="text-yellow-400" />
                </div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Leaderboard</h3>
            </div>
            <div className="space-y-2">
                {players.map((p, index) => (
                    <div 
                        key={p.id} 
                        className={`group relative flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                            theme === 'dark' 
                                ? 'hover:bg-white/5 hover:border-white/10'
                                : 'hover:bg-gray-100/50 hover:border-gray-200'
                        }`}
                        onClick={() => onPlayerClick && onPlayerClick(p)}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 
                                index === 1 ? `bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-gray-400/30 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}` : 
                                index === 2 ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-orange-500/30 text-orange-400' : 
                                theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-100/50 border-gray-200 text-gray-600'
                            }`}>
                                {index + 1}
                            </div>
                            <span className="text-xl">{p.avatar}</span>
                            <span className={`font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{p.name}</span>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-lg text-emerald-400">{p.score}</div>
                            <div className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'} font-medium`}>VP</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

const PlayerProfiles: React.FC<PlayerProfilesProps> = ({ players, onPlayerClick }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <LucideUsers size={16} className="text-blue-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Player Profiles</h3>
                </div>
                <div className="space-y-2">
                    {players.map(p => (
                        <div 
                            key={p.id} 
                            className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                                theme === 'dark' 
                                    ? 'hover:bg-white/5 hover:border-white/10'
                                    : 'hover:bg-gray-100/50 hover:border-gray-200'
                            }`}
                            onClick={() => onPlayerClick && onPlayerClick(p)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xl">{p.avatar}</span>
                                <span className={`font-medium ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{p.name}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-xs font-medium text-yellow-400">
                                    <span>🏆</span>
                                    <span>{p.championships || 0} 冠军</span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-400/10 border border-gray-400/20 rounded-md text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <span>🥈</span>
                                    <span>{p.runnerUp || 0} 亚军</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-xs font-medium text-orange-400">
                                    <span>🥉</span>
                                    <span>{p.thirdPlace || 0} 季军</span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                                    theme === 'dark' 
                                        ? 'bg-white/5 border-white/10 text-white/70'
                                        : 'bg-gray-100/50 border-gray-200 text-gray-600'
                                } border`}>
                                    {p.history.length > 0 ? `${p.history.length} Games` : 'New Player'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg p-5 transition-all duration-200 ${theme === 'dark' ? 'hover:bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.2)]' : 'hover:bg-gray-100/50 shadow-[0_0_30px_rgba(0,0,0,0.1)]'}`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'} rounded-lg`}></div>
            <div className="relative z-10 flex items-center gap-4">
                <div className={`p-2.5 backdrop-blur-sm border rounded-lg ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-100/50 border-gray-200'}`}>
                    {icon}
                </div>
                <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>{title}</p>
                    <p className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                </div>
            </div>
        </div>
    );
};

const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ schedule, currentRound }) => {
    const { theme } = useTheme();
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-black/20' : 'bg-white/60'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} rounded-lg ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.3)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'} overflow-hidden`}>
            <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-white/5 to-transparent' : 'bg-gradient-to-br from-gray-50/50 to-transparent'}`}></div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                        <LucideScrollText size={16} className="text-indigo-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Tournament Schedule</h3>
                </div>
                <div className="space-y-2">
                    {schedule.map(roundInfo => {
                        const isActive = roundInfo.round === currentRound;
                        return (
                            <div key={roundInfo.round} className={`relative p-4 rounded-lg transition-all duration-300 border ${
                                isActive 
                                    ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.1)]' 
                                    : theme === 'dark'
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                        : 'bg-gray-100/50 border-gray-200 hover:bg-gray-200/50'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <p className={`font-semibold text-base ${isActive ? 'text-orange-400' : theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                                        Round {roundInfo.round}
                                    </p>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                                    )}
                                </div>
                                <p className={`text-sm mt-1 font-medium ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>{roundInfo.vpMode.name} • {roundInfo.specialRule}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Page Components
const HomePage: React.FC<HomePageProps> = ({ leagueState, players, handleStartLeague, handleResetLeague, handlePlayerClick }) => {
    if (!leagueState || leagueState.status === 'setup') {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center gap-6 mb-8">
                        <div className="relative p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                            <LucideCat className="text-orange-400" size={40} />
                        </div>
                        <div className="text-left">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent tracking-tight">
                                Boom League
                            </h1>
                            <p className="text-white/60 text-lg font-medium mt-2">Professional Tournament Management</p>
                        </div>
                    </div>
                </div>
                
                {players.length > 0 && (
                    <div className="relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                                <h2 className="text-2xl font-semibold text-white/95 tracking-tight">Quick Start</h2>
                            </div>
                            <p className="text-white/70 mb-8 text-lg">
                                <span className="text-orange-400 font-semibold">{players.length}</span> players registered and ready to compete
                            </p>
                            <button 
                                onClick={handleStartLeague} 
                                disabled={players.length < 2}
                                className="relative group bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 text-orange-400 font-semibold py-4 px-8 rounded-lg border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-all duration-200 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] disabled:from-white/5 disabled:to-white/5 disabled:text-white/40 disabled:border-white/10 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <span className="relative z-10">Start New Tournament</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    if (leagueState.status === 'in_progress') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛进行中</h2>
                    <p className="text-gray-300">第 {leagueState.current_round} / {GAME_RULES.MAX_ROUNDS} 轮</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Leaderboard players={players} onPlayerClick={handlePlayerClick} />
                    <PlayerProfiles players={players} onPlayerClick={handlePlayerClick} />
                </div>
            </div>
        );
    }
    
    if (leagueState.status === 'finished') {
        return (
            <div className="space-y-6">
                <div className="text-center p-10 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400">
                    <LucideCrown className="text-yellow-400" size={80} />
                    <h2 className="text-5xl font-bold text-yellow-300">联赛结束！</h2>
                    {leagueState.winner && (
                        <>
                            <div className="text-6xl mt-4">{leagueState.winner.avatar}</div>
                            <p className="text-4xl font-bold text-white mt-2">{leagueState.winner.name}</p>
                            <p className="text-xl text-gray-300 mt-2">{leagueState.winner.reason}</p>
                        </>
                    )}
                    <button 
                        onClick={handleResetLeague} 
                        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        开启新联赛
                    </button>
                </div>
            </div>
        );
    }
};

const PlayerRegistrationPage: React.FC<PlayerRegistrationPageProps> = ({ players, handleAddPlayer, handleDeletePlayer, handlePlayerClick, newPlayerName, setNewPlayerName, selectedAvatar, setSelectedAvatar, showPlayerModal, setShowPlayerModal }) => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">
                    玩家注册
                </h2>
                <p className="text-slate-400 text-lg">管理参与联赛的玩家</p>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></div>
                        已注册玩家 
                        <span className="text-orange-400">({players.length}/6)</span>
                    </h3>
                    <button 
                        onClick={() => setShowPlayerModal(true)} 
                        disabled={players.length >= 6}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                    >
                        <LucidePlus size={18} /> 添加玩家
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {players.map(p => {
                        const stats = UTILS.calculatePlayerStats(p);
                        return (
                            <div key={p.id} className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/60 p-5 rounded-2xl border border-slate-700/30 cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-lg">
                                <div 
                                    className="flex items-center gap-4 flex-1"
                                    onClick={() => handlePlayerClick(p)}
                                >
                                    <div className="text-4xl">{p.avatar}</div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white text-lg">{p.name}</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {stats.championships > 0 && (
                                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                                                    🏆 {stats.championships}冠
                                                </span>
                                            )}
                                            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
                                                {stats.totalGames > 0 ? `${stats.totalGames}场 • ${stats.winRate}%胜率` : '新玩家'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlayer(p.id);
                                    }} 
                                    className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
                                >
                                    <LucideTrash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const LeagueManagementPage: React.FC<LeagueManagementPageProps> = ({ leagueState, players, handleStartLeague, handleResetLeague, renderInProgress, setShowResultsModal }) => {
    if (!leagueState || leagueState.status === 'setup') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className="text-gray-300">创建和管理你的 Boom League</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">创建新联赛</h3>
                    <p className="text-gray-300 mb-4">
                        当前有 {players.length} 名玩家注册。需要至少 2 名玩家才能开始联赛。
                    </p>
                    <button 
                        onClick={handleStartLeague} 
                        disabled={players.length < 2}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-xl transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        开始联赛
                    </button>
                </div>
            </div>
        );
    }
    
    if (leagueState.status === 'in_progress') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className="text-gray-300">当前联赛进行中</p>
                </div>
                {renderInProgress()}
            </div>
        );
    }
    
    if (leagueState.status === 'finished') {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-orange-400 mb-2">联赛管理</h2>
                    <p className="text-gray-300">联赛已结束</p>
                </div>
                
                <div className="text-center p-10 bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center gap-4 border-2 border-yellow-400">
                    <LucideCrown className="text-yellow-400" size={80} />
                    <h2 className="text-3xl font-bold text-yellow-300">联赛结束！</h2>
                    {leagueState.winner && (
                        <>
                            <div className="text-4xl mt-4">{leagueState.winner.avatar}</div>
                            <p className="text-2xl font-bold text-white mt-2">{leagueState.winner.name}</p>
                            <p className="text-lg text-gray-300 mt-2">{leagueState.winner.reason}</p>
                        </>
                    )}
                    <button 
                        onClick={handleResetLeague} 
                        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        开启新联赛
                    </button>
                </div>
            </div>
        );
    }
};

const PlayerRankingsPage: React.FC<PlayerRankingsPageProps> = ({ players, onPlayerClick }) => {
    const sortedPlayers = [...players].sort((a, b) => {
        // Sort by championships first, then by current score
        if (b.championships !== a.championships) {
            return (b.championships || 0) - (a.championships || 0);
        }
        return b.score - a.score;
    });

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-orange-400 mb-2">玩家排行榜</h2>
                <p className="text-gray-300">查看所有玩家的详细统计和排名</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <LucideTrophy className="text-yellow-400" />
                    总排行榜
                </h3>
                
                <div className="space-y-4">
                    {sortedPlayers.map((player, index) => {
                        const stats = UTILS.calculatePlayerStats(player);
                        return (
                            <div 
                                key={player.id}
                                className="flex items-center justify-between bg-gray-700/70 p-4 rounded-lg shadow-md hover:bg-gray-600/70 cursor-pointer transition-colors"
                                onClick={() => onPlayerClick(player)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold text-2xl w-8 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-3xl">{player.avatar}</span>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white text-xl">{player.name}</span>
                                        <div className="flex gap-4 text-sm text-gray-400">
                                            <span>🏆 {stats.championships}冠</span>
                                            <span>🎮 {stats.totalGames}场</span>
                                            <span>📊 胜率{stats.winRate}%</span>
                                            <span>📈 平均排名{stats.averagePlacement}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-400">{player.score}</div>
                                    <div className="text-sm text-gray-400">当前分数</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {players.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <LucideUsers size={48} className="mx-auto mb-4 opacity-50" />
                        <p>还没有注册的玩家</p>
                        <p className="text-sm">前往玩家注册页面添加玩家</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, onClose }) => {
    if (!player) return null;
    
    const stats = UTILS.calculatePlayerStats(player);
    
    return (
        <Modal onClose={onClose} title={`${player.avatar} ${player.name} 的档案`}>
            <div className="space-y-6">
                {/* Basic Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-yellow-400">{player.championships || 0}</p>
                        <p className="text-sm text-white/70">🏆 冠军次数</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-300">{player.runnerUp || 0}</p>
                        <p className="text-sm text-white/70">🥈 亚军次数</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-400">{player.thirdPlace || 0}</p>
                        <p className="text-sm text-white/70">🥉 季军次数</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-emerald-400">{player.score}</p>
                        <p className="text-sm text-white/70">当前分数</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.totalGames}</p>
                        <p className="text-sm text-white/70">总游戏数</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-400">{stats.averagePlacement}</p>
                        <p className="text-sm text-white/70">平均排名</p>
                    </div>
                </div>

                {/* Win Rate */}
                <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-semibold">胜率</span>
                        <span className="text-orange-400 font-bold">{stats.winRate}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300" 
                            style={{width: `${stats.winRate}%`}}
                        ></div>
                    </div>
                </div>

                {/* Placement Distribution */}
                {stats.totalGames > 0 && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-3">排名分布</h4>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6].map(place => {
                                const count = stats.placements[place] || 0;
                                const percentage = stats.totalGames > 0 ? (count / stats.totalGames * 100).toFixed(1) : 0;
                                return count > 0 ? (
                                    <div key={place} className="flex justify-between items-center">
                                        <span className={`text-sm ${place === 1 ? 'text-yellow-400' : place === 2 ? 'text-gray-300' : place === 3 ? 'text-orange-400' : 'text-gray-500'}`}>
                                            第{place}名
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-sm">{count}次</span>
                                            <span className="text-gray-400 text-xs">({percentage}%)</span>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Games */}
                {player.history && player.history.length > 0 && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-white font-semibold mb-3">最近比赛</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {player.history.slice(-5).reverse().map((game, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">第{game.round}轮</span>
                                    <span className={`font-semibold ${game.placement === 1 ? 'text-yellow-400' : game.placement === 2 ? 'text-gray-300' : game.placement === 3 ? 'text-orange-400' : 'text-gray-500'}`}>
                                        第{game.placement}名
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent tracking-tight">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 border border-transparent hover:border-white/20"
                    >
                        <LucideX size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    </div>
);

const ResultsModal: React.FC<ResultsModalProps> = ({ players, onClose, onSubmit, round }) => {
    const [rankedPlayers, setRankedPlayers] = useState(players.map(p => p.id));

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("draggedIndex", index.toString());
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
        const newRankedPlayers = [...rankedPlayers];
        const [draggedItem] = newRankedPlayers.splice(draggedIndex, 1);
        newRankedPlayers.splice(dropIndex, 0, draggedItem);
        setRankedPlayers(newRankedPlayers);
    };

    const getPlayerById = (id: string) => players.find(p => p.id === id);

    return (
        <Modal onClose={onClose} title={`输入第 ${round} 轮比赛结果`}>
            <p className="text-gray-400 mb-4">请拖动玩家卡片以确定本轮名次（从上到下为 1-N 名）。</p>
            <div className="space-y-2">
                {rankedPlayers.map((playerId, index) => {
                    const player = getPlayerById(playerId);
                    if (!player) return null;
                    return (
                        <div
                            key={playerId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                            className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing"
                        >
                            <span className="font-bold text-lg text-orange-400 w-6">{index + 1}</span>
                            <span className="text-2xl">{player.avatar}</span>
                            <span className="text-white font-semibold">{player.name}</span>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => onSubmit(rankedPlayers)}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
                确认并进入下一轮
            </button>
        </Modal>
    );
};
