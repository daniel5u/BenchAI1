import React, { useState, useMemo, useEffect } from "react";

export interface ModelIndexItem {
  id: string;
  name: string;
  publisher: PublisherInfo;
  averageScore: number;
  releaseDate?: string;
  params?: string;
}
export interface PublisherInfo {
  name: string;
  logo: string;
}

interface Props {
  models: ModelIndexItem[];
  publishers: PublisherInfo[];
}

const ITEMS_PER_PAGE = 18;

export default function ModelFilterableList({ models, publishers }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("All");
  const [sortType, setSortType] = useState<"score" | "date">("score");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredModels = useMemo(() => {
    return models
      .filter((model) => {
        // Search term filter
        const matchSearch = model.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchPublisher =
          selectedPublisher === "All" ||
          model.publisher.name === selectedPublisher;
        return matchSearch && matchPublisher;
      })
      .sort((a, b) => {
        if (sortType === "score") {
          return b.averageScore - a.averageScore;
        } else {
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        }
      });
  }, [models, searchTerm, selectedPublisher, sortType]);

  // Back to page 1 when filter condition changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPublisher, sortType]);

  const totalPages = Math.ceil(filteredModels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentModels = filteredModels.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .getElementById("model-list-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/** Anchor for the page number */}
      <div id="model-list-top"></div>
      {/** Control Tab */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
        {/* 1. Search Input Section */}
        <div className="relative w-full md:max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search Models"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* 2. Publisher Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:block">
              Publisher
            </span>
            <select
              className="w-full sm:w-auto bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 py-2.5 pl-3 pr-8 cursor-pointer outline-none"
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
            >
              <option value="All">All publishers</option>
              {publishers.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Sort Control */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:block">
              Sort By
            </span>
            <select
              className="w-full sm:w-auto bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 py-2.5 pl-3 pr-8 cursor-pointer outline-none"
              value={sortType}
              onChange={(e) => setSortType(e.target.value as "score" | "date")}
            >
              <option value="score">Score</option>
              <option value="date">Date</option>
            </select>
          </div>

          {/* 4. Compare Button */}
          <div className="flex">
            <a
              href="/compare"
              className="
                inline-flex items-center justify-center 
                px-4 py-2 
                bg-slate-800 hover:bg-slate-700 
                text-white text-xs font-bold 
                rounded-lg transition-colors duration-200
                whitespace-nowrap
              "
            >
              Compare Models
            </a>
          </div>
        </div>
      </div>

      {/** Model list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
        {currentModels.map((model) => (
          <a
            key={model.id}
            href={`/models/${model.id}`}
            className="group block bg-white border border-slate-200 rounded-xl p-3 hover:border-indigo-400 hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {model.name}
                </h3>
                <div className="inline-flex justify-center bg-slate-100 px-2 py-1 rounded mt-1 gap-1">
                  <img src={model.publisher.logo} className="w-4 h-4"></img>
                  <div className="text-xs font-bold text-slate-500 ">
                    {model.publisher.name}
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 text-indigo-700 font-black text-xl px-3 py-2 rounded-lg">
                {model.averageScore}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-4 relative z-10">
              <span>{model.params || "N/A"}</span>
              <span>{model.releaseDate || "N/A"}</span>
            </div>
          </a>
        ))}
      </div>
      {filteredModels.length === 0 && (
        <div className="col-span-full text-center py-20 text-slate-400">
          No models found
        </div>
      )}

      {/** Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {/** Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            Prev
          </button>

          {/** Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-colors ${currentPage === page ? "bg-slate-600 text-white" : "text-slate-600 hover:bg-slate-300"}`}
              >
                {page}
              </button>
            ))}
          </div>

          {/** Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
