/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Undo2, Trash2, Download } from 'lucide-react';
import { COLORS } from '../constants';
import { motion } from 'motion/react';

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
  return (
    <aside className="w-80 border-l border-black/5 bg-white p-8 flex flex-col gap-10 overflow-y-auto">
      {/* Color Palette */}
      <div>
        <h3 className="text-[10px] uppercase font-black tracking-widest mb-6 opacity-40">Color Palette</h3>
        <div className="grid grid-cols-4 gap-4">
          {COLORS.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorChange(color)}
              className={`aspect-square rounded-full transition-all relative ${
                currentColor === color 
                  ? 'ring-2 ring-black ring-offset-2' 
                  : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: color,
                border: color === '#FFFFFF' ? '1px solid rgba(0,0,0,0.1)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Brush Dynamics */}
      {!isFillTool && (
        <div>
          <h3 className="text-[10px] uppercase font-black tracking-widest mb-6 opacity-40">Brush Dynamics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold mb-3">
                <span>Size</span>
                <span>{brushSize}px</span>
              </div>
              <div className="relative h-px bg-black/10">
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={brushSize}
                  onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="absolute h-full bg-black top-0 left-0" 
                  style={{ width: `${((brushSize - 2) / 38) * 100}%` }}
                />
                <div 
                  className="absolute -top-1 w-2 h-2 bg-black rounded-full transition-all"
                  style={{ left: `${((brushSize - 2) / 38) * 100}%`, transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-40">Canvas Actions</h3>
        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={onUndo}
                className="py-3 px-4 border border-black/10 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-50 flex items-center justify-center gap-2"
            >
                <Undo2 size={14} /> Undo
            </button>
            <button
                onClick={onClearAll}
                className="py-3 px-4 border border-black/10 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
            >
                <Trash2 size={14} /> Erase All
            </button>
            <button
                onClick={onClearBlocks}
                className="col-span-2 py-3 px-4 border border-black/10 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-50 flex items-center justify-center gap-2"
            >
                <Trash2 size={14} /> Erase Only Blocks
            </button>
        </div>
      </div>

      {/* Stats / Footer of Sidebar */}
      <div className="mt-auto">
        <div className="p-5 border border-black/10 rounded-xl bg-[#F9F8F6]">
          <h4 className="text-[10px] uppercase font-black tracking-widest mb-3">Canvas Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-bold tracking-tighter">HD</p>
              <p className="text-[8px] uppercase opacity-50 font-black">Resolution</p>
            </div>
            <div>
              <p className="text-lg font-bold tracking-tighter">800px</p>
              <p className="text-[8px] uppercase opacity-50 font-black">Dimension</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onDownload}
          className="w-full mt-6 bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Download size={16} /> Export Design
        </button>
      </div>
    </aside>
  );
}
