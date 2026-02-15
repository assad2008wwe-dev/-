import React from 'react';
import { Microscope, FlaskConical, Bone, Activity, ChevronRight } from 'lucide-react';
import { Section } from '../types';

interface Props {
  section: Section;
  onClick: () => void;
}

const SectionCard: React.FC<Props> = ({ section, onClick }) => {
  const getIcon = () => {
    switch (section.iconName) {
      case 'microscope': return <Microscope className="w-6 h-6 text-white" />;
      case 'flask': return <FlaskConical className="w-6 h-6 text-white" />;
      case 'bone': return <Bone className="w-6 h-6 text-white" />;
      case 'activity': return <Activity className="w-6 h-6 text-white" />;
      default: return <Activity className="w-6 h-6 text-white" />;
    }
  };

  // Color coding based on index or type (simulated randomly or by ID)
  const colors = {
    sec1: 'bg-rose-500',
    sec2: 'bg-indigo-500',
    sec3: 'bg-teal-500',
    sec4: 'bg-amber-500',
  };
  const bgClass = colors[section.id as keyof typeof colors] || 'bg-blue-500';

  return (
    <div 
      onClick={onClick}
      className="group relative flex items-center p-4 mb-4 rounded-3xl bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer border border-slate-700/50 hover:border-slate-600"
    >
      <div className={`w-14 h-14 rounded-2xl ${bgClass} flex items-center justify-center shadow-lg mr-4 flex-shrink-0 group-hover:scale-105 transition-transform`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-slate-100 truncate">{section.title}</h3>
          <span className="text-xs text-slate-500 font-medium">Topic</span>
        </div>
        <p className="text-slate-400 text-sm truncate pr-4">
          {section.description}
        </p>
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-slate-600 group-hover:text-white transition-colors">
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default SectionCard;