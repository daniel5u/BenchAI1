import React, { useState, useMemo } from 'react';

export interface ModelItem {
  id: string;
  name: string;
  params?: string;
  releaseDate?: string;
  averageScore: number;
  totalBenchmarks: number;
}

interface Props {
  models: ModelItem[];
  logo: string;
}

export default function PublisherModelList({ models, logo }: Props) {
  const [sortType, setSortType] = useState<'score' | 'date'>('score');

  const sortedModels = useMemo(() => {
    const list = [...models];

    if (sortType === 'score') {
      return list.sort((a, b) => b.averageScore - a.averageScore);
    } else {
      return list.sort((a, b) => {
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    }
  }, [models, sortType]);

  if (models.length === 0) {
    return <div className='text-slate-400 py-10 text-center'>No model information yet</div>
  }

  return (
    <div>
      {/** Control tab */}
      <div className='flex gap-4 mb-6 border-b border-slate-200'>
        <button
          onClick={() => setSortType('score')}
          className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 ${sortType === 'score'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          Sort by average score
        </button>
        <button
          onClick={() => setSortType('date')}
          className={`pb-3 px-1 text-sm font-bold transition-colors border-b-2 ${sortType === 'date'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          Sort by released date
        </button>
      </div>

      {/** Grid list */}
      <div className='w-full border border-slate-200 rounded-xl shadow'>
        <table className='w-full min-w-0 text-left border-collapse' >
          <thead className='bg-slate-50 border-b border-slate-200'>
            <tr>
              <th className='py-4 px-6 text-s font-black text-slate-400 uppercase tracking-wider'>Model Name</th>
              <th className='py-4 px-6 text-s font-black text-slate-400 uppercase tracking-wider text-center'>Param Size</th>
              <th className='py-4 px-6 text-s font-black text-slate-400 uppercase tracking-wider text-center'>Released Date</th>
              <th className='py-4 px-6 text-s font-black text-slate-400 uppercase tracking-wider text-center'>Average Score</th>
              <th className='py-4 px-6 text-s font-black text-slate-400 uppercase tracking-wider text-center'>Benchmark Count</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {sortedModels.map((model) => (
              <tr className='hover:bg-slate-50 transition group'>
                <td className='py-4 px-6'>
                  <a
                    key={model.id}
                    href={`/models/${model.id}`}
                    className='hover:text-indigo-600 font-bold'
                  >
                    <div className='flex items-center gap-3'>
                      <img src={logo} alt={model.id} className="w-6 h-6 object-contain" />
                      <h1>{model.name}</h1>
                    </div>

                  </a>
                </td>
                <td className='py-4 px-6 text-center'>
                  {model.params || "Unknown Size"}
                </td>
                <td className='py-4 px-6 text-center'>
                  {model.releaseDate || "Unknown Release Date"}
                </td>
                <td className='py-4 px-6 text-center'>
                  {model.averageScore}
                </td>
                <td className='py-4 px-6 text-center'>
                  {model.totalBenchmarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}