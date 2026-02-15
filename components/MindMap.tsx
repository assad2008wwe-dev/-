import React, { useState } from 'react';
import { MindMapNode } from '../types';
import { ChevronDown, ChevronRight, Circle } from 'lucide-react';

interface Props {
  node: MindMapNode;
  depth?: number;
  isLast?: boolean;
}

const MindMap: React.FC<Props> = ({ node, depth = 0, isLast = true }) => {
  const [expanded, setExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  
  // Color logic for depth
  const colors = [
    'border-rose-500 text-rose-500 bg-rose-500/10',
    'border-indigo-500 text-indigo-500 bg-indigo-500/10',
    'border-teal-500 text-teal-500 bg-teal-500/10',
    'border-amber-500 text-amber-500 bg-amber-500/10',
    'border-slate-500 text-slate-400 bg-slate-500/10'
  ];
  const colorClass = colors[depth % colors.length];

  return (
    <div className="flex flex-col relative">
      <div className="flex items-start group">
        
        {/* Connection lines rendering (simple CSS logic) */}
        {depth > 0 && (
           <div className="absolute -left-6 top-5 w-6 h-px bg-slate-700"></div>
        )}
        
        <div className="relative z-10 flex-1">
           {/* Node Card */}
           <div 
             className={`
                flex flex-col p-4 rounded-2xl border ${colorClass} 
                mb-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 hover:translate-x-1 cursor-default
                backdrop-blur-sm
             `}
             style={{ minWidth: '200px' }}
           >
             <div 
               className="flex items-center justify-between cursor-pointer"
               onClick={() => setExpanded(!expanded)}
             >
               <h4 className="font-bold text-lg">{node.label}</h4>
               {hasChildren && (
                 <div className="ml-2 p-1 rounded-full hover:bg-black/20">
                   {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                 </div>
               )}
             </div>
             
             {node.details && (
               <p className={`mt-2 text-sm opacity-80 leading-relaxed ${expanded ? 'block' : 'hidden'}`}>
                 {node.details}
               </p>
             )}
           </div>

           {/* Children Container */}
           {hasChildren && expanded && (
             <div className="ml-6 pl-6 border-l border-slate-700 relative">
               {node.children!.map((child, index) => (
                 <MindMap 
                    key={child.id || index} 
                    node={child} 
                    depth={depth + 1}
                    isLast={index === node.children!.length - 1} 
                 />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;
