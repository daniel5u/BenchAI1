import { SolarPanelIcon } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';

interface SnapshotItem {
  model: string;
  score: number;
  modelId?: string;
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

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function LeaderBoardChart({ snapshot, unit }: Props) {
  // --- Hooks ---

  // Control the tooltip display
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  // Search keyword for model
  const [searchTerm, setSearchTerm] = useState("");

  // Selected model
  const [selectedModels, setSelectedModels] = useState<Set<string>>(() => {
    return new Set(snapshot.slice(0, 20).map((item) => item.model))
  });

  // Filtered data
  const displayData = useMemo(() => {
    return snapshot.filter((item) => selectedModels.has(item.model));
  }, [snapshot, selectedModels]);

  // Filter Option from search
  const filteredOptions = useMemo(() => {
    return snapshot.filter((item) =>
      item.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [snapshot, searchTerm]);

  // --- Handlers ---

  const toggleModel = (modelName: string) => {
    const newSet = new Set(selectedModels);
    if (newSet.has(modelName)) {
      newSet.delete(modelName);
    } else {
      newSet.add(modelName);
    }
    setSelectedModels(newSet);
  };

  const handleReset = () => {
    setSelectedModels(new Set(snapshot.slice(0, 20).map((i) => i.model)));
    setSearchTerm("");
  };

  const handleSelectedAllFiltered = () => {
    const newSet = new Set(selectedModels);
    filteredOptions.forEach(item => newSet.add(item.model));
    setSelectedModels(newSet);
  }

  return (
    <div className='w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>

      {/** Top control tab */}
      <div className='flex justify-between items-center mb-10 relative'>

        {/** MatrixUnit */}
        <div className='text-[15px] font-bold font-mono text-slate-900'>
          Index: {unit}
        </div>

        {/** Tooltip */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isDropdownOpen
              ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50 text-indigo-700"
              : "border-slate-300 hover:border-slate-400 text-slate-700 bg-white"
              }`}
          >
            <span className='text-sm font-bold'>Select Models</span>
            <span className='bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-mono'>
              {selectedModels.size}
            </span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {isDropdownOpen && (
            <div className='absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-right'>

              {/** Search tab */}
              <div className='p-3 border-b border-slate-100 bg-slate-50'>
                <input
                  type="text"
                  placeholder='Search to add...'
                  className='w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {/** Result list */}
              <div className='max-h-64 overflow-y-auto p-2 space-y-1'>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((item) => (
                    <label
                      key={item.model}
                      className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors'
                    >
                      <input
                        type="checkbox"
                        className='w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                        checked={selectedModels.has(item.model)}
                        onChange={() => toggleModel(item.model)}
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium text-slate-900 truncate'>
                          {item.model}
                        </div>
                        <div className='text-xs text-slate-400 truncate'>
                          score: {item.score}
                        </div>
                      </div>
                      {item.publisherInfo?.logo && (
                        <img src={item.publisherInfo.logo} className='w-5 h-5 object-contain opacity-50' alt='' />
                      )}
                    </label>
                  ))
                ) : (
                  <div className='p-4 text-center text-xs text-slate-400'>No models found</div>
                )}
              </div>

              {/** Control tabs */}
              <div className='p-2 border-t border-slate-100 bg-slate-50 flex justify-between'>
                <button
                  onClick={handleReset}
                  className='text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1'
                >
                  Reset to Top 10
                </button>
                {searchTerm && (
                  <button
                    onClick={handleSelectedAllFiltered}
                    className='text-xs font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1'
                  >
                    Select All "{searchTerm}"
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/** Chart Area */}
      <div className='overflow-x-auto pb-40 pt-10 scrollbar-hide'>
        {displayData.length > 0 ? (
          <div className='relative flex items-end justify-center min-w-max h-64 border-b border-slate-300 px-10 gap-2 md:gap-4'>

            {/** Background */}
            <div className='absolute inset-0 flex flex-col justify-between pointer-events-none'>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className='border-t border-slate-100 w-full'></div>
              ))}
            </div>

            {/** Data display */}
            {displayData.map((item) => {
              const color = item.publisherInfo?.color;
              const logo = item.publisherInfo?.logo;

              return (
                <a
                  href={`../../models/${item.modelId}`}
                  key={item.model}
                  className='relative flex flex-col items-center w-8 md:w-10 group animate-in slide-in-from-bottom-4 fade-in duration-500'
                  style={{ height: `${item.score}%` }}
                >

                  {/** Display Score */}
                  <div className='absolute -top-8 text-[10px] md:text-[11px] font-mono font-bold text-slate-400'>
                    {item.score}
                  </div>

                  {/** Bar */}
                  <div
                    className='w-full rounded-t-md transition-all duration-300 shadow hover:brightness-110 h-full relative'
                    style={{ backgroundColor: color }}
                  >
                    <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity'></div>
                  </div>

                  {/** Info Container */}
                  <div className='absolute top-full mt-3 flex flex-col items-center z-10'>
                    {logo && (
                      <img
                        src={logo}
                        alt=""
                        className='w-4 h-4 md:w-5 md:h-5 object-contain mb-1 drop-shadow-sm'
                      />
                    )}

                    <div
                      className='whitespace-nowrap text-[10px] md:text-[12px] font-medium text-slate-700 tracking-tight origin-top-left'
                      style={{
                        transform: `translateX(-57%) rotate(-62deg)`,
                        transformOrigin: 'top right'
                      }}
                    >
                      {item.model.length > 20 ? item.model.slice(0, 18) + '..' : item.model}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className='h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200'>
            No models selected. Please select from the menu
          </div>
        )}
      </div>
    </div>
  )
}
