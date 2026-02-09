import React, { useRef, useEffect, useState } from 'react';
import { GameState } from '../sim/types';

interface GameCanvasProps {
  simulation: {
    gameState: GameState;
  };
}

export default function GameCanvas({ simulation }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastRenderRef = useRef<number>(0);

  // Handle canvas resizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Use container dimensions
      const width = rect.width;
      const height = rect.height;
      
      setDimensions({ width, height });
    };

    updateSize();
    
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas internal resolution with clamped DPR for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const render = (timestamp: number) => {
      // Throttle rendering to ~30 FPS for mobile performance
      if (timestamp - lastRenderRef.current < 33) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }
      lastRenderRef.current = timestamp;

      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Calculate scale to fit store in viewport
      const storeWidth = 600;
      const storeHeight = 400;
      const scale = Math.min(
        (dimensions.width - 100) / storeWidth,
        (dimensions.height - 200) / storeHeight
      );

      const offsetX = (dimensions.width - storeWidth * scale) / 2;
      const offsetY = (dimensions.height - storeHeight * scale) / 2 + 50;

      // Draw grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      const gridSize = 50 * scale;
      for (let x = offsetX; x < offsetX + storeWidth * scale; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + storeHeight * scale);
        ctx.stroke();
      }
      for (let y = offsetY; y < offsetY + storeHeight * scale; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + storeWidth * scale, y);
        ctx.stroke();
      }

      // Draw store outline
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 3;
      ctx.strokeRect(offsetX, offsetY, storeWidth * scale, storeHeight * scale);

      // Draw entrance
      ctx.fillStyle = '#22c55e';
      const entranceWidth = 40 * scale;
      const entranceHeight = 20 * scale;
      ctx.fillRect(
        offsetX + (storeWidth * scale - entranceWidth) / 2,
        offsetY - entranceHeight,
        entranceWidth,
        entranceHeight
      );

      // Draw checkout area
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(
        offsetX + 50 * scale,
        offsetY + storeHeight * scale,
        500 * scale,
        30 * scale
      );

      // Draw customers
      simulation.gameState.customers.forEach(customer => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        const customerX = offsetX + (customer.x + 300) * scale;
        const customerY = offsetY + (customer.y + 200) * scale;
        const customerRadius = Math.max(4, 8 * scale);
        ctx.arc(customerX, customerY, customerRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw labels with responsive font size
      ctx.fillStyle = '#fff';
      const fontSize = Math.max(10, 14 * scale);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('ENTRANCE', dimensions.width / 2, offsetY - entranceHeight - 5);
      ctx.fillText('CHECKOUT', dimensions.width / 2, offsetY + storeHeight * scale + 30 * scale + fontSize + 5);
      ctx.fillText('STORE FLOOR', dimensions.width / 2, offsetY + (storeHeight * scale) / 2);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, simulation.gameState]);

  // Touch handling to prevent page scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('touchstart', preventScroll, { passive: false });
    canvas.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventScroll);
      canvas.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: '100%',
          maxHeight: '100%',
          touchAction: 'none',
        }}
        className="border border-border rounded-lg no-select"
      />
    </div>
  );
}
