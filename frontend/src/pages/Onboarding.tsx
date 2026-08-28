import type { FC } from 'react';
import { useState } from 'react';
import { 
  Stethoscope, GraduationCap, FileSearch, ArrowRight, ArrowLeft, 
  Search, Trash2, Plus, Landmark, Building2, ShieldCheck, CheckCircle2,
  MapPin, Info, ChevronDown, FileText // Added missing icons
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Onboarding: FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const steps = ['Role', 'Identity', 'Education', 'Practice', 'Verification'];

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col font-sans">
      {/* 1. TOP APP BAR */}
      <header className="bg-[#bdc6e7] px-10 py-6 flex justify-between items-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tighter">Rare-X</h1>
        <button onClick={() => navigate('/')} className="text-slate-600 font-bold text-xs uppercase tracking-widest hover:text-slate-800">Exit</button>
      </header>

      {/* 2. PROGRESS STEPPER */}
      <nav className="bg-white border-b border-slate-100 px-10 py-4 flex justify-center gap-12">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-slate-800 border-b-2 border-slate-800 pb-1' : 'text-slate-300'}`}>
              {s}
            </span>
            {i < steps.length - 1 && <span className="text-slate-200 text-xs">›</span>}
          </div>
        ))}
      </nav>

      {/* 3. DYNAMIC CONTENT AREA */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {step === 1 && <StepRole onNext={() => setStep(2)} />}
          {step === 2 && <StepIdentity onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepEducation onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StepPractice onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <StepVerification onNext={() => setStep(6)} onBack={() => setStep(4)} />}
          {step === 6 && <StepSuccess />}

        </div>
      </main>
    </div>
  );
};

// --- STEP 1: ROLE SELECTION ---
const StepRole = ({ onNext }: any) => (
  <div className="text-center">
    <h2 className="text-4xl font-bold text-slate-800 mb-4">Tell us how you’ll use the platform</h2>
    <p className="text-slate-400 font-medium mb-16">This helps us personalize your experience, tools, and resources.</p>
    
    <div className="grid grid-cols-3 gap-8 mb-20">
      <RoleCard icon={Stethoscope} title="Doctor" desc="Practicing physician looking to manage patients and connect with peers." color="bg-[#E0E7FF]/50 text-indigo-600" />
      <RoleCard icon={GraduationCap} title="Medical Student" desc="Currently enrolled in a medical program seeking study resources and mentorship." color="bg-[#B2D8D0]/40 text-teal-700" />
      <RoleCard icon={FileSearch} title="Researcher" desc="Focused on clinical trials, data analysis, and publishing findings." color="bg-[#FFF4E5] text-orange-700" active />
    </div>

    <div className="flex justify-end px-4">
      <button onClick={onNext} className="bg-slate-400 text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">Continue</button>
    </div>
  </div>
);

// --- STEP 2: IDENTITY ---
const StepIdentity = ({ onNext, onBack }: any) => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-4xl font-bold text-slate-800 mb-4">Let's get to know you</h2>
    <p className="text-slate-400 font-medium mb-12">Enter your professional details so we can create your verified profile.</p>
    
    <div className="bg-[#B2D8D0]/20 p-10 rounded-[2.5rem] border border-[#B2D8D0]/30 space-y-6">
      <input type="text" placeholder="Legal Full Name" className="w-full bg-white p-5 rounded-2xl border-none outline-none text-sm shadow-sm" />
      <div className="relative">
        <input type="text" placeholder="Medical Registration Number (GMC/NPI)" className="w-full bg-white p-5 rounded-2xl border-none outline-none text-sm shadow-sm" />
        <Info size={18} className="absolute right-5 top-5 text-slate-300" />
      </div>
      <div className="bg-[#B2D8D0]/40 p-5 rounded-2xl flex gap-4 text-teal-900 items-center">
        <ShieldCheck size={24} className="shrink-0 text-teal-600" />
        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tighter opacity-70">Your professional identity is securely verified against national registries to ensure the safety and integrity of the MedOnboard network.</p>
      </div>
    </div>

    <div className="flex justify-between mt-12">
      <button onClick={onBack} className="flex items-center gap-2 bg-white/50 px-8 py-3 rounded-full font-bold text-xs text-slate-400 hover:bg-white transition-all"><ArrowLeft size={16}/> Back</button>
      <button onClick={onNext} className="flex items-center gap-2 bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">Continue <ArrowRight size={16}/></button>
    </div>
  </div>
);

// --- STEP 3: EDUCATION ---
const StepEducation = ({ onNext, onBack }: any) => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-4xl font-bold text-slate-800 mb-4">Where did you study?</h2>
    <p className="text-slate-400 font-medium mb-10">Add your educational background. You can include more than one institution.</p>
    
    <div className="bg-[#E0E7FF]/40 p-6 rounded-[1.5rem] flex justify-between items-center mb-8 border border-indigo-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><Building2 size={24}/></div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-none">All India Institute of Medical Sciences (AIIMS)</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">MBBS • 2018 - 2024</p>
        </div>
      </div>
      <Trash2 size={18} className="text-slate-300 cursor-pointer hover:text-red-400 transition-colors" />
    </div>

    <div className="bg-white p-10 rounded-[2.5rem] border border-indigo-50 shadow-sm space-y-6">
      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2">Add Institution</h4>
      <div className="relative">
        <input type="text" placeholder="Institution Name" className="w-full bg-slate-50 p-4 pl-5 pr-12 rounded-2xl border-none outline-none text-sm" />
        <Search className="absolute right-5 top-4 text-slate-300" size={18}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
            <select className="w-full bg-slate-50 p-4 rounded-2xl border-none text-sm text-slate-400 outline-none appearance-none font-bold">
                <option>Degree</option>
                <option>MBBS</option>
                <option>PhD</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-4 text-slate-300" />
        </div>
        <div className="grid grid-cols-2 gap-3">
           <input type="text" placeholder="Start Year" className="bg-slate-50 p-4 rounded-2xl border-none outline-none text-sm text-center font-bold" />
           <input type="text" placeholder="End Year" className="bg-slate-50 p-4 rounded-2xl border-none outline-none text-sm text-center font-bold" />
        </div>
      </div>
      <button className="flex items-center gap-2 bg-[#E0E7FF]/50 text-indigo-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E0E7FF] transition-all"><Plus size={16}/> Add another institution</button>
    </div>

    <div className="flex justify-between mt-12 px-2">
      <button onClick={onBack} className="bg-slate-100 text-slate-400 px-8 py-3 rounded-xl font-bold text-xs uppercase transition-all">Back</button>
      <button onClick={onNext} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Continue</button>
    </div>
  </div>
);

// --- STEP 4: PRACTICE ---
const StepPractice = ({ onNext, onBack }: any) => (
  <div className="max-w-5xl mx-auto">
    <h2 className="text-4xl font-bold text-slate-800 mb-4">Where are you currently associated?</h2>
    <p className="text-slate-400 font-medium mb-12">Add your current hospital, clinic, university, or laboratory.</p>
    
    <div className="grid grid-cols-2 gap-12">
      <div className="space-y-6">
         <div className="relative"><input type="text" placeholder="Mercy General" className="w-full bg-white p-5 pl-14 rounded-2xl border border-slate-200 outline-none text-sm shadow-sm" /><Search className="absolute left-5 top-5 text-slate-400" size={20}/></div>
         <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <HospitalResult name="Mercy General Hospital" address="4500 Mercy Way, Sacramento, CA" icon={Landmark} />
            <HospitalResult name="Mercy Clinic East" address="1200 East Ave, Sacramento, CA" icon={Building2} />
         </div>
         <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-6">Address Details</h4>
                <div className="space-y-6 text-[11px] font-bold text-slate-400">
                <div><p className="mb-1">Street Address</p><p className="text-slate-800 border-b border-slate-100 pb-2">4500 Mercy Way</p></div>
                <div className="grid grid-cols-2 gap-8">
                    <div><p className="mb-1">City</p><p className="text-slate-800 border-b border-slate-100 pb-2">Sacramento</p></div>
                    <div><p className="mb-1">State/Province</p><p className="text-slate-800 border-b border-slate-100 pb-2">CA</p></div>
                </div>
                </div>
            </div>
         </div>
      </div>
      {/* Map Preview */}
      <div className="rounded-[3rem] bg-slate-200 overflow-hidden relative border-4 border-white shadow-xl min-h-[450px]">
         <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-3xl shadow-2xl flex flex-col items-center gap-3 animate-bounce">
               <MapPin className="text-indigo-600" size={32}/>
               <span className="text-[10px] font-black uppercase text-slate-800">Set Location</span>
            </div>
         </div>
      </div>
    </div>

    <div className="flex justify-between mt-12">
      <button onClick={onBack} className="bg-slate-100 text-slate-400 px-8 py-3 rounded-xl font-bold text-xs uppercase">Back</button>
      <button onClick={onNext} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Continue</button>
    </div>
  </div>
);

// --- STEP 5: VERIFICATION ---
const StepVerification = ({ onNext, onBack }: any) => (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-4xl font-bold text-slate-800 mb-4 text-center tracking-tight">Verify your identity</h2>
    <p className="text-slate-400 font-medium mb-12 text-center">Keep professional profiles trustworthy within the medical community.</p>
    
    <div className="bg-[#FFF4E5]/50 border border-orange-100 p-16 rounded-[3rem] text-center space-y-8 shadow-sm">
       <div className="w-20 h-20 bg-white text-teal-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg border border-teal-50"><ShieldCheck size={40}/></div>
       <div>
         <h3 className="text-2xl font-black text-slate-800">Aadhaar Verification</h3>
         <p className="text-xs text-slate-400 max-w-sm mx-auto mt-3 leading-relaxed font-medium">We use secure government-backed verification. Your full Aadhaar number is never stored in our database.</p>
       </div>
       <div className="bg-white p-5 rounded-2xl border border-orange-100 max-w-sm mx-auto flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 font-mono text-lg font-bold italic">
             XXXX XXXX 4821
          </div>
          <span className="bg-[#D1FAE5] text-[#059669] text-[9px] font-black uppercase px-3 py-1 rounded-lg flex items-center gap-1.5"><CheckCircle2 size={12}/> Secure</span>
       </div>
       <div className="space-y-3 pt-4">
            <button className="w-full max-w-sm py-4 bg-teal-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-600 transition-all">Verify with Aadhaar</button>
            <button className="w-full max-w-sm py-4 bg-white text-slate-400 rounded-2xl font-bold text-[10px] uppercase hover:bg-slate-50 border border-slate-100">I'll verify later</button>
       </div>
    </div>

    <div className="flex justify-between mt-12 px-4">
      <button onClick={onBack} className="bg-slate-100 text-slate-400 px-8 py-3 rounded-xl font-bold text-xs uppercase">Back</button>
      <button onClick={onNext} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg">Continue</button>
    </div>
  </div>
);

// --- STEP 6: SUCCESS ---
const StepSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-teal-50 mb-10 animate-in zoom-in duration-700">
         <CheckCircle2 className="text-slate-900" size={54} />
      </div>
      <h2 className="text-5xl font-black text-slate-800 mb-6 tracking-tighter">Welcome to the community.</h2>
      <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed text-lg mb-16">Your professional profile has been successfully created. You are now ready to connect with peers and access specialized resources.</p>
      
      <button onClick={() => navigate('/')} className="bg-slate-900 text-white px-16 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 hover:bg-black transition-all flex items-center gap-4 mx-auto group">
        Go to dashboard <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
      </button>
    </div>
  );
};

// --- HELPERS ---
const RoleCard = ({ icon: Icon, title, desc, color, active }: any) => (
  <div className={`p-10 rounded-[2.5rem] border-4 flex flex-col items-center text-center transition-all cursor-pointer group h-full ${active ? 'bg-white border-slate-900 shadow-2xl scale-105' : 'bg-white/40 border-transparent hover:bg-white hover:border-slate-200'}`}>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${color}`}>
      <Icon size={32} />
    </div>
    <h4 className="text-xl font-black text-slate-800 mb-3">{title}</h4>
    <p className="text-xs text-slate-400 font-bold leading-relaxed px-2 uppercase tracking-tighter">{desc}</p>
  </div>
);

const HospitalResult = ({ name, address, icon: Icon }: any) => (
  <div className="p-5 px-8 border-b border-slate-50 flex items-center gap-5 hover:bg-slate-50 transition-all cursor-pointer">
    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-sm"><Icon size={20}/></div>
    <div>
      <p className="text-sm font-black text-slate-800 leading-none">{name}</p>
      <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{address}</p>
    </div>
  </div>
);

export default Onboarding;