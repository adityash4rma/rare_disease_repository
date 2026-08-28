import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Database, Landmark, FileText, FlaskConical, 
  ChevronRight, LogOut, User as UserIcon
} from 'lucide-react';
import { analyticsApi } from '../api/analyticsApi';
import type { DashboardStats, DiseaseDistributionItem } from '../types/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, count, label, color, linkText, onClick }: any) => {
  const colorMap: any = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  };
  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className="relative mt-8 group cursor-pointer" onClick={onClick}>
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

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [distributions, setDistributions] = useState<DiseaseDistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, distData] = await Promise.all([
          analyticsApi.getDashboardStats(),
          analyticsApi.getDiseaseDistribution(5),
        ]);
        setStats(statsData);
        setDistributions(distData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/repository?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <form onSubmit={handleSearchSubmit} className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for diseases, datasets, institutions..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm"
          />
        </form>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <div className="relative cursor-pointer hover:text-indigo-600"><Bell size={20} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span></div>
            <div className="relative cursor-pointer hover:text-indigo-600"><Mail size={20} /><span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"></span></div>
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600" />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm">
                <UserIcon size={16} /> {user?.full_name || user?.email}
              </div>
              <button 
                onClick={logout} 
                className="p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <CheckCircle2 size={16} /> Log In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* 2. Purple Welcome Banner */}
      <div className="bg-gradient-to-r from-[#7C5C9E] to-[#5A4175] rounded-[2.5rem] p-12 text-white mb-10 shadow-xl shadow-purple-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-3 tracking-tight">
            Welcome back, {user?.full_name ? `${user.full_name}` : 'Researcher'} 👋
          </h2>
          <p className="text-purple-100 font-medium">
            Explore rare diseases, discover datasets, and collaborate securely across hospital nodes.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
      </div>

      {/* 3. Folder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Database} 
          count={loading ? '...' : (stats?.total_diseases ?? 15)} 
          label="Rare Diseases" 
          color="indigo" 
          linkText="View Repository" 
          onClick={() => navigate('/repository')}
        />
        <StatCard 
          icon={Landmark} 
          count={loading ? '...' : (stats?.total_hospitals ?? 8)} 
          label="Participating Institutions" 
          color="slate" 
          linkText="View institutions" 
          onClick={() => navigate('/datasets')}
        />
        <StatCard 
          icon={FileText} 
          count={loading ? '...' : (stats?.total_fhir_resources ?? 50)} 
          label="FHIR Resources" 
          color="teal" 
          linkText="Browse datasets" 
          onClick={() => navigate('/datasets')}
        />
        <StatCard 
          icon={FlaskConical} 
          count={loading ? '...' : (stats?.active_studies ?? 6)} 
          label="Active Research Studies" 
          color="orange" 
          linkText="View studies" 
          onClick={() => navigate('/studies')}
        />
      </div>

      {/* 4. Middle Section (Chart & Search) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Disease Distribution Box */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 text-sm">Top Rare Diseases by Cases</h3>
          <p className="text-[10px] text-slate-400 mb-8 uppercase font-bold tracking-tighter">Live Patient Case Distribution</p>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full border-[10px] border-indigo-500 flex items-center justify-center relative">
              <div className="text-center">
                <span className="block text-xl font-bold">{stats?.total_patients ?? 75}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter leading-none">Total Patients</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {distributions.length > 0 ? (
                distributions.slice(0, 4).map((d, idx) => {
                  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-400', 'bg-orange-400'];
                  return (
                    <LegendItem 
                      key={d.disease_name} 
                      label={d.disease_name} 
                      count={d.patient_count.toString()} 
                      percent={`${d.percentage}%`} 
                      color={colors[idx % colors.length]} 
                    />
                  );
                })
              ) : (
                <>
                  <LegendItem label="Cystic Fibrosis" count="12" percent="16%" color="bg-indigo-500" />
                  <LegendItem label="Huntington Disease" count="10" percent="13%" color="bg-purple-500" />
                  <LegendItem label="Duchenne MD" count="9" percent="12%" color="bg-blue-400" />
                  <LegendItem label="Gaucher Disease" count="8" percent="11%" color="bg-orange-400" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Big Search Box */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-teal-50 shadow-sm border-b-4 border-b-teal-400">
           <h3 className="font-bold text-slate-800 mb-1">Find Diseases & Datasets</h3>
           <p className="text-xs text-slate-400 mb-6">Search rare diseases and discover available data across institutions.</p>
           <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-8">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a disease (e.g., Cystic Fibrosis, Huntington)" 
                  className="w-full bg-slate-50 border-none p-4 pl-12 rounded-2xl outline-none text-sm" 
                />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-10 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Search
              </button>
           </form>
           <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">Popular Searches</p>
           <div className="flex flex-wrap gap-2">
              {['Cystic Fibrosis', 'Huntington Disease', 'Duchenne Muscular Dystrophy', 'Spinal Muscular Atrophy', 'Gaucher Disease'].map(tag => (
                <span 
                  key={tag} 
                  onClick={() => navigate(`/repository?search=${encodeURIComponent(tag)}`)}
                  className="px-4 py-2 bg-[#B2D8D0]/30 text-teal-800 rounded-full text-[11px] font-bold cursor-pointer hover:bg-[#B2D8D0]/50 transition-colors"
                >
                  {tag}
                </span>
              ))}
           </div>
        </div>
      </div>

      {/* 5. Bottom Section (Federated Studies) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-slate-800">Active Federated Learning & Research</h3>
          <button onClick={() => navigate('/studies')} className="text-indigo-600 text-xs font-bold hover:underline">View all</button>
        </div>
        <div className="space-y-8">
           <StudyRow label="RareGen Federated AI Model" institutions="8" patients="75" progress={65} round="Round 4/8" />
           <StudyRow label="Multi-Hospital Genomic Variant Analysis" institutions="5" patients="42" progress={40} round="Round 2/5" />
        </div>
      </div>

    </div>
  );
};

const LegendItem = ({ label, count, percent, color }: any) => (
  <div className="flex justify-between items-center text-[10px]">
    <div className="flex items-center gap-2 text-slate-500 font-medium truncate max-w-[120px]" title={label}>
      <div className={`w-2 h-2 rounded-full shrink-0 ${color}`}></div> <span className="truncate">{label}</span>
    </div>
    <div className="font-bold text-slate-800 shrink-0">{count} <span className="text-slate-400 font-medium ml-1">({percent})</span></div>
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