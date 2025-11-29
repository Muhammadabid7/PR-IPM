export type HomepageConfig = {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  accentFrom: string;
  accentTo: string;
  heroTitleSize: number;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  ctaButtonLink: string;
  statPrimaryLabel: string;
  statPrimaryValue: string;
  statPrimarySub: string;
  statSecondaryLabel: string;
  statSecondaryValue: string;
  statSecondarySub: string;
  statTertiaryLabel: string;
  statTertiaryValue: string;
  statTertiarySub: string;
  partnerLogos: string[];
  bannerTitle: string;
  bannerBody: string;
  bannerLinkLabel: string;
  bannerLinkUrl: string;
};

export const defaultHomepageConfig: HomepageConfig = {
  heroBadge: 'Periode 2024-2025',
  heroTitle: 'Kader Vokasi',
  heroHighlight: 'Berkemajuan',
  heroSubtitle: 'Membangun sinergi keislaman dan profesionalitas di lingkungan industri. Wadah kaderisasi yang disiplin, tertib administrasi, dan siap kerja.',
  heroImage: 'https://picsum.photos/seed/ipmsmk/800/600',
  accentFrom: '#fbbf24',
  accentTo: '#f97316',
  heroTitleSize: 54,
  ctaTitle: 'Percepat kolaborasi dengan IPM SMKM 1',
  ctaSubtitle: 'Diskusikan program sinergi sekolah, industri, dan kaderisasi.',
  ctaButtonLabel: 'Hubungi Kami',
  ctaButtonLink: '#contact',
  statPrimaryLabel: 'Peringkat Nasional',
  statPrimaryValue: '#184',
  statPrimarySub: 'MyIPM se-Indonesia',
  statSecondaryLabel: 'Program Aktif',
  statSecondaryValue: '24',
  statSecondarySub: 'Inisiatif 2024-2025',
  statTertiaryLabel: 'Kader TM 1',
  statTertiaryValue: '100%',
  statTertiarySub: 'Standar kaderisasi',
  partnerLogos: [
    'https://dummyimage.com/140x60/0f172a/ffffff&text=SMKM+1',
    'https://dummyimage.com/140x60/0f172a/ffffff&text=DU/DI',
    'https://dummyimage.com/140x60/0f172a/ffffff&text=Komite'
  ],
  bannerTitle: 'Info Penting',
  bannerBody: 'PKD TM 1 angkatan berikutnya segera dibuka. Pantau pengumuman resmi atau hubungi sekretariat.',
  bannerLinkLabel: 'Lihat Jadwal',
  bannerLinkUrl: '#events'
};
