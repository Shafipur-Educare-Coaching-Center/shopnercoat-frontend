'use client';

import React from 'react';
import { Building2, Phone, Mail, MapPin, Globe, Sparkles } from 'lucide-react';
import { CenterProfileSettings } from '@/types/settings.types';

interface GeneralSettingsTabProps {
  profile: CenterProfileSettings;
  onChange: (field: keyof CenterProfileSettings, value: string) => void;
}

export function GeneralSettingsTab({ profile, onChange }: GeneralSettingsTabProps) {
  return (
    <div className="space-y-6 select-none animate-in fade-in-0 duration-200">
      
      {/* 1. Organization Identity Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              Coaching Institute Identity &amp; Branding
            </h3>
            <p className="text-[11px] text-slate-500">
              Displayed across admit card PDFs, student portal headers, and public leaderboards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Center Name */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Institute / Coaching Title *
            </label>
            <input
              type="text"
              value={profile.centerName}
              onChange={(e) => onChange('centerName', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Shafipur Educare Coaching Center"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Motto &amp; Subtitle
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => onChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Premier Medical & Dental Admission Examination Platform"
            />
          </div>

        </div>
      </div>

      {/* 2. Official Communication & Support Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="size-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Phone className="size-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-sm text-slate-900">
              Official Helpline &amp; Candidate Support
            </h3>
            <p className="text-[11px] text-slate-500">
              Printed on admit card footer instructions and public enquiry pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Helpline Phone */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
              <Phone className="size-3 text-slate-400" />
              <span>Helpline Mobile Number</span>
            </label>
            <input
              type="tel"
              value={profile.helplineMobile}
              onChange={(e) => onChange('helplineMobile', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="+880 1700-000000"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
              <Mail className="size-3 text-slate-400" />
              <span>Official Support Email</span>
            </label>
            <input
              type="email"
              value={profile.supportEmail}
              onChange={(e) => onChange('supportEmail', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="support@shopnercoat.xyz"
            />
          </div>

          {/* Campus Address */}
          <div className="md:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1">
              <MapPin className="size-3 text-slate-400" />
              <span>Physical Campus / Center Address</span>
            </label>
            <input
              type="text"
              value={profile.campusAddress}
              onChange={(e) => onChange('campusAddress', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Shafipur Bazar, Kaliakair, Gazipur, Dhaka, Bangladesh"
            />
          </div>

        </div>
      </div>

      {/* 3. System Timezone & Localization */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <Globe className="size-4" />
          </div>
          <div>
            <p className="font-bold text-xs text-slate-900">System Timezone</p>
            <p className="text-[11px] text-slate-500">
              Locked to Bangladesh Standard Time (UTC+6) for examination schedules &amp; deadlines.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs">
          <Sparkles className="size-3 text-teal-600" />
          {profile.timezone}
        </span>
      </div>

    </div>
  );
}
