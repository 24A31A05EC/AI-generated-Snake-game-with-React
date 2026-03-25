import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-400 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-12">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 w-full max-w-4xl"
        >
          <div className="w-full h-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.5)] rounded-sm border border-white/10" />
          <p className="text-cyan-400 font-digital tracking-[0.5em] text-base md:text-lg uppercase font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            RETRO GAMING • SYNTH BEATS • CYBER AESTHETIC
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <SnakeGame />
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-12 text-gray-600 text-[10px] font-mono tracking-widest uppercase flex flex-col items-center gap-2"
        >
          <div className="flex gap-4">
            <span>System: Online</span>
            <span>Latency: 12ms</span>
            <span>Uptime: 99.9%</span>
          </div>
          <p>© 2026 CyberCore Entertainment Systems</p>
        </motion.footer>
      </main>
    </div>
  );
}
