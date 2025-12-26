interface Props{
	id: string; //Add ID for routing
	name: string;
	publisher: string;
	lastUpdated: string;
	tags: string[];
}

export default function BenchmarkCard({id,name,publisher,lastUpdated,tags}: Props){
	return(
		<a
			href={`/benchmarks/${id}`}
			className="block group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all duration-200"
		>
			<div className="flex justify-between items-start mb-3">
				<h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
					{name}
				</h3>
				<span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
					Updated: {lastUpdated}
				</span>
			</div>

			<p className="text-sm text-slate-500 mb-4">
				by <span className="font-medium text-slate-700">{publisher}</span>
			</p>

			<div className="flex flex-wrap gap-2">
				{tags.map(tag => (
					<span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-200">
						{tag}
					</span>
				))}
			</div>
		</a>
	);
}