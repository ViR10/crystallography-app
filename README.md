# CrystalloGraphy — Interactive 3D Crystallographic Learning Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Platform-Desktop_%26_Mobile-2563EB" alt="Responsive" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

<p align="center">
  <strong>The premier interactive 3D learning platform designed for Materials Science, Metallurgical, and Solid-State Physics students to master Miller Indices, directional vectors, and crystal planes.</strong>
</p>

<p align="center">
  <a href="https://virdevelopers.netlify.app">ViR Developers</a> •
  <a href="https://adeelshahid.netlify.app">Adeel Shahid (Digital Profile)</a> •
  <a href="https://github.com/ViR10">GitHub (@ViR10)</a> •
  <a href="https://www.linkedin.com/in/adeel0014">LinkedIn</a>
</p>

---

## 🌟 Why CrystalloGraphy?

Crystallography is the structural foundation of materials engineering, phase transformations, X-ray diffraction (XRD), and semiconductor manufacturing. However, traditional textbooks teach 3D spatial geometry using flat 2D black-and-white drawings. Students frequently struggle with:

- Visualizing **negative indices** and required **origin shifts**.
- Understanding **reciprocal space** and planar intercepts at infinity ($\infty$).
- Distinguishing between specific directions $[uvw]$ vs families $\langle uvw \rangle$, and planes $(hkl)$ vs families $\{hkl\}$.
- Calculating intermediate intercepts and finding least common multiples (LCM).

**CrystalloGraphy** solves this by providing a lightweight, high-performance, trigonometric 3D visualization engine running natively in the browser on both desktop and mobile devices—without heavy WebGL dependencies.

---

## 🚀 Key Features

### 1. 🧭 Crystallographic Directions $[uvw]$
- **Interactive Tracing**: Step-by-step vector walk along the $x$, $y$, and $z$ axes with live playback and coordinate annotations.
- **Origin Shifting Engine**: Automatic origin repositioning whenever negative indices (e.g., $[\bar{1}10]$) are plotted.
- **Direction Families**: Explore symmetric equivalents in the cubic crystal system ($\langle 100 \rangle$, $\langle 110 \rangle$, $\langle 111 \rangle$).

### 2. 🔷 Crystal Planes $(hkl)$
- **Reciprocal Calculation**: Interactive walkthrough deriving Miller indices from planar axial intercepts $(p, q, r) \to (1/p, 1/q, 1/r) \to (hkl)$.
- **Planes Parallel to Axes**: Clear visual demonstrations of planes with intercepts at infinity ($\infty \to 0$).
- **Polygon Shading**: Real-time triangular and hexagonal polygon rendering within the Simple Cubic (SC) unit cell.

### 3. 🔬 3D Expert Sandbox
- **Freeform Projections**: Arbitrary inputs for any Miller indices $(hkl)$ or $[uvw]$ vectors.
- **Quick Preset Shortcuts**: 1-tap presets for standard crystallographic planes ($(100)$, $(110)$, $(111)$, $(001)$) and axis vectors ($[100]$, $[110]$, $[111]$).
- **Smooth Rotation**: Dynamic angular orbit with slider control and instant zero-reset.

### 4. ✏️ Guided Problem Solvers
- **Scaffolded Practice**: Step-by-step assisted calculators for both directions and planes.
- **Intermediate Verification**: Validates each fractional coordinate, reciprocal step, and reduction before advancing.
- **Instant Hint Support**: Contextual hints guiding students through tricky edge cases.

### 5. ⚔️ The Practice Arena
- **300+ Curated Problems**: Covers forward identification, reverse plotting, coordinate math, and symmetry.
- **Game Modes**:
  - **Standard Mode**: Self-paced problem solving with thorough explanations.
  - **Blitz Mode**: Time-attack challenges with combo streak multipliers.
  - **Boss Battles**: High-stakes 3-life endurance mode against advanced exam-level questions.
- **Gamified Progression**: Earn XP, rank up from *Novice* to *Grandmaster Crystallographer*, build streaks, and unlock achievement medals.

### 6. 📱 Mobile-First & Responsive Across Every Layer
- **Fluid Layouts**: Built from the ground up for seamless operation across smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **Touch-Optimized**: 44px+ minimum touch targets, slide-down mobile navigation drawer with backdrop blur, and swipeable tabs.

---

## 🛠️ Architecture & Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 5](https://vitejs.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with localStorage progress persistence
- **Routing**: [React Router v6](https://reactrouter.com/)
- **3D Graphics Engine**: Custom HTML5 Canvas 2D projection engine computing isometric/perspective trigonometric transformations natively without external heavy 3D runtimes.
- **Styling**: Modern, responsive CSS design system with CSS custom properties, fluid clamp typography, and dark/light high-contrast accessibility.

---

## 📁 Project Structure

```text
Crystallographic/
├── docs/                               # Product requirements & curriculum specification
│   └── Crystallography_Complete_Product_Curriculum.md
├── public/                             # PWA web manifest, icons, and static assets
│   ├── app.webmanifest
│   └── favico.png
├── src/
│   ├── components/
│   │   ├── 3d/                         # Custom Canvas 2D 3D projection visualizers
│   │   │   ├── CrystalCanvas.tsx
│   │   │   └── LessonCanvas.tsx
│   │   ├── about/                      # About platform and developer profile view
│   │   │   └── AboutView.tsx
│   │   ├── dashboard/                  # Student mission control & active tracks
│   │   │   └── DashboardView.tsx
│   │   ├── home/                       # Educational landing page with live 3D hero
│   │   │   └── HomeView.tsx
│   │   ├── layout/                     # Responsive Navbar and multi-column Footer
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── learning/                   # Curriculum tracks (Fundamentals, Directions, Planes, Sandbox)
│   │   │   ├── FundamentalsView.tsx
│   │   │   ├── MillerIndicesLearn.tsx
│   │   │   ├── CrystalPlanesLearn.tsx
│   │   │   └── ExpertSandbox.tsx
│   │   ├── practice/                   # Practice Arena, Blitz, and Guided Step Solvers
│   │   │   ├── PracticeArena.tsx
│   │   │   ├── MillerGuidedPractice.tsx
│   │   │   └── PlanesGuidedPractice.tsx
│   │   └── utilities/                  # Progress matrix and Mastery certificate
│   │       ├── ProgressView.tsx
│   │       └── MasteryView.tsx
│   ├── store/                          # Zustand progress, streak, and XP store
│   │   └── progressStore.ts
│   ├── utils/                          # 3D math and Canvas drawing utilities
│   │   ├── drawingUtils.ts
│   │   └── mathUtils.ts
│   ├── App.tsx                         # Client-side router configuration
│   ├── index.css                       # Platform design system & media queries
│   └── main.tsx                        # React application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ViR10/Crystallographic.git
   cd Crystallographic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/` to view the platform live.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Generates optimized static assets in the `dist/` folder ready for deployment on Netlify, Vercel, or GitHub Pages.

---

## 👨‍💻 Author & Engineering Team

- **Lead Platform Engineer**: **Adeel Shahid**
  - **Digital Profile**: [https://adeelshahid.netlify.app](https://adeelshahid.netlify.app)
  - **LinkedIn**: [https://www.linkedin.com/in/adeel0014](https://www.linkedin.com/in/adeel0014)
  - **GitHub**: [@ViR10](https://github.com/ViR10)

- **Development Collective**: **ViR Developers**
  - **Website**: [https://virdevelopers.netlify.app](https://virdevelopers.netlify.app)
  - **GitHub Organization**: [https://github.com/ViR10](https://github.com/ViR10)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, study, and modify it for educational and research purposes.
