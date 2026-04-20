import React from 'react';

interface ProgressProps {
  total: number;
  current: number;
}

export const Progress: React.FC<ProgressProps> = ({ total, current }) => (
  <div className="progress" aria-label={`Question ${current + 1} of ${total}`}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={"pd " + (i < current ? "done" : i === current ? "cur" : "")} />
    ))}
  </div>
);
