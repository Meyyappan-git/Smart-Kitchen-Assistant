import React from 'react';

/**
 * Smart Fridge SVG Illustration for "My Fridge" card
 */
export default function FridgeIllustration({ className = '', width = 110, height = 130 }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 120 140" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-sm"
      >
        <defs>
          <linearGradient id="fridgeBody" x1="10" y1="10" x2="110" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="doorGrad" x1="15" y1="15" x2="105" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="panelGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="60" cy="134" rx="44" ry="5" fill="#000000" opacity="0.08" />

        {/* Outer Fridge Cabinet */}
        <rect x="15" y="8" width="90" height="124" rx="14" fill="url(#fridgeBody)" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Top Freezer Door */}
        <rect x="18" y="11" width="84" height="38" rx="10" fill="url(#doorGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Freezer Handle */}
        <rect x="23" y="24" width="5" height="14" rx="2.5" fill="#94A3B8" />

        {/* Smart Touch Display on Freezer Door */}
        <rect x="42" y="18" width="36" height="24" rx="6" fill="#0F172A" />
        {/* Glow Display Elements */}
        <circle cx="50" cy="26" r="2" fill="url(#panelGlow)" />
        <rect x="55" y="24" width="16" height="3" rx="1.5" fill="#38BDF8" />
        <rect x="48" y="32" width="23" height="3" rx="1.5" fill="#22C55E" />

        {/* Divider Gap */}
        <rect x="15" y="50" width="90" height="4" fill="#CBD5E1" />

        {/* Main Refrigerator Door (Slightly open perspective with soft glow) */}
        <rect x="18" y="55" width="84" height="74" rx="10" fill="url(#doorGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
        
        {/* Main Fridge Shelves & Contents Silhouette */}
        {/* Shelf 1 */}
        <line x1="24" y1="78" x2="96" y2="78" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        {/* Milk Bottle */}
        <rect x="28" y="62" width="10" height="15" rx="3" fill="#38BDF8" opacity="0.8" />
        <rect x="30" y="59" width="6" height="3" rx="1" fill="#0284C7" />
        {/* Juice carton */}
        <rect x="42" y="64" width="9" height="13" rx="2" fill="#FF8A1F" opacity="0.85" />
        {/* Cheese wedge */}
        <path d="M58 75 L68 75 L68 68 Z" fill="#FBBF24" />

        {/* Shelf 2 */}
        <line x1="24" y1="104" x2="96" y2="104" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        {/* Vegetable crisper bowl */}
        <circle cx="34" cy="97" r="5" fill="#EF4444" /> {/* Tomato */}
        <circle cx="43" cy="98" r="4.5" fill="#22C55E" /> {/* Apple/lime */}
        <circle cx="52" cy="96" r="5.5" fill="#F59E0B" /> {/* Orange */}
        <rect x="62" y="93" width="14" height="10" rx="3" fill="#10B981" opacity="0.75" /> {/* Greens */}

        {/* Bottom Crisper Drawer */}
        <rect x="24" y="110" width="72" height="14" rx="4" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="52" y1="117" x2="68" y2="117" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

        {/* Main Door Handle */}
        <rect x="23" y="65" width="5" height="24" rx="2.5" fill="#94A3B8" />

        {/* Smart Status Green LED Dot */}
        <circle cx="94" cy="20" r="2.5" fill="#22C55E" />
        <circle cx="94" cy="20" r="5" fill="#22C55E" opacity="0.3" />
      </svg>
    </div>
  );
}
