export const metadata = {
    title: 'Hubungi Kami | Sehat Vaskular',
  }
  
  export default function KontakPage() {
    return (
      <>
        <div className="bg-svBlue-900 py-20 border-t border-svBlue-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Hubungi Kami</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Kami siap menjawab pertanyaan Anda dan mengatur jadwal konsultasi medis.
            </p>
          </div>
        </div>
  
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            
            {/* Info Kontak */}
            <div>
              <h2 className="text-3xl font-bold text-svBlue-900 mb-8">Informasi Klinik</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm text-svMaroon-900 border border-slate-100 flex-shrink-0">📍</div>
                  <div>
                    <h4 className="font-bold text-svBlue-900 text-lg">Alamat Praktik</h4>
                    <p className="text-slate-600 mt-1">Jl. Contoh Rumah Sakit No. 123,<br/>Kecamatan Medis, Kota Sehat 12345</p>
                  </div>
                </div>
  
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm text-svMaroon-900 border border-slate-100 flex-shrink-0">🕒</div>
                  <div>
                    <h4 className="font-bold text-svBlue-900 text-lg">Jam Operasional</h4>
                    <p className="text-slate-600 mt-1">Senin - Jumat: 08.00 - 20.00 WIB<br/>Sabtu: 08.00 - 14.00 WIB</p>
                  </div>
                </div>
  
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm text-svMaroon-900 border border-slate-100 flex-shrink-0">📞</div>
                  <div>
                    <h4 className="font-bold text-svBlue-900 text-lg">Layanan Cepat</h4>
                    <p className="text-slate-600 mt-1">Telepon: 0822-4564-5756</p>
                    <a href="https://wa.me/6282245645756" target="_blank" rel="noreferrer" className="inline-block mt-3 px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition shadow-md">
                      Chat WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Dummy Map Area */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="w-full h-[400px] bg-slate-200 rounded-2xl flex items-center justify-center">
                <span className="text-slate-500 font-medium">Embed Google Maps Di Sini</span>
                {/* Anda bisa mengganti div ini dengan <iframe> dari Google Maps nanti */}
              </div>
            </div>
  
          </div>
        </section>
      </>
    )
  }