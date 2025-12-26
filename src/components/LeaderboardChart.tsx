import React from "react";
import { DEFAULT_PUBLISHER, PUBLISHER_REGISTRY } from "../constants/publishers";

interface SnapshotItem{
  model: string;
  score: number;
  publisher?: string;
}

interface Props{
  snapshot: SnapshotItem[];
  unit: string;
  isBetterHigher: boolean;
}

export default function LeaderBoardChart({ snapshot, unit, isBetterHigher }: Props){
  // 1.Logic: Identify the SOTA (which is the 'BEST' score)
  const scores = snapshot.map(s => s.score);
  const sotaScore = isBetterHigher ? Math.max(...scores) : Math.min(...scores);

  // 2.Logic: Sort the data to show the best models
  const sortedData = [...snapshot].sort((a,b) => 
    isBetterHigher ? b.score-a.score : a.score-b.score
  );

  // 3.Chart Scaling: set the BEST bar as 100%
  const maxValInSet = Math.max(...scores);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-6 overflow-hidden">
      <div className="text-center text-[15px] font-bold font-mono text-slate-900">Benchmark Index:{unit}</div>
      <div className="overflow-x-auto overflow-y-hidden pb-25 pt-10">
        <div className="relative flex items-end justify-center min-w-max h-64 border-b border-slate-300 px-10">
          
          {/* Background Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-slate-100 w-full"></div>
            ))}
          </div>

          {sortedData.map((item) => {
            // Logic: Display the publisher, DEFAULT when not exists
            const pubInfo = (item.publisher && PUBLISHER_REGISTRY[item.publisher]) 
                            || DEFAULT_PUBLISHER;
            
            const barHeight = (item.score / maxValInSet) * 100;

            return (
              <div key={item.model} className="relative flex flex-col items-center w-20 group" style={{ height: `${barHeight}%` }}>
                {/* Score */}
                <div className="absolute -top-6 text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  {item.score}
                </div>

                {/* Bar */}
                <div 
                  className="w-10 rounded-t-[5px] transition-all duration-500 hover:brightness-110 h-full"
                  style={{ backgroundColor: pubInfo.color }}
                ></div>

                {/* Info Container */}
                <div className="absolute top-full mt-2 flex flex-col items-center">
                  {/* Display Logo only when exists */}
                  {pubInfo.logo && (
                    <img 
                      src={pubInfo.logo} 
                      alt="" 
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  
                  <div 
                    className="whitespace-nowrap text-[11px] font-mono font-bold text-slate-900"
                    style={{
                      transform: `translate(-12px, ${pubInfo.logo ? '30px' : '0px'}) rotate(-62deg)`,
                      transformOrigin: 'top left'
                    }}
                  >
                    {item.model.split('/').map((word, i) => (
                      <span key={i} className="block text-right">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}