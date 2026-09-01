# Android App & GitHub Export Guide

This repository is ready for **GitHub export** and **Android APK / App Bundle generation**.

---

## 1. Exporting & Adding Project to GitHub

### Option A: One-Click Sync via AI Studio / Lovable (Recommended)
1. Open the project settings or toolbar in the AI Studio / Lovable header.
2. Click **"GitHub"** / **"Export to GitHub"**.
3. Authorize your GitHub account (`yashsinha852@gmail.com`) and choose or create a repository (e.g. `forecast-companion-bot`).
4. The system will automatically create the repository and push all commits.

### Option B: Using Git CLI
If you download or clone the workspace:
```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: Forecast Companion Bot disaster early warning system"

# 4. Link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forecast-companion-bot.git

# 5. Push to GitHub
git push -u origin main
```

---

## 2. Generating Android App (APK / AAB)

You can run Forecast Companion Bot on Android via two easy methods:

### Method 1: Capacitor Native Android App (Production APK / Google Play AAB)
This project is pre-configured with `capacitor.config.json` (`in.gov.ndma.forecastcompanion`).

1. **Install Capacitor Dependencies**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **Initialize Android Native Project**:
   ```bash
   npx cap add android
   ```

3. **Build the Web Assets**:
   ```bash
   npm run build
   npx cap sync
   ```

4. **Open in Android Studio & Generate APK**:
   ```bash
   npx cap open android
   ```
   - In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - The compiled release/debug APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

### Method 2: Instant PWA Install on Android (No Build Tools Required)
1. Open the live URL on your Android device (Google Chrome / Brave / Edge).
2. Tap the **three-dot menu** (⋮) at the top right of the browser.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. The app installs as a standalone, full-screen Android app with its dedicated launcher icon, offline caching, and native-feeling window frame.

---

### Method 3: Trusted Web Activity (TWA) with Bubblewrap
For publishing directly to Google Play Store:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://YOUR_DOMAIN/manifest.json
bubblewrap build
```
This generates a signed Android App Bundle (`.aab`) ready for uploading to the Google Play Console.
