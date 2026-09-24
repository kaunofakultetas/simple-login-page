// -----------------------------------------------------------
//  [*] Particles — the animated background canvas
//
//  A thin wrapper around react-tsparticles running the slim
//  engine bundle: linked dots that drift slowly and repel
//  around the cursor, capped at 30 fps to stay light. The
//  fullScreen option makes the library insert its canvas at
//  zIndex -1 — Login's gradient container turns that into
//  "behind the card, over the gradient" (see App.jsx).
//
//  The particle count scales with the window width at MOUNT
//  (one dot per 10 px); there is no resize listener, so the
//  count stays fixed until a reload.
//
//  The component is named ParticlesComponent because the
//  library's own component is already imported as Particles.
// -----------------------------------------------------------

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useState, useEffect } from "react";








// -----------------------------------------------------------
// ParticlesComponent (default export)
// -----------------------------------------------------------
//
// Used by:
//   - App.jsx — Login renders it behind the card
// -----------------------------------------------------------

export default function ParticlesComponent(props) {

  // One dot per 10 px of window width, decided once on mount
  const [particleNumber, setParticleNumber] = useState(0);
  useEffect(() => {
    setParticleNumber(window.innerWidth / 10);
  }, []);


  // Rebuilt on every render — harmless, tsparticles only reads
  // it when the canvas (re)initialises
  const options = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    fpsLimit: 30,
    detectRetina: true,
    interactivity: {
      events: {
        onClick: {
          enable: false,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 10,
        },
        repulse: {
          distance: 100,
        },
      },
    },
    particles: {
      links: {
        enable: true,
        distance: 150,
        opacity: 0.5
      },
      move: {
        enable: true,
        speed: { min: 0.01, max: 1.0 },
      },
      opacity: {
        value: { min: 0.0, max: 0.2 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      number: {
        value: particleNumber,
      },
    },
  }


  // loadSlim: the slim engine bundle — no heavy plugins
  const particlesInit = useCallback(async options => {
    await loadSlim(options);
  }, []);


  return <Particles id={props.id} init={particlesInit} options={options} />;
}
