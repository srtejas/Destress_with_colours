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
  const [currentColor, setCurrentColor] = useState<string>(COLORS[0].hex);
  const [currentTool, setCurrentTool] = useState<'pen' | 'fill' | 'eraser' | 'rect' | 'circle' | 'triangle'>('fill');
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center max-w-5xl w-full"
        >
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none border-b-8 border-black pb-2">
              Destress<br/>With Colours
            </h1>
            <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mt-4 opacity-30">Mental Sanctuary / v.02</div>
          </div>
          
          <p className="text-lg md:text-2xl font-serif italic text-black/40 mb-16 max-w-2xl mx-auto">
            Choose a canvas. Reclaim your peace. Bold lines, pure vibrancy.
          </p>

          <DesignSelector 
            currentDesign={currentDesign as any} 
            onDesignChange={setCurrentDesign} 
          />
          
          <div className="mt-16 flex items-center justify-center gap-10">
              <div className="h-px bg-black/10 flex-1"></div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-20">Artistic Freedom Awaits</div>
              <div className="h-px bg-black/10 flex-1"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="app-root" className="flex flex-col h-screen bg-white font-sans overflow-hidden text-black selection:bg-black selection:text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-10 py-6 border-b-2 border-black bg-white z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => {
              if (window.confirm('Return to Gallery? Unsaved progress will be lost.')) {
                setCurrentDesign(null);
              }
            }}
            className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none">Destress</h1>
            <span className="text-[8px] md:text-[10px] uppercase tracking-widest font-black opacity-30">With Colours</span>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Active Studio</span>
            <span className="text-sm font-black uppercase tracking-tighter italic">{currentDesign.name}</span>
        </div>

        <button 
          onClick={handleDownload}
          className="bg-black text-white px-6 md:px-10 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest hover:invert transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
        >
          Export
        </button>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Tools */}
        <ToolSidebar 
          currentTool={currentTool}
          onToolChange={setCurrentTool}
        />

        {/* Center: Canvas Area */}
        <section className="flex-1 flex flex-col overflow-hidden bg-zinc-50 relative pb-32 md:pb-0">
          <div className="flex-1 p-4 md:p-12 overflow-y-auto flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
              <CanvasRenderer 
                design={currentDesign}
                color={currentColor}
                tool={currentTool}
                brushSize={brushSize}
                undoTrigger={undoTrigger}
                clearTrigger={clearTrigger}
                clearType={clearType}
              />
              
              <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 mb-20 md:mb-10">
                 <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-1">Creative Layer</h4>
                    <span className="text-lg font-black uppercase tracking-tighter italic">{currentDesign.name}</span>
                 </div>
                 <button 
                  onClick={() => setCurrentDesign(null)}
                  className="px-6 py-3 border-2 border-dashed border-black/20 text-[9px] font-black uppercase tracking-widest hover:border-black hover:text-black transition-all"
                 >
                   Change Design Path
                 </button>
              </div>
            </div>
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
          isFillTool={['fill', 'rect', 'circle', 'triangle'].includes(currentTool)}
        />
      </main>
    </div>
  );
}
