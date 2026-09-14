import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const ASSETS = {
  diningRoom: 'https://cdn.3dassets.dev/assets/16545/v1/model.glb',
  combiOven: 'https://cdn.3dassets.dev/assets/16412/v1/model.glb',
  bainMarie: 'https://cdn.3dassets.dev/assets/16416/v1/model.glb',
  cardTerminal: 'https://cdn.3dassets.dev/assets/16521/v1/model.glb',
}

const CHAPTERS = [
  {
    kicker: '01 · Arrival',
    title: 'A restaurant is a living system.',
    body: 'Walk inside. Munaffa sits underneath the hospitality experience and connects what the guest sees to what the owner earns.',
  },
  {
    kicker: '02 · Table 12',
    title: 'One table. One shared order.',
    body: 'Guest, waiter or POS can start the same session. QR is optional. Every entry point reaches the same restaurant state.',
  },
  {
    kicker: '03 · Kitchen',
    title: 'The same order becomes kitchen work.',
    body: 'Two Paneer Tikka reaches KDS. New becomes Preparing, then Ready and Served. No duplicate demo state.',
  },
  {
    kicker: '04 · Recipe → Stock',
    title: 'Every plate has an inventory consequence.',
    body: 'Recipe assumptions become stock-ledger movements. Paneer, spices and other ingredients move because this order happened.',
  },
  {
    kicker: '05 · Payment',
    title: '₹349 revenue is not ₹349 profit.',
    body: 'Payment updates the same transaction, then Munaffa decomposes the sale into ingredient cost, payment cost, variance and contribution.',
  },
  {
    kicker: '06 · Leak',
    title: 'Follow the money that disappeared.',
    body: 'Supplier increase, excess portioning and wastage combine into a measurable rupee leak with evidence—not a generic warning.',
  },
  {
    kicker: '07 · Owner Intelligence',
    title: 'What changed → rupee impact → next action.',
    body: 'The restaurant compresses into a decision. Munaffa shows the cause, the financial impact and the operational action the owner should take next.',
  },
]

const CAMERA_PATH = [
  { p: [0.4, 2.2, 8.6], t: [0, 1.05, 0.4], fov: 48 },
  { p: [2.8, 1.62, 4.1], t: [1.55, 0.82, 0.15], fov: 44 },
  { p: [0.4, 1.75, -3.4], t: [0.1, 1.0, -6.8], fov: 47 },
  { p: [-1.6, 1.7, -8.6], t: [-1.15, 0.95, -11.7], fov: 43 },
  { p: [1.7, 1.55, -12.1], t: [1.0, 0.9, -14.2], fov: 40 },
  { p: [0.3, 2.05, -16.0], t: [0.25, 1.3, -19.8], fov: 45 },
  { p: [0.0, 5.4, -20.3], t: [0.0, 1.2, -20.3], fov: 50 },
]

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function restaurantState(progress) {
  const chapterFloat = progress * (CHAPTERS.length - 1)
  const chapter = Math.min(CHAPTERS.length - 1, Math.floor(chapterFloat + 0.0001))
  const recipeActive = chapter >= 3
  const paid = chapter >= 4
  const leakFound = chapter >= 5

  return {
    chapter,
    table: 12,
    guests: chapter >= 1 ? 2 : 0,
    orderId: chapter >= 1 ? 'T12-0842' : '—',
    order: chapter >= 1 ? '2 × Paneer Tikka' : 'Waiting',
    kds: chapter < 2 ? 'Not sent' : chapter === 2 ? 'Preparing' : 'Served',
    paneerKg: recipeActive ? 12.8 : 13.2,
    sale: paid ? 349 : 0,
    ingredientCost: paid ? 104 : 0,
    paymentCost: paid ? 9 : 0,
    varianceCost: paid ? 14 : 0,
    contribution: paid ? 222 : 0,
    leak: leakFound ? 37 : 0,
    nextAction: leakFound ? 'Review paneer portion + supplier price' : 'Waiting for evidence',
  }
}

function SceneAsset({ url, ...props }) {
  const gltf = useGLTF(url)
  const clone = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  useEffect(() => {
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
  }, [clone])

  return <primitive object={clone} {...props} />
}

function SpatialLabel({ children, position, visible = true, className = '' }) {
  if (!visible) return null
  return (
    <Html position={position} transform distanceFactor={7.5} occlude="blending" style={{ pointerEvents: 'none' }}>
      <div className={`spatial-label ${className}`}>{children}</div>
    </Html>
  )
}

function World({ progress, state }) {
  return (
    <group>
      <SceneAsset url={ASSETS.diningRoom} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />

      <group position={[0, 0, -14.6]}>
        <SceneAsset url={ASSETS.combiOven} position={[-2.15, 0, -0.4]} rotation={[0, 0.15, 0]} />
        <SceneAsset url={ASSETS.bainMarie} position={[-0.75, 0, 0.15]} rotation={[0, -0.08, 0]} />
        <SceneAsset url={ASSETS.cardTerminal} position={[2.3, 0.88, 0.35]} rotation={[0, -1.2, 0]} scale={1.35} />
      </group>

      <SpatialLabel position={[1.55, 1.18, 0.1]} visible={progress > 0.13 && progress < 0.43} className="label-table">
        <span>TABLE 12</span>
        <strong>{state.order}</strong>
        <small>Shared session · {state.orderId}</small>
      </SpatialLabel>

      <SpatialLabel position={[-1.2, 1.75, -13.8]} visible={progress > 0.29 && progress < 0.62} className="label-kds">
        <span>KDS</span>
        <strong>{state.kds}</strong>
        <small>{state.order}</small>
      </SpatialLabel>

      <SpatialLabel position={[-0.55, 1.45, -15.05]} visible={progress > 0.43 && progress < 0.73} className="label-stock">
        <span>STOCK LEDGER</span>
        <strong>Paneer {state.paneerKg.toFixed(1)} kg</strong>
        <small>{state.paneerKg < 13 ? '−0.4 kg from this order' : 'Recipe not consumed yet'}</small>
      </SpatialLabel>

      <SpatialLabel position={[1.8, 1.7, -15.6]} visible={progress > 0.58 && progress < 0.87} className="label-money">
        <span>TRANSACTION</span>
        <strong>₹{state.sale}</strong>
        <small>Contribution ₹{state.contribution}</small>
      </SpatialLabel>

      <SpatialLabel position={[0, 2.2, -20.3]} visible={progress > 0.76} className="label-owner">
        <span>PROFIT LEAK ENGINE</span>
        <strong>₹{state.leak} lost</strong>
        <small>Supplier ↑ · excess portion · wastage</small>
      </SpatialLabel>
    </group>
  )
}

function CameraRail({ progress }) {
  const { camera } = useThree()
  const current = useRef(new THREE.Vector3(...CAMERA_PATH[0].p))
  const currentTarget = useRef(new THREE.Vector3(...CAMERA_PATH[0].t))

  useFrame((_, delta) => {
    const maxIndex = CAMERA_PATH.length - 1
    const scaled = clamp01(progress) * maxIndex
    const i = Math.min(maxIndex - 1, Math.floor(scaled))
    const localT = scaled - i
    const a = CAMERA_PATH[i]
    const b = CAMERA_PATH[Math.min(maxIndex, i + 1)]

    const desired = new THREE.Vector3(
      lerp(a.p[0], b.p[0], localT),
      lerp(a.p[1], b.p[1], localT),
      lerp(a.p[2], b.p[2], localT),
    )
    const desiredTarget = new THREE.Vector3(
      lerp(a.t[0], b.t[0], localT),
      lerp(a.t[1], b.t[1], localT),
      lerp(a.t[2], b.t[2], localT),
    )

    const damping = 1 - Math.exp(-delta * 5.5)
    current.current.lerp(desired, damping)
    currentTarget.current.lerp(desiredTarget, damping)
    camera.position.copy(current.current)
    camera.fov = lerp(camera.fov, lerp(a.fov, b.fov, localT), damping)
    camera.updateProjectionMatrix()
    camera.lookAt(currentTarget.current)
  })

  return null
}

function LoadingScene() {
  return (
    <Html center>
      <div className="scene-loader">
        <div className="loader-line" />
        <span>Building the restaurant world…</span>
      </div>
    </Html>
  )
}

function RestaurantCanvas({ progress, state }) {
  return (
    <Canvas
      className="world-canvas"
      shadows
      dpr={[1, 1.6]}
      camera={{ position: CAMERA_PATH[0].p, fov: CAMERA_PATH[0].fov, near: 0.05, far: 90 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.92
        gl.outputColorSpace = THREE.SRGBColorSpace
      }}
    >
      <color attach="background" args={['#0b0a08']} />
      <ambientLight intensity={0.62} />
      <directionalLight position={[5, 9, 7]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-5, 5, -12]} target-position={[0, 0, -15]} intensity={120} angle={0.6} penumbra={0.45} distance={22} />
      <spotLight position={[4, 4, 1]} target-position={[1, 0, 0]} intensity={60} angle={0.7} penumbra={0.65} distance={18} />
      <Environment preset="city" background={false} environmentIntensity={0.45} />
      <Suspense fallback={<LoadingScene />}>
        <World progress={progress} state={state} />
      </Suspense>
      <CameraRail progress={progress} />
    </Canvas>
  )
}

function Metric({ label, value, muted = false }) {
  return (
    <div className={`metric ${muted ? 'muted' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function LiveState({ state }) {
  return (
    <aside className="live-state" aria-label="Live restaurant state">
      <div className="live-head">
        <span className="live-dot" />
        <span>ONE RESTAURANT STATE</span>
      </div>
      <div className="state-grid">
        <Metric label="Table" value={`#${state.table}`} />
        <Metric label="KDS" value={state.kds} muted={state.kds === 'Not sent'} />
        <Metric label="Paneer" value={`${state.paneerKg.toFixed(1)} kg`} />
        <Metric label="Sale" value={`₹${state.sale}`} muted={!state.sale} />
        <Metric label="Contribution" value={`₹${state.contribution}`} muted={!state.contribution} />
        <Metric label="Leak" value={`₹${state.leak}`} muted={!state.leak} />
      </div>
      <div className="action-row">
        <span>Next action</span>
        <strong>{state.nextAction}</strong>
      </div>
    </aside>
  )
}

function MoneyBreakdown({ visible }) {
  return (
    <div className={`money-breakdown ${visible ? 'visible' : ''}`} aria-hidden={!visible}>
      <div><span>Sale</span><strong>₹349</strong></div>
      <i>−</i>
      <div><span>Ingredients</span><strong>₹104</strong></div>
      <i>−</i>
      <div><span>Payment</span><strong>₹9</strong></div>
      <i>−</i>
      <div><span>Variance</span><strong>₹14</strong></div>
      <i>=</i>
      <div className="contribution"><span>Contribution</span><strong>₹222</strong></div>
    </div>
  )
}

function App() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        setProgress(clamp01(window.scrollY / max))
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const state = restaurantState(progress)
  const active = Math.min(CHAPTERS.length - 1, Math.round(progress * (CHAPTERS.length - 1)))

  return (
    <main className="app-shell">
      <div className="world-layer" aria-hidden="true">
        <RestaurantCanvas progress={progress} state={state} />
        <div className="world-vignette" />
      </div>

      <header className="topbar">
        <a className="brand" href="#arrival" aria-label="Munaffa home">MUNAFFA</a>
        <div className="progress-copy">TABLE 12 · LIVE ORDER JOURNEY</div>
        <a className="product-link" href="#owner">OPEN PROFIT STORY <span>↘</span></a>
      </header>

      <LiveState state={state} />
      <MoneyBreakdown visible={progress > 0.57 && progress < 0.82} />

      <nav className="chapter-rail" aria-label="Story chapters">
        {CHAPTERS.map((chapter, index) => (
          <a
            key={chapter.kicker}
            href={`#chapter-${index}`}
            className={index === active ? 'active' : ''}
            aria-label={chapter.kicker}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </a>
        ))}
      </nav>

      <div className="story-layer">
        {CHAPTERS.map((chapter, index) => (
          <section
            id={index === 0 ? 'arrival' : index === CHAPTERS.length - 1 ? 'owner' : `chapter-${index}`}
            className={`chapter chapter-${index}`}
            key={chapter.kicker}
          >
            <div className="chapter-copy">
              <p className="chapter-kicker">{chapter.kicker}</p>
              <h1>{chapter.title}</h1>
              <p className="chapter-body">{chapter.body}</p>
              {index === 0 && (
                <div className="scroll-cue">
                  <span>SCROLL TO WALK INSIDE</span>
                  <i>↓</i>
                </div>
              )}
              {index === 1 && (
                <div className="event-chip"><span>ORDER EVENT</span><strong>2 × Paneer Tikka · ₹349</strong></div>
              )}
              {index === 2 && (
                <div className="status-sequence"><span>NEW</span><b>→</b><span className="hot">PREPARING</span><b>→</b><span>READY</span><b>→</b><span>SERVED</span></div>
              )}
              {index === 3 && (
                <div className="inventory-shift"><span>Paneer stock</span><strong>13.2 kg <i>→</i> 12.8 kg</strong></div>
              )}
              {index === 5 && (
                <div className="leak-callout"><span>₹37 LEAK FOUND</span><strong>Supplier price ↑ + excess portion + wastage</strong></div>
              )}
              {index === 6 && (
                <div className="owner-decision">
                  <span>RECOMMENDED ACTION</span>
                  <strong>Re-cost Paneer Tikka, reset portion standard, review supplier quote.</strong>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <footer className="source-note">
        Prototype environment uses CC0 restaurant assets as a temporary visualization layer. Final launch target: original Munaffa-owned environment and camera choreography.
      </footer>
    </main>
  )
}

useGLTF.preload(ASSETS.diningRoom)
useGLTF.preload(ASSETS.combiOven)
useGLTF.preload(ASSETS.bainMarie)
useGLTF.preload(ASSETS.cardTerminal)

export default App
