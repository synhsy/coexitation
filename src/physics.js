const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const gaussian = (x, center, sigma) => {
  const z = (x - center) / sigma;
  return Math.exp(-0.5 * z * z);
};

export function computeExcitationModel({ ybPumpNm, tmAssistNm, sliceDepth }) {
  const ybAbsorption = gaussian(ybPumpNm, 980, 18);
  const tmAssist = 0.55 * gaussian(tmAssistNm, 808, 20) + 0.45 * gaussian(tmAssistNm, 1200, 55);

  // Higher depth means stronger scattering / attenuation.
  const attenuation = Math.exp(-1.6 * sliceDepth);

  // Cooperative sensitization + assisted excited-state absorption.
  const transferEfficiency = clamp(0.25 + 0.75 * (0.7 * ybAbsorption + 0.3 * tmAssist), 0, 1);

  const blue450 = clamp(attenuation * (0.2 + 0.8 * ybAbsorption) * (0.3 + 0.7 * tmAssist), 0, 1);
  const red650 = clamp(attenuation * (0.35 + 0.65 * ybAbsorption) * (0.75 - 0.35 * tmAssist), 0, 1);
  const nir800 = clamp(attenuation * (0.25 + 0.75 * tmAssist) * (0.45 + 0.55 * ybAbsorption), 0, 1);

  const dualBoost = clamp((0.2 + 0.8 * ybAbsorption * tmAssist) / Math.max(ybAbsorption, 0.15), 0.4, 3);

  const totalEmission = clamp((blue450 + red650 + nir800) / 3, 0, 1);

  return {
    ybAbsorption,
    tmAssist,
    attenuation,
    transferEfficiency,
    blue450,
    red650,
    nir800,
    dualBoost,
    totalEmission
  };
}

export function emissionToColor({ blue450, red650, nir800 }) {
  const r = clamp(0.12 + red650 * 0.88, 0, 1);
  const g = clamp(0.08 + nir800 * 0.3, 0, 1);
  const b = clamp(0.18 + blue450 * 0.82, 0, 1);
  return [r, g, b];
}
