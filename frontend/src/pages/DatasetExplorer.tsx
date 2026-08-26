import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, ChevronDown, 
  SlidersHorizontal, ChevronLeft, ChevronRight, 
  Activity, Beaker, Camera, Pill, TrendingUp 
} from 'lucide-react';

const DatasetExplorer: FC = () => {
  // Mock data for the table rows
  const datasets = [
    { id: 'CF-Dataset-001', disease: 'Cystic Fibrosis', types: ['clinical', 'genetic', 'imaging'], records: '1,245', institution: 'Hospital A', format: 'FHIR', status: 'Available' },
    { id: 'RareGen-2024', disease: 'Duchenne MD', types: ['clinical', 'genetic', 'treatment'], records: '932', institution: 'Hospital B', format: 'FHIR', status: 'Available' },
    { id: 'SMA-Study-2024', disease: 'Spinal Muscular Atrophy', types: ['clinical', 'genetic', 'imaging'], records: '756', institution: 'Genetics Center', format: 'FHIR', status: 'Available' },
    { id: 'SCD-Registry-01', disease: 'Sickle Cell Disease', types: ['clinical', 'genetic', 'treatment'], records: '1,120', institution: 'Hospital C', format: 'FHIR', status: 'Available' },
    { id: 'Epi-Rare-2024', disease: 'Rare Epileptic Encephalopathy', types: ['clinical', 'genetic', 'imaging'], records: '512', institution: 'Neuro Institute', format: 'FHIR', status: 'Requested' },
    { id: 'WIL-Data-X', disease: 'Wilson Disease', types: ['clinical', 'genetic'], records: '430', institution: 'Metabolic Lab', format: 'FHIR', status: 'Available' },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      {/* 1. Standard Top Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for diseases, datasets, institutions..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-full border-none outline-none focus:ring-2 focus:ring-indigo-400 text-sm" 
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" /> 
            <Mail size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" /> 
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm">
            <CheckCircle2 size={16} /> Verified Researcher
          </button>
        </div>
      </header>

      {/* 2. Page Title & Local Search */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dataset Explorer</h1>
        </div>
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500" size={16} />
          <input 
            type="text" 
            placeholder="Search datasets..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border-none text-xs outline-none focus:ring-1 focus:ring-indigo-200" 
          />
        </div>
      </div>

      {/* 3. Filtering Section */}
      <div className="grid grid-cols-5 gap-4 mb-8 items-end">
        <FilterDropdown label="Disease" value="All Diseases" />
        <FilterDropdown label="Data Type" value="All Types" />
        <FilterDropdown label="Data Format" value="All Formats" />
        <FilterDropdown label="Availability" value="All" />
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* 4. The Data Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E0E7FF]/30 text-[10px] text-slate-500 font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">Dataset ID</th>
              <th className="px-6 py-5">Disease</th>
              <th className="px-6 py-5">Data Types</th>
              <th className="px-6 py-5">Records</th>
              <th className="px-6 py-5">Institution</th>
              <th className="px-6 py-5">Format</th>
              <th className="px-6 py-5">Availability</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600 font-semibold">
            {datasets.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4 font-black text-slate-800">{row.id}</td>
                <td className="px-6 py-4">{row.disease}</td>
                <td className="px-6 py-4 flex gap-1.5">
                  {row.types.includes('clinical') && <TypeBadge color="bg-blue-100 text-blue-500"><Activity size={12} /></TypeBadge>}
                  {row.types.includes('genetic') && <TypeBadge color="bg-purple-100 text-purple-500"><Beaker size={12} /></TypeBadge>}
                  {row.types.includes('imaging') && <TypeBadge color="bg-green-100 text-green-500"><Camera size={12} /></TypeBadge>}
                  {row.types.includes('treatment') && <TypeBadge color="bg-red-100 text-red-500"><Pill size={12} /></TypeBadge>}
                </td>
                <td className="px-6 py-4 font-mono">{row.records}</td>
                <td className="px-6 py-4">{row.institution}</td>
                <td className="px-6 py-4 font-black text-slate-400 text-[10px]">{row.format}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${row.status === 'Available' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link 
                    to={`/disease/${row.disease.toLowerCase().replace(/ /g, '-')}`} 
                    className="text-indigo-600 font-black hover:underline text-[10px] uppercase tracking-widest"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination & Icon Legend */}
      <div className="flex justify-between items-center mb-12">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Showing 1 to 10 of 240 datasets</p>
        <div className="flex gap-2">
          <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><ChevronLeft size={18}/></button>
          <button className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg font-bold text-xs shadow-md shadow-indigo-100">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-xs hover:bg-slate-100 rounded-lg">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-xs hover:bg-slate-100 rounded-lg">3</button>
          <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex gap-6 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-fit">
        <LegendItem icon={Activity} label="Clinical" color="bg-blue-100 text-blue-500" />
        <LegendItem icon={Beaker} label="Genetic" color="bg-purple-100 text-purple-500" />
        <LegendItem icon={Camera} label="Imaging" color="bg-green-100 text-green-500" />
        <LegendItem icon={Pill} label="Treatment" color="bg-red-100 text-red-500" />
        <LegendItem icon={TrendingUp} label="Outcome" color="bg-indigo-100 text-indigo-500" />
      </div>
    </div>
  );
};

// --- Child Components ---

const FilterDropdown = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-2">
    <label className="text-[9px] text-slate-400 font-black uppercase ml-1 tracking-widest">{label}</label>
    <button className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-bold border border-transparent hover:border-slate-200 transition-all">
      {value} <ChevronDown size={14} className="text-slate-400" />
    </button>
  </div>
);

const TypeBadge = ({ children, color }: any) => (
  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${color}`}>
    {children}
  </div>
);

const LegendItem = ({ icon: Icon, label, color }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${color}`}><Icon size={14} /></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default DatasetExplorer;