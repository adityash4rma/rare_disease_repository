import type { FC } from 'react';
import { useState } from 'react';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  MessageSquare, Check, X, MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react';

const AccessRequests: FC = () => {
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'incoming'

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto font-sans">
      {/* 1. Global Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input type="text" placeholder="Search for diseases, datasets, institutions..." className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none text-sm focus:ring-2 focus:ring-indigo-400 transition-all" />
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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Access Requests</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Manage your data access requests across the research network.</p>
      </div>

      {/* 3. Sub-Tabs */}
      <nav className="flex gap-8 border-b border-slate-200 mb-10 px-2">
        <button 
          onClick={() => setActiveTab('my')}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'my' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
        >
          My Requests
          {activeTab === 'my' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'incoming' ? 'text-indigo-600' : 'text-slate-300 hover:text-slate-500'}`}
        >
          Incoming Requests
          {activeTab === 'incoming' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
      </nav>

      {/* 4. Dynamic Content Rendering */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        {activeTab === 'my' ? <MyRequestsTable /> : <IncomingRequestsTable />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: MY REQUESTS (Screenshot 1) ---
const MyRequestsTable = () => {
  const data = [
    { id: 1, study: 'Genomic Sequencing in SMA Type 1', disease: 'Spinal Muscular Atrophy', owner: 'Dr. A. Chen', hospital: "Boston Children's Hospital", date: 'Oct 24, 2023', status: 'Approved' },
    { id: 2, study: 'Longitudinal Study of DMD Biomarkers', disease: 'Duchenne Muscular Dystrophy', owner: 'Dr. M. Roberts', hospital: "Mayo Clinic", date: 'Nov 02, 2023', status: 'Pending' },
    { id: 3, study: 'Metabolic Profiling in CF Patients', disease: 'Cystic Fibrosis', owner: 'Dr. S. Williams', hospital: "Stanford Medical", date: 'Sep 15, 2023', status: 'Denied' },
  ];

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-[#E0E7FF]/40 text-[10px] text-slate-500 font-black uppercase tracking-widest">
        <tr>
          <th className="px-10 py-5">Study Name</th>
          <th className="px-10 py-5">Owner</th>
          <th className="px-10 py-5">Affiliated Hospital</th>
          <th className="px-10 py-5">Date Requested</th>
          <th className="px-10 py-5">Status</th>
          <th className="px-10 py-5">Action</th>
        </tr>
      </thead>
      <tbody className="text-xs font-bold text-slate-600">
        {data.map(row => (
          <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="px-10 py-6">
              <p className="text-slate-800 text-sm font-black mb-0.5">{row.study}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{row.disease}</p>
            </td>
            <td className="px-10 py-6 text-slate-500 font-medium">{row.owner}</td>
            <td className="px-10 py-6 text-slate-500 font-medium">{row.hospital}</td>
            <td className="px-10 py-6 text-slate-500 font-medium">{row.date}</td>
            <td className="px-10 py-6">
              <StatusPill status={row.status} />
            </td>
            <td className="px-10 py-6">
              <button className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl text-[10px] text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <MessageSquare size={14} className="text-indigo-600" /> Contact Owner
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// --- SUB-COMPONENT: INCOMING REQUESTS (Screenshot 2) ---
const IncomingRequestsTable = () => {
  const data = [
    { id: 1, name: 'Dr. Sarah Jenkins', hospital: 'Mayo Clinic', purpose: 'Genomic variants in early-onset...', date: 'Oct 12, 2023', status: 'Action' },
    { id: 2, name: 'Dr. Michael Chen', hospital: 'Stanford Medicine', purpose: 'Longitudinal study of rare neuro...', date: 'Oct 10, 2023', status: 'Action' },
    { id: 3, name: 'Dr. Emily Larson', hospital: 'Johns Hopkins', purpose: 'Data correlation for pediatric...', date: 'Oct 05, 2023', status: 'Approved' },
  ];

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#E0E7FF]/40 text-[10px] text-slate-500 font-black uppercase tracking-widest">
          <tr>
            <th className="px-10 py-5">Requester Name</th>
            <th className="px-10 py-5">Affiliated Hospital</th>
            <th className="px-10 py-5">Study/Purpose</th>
            <th className="px-10 py-5">Date Requested</th>
            <th className="px-10 py-5">Status / Action</th>
            <th className="px-10 py-5 text-center">Contact</th>
          </tr>
        </thead>
        <tbody className="text-xs font-bold text-slate-600">
          {data.map(row => (
            <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="px-10 py-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-600">
                     {row.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <span className="text-slate-800 font-black">{row.name}</span>
                </div>
              </td>
              <td className="px-10 py-6 text-slate-500 font-medium">{row.hospital}</td>
              <td className="px-10 py-6 text-slate-500 font-medium">{row.purpose}</td>
              <td className="px-10 py-6 text-slate-500 font-medium">{row.date}</td>
              <td className="px-10 py-6">
                {row.status === 'Action' ? (
                  <div className="flex gap-2">
                    <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-indigo-700">Approve</button>
                    <button className="border border-slate-200 bg-white px-3 py-1.5 rounded-lg font-bold text-[10px] text-slate-500 hover:bg-slate-50">Deny</button>
                  </div>
                ) : (
                  <StatusPill status="Approved" />
                )}
              </td>
              <td className="px-10 py-6 text-center">
                <Mail size={18} className="text-indigo-400 mx-auto cursor-pointer hover:text-indigo-600" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-6 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-bold uppercase">Showing 1-3 of 12 requests</p>
        <div className="flex gap-2">
           <button className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-[10px] font-bold text-slate-400 uppercase">Prev</button>
           <button className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-[10px] font-bold text-slate-600 uppercase hover:bg-slate-50 transition-all">Next</button>
        </div>
      </div>
    </>
  );
};

// --- HELPER: STATUS PILL ---
const StatusPill = ({ status }: { status: string }) => {
  const configs: any = {
    'Approved': 'bg-[#D1FAE5] text-[#059669]',
    'Pending': 'bg-[#E0E7FF] text-indigo-600',
    'Denied': 'bg-[#FEE2E2] text-[#B91C1C]',
  };
  const dotConfigs: any = {
    'Approved': 'bg-[#059669]',
    'Pending': 'bg-indigo-600',
    'Denied': 'bg-[#B91C1C]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${configs[status]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dotConfigs[status]}`}></div>
      {status}
    </span>
  );
};

export default AccessRequests;