import React from 'react';

/**
 * Original Friendly Robot-Chef Mascot SVG
 * Used as header avatar and in Smart Suggestions card
 */
export default function MascotChef({ variant = 'avatar', className = '', size = 48 }) {
  if (variant === 'avatar') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-sm border border-white/30 shadow-inner ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="robotFaceGrad" x1="20" y1="35" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="30" y1="10" x2="70" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
            <linearGradient id="visorGrad" x1="30" y1="48" x2="70" y2="68" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="eyeGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Antennas */}
          <line x1="50" y1="32" x2="50" y2="16" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="14" r="5" fill="#FF8A1F" />
          <circle cx="50" cy="14" r="2.5" fill="#FFE8D6" />

          {/* Ears/Side Bolts */}
          <rect x="18" y="52" width="6" height="12" rx="3" fill="#94A3B8" />
          <rect x="76" y="52" width="6" height="12" rx="3" fill="#94A3B8" />

          {/* Head */}
          <rect x="22" y="38" width="56" height="42" rx="18" fill="url(#robotFaceGrad)" stroke="#CBD5E1" strokeWidth="2.5" />

          {/* Visor */}
          <rect x="29" y="47" width="42" height="20" rx="9" fill="url(#visorGrad)" />

          {/* Glowing Eyes */}
          <circle cx="41" cy="57" r="4.5" fill="url(#eyeGlow)" />
          <circle cx="42.5" cy="55.5" r="1.5" fill="#FFFFFF" />

          <circle cx="59" cy="57" r="4.5" fill="url(#eyeGlow)" />
          <circle cx="60.5" cy="55.5" r="1.5" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="28" cy="65" r="3.5" fill="#FDA4AF" opacity="0.8" />
          <circle cx="72" cy="65" r="3.5" fill="#FDA4AF" opacity="0.8" />

          {/* Cute Smile */}
          <path d="M46 72 Q50 75 54 72" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

          {/* Chef Hat */}
          <g>
            {/* Hat puffs */}
            <path d="M33 36 C28 28 35 15 45 20 C48 13 58 13 62 19 C71 16 76 28 70 36 Z" fill="url(#hatGrad)" stroke="#E2E8F0" strokeWidth="2" />
            {/* Hat band */}
            <rect x="33" y="33" width="36" height="7" rx="3" fill="#FF8A1F" />
            <line x1="39" y1="36.5" x2="63" y2="36.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>
        </svg>
      </div>
    );
  }

  // Large mascot for Smart Suggestions card or hero presentation
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 150" className="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="40" y1="85" x2="100" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="apronGrad" x1="50" y1="95" x2="90" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF8A1F" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="eyeGlowLg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="70" cy="142" rx="38" ry="7" fill="#000000" opacity="0.12" />

        {/* Robot Body */}
        <rect x="42" y="86" width="56" height="48" rx="20" fill="url(#bodyGrad)" stroke="#CBD5E1" strokeWidth="3" />

        {/* Apron */}
        <path d="M52 92 L88 92 L84 130 C84 132 82 134 80 134 L60 134 C58 134 56 132 56 130 Z" fill="url(#apronGrad)" />
        {/* Apron pocket */}
        <rect x="62" y="108" width="16" height="14" rx="4" fill="#FFFFFF" opacity="0.85" />
        {/* Tiny wooden spoon in pocket */}
        <line x1="68" y1="104" x2="72" y2="120" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="68" cy="103" rx="3" ry="2" fill="#D97706" />

        {/* Left Arm waving */}
        <path d="M42 98 Q26 92 24 78 Q23 72 28 72 Q34 72 36 82 L42 98" fill="#CBD5E1" />
        <circle cx="26" cy="74" r="5" fill="#94A3B8" />

        {/* Right Arm holding frying pan or spatula */}
        <path d="M98 98 Q114 96 116 108 L104 116" fill="#CBD5E1" />
        <line x1="114" y1="104" x2="126" y2="92" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="128" cy="90" r="7" fill="#334155" />

        {/* Antenna */}
        <line x1="70" y1="36" x2="70" y2="14" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="70" cy="11" r="7" fill="#FF8A1F" />
        <circle cx="70" cy="11" r="3.5" fill="#FFFBEB" />

        {/* Ears */}
        <rect x="29" y="56" width="7" height="15" rx="3.5" fill="#94A3B8" />
        <rect x="104" y="56" width="7" height="15" rx="3.5" fill="#94A3B8" />

        {/* Head */}
        <rect x="34" y="38" width="72" height="52" rx="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />

        {/* Dark Visor */}
        <rect x="42" y="48" width="56" height="26" rx="12" fill="#0F172A" />

        {/* Happy Arc Eyes */}
        <path d="M51 61 Q57 53 63 61" stroke="url(#eyeGlowLg)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M77 61 Q83 53 89 61" stroke="url(#eyeGlowLg)" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Blush */}
        <circle cx="41" cy="71" r="4.5" fill="#FB7185" opacity="0.75" />
        <circle cx="99" cy="71" r="4.5" fill="#FB7185" opacity="0.75" />

        {/* Mouth */}
        <path d="M64 78 Q70 83 76 78" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Chef Hat */}
        <g>
          <path d="M48 38 C40 26 50 8 64 15 C68 6 82 7 86 15 C98 9 106 24 96 38 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
          <rect x="48" y="34" width="48" height="9" rx="4.5" fill="#FF8A1F" />
          <line x1="56" y1="38.5" x2="88" y2="38.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
