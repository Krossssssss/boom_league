import React, { useState, useRef } from 'react';
import { LucideCat, LucideHome, LucideUserPlus, LucideGamepad2, LucideBarChart3, LucideMenu, LucideX, LucideSun, LucideMoon, LucidePanelLeftClose, LucidePanelLeftOpen, LucideMusic, LucideVolumeX, LucideVolume2, LucidePlay, LucidePause, LucideBook, LucideExternalLink, LucideHistory, LucideChevronLeft, LucideChevronRight, LucideChevronDown, LucideChevronUp, LucideSmile, LucideFrown, LucideBomb, LucidePartyPopper, LucideWind, LucideHelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { SidebarProps } from '../../types';
import { TYPOGRAPHY, LINE_HEIGHTS, LETTER_SPACING } from '../../constants/typography';

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
    setMusicMuted,
    onMusicToggle
}) => {
    const { theme, toggleTheme } = useTheme();
    const [soundBoxCollapsed, setSoundBoxCollapsed] = useState(false);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const youtubeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});
    
    const handleMusicToggle = async () => {
        if (onMusicToggle) {
            await onMusicToggle();
        } else {
            // Fallback to old behavior if onMusicToggle is not provided
            if (musicMuted) {
                setMusicMuted(false);
                setMusicPlaying(true);
            } else {
                if (musicPlaying) {
                    setMusicMuted(true);
                    setMusicPlaying(false);
                } else {
                    setMusicPlaying(true);
                }
            }
        }
    };

    const handleRulebookClick = () => {
        window.open('https://docs.google.com/document/d/1zJaKW7T4Lz0537q-SPOSN5mYH0btt6K8Yvd6craN504/edit?usp=sharing', '_blank');
    };

    // Sound effects configuration
    const soundEffects = [
        {
            id: 'fart',
            name: '💨 放屁',
            icon: <LucideWind size={16} />,
            color: 'from-yellow-500/20 to-brown-500/20 border-yellow-500/30 text-yellow-400',
            youtubeId: 'KJotmmDJWAg'
        },
        {
            id: 'bomb',
            name: '💣 爆炸',
            icon: <LucideBomb size={16} />,
            color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
            youtubeId: 'HTXiJpCDiH4'
        },
        {
            id: 'laugh',
            name: '😂 大笑',
            icon: <LucideSmile size={16} />,
            color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
            youtubeId: 'USerehPnsEE'
        },
        {
            id: 'cry',
            name: '😭 哭泣',
            icon: <LucideFrown size={16} />,
            color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
            youtubeId: 'pBUs2R9JV5M'
        },
        {
            id: 'happy',
            name: '😊 开心',
            icon: <LucidePartyPopper size={16} />,
            color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
            youtubeId: 'NSU2hJ5wT08'
        },
        {
            id: 'huh',
            name: '🤔 huh?',
            icon: <LucideHelpCircle size={16} />,
            color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
            youtubeId: 'igO9SmiY4hs'
        }
    ];

    // Stop all currently playing sounds
    const stopAllSounds = () => {
        try {
            // Stop all YouTube iframes by clearing their src
            Object.keys(youtubeRefs.current).forEach(soundId => {
                const iframe = youtubeRefs.current[soundId];
                if (iframe && iframe.src) {
                    iframe.src = '';
                }
            });

            // Stop any Web Audio API sounds
            Object.values(audioRefs.current).forEach(audio => {
                if (audio && !audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        } catch (error) {
            console.log('Error stopping sounds:', error);
        }
    };

    const playSound = (soundEffect: any) => {
        try {
            // Stop all previous sounds first
            stopAllSounds();

            // Check if it's a YouTube sound effect
            if (soundEffect.youtubeId) {
                playYouTubeSound(soundEffect.id, soundEffect.youtubeId);
                return;
            }

            // All sound effects now use YouTube - fallback to beep
            playBeepSound();
        } catch (error) {
            console.log('Sound creation failed:', error);
            playBeepSound();
        }
    };

    const playYouTubeSound = (soundId: string, youtubeId: string) => {
        try {
            const iframe = youtubeRefs.current[soundId];
            if (iframe) {
                // Determine playback rate based on sound effect
                const playbackRate = ['fart', 'happy', 'huh'].includes(soundId) ? 1 : 2; // Fart, happy, and huh sounds at 1x speed, others at 2x speed
                
                // Reset and play the video starting at 1 second
                iframe.src = '';
                iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=0&volume=50&start=1&enablejsapi=1&origin=${window.location.origin}`;
                
                // Set playback rate after iframe loads
                const handleLoad = () => {
                    setTimeout(() => {
                        try {
                            if (iframe.contentWindow) {
                                // Send command to set playback rate
                                iframe.contentWindow.postMessage(
                                    JSON.stringify({
                                        event: 'command',
                                        func: 'setPlaybackRate',
                                        args: [playbackRate]
                                    }),
                                    'https://www.youtube.com'
                                );
                            }
                        } catch (postMessageError) {
                            console.log('Could not set playback rate:', postMessageError);
                        }
                    }, 500);
                };

                iframe.onload = handleLoad;
            }
        } catch (error) {
            console.log('YouTube sound failed:', error);
            playBeepSound();
        }
    };

    // Fallback beep sound using Web Audio API
    const playBeepSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Web Audio API not supported');
        }
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
            <div className={`fixed left-0 top-0 h-screen ${theme === 'dark' ? 'bg-black/40' : 'bg-white/80'} backdrop-blur-2xl border-r ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} z-50 transform transition-all duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${sidebarCollapsed ? 'w-16 lg:w-16' : 'w-72 sm:w-80 md:w-72 lg:w-64'} ${theme === 'dark' ? 'shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)]'}`}>
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
                                        <h2 className={`${TYPOGRAPHY.COMBINATIONS.navTitle} ${theme === 'dark' ? 'text-white/95' : 'text-gray-900'} ${LINE_HEIGHTS.tight} ${LETTER_SPACING.tight}`}>Boom League</h2>
                                        <p className={`${TYPOGRAPHY.COMBINATIONS.sidebarCaption} ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'} hidden sm:block ${LINE_HEIGHTS.normal}`}>Tournament Tracker</p>
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
                                            className={`group relative ${sidebarCollapsed ? 'w-10 h-10' : 'w-full'} flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 sm:px-4 py-3 sm:py-3 rounded-lg transition-all duration-200 overflow-hidden ${
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
                                                <span className={`${TYPOGRAPHY.COMBINATIONS.sidebarItem} relative z-10 truncate ${LINE_HEIGHTS.tight}`}>{item.name}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Sound Effects Box */}
                    {!sidebarCollapsed && (
                        <div className={`mx-3 sm:mx-4 mb-3 sm:mb-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200/50'} pt-3 sm:pt-4`}>
                            <div className="relative">
                                <button
                                    onClick={() => setSoundBoxCollapsed(!soundBoxCollapsed)}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                                        theme === 'dark' 
                                            ? 'text-white/70 hover:text-white hover:bg-white/5' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <LucideVolume2 size={16} />
                                        <span className={`${TYPOGRAPHY.COMBINATIONS.sidebarTitle} ${LINE_HEIGHTS.tight}`}>音效盒</span>
                                    </div>
                                    {soundBoxCollapsed ? <LucideChevronDown size={16} /> : <LucideChevronUp size={16} />}
                                </button>
                                
                                {!soundBoxCollapsed && (
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {soundEffects.map((sound) => (
                                                <button
                                                    key={sound.id}
                                                    onClick={() => playSound(sound)}
                                                    className={`p-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-br ${sound.color} hover:shadow-md group`}
                                                    title={`播放 ${sound.name}`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="transition-transform duration-200 group-hover:scale-110">
                                                            {sound.icon}
                                                        </div>
                                                        <span className={`${TYPOGRAPHY.COMBINATIONS.buttonSmall} truncate ${LINE_HEIGHTS.tight}`}>
                                                            {sound.name.split(' ')[1] || sound.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className={`p-2 rounded-lg text-center ${
                                            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'
                                        }`}>
                                            <p className={`${TYPOGRAPHY.COMBINATIONS.caption} ${
                                                theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                                            } ${LINE_HEIGHTS.normal}`}>
                                                💡 点击播放音效
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

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
                                <div className={`${TYPOGRAPHY.COMBINATIONS.caption} ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'} ${LINE_HEIGHTS.normal} ${LETTER_SPACING.wide}`}>
                                    Controls
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Hidden YouTube iframes for sound effects */}
            <div className="hidden">
                {soundEffects.filter(sound => sound.youtubeId).map((sound) => (
                    <iframe
                        key={sound.id}
                        ref={(el) => youtubeRefs.current[sound.id] = el}
                        width="0"
                        height="0"
                        src={`https://www.youtube.com/embed/${sound.youtubeId}?controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=1&start=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        title={`${sound.name} Sound Effect`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        style={{ display: 'none', position: 'absolute', left: '-9999px', top: '-9999px' }}
                    />
                ))}
            </div>
        </>
    );
};

export default Sidebar;
