import { Database, Search, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Database className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">
          Rare<span className="text-blue-600">Repo</span>
        </span>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Database</a>
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Research</a>
        <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Community</a>
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
        <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">
          <User size={18} className="text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;