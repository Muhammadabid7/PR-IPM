import React from 'react';
import { ArrowRight, BadgeCheck, Megaphone } from 'lucide-react';
import { HomepageConfig } from '../types/homepage';

export const HomeShowcase: React.FC<{ config: HomepageConfig }> = ({ config }) => {
  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{ backgroundImage: `radial-gradient(circle at 20% 20%, ${config.accentFrom}, transparent 35%), radial-gradient(circle at 80% 0%, ${config.accentTo}, transparent 35%)` }}
            />
            <div className="relative space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <BadgeCheck size={14} /> Call To Action
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{config.ctaTitle}</h3>
              <p className="text-slate-600 dark:text-slate-300">{config.ctaSubtitle}</p>
              <a
                href={config.ctaButtonLink || '#'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
              >
                {config.ctaButtonLabel || 'Lihat Detail'} <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Banner */}
          <div className="rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 bg-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-amber-200">
              <Megaphone size={16} /> Pengumuman
            </div>
            <h4 className="text-xl font-bold">{config.bannerTitle}</h4>
            <p className="text-sm text-slate-100/90">{config.bannerBody}</p>
            {config.bannerLinkUrl && (
              <a
                href={config.bannerLinkUrl}
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100"
              >
                {config.bannerLinkLabel || 'Selengkapnya'} <ArrowRight size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pencapaian</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{config.statPrimaryValue}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{config.statPrimaryLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{config.statPrimarySub}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{config.statSecondaryValue}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{config.statSecondaryLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{config.statSecondarySub}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{config.statTertiaryValue}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{config.statTertiaryLabel}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{config.statTertiarySub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
