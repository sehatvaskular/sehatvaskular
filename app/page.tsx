// app/page.tsx
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import NewsCarousel from '@/components/NewsCarousel' // <-- Mengimpor Slideshow

export const revalidate = 60

interface Partner {
  id: number;
  name: string;
  logo_url: string;
}

const dummyDoctors = [
  {
    id: 1,
    name: 'dr. Kresna Agung Prabowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    name: 'dr. Kurniawan Eko Wibowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1594824416965-9f1844cbab54?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    name: 'dr. Josep Joko Hendratno',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
  }
]

const dummyPosts = [
  {
    slug: 'mengenal-peripheral-artery-disease',
    title: 'Mengenal Peripheral Artery Disease (PAD): Gejala dan Pencegahan',
    excerpt: 'Penyakit Arteri Perifer terjadi akibat penyumbatan aliran darah pada tungkai. Ketahui gejala awal sebelum terlambat.',
    published_at: new Date().toISOString(),
    image_url: null
  },
  {
    slug: 'perawatan-kaki-diabetes-terkini',
    title: 'Perawatan Kaki Diabetes Terkini untuk Mencegah Risiko Amputasi',
    excerpt: 'Metode revaskularisasi modern membantu mengembalikan aliran darah dan menyembuhkan luka kronis pada penderita diabetes.',
    published_at: new Date().toISOString(),
    image_url: null
  },
  {
    slug: 'tips-mengatasi-varises-secara-efektif',
    title: 'Tips Mengatasi Varises Secara Efektif dengan Metode Minimal Invasif',
    excerpt: 'Teknologi laser (EVLA) kini mempermudah penyembuhan varises tanpa rasa sakit yang berlebih dan pemulihan instan.',
    published_at: new Date().toISOString(),
    image_url: null
  }
]

const dummyPartners: Partner[] = [
  { id: 1, name: 'RS IHC Lavalette', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pertamedika_IHC_Logo.png' },
  { id: 2, name: 'RSSA Malang', logo_url: 'https://via.placeholder.com/300x150/ffffff/0f172a?text=RSSA+Malang' },
  { id: 3, name: 'Boston Scientific', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Boston_Scientific_logo.svg' },
  { id: 4, name: 'Telkom Indonesia', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Telkom_Indonesia_2013.svg' },
  { id: 5, name: 'Eureka Sukses Abadi', logo_url: 'https://via.placeholder.com/300x150/ffffff/0f172a?text=Eureka+Sukses+Abadi' },
  { id: 6, name: 'eL Hotel Kartika Wijaya', logo_url: 'https://via.placeholder.com/300x150/ffffff/0f172a?text=eL+Hotel+Kartika+Wijaya' },
  { id: 7, name: 'KPCDI', logo_url: 'https://via.placeholder.com/300x150/ffffff/0f172a?text=KPCDI' }
]

export default async function Home() {
  // Ambil 5 artikel terbaru untuk memenuhi isi slideshow
  const { data: dbPosts } = await supabase.from('posts').select('title, slug, excerpt, published_at, image_url').order('published_at', { ascending: false }).limit(5)
  const { data: dbDoctors } = await supabase.from('doctors').select('*').order('display_order', { ascending: true })
  
  let dbPartners = null;
  try {
    const { data } = await supabase.from('partners').select('*').order('display_order', { ascending: true });
    dbPartners = data;
  } catch {
    // Fallback
  }

  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : dummyPosts
  const doctors = dbDoctors && dbDoctors.length > 0 ? dbDoctors : dummyDoctors
  const partners = dbPartners && dbPartners.length > 0 ? dbPartners : dummyPartners

  const heroImg = "https://images.unsplash.com/photo-1551076805-e18690c5e53b?auto=format&fit=crop&q=80&w=2000"
  const defaultThumbnail = "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"

  return (
    <>
      {/* HERO SECTION - Ditambahkan padding bawah ekstra agar teks tidak tertutup slideshow */}
      <section className="relative h-[95vh] bg-svBlue-900 flex items-center overflow-hidden pb-32">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Vascular Surgery" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-linear-to-r from-svBlue-900 via-svBlue-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-[-10vh]">
          <div className="max-w-2xl">
            <FadeIn delay={0.1} direction="up">
              <span className="inline-block py-1 px-3 rounded-full bg-svMaroon-900/40 border border-svMaroon-600 text-red-200 text-sm font-semibold tracking-wider mb-6">
                PLATFORM EDUKASI & KESEHATAN VASKULAR
              </span>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                Kembalikan <span className="text-transparent bg-clip-text bg-linear-to-r from-svMaroon-600 to-red-400">Aliran Sehat</span> <br/>
                Kehidupan Anda.
              </h1>
            </FadeIn>
            <FadeIn delay={0.5} direction="up">
              <p className="text-lg text-slate-200 mb-10 leading-relaxed font-medium">
                Pusat informasi dan pendampingan medis subspesialis bedah vaskular & endovaskular. Kami berdedikasi untuk meningkatkan kualitas hidup masyarakat melalui edukasi kesehatan pembuluh darah.
              </p>
            </FadeIn>
            <FadeIn delay={0.7} direction="up">
              <div className="flex flex-wrap gap-4">
                <Link href="/layanan" className="px-8 py-4 bg-svMaroon-800 text-white font-bold rounded-full hover:bg-svMaroon-900 transition shadow-lg shadow-svMaroon-900/40">
                  Lihat Edukasi Medis
                </Link>
                <Link href="/tim-dokter" className="px-8 py-4 bg-transparent border-2 border-slate-400 text-white font-bold rounded-full hover:border-white transition">
                  Tim Dokter
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT NEWS SLIDESHOW SECTION */}
      <FadeIn delay={0.4} direction="up">
        <NewsCarousel posts={posts} />
      </FadeIn>

      {/* LAYANAN SECTION */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-svMaroon-800 tracking-widest uppercase mb-3 text-center">Fokus Edukasi Kami</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-svBlue-900 text-center">Penanganan Medis Vaskular</h3>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.1} direction="up">
              <Link href="/layanan/diabetic-foot" className="block p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-svMaroon-900/20 transition group h-full">
                <div className="w-14 h-14 bg-svMaroon-900/10 text-svMaroon-900 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-svMaroon-800 group-hover:text-white transition">
                  🩸
                </div>
                <h4 className="text-xl font-bold text-svBlue-900 mb-3 group-hover:text-svMaroon-800 transition-colors">Diabetic Foot</h4>
                <p className="text-slate-600 leading-relaxed">Pencegahan amputasi dan perawatan luka kaki diabetes secara komprehensif.</p>
              </Link>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <Link href="/layanan/pad" className="block p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-svMaroon-900/20 transition group h-full">
                <div className="w-14 h-14 bg-svMaroon-900/10 text-svMaroon-900 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-svMaroon-800 group-hover:text-white transition">
                  🫀
                </div>
                <h4 className="text-xl font-bold text-svBlue-900 mb-3 group-hover:text-svMaroon-800 transition-colors">Artery Disease</h4>
                <p className="text-slate-600 leading-relaxed">Penanganan penyumbatan pembuluh darah arteri di area kaki dan tangan.</p>
              </Link>
            </FadeIn>
            <FadeIn delay={0.5} direction="up">
              <Link href="/layanan/varises" className="block p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-svMaroon-900/20 transition group h-full">
                <div className="w-14 h-14 bg-svMaroon-900/10 text-svMaroon-900 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-svMaroon-800 group-hover:text-white transition">
                  🩺
                </div>
                <h4 className="text-xl font-bold text-svBlue-900 mb-3 group-hover:text-svMaroon-800 transition-colors">Varises & Vena</h4>
                <p className="text-slate-600 leading-relaxed">Tindakan laser dan pembedahan kosmetik untuk varises dan gangguan vena.</p>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TIM DOKTER SECTION */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-svMaroon-800 tracking-widest uppercase mb-3 text-center">Jaringan Pakar Medis</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-svBlue-900 text-center">Temui Tim Spesialis Kami</h3>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {doctors.map((doc, index) => (
              <FadeIn key={doc.id || index} delay={0.2 * index} direction="up">
                <Link href={`/tim-dokter/${doc.id}`} className="block text-center group">
                  <div className="relative mb-6 mx-auto w-full max-w-[320px] aspect-4/5 overflow-hidden rounded-4xl bg-linear-to-b from-slate-200 to-slate-400 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <img 
                      src={doc.image_url} 
                      alt={doc.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-svBlue-900/0 group-hover:bg-svBlue-900/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-svBlue-900 font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">Lihat Profil</span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-svBlue-900 mb-1 group-hover:text-svMaroon-800 transition-colors">{doc.name}</h4>
                  <h4 className="text-lg font-medium text-slate-500 mb-3">{doc.title}</h4>
                  <p className="inline-block px-4 py-1 rounded-full bg-svMaroon-900/10 text-svMaroon-800 font-bold tracking-widest text-xs uppercase">
                    {doc.specialty}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* KOLABORASI & MITRA SECTION */}
      <section className="py-20 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn direction="up">
            <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-10">
              Telah Berkolaborasi Bersama Berbagai Entitas Kesehatan & Korporat
            </h3>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {partners.map((partner: Partner) => (
                <div key={partner.id} className="w-28 md:w-40 h-16 relative flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-300">
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name} 
                    className="max-w-full max-h-full object-contain mix-blend-multiply" 
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ARTIKEL LAMA DI BAGIAN BAWAH (Tetap Dipertahankan 3 Saja) */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-svMaroon-800 tracking-widest uppercase mb-3 text-center">Literasi Vaskular</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-svBlue-900 text-center">Bacaan Pilihan Kami</h3>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, index) => (
              <FadeIn key={post.slug} delay={0.2 * (index + 1)} direction="up">
                <article className="group cursor-pointer bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-xl transition h-full flex flex-col">
                  <Link href={`/artikel/${post.slug}`} className="block h-48 rounded-2xl bg-slate-200 mb-6 overflow-hidden relative">
                    <img 
                      src={post.image_url || defaultThumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>
                  <div className="px-2 flex flex-col grow">
                    <time className="text-xs font-bold text-svMaroon-800 mb-3 block uppercase tracking-wider">
                      {new Date(post.published_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                    <Link href={`/artikel/${post.slug}`}>
                      <h4 className="text-xl font-bold text-svBlue-900 mb-3 group-hover:text-svMaroon-800 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 grow">
                      {post.excerpt || "Baca selengkapnya mengenai topik kesehatan vaskular ini."}
                    </p>
                    <Link href={`/artikel/${post.slug}`} className="text-svBlue-900 font-semibold text-sm flex items-center gap-2 mt-auto group-hover:text-svMaroon-800 transition-colors">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/artikel" className="inline-block px-8 py-3 bg-svBlue-900 text-white font-medium rounded-full hover:bg-svBlue-800 transition">
               Lihat Semua Artikel
             </Link>
          </div>
        </div>
      </section>
    </>
  )
}