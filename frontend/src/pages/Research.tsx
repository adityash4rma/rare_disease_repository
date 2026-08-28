import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Plus, ChevronLeft, ChevronRight, Activity, Dna, 
  Camera, Stethoscope, TrendingUp, Info 
} from 'lucide-react';

// --- Types ---
type StudyType = 'clinical' | 'genetic' | 'imaging' | 'treatment';

type Study = {
  id: number;
  name: string;
  disease: string;
  patients: string;
  availability: 'Available' | 'Requested';
  types: StudyType[];
};

const sampleStudies: Study[] = [
  { id: 1, name: 'CF-Dataset-001', disease: 'Cystic Fibrosis', patients: '1,245', availability: 'Available', types: ['clinical', 'genetic', 'imaging'] },
  { id: 2, name: 'RareGen-2024', disease: 'Duchenne MD', patients: '932', availability: 'Available', types: ['clinical', 'genetic', 'treatment'] },
  { id: 3, name: 'SMA-Study-2024', disease: 'Spinal Muscular Atrophy', patients: '756', availability: 'Available', types: ['clinical', 'genetic', 'imaging'] },
  { id: 4, name: 'SCD-Registry-01', disease: 'Sickle Cell Disease', patients: '1,120', availability: 'Available', types: ['clinical', 'genetic', 'treatment'] },
  { id: 5, name: 'Epi-Rare-2024', disease: 'Rare Epileptic Encephalopathy', patients: '512', availability: 'Requested', types: ['clinical', 'genetic'] },
  { id: 6, name: 'CF-Dataset-002', disease: 'Cystic Fibrosis', patients: '1,100', availability: 'Available', types: ['clinical', 'genetic'] },
  { id: 7, name: 'RareGen-Alpha', disease: 'Duchenne MD', patients: '450', availability: 'Available', types: ['clinical', 'imaging'] },
];

const Research: FC = () => {
  const [activeTab, setActiveTab] = useState<'studies' | 'dictionary'>('studies');
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Filter logic for the search bar
  const filteredStudies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sampleStudies;
    return sampleStudies.filter((study) => 
      study.name.toLowerCase().includes(query) || 
      study.disease.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-10">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for studies, diseases, institutions..." 
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

      {/* 2. Page Title Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Research Studies</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Manage and explore active research studies.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus size={18} /> Create New Study
        </button>
      </div>

      {/* 3. Navigation Tabs */}
      <nav className="flex gap-10 border-b border-slate-200 mb-10 px-4">
        <button 
          onClick={() => setActiveTab('studies')}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'studies' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
        >
          All Studies
          {activeTab === 'studies' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('dictionary')}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'dictionary' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
        >
          Data Dictionary
          {activeTab === 'dictionary' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
      </nav>

      {/* 4. Table Content */}
      {activeTab === 'studies' ? (
        <>
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm mb-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#E0E7FF]/30 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Study Name</th>
                  <th className="px-8 py-5">Disease</th>
                  <th className="px-8 py-5">Types</th>
                  <th className="px-8 py-5">Patients</th>
                  <th className="px-8 py-5">Availability</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 font-bold">
                {filteredStudies.map((study) => (
                  <tr key={study.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-4 text-slate-800">{study.name}</td>
                    <td className="px-8 py-4">{study.disease}</td>
                    <td className="px-8 py-4 flex gap-1.5">
                      {study.types.map(type => <TypeBadge key={type} type={type} />)}
                    </td>
                    <td className="px-8 py-4 font-mono">{study.patients}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${study.availability === 'Available' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                        {study.availability}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center text-indigo-600 cursor-pointer hover:underline">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mb-10 px-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Showing 1 to {filteredStudies.length} of 240 studies</p>
            <div className="flex gap-2">
              <button className="p-2 text-slate-300 hover:text-indigo-600"><ChevronLeft size={18}/></button>
              {[1, 2, 3, 4, 5].map(num => (
                <button 
                  key={num} 
                  onClick={() => setActivePage(num)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${activePage === num ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
                >
                  {num}
                </button>
              ))}
              <button className="p-2 text-slate-300 hover:text-indigo-600"><ChevronRight size={18}/></button>
            </div>
          </div>

          {/* Legend Footer */}
          <div className="flex gap-6 p-5 bg-white border border-slate-100 rounded-[1.5rem] w-fit shadow-sm">
            <LegendItem icon={Activity} label="Clinical" color="bg-blue-100 text-blue-500" />
            <LegendItem icon={Dna} label="Genetic" color="bg-purple-100 text-purple-500" />
            <LegendItem icon={Camera} label="Imaging" color="bg-green-100 text-green-500" />
            <LegendItem icon={Stethoscope} label="Treatment" color="bg-red-100 text-red-500" />
            <LegendItem icon={TrendingUp} label="Outcome" color="bg-indigo-100 text-indigo-500" />
          </div>
        </>
      ) : (
        <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <Info className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold text-sm">Data Dictionary content will appear here.</p>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const TypeBadge = ({ type }: { type: StudyType }) => {
  const configs = {
    clinical: { icon: Activity, color: 'bg-blue-100 text-blue-500' },
    genetic: { icon: Dna, color: 'bg-purple-100 text-purple-500' },
    imaging: { icon: Camera, color: 'bg-green-100 text-green-500' },
    treatment: { icon: Stethoscope, color: 'bg-red-100 text-red-500' },
  };
  const { icon: Icon, color } = configs[type];
  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${color}`}>
      <Icon size={12} />
    </div>
  );
};

const LegendItem = ({ icon: Icon, label, color }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${color}`}><Icon size={14} /></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default Research;