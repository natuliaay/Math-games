import React from 'react';

interface AlienProps {
  mood: 'happy' | 'concerned' | 'neutral';
  message: string;
}

export const Alien: React.FC<AlienProps> = ({ mood, message }) => {
  return (
    <div className="relative flex flex-col items-center group">
      {/* Speech Bubble */}
      <div className="mb-4 relative">
        <div className="bg-white text-slate-900 p-4 rounded-2xl rounded-bl-none shadow-[0_0_15px_rgba(255,255,255,0.5)] max-w-[250px] animate-pulse-glow">
          <p className="text-sm font-bold">{message}</p>
        </div>
        {/* Triangle tail for speech bubble */}
        <div className="absolute left-0 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-white border-r-[10px] border-r-transparent transform rotate-12 translate-x-2"></div>
      </div>

      {/* Alien SVG */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 200 200"
        className="animate-float cursor-pointer transition-transform hover:scale-110 duration-300"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Aura */}
        <circle cx="100" cy="100" r="80" fill="rgba(56, 189, 248, 0.2)" filter="url(#glow)" />
        
        {/* Body */}
        <path
          d="M60,160 Q50,190 30,190 L170,190 Q150,190 140,160 Q180,100 100,20 Q20,100 60,160"
          fill="#a3e635"
          stroke="#4d7c0f"
          strokeWidth="3"
        />
        
        {/* Belly */}
        <ellipse cx="100" cy="130" rx="30" ry="20" fill="#bef264" opacity="0.6" />

        {/* Eyes */}
        <g transform={mood === 'concerned' ? "rotate(-5, 100, 100)" : ""}>
            {/* Left Eye */}
            <circle cx="70" cy="80" r="20" fill="white" stroke="#4d7c0f" strokeWidth="2" />
            <circle cx="70" cy={mood === 'concerned' ? 85 : 80} r="8" fill="black" />
            
            {/* Right Eye */}
            <circle cx="130" cy="80" r="20" fill="white" stroke="#4d7c0f" strokeWidth="2" />
            <circle cx="130" cy={mood === 'concerned' ? 85 : 80} r="8" fill="black" />
            
            {/* Third Eye (Alien Feature) */}
            <circle cx="100" cy="50" r="12" fill="white" stroke="#4d7c0f" strokeWidth="2" />
            <circle cx="100" cy="50" r="5" fill="black" />
        </g>

        {/* Mouth */}
        {mood === 'happy' && (
          <path d="M80,110 Q100,130 120,110" fill="none" stroke="#4d7c0f" strokeWidth="3" strokeLinecap="round" />
        )}
        {mood === 'neutral' && (
          <path d="M85,120 L115,120" fill="none" stroke="#4d7c0f" strokeWidth="3" strokeLinecap="round" />
        )}
        {mood === 'concerned' && (
           <circle cx="100" cy="120" r="5" fill="none" stroke="#4d7c0f" strokeWidth="3" />
        )}

        {/* Antennas */}
        <path d="M60,45 Q40,10 20,20" fill="none" stroke="#a3e635" strokeWidth="4" />
        <circle cx="20" cy="20" r="5" fill="#38bdf8" className="animate-pulse" />
        
        <path d="M140,45 Q160,10 180,20" fill="none" stroke="#a3e635" strokeWidth="4" />
        <circle cx="180" cy="20" r="5" fill="#38bdf8" className="animate-pulse" />

      </svg>
    </div>
  );
};