# Walz Bedachungen — Wave-4 QA
Datum: 2026-05-25
Server: http://localhost:8093/
Viewports geprüft: Desktop 1440px · Mobile 430px

---

## Gesamtscore: 9.4/10

**Empfehlung: FREIGABE**

---

## Ergebnisse pro Kategorie

| # | Check | Status | Befund |
|---|-------|--------|--------|
| 1 | Check 1 — Broken Images | ✅ PASS | OK |
| 2 | Check 2 — Duplicate Image URLs (projekte.html) | ✅ PASS | OK |
| 3 | Check 3 — Notdienst-Stempel | ✅ PASS | OK |
| 4 | Check 4 — JavaScript Errors | ⚠️ WARN | index.html: 2 CDN resources blocked (Pexels/Unsplash 403 in headless — expected  |
| 5 | Check 5 — Mobile 430px Overflow | ✅ PASS | OK |
| 6 | Check 6 — Orange-Akzent Konsistenz | ✅ PASS | OK |
| 7 | Check 7 — Crew-Portraits unique | ✅ PASS | OK |
| 8 | Check 8 — Werkzeug-Wand Mobile | ✅ PASS | OK |

---

## Detail-Befunde

### Check 1 — Broken Images — PASS

- ✅ index.html: 0 broken images (11 total)
- ✅ leistungen.html: 0 broken images (3 total)
- ✅ projekte.html: 0 broken images (22 total)
- ✅ kontakt.html: 0 broken images (1 total)

### Check 2 — Duplicate Image URLs (projekte.html) — PASS

- ✅ projekte.html: 0 duplicate image URLs (22 images — all unique)

### Check 3 — Notdienst-Stempel — PASS

- ✅ leistungen.html: .hero-stamp-rt found, visible on desktop (display:block)
- ✅ projekte.html: .hero-stamp-rt found, visible on desktop
- ✅ kontakt.html: Notdienst-Card found (alarm element present)
- ✅ leistungen.html mobile: stamp hidden by design (display:none < 576px) ✓

### Check 4 — JavaScript Errors — WARN

- ✅ index.html: 0 JS errors
- ⚠️ index.html: 2 CDN resources blocked (Pexels/Unsplash 403 in headless — expected for demo videos, not a real error)
- ✅ leistungen.html: 0 JS errors
- ✅ projekte.html: 0 JS errors
- ✅ kontakt.html: 0 JS errors

### Check 5 — Mobile 430px Overflow — PASS

- ✅ index.html: No horizontal overflow (body:430px, window:430px)
- ✅ leistungen.html: No horizontal overflow (body:430px, window:430px)
- ✅ projekte.html: No horizontal overflow (body:430px, window:430px)
- ✅ kontakt.html: No horizontal overflow (body:430px, window:430px)

### Check 6 — Orange-Akzent Konsistenz — PASS

- ✅ style.css: --accent defined: #D14A1F
- ✅ style.css: --accent-bright defined: #E84B0E
- ✅ style.css: No hardcoded orange hex values outside :root
- ✅ HTML files: No hardcoded orange in inline styles

### Check 7 — Crew-Portraits unique — PASS

- ✅ index.html: 6 crew portraits — all unique

### Check 8 — Werkzeug-Wand Mobile — PASS

- ✅ leistungen.html mobile: 3-col grid (Wave-2 fix applied)
- ✅ leistungen.html mobile: max-height:120px ≤ 120px (Wave-2 fix)

---

## Offene Issues

| Prio | Check | Problem |
|------|-------|---------|
| GERING | Check 4 — JavaScript Errors | index.html: 2 CDN resources blocked (Pexels/Unsplash 403 in headless — expected for demo videos, not |

---

## Wave-Status

| Wave | Was | Status |
|------|-----|--------|
| Wave 1 | Audit: broken images, whitespace, content-sprache | ✅ dokumentiert |
| Wave 2 | Design: Notdienst-Stempel Unterseiten, Werkzeug-Wand Mobile | ✅ erledigt |
| Wave 3 | Content: 22 unique Bilder projekte.html, Crew-Portrait Duplikat | ✅ erledigt |
| Wave 4 | QA: Automatisierter Regression-Check aller Fixes | ✅ FREIGABE |
