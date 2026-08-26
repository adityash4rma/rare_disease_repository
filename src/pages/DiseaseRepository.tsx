import type { FC } from 'react';
import { Search, ChevronDown, Bell, Mail, HelpCircle, CheckCircle2, ArrowRight, Dna, Activity, Beaker, Brain, Droplets } from 'lucide-react';

const DiseaseRepository: FC = () => {
  // This is where the Backend Data will eventually go
  const diseases = [
    { id: 1, name: 'Cystic Fibrosis', tags: ['Genetic', 'Autosomal Recessive'], datasets: 14, studies: 7, color: 'bg-blue-50', icon: Droplets, iconColor: 'text-blue-500' },
    { id: 2, name: 'Duchenne Muscular Dystrophy', tags: ['Genetic', 'X-linked Recessive'], datasets: 14, studies: 5, color: 'bg-green-50', icon: Activity, iconColor: 'text-green-500' },
    { id: 3, name: 'Spinal Muscular Atrophy', tags: ['Genetic', 'Autosomal Recessive'], datasets: 12, studies: 6, color: 'bg-purple-50', icon: Brain, iconColor: 'text-purple-500' },
    { id: 4, name: 'Sickle Cell Disease', tags: ['Hematological', 'Genetic'], datasets: 16, studies: 8, color: 'bg-orange-50', icon: Droplets, iconColor: 'text-orange-500' },
    { id: 5, name: 'Rare Epileptic Encephalopathy', tags: ['Neurological', 'Genetic'], datasets: 9, studies: 3, color: 'bg-indigo-50', icon: Brain, iconColor: 'text-indigo-500' },
    { id: 6, name: 'Wilson Disease', tags: ['Metabolic', 'Genetic'], datasets: 7, studies: 2, color: 'bg-teal-50', icon: Beaker, iconColor: 'text-teal-500' },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      {/* 1. Top Header Bar (Same as Dashboard) */}
      <header className="flex justify-between items-center mb-10">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input type="text" placeholder="Search for diseases, datasets, institutions..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-full border-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} /> <Mail size={20} /> <HelpCircle size={20} />
          </div>
          <button className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm">
            <CheckCircle2 size={16} /> Verified Researcher
          </button>
        </div>
      </header>

      {/* 2. Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Disease Repository</h1>
        <p className="text-slate-400 text-sm mt-1">Explore rare diseases and related information.</p>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input type="text" placeholder="Search for a disease (e.g., Cystic Fibrosis)" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none outline-none text-sm" />
        </div>
        <button className="flex items-center justify-between w-48 px-4 bg-slate-50 rounded-2xl text-slate-600 text-sm font-medium">
          All Categories <ChevronDown size={16} />
        </button>
        <button className="flex items-center justify-between w-48 px-4 bg-slate-50 rounded-2xl text-slate-600 text-sm font-medium">
          Sort by: Name (A-Z) <ChevronDown size={16} />
        </button>
      </div>

      {/* 4. Disease Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {diseases.map((disease) => (
          <div key={disease.id} className={`${disease.color} rounded-[2.5rem] p-8 border border-white/50 shadow-sm hover:shadow-md transition-all cursor-pointer group`}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                <disease.icon className={disease.iconColor} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{disease.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                  {disease.tags.join('  •  ')}
                </p>
              </div>
            </div>

            <div className="flex gap-10 mb-8 border-t border-slate-200/30 pt-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Datasets</p>
                <p className="text-xl font-bold text-slate-800">{disease.datasets}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Studies</p>
                <p className="text-xl font-bold text-slate-800">{disease.studies}</p>
              </div>
            </div>

            <button className="flex items-center gap-2 text-indigo-600 text-xs font-bold group-hover:gap-3 transition-all">
              View Details <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseRepository;