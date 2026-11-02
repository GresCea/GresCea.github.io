# Hard-Surface 3D Modeling — Sci-Fi Mechanical Crate

| Name           | NRP        | Kelas     |
| ---            | ---        | ----------|
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B |
| Hasan Abdurrahman | 5025241114 | B |

## Nama Asset
Sci-Fi Mechanical Crate

## Konsep Asset
Aset 3D *hard-surface* berbentuk kotak penyimpanan mekanis futuristik (*sci-fi crate*) yang dirancang untuk kebutuhan aset game/prop 3D. Aset ini memiliki struktur bodi utama yang kokoh, dilengkapi *recessed panel*, bingkai pelindung sudut (*bumpers*), komponen pegangan (*handle*), serta komponen pelengkap lainnya (*latch* dan *hinge*), dan panel samping yang modular.

## Primitive Awal
- `Cube`: Digunakan sebagai *blockout* bodi utama (`Crate_Body`) dan struktur dasar pegangan (`Handle`).

## Operasi Modeling yang Digunakan
- Transformasi dasar (`G`, `R`, `S`) dengan *axis constraint* (`X`, `Y`, `Z`) dan *numeric input*.
- `Extrude` (`E`): Menambahkan geometri baru secara penarikan mendalam atau menonjol.
- `Inset` (`I`): Membentuk *face* baru yang berskala lebih kecil di dalam permukaan terikat.
- `Loop Cut` (`Ctrl + R`): Membagi *mesh* menjadi wilayah kontrol terstruktur sesuai aliran *edge loop*.
- `Bevel` (`Ctrl + B`): Membentuk chamfer/lengkungan pada *edge* tajam.
- `Knife Tool` (`K`): Melakukan pemotongan kustom/diagonal pada permukaan geometri.
- `Fill` (`F`): Menutup batas lubang atau membentuk *face* baru dari seleksi *edge/vertex*.
- `Merge` (`M`): Menggabungkan *vertex* yang menumpuk.

## Modifier yang Digunakan
- `Mirror Modifier`: Menghasilkan bentuk simetris secara otomatis (*non-destructive*) pada sumbu X.
- `Bevel Modifier`: Memberikan efek chamfer prosedural pada seluruh *sharp edge* agar permukaan menangkap pantulan *highlight* cahaya secara realistis.

## Bagian yang Menggunakan Extrude
- **Extrude Inward (Ke Dalam)**: Diterapkan pada *face* hasil *Inset* di bagian tengah pintu/panel depan untuk membentuk panel cekung (*recessed panel*).
- **Extrude Outward (Ke Luar)**: Diterapkan pada *face* sudut luar untuk membentuk bingkai pelindung (*bumper*) serta bagian penopang *handle* di atas bodi *crate*.

## Bagian yang Menggunakan Inset
- Diterapkan pada *face* permukaan depan, atas, dan samping bodi *crate* untuk membentuk garis penegas bingkai panel sebelum ditarik atau didorong menggunakan *Extrude*.

## Bagian yang Menggunakan Loop Cut
- Ditambahkan melingkar pada bodi utama `Crate_Body` untuk membagi permukaan besar menjadi beberapa region kontrol persegi yang lebih kecil, mempermudah pembuatan alur *paneling* dan *bevel edge* lokal.

## Bagian yang Menggunakan Bevel
- Diterapkan pada *edge* utama di sekeliling kerangka luar *crate* agar sudut tidak terlalu tajam (*infinitesimal sharp*), sehingga aset menangkap *highlighting* pencahayaan secara presisi saat di-render.

## Cleanup yang Dilakukan
- `Apply Scale` (`Ctrl + A` -> `Scale`): Mengembalikan nilai skala objek ke `(1, 1, 1)` setelah manipulasi ukuran di *Object Mode*.
- `Merge by Distance` (`M` -> `By Distance`): Menghapus *duplicate vertices* yang tidak sengaja terbentuk akibat penekanan `E` yang dibatalkan.
- `Recalculate Normal` (`Shift + N`): Memastikan seluruh orientasi *face normal* mengarah seragam ke luar bodi objek.
- **Topology Inspection**: Memeriksa *mesh* dari tampilan *Orthographic* (`Numpad 1/3/7`) untuk memastikan tidak ada *face* internal yang tertinggal.

## Challenge yang Dikerjakan
- **Challenge A — Symmetric Prop**: Memanfaatkan `Mirror Modifier` pada sumbu X sehingga proses pemodelan bodi utama cukup dilakukan pada satu sisi, dan sisi sebelahnya terduplikasi secara simetris secara otomatis.
- **Challenge D — Advanced Paneling**: Menggabungkan `Loop Cut`, `Inset`, dan `Extrude` secara bertahap untuk menghasilkan struktur panel 3 tingkat (*recessed & raised panels*) pada area pintu *crate*.
- **Challenge E — Knife Detail**: Menggunakan `Knife Tool` (`K`) untuk memotong menembus bodi utama `Crate_Body` menggunakan mode *Cut Through*
- **Challenge G — Modular Asset**: Memisahkan komponen *crate* menjadi beberapa objek terpisah yang terorganisasi secara terstruktur di Outliner: `Crate_Body`, `Latch`, dan `Hinge`.
- **Challenge H — Precision Modeling**: Menggunakan *Orthographic View* (`Numpad 1/3/7`), *Numeric Transform* (seperti `G X 0.5`), dan *Snapping* (`Shift + Tab`) ke Edge/Vertex untuk memastikan komponen pegangan dan panel terpasang presisi sejajar dengan bodi utama.

## Kendala dan Solusi
- **Kendala**:
  - *Bevel* tidak konsisten: Bentuk *bevel* tampak terdistorsi/gepeng di salah satu sumbu akibat transformasi *scale* non-uniform di *Object Mode*.
  - *Extrude* ganda (*duplicate vertices*): Terjadi penumpukan *vertex/face* tak terlihat ketika menekan `E` namun membatalkan perpindahan posisi dengan klik kanan.
  - Artefak *shading* dari *Knife Tool*: Pemotongan manual dengan *Knife Tool* menghasilkan permukaan N-gon yang membuat *shading* permukaan tampak aneh.
- **Solusi**:
  - Menjalankan `Apply Scale` (`Ctrl + A` -> `Scale`) di *Object Mode* sebelum melakukan pemodelan detail/bevel agar skala kembali netral `(1, 1, 1)`.
  - Masuk ke *Edit Mode*, pilih seluruh geometri dengan `A`, lalu jalankan `Merge by Distance` (`M` -> `By Distance`) untuk membersihkan *vertex* yang menumpuk di lokasi yang sama.
  - Melakukan *topology cleanup* dengan menghubungkan *vertex* baru hasil potongan *Knife* ke *vertex/edge* terdekat menggunakan *Knife* atau *Connect*, sehingga *topology* kembali berupa Quad atau Triangle yang rapi.