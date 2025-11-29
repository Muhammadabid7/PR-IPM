import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Logo IPM" className="h-10 w-auto" />
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">
                PR IPM <span className="text-yellow-600 dark:text-yellow-400">SMKM 1</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Jalan KH Ahmad Dahlan, Sangatta Utara<br/>
              Kutai Timur, Kalimantan Timur.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">
              Pelajar Muhammadiyah: Berilmu, Berakhlak, dan Terampil.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#home" className="hover:text-yellow-600 dark:hover:text-yellow-400">Beranda</a></li>
              <li><a href="#profile" className="hover:text-yellow-600 dark:hover:text-yellow-400">Profil Pimpinan</a></li>
              <li><a href="#programs" className="hover:text-yellow-600 dark:hover:text-yellow-400">Program Kerja</a></li>
              <li><a href="#events" className="hover:text-yellow-600 dark:hover:text-yellow-400">Event</a></li>
              <li><a href="#contact" className="hover:text-yellow-600 dark:hover:text-yellow-400">Kontak</a></li>
              <li><a href="https://smkmuh1sangatta.sch.id" target="_blank" rel="noreferrer" className="hover:text-yellow-600 dark:hover:text-yellow-400">Website Sekolah</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Hubungi Kami</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-yellow-500 hover:text-white dark:hover:text-slate-900 transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:text-slate-900 transition-all">
                <Facebook size={20} />
              </a>
               <a href="mailto:ipm@smkm1.example.com" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white dark:hover:text-slate-900 transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} PR IPM SMK Muhammadiyah 1 Sangatta Utara.</p>
          <p>Dibuat untuk Pimpinan Ranting.</p>
        </div>
      </div>
    </footer>
  );
};
