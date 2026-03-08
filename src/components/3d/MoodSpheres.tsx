import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type MoodState = "calm" | "focus" | "stress";

const CalmSphere = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
    }
  });
  return (
    <Float speed={0.8} floatIntensity={0.2}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshPhysicalMaterial
          color="#7A0C20"
          transparent
          opacity={0.55}
          roughness={0.05}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>
      {/* Soft inner glow */}
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color="#A3263A" transparent opacity={0.08} />
      </mesh>
    </Float>
  );
};

const FocusSphere = () => {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(t * 1.5) * 0.06;
    }
  });
  return (
    <Float speed={1} floatIntensity={0.25}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshPhysicalMaterial
          color="#FFB300"
          transparent
          opacity={0.45}
          roughness={0.08}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.03}
          emissive="#FFB300"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshBasicMaterial color="#FFB300" transparent opacity={0.1} />
      </mesh>
    </Float>
  );
};

const StressSphere = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlePositions = useMemo(() => {
    const count = 40;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.35 + Math.random() * 0.15;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.x = Math.sin(t * 3) * 0.01;
      groupRef.current.position.y = Math.cos(t * 2.5) * 0.01;
      groupRef.current.rotation.z = Math.sin(t * 4) * 0.02;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.15}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.42, 48, 48]} />
          <meshPhysicalMaterial
            color="#A3263A"
            transparent
            opacity={0.4}
            roughness={0.15}
            clearcoat={0.7}
          />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlePositions.length / 3}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#FFB300"
            size={0.02}
            transparent
            opacity={0.7}
            sizeAttenuation
          />
        </points>
      </group>
    </Float>
  );
};

const Label = ({ position, text }: { position: [number, number, number]; text: string }) => {
  // We skip drei's Text to avoid font loading; labels handled in HTML overlay
  return null;
};

const Scene = () => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[3, 3, 3]} intensity={0.5} color="#FFB300" />
    <pointLight position={[-3, -2, 2]} intensity={0.25} color="#A3263A" />
    <group position={[-1.6, 0, 0]}>
      <CalmSphere />
    </group>
    <group position={[0, 0, 0]}>
      <FocusSphere />
    </group>
    <group position={[1.6, 0, 0]}>
      <StressSphere />
    </group>
  </>
);

const MoodSpheres = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-full h-full ${className}`}>
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </Suspense>
    {/* HTML labels */}
    <div className="absolute bottom-4 left-0 right-0 flex justify-around pointer-events-none">
      <span className="text-xs font-medium text-u-gray-300">Calm</span>
      <span className="text-xs font-medium text-u-gold">Focus</span>
      <span className="text-xs font-medium text-u-crimson">Stress</span>
    </div>
  </div>
);

export default MoodSpheres;
