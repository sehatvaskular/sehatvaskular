import { notFound } from 'next/navigation'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export const runtime = 'edge';

// Data Terstruktur Dinamis (Platform Edukasi Vaskular)
const servicesData: Record<string, any> = {
  'diabetic-foot': {
    title: 'Diabetic Foot (Kaki Diabetes)',
    subtitle: 'Edukasi Pencegahan Amputasi & Perawatan Luka Komprehensif',
    hero: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Kaki diabetes (Diabetic Foot) adalah salah satu komplikasi paling serius dari penyakit diabetes melitus yang tidak terkontrol. Melalui kampanye dan edukasi berkelanjutan, <strong>Sehat Vaskular</strong> terus mensosialisasikan pentingnya deteksi dini agar kondisi ini tidak berakhir pada amputasi.</p>
      <p>Kondisi ini terjadi akibat kombinasi mematikan antara kerusakan saraf (neuropati) yang membuat penderita mati rasa, dan penyempitan pembuluh darah (iskemia) yang membuat aliran oksigen ke luka terhenti. Luka kecil yang tidak disadari dapat membusuk dengan cepat.</p>
    `,
    callout: "Kampanye Limb Salvage: Kami percaya bahwa waktu adalah jaringan. Semakin cepat masyarakat mengenali gejalanya, semakin besar peluang anggota gerak dapat diselamatkan.",
    highlightsTitle: "Edukasi Penanganan Medis Terkini",
    highlights: [
      {
        icon: "🩹",
        title: "Surgical Debridement",
        desc: "Prosedur pembersihan jaringan mati untuk mencegah bakteri menyebar dan merangsang pertumbuhan sel baru yang sehat."
      },
      {
        icon: "🧬",
        title: "Revaskularisasi",
        desc: "Tindakan medis invasif minimal menggunakan balon dan stent untuk membuka kembali pembuluh darah yang tersumbat di kaki."
      },
      {
        icon: "🔬",
        title: "Modern Wound Care",
        desc: "Penggunaan balutan berteknologi tinggi untuk menjaga kelembapan luka dan mempercepat penutupan borok diabetes."
      }
    ],
    conclusion: `
      <h3>Tanda Bahaya yang Sering Diabaikan</h3>
      <ul>
        <li>Mati rasa, kesemutan, atau sensasi terbakar pada telapak kaki.</li>
        <li>Kulit kaki terasa sangat kering, pecah-pecah, dan mudah mengelupas.</li>
        <li>Perubahan warna pada jari kaki menjadi kehitaman atau kebiruan.</li>
      </ul>
      <p>Melalui seminar dan kegiatan CSR kami, Sehat Vaskular aktif mendampingi masyarakat untuk mendapatkan akses informasi dan rujukan penanganan terbaik.</p>
    `
  },
  'akses-hemodialisa': {
    title: 'Akses Hemodialisa (Cimino)',
    subtitle: 'Mengenal Jalur Cuci Darah yang Andal dan Aman',
    hero: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Bagi pejuang gagal ginjal kronis (CKD) yang membutuhkan hemodialisa rutin, akses vaskular yang baik adalah "urat nadi" kehidupan mereka. Mesin cuci darah membutuhkan aliran darah yang sangat cepat, sesuatu yang tidak bisa diberikan oleh pembuluh darah vena biasa.</p>
      <p>Sehat Vaskular rutin mengadakan sesi edukasi bersama komunitas pasien gagal ginjal untuk memberikan pemahaman menyeluruh tentang pentingnya persiapan dan perawatan akses cuci darah yang tepat.</p>
    `,
    callout: "Akses vaskular yang dipersiapkan dengan matang adalah kunci utama untuk kualitas hidup yang lebih baik bagi pasien hemodialisa.",
    highlightsTitle: "Standar Emas Akses Vaskular",
    highlights: [
      {
        icon: "🔗",
        title: "AV Fistula (Cimino)",
        desc: "Menyambungkan arteri dan vena secara langsung. Ini adalah metode paling direkomendasikan karena paling awet dan minim risiko infeksi."
      },
      {
        icon: "🧪",
        title: "AV Graft",
        desc: "Menggunakan selang sintetis medis sebagai jembatan jika kondisi pembuluh vena pasien terlalu kecil atau sudah rusak."
      },
      {
        icon: "💉",
        title: "Kateter CDL",
        desc: "Akses sementara di area leher atau dada untuk kondisi gawat darurat sambil menunggu Cimino matang."
      }
    ],
    conclusion: `
      <h3>Perawatan Mandiri Pasca Operasi</h3>
      <p>Salah satu fokus edukasi kami adalah pendampingan pasca tindakan. Kami mengajarkan pasien untuk melatih lengan mereka (seperti meremas bola karet) agar pembuluh darah Cimino cepat membesar, serta cara menjaga kebersihan area akses agar terhindar dari infeksi mematikan.</p>
    `
  },
  'varises': {
    title: 'Varises & Gangguan Vena',
    subtitle: 'Bukan Sekadar Masalah Kosmetik, Pahami Bahayanya',
    hero: 'https://images.unsplash.com/photo-1551076805-e18690c5e53b?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Banyak masyarakat mengira varises hanyalah urat biru yang mengganggu penampilan. Melalui berbagai literasi digital, <strong>Sehat Vaskular</strong> meluruskan mitos ini. Varises adalah kondisi medis bernama Insufisiensi Vena Kronis (CVI).</p>
      <p>Ini terjadi ketika katup kecil di vena rusak, membuat darah menumpuk di area betis. Jika dibiarkan bertahun-tahun, kondisi ini bisa memicu bengkak, kram hebat, perubahan warna kulit menjadi hitam, hingga munculnya borok varises (venous ulcer) yang sulit sembuh.</p>
    `,
    callout: "Mitos Terbesar: Varises harus dioperasi dengan cara dicabut uratnya. Faktanya, teknologi saat ini memungkinkan penanganan tanpa sayatan pisau bedah.",
    highlightsTitle: "Inovasi Penanganan Tanpa Operasi Besar",
    highlights: [
      {
        icon: "⚡",
        title: "EVLA (Terapi Laser)",
        desc: "Penutupan vena yang rusak dari dalam menggunakan energi panas laser melalui sayatan sebesar lubang jarum."
      },
      {
        icon: "💉",
        title: "Skleroterapi",
        desc: "Penyuntikan cairan khusus ke urat halus (spider veins) agar urat tersebut mengkerut dan memudar diserap tubuh."
      },
      {
        icon: "🤏",
        title: "Mini Phlebectomy",
        desc: "Pengambilan tonjolan varises besar melalui sayatan mikro (1-2 mm) yang nyaris tidak meninggalkan bekas luka."
      }
    ],
    conclusion: `
      <p>Dengan kemajuan teknologi medis yang terus kami sosialisasikan, pasien kini tidak perlu lagi rawat inap berhari-hari. Sebagian besar tindakan varises modern memungkinkan pasien untuk langsung berjalan dan beraktivitas ringan di hari yang sama.</p>
    `
  },
  'pad': {
    title: 'Peripheral Artery Disease (PAD)',
    subtitle: 'Waspada Nyeri Tungkai Akibat Penyumbatan Arteri',
    hero: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Sering merasa kram hebat di betis setelah berjalan beberapa ratus meter, namun hilang saat duduk santai? Itu bukan sekadar pegal biasa, melainkan gejala khas Penyakit Arteri Perifer (PAD) yang disebut <em>Claudication</em>.</p>
      <p>Sebagai platform edukasi kesehatan, <strong>Sehat Vaskular</strong> aktif menyelenggarakan skrining dan penyuluhan mengenai PAD, terutama bagi kelompok berisiko tinggi seperti perokok aktif, penderita hipertensi, diabetes, dan kolesterol tinggi.</p>
    `,
    callout: "Membiarkan PAD berlanjut hingga tahap Critical Limb Ischemia (CLI) dapat mengakibatkan kematian jaringan ujung jari kaki yang berujung pada hilangnya anggota tubuh.",
    highlightsTitle: "Informasi Penanganan Medis Terkini",
    highlights: [
      {
        icon: "📊",
        title: "Skrining ABI Doppler",
        desc: "Metode non-invasif tanpa rasa sakit untuk membandingkan tekanan darah di lengan dan kaki guna mendeteksi penyumbatan awal."
      },
      {
        icon: "🎈",
        title: "Angioplasti & Stent",
        desc: "Pelebaran pembuluh darah menggunakan balon mikro dari dalam, dilanjutkan pemasangan jaring penahan (stent)."
      },
      {
        icon: "🔀",
        title: "Bypass Surgery",
        desc: "Pembuatan jalan pintas aliran darah baru untuk melewati area arteri yang tersumbat total."
      }
    ],
    conclusion: `
      <h3>Pencegahan adalah Kunci</h3>
      <p>Modifikasi gaya hidup adalah pertahanan pertama. Berhenti merokok, menjaga pola makan, dan rutin berjalan kaki adalah pesan kesehatan yang terus kami gaungkan di berbagai seminar dan program CSR Sehat Vaskular.</p>
    `
  },
  'dvt': {
    title: 'Deep Vein Thrombosis (DVT)',
    subtitle: 'Mengenal Gumpalan Darah Berbahaya di Vena Dalam',
    hero: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Deep Vein Thrombosis (DVT) adalah kondisi terbentuknya gumpalan darah beku di pembuluh vena dalam (biasanya kaki). Kondisi ini sering menyerang pasien pasca-operasi besar, ibu hamil, atau pekerja yang duduk statis dalam waktu sangat lama.</p>
      <p>Bahaya utama DVT bukanlah kaki yang membengkak, melainkan risiko terlepasnya gumpalan tersebut. Jika gumpalan masuk ke jantung dan menyumbat paru-paru (Emboli Paru), dampaknya bisa fatal. Literasi akan kondisi gawat darurat inilah yang menjadi fokus edukasi Sehat Vaskular.</p>
    `,
    callout: "Jika kaki Anda membengkak secara tiba-tiba, terasa hangat, dan sangat nyeri hanya di satu sisi, segera cari pertolongan medis. Ini adalah gejala klasik DVT.",
    highlightsTitle: "Protokol Penanganan Darurat",
    highlights: [
      {
        icon: "💊",
        title: "Obat Antikoagulan",
        desc: "Pemberian obat pengencer darah dosis tinggi untuk mencegah gumpalan semakin membesar."
      },
      {
        icon: "🎯",
        title: "Trombolisis (CDT)",
        desc: "Penyuntikan obat penghancur bekuan darah secara langsung ke titik gumpalan melalui selang kateter."
      },
      {
        icon: "☂️",
        title: "Pemasangan IVC Filter",
        desc: "Alat menyerupai payung kecil dipasang di vena utama perut untuk menangkap gumpalan sebelum mencapai paru-paru."
      }
    ],
    conclusion: `
      <p>Edukasi pencegahan DVT sangat krusial, terutama bagi mereka yang sering melakukan perjalanan panjang (Economy Class Syndrome). Kami menyarankan peregangan kaki ringan secara berkala dan konsumsi air putih yang cukup saat beraktivitas statis.</p>
    `
  },
  'trauma-vaskular': {
    title: 'Trauma Vaskular',
    subtitle: 'Golden Period: Menyelamatkan Nyawa & Anggota Tubuh',
    hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
    overview: `
      <p>Trauma vaskular adalah cedera atau robeknya pembuluh darah utama akibat kecelakaan lalu lintas, luka tusuk, atau patah tulang parah. Dalam banyak forum edukasi dan CSR keselamatan kerja, <strong>Sehat Vaskular</strong> selalu menekankan pentingnya respons cepat dalam kondisi ini.</p>
      <p>Dalam trauma vaskular, pasien berpacu dengan <strong>Golden Period (Periode Emas)</strong>. Hanya ada waktu sekitar 6-8 jam untuk menyambung kembali pembuluh darah yang putus sebelum otot dan saraf mati secara permanen.</p>
    `,
    callout: "Penanganan pertama di lokasi kejadian (seperti balut tekan untuk menghentikan pendarahan memancar) sangat menentukan peluang hidup pasien sebelum tiba di UGD.",
    highlightsTitle: "Tindakan Penyelamatan Pakar Bedah",
    highlights: [
      {
        icon: "🧵",
        title: "Primary Repair",
        desc: "Teknik mikrosurgikal untuk menjahit dan menyambung kembali robekan pembuluh darah secara langsung."
      },
      {
        icon: "🪡",
        title: "Vein Grafting",
        desc: "Penggunaan pembuluh vena sehat dari area kaki lain sebagai 'pipa pengganti' untuk arteri yang hancur."
      },
      {
        icon: "🛑",
        title: "Endovascular Embolization",
        desc: "Penutupan sumber perdarahan dalam (seperti di area panggul) secara cepat menggunakan teknik kateterisasi dari dalam."
      }
    ],
    conclusion: `
      <p>Pengetahuan tentang pertolongan pertama pada kecelakaan dan akses cepat ke jaringan rumah sakit rujukan vaskular adalah misi utama yang terus diperjuangkan oleh platform Sehat Vaskular di masyarakat luas.</p>
    `
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const service = servicesData[resolvedParams.slug];
  
  if (!service) return { title: 'Edukasi Tidak Ditemukan' }
  
  return {
    title: `${service.title} | Edukasi Sehat Vaskular`,
    description: service.subtitle,
  }
}

export default async function LayananDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;
  const service = servicesData[currentSlug];

  if (!service) notFound();

  // Memilih 3 layanan lainnya untuk rekomendasi navigasi di bawah
  const otherServices = Object.entries(servicesData)
    .filter(([slug]) => slug !== currentSlug) // Hilangkan halaman yang sedang dibuka
    .slice(0, 3); // Ambil 3 layanan saja

  return (
    <>
      {/* HEADER HERO */}
      <div className="w-full h-[50vh] relative bg-svBlue-900 border-t border-svBlue-800">
        <img src={service.hero} alt={service.title} className="w-full h-full object-cover opacity-50" />
        {/* Diperbarui: bg-linear-to-t untuk Tailwind v4 */}
        <div className="absolute inset-0 bg-linear-to-t from-svBlue-900 via-svBlue-900/60 to-transparent" />
        <div className="absolute bottom-0 w-full">
          <div className="max-w-6xl mx-auto px-6 pb-16">
            <FadeIn direction="up">
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-bold tracking-widest hover:bg-white/30 transition mb-6 backdrop-blur-md">
                <span>←</span> TOPIK EDUKASI
              </Link>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 max-w-4xl drop-shadow-lg">
                {service.title}
              </h1>
              {/* Diperbarui: Mengubah text-svMaroon-400 menjadi text-slate-200 agar kontras dan mudah dibaca */}
              <p className="text-xl md:text-2xl text-slate-200 font-medium max-w-2xl drop-shadow-md">
                {service.subtitle}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>

      <main className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* KONTEN UTAMA */}
            <div className="lg:w-2/3 flex flex-col">
              
              <div className="space-y-12 grow">
                {/* Paragraf Pembuka */}
                <FadeIn delay={0.2} direction="up">
                  <article className="prose prose-lg max-w-none text-slate-700 leading-relaxed prose-strong:text-svBlue-900">
                    <div dangerouslySetInnerHTML={{ __html: service.overview }} />
                  </article>
                </FadeIn>

                {/* Blok Callout Edukasi (Quote) */}
                <FadeIn delay={0.3} direction="up">
                  <div className="relative bg-white rounded-3xl p-8 border-l-8 border-svMaroon-800 shadow-lg shadow-slate-200/50">
                    <div className="absolute -top-6 -left-4 text-6xl text-svMaroon-800/10 font-serif">"</div>
                    <p className="text-xl italic text-svBlue-900 font-medium leading-relaxed relative z-10">
                      {service.callout}
                    </p>
                  </div>
                </FadeIn>

                {/* Grid Cards - Tindakan Medis */}
                <FadeIn delay={0.4} direction="up">
                  <div className="pt-8">
                    <h3 className="text-2xl font-bold text-svBlue-900 mb-8 flex items-center gap-3">
                      <span className="w-8 h-1 bg-svMaroon-800 rounded-full"></span>
                      {service.highlightsTitle}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {service.highlights.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-svMaroon-800/30 hover:shadow-xl transition-all duration-300">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                            {item.icon}
                          </div>
                          <h4 className="font-bold text-svBlue-900 text-lg mb-2">{item.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                {/* Kesimpulan */}
                <FadeIn delay={0.5} direction="up">
                  <article className="prose prose-lg max-w-none text-slate-700 leading-relaxed prose-headings:text-svBlue-900 prose-ul:text-slate-600 prose-li:marker:text-svMaroon-800 pt-8 border-t border-slate-200">
                    <div dangerouslySetInnerHTML={{ __html: service.conclusion }} />
                  </article>
                </FadeIn>
              </div>

              {/* NAVIGASI ARTIKEL / TOPIK EDUKASI LAINNYA */}
              <div className="mt-20 pt-16 border-t border-slate-200">
                <FadeIn direction="up">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-svBlue-900">Jelajahi Topik Lainnya</h3>
                    <Link href="/layanan" className="text-sm font-semibold text-svMaroon-800 hover:text-svMaroon-600 transition">
                      Lihat Semua Topik →
                    </Link>
                  </div>
                </FadeIn>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {otherServices.map(([slug, data], idx) => (
                    <FadeIn key={slug} delay={0.1 * idx} direction="up">
                      <Link href={`/layanan/${slug}`} className="block group h-full">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-svMaroon-800/50 transition-all duration-300 h-full flex flex-col">
                          <h4 className="font-bold text-svBlue-900 mb-2 group-hover:text-svMaroon-800 transition line-clamp-2">
                            {data.title}
                          </h4>
                          <p className="text-sm text-slate-500 line-clamp-2 grow">
                            {data.subtitle}
                          </p>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>

            </div>

            {/* SIDEBAR FLOATING - Jaringan Pakar */}
            <div className="lg:w-1/3">
              <FadeIn delay={0.4} direction="left">
                <div className="sticky top-28 bg-svBlue-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                  {/* Efek Latar Belakang Sidebar */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-svMaroon-800 rounded-full blur-[60px] opacity-50"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6 backdrop-blur-sm border border-white/20">
                      🤝
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">Konsultasi Pakar</h4>
                    <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                      Sehat Vaskular terhubung dengan jaringan dokter spesialis bedah vaskular profesional. Dapatkan rekomendasi dan rujukan penanganan terbaik untuk kondisi {service.title.split(' ')[0]} Anda.
                    </p>
                    
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="block w-full py-4 bg-svMaroon-800 text-white font-bold rounded-full hover:bg-svMaroon-600 transition shadow-lg mb-4">
                      Tanya Tim Edukasi (WA)
                    </a>
                    <Link href="/tim-dokter" className="block w-full py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition">
                      Lihat Profil Dokter
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}