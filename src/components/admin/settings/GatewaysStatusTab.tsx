'use client';

import React from 'react';
import { Server, MessageSquare, Mail, Cloud, Cpu, CheckCircle2, Activity } from 'lucide-react';
import { GatewayServiceStatus } from '@/types/settings.types';

export function GatewaysStatusTab() {
  const services: GatewayServiceStatus[] = [
    {
      serviceName: 'SMS OTP Dispatch Gateway',
      provider: 'Infobip / BulkSMS BD (Direct DLR)',
      status: 'OPERATIONAL',
      latencyMs: 120,
      lastChecked: 'Just now',
      description: 'Dispatches 6-digit verification OTPs and examination schedule SMS alerts to candidates.',
    },
    {
      serviceName: 'Transactional Email Engine',
      provider: 'Resend API (support@shopnercoat.xyz)',
      status: 'OPERATIONAL',
      latencyMs: 85,
      lastChecked: 'Just now',
      description: 'Delivers registration confirmation and customized Bengali Admit Card PDF delivery emails.',
    },
    {
      serviceName: 'Cloudinary CDN Asset Storage',
      provider: 'Cloudinary Media API (eu-central-1)',
      status: 'OPERATIONAL',
      latencyMs: 45,
      lastChecked: 'Just now',
      description: 'Stores candidate passport photos, signatures, and notice attachments (Max 5MB, auto .webp).',
    },
    {
      serviceName: 'BullMQ Asynchronous Job Cluster',
      provider: 'Redis Queue Workers (3 Active Nodes)',
      status: 'OPERATIONAL',
      latencyMs: 15,
      lastChecked: 'Just now',
      description: 'Executes high-throughput batch Admit Card PDF generation and background notification queues.',
    },
  ];

  return (
    <div className="space-y-6 select-none animate-in fade-in-0 duration-200">
      
      {/* Overview Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-teal-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              All Core Infrastructure Gateways Operational
            </h3>
            <p className="text-[11px] text-slate-600">
              SMS, Transactional Email, CDN Uploads, and Asynchronous BullMQ background queues are active.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          <span>100% Health</span>
        </span>
      </div>

      {/* Grid of Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => {
          let Icon = Server;
          if (svc.serviceName.includes('SMS')) Icon = MessageSquare;
          else if (svc.serviceName.includes('Email')) Icon = Mail;
          else if (svc.serviceName.includes('Cloudinary')) Icon = Cloud;
          else if (svc.serviceName.includes('BullMQ')) Icon = Cpu;

          return (
            <div
              key={svc.serviceName}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900">{svc.serviceName}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold">
                    <CheckCircle2 className="size-3 text-teal-600" />
                    <span>OPERATIONAL</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  {svc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{svc.provider}</span>
                <span className="text-teal-600 font-bold">{svc.latencyMs}ms latency</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
