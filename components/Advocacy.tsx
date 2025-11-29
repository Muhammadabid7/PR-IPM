import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, MessageSquarePlus, CheckCircle, AlertCircle, VenetianMask } from 'lucide-react';

export const Advocacy: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    classInfo: '',
    category: 'Fasilitas Sekolah',
    message: '',
    isAnonymous: false
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isAnonymous: e.target.checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, "aspirations"), {
        name: formData.isAnonymous ? "Hamba Allah (Anonim)" : formData.name,
        classInfo: formData.isAnonymous ? "-" : formData.classInfo,
        category: formData.category,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
        status: 'pending', // pending, reviewed, resolved
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setFormData({
        name: '',
        classInfo: '',
        category: 'Fasilitas Sekolah',
        message: '',
        isAnonymous: false
      });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('error');
    }
  };

  return (
    <section id="advocacy" className="py-20 bg-yellow-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
       </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12" data-aos="fade-down">
          <span className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-xl mb-4">
            <MessageSquarePlus size={32} />
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">E-Advokasi Siswa</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Suarakan aspirasi, kritik, dan saranmu untuk kemajuan sekolah dan IPM. <br/>
            Identitasmu aman, kami mendengar.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 dark:border-slate-700" data-aos="fade-up">
          {status === 'success' ? (
            <div className="text-center py-10 animate-pulse-soft">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Aspirasi Terkirim!</h3>
              <p className="text-slate-500 dark:text-slate-400">Terima kasih telah peduli. Pesanmu akan segera kami tindak lanjuti.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
              >
                Kirim Lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formData.isAnonymous ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <VenetianMask size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Mode Anonim</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Identitasmu akan disembunyikan</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isAnonymous}
                    onChange={handleCheckboxChange}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300" style={{ opacity: formData.isAnonymous ? 0.5 : 1 }}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap {formData.isAnonymous && '(Diabaikan)'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    disabled={formData.isAnonymous}
                    required={!formData.isAnonymous}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all disabled:cursor-not-allowed"
                    placeholder="Contoh: Gifary Tanziel"
                  />
                </div>
                <div>
                  <label htmlFor="classInfo" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kelas & Jurusan {formData.isAnonymous && '(Diabaikan)'}
                  </label>
                  <input
                    type="text"
                    name="classInfo"
                    id="classInfo"
                    disabled={formData.isAnonymous}
                    required={!formData.isAnonymous}
                    value={formData.classInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all disabled:cursor-not-allowed"
                    placeholder="Contoh: XI TKR 2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Kategori Aspirasi
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                >
                  <option value="Fasilitas Sekolah">Fasilitas Sekolah</option>
                  <option value="Kegiatan Siswa">Kegiatan Siswa / IPM</option>
                  <option value="Akademik & Guru">Akademik & Pembelajaran</option>
                  <option value="Lingkungan & Kebersihan">Lingkungan & Kebersihan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Isi Pesan / Aspirasi
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tuliskan aspirasimu dengan bahasa yang sopan dan jelas..."
                ></textarea>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">
                  <AlertCircle size={18} />
                  Gagal mengirim pesan. Silakan coba lagi atau periksa koneksi internet.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-yellow-500/30 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Kirim Aspirasi
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};