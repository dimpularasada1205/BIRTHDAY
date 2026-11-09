import React, { useMemo } from 'react';

export const FloatingParticles: React.FC = () => {
  // Generate random particles with fixed deterministic seeds for stability
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const type = i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'star' : 'sparkle';
      const size = 10 + (i * 3) % 18;
      const left = (i * 13.7) % 96 + 2;
      const duration = 12 + (i * 2.3) % 16;
      const delay = (i * 1.5) % 8;
      const opacity = 0.2 + ((i * 7) % 5) * 0.1;

      return { id: i, type, size, left, duration, delay, opacity };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle deep background vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#200615]/40 to-[#12030d]/80 pointer-events-none" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-pink-300 select-none animate-float"
          style={{
            left: `${p.left}%`,
            top: `${(p.id * 19.3) % 85}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 0 6px rgba(244, 114, 182, 0.4))',
          }}
        >
          {p.type === 'heart' && '❤️'}
          {p.type === 'star' && '✨'}
          {p.type === 'sparkle' && '⭐'}
        </div>
      ))}
    </div>
  );
};
