import React, { useRef, useEffect } from 'react';
import { LucideVolume2, LucideSmile, LucideFrown, LucideBomb, LucidePartyPopper, LucideWind, LucideHelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SoundEffect {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    youtubeId?: string; // YouTube video ID for external sound effects
}

const SoundEffectsBox: React.FC = () => {
    const { theme } = useTheme();
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
    const youtubeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

    // Sound effects with YouTube video IDs for fart and explosion sounds
    const soundEffects: SoundEffect[] = [
        {
            id: 'fart',
            name: '💨 放屁',
            icon: <LucideWind size={20} />,
            color: 'from-yellow-500/20 to-brown-500/20 border-yellow-500/30 text-yellow-400',
            youtubeId: 'KJotmmDJWAg' // https://youtu.be/KJotmmDJWAg?si=4p66S6unYDf_r8Qm
        },
        {
            id: 'bomb',
            name: '💣 爆炸',
            icon: <LucideBomb size={20} />,
            color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
            youtubeId: 'HTXiJpCDiH4' // https://youtu.be/HTXiJpCDiH4?si=-4pK7MTGL1enE3S6
        },
        {
            id: 'laugh',
            name: '😂 大笑',
            icon: <LucideSmile size={20} />,
            color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
            youtubeId: 'Rc2k_8skxtI' // https://youtu.be/Rc2k_8skxtI?si=njTqQwahPfhmPMDu
        },
        {
            id: 'cry',
            name: '😭 哭泣',
            icon: <LucideFrown size={20} />,
            color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
            youtubeId: 'pBUs2R9JV5M' // https://youtu.be/pBUs2R9JV5M?si=cfZJagAtlTVdsTmY
        },
        {
            id: 'happy',
            name: '😊 开心',
            icon: <LucidePartyPopper size={20} />,
            color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
            youtubeId: 'NSU2hJ5wT08' // https://youtu.be/NSU2hJ5wT08?si=o7wYMeINEKJ8WXCB
        },
        {
            id: 'huh',
            name: '🤔 huh?',
            icon: <LucideHelpCircle size={20} />,
            color: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
            youtubeId: 'igO9SmiY4hs' // https://youtu.be/igO9SmiY4hs?si=-5l7Dm5X_t0ngqKf
        }
    ];

    const playSound = (soundEffect: SoundEffect) => {
        try {
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
                // Reset and play the video
                const currentSrc = iframe.src;
                iframe.src = '';
                iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=0&volume=50&start=0&enablejsapi=1`;
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

    return (
        <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border backdrop-blur-2xl ${
            theme === 'dark' 
                ? 'bg-gray-800/60 border-gray-700' 
                : 'bg-white/60 border-gray-200/50'
        }`}>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className={`p-2 rounded-lg ${
                    theme === 'dark' 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-gray-100/50 border-gray-200'
                } border`}>
                    <LucideVolume2 className={theme === 'dark' ? 'text-white/70' : 'text-gray-600'} size={20} />
                </div>
                <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${
                        theme === 'dark' ? 'text-white/95' : 'text-gray-900'
                    }`}>
                        音效盒
                    </h3>
                    <p className={`text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-white/60' : 'text-gray-600'
                    }`}>
                        点击播放音效
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {soundEffects.map((sound) => (
                    <button
                        key={sound.id}
                        onClick={() => playSound(sound)}
                        className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-br ${sound.color} hover:shadow-lg active:shadow-sm group`}
                        title={`播放 ${sound.name}`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="transition-transform duration-200 group-hover:scale-110">
                                {sound.icon}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                                {sound.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className={`mt-4 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-100/50'
            }`}>
                <p className={`text-xs text-center ${
                    theme === 'dark' ? 'text-white/50' : 'text-gray-500'
                }`}>
                    💡 提示：在比赛中使用音效增加乐趣！
                </p>
            </div>

            {/* Hidden YouTube iframes for sound effects */}
            <div className="hidden">
                {soundEffects.filter(sound => sound.youtubeId).map((sound) => (
                    <iframe
                        key={sound.id}
                        ref={(el) => youtubeRefs.current[sound.id] = el}
                        width="0"
                        height="0"
                        src={`https://www.youtube.com/embed/${sound.youtubeId}?controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&mute=1&enablejsapi=1`}
                        title={`${sound.name} Sound Effect`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        style={{ display: 'none', position: 'absolute', left: '-9999px', top: '-9999px' }}
                    />
                ))}
            </div>
        </div>
    );
};

export default SoundEffectsBox;
