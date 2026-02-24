# Hot Pepper English 🍽️

An English-language restaurant discovery app for Japan, powered by the HotPepper Gourmet API.

🔗 **[https://iantab.github.io/hotpepper-english/](https://iantab.github.io/hotpepper-english/)**

---

## Features

- 🗾 **Browse by prefecture** — all 47 prefectures grouped by region
- 🍜 **Filter by cuisine** — 15 genre categories
- 💴 **Filter by budget** — 12 dinner price ranges
- 🔍 **Refine results** — narrow down large result sets with amenity chips (Non-Smoking, English OK, Private Room, Lunch, Late Night, Wi-Fi, Card OK, Parking) and a keyword search, all applied server-side via the API
- 📸 **Restaurant cards** — photo, cuisine tags, budget, and lunch availability at a glance
- 📋 **Detailed view** — hours, address, nearest station, features, capacity, and more — all translated to English
- 📍 **Google Maps links** — for both the restaurant address and nearest train station

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [HotPepper Gourmet Web Service](http://webservice.recruit.co.jp/)
- [corsproxy.io](https://corsproxy.io/) — CORS proxy for GitHub Pages deployment

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```
   VITE_HOT_PEPPER_KEY=your_api_key_here
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## API Key

Obtain a free key from the [HotPepper Gourmet Web Service](http://webservice.recruit.co.jp/).

## Deployment

The app deploys automatically to GitHub Pages on every push to `master` via the included GitHub Actions workflow. Set `VITE_HOT_PEPPER_KEY` as a repository secret — everything else is configured in the workflow.

---

<a href="http://webservice.recruit.co.jp/"><img src="http://webservice.recruit.co.jp/banner/hotpepper-m.gif" alt="ホットペッパーグルメ Webサービス" width="88" height="35" border="0" title="ホットペッパーグルメ Webサービス"></a>
