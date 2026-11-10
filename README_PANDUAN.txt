PANDUAN PLANTCARE AI — GRATIS
=============================

A. LATIH MODEL
1. Buka https://teachablemachine.withgoogle.com/
2. Pilih Get Started > Image Project > Standard image model.
3. Buat 20 kelas dengan nama persis:
Kelor_Sehat, Kelor_Bergejala
Pepaya_Sehat, Pepaya_Bergejala
Pisang_Sehat, Pisang_Bergejala
Singkong_Sehat, Singkong_Bergejala
Mangga_Sehat, Mangga_Bergejala
Kelapa_Sehat, Kelapa_Bergejala
Sukun_Sehat, Sukun_Bergejala
Nangka_Sehat, Nangka_Bergejala
Cabai_Sehat, Cabai_Bergejala
Tomat_Sehat, Tomat_Bergejala
4. Isi setiap kelas dengan foto asli dan beragam. Target awal 30–50 foto berbeda per kelas jika memungkinkan.
5. Sisihkan foto berbeda untuk pengujian. Jangan menguji hanya dengan foto latihan.
6. Tekan Train Model. Uji model. Pilih Export Model > TensorFlow.js, lalu host/unggah model dengan opsi yang disediakan. Salin URL dasar publik model yang memiliki model.json dan metadata.json.

B. MASUKKAN URL MODEL
1. Buka app.js di VS Code.
2. Cari baris: const MODEL_URL = "GANTI_DENGAN_URL_MODEL_TEACHABLE_MACHINE/";
3. Ganti teks itu dengan URL dasar model milik Anda. Pertahankan tanda kutip dan slash akhir. Jangan memakai URL contoh yang tidak diberikan Teachable Machine.

C. UJI DI LAPTOP
1. Simpan ketiga file: index.html, style.css, app.js.
2. Buka folder di VS Code. Gunakan ekstensi Live Server (gratis) lalu klik kanan index.html > Open with Live Server.
3. Pastikan internet aktif untuk memuat library dan model.
4. Unggah foto lalu tekan Identifikasi dengan AI. Uji kamera dan riwayat.
5. Kamera membutuhkan HTTPS atau localhost dan izin kamera browser.

D. PUBLIKASIKAN KE GITHUB PAGES
1. Buat repository GitHub bernama plantcare-ai.
2. Unggah index.html, style.css, app.js ke root repository.
3. Pastikan MODEL_URL sudah benar.
4. Buka Settings > Pages.
5. Pilih Deploy from a branch, branch main, folder /(root), lalu Save.
6. Buka alamat Pages yang muncul setelah deployment selesai.

CATATAN
- Riwayat disimpan di browser perangkat (localStorage), bukan disinkronkan antarperangkat. Data browser yang dihapus dapat menghapus riwayat.
- Persentase adalah skor keluaran model, bukan jaminan diagnosis.
- Kelas Bergejala bukan identifikasi penyakit tertentu. Saran bersifat umum.
- Jika kelas Anda memakai nama lain, sesuaikan label model atau fungsi parseLabel di app.js.
