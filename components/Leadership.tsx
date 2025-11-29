import React, { useEffect, useState, useMemo } from 'react';
import { User, Award, Briefcase, Star, ShieldCheck } from 'lucide-react';
import { Leader } from '../types';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const fallbackLeaders: Leader[] = [
  {
    name: "Syarmila",
    role: "Ketua Umum",
    period: "2024-2025",
    image: "image (2).png",
    note: "Nahkoda utama arah gerak organisasi. Fokus pada sinergi internal dan kemitraan strategis dengan pihak sekolah.",
    tmLevel: "TM 1",
    order: 1
  },
  {
    name: "Gifary Tanziel",
    role: "Sekretaris Umum",
    period: "2024-2025",
    image: "image.png",
    note: "Motor penggerak administrasi & database MyIPM. Membawa ranting ke peringkat 184 Nasional.",
    tmLevel: "TM 1",
    order: 2
  },
  {
    name: "Pramudya A. Syahputra",
    role: "Bendahara Umum",
    period: "2024-2025",
    image: "image (1).png",
    note: "Manajemen finansial transparan untuk mendukung program kerja praktis dan operasional ranting.",
    tmLevel: "TM 1",
    order: 3
  },
  {
    name: "Tribisono",
    role: "Ketua Perkaderan",
    period: "2024-2025",
    image: "image (3).png",
    note: "Penanggung jawab Fortasi dan PKD TM 1 sebagai gerbang kaderisasi formal siswa baru.",
    tmLevel: "TM 1",
    order: 4
  }
];

export const Leadership: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>(fallbackLeaders);

  useEffect(() => {
    const q = query(collection(db, 'HalamanUtama'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setLeaders(fallbackLeaders);
        return;
      }
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Leader[];
      setLeaders(docs);
    });
    return () => unsub();
  }, []);

  const sorted = useMemo(() => {
    return [...leaders].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [leaders]);

  return (
    <section id="profile" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold text-yellow-600 dark:text-yellow-500 tracking-wide uppercase">Struktur Kepemimpinan</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Regenerasi Terstandarisasi
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto">
            Seluruh pimpinan inti telah lulus <strong>PKD TM 1</strong> (Pelatihan Kader Dasar Taruna Melati 1), memastikan standar ideologi dan manajerial yang kokoh.
          </p>
        </div>

        {/* Current Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {sorted.map((leader, index) => (
            <div 
              key={index} 
              data-aos="flip-left"
              data-aos-delay={index * 150}
              className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
            >
              {/* Photo Container */}
              <div className="relative w-full aspect-[3/4] mb-5 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700 shadow-inner">
                {leader.image ? (
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback jika gambar tidak ditemukan
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={48} />
                   </div>
                )}
                
                {/* Badge Role */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4 pt-12">
                   <p className="text-yellow-400 font-bold text-sm tracking-wide uppercase flex items-center gap-1">
                      {leader.role === "Ketua Umum" ? <Star size={14} fill="currentColor" /> : <Briefcase size={14} />}
                      {leader.role}
                   </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-2 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  {leader.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {leader.period}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded border border-green-100 dark:border-green-800">
                        <ShieldCheck size={12} />
                        {leader.tmLevel || 'TM 1'}
                    </span>
                </div>

                <div className="h-px w-full bg-slate-200 dark:bg-slate-700 mb-3"></div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {leader.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legacy/Alumni Highlight - Vertical Connectivity */}
        <div 
          data-aos="zoom-in-up" 
          className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-slate-800 dark:border-slate-800"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-5 rounded-2xl text-slate-900 shadow-xl transform rotate-3 flex-shrink-0 animate-pulse-soft">
              <Award size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-3">Konektivitas Vertikal (Ranting ke Daerah)</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                Ranting ini terbukti mencetak kader yang "terpakai" di level lebih tinggi. 
                Contoh sukses: <strong className="text-white">Muhammad Shafly Putra Darmawan</strong> (Ketua Umum 2023-2024) yang kini menjabat strategis sebagai 
                <span className="text-yellow-400 font-bold"> Ketua Bidang Lingkungan Hidup di PD IPM Kutai Timur</span>.
                Ini bukti keberhasilan sistem kaderisasi berjenjang.
              </p>
            </div>
          </div>
          {/* Background Elements */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500 rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500 rounded-full filter blur-[80px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </section>
  );
};
