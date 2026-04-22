/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DESIGNS, Design } from '../constants';
import { motion } from 'motion/react';

interface DesignSelectorProps {
  currentDesign: Design;
  onDesignChange: (design: Design) => void;
}

export default function DesignSelector({ currentDesign, onDesignChange }: DesignSelectorProps) {
  return (
    <div className="flex flex-col gap-4 mt-12 bg-white/50 p-6 rounded-2xl border border-black/5">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40">Select Your Experience</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {DESIGNS.map((design) => (
          <motion.button
            key={design.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDesignChange(design)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
              currentDesign?.id === design.id 
                ? 'border-black shadow-xl bg-white' 
                : 'border-black/5 bg-white/50 hover:border-black/20'
            }`}
          >
            <div className="p-4 grayscale hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100 aspect-square flex items-center justify-center">
              {design.svgPath ? (
                <svg 
                    viewBox={design.viewBox} 
                    className="w-full h-full text-black"
                    dangerouslySetInnerHTML={{ __html: design.svgPath }}
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] font-bold uppercase text-gray-400">
                    Sketch Pad
                </div>
              )}
            </div>
            <div className={`p-3 text-center border-t border-black/5 ${
              currentDesign?.id === design.id 
                ? 'bg-black text-white' 
                : 'bg-zinc-50/50 text-gray-500'
            }`}>
              <span className="text-[9px] font-bold uppercase tracking-widest">{design.name}</span>
              {design.id === 'blank' && (
                  <div className="text-[7px] font-black uppercase opacity-60 mt-1">From Scratch</div>
              )}
              {design.id !== 'blank' && (
                  <div className="text-[7px] font-black uppercase opacity-60 mt-1">Ready Made</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
