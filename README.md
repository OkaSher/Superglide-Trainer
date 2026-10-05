# ⚡ Apex Legends Superglide Trainer

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deploy%20Ready-brightgreen?logo=github)](https://pages.github.com/)
[![Go Server](https://img.shields.io/badge/Go%20Dev%20Server-server.go-00ADD8?logo=go)](https://golang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/ES6-Vanilla%20JS-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, high-precision web-based trainer for mastering the **1-frame Superglide mechanic** in *Apex Legends*.

Zero build tools or heavy dependencies required. Fully static and 100% compatible with **GitHub Pages** out of the box.

---

## ✨ Features

* **🎯 1-Frame Timing Validator:** Accurately measures the sub-millisecond delta between Jump and Crouch based on your target FPS.
* **⚡ FPS-Dependent Window:** Instant recalculation for 60, 120, 144, 165, 180, 240 FPS or custom frame rates.
* **⌨️ Dynamic Custom Keybinds:** Bind any keyboard keys, mouse scroll wheels (`MWheelDown`, `MWheelUp`), or mouse buttons (LMB, RMB, MMB, Mouse 4/5) with instant `localStorage` persistence.
* **🗖 Mini-HUD Mode:** Switch to a compact floating widget view designed to sit on a second monitor or side-by-side with Apex Legends in the Firing Range.
* **🔊 Audio Feedback:** Zero external audio files needed; includes an in-browser Web Audio synthesizer with **Sound 1**, **Sound 2**, **Sound 3**, and **Mute**, plus volume control.
* **🔥 Streak & Performance Tracker:** Live streak counter (`🔥 3 IN A ROW!`, `👑 10 GODLIKE!`), winrate %, and history log.
* **🧗 Mantle Peak Simulator:** Visual reaction trainer for timing the superglide right at the end of the climbing mantle.
* **🌐 Bilingual Support:** Instant toggle between English and Russian (`EN / RU`).
* **📋 Share Stats:** One-click clipboard report generator formatted for Discord, Telegram, or Reddit.

---

## 🚀 Quick Start & Local Run

### Option 1: Direct in Browser
Simply double-click `index.html` or open it with any modern web browser (Edge, Chrome, Firefox, Brave, Safari).

### Option 2: Run with Go
If you have Go installed:
```bash
go run server.go
```
The server will start at `http://localhost:8080` and open automatically.

### Option 3: Run with Python
```bash
python -m http.server 8080
```

---

## 🌐 Deploy to GitHub Pages (In 30 Seconds)

1. Create a new repository on [GitHub](https://github.com/new).
2. Push this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Apex Superglide Trainer"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
3. In your GitHub repository:
   * Go to **Settings** → **Pages**.
   * Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
   * Select branch `main` and folder `/ (root)`.
   * Click **Save**.
4. Your trainer is now live at:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

*(An automated GitHub Actions workflow is also included under `.github/workflows/pages.yml`).*

---

## 📂 Project Structure

```
ApexSuperglideTrainer/
├── .github/
│   └── workflows/
│       └── pages.yml        # Automated GitHub Pages CI/CD workflow
├── css/
│   └── style.css            # Responsive dark gaming UI & Mini-HUD styles
├── js/
│   ├── app.js               # Main application coordinator & event router
│   ├── audio.js             # Web Audio API synthesizer (Sound 1/2/3, Mute)
│   ├── binds.js             # Keybind management & recording modal
│   ├── i18n.js              # English & Russian translation engine
│   └── trainer.js           # Superglide calculation logic, timeline & streaks
├── index.html               # Web entry point with OpenGraph tags
├── server.go                # Lightweight standalone Go web server
├── .gitignore               # Standard gitignore
├── LICENSE                  # MIT License
└── README.md                # Documentation
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).
