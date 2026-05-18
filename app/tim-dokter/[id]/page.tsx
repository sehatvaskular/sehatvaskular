import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

export const runtime = 'edge'

// DATA BACKUP/FALLBACK JIKA DATA DI SUPABASE BELUM DIUPDATE LENGKAP
const doctorsBackupData: Record<string, any> = {
  '1': {
    name: 'dr. Kresna Agung Prabowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    bio: 'dr. Kresna Agung Prabowo, Sp.B, Subsp. BVE(K) adalah dokter spesialis bedah vaskular dan endovaskular yang berdomisili di Malang dan tergabung dalam Perhimpunan Dokter Spesialis Bedah Vaskular dan Endovaskular Indonesia (PESBEVI).',
    education: [
      'FKUI – Program Pendidikan Dokter Subspesialis Ilmu Bedah Vaskular dan Endovaskular',
      'Fuwai Hospital, Chinese Academy of Medical Sciences & Peking Union Medical College, China',
      'Universitas Negeri Surakarta, Solo',
      'Universitas Brawijaya, Malang'
    ],
    practice: [
      'RS Lavalette (IHC), Malang',
      'RSUD Dr. Saiful Anwar, Malang',
      'RSI Aisyah, Malang'
    ],
    experience: [
      '2025: Lecture for Undergraduate Medical Faculty Universitas Brawijaya (UB)',
      '2025: Lecture for General Surgery and Emergency Medicine Residency Program at UB',
      '2024: Presenter at Symposium 25th Congress of the Asian Society for Vascular Surgery, Thailand',
      '2023: Presenter at Symposium Dialysis Access Synergy (DASY) by Singapore Vascular Association, Singapore',
      '2016: Presenter at Symposium The 40th World Congress of The ICS, Kyoto Japan'
    ],
    awards: []
  },
  '2': {
    name: 'dr. Kurniawan Eko Wibowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1594824416965-9f1844cbab54?auto=format&fit=crop&q=80&w=800',
    bio: 'dr. Kurniawan Eko Wibowo, Sp.B, Subsp.BVE(K) adalah seorang Dokter Spesialis Bedah Umum dengan Subspesialisasi Bedah Vaskular dan Endovaskular (Konsultan). Beliau memiliki fokus keahlian pada penanganan penyakit pembuluh darah, baik melalui prosedur bedah terbuka maupun intervensi minimal invasif (endovaskular).',
    education: [
      '2025: Vascular & Endovascular Trainee Program of Faculty Medicine Universitas Indonesia',
      '2024: Fellowship Vascular & Endovascular Department University Hospital of Guadalajara, Spain',
      '2016: General Surgery Study Program of Faculty Medicine Universitas Udayana, Bali',
      '2006: Faculty Medicine of Universitas Hang Tuah Surabaya'
    ],
    practice: [
      'RS Lavalette (IHC) Malang sebagai Spesialis Bedah Vaskular & Endovaskular',
      'RSUD Kertosono, Nganjuk sebagai Spesialis Bedah Vaskular & Endovaskular'
    ],
    experience: [
      '2025: Vascular Surgeon RSD Kertosono, Nganjuk, Jawa Timur',
      '2016: General Surgeon RS Bhayangkara, Lombok, NTB',
      'General Surgeon RS Bhayangkara, Kediri'
    ],
    awards: []
  },
  '3': {
    name: 'dr. Josep Joko Hendratno',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    bio: 'dr. Josep Joko Hendratno, Sp.B, Subsp. BVE(K) adalah seorang Dokter Bedah Konsultan Vaskular dan Endovaskular lulusan Universitas Indonesia yang memiliki rekam jejak pengabdian panjang di wilayah Indonesia Timur, mulai dari dokter PTT di daerah sangat terpencil di Sumba Timur hingga bertugas sebagai spesialis bedah di RSUD Umbu Rara Meha dan Kepulauan Tanimbar. Dedikasi tingginya dalam pelayanan kesehatan di daerah terpencil tersebut mengantarkannya meraih penghargaan bergengsi sebagai Dokter Teladan Puskesmas Tingkat Nasional dari KEMENKES pada tahun 2011. Selain fokus pada pelayanan klinis, beliau secara konsisten memperdalam keahlian medisnya, khususnya dalam bidang akses vaskular dan penanganan vena, melalui partisipasi aktif dalam berbagai forum ilmiah dan workshop tingkat internasional, seperti di Singapura dan Turki.',
    education: [
      'Pendidikan Dokter Subspesialis Bedah Vaskular dan Endovaskular Fakultas Kedokteran Universitas Indonesia (Januari 2024 - Desember 2025)',
      'Pendidikan Dokter Spesialis Bedah Umum Universitas Sam Ratulangi Manado (2013 - 2018)',
      'Pendidikan Dokter Umum Fakultas Kedokteran Umum Universitas Pembangunan Nasional Jakarta (1998)'
    ],
    practice: [
      'Dokter Spesialis Bedah Umum di RSUD Umbu Rara Meha Kabupaten Sumba Timur (Desember 2019 - Desember 2023)',
      'Wajib Kerja Dokter Spesialis KEMENKES Kabupaten Kepulauan Tanimbar, Maluku Barat Daya (Desember 2018 - November 2019)',
      'Dokter Spesialis Bedah Umum di RSUD Umbu Rara Meha Kabupaten Sumba Timur (Juni 2018 - November 2018)',
      'Dokter Umum PTT KEMENKES Daerah Sangat Terpencil di Kabupaten Sumba Timur, NTT (April 2007 - Desember 2012)'
    ],
    experience: [
      'European Society Vascular Surgeon Conference, Istanbul, Turkey (2025)',
      'Simposium Inavasc Surabaya (2025)',
      'Simposium Inavasc Bali (2024)',
      'Dialysis Access Synergy (Akses Vaskular), Singapore (2023)',
      'Workshop Akses Vaskular Jakarta Vascular Update (2023)',
      'Simposium Inavasc Semarang (2023)',
      'Dialysis Access Synergy (Akses Vaskular), Singapore (2022)',
      'Simposium Inavasc Cibubur (2022)',
      'Workshop Chronic Vein Insufficiency Cibubur (2022)',
      'Workshop AV Fistula Inavasc Bali (2019)',
      'Simposium Inavasc Bali (2019)'
    ],
    awards: [
      'Dokter Teladan Puskesmas Tingkat Nasional KEMENKES (2011)'
    ]
  }
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const backup = doctorsBackupData[id]
  
  return {
    title: backup ? `Profil ${backup.name} | Sehat Vaskular` : 'Profil Dokter Spesialis Vaskular',
    description: backup ? backup.bio : 'Detail tim pakar bedah vaskular dan endovaskular.'
  }
}

export default async function DoctorDetailPage({ params }: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id

  // Jalankan query pencarian ke database Supabase terlebih dahulu
  const { data: dbDoctor } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()

  const backup = doctorsBackupData[id]

  // Jika data di DB maupun backup tidak ada, kunci rute 404
  if (!dbDoctor && !backup) notFound()

  // Gabungkan skema data (prioritaskan database, gunakan dummy jika struktur tabel belum lengkap)
  const doctor = {
    name: dbDoctor?.name || backup.name,
    title: dbDoctor?.title || backup.title,
    specialty: dbDoctor?.specialty || backup.specialty,
    image_url: dbDoctor?.image_url || backup.image_url,
    bio: dbDoctor?.bio || backup.bio,
    education: dbDoctor?.education || backup.education,
    practice: dbDoctor?.practice || backup.practice,
    experience: dbDoctor?.experience || backup.experience,
    awards: dbDoctor?.awards || backup.awards
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Tombol Navigasi Kembali */}
        <Link href="/tim-dokter" className="inline-flex items-center gap-2 text-sm font-bold text-svMaroon-800 hover:text-svMaroon-600 transition mb-10">
          ← KEMBALI KE TIM DOKTER
        </Link>

        {/* ROW LAYOUT UTAMA */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* KOLOM KIRI - KARTU PORTRAIT VISUAL */}
          <div className="w-full lg:w-1/3 sticky top-28">
            <FadeIn direction="up">
              <div className="bg-white rounded-4xl p-5 border border-slate-100 shadow-xl text-center">
                <div className="relative w-full aspect-4/5 overflow-hidden rounded-3xl bg-linear-to-b from-slate-100 to-slate-200 mb-6">
                  <img 
                    src={doctor.image_url} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-black text-svBlue-900 mb-1 leading-tight">{doctor.name}</h1>
                <p className="text-md text-slate-500 font-medium mb-4">{doctor.title}</p>
                <span className="inline-block px-4 py-1.5 bg-svMaroon-900/10 text-svMaroon-800 font-bold tracking-widest text-xs uppercase rounded-full mb-6">
                  {doctor.specialty}
                </span>

                {/* Lokasi Tempat Praktek Aktif */}
                <div className="border-t border-slate-100 pt-6 text-left">
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">LOKASI PRAKTEK AKTIF</h4>
                  <ul className="space-y-2">
                    {doctor.practice.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-slate-700 font-medium leading-relaxed">
                        <span className="text-svMaroon-800">📍</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* KOLOM KANAN - DETAIL BIO & RIWAYAT KLINIS */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            {/* Bagian Deskripsi / Profil Umum */}
            <FadeIn delay={0.2} direction="up">
              <div className="bg-white p-8 md:p-10 rounded-4xl border border-slate-100 shadow-xl">
                <h2 className="text-xl font-bold text-svBlue-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-svMaroon-800 rounded-full"></span>
                  Tentang Dokter
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {doctor.bio}
                </p>
              </div>
            </FadeIn>

            {/* Bagian Riwayat Pendidikan */}
            {doctor.education && doctor.education.length > 0 && (
              <FadeIn delay={0.3} direction="up">
                <div className="bg-white p-8 md:p-10 rounded-4xl border border-slate-100 shadow-xl">
                  <h2 className="text-xl font-bold text-svBlue-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-svMaroon-800 rounded-full"></span>
                    Riwayat Pendidikan & Pelatihan
                  </h2>
                  <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-6">
                    {doctor.education.map((item: string, idx: number) => (
                      <div key={idx} className="relative">
                        {/* Bullet point lingkar merah */}
                        <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-svMaroon-800 border-4 border-white shadow-sm"></span>
                        <p className="text-slate-700 font-semibold leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Bagian Pengalaman Forum & Kegiatan Ilmiah */}
            {doctor.experience && doctor.experience.length > 0 && (
              <FadeIn delay={0.4} direction="up">
                <div className="bg-white p-8 md:p-10 rounded-4xl border border-slate-100 shadow-xl">
                  <h2 className="text-xl font-bold text-svBlue-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-svMaroon-800 rounded-full"></span>
                    Pengalaman Profesional & Forum Ilmiah
                  </h2>
                  <ul className="space-y-4">
                    {doctor.experience.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-svMaroon-800 mt-2.5 shrink-0"></span>
                        <p className="text-slate-700 font-medium leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            )}

            {/* Bagian Penghargaan Khusus (Hanya muncul jika dokter memilikinya) */}
            {doctor.awards && doctor.awards.length > 0 && (
              <FadeIn delay={0.5} direction="up">
                <div className="bg-linear-to-r from-svBlue-900 to-slate-900 p-8 md:p-10 rounded-4xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-svMaroon-800 rounded-full blur-[70px] opacity-40"></div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                    <span>🏆</span>
                    Penghargaan & Prestasi Kehormatan
                  </h2>
                  <ul className="space-y-4 relative z-10">
                    {doctor.awards.map((item: string, idx: number) => (
                      <li key={idx} className="bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                        <span className="text-3xl">🏅</span>
                        <p className="font-bold text-lg text-slate-100 leading-tight">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}