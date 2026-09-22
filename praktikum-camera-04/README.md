# Rotating 3D Cube Camera Playground

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
Aplikasi WebGL2 untuk mempelajari cube 3D, Model Matrix, View Matrix, camera, Perspective Projection, Orthographic Projection, FOV, clipping, dan Depth Test.

## Link web aplikasi
[Praktikum 4 - Camera, Projection & 3D dengan WebGL](https://grescea.github.io/praktikum-camera-04)

## Kontrol camera
- Arrow Left/Right: mengubah posisi camera X.
- Arrow Up/Down: mengubah posisi camera Y.
- W/S: mengubah posisi camera Z.
- K: pause atau resume rotasi otomatis kubus.
- R: reset seluruh state.

## Projection yang tersedia
- Perspective Projection, mode awal.
- Orthographic Projection, tekan `P` untuk toggle.

## FOV default
`60` derajat. Tekan `[` atau `]` untuk mengurangi atau menambah FOV saat mode perspective aktif.

Preset FOV:
- `1`: `35` derajat
- `2`: `60` derajat
- `3`: `90` derajat

## Near/Far preset
Tekan `N` untuk berganti preset:

- `0.1 / 100`
- `1 / 20`
- `2.5 / 8`

## Depth Test toggle
Tekan `D` untuk mengaktifkan atau menonaktifkan Depth Test. Depth buffer tetap dibersihkan setiap frame.

## Rotasi Kubus
Cube berotasi secara otomatis pada:
- Sumbu X dengan kecepatan `25` derajat per detik.
- Sumbu Y dengan kecepatan `40` derajat per detik.

Tekan `K` untuk menghentikan rotasi. Tekan `K` kembali untuk melanjutkan rotasi dari posisi terakhir.

## Challenge yang dikerjakan
- Camera position control.
- Camera height control melalui Arrow Up/Down.
- Projection comparison melalui toggle perspective/orthographic.
- FOV preset melalui tombol `1`, `2`, dan `3`.
- Multiple cube pada kedalaman berbeda.

## Cara menjalankan
Jalankan folder ini melalui local development server, kemudian buka `index.html` pada browser yang mendukung WebGL2.

Contoh dengan VS Code Live Server:

1. Buka folder `praktikum-camera-04`.
2. Jalankan Live Server.
3. Buka `index.html`.

## Catatan debugging
Jika cube tidak muncul, periksa WebGL2 context, shader compile, program link, position/color buffer, attribute size `3`, Model/View/Projection Matrix, camera, near/far, viewport, dan draw count `36`.