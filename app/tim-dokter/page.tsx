import { supabase } from '@/lib/supabase'
import FadeIn from '@/components/FadeIn'
import Link from 'next/link'

export const metadata = {
  title: 'Tim Dokter Spesialis Vaskular | Sehat Vaskular',
  description: 'Profil tim dokter spesialis bedah vaskular dan endovaskular.',
}

const dummyDoctors = [
  {
    id: 1,
    name: 'dr. Kresna Agung Prabowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    focus: 'Penanganan komprehensif penyakit arteri perifer dan penyelamatan luka kaki diabetes.'
  },
  {
    id: 2,
    name: 'dr. Kurniawan Eko Wibowo',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1594824416965-9f1844cbab54?auto=format&fit=crop&q=80&w=800',
    focus: 'Spesialisasi pada terapi endovaskular laser untuk varises dan pembuatan akses hemodialisa (Cimino).'
  },
  {
    id: 3,
    name: 'dr. Josep Joko Hendratno',
    title: 'Sp.B, Subsp.BVE (K)',
    specialty: 'PESBEVI',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    focus: 'Ahli intervensi minimal invasif pembuluh darah, penanganan thrombosis vena dalam (DVT) dan trauma vaskular.'
  }
]

export default async function TimDokterPage() {
  const { data: dbDoctors } = await supabase
    .from('doctors')
    .select('*')
    .order('display_order', { ascending: true })

  const doctors = dbDoctors && dbDoctors.length > 0 ? dbDoctors : dummyDoctors

  return (
    <>
      <div className="bg-svBlue-900 py-20 border-t border-svBlue-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Pakar Medis Kami</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Ditangani langsung oleh tim subspesialis yang berdedikasi tinggi pada pemulihan aliran darah dan kesehatan vaskular Anda.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid gap-12">
          {doctors.map((doc, idx) => (
            <FadeIn key={doc.id || idx} delay={0.1 * idx} direction="up">
              {/* Menambahkan wrapper Link ke profil dokter spesifik */}
              <Link href={`/tim-dokter/${doc.id}`} className="block flex flex-col md:flex-row gap-8 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:border-svMaroon-800/30 transition-all duration-300 group">
                <div className="w-full md:w-56 h-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-slate-200 relative">
                  <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-svBlue-900/0 group-hover:bg-svBlue-900/20 transition-colors duration-300"></div>
                </div>
                <div className="flex flex-col justify-center grow">
                  <span className="text-svMaroon-800 font-bold text-sm tracking-widest uppercase mb-2">TIM SPESIALIS</span>
                  <h3 className="text-3xl font-bold text-svBlue-900 mb-1 group-hover:text-svMaroon-800 transition-colors">{doc.name},</h3>
                  <h4 className="text-xl font-semibold text-svBlue-800 mb-4">{doc.title}</h4>
                  <p className="text-slate-400 font-bold tracking-wider text-xs uppercase mb-4">{doc.specialty}</p>
                  <h5 className="text-sm font-bold text-svBlue-900 mb-2">Fokus Klinis:</h5>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {doc.focus || 'Melayani konsultasi dan tindakan operatif maupun endovaskular invasif minimal untuk penyakit pembuluh darah.'}
                  </p>
                  <span className="inline-flex mt-auto items-center gap-2 font-bold text-svBlue-900 group-hover:text-svMaroon-800 transition-colors w-fit">
                    Lihat Profil Lengkap →
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  )
}