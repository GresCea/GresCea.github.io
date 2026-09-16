# Interactive Transformation Playground

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
Aplikasi WebGL2 untuk mempelajari transformation dan coordinate system 2D menggunakan model matrix 3x3.

## Link web aplikasi
[Praktikum 3 - Interactive Transformation & Coordinate System dengan WebGL](https://grescea.github.io/praktikum-transform-03)

## Kontrol keyboard
- Arrow Keys: translation object A
- Q/E: rotation object A
- +/-: uniform scaling object A
- Z/X: scaling sumbu X
- C/V: scaling sumbu Y
- R: reset object A

## Transformasi yang digunakan
- Translation
- Rotation
- Uniform scaling
- Non-uniform scaling
- Matrix composition
- Homogeneous coordinate

## Transform order yang dibandingkan
- Scale -> Rotate -> Translate
- Translate -> Rotate

## Challenge yang dikerjakan
- Coordinate axes dan world origin
- Reset transform
- Transform order comparison

## Cara menjalankan project
Jalankan melalui local development server, kemudian buka `praktikum-transform-03/index.html` di browser yang mendukung WebGL2.

Contoh dengan VS Code Live Server:

1. Buka folder `praktikum-transform-03`.
2. Jalankan Live Server.
3. Buka `index.html`.

## Catatan debugging
- Pastikan WebGL2 tersedia.
- Periksa shader compile error dan program link error di console.
- Pastikan angle dikonversi dari degree ke radian.
- Pastikan matrix dikirim sebelum draw call.
- Pastikan position tidak keluar dari NDC.
- Pastikan matrix convention konsisten.