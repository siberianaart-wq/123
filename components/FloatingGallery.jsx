'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import galleryImages from '../gallery.config'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return isMobile
}

function OrbitGallery({ onOpen }) {
  const containerRef = useRef(null)
  const angleRef = useRef(0)
  const cardsRef = useRef([])
  const count = galleryImages.length

  const tiers = useMemo(() => {
    const perTier = 4
    const tierCount = Math.ceil(count / perTier)
    const result = []
    for (let t = 0; t < tierCount; t++) {
      const itemsInTier = Math.min(perTier, count - t * perTier)
      result.push({
        items: galleryImages.slice(t * perTier, t * perTier + itemsInTier),
        startIdx: t * perTier,
        count: itemsInTier,
        radiusX: 420 + t * 60,
        radiusY: 180 + t * 40,
        yCenter: -200 + t * 200,
        speed: 14 + t * 4,
        direction: t % 2 === 0 ? 1 : -1,
        cardSize: 300 - t * 20,
      })
    }
    return result
  }, [count])

  useEffect(() => {
    let animFrame
    let lastTime = performance.now()

    const animate = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current = (angleRef.current + delta * 60) % 360

      for (const tier of tiers) {
        for (let j = 0; j < tier.count; j++) {
          const globalIdx = tier.startIdx + j
          const el = cardsRef.current[globalIdx]
          if (!el) continue

          const baseAngle = (angleRef.current * tier.speed / 60) * tier.direction
          const itemAngle = baseAngle + (j * 360) / tier.count
          const rad = (itemAngle * Math.PI) / 180

          const x = Math.cos(rad) * tier.radiusX
          const yOrbit = Math.sin(rad) * tier.radiusY * 0.4
          const y = yOrbit + tier.yCenter

          const depth = (Math.sin(rad) + 1) / 2
          const scale = 0.45 + 0.65 * depth
          const zIndex = Math.round(depth * 100)
          const brightness = 0.15 + 0.85 * depth

          el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
          el.style.zIndex = zIndex
          el.style.filter = `brightness(${brightness})`
        }
      }

      animFrame = requestAnimationFrame(animate)
    }

    animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [tiers])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
      }}
    >
      {galleryImages.map((src, i) => {
        const tierIdx = Math.floor(i / 4)
        const tier = tiers[tierIdx]
        return (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el }}
            onClick={() => onOpen(i)}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: tier?.cardSize ?? 300,
              height: tier?.cardSize ?? 300,
              cursor: 'pointer',
              borderRadius: 16,
              overflow: 'hidden',
              willChange: 'transform',
            }}
          >
            <img
              src={src}
              alt={`Work ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              boxShadow: 'inset 0 0 40px 15px rgba(0,0,0,0.6)',
              pointerEvents: 'none',
            }} />
          </div>
        )
      })}
    </div>
  )
}

function MobileCarousel({ onOpen }) {
  const [active, setActive] = useState(0)
  const touchStart = useRef(null)
  const count = galleryImages.length

  const prev = () => setActive((a) => (a - 1 + count) % count)
  const next = () => setActive((a) => (a + 1) % count)

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
    touchStart.current = null
  }

  const getOffset = (index) => {
    let diff = index - active
    if (diff > count / 2) diff -= count
    if (diff < -count / 2) diff += count
    return diff
  }

  return (
    <div
      style={{
        padding: '3rem 0 2rem',
        position: 'relative',
        height: '85vw',
        overflow: 'hidden',
        perspective: '800px',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {galleryImages.map((src, i) => {
        const offset = getOffset(i)
        const absOff = Math.abs(offset)
        const visible = absOff <= 2

        if (!visible) return null

        const translateX = offset * 55
        const translateZ = -absOff * 120
        const rotateY = offset * -25
        const scale = 1 - absOff * 0.2
        const opacity = 1 - absOff * 0.3
        const zIndex = 10 - absOff

        return (
          <div
            key={i}
            onClick={() => {
              if (offset === 0) onOpen(i)
              else if (offset > 0) next()
              else prev()
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '78vw',
              height: '78vw',
              transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
              transition: 'all 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)',
              zIndex,
              opacity,
              cursor: 'pointer',
              borderRadius: 16,
              overflow: 'hidden',
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
                filter: offset === 0 ? 'brightness(1)' : 'brightness(0.5)',
                transition: 'filter 0.45s ease',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 16,
              boxShadow: 'inset 0 0 40px 15px rgba(0,0,0,0.6)',
              pointerEvents: 'none',
            }} />
          </div>
        )
      })}
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
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
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
  const isMobile = useIsMobile()
  useEffect(() => setMounted(true), [])

  const handleOpen = useCallback((i) => setOpenIndex(i), [])
  const handleClose = useCallback(() => setOpenIndex(null), [])

  return (
    <section style={isMobile ? {} : {
      height: '150vh',
      position: 'relative',
      overflow: 'visible',
    }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{
          ...(isMobile ? {
            padding: '0 1.5rem',
            marginBottom: '0.5rem',
          } : {
            position: 'absolute',
            top: '1.5rem',
            left: '3rem',
          }),
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.5em',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          margin: isMobile ? '0 0 0 1.5rem' : 0,
          zIndex: 20,
        }}
      >
        WORKS
      </motion.p>

      {mounted && !isMobile && (
        <OrbitGallery onOpen={handleOpen} />
      )}

      {mounted && isMobile && (
        <MobileCarousel onOpen={handleOpen} />
      )}

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox src={galleryImages[openIndex]} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  )
}
