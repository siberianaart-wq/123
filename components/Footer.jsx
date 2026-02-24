'use client'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer style={{
      padding: '4rem 3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
    }}>
      <motion.a
        href="https://www.instagram.com/si.beriana/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.5em',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#e84393'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
      >
        INSTAGRAM
      </motion.a>
      <motion.a
        href="mailto:siberiana.art@gmail.com"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        style={{
          fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
          letterSpacing: '0.3em',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#e84393'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
      >
        siberiana.art@gmail.com
      </motion.a>
    </footer>
  )
}
