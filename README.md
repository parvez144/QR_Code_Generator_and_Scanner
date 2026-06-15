# SPK QR — Secure QR Code Generator & Scanner

A premium, modern, and highly customisable QR Code Generator and Scanner web application. Built entirely with vanilla client-side technologies (HTML5, CSS3, and JavaScript) to guarantee complete privacy and offline functionality. 

---

## ✨ Features

### 1. Robust QR Generation
- **Supported Data Types:**
  - **WiFi Networks:** Generate QR codes that automatically connect devices to WiFi (SSID, Password, WPA/WEP/Open support, hidden network flags).
  - **Website Links (URLs):** Enter URLs to create direct redirect codes.
  - **Plain Text:** Convert any general text note into a QR payload.
  - **Contact Cards (vCards):** Generate `.vcf` contact detail cards (Name, Phone, Email, Address, Website).
- **Premium Design Customizer:**
  - **Quick presets:** Classic, Midnight Gold, Cyberpunk, Emerald, and Ocean breeze themes.
  - **Shape Controls:** Customize module/dot shape (Square, Rounded, Circle) and finder pattern eyes.
  - **Advanced Colors:** Solid colors, radial/linear gradients (with angle sliders), and custom eye rings/inner pupil coloring.
  - **Transparent Backgrounds:** Fully supported exports with automatic contrast safety checking.
  - **Center Logo Overlay:** Overlay built-in WiFi icons or upload a custom image (PNG/JPG) with clean masking.

### 2. Multi-Strategy QR Scanner
- **Upload Image Scanner:** Uses a robust multi-pass strategy (original resolution, scaled 800px, scaled 400px, scaled 1200px, and binarized contrast boost passes) to decode blurred, low-resolution, or transparent background QR codes successfully.
- **Camera Live Scanner:** Direct HTML5 browser camera access with real-time finder overlays, camera selection, and laser animations.
- **Payload Parsing:** Scanned payload is parsed automatically, displaying structured cards (WiFi credentials, Contact sheets, URL redirects) and copy action shortcuts.

### 3. Local Profiles & History
- **Saved Profiles:** Save generated configurations (like WiFi profiles or contact templates) to a local storage database to load or modify later.
- **Scanned QR Logs:** Keep a history log of scanned QR codes with quick "load in editor" options.
- **Spam Prevention & Visual Feedback:** Interactive buttons with disabled states during copy/save success animations to keep the interface smooth.

---

## 🛠️ Technology Stack
- **Frontend Core:** HTML5, CSS3 (Vanilla design tokens, CSS variables, and glassmorphism styling).
- **Engine Logic:** Vanilla JavaScript (ES6+ Modules, Clipboard API, mediaDevices API).
- **Libraries (CDN loaded):**
  - [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (v1.4.4) — QR Matrix engine.
  - [jsQR](https://github.com/cozmo/jsQR) (v1.4.0) — High-performance scanner engine.
  - [Tabler Icons](https://tabler-icons.io/) — Modern web fonts.

---

## 🚀 How to Run Locally

### Option 1: Direct File Open
You can open `index.html` directly in any web browser without running a server.

### Option 2: Python Web Server (Recommended)
Running a local server ensures smooth Clipboard API and Camera Scanner permissions (which browsers restrict on raw `file://` protocols).

Run the custom silent python server inside the directory:
```bash
python server.py
```
This automatically boots a local server (typically at `http://localhost:8000`) and launches it directly in your default browser.
