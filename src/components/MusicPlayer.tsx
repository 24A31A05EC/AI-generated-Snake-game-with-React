import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber City",
    artist: "Lofi Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Electric Pulse",
    artist: "Techno Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', skipForward);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', skipForward);
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 bg-black border-4 border-magenta-500 shadow-[8px_8px_#0ff]">
      <audio ref={audioRef} />
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 border-2 border-magenta-500 shadow-[4px_4px_#0ff]">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-magenta-500/20 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-magenta-500 font-pixel text-xs truncate glitch-overlay" data-text={currentTrack.title}>{currentTrack.title}</h3>
            <p className="text-cyan-400 text-[10px] truncate font-mono mt-1">{'>'} {currentTrack.artist}</p>
            
            <div className="mt-4 flex items-center gap-4">
              <button onClick={skipBackward} className="text-magenta-500 hover:text-cyan-400 transition-all active:translate-y-1">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-magenta-500 text-black hover:bg-cyan-400 transition-all shadow-[4px_4px_#0ff] active:translate-x-1 active:translate-y-1"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={skipForward} className="text-magenta-500 hover:text-cyan-400 transition-all active:translate-y-1">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-black border-2 border-magenta-500 relative overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-magenta-500 mix-blend-difference">
              BUFFERING_STREAM... {Math.round(progress)}%
            </div>
          </div>
          <div className="flex justify-between items-center text-[8px] font-pixel text-cyan-400/70">
            <div className="flex items-center gap-1">
              <Volume2 size={10} />
              <span>LINK_ESTABLISHED</span>
            </div>
            <span className="uppercase">VOID_AUDIO_V2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
