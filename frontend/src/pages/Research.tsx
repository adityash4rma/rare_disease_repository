import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, Mail, HelpCircle, CheckCircle2, 
  Plus, ChevronLeft, ChevronRight, Activity, Dna, 
  Camera, Stethoscope, TrendingUp, X, 
  FileText, Landmark, Users, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Types ---
type StudyType = 'clinical' | 'genetic' | 'imaging' | 'treatment' | 'outcome';

interface Study {
  id: number;
  name: string;
  disease: string;
  diseaseId: string;
  patients: string;
  leadCenter: string;
  centersCount: number;
  availability: 'Available' | 'Active' | 'Requested';
  types: StudyType[];
  protocolId: string;
  piName: string;
  description: string;
  biomarkers: string[];
  orphanDrug: string;
}

const allStudiesData: Study[] = [
  {
    id: 1,
    name: 'IND-SMA-Registry-2024',
    disease: 'Spinal Muscular Atrophy (SMA)',
    diseaseId: '27db5ddd-7f2a-47dc-b0c1-419d79818815',
    patients: '833',
    leadCenter: 'NIMHANS Bengaluru',
    centersCount: 8,
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging', 'treatment', 'outcome'],
    protocolId: 'ICMR-SMA-CT-2024-01',
    piName: 'Dr. Rajesh Kulkarni, DM (Neurology)',
    description: 'Pan-India longitudinal cohort study evaluating SMN1/SMN2 copy number variation, developmental motor checkpoints, and therapeutic outcomes under Nusinersen/Risdiplam access programs.',
    biomarkers: ['SMN1 Exon 7/8 Deletion', 'Serum Neurofilament Light Chain (NfL)', 'CHOP-INTEND Motor Score'],
    orphanDrug: 'Risdiplam / Nusinersen'
  },
  {
    id: 2,
    name: 'IND-WD-HepatoGen-01',
    disease: 'Wilson Disease',
    diseaseId: 'd17f5763-3a1b-4518-8543-7822f495d364',
    patients: '808',
    leadCenter: 'AIIMS New Delhi',
    centersCount: 8,
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment', 'outcome'],
    protocolId: 'AIIMS-GEN-WD-2024',
    piName: 'Dr. Aarav Sharma, MD (Medical Genetics)',
    description: 'Multi-centric genomic registry evaluating ATP7B mutational spectrum, 24-hour urinary copper clearance, Kayser-Fleischer ring progression, and zinc/penicillamine chelator efficacy.',
    biomarkers: ['Serum Ceruloplasmin', '24h Urinary Copper', 'ALT/AST Transaminases', 'ATP7B c.813C>A Mutation'],
    orphanDrug: 'D-Penicillamine / Trientine'
  },
  {
    id: 3,
    name: 'IND-Gaucher-Macrophage-AI',
    disease: 'Gaucher Disease Type 1',
    diseaseId: '33469052-81d8-4288-854b-b2d2da6d813a',
    patients: '874',
    leadCenter: 'Christian Medical College (CMC) Vellore',
    centersCount: 8,
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging', 'outcome'],
    protocolId: 'CMC-GBA-STUDY-04',
    piName: 'Dr. Priya Iyer, PhD (Genomics)',
    description: 'Comprehensive lysosomal storage cohort tracking GBA N370S/L444P alleles, Erlenmeyer flask skeletal bone deformity progression, and long-term enzyme replacement therapy (ERT) responses.',
    biomarkers: ['Glucosylsphingosine (Lyso-Gb1)', 'Chitotriosidase Activity', 'Platelet Count', 'Bone Mineral Density DEXA'],
    orphanDrug: 'Imiglucerase (ERT) / Miglustat'
  },
  {
    id: 4,
    name: 'IND-AKU-Ochronosis-Study',
    disease: 'Alkaptonuria',
    diseaseId: 'd772f959-86b5-4fa5-9a01-9020a21af2fb',
    patients: '844',
    leadCenter: 'SGPGI Lucknow',
    centersCount: 8,
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
    protocolId: 'SGPGI-AKU-COHORT-24',
    piName: 'Dr. Ananya Bose, MD (Rheumatology)',
    description: 'National clinical investigation on homogentisic acid 1,2-dioxygenase (HGD) deficiency, ochronotic spondyloarthropathy severity, aortic valve calcification, and Nitisinone response markers.',
    biomarkers: ['Urinary Homogentisic Acid (HGA)', 'Serum HGA Concentration', 'Spine MRI Sclerosis Index'],
    orphanDrug: 'Nitisinone'
  },
  {
    id: 5,
    name: 'Rare-FL-Federated-RiskNet',
    disease: 'Multi-Disease Federated AI',
    diseaseId: '',
    patients: '3,359',
    leadCenter: 'ICMR National Rare Disease Consortium',
    centersCount: 8,
    availability: 'Active',
    types: ['clinical', 'genetic', 'outcome'],
    protocolId: 'FL-RAREX-AI-2024',
    piName: 'National Registry Administrator (ICMR)',
    description: 'Decentralized Federated Learning trial training RareDiseaseNet across 8 Indian hospital nodes to predict clinical disease progression without raw patient data centralization.',
    biomarkers: ['10 Multi-Modal Clinical & Lab Parameters', 'Federated Averaging Round Weights'],
    orphanDrug: 'Multi-Target Regimen'
  },
  {
    id: 6,
    name: 'CF-CFTR-India-Registry',
    disease: 'Cystic Fibrosis',
    diseaseId: '',
    patients: '620',
    leadCenter: 'AIIMS New Delhi',
    centersCount: 5,
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment'],
    protocolId: 'AIIMS-CFTR-IND-02',
    piName: 'Dr. S. K. Kabra, MD (Pediatrics)',
    description: 'Multi-center registry tracking CFTR mutations in Indian children, sweat chloride testing profiles, and long-term pulmonary function metrics under targeted CFTR potentiator therapies.',
    biomarkers: ['Sweat Chloride Assay', 'CFTR DeltaF508/Exon 10 Sequencing', 'FEV1 Spirometry Index'],
    orphanDrug: 'Ivacaftor / Elexacaftor'
  },
  {
    id: 7,
    name: 'DMD-ExonSkip-Trial',
    disease: 'Duchenne Muscular Dystrophy (DMD)',
    diseaseId: '',
    patients: '740',
    leadCenter: 'NIMHANS Bengaluru',
    centersCount: 6,
    availability: 'Active',
    types: ['clinical', 'genetic', 'imaging', 'outcome'],
    protocolId: 'NIMHANS-DMD-EXON51',
    piName: 'Dr. Madhu Nagappa, DM',
    description: 'Clinical observational study evaluating dystrophin gene deletions, North Star Ambulatory Assessment (NSAA) scoring, and cardiac MRI fibrosis patterns in pediatric cohorts.',
    biomarkers: ['DMD Gene Multiplex MLPA', 'Serum Creatine Kinase (CK)', 'Cardiac T1 Mapping'],
    orphanDrug: 'Eteplirsen / Deflazacort'
  },
  {
    id: 8,
    name: 'HD-CAG-Repeat-Consortium',
    disease: 'Huntington Disease',
    diseaseId: '',
    patients: '315',
    leadCenter: 'IPGMER Kolkata',
    centersCount: 4,
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
    protocolId: 'IPGMER-HTT-CAG-09',
    piName: 'Dr. Alok Banerjee, MD (Genetics)',
    description: 'Investigation of huntingtin (HTT) exon 1 CAG repeat expansions, motor chorea progression, and brain structural voxel-based morphometry in eastern and north-eastern Indian populations.',
    biomarkers: ['HTT Exon 1 CAG Repeat Size', 'UHDRS Motor Rating Score', 'Striatal Volumetry MRI'],
    orphanDrug: 'Deutetrabenazine'
  },
  {
    id: 9,
    name: 'SCD-Gen-Variant-Mapping',
    disease: 'Sickle Cell Disease',
    diseaseId: '',
    patients: '1,420',
    leadCenter: 'GMC Nagpur & ICMR-NIRRCH',
    centersCount: 7,
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment', 'outcome'],
    protocolId: 'NIRRCH-HBB-GLU6VAL-24',
    piName: 'Dr. Smita Mahale, PhD',
    description: 'Extensive genetic mapping of HBB sickle mutation alleles, Arab-Indian beta-globin haplotype variations, and hydroxyurea induction response biomarkers in central tribal districts.',
    biomarkers: ['Fetal Hemoglobin (HbF) %', 'HBB Sanger Sequencing', 'Serum Ferritin', 'Transcranial Doppler'],
    orphanDrug: 'Hydroxyurea / Voxelotor'
  },
  {
    id: 10,
    name: 'MPS-Mucopolysaccharidosis-PanIndia',
    disease: 'Mucopolysaccharidosis (MPS I/II)',
    diseaseId: '',
    patients: '280',
    leadCenter: 'Tata Memorial Centre (TMC) Mumbai',
    centersCount: 5,
    availability: 'Active',
    types: ['clinical', 'genetic', 'imaging'],
    protocolId: 'TMC-MPS-REGISTRY-2024',
    piName: 'Dr. Neha Shah, DM (Hematology-Oncology)',
    description: 'Prospective registry analyzing IDUA and IDS enzymatic activity, glycosaminoglycan (GAG) excretion, dysostosis multiplex skeletal manifestations, and pre/post HSCT outcomes.',
    biomarkers: ['Urinary GAG Electrophoresis', 'IDUA Enzyme Activity Assay', 'Echocardiography Ejection Fraction'],
    orphanDrug: 'Laronidase / Idursulfase'
  },
  {
    id: 11,
    name: 'FD-Fabry-CardioRenal-Study',
    disease: 'Fabry Disease',
    diseaseId: '',
    patients: '210',
    leadCenter: 'Christian Medical College (CMC) Vellore',
    centersCount: 4,
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment', 'outcome'],
    protocolId: 'CMC-GLA-FABRY-24',
    piName: 'Dr. George Thomas, MD (Nephrology)',
    description: 'Long-term cardio-renal outcome monitoring in patients with GLA mutations, assessing globotriaosylsphingosine (Lyso-Gb3) reduction and agalsidase beta enzyme therapy.',
    biomarkers: ['Plasma Lyso-Gb3', 'Alpha-Galactosidase A Assay', 'Estimated GFR eGFR Slope', 'Left Ventricular Mass Index'],
    orphanDrug: 'Agalsidase Beta / Migalastat'
  },
  {
    id: 12,
    name: 'FD-Fibrodysplasia-FOP-IndianCohort',
    disease: 'Fibrodysplasia Ossificans Progressiva (FOP)',
    diseaseId: '',
    patients: '85',
    leadCenter: 'GCRI Ahmedabad',
    centersCount: 3,
    availability: 'Requested',
    types: ['clinical', 'genetic', 'imaging'],
    protocolId: 'GCRI-ACVR1-FOP-2024',
    piName: 'Dr. Rajesh Mehta, MS (Orthopedics)',
    description: 'Rare cohort tracking ACVR1 c.617G>A (R206H) mutations, heterotopic ossification flare dynamics, and preventative management protocols across western Indian centers.',
    biomarkers: ['ACVR1 Sequencing', 'Whole-Body Low-Dose CT (WBCT)', 'Alkaline Phosphatase ALP'],
    orphanDrug: 'Palovarotene'
  }
];

const dataDictionaryItems = [
  { field: 'Patient_ID', type: 'String (UUID / Code)', desc: 'Unique anonymized patient identifier (e.g. IND-RDR-0001).' },
  { field: 'Rare_Disease_Name', type: 'Categorical', desc: 'Verified clinical diagnosis (SMA, Wilson Disease, Gaucher Disease, Alkaptonuria).' },
  { field: 'Mutated_Gene', type: 'String (HGNC)', desc: 'Causal human gene locus (SMN1, ATP7B, GBA, HGD).' },
  { field: 'Specialized_Biomarker_Name', type: 'String', desc: 'Target clinical biomarker (e.g. Serum Ceruloplasmin, Urinary HGA, Lyso-Gb1).' },
  { field: 'Biomarker_Value', type: 'Float / Unit', desc: 'Measured quantitative biomarker laboratory result.' },
  { field: 'Clinical_Severity_Score_1_10', type: 'Integer (1-10)', desc: 'Standardized clinical disease severity index.' },
  { field: 'Systolic_BP_mmHg / Diastolic_BP_mmHg', type: 'Integer', desc: 'Resting hemodynamic blood pressure vitals.' },
  { field: 'ALT_U_L / AST_U_L', type: 'Float (U/L)', desc: 'Liver function transaminase enzymatic assays.' },
  { field: 'Serum_Creatinine_mg_dL', type: 'Float (mg/dL)', desc: 'Renal function and filtration biomarker.' },
  { field: 'Platelet_Count_cells_mcL', type: 'Integer (cells/mcL)', desc: 'Hematological platelet count (critical for Gaucher/Wilson).' },
  { field: 'Prescribed_Orphan_Drug', type: 'String (INN)', desc: 'Targeted rare disease therapeutic regimen.' },
  { field: 'Clinical_Outcome_Target', type: 'Binary Target', desc: 'High Risk (Progressive) vs Therapeutic Responder (Stable).' },
];

const Research: FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'studies' | 'dictionary'>('studies');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);

  // Filter studies by search
  const filteredStudies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return allStudiesData;
    return allStudiesData.filter((study) => 
      study.name.toLowerCase().includes(query) || 
      study.disease.toLowerCase().includes(query) ||
      study.leadCenter.toLowerCase().includes(query) ||
      study.protocolId.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredStudies.length / pageSize));

  const paginatedStudies = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredStudies.slice(startIndex, startIndex + pageSize);
  }, [filteredStudies, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  return (
    <div className="flex-1 bg-[#F4F7FE] min-h-screen p-8 overflow-y-auto">
      
      {/* 1. Header Bar */}
      <header className="flex justify-between items-center mb-8">
        <div className="relative w-[500px]">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search studies by disease, protocol, center..." 
            className="w-full pl-12 pr-4 py-2.5 bg-white rounded-full border-none shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-slate-400">
            <Bell size={20} className="cursor-pointer hover:text-indigo-600" />
            <Mail size={20} className="cursor-pointer hover:text-indigo-600" />
            <HelpCircle size={20} className="cursor-pointer hover:text-indigo-600" />
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm">
              <CheckCircle2 size={14} /> {user?.full_name || 'Verified Researcher'}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white border border-indigo-100 px-4 py-2 rounded-full text-indigo-600 font-bold text-xs shadow-sm"
            >
              <CheckCircle2 size={14} /> Log In
            </button>
          )}
        </div>
      </header>

      {/* 2. Page Title Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Research Studies & Registry Trials</h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">Explore pan-India clinical cohort studies, molecular registries, and multi-institutional trials.</p>
        </div>
        <button 
          onClick={() => navigate('/requests')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          <Plus size={16} /> Request Research Access
        </button>
      </div>

      {/* 3. Navigation Tabs */}
      <nav className="flex gap-10 border-b border-slate-200 mb-8 px-2">
        <button 
          onClick={() => { setActiveTab('studies'); setPage(1); }}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === 'studies' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Active Studies ({filteredStudies.length})
          {activeTab === 'studies' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('dictionary')}
          className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === 'dictionary' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Data Dictionary ({dataDictionaryItems.length} Fields)
          {activeTab === 'dictionary' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600 rounded-full" />}
        </button>
      </nav>

      {/* 4. Table Content */}
      {activeTab === 'studies' ? (
        <>
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm mb-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#E0E7FF]/30 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">Study / Protocol</th>
                  <th className="px-6 py-5">Rare Disease Target</th>
                  <th className="px-6 py-5">Lead Institution</th>
                  <th className="px-6 py-5">Data Types</th>
                  <th className="px-6 py-5">Cohort Size</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-600 font-bold">
                {paginatedStudies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                      No research studies match your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedStudies.map((study) => (
                    <tr key={study.id} className="border-b border-slate-50 hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-black font-mono">{study.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{study.protocolId}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{study.disease}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{study.leadCenter}</td>
                      <td className="px-6 py-4 flex gap-1.5 mt-1">
                        {study.types.map(type => <TypeBadge key={type} type={type} />)}
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-700">{study.patients} Patients</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          study.availability === 'Available' ? 'bg-teal-50 text-teal-600' :
                          study.availability === 'Active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {study.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedStudy(study)}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                        >
                          View Protocol
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 px-2">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
              Showing {filteredStudies.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredStudies.length)} of {filteredStudies.length} Research Protocols
            </p>
            
            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded-lg border transition-all ${page === 1 ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'}`}
                title="Previous Page"
              >
                <ChevronLeft size={16}/>
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                const isCurrent = pNum === page;
                return (
                  <button 
                    key={pNum} 
                    onClick={() => handlePageChange(pNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border transition-all ${page === totalPages ? 'border-slate-100 text-slate-300 cursor-not-allowed' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer'}`}
                title="Next Page"
              >
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>

          {/* Legend Footer */}
          <div className="flex gap-6 p-5 bg-white border border-slate-100 rounded-[1.5rem] w-fit shadow-sm">
            <LegendItem icon={Activity} label="Clinical" color="bg-blue-100 text-blue-500" />
            <LegendItem icon={Dna} label="Genetic" color="bg-purple-100 text-purple-500" />
            <LegendItem icon={Camera} label="Imaging" color="bg-green-100 text-green-500" />
            <LegendItem icon={Stethoscope} label="Treatment" color="bg-red-100 text-red-500" />
            <LegendItem icon={TrendingUp} label="Outcome" color="bg-indigo-100 text-indigo-500" />
          </div>
        </>
      ) : (
        /* Data Dictionary Table */
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">10,000 Indian Clinical Cohort Schema</h3>
            <p className="text-xs text-slate-400 mt-1">Field definitions and data dictionary specifications for research interoperability.</p>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#E0E7FF]/30 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Field Name</th>
                <th className="px-6 py-4">Data Type</th>
                <th className="px-6 py-4">Description & Clinical Relevance</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700">
              {dataDictionaryItems.map((item) => (
                <tr key={item.field} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-mono font-bold text-indigo-700">{item.field}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-500">{item.type}</td>
                  <td className="px-6 py-3.5 text-slate-600">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Study Detail Interactive Modal */}
      {selectedStudy && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full border border-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedStudy.protocolId}
                </span>
                <h2 className="text-2xl font-bold text-slate-800 mt-2 tracking-tight">{selectedStudy.name}</h2>
                <p className="text-sm font-semibold text-indigo-600">{selectedStudy.disease}</p>
              </div>
              <button 
                onClick={() => setSelectedStudy(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Study Description & Objectives</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedStudy.description}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Landmark size={14} /> Principal Investigator
                  </p>
                  <p className="font-bold text-slate-800">{selectedStudy.piName}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{selectedStudy.leadCenter}</p>
                </div>

                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/50">
                  <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Users size={14} /> Cohort Size & Participating Centers
                  </p>
                  <p className="font-bold text-slate-800">{selectedStudy.patients} Patient Cohort</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">{selectedStudy.centersCount} Apex Indian Medical Centers</p>
                </div>
              </div>

              {/* Target Biomarkers */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Target Biomarkers & Endpoints
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudy.biomarkers.map((bio) => (
                    <span key={bio} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-[11px] font-bold">
                      {bio}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescribed Orphan Regimen */}
              <div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Prescribed Orphan Drug Regimen</h4>
                <p className="text-xs font-bold text-slate-800 font-mono">{selectedStudy.orphanDrug}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
              <button 
                onClick={() => {
                  setSelectedStudy(null);
                  navigate('/datasets');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <FileText size={16} /> Explore Cohort Datasets
              </button>
              <button 
                onClick={() => {
                  setSelectedStudy(null);
                  navigate('/requests');
                }}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
              >
                Request Federated Access
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// --- Helper Components ---

const TypeBadge = ({ type }: { type: StudyType }) => {
  const configs: Record<StudyType, { icon: any; color: string }> = {
    clinical: { icon: Activity, color: 'bg-blue-100 text-blue-500' },
    genetic: { icon: Dna, color: 'bg-purple-100 text-purple-500' },
    imaging: { icon: Camera, color: 'bg-green-100 text-green-500' },
    treatment: { icon: Stethoscope, color: 'bg-red-100 text-red-500' },
    outcome: { icon: TrendingUp, color: 'bg-indigo-100 text-indigo-500' },
  };
  const config = configs[type] || configs.clinical;
  const Icon = config.icon;
  return (
    <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-xs ${config.color}`}>
      <Icon size={12} />
    </div>
  );
};

const LegendItem = ({ icon: Icon, label, color }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${color}`}><Icon size={14} /></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default Research;