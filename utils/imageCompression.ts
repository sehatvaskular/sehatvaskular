import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
  // Pilihan konfigurasi kompresi
  const options = {
    maxSizeMB: 0.5,           // Ukuran maksimal 500KB (Sangat aman dan ringan)
    maxWidthOrHeight: 1200,   // Resolusi maksimal 1200px (Kualitas tetap bagus untuk web)
    useWebWorker: true,       // Menggunakan proses latar belakang agar web tidak lag
    fileType: 'image/webp',   // Mengonversi otomatis ke format WebP (opsional tapi disarankan)
  };

  try {
    // Proses kompresi
    const compressedFile = await imageCompression(file, options);
    
    // Mengubah nama file agar unik (mencegah bentrok di Supabase)
    const newFileName = `${Date.now()}-${compressedFile.name.replace(/\.[^/.]+$/, "")}.webp`;
    
    // Mengembalikan file baru yang sudah dikompres dan diganti nama
    return new File([compressedFile], newFileName, {
      type: 'image/webp',
    });
  } catch (error) {
    console.error('Gagal mengompresi gambar:', error);
    return file; // Jika gagal, kembalikan file aslinya sebagai cadangan
  }
};