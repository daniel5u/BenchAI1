import { useState, useMemo, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  X,
  Search,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import { BENCH_CATEGORIES } from "../consts";

interface ModelData {
  id: string;
  name: string;
  publisherColor: string;
  publisherName: string;
  radar: { subject: string; A: number }[];
  scores: Record<string, number>;
}

interface BenchmarkMeta {
  id: string;
  name: string;
  category: string;
}

interface Props {
  allModels: ModelData[];
  benchmarkMeta: BenchmarkMeta[];
}

export default function ModelComparator({ allModels, benchmarkMeta }: Props) {
  // States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialization: Read Props from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelsParam = params.get("models");
    if (modelsParam) {
      // The url format would be like: url?models=id1,id2,id3
      const ids = modelsParam
        .split(",")
        .filter((id) => allModels.find((m) => m.id === id));
      setSelectedIds(ids);
    }
  }, []);

  // Update url silently
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedIds.length > 0) {
      url.searchParams.set("models", selectedIds.join(","));
    } else {
      url.searchParams.delete("models");
    }
    window.history.replaceState({}, "", url);
  }, [selectedIds]);

  const toggleModel = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const clearAll = () => setSelectedIds([]);

  const selectedModels = useMemo(() => {
    return selectedIds.map((id) => allModels.find((m) => m.id === id)!);
  }, [selectedIds, allModels]);

  // Options based on search
  const filteredOptions = useMemo(() => {
    return allModels.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.publisherName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allModels]);

  const chartData = useMemo(() => {
    if (selectedModels.length === 0) return [];
    return BENCH_CATEGORIES.map((category) => {
      const point: any = { subject: category, fullMark: 100 };
      selectedModels.forEach((m) => {
        const item = m.radar.find((r) => r.subject === category);
        point[m.name] = item ? item.A : 0;
      });
      return point;
    });
  }, [selectedModels]);

  const legendTextSize = selectedModels.length > 5 ? "text-[10px]" : "text-xs";
  const legendIconSize = selectedModels.length > 5 ? "w-2 h-2" : "w-3 h-3";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Selector Panel */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[80vh] sticky top-6">
        {/* Header */}
        <div
          className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer lg:cursor-default"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          <div>
            <h2 className="font-bold text-slate-800">Select Models</h2>
            <p className="text-xs text-slate-500">
              {selectedIds.length} selected
            </p>
          </div>
          <div className="lg:hidden">
            {isPanelOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {/* span area */}
        <div
          className={clsx(
            "flex flex-col flex-1 overflow-hidden transition-all",
            isPanelOpen ? "h-auto" : "h-0 lg:h-auto",
          )}
        >
          {/* search tab */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or publisher..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 border rounded-lg text-sm outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* rollable list */}
          <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-thin min-h-[300px] lg:min-h-0">
            {filteredOptions.slice(0, 50).map((m) => {
              const isSelected = selectedIds.includes(m.id);

              return (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={clsx(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-all",
                    isSelected
                      ? "bg-indigo-50 border border-indigo-200 shadow-sm"
                      : "hover:bg-slate-50 border border-transparent",
                  )}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div
                      className={clsx(
                        "truncate",
                        isSelected ? "text-indigo-900" : "text-slate-700",
                      )}
                    >
                      {m.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {m.publisherName}
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: "bg-indigo-50" }}
                      ></div>
                      <CheckCircle2 size={18} className="text-indigo-600" />
                    </div>
                  ) : (
                    <Circle size={18} className="text-slate-300" />
                  )}
                </button>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No models found.
              </div>
            )}
          </div>

          {/* clear */}
          {selectedIds.length > 0 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button
                onClick={clearAll}
                className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 w-full min-w-0 space-y-8">
        {selectedIds.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Radar className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-500">
              Select models from the list to compare
            </p>
            <p className="text-sm mt-2">
              You can search and select multiple models.
            </p>
          </div>
        ) : (
          <>
            {/* Chosen models */}
            <div className="flex flex-wrap gap-2">
              {selectedModels.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 rounded-full text-white text-sm font-bold shadow-sm pr-1 transition-all animate-in fade-in zoom-in-95"
                >
                  {m.name}
                  <button
                    onClick={() => toggleModel(m.id)}
                    className="p-1 hover:bg-white/20 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="90%"
                  data={chartData}
                >
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />

                  {selectedModels.map((m) => (
                    <Radar
                      key={m.id}
                      name={m.name}
                      dataKey={m.name}
                      fillOpacity={0.6}
                      stroke={m.publisherColor}
                      strokeWidth={3}
                      fill={m.publisherColor}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 w-[80%] mx-auto">
              <div className="flex flex-wrap justify-center gap-3">
                {selectedModels.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-1.5 text-slate-600 font-medium transition-all ${legendTextSize}`}
                  >
                    <span
                      className={`rounded-full shadow-sm ${legendIconSize}`}
                      style={{ backgroundColor: m.publisherColor }}
                    />
                    <span className="truncate max-w-[120px]">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Result table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Benchmark Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="w-px px-6 py-4 font-black text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                        Benchmark
                      </th>
                      {selectedModels.map((m) => (
                        <th
                          key={m.id}
                          className="px-6 py-4 font-bold text-center"
                        >
                          {m.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {benchmarkMeta.map((bench) => (
                      <tr
                        key={bench.id}
                        className="hover:bg-slate-50 group transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 z-10">
                          {bench.name}
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            {bench.category}
                          </span>
                        </td>
                        {selectedModels.map((m) => {
                          const score = m.scores[bench.id];
                          // Calculate the maximum
                          const rowScores = selectedModels.map(
                            (sm) => sm.scores[bench.id] || 0,
                          );
                          const maxScore = Math.max(...rowScores);
                          const isWinner = score === maxScore && score > 0;

                          return (
                            <td key={m.id} className="px-6 py-4 text-center">
                              {score ? (
                                <span
                                  className={clsx(
                                    "px-2 py-1 rounded-md transition-all",
                                    isWinner
                                      ? "text-black font-bold font-mono"
                                      : "text-slate-600 font-mono",
                                  )}
                                >
                                  {score}
                                </span>
                              ) : (
                                <span className="text-slate-300">N/A</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
