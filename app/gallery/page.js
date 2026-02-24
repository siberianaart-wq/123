'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import galleryImages from '../../gallery.config'

export default function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState(null)
  const [animPhase, setAnimPhase] = useState('idle')
  const [columns, setColumns] = useState(3)
  const [isMobile, setIsMobile] = useState(false)
  const [startRect, setStartRect] = useState(null)
  const imgRefs = useRef({})

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      if (w < 768) setColumns(2)
      else setColumns(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openIndex])

  const handleOpen = useCallback((i) => {
    const el = imgRefs.current[i]
    if (!el) return
    const rect = el.getBoundingClientRect()
    setStartRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    })
    setOpenIndex(i)
    setAnimPhase('from')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimPhase('to')
      })
    })
  }, [])

  const handleClose = useCallback(() => {
    if (openIndex === null) return
    const el = imgRefs.current[openIndex]
    if (el) {
      const rect = el.getBoundingClientRect()
      setStartRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
    setAnimPhase('from')
    setTimeout(() => {
      setOpenIndex(null)
      setAnimPhase('idle')
    }, 450)
  }, [openIndex])

  const canExpand = !isMobile && columns < 6
  const canShrink = !isMobile && columns > 3
  const isActive = openIndex !== null

  const getExpandedStyle = () => {
    if (!startRect) return {}
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (animPhase === 'to') {
      return {
        top: vh * 0.075,
        left: vw * 0.075,
        width: vw * 0.85,
        height: vh * 0.85,
        borderRadius: 8,
        opacity: 1,
      }
    }
    return {
      top: startRect.top,
      left: startRect.left,
      width: startRect.width,
      height: startRect.height,
      borderRadius: 2,
      opacity: 1,
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: isMobile ? '1.5rem 1rem' : '3rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isMobile ? '1.5rem' : '2.5rem',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(0.6rem, 1.2vw, 0.9rem)',
              letterSpacing: '0.4em',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
            whileHover={{ color: '#e84393' }}
          >
            ← SI.BERIANA
          </motion.span>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <button
              onClick={() => canShrink && setColumns(c => c - 1)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                color: canShrink ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                padding: '0.4rem 0.8rem',
                cursor: canShrink ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
              }}
            >
              −
            </button>
            <span style={{
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              minWidth: '1.5rem',
              textAlign: 'center',
            }}>
              {columns}
            </span>
            <button
              onClick={() => canExpand && setColumns(c => c + 1)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                color: canExpand ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                padding: '0.4rem 0.8rem',
                cursor: canExpand ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobile ? '0.5rem' : '1rem',
        }}
      >
        {galleryImages.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            ref={(el) => { if (el) imgRefs.current[i] = el }}
            onClick={() => handleOpen(i)}
            style={{
              aspectRatio: '1',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            <img
              src={src}
              alt={`Work ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease, filter 0.4s ease',
                filter: 'brightness(0.7)',
                visibility: (openIndex === i && animPhase !== 'idle') ? 'hidden' : 'visible',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.filter = 'brightness(1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'brightness(0.7)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {isActive && startRect && (
        <>
          <div
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              zIndex: 999,
              opacity: animPhase === 'to' ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
          <div
            onClick={handleClose}
            style={{
              position: 'fixed',
              ...getExpandedStyle(),
              zIndex: 1000,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'top 0.45s cubic-bezier(0.25,0.1,0.25,1), left 0.45s cubic-bezier(0.25,0.1,0.25,1), width 0.45s cubic-bezier(0.25,0.1,0.25,1), height 0.45s cubic-bezier(0.25,0.1,0.25,1), border-radius 0.45s cubic-bezier(0.25,0.1,0.25,1)',
            }}
          >
            <img
              src={galleryImages[openIndex]}
              alt="Expanded work"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: 'default',
              }}
            />
          </div>
          <div
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.5rem',
              fontWeight: 200,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              cursor: 'pointer',
              zIndex: 1001,
              lineHeight: 1,
              opacity: animPhase === 'to' ? 1 : 0,
              transition: 'opacity 0.3s ease 0.15s',
            }}
            onClick={handleClose}
          >
            ✕
          </div>
        </>
      )}
    </div>
  )
}
