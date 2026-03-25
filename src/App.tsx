import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono selection:bg-magenta-500/30 selection:text-magenta-400 overflow-hidden relative">
      <div className="noise" />
      <div className="scanline" />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-8">
        <motion.header
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 w-full max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-pixel cyan-magenta-glow glitch-overlay" data-text="SYSTEM_OVERRIDE">
            SYSTEM_OVERRIDE
          </h1>
          <div className="flex justify-center gap-4 text-xs font-pixel opacity-70">
            <span className="animate-pulse">[ STATUS: COMPROMISED ]</span>
            <span className="animate-pulse">[ SECTOR: 7G ]</span>
            <span className="animate-pulse">[ INTEGRITY: 12% ]</span>
          </div>
        </motion.header>

        <div className="flex flex-col xl:flex-row items-start justify-center gap-8 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-full xl:w-1/3 space-y-8"
          >
            <div className="border-glitch p-4 bg-black/80 backdrop-blur-sm">
              <h2 className="text-lg font-pixel mb-4 text-magenta-500 underline">AUDIO_UPLINK</h2>
              <MusicPlayer />
            </div>
            
            <div className="border-glitch p-4 bg-black/80 backdrop-blur-sm hidden xl:block">
              <h2 className="text-lg font-pixel mb-4 text-magenta-500 underline">SYS_LOGS</h2>
              <div className="text-xs space-y-1 opacity-60">
                <p>{'>'} INITIALIZING_SNAKE_PROTOCOL...</p>
                <p>{'>'} ERROR: BUFFER_OVERFLOW_DETECTED</p>
                <p>{'>'} ATTEMPTING_RECOVERY_IN_SECTOR_4...</p>
                <p>{'>'} ACCESS_GRANTED_BY_ROOT_USER</p>
                <p>{'>'} GLITCH_CORE_STABILIZED</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 12 }}
            className="w-full xl:w-2/3 flex justify-center"
          >
            <div className="border-glitch p-2 bg-black relative">
              <div className="absolute -top-6 left-4 bg-cyan-400 text-black px-2 py-1 text-[10px] font-pixel">
                LIVE_FEED_01
              </div>
              <SnakeGame />
            </div>
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-8 text-magenta-500 text-[10px] font-pixel tracking-tighter flex flex-col items-center gap-2"
        >
          <div className="flex gap-8 border-t border-magenta-500/30 pt-4 w-full justify-center">
            <span>CORE_TEMP: 88°C</span>
            <span>PACKET_LOSS: 4.2%</span>
            <span>ENCRYPTION: AES-GLITCH</span>
          </div>
          <p className="opacity-50">© 2026 VOID_TECH_INDUSTRIES // ALL_RIGHTS_RESERVED</p>
        </motion.footer>
      </main>
    </div>
  );
}
