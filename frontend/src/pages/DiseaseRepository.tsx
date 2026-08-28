import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, ChevronDown, Bell, Mail, HelpCircle, CheckCircle2, 
  ArrowRight, Droplets, Activity, Brain, Beaker, Dna, FileText, User as UserIcon
} from 'lucide-react';
import { diseaseApi } from '../api/diseaseApi';
import type { Disease } from '../types/api';
import { useAuth } from '../context/AuthContext';

const cardColorSchemes = [
  { bg: 'bg-blue-50', icon: Droplets, iconColor: 'text-blue-500' },
  { bg: 'bg-green-50', icon: Activity, iconColor: 'text-green-500' },
  { bg: 'bg-purple-50', icon: Brain, iconColor: 'text-purple-500' },
  { bg: 'bg-orange-50', icon: Droplets, iconColor: 'text-orange-500' },
  { bg: 'bg-indigo-50', icon: Dna, iconColor: 'text-indigo-500' },
  { bg: 'bg-teal-50', icon: Beaker, iconColor: 'text-teal-500' },
];

const DiseaseRepository: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'patients'>('name');

  useEffect(() => {
    const fetchDiseases = async () => {
      setLoading(true);
      try {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory;
        const res = await diseaseApi.getAllDiseases(searchQuery, cat);
        setDiseases(res.diseases);
      } catch (err) {
        console.error('Failed to fetch diseases:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDiseases, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const sortedDiseases = [...diseases].sort((a, b) => {
    if (sortBy === 'patients') {
      return (b.patient_count || 0) - (a.patient_count || 0);
    }
    return a.name.localeCompare(b.name);
  });

  const categories = ['All', 'Metabolic', 'Neuromuscular', 'Lysosomal Storage', 'Hepatic', 'Inborn Error', 'Genetic'];

  return (
    <div className="flex-1 bg-white min-h-screen p-8 overflow-y-auto">
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-10">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for diseases by name, ORPHA code, ICD-10, or gene..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-full border-none outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm" 
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-indigo-600" /> 
            <Mail size={20} className="cursor-pointer hover:text-indigo-600" /> 
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600" />
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

      {/* 2. Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Rare Disease Repository</h1>
        <p className="text-slate-400 text-sm mt-1">Explore verified rare disease records, genes, and associated clinical datasets.</p>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex gap-4 mb-10 flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search for a disease (e.g., Cystic Fibrosis, ORPHA:586)" 
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border-none outline-none text-sm" 
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none h-full w-48 px-4 pr-10 bg-slate-50 rounded-2xl text-slate-600 text-sm font-medium border-none outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none h-full w-48 px-4 pr-10 bg-slate-50 rounded-2xl text-slate-600 text-sm font-medium border-none outline-none cursor-pointer"
          >
            <option value="name">Sort by: Name (A-Z)</option>
            <option value="patients">Sort by: Patient Cases</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 4. Disease Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold">
          Loading rare diseases catalog...
        </div>
      ) : sortedDiseases.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <FileText size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-lg">No rare diseases found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDiseases.map((disease, idx) => {
            const scheme = cardColorSchemes[idx % cardColorSchemes.length];
            const Icon = scheme.icon;

            return (
              <div 
                key={disease.id} 
                onClick={() => navigate(`/disease/${disease.id}`)}
                className={`${scheme.bg} rounded-[2.5rem] p-8 border border-white/50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                      <Icon className={scheme.iconColor} size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{disease.name}</h3>
                      <div className="flex gap-2 text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                        {disease.orpha_code && <span>{disease.orpha_code}</span>}
                        {disease.icd10_code && <span>• {disease.icd10_code}</span>}
                        {disease.category && <span>• {disease.category}</span>}
                      </div>
                    </div>
                  </div>

                  {disease.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-normal">
                      {disease.description}
                    </p>
                  )}

                  {disease.genes && disease.genes.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {disease.genes.map((gene) => (
                        <span key={gene} className="px-2 py-0.5 bg-white/70 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
                          {gene}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex gap-10 mb-6 border-t border-slate-200/30 pt-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Patient Cases</p>
                      <p className="text-xl font-bold text-slate-800">{disease.patient_count ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">FHIR Datasets</p>
                      <p className="text-xl font-bold text-slate-800">{disease.dataset_count ?? 1}</p>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-indigo-600 text-xs font-bold group-hover:gap-3 transition-all">
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiseaseRepository;