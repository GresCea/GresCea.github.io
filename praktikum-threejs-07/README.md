# Interactive Web 3D Prototype

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Judul dan Deskripsi Prototype
**Interactive Web 3D Prototype** adalah scene Three.js interaktif yang mendemonstrasikan Scene Graph, parent-child hierarchy, PBR material, model GLB, AnimationMixer, raycasting, hover, click selection, visual feedback, dan environment lighting.

## Link web aplikasi
[Interactive Web 3D Prototype](https://grescea.github.io/praktikum-threejs-07)

## Hierarchy Parent-Child
`Child Object` menjadi child dari `Parent Object`, sedangkan keduanya berada di dalam `Hierarchy Group`. Transform parent memengaruhi world transform child, sementara position child tetap relatif terhadap parent.

## Model GLB dan Sumber Asset
- File: `models/model.glb`
- Sumber: contoh model publik Three.js, disimpan lokal untuk kebutuhan praktikum.
- Jika file tidak tersedia, aplikasi tetap berjalan menggunakan scene procedural dan memberi status fallback pada HUD.

## Animation Clip
Jika GLB menyediakan animation clip, clip pertama dijalankan melalui `THREE.AnimationMixer`. Hierarchy demo juga memiliki animasi procedural sederhana. Tombol `Space` melakukan pause/resume animasi.

## Pengaturan PBR
PBR menggunakan `MeshStandardMaterial` dengan parameter utama:
- roughness sphere: `0.25`
- metalness sphere: `0.1`
- roughness hierarchy parent: `0.45`
- metalness hierarchy parent: `0.15`
- roughness child: `0.3`
- metalness child: `0.1`

## Interaksi Hover dan Click
- Hover menggunakan `THREE.Raycaster` dan pointer NDC.
- Click menyimpan `selectedObject` secara persisten.
- Raycast bersifat recursive agar child mesh GLB dapat dipetakan kembali ke selectable root.
- Drag kamera tidak dianggap sebagai click selection.

## Visual Feedback
- Hover memperbesar object menjadi `1.06x`.
- Selected memperbesar object menjadi `1.12x`.
- HUD menampilkan object yang sedang di-hover, object terpilih, status loading, dan status animasi.

## Environment
Baseline memakai `RoomEnvironment` dari Three.js sebagai environment lighting procedural. Tombol `E` mengaktifkan atau menonaktifkan `scene.environment`. File `environment/environment.jpg` disiapkan sebagai lokasi asset opsional; implementasi baseline tidak bergantung pada file tersebut.

## Challenge
- Multiple animation clips jika GLB menyediakan lebih dari satu clip.
- Click menjalankan animation.
- Information panel untuk object terpilih.
- Hierarchical solar system.
- PBR material gallery.
- Hover emissive.
- Selection rotation.
- Environment toggle.

## Cara Menjalankan
Project ini tidak memakai Vite atau npm. Gunakan VS Code Live Server:

1. Buka folder `praktikum-threejs-07` di VS Code.
2. Jalankan **Open with Live Server** pada `index.html`.
3. Pastikan browser memiliki koneksi internet karena Three.js dan add-ons diambil melalui import map CDN.

Jangan membuka `index.html` langsung dengan `file://` karena module import dan loading asset dapat diblokir browser.

## Catatan Debugging
- Pastikan URL asset adalah `/models/model.glb` ketika dijalankan dari root Live Server.
- Periksa Console jika GLB gagal dimuat.
- Pastikan raycast memakai recursive `true` untuk model hierarchy.
- Pastikan pointer dikonversi dari pixel Canvas ke NDC.
- Jangan mengubah material GLB secara destruktif bila material dipakai bersama.
- Pastikan `renderer.shadowMap.enabled`, `castShadow`, dan `receiveShadow` aktif sesuai kebutuhan.
- `scene.background` adalah backdrop yang terlihat, sedangkan `scene.environment` digunakan untuk respons material PBR.
