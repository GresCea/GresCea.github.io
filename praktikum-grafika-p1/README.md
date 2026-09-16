# WebGL Fundamental Playground

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
Aplikasi WebGL2 untuk mempelajari pipeline grafis di browser, meliputi pengenalan WebGL context, vertex data, buffer, pembuatan vertex & fragment shader, serta rendering objek primitif dasar beserta warnanya.

## Link web aplikasi
[Praktikum 1 - Graphics Playground dengan HTML Canvas 2D](https://grescea.github.io/praktikum-grafika-p1)

## Primitive yang digunakan
- Triangle
- Rectangle (dibuat dari 2 triangle)
- Line-based shape

## Draw mode
- `gl.TRIANGLES`
- `gl.LINES` / `gl.LINE_LOOP`
- `gl.POINTS`

## Fitur animasi
- Objek primitive yang bergerak secara kontinu.
- Bouncing effect: objek akan memantul ketika mencapai batas canvas (koordinat NDC).

## Fitur interaksi
- **Keyboard (State-based)**: Menggerakkan primitive secara kontinu menggunakan tombol Arrow (Up, Down, Left, Right).
- **Keyboard (Event-based)**: Tombol 'R' untuk mereset posisi primitive ke titik awal.

## Challenge yang dikerjakan
- Challenge B - Color Control: Menambahkan kontrol untuk mengganti warna primitive.
- Challenge F - Simple HUD: Menampilkan teks HTML di luar canvas berupa jumlah primitive, draw mode aktif, dan posisi mouse (pixel to NDC).

## Cara menjalankan project
Jalankan menggunakan Vite atau local development server biasa, kemudian buka `index.html` di browser yang mendukung WebGL2.

Contoh menggunakan Vite:
1. Buka folder `praktikum-webgl-02`.
2. Jalankan perintah `npm install`.
3. Jalankan perintah `npm run dev`.
4. Buka tautan localhost yang muncul di terminal.

Contoh dengan VS Code Live Server:
1. Buka folder `praktikum-webgl-02` di VS Code.
2. Klik kanan pada file `index.html` lalu pilih "Open with Live Server".
3. Browser akan otomatis membuka halaman tersebut.