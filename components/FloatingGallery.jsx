'use client'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { Component } from 'react'

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

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
      <CanvasErrorBoundary>
        <Canvas camera={{position:[0,0,4]}}>
          <ambientLight/>
          <Work/>
          <OrbitControls/>
        </Canvas>
      </CanvasErrorBoundary>
    </section>
  )
}
