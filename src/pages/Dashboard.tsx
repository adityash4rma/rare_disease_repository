import type { FC } from 'react';

import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Database, Landmark, FileText, FlaskConical, 
  ChevronRight 
} from 'lucide-react';

const StatCard = ({ icon: Icon, count, label, color, linkText }: any) => {
  const colorMap: any = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  };
  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className="relative mt-8 group cursor-pointer">
      {/* Folder Tab */}
      <div className="absolute -top-8 left-0 h-10 w-32 bg-white rounded-t-3xl border-t border-l border-r border-slate-100 flex items-center justify-center">
        <div className={`w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center ${theme.icon}`}>
          <Icon size={18} />
        </div>
      </div>
      {/* Folder Body */}
      <div className="bg-white rounded-b-3xl rounded-tr-3xl p-6 border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
        <div className="mt-2">
          <h4 className="text-4xl font-bold text-slate-800">{count}</h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-1">{label}</p>
          <div className="mt-6 flex items-center gap-1 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
            {linkText} <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Page ---
const Dashboard: FC = () => {
  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for diseases, datasets, institutions..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <div className="relative cursor-pointer hover:text-indigo-600"><Bell size={20} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span></div>
            <div className="relative cursor-pointer hover:text-indigo-600"><Mail size={20} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span></div>
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors">
            <CheckCircle2 size={16} /> Verified Researcher
          </button>
        </div>
      </header>

      {/* 2. Purple Welcome Banner */}
      <div className="bg-gradient-to-r from-[#7C5C9E] to-[#5A4175] rounded-[2.5rem] p-12 text-white mb-10 shadow-xl shadow-purple-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back, Dr. Priya 👋</h2>
          <p className="text-purple-100 font-medium">Explore rare diseases, discover datasets, and collaborate securely.</p>
        </div>
        {/* Abstract circle decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
      </div>

      {/* 3. Folder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Database} count="24" label="Rare Diseases" color="indigo" linkText="View Detail" />
        <StatCard icon={Landmark} count="42" label="Participating Institutions" color="slate" linkText="View institutions" />
        <StatCard icon={FileText} count="126" label="Available Datasets" color="teal" linkText="Browse datasets" />
        <StatCard icon={FlaskConical} count="18" label="Active Research Studies" color="orange" linkText="View studies" />
      </div>

      {/* 4. Middle Section (Chart & Search) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Donut Chart Box */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 text-sm">Dataset Availability by Data Type</h3>
          <p className="text-[10px] text-slate-400 mb-8 uppercase font-bold tracking-tighter">* Multiple data types possible in one dataset</p>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full border-[10px] border-indigo-500 flex items-center justify-center relative">
              <div className="text-center">
                <span className="block text-xl font-bold">126</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none">Total Datasets</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
               <LegendItem label="Clinical Data" count="98" percent="77.8%" color="bg-indigo-500" />
               <LegendItem label="Genetic Data" count="76" percent="60.3%" color="bg-purple-500" />
               <LegendItem label="Imaging Data" count="54" percent="42.9%" color="bg-blue-400" />
               <LegendItem label="Treatment Data" count="88" percent="69.8%" color="bg-orange-400" />
            </div>
          </div>
        </div>

        {/* Big Search Box */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-teal-50 shadow-sm border-b-4 border-b-teal-400">
           <h3 className="font-bold text-slate-800 mb-1">Find Diseases & Datasets</h3>
           <p className="text-xs text-slate-400 mb-6">Search rare diseases and discover available data across institutions.</p>
           <div className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-4 text-slate-400" />
                <input type="text" placeholder="Search for a disease (e.g., Cystic Fibrosis, Sickle Cell)" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none text-sm" />
              </div>
              <button className="bg-indigo-600 text-white px-10 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Search</button>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">Popular Searches</p>
           <div className="flex flex-wrap gap-2">
              {['Cystic Fibrosis', 'Sickle Cell Disease', 'Duchenne Muscular Dystrophy', 'Spinal Muscular Atrophy'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-[#B2D8D0]/30 text-teal-800 rounded-full text-[11px] font-bold cursor-pointer hover:bg-[#B2D8D0]/50 transition-colors">{tag}</span>
              ))}
           </div>
        </div>
      </div>

      {/* 5. Bottom Section (Federated Studies) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-slate-800">Active Federated Studies</h3>
          <button className="text-indigo-600 text-xs font-bold hover:underline">View all</button>
        </div>
        <div className="space-y-8">
           <StudyRow label="RareGen AI Study" institutions="5" patients="862" progress={50} round="Round 4/8" />
           <StudyRow label="Treatment Outcome Analysis" institutions="2" patients="532" progress={30} round="Round 3/10" />
        </div>
      </div>

    </div>
  );
};


const LegendItem = ({ label, count, percent, color }: any) => (
  <div className="flex justify-between items-center text-[10px]">
    <div className="flex items-center gap-2 text-slate-500 font-medium">
      <div className={`w-2 h-2 rounded-full ${color}`}></div> {label}
    </div>
    <div className="font-bold text-slate-800">{count} <span className="text-slate-400 font-medium ml-1">({percent})</span></div>
  </div>
);

const StudyRow = ({ label, institutions, patients, progress, round }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <div>
        <h4 className="text-sm font-bold text-slate-800">{label}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{institutions} Institutions • {patients} Patients</p>
      </div>
      <span className="px-3 py-1 bg-blue-50 text-indigo-600 rounded-full text-[9px] font-bold uppercase tracking-wider">{round}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
    <p className="text-right text-[10px] font-bold text-slate-400">{progress}%</p>
  </div>
);

export default Dashboard;