/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pencil, PaintBucket, Eraser } from 'lucide-react';
import { motion } from 'motion/react';

interface ToolSidebarProps {
  currentTool: 'pen' | 'fill' | 'eraser';
  onToolChange: (tool: 'pen' | 'fill' | 'eraser') => void;
}

export default function ToolSidebar({ currentTool, onToolChange }: ToolSidebarProps) {
  const tools = [
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'fill', icon: PaintBucket, label: 'Fill' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  return (
    <aside className="w-24 border-r border-black/5 flex flex-col items-center py-8 gap-10 bg-white/50">
      <div className="flex flex-col gap-6">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToolChange(tool.id as any)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              currentTool === tool.id
                ? 'bg-black text-white shadow-lg'
                : 'bg-white border border-black/10 text-gray-400 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <tool.icon size={22} />
          </motion.button>
        ))}
      </div>
      
      <div className="mt-auto flex flex-col gap-3">
        <div className="w-3 h-3 rounded-full bg-[#FF4E00]"></div>
        <div className="w-3 h-3 rounded-full bg-[#F2C94C]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27AE60]"></div>
      </div>
    </aside>
  );
}
