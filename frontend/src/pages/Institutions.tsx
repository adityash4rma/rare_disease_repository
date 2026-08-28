import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Landmark, Database, Users, Trophy, BarChart3, 
  TrendingUp, MapPin, ChevronRight 
} from 'lucide-react';

// --- Types ---
type InstitutionStatus = 'Active' | 'Onboarding';
type Institution = {
  id: number;
  initials: string;
  name: string;
  location: string;
  patients: string;
  status: InstitutionStatus;
  color: string;
};

const institutions: Institution[] = [
  { id: 1, initials: 'AI', name: 'AIIMS New Delhi', location: 'New Delhi, India', patients: '4,200', status: 'Active', color: 'bg-indigo-50 text-indigo-600' },
  { id: 2, initials: 'NI', name: 'NIMHANS Bangalore', location: 'Bangalore, India', patients: '3,100', status: 'Active', color: 'bg-purple-50 text-purple-600' },
  { id: 3, initials: 'CM', name: 'CMC Vellore', location: 'Vellore, India', patients: '2,850', status: 'Active', color: 'bg-orange-50 text-orange-600' },
  { id: 4, initials: 'TH', name: 'Tata Memorial Hospital', location: 'Mumbai, India', patients: '1,920', status: 'Onboarding', color: 'bg-teal-50 text-teal-600' },
];

const contributors = [
  { rank: 1, name: 'AIIMS New Delhi', datasets: '1,240 Datasets' },
  { rank: 2, name: 'NIMHANS Bangalore', datasets: '980 Datasets' },
  { rank: 3, name: 'CMC Vellore', datasets: '750 Datasets' },
];

const Institutions: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => 
      inst.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [filterQuery]);

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      
      {/* 1. Standard Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for diseases, datasets, institutions..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 text-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-indigo-600" />
            <Mail size={20} className="cursor-pointer hover:text-indigo-600" />
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-[10px] uppercase shadow-sm">
            <CheckCircle2 size={14} /> Verified Researcher
          </button>
        </div>
      </header>

      {/* 2. Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Participating Institutions</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Network of collaborative research and clinical partners</p>
      </div>

      {/* 3. Main Grid: Distribution & Directory */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
        
        {/* Map Card */}
        <div className="xl:col-span-5 bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Geographic Distribution
            </h3>
            <div className="flex gap-2">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">45 Institutions</span>
              <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">India</span>
            </div>
          </div>
          <div className="h-[380px] bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
             <Landmark size={80} className="text-indigo-100" />
             <p className="absolute bottom-12 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Map Visualization Engine</p>
          </div>
        </div>

        {/* Directory Card */}
        <div className="xl:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-[#E0E7FF]/30 p-8 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
              <Database size={16} className="text-indigo-500" /> Institution Directory
            </h3>
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter..." 
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-[10px] outline-none border border-transparent focus:border-indigo-200"
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-50">
                <tr>
                  <th className="px-8 py-4">Name</th>
                  <th className="px-8 py-4">Location</th>
                  <th className="px-8 py-4">Patients</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {filteredInstitutions.map(inst => (
                  <tr key={inst.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${inst.color}`}>{inst.initials}</div>
                        <span className="text-slate-800">{inst.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-slate-400">{inst.location}</td>
                    <td className="px-8 py-4 font-mono">{inst.patients}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${inst.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                        {inst.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="py-4 bg-slate-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all">
             View All Partners
          </button>
        </div>
      </div>

      {/* 4. Bottom Grid: Breakdown, Contributors, Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Professional Breakdown */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-teal-100/50 shadow-sm">
           <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-8">
              <Users size={16} className="text-teal-500" /> Professional Breakdown
           </h3>
           <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Current Hospital: Hospital A</p>
           <div className="grid grid-cols-3 gap-3 mb-8">
              <BreakdownBox label="Doctors" count="120" color="bg-purple-50 text-purple-600" border="border-purple-100" />
              <BreakdownBox label="Researchers" count="45" color="bg-indigo-50 text-indigo-600" border="border-indigo-100" />
              <BreakdownBox label="Students" count="200" color="bg-orange-50 text-orange-600" border="border-orange-100" />
           </div>
           <div className="pt-6 border-t border-slate-50">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-3">
                <span>Network Totals</span>
                <span className="text-slate-800">8,450</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-black text-teal-600 uppercase">
                 <span>Clinical (60%)</span><span>Research (40%)</span>
              </div>
           </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-100/20">
           <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-8">
              <Trophy size={16} className="text-orange-400" /> Top Contributors
           </h3>
           <div className="space-y-4">
              {contributors.map(c => (
                <div key={c.rank} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${c.rank === 1 ? 'bg-indigo-50/50 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${c.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {c.rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-800">{c.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{c.datasets}</p>
                  </div>
                  {c.rank === 1 && <TrendingUp size={16} className="text-teal-500" />}
                </div>
              ))}
           </div>
        </div>

        {/* Network Growth */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-10">
              <BarChart3 size={16} className="text-indigo-500" /> Network Growth
           </h3>
           <div className="flex-1 flex items-end gap-2 px-2">
              {[40, 65, 55, 80, 100].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-lg transition-all duration-1000 ${i === 4 ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-indigo-200'}`} style={{ height: `${h}%` }}></div>
              ))}
           </div>
           <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Mar '23</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Current</span>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helpers ---
const BreakdownBox = ({ label, count, color, border }: any) => (
  <div className={`p-4 rounded-2xl border ${border} ${color} text-center`}>
     <p className="text-lg font-black leading-none mb-1">{count}</p>
     <p className="text-[9px] font-bold uppercase tracking-tighter opacity-80">{label}</p>
  </div>
);

const HospitalResult = ({ name, address, icon: Icon }: any) => (
  <div className="p-4 px-6 border-b border-slate-50 flex items-center gap-4 hover:bg-slate-50 transition-all cursor-pointer">
    <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center shadow-sm"><Icon size={16}/></div>
    <div>
      <p className="text-xs font-black text-slate-800 leading-none">{name}</p>
      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{address}</p>
    </div>
  </div>
);

export default Institutions;