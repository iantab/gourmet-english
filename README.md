# Hot Pepper English 🍽️

An English-language restaurant discovery app for Japan, powered by the HotPepper Gourmet API. Search for restaurants across Japan by prefecture, cuisine, and budget — and view detailed information in English.

## Features

- 🗾 **Browse by prefecture** — all 47 prefectures grouped by region
- 🍜 **Filter by cuisine** — full genre and sub-genre support
- 💴 **Filter by budget** — dinner and lunch price ranges
- 📸 **Restaurant cards** — photo, cuisine tags, budget, and lunch availability at a glance
- 📋 **Detailed view** — hours, address, nearest station (Google Maps linked), features (smoking, private hire, all-you-can-eat/drink, etc.), capacity, and more — all translated to English
- 📍 **Google Maps links** — for both the restaurant address and nearest train station

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [HotPepper Gourmet Web Service](http://webservice.recruit.co.jp/)

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root with your HotPepper API key:
   ```
   VITE_HOTPEPPER_API_KEY=your_api_key_here
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## API Key

You can obtain a free API key from the [HotPepper Gourmet Web Service](http://webservice.recruit.co.jp/).

---

<a href="http://webservice.recruit.co.jp/"><img src="http://webservice.recruit.co.jp/banner/hotpepper-m.gif" alt="ホットペッパーグルメ Webサービス" width="88" height="35" border="0" title="ホットペッパーグルメ Webサービス"></a>
