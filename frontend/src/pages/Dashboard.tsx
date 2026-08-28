import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Database, Landmark, FileText, FlaskConical, 
  ChevronRight, LogOut, User as UserIcon, Users,
  Shield, Activity, AlertTriangle,
  Stethoscope, ClipboardList, HeartPulse
} from 'lucide-react';
import { analyticsApi } from '../api/analyticsApi';
import type { DashboardStats, DiseaseDistributionItem } from '../types/api';
import { useAuth } from '../context/AuthContext';

// ─── Shared Components ───────────────────────────────────────────────

const StatCard = ({ icon: Icon, count, label, color, linkText, onClick }: any) => {
  const colorMap: any = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
    slate: { bg: 'bg-slate-50', icon: 'text-slate-600' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
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

// ─── Role Welcome Banners ────────────────────────────────────────────

const ResearcherBanner = ({ name }: { name: string }) => (
  <div className="bg-gradient-to-r from-[#7C5C9E] to-[#5A4175] rounded-[2.5rem] p-12 text-white mb-10 shadow-xl shadow-purple-100 relative overflow-hidden">
    <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-3 tracking-tight">
        Welcome back, {name} 👋
      </h2>
      <p className="text-purple-100 font-medium">
        Explore rare diseases, discover datasets, and collaborate securely across hospital nodes.
      </p>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
  </div>
);

const AdminBanner = ({ name }: { name: string }) => (
  <div className="bg-gradient-to-r from-[#DC2626] to-[#991B1B] rounded-[2.5rem] p-12 text-white mb-10 shadow-xl shadow-red-100 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Shield size={28} className="text-red-200" />
        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Admin Control Panel</span>
      </div>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">
        Administrator Dashboard — {name}
      </h2>
      <p className="text-red-100 font-medium">
        Full platform oversight. Manage users, monitor federated learning rounds, audit data integrity, and oversee institutional compliance.
      </p>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10"></div>
  </div>
);

const ClinicianBanner = ({ name }: { name: string }) => (
  <div className="bg-gradient-to-r from-[#0D9488] to-[#065F46] rounded-[2.5rem] p-12 text-white mb-10 shadow-xl shadow-teal-100 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <Stethoscope size={28} className="text-teal-200" />
        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Clinical Portal</span>
      </div>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">
        Welcome, Dr. {name.split(' ').pop()} 🩺
      </h2>
      <p className="text-teal-100 font-medium">
        Review patient cohorts under your care, contribute clinical observations, and track treatment outcomes across your institution.
      </p>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
  </div>
);

// ─── Role-Specific Dashboard Sections ────────────────────────────────

const AdminSection: FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    {/* Platform Health */}
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600"><Activity size={18} /></div>
        <h3 className="font-bold text-slate-800 text-sm">Platform Health & Security</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100/50">
          <span className="text-xs font-bold text-slate-600">API Server Status</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Operational</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100/50">
          <span className="text-xs font-bold text-slate-600">PostgreSQL Database</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Connected</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-xl border border-green-100/50">
          <span className="text-xs font-bold text-slate-600">Federated Learning Nodes</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">8/8 Online</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
          <span className="text-xs font-bold text-slate-600">Pending Access Requests</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase">3 Pending</span>
        </div>
      </div>
    </div>

    {/* User & Audit Overview */}
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><Users size={18} /></div>
        <h3 className="font-bold text-slate-800 text-sm">User & Audit Overview</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-indigo-50/50 rounded-2xl text-center border border-indigo-100/50">
          <p className="text-2xl font-bold text-indigo-700">12</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Registered Users</p>
        </div>
        <div className="p-4 bg-purple-50/50 rounded-2xl text-center border border-purple-100/50">
          <p className="text-2xl font-bold text-purple-700">100</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Audit Log Entries</p>
        </div>
        <div className="p-4 bg-teal-50/50 rounded-2xl text-center border border-teal-100/50">
          <p className="text-2xl font-bold text-teal-700">8</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Active Institutions</p>
        </div>
        <div className="p-4 bg-red-50/50 rounded-2xl text-center border border-red-100/50">
          <p className="text-2xl font-bold text-red-700">0</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Security Incidents</p>
        </div>
      </div>
      <button 
        onClick={() => navigate('/requests')}
        className="w-full text-center text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer"
      >
        Review Access Requests →
      </button>
    </div>
  </div>
);

const ClinicianSection: FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    {/* My Patient Cohort */}
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600"><HeartPulse size={18} /></div>
        <h3 className="font-bold text-slate-800 text-sm">My Patient Cohort Overview</h3>
      </div>
      <div className="space-y-3">
        {[
          { disease: 'Wilson Disease', patients: 42, severity: 'Moderate', gene: 'ATP7B' },
          { disease: 'Gaucher Disease', patients: 28, severity: 'Severe', gene: 'GBA' },
          { disease: 'Spinal Muscular Atrophy', patients: 15, severity: 'Critical', gene: 'SMN1' },
        ].map((row) => (
          <div key={row.disease} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 hover:bg-teal-50/30 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-800">{row.disease}</p>
              <p className="text-[10px] text-slate-400 font-mono">{row.gene} • {row.patients} patients</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
              row.severity === 'Critical' ? 'bg-red-50 text-red-600' : 
              row.severity === 'Severe' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'
            }`}>{row.severity}</span>
          </div>
        ))}
      </div>
      <button 
        onClick={() => navigate('/datasets')}
        className="mt-4 w-full text-center text-teal-600 text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer"
      >
        View Full Patient Dataset →
      </button>
    </div>

    {/* Recent Clinical Contributions */}
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600"><ClipboardList size={18} /></div>
        <h3 className="font-bold text-slate-800 text-sm">Recent Clinical Contributions</h3>
      </div>
      <div className="space-y-3">
        {[
          { type: 'Lab Results Upload', time: '2 hours ago', status: 'Verified', records: 45 },
          { type: 'FHIR Observation Bundle', time: '1 day ago', status: 'Processing', records: 120 },
          { type: 'Follow-up Vitals', time: '3 days ago', status: 'Verified', records: 28 },
          { type: 'Genomic Panel Report', time: '1 week ago', status: 'Verified', records: 12 },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
            <div>
              <p className="text-xs font-bold text-slate-800">{item.type}</p>
              <p className="text-[10px] text-slate-400">{item.records} records • {item.time}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
              item.status === 'Verified' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Dashboard Component ────────────────────────────────────────

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [distributions, setDistributions] = useState<DiseaseDistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const userRole = user?.role || 'researcher';
  const userName = user?.full_name || 'Researcher';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, distData] = await Promise.all([
          analyticsApi.getDashboardStats().catch(() => null),
          analyticsApi.getDiseaseDistribution(5).catch(() => []),
        ]);
        if (statsData && typeof statsData === 'object' && typeof statsData.total_patients === 'number') {
          setStats(statsData);
        }
        if (Array.isArray(distData)) {
          setDistributions(distData);
        }
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
              <div className={`flex items-center gap-2 bg-white border px-4 py-2 rounded-full font-bold text-xs shadow-sm ${
                userRole === 'admin' ? 'border-red-100 text-red-600' : 
                userRole === 'clinician' ? 'border-teal-100 text-teal-600' : 'border-indigo-100 text-indigo-600'
              }`}>
                <UserIcon size={16} /> {userName}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  userRole === 'admin' ? 'bg-red-50 text-red-500' : 
                  userRole === 'clinician' ? 'bg-teal-50 text-teal-500' : 'bg-indigo-50 text-indigo-500'
                }`}>{userRole}</span>
              </div>
              <button 
                onClick={() => { logout(); navigate('/login'); }} 
                className="p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={16} /> Log In / Sign Up
            </button>
          )}
        </div>
      </header>

      {/* 2. Role-Based Welcome Banner */}
      {userRole === 'admin' ? (
        <AdminBanner name={userName} />
      ) : userRole === 'clinician' ? (
        <ClinicianBanner name={userName} />
      ) : (
        <ResearcherBanner name={userName} />
      )}

      {/* 3. Folder Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Database} 
          count={loading ? '...' : (stats?.total_diseases ?? 15)} 
          label="Rare Diseases" 
          color={userRole === 'admin' ? 'red' : 'indigo'} 
          linkText="View Repository" 
          onClick={() => navigate('/repository')}
        />
        <StatCard 
          icon={Landmark} 
          count={loading ? '...' : (stats?.total_hospitals ?? 8)} 
          label="Participating Institutions" 
          color="slate" 
          linkText="View institutions" 
          onClick={() => navigate('/institutions')}
        />
        <StatCard 
          icon={userRole === 'clinician' ? HeartPulse : FileText} 
          count={loading ? '...' : (userRole === 'clinician' ? (stats?.total_patients ?? 85) : (stats?.total_fhir_resources ?? 50))} 
          label={userRole === 'clinician' ? 'My Patients' : 'FHIR Resources'} 
          color="teal" 
          linkText={userRole === 'clinician' ? 'View patients' : 'Browse datasets'} 
          onClick={() => navigate('/datasets')}
        />
        <StatCard 
          icon={userRole === 'admin' ? AlertTriangle : FlaskConical} 
          count={loading ? '...' : (userRole === 'admin' ? 3 : (stats?.active_studies ?? 6))} 
          label={userRole === 'admin' ? 'Pending Reviews' : 'Active Research Studies'} 
          color="orange" 
          linkText={userRole === 'admin' ? 'Review now' : 'View studies'} 
          onClick={() => navigate(userRole === 'admin' ? '/requests' : '/studies')}
        />
      </div>

      {/* 4. Role-Specific Middle Section */}
      {userRole === 'admin' && <AdminSection navigate={navigate} />}
      {userRole === 'clinician' && <ClinicianSection navigate={navigate} />}

      {/* 5. Shared Middle Section (Chart & Search) — always shown */}
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
              {Array.isArray(distributions) && distributions.length > 0 ? (
                distributions.slice(0, 4).map((d, idx) => {
                  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-400', 'bg-orange-400'];
                  return (
                    <LegendItem 
                      key={d?.disease_name || idx} 
                      label={d?.disease_name || 'Rare Disease'} 
                      count={(d?.patient_count ?? 0).toString()} 
                      percent={`${d?.percentage ?? 0}%`} 
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
              <button type="submit" className="bg-indigo-600 text-white px-10 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer">
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

      {/* 6. Bottom Section (Federated Studies) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-slate-800">Active Federated Learning & Research</h3>
          <button onClick={() => navigate('/studies')} className="text-indigo-600 text-xs font-bold hover:underline cursor-pointer">View all</button>
        </div>
        <div className="space-y-8">
           <StudyRow label="RareGen Federated AI Model" institutions="8" patients="3,359" progress={65} round="Round 4/8" />
           <StudyRow label="Multi-Hospital Genomic Variant Analysis" institutions="5" patients="1,200" progress={40} round="Round 2/5" />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;