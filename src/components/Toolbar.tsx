/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Undo2, Trash2, Download, ChevronDown } from 'lucide-react';
import { COLORS, AppColor } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ToolbarProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onUndo: () => void;
  onClearAll: () => void;
  onClearBlocks: () => void;
  onDownload: () => void;
  isFillTool: boolean;
}

export default function Toolbar({
  currentColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onUndo,
  onClearAll,
  onClearBlocks,
  onDownload,
  isFillTool,
}: ToolbarProps) {
  const [isEraseMenuOpen, setIsEraseMenuOpen] = useState(false);
  const activeColor = COLORS.find(c => c.hex === currentColor) || COLORS[0];

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-auto md:relative md:h-full md:w-80 border-t-2 md:border-t-0 md:border-l-2 border-black bg-white p-6 md:p-8 flex flex-col gap-8 overflow-y-auto z-40">
      {/* Color Palette */}
      <div>
        <h3 className="text-[10px] uppercase font-black tracking-tighter mb-4">Select Vibrancy</h3>
        <div className="grid grid-cols-6 md:grid-cols-4 gap-2 md:gap-3">
          {COLORS.map((color) => (
            <motion.button
              key={color.hex}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorChange(color.hex)}
              className={`aspect-square rounded-none transition-all relative border-2 ${
                currentColor === color.hex 
                  ? 'border-black scale-110 z-10' 
                  : 'border-transparent hover:border-black/20'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeColor.hex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-zinc-50 border-2 border-black"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">{activeColor.name}</p>
            <p className="text-[11px] font-medium leading-tight text-black/60 italic">{activeColor.meaning}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Brush Dynamics */}
      {!isFillTool && (
        <div>
          <h3 className="text-[10px] uppercase font-black tracking-tighter mb-4">Precision</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                <span>Weight</span>
                <span>{brushSize}pt</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                className="w-full h-1 bg-black rounded-none appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex bg-black p-1 gap-1">
          <button
              onClick={onUndo}
              className="flex-1 py-3 bg-white border border-black hover:bg-zinc-100 flex flex-col items-center justify-center gap-1 group"
          >
              <Undo2 size={16} className="group-active:scale-90 transition-transform" />
              <span className="text-[8px] font-black uppercase">Undo</span>
          </button>
          
          <div className="relative flex-1 flex">
            <button
                onClick={() => setIsEraseMenuOpen(!isEraseMenuOpen)}
                className="flex-1 py-3 bg-white border border-black hover:bg-red-50 flex flex-col items-center justify-center gap-1 group"
            >
                <Trash2 size={16} className="text-red-500 group-active:scale-90 transition-transform" />
                <span className="text-[8px] font-black uppercase text-red-500">Clear</span>
            </button>
            
            <AnimatePresence>
              {isEraseMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white overflow-hidden"
                >
                  <button 
                    onClick={() => { onClearBlocks(); setIsEraseMenuOpen(false); }}
                    className="w-full text-left p-3 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors border-b border-white/10"
                  >
                    Erase Fills Only
                  </button>
                  <button 
                    onClick={() => { onClearAll(); setIsEraseMenuOpen(false); }}
                    className="w-full text-left p-3 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Reset Everything
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
              onClick={onDownload}
              className="flex-1 py-3 bg-black text-white hover:bg-zinc-800 flex flex-col items-center justify-center gap-1 group"
          >
              <Download size={16} className="group-active:translate-y-1 transition-transform" />
              <span className="text-[8px] font-black uppercase">Save</span>
          </button>
      </div>
      
      <div className="hidden md:block mt-auto pt-4 border-t-2 border-black/5">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Minimalist Studio Mode</p>
      </div>
    </aside>
  );
}
