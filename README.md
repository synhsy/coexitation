# Yb/Tm Dual-Wavelength Coexcitation Visualizer

This project is an interactive educational React + Three.js application for exploring upconversion in **Yb³⁺/Tm³⁺ doped nanoparticles**. It demonstrates:

- How 980 nm excitation of **Yb³⁺ sensitizers** transfers energy to **Tm³⁺ activators**.
- How a second wavelength can increase excited-state population and enhance emission intensity.
- How signal changes with **slice depth** (a simple tomography-style attenuation model).

## Core Concepts Implemented

### 1) Upconversion mechanism (Yb/Tm)

The model includes a simplified physical mapping:

- **Yb absorption band near 980 nm** sets sensitizer excitation probability.
- **Tm assist band** (e.g., around 808 nm) boosts intermediate Tm-state population.
- Emission channels are represented as approximate bands:
  - Blue (~450 nm)
  - Red (~650 nm)
  - NIR (~800 nm)

All channels are recomputed in real time as users adjust wavelengths.

### 2) Dual-wavelength coexcitation

Two independent controls are exposed:

- `Yb pump` slider (900–1030 nm)
- `Tm assist` slider (700–1300 nm)

The panel reports:

- Yb absorption efficiency
- Tm coupling efficiency
- Energy transfer efficiency
- Estimated **dual-vs-single excitation gain** (×)

### 3) Interactive 3D visualization

The nanoparticle is rendered in Three.js via `@react-three/fiber` with:

- Emissive color tied to model outputs (blue/red/NIR channels)
- A moving **slice plane** tied to depth control
- Labels for Yb³⁺ and Tm³⁺ regions
- Orbit controls for rotation and zoom

### 4) Educational UI features

- Mechanism info cards
- Real-time numerical metrics
- Inline tooltip in scene
- Context text for biomedical imaging (depth attenuation and contrast)

## React + Three.js Code Structure

```text
.
├── index.html
├── package.json
└── src
    ├── App.jsx        # UI, sliders, educational text, 3D scene composition
    ├── main.jsx       # React entry point
    ├── physics.js     # Simplified coexcitation + emission model
    └── styles.css     # Layout and visual styling
```

### Data flow

1. Sliders update React state (`ybPumpNm`, `tmAssistNm`, `sliceDepth`).
2. `computeExcitationModel(...)` recomputes transfer/emission metrics.
3. Emission metrics are converted to RGB by `emissionToColor(...)`.
4. The 3D nanoparticle emissive material updates in real time.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL (usually `http://localhost:5173`).

## Notes for biomedical imaging education

The depth slider is a conceptual attenuation proxy (not a full Monte Carlo tissue model). It is intentionally simple for teaching:

- greater depth → stronger attenuation
- dual-wavelength settings can partially recover signal

For research-grade modeling, replace `src/physics.js` with calibrated rate-equation parameters or experimentally fitted spectra.
