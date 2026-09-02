'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface InteractiveHeartbeatProps {
  className?: string;
  color?: string;
  height?: number;
}

export function InteractiveHeartbeat({
  className = '',
  color = '#0D9488',
  height = 80,
}: InteractiveHeartbeatProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bpm, setBpm] = useState(72);
  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const pulses = useRef<{ x: number; time: number }[]>([]);

  // Generate clean, authentic P-Q-R-S-T ECG cardiac cycle
  const getEcgValue = (t: number): number => {
    t = ((t % 1) + 1) % 1;
    if (t < 0.25) return 0; // Flat baseline
    if (t >= 0.25 && t < 0.32) {
      // P wave
      const pT = (t - 0.25) / 0.07;
      return -Math.sin(pT * Math.PI) * 0.12;
    }
    if (t >= 0.32 && t < 0.38) return 0; // PR segment
    if (t >= 0.38 && t < 0.40) {
      // Q wave
      const qT = (t - 0.38) / 0.02;
      return Math.sin(qT * Math.PI) * 0.16;
    }
    if (t >= 0.40 && t < 0.45) {
      // R wave (sharp systolic spike)
      const rT = (t - 0.40) / 0.05;
      if (rT < 0.5) return -(rT * 2) * 1.0;
      return -((1 - rT) * 2) * 1.0;
    }
    if (t >= 0.45 && t < 0.48) {
      // S wave
      const sT = (t - 0.45) / 0.03;
      return Math.sin(sT * Math.PI) * 0.28;
    }
    if (t >= 0.48 && t < 0.55) return 0; // ST segment
    if (t >= 0.55 && t < 0.68) {
      // T wave
      const tT = (t - 0.55) / 0.13;
      return -Math.sin(tT * Math.PI) * 0.20;
    }
    return 0; // Flat baseline
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseEnter = () => {
    setBpm(86);
  };

  const handleMouseLeave = () => {
    mousePos.current = null;
    setBpm(72);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pulses.current.push({
      x: e.clientX - rect.left,
      time: performance.now(),
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let canvasHeight = height;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      width = containerRef.current.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);

    let progress = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (width === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, canvasHeight);

      const baselineY = canvasHeight * 0.5;
      const amplitude = canvasHeight * 0.38;

      const cycleWidth = 480; 
      const speed = (bpm / 60) * (cycleWidth / 4);
      progress = (progress + speed * dt) % (width + cycleWidth * 2);

      pulses.current = pulses.current.filter(p => time - p.time < 1200);

      // Clean single continuous ECG trace
      ctx.beginPath();
      ctx.moveTo(0, baselineY);

      for (let x = 0; x <= width; x += 2) {
        const relativeX = (x - progress + 1000000) % cycleWidth;
        const phase = relativeX / cycleWidth;

        let yOffset = getEcgValue(phase) * amplitude;

        if (mousePos.current) {
          const dx = x - mousePos.current.x;
          const dist = Math.abs(dx);
          if (dist < 100) {
            const influence = (1 - dist / 100) * 6;
            yOffset += Math.sin((time * 0.008) + (x * 0.04)) * influence;
          }
        }

        pulses.current.forEach((p) => {
          const age = (time - p.time) / 1000;
          const pDist = Math.abs(x - p.x);
          if (pDist < 90) {
            const decay = Math.max(0, 1 - age / 1.2);
            const pInf = (1 - pDist / 90) * 16 * decay;
            yOffset += Math.sin((time * 0.015) + (x - p.x) * 0.08) * pInf;
          }
        });

        const y = baselineY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.75;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [bpm, color, height]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative w-full overflow-hidden cursor-pointer select-none bg-transparent ${className}`}
      style={{ height: `${height}px` }}
      title="Live Clinical ECG Monitor"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full bg-transparent pointer-events-none" />
    </div>
  );
}
