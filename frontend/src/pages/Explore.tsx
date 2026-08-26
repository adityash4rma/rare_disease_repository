import { useState } from 'react';
import { Search } from 'lucide-react';
import DiseaseCard from '../components/DiseaseCard';
import type { Disease } from '../types/disease'; // Fixed: added 'type'

const Explore = () => {
  const [diseases] = useState<Disease[]>([
    {
      id: '1',
      name: 'Huntington Disease',
      description: 'A progressive brain disorder that causes uncontrolled movements.',
      category: 'Neurological',
      prevalence: '1 in 10,000',
      inheritance: 'Autosomal Dominant'
    },
    {
      id: '2',
      name: 'Cystic Fibrosis',
      description: 'An inherited disorder that causes severe damage to the lungs.',
      category: 'Genetic',
      prevalence: '1 in 3,000',
      inheritance: 'Autosomal Recessive'
    }
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="relative mb-8">
        <Search className="absolute left-4 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search database..." 
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diseases.map((item) => (
          <DiseaseCard key={item.id} disease={item} />
        ))}
      </div>
    </div>
  );
};

export default Explore;