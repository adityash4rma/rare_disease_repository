import type { FC } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Database, Search, FlaskConical, 
  ShieldCheck, Share2, Landmark, Dna, ChevronDown, UserCog, LogOut, Network
} from 'lucide-react';

const Sidebar: FC = () => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Define the main navigation items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Database, label: 'Disease Repository', path: '/repository' },
    { icon: Search, label: 'Dataset Explorer', path: '/datasets' },
    { icon: FlaskConical, label: 'Research Studies', path: '/studies' },
    { icon: ShieldCheck, label: 'Access Requests', path: '/requests' },
    { icon: Network, label: 'Federated Learning', path: '/federated' },
    { icon: Landmark, label: 'Institutions', path: '/institutions' },
  ];

  return (
    <aside className="w-64 bg-[#E0E7FF]/40 h-screen sticky top-0 p-6 border-r border-slate-200 flex flex-col rounded-tr-[3rem] z-50">
      
      {/* 1. Branding (DNA Logo) */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
           <Dna className="text-white rotate-45" size={24} />
        </div>
        <div>
          <h1 className="font-black text-indigo-900 tracking-tighter leading-none text-lg uppercase">Rare-X</h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase leading-none mt-1 tracking-tighter">
            Rare Disease Research <br/> Network
          </p>
        </div>
      </div>

      {/* 2. User Profile Box (With Dropdown) */}
      <div className="relative mb-10">
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 px-2 py-3 rounded-2xl border transition-all duration-300 ${isProfileOpen ? 'bg-white shadow-md border-indigo-100' : 'bg-white/60 border-white hover:bg-white/80 shadow-sm'}`}
        >
          <div className="w-10 h-10 bg-purple-200 rounded-xl overflow-hidden border-2 border-white flex-shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" alt="Dr. Priya" />
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[11px] font-bold text-slate-800 leading-none truncate">Dr. Priya Sharma</p>
            <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-tighter">Researcher</p>
          </div>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-indigo-50 shadow-xl p-2 animate-in slide-in-from-top-2 duration-200 z-50">
            <Link 
              to="/login" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <UserCog size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Account Settings</span>
            </Link>
            <Link 
              to="/login"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
            </Link>
          </div>
        )}
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              to={item.path} 
              key={item.label} 
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 group
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

      {/* 4. Security Footer */}
      <div className="mt-auto pt-6 border-t border-indigo-100/30">
        <div className="text-[9px] text-slate-400 font-bold flex gap-2 mb-4 px-2 uppercase tracking-tighter">
           <span>Secure</span> • <span>Decentralized</span> • <span>Trusted</span>
        </div>
        <div className="bg-white/60 p-4 rounded-3xl border border-white flex items-center gap-3 shadow-sm">
          <div className="w-6 h-6 bg-[#B2D8D0] rounded-lg flex items-center justify-center text-teal-800">
             <ShieldCheck size={14} />
          </div>
          <div>
            <p className="text-[9px] text-teal-800 font-bold uppercase leading-none">Session Secured</p>
            <p className="text-[8px] text-slate-400 font-mono mt-1 break-all tracking-tighter uppercase font-bold">did:rarex:8f3a</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;