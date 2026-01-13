import React from "react";
import { DEFAULT_PUBLISHER, PUBLISHER_REGISTRY } from "../constants/publishers";

interface SnapshotItem {
  model: string;
  score: number;
  publisherInfo: PublisherInfo | null;
}

interface PublisherInfo {
  color: string;
  logo: string;
}

interface Props {
  snapshot: SnapshotItem[];
  unit: string;
}

export default function LeaderBoardChart({ snapshot, unit }: Props) {
  // Get the highest column
  const maxValInSet = Math.max(...snapshot.map((s) => s.score));

  // Set default information for model
  const defaultColor = "#94a3b8";
  const defaultLogo = "/logos/unknown.svg";

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-6">
      <div className="text-center text-[15px] font-bold font-mono text-slate-900">Benchmark Index:{unit}</div>
      <div className="overflow-x-auto pb-80 pt-10">
        <div className="relative flex items-end justify-center min-w-max h-64 border-b border-slate-300 px-10">

          {/* Background Grid */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-slate-100 w-full"></div>
            ))}
          </div>

          {snapshot.map((item, index) => {
            // Logic: Get the color and logo
            const color = item.publisherInfo?.color || defaultColor;
            const logo = item.publisherInfo?.logo || defaultLogo;

            const barHeight = item.score 

            return (
              <div key={item.model} className="relative flex flex-col items-center w-20 group" style={{ height: `${barHeight}%` }}>
                {/* Score */}
                <div className="absolute -top-6 text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                  {item.score}
                </div>

                {/* Bar */}
                <div
                  className="w-10 rounded-t-[5px] transition-all duration-500 hover:brightness-110 h-full"
                  style={{ backgroundColor: color }}
                ></div>

                {/* Info Container */}
                <div className="absolute top-full mt-2 flex flex-col items-center">
                  {/* Display Logo only when exists */}
                  {logo && (
                    <img
                      src={logo}
                      alt=""
                      className="w-4 h-4 object-contain"
                    />
                  )}

                  <div
                    className="whitespace-nowrap text-[12px] font-sans text-black tracking-tight"
                    style={{
                      transform: `translateX(-57%) rotate(-62deg)`,
                      transformOrigin: 'top right'
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
