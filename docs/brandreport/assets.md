# Brand Asset Verification — SAND WORKS

Status: **EXISTING** (assets present, intact, unmodified). Masters verified 2026-09-08.

## Canonical masters
Both masters are **square 1536×1536** (verified programmatically). No 1254×1254 or 1024×1024 "master" files exist in this repository, so **there is no canonical-master ambiguity here**. (The previously discussed 1536 vs 1254/1024 discrepancy belonged to an older working copy and does not apply to this fresh repository.)

| File | Width×Height | Bytes | sha256 (first 12) |
|---|---|---|---|
| `assets/sand_works_brand_assets/master/sand_works_logo_master.png` | 1536×1536 | 276,583 | `69b6abdc4923` |
| `assets/sand_works_brand_assets/master/sand_works_app_icon_master.png` | 1536×1536 | 1,229,702 | `d6746014dfd8` |
| `assets/SAND_WORKS_brand_assets_locked.zip` | — | 3,105,801 | `feb02b5c2f2a` (whole file) |

Note: `logo/sand_works_logo_1536.png` is byte-identical to `master/sand_works_logo_master.png` (same hash `69b6abdc4923`) — they are the same file content at two paths.

## Derived Android launcher mipmaps
| File | Size |
|---|---|
| android/mipmap-mdpi/ic_launcher.png | 48×48 |
| android/mipmap-hdpi/ic_launcher.png | 72×72 |
| android/mipmap-xhdpi/ic_launcher.png | 96×96 |
| android/mipmap-xxhdpi/ic_launcher.png | 144×144 |
| android/mipmap-xxxhdpi/ic_launcher.png | 192×192 |

## Play icons
| File | Size |
|---|---|
| android/play/sand_works_icon_512.png | 512×512 |
| android/play/sand_works_icon_1024.png | 1024×1024 |

## Logo sizes
`logo/sand_works_logo_256.png` (256), `_384` (384), `_512` (512), `_768` (768), `_1024` (1024), `_1536` (1536). All square.

## Guardrails
- Masters are authoritative and locked. Only mechanical resizing from a master is permitted (e.g. launcher density copies already present). No redraw, regeneration, or SVG conversion.
- The launcher mipmaps and play icons are the Android-consumable derivations of the icon master.
