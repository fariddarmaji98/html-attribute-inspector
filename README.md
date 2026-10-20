# HTML Attribute Inspector

Chrome extension (Manifest V3) untuk melihat semua attribute HTML dari elemen yang di-hover, langsung di halaman yang sedang dibuka.

## Fitur

- **Hover** elemen apa pun → popup muncul di kanan bawah berisi daftar semua attribute (`nama` → `value`)
- **Ctrl + right-click** → lock elemen yang sedang di-hover, popup tetap tampil walau kursor pindah
- **Copy icon** (⧉) di ujung tiap value → klik untuk copy value attribute ke clipboard
- Content script di-inject on-demand via `chrome.scripting` — tidak butuh host permission (`<all_urls>`)

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
4. Buka halaman web apa pun → klik icon extension → **Activate**

Content script di-inject saat popup dibuka, jadi tidak perlu reload tab walau extension baru di-install.

## Deploy

Push tag → GitHub Actions build zip, lampirkan ke GitHub Release, dan (kalau secret CWS diisi) upload + publish ke Chrome Web Store.

```bash
git tag v1.0.2
git push origin v1.0.2
```

Tag `v1.0.2` → `manifest.json` version di-set ke `1.0.2` saat build. Tag dan versi wajib sama.

### Aktifkan auto-publish ke Chrome Web Store

Tanpa secret, workflow cuma bikin GitHub Release (package tetap dihasilkan & diverifikasi). Untuk auto-upload ke store, tambahkan 4 secret di **Settings → Secrets and variables → Actions**:

| Secret | Isi |
|---|---|
| `CWS_EXTENSION_ID` | ID extension dari CWS dashboard (32 char) |
| `CWS_CLIENT_ID` | OAuth client ID dari Google Cloud Console |
| `CWS_CLIENT_SECRET` | OAuth client secret |
| `CWS_REFRESH_TOKEN` | Refresh token hasil OAuth sekali jalan |

Cara dapat kredensial CWS: publish manual pertama kali lewat dashboard, lalu ikuti [panduan `chrome-webstore-upload-cli`](https://github.com/fregante/chrome-webstore-upload-cli) untuk generate refresh token.

Workflow ada di `.github/workflows/release.yml`. Bisa juga dijalankan manual dari tab **Actions** (pakai versi yang ada di `manifest.json`).

## Struktur

```
manifest.json   # MV3 config, permission: storage + activeTab + scripting
content.js      # hover detection, popup render, lock/unlock, copy
popup.html      # UI popup extension
popup.js        # toggle on/off + inject content script on demand
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
