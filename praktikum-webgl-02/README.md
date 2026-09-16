# WebGL Fundamental Playground

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Deskripsi aplikasi
WebGL Fundamental Playground adalah aplikasi WebGL2 untuk mempelajari pipeline grafis dasar: vertex data, buffer, attribute, shader, primitive, rasterization, fragment shader, dan draw call.

## Link web aplikasi
[Praktikum 2 - WebGL Fundamental Playground](https://grescea.github.io/praktikum-webgl-02)

## Primitive yang digunakan
- Triangle dengan vertex color
- Rectangle dari dua triangle
- Line-based shape
- Point primitives

## Draw mode
- `gl.TRIANGLES`
- `gl.LINE_LOOP`
- `gl.LINES`
- `gl.POINTS`

## Fitur animasi
Triangle bergerak horizontal dan memantul pada batas NDC menggunakan `requestAnimationFrame()`.

## Fitur interaksi
- Arrow Keys: menggerakkan triangle secara kontinu dengan state-based input.
- R: reset posisi triangle dengan event-based input.
- Klik Canvas: menambahkan point pada posisi mouse yang dikonversi ke NDC.
- C: mengganti warna triangle.
- P: pause atau resume animasi.

## Challenge yang dikerjakan
- Primitive selector melalui tombol keyboard.
- Color control.
- Spawn primitive pada posisi klik.
- Multiple moving objects.
- Procedural geometric pattern.
- Simple HUD melalui console dan status Canvas.

## Cara menjalankan project
Jalankan directory ini melalui local development server, lalu buka `index.html` pada browser yang mendukung WebGL2.

Contoh menggunakan VS Code Live Server:

1. Buka folder `praktikum-webgl-02`.
2. Jalankan Live Server.
3. Buka `index.html`.

## Debugging
Jika Canvas kosong, periksa WebGL2 context, compile shader, link program, buffer binding, attribute location, `vertexAttribPointer()`, draw count, draw mode, NDC, dan viewport pada browser console.