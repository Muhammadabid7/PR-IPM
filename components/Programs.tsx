import React from 'react';
import { Users, Leaf, Calendar, Wrench } from 'lucide-react';
import { Program } from '../types';

const programs: Program[] = [
  {
    title: "Fortasi & Rekrutmen",
    description: "Gerbang awal kaderisasi (Forum Ta’aruf Siswa) yang menjadi momentum rekrutmen massal 100-200 siswa baru per tahun. Terintegrasi dengan pengenalan budaya sekolah.",
    icon: Users,
    category: 'Kaderisasi'
  },
  {
    title: "Laboratorium Manajemen",
    description: "Melalui 'Upgrading Pimpinan', IPM melatih soft-skill manajemen organisasi & profesionalitas yang menjadi bekal siswa SMK sebelum terjun ke dunia kerja/PKL.",
    icon: Wrench,
    category: 'Profesionalitas'
  },
  {
    title: "Duta K3LH & Lingkungan",
    description: "Merespons konteks sekolah di wilayah tambang (mitra KPC/PAMA). IPM berperan aktif dalam kampanye sekolah aman, disiplin, dan berwawasan lingkungan (Adiwiyata).",
    icon: Leaf,
    category: 'Lingkungan'
  },
  {
    title: "Event Organizer (Milad)",
    description: "Siswa terjun langsung mengelola event besar sekolah seperti Milad ke-25. Melatih skill protokoler, logistik, dan koordinasi dengan pejabat publik.",
    icon: Calendar,
    category: 'Profesionalitas'
  }
];

export const Programs: React.FC = () => {
  return (
    <section id="programs" className="py-20 bg-slate-50 dark:bg-slate-800/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Program Aplikatif</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl">
              Gerakan IPM di SMK Muhammadiyah 1 tidak sekadar teoritis, tapi melatih keterampilan nyata yang relevan dengan kebutuhan industri dan sekolah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((prog, index) => (
            <div 
              key={index} 
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col h-full hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center text-yellow-400 mb-5 shadow-lg shadow-slate-900/10 dark:shadow-slate-900/50 group-hover:scale-110 transition-transform">
                <prog.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{prog.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-grow">
                {prog.description}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded uppercase tracking-wide">
                  {prog.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};