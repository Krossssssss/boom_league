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
}

export interface GameHistory {
    round: number;
    placement: number;
}

export interface LeagueState {
    app_id: string;
    status: 'setup' | 'in_progress' | 'finished';
    current_round: number;
    schedule: RoundConfig[];
    winner: Winner | null;
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
    players: Player[];
    onPlayerClick: (player: Player) => void;
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
    handleStartLeague: () => void;
    handleResetLeague: () => void;
    renderInProgress: () => React.ReactNode;
    setShowResultsModal: (show: boolean) => void;
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
