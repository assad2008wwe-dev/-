import React, { useState } from 'react';
import { SECTIONS } from './constants';
import { Section } from './types';
import SectionCard from './components/SectionCard';
import MCQView from './components/MCQView';
import StudyView from './components/StudyView';
import { BookOpenCheck, BrainCircuit, LayoutGrid, Search, User } from 'lucide-react';

enum AppView {
  DASHBOARD = 'DASHBOARD',
  SECTION_DETAIL = 'SECTION_DETAIL',
  MCQ = 'MCQ',
  STUDY = 'STUDY'
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
    setView(AppView.SECTION_DETAIL);
  };

  const handleBackToDashboard = () => {
    setSelectedSection(null);
    setView(AppView.DASHBOARD);
  };

  const handleBackToSection = () => {
    setView(AppView.SECTION_DETAIL);
  };

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Sidebar (Desktop) / Hidden on Mobile mostly */}
      <aside className="hidden lg:flex flex-col w-20 bg-slate-900 border-r border-slate-800 items-center py-8 gap-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <LayoutGrid className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-6">
            <button className="p-3 rounded-xl bg-slate-800 text-white shadow-md"><LayoutGrid className="w-5 h-5" /></button>
            <button className="p-3 rounded-xl hover:bg-slate-800 text-slate-500 transition-colors"><User className="w-5 h-5" /></button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Render Views */}
        {view === AppView.DASHBOARD && (
            <div className="flex-1 overflow-auto">
                <div className="max-w-md mx-auto px-6 py-10 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Course Units</h1>
                        <button className="p-2 bg-slate-800 rounded-full text-slate-400">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Promo Card */}
                    <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-[32px] p-8 mb-10 text-white relative overflow-hidden shadow-2xl shadow-rose-500/20">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4 w-2/3 leading-tight">Master Biology with AI</h2>
                            <p className="text-white/80 text-sm mb-6 w-3/4">Generate quizzes and interactive mind maps instantly.</p>
                            <button className="px-6 py-3 bg-white text-rose-600 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-100 transition-colors">
                                Let's Start
                            </button>
                        </div>
                        {/* Decorative Circle */}
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Section List (Chat style) */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-200">Modules</h3>
                        <button className="text-rose-500 text-sm font-semibold">See All</button>
                    </div>

                    <div className="pb-20">
                        {SECTIONS.map(section => (
                            <SectionCard 
                                key={section.id} 
                                section={section} 
                                onClick={() => handleSectionClick(section)} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        )}

        {view === AppView.SECTION_DETAIL && selectedSection && (
            <div className="flex-1 overflow-auto bg-slate-900">
                <div className="h-2/5 bg-slate-800 relative rounded-b-[40px] shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 opacity-50"></div>
                    
                    {/* Abstract Shapes */}
                    <div className="absolute top-10 right-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                             <button onClick={handleBackToDashboard} className="p-2 bg-slate-900/50 backdrop-blur rounded-full text-white">
                                 <LayoutGrid className="w-5 h-5" />
                             </button>
                         </div>
                         <div className="mb-8">
                             <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block">Module Selected</span>
                             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{selectedSection.title}</h2>
                         </div>
                    </div>
                </div>

                <div className="max-w-md mx-auto px-6 -mt-10 relative z-20 pb-10">
                    <p className="text-slate-400 text-sm mb-8 bg-slate-800/80 backdrop-blur p-4 rounded-2xl border border-slate-700 shadow-lg">
                        {selectedSection.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Option 1: MCQ */}
                        <div 
                            onClick={() => setView(AppView.MCQ)}
                            className="group bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-rose-500/50 cursor-pointer transition-all hover:bg-slate-800/80 relative overflow-hidden"
                        >
                            <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors"></div>
                            
                            <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center mb-4 text-rose-400 group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Quiz Mode</h3>
                            <p className="text-slate-500 text-sm">Test your knowledge with AI generated questions.</p>
                        </div>

                        {/* Option 2: Study */}
                        <div 
                            onClick={() => setView(AppView.STUDY)}
                            className="group bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-slate-800/80 relative overflow-hidden"
                        >
                            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                            
                            <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                                <BookOpenCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Visual Mind Map</h3>
                            <p className="text-slate-500 text-sm">Explore topics with an interactive diagram.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {view === AppView.MCQ && selectedSection && (
          <MCQView section={selectedSection} onBack={handleBackToSection} />
        )}

        {view === AppView.STUDY && selectedSection && (
          <StudyView section={selectedSection} onBack={handleBackToSection} />
        )}

      </main>
    </div>
  );
};

export default App;