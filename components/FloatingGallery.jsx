
'use client'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'

function Work(){
  return (
    <Float>
      <mesh>
        <boxGeometry args={[1,1,0.1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Float>
  )
}

export default function FloatingGallery(){
  return (
    <section style={{height:'100vh'}}>
      <Canvas camera={{position:[0,0,4]}}>
        <ambientLight/>
        <Work/>
        <OrbitControls/>
      </Canvas>
    </section>
  )
}
