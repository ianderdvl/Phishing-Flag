# Phishing Flag — Phase II MVP

**A lightweight browser extension that flags risky sites in real time.**  
The badge gives you a quick signal (✓ / ! / ⚠), the popup explains *why*, and truly risky pages display a red warning banner across the top that you can dismiss.

## Why this matters
Phishing pages keep getting more convincing. Phishing Flag adds a tiny layer of judgment right where you browse: it scores the active tab, shows a clear status, and—when needed—puts a bold banner in your line of sight. It’s simple, explainable, and fast.

## What the MVP does
- **Service worker (background.js)** analyzes the current tab: computes a risk score/level, sets the badge, and on **high** risk tells the content script to inject a warning banner.
- **Content script (content.js)** displays the banner when instructed (`showWarning`).
- **Popup (popup.js/html)** asks the background for the active tab’s result (`{ action: "getData" }`) and shows the level, flags, and metadata (e.g., domain, SSL grade, PhishTank status).
- **State** lives in-memory (`siteData`) per tab for speed and privacy. No persistent storage in the MVP.

See **ARCHITECTURE.md** for the diagram and message contracts.

## Install (Chrome, Manifest V3)
1. Clone or download this repo.
2. Go to `chrome://extensions`, enable **Developer mode**.
3. Click **Load unpacked** and select the project folder.
4. Pin the extension (optional) to keep the badge visible.

## Quick tests
- **Low risk**: `https://google.com` → ✓ badge (green).  
- **Medium risk**: try a “weird” domain (e.g., `https://example.top`) or a site with a poor SSL grade.  
- **High risk**: a URL PhishTank confirms (⚠). You should see the red warning banner.

> The score blends simple heuristics (protocol, TLD) with live checks (PhishTank & SSL Labs).

## Privacy & permissions
- No history or persistent data. Results are held in memory per tab and cleared on reload/close.
- Network requests go directly from your browser to **PhishTank** and **SSL Labs** APIs.
- Permissions are limited to tabs, activeTab, and what’s necessary to update the badge and inject the banner.

## Known limitations (MVP)
- Dependent on third-party API rate limits.
- No centralized logging/history (by design, for privacy).

## Phase III roadmap
- Optional backend service to cache lookups and smooth rate limits.
- Enriched heuristics (domain age, TLS parameters), better explanations.
- “Report this site” flow and feedback loop for analysts.

## Troubleshooting
- **No badge?** Reload the page or toggle the extension off/on.
- **No banner?** Only shows on **high** risk; check the popup for current level/flags.
- **Debugging:** Open DevTools → “Service Worker” and “Content” contexts for logs.

---
**Team (Phase II):** Architect/Diagram — Isaac · MVP Engineer — Ben · Testing/Docs — Oliver · Reflection/Release — Cole
