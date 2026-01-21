import { useState, useMemo, useEffect } from "react";
import BenchmarkCard from "./BenchmarkCard";
// 如果你不再需要 Iconify 可以去掉这个引用，因为我们改用了 SVG
// import { Icon } from "@iconify/react"; 

interface Props {
  allBenchmarks: any[];
}

type SortOption = 'trending' | 'date' | 'name';

export default function BenchmarkExplorer({ allBenchmarks }: Props) {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('trending');

  // URL Handling 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagFromUrl = params.get('tag');

    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
      window.history.replaceState({}, '', '/');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, []);

  //  Extract All Tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allBenchmarks.forEach(b => b.data.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
  }, [allBenchmarks]);

  // Core filter and sort
  const filteredAndSorted = useMemo(() => {
    // Filter
    let result = allBenchmarks.filter(b => {
      const matchesSearch =
        b.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.data.publisher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'All' || b.data.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    // Sort 
    return result.sort((a, b) => {
      if (sortBy === 'trending') {
        const scoreA = (a.data.trending?.views || 0) + (a.data.trending?.initialWeight || 0);
        const scoreB = (b.data.trending?.views || 0) + (b.data.trending?.initialWeight || 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'date') {
        return new Date(b.data.lastUpdated).getTime() - new Date(a.data.lastUpdated).getTime();
      }
      if (sortBy === 'name') {
        return a.data.name.localeCompare(b.data.name);
      }
      return 0;
    });
  }, [allBenchmarks, searchTerm, selectedTag, sortBy]);

  return (
    <div className="space-y-6">

      {/** Control Tab */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

        {/* Search Input Section */}
        <div className="relative w-full md:max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            type="text"
            placeholder="Search benchmarks..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

          {/*  Tag Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:block">
              Tag
            </span>
            <select
              className="w-full sm:w-auto bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 py-2.5 pl-3 pr-8 cursor-pointer outline-none"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value='All'>All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap hidden lg:block">
              Sort By
            </span>
            <select
              className="w-full sm:w-auto bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 py-2.5 pl-3 pr-8 cursor-pointer outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="trending">Popularity</option>
              <option value="date">Latest Update</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

        </div>
      </div>

      {/** Results Count */}
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Found {filteredAndSorted.length} Results
        </p>
      </div>

      {/** Display the result */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map(item => (
            <BenchmarkCard
              key={item.id}
              id={item.id}
              name={item.data.name}
              publisher={item.data.publisher}
              lastUpdated={item.data.lastUpdated}
              tags={item.data.tags}
              trending={item.data.trending}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <span className="text-4xl mb-4 block">🏜️</span>
          <p className="text-slate-400 font-bold">No benchmark matches your criteria</p>
        </div>
      )}
    </div>
  )
}