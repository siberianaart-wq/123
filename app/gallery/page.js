'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import galleryImages from '../../gallery.config'

export default function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState(null)
  const [columns, setColumns] = useState(3)
  const [isMobile, setIsMobile] = useState(false)

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
    const handleKey = (e) => { if (e.key === 'Escape') setOpenIndex(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const canExpand = !isMobile && columns < 6
  const canShrink = !isMobile && columns > 3

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

      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobile ? '0.5rem' : '1rem',
        }}
      >
        {galleryImages.map((src, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setOpenIndex(i)}
            style={{
              aspectRatio: '1',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 2,
            }}
          >
            <motion.img
              layoutId={`gallery-img-${i}`}
              src={src}
              alt={`Work ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease, filter 0.4s ease',
                filter: 'brightness(0.7)',
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
      </motion.div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            key="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpenIndex(null)}
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
              layoutId={`gallery-img-${openIndex}`}
              src={galleryImages[openIndex]}
              alt="Expanded work"
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                maxWidth: '85vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
                cursor: 'default',
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{
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
              onClick={() => setOpenIndex(null)}
            >
              ✕
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
