import React from 'react';
import type { MotifKind } from '../types';

interface MotifProps {
  kind: MotifKind;
  size?: number;
  small?: boolean;
}

export const Motif: React.FC<MotifProps> = ({ kind, size = 88, small = false }) => {
  const s = size;
  const cx = s / 2, cy = s / 2;
  const cls = small ? "breathe-small" : "breathe";
  
  if (kind === "orb") {
    return (
      <svg className={cls} width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
        <defs>
          <radialGradient id="g-orb" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".7" />
            <stop offset="50%" stopColor="currentColor" stopOpacity=".3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={s * 0.45} fill="url(#g-orb)" />
        <circle cx={cx} cy={cy} r={s * 0.35} fill="currentColor" fillOpacity=".2" />
        <circle cx={cx} cy={cy} r={s * 0.24} fill="currentColor" fillOpacity=".5" />
        <circle cx={cx} cy={cy} r={s * 0.12} fill="currentColor" fillOpacity=".9" />
        {/* Extra detail ring */}
        <circle cx={cx} cy={cy} r={s * 0.48} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="0.5" />
      </svg>
    );
  }
  
  if (kind === "rings") {
    return (
      <svg className={cls} width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
        {[0.48, 0.40, 0.32, 0.24, 0.16].map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={s * r}
            fill="none" stroke="currentColor"
            strokeOpacity={0.2 + i * 0.15} strokeWidth={i === 4 ? 2 : 1.2} />
        ))}
        <circle cx={cx} cy={cy} r={s * 0.06} fill="currentColor" fillOpacity=".9" />
        {/* Subtle crosshair details */}
        <line x1={cx} y1={cy - s*0.5} x2={cx} y2={cy + s*0.5} stroke="currentColor" strokeOpacity=".1" strokeWidth="0.5" />
        <line x1={cx - s*0.5} y1={cy} x2={cx + s*0.5} y2={cy} stroke="currentColor" strokeOpacity=".1" strokeWidth="0.5" />
      </svg>
    );
  }
  
  if (kind === "wave") {
    const W = s * 1.8, H = s * 0.6;
    return (
      <svg className={"wave-motif"} width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {/* Added a third wave for depth */}
        <g className="wave-path-1" style={{ opacity: 0.9 }}>
          <path d={`M ${-W * 0.2} ${H * 0.5}
                    Q ${W * 0.15} ${H * 0.10}, ${W * 0.40} ${H * 0.5}
                    T ${W * 0.90} ${H * 0.5}
                    T ${W * 1.40} ${H * 0.5}`}
            stroke="currentColor" strokeOpacity=".85" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
        <g className="wave-path-2" style={{ opacity: 0.6 }}>
          <path d={`M ${-W * 0.2} ${H * 0.65}
                    Q ${W * 0.15} ${H * 0.30}, ${W * 0.40} ${H * 0.65}
                    T ${W * 0.90} ${H * 0.65}
                    T ${W * 1.40} ${H * 0.65}`}
            stroke="currentColor" strokeOpacity=".4" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
        <g className="wave-path-1" style={{ opacity: 0.3, transform: 'translateY(10px) translateX(-20px)' }}>
          <path d={`M ${-W * 0.2} ${H * 0.4}
                    Q ${W * 0.15} ${H * 0.05}, ${W * 0.40} ${H * 0.4}
                    T ${W * 0.90} ${H * 0.4}
                    T ${W * 1.40} ${H * 0.4}`}
            stroke="currentColor" strokeOpacity=".2" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  
  // Lotus variant
  return (
    <svg className={cls} width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden>
      {/* Background glow */}
      <circle cx={cx} cy={cy} r={s * 0.4} fill="currentColor" fillOpacity=".05" />
      
      {/* Petals */}
      {[0, -45, 45, -90, 90, 135, -135, 180].map((rot, i) => (
        <ellipse key={i} cx={cx} cy={cy - s * 0.15} rx={s * 0.1} ry={s * 0.28}
          fill="currentColor" fillOpacity={i < 5 ? 0.4 : 0.2}
          transform={`rotate(${rot} ${cx} ${cy})`} />
      ))}
      {/* Center detail */}
      <circle cx={cx} cy={cy} r={s * 0.08} fill="currentColor" fillOpacity=".8" />
      <circle cx={cx} cy={cy} r={s * 0.12} fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="1" />
    </svg>
  );
};
