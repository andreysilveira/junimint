# 🌾 Junimint

**A modern dashboard for exploring, managing, and editing Stardew Valley save files.**

Bring your farm data into one place. Inspect your character, manage inventory, explore relationships, review farm information, and make supported changes through a clean, intuitive interface.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-Not%20Specified-lightgrey?style=for-the-badge" alt="License not specified" />
</p>

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Overview & Analytics** | Explore key player, farm, and save statistics through dashboard views. |
| 🧑‍🌾 **Player Editor** | Inspect and edit supported character attributes, skills, and resources. |
| 🎒 **Inventory Manager** | View and edit supported inventory items, quantities, and quality values. |
| 💚 **Relationships** | Review and edit supported friendship and relationship data. |
| 🌱 **Farm Editor** | Explore farm information and supported map elements. |
| 🌎 **World Data** | Inspect supported calendar and world-state information. |
| ⚡ **Hack Mode** | Access quick-edit tools for supported save values. |
| ↩️ **Undo & Redo** | Navigate changes made during the current editing session. |
| 🛡️ **Save Validation** | Review validation results before exporting your modified save. |
| 💾 **Save Export** | Download the edited save and, where available, a copy of the original file. |

> **Note:** Editing capabilities depend on the fields recognized by the current parser. Not every game version, mod, or save structure is guaranteed to be supported.

## 🖥️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **Data Parsing:** Fast XML Parser
- **Charts:** Recharts
- **Animations:** Motion
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- A modern web browser

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd stardew-valley-ultimate-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in your terminal. The Vite development server is configured to use port `3000`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the application for production in `dist/`. |
| `npm run preview` | Serves the production build locally for preview. |
| `npm run lint` | Runs the TypeScript compiler with `--noEmit` to check types. |
| `npm run clean` | Removes the `dist/` directory in environments that support `rm`. |

**Heads up:** The `lint` script currently performs TypeScript checks; it does not run ESLint.

## 🎮 How to Use

1. Launch the dashboard in your browser.
2. Select your Stardew Valley save file.
3. Explore the available dashboard sections.
4. Edit supported values and review your changes.
5. Use Undo and Redo to manage changes during the session.
6. Review the validation results before exporting.
7. Download the modified save and test it in the game.

### 📂 Save File Locations

Common save locations include:

| Platform | Typical Location |
| --- | --- |
| **Windows** | `%AppData%\StardewValley\Saves` |
| **macOS** | `~/.config/StardewValley/Saves` or the installation-specific data directory |
| **Linux** | `~/.config/StardewValley/Saves` |

Locations may vary depending on your operating system, installation method, and game configuration.

Each farm usually has its own directory containing the save file and related data. Back up the entire farm directory before editing.

## 🗂️ Project Structure

```text
src/
├── application/          # Domain actions and editing operations
├── components/           # UI components and feature-specific editors
│   ├── analytics/        # Analytics dashboard
│   ├── farm/             # Farm editing tools
│   ├── hack/             # Quick-edit tools
│   ├── inventory/        # Inventory management
│   ├── player/           # Player profile and attributes
│   ├── relationships/    # NPC relationships
│   ├── save/             # Save validation and export
│   └── world/            # World data
├── domain/               # Domain types and core models
├── hooks/                # Session state and editing history
├── infrastructure/save/  # XML parsing, serialization, and validation
├── lib/                  # Utilities and legacy parser code
└── App.tsx               # Main application composition
```

## 🔒 Safety & Compatibility

Your save file represents hours of gameplay. Protect it before making changes.

- **Always create a backup** of the original save before editing.
- Keep the original file until you have verified that the exported save works correctly.
- Treat validation results as helpful checks, not a guarantee that every save will work in-game.
- Compatibility may vary across game versions, platforms, and modded saves.
- Avoid editing saves while the game is actively writing to them.
- Review environment variables and build configuration before publishing to ensure that no secrets are bundled into the frontend.

The dashboard should be treated as a save-editing tool with limited format coverage, not as a universal editor for every field in Stardew Valley.

## 🧪 Development & Quality

Before submitting changes, run:

```bash
npm run lint
npm run build
```

Additional automated tests are recommended for:

- XML parsing and serialization.
- Round-trip import and export.
- Preservation of unknown XML fields.
- Inventory slot positions and empty slots.
- Undo and redo behavior.
- Validation failures and malformed save files.

## 🤝 Contributing

Contributions, bug reports, and improvement ideas are welcome.

When proposing a change, please include:

1. A clear description of the problem or improvement.
2. Steps to reproduce the issue, where applicable.
3. Relevant error messages or screenshots.
4. Tests or validation steps performed.

Please avoid sharing personal save files publicly unless you have reviewed their contents and are comfortable disclosing them.

## ⚖️ Disclaimer

Junimint is an independent, unofficial project. It is not affiliated with, endorsed by, or associated with ConcernedApe or the official Stardew Valley development team.

Stardew Valley and its related assets and trademarks belong to their respective owners.

---

<p align="center">
  <strong>Made for the love of farming, exploring, and building your perfect valley. 🌻</strong>
</p>