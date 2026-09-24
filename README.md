---
name: solpaci-a-full
owner: astra
date: 2026-09-24
status: internal-design-preview
---

# Solpaċi A — Soft Editorial

Preview frontend mandiri tujuh halaman. **Bukan toko aktif**, bukan file Figma, bukan template Elementor, dan belum merupakan persetujuan klien.

## Buka preview

Buka langsung:

`file:///C:/Lucky%20punya%20dataset/Solpaci/assets/design-a-full/index.html`

Atau buka file `C:\Lucky punya dataset\Solpaci\assets\design-a-full\index.html` di browser. Tidak ada instalasi npm, CDN, font eksternal, atau koneksi internet yang dibutuhkan. JavaScript harus aktif untuk konten interaktif; tanpa JavaScript tersedia penjelasan singkat dan navigasi fallback.

Jika penyimpanan `file://` dibatasi browser, gunakan server lokal (jalankan sendiri, berhenti dengan Ctrl+C):

```bat
"C:\Users\LENOVO\AppData\Local\Programs\Python\Python314\python.exe" -m http.server 8086 --bind 127.0.0.1 --directory "C:\Lucky punya dataset\Solpaci\assets\design-a-full"
```

Lalu buka `http://127.0.0.1:8086/index.html`. Keranjang untuk `file://` dan HTTP adalah penyimpanan terpisah. Perilaku localStorage file lokal dapat berbeda antarbrowser.

## Isi dan perilaku

Semua output berada di `C:\Lucky punya dataset\Solpaci\assets\design-a-full`:

- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\index.html` — hero, koleksi, cerita, FAQ, footer.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\shop.html` — filter lembut/berani, pencarian, urutan nama, empty state.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\product.html` — empat detail shade via `?shade=01` sampai `04`, botol/swatch, jumlah, related shades, invalid state.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\cart.html` — jumlah, hapus, subtotal, empty state.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\checkout.html` — form data rekaan terkunci, opsi simulasi, consent wajib, konfirmasi tanpa transaksi.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\about.html` — usulan narasi brand; tidak mengarang sejarah pendiri/perusahaan.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\faq.html` — produk, belanja, preview/privasi.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\app.js` — render dan interaksi plain JavaScript.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\catalog.js` — empat shade demo yang sama dengan studi awal.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\styles.css` — responsive CSS, serif heading, sans body, fokus keyboard, reduced motion.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\tokens.json` — design system tokens (warna, tipografi, spacing, breakpoint, radius, shadow, grid). Ditulis terakhir setelah styling stabil, jadi acuan handover ke Elementor/WooCommerce. Tidak di-fetch saat runtime agar tetap offline.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\images` — sepuluh SVG lokal: hero editorial, ikon, empat botol dan empat swatch. Ilustrasi studi awal disalin read-only, bukan foto klien.

Bahasa ID/EN mengikuti parameter `lang=id` / `lang=en` dan pilihan browser. Tagline editorial Inggris dipertahankan sebagai bagian konsep di kedua bahasa. Shade dan mata uang rupiah tidak berubah saat bahasa diganti. Harga keempat produk sama, sehingga pengurutan yang ditawarkan adalah urutan koleksi / nama A–Z / nama Z–A, bukan opsi harga yang tidak memberi perbedaan.

Keranjang memakai key **khusus A** `solpaci-a-demo-cart-v1`, bahasa `solpaci-a-lang`. Tidak membaca/menulis key B. Jumlah 1–10 per shade adalah batas demo, bukan stok. Data rusak/asing disaring saat dibaca. Jika localStorage diblokir, aplikasi menampilkan peringatan dan hanya menyimpan state sementara pada halaman aktif. Perubahan keranjang juga diselaraskan antartab HTTP.

Checkout tidak meminta nama/alamat/email asli, tidak mengirim form, tidak membuat nomor pesanan, QR, atau instruksi transfer. Opsi reguler/ekspres dan VA/QRIS hanya demonstrasi UI. Ongkir/pajak tidak dianggap gratis; semuanya **belum dihitung**. Konfirmasi tidak mengosongkan keranjang. Pilihan checkout tidak disimpan.

## Visual & screenshot

Palet usulan: cream `#FFF8F0`, light pink `#FBE4E6`, soft pink `#F5C2C7`, teks `#1A1A1A`. Heading Georgia/system serif dan body Arial/system sans agar offline. Breakpoint mobile 700 px, penyesuaian tablet 1000 px. Grid katalog: empat kolom desktop, dua kolom mobile.

- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\home-desktop.png` — homepage penuh, lebar 1440 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\home-mobile.png` — homepage penuh, lebar 390 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\shop-desktop.png` — koleksi, lebar 1440 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\product-desktop.png` & `product-mobile.png` — detail shade, lebar 1440 / 390 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\cart-desktop.png` — keranjang, lebar 1440 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\checkout-desktop.png` — checkout simulasi, lebar 1440 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\about-desktop.png` — cerita brand, lebar 1440 px.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\preview-screenshots\faq-desktop.png` — daftar pertanyaan, lebar 1440 px.

## Pengujian yang dapat diulang

Menggunakan Python Playwright dan Node yang sudah tersedia, tanpa dependency baru:

```bat
"C:\Users\LENOVO\AppData\Local\Programs\Python\Python314\python.exe" "C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\test_preview.py"
```

Hasil khusus A, jangan mengacu pada 339 pemeriksaan preview lama:

- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\qa-results.json` — status, daftar pemeriksaan dan browser aktual.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\qa-run.log` — log eksekusi.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\baseline.json` — hash preview lama dan B sebelum pekerjaan A.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\inventory.json` — file, byte, total ukuran yang dihasilkan finalizer.
- `C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\final-verification.json` — verifikasi akhir token/warna, file, sintaks, serta hash folder lama.

Suite memeriksa tujuh halaman × dua bahasa × lebar 320/390/768/1440/1920 px; link lokal, gambar, overflow, ID unik, grid, mobile navigation, filter/search/sort, detail shade, batas/persistensi/normalisasi keranjang, checkout consent dan konfirmasi, FAQ/skip link keyboard, storage diblokir, offline `file://`, serta fallback tanpa JS. Server tes hanya bind loopback dan berhenti setelah tes.

**Batas QA:** Chromium, bukan pengujian lintas-browser atau audit WCAG lengkap. Uji integrasi WooCommerce/payment/shipping tidak termasuk. Tidak ada klaim bahwa preview siap produksi.

`C:\Lucky punya dataset\Solpaci\assets\design-a-full\build\setup.py` adalah scaffold satu kali; **jangan direrun** untuk mengubah desain. Edit file final langsung. Seluruh script QA hanya menulis ke folder A; baseline membaca folder lama untuk memastikan tidak berubah.

## Handover untuk Claude

1. Review internal Lucky lebih dulu; tidak ada desain yang dikirim otomatis ke klien.
2. Logo/wordmark, font final, foto, bentuk kemasan, nama/warna shade, harga Rp99.000, copy, formula/volume, kebijakan, ongkir/pajak, dan kontak resmi masih menunggu aset/data/ACC klien. Tidak ada klaim ketahanan, sertifikasi, testimoni, stok, atau best-seller yang direka.
3. Gunakan token dan screenshot sebagai spesifikasi visual, bukan bukti kompatibilitas widget Elementor Free. Implementasi produksi tetap WordPress/WooCommerce.
4. Cart, checkout, stok, pembayaran, shipping, bilingual produk, privasi dan validasi server harus memakai implementasi produksi, **bukan localStorage/checkout demo ini**.
5. Native `.fig`, export JSON Elementor, PHP/SQL, hosting, payment dan shipping tidak dibuat atau disentuh dalam pekerjaan ini.
6. Preview A/B awal, B full, scratchpad, kredensial, dokumen koordinasi backend, dan folder review bersama tidak diedit. B tetap pending.