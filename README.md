# ⚽ Football Edition — Squad Building & World Cup Match Simulator

A feature-rich, interactive football squad drafting and World Cup tournament simulation web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

![Football Simulator Banner](https://img.shields.io/badge/Football-Simulator-C9F31D?style=for-the-badge&logo=soccer&logoColor=black)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 🌟 Key Features

### 🎡 1. Squad Draft Engine
- **Authentic Historical Dataset**: Ingests **177 historical World Cup squad datasets** spanning multiple tournament editions.
- **Manual Spin Roulette**: Draw random historical teams to unlock player pools for your XI.
- **Orthogonal Rerolls**: Reroll by *Another Country* (same year, different country) or *Another World Cup* (same country, different year).
- **Interactive Football Pitch**: Drag-and-drop players into formation slots (`4-3-3`, `4-2-3-1`, `4-4-2`, `3-5-2`, `3-4-3`, `4-1-2-1-2`).
- **Dynamic Chemistry & Ratings Bar**: Live updates for Attack, Defense, Goalkeeping, Midfield ratings, and Team Chemistry %.
- **4-Tier Gold Visual States**:
  - `Gold Available` (`88+ OVR`): Bright gold border, golden crown badge `👑 88+`, draggable.
  - `Gold Unavailable`: Muted gold styling, gray text, non-draggable with OVR preserved.
  - `Normal Available` (`< 88 OVR`): Standard card style, draggable.
  - `Normal Unavailable`: Dark muted card style.

### 🏟️ 2. Event-Driven Match Simulation Engine
- **Strength & Chemistry Based**: Chance creation and possession are driven by team effective strength ($\text{OVR} \times 0.60 + \text{Att} \times 0.20 + \text{Def} \times 0.20$), chemistry, goalkeeper quality, and red card penalties.
- **Dynamic Red Cards**: A red card reduces effective team strength by **15% per card**, dynamically impacting the rest of the match.
- **Realistic Event Chains**: Generates minute-by-minute action streams (Buildup → Pass → Defense/Tackle → Shot → Save/Goal/Block/Corner).
- **Goal Types**: Categorized as `open_play`, `counter`, `header`, `long_shot`, `set_piece`, `penalty`, `rebound`, or `one_on_one`.
- **Live Commentary & Speed Controls**: Real-time event ticker with 1X, 2X, and 4X playback multipliers that never reset minute progress or state.
- **Extra Time & Penalty Shootouts**: Knockout ties trigger 30 minutes of Extra Time and individual penalty kicks.

### 📊 3. Complete Stored Match History & Summaries
- **Match Records**: Every match stores possession %, shots, shots on target, corners, fouls, cards, goalkeeper saves, player match ratings, MOTM, and complete event logs.
- **Match Summary Modal**: Click any completed match fixture to inspect full team stat comparisons, goals & assists timelines, key saves, player ratings, and commentary logs.

### 🏆 4. Live Tournament Awards
- **Golden Ball (Best Player)**: Calculated from average match ratings, goals, assists, clean sheets, and MOTM awards.
- **Golden Boot (Top Scorer)**: Ranked by goals scored, assists, and fewest minutes played.
- **Golden Glove (Best Keeper)**: Ranked by clean sheets, saves, save percentage, and match ratings.
- **Live Leaderboard Tab**: View top candidates updated in real-time after every match.

### 💾 5. Automatic Persistence & Mobile Responsiveness
- **Browser Storage (`localStorage`)**: Saves active page, draft squad, groups, fixtures, match history, and award standings automatically. Refreshing or exiting the browser preserves your progress.
- **Mobile First Responsive Design**: Mobile tab navigation (`SPIN & POOL`, `PITCH`, `STATS`) for screens `< 1024px` and touch-friendly controls.

---

## 🛠️ Tech Stack

- **Frontend Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations / Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/football-edition-simulator.git
   cd football-edition-simulator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

- **`npm run dev`**: Starts Vite dev server with hot module replacement (HMR).
- **`npm run build`**: Runs TypeScript type-checking (`tsc`) and compiles production assets into `dist/`.
- **`npm run preview`**: Serves the compiled `dist/` production bundle locally for previewing.
- **`npm run lint`**: Runs ESLint to check code quality.

---

## 📁 Project Structure

```
c:\Projects\FootBallSimulator\
├── public/                  # Static assets & icons
├── src/
│   ├── components/          # Reusable UI & game components
│   │   ├── draft/           # Squad picker, spin modal, summary panels
│   │   ├── football/        # Interactive pitch, player cards, formation selector
│   │   └── simulation/      # Group view, bracket, live match, match summary, leaderboards
│   ├── data/                # Historical squad JSONs, team metadata, performance records
│   ├── engine/              # Core game engines (match simulator, rating, chemistry, draft)
│   ├── pages/               # Main views (Home, Draft, Tournament)
│   ├── types/               # TypeScript models & interfaces (football.ts)
│   ├── utils/               # Storage helpers (localStorage), name formatters
│   ├── App.tsx              # Root component & page router
│   └── main.tsx             # Application entry point
├── package.json             # Dependencies and build scripts
├── tailwind.config.js       # Custom Tailwind theme & color config
└── vite.config.ts           # Vite bundler configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
