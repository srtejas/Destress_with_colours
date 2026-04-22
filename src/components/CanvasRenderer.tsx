/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Design } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface CanvasRendererProps {
  design: Design;
  color: string;
  tool: 'pen' | 'fill' | 'eraser';
  brushSize: number;
  onSave?: (dataUrl: string) => void;
  undoTrigger: number;
  clearTrigger: number;
  clearType: 'all' | 'blocks';
}

export default function CanvasRenderer({
  design,
  color,
  tool,
  brushSize,
  onSave,
  undoTrigger,
  clearTrigger,
  clearType,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas when design changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;

    // Fill with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!design.svgPath) {
      saveState();
      return;
    }

    // Draw the design
    const img = new Image();
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${design.viewBox}" width="800" height="800">
        ${design.svgPath}
      </svg>
    `;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 800, 800);
      
      // Store template for "Erase only blocks"
      if (templateRef.current) {
        templateRef.current.width = 800;
        templateRef.current.height = 800;
        const tCtx = templateRef.current.getContext('2d');
        tCtx?.drawImage(img, 0, 0, 800, 800);
      }
      
      URL.revokeObjectURL(url);
      saveState(); // Initial state
    };
    img.src = url;

    // Reset history on design change
    historyRef.current = [];
  }, [design]);

  // Handle Clear
  useEffect(() => {
    if (clearTrigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (clearType === 'all') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (design.svgPath) {
        const img = new Image();
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${design.viewBox}" width="800" height="800">${design.svgPath}</svg>`;
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 800, 800);
          URL.revokeObjectURL(url);
          saveState();
        };
        img.src = url;
      } else {
        saveState();
      }
    } else if (clearType === 'blocks') {
      // "Erase only blocks" -> We interpret this as "Reset all colors to white part of template"
      // while keeping the lines. If there are no lines (blank canvas), it behaves like Clear All.
      if (!design.svgPath) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      const tCtx = templateRef.current?.getContext('2d');
      if (!tCtx) return;
      const templateData = tCtx.getImageData(0, 0, 800, 800).data;

      for (let i = 0; i < pixels.length; i += 4) {
        // If the original template pixel was white (or near white), reset current pixel to white
        // This keeps the original black lines.
        if (templateData[i] > 240 && templateData[i+1] > 240 && templateData[i+2] > 240) {
           pixels[i] = 255;
           pixels[i+1] = 255;
           pixels[i+2] = 255;
           pixels[i+3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      saveState();
    }
  }, [clearTrigger]);

  // Handle Undo
  useEffect(() => {
    if (undoTrigger === 0) return;
    if (historyRef.current.length > 1) {
      historyRef.current.pop(); // Remove current state
      const previousState = historyRef.current[historyRef.current.length - 1];
      const canvas = canvasRef.current;
      if (canvas && previousState) {
        const ctx = canvas.getContext('2d');
        ctx?.putImageData(previousState, 0, 0);
      }
    }
  }, [undoTrigger]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(currentState);
    
    // Limit history
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    if (tool === 'fill') {
      handleFill(Math.floor(coords.x), Math.floor(coords.y));
      return;
    }

    setIsDrawing(true);
    lastPoint.current = coords;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    if (!coords || !lastPoint.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPoint.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPoint.current = null;
      saveState();
    }
  };

  const handleFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const targetColor = getPixelColor(pixels, startX, startY, width);
    const fillColor = hexToRgb(color);

    if (colorsMatch(targetColor, fillColor)) return;

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const idx = y * width + x;
      if (visited[idx]) continue;

      const currentColor = getPixelColor(pixels, x, y, width);
      if (colorsMatch(currentColor, targetColor)) {
        setPixelColor(pixels, x, y, width, fillColor);
        visited[idx] = 1;
        
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    saveState();
  };

  const getPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
  };

  const setPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const i = (y * width + x) * 4;
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
    pixels[i + 3] = 255;
  };

  const colorsMatch = (c1: number[], c2: number[]) => {
    // Basic match with threshold
    return (
      Math.abs(c1[0] - c2[0]) < 10 &&
      Math.abs(c1[1] - c2[1]) < 10 &&
      Math.abs(c1[2] - c2[2]) < 10
    );
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xs uppercase font-bold tracking-widest opacity-40 mb-1">Active Template</h2>
          <p className="text-2xl font-light font-serif italic">{design.name}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-1 bg-black/10 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-black"></div>
            </div>
            <span className="text-[9px] uppercase font-bold mt-2 opacity-50">Zoom 65%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border border-black/5 shadow-2xl rounded-sm relative overflow-hidden flex items-center justify-center canvas-dot-grid h-[600px]">
        {/* Hidden template canvas for smart erasing */}
        <canvas ref={templateRef} className="hidden" />
        
        <div className="relative w-[500px] h-[500px] bg-white shadow-xl">
          <canvas
            id="drawing-canvas"
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
          <AnimatePresence>
            {isDrawing && (tool === 'pen' || tool === 'eraser') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute pointer-events-none rounded-full border-2 border-black/20"
                style={{
                  width: brushSize,
                  height: brushSize,
                  backgroundColor: tool === 'eraser' ? 'white' : color,
                  left: lastPoint.current?.x || 0,
                  top: lastPoint.current?.y || 0,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Artistic Overlays from theme */}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="px-2 py-1 bg-black text-white text-[8px] uppercase font-bold tracking-widest">Draft Mode</span>
          <span className="px-2 py-1 bg-white border border-black text-[8px] uppercase font-bold tracking-widest">Layer 1</span>
        </div>
      </div>
    </div>
  );
}
