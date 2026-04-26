# BitBank — Crypto Payment & Digital Inheritance Platform

A premium, backend-free Web3 banking UI built with pure HTML, CSS, and JavaScript.

## 🚀 GitHub Pages Deployment

This is a **static site** (no build step required).

### GitHub Pages Settings:
- **Source**: Deploy from branch `main`  
- **Folder**: `/ (root)` ← this is handled automatically by the workflow
- The GitHub Actions workflow (`.github/workflows/static.yml`) copies only the necessary files to a clean `_site/` directory before deploying.

### Files Deployed:
- `index.html` — main entry point ✅
- `style.css` + `pages.css` — stylesheets ✅
- `main.js` + `login3d.js` — client-side logic ✅
- `favicon.svg`, `favicon.ico`, `icons.svg` ✅
- `images/` — assets ✅

### Files Excluded from Deployment (intentional):
- `node_modules/` — not needed for static serving
- `api-server.js` — backend file, not used in Pages
- `server.ps1` — local dev server only
- `.env` — secrets, excluded by `.gitignore`

## 🧪 Local Development
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1
```
Then open: http://localhost:8000/

app to manage your crypto currency
