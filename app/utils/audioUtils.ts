// Mobile-friendly audio utility
export class AudioManager {
  private static instance: AudioManager;
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private isInitialized = false;
  private isMuted = true;
  private isPlaying = false;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private async initializeAudio() {
    try {
      // Create background music audio element
      this.backgroundMusic = new Audio();
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;
      this.backgroundMusic.preload = 'none';
      
      // Use a royalty-free background music URL or local file
      // For now, using a placeholder - you should replace with actual audio files
      this.backgroundMusic.src = '/audio/background-music.mp3';
      
      // Create sound effect audio elements
      const happySound = new Audio();
      happySound.volume = 0.5;
      happySound.preload = 'none';
      happySound.src = '/audio/happy-sound.mp3';
      this.soundEffects.set('happy', happySound);

      this.isInitialized = true;
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  }

  // Must be called from a user interaction event
  async enableAudio(): Promise<boolean> {
    if (!this.isInitialized || typeof window === 'undefined') {
      return true; // Return true to dismiss popup even if not initialized
    }

    try {
      // Try to play and immediately pause to unlock audio context
      if (this.backgroundMusic) {
        try {
          await this.backgroundMusic.play();
          this.backgroundMusic.pause();
          this.backgroundMusic.currentTime = 0;
        } catch (e) {
          // Audio file might not exist, that's okay
          console.log('Background music file not found');
        }
      }

      // Unlock sound effects
      for (const [, audio] of this.soundEffects) {
        try {
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {
          // Ignore individual sound effect failures
          console.log('Sound effect file not found');
        }
      }

      return true; // Always return true to dismiss popup
    } catch (error) {
      console.log('Audio unlock failed:', error);
      return true; // Still return true to dismiss popup
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.backgroundMusic) {
      this.backgroundMusic.muted = muted;
    }
    for (const [, audio] of this.soundEffects) {
      audio.muted = muted;
    }
  }

  async playBackgroundMusic(): Promise<boolean> {
    if (!this.backgroundMusic || this.isMuted) {
      return false;
    }

    try {
      await this.backgroundMusic.play();
      this.isPlaying = true;
      return true;
    } catch (error) {
      console.log('Background music play failed:', error);
      return false;
    }
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.isPlaying = false;
    }
  }

  async playSoundEffect(name: string): Promise<boolean> {
    if (this.isMuted || (this.isPlaying && !this.isMuted)) {
      return false; // Don't play sound effects if music is playing
    }

    const audio = this.soundEffects.get(name);
    if (!audio) {
      return false;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch (error) {
      console.log(`Sound effect '${name}' play failed:`, error);
      return false;
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Fallback for when HTML5 audio is not available
export class FallbackAudioManager {
  private isMuted = true;
  private isPlaying = false;

  async enableAudio(): Promise<boolean> {
    return false;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  async playBackgroundMusic(): Promise<boolean> {
    this.isPlaying = true;
    return false;
  }

  pauseBackgroundMusic() {
    this.isPlaying = false;
  }

  async playSoundEffect(name: string): Promise<boolean> {
    return false;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export the appropriate audio manager
export const getAudioManager = (): AudioManager | FallbackAudioManager => {
  if (typeof window !== 'undefined' && 'Audio' in window) {
    return AudioManager.getInstance();
  }
  return new FallbackAudioManager();
};
