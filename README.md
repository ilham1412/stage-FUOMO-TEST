# fuomo-Test
Proyek ini berisi automated end-to-end test untuk website FUOMO menggunakan Playwright dan TypeScript. Pengujian mencakup validasi halaman homepage pada berbagai browser desktop maupun mobile.

---
## Daftar Isi
- [Cara Setup Project](#cara-setup-project)
- [Cara Menjalankan Test Secara Lokal](#cara-menjalankan-test-secara-lokal)
- [Cara CI Menjalankan Test](#cara-ci-menjalankan-test)
- [Strategi Testing](#strategi-testing)
---

## Cara Setup Project
### Prasyarat

- Node.js versi LTS atau lebih baru
- npm

### Langkah Instalasi

1. Clone repositori ini, lalu masuk ke direktori project:
   git clone https://github.com/ilham1412/stage-FUOMO-TEST.git
   cd fuomo-Test

2. Install dependensi Node.js:
   npm install
   
3. Install browser yang dibutuhkan oleh Playwright:
   npx playwright install --with-deps
   
4. Buat file `.env` di root project berdasarkan file contoh yang tersedia:
   cp .env.example .env

   Kemudian isi nilai `BASE_URL` di dalam file `.env` dengan URL target yang ingin diuji:
   ```
   BASE_URL=https://example.com
   ```

---
## Cara Menjalankan Test Secara Lokal

Pastikan file `.env` sudah dikonfigurasi dengan benar sebelum menjalankan test.
Menjalankan semua test di semua browser:

```bash
npx playwright test
npx playwright test --ui
```
Menjalankan test pada browser tertentu saja:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

Menjalankan test dalam mode debug (membuka browser secara visual):
```bash
npx playwright test --debug
```

Melihat laporan HTML setelah test selesai dijalankan:
```bash
npx playwright show-report
```
Hasil test juga tersedia dalam format JUnit XML di `test-results/junit.xml`.

---
### Cross-Browser dan Cross-Device
Seluruh test dijalankan secara paralel di lima konfigurasi browser dan perangkat:

- Desktop Chrome (Chromium)
- Desktop Firefox
- Desktop Safari (WebKit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

Page Object juga menangani perbedaan tampilan antara desktop dan mobile secara otomatis, misalnya dengan memilih selector navigasi yang berbeda berdasarkan lebar viewport.

## Cara CI Menjalankan Test

CI dikonfigurasi menggunakan GitHub Actions melalui file `.github/workflows/playwright.yml`. Pipeline akan otomatis berjalan pada setiap event berikut:

- Push ke branch `main` atau `master`
- Pull request yang menargetkan branch `main` atau `master`

Tahapan yang dijalankan oleh CI:
1. Checkout kode dari repositori
2. Setup Node.js versi LTS
3. Install dependensi menggunakan `npm ci`
4. Install browser Playwright beserta dependensi sistemnya
5. Jalankan seluruh test suite dengan environment variable `BASE_URL` yang sudah dikonfigurasi di level CI
6. Upload hasil laporan HTML sebagai artifact yang dapat diunduh, dengan retensi selama 30 hari

Pada lingkungan CI, beberapa konfigurasi tambahan diberlakukan secara otomatis:
- Test tidak diizinkan untuk menggunakan `.only` (forbidOnly aktif)
- Setiap test gagal akan diulangi hingga 2 kali sebelum dianggap benar-benar gagal
- Jumlah worker dibatasi menjadi 1 untuk menjaga stabilitas eksekusi
---

## Strategi Testing
### Pendekatan

Proyek ini menggunakan pendekatan Page Object Model (POM). Setiap halaman yang diuji direpresentasikan sebagai sebuah kelas tersendiri di dalam folder `pages/`. Hal ini memisahkan logika interaksi halaman dari logika pengujian, sehingga test lebih mudah dibaca, dikelola, dan diperluas.

### Cakupan Test
Test berfokus pada halaman homepage dan mencakup empat skenario utama:

| Nama Test | Deskripsi |
|---|---|
| Page Loads Successfully | Memastikan halaman dapat diakses, mengembalikan status HTTP 200, dan judul halaman sesuai |
| Validasi Elemen UI Utama | Memastikan elemen kunci seperti logo, navigasi, konten utama, dan footer tampil dengan benar |
| Navigation Link help Berfungsi | Memastikan menu Help mengarahkan pengguna ke halaman `/support` |
| Navigation Creator Menu Berfungsi | Memastikan menu Creator mengarahkan pengguna ke halaman `/creators` |


## Known Issues & Solusi
### Navigation Element Tidak Terdeteksi di Mobile Viewport

**Masalah:**
Saat menjalankan test menggunakan device mobile (Mobile Chrome / Mobile Safari),
elemen navigasi seperti `a[aria-label="Go to Creators"]` tidak terdeteksi sebagai
visible oleh Playwright, meskipun elemen terhitung ada di DOM (`count: 1`).

```typescript
console.log('count:', await creator.count()); 'count 1'
console.log('isVisible:', await creator.isVisible()); 'false'
```

**Penyebab:**
Website menggunakan dua versi navbar yang berbeda berdasarkan breakpoint Tailwind CSS:
- Desktop (`sm:flex hidden`) — visible di viewport ≥ 640px
- Mobile (`sm:hidden`) — visible di viewport < 640px

Locator yang awalnya digunakan merujuk ke elemen desktop yang ter-hide di mobile,
sehingga `boundingBox()` mengembalikan `null` dan elemen dianggap tidak visible.

**Solusi:**
Menyimpan dua locator terpisah di constructor Page Object Model, lalu memilih
locator yang tepat di dalam method berdasarkan lebar viewport saat test dijalankan:

```typescript
// Constructor — simpan dua locator
this.creatorMenuDesktop = page.locator('.hidden.sm\\:flex a[aria-label="Go to Creators"]');
this.creatorMenuMobile = page.locator('.sm\\:hidden a[href="/creators"]');

// Method — pilih locator sesuai viewport
async clickCreatorMenu() {
    const isMobile = this.page.viewportSize()!.width < 640;
    if (isMobile) {
        await this.creatorMenuMobile.click();
    } else {
        await this.creatorMenuDesktop.click();
    }
}
```
Breakpoint `640px` dipilih karena sesuai dengan breakpoint `sm:` pada Tailwind CSS
yang digunakan oleh website.

### Pelaporan dan Artefak

- **HTML Report**: Laporan interaktif yang dapat dibuka di browser, tersedia setelah test selesai
- **JUnit XML**: Tersimpan di `test-results/junit.xml`, tersedia setelah test selesai
- **Trace**: Direkam pada percobaan ulang pertama untuk membantu debugging
- **Screenshot**: Diambil secara otomatis hanya saat test gagal


test 1