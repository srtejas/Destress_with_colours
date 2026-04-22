/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pencil, PaintBucket, Eraser, Square, Circle, Triangle as TriangleIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ToolSidebarProps {
  currentTool: 'pen' | 'fill' | 'eraser' | 'rect' | 'circle' | 'triangle';
  onToolChange: (tool: 'pen' | 'fill' | 'eraser' | 'rect' | 'circle' | 'triangle') => void;
}

export default function ToolSidebar({ currentTool, onToolChange }: ToolSidebarProps) {
  const tools = [
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'fill', icon: PaintBucket, label: 'Fill' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const shapes = [
    { id: 'rect', icon: Square, label: 'Square' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: TriangleIcon, label: 'Triangle' },
  ];

  return (
    <aside className="w-20 md:w-24 border-r-2 border-black flex flex-col items-center py-8 gap-10 bg-white">
      <div className="flex flex-col gap-4">
         <span className="text-[8px] font-black uppercase text-center opacity-20 mb-2">Base</span>
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToolChange(tool.id as any)}
            className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all ${
              currentTool === tool.id
                ? 'bg-black text-white border-black'
                : 'bg-white border-transparent text-black/40 hover:text-black'
            }`}
          >
            <tool.icon size={20} />
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-10 border-t-2 border-black/10">
        <span className="text-[8px] font-black uppercase text-center opacity-20 mb-2">Shapes</span>
        {shapes.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToolChange(tool.id as any)}
            className={`w-12 h-12 rounded-none border-2 flex items-center justify-center transition-all ${
              currentTool === tool.id
                ? 'bg-black text-white border-black'
                : 'bg-white border-transparent text-black/40 hover:text-black'
            }`}
          >
            <tool.icon size={20} />
          </motion.button>
        ))}
      </div>
      
      <div className="mt-auto opacity-10 font-black italic text-xl -rotate-90 select-none">
        MODERN
      </div>
    </aside>
  );
}
