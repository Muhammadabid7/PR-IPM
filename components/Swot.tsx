import React from 'react';
import { SwotItem } from '../types';
import { Shield, AlertTriangle, Lightbulb, Target } from 'lucide-react';

const swotData: SwotItem[] = [
  {
    category: 'Strength',
    points: [
      "Administrasi Digital: Ranking 184 Nasional (MyIPM) dari 2.738 ranting.",
      "Konektivitas Vertikal: Alumni menjabat posisi strategis di PD IPM Kutim.",
      "Dukungan Sekolah: Integrasi program IPM dengan agenda sekolah (Milad/Fortasi).",
      "Kaderisasi Terstandar: Pimpinan inti tersertifikasi PKD TM 1."
    ],
    color: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/10 dark:text-blue-100 dark:border-blue-800",
    hoverStyling: "hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 hover:ring-blue-300 dark:hover:ring-blue-700"
  },
  {
    category: 'Weakness',
    points: [
      "Visibility Prestasi: Kurang terekspos dalam kompetisi level nasional/regional.",
      "Konten Medsos: Cenderung seremonial/formal, kurang 'engagement' siswa non-kader.",
      "Struktur Minimalis: Hanya 3-4 bidang inti yang terlihat aktif di database."
    ],
    color: "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/10 dark:text-red-100 dark:border-red-800",
    hoverStyling: "hover:bg-red-100 dark:hover:bg-red-900/30 hover:shadow-xl hover:shadow-red-200 dark:hover:shadow-red-900/20 hover:border-red-300 dark:hover:border-red-500 hover:ring-red-300 dark:hover:ring-red-700"
  },
  {
    category: 'Opportunity',
    points: [
      "Mitra Industri: Potensi menjadi 'Duta K3LH' kerjasama dengan KPC/PAMA.",
      "Kewirausahaan: Pengembangan produk siswa (Merchandise/Jasa Desain).",
      "E-Dakwah: Pemanfaatan platform digital untuk menjangkau Gen Z.",
      "Peer Support LKS: Menjadi motivator bagi siswa kompetisi LKS."
    ],
    color: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-100 dark:border-green-800",
    hoverStyling: "hover:bg-green-100 dark:hover:bg-green-900/30 hover:shadow-xl hover:shadow-green-200 dark:hover:shadow-green-900/20 hover:border-green-300 dark:hover:border-green-500 hover:ring-green-300 dark:hover:ring-green-700"
  },
  {
    category: 'Threat',
    points: [
      "Fragmentasi PKL: Rantai kepemimpinan putus saat kelas XI/XII magang.",
      "Risiko Enrollment: Penurunan jumlah siswa baru bisa menggerus basis massa.",
      "Kompetisi Ekskul: Harus bersaing dengan ekskul lain yang lebih 'populer'."
    ],
    color: "bg-orange-50 text-orange-900 border-orange-200 dark:bg-orange-900/10 dark:text-orange-100 dark:border-orange-800",
    hoverStyling: "hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:shadow-xl hover:shadow-orange-200 dark:hover:shadow-orange-900/20 hover:border-orange-300 dark:hover:border-orange-500 hover:ring-orange-300 dark:hover:ring-orange-700"
  }
];

export const Swot: React.FC = () => {
  return (
    <section id="swot" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Analisis Mendalam (SWOT)</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Arahkan kursor pada kartu untuk melihat detail analisis strategis organisasi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {swotData.map((item, index) => (
            <div 
              key={index} 
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className={`
                group relative rounded-2xl p-8 border-l-8 cursor-pointer
                transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02]
                hover:ring-2 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-slate-900
                ${item.color} ${item.hoverStyling}
              `}
            >
              {/* Header with Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className={`
                    p-3 rounded-xl shadow-sm border bg-white dark:bg-slate-800
                    transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6
                    ${item.color.split(' ')[2]} dark:border-transparent
                  `}
                >
                  {item.category === 'Strength' && <Shield className="w-8 h-8" />}
                  {item.category === 'Weakness' && <AlertTriangle className="w-8 h-8" />}
                  {item.category === 'Opportunity' && <Lightbulb className="w-8 h-8" />}
                  {item.category === 'Threat' && <Target className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider">{item.category}</h3>
                  <div className="h-1 w-0 group-hover:w-full transition-all duration-500 bg-current opacity-30 rounded-full mt-1"></div>
                </div>
              </div>

              {/* Points List */}
              <ul className="space-y-4 relative z-10">
                {item.points.map((point, idx) => (
                  <li key={idx} className="flex items-start group/item">
                    <span 
                      className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-current opacity-60 flex-shrink-0 transition-all duration-300 group-hover/item:scale-150 group-hover/item:opacity-100"
                    ></span>
                    <span className="font-medium opacity-90 leading-relaxed transition-opacity duration-300 group-hover:opacity-100">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Background decorative blob on hover */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-500 filter blur-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};