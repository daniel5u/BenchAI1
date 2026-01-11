import { Icon } from "@iconify/react";

interface Props {
	id: string; //Add ID for routing
	name: string;
	publisher: string;
	lastUpdated: string;
	tags: string[];
	trending?: { views: number; initialWeight: number };
}

export default function BenchmarkCard({ id, name, publisher, lastUpdated, tags, trending }: Props) {
	const totalHeat = (trending?.views || 0) + (trending?.initialWeight || 0);

	return (
		<a
			href={`/benchmarks/${id}`}
			className="block group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all duration-200"
		>
			<div className="flex justify-between items-start mb-1	">
				<h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
					{name}
				</h3>

				{/** Display the trending of the benchmark */}
				{totalHeat > 0 && (
					<div className="flex items-center gap-1 text-[11px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
						<Icon icon="majesticons:fire" />
						<span className="Leading-none">
							{totalHeat.toLocaleString()}
						</span>
					</div>
				)}
			</div>

			<p className="text-xs text-slate-400 mb-3 font-medium">by {publisher}</p>

			<div className="flex flex-wrap gap-2">
				{tags.map(tag => (
					<span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-200">
						{tag}
					</span>
				))}
			</div>

			<div className="mt-3 border-t border-slate-50 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
				Sync: {lastUpdated}
			</div>
		</a>
	);
}
