// Game and Player Types
export interface Player {
    id: string;
    app_id: string;
    name: string;
    avatar: string;
    score: number;
    history: GameHistory[];
    championships: number;
    runnerUp: number;      // 亚军次数
    thirdPlace: number;    // 季军次数
    totalVP: number;       // 总VP获得数
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
    specialRules: string[];  // 改为数组以支持多个特殊规则
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
    handleStartLeague: () => void;
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
