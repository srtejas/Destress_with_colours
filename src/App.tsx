/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { DESIGNS, COLORS, Design } from './constants';
import Toolbar from './components/Toolbar';
import ToolSidebar from './components/ToolSidebar';
import DesignSelector from './components/DesignSelector';
import CanvasRenderer from './components/CanvasRenderer';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Sparkles, LayoutGrid, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0]);
  const [currentTool, setCurrentTool] = useState<'pen' | 'fill' | 'eraser'>('fill');
  const [brushSize, setBrushSize] = useState<number>(10);
  
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [clearType, setClearType] = useState<'all' | 'blocks'>('all');

  const handleUndo = useCallback(() => {
    setUndoTrigger((prev) => prev + 1);
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Clear everything including your sketches and fills?')) {
      setClearType('all');
      setClearTrigger((prev) => prev + 1);
    }
  }, []);

  const handleClearBlocks = useCallback(() => {
    if (window.confirm('Clear all filled color blocks? Your pen sketches will remain.')) {
      setClearType('blocks');
      setClearTrigger((prev) => prev + 1);
    }
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `destress-${currentDesign?.id}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [currentDesign]);

  if (!currentDesign) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center p-8 overflow-y-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center max-w-4xl"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Palette className="text-black" size={40} />
            <h1 className="text-6xl font-black uppercase tracking-tighter italic">Destress with colours</h1>
          </div>
          <p className="text-gray-500 font-serif italic text-xl mb-12">
            A sanctuary of calm. Pick a canvas to begin your restorative journey.
          </p>

          <DesignSelector 
            currentDesign={currentDesign as any} 
            onDesignChange={setCurrentDesign} 
          />
          
          <div className="mt-12 text-[10px] uppercase font-bold tracking-widest opacity-30">
            CHOOSE TO DRAW FROM SCRATCH OR READY MADE DESIGNS
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="app-root" className="flex flex-col h-screen bg-[#F9F8F6] font-sans overflow-hidden text-[#1A1A1A]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-black/5 bg-white">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (window.confirm('Exit to home? unsaved work will be lost.')) {
                setCurrentDesign(null);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Destress with colours</h1>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Creative Sanctuary v.2</span>
          </div>
        </div>
        <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold opacity-60">
          <span className="flex items-center gap-1"><LayoutGrid size={12} /> {currentDesign.name}</span>
          <a href="#" className="hover:opacity-100">Tutorials</a>
          <a href="#" className="hover:opacity-100 border-b-2 border-black pb-1 text-black opacity-100">Sketchpad</a>
        </nav>
        <button 
          onClick={handleDownload}
          className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
        >
          Export Design
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Basic Tools */}
        <ToolSidebar 
          currentTool={currentTool}
          onToolChange={setCurrentTool}
        />

        {/* Center: Canvas Area */}
        <section className="flex-1 p-12 flex flex-col overflow-y-auto bg-[#F9F8F6]">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            <CanvasRenderer 
              design={currentDesign}
              color={currentColor}
              tool={currentTool}
              brushSize={brushSize}
              undoTrigger={undoTrigger}
              clearTrigger={clearTrigger}
              clearType={clearType}
            />
            
            <div className="mt-12 flex justify-between items-center bg-white/50 p-6 rounded-2xl border border-black/5">
               <div className="flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40">Current Template</h4>
                  <span className="text-sm font-bold">{currentDesign.name}</span>
               </div>
               <button 
                onClick={() => setCurrentDesign(null)}
                className="text-[10px] font-bold uppercase tracking-widest hover:underline"
               >
                 Change Design
               </button>
            </div>
            
            <footer className="mt-12 py-8 border-t border-black/5 text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 text-center">
              © 2026 DESTRESS WITH COLOURS / MINDFUL CREATION
            </footer>
          </div>
        </section>

        {/* Right Sidebar: Inspector */}
        <Toolbar 
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          onUndo={handleUndo}
          onClearAll={handleClearAll}
          onClearBlocks={handleClearBlocks}
          onDownload={handleDownload}
          isFillTool={currentTool === 'fill'}
        />
      </main>
    </div>
  );
}
