'use client'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const images = [
  '/2026-02-24_00-02-00.png',
  '/2026-02-24_00-02-33.png',
  '/2026-02-24_00-03-12.png',
  '/2026-02-24_00-03-44.png',
  '/2026-02-24_00-04-05.png',
]

const cardConfigs = [
  { radiusX: 380, radiusY: 170, speed: 45, startAngle: 0, width: 680, height: 500, yOffset: -100 },
  { radiusX: 420, radiusY: 190, speed: 55, startAngle: 72, width: 360, height: 400, yOffset: 120 },
  { radiusX: 340, radiusY: 210, speed: 65, startAngle: 144, width: 440, height: 300, yOffset: 340 },
  { radiusX: 400, radiusY: 180, speed: 50, startAngle: 216, width: 320, height: 440, yOffset: 550 },
  { radiusX: 360, radiusY: 200, speed: 60, startAngle: 288, width: 400, height: 360, yOffset: 760 },
]

const pinkSquareConfig = {
  radiusX: 280, radiusY: 140, speed: 40, startAngle: 36, size: 180, yOffset: 250,
}

const TOTAL = images.length + 1

function getRect(x, y, w, h) {
  return { left: x - w / 2, right: x + w / 2, top: y - h / 2, bottom: y + h / 2 }
}

function rectsOverlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

function overlapAmount(a, b) {
  const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left)
  const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
  return ox > 0 && oy > 0 ? Math.sqrt(ox * ox + oy * oy) : 0
}

export default function FloatingGallery() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef(null)
  const refsArr = useRef([])
  const stateRef = useRef(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return

    const angles = []
    const directions = []
    const selfSpins = []
    const velocities = []
    const bounceTimers = []
    const sizes = []

    for (let i = 0; i < images.length; i++) {
      angles.push(cardConfigs[i].startAngle)
      directions.push(1)
      selfSpins.push(0)
      velocities.push(360 / cardConfigs[i].speed)
      bounceTimers.push(0)
      sizes.push({ w: cardConfigs[i].width * 0.6, h: cardConfigs[i].height * 0.6 })
    }
    angles.push(pinkSquareConfig.startAngle)
    directions.push(1)
    selfSpins.push(0)
    velocities.push(360 / pinkSquareConfig.speed)
    bounceTimers.push(0)
    sizes.push({ w: pinkSquareConfig.size * 0.6, h: pinkSquareConfig.size * 0.6 })

    stateRef.current = { angles, directions, selfSpins, velocities, bounceTimers, sizes }

    let animFrame
    let lastTime = performance.now()

    const animate = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      const st = stateRef.current

      for (let i = 0; i < st.bounceTimers.length; i++) {
        if (st.bounceTimers[i] > 0) st.bounceTimers[i] -= delta
      }

      const positions = []
      for (let i = 0; i < TOTAL; i++) {
        st.angles[i] = (st.angles[i] + st.velocities[i] * st.directions[i] * delta) % 360
        if (st.angles[i] < 0) st.angles[i] += 360
        st.selfSpins[i] += (10 + i * 2) * delta

        const isSquare = i === images.length
        const cfg = isSquare ? pinkSquareConfig : cardConfigs[i]
        const rad = (st.angles[i] * Math.PI) / 180
        const x = Math.cos(rad) * cfg.radiusX
        const yOrbit = Math.sin(rad) * cfg.radiusY * 0.4
        const y = yOrbit + cfg.yOffset
        positions.push({ x, y, idx: i })
      }

      for (let i = 0; i < TOTAL; i++) {
        for (let j = i + 1; j < TOTAL; j++) {
          const a = positions[i]
          const b = positions[j]
          const ra = getRect(a.x, a.y, st.sizes[i].w, st.sizes[i].h)
          const rb = getRect(b.x, b.y, st.sizes[j].w, st.sizes[j].h)
          if (rectsOverlap(ra, rb) && st.bounceTimers[i] <= 0 && st.bounceTimers[j] <= 0) {
            const overlap = overlapAmount(ra, rb)
            if (overlap > 20) {
              st.directions[i] *= -1
              st.directions[j] *= -1
              st.bounceTimers[i] = 1.5
              st.bounceTimers[j] = 1.5
              st.velocities[i] = Math.min(st.velocities[i] * 1.15, 20)
              st.velocities[j] = Math.min(st.velocities[j] * 1.15, 20)
              setTimeout(() => {
                if (stateRef.current) {
                  const isSquareI = i === images.length
                  const isSquareJ = j === images.length
                  stateRef.current.velocities[i] = 360 / (isSquareI ? pinkSquareConfig.speed : cardConfigs[i].speed)
                  stateRef.current.velocities[j] = 360 / (isSquareJ ? pinkSquareConfig.speed : cardConfigs[j].speed)
                }
              }, 2000)
            }
          }
        }
      }

      for (let i = 0; i < TOTAL; i++) {
        const el = refsArr.current[i]
        if (!el) continue

        const isSquare = i === images.length
        const cfg = isSquare ? pinkSquareConfig : cardConfigs[i]
        const rad = (st.angles[i] * Math.PI) / 180
        const depth = (Math.sin(rad) + 1) / 2
        const scale = 0.7 + 0.3 * depth
        const zIndex = Math.round(scale * 10)
        const selfRad = (st.selfSpins[i] * Math.PI) / 180

        const rotateY = Math.sin(selfRad) * 25
        const rotateX = Math.cos(selfRad * 0.7) * 12
        const rotateZ = Math.sin(rad) * 8

        const p = positions[i]
        el.style.transform = `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`
        el.style.zIndex = zIndex

        if (!isSquare) {
          el.style.opacity = 0.6 + 0.4 * scale
          el.style.filter = `brightness(${0.25 + 0.2 * scale})`
        }
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [mounted])

  return (
    <section style={{
      height: '200vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: '3rem',
          left: '3rem',
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.5em',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          margin: 0,
          zIndex: 20,
        }}
      >
        WORKS
      </motion.p>

      {mounted && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '45%',
          width: 0,
          height: 0,
        }}>
          {images.map((src, i) => (
            <div
              key={i}
              ref={el => refsArr.current[i] = el}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: cardConfigs[i].width,
                height: cardConfigs[i].height,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={src}
                alt={`Work ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
                }}
              />
            </div>
          ))}

          <div
            ref={el => refsArr.current[images.length] = el}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: pinkSquareConfig.size,
              height: pinkSquareConfig.size,
              transformStyle: 'preserve-3d',
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: '#e84393',
                boxShadow: '0 0 60px rgba(232,67,147,0.4), 0 0 120px rgba(232,67,147,0.15)',
              }} />
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: '#c7316e',
                transform: 'translateZ(-30px)',
              }} />
              <div style={{
                position: 'absolute',
                width: 30,
                height: '100%',
                background: '#b52a60',
                transform: 'rotateY(90deg) translateZ(0px)',
                transformOrigin: 'left center',
              }} />
              <div style={{
                position: 'absolute',
                width: 30,
                height: '100%',
                background: '#d43d7a',
                right: 0,
                transform: 'rotateY(-90deg) translateZ(0px)',
                transformOrigin: 'right center',
              }} />
              <div style={{
                position: 'absolute',
                width: '100%',
                height: 30,
                background: '#d43d7a',
                transform: 'rotateX(90deg) translateZ(0px)',
                transformOrigin: 'center top',
              }} />
              <div style={{
                position: 'absolute',
                width: '100%',
                height: 30,
                background: '#b52a60',
                bottom: 0,
                transform: 'rotateX(-90deg) translateZ(0px)',
                transformOrigin: 'center bottom',
              }} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
