import type { FC } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  RefreshCw, FlaskConical, Clock, CheckCircle, 
  TrendingUp, MoreVertical, ChevronDown 
} from 'lucide-react';

const FederatedLearning: FC = () => {
  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      {/* 1. Global Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for diseases, datasets, institutions..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none text-sm focus:ring-2 focus:ring-indigo-400 transition-all" 
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

      {/* 2. Page Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Performance Analytics</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Comprehensive overview of platform usage and federated learning health.</p>
      </div>

      {/* 3. Top Metrics Row */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <FedStatCard label="Total Data Points Analyzed" value="14.2M" sub="+12% this week" icon={RefreshCw} color="bg-[#D1E7E0]" iconColor="text-[#00896C]" />
        <FedStatCard label="Active Experiments" value="24" sub="+3 new today" icon={FlaskConical} color="bg-[#E0E7FF]" iconColor="text-indigo-600" />
        <FedStatCard label="Average Training Time" value="4h 12m" sub="→ Stable" icon={Clock} color="bg-[#F0EBF8]" iconColor="text-purple-600" />
        <FedStatCard label="Success Rate" value="98.5%" sub="+0.5% vs last month" icon={CheckCircle} color="bg-[#FFF4E5]" iconColor="text-orange-500" />
      </div>

      {/* 4. Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Global Model Status */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[500px]">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-8">Global Model Status</h3>
            <div className="bg-[#D1E7E0]/40 text-[#00896C] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit flex items-center gap-2 mb-12">
               <div className="w-2 h-2 bg-[#00896C] rounded-full animate-pulse"></div>
               Training in Progress
            </div>
            <div className="mb-10">
              <h4 className="text-4xl font-black text-slate-800">Round 6</h4>
              <p className="text-xl font-bold text-slate-400">of 10</p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
               <div className="bg-slate-800 h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-[10px] text-right font-black text-slate-400 uppercase">60%</p>
          </div>

          <div className="space-y-4 pt-10 border-t border-slate-50">
            <div>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Started:</p>
              <p className="text-[11px] font-bold text-slate-600">20 May 2024, 10:00 AM</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Estimated completion:</p>
              <p className="text-[11px] font-bold text-slate-600">20 May 2024, 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Model Performance Detail (The Line Chart) */}
        <div className="lg:col-span-5 bg-white p-10 rounded-[2.5rem] border border-[#D1E7E0] shadow-sm relative h-[500px]">
           <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Model Performance Detail</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Accuracy across federated nodes over training rounds</p>
              </div>
              <button className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-100">
                Last 10 Rounds <ChevronDown size={14} />
              </button>
           </div>

           {/* SVG Chart Container */}
           <div className="relative h-64 w-full mt-10">
              {/* Y-Axis Grid */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-slate-200">
                 <div className="border-b border-slate-50 pb-1 flex justify-between"><span>100</span><div className="flex-1 ml-4 border-b border-slate-50"></div></div>
                 <div className="border-b border-slate-50 pb-1 flex justify-between"><span>75</span><div className="flex-1 ml-4 border-b border-slate-50"></div></div>
                 <div className="border-b border-slate-50 pb-1 flex justify-between"><span>50</span><div className="flex-1 ml-4 border-b border-slate-50"></div></div>
                 <div className="border-b border-slate-50 pb-1 flex justify-between"><span>25</span><div className="flex-1 ml-4 border-b border-slate-50"></div></div>
                 <div className="flex justify-between"><span>0</span><div className="flex-1 ml-4 border-b border-slate-50"></div></div>
              </div>

              {/* The Chart Lines */}
              <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                {/* Node A (Light Blue Dashed) */}
                <path d="M 40 220 Q 150 180 320 120" fill="none" stroke="#BDC6E7" strokeWidth="2" strokeDasharray="6 4" />
                {/* Node B (Light Green Dashed) */}
                <path d="M 40 220 Q 180 150 320 100" fill="none" stroke="#D1E7E0" strokeWidth="2" strokeDasharray="6 4" />
                {/* Global Model (Solid Thick Black) */}
                <path d="M 40 220 Q 120 120 320 80" fill="none" stroke="#191C1F" strokeWidth="4" strokeLinecap="round" />
                {/* Nodes on global line */}
                <circle cx="320" cy="80" r="4" fill="#191C1F" />
              </svg>
              
              {/* X-Axis Labels */}
              <div className="absolute -bottom-10 left-8 right-0 flex justify-between text-[10px] font-bold text-slate-400">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
              </div>
           </div>

           {/* Legend */}
           <div className="absolute bottom-10 left-10 right-10 flex justify-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                <div className="w-3 h-3 rounded-full bg-slate-900"></div> Global Model
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                <div className="w-3 h-3 rounded-full bg-[#BDC6E7]"></div> Node A
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                <div className="w-3 h-3 rounded-full bg-[#D1E7E0]"></div> Node B
              </div>
           </div>
        </div>

        {/* User Growth (The Bar Chart) */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm h-[500px] flex flex-col">
           <div className="flex justify-between items-center mb-16">
              <h3 className="font-bold text-slate-800 text-sm">User Growth</h3>
              <MoreVertical size={16} className="text-slate-300" />
           </div>

           <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-10 relative">
              {/* Reference Grid Line */}
              <div className="absolute top-1/2 left-0 right-0 border-t border-slate-50"></div>
              
              <Bar height="20%" label="Jan" />
              <Bar height="35%" label="Feb" />
              <Bar height="45%" label="Mar" />
              <Bar height="65%" label="Apr" />
              <Bar height="75%" label="May" />
              <Bar height="85%" label="Jun" active />
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helpers ---

const FedStatCard = ({ label, value, sub, icon: Icon, color, iconColor }: any) => (
  <div className={`${color} p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-lg transition-all`}>
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">{label}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
      </div>
      <div className={`${iconColor} opacity-40 group-hover:opacity-100 transition-opacity`}>
        <Icon size={20} />
      </div>
    </div>
    <p className={`text-[10px] font-black uppercase tracking-widest ${sub.includes('+') ? 'text-[#00896C]' : 'text-slate-400'}`}>
      <TrendingUp size={12} className="inline mr-1 mb-0.5" /> {sub}
    </p>
  </div>
);

const Bar = ({ height, label, active }: any) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end group">
    <div 
      className={`w-full rounded-t-lg transition-all duration-700 ${active ? 'bg-[#302E59]' : 'bg-[#D8B4FE] opacity-40 group-hover:opacity-100'}`} 
      style={{ height }}
    ></div>
    <span className="text-[10px] font-bold text-slate-300 mt-4 uppercase">{label}</span>
  </div>
);

export default FederatedLearning;