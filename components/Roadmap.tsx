import React from 'react';
import { ArrowRight, Zap, Users, Shield, Rocket } from 'lucide-react';

export const Roadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-20 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden transition-colors duration-300">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-overlay filter blur-[128px] opacity-10 animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-[128px] opacity-10 animate-pulse-soft"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 border-b border-slate-700 pb-8" data-aos="fade-right">
           <div className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 font-bold rounded text-xs mb-3">Jangka Menengah (2-3 Tahun)</div>
           <h2 className="text-3xl font-bold text-white">Rekomendasi Strategis</h2>
           <p className="mt-2 text-slate-400 max-w-2xl">
             Langkah taktis untuk memperkuat posisi IPM sebagai "Role Model" organisasi pelajar di sekolah kejuruan.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strategy 1 */}
          <div 
            data-aos="fade-left" 
            data-aos-delay="100"
            className="flex gap-6 p-6 rounded-2xl bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center text-slate-900">
              <Zap size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Inovasi "IPM Vokasi 2.0"</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Jangan tiru sekolah umum. Buat program khas anak teknik, seperti <strong>"Bengkel Dakwah"</strong> (servis gratis + edukasi) atau <strong>"E-Sport Competition"</strong> yang dikelola profesional.
              </p>
            </div>
          </div>

          {/* Strategy 2 */}
          <div 
            data-aos="fade-left"
            data-aos-delay="200"
            className="flex gap-6 p-6 rounded-2xl bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
             <div className="flex-shrink-0 w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Resiliensi: Multi-tier Leadership</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Mengatasi ancaman <strong>Fragmentasi PKL</strong>. Siapkan kader pelapis (Kelas X) dengan tanggung jawab riil lebih awal, agar organisasi tetap jalan saat kakak kelas XI/XII magang.
              </p>
            </div>
          </div>

          {/* Strategy 3 */}
          <div 
            data-aos="fade-left"
            data-aos-delay="300"
            className="flex gap-6 p-6 rounded-2xl bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
             <div className="flex-shrink-0 w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white">
              <Shield size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Partnership Industri (K3LH)</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Jual nilai "Budaya Disiplin". Ajukan program <strong>"Duta Safety Sekolah"</strong> bekerjasama dengan Dept. HSE KPC/PAMA. Ini nilai tambah tinggi bagi sekolah.
              </p>
            </div>
          </div>

          {/* Strategy 4 */}
          <div 
            data-aos="fade-left"
            data-aos-delay="400"
            className="flex gap-6 p-6 rounded-2xl bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
             <div className="flex-shrink-0 w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center text-white">
              <Rocket size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Rebranding Naratif</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Ubah image medsos dari "Info Kegiatan" menjadi <strong>"Cerita Proses"</strong>. Tampilkan <i>Behind The Scene</i>, testimoni alumni, dan tips <i>survival</i> sekolah kejuruan.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center" data-aos="zoom-in-up" data-aos-offset="50">
            <a href="https://smkmuh1sangatta.sch.id" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-full cursor-pointer hover:bg-yellow-400 transition-all transform hover:scale-105">
                Kunjungi Website Sekolah
                <ArrowRight size={20} />
            </a>
        </div>
      </div>
    </section>
  );
};