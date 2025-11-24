import React, { useState, useEffect } from 'react';
import { Button, Input, BottomSheet, Icons, Card, Header } from '../components/UI';
import { Map } from '../components/Map';
import { RideStatus, RideOption } from '../types';
import { MOCK_RIDE_OPTIONS, MOCK_DRIVER, POPULAR_LOCATIONS } from '../constants';
import { getSmartDestinationSuggestion } from '../services/geminiService';

interface UserFlowProps {
  onLogout: () => void;
}

export const UserFlow: React.FC<UserFlowProps> = ({ onLogout }) => {
  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [destination, setDestination] = useState<string>('');
  const [selectedRide, setSelectedRide] = useState<string>('eco');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Simulated Location State
  const [userLoc] = useState({ x: 50, y: 50 });
  const [destLoc, setDestLoc] = useState<{ x: number; y: number } | undefined>(undefined);
  const [driverLoc, setDriverLoc] = useState<{ x: number; y: number } | undefined>(undefined);

  // Handle Smart Search
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDestination(val);
    setIsTyping(true);
    
    if (val.length > 4 && val.includes("?")) {
       // Trigger "Smart AI" suggestion simulation for question-like queries
       const results = await getSmartDestinationSuggestion(val);
       setSuggestions(results);
    } else {
       setSuggestions([]);
    }
  };

  const selectDestination = () => {
    setDestLoc({ x: 80, y: 30 }); // Mock destination coords
    setIsTyping(false);
  };

  const requestRide = () => {
    setStatus(RideStatus.SEARCHING);
    // Simulate finding a driver
    setTimeout(() => {
      setStatus(RideStatus.MATCHED);
      setDriverLoc({ x: 40, y: 40 });
    }, 2500);
  };

  // Simulate Ride Progress
  useEffect(() => {
    if (status === RideStatus.MATCHED) {
      setTimeout(() => setStatus(RideStatus.PICKUP_WAY), 1000);
    }
    if (status === RideStatus.PICKUP_WAY) {
      const interval = setInterval(() => {
        setDriverLoc(prev => {
           if (!prev) return prev;
           // Move closer to user (50, 50)
           const dx = (50 - prev.x) * 0.1;
           const dy = (50 - prev.y) * 0.1;
           if (Math.abs(dx) < 0.1) {
             clearInterval(interval);
             setStatus(RideStatus.ARRIVED_PICKUP);
             return { x: 50, y: 50 };
           }
           return { x: prev.x + dx, y: prev.y + dy };
        });
      }, 500);
      return () => clearInterval(interval);
    }
    if (status === RideStatus.IN_PROGRESS) {
      // Move driver & user to destination (80, 30)
      const interval = setInterval(() => {
        setDriverLoc(prev => {
          if (!prev) return prev;
          const dx = (80 - prev.x) * 0.05;
          const dy = (30 - prev.y) * 0.05;
          if (Math.abs(dx) < 0.5) {
             clearInterval(interval);
             setStatus(RideStatus.COMPLETED);
             return { x: 80, y: 30 };
          }
          return { x: prev.x + dx, y: prev.y + dy };
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Views based on Status
  return (
    <div className="h-full w-full relative bg-gray-50 overflow-hidden flex flex-col">
      {/* --- Sidebar Menu (Overlay) --- */}
      {isMenuOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}>
           <div className="w-3/4 h-full bg-white p-6 shadow-2xl slide-in-from-left" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#1A4DBE]">
                  <Icons.User size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">John Doe</h2>
                  <p className="text-xs text-gray-500">Gold Member</p>
                </div>
              </div>
              <div className="space-y-4">
                 <Button variant="ghost" fullWidth className="!justify-start"><Icons.Clock size={18} /> History</Button>
                 <Button variant="ghost" fullWidth className="!justify-start"><Icons.CreditCard size={18} /> Wallet</Button>
                 <Button variant="ghost" fullWidth className="!justify-start"><Icons.ShieldCheck size={18} /> Safety</Button>
                 <div className="h-px bg-gray-100 my-4" />
                 <Button variant="ghost" fullWidth className="!justify-start text-red-500" onClick={onLogout}>Log Out</Button>
              </div>
           </div>
        </div>
      )}

      {/* --- Main Map Layer --- */}
      <Map 
        userLocation={userLoc} 
        destination={destLoc} 
        driverLocation={driverLoc}
        showRoute={!!destLoc}
      />

      {/* --- UI Layers per Status --- */}

      {/* 1. IDLE: Home Screen */}
      {status === RideStatus.IDLE && !destLoc && (
        <>
          <Header 
            rightAction={<div onClick={() => setIsMenuOpen(true)} className="bg-white p-2 rounded-full shadow cursor-pointer"><Icons.Menu /></div>}
          />
          <BottomSheet>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Where to?</h2>
            <div className="space-y-3">
              <Input 
                placeholder="Search destination or ask 'Best coffee?'" 
                icon={<Icons.Search size={20} />}
                value={destination}
                onChange={handleSearchChange}
              />
              
              {/* Gemini Smart Suggestions */}
              {suggestions.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1A4DBE] mb-2">
                    <Icons.Star size={12} fill="#1A4DBE" /> AI Suggestions
                  </div>
                  {suggestions.map((s, i) => (
                    <div key={i} className="py-2 border-b border-blue-100 last:border-0 text-sm text-gray-700 cursor-pointer hover:bg-blue-100/50 rounded px-1" onClick={() => { setDestination(s); selectDestination(); }}>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Popular Locations */}
              {!isTyping && (
                <div className="mt-4">
                  {POPULAR_LOCATIONS.map((loc, i) => (
                     <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 cursor-pointer" onClick={selectDestination}>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <Icons.MapPin size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{loc.name}</p>
                          <p className="text-xs text-gray-400">{loc.address}</p>
                        </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </BottomSheet>
        </>
      )}

      {/* 2. ROUTE PREVIEW: Select Ride */}
      {status === RideStatus.IDLE && destLoc && (
        <>
          <Header onBack={() => setDestLoc(undefined)} />
          <BottomSheet>
            <h3 className="font-bold text-gray-800 mb-4">Choose a ride</h3>
            <div className="space-y-3 mb-6">
              {MOCK_RIDE_OPTIONS.map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setSelectedRide(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${selectedRide === opt.id ? 'border-[#1A4DBE] bg-blue-50/50 ring-1 ring-[#1A4DBE]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                     <span className="text-3xl">{opt.image}</span>
                     <div>
                       <h4 className="font-bold text-gray-800">{opt.name}</h4>
                       <p className="text-xs text-gray-500">{opt.eta} min • <Icons.User size={10} className="inline" /> {opt.seats}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${(12 * opt.multiplier).toFixed(2)}</p>
                    {selectedRide === opt.id && <Icons.CheckCircle size={16} className="text-[#1A4DBE] ml-auto mt-1" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Icons.CreditCard size={16} />
                <span>Visa •••• 4242</span>
                <Icons.ChevronRight size={14} />
              </div>
            </div>

            <Button fullWidth onClick={requestRide}>Confirm BlueCab</Button>
          </BottomSheet>
        </>
      )}

      {/* 3. SEARCHING */}
      {status === RideStatus.SEARCHING && (
        <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl p-8 pb-12 shadow-2xl z-50 text-center">
           <div className="relative w-20 h-20 mx-auto mb-4">
             <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
             <div className="relative w-full h-full bg-blue-50 rounded-full flex items-center justify-center border-2 border-[#1A4DBE]">
                <Icons.Search className="text-[#1A4DBE] animate-bounce" size={32} />
             </div>
           </div>
           <h3 className="font-bold text-lg text-gray-800">Finding your driver...</h3>
           <p className="text-gray-500 text-sm mt-2">Connecting to nearby cars</p>
           <Button variant="ghost" className="mt-4 text-red-500" onClick={() => setStatus(RideStatus.IDLE)}>Cancel</Button>
        </div>
      )}

      {/* 4. MATCHED / ON THE WAY / IN PROGRESS */}
      {(status === RideStatus.MATCHED || status === RideStatus.PICKUP_WAY || status === RideStatus.ARRIVED_PICKUP || status === RideStatus.IN_PROGRESS) && (
        <>
          <div className="absolute top-4 left-4 right-4 z-40">
             <div className="bg-[#1A4DBE] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium opacity-80">
                    {status === RideStatus.ARRIVED_PICKUP ? "Driver is here!" : status === RideStatus.IN_PROGRESS ? "Heading to destination" : "Driver is on the way"}
                  </p>
                  <h3 className="font-bold text-lg">
                    {status === RideStatus.IN_PROGRESS ? "15 min left" : "4 min away"}
                  </h3>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  <Icons.Navigation className="text-white" />
                </div>
             </div>
          </div>

          <BottomSheet isOpen={true}>
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full relative overflow-hidden border-2 border-white shadow-sm">
                    {/* Driver Avatar Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">👨🏻‍✈️</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{MOCK_DRIVER.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                       <Icons.Star size={12} className="fill-yellow-400 text-yellow-400" />
                       <span className="font-medium text-gray-700">{MOCK_DRIVER.rating}</span>
                       <span>• {MOCK_DRIVER.carPlate}</span>
                    </div>
                  </div>
               </div>
               <div className="flex flex-col items-end">
                  <p className="text-sm font-bold text-gray-800">{MOCK_DRIVER.carModel}</p>
                  <p className="text-xs text-gray-400">{MOCK_DRIVER.color}</p>
               </div>
             </div>
             
             <div className="flex gap-3 mb-6">
                <Button variant="secondary" className="flex-1 py-2 text-sm"><Icons.MessageSquare size={16} /> Chat</Button>
                <Button variant="secondary" className="flex-1 py-2 text-sm"><Icons.Phone size={16} /> Call</Button>
             </div>

             {status === RideStatus.ARRIVED_PICKUP && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-center font-medium text-sm border border-green-100">
                  Your driver has arrived!
                </div>
             )}
             
             {status === RideStatus.ARRIVED_PICKUP && (
               <Button fullWidth onClick={() => setStatus(RideStatus.IN_PROGRESS)}>Hop In (Simulated)</Button>
             )}
          </BottomSheet>
        </>
      )}

      {/* 5. COMPLETED / RATING */}
      {(status === RideStatus.COMPLETED || status === RideStatus.RATED) && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
             <Icons.CheckCircle size={40} />
           </div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">You've arrived!</h2>
           <p className="text-gray-500 mb-8">Total: $14.50</p>
           
           <div className="bg-gray-50 p-6 rounded-3xl w-full mb-8 text-center">
              <p className="text-sm text-gray-500 mb-4">How was your ride with {MOCK_DRIVER.name}?</p>
              <div className="flex justify-center gap-2">
                 {[1,2,3,4,5].map(star => (
                    <Icons.Star 
                      key={star} 
                      size={32} 
                      className={`${status === RideStatus.RATED ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors cursor-pointer`} 
                      onClick={() => setStatus(RideStatus.RATED)}
                    />
                 ))}
              </div>
           </div>

           <Button fullWidth onClick={() => {
              setStatus(RideStatus.IDLE);
              setDestLoc(undefined);
              setDestination('');
              setDriverLoc(undefined);
           }}>
             {status === RideStatus.RATED ? "Done" : "Skip Rating"}
           </Button>
        </div>
      )}
    </div>
  );
};
