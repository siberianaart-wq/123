'use client'
import { motion } from 'framer-motion'

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
      gap: '1.5rem'
    }}>
      <div style={{display:'flex', alignItems:'baseline'}}>
        {title.split('').map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              fontWeight: 200,
              letterSpacing: '0.08em',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: char === '.' ? '#e84393' : '#ffffff',
              display: 'inline-block'
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <motion.p
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        style={{
          fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
          letterSpacing: '0.45em',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          margin: 0
        }}
      >
        {subtitle}
      </motion.p>
    </section>
  )
}
