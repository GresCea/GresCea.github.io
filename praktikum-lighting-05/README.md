# Textured and Lit Cube Playground

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
Aplikasi WebGL2 yang menggabungkan cube 3D, normal, UV, checkerboard texture procedural, ambient lighting, diffuse lighting, specular lighting, Normal Matrix, flat/smooth shading, filtering, wrapping, kontrol posisi cahaya, serta rotasi cube secara otomatis dan manual.


## Link web aplikasi
[Praktikum 5 - Lighting, Shading & Texture pada WebGL](https://grescea.github.io/praktikum-lighting-05)

## Kontrol keyboard
- Arrow: mengubah posisi light X/Y.
- W/S: mengubah posisi light Z.
- I/K: memutar cube pada sumbu X.
- J/L: memutar cube pada sumbu Y.
- P: pause/resume rotasi otomatis cube.
- F: toggle FLAT/SMOOTH shading.
- T: toggle LINEAR/NEAREST filtering.
- G: toggle REPEAT/CLAMP_TO_EDGE/MIRRORED_REPEAT wrapping.
- `[ / ]`: mengubah UV scale.
- `- / +`: mengubah shininess.
- `R`: reset state ke nilai default.

## Nilai default
- Ambient strength: `0.18`
- Shininess: `32`
- UV scale: `1`
- Filtering: `LINEAR`
- Wrapping: `REPEAT`
- Shading: `FLAT`
- Light position: `(2, 2, 2)`
- Cube rotation X: `20°`
- Cube rotation Y: `30°`
- Rotasi otomatis: `PLAYING`
- Kecepatan rotasi X: `25°/detik`
- Kecepatan rotasi Y: `40°/detik`

## Cara menjalankan
Jalankan folder ini dengan local development server, lalu buka `index.html` pada browser yang mendukung WebGL2.

## Catatan debugging
Periksa shader compile/link, normal buffer, Normal Matrix, texture unit `TEXTURE0`, sampler `u_texture`, UV attribute, filtering, wrapping, dan `gl.getError()` jika object gelap atau texture tidak terlihat.