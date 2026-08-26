import type { FC } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, ChevronDown, 
  SlidersHorizontal, ChevronLeft, ChevronRight, 
  Activity, Beaker, Camera, Pill, TrendingUp 
} from 'lucide-react';

const DatasetExplorer: FC = () => {
  // Mock data for the table
  const datasets = [
    { id: 'CF-Dataset-001', disease: 'Cystic Fibrosis', types: ['clinical', 'genetic', 'imaging'], records: '1,245', institution: 'Hospital A', format: 'FHIR', status: 'Available' },
    { id: 'RareGen-2024', disease: 'Duchenne MD', types: ['clinical', 'genetic', 'treatment'], records: '932', institution: 'Hospital B', format: 'FHIR', status: 'Available' },
    { id: 'SMA-Study-2024', disease: 'Spinal Muscular Atrophy', types: ['clinical', 'genetic', 'imaging'], records: '756', institution: 'Genetics Center', format: 'FHIR', status: 'Available' },
    { id: 'SCD-Registry-01', disease: 'Sickle Cell Disease', types: ['clinical', 'genetic', 'treatment'], records: '1,120', institution: 'Hospital C', format: 'FHIR', status: 'Available' },
    { id: 'Epi-Rare-2024', disease: 'Rare Epileptic Encephalopathy', types: ['clinical', 'genetic', 'imaging'], records: '512', institution: 'Neuro Institute', format: 'FHIR', status: 'Requested' },
    { id: 'CF-Dataset-001', disease: 'Cystic Fibrosis', types: ['clinical', 'genetic', 'imaging'], records: '1,245', institution: 'Hospital A', format: 'FHIR', status: 'Available' },
    { id: 'RareGen-2024', disease: 'Duchenne MD', types: ['clinical', 'genetic', 'treatment'], records: '932', institution: 'Hospital B', format: 'FHIR', status: 'Available' },
    { id: 'SMA-Study-2024', disease: 'Spinal Muscular Atrophy', types: ['clinical', 'genetic', 'imaging'], records: '756', institution: 'Genetics Center', format: 'FHIR', status: 'Available' },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input type="text" placeholder="Search for diseases, datasets, institutions..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-full border-none outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
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

      {/* 2. Title & Global Search */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dataset Explorer</h1>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input type="text" placeholder="Search datasets..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none text-xs outline-none" />
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="grid grid-cols-5 gap-4 mb-8 items-end">
        <FilterDropdown label="Disease" value="All Diseases" />
        <FilterDropdown label="Data Type" value="All Types" />
        <FilterDropdown label="Data Format" value="All Formats" />
        <FilterDropdown label="Availability" value="All" />
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* 4. Data Table */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E0E7FF]/30 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Dataset ID</th>
              <th className="px-6 py-4">Disease</th>
              <th className="px-6 py-4">Data Types</th>
              <th className="px-6 py-4">Records</th>
              <th className="px-6 py-4">Institution</th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4">Availability</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600 font-medium">
            {datasets.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{row.id}</td>
                <td className="px-6 py-4">{row.disease}</td>
                <td className="px-6 py-4 flex gap-1">
                  {row.types.includes('clinical') && <TypeIcon color="bg-blue-100 text-blue-500"><Activity size={12} /></TypeIcon>}
                  {row.types.includes('genetic') && <TypeIcon color="bg-purple-100 text-purple-500"><Beaker size={12} /></TypeIcon>}
                  {row.types.includes('imaging') && <TypeIcon color="bg-green-100 text-green-500"><Camera size={12} /></TypeIcon>}
                  {row.types.includes('treatment') && <TypeIcon color="bg-red-100 text-red-500"><Pill size={12} /></TypeIcon>}
                </td>
                <td className="px-6 py-4">{row.records}</td>
                <td className="px-6 py-4">{row.institution}</td>
                <td className="px-6 py-4 font-mono text-[10px]">{row.format}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.status === 'Available' ? 'bg-teal-50 text-teal-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 font-bold hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination & Legend */}
      <div className="flex justify-between items-center mb-10">
        <p className="text-xs text-slate-400 font-medium">Showing 1 to 10 of 240 datasets</p>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600"><ChevronLeft size={18}/></button>
          <button className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg font-bold text-xs">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-xs">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold text-xs">3</button>
          <button className="p-2 text-slate-400 hover:text-indigo-600"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex gap-6 p-4 border border-slate-100 rounded-2xl w-fit">
        <LegendItem icon={Activity} label="Clinical" color="bg-blue-100 text-blue-500" />
        <LegendItem icon={Beaker} label="Genetic" color="bg-purple-100 text-purple-500" />
        <LegendItem icon={Camera} label="Imaging" color="bg-green-100 text-green-500" />
        <LegendItem icon={Pill} label="Treatment" color="bg-red-100 text-red-500" />
        <LegendItem icon={TrendingUp} label="Outcome" color="bg-indigo-100 text-indigo-500" />
      </div>
    </div>
  );
};

// Helper Components
const FilterDropdown = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] text-slate-400 font-bold uppercase ml-1 tracking-wider">{label}</label>
    <button className="w-full flex justify-between items-center px-4 py-2.5 bg-slate-50 rounded-xl text-slate-700 text-xs font-medium">
      {value} <ChevronDown size={14} className="text-slate-400" />
    </button>
  </div>
);

const TypeIcon = ({ children, color }: any) => (
  <div className={`w-6 h-6 rounded flex items-center justify-center ${color}`}>
    {children}
  </div>
);

const LegendItem = ({ icon: Icon, label, color }: any) => (
  <div className="flex items-center gap-2 border border-slate-50 px-3 py-1.5 rounded-xl">
    <div className={`w-6 h-6 rounded flex items-center justify-center ${color}`}><Icon size={12} /></div>
    <span className="text-[10px] font-bold text-slate-500">{label}</span>
  </div>
);

export default DatasetExplorer;