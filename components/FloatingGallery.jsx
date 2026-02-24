'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import galleryImages from '../gallery.config'

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateCardConfigs(count) {
  const configs = []
  const rng = seededRandom(42)
  const sizes = [
    { width: 680, height: 500 },
    { width: 360, height: 400 },
    { width: 440, height: 300 },
    { width: 320, height: 440 },
    { width: 400, height: 360 },
    { width: 500, height: 350 },
    { width: 380, height: 420 },
    { width: 460, height: 310 },
  ]

  for (let i = 0; i < count; i++) {
    const size = sizes[i % sizes.length]
    const angleSpread = 360 / count
    configs.push({
      radiusX: 300 + rng() * 120,
      radiusY: 150 + rng() * 70,
      speed: 40 + rng() * 30,
      startAngle: i * angleSpread,
      width: size.width,
      height: size.height,
      yOffset: -100 + i * (900 / Math.max(count - 1, 1)),
    })
  }
  return configs
}

const pinkSquareConfig = {
  radiusX: 280, radiusY: 140, speed: 40, startAngle: 36, size: 180,
}

function TornadoCard({ src, config, index, onOpen, layer }) {
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

      const rotateY = Math.sin((selfSpin.current * Math.PI) / 180) * 25
      const rotateX = Math.cos((selfSpin.current * Math.PI) / 180) * 10
      const rotateZ = Math.sin(rad) * 8

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`
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
      onClick={() => onOpen(index)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: config.width,
        height: config.height,
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
        zIndex: layer,
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

function PinkSquare({ yOffset }) {
  const ref = useRef(null)
  const angleRef = useRef(pinkSquareConfig.startAngle)
  const selfSpin = useRef(0)

  useEffect(() => {
    let animFrame
    let lastTime = performance.now()
    const selfSpinSpeed = 12

    const animate = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current = (angleRef.current + (360 / pinkSquareConfig.speed) * delta) % 360
      selfSpin.current = (selfSpin.current + selfSpinSpeed * delta) % 360
      const rad = (angleRef.current * Math.PI) / 180
      const x = Math.cos(rad) * pinkSquareConfig.radiusX
      const yOrbit = Math.sin(rad) * pinkSquareConfig.radiusY * 0.4
      const y = yOrbit + yOffset
      const depth = (Math.sin(rad) + 1) / 2
      const scale = 0.7 + 0.3 * depth
      const rotateY = Math.sin((selfSpin.current * Math.PI) / 180) * 25
      const rotateX = Math.cos((selfSpin.current * Math.PI) / 180) * 10
      const rotateZ = Math.sin(rad) * 8

      if (ref.current) {
        ref.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`
        ref.current.style.filter = `brightness(${0.35 + 0.25 * scale})`
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
        zIndex: 3,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        background: '#e84393',
        borderRadius: 4,
        boxShadow: '0 12px 40px rgba(232,67,147,0.5), 0 0 80px rgba(232,67,147,0.2)',
      }} />
    </div>
  )
}

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        src={src}
        alt="Expanded work"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '85vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: 6,
          boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
          cursor: 'default',
        }}
      />
      <div style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '1.5rem',
        fontWeight: 200,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        cursor: 'pointer',
        zIndex: 1001,
        lineHeight: 1,
      }}
        onClick={onClose}
      >
        ✕
      </div>
    </motion.div>
  )
}

export default function FloatingGallery() {
  const [mounted, setMounted] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  useEffect(() => setMounted(true), [])

  const cardConfigs = useMemo(() => generateCardConfigs(galleryImages.length), [])
  const pinkYOffset = useMemo(() => {
    if (galleryImages.length <= 1) return 0
    const mid = Math.floor(galleryImages.length / 2)
    return cardConfigs[mid]?.yOffset ?? 250
  }, [cardConfigs])
  const sectionHeight = useMemo(() => {
    const maxY = cardConfigs.length > 0
      ? Math.max(...cardConfigs.map(c => c.yOffset + c.height))
      : 800
    return Math.max(maxY + 400, 800)
  }, [cardConfigs])

  const handleOpen = useCallback((i) => setOpenIndex(i), [])
  const handleClose = useCallback(() => setOpenIndex(null), [])

  return (
    <section style={{
      height: sectionHeight,
      position: 'relative',
      overflow: 'visible',
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
          <PinkSquare yOffset={pinkYOffset} />
          {galleryImages.map((src, i) => (
            <TornadoCard
              key={i}
              src={src}
              config={cardConfigs[i]}
              index={i}
              onOpen={handleOpen}
              layer={i + 1}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox src={galleryImages[openIndex]} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  )
}
