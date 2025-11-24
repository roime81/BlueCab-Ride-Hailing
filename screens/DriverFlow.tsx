import React, { useState, useEffect } from 'react';
import { Button, BottomSheet, Icons, Header } from '../components/UI';
import { Map } from '../components/Map';
import { RideStatus } from '../types';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DriverFlowProps {
  onLogout: () => void;
}

const EARNINGS_DATA = [
  { time: '10am', val: 20 }, { time: '11am', val: 45 }, { time: '12pm', val: 30 },
  { time: '1pm', val: 50 }, { time: '2pm', val: 85 }, { time: '3pm', val: 70 },
  { time: '4pm', val: 110 }
];

export const DriverFlow: React.FC<DriverFlowProps> = ({ onLogout }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [status, setStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [hasRequest, setHasRequest] = useState(false);
  
  // Mock Driver Location
  const [myLoc, setMyLoc] = useState({ x: 50, y: 50 });
  const [passengerLoc, setPassengerLoc] = useState<{ x: number; y: number } | undefined>(undefined);

  // Simulate Incoming Request
  useEffect(() => {
    if (isOnline && status === RideStatus.IDLE) {
      const timer = setTimeout(() => setHasRequest(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, status]);

  const acceptRide = () => {
    setHasRequest(false);
    setStatus(RideStatus.PICKUP_WAY);
    setPassengerLoc({ x: 20, y: 80 });
  };

  const startTrip = () => {
     setStatus(RideStatus.IN_PROGRESS);
  };

  const endTrip = () => {
     setStatus(RideStatus.COMPLETED);
  };

  return (
    <div className="h-full w-full relative bg-gray-50 overflow-hidden flex flex-col">
       {/* Map Background */}
       <Map 
         userLocation={passengerLoc || {x: -10, y: -10}} // Hide if no passenger
         driverLocation={myLoc}
         showRoute={status === RideStatus.PICKUP_WAY || status === RideStatus.IN_PROGRESS}
         destination={status === RideStatus.IN_PROGRESS ? { x: 80, y: 30 } : passengerLoc}
       />

       {/* Top Bar: Earnings / Status */}
       <div className="absolute top-0 left-0 right-0 z-40 p-4 pt-12">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center">
             {!isOnline ? (
               <div className="text-gray-500 font-medium">You are offline</div>
             ) : (
               <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Today's Earnings</p>
                 <h2 className="text-2xl font-bold text-gray-800">$142.50</h2>
               </div>
             )}
             <div 
               className={`px-4 py-2 rounded-full font-bold text-sm cursor-pointer transition-colors ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
               onClick={() => setIsOnline(!isOnline)}
             >
               {isOnline ? 'ONLINE' : 'GO ONLINE'}
             </div>
          </div>
       </div>

       {/* ONLINE: Waiting for Jobs */}
       {isOnline && status === RideStatus.IDLE && !hasRequest && (
         <div className="absolute bottom-10 left-0 right-0 text-center px-4">
            <div className="inline-block bg-[#1A4DBE] text-white px-6 py-2 rounded-full shadow-lg text-sm animate-pulse">
               Looking for rides...
            </div>
         </div>
       )}

       {/* REQUEST POPUP */}
       {hasRequest && (
         <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
            <div className="w-full bg-white rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
               <div className="flex justify-between items-center mb-2">
                 <div className="bg-blue-100 text-[#1A4DBE] px-3 py-1 rounded text-xs font-bold">PREMIUM</div>
                 <div className="font-bold text-xl">$24.00</div>
               </div>
               <h2 className="text-2xl font-bold text-gray-800 mb-1">4.2 mi <span className="text-gray-400 font-normal text-lg">• 12 min</span></h2>
               <p className="text-gray-500 mb-6">Pickup: Central Mall</p>
               
               <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setHasRequest(false)}>Decline</Button>
                  <Button className="flex-[2] text-lg" onClick={acceptRide}>Accept Ride</Button>
               </div>
            </div>
         </div>
       )}

       {/* IN RIDE FLOW */}
       {(status === RideStatus.PICKUP_WAY || status === RideStatus.IN_PROGRESS || status === RideStatus.ARRIVED_PICKUP) && (
         <BottomSheet isOpen={true}>
            <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-sm text-gray-500 mb-1">{status === RideStatus.PICKUP_WAY ? "Picking up" : "Dropping off"}</h3>
                   <h2 className="text-xl font-bold text-gray-800">Alice Smith</h2>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">AS</div>
            </div>

            <div className="flex gap-3 mb-6">
                <Button variant="outline" fullWidth><Icons.Phone size={18} /></Button>
                <Button variant="outline" fullWidth><Icons.MessageSquare size={18} /></Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-start gap-3">
               <Icons.MapPin className="text-[#1A4DBE] mt-1" size={20} />
               <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {status === RideStatus.IN_PROGRESS ? "123 Maple Street" : "Central Mall Entrance B"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {status === RideStatus.IN_PROGRESS ? "Drop-off location" : "Pickup location"}
                  </p>
               </div>
            </div>

            {status === RideStatus.PICKUP_WAY && (
               <Button fullWidth onClick={() => setStatus(RideStatus.ARRIVED_PICKUP)}>Arrived at Pickup</Button>
            )}
            {status === RideStatus.ARRIVED_PICKUP && (
               <Button fullWidth onClick={startTrip} className="bg-green-600 hover:bg-green-700">Start Trip</Button>
            )}
            {status === RideStatus.IN_PROGRESS && (
               <Button fullWidth onClick={endTrip} variant="danger">Complete Trip</Button>
            )}
         </BottomSheet>
       )}

       {/* COMPLETED SUMMARY */}
       {status === RideStatus.COMPLETED && (
         <div className="absolute inset-0 bg-[#1A4DBE] z-50 text-white flex flex-col p-8">
            <div className="flex-1 flex flex-col justify-center items-center text-center">
               <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Icons.DollarSign size={48} />
               </div>
               <h1 className="text-4xl font-bold mb-2">$24.00</h1>
               <p className="opacity-80">Trip Earnings</p>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-6 mb-6">
               <div className="flex justify-between mb-2">
                 <span>Fare</span>
                 <span>$20.00</span>
               </div>
               <div className="flex justify-between mb-2">
                 <span>Surge Bonus</span>
                 <span>$2.00</span>
               </div>
               <div className="flex justify-between font-bold">
                 <span>Tip</span>
                 <span>$2.00</span>
               </div>
            </div>

            <Button variant="secondary" onClick={() => { setStatus(RideStatus.IDLE); setHasRequest(false); }}>Back to Dashboard</Button>
         </div>
       )}

       {/* DASHBOARD CHART (When Offline) */}
       {!isOnline && status === RideStatus.IDLE && (
         <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 h-1/2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <h3 className="font-bold text-gray-800 mb-4">Weekly Earnings</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EARNINGS_DATA}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A4DBE" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1A4DBE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="val" stroke="#1A4DBE" fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-4">
               <div>
                  <p className="text-xs text-gray-500">Total Rides</p>
                  <p className="font-bold text-xl">42</p>
               </div>
               <div>
                  <p className="text-xs text-gray-500">Hours Online</p>
                  <p className="font-bold text-xl">18h</p>
               </div>
               <Button variant="outline" className="px-4 py-2 text-xs" onClick={onLogout}>Logout</Button>
            </div>
         </div>
       )}
    </div>
  );
};
