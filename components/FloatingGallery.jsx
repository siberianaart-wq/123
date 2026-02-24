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

function TornadoCard({ src, config, index }) {
  const ref = useRef(null)
  const angleRef = useRef(config.startAngle)
  const selfSpin = useRef(0)

  useEffect(() => {
    let animFrame
    let lastTime = performance.now()
    const selfSpinSpeed = 8 + index * 3

    const animate = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current = (angleRef.current + (360 / config.speed) * delta) % 360
      selfSpin.current = (selfSpin.current + selfSpinSpeed * delta) % 360
      const rad = (angleRef.current * Math.PI) / 180
      const x = Math.cos(rad) * config.radiusX
      const yOrbit = Math.sin(rad) * config.radiusY * 0.4
      const y = yOrbit + config.yOffset
      const depth = (Math.sin(rad) + 1) / 2
      const scale = 0.7 + 0.3 * depth
      const zIndex = Math.round(scale * 10)

      const rotateY = Math.sin((selfSpin.current * Math.PI) / 180) * 25
      const rotateX = Math.cos((selfSpin.current * Math.PI) / 180) * 10
      const rotateZ = Math.sin(rad) * 8

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`
        ref.current.style.zIndex = zIndex
        ref.current.style.opacity = 0.6 + 0.4 * scale
        ref.current.style.filter = `brightness(${0.25 + 0.2 * scale})`
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [config, index])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: config.width,
        height: config.height,
        transformStyle: 'preserve-3d',
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
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
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

      const rotateY = Math.sin(rad * 1.5) * 20
      const rotateX = Math.cos(rad * 1.2) * 15

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotate(${rotation}deg) scale(${scale})`
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
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: 'translateZ(-45px)',
      }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#e84393',
          transform: 'translateZ(45px)',
          boxShadow: '0 0 60px rgba(232,67,147,0.4), 0 0 120px rgba(232,67,147,0.15)',
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#a82d6b',
          transform: 'translateZ(-45px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#b52a60',
          transform: 'rotateY(-90deg) translateZ(45px)',
          transformOrigin: 'left center',
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#d43d7a',
          transform: 'rotateY(90deg) translateZ(45px)',
          transformOrigin: 'right center',
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#d43d7a',
          transform: 'rotateX(90deg) translateZ(45px)',
          transformOrigin: 'center top',
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#b52a60',
          transform: 'rotateX(-90deg) translateZ(45px)',
          transformOrigin: 'center bottom',
        }} />
      </div>
    </div>
  )
}

export default function FloatingGallery() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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
