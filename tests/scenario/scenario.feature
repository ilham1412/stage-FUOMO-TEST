Fitur: Validasi Halaman Homepage Website

  Tujuan:
  Memastikan halaman homepage website dapat diakses dengan baik,
  menampilkan elemen utama dengan benar, serta navigasi berfungsi
  pada berbagai perangkat.

  Skenario 1: Homepage dapat dimuat dengan sukses
    Given pengguna membuka halaman homepage website
    When halaman selesai dimuat
    Then halaman tidak menampilkan error
    And status response website adalah 200
    And judul halaman website tidak kosong


  Skenario 2: Elemen utama homepage tampil dengan benar
    Given pengguna berada di halaman homepage website
    When halaman selesai dimuat sepenuhnya
    Then logo website terlihat pada halaman
    And menu navigasi utama terlihat
    And hero banner atau bagian utama halaman terlihat
    And bagian footer website terlihat


  Skenario 3: Navigasi menu berfungsi dengan baik
    Given pengguna berada di halaman homepage website
    When pengguna mengklik salah satu menu navigasi
    Then pengguna diarahkan ke halaman tujuan
    And halaman tujuan berhasil dimuat tanpa error


  Skenario 4: Homepage dapat ditampilkan pada desktop dan mobile
    Given pengguna membuka homepage pada tampilan desktop
    When halaman selesai dimuat
    Then homepage tampil dengan baik pada tampilan desktop

    Given pengguna membuka homepage pada tampilan mobile
    When halaman selesai dimuat
    Then homepage tetap dapat ditampilkan dengan baik pada tampilan mobile