// Game and Player Types
export interface Player {
    id: string;
    app_id: string;
    name: string;
    avatar: string;
    score: number;
    history: GameHistory[];
    
    // 数据库字段 (Direct database fields)
    championships: number;           // 联赛冠军次数 (league-level championships)
    runner_up: number;               // 联赛亚军次数 (league-level runner-up)
    third_place: number;             // 联赛季军次数 (league-level third place)
    total_vp: number;                // 总VP获得数
    total_games: number;             // 总游戏数 (total leagues participated)
    average_placement: number;       // 平均排名
    win_rate: number;                // 胜率
    single_round_firsts: number;     // 单轮冠军次数
    single_round_seconds: number;    // 单轮亚军次数
    single_round_thirds: number;     // 单轮季军次数
    
    // 时间戳字段 (Timestamp fields)
    created_at?: string;
    updated_at?: string;
    
    // 排名信息 (Rankings among all players)
    rankings?: {
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
    };
    
    // 兼容性字段 (Compatibility fields for legacy code)
    leagueChampionships?: number;    // 映射到championships
    leagueRunnerUp?: number;         // 映射到runner_up
    leagueThirdPlace?: number;       // 映射到third_place
    roundChampionships?: number;     // 映射到single_round_firsts
    roundRunnerUp?: number;          // 映射到single_round_seconds
    roundThirdPlace?: number;        // 映射到single_round_thirds
    totalVP?: number;                // 映射到total_vp
    totalLeagues?: number;           // 映射到total_games
    totalRounds?: number;            // 计算得出（从history或其他方式）
    roundAveragePlacement?: number;  // 映射到average_placement
    roundWinRate?: number;           // 映射到win_rate
    totalGames?: number;             // 映射到total_games
    averagePlacement?: number;       // 映射到average_placement
    winRate?: number;                // 映射到win_rate
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
