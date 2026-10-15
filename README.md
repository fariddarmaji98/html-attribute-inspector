# HTML Attribute Inspector

Chrome extension (Manifest V3) untuk melihat semua attribute HTML dari elemen yang di-hover, langsung di halaman yang sedang dibuka.

## Fitur

- **Hover** elemen apa pun → popup muncul di kanan bawah berisi daftar semua attribute (`nama` → `value`)
- **Ctrl + right-click** → lock elemen yang sedang di-hover, popup tetap tampil walau kursor pindah
- **Copy icon** (⧉) di ujung tiap value → klik untuk copy value attribute ke clipboard
- Deteksi liveness: kalau content script belum ter-inject di tab (misal tab dibuka sebelum install), popup menampilkan tombol **Reload this tab**

## Shortcut

| Aksi | Shortcut |
|---|---|
| Tampilkan attribute elemen | **Hover** elemen |
| Lock elemen | **Ctrl + right-click** |
| Unlock elemen | **Ctrl + right-click** lagi (di mana saja) atau **Esc** |
| Deactivate extension | **Esc** (saat tidak ada elemen ter-lock) |

Catatan: **Esc** bekerja dua tahap — kalau ada elemen ter-lock, Esc pertama melepas lock; Esc kedua menonaktifkan extension.

## Instalasi

1. Buka `chrome://extensions`
2. Aktifkan **Developer mode** (kanan atas)
3. Klik **Load unpacked** → pilih folder project ini
4. Klik icon extension di toolbar → **Activate**

Kalau tab sudah terbuka sebelum extension di-load, klik **Reload this tab** di popup extension supaya content script ter-inject.

## Struktur

```
manifest.json   # MV3 config, permission: storage + activeTab
content.js      # hover detection, popup render, lock/unlock, copy
popup.html      # UI popup extension
popup.js        # toggle on/off + liveness check
generate_icons.py  # generator icon PNG
build.py        # bikin zip siap upload ke Chrome Web Store
store/          # aset & copy listing store (screenshot, listing.md)
```

## Publish ke Chrome Web Store

```bash
python build.py 1.0.1     # bump versi + rebuild zip
```

Upload `build/html-attribute-inspector-v<versi>.zip` lewat [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). Versi di `manifest.json` harus lebih tinggi dari versi yang sudah live, kalau tidak upload akan ditolak.

Teks listing (deskripsi, justifikasi permission, checklist aset) ada di `store/listing.md`. Screenshot 1280x800 ada di `store/promo-1280x800.png`.
