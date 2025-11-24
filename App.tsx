import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { UserFlow } from './screens/UserFlow';
import { DriverFlow } from './screens/DriverFlow';
import { Icons } from './components/UI';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.NONE);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#1A4DBE] text-white">
        <div className="animate-bounce mb-4 bg-white p-4 rounded-2xl shadow-xl">
           <Icons.Car size={48} className="text-[#1A4DBE]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter">BlueCab</h1>
        <p className="text-white/60 text-sm mt-2">Ride in style.</p>
      </div>
    );
  }

  // --- Mobile Frame Container ---
  // Renders the app inside a phone-like container on desktop for better prototype visualization
  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center font-sans antialiased text-gray-900">
      <div className="relative w-full max-w-[400px] h-[100vh] sm:h-[850px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 ring-1 ring-gray-900/50">
        
        {/* Notch / Status Bar Area */}
        <div className="absolute top-0 inset-x-0 h-8 bg-transparent z-50 flex items-center justify-between px-6 pointer-events-none">
           <span className="text-xs font-bold text-gray-800">9:41</span>
           <div className="flex gap-1.5">
             <div className="w-4 h-2.5 bg-gray-800 rounded-[1px] opacity-80" />
             <div className="w-3 h-2.5 bg-gray-800 rounded-[1px] opacity-80" />
             <div className="w-5 h-2.5 bg-gray-800 rounded-[1px] border border-gray-800" />
           </div>
        </div>

        {/* Dynamic Island Placeholder */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 pointer-events-none" />

        {/* --- APP CONTENT --- */}
        <div className="h-full w-full pt-8">
          {role === UserRole.NONE ? (
            <div className="h-full flex flex-col p-8 bg-white">
               <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-[#1A4DBE] rounded-3xl flex items-center justify-center shadow-lg mb-8 rotate-3">
                     <Icons.Car size={40} className="text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
                  <p className="text-center text-gray-500 mb-12 max-w-[200px]">Choose your mode to preview the experience.</p>
                  
                  <div className="w-full space-y-4">
                    <button 
                      onClick={() => setRole(UserRole.USER)}
                      className="w-full py-4 rounded-2xl border-2 border-[#1A4DBE] bg-blue-50 text-[#1A4DBE] font-bold hover:bg-[#1A4DBE] hover:text-white transition-all flex items-center justify-center gap-2 group"
                    >
                      <Icons.User className="group-hover:scale-110 transition-transform" /> I'm a Passenger
                    </button>
                    
                    <button 
                      onClick={() => setRole(UserRole.DRIVER)}
                      className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      <Icons.Car /> I'm a Driver
                    </button>
                  </div>
               </div>
               <p className="text-center text-xs text-gray-300">Prototype v1.0 • Gemini Inside</p>
            </div>
          ) : role === UserRole.USER ? (
            <UserFlow onLogout={() => setRole(UserRole.NONE)} />
          ) : (
            <DriverFlow onLogout={() => setRole(UserRole.NONE)} />
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gray-900 rounded-full opacity-20 pointer-events-none" />
      </div>
    </div>
  );
}
