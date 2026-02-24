
'use client'
import { motion } from 'framer-motion'

export default function Entrance(){
  return (
    <section style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.h1
        initial={{opacity:0, y:40}}
        animate={{opacity:1, y:0}}
        transition={{duration:1.2}}
        style={{fontSize:'4rem',letterSpacing:'0.1em'}}
      >
        SI.BERIANA
      </motion.h1>
    </section>
  )
}
