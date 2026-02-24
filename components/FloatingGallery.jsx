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
  { radiusX: 300, radiusY: 130, speed: 45, startAngle: 0, width: 260, height: 200, yOffset: -60 },
  { radiusX: 340, radiusY: 150, speed: 55, startAngle: 72, width: 240, height: 220, yOffset: 30 },
  { radiusX: 260, radiusY: 170, speed: 65, startAngle: 144, width: 280, height: 180, yOffset: 120 },
  { radiusX: 320, radiusY: 140, speed: 50, startAngle: 216, width: 220, height: 240, yOffset: -100 },
  { radiusX: 280, radiusY: 160, speed: 60, startAngle: 288, width: 250, height: 210, yOffset: 180 },
]

const pinkSquareConfig = {
  radiusX: 200, radiusY: 100, speed: 40, startAngle: 36, size: 120, yOffset: 50,
}

function TornadoCard({ src, config, index }) {
  const ref = useRef(null)
  const angleRef = useRef(config.startAngle)

  useEffect(() => {
    let animFrame
    let lastTime = performance.now()

    const animate = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current = (angleRef.current + (360 / config.speed) * delta) % 360
      const rad = (angleRef.current * Math.PI) / 180
      const x = Math.cos(rad) * config.radiusX
      const yOrbit = Math.sin(rad) * config.radiusY * 0.4
      const y = yOrbit + config.yOffset
      const scale = 0.7 + 0.3 * ((Math.sin(rad) + 1) / 2)
      const rotation = Math.sin(rad) * 12
      const zIndex = Math.round(scale * 10)

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${scale})`
        ref.current.style.zIndex = zIndex
        ref.current.style.opacity = 0.6 + 0.4 * scale
        ref.current.style.filter = `brightness(${0.25 + 0.2 * scale})`
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [config])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: config.width,
        height: config.height,
      }}
    >
      <img
        src={src}
        alt={`Work ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}
      />
    </div>
  )
}

function PinkSquare() {
  const ref = useRef(null)
  const angleRef = useRef(pinkSquareConfig.startAngle)

  useEffect(() => {
    let animFrame
    let lastTime = performance.now()

    const animate = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current = (angleRef.current + (360 / pinkSquareConfig.speed) * delta) % 360
      const rad = (angleRef.current * Math.PI) / 180
      const x = Math.cos(rad) * pinkSquareConfig.radiusX
      const yOrbit = Math.sin(rad) * pinkSquareConfig.radiusY * 0.4
      const y = yOrbit + pinkSquareConfig.yOffset
      const scale = 0.8 + 0.2 * ((Math.sin(rad) + 1) / 2)
      const rotation = angleRef.current * 0.3
      const zIndex = Math.round(scale * 10)

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${scale})`
        ref.current.style.zIndex = zIndex
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: pinkSquareConfig.size,
        height: pinkSquareConfig.size,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        background: '#e84393',
        borderRadius: 0,
        boxShadow: '0 0 60px rgba(232,67,147,0.4), 0 0 120px rgba(232,67,147,0.15)',
      }} />
    </div>
  )
}

export default function FloatingGallery() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section style={{
      height: '100vh',
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
          <PinkSquare />
          {images.map((src, i) => (
            <TornadoCard
              key={i}
              src={src}
              config={cardConfigs[i]}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  )
}
