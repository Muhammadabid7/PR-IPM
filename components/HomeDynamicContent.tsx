import React, { useMemo } from 'react';
import { CalendarClock, Images, MapPin, Newspaper, Sparkles, TrendingUp, Users } from 'lucide-react';
import { EventItem } from './admin/types';

type NewsItem = {
  id: string;
  content: string;
  createdAt?: any;
};

type GalleryItem = {
  id: string;
  url: string;
};

type HomeDynamicContentProps = {
  news: NewsItem[];
  gallery: GalleryItem[];
  events: EventItem[];
  accentFrom: string;
  accentTo: string;
};

const formatDate = (value?: any) => {
  if (!value) return '-';
  if (value.toDate) return value.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  return value;
};

export const HomeDynamicContent: React.FC<HomeDynamicContentProps> = ({
  news,
  gallery,
  events,
  accentFrom,
  accentTo
}) => {
  const [newsQuery, setNewsQuery] = React.useState('');
  const [galleryLimit, setGalleryLimit] = React.useState(6);
  const [eventFilter, setEventFilter] = React.useState<'all' | 'upcoming'>('all');

  const gradientStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`
  }), [accentFrom, accentTo]);

  const filteredNews = React.useMemo(() => {
    if (!newsQuery.trim()) return news;
    return news.filter((n) => n.content.toLowerCase().includes(newsQuery.toLowerCase()));
  }, [news, newsQuery]);

  const filteredEvents = React.useMemo(() => {
    if (eventFilter === 'all') return events;
    const now = new Date();
    return events.filter((e) => {
      const ts = Date.parse(e.date);
      return Number.isFinite(ts) ? ts >= now.getTime() : true;
    });
  }, [events, eventFilter]);

  return (
    <section id="updates" className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg shadow-inner" style={gradientStyle}>
            <Sparkles className="text-white" size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Terkini</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Berita, Galeri, &amp; Event Terintegrasi</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Newspaper className="text-slate-700 dark:text-slate-200" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Berita / Artikel</p>
                <p className="font-semibold text-slate-900 dark:text-white">Sinkron dari Dashboard</p>
              </div>
            </div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              placeholder="Cari berita..."
              value={newsQuery}
              onChange={(e) => setNewsQuery(e.target.value)}
            />
            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
              {filteredNews.length === 0 && <p className="text-sm text-slate-500">Belum ada berita sesuai pencarian.</p>}
              {filteredNews.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-xs">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{formatDate(item.createdAt)}</p>
                  <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-slate-900 text-white shadow-sm">
                <Images size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Galeri</p>
                <p className="font-semibold text-slate-900 dark:text-white">Sinkron otomatis</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.length === 0 && <p className="text-sm text-slate-500 col-span-2">Belum ada foto diunggah.</p>}
              {gallery.slice(0, galleryLimit).map((item) => (
                <div key={item.id} className="relative group overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.url}
                      alt="Galeri IPM"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0" style={gradientStyle} aria-hidden />
                  </div>
                </div>
              ))}
            </div>
            {gallery.length > galleryLimit && (
              <button
                onClick={() => setGalleryLimit((v) => v + 6)}
                className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:underline"
              >
                Tampilkan lebih banyak
              </button>
            )}
          </div>

          {/* Events */}
          <div id="events" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <CalendarClock className="text-slate-700 dark:text-slate-200" size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Project / Event</p>
                <p className="font-semibold text-slate-900 dark:text-white">Tampil di halaman utama</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 text-xs">
              <button
                onClick={() => setEventFilter('all')}
                className={`px-3 py-1 rounded-full border ${eventFilter === 'all' ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setEventFilter('upcoming')}
                className={`px-3 py-1 rounded-full border ${eventFilter === 'upcoming' ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                Akan Datang
              </button>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
              {filteredEvents.length === 0 && <p className="text-sm text-slate-500">Belum ada event terjadwal.</p>}
              {filteredEvents.map((event) => {
                const progress = event.total > 0 ? Math.round((event.attendance / event.total) * 100) : 0;
                return (
                  <div key={event.id} className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{event.title}</p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                      <MapPin size={14} /> {event.location || 'TBA'}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Users size={14} /> {event.attendance}/{event.total} hadir
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
                        <TrendingUp size={14} /> {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: accentFrom, ...gradientStyle }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
