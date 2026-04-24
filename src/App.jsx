import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Text } from '@react-three/drei';
import { Color } from 'three';
import { computeExcitationModel, emissionToColor } from './physics';
import './styles.css';

function NanoparticleScene({ metrics, sliceDepth }) {
  const color = useMemo(() => {
    const [r, g, b] = emissionToColor(metrics);
    return new Color(r, g, b);
  }, [metrics]);

  const planeY = 1.2 - sliceDepth * 2.4;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 4, 4]} intensity={2} color="#ffe9b5" />
      <pointLight position={[-3, -4, -1]} intensity={1} color="#9fd3ff" />

      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55 + metrics.totalEmission * 1.6}
          metalness={0.05}
          roughness={0.2}
          transmission={0.28}
          thickness={1.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh position={[0, planeY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.27, 64]} />
        <meshBasicMaterial color="#fff2a6" transparent opacity={0.35} />
      </mesh>

      <Text position={[-1.8, 1.5, 0]} fontSize={0.15} color="#8ee7ff">
        Yb3+ sensitizers
      </Text>
      <Text position={[1.25, -1.45, 0]} fontSize={0.15} color="#ffb5ce">
        Tm3+ activators
      </Text>
      <Text position={[0, -1.9, 0]} fontSize={0.13} color="#ffffff">
        Slice depth: {(sliceDepth * 100).toFixed(0)}%
      </Text>

      <OrbitControls enablePan={false} maxDistance={5} minDistance={2.2} />
    </>
  );
}

function Slider({ label, value, min, max, onChange, unit }) {
  return (
    <label className="slider-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <strong>
        {value} {unit}
      </strong>
    </label>
  );
}

export default function App() {
  const [ybPumpNm, setYbPumpNm] = useState(980);
  const [tmAssistNm, setTmAssistNm] = useState(808);
  const [sliceDepth, setSliceDepth] = useState(0.35);

  const metrics = useMemo(
    () => computeExcitationModel({ ybPumpNm, tmAssistNm, sliceDepth }),
    [ybPumpNm, tmAssistNm, sliceDepth]
  );

  return (
    <div className="layout">
      <header>
        <h1>Dual-Wavelength Coexcitation in Yb/Tm UCNPs</h1>
        <p>
          Explore how 980 nm Yb pumping plus an assist wavelength for Tm modifies energy-transfer
          efficiency, visible emission, and depth-resolved signal.
        </p>
      </header>

      <div className="main-grid">
        <section className="viewer-panel">
          <Canvas camera={{ position: [2.6, 1.8, 2.8], fov: 47 }}>
            <color attach="background" args={['#030712']} />
            <NanoparticleScene metrics={metrics} sliceDepth={sliceDepth} />
            <Html position={[-2.5, 2.25, 0]}>
              <div className="tooltip">NIR in → Visible/NIR out</div>
            </Html>
          </Canvas>
        </section>

        <section className="controls-panel">
          <h2>Controls</h2>
          <Slider label="Yb pump" value={ybPumpNm} min={900} max={1030} onChange={setYbPumpNm} unit="nm" />
          <Slider
            label="Tm assist"
            value={tmAssistNm}
            min={700}
            max={1300}
            onChange={setTmAssistNm}
            unit="nm"
          />
          <label className="slider-row">
            <span>Slice depth</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sliceDepth}
              onChange={(e) => setSliceDepth(Number(e.target.value))}
            />
            <strong>{(sliceDepth * 100).toFixed(0)}%</strong>
          </label>

          <div className="metrics">
            <h3>Real-time emission model</h3>
            <ul>
              <li>Yb absorption (980 nm band): {(metrics.ybAbsorption * 100).toFixed(1)}%</li>
              <li>Tm assist coupling: {(metrics.tmAssist * 100).toFixed(1)}%</li>
              <li>Energy transfer efficiency: {(metrics.transferEfficiency * 100).toFixed(1)}%</li>
              <li>Dual-vs-single excitation gain: {metrics.dualBoost.toFixed(2)}×</li>
              <li>Blue (~450 nm) channel: {(metrics.blue450 * 100).toFixed(1)}%</li>
              <li>Red (~650 nm) channel: {(metrics.red650 * 100).toFixed(1)}%</li>
              <li>NIR (~800 nm) channel: {(metrics.nir800 * 100).toFixed(1)}%</li>
            </ul>
          </div>

          <div className="info-boxes">
            <article>
              <h4>Mechanism</h4>
              <p>
                Yb3+ acts as the sensitizer with strong 980 nm absorption. Excited Yb3+ transfers energy
                stepwise to Tm3+, populating higher Tm states that relax radiatively to blue/red/NIR bands.
              </p>
            </article>
            <article>
              <h4>Why dual wavelength helps</h4>
              <p>
                A second wavelength can drive excited-state absorption or refill intermediate Tm states,
                improving transfer pathways and increasing net emission compared with 980 nm-only pumping.
              </p>
            </article>
            <article>
              <h4>Biomedical imaging relevance</h4>
              <p>
                Depth slider emulates tissue attenuation. Coexcitation can recover signal at deeper slices,
                useful for high-contrast in vivo imaging with low autofluorescence background.
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
