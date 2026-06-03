import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sehat Vaskular Mobile Apps",
  description: "Download aplikasi Sehat Vaskular untuk pantau kesehatan pembuluh darah Anda.",
};

const features = [
  {
    id: "home",
    title: "Home (Dashboard)",
    description: "Ringkasan tensi hari ini, artikel terbaru, pintasan cepat ke Chat AI/Dokter.",
    image: "/home1.jpg",
  },
  {
    id: "tracker",
    title: "Health Tracker",
    description: "Grafik perkembangan tensi & heart rate, serta tombol input log baru.",
    image: "/tracker1.jpg",
  },
  {
    id: "konsultasi",
    title: "Konsultasi",
    description: "Daftar dokter online, riwayat konsultasi aktif, dan ruang chat/panggilan.",
    image: "/konsultasi1.jpg",
  },
  {
    id: "artikel",
    title: "Artikel",
    description: "Pusat edukasi kesehatan vaskular yang tersinkronisasi dengan website.",
    image: "/artikel1.jpg",
  },
  {
    id: "profil",
    title: "Profil",
    description: "Pengaturan akun, data medis dasar, PIN keamanan/Biometrik.",
    image: "/profil1.jpg",
  },
];

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-[#0a1120] text-slate-200 selection:bg-red-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0a1120] to-[#0a1120] pointer-events-none" />
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Aplikasi <span className="text-[#ef4444]">Sehat Vaskular</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          Pantau kesehatan pembuluh darah Anda dengan mudah. Konsultasi, tracking tensi, dan edukasi kesehatan langsung dari genggaman Anda.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="https://play.google.com/store" 
            target="_blank"
            className="flex items-center justify-center gap-3 bg-[#ef4444] hover:bg-red-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.523 15.3414C17.523 15.3414 16.0315 16.1969 14.1953 17.2514L10.3705 13.4266L17.523 15.3414ZM21.1396 17.4175L18.4287 15.8617L11.3364 13.9689L3.10915 5.74169L3.08587 21.6033C3.08587 22.0483 3.32849 22.463 3.72911 22.6946C4.12972 22.9262 4.6366 22.9442 5.05436 22.7423L21.1396 17.4175ZM15.4262 13.3642L11.2335 12.2415L5.70014 6.70807C5.55627 6.56421 5.46788 6.37517 5.44976 6.17502L15.4262 13.3642ZM17.1354 11.2638L21.1444 8.9634C21.5796 8.71369 21.8415 8.24357 21.8415 7.74151C21.8415 7.23945 21.5796 6.76933 21.1444 6.51961L3.72911 1.3054C3.30825 1.13328 2.82522 1.20623 2.47055 1.49527L17.1354 11.2638Z"/></svg>
            Download untuk Android
          </Link>
          <button 
            disabled
            className="flex items-center justify-center gap-3 bg-slate-800/80 text-slate-500 px-8 py-4 rounded-full font-medium cursor-not-allowed border border-slate-700/50"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.68 3.14.68.65 0 2.05-.76 3.65-.63 1.25.1 2.45.62 3.3 1.54-2.8 1.62-2.3 5.48.55 6.64-.67 1.83-1.68 3.75-2.64 4.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.3 2.41-1.95 4.38-3.74 4.25z"/></svg>
            iOS (Coming Soon)
          </button>
        </div>
      </section>

      {/* Features Section with Smooth Scroll & Blur Effects */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
        <div className="space-y-32 md:space-y-48 mt-16">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`flex flex-col gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Image Container */}
              <div className="flex-1 w-full max-w-sm flex justify-center perspective-1000">
                <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-[2.5rem] bg-slate-900 border-[8px] border-slate-800 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-transparent opacity-50 z-10 pointer-events-none rounded-3xl" />
                  
                  {/* Image Placeholder (1080x1920) */}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 280px, 320px"
                    priority={index === 0}
                  />
                </div>
              </div>

              {/* Text Content (Sticky + Backdrop Blur) */}
              <div className="flex-1 w-full relative">
                <div className="sticky top-1/3 p-8 rounded-3xl backdrop-blur-xl bg-[#0f172a]/60 border border-slate-700/50 shadow-2xl transition-all hover:bg-[#0f172a]/80">
                  <div className="text-[#ef4444] text-sm font-bold tracking-widest uppercase mb-2">
                    Fitur {index + 1}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}