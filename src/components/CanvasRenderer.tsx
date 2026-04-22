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
  tool: 'pen' | 'fill' | 'eraser' | 'rect' | 'circle' | 'triangle';
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
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
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
    
    if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = 800;
        overlayCanvasRef.current.height = 800;
    }

    // Fill with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!design.svgPath) {
      saveState();
      return;
    }

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
      
      if (templateRef.current) {
        templateRef.current.width = 800;
        templateRef.current.height = 800;
        const tCtx = templateRef.current.getContext('2d');
        tCtx?.drawImage(img, 0, 0, 800, 800);
      }
      
      URL.revokeObjectURL(url);
      saveState();
    };
    img.src = url;

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
  }, [clearTrigger, clearType, design]);

  // Handle Undo
  useEffect(() => {
    if (undoTrigger === 0) return;
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
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
    startPoint.current = coords;
    lastPoint.current = coords;
  };

  const clearOverlay = () => {
    const oCanvas = overlayCanvasRef.current;
    if (!oCanvas) return;
    const oCtx = oCanvas.getContext('2d');
    if (!oCtx) return;
    oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
  };

  const drawShape = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, current: { x: number; y: number }, shapeType: string, isPreview: boolean) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const width = current.x - start.x;
    const height = current.y - start.y;

    ctx.beginPath();
    if (shapeType === 'rect') {
      ctx.strokeRect(start.x, start.y, width, height);
    } else if (shapeType === 'circle') {
      const radius = Math.sqrt(width * width + height * height);
      ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shapeType === 'triangle') {
      ctx.moveTo(start.x + width / 2, start.y);
      ctx.lineTo(start.x, start.y + height);
      ctx.lineTo(start.x + width, start.y + height);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'fill') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const oCanvas = overlayCanvasRef.current;
    const oCtx = oCanvas?.getContext('2d');
    if (!ctx || !oCtx) return;

    const coords = getCoordinates(e);
    if (!coords || !lastPoint.current || !startPoint.current) return;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else {
      // Shapes
      clearOverlay();
      drawShape(oCtx, startPoint.current, coords, tool, true);
    }

    lastPoint.current = coords;
  };

  const stopDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isDrawing) {
      if (['rect', 'circle', 'triangle'].includes(tool) && startPoint.current && lastPoint.current) {
         const ctx = canvasRef.current?.getContext('2d');
         if (ctx) {
            drawShape(ctx, startPoint.current, lastPoint.current, tool, false);
         }
      }
      clearOverlay();
      setIsDrawing(false);
      lastPoint.current = null;
      startPoint.current = null;
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

      <div className="flex-1 bg-white border border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center canvas-dot-grid h-[600px] touch-none">
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
            onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
            onTouchMove={(e) => { e.preventDefault(); draw(e); }}
            onTouchEnd={(e) => { e.preventDefault(); stopDrawing(e); }}
            className="w-full h-full cursor-crosshair touch-none absolute inset-0 z-10"
          />
          <canvas
            ref={overlayCanvasRef}
            className="w-full h-full pointer-events-none absolute inset-0 z-20"
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
