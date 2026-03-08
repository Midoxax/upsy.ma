import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Neural nodes inside the sphere ── */
const NeuralNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const nodeCount = 18;
  const connectionCount = 24;

  const { nodePositions, connectionGeometries } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.35;
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      );
    }

    const conns: THREE.BufferGeometry[] = [];
    const used = new Set<string>();
    let count = 0;
    for (let i = 0; i < nodeCount && count < connectionCount; i++) {
      for (let j = i + 1; j < nodeCount && count < connectionCount; j++) {
        if (positions[i].distanceTo(positions[j]) < 0.9) {
          const key = `${i}-${j}`;
          if (!used.has(key)) {
            used.add(key);
            const curve = new THREE.QuadraticBezierCurve3(
              positions[i],
              new THREE.Vector3(
                (positions[i].x + positions[j].x) / 2 + (Math.random() - 0.5) * 0.15,
                (positions[i].y + positions[j].y) / 2 + (Math.random() - 0.5) * 0.15,
                (positions[i].z + positions[j].z) / 2 + (Math.random() - 0.5) * 0.15
              ),
              positions[j]
            );
            const geo = new THREE.TubeGeometry(curve, 12, 0.006, 4, false);
            conns.push(geo);
            count++;
          }
        }
      }
    }

    return { nodePositions: positions, connectionGeometries: conns };
  }, []);

  // Orbiting particles
  const particlePositions = useMemo(() => {
    const count = 60;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.15 + Math.random() * 0.25;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -t * 0.04;
      particlesRef.current.rotation.z = t * 0.02;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Glass sphere */}
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            color="#7A0C20"
            transparent
            opacity={0.12}
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[0.95, 32, 32]} />
          <meshBasicMaterial
            color="#7A0C20"
            transparent
            opacity={0.04}
          />
        </mesh>

        {/* Neural nodes */}
        {nodePositions.map((pos, i) => (
          <mesh key={`node-${i}`} position={pos}>
            <sphereGeometry args={[0.025 + Math.random() * 0.015, 12, 12]} />
            <meshStandardMaterial
              color="#FFB300"
              emissive="#FFB300"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}

        {/* Connections */}
        {connectionGeometries.map((geo, i) => (
          <mesh key={`conn-${i}`} geometry={geo}>
            <meshBasicMaterial
              color="#A3263A"
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
      </group>

      {/* Orbiting particles */}
      <points ref={particlesRef}>
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
          size={0.015}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.4} />
    <pointLight position={[3, 3, 3]} intensity={0.6} color="#FFB300" />
    <pointLight position={[-3, -2, 2]} intensity={0.3} color="#A3263A" />
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <NeuralNodes />
    </Float>
  </>
);

const NeuralSphere = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-full ${className}`}>
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </Suspense>
  </div>
);

export default NeuralSphere;
