import React from 'react';
import { TrendingUp } from 'lucide-react';
import { HomepageConfig, defaultHomepageConfig } from '../types/homepage';

type HeroProps = {
  content?: HomepageConfig;
};

export const Hero: React.FC<HeroProps> = ({ content = defaultHomepageConfig }) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${content.accentFrom}, ${content.accentTo})`
  };

  const stats = [
    {
      value: content.statPrimaryValue || defaultHomepageConfig.statPrimaryValue,
      label: content.statPrimaryLabel || defaultHomepageConfig.statPrimaryLabel,
      sub: content.statPrimarySub || defaultHomepageConfig.statPrimarySub
    },
    {
      value: content.statSecondaryValue || defaultHomepageConfig.statSecondaryValue,
      label: content.statSecondaryLabel || defaultHomepageConfig.statSecondaryLabel,
      sub: content.statSecondarySub || defaultHomepageConfig.statSecondarySub
    },
    {
      value: content.statTertiaryValue || defaultHomepageConfig.statTertiaryValue,
      label: content.statTertiaryLabel || defaultHomepageConfig.statTertiaryLabel,
      sub: content.statTertiarySub || defaultHomepageConfig.statTertiarySub
    }
  ];

  const primaryCtaLabel = content.ctaButtonLabel || defaultHomepageConfig.ctaButtonLabel;
  const primaryCtaLink = content.ctaButtonLink || defaultHomepageConfig.ctaButtonLink;

  return (
    <section id="home" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 transition-opacity duration-300">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundImage: `radial-gradient(ellipse at top right, ${content.accentFrom}, rgba(255,255,255,0))` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div 
              data-aos="fade-down" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700/50 shadow-sm"
            >
              {content.heroBadge}
            </div>
            
            <h1 
              data-aos="fade-right" 
              data-aos-delay="200"
              className="font-extrabold text-slate-900 dark:text-white leading-tight"
              style={{ fontSize: `${content.heroTitleSize || 48}px` }}
            >
              {content.heroTitle} <br/>
              <span
                className="text-transparent bg-clip-text"
                style={gradientStyle}
              >
                {content.heroHighlight}
              </span>
            </h1>
            
            <p 
              data-aos="fade-up" 
              data-aos-delay="400"
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
            >
              {content.heroSubtitle}
            </p>
            
            <div 
              data-aos="zoom-in" 
              data-aos-delay="600"
              className="flex flex-wrap gap-4"
            >
              <a href={primaryCtaLink} className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {primaryCtaLabel}
              </a>
              <a href="#roadmap" className="px-8 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Strategi 2025
              </a>
            </div>

            <div 
              data-aos="fade-up" 
              data-aos-delay="800"
              className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={stat.label + index} className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>

            <div className="relative" data-aos="fade-left" data-aos-duration="1000">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 animate-float">
              <img 
                src={content.heroImage || defaultHomepageConfig.heroImage} 
                alt="Kegiatan IPM SMK" 
                className="rounded-xl w-full h-auto object-cover transform transition hover:scale-105 duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full animate-pulse-soft">
                    <TrendingUp className="text-green-600 dark:text-green-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Pencapaian Signifikan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ranking 184 dari 2.738 Ranting se-Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse" style={gradientStyle}></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 animate-pulse delay-1000" style={gradientStyle}></div>
          </div>

        </div>
      </div>
    </section>
  );
};
