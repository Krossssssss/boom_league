// Game and Player Types
export interface Player {
    id: string;
    app_id: string;
    name: string;
    avatar: string;
    score: number;
    history: GameHistory[];
    
    // 联赛级别统计 (League-level statistics)
    leagueChampionships: number;     // 联赛冠军次数
    leagueRunnerUp: number;          // 联赛亚军次数
    leagueThirdPlace: number;        // 联赛季军次数
    
    // 单轮级别统计 (Round-level statistics)
    roundChampionships: number;      // 单轮冠军次数
    roundRunnerUp: number;           // 单轮亚军次数
    roundThirdPlace: number;         // 单轮季军次数
    
    // 分数统计 (Score statistics)
    totalVP: number;                 // 总VP获得数
    
    // 游戏统计 (Game statistics)
    totalLeagues: number;            // 总联赛数
    totalRounds: number;             // 总轮次数
    
    // 平均和胜率统计 (Average and win rate statistics)
    roundAveragePlacement: number;   // 单轮平均排名
    roundWinRate: number;            // 单轮胜率（冠亚季军都算获胜）
    
    // 兼容性字段 (Compatibility fields for existing code)
    championships?: number;          // 兼容旧代码，映射到leagueChampionships
    runnerUp?: number;              // 兼容旧代码，映射到leagueRunnerUp
    thirdPlace?: number;            // 兼容旧代码，映射到leagueThirdPlace
    totalGames?: number;            // 兼容旧代码，映射到totalLeagues
    averagePlacement?: number;      // 兼容旧代码，映射到roundAveragePlacement
    winRate?: number;               // 兼容旧代码，映射到roundWinRate
}

export interface GameHistory {
    round: number;
    placement: number;
}

export interface LeagueState {
    app_id: string;
    status: 'setup' | 'pending_confirmation' | 'in_progress' | 'finished';
    current_round: number;
    schedule: RoundConfig[];
    winner: Winner | null;
    league_name?: string;
    season_number?: number;
    start_date?: string;
    end_date?: string;
    created_at?: string;
    selected_special_rules?: string[];
}

export interface LeagueHistory {
    id: string;
    app_id: string;
    league_name: string;
    season_number: number;
    start_date: string;
    end_date: string;
    winner: Winner;
    final_standings: Player[];
    total_rounds: number;
    total_players: number;
    created_at: string;
}

export interface Winner {
    name: string;
    avatar: string;
    reason: string;
}

export interface RoundConfig {
    round: number;
    safeCards: number;
    bombCards: number;
    handLimit: number;
    vpMode: VPMode;
    specialRule: string;
    specialRules?: string[]; // For multiple special rules
}

export interface VPMode {
    name: string;
    scores: number[];
}

export interface PlayerStats {
    totalGames: number;
    placements: Record<number, number>;
    averagePlacement: string;
    winRate: string;
    championships: number;
    totalVP: number;
}

// Theme Types
export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// Component Props Types
export interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    musicPlaying: boolean;
    setMusicPlaying: (playing: boolean) => void;
    musicMuted: boolean;
    setMusicMuted: (muted: boolean) => void;
}

export interface LeaderboardProps {
    players: Player[];
    onPlayerClick?: (player: Player) => void;
}

export interface PlayerProfilesProps {
    players: Player[];
    onPlayerClick?: (player: Player) => void;
}

export interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
}

export interface ScheduleTimelineProps {
    schedule: RoundConfig[];
    currentRound: number;
}

export interface HomePageProps {
    leagueState: LeagueState | null;
    players: Player[];
    handleStartLeague: (selectedSpecialRules: string[]) => void;
    handleResetLeague: () => void;
    handlePlayerClick: (player: Player) => void;
    setCurrentPage: (page: string) => void;
}

export interface PlayerRegistrationPageProps {
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

export interface LeagueManagementPageProps {
    leagueState: LeagueState | null;
    players: Player[];
    handleStartLeague: (selectedSpecialRules: string[]) => void;
    handleResetLeague: () => void;
    currentLeagueName: string;
    setCurrentLeagueName: (name: string) => void;
    nextSeasonNumber: number;
    leagueHistory: LeagueHistory[];
    setCurrentPage: (page: string) => void;
}

export interface PlayerRankingsPageProps {
    players: Player[];
    onPlayerClick: (player: Player) => void;
}

export interface PlayerProfileModalProps {
    player: Player;
    onClose: () => void;
}

export interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title: string;
}

export interface ResultsModalProps {
    players: Player[];
    onClose: () => void;
    onSubmit: (results: string[]) => void;
    round: number;
}
