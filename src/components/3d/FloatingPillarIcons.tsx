import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Individual pillar icon ── */
interface PillarProps {
  position: [number, number, number];
  color: string;
  shape: "heart" | "book" | "brain" | "network";
  floatSpeed?: number;
}

const HeartShape = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04);
    }
  });

  return (
    <group ref={ref}>
      {/* Heart using two spheres + cone */}
      <mesh position={[-0.12, 0.08, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.7} roughness={0.15} clearcoat={0.8} />
      </mesh>
      <mesh position={[0.12, 0.08, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.7} roughness={0.15} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.22, 0.3, 12]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.7} roughness={0.15} clearcoat={0.8} />
      </mesh>
      {/* Neural nodes on heart */}
      {[[-0.1, 0.12, 0.1], [0.1, 0.12, 0.1], [0, -0.05, 0.15]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#FFB300" emissive="#FFB300" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
};

const BookShape = ({ color }: { color: string }) => (
  <group>
    <mesh rotation={[0, 0.15, 0]}>
      <boxGeometry args={[0.28, 0.36, 0.05]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.65} roughness={0.1} clearcoat={1} />
    </mesh>
    <mesh rotation={[0, -0.15, 0]}>
      <boxGeometry args={[0.28, 0.36, 0.05]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.55} roughness={0.1} clearcoat={1} />
    </mesh>
    {/* Spine */}
    <mesh position={[-0.14, 0, 0]}>
      <boxGeometry args={[0.02, 0.36, 0.08]} />
      <meshStandardMaterial color="#FFB300" emissive="#FFB300" emissiveIntensity={0.3} />
    </mesh>
  </group>
);

const BrainShape = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={ref}>
      {/* Brain lobes */}
      <mesh position={[-0.1, 0.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.6} roughness={0.15} clearcoat={0.9} />
      </mesh>
      <mesh position={[0.1, 0.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.6} roughness={0.15} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshPhysicalMaterial color={color} transparent opacity={0.5} roughness={0.15} clearcoat={0.9} />
      </mesh>
      {/* Energy ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.012, 12, 48]} />
        <meshStandardMaterial color="#FFB300" emissive="#FFB300" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

const NetworkShape = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  const nodes: [number, number, number][] = [
    [0, 0, 0], [-0.2, 0.15, 0.1], [0.2, 0.15, -0.1],
    [-0.15, -0.15, -0.1], [0.15, -0.15, 0.1], [0, 0.25, 0],
  ];

  return (
    <group ref={ref}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i === 0 ? 0.06 : 0.035, 12, 12]} />
          <meshPhysicalMaterial
            color={i === 0 ? "#FFB300" : color}
            transparent opacity={0.8}
            emissive={i === 0 ? "#FFB300" : color}
            emissiveIntensity={i === 0 ? 0.6 : 0.2}
            clearcoat={0.8}
          />
        </mesh>
      ))}
      {/* Connections */}
      {nodes.slice(1).map((target, i) => {
        const curve = new THREE.LineCurve3(
          new THREE.Vector3(...nodes[0]),
          new THREE.Vector3(...target)
        );
        const geo = new THREE.TubeGeometry(curve, 4, 0.005, 4, false);
        return (
          <mesh key={`c-${i}`} geometry={geo}>
            <meshBasicMaterial color="#A3263A" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

const PillarIcon = ({ position, color, shape, floatSpeed = 1.5 }: PillarProps) => (
  <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={0.4}>
    <group position={position} scale={1.1}>
      {shape === "heart" && <HeartShape color={color} />}
      {shape === "book" && <BookShape color={color} />}
      {shape === "brain" && <BrainShape color={color} />}
      {shape === "network" && <NetworkShape color={color} />}
    </group>
  </Float>
);

const Scene = () => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[5, 5, 5]} intensity={0.4} color="#FFB300" />
    <pointLight position={[-5, -3, 3]} intensity={0.2} color="#A3263A" />
    <PillarIcon position={[-2.2, 0, 0]} color="#7A0C20" shape="heart" floatSpeed={1.2} />
    <PillarIcon position={[-0.75, 0, 0]} color="#FFB300" shape="book" floatSpeed={1.6} />
    <PillarIcon position={[0.75, 0, 0]} color="#F4A300" shape="brain" floatSpeed={1.4} />
    <PillarIcon position={[2.2, 0, 0]} color="#7A0C20" shape="network" floatSpeed={1.8} />
  </>
);

const FloatingPillarIcons = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-full ${className}`}>
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </Suspense>
  </div>
);

export default FloatingPillarIcons;
