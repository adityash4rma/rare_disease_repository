import type { FC } from 'react';
import { useState } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Lock, Star, Share2, FileText, Landmark, 
  Activity, Beaker, Camera, Pill, TrendingUp,
  ChevronRight, MoreVertical, Users, Baby, Wind, ClipboardCheck,
  ShieldAlert, BookOpen, GraduationCap, Building2, ArrowUpRight
} from 'lucide-react';

const DiseaseDetail: FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      {/* 1. TOP GLOBAL HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input type="text" placeholder="Search for diseases, datasets, institutions..." className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none text-sm" />
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

      {/* 2. DATASET HERO BANNER */}
      <div className="bg-[#FFF4E5] rounded-[2rem] p-8 mb-8 border border-orange-100 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#E0E7FF] rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <FileText size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter font-mono">CF-Dataset-001</span>
                <span className="bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded-md text-[10px] font-bold">Available</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cystic Fibrosis Clinical & Genetic Dataset</h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                <Landmark size={12} /> Hospital A
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#94A3B8] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm opacity-90 transition-all hover:bg-slate-500">
              <Lock size={14} /> Request Access
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all">
              <Star size={14} /> Rate
            </button>
          </div>
        </div>
      </div>

      {/* 3. TAB NAVIGATION */}
      <nav className="flex gap-10 border-b border-slate-200 mb-8 px-4">
        {['Overview', 'Data Dictionary', 'Statistics', 'Access & Permissions'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* 4. CONTENT AREA (Conditional) */}
      <div className="min-h-[500px]">
        {activeTab === 'Overview' && <OverviewUI />}
        {activeTab === 'Statistics' && <StatisticsUI />}
        {activeTab === 'Access & Permissions' && <AccessPermissionsUI />}
        {activeTab === 'Data Dictionary' && <div className="p-20 text-center text-slate-400 font-bold italic">Data Dictionary content loading...</div>}
      </div>
    </div>
  );
};

// --- TAB 1: OVERVIEW COMPONENT (Updated with Timeline Graph) ---
const OverviewUI = () => {
  // Data points for the timeline (normalized 0-100 for the SVG)
  const timelineData = [30, 35, 45, 50, 65, 60, 80, 85, 100];
  const points = timelineData.map((val, i) => `${(i * 40)} , ${120 - val}`).join(" ");

  return (
    <div className="grid grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="col-span-2 bg-white p-10 rounded-[2.5rem] border border-teal-100/50 shadow-sm h-fit">
        {/* ... (Keep the left side table rows same as before) ... */}
        <div className="space-y-6">
          <OverviewRow label="Dataset ID" value="CF-Dataset-001" />
          <hr className="border-slate-50" />
          <OverviewRow label="Disease" value="Cystic Fibrosis" />
          <hr className="border-slate-50" />
          <OverviewRow label="Description" value="Comprehensive clinical, genetic and treatment data for Cystic Fibrosis patients, collected longitudinally over a 10-year period. Includes detailed variant analysis and therapeutic outcomes." />
          <hr className="border-slate-50" />
          <div className="flex py-2">
            <span className="w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data Types</span>
            <div className="flex gap-2">
              <IconBox icon={Activity} /><IconBox icon={Beaker} /><IconBox icon={Camera} /><IconBox icon={TrendingUp} />
            </div>
          </div>
          <hr className="border-slate-50" />
          <OverviewRow label="Total Records" value="1,245" bold />
          <hr className="border-slate-50" />
          <OverviewRow label="Data Format" value="FHIR R4" />
          <hr className="border-slate-50" />
          <OverviewRow label="Last Updated" value="15 May 2024" />
          <hr className="border-slate-50" />
          <OverviewRow label="Availability" value="Available" color="text-teal-600" />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="space-y-8">
         {/* 1. Data Type Distribution (Donut) */}
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-[10px] mb-8 uppercase tracking-widest">Data Type Distribution</h3>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full border-[10px] border-indigo-500 border-t-purple-500 border-r-orange-400 shadow-inner relative flex items-center justify-center">
                 <div className="w-4 h-4 bg-white absolute rounded-full shadow-sm"></div>
              </div>
              <div className="text-[9px] font-bold space-y-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-400 rounded-full"></div> Clinical (40%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> Genetic (25%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Treatment (20%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600 rounded-full"></div> Outcome (15%)</div>
              </div>
            </div>
         </div>

         {/* 2. Cases Reported by Year (TIMELINE GRAPH) */}
         <div className="bg-[#E0E7FF]/40 p-8 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col h-[320px]">
            <h3 className="font-bold text-slate-800 text-[10px] uppercase tracking-widest mb-2">Cases Reported by Year</h3>
            
            <div className="relative flex-1 mt-6">
              {/* Y-Axis Labels */}
              <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-[8px] text-slate-400 font-bold">
                 <span>1.5k</span><span>1k</span><span>500</span>
              </div>

              {/* The SVG Timeline Graph */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120">
                {/* Area Fill (Gradient) */}
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M 0,120 L 0,${120-timelineData[0]} ${points} L 320,120 Z`} 
                  fill="url(#lineGrad)" 
                />
                
                {/* The Main Line */}
                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Nodes (Dots) on the line */}
                {timelineData.map((val, i) => (
                  <circle 
                    key={i} 
                    cx={i * 40} 
                    cy={120 - val} 
                    r="4" 
                    fill="#6366F1" 
                    stroke="white" 
                    strokeWidth="2" 
                  />
                ))}
              </svg>
            </div>

            {/* X-Axis Years */}
            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase mt-4 px-2 border-t border-indigo-100 pt-4">
               <span>2015</span><span>2016</span><span>2017</span><span>2018</span><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span>
            </div>

            {/* Bottom Progress Badge */}
            <div className="mt-4 bg-[#B2D8D0]/40 p-2 rounded-xl flex items-center gap-2">
               <TrendingUp size={12} className="text-teal-700" />
               <span className="text-[9px] font-black text-teal-800 uppercase tracking-tighter">
                  +12% increase from previous year
               </span>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- TAB 2: STATISTICS COMPONENT ---
const StatisticsUI = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-4 gap-6">
      <StatBox label="Total Patients" value="1,245" sub="↑ 12% this month" color="bg-[#E6F3F1]" icon={Users} iconColor="text-teal-600" />
      <StatBox label="Mean Age" value="24.5 yrs" sub="Median: 22.0" color="bg-[#EBF1FF]" icon={Baby} iconColor="text-blue-600" />
      <StatBox label="Avg FEV1 %" value="76.2%" sub="SD: ±14.5%" color="bg-[#F0EBF8]" icon={Wind} iconColor="text-purple-600" />
      <StatBox label="Data Completeness" value="94.8%" isProgress color="bg-[#F1F5F9]" icon={ClipboardCheck} iconColor="text-indigo-600" />
    </div>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-[400px] relative">
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-bold text-slate-800 text-sm">Patient Age Distribution</h3>
          <MoreVertical size={16} className="text-slate-300" />
        </div>
        <div className="flex items-end justify-between h-48 gap-4 px-10">
          <StatBar height="40%" label="0-5" /><StatBar height="75%" label="6-12" /><StatBar height="85%" label="13-18" active />
          <StatBar height="60%" label="19-25" /><StatBar height="45%" label="26-35" /><StatBar height="30%" label="36-45" /><StatBar height="15%" label="46-55" />
        </div>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
        <h3 className="w-full font-bold text-slate-800 text-sm mb-10">Demographics</h3>
        <div className="w-44 h-44 rounded-full border-[10px] border-indigo-500 border-l-blue-300 relative flex items-center justify-center">
            <div className="text-center"><span className="block text-2xl font-black">1245</span><span className="text-[8px] uppercase text-slate-400 font-bold">Total</span></div>
        </div>
      </div>
    </div>

    {/* Heatmap Matrix */}
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <h3 className="font-bold text-slate-800 text-sm mb-8">Biomarker Correlation Matrix</h3>
      <table className="w-full text-center text-[10px] font-bold uppercase tracking-wider">
        <thead className="bg-slate-50 text-slate-400">
          <tr><th className="p-4"></th><th className="p-4">FEV1</th><th className="p-4">BMI</th><th className="p-4">Sweat Cl-</th><th className="p-4">HbA1c</th><th className="p-4">CRP</th></tr>
        </thead>
        <tbody>
          <tr><td className="p-4 bg-slate-50">FEV1</td><td className="bg-indigo-300 text-white p-4 border border-white">1.0</td><td className="bg-purple-300 text-white p-4 border border-white">0.65</td><td className="bg-orange-400 text-white p-4 border border-white">-0.42</td><td className="bg-slate-100 p-4 border border-white">-0.12</td><td className="bg-orange-400 text-white p-4 border border-white">-0.58</td></tr>
          <tr><td className="p-4 bg-slate-50">BMI</td><td className="bg-purple-300 text-white p-4 border border-white">0.65</td><td className="bg-indigo-300 text-white p-4 border border-white">1.0</td><td className="bg-yellow-200 text-slate-600 p-4 border border-white">-0.21</td><td className="bg-indigo-100 text-slate-600 p-4 border border-white">0.34</td><td className="bg-yellow-200 text-slate-600 p-4 border border-white">-0.28</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- TAB 3: ACCESS & PERMISSIONS COMPONENT ---
const AccessPermissionsUI = () => (
  <div className="animate-in fade-in duration-500 space-y-8">
    <div className="grid grid-cols-2 gap-8">
      {/* DUA Box */}
      <div className="bg-[#E6F3F1]/40 border border-teal-100 p-10 rounded-[2rem]">
         <div className="flex items-center gap-2 mb-8 text-indigo-800">
            <Share2 size={18} /> <h3 className="font-bold text-sm">Data Usage Agreement (DUA)</h3>
         </div>
         <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
           Access to CF-Dataset-001 requires explicit adherence to the standard terms set forth by the RARE-X Data Governance Board. Data may only be used for non-commercial academic research aimed at advancing therapeutic interventions for Cystic Fibrosis.
         </p>
         <div className="bg-white/50 p-6 rounded-2xl border border-white mb-6">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase mb-4 tracking-widest">Key Stipulations</h4>
            <ul className="text-[10px] text-slate-500 space-y-3 font-medium list-disc ml-4">
              <li>No attempt to re-identify participants is permitted.</li>
              <li>Data cannot be transferred outside approved secure analytical environments.</li>
              <li>Annual reporting of derived publications is mandatory.</li>
            </ul>
         </div>
         <button className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2 ml-auto">
            Read Full Policy <ArrowUpRight size={12} />
         </button>
      </div>

      {/* Credentials Box */}
      <div className="bg-[#F0EBF8]/40 border border-purple-100 p-10 rounded-[2rem]">
         <div className="flex items-center gap-2 mb-8 text-indigo-800">
            <CheckCircle2 size={18} /> <h3 className="font-bold text-sm">Required Credentials</h3>
         </div>
         <div className="space-y-4">
            <CredentialRow icon={GraduationCap} title="IRB Approval" desc="Active Institutional Review Board approval documentation specific to this protocol." />
            <CredentialRow icon={BookOpen} title="CITI Certification" desc="Current Human Subjects Research (HSR) or Good Clinical Practice (GCP) training." />
            <CredentialRow icon={Building2} title="Institutional Sign-off" desc="An authorized signing official from the requesting institution must countersign the DUA." />
         </div>
      </div>
    </div>

    {/* Access Status Red Box */}
    <div className="w-1/3 bg-[#FEF2F2] border border-red-100 rounded-[2rem] p-10 shadow-sm">
       <h4 className="font-bold text-slate-800 mb-6 text-sm">Your Access Status</h4>
       <div className="flex items-center gap-2 bg-red-100 text-red-600 w-fit px-3 py-1 rounded-full text-[9px] font-bold uppercase mb-6 tracking-widest">
          <ShieldAlert size={12} /> Not Authorized
       </div>
       <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-10">
         You currently do not have permission to view or query the individual-level data within this dataset.
       </p>
       <button className="w-full bg-red-50 text-red-600 border border-red-200 py-4 rounded-2xl font-bold text-xs hover:bg-red-600 hover:text-white transition-all">
          Start Application
       </button>
    </div>
  </div>
);

// --- SMALL HELPERS ---
const OverviewRow = ({ label, value, color, bold }: any) => (
  <div className="flex py-1">
    <span className="w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`flex-1 text-xs leading-relaxed ${color || 'text-slate-600'} ${bold ? 'font-black text-slate-800' : 'font-medium'}`}>{value}</span>
  </div>
);

const IconBox = ({ icon: Icon }: any) => (
  <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center shadow-sm"><Icon size={14} /></div>
);

const StatBox = ({ label, value, sub, color, icon: Icon, iconColor, isProgress }: any) => (
  <div className={`${color} p-6 rounded-[1.5rem] relative overflow-hidden`}>
    <div className="flex justify-between items-start mb-4">
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
      <Icon className={iconColor} size={18} />
    </div>
    <p className="text-2xl font-black text-slate-800 leading-none mb-2">{value}</p>
    {isProgress ? <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden"><div className="h-full bg-indigo-600" style={{width:'95%'}}></div></div> : <p className="text-[9px] font-bold text-slate-400">{sub}</p>}
  </div>
);

const StatBar = ({ height, label, active }: any) => (
  <div className="flex flex-col items-center flex-1 h-full justify-end">
    <div className={`w-full rounded-t-lg transition-all duration-700 ${active ? 'bg-indigo-500 shadow-lg' : 'bg-indigo-300 opacity-80 hover:opacity-100'}`} style={{ height }}></div>
    <span className="text-[10px] font-bold text-slate-400 mt-4 tracking-tighter">{label}</span>
  </div>
);

const CredentialRow = ({ icon: Icon, title, desc }: any) => (
  <div className="bg-white/60 p-5 rounded-2xl border border-white flex gap-5">
    <div className="w-10 h-10 bg-[#B2D8D0] text-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"><Icon size={18} /></div>
    <div>
      <h5 className="text-[11px] font-bold text-slate-800 mb-1">{title}</h5>
      <p className="text-[9px] text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export default DiseaseDetail;