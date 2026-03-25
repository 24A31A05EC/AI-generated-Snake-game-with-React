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
    <div className="w-full max-w-md p-6 bg-black/40 rounded-2xl border border-pink-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(236,72,153,0.1)]">
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full rounded-xl object-cover border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 bg-pink-500 p-1.5 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"
            >
              <Music size={12} className="text-black" />
            </motion.div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-pink-500 font-digital font-bold text-xl truncate drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate font-mono tracking-tight">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-6">
            <button onClick={skipBackward} className="text-pink-500 hover:text-pink-400 transition-all transform hover:scale-110 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center bg-pink-500 text-black rounded-full hover:bg-pink-400 transition-all shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={skipForward} className="text-pink-500 hover:text-pink-400 transition-all transform hover:scale-110 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-pink-500/20">
          <motion.div
            className="h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-pink-500/70 text-[10px] font-mono font-bold tracking-tighter">
            <Volume2 size={12} />
            <span>AUTO-PLAY ENABLED</span>
          </div>
          <span className="text-pink-500/70 text-[10px] font-mono font-bold tracking-tighter uppercase">NEON AUDIO ENGINE V1.0</span>
        </div>
      </div>
    </div>
  );
};
