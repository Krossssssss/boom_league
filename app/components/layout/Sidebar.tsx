import React from 'react';
import { LucideCat, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideMenu, LucideX, LucideSun, LucideMoon, LucidePanelLeftClose, LucidePanelLeftOpen, LucideMusic, LucideVolumeX, LucideVolume2, LucidePlay, LucidePause, LucideBook, LucideExternalLink, LucideHistory, LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { SidebarProps } from '../../types';

const Sidebar: React.FC<SidebarProps> = ({ 
    currentPage, 
    setCurrentPage, 
    sidebarOpen, 
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    musicPlaying,
    setMusicPlaying,
    musicMuted,
    setMusicMuted
}) => {
    const { theme, toggleTheme } = useTheme();
    
    const handleMusicToggle = () => {
        if (musicMuted) {
            // First unmute, then start playing
            setMusicMuted(false);
            setMusicPlaying(true);
        } else {
            // If playing, mute it; if muted/paused, start playing
            if (musicPlaying) {
                setMusicMuted(true);
                setMusicPlaying(false);
            } else {
                setMusicPlaying(true);
            }
        }
    };

    const handleRulebookClick = () => {
        window.open('https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing', '_blank');
    };
    
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
            <div className={`fixed left-0 top-0 h-full ${theme === 'dark' ? 'bg-black/40' : 'bg-white/80'} backdrop-blur-2xl border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto ${sidebarCollapsed ? 'w-16 lg:w-16' : 'w-72 sm:w-80 md:w-72 lg:w-64'} ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'}`}>
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-white/5 to-transparent' : 'bg-gradient-to-b from-gray-50/50 to-transparent'}`}></div>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`relative p-4 sm:p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'}`}>
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                            {/* Logo and Title - Only show when not collapsed */}
                            {!sidebarCollapsed && (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-lg shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                                        <LucideCat className="text-orange-400" size={18} />
                                    </div>
                                    <div>
                                        <h2 className={`text-sm sm:text-base font-semibold ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} tracking-tight`}>Boom League</h2>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} font-medium hidden sm:block`}>Tournament Tracker</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Right side buttons */}
                            <div className="flex items-center gap-2">
                                {/* Desktop collapse button */}
                                <button 
                                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                    className={`hidden lg:flex w-8 h-8 items-center justify-center rounded-md transition-all duration-200 ${
                                        theme === 'dark' 
                                            ? 'text-white/60 hover:text-white hover:bg-white/10' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                >
                                    {sidebarCollapsed ? <LucideChevronRight size={16} /> : <LucideChevronLeft size={16} />}
                                </button>
                                
                                {/* Mobile close button */}
                                {!sidebarCollapsed && (
                                    <button 
                                        onClick={() => setSidebarOpen(false)}
                                        className={`lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                            theme === 'dark' 
                                                ? 'text-white/60 hover:text-white hover:bg-white/10' 
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <LucideX size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 ${sidebarCollapsed ? 'p-2' : 'p-3 sm:p-4'} relative z-10`}>
                        <ul className={`space-y-1 sm:space-y-1.5 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
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
                                            className={`group relative ${sidebarCollapsed ? 'w-10 h-10' : 'w-full'} flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden text-sm sm:text-base ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.2)]'
                                                    : theme === 'dark' 
                                                        ? 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                                                        : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                                            }`}
                                            title={sidebarCollapsed ? item.name : undefined}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 backdrop-blur-sm"></div>
                                            )}
                                            <Icon size={18} className="relative z-10 flex-shrink-0" />
                                            {!sidebarCollapsed && (
                                                <span className="font-medium relative z-10 truncate">{item.name}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Controls */}
                    <div className={`relative p-3 sm:p-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} mt-auto`}>
                        {sidebarCollapsed ? (
                            <div className="flex flex-col items-center gap-2">
                                {/* Music button - collapsed */}
                                <button 
                                    onClick={handleMusicToggle}
                                    className={`w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${
                                        musicPlaying && !musicMuted
                                            ? 'text-orange-400 bg-orange-500/20 border-orange-500/30'
                                            : theme === 'dark' 
                                                ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
                                    }`}
                                    title={musicMuted ? 'Unmute music' : musicPlaying ? 'Pause music' : 'Play music'}
                                >
                                    {musicMuted ? <LucideVolumeX size={14} /> : musicPlaying ? <LucidePause size={14} /> : <LucidePlay size={14} />}
                                </button>
                                {/* Theme button - collapsed */}
                                <button 
                                    onClick={toggleTheme}
                                    className={`w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                >
                                    {theme === 'dark' ? <LucideSun size={14} /> : <LucideMoon size={14} />}
                                </button>
                                {/* Rulebook button - collapsed */}
                                <button 
                                    onClick={handleRulebookClick}
                                    className={`w-8 h-8 rounded-lg transition-all duration-200 border border-transparent flex items-center justify-center ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                                    title="Open rulebook (external link)"
                                >
                                    <LucideBook size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Music button - expanded */}
                                    <button 
                                        onClick={handleMusicToggle}
                                        className={`p-2 rounded-lg transition-all duration-200 border border-transparent ${
                                            musicPlaying && !musicMuted
                                                ? 'text-orange-400 bg-orange-500/20 border-orange-500/30'
                                                : theme === 'dark' 
                                                    ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' 
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'
                                        }`}
                                        title={musicMuted ? 'Unmute music' : musicPlaying ? 'Pause music' : 'Play music'}
                                    >
                                        {musicMuted ? <LucideVolumeX size={16} /> : musicPlaying ? <LucidePause size={16} /> : <LucidePlay size={16} />}
                                    </button>
                                    {/* Theme button - expanded */}
                                    <button 
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                                    >
                                        {theme === 'dark' ? <LucideSun size={16} /> : <LucideMoon size={16} />}
                                    </button>
                                    {/* Rulebook button - expanded */}
                                    <button 
                                        onClick={handleRulebookClick}
                                        className={`p-2 rounded-lg transition-all duration-200 border border-transparent ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300'}`}
                                        title="Open rulebook (external link)"
                                    >
                                        <LucideBook size={16} />
                                    </button>
                                </div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'} font-medium`}>
                                    Controls
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default Sidebar;
