import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Lock, Star, FileText, Landmark, 
  Activity, Beaker, Camera, TrendingUp,
  Users, Baby, Wind, ClipboardCheck,
  ShieldAlert, BookOpen, GraduationCap, Building2, ArrowLeft
} from 'lucide-react';
import { diseaseApi } from '../api/diseaseApi';
import { patientApi } from '../api/patientApi';
import type { Disease, Patient } from '../types/api';
import { useAuth } from '../context/AuthContext';

const DiseaseDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('Overview');
  const [disease, setDisease] = useState<Disease | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch disease by ID or default to 1 if named slug
        const diseaseId = isNaN(Number(id)) ? 1 : Number(id);
        const data = await diseaseApi.getDiseaseById(diseaseId);
        setDisease(data);

        const patientList = await patientApi.getPatients(undefined, data.id, 50);
        setPatients(patientList.patients);
      } catch (err: any) {
        console.error('Failed to load disease details:', err);
        setError('Could not load disease information.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 flex items-center justify-center font-bold text-slate-400">
        Loading disease dataset details...
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 flex flex-col items-center justify-center text-slate-500">
        <p className="text-xl font-bold mb-4">{error || 'Disease not found'}</p>
        <button 
          onClick={() => navigate('/repository')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700"
        >
          <ArrowLeft size={16} /> Return to Repository
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      {/* 1. TOP GLOBAL HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/repository')}
            className="p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for diseases, datasets, institutions..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none text-sm" 
            />
          </div>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter font-mono">
                  {disease.orpha_code || `DIS-${disease.id}`}
                </span>
                <span className="bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded-md text-[10px] font-bold">
                  FHIR R4 Verified
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {disease.name} Clinical & Genomic Dataset
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                <Landmark size={12} /> Rare Disease Repository Network • ICD-10: {disease.icd10_code || 'Q89.9'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#94A3B8] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm opacity-90 transition-all hover:bg-slate-500">
              <Lock size={14} /> Request Access
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all">
              <Star size={14} /> Bookmark
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

      {/* 4. CONTENT AREA */}
      <div className="min-h-[500px]">
        {activeTab === 'Overview' && <OverviewUI disease={disease} patientsCount={patients.length} />}
        {activeTab === 'Statistics' && <StatisticsUI patients={patients} />}
        {activeTab === 'Access & Permissions' && <AccessPermissionsUI isAuthenticated={isAuthenticated} />}
        {activeTab === 'Data Dictionary' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Associated Genes & Symptoms</h3>
            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Target Genes</p>
                <div className="flex gap-2 flex-wrap">
                  {disease.genes && disease.genes.length > 0 ? (
                    disease.genes.map(g => (
                      <span key={g} className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg">{g}</span>
                    ))
                  ) : <span className="text-slate-400">None cataloged</span>}
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Key Clinical Symptoms</p>
                <div className="flex gap-2 flex-wrap">
                  {disease.symptoms && disease.symptoms.length > 0 ? (
                    disease.symptoms.map(s => (
                      <span key={s} className="px-3 py-1 bg-teal-50 text-teal-700 font-bold rounded-lg">{s}</span>
                    ))
                  ) : <span className="text-slate-400">Standard clinical presentation</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- TAB 1: OVERVIEW COMPONENT ---
const OverviewUI = ({ disease, patientsCount }: { disease: Disease; patientsCount: number }) => {
  const timelineData = [30, 35, 45, 50, 65, 60, 80, 85, 100];
  const points = timelineData.map((val, i) => `${(i * 40)} , ${120 - val}`).join(" ");

  return (
    <div className="grid grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="col-span-2 bg-white p-10 rounded-[2.5rem] border border-teal-100/50 shadow-sm h-fit">
        <div className="space-y-6">
          <OverviewRow label="Disease Name" value={disease.name} bold />
          <hr className="border-slate-50" />
          <OverviewRow label="ORPHA Code" value={disease.orpha_code || 'N/A'} />
          <hr className="border-slate-50" />
          <OverviewRow label="ICD-10 Code" value={disease.icd10_code || 'N/A'} />
          <hr className="border-slate-50" />
          <OverviewRow label="Category" value={disease.category || 'Genetic / Rare'} />
          <hr className="border-slate-50" />
          <OverviewRow label="Inheritance" value={disease.inheritance_pattern || 'Autosomal Recessive'} />
          <hr className="border-slate-50" />
          <OverviewRow label="Description" value={disease.description || 'Comprehensive clinical, genetic and treatment data collected across federated hospital nodes.'} />
          <hr className="border-slate-50" />
          <div className="flex py-2">
            <span className="w-48 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data Types</span>
            <div className="flex gap-2">
              <IconBox icon={Activity} /><IconBox icon={Beaker} /><IconBox icon={Camera} /><IconBox icon={TrendingUp} />
            </div>
          </div>
          <hr className="border-slate-50" />
          <OverviewRow label="Total Patient Records" value={(disease.patient_count || patientsCount || 12).toString()} bold />
          <hr className="border-slate-50" />
          <OverviewRow label="Data Format" value="FHIR R4 (JSON)" />
          <hr className="border-slate-50" />
          <OverviewRow label="Availability" value="Available for Federated Query" color="text-teal-600" />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="space-y-8">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-[10px] mb-8 uppercase tracking-widest">Data Type Breakdown</h3>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full border-[10px] border-indigo-500 border-t-purple-500 border-r-orange-400 shadow-inner relative flex items-center justify-center">
                 <div className="w-4 h-4 bg-white absolute rounded-full shadow-sm"></div>
              </div>
              <div className="text-[9px] font-bold space-y-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-400 rounded-full"></div> Clinical (40%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> Genomic (25%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> Treatment (20%)</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600 rounded-full"></div> Outcomes (15%)</div>
              </div>
            </div>
         </div>

         <div className="bg-[#E0E7FF]/40 p-8 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col h-[320px]">
            <h3 className="font-bold text-slate-800 text-[10px] uppercase tracking-widest mb-2">Cases Logged Over Time</h3>
            
            <div className="relative flex-1 mt-6">
              <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-[8px] text-slate-400 font-bold">
                 <span>100</span><span>50</span><span>0</span>
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120">
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
                
                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

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

            <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase mt-4 px-2 border-t border-indigo-100 pt-4">
               <span>2018</span><span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- TAB 2: STATISTICS COMPONENT ---
const StatisticsUI = ({ patients }: { patients: Patient[] }) => {
  const count = patients.length || 12;
  const avgAge = patients.length > 0 ? (patients.reduce((acc, p) => acc + p.age, 0) / patients.length).toFixed(1) : '24.5';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-4 gap-6">
        <StatBox label="Registered Patients" value={count.toString()} sub="Verified records" color="bg-[#E6F3F1]" icon={Users} iconColor="text-teal-600" />
        <StatBox label="Mean Age" value={`${avgAge} yrs`} sub="Demographic range" color="bg-[#EBF1FF]" icon={Baby} iconColor="text-blue-600" />
        <StatBox label="Hospital Nodes" value="8 Nodes" sub="Federated repositories" color="bg-[#F0EBF8]" icon={Wind} iconColor="text-purple-600" />
        <StatBox label="Data Completeness" value="98.2%" isProgress color="bg-[#F1F5F9]" icon={ClipboardCheck} iconColor="text-indigo-600" />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-6">Patient Demographics List</h3>
        {patients.length > 0 ? (
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-3">Patient Code</th>
                <th className="p-3">Age</th>
                <th className="p-3">Sex</th>
                <th className="p-3">Ethnicity</th>
                <th className="p-3">City / Country</th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 10).map((p) => (
                <tr key={p.id} className="border-b border-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-800">{p.patient_code}</td>
                  <td className="p-3">{p.age} yrs</td>
                  <td className="p-3">{p.sex}</td>
                  <td className="p-3">{p.ethnicity}</td>
                  <td className="p-3">{p.city}, {p.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-slate-400 italic">No individual patient records available in public view.</p>
        )}
      </div>
    </div>
  );
};

// --- TAB 3: ACCESS & PERMISSIONS COMPONENT ---
const AccessPermissionsUI = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <div className="animate-in fade-in duration-500 space-y-8">
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-[#E6F3F1]/40 border border-teal-100 p-10 rounded-[2rem]">
         <div className="flex items-center gap-2 mb-8 text-indigo-800">
            <h3 className="font-bold text-sm">Data Usage Agreement (DUA)</h3>
         </div>
         <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
           Access to rare disease patient records requires explicit adherence to terms set by participating hospital IRB boards. Data may only be accessed via federated privacy-preserving queries.
         </p>
         <div className="bg-white/50 p-6 rounded-2xl border border-white mb-6">
            <h4 className="text-[10px] font-bold text-slate-800 uppercase mb-4 tracking-widest">Key Stipulations</h4>
            <ul className="text-[10px] text-slate-500 space-y-3 font-medium list-disc ml-4">
              <li>No re-identification of patients is allowed.</li>
              <li>Queries run in zero-knowledge or encrypted federated containers.</li>
              <li>Publications must cite RARE-X repository data contributors.</li>
            </ul>
         </div>
      </div>

      <div className="bg-[#F0EBF8]/40 border border-purple-100 p-10 rounded-[2rem]">
         <div className="flex items-center gap-2 mb-8 text-indigo-800">
            <CheckCircle2 size={18} /> <h3 className="font-bold text-sm">Required Credentials</h3>
         </div>
         <div className="space-y-4">
            <CredentialRow icon={GraduationCap} title="IRB Approval" desc="Active Institutional Review Board protocol approval." />
            <CredentialRow icon={BookOpen} title="CITI Certification" desc="Human Subjects Research training certificate." />
            <CredentialRow icon={Building2} title="Institutional Sign-off" desc="Authorized signing official verification." />
         </div>
      </div>
    </div>

    <div className="w-1/3 bg-[#FEF2F2] border border-red-100 rounded-[2rem] p-10 shadow-sm">
       <h4 className="font-bold text-slate-800 mb-6 text-sm">Your Access Status</h4>
       <div className={`flex items-center gap-2 ${isAuthenticated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'} w-fit px-3 py-1 rounded-full text-[9px] font-bold uppercase mb-6 tracking-widest`}>
          <ShieldAlert size={12} /> {isAuthenticated ? 'Authorized Researcher' : 'Not Authenticated'}
       </div>
       <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-10">
         {isAuthenticated 
           ? 'You have verified researcher access to perform federated analytics.'
           : 'You must log in with a verified account to submit data access requests.'}
       </p>
    </div>
  </div>
);

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