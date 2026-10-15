import zlib, struct

def chunk(typ, data):
    return struct.pack('>I', len(data)) + typ + data + struct.pack('>I', zlib.crc32(typ + data) & 0xffffffff)

def make_png(path, size):
    w = h = size
    raw = bytearray()
    cx, cy, rad = 0.42, 0.42, 0.26
    hx0, hy0, hx1, hy1 = 0.60, 0.60, 0.86, 0.86
    ex, ey = hx1 - hx0, hy1 - hy0
    seg = ex * ex + ey * ey
    for y in range(h):
        raw.append(0)
        for x in range(w):
            nx = x / max(1, w - 1)
            ny = y / max(1, h - 1)
            d = ((nx - cx) ** 2 + (ny - cy) ** 2) ** 0.5
            on_circle = abs(d - rad) < 0.06
            px, py = nx - hx0, ny - hy0
            t = max(0.0, min(1.0, (px * ex + py * ey) / seg)) if seg else 0.0
            projx, projy = hx0 + t * ex, hy0 + t * ey
            hd = ((nx - projx) ** 2 + (ny - projy) ** 2) ** 0.5
            on_handle = hd < 0.07
            c = (255, 255, 255) if (on_circle or on_handle) else (255, 106, 0)
            raw.extend(c)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
           + chunk(b'IDAT', zlib.compress(bytes(raw)))
           + chunk(b'IEND', b''))
    with open(path, 'wb') as f:
        f.write(png)

for s in (16, 48, 128):
    make_png(f'icon{s}.png', s)
print('icons generated')
