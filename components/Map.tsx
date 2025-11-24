import React, { useEffect, useState } from 'react';
import { Icons } from './UI';

interface MapProps {
  userLocation?: { x: number; y: number };
  destination?: { x: number; y: number };
  driverLocation?: { x: number; y: number };
  showRoute?: boolean;
  interactive?: boolean;
}

export const Map: React.FC<MapProps> = ({ 
  userLocation = { x: 50, y: 50 }, 
  destination, 
  driverLocation,
  showRoute = false
}) => {
  // Generate random "roads" for visual texture
  const roads = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      width: Math.random() > 0.7 ? 4 : 1.5,
      color: Math.random() > 0.8 ? '#e2e8f0' : '#f1f5f9'
    }));
  }, []);

  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#F8FAFC] overflow-hidden -z-0">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Background Grid/Roads */}
        {roads.map(r => (
          <line 
            key={r.id} 
            x1={r.x1} y1={r.y1} 
            x2={r.x2} y2={r.y2} 
            stroke={r.color} 
            strokeWidth={r.width} 
            strokeLinecap="round"
          />
        ))}
        
        {/* Main Grid Lines */}
        <line x1="0" y1="30" x2="100" y2="30" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="0" y1="70" x2="100" y2="70" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="40" y1="0" x2="40" y2="100" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="80" y1="0" x2="80" y2="100" stroke="#E2E8F0" strokeWidth="2" />

        {/* Route Line */}
        {showRoute && destination && (
          <path 
            d={`M${userLocation.x},${userLocation.y} Q${(userLocation.x + destination.x)/2 + 10},${(userLocation.y + destination.y)/2 - 10} ${destination.x},${destination.y}`}
            fill="none"
            stroke="#1A4DBE"
            strokeWidth="1.5"
            strokeDasharray="4 1"
            className="animate-pulse"
          />
        )}
        
        {/* Destination Marker */}
        {destination && (
          <g transform={`translate(${destination.x}, ${destination.y})`}>
             <circle r="4" fill="#EF4444" fillOpacity="0.2" className="animate-ping" />
             <circle r="2" fill="#EF4444" />
             <path d="M-1.5,-2 L1.5,-2 L0,0 Z" fill="#EF4444" transform="translate(0, 3)" />
          </g>
        )}

        {/* User Marker */}
        <g transform={`translate(${userLocation.x}, ${userLocation.y})`}>
          <circle r="6" fill="#1A4DBE" fillOpacity="0.15" />
          <circle r="2.5" fill="#1A4DBE" stroke="white" strokeWidth="0.5" />
        </g>

        {/* Driver Marker */}
        {driverLocation && (
          <g transform={`translate(${driverLocation.x}, ${driverLocation.y})`} className="transition-all duration-1000 ease-linear">
             <rect x="-2" y="-2" width="4" height="4" rx="1" fill="#10B981" />
             <text x="3" y="1" fontSize="3" fill="#333" className="font-bold">🚕</text>
          </g>
        )}
      </svg>
      
      {/* Overlay Gradient for nice fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
