import { useState, useMemo, useEffect } from "react";
import BenchmarkCard from "./BenchmarkCard";
import { Icon } from "@iconify/react";

interface Props {
  allBenchmarks: any[];
}

type SortOption = 'trending' | 'date' | 'name';

export default function BenchmarkExplorer({ allBenchmarks }: Props) {
  // Only show the current input of search query
  const [inputValue, setInputValue] = useState('')

  // The query passed to search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('trending');

  // Handle search query
  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagFromUrl = params.get('tag');

    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);

      window.history.replaceState({}, '', '/');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Extract all the Tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allBenchmarks.forEach(b => b.data.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
  }, [allBenchmarks]);

  // Filtering and sorting core
  const filteredAndSorted = useMemo(() => {
    // Filter
    let result = allBenchmarks.filter(b => {
      const matchesSearch =
        b.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.data.publisher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? b.data.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });

    // Sort the filtered result
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
  }, [allBenchmarks, searchQuery, selectedTag, sortBy]);

  return (
    <div className="space-y-10">
      {/** Search and Sort column */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

        {/** Search input and Search button */}
        <div className="relative w-full md:max-w-md group flex flex-grow">
          <div className="relative">
            {/* <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">🔍</span> */}
            <Icon icon="lucide:search" className="absolute top-1/2 -translate-y-1/2 left-2 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search benchmarks"
              className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-l-xl text-sm focus-ring-2 focus:ring-indigo-500 transition-all"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-6 py-3 rounded-r-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-800 transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Sort By</span>
          <select
            className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 py-2 pl-3 pr-8"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="trending">Popularity</option>
            <option value="date">Latest Update</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/** Tag filter column */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedTag === null ? 'bg-indigo-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
            }`}
        >
          ALL
        </button>

        {allTags.map(tag => (
          <button key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedTag === tag ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/** Display the result */}
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Found {filteredAndSorted.length} Results
        </p>
      </div>

      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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