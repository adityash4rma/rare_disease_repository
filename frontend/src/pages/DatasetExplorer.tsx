import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, ChevronDown, 
  SlidersHorizontal, ChevronLeft, ChevronRight, 
  Activity, Beaker, Camera, Pill, TrendingUp, User as UserIcon
} from 'lucide-react';
import { patientApi } from '../api/patientApi';
import type { Patient } from '../types/api';
import { useAuth } from '../context/AuthContext';

const DatasetExplorer: FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState<number>(3359);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sexFilter, setSexFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const res = await patientApi.getPatients(searchQuery, page, pageSize, sexFilter);
        setPatients(res.patients);
        if (typeof res.total === 'number') {
          setTotal(res.total);
        }
      } catch (err) {
        console.error('Failed to fetch patient datasets:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDatasets, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, sexFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleSexFilterChange = (val: string) => {
    setSexFilter(val);
    setPage(1);
  };

  // Generate dynamic pagination items
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      {/* 1. Standard Top Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search datasets by patient code, city, ethnicity, center..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-full border-none outline-none focus:ring-2 focus:ring-indigo-400 text-sm" 
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" /> 
            <Mail size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" /> 
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" />
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm">
              <UserIcon size={16} /> {user?.full_name || user?.email}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm"
            >
              <CheckCircle2 size={16} /> Log In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* 2. Page Title & Local Search */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dataset Explorer</h1>
          <p className="text-xs text-slate-400 mt-1">Explore patient demographic & clinical dataset records across federated Indian hospital nodes.</p>
        </div>
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search datasets..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border-none text-xs outline-none focus:ring-1 focus:ring-indigo-200" 
          />
        </div>
      </div>

      {/* 3. Filtering Section */}
      <div className="grid grid-cols-4 gap-4 mb-8 items-end">
        <FilterDropdown 
          label="Sex / Gender" 
          value={sexFilter === 'All' ? 'All Sexes' : sexFilter} 
          onChange={(val) => handleSexFilterChange(val)}
          options={['All', 'Male', 'Female', 'Other']}
        />
        <FilterDropdown label="Data Format" value="FHIR R4" onChange={() => {}} options={['FHIR R4']} />
        <FilterDropdown label="Availability" value="Federated Available" onChange={() => {}} options={['Federated Available']} />
        <button 
          onClick={() => { setSearchQuery(''); setSexFilter('All'); setPage(1); }}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          <SlidersHorizontal size={14} /> Clear Filters
        </button>
      </div>

      {/* 4. The Data Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E0E7FF]/30 text-[10px] text-slate-500 font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">Patient Code</th>
              <th className="px-6 py-5">Age / Sex</th>
              <th className="px-6 py-5">Ethnicity</th>
              <th className="px-6 py-5">Data Types</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Contributing Institution</th>
              <th className="px-6 py-5">Format</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-600 font-semibold">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-bold">
                  Loading patient records from registry...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  No patient datasets match your criteria.
                </td>
              </tr>
            ) : (
              patients.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800 font-mono text-xs">{row.patient_code}</td>
                  <td className="px-6 py-4">{row.age} yrs • {row.sex}</td>
                  <td className="px-6 py-4">{row.ethnicity}</td>
                  <td className="px-6 py-4 flex gap-1.5">
                    <TypeBadge color="bg-blue-100 text-blue-500"><Activity size={12} /></TypeBadge>
                    <TypeBadge color="bg-purple-100 text-purple-500"><Beaker size={12} /></TypeBadge>
                    <TypeBadge color="bg-green-100 text-green-500"><Camera size={12} /></TypeBadge>
                  </td>
                  <td className="px-6 py-4">{row.city}, {row.country}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {row.hospital_name || (row.hospital_code ? `${row.hospital_code}` : `Hospital #${String(row.hospital_id || '').slice(0, 8)}`)}
                  </td>
                  <td className="px-6 py-4 font-black text-slate-400 text-[10px]">FHIR R4</td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      to={`/disease/d17f5763-3a1b-4518-8543-7822f495d364`} 
                      className="text-indigo-600 font-black hover:underline text-[10px] uppercase tracking-widest"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Interactive Pagination & Record Count */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
          Showing {total > 0 ? (page - 1) * pageSize + 1 : 0} – {Math.min(page * pageSize, total)} of {total.toLocaleString()} patient dataset records
        </p>
        
        <div className="flex items-center gap-1.5">
          {/* Previous Page Button */}
          <button 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className={`p-2 rounded-lg border transition-all ${page === 1 ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'}`}
            title="Previous Page"
          >
            <ChevronLeft size={16}/>
          </button>

          {/* Page Number Buttons */}
          {getPageNumbers().map((pNum, idx) => {
            if (pNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold">
                  ...
                </span>
              );
            }

            const isCurrent = pNum === page;
            return (
              <button
                key={`page-${pNum}`}
                onClick={() => handlePageChange(pNum as number)}
                disabled={loading}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                  isCurrent 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {pNum}
              </button>
            );
          })}

          {/* Next Page Button */}
          <button 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            className={`p-2 rounded-lg border transition-all ${page === totalPages ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'}`}
            title="Next Page"
          >
            <ChevronRight size={16}/>
          </button>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex gap-6 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-fit">
        <LegendItem icon={Activity} label="Clinical" color="bg-blue-100 text-blue-500" />
        <LegendItem icon={Beaker} label="Genomic" color="bg-purple-100 text-purple-500" />
        <LegendItem icon={Camera} label="Imaging" color="bg-green-100 text-green-500" />
        <LegendItem icon={Pill} label="Treatment" color="bg-red-100 text-red-500" />
        <LegendItem icon={TrendingUp} label="Outcome" color="bg-indigo-100 text-indigo-500" />
      </div>
    </div>
  );
};

// --- Child Components ---

const FilterDropdown = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="space-y-2">
    <label className="text-[9px] text-slate-400 font-black uppercase ml-1 tracking-widest">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl text-slate-700 text-[11px] font-bold border border-transparent hover:border-slate-200 transition-all appearance-none cursor-pointer outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
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