import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraControls, Stage, Environment } from '@react-three/drei'
import { NeedleEngine } from './NeedleEngine';

export default function App() {
  return (
    <Canvas 
      camera={{ position: [-4, 3, 5], fov: 30 }}
      shadows
    >

      <Stage environment="city">
        <CameraControls />
        <NeedleEngine />
        <Environment background preset="sunset" blur={0.8} />
      </Stage>
    </Canvas>
  )
}