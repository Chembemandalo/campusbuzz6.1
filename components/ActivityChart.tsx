import React from 'react';

const ActivityChart: React.FC = () => {
  const size = 130;
  const strokeWidth = 10;
  const radius1 = (size / 2) - (strokeWidth / 2);
  const radius2 = radius1 - strokeWidth - 2;
  const radius3 = radius2 - strokeWidth - 2;
  
  // Dummy data
  const progress1 = 72.5; // 29/40
  const progress2 = 66.6; // 8/12
  const progress3 = 57.1; // 4/7
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circles */}
      <circle cx={size/2} cy={size/2} r={radius1} fill="transparent" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius2} fill="transparent" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius3} fill="transparent" stroke="#E5E7EB" strokeWidth={strokeWidth} />
      
      {/* Progress rings */}
      <circle cx={size/2} cy={size/2} r={radius1} fill="transparent" stroke="#FBBF24" strokeWidth={strokeWidth} strokeDasharray={2 * Math.PI * radius1} strokeDashoffset={(2 * Math.PI * radius1) * (1 - progress1 / 100)} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round"/>
      <circle cx={size/2} cy={size/2} r={radius2} fill="transparent" stroke="#60A5FA" strokeWidth={strokeWidth} strokeDasharray={2 * Math.PI * radius2} strokeDashoffset={(2 * Math.PI * radius2) * (1 - progress2 / 100)} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round"/>
      <circle cx={size/2} cy={size/2} r={radius3} fill="transparent" stroke="#34D399" strokeWidth={strokeWidth} strokeDasharray={2 * Math.PI * radius3} strokeDashoffset={(2 * Math.PI * radius3) * (1 - progress3 / 100)} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round"/>
    </svg>
  );
};

export default ActivityChart;