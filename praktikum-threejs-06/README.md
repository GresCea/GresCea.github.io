# Three.js Mini 3D Scene

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
Aplikasi 3D berbasis WebGL menggunakan library Three.js yang menampilkan berbagai 3D primitive geometry (Cube, Sphere, Cylinder, Torus, Plane), Material Gallery (Basic, Normal, Lambert, Phong), serta sistem pencahayaan (Ambient & Directional Light) dengan dynamic shadows. Aplikasi ini dilengkapi dengan HUD informasi scene interaktif (FPS, Triangles, Object Count), fitur toggle kamera (Perspective/Orthographic), serta kontrol posisi objek secara manual.

## Link web aplikasi
[Three.js Mini 3D Scene](https://grescea.github.io/praktikum-threejs-06)

## Kontrol keyboard & Mouse
- `Arrow Up / Down / Left / Right`: Menggerakkan posisi Cube pada sumbu X dan Z.
- `Q / E`: Memutar (rotasi) Cube pada sumbu Y.
- `Space`: Pause/resume animasi rotasi objek dan pergerakan cahaya.
- `P`: Toggle mode kamera antara Perspective Camera dan Orthographic Camera.
- `1 / 2 / 3`: Mengubah kualitas resolusi bayangan (Shadow Map: 512, 1024, 2048).
- `R`: Reset state ke nilai default (posisi, rotasi, kamera, shadow, dan animasi).
- `Mouse Drag (Kiri)`: Orbit/memutar kamera (OrbitControls).
- `Mouse Scroll`: Zoom in / Zoom out.
- `Mouse Right Drag (Kanan)`: Pan/menggeser kamera.

## Nilai default
- Jenis Kamera: `Perspective`
- Shadow Quality: `1024x1024`
- Status Animasi: `ON (PLAYING)`
- Posisi awal Cube: `(-1.2, 0.6, 2)`
- Target kamera (OrbitControls): `(0, 0.8, 0)`
- Background color: `#050816` / `0x0b1020`

## Cara menjalankan
Jalankan folder ini menggunakan local development server (seperti ekstensi **Live Server** di VS Code atau Python `http.server`), lalu buka `index.html` pada browser modern yang mendukung WebGL. Catatan: Harus menggunakan local server karena aplikasi ini memuat Three.js menggunakan standar ES Modules (`importmap`).

## Catatan debugging
Pastikan koneksi internet Anda aktif saat pertama kali memuat halaman karena library Three.js diimpor langsung melalui CDN (`jsdelivr`). Jika objek tidak tampil atau layar hanya berwarna gelap, buka Console (F12) untuk melihat error terkait CORS atau module import. Jika bayangan terlihat *pixelated* (patah-patah), tekan tombol `2` atau `3` untuk meningkatkan resolusi Shadow Map.