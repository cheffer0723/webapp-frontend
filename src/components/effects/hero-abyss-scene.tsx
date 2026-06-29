import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeDotTexture(): THREE.Texture {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(190,230,255,0.8)");
  g.addColorStop(1, "rgba(190,230,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

function useDotTexture(): THREE.Texture {
  const tex = useMemo(makeDotTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

const RANGE = { x: 14, yTop: 9, yBot: -9, zNear: 2, zFar: -11 };

interface DriftProps {
  count: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  sway: number;
}

function Drift({ count, size, color, speed, opacity, sway }: DriftProps) {
  const ref = useRef<THREE.Points>(null);
  const tex = useDotTexture();

  const { positions, baseX, vels, phase } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const baseX = new Float32Array(count);
    const vels = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * RANGE.x;
      baseX[i] = x;
      positions[i * 3] = x;
      positions[i * 3 + 1] = Math.random() * (RANGE.yTop - RANGE.yBot) + RANGE.yBot;
      positions[i * 3 + 2] = Math.random() * (RANGE.zNear - RANGE.zFar) + RANGE.zFar;
      vels[i] = speed * (0.5 + Math.random());
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions, baseX, vels, phase };
  }, [count, speed]);

  useFrame((state, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const d = Math.min(0.05, delta);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + vels[i] * d;
      if (y > RANGE.yTop) {
        y = RANGE.yBot;
        baseX[i] = (Math.random() * 2 - 1) * RANGE.x;
      }
      arr[i * 3 + 1] = y;
      arr[i * 3] = baseX[i] + Math.sin(t * 0.4 + phase[i]) * sway;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={tex}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Spire() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = t * 0.14;
    g.position.y = Math.sin(t * 0.35) * 0.25;
  });
  return (
    <group ref={ref} position={[0, 0, -3.5]}>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[1.05, 4.4, 4, 1, true]} />
        <meshBasicMaterial color="#16d6ff" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, -1.0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.05, 2.0, 4, 1, true]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function Glow() {
  const tex = useDotTexture();
  return (
    <sprite position={[0, 0.5, -6]} scale={[16, 16, 1]}>
      <spriteMaterial
        map={tex}
        color="#0a9fc4"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

function Rig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    const { camera, clock } = state;
    const tx = pointer.current.x * 0.9 + Math.sin(clock.elapsedTime * 0.12) * 0.25;
    const ty = pointer.current.y * 0.5 + 0.1;
    camera.position.x += (tx - camera.position.x) * 0.025;
    camera.position.y += (ty - camera.position.y) * 0.025;
    camera.lookAt(0, 0, -3.5);
  });
  return null;
}

export default function HeroAbyssScene() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 62 }}
    >
      <color attach="background" args={["#010309"]} />
      <fogExp2 attach="fog" args={["#010309", 0.08]} />
      <Glow />
      <Spire />
      <Drift count={900} size={0.07} color="#bfe9ff" speed={0.5} opacity={0.9} sway={0.25} />
      <Drift count={70} size={0.24} color="#b569f7" speed={0.26} opacity={0.65} sway={0.45} />
      <Rig pointer={pointer} />
    </Canvas>
  );
}
