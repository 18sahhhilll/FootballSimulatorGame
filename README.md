# ⚽ Football Edition — Squad Building, World Cup & La Liga Simulator

A feature-rich, interactive football squad drafting and simulation web application built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. Features both **World Cup Knockout Tournament Edition** and **La Liga Season Edition**.

![Football Simulator Banner](https://img.shields.io/badge/Football-Simulator-C9F31D?style=for-the-badge&logo=soccer&logoColor=black)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🌟 Key Features & Game Modes

### 🇪🇸 1. La Liga Season Edition
- **Authentic 21-Team League Competition**: 20 authentic La Liga clubs + 1 user Fantasy XI (21 teams total).
- **Full 38-Matchday Fixture List**: Double round-robin league schedule containing 380 matches. No knockout rounds or semi-finals; winner is decided by final league points.
- **Fixed Official Managers & Tactical Formations**:
  - *FC Barcelona*: Hansi Flick (`4-3-3`)
  - *Real Madrid*: José Mourinho (`4-4-2`)
  - *Athletic Club*: Edin Terzić (`4-2-3-1`)
  - *Atlético Madrid*: Diego Simeone (`5-3-2`)
  - *Sevilla FC*: Luis García Plaza (`4-2-3-1`)
  - *Real Sociedad*: Pellegrino Matarazzo (`4-2-2-2`)
  - *Rayo Vallecano*: Beñat San José (`4-2-2-2`)
  - *Celta Vigo*, *Real Betis*, *Villarreal*, *Valencia*, *Getafe*, *Osasuna*, *Alavés*, *Espanyol*, *Elche*, *Levante*, *Málaga*, *Racing Santander*, *Deportivo La Coruña*.
- **Red Card Suspensions**: Players receiving a red card are automatically suspended for 1 match and replaced by the highest-rated available player for that position.
- **Unrestricted Matchday Browsing & Sequential Simulation**: Browse fixtures for all 38 matchdays at any time, while simulation is sequentially restricted until earlier matchdays complete.
- **Official Team & League Branding**: Includes high-resolution PNG logos for all La Liga clubs, official **La Liga** branding, and custom **Fantasy 11** user logo.
- **League Standings & European Qualifications**: Real-time table sorting with UEFA Champions League (1-4), Europa League (5), Conference League (6), and Relegation (18-21) indicators.
- **Season Awards**: Pichichi Trophy (Top Scorer), Top Assists, Zamora Trophy (Best Keeper), and Player of the Season.

---

### 🏆 2. World Cup Edition
- **177 Historical World Cup Teams**: Ingests team datasets spanning 1970 to 2026.
- **Knockout Tournament Format**: Group stage followed by Quarter Finals, Semi Finals, 3rd Place Match, and Final.
- **Spin & Draft System**: Draw random historical teams with orthogonal rerolls (*Another Team* / *Another Season*).
- **Extra Time & Penalty Shootouts**: Level knockout ties trigger 30 minutes of Extra Time and penalty kicks.

---

### 🎡 3. Squad Draft Engine & Pitch Layout
- **Interactive Football Pitch**: Drag-and-drop players into tactical slots supporting `4-3-3`, `4-2-3-1`, `4-4-2`, `4-2-2-2`, `3-5-2`, `3-4-3`, and `5-3-2`.
- **Dynamic Chemistry & Ratings Bar**: Live calculation of Attack, Midfield, Defense, Goalkeeping OVR, and Team Chemistry %.
- **88+ Rating Highlights**: Players with an 88+ OVR rating are visually highlighted with golden card borders and badges.

---

### 📊 4. Google Sports Style Match Scorecards
- **Headerless Event Grid**: Completed match score cards feature a clean 2-column layout aligned by Home vs Away team with minute timestamps and central event icons (⚽ Goal, 🟨 Yellow Card, 🟥 Red Card).
- **Detailed Match Summaries**: Inspect match stats, possession %, shots on target, commentary logs, player ratings, and Man of the Match awards.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

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

- **`npm run dev`**: Starts Vite development server with Hot Module Replacement (HMR).
- **`npm run build`**: Runs TypeScript type-checking (`tsc`) and compiles production assets into `dist/`.
- **`npm run preview`**: Serves the compiled `dist/` production bundle locally for previewing.
- **`npm run lint`**: Runs ESLint to check code quality.

---

## 📁 Project Structure

```
c:\Projects\FootBallSimulator\
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI & game components
│   │   ├── draft/           # Squad picker, spin modal, summary panels
│   │   ├── football/        # Interactive pitch, formation selector
│   │   ├── laliga/          # Matchday schedule, standings table, team details, awards
│   │   └── simulation/      # Scorecards, live match, tournament bracket, leaderboards
│   ├── data/                # Dataset loaders & edition metadata
│   ├── data-json/           # La Liga & World Cup JSON squad datasets
│   ├── engine/              # Simulation engines (La Liga simulator, match simulator, draft engine)
│   ├── images/              # Team logo PNGs & La Liga branding assets
│   ├── pages/               # Main views (Home, Draft, Tournament, La Liga)
│   ├── types/               # TypeScript interfaces & models (football.ts)
│   ├── utils/               # Storage helpers, team logo resolvers, formatters
│   ├── App.tsx              # Root component & main router
│   └── main.tsx             # Application entry point
├── package.json             # Dependencies and build scripts
├── tailwind.config.js       # Custom Tailwind theme configuration
└── vite.config.ts           # Vite build configuration
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
