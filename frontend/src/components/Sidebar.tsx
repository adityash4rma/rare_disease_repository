import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Database, Search, FlaskConical, 
  ShieldCheck, Share2, BarChart3, Landmark, Settings,
  Dna // Imported the DNA icon here
} from 'lucide-react';

const Sidebar: FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Database, label: 'Disease Repository', path: '/repository' },
    { icon: Search, label: 'Dataset Explorer', path: '/datasets' },
    { icon: FlaskConical, label: 'Research Studies', path: '/studies' },
    { icon: ShieldCheck, label: 'Access Requests', path: '/requests' },
    { icon: Share2, label: 'Federated Learning', path: '/federated' },
    { icon: BarChart3, label: 'Results & Insights', path: '/insights' },
    { icon: Landmark, label: 'Institutions', path: '/institutions' },
    { icon: Settings, label: 'Profile & Settings', path: '/settings' },
  ];

  return (
    // Added rounded-tr-[3rem] for the "curvy top" look
    <aside className="w-64 bg-[#E0E7FF]/40 h-screen sticky top-0 p-6 border-r border-slate-200 flex flex-col rounded-tr-[3rem]">
      
      {/* Branding - Updated with DNA Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
           {/* DNA Icon instead of the circle */}
           <Dna className="text-white rotate-45" size={24} />
        </div>
        <div>
          <h1 className="font-black text-indigo-900 tracking-tighter leading-none text-lg uppercase">Rare-X</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mt-1 tracking-tighter">
            Rare Disease Research <br/> Network
          </p>
        </div>
      </div>

      {/* User Profile Mini */}
      <div className="flex items-center gap-3 mb-10 px-2 py-3 bg-white/60 rounded-2xl border border-white shadow-sm">
        <div className="w-10 h-10 bg-purple-200 rounded-xl overflow-hidden border-2 border-white shadow-sm">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" alt="Dr. Priya" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-slate-800 leading-none">Dr. Priya Sharma</p>
          <p className="text-[10px] text-indigo-500 font-bold mt-1">Researcher</p>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              to={item.path} 
              key={item.label} 
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group
                ${isActive 
                  ? 'bg-[#B2D8D0] text-slate-800 font-bold shadow-lg shadow-teal-100' 
                  : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}
            >
              <item.icon 
                size={18} 
                className={isActive ? 'text-slate-800' : 'text-slate-400 group-hover:text-indigo-600'} 
              />
              <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Security Footer */}
      <div className="mt-auto pt-6">
        <div className="text-[9px] text-slate-400 font-bold flex gap-2 mb-4 px-2 uppercase tracking-tighter">
           <span>Secure</span> • <span>Decentralized</span> • <span>Trusted</span>
        </div>
        <div className="bg-white/60 p-4 rounded-3xl border border-white flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-[#B2D8D0] rounded-lg flex items-center justify-center text-teal-800">
             <ShieldCheck size={14} />
          </div>
          <div>
            <p className="text-[9px] text-teal-800 font-bold uppercase leading-none">Session Secured</p>
            <p className="text-[8px] text-slate-400 font-mono mt-1 break-all">did:rarex:researcher:8f3a</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Helper import for the profile arrow
import { ChevronDown } from 'lucide-react';

export default Sidebar;