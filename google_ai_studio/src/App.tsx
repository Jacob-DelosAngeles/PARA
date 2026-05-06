import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  UserCircle, 
  Bus, 
  Route, 
  History, 
  User, 
  Navigation, 
  ArrowRight,
  Map as MapIcon,
  CreditCard,
  AlertTriangle,
  PauseCircle,
  TrendingUp,
  Star
} from 'lucide-react';
import { NEARBY_ROUTES, DRIVER_STATS } from './constants';

type Screen = 'Commute' | 'Drive' | 'Activity' | 'Profile';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Drive');

  return (
    <div className="relative h-screen w-full bg-surface-container-low overflow-hidden selection:bg-primary-fixed selection:text-primary">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 h-16 border-b border-black/5">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="font-headline font-black text-2xl text-primary tracking-tighter">PARA</h1>
        </div>
        <div className="flex items-center gap-3">
          {activeScreen === 'Drive' && (
            <div className="hidden md:flex bg-green-50 px-3 py-1 rounded-full items-center gap-2 border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Driving Mode</span>
            </div>
          )}
          <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
            <UserCircle className="w-8 h-8 text-primary" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative h-screen w-full pt-16 pb-20">
        <AnimatePresence mode="wait">
          {activeScreen === 'Commute' && <CommuterMap key="commute" onDriveClick={() => setActiveScreen('Drive')} />}
          {activeScreen === 'Drive' && <DriverHeatmap key="drive" onCommuteClick={() => setActiveScreen('Commute')} />}
          {(activeScreen === 'Activity' || activeScreen === 'Profile') && (
             <div className="flex items-center justify-center h-full text-outline font-medium">
               {activeScreen} content coming soon...
             </div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl flex justify-around items-center px-4 pb-2 z-50 rounded-t-[2.5rem] shadow-[0_-4px_32px_rgba(0,35,111,0.08)] border-t border-black/5">
        <NavButton 
          icon={<Bus />} 
          label="Commute" 
          active={activeScreen === 'Commute'} 
          onClick={() => setActiveScreen('Commute')} 
        />
        <NavButton 
          icon={<Route />} 
          label="Drive" 
          active={activeScreen === 'Drive'} 
          onClick={() => setActiveScreen('Drive')} 
        />
        <NavButton 
          icon={<History />} 
          label="Activity" 
          active={activeScreen === 'Activity'} 
          onClick={() => setActiveScreen('Activity')} 
        />
        <NavButton 
          icon={<User />} 
          label="Profile" 
          active={activeScreen === 'Profile'} 
          onClick={() => setActiveScreen('Profile')} 
        />
      </nav>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all duration-300 ${active ? 'bg-primary-fixed/30 text-primary' : 'text-outline hover:text-primary'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${active ? 'fill-current' : ''}` })}
      <span className="text-[11px] font-bold mt-1 tracking-tight">{label}</span>
    </button>
  );
}

function CommuterMap({ onDriveClick }: { onDriveClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full"
    >
      {/* Background Map Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548345666-a571ea999dd2?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-30 grayscale saturate-0" 
          alt="Map of Manila"
        />
        <div className="absolute inset-0 map-gradient-overlay" />
      </div>

      {/* Floating Elements */}
      <div className="relative z-10 p-6 flex flex-col h-full gap-6">
        {/* Arrival Card - Editorial Style */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 editorial-shadow max-w-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary/40 uppercase">Next Arrival</span>
            <div className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Live</div>
          </div>
          
          <div className="flex items-baseline gap-4">
            <h2 className="text-[6rem] leading-none font-headline font-bold text-on-surface tracking-tighter">5</h2>
            <div className="flex flex-col">
              <span className="text-2xl font-headline font-bold text-on-surface">mins</span>
              <span className="text-sm font-medium text-outline">Route 04L • Guadalupe</span>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
              <User className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-[9px] text-outline font-black tracking-widest uppercase">Driver</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">Rogelio S.</p>
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>4.9</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 max-w-xs">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white h-20 rounded-2xl flex items-center justify-between px-8 group shadow-2xl transition-all"
          >
            <span className="font-headline font-black text-3xl tracking-tighter uppercase whitespace-nowrap">PARA NA!</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </motion.button>
          
          <div className="flex gap-3">
             <SecondaryAction icon={<MapIcon />} label="Route" />
             <SecondaryAction icon={<CreditCard />} label="Pay" />
          </div>
        </div>

        {/* Nearby Routes List */}
        <div className="mt-auto">
          <h3 className="font-headline font-bold text-xl text-on-surface mb-4 px-2">Nearby Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NEARBY_ROUTES.slice(0, 2).map((route) => (
              <div key={route.id} className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <span className="font-headline font-bold text-lg text-primary">{route.id}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{route.name}</p>
                    <p className="text-[11px] text-outline font-medium">{route.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-headline font-bold">{route.wait}</span>
                  <span className="text-[10px] block text-outline font-bold uppercase tracking-widest">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SecondaryAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex-1 bg-white/80 backdrop-blur-sm h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-primary hover:bg-white transition-all border border-white shadow-lg">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <span>{label}</span>
    </button>
  );
}

function DriverHeatmap({ onCommuteClick }: { onCommuteClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full"
    >
      {/* Map with Heatmap Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548345666-a571ea999dd2?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 grayscale" 
          alt="Map"
        />
        <div className="absolute inset-0 heatmap-overlay" />
        
        {/* Animated Path Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 30 40 L 45 55 L 70 45 L 85 70" 
            fill="none" 
            stroke="#00236f" 
            strokeWidth="0.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-60"
          />
        </svg>

        {/* User Marker */}
        <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50">
            <Navigation className="w-6 h-6 fill-current transform rotate-45" />
          </div>
        </div>
      </div>

      {/* Driver Controls Over Map */}
      <div className="relative z-10 px-6 pt-4 h-full flex flex-col gap-6">
        {/* Navigation Context */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-primary-container p-4 rounded-2xl shadow-inner">
              <Navigation className="w-8 h-8 text-white rotate-90" />
            </div>
            <div>
              <p className="text-[10px] text-outline font-black uppercase tracking-[0.2em]">Next Turn</p>
              <h2 className="text-xl md:text-2xl font-headline font-bold text-on-surface">{DRIVER_STATS.nextTurn}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-headline font-bold text-primary leading-none">{DRIVER_STATS.timeToArrival}<span className="text-sm font-bold uppercase ml-1">min</span></p>
            <p className="text-[11px] text-outline font-bold mt-1">Arrival {DRIVER_STATS.arrival}</p>
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl flex flex-col justify-between h-32">
            <div>
              <h3 className="font-headline font-bold text-lg mb-0.5">Commute Status</h3>
              <p className="text-[11px] text-outline">Route: Downtown Express 402</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-black text-primary">
                  +8
                </div>
              </div>
              <span className="text-sm font-black text-primary">{DRIVER_STATS.seatsFilled} / {DRIVER_STATS.totalSeats} Seats</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-primary/95 backdrop-blur-md p-5 rounded-2xl shadow-xl text-white h-32 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <TrendingUp className="w-6 h-6 text-primary-fixed-dim" />
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">High Demand</span>
            </div>
            <div>
              <p className="font-headline text-lg font-bold leading-tight mb-1">{DRIVER_STATS.demandAlert}</p>
              <p className="text-[11px] opacity-70 font-medium">{DRIVER_STATS.demandSub}</p>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 gap-3 h-32">
            <button className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors group">
              <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-outline">SOS</span>
            </button>
            <button className="bg-secondary p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 text-white hover:bg-primary transition-colors group">
              <PauseCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Break</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

