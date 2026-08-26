import type { Disease } from '../types/disease'; // Fixed: added 'type'
import { ArrowUpRight } from 'lucide-react'; 
import { Link } from 'react-router-dom';

interface Props {
  disease: Disease;
}

const DiseaseCard = ({ disease }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between mb-4">
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">
          {disease.category}
        </span>
        <ArrowUpRight size={18} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{disease.name}</h3>
      <p className="text-slate-500 text-sm my-3">{disease.description}</p>
      <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
        {disease.inheritance}
      </div>
      <Link 
        to={`/disease/${disease.id}`}
        className="mt-4 block text-center py-2 bg-blue-600 text-white rounded-xl text-sm font-bold"
      >
        View Details
      </Link>
    </div>
  );
};

export default DiseaseCard;