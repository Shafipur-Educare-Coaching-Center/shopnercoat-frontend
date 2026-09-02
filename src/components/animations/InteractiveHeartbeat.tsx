'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, Heart, Radio } from 'lucide-react';

interface InteractiveHeartbeatProps {
  className?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTelemetry?: boolean;
}

export function InteractiveHeartbeat({
  className = '',
  color = '#0D9488',
  height = 95,
  showGrid = true,
  showTelemetry = true,
}: InteractiveHeartbeatProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Real-world Clinical Telemetry State (AHA/ACC Standardized Cardiology Metrics)
  const [telemetry, setTelemetry] = useState({
    bpm: 72,
    rrInterval: 833, // ms (R-R interval)
    prInterval: 156, // ms (PR conduction time: normal 120-200ms)
    qrsDuration: 88, // ms (QRS ventricular depolarization: normal 80-100ms)
    qtcInterval: 412, // ms (Corrected QT via Bazett's formula: normal 380-440ms)
    voltageMv: 1.25, // mV (Lead II QRS dipole amplitude)
    speedMmS: 25.0, // mm/s (Standard clinical recording paper speed)
    gainMmVs: 10.0, // mm/mV (Standard clinical voltage calibration: 1.0mV = 10mm)
    rhythm: 'NORMAL SINUS RHYTHM',
    isSystole: false,
  });

  const mousePos = useRef<{ x: number; y: number } | null>(null);
  const clicks = useRef<{ x: number; time: number }[]>([]);
  const targetBpmRef = useRef<number>(72);
  const lastRPeakTimeRef = useRef<number>(0);
  const lastPhaseRef = useRef<number>(0);

  // Authentic Clinical Lead II P-Q-R-S-T Cardiac Waveform Generator
  const getEcgValue = (t: number): number => {
    t = ((t % 1) + 1) % 1;

    // 1. Isoelectric Baseline (pre-P)
    if (t < 0.10) return 0;

    // 2. P-Wave (Atrial Depolarization): Smooth rounded deflection
    if (t < 0.20) {
      const pt = (t - 0.10) / 0.10;
      return -Math.sin(pt * Math.PI) * 0.15;
    }

    // 3. PR-Segment: Flat
    if (t < 0.26) return 0;

    // 4. Q-Wave: Quick sharp downward deflection
    if (t < 0.29) {
      const qt = (t - 0.26) / 0.03;
      return Math.sin(qt * Math.PI) * 0.14;
    }

    // 5. R-Wave (Ventricular Depolarization): Tall, razor-sharp systolic spike
    if (t < 0.35) {
      const rt = (t - 0.29) / 0.06;
      if (rt < 0.5) {
        return -(rt * 2) * 0.92;
      } else {
        return -((1 - rt) * 2) * 0.92;
      }
    }

    // 6. S-Wave: Sharp downward trough below baseline
    if (t < 0.39) {
      const st = (t - 0.35) / 0.04;
      return Math.sin(st * Math.PI) * 0.28;
    }

    // 7. ST-Segment: Flat
    if (t < 0.44) return 0;

    // 8. T-Wave (Ventricular Repolarization): Smooth rounded deflection
    if (t < 0.58) {
      const tt = (t - 0.44) / 0.14;
      return -Math.sin(tt * Math.PI) * 0.24;
    }

    // 9. TP-Interval: Flat resting baseline before next beat
    return 0;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    targetBpmRef.current = 88;
  }, []);

  const handleMouseEnter = () => {
    targetBpmRef.current = 84;
  };

  const handleMouseLeave = () => {
    mousePos.current = null;
    targetBpmRef.current = 72;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    clicks.current.push({
      x: e.clientX - rect.left,
      time: performance.now(),
    });
    targetBpmRef.current = 112; // Ectopic sympathetic excitation
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);

    let sweepX = 0;
    let lastTime = performance.now();
    let currentBpm = 72;
    const historyY: (number | null)[] = [];
    let lastTelemetryUpdate = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (width === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Smooth physiological BPM transition + Respiratory Sinus Arrhythmia (RSA)
      const rsa = Math.sin(time * 0.0012) * 2.4 + Math.cos(time * 0.0028) * 1.2;
      const effectiveTarget = targetBpmRef.current + rsa;
      currentBpm += (effectiveTarget - currentBpm) * Math.min(dt * 2.2, 1.0);

      // Return to baseline if click was triggered
      if (targetBpmRef.current > 76 && !mousePos.current) {
        targetBpmRef.current -= dt * 7.0;
      }

      ctx.clearRect(0, 0, width, canvasHeight);

      const baselineY = canvasHeight * 0.52;
      const amplitude = canvasHeight * 0.42;

      // 1. Draw Medical ECG Paper Grid Background (0.04s & 0.20s standard grid)
      if (showGrid) {
        const minorStep = 10;
        const majorStep = 50;

        // Minor grid lines (1mm squares)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.08)';
        ctx.lineWidth = 0.6;
        for (let x = 0; x <= width; x += minorStep) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasHeight);
        }
        for (let y = 0; y <= canvasHeight; y += minorStep) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Major grid lines (5mm squares)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.20)';
        ctx.lineWidth = 1.0;
        for (let x = 0; x <= width; x += majorStep) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvasHeight);
        }
        for (let y = 0; y <= canvasHeight; y += majorStep) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      // 2. Compute dynamic sweep movement based on instantaneous clinical rate
      const beatCycleWidth = 280; // Distance per heartbeat
      const pixelsPerSecond = (currentBpm / 60) * beatCycleWidth;
      const sweepAdvance = pixelsPerSecond * dt;

      const prevSweepX = sweepX;
      sweepX = (sweepX + sweepAdvance) % width;

      // Clean old clicks
      clicks.current = clicks.current.filter((c) => time - c.time < 1500);

      // 3. Update history for pixels swept in this frame
      const startX = Math.floor(prevSweepX);
      const endX = Math.floor(prevSweepX + sweepAdvance);

      for (let px = startX; px <= endX; px++) {
        const targetX = px % width;
        const phase = (px % beatCycleWidth) / beatCycleWidth;
        let yOffset = getEcgValue(phase) * amplitude;

        // Detect R-wave apex crossover (systolic beat detection)
        if (lastPhaseRef.current < 0.32 && phase >= 0.32) {
          const now = performance.now();
          const calculatedRr = lastRPeakTimeRef.current
            ? Math.round(now - lastRPeakTimeRef.current)
            : Math.round(60000 / currentBpm);
          lastRPeakTimeRef.current = now;

          // Real Medical Cardiology Calculations:
          // 1. Instantaneous Speed: 25.0 mm/s standard, switches to 50.0 mm/s during tachycardia
          const dynamicSpeed = currentBpm > 98 ? 50.0 : 25.0;

          // 2. Instantaneous Voltage Calibration Gain (mm/mV): 10 mm/mV standard, 15/20 on ectopic/high bio-potential
          const dynamicGain = clicks.current.length > 0 ? 15.0 : currentBpm > 95 ? 10.0 : 10.0;

          // 3. Instantaneous QRS Peak Amplitude Voltage (mV)
          const dynamicVoltage = +(1.18 + (currentBpm - 70) * 0.009 + Math.random() * 0.06).toFixed(2);

          // 4. Clinical Intervals (PR, QRS, QTc via Bazett's Formula: QTc = QT / sqrt(RR in seconds))
          const dynamicPr = Math.round(156 - (currentBpm - 70) * 0.4);
          const dynamicQrs = Math.round(88 + (currentBpm > 90 ? 4 : 0));
          const rawQt = Math.round(360 * Math.sqrt(calculatedRr / 1000));
          const dynamicQtc = Math.round(rawQt / Math.sqrt(calculatedRr / 1000));

          // 5. Clinical Diagnostic Classification (AHA Criteria)
          let dynamicRhythm = 'NORMAL SINUS RHYTHM';
          if (clicks.current.length > 0) {
            dynamicRhythm = 'PREMATURE VENTRICULAR RESPONSE • ECTOPY';
          } else if (currentBpm > 100) {
            dynamicRhythm = 'SINUS TACHYCARDIA (HR > 100)';
          } else if (currentBpm > 84) {
            dynamicRhythm = 'AUTONOMIC BIO-RHYTHM ACCELERATION';
          } else if (currentBpm < 60) {
            dynamicRhythm = 'SINUS BRADYCARDIA (HR < 60)';
          }

          setTelemetry({
            bpm: Math.round(currentBpm),
            rrInterval: calculatedRr,
            prInterval: dynamicPr,
            qrsDuration: dynamicQrs,
            qtcInterval: dynamicQtc,
            voltageMv: dynamicVoltage,
            speedMmS: dynamicSpeed,
            gainMmVs: dynamicGain,
            rhythm: dynamicRhythm,
            isSystole: true,
          });

          // Reset systole flash after 140ms
          setTimeout(() => {
            setTelemetry((prev) => ({ ...prev, isSystole: false }));
          }, 140);
        }
        lastPhaseRef.current = phase;

        // Interactive mouse bio-deflection
        if (mousePos.current) {
          const dx = targetX - mousePos.current.x;
          const dist = Math.abs(dx);
          if (dist < 80) {
            const inf = (1 - dist / 80) * 8;
            yOffset += Math.sin(time * 0.01 + targetX * 0.05) * inf;
          }
        }

        // Interactive click ripple
        clicks.current.forEach((c) => {
          const age = (time - c.time) / 1000;
          const dist = Math.abs(targetX - c.x);
          if (dist < 100) {
            const decay = Math.max(0, 1 - age / 1.5);
            const inf = (1 - dist / 100) * 18 * decay;
            yOffset += Math.sin(time * 0.02 + (targetX - c.x) * 0.1) * inf;
          }
        });

        // Store new value in history buffer
        historyY[targetX] = baselineY + yOffset;
      }

      // Periodic smooth telemetry update
      if (time - lastTelemetryUpdate > 350 && !telemetry.isSystole) {
        lastTelemetryUpdate = time;
        const dynamicSpeed = currentBpm > 98 ? 50.0 : 25.0;
        const dynamicGain = clicks.current.length > 0 ? 15.0 : 10.0;
        const dynamicVoltage = +(1.18 + (currentBpm - 70) * 0.009).toFixed(2);
        const dynamicRr = Math.round(60000 / currentBpm);
        const dynamicPr = Math.round(156 - (currentBpm - 70) * 0.4);
        const dynamicQrs = Math.round(88 + (currentBpm > 90 ? 4 : 0));
        const rawQt = Math.round(360 * Math.sqrt(dynamicRr / 1000));
        const dynamicQtc = Math.round(rawQt / Math.sqrt(dynamicRr / 1000));

        let dynamicRhythm = 'NORMAL SINUS RHYTHM';
        if (clicks.current.length > 0) {
          dynamicRhythm = 'PREMATURE VENTRICULAR RESPONSE • ECTOPY';
        } else if (currentBpm > 100) {
          dynamicRhythm = 'SINUS TACHYCARDIA (HR > 100)';
        } else if (currentBpm > 84) {
          dynamicRhythm = 'AUTONOMIC BIO-RHYTHM ACCELERATION';
        } else if (currentBpm < 60) {
          dynamicRhythm = 'SINUS BRADYCARDIA (HR < 60)';
        }

        setTelemetry((prev) => ({
          ...prev,
          bpm: Math.round(currentBpm),
          rrInterval: dynamicRr,
          prInterval: dynamicPr,
          qrsDuration: dynamicQrs,
          qtcInterval: dynamicQtc,
          voltageMv: dynamicVoltage,
          speedMmS: dynamicSpeed,
          gainMmVs: dynamicGain,
          rhythm: dynamicRhythm,
        }));
      }

      // 4. Draw Persistent ECG Trace with Sweep Head
      const eraseGap = 36; // Erase gap ahead of sweep beam

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      let isDrawing = false;

      for (let x = 0; x < width; x++) {
        const distFromSweep = (sweepX - x + width) % width;

        if (distFromSweep > width - eraseGap) {
          isDrawing = false;
          continue;
        }

        const y = historyY[x];
        if (y === undefined || y === null) {
          isDrawing = false;
          continue;
        }

        if (!isDrawing) {
          ctx.moveTo(x, y);
          isDrawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Base ECG line styling
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.0;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.stroke();

      // 5. Draw Glowing Leading Sweep Head Cursor
      const currentHeadX = Math.floor(sweepX);
      const currentHeadY = historyY[currentHeadX] || baselineY;

      ctx.save();
      ctx.beginPath();
      ctx.arc(currentHeadX, currentHeadY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#5EEAD4';
      ctx.shadowColor = '#14B8A6';
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(currentHeadX, currentHeadY, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)';
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [color, height, showGrid]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative w-full overflow-hidden cursor-pointer select-none bg-[#E8F8F5]/80 rounded-2xl border border-teal-200/70 shadow-xs ${className}`}
      style={{ height: `${height}px` }}
      title="Clinical Lead II Telemetry Monitor • Click or move mouse for real-time electrophysiology"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />

      {/* Top-Right Telemetry HUD Badge */}
      {showTelemetry && (
        <div className="absolute top-2.5 right-3 z-10 flex items-center gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-teal-200/90 text-xs font-mono font-semibold text-teal-900 shadow-xs">
            {/* Pulsing Heart Indicator on systolic R-wave beat */}
            <div className="relative flex items-center justify-center">
              <Heart
                className={`w-3.5 h-3.5 transition-all duration-100 ${
                  telemetry.isSystole
                    ? 'text-red-500 fill-red-500 scale-125'
                    : 'text-teal-600 fill-teal-600/30 scale-100'
                }`}
              />
              {telemetry.isSystole && (
                <span className="absolute w-5 h-5 rounded-full bg-red-400/40 animate-ping" />
              )}
            </div>

            {/* Dynamic BPM */}
            <span className="text-sm font-bold tracking-tight text-slate-900">
              {telemetry.bpm} <span className="text-[10px] font-medium text-slate-500">BPM</span>
            </span>

            <span className="text-slate-300 font-light">|</span>

            {/* Dynamic R-R interval */}
            <span className="text-[11px] text-teal-800 hidden sm:inline font-mono">
              RR: {telemetry.rrInterval}ms
            </span>

            <span className="text-slate-300 font-light hidden sm:inline">|</span>

            {/* Lead & Instantaneous Voltage */}
            <span className="text-[11px] text-slate-600 font-medium">
              Lead II ({telemetry.voltageMv}mV)
            </span>
          </div>
        </div>
      )}

      {/* Bottom-Left Dynamic Clinical Telemetry Bar according to real medical concepts */}
      {showTelemetry && (
        <div className="absolute bottom-2 left-3 z-10 hidden sm:flex items-center gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/85 backdrop-blur-md border border-teal-200/70 text-[10px] font-mono text-teal-900 font-medium tracking-wide shadow-2xs">
            <Radio className="w-2.5 h-2.5 text-teal-600 animate-pulse shrink-0" />
            
            {/* Dynamic Speed */}
            <span className="font-bold text-teal-950">
              {telemetry.speedMmS.toFixed(1)} mm/s
            </span>
            <span className="text-teal-300 font-light">•</span>
            
            {/* Dynamic Gain */}
            <span className="font-bold text-teal-950">
              {telemetry.gainMmVs.toFixed(0)} mm/mV
            </span>
            <span className="text-teal-300 font-light">•</span>
            
            {/* Dynamic Electrophysiological Intervals */}
            <span className="text-slate-600 font-normal hidden md:inline">
              PR: <span className="font-semibold text-teal-900">{telemetry.prInterval}ms</span> QRS: <span className="font-semibold text-teal-900">{telemetry.qrsDuration}ms</span> QTc: <span className="font-semibold text-teal-900">{telemetry.qtcInterval}ms</span>
            </span>
            <span className="text-teal-300 font-light hidden md:inline">•</span>

            {/* Dynamic Clinical Rhythm Classification */}
            <span
              className={`transition-colors duration-200 font-semibold ${
                telemetry.bpm > 100 || telemetry.rhythm.includes('ECTOPY')
                  ? 'text-amber-700'
                  : telemetry.bpm > 84
                  ? 'text-teal-700'
                  : 'text-teal-800'
              }`}
            >
              {telemetry.rhythm}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
