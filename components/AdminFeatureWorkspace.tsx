import React, { useMemo, useState, useEffect } from 'react';
import {
  Edit3,
  ImagePlus,
  UserPlus,
  Filter,
  FileText,
  Download,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Inbox,
  CheckCircle,
  Clock,
  CalendarRange,
  Users,
  PlusCircle,
  Save,
  Trash2,
  X,
  Pencil,
  LayoutDashboard,
  Menu,
  Palette,
  ChevronRight
} from 'lucide-react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { jsPDF } from 'jspdf';
import { DashboardOverview } from './admin/DashboardOverview';
import { Member, Transaction, EventItem, Aspiration } from './admin/types';
import { HomepageConfig, defaultHomepageConfig } from '../types/homepage';
import { Leader } from '../types';

const rolePriority: Record<string, number> = {
  'Ketua Umum': 1,
  'Sekretaris Umum': 2,
  'Bendahara Umum': 3,
  'Ketua Perkaderan': 4
};

// Local types for CMS (not shared yet)
type Profile = {
  id: string;
  name: string;
  role: string;
  period: string;
};

type NewsItem = {
  id: string;
  content: string;
  createdAt?: any;
};

type GalleryItem = {
  id: string;
  url: string;
};

type MailArchive = {
  id: string;
  number: string;
  tujuan: string;
  perihal: string;
  date: string;
  createdAt?: any;
};

export const AdminFeatureWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'homepage' | 'cms' | 'database' | 'surat' | 'finance' | 'advokasi' | 'event'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- CMS State ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileForm, setProfileForm] = useState({ name: '', role: '', period: '' });

  const [newsDraft, setNewsDraft] = useState('');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryInput, setGalleryInput] = useState('');

  // --- Database State ---
  const [members, setMembers] = useState<Member[]>([]);
  const [memberForm, setMemberForm] = useState<Omit<Member, 'id'>>({
    name: '',
    nis: '',
    jurusan: '',
    phone: '',
    status: 'Pra-TM',
    skill: ''
  });
  const [skillFilter, setSkillFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Pra-TM' | 'TM1' | 'TM2'>('Semua');

  // --- Letter State ---
  const [letterForm, setLetterForm] = useState({
    number: '',
    lampiran: '-',
    tujuan: '',
    hariTanggal: '',
    waktu: '',
    tempat: '',
    acara: '',
    perihal: '',
    penandaTangan: '',
    jabatan: ''
  });

  // --- Mail Archive State ---
  const [mailArchives, setMailArchives] = useState<MailArchive[]>([]);

  // --- Finance State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txForm, setTxForm] = useState({ label: '', amount: 0, type: 'in' as 'in' | 'out' });

  // --- Aspiration & Event State ---
  const [aspirations, setAspirations] = useState<Aspiration[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventForm, setEventForm] = useState<Omit<EventItem, 'id' | 'attendance'>>({
    title: '',
    date: '',
    total: 0,
    description: '',
    location: ''
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [siteConfig, setSiteConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderForm, setLeaderForm] = useState<Leader>({
    name: '',
    role: '',
    period: '2024-2025',
    tmLevel: 'TM 1',
    note: '',
    image: '',
    order: 1
  });

  // --- Firebase Subscriptions ---
  useEffect(() => {
    const unsubProfiles = onSnapshot(collection(db, 'cms_profiles'), (snap) => {
      setProfiles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Profile)));
    });

    const qNews = query(collection(db, 'cms_news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snap) => {
      setNewsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem)));
    });

    const unsubGallery = onSnapshot(collection(db, 'cms_gallery'), (snap) => {
      setGalleryItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
    });

    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Member)));
    });

    const qTx = query(collection(db, 'finance_transactions'), orderBy('date', 'desc'));
    const unsubTx = onSnapshot(qTx, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    });

    const qAsp = query(collection(db, 'aspirations'), orderBy('createdAt', 'desc'));
    const unsubAsp = onSnapshot(qAsp, (snap) => {
      setAspirations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Aspiration)));
    });

    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as EventItem)));
    });

    const qMail = query(collection(db, 'mail_archives'), orderBy('createdAt', 'desc'));
    const unsubMail = onSnapshot(qMail, (snap) => {
      setMailArchives(snap.docs.map(d => ({ id: d.id, ...d.data() } as MailArchive)));
    });

    const unsubLeaders = onSnapshot(query(collection(db, 'HalamanUtama'), orderBy('order', 'asc')), (snap) => {
      setLeaders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Leader)));
    });

    const unsubHomepage = onSnapshot(doc(db, 'site_settings', 'homepage'), (snap) => {
      if (snap.exists()) {
        setSiteConfig({ ...defaultHomepageConfig, ...(snap.data() as Partial<HomepageConfig>) });
      } else {
        setSiteConfig(defaultHomepageConfig);
      }
    });

    return () => {
      unsubProfiles();
      unsubNews();
      unsubGallery();
      unsubMembers();
      unsubTx();
      unsubAsp();
      unsubEvents();
      unsubMail();
      unsubHomepage();
      unsubLeaders();
    };
  }, []);

  // --- Actions ---

  const addProfile = async () => {
    if (!profileForm.name || !profileForm.role || !profileForm.period) return;
    try {
      await addDoc(collection(db, 'cms_profiles'), profileForm);
      setProfileForm({ name: '', role: '', period: '' });
    } catch (e) {
      console.error("Error adding profile: ", e);
      alert("Gagal menyimpan profil");
    }
  };

  const deleteProfile = async (id: string) => {
    if (confirm('Hapus profil ini?')) {
      await deleteDoc(doc(db, 'cms_profiles', id));
    }
  };

  const publishNews = async () => {
    if (!newsDraft.trim()) return;
    try {
      await addDoc(collection(db, 'cms_news'), {
        content: newsDraft.trim(),
        createdAt: serverTimestamp()
      });
      setNewsDraft('');
    } catch (e) {
      console.error("Error publishing news: ", e);
    }
  };

  const addGalleryItem = async () => {
    if (!galleryInput.trim()) return;
    try {
      await addDoc(collection(db, 'cms_gallery'), { url: galleryInput.trim() });
      setGalleryInput('');
    } catch (e) {
      console.error("Error adding gallery item: ", e);
    }
  };

  const addMember = async () => {
    if (!memberForm.name || !memberForm.nis || !memberForm.jurusan) return;
    try {
      await addDoc(collection(db, 'members'), memberForm);
      setMemberForm({ name: '', nis: '', jurusan: '', phone: '', status: 'Pra-TM', skill: '' });
    } catch (e) {
      console.error("Error adding member: ", e);
    }
  };

  const addTransaction = async () => {
    if (!txForm.label || !txForm.amount) return;
    try {
      await addDoc(collection(db, 'finance_transactions'), {
        ...txForm,
        amount: Number(txForm.amount),
        date: serverTimestamp()
      });
      setTxForm({ label: '', amount: 0, type: 'in' });
    } catch (e) {
      console.error("Error adding transaction: ", e);
    }
  };

  const cycleStatus = (status: Aspiration['status']): Aspiration['status'] => {
    if (status === 'Diterima') return 'Sedang Diproses';
    if (status === 'Sedang Diproses') return 'Selesai';
    return 'Diterima';
  };

  const updateAspirationStatus = async (id: string, currentStatus: Aspiration['status']) => {
    try {
      await updateDoc(doc(db, 'aspirations', id), {
        status: cycleStatus(currentStatus)
      });
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  };

  const bumpAttendance = async (id: string, current: number, total: number) => {
    if (current >= total) return;
    try {
      await updateDoc(doc(db, 'events', id), {
        attendance: current + 1
      });
    } catch (e) {
      console.error("Error updating attendance: ", e);
    }
  };

  const saveLetterToArchive = async () => {
    if (!letterForm.number || !letterForm.tujuan) {
      alert("Nomor Surat dan Tujuan wajib diisi!");
      return;
    }
    try {
      await addDoc(collection(db, 'mail_archives'), {
        number: letterForm.number,
        tujuan: letterForm.tujuan,
        perihal: letterForm.perihal,
        date: letterForm.hariTanggal,
        createdAt: serverTimestamp()
      });
      alert("Surat berhasil diarsipkan!");
    } catch (e) {
      console.error("Error archiving letter: ", e);
      alert("Gagal mengarsipkan surat.");
    }
  };

  const deleteMailArchive = async (id: string) => {
    if (confirm('Hapus arsip surat ini?')) {
      await deleteDoc(doc(db, 'mail_archives', id));
    }
  };

  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.date) return;

    try {
      if (editingEventId) {
        await updateDoc(doc(db, 'events', editingEventId), {
          title: eventForm.title,
          date: eventForm.date,
          total: Number(eventForm.total),
          description: eventForm.description,
          location: eventForm.location
        });
        setEditingEventId(null);
      } else {
        await addDoc(collection(db, 'events'), {
          ...eventForm,
          attendance: 0,
          total: Number(eventForm.total)
        });
      }
      setEventForm({ title: '', date: '', total: 0, description: '', location: '' });
    } catch (e) {
      console.error("Error saving event: ", e);
    }
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Hapus event ini?')) {
      try {
        await deleteDoc(doc(db, 'events', id));
      } catch (e) {
        console.error("Error deleting event: ", e);
      }
    }
  };

  const startEditEvent = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      date: ev.date,
      total: ev.total,
      description: ev.description || '',
      location: ev.location || ''
    });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEventForm({ title: '', date: '', total: 0, description: '', location: '' });
  };

  const saveHomepage = async () => {
    try {
      await setDoc(doc(db, 'site_settings', 'homepage'), siteConfig, { merge: true });
      alert('Halaman utama diperbarui.');
    } catch (e) {
      console.error('Error saving homepage config', e);
      alert('Gagal menyimpan pengaturan homepage.');
    }
  };

  const startEditLeader = (leader: Leader) => {
    setEditingLeaderId(leader.id || null);
    setLeaderForm({
      name: leader.name,
      role: leader.role,
      period: leader.period,
      tmLevel: leader.tmLevel || 'TM 1',
      note: leader.note || '',
      image: leader.image || '',
      order: leader.order || rolePriority[leader.role] || 1
    });
  };

  const saveLeader = async () => {
    if (!editingLeaderId) return;
    try {
      const ordered = rolePriority[leaderForm.role] ?? 1;
      await updateDoc(doc(db, 'HalamanUtama', editingLeaderId), {
        name: leaderForm.name,
        role: leaderForm.role,
        period: leaderForm.period,
        tmLevel: leaderForm.tmLevel,
        note: leaderForm.note,
        image: leaderForm.image,
        order: ordered
      });
      alert('Struktur kepemimpinan diperbarui.');
      setEditingLeaderId(null);
      setLeaderForm({ name: '', role: '', period: '2024-2025', tmLevel: 'TM 1', note: '', image: '', order: 1 });
    } catch (e) {
      console.error('Error updating leader', e);
      alert('Gagal memperbarui data kepemimpinan.');
    }
  };

  const cancelEditLeader = () => {
    setEditingLeaderId(null);
    setLeaderForm({ name: '', role: '', period: '2024-2025', tmLevel: 'TM 1', note: '', image: '', order: 1 });
  };

  // --- Derived State ---

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSkill = skillFilter === 'Semua' ? true : m.skill.toLowerCase().includes(skillFilter.toLowerCase());
      const matchStatus = statusFilter === 'Semua' ? true : m.status === statusFilter;
      return matchSkill && matchStatus;
    });
  }, [members, skillFilter, statusFilter]);

  const totals = useMemo(() => {
    const masuk = transactions.filter((t) => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const keluar = transactions.filter((t) => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    return { masuk, keluar, saldo: masuk - keluar };
  }, [transactions]);

  const letterPreview = useMemo(() => {
    return `Nomor : ${letterForm.number || '.................................'}
Perihal : ${letterForm.perihal || 'Undangan'}
Lampiran : ${letterForm.lampiran}

Kepada Yth.
Bapak/Ibu/Saudara(i) ${letterForm.tujuan || '...................'}
Di Tempat

Dengan hormat,

Sehubungan dengan akan dilaksanakannya kegiatan IPM, kami bermaksud mengundang Bapak/Ibu/Saudara(i) untuk hadir pada kegiatan tersebut yang akan dilaksanakan pada:

Hari/Tanggal : ${letterForm.hariTanggal || '.........................'}
Waktu : ${letterForm.waktu || '.........................'}
Tempat : ${letterForm.tempat || '.........................'}
Acara : ${letterForm.acara || '.........................'}

Demikian undangan ini kami sampaikan. Besar harapan kami agar Bapak/Ibu/Saudara(i) dapat hadir tepat waktu demi kelancaran kegiatan tersebut.
Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

Hormat kami,
PR IPM SMKM 1 Sangatta Utara

(${letterForm.penandaTangan || '.........................................'})
Jabatan: ${letterForm.jabatan || '.........................'}`;
  }, [letterForm]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PIMPINAN RANTING", 105, 20, { align: "center" });
    doc.text("IKATAN PELAJAR MUHAMMADIYAH", 105, 28, { align: "center" });
    doc.text("SMK MUHAMMADIYAH 1 SANGATTA UTARA", 105, 36, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 55;
    const lineHeight = 7;

    doc.text(`Nomor : ${letterForm.number}`, 20, y); y += lineHeight;
    doc.text(`Perihal : ${letterForm.perihal}`, 20, y); y += lineHeight;
    doc.text(`Lampiran : ${letterForm.lampiran}`, 20, y); y += lineHeight * 2;

    doc.text(`Kepada Yth.`, 20, y); y += lineHeight;
    doc.text(`Bapak/Ibu/Saudara(i) ${letterForm.tujuan}`, 20, y); y += lineHeight;
    doc.text(`Di Tempat`, 20, y); y += lineHeight * 2;

    doc.text(`Dengan hormat,`, 20, y); y += lineHeight * 2;

    const intro = `Sehubungan dengan akan dilaksanakannya kegiatan IPM, kami bermaksud mengundang Bapak/Ibu/Saudara(i) untuk hadir pada kegiatan tersebut yang akan dilaksanakan pada:`;
    const splitIntro = doc.splitTextToSize(intro, 170);
    doc.text(splitIntro, 20, y);
    y += splitIntro.length * lineHeight + 5;

    doc.text(`Hari/Tanggal : ${letterForm.hariTanggal}`, 25, y); y += lineHeight;
    doc.text(`Waktu : ${letterForm.waktu}`, 25, y); y += lineHeight;
    doc.text(`Tempat : ${letterForm.tempat}`, 25, y); y += lineHeight;
    doc.text(`Acara : ${letterForm.acara}`, 25, y); y += lineHeight * 2;

    const closing = `Demikian undangan ini kami sampaikan. Besar harapan kami agar Bapak/Ibu/Saudara(i) dapat hadir tepat waktu demi kelancaran kegiatan tersebut.\nAtas perhatian dan kehadirannya, kami ucapkan terima kasih.`;
    const splitClosing = doc.splitTextToSize(closing, 170);
    doc.text(splitClosing, 20, y);
    y += splitClosing.length * lineHeight + 15;

    doc.text(`Hormat kami,`, 140, y, { align: 'center' }); y += lineHeight;
    doc.text(`PR IPM SMKM 1 Sangatta Utara`, 140, y, { align: 'center' }); y += 25;

    doc.text(`(${letterForm.penandaTangan})`, 140, y, { align: 'center' }); y += lineHeight;
    doc.text(`Jabatan: ${letterForm.jabatan}`, 140, y, { align: 'center' });

    doc.save(`Surat-${letterForm.number || 'IPM'}.pdf`);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === id
        ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] gap-6">
      {/* Sidebar */}
      <aside className={`lg:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sticky top-6">
          <div className="space-y-2">
            <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
            <NavItem id="homepage" label="Tampilan Utama" icon={Palette} />
            <NavItem id="cms" label="CMS Konten" icon={Edit3} />
            <NavItem id="database" label="Database Kader" icon={Users} />
            <NavItem id="surat" label="E-Surat" icon={FileText} />
            <NavItem id="finance" label="E-Finance" icon={PiggyBank} />
            <NavItem id="advokasi" label="E-Advokasi" icon={Inbox} />
            <NavItem id="event" label="Manajemen Event" icon={CalendarRange} />
          </div>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <Menu size={20} />
          <span className="font-semibold">Menu Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {activeTab === 'overview' && (
          <DashboardOverview
            members={members}
            transactions={transactions}
            events={events}
            aspirations={aspirations}
          />
        )}

        {activeTab === 'homepage' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={18} className="text-slate-700 dark:text-slate-200" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tampilan Halaman Utama</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Edit hero, CTA, banner, dan statistik yang tampil di homepage.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Badge (mis: Periode 2024-2025)"
                  value={siteConfig.heroBadge}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroBadge: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Judul Utama"
                  value={siteConfig.heroTitle}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Highlight Judul"
                  value={siteConfig.heroHighlight}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroHighlight: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="URL Foto Hero"
                  value={siteConfig.heroImage}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroImage: e.target.value })}
                />
                <textarea
                  className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  rows={3}
                  placeholder="Deskripsi hero"
                  value={siteConfig.heroSubtitle}
                  onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                />
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-600 dark:text-slate-300 w-24">Warna Awal</label>
                  <input
                    type="color"
                    className="h-10 w-16 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    value={siteConfig.accentFrom}
                    onChange={(e) => setSiteConfig({ ...siteConfig, accentFrom: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-600 dark:text-slate-300 w-24">Warna Akhir</label>
                  <input
                    type="color"
                    className="h-10 w-16 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800"
                    value={siteConfig.accentTo}
                    onChange={(e) => setSiteConfig({ ...siteConfig, accentTo: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <label className="text-sm text-slate-600 dark:text-slate-300 w-32">Ukuran Judul</label>
                  <input
                    type="range"
                    min={36}
                    max={72}
                    step={1}
                    value={siteConfig.heroTitleSize}
                    onChange={(e) => setSiteConfig({ ...siteConfig, heroTitleSize: Number(e.target.value) })}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 w-12 text-right">{siteConfig.heroTitleSize}px</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Pratinjau Hero</p>
                  <div
                    className="rounded-xl p-5 shadow-sm"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${siteConfig.accentFrom}, ${siteConfig.accentTo})`,
                      color: '#0f172a'
                    }}
                  >
                    <span className="inline-flex px-3 py-1 rounded-full bg-white/90 text-xs font-bold uppercase tracking-wide mb-2">{siteConfig.heroBadge}</span>
                    <h4 className="text-2xl font-extrabold leading-tight mb-2" style={{ fontSize: `${siteConfig.heroTitleSize * 0.6}px` }}>
                      {siteConfig.heroTitle} <br />
                      <span className="text-transparent bg-clip-text bg-white/80">{siteConfig.heroHighlight}</span>
                    </h4>
                    <p className="text-sm text-slate-800/80">{siteConfig.heroSubtitle}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Foto Hero</p>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {siteConfig.heroImage ? (
                      <img src={siteConfig.heroImage} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-slate-500">Masukkan URL foto</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Call To Action</p>
                    <span className="text-[11px] text-slate-400">Preview</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-4 text-sm shadow-inner">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-200 mb-2">CTA</p>
                    <p className="text-lg font-bold">{siteConfig.ctaTitle || 'Judul CTA'}</p>
                    <p className="text-slate-200/80 mb-3">{siteConfig.ctaSubtitle || 'Subjudul CTA'}</p>
                    <span className="inline-flex px-4 py-2 rounded-lg bg-white text-slate-900 text-xs font-semibold shadow-sm">
                      {siteConfig.ctaButtonLabel || 'Button'}
                    </span>
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Judul CTA"
                    value={siteConfig.ctaTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, ctaTitle: e.target.value })}
                  />
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                    rows={2}
                    placeholder="Subjudul CTA"
                    value={siteConfig.ctaSubtitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, ctaSubtitle: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      placeholder="Label Tombol"
                      value={siteConfig.ctaButtonLabel}
                      onChange={(e) => setSiteConfig({ ...siteConfig, ctaButtonLabel: e.target.value })}
                    />
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      placeholder="Link Tombol (anchor/URL)"
                      value={siteConfig.ctaButtonLink}
                      onChange={(e) => setSiteConfig({ ...siteConfig, ctaButtonLink: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Banner Info</p>
                    <span className="text-[11px] text-slate-400">Preview</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-500/90 via-amber-600 to-amber-700 text-white p-4 text-sm shadow-inner">
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-100 mb-2">Banner</p>
                    <p className="text-lg font-bold">{siteConfig.bannerTitle || 'Judul Banner'}</p>
                    <p className="text-amber-50/90 mb-2">{siteConfig.bannerBody || 'Isi banner'}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-50">
                      {siteConfig.bannerLinkLabel || 'Link'}
                    </span>
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                    placeholder="Judul Banner"
                    value={siteConfig.bannerTitle}
                    onChange={(e) => setSiteConfig({ ...siteConfig, bannerTitle: e.target.value })}
                  />
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                    rows={2}
                    placeholder="Isi Banner"
                    value={siteConfig.bannerBody}
                    onChange={(e) => setSiteConfig({ ...siteConfig, bannerBody: e.target.value })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      placeholder="Label Link"
                      value={siteConfig.bannerLinkLabel}
                      onChange={(e) => setSiteConfig({ ...siteConfig, bannerLinkLabel: e.target.value })}
                    />
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                      placeholder="URL/Anchor Link"
                      value={siteConfig.bannerLinkUrl}
                      onChange={(e) => setSiteConfig({ ...siteConfig, bannerLinkUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Statistik</p>
                    <span className="text-[11px] text-slate-400">Preview</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 text-sm mb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{siteConfig.statPrimaryValue}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{siteConfig.statPrimaryLabel}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{siteConfig.statPrimarySub}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{siteConfig.statSecondaryValue}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{siteConfig.statSecondaryLabel}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{siteConfig.statSecondarySub}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{siteConfig.statTertiaryValue}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{siteConfig.statTertiaryLabel}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{siteConfig.statTertiarySub}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                          placeholder={`Label ${i}`}
                          value={siteConfig[`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Label` as keyof HomepageConfig] as string}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            [`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Label`]: e.target.value
                          } as HomepageConfig)}
                        />
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                          placeholder={`Nilai ${i}`}
                          value={siteConfig[`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Value` as keyof HomepageConfig] as string}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            [`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Value`]: e.target.value
                          } as HomepageConfig)}
                        />
                        <input
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
                          placeholder={`Sub ${i}`}
                          value={siteConfig[`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Sub` as keyof HomepageConfig] as string}
                          onChange={(e) => setSiteConfig({
                            ...siteConfig,
                            [`stat${i === 1 ? 'Primary' : i === 2 ? 'Secondary' : 'Tertiary'}Sub`]: e.target.value
                          } as HomepageConfig)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">Perubahan tersimpan di koleksi <span className="font-semibold">site_settings/homepage</span>.</p>
                <button
                  onClick={saveHomepage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  <Save size={16} />
                  Simpan
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Struktur Kepemimpinan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Edit data yang sudah ada di koleksi HalamanUtama.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Nama"
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                />
                <select
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  value={leaderForm.role}
                  onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="Ketua Umum">Ketua Umum</option>
                  <option value="Sekretaris Umum">Sekretaris Umum</option>
                  <option value="Bendahara Umum">Bendahara Umum</option>
                  <option value="Ketua Perkaderan">Ketua Perkaderan</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Periode"
                  value={leaderForm.period}
                  onChange={(e) => setLeaderForm({ ...leaderForm, period: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Level TM (mis: TM 1)"
                  value={leaderForm.tmLevel || ''}
                  onChange={(e) => setLeaderForm({ ...leaderForm, tmLevel: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="URL Foto"
                  value={leaderForm.image || ''}
                  onChange={(e) => setLeaderForm({ ...leaderForm, image: e.target.value })}
                />
                <textarea
                  className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  rows={3}
                  placeholder="Deskripsi"
                  value={leaderForm.note}
                  onChange={(e) => setLeaderForm({ ...leaderForm, note: e.target.value })}
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-sm mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Preview</p>
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex-shrink-0 shadow-inner">
                    {leaderForm.image ? (
                      <img src={leaderForm.image} alt="Foto" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Foto</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{leaderForm.name || 'Nama'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{leaderForm.role || 'Jabatan'} • {leaderForm.period}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {leaderForm.tmLevel || 'TM'}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{leaderForm.note || 'Deskripsi singkat akan tampil di sini.'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={saveLeader}
                  disabled={!editingLeaderId}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${editingLeaderId ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'}`}
                >
                  <Save size={16} />
                  Simpan Perubahan
                </button>
                <button
                  onClick={cancelEditLeader}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold"
                >
                  Batal
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Urutan ditentukan otomatis: Ketua Umum, Sekretaris Umum, Bendahara Umum, Ketua Perkaderan.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {leaders.map((leader) => (
                  <div key={leader.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{leader.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{leader.role} • {leader.period}</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        {leader.tmLevel || 'TM'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Urutan: {leader.order || 1}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{leader.note}</p>
                    <button
                      onClick={() => startEditLeader(leader)}
                      className="mt-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="text-yellow-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">CMS Sederhana</h3>
              </div>

              <div className="space-y-4">
                {/* Profiles */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Profil Pimpinan</p>
                    <Save size={16} className="text-slate-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      placeholder="Nama"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      placeholder="Jabatan"
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    />
                    <input
                      className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      placeholder="Periode"
                      value={profileForm.period}
                      onChange={(e) => setProfileForm({ ...profileForm, period: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={addProfile}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600"
                  >
                    <PlusCircle size={16} />
                    Simpan Profil
                  </button>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {profiles.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                        <span>{p.name} · {p.role}</span>
                        <button onClick={() => deleteProfile(p.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* News */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Berita / Artikel</p>
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <textarea
                    className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    value={newsDraft}
                    onChange={(e) => setNewsDraft(e.target.value)}
                    placeholder="Tulis berita atau opini..."
                  />
                  <button
                    onClick={publishNews}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    <Save size={16} />
                    Simpan Draft
                  </button>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200 max-h-24 overflow-auto">
                    {newsList.map((news) => (
                      <li key={news.id} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{news.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gallery */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">Galeri</p>
                    <ImagePlus size={16} className="text-slate-500" />
                  </div>
                  <div className="flex gap-3">
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      placeholder="Nama file atau URL foto"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                    />
                    <button
                      onClick={addGalleryItem}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                    >
                      <PlusCircle size={16} />
                      Tambah
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {galleryItems.map((g) => (
                      <span key={g.id} className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                        {g.url}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-blue-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">E-Database Kader</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Nama"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="NIS"
                  value={memberForm.nis}
                  onChange={(e) => setMemberForm({ ...memberForm, nis: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Jurusan"
                  value={memberForm.jurusan}
                  onChange={(e) => setMemberForm({ ...memberForm, jurusan: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="No HP"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                />
                <select
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  value={memberForm.status}
                  onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as Member['status'] })}
                >
                  <option value="Pra-TM">Pra-TM</option>
                  <option value="TM1">TM1</option>
                  <option value="TM2">TM2</option>
                </select>
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Skill (Desain/Videografi/Kelistrikan)"
                  value={memberForm.skill}
                  onChange={(e) => setMemberForm({ ...memberForm, skill: e.target.value })}
                />
              </div>
              <button
                onClick={addMember}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 mb-4"
              >
                <UserPlus size={16} />
                Tambah Anggota
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <Filter size={16} className="text-slate-500" />
                  <input
                    className="bg-transparent focus:outline-none text-sm"
                    placeholder="Filter skill"
                    value={skillFilter === 'Semua' ? '' : skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value || 'Semua')}
                  />
                </div>
                <select
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                >
                  <option value="Semua">Status: Semua</option>
                  <option value="Pra-TM">Pra-TM</option>
                  <option value="TM1">TM1</option>
                  <option value="TM2">TM2</option>
                </select>
              </div>

              <div className="overflow-auto max-h-[500px]">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-slate-500 dark:text-slate-300 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <tr>
                      <th className="py-2 pr-3">Nama</th>
                      <th className="py-2 pr-3">NIS</th>
                      <th className="py-2 pr-3">Jurusan</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Skill</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredMembers.map((m) => (
                      <tr key={m.id}>
                        <td className="py-2 pr-3 text-slate-800 dark:text-slate-100">{m.name}</td>
                        <td className="py-2 pr-3">{m.nis}</td>
                        <td className="py-2 pr-3">{m.jurusan}</td>
                        <td className="py-2 pr-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status === 'TM2' ? 'bg-purple-100 text-purple-700' :
                            m.status === 'TM1' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-2 pr-3">{m.skill}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surat' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Inbox className="text-purple-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">E-Surat (Generator)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Nomor Surat"
                  value={letterForm.number}
                  onChange={(e) => setLetterForm({ ...letterForm, number: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Perihal"
                  value={letterForm.perihal}
                  onChange={(e) => setLetterForm({ ...letterForm, perihal: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Lampiran (default: -)"
                  value={letterForm.lampiran}
                  onChange={(e) => setLetterForm({ ...letterForm, lampiran: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Tujuan (Bapak/Ibu/Saudara/i)"
                  value={letterForm.tujuan}
                  onChange={(e) => setLetterForm({ ...letterForm, tujuan: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Hari/Tanggal (mis: Senin, 12 Jan 2025)"
                  value={letterForm.hariTanggal}
                  onChange={(e) => setLetterForm({ ...letterForm, hariTanggal: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Waktu (mis: 08.00 - Selesai)"
                  value={letterForm.waktu}
                  onChange={(e) => setLetterForm({ ...letterForm, waktu: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Tempat"
                  value={letterForm.tempat}
                  onChange={(e) => setLetterForm({ ...letterForm, tempat: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Acara"
                  value={letterForm.acara}
                  onChange={(e) => setLetterForm({ ...letterForm, acara: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Nama Penanda Tangan"
                  value={letterForm.penandaTangan}
                  onChange={(e) => setLetterForm({ ...letterForm, penandaTangan: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Jabatan Penanda Tangan"
                  value={letterForm.jabatan}
                  onChange={(e) => setLetterForm({ ...letterForm, jabatan: e.target.value })}
                />
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-700/40 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
                {letterPreview}
              </div>

              <div className="mt-3 flex gap-3 text-sm">
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
                >
                  <Download size={16} />
                  Export PDF
                </button>
                <button
                  onClick={saveLetterToArchive}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                >
                  <Save size={16} />
                  Simpan Arsip
                </button>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Riwayat Surat Keluar</h4>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {mailArchives.length === 0 && <p className="text-xs text-slate-500">Belum ada surat diarsipkan.</p>}
                  {mailArchives.map((mail) => (
                    <div key={mail.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{mail.number}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Kpd: {mail.tujuan} · {mail.perihal}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMailArchive(mail.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PiggyBank className="text-emerald-500" size={20} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">E-Finance</h3>
                </div>
                <button
                  onClick={() => {
                    const headers = ['Tanggal', 'Label', 'Tipe', 'Nominal'];
                    const rows = transactions.map(t => [
                      t.date ? new Date(t.date.seconds * 1000).toLocaleDateString() : '-',
                      `"${t.label}"`,
                      t.type === 'in' ? 'Pemasukan' : 'Pengeluaran',
                      t.amount.toString()
                    ]);

                    const csvContent = [
                      headers.join(','),
                      ...rows.map(r => r.join(','))
                    ].join('\n');

                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'laporan_keuangan.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                  <div className="text-xs text-emerald-600 dark:text-emerald-300">Pemasukan</div>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-200 truncate" title={`Rp${totals.masuk.toLocaleString()}`}>
                    Rp{totals.masuk.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
                  <div className="text-xs text-red-600 dark:text-red-300">Pengeluaran</div>
                  <div className="text-lg font-bold text-red-700 dark:text-red-200 truncate" title={`Rp${totals.keluar.toLocaleString()}`}>
                    Rp{totals.keluar.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                  <div className="text-xs text-slate-600 dark:text-slate-300">Saldo</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white truncate" title={`Rp${totals.saldo.toLocaleString()}`}>
                    Rp{totals.saldo.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input
                  className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  placeholder="Deskripsi"
                  value={txForm.label}
                  onChange={(e) => setTxForm({ ...txForm, label: e.target.value })}
                />
                <input
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  type="number"
                  placeholder="Nominal"
                  value={txForm.amount || ''}
                  onChange={(e) => setTxForm({ ...txForm, amount: Number(e.target.value) })}
                />
                <select
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                  value={txForm.type}
                  onChange={(e) => setTxForm({ ...txForm, type: e.target.value as Transaction['type'] })}
                >
                  <option value="in">Pemasukan</option>
                  <option value="out">Pengeluaran</option>
                </select>
              </div>
              <button
                onClick={addTransaction}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 mb-4"
              >
                <PlusCircle size={16} />
                Catat Transaksi
              </button>

              <div className="space-y-2 max-h-[400px] overflow-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-sm">
                    <div className="flex items-center gap-2">
                      {tx.type === 'in' ? <TrendingUp className="text-emerald-500" size={16} /> : <TrendingDown className="text-red-500" size={16} />}
                      <span className="text-slate-800 dark:text-slate-100">{tx.label}</span>
                    </div>
                    <span className={tx.type === 'in' ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}>
                      {tx.type === 'in' ? '+' : '-'}Rp{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advokasi' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Inbox className="text-amber-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">E-Advokasi</h3>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-auto">
                {aspirations.length === 0 && <p className="text-sm text-slate-500">Belum ada aspirasi masuk.</p>}
                {aspirations.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{a.name}</span>
                      <button
                        onClick={() => updateAspirationStatus(a.id, a.status)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600"
                      >
                        {a.status === 'Diterima' && <Clock size={14} className="text-amber-500" />}
                        {a.status === 'Sedang Diproses' && <CalendarRange size={14} className="text-blue-500" />}
                        {a.status === 'Selesai' && <CheckCircle size={14} className="text-emerald-500" />}
                        {a.status}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{a.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'event' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CalendarRange className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project / Event</h3>
              </div>

              {/* Event Form */}
              <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                  {editingEventId ? 'Edit Event' : 'Tambah Event Baru'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    placeholder="Nama Kegiatan"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  />
                  <input
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  />
                  <input
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    type="number"
                    placeholder="Target Peserta"
                    value={eventForm.total || ''}
                    onChange={(e) => setEventForm({ ...eventForm, total: Number(e.target.value) })}
                  />
                  <input
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    placeholder="Lokasi (Opsional)"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEvent}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600"
                  >
                    <Save size={16} />
                    {editingEventId ? 'Update Event' : 'Simpan Event'}
                  </button>
                  {editingEventId && (
                    <button
                      onClick={cancelEditEvent}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-500"
                    >
                      <X size={16} />
                      Batal
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-auto">
                {events.length === 0 && <p className="text-sm text-slate-500">Belum ada event.</p>}
                {events.map((ev) => {
                  const progress = ev.total > 0 ? Math.round((ev.attendance / ev.total) * 100) : 0;
                  return (
                    <div key={ev.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 group relative">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{ev.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {ev.date} {ev.location && `• ${ev.location}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditEvent(ev)}
                            className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteEvent(ev.id)}
                            className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-slate-500" />
                          <span>{ev.attendance}/{ev.total} hadir</span>
                        </div>
                        <button
                          onClick={() => bumpAttendance(ev.id, ev.attendance, ev.total)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-900 text-white hover:bg-slate-800"
                        >
                          <PlusCircle size={14} />
                          Absen
                        </button>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-2 bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
