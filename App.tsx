import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Leadership } from './components/Leadership';
import { Programs } from './components/Programs';
import { Swot } from './components/Swot';
import { Roadmap } from './components/Roadmap';
import { Advocacy } from './components/Advocacy';
import { Footer } from './components/Footer';
import { HomeDynamicContent } from './components/HomeDynamicContent';
import { HomeShowcase } from './components/HomeShowcase';
import { defaultHomepageConfig, HomepageConfig } from './types/homepage';
import { EventItem } from './components/admin/types';
import { db } from './firebase';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';

// Declare AOS on window
declare global {
  interface Window {
    AOS: any;
  }
}

type NewsItem = {
  id: string;
  content: string;
  createdAt?: any;
};

type GalleryItem = {
  id: string;
  url: string;
};

function App() {
  const [homeConfig, setHomeConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    // Initialize AOS
    if (window.AOS) {
      window.AOS.init({
        duration: 800, // Durasi animasi dalam ms
        once: false, // Animasi akan berulang setiap kali elemen masuk viewport
        mirror: true, // Elemen akan animasi keluar saat scroll melewatinya
        easing: 'ease-out-cubic', // Tipe easing yang halus
        offset: 100, // Trigger animasi 100px sebelum elemen terlihat
        delay: 50,
      });
    }
  }, []);

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'site_settings', 'homepage'), (snap) => {
      if (snap.exists()) {
        setHomeConfig({ ...defaultHomepageConfig, ...(snap.data() as Partial<HomepageConfig>) });
      } else {
        setHomeConfig(defaultHomepageConfig);
      }
    });

    const unsubNews = onSnapshot(query(collection(db, 'cms_news'), orderBy('createdAt', 'desc'), limit(6)), (snap) => {
      setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem)));
    });

    const unsubGallery = onSnapshot(query(collection(db, 'cms_gallery'), limit(8)), (snap) => {
      setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem)));
    });

    const unsubEvents = onSnapshot(query(collection(db, 'events'), orderBy('date', 'desc'), limit(4)), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventItem)));
    });

    return () => {
      unsubConfig();
      unsubNews();
      unsubGallery();
      unsubEvents();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar />
      <main>
        <Hero content={homeConfig} />
        <HomeShowcase config={homeConfig} />
        <Leadership />
        <Programs />
        <HomeDynamicContent news={news} gallery={gallery} events={events} accentFrom={homeConfig.accentFrom} accentTo={homeConfig.accentTo} />
        <Swot />
        <Advocacy />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}

export default App;
