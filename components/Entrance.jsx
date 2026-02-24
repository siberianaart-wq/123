'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const title = "SI.BERIANA"
const subtitle = "LIVING GALLERY"

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut"
    }
  })
}

const subtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: title.length * 0.12 + 0.5,
      duration: 1.2
    }
  }
}

export default function Entrance(){
  return (
    <section style={{
      height:'100vh',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      justifyContent:'center',
      gap: 'clamp(0.8rem, 2vw, 1.5rem)',
      padding: '0 1rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display:'flex',
        alignItems:'baseline',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        maxWidth: '100%',
      }}>
        {title.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(2rem, 10vw, 9rem)',
              fontWeight: 200,
              letterSpacing: 'clamp(0.01em, 0.08em, 0.08em)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: char === '.' ? '#e84393' : '#ffffff',
              display: 'inline-block'
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <Link href="/gallery" style={{ textDecoration: 'none' }}>
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(0.55rem, 1.5vw, 1.1rem)',
            letterSpacing: 'clamp(0.2em, 0.45em, 0.45em)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            margin: 0,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
          }}
          whileHover={{ color: '#e84393' }}
        >
          {subtitle}
        </motion.p>
      </Link>
    </section>
  )
}
