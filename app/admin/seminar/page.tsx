'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Swal from 'sweetalert2'
import { Save, Plus, Trash2, FileText, Image as ImageIcon, Users, Settings, Loader2, UploadCloud } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminSeminarPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('settings')
  const [uploading, setUploading] = useState(false)

  // State Data
  const [settings, setSettings] = useState<any>({ 
    id: null, 
    article_slug: '', 
    contact_name: '', 
    contact_phone: '', 
    contact_role: '', 
    social_media_url: '' 
  })
  const [materials, setMaterials] = useState<any[]>([])
  const [attendees, setAttendees] = useState<any[]>([])
  const [articlesList, setArticlesList] = useState<any[]>([]) // Menyimpan daftar artikel untuk dropdown

  // State Input Form
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file_url: '', file_type: 'document' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // State khusus file foto
  const [newAttendee, setNewAttendee] = useState({ name: '', phone_number: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Fetch Settings
    const { data: setRes } = await supabase.from('seminar_settings').select('*').limit(1).single()
    if (setRes) setSettings(setRes)

    // 2. Fetch Daftar Artikel (Tabel posts)
    const { data: postRes } = await supabase.from('posts').select('id, title, slug').order('created_at', { ascending: false })
    if (postRes) setArticlesList(postRes)

    // 3. Fetch Materials & Photos
    const { data: matRes } = await supabase.from('seminar_materials').select('*').order('created_at', { ascending: false })
    if (matRes) setMaterials(matRes)

    // 4. Fetch Attendees
    const { data: attRes } = await supabase.from('seminar_attendees').select('*').order('created_at', { ascending: false })
    if (attRes) setAttendees(attRes)

    setLoading(false)
  }

  // ==========================================
  // HANDLER: PENGATURAN HALAMAN
  // ==========================================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (settings.id) {
        // Jika setting sudah ada di database, lakukan UPDATE
        const { error } = await supabase.from('seminar_settings').update({
          article_slug: settings.article_slug,
          contact_name: settings.contact_name,
          contact_phone: settings.contact_phone,
          contact_role: settings.contact_role,
          social_media_url: settings.social_media_url
        }).eq('id', settings.id)
        if (error) throw error
      } else {
        // Jika belum ada, lakukan INSERT
        const { error } = await supabase.from('seminar_settings').insert([{
          article_slug: settings.article_slug,
          contact_name: settings.contact_name,
          contact_phone: settings.contact_phone,
          contact_role: settings.contact_role,
          social_media_url: settings.social_media_url
        }])
        if (error) throw error
      }
      Swal.fire('Tersimpan!', 'Pengaturan halaman post-seminar berhasil diperbarui.', 'success')
      fetchData()
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error')
    }
  }

  // ==========================================
  // HANDLER: MATERI & FOTO
  // ==========================================
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    let finalUrl = newMaterial.file_url

    try {
      // PROSES UPLOAD FOTO KE SUPABASE STORAGE
      if (newMaterial.file_type === 'photo' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('seminar_files')
          .upload(`photos/${fileName}`, selectedFile)

        if (uploadError) throw uploadError

        // Dapatkan URL Publik
        const { data: publicUrlData } = supabase.storage
          .from('seminar_files')
          .getPublicUrl(`photos/${fileName}`)
          
        finalUrl = publicUrlData.publicUrl
      }

      // INSERT KE DATABASE
      const { error } = await supabase.from('seminar_materials').insert([{
        title: newMaterial.title,
        description: newMaterial.description,
        file_type: newMaterial.file_type,
        file_url: finalUrl
      }])

      if (error) throw error

      Swal.fire('Berhasil', 'Materi/Foto berhasil ditambahkan', 'success')
      setNewMaterial({ title: '', description: '', file_url: '', file_type: 'document' })
      setSelectedFile(null)
      fetchData()
    } catch (error: any) {
      Swal.fire('Gagal Menyimpan', error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMaterial = async (id: string, fileUrl: string, fileType: string) => {
    if (confirm('Yakin ingin menghapus item ini?')) {
      try {
        // Hapus data dari database
        const { error } = await supabase.from('seminar_materials').delete().eq('id', id)
        if (error) throw error
        
        Swal.fire('Terhapus', 'Item telah dihapus.', 'success')
        fetchData()
      } catch (error: any) {
        Swal.fire('Error', error.message, 'error')
      }
    }
  }

  // ==========================================
  // HANDLER: PESERTA
  // ==========================================
  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('seminar_attendees').insert([newAttendee])
    if (error) {
      Swal.fire('Error', 'Gagal menambahkan peserta. Pastikan nomor HP belum terdaftar.', 'error')
    } else {
      Swal.fire('Berhasil', 'Peserta berhasil ditambahkan', 'success')
      setNewAttendee({ name: '', phone_number: '' })
      fetchData()
    }
  }

  const handleDeleteAttendee = async (id: string) => {
    if (confirm('Cabut akses untuk peserta ini?')) {
      await supabase.from('seminar_attendees').delete().eq('id', id)
      fetchData()
    }
  }

  // ==========================================
  // RENDER UI
  // ==========================================
  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-svBlue-900" size={40} /></div>

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-svBlue-900 mb-8">Kelola Halaman Post-Seminar</h1>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto space-x-2 mb-6 border-b border-slate-200 hide-scrollbar">
        <button onClick={() => setActiveTab('settings')} className={`px-4 py-3 font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'settings' ? 'text-svBlue-900 border-b-2 border-svBlue-900' : 'text-slate-500'}`}>
          <Settings size={18} /> Pengaturan Utama
        </button>
        <button onClick={() => setActiveTab('materials')} className={`px-4 py-3 font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'materials' ? 'text-svBlue-900 border-b-2 border-svBlue-900' : 'text-slate-500'}`}>
          <FileText size={18} /> Kelola Materi & Foto
        </button>
        <button onClick={() => setActiveTab('attendees')} className={`px-4 py-3 font-semibold flex items-center gap-2 whitespace-nowrap ${activeTab === 'attendees' ? 'text-svBlue-900 border-b-2 border-svBlue-900' : 'text-slate-500'}`}>
          <Users size={18} /> Daftar Peserta
        </button>
      </div>

      {/* TAB 1: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* DROPDOWN ARTIKEL (Dari tabel posts) */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-sm font-bold text-svBlue-900 mb-2">Pilih Artikel Liputan Seminar</label>
              <select 
                value={settings.article_slug} 
                onChange={e => setSettings({...settings, article_slug: e.target.value})} 
                className="w-full border border-slate-300 p-3 rounded-xl bg-white focus:ring-2 focus:ring-svBlue-900 focus:outline-none" 
                required
              >
                <option value="" disabled>-- Pilih Artikel Terkait --</option>
                {articlesList.map(post => (
                  <option key={post.id} value={post.slug}>{post.title}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">Artikel ini akan ditampilkan secara eksklusif di bagian atas halaman peserta seminar.</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Nama Kontak (Sponsor/Pembicara)</label>
              <input type="text" value={settings.contact_name} onChange={e => setSettings({...settings, contact_name: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: Bpk. Budi" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Nomor WhatsApp Kontak</label>
              <input type="text" value={settings.contact_phone} onChange={e => setSettings({...settings, contact_phone: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: 628123456789" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">Peran Kontak</label>
              <input type="text" value={settings.contact_role} onChange={e => setSettings({...settings, contact_role: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: Sponsor Utama / Tim Support" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">URL Sosial Media / Website</label>
              <input type="url" value={settings.social_media_url} onChange={e => setSettings({...settings, social_media_url: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="https://instagram.com/..." />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-svBlue-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-svBlue-800 transition">
              <Save size={18} /> Simpan Pengaturan
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MATERIALS */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FORM TAMBAH MATERI / FOTO */}
          <form onSubmit={handleAddMaterial} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 h-fit">
            <h2 className="text-lg font-bold text-svBlue-900 mb-5">Tambah Konten Baru</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Tipe Konten</label>
                <select 
                  value={newMaterial.file_type} 
                  onChange={e => {
                    setNewMaterial({...newMaterial, file_type: e.target.value, file_url: ''})
                    setSelectedFile(null)
                  }} 
                  className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-svBlue-900"
                >
                  <option value="document">Dokumen / PDF (Input Link URL)</option>
                  <option value="photo">Foto Galeri (Upload Langsung)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Judul</label>
                <input type="text" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: Materi Sesi 1" required />
              </div>

              {/* LOGIKA CONDITIONAL: UPLOAD FILE VS INPUT LINK */}
              {newMaterial.file_type === 'photo' ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                  <label className="block text-sm font-semibold mb-3 text-svBlue-900 flex items-center gap-2">
                    <UploadCloud size={18}/> Pilih Foto dari Komputer
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-svBlue-100 file:text-svBlue-900 hover:file:bg-svBlue-200 transition" 
                    required 
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">Deskripsi Singkat</label>
                    <textarea value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" rows={2} placeholder="Penjelasan singkat materi..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">URL File (Google Drive, dll)</label>
                    <input type="url" value={newMaterial.file_url} onChange={e => setNewMaterial({...newMaterial, file_url: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="https://" required />
                  </div>
                </>
              )}

              <button type="submit" disabled={uploading} className="w-full bg-svBlue-900 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-svBlue-800 disabled:opacity-70 mt-2 transition">
                {uploading ? <><Loader2 className="animate-spin" size={18} /> Mengunggah...</> : <><Plus size={18} /> Simpan Konten</>}
              </button>
            </div>
          </form>

          {/* DAFTAR MATERI & FOTO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
            <h2 className="text-lg font-bold text-svBlue-900 mb-5">Daftar Materi & Galeri Tersimpan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map(mat => (
                <div key={mat.id} className="flex flex-col justify-between p-4 border border-slate-100 bg-slate-50 rounded-2xl hover:shadow-md transition">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                      {mat.file_type === 'document' ? <FileText className="text-svBlue-900" size={24} /> : <ImageIcon className="text-svMaroon-800" size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-2">{mat.title}</h4>
                      {mat.file_type === 'document' && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{mat.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200">
                    <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">
                      Lihat {mat.file_type === 'document' ? 'File' : 'Foto'}
                    </a>
                    <button onClick={() => handleDeleteMaterial(mat.id, mat.file_url, mat.file_type)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Hapus Konten">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {materials.length === 0 && <div className="col-span-full p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Belum ada dokumen atau foto yang ditambahkan.</div>}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDEES */}
      {activeTab === 'attendees' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleAddAttendee} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-1 h-fit">
            <h2 className="text-lg font-bold text-svBlue-900 mb-5">Beri Akses Peserta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Nama Lengkap Peserta</label>
                <input type="text" value={newAttendee.name} onChange={e => setNewAttendee({...newAttendee, name: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="Contoh: dr. Andi" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Nomor WhatsApp</label>
                <input type="text" value={newAttendee.phone_number} onChange={e => setNewAttendee({...newAttendee, phone_number: e.target.value})} className="w-full border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-svBlue-900" placeholder="0812..." required />
              </div>
              <button type="submit" className="w-full bg-svBlue-900 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-svBlue-800 transition mt-2">
                <Plus size={18} /> Tambah Akses
              </button>
            </div>
          </form>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
            <h2 className="text-lg font-bold text-svBlue-900 mb-5">Peserta Terdaftar ({attendees.length})</h2>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-700 text-sm">Nama Peserta</th>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-700 text-sm">Nomor HP</th>
                    <th className="p-4 border-b border-slate-200 font-bold text-slate-700 text-sm text-center">Cabut Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendees.map(att => (
                    <tr key={att.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-medium text-slate-800">{att.name}</td>
                      <td className="p-4 text-slate-600 font-mono text-sm">{att.phone_number}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteAttendee(att.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {attendees.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-400">Belum ada peserta yang didaftarkan.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}