import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Store, MapPin, PartyPopper, RefreshCw, Ticket, Music, Music2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { FAIR_STALLS, Level } from './data';

const MOVE_SPEED = 2;
const COLLISION_RADIUS = 5;

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1: Intro, 0+: Playing
  const [pos, setPos] = useState({ x: 50, y: 90 }); // Starting position (bottom middle)
  const [activeStall, setActiveStall] = useState<Level | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [visitedStalls, setVisitedStalls] = useState<number[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const handleVibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 50);
    }
  }, []);

  // Music initialization
  useEffect(() => {
    audioRef.current = new Audio('https://www.chosic.com/wp-content/uploads/2021/04/Puppy-Love.mp3');
    audioRef.current.loop = true;
    
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Movement Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const moveInterval = setInterval(() => {
      if (currentStep === -1 || activeStall || currentStep === FAIR_STALLS.length) return;

      let dx = 0;
      let dy = 0;

      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) dy -= MOVE_SPEED;
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) dy += MOVE_SPEED;
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) dx -= MOVE_SPEED;
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) dx += MOVE_SPEED;

      if (dx !== 0 || dy !== 0) {
        setIsWalking(true);
        setPos(prev => ({
          x: Math.max(5, Math.min(95, prev.x + dx)),
          y: Math.max(5, Math.min(95, prev.y + dy))
        }));
      } else {
        setIsWalking(false);
      }

      // Check collision
      const currentStallData = FAIR_STALLS.find(s => {
        const dist = Math.sqrt(Math.pow(pos.x - s.x, 2) + Math.pow(pos.y - s.y, 2));
        return dist < COLLISION_RADIUS;
      });

      if (currentStallData) {
        const isMovieNight = currentStallData.id === 5;
        const previousStallsVisited = visitedStalls.length >= 4;

        if (!visitedStalls.includes(currentStallData.id)) {
          if (isMovieNight && !previousStallsVisited) {
            // Optional: Provide feedback that it's locked
            return;
          }
          setActiveStall(currentStallData);
          handleVibrate();
        }
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [currentStep, activeStall, pos, visitedStalls, handleVibrate]);

  const startJourney = () => {
    handleVibrate();
    setCurrentStep(0);
    toggleMusic();
  };

  const closeStall = () => {
    if (activeStall) {
      setVisitedStalls(prev => [...prev, activeStall.id]);
      setActiveStall(null);
      setShowMessage(false);
      
      if (visitedStalls.length + 1 === FAIR_STALLS.length) {
        setTimeout(() => setCurrentStep(FAIR_STALLS.length), 500);
      }
    }
  };

  const handleRestart = () => {
    handleVibrate();
    setCurrentStep(-1);
    setPos({ x: 50, y: 90 });
    setVisitedStalls([]);
    setActiveStall(null);
    setShowMessage(false);
  };

  const moveManual = (direction: 'up' | 'down' | 'left' | 'right') => {
    setIsWalking(true);
    setPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (direction === 'up') ny -= 5;
      if (direction === 'down') ny += 5;
      if (direction === 'left') nx -= 5;
      if (direction === 'right') nx += 5;
      return { 
        x: Math.max(5, Math.min(95, nx)), 
        y: Math.max(5, Math.min(95, ny)) 
      };
    });
    setTimeout(() => setIsWalking(false), 200);
  };

  return (
    <main className="fair-ground font-sans overflow-hidden select-none touch-none">
      {/* Decorative Lights */}
      <div className="fixed top-0 w-full flex justify-around px-2 z-20 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="light-bulb" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20"
      >
        {isMusicPlaying ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5 opacity-50" />}
      </button>

      <AnimatePresence mode="wait">
        {/* Intro Screen */}
        {currentStep === -1 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center gap-8 z-10"
          >
            <div className="carnival-banner p-6 text-center transform -rotate-2">
              <h1 className="font-display text-4xl text-white drop-shadow-lg leading-tight">
                FAIRGROUND<br/>
                <span className="text-carnival-yellow">COUPLE QUEST</span>
              </h1>
            </div>
            
            <p className="text-carnival-yellow/80 font-display text-xs tracking-widest text-center px-8">
              MOVE TOGETHER TO EXPLORE STALLS & FIND BIRTHDAY SURPRISES
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={startJourney}
              className="ticket group px-12 py-6 font-display text-xl transition-transform"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 fill-black" />
                START WALKING
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Game Map View */}
        {currentStep >= 0 && currentStep < FAIR_STALLS.length && (
          <motion.div
            key="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex flex-col items-center justify-between py-12"
          >
            {/* Top Info */}
            <div className="z-10 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex gap-4 text-xs font-display text-white">
              <span>EXPLORE THE FAIRGROUND</span>
              <span className="text-carnival-yellow underline decoration-wavy">
                {visitedStalls.length} / {FAIR_STALLS.length} STALLS
              </span>
            </div>

            {/* The Map */}
            <div className="map-container relative shadow-2xl">
              {/* Stalls */}
              {FAIR_STALLS.map(stall => (
                <div 
                  key={stall.id}
                  className="stall-marker"
                  style={{ left: `${stall.x}%`, top: `${stall.y}%` }}
                >
                  <div className="relative group">
                    <div 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 shadow-lg ${
                        visitedStalls.includes(stall.id) ? 'opacity-30 grayscale' : 
                        (stall.id === 5 && visitedStalls.length < 4) ? 'opacity-50 saturate-0 scale-90' : 'animate-bounce'
                      }`}
                      style={{ 
                        backgroundColor: stall.color,
                        boxShadow: `0 0 20px ${stall.color}50`
                      }}
                    >
                      {stall.id === 5 && visitedStalls.length < 4 ? '🔒' : stall.emoji}
                    </div>
                    {/* Pulsing circle if not visited */}
                    {!visitedStalls.includes(stall.id) && (
                      <div 
                        className="absolute inset-0 rounded-xl animate-ping opacity-20"
                        style={{ backgroundColor: stall.color }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {/* The Couple */}
              <div 
                className="couple-container"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className={`couple-character ${isWalking ? 'walking-bob' : ''}`}>
                  <div className="person guy">
                     <div className="absolute -top-1 left-1 w-2 h-2 bg-[#fde68a] rounded-full" />
                  </div>
                  <div className="person girl">
                     <div className="absolute -top-1 left-1 w-2 h-2 bg-[#fde68a] rounded-full" />
                  </div>
                </div>
                {/* Indicator */}
                <div className="w-10 h-2 bg-black/20 rounded-full blur-[2px] mt-1" />
              </div>
            </div>

            {/* Controls for Mobile */}
            <div className="grid grid-cols-3 gap-3 p-6 md:hidden z-10 w-full max-w-[280px]">
              <div />
              <button 
                onPointerDown={() => moveManual('up')} 
                className="aspect-square flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-2xl active:scale-95 active:bg-white/30 text-white shadow-xl border border-white/5"
              >
                <ArrowUp className="w-8 h-8" />
              </button>
              <div />
              <button 
                onPointerDown={() => moveManual('left')} 
                className="aspect-square flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-2xl active:scale-95 active:bg-white/30 text-white shadow-xl border border-white/5"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button 
                onPointerDown={() => moveManual('down')} 
                className="aspect-square flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-2xl active:scale-95 active:bg-white/30 text-white shadow-xl border border-white/5"
              >
                <ArrowDown className="w-8 h-8" />
              </button>
              <button 
                onPointerDown={() => moveManual('right')} 
                className="aspect-square flex items-center justify-center bg-white/10 backdrop-blur-lg rounded-2xl active:scale-95 active:bg-white/30 text-white shadow-xl border border-white/5"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
            
            <p className="hidden md:block text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] mt-4">
              USE ARROW KEYS OR WASD TO MOVE
            </p>
          </motion.div>
        )}

        {/* Modal for Stall Interaction */}
        {activeStall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div 
                className="h-32 flex items-center justify-center text-7xl"
                style={{ backgroundColor: activeStall.color + '20' }}
              >
                {activeStall.emoji}
              </div>

              <div className="p-8 space-y-6">
                {!showMessage ? (
                  <>
                    <div className="space-y-2 text-center">
                      <h3 className="font-display text-2xl text-black">{activeStall.stallName}</h3>
                      <p className="text-zinc-500 italic">"Welcome! You two look cute together today."</p>
                    </div>
                    
                    <button 
                      onClick={() => setShowMessage(true)}
                      className="w-full bg-black text-white py-4 rounded-2xl font-display text-xs tracking-widest"
                    >
                      CHECK SECRET MESSAGE
                    </button>
                    
                    <button 
                      onClick={() => setActiveStall(null)}
                      className="w-full text-zinc-400 py-2 text-xs font-bold uppercase tracking-widest"
                    >
                      NOT NOW
                    </button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-zinc-50 p-6 rounded-3xl border border-dashed border-zinc-300">
                      <p className="text-lg italic font-serif leading-relaxed text-zinc-800">
                        {activeStall.message}
                      </p>
                    </div>
                    
                    <button 
                      onClick={closeStall}
                      className="w-full bg-carnival-blue text-white py-4 rounded-2xl font-display text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                      STALL COLLECTED <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Final Celebration */}
        {currentStep === FAIR_STALLS.length && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 text-center z-10"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl"
              >
                🥨
              </motion.div>
              <PartyPopper className="absolute -top-4 -right-4 w-10 h-10 text-carnival-yellow" />
            </div>

            <div className="carnival-banner p-6">
              <h1 className="font-display text-3xl text-white">
                FAIR CONQUERED!
              </h1>
            </div>

            <p className="text-white/70 max-w-[280px] font-light leading-relaxed">
              Every stall visited, every secret shared. The best birthday journey is the one we walk together!
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="ticket px-10 py-5 font-display flex items-center gap-3"
            >
              <RefreshCw className="w-5 h-5" /> START OVER?
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Haptic Visual Feedback */}
      <AnimatePresence>
        {isVibrating && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none border-[12px] border-carnival-yellow/20 z-[100] rounded-[40px]"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
