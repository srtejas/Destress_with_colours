/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DESIGNS, Design } from '../constants';
import { motion } from 'motion/react';

import { LayoutGrid } from 'lucide-react';

interface DesignSelectorProps {
  currentDesign: Design;
  onDesignChange: (design: Design) => void;
}

export default function DesignSelector({ currentDesign, onDesignChange }: DesignSelectorProps) {
  return (
    <div className="flex flex-col gap-6 mt-16 bg-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-xs font-black uppercase tracking-[0.5em] text-black border-b-2 border-black pb-2 inline-block self-start">Canvas Selection</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {DESIGNS.map((design) => (
          <motion.button
            key={design.id}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDesignChange(design)}
            className={`group relative overflow-hidden transition-all duration-300 border-4 ${
              currentDesign?.id === design.id 
                ? 'border-black bg-zinc-100' 
                : 'border-black/5 hover:border-black'
            }`}
          >
            <div className={`aspect-square flex items-center justify-center p-6 ${currentDesign?.id === design.id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'} transition-all`}>
              {design.svgPath ? (
                <svg 
                    viewBox={design.viewBox} 
                    className="w-full h-full text-black stroke-[3]"
                    dangerouslySetInnerHTML={{ __html: design.svgPath }}
                />
              ) : (
                <div className="w-full h-full border-4 border-dashed border-black/20 flex flex-col items-center justify-center gap-2">
                    <LayoutGrid size={24} className="opacity-20" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-black/40">Open Pad</span>
                </div>
              )}
            </div>
            <div className={`p-4 text-center border-t-4 border-black ${
              currentDesign?.id === design.id 
                ? 'bg-black text-white' 
                : 'bg-white text-black'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-tighter">{design.name}</span>
              <div className="text-[7px] font-black uppercase opacity-60 mt-1 tracking-widest">
                  {design.id === 'blank' ? 'From Scratch' : 'Ready Made'}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
