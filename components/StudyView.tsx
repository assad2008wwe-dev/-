import React, { useState, useEffect } from 'react';
import { Section, MindMapNode } from '../types';
import { generateMindMap, generateDiagram } from '../services/geminiService';
import { Loader2, ArrowLeft, Image as ImageIcon, BookOpen, Share2, ZoomIn, ZoomOut, Maximize2, AlertTriangle } from 'lucide-react';
import MindMap from './MindMap';

interface Props {
  section: Section;
  onBack: () => void;
}

const StudyView: React.FC<Props> = ({ section, onBack }) => {
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadContent = async () => {
      try {
        setError(null);
        const data = await generateMindMap(section.content);
        if (mounted) {
          if (data.id === 'error') {
            setError(data.label); // Use fallback label as error
          }
          setMindMapData(data);
          setLoadingMap(false);
          generateMainImage();
        }
      } catch (e: any) {
        if (mounted) {
            setError(e.message || "Failed to load");
            setLoadingMap(false);
        }
      }
    };
    loadContent();
    return () => { mounted = false; };
  }, [section.id]);

  const generateMainImage = async () => {
    setLoadingImage(true);
    const topic = section.title.replace('&', 'and');
    const url = await generateDiagram(topic);
    setImageUrl(url);
    setLoadingImage(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
            <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
                <h2 className="text-xl font-bold text-white leading-none">{section.title}</h2>
                <span className="text-xs text-slate-500 font-medium">Interactive Mind Map</span>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Mind Map Area */}
        <div className="flex-1 overflow-auto p-8 relative bg-slate-900 custom-grid-bg">
            {/* Controls */}
            <div className="absolute top-8 right-8 flex flex-col gap-2 z-10">
                <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 shadow-lg border border-slate-700"><ZoomIn className="w-5 h-5"/></button>
                <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 shadow-lg border border-slate-700"><ZoomOut className="w-5 h-5"/></button>
            </div>

            {loadingMap ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="w-12 h-12 animate-spin text-rose-500 mb-4" />
                    <p className="text-slate-400">Structuring knowledge...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                   <AlertTriangle className="w-8 h-8 text-amber-500" />
                   <p>{error}</p>
                </div>
            ) : mindMapData ? (
                <div 
                    className="min-w-max min-h-max p-10 transition-transform duration-200 origin-top-left"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <div className="flex justify-center">
                        <MindMap node={mindMapData} />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">Failed to load map.</div>
            )}
        </div>

        {/* Sidebar / Info Panel (On right for desktop, bottom for mobile) */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/95 backdrop-blur-sm p-6 overflow-y-auto z-10 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Visual Context</h3>
            
            <div className="mb-8">
                <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg relative group">
                    <div className="aspect-square bg-slate-900 flex items-center justify-center relative">
                        {loadingImage ? (
                             <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-600 mb-2" />
                                <span className="text-xs text-slate-600">Drawing...</span>
                             </div>
                        ) : imageUrl ? (
                            <>
                                <img src={imageUrl} alt="Diagram" className="w-full h-full object-cover" />
                                <button className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <span className="text-slate-600 text-xs">No image</span>
                        )}
                    </div>
                </div>
                <button 
                  onClick={generateMainImage}
                  disabled={loadingImage}
                  className="mt-4 w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    Generate New Visual
                </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-bold">Study Tip</span>
                </div>
                <p className="text-sm text-indigo-200/80 leading-relaxed">
                    Use the interactive mind map to visualize relationships between concepts. Expand nodes to dive deeper into definitions.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StudyView;