import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { bodyPainAreas, type PainArea } from "@/data/bodyPainMap";

interface BodyModel3DProps {
  onAreaClick: (area: PainArea) => void;
  selectedArea: PainArea | null;
}

// 3D human body built from primitives
function HumanBody({ onAreaClick, selectedArea }: BodyModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const skinColor = "#e8beac";
  const highlightColor = "#22d3ee";
  const selectedColor = "#ef4444";

  const getColor = (id: string) => {
    if (selectedArea?.id === id) return selectedColor;
    if (hovered === id) return highlightColor;
    return skinColor;
  };

  const handleClick = (areaId: string) => {
    const area = bodyPainAreas.find(a => a.id === areaId);
    if (area) onAreaClick(area);
  };

  const BodyPart = ({ id, position, args, type = "box" }: { id: string; position: [number, number, number]; args: any; type?: string }) => (
    <mesh
      position={position}
      onClick={(e) => { e.stopPropagation(); handleClick(id); }}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(id); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(null); document.body.style.cursor = "default"; }}
    >
      {type === "sphere" ? <sphereGeometry args={args} /> : <boxGeometry args={args} />}
      <meshStandardMaterial color={getColor(id)} roughness={0.6} metalness={0.1} />
    </mesh>
  );

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <BodyPart id="head" position={[0, 2.7, 0]} args={[0.35, 32, 32]} type="sphere" />
      {/* Neck */}
      <BodyPart id="neck" position={[0, 2.2, 0]} args={[0.12, 0.2, 0.12]} />
      {/* Chest */}
      <BodyPart id="chest" position={[0, 1.7, 0]} args={[0.7, 0.6, 0.35]} />
      {/* Upper Abdomen */}
      <BodyPart id="upper-abdomen" position={[0, 1.2, 0]} args={[0.65, 0.3, 0.33]} />
      {/* Lower Abdomen */}
      <BodyPart id="lower-abdomen" position={[0, 0.85, 0]} args={[0.6, 0.3, 0.3]} />
      {/* Lower Back */}
      <BodyPart id="lower-back" position={[0, 0.6, -0.1]} args={[0.55, 0.2, 0.15]} />
      {/* Left Shoulder */}
      <BodyPart id="left-shoulder" position={[-0.55, 1.9, 0]} args={[0.18, 32, 32]} type="sphere" />
      {/* Right Shoulder */}
      <BodyPart id="right-shoulder" position={[0.55, 1.9, 0]} args={[0.18, 32, 32]} type="sphere" />
      {/* Left Arm */}
      <BodyPart id="left-arm" position={[-0.65, 1.3, 0]} args={[0.12, 0.9, 0.12]} />
      {/* Right Arm */}
      <BodyPart id="right-arm" position={[0.65, 1.3, 0]} args={[0.12, 0.9, 0.12]} />
      {/* Left forearm */}
      <mesh position={[-0.65, 0.55, 0.05]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.65, 0.55, 0.05]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Left Leg Upper */}
      <mesh position={[-0.2, 0.15, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Right Leg Upper */}
      <mesh position={[0.2, 0.15, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Left Knee */}
      <BodyPart id="left-knee" position={[-0.2, -0.35, 0]} args={[0.12, 32, 32]} type="sphere" />
      {/* Right Knee */}
      <BodyPart id="right-knee" position={[0.2, -0.35, 0]} args={[0.12, 32, 32]} type="sphere" />
      {/* Left Lower Leg */}
      <mesh position={[-0.2, -0.85, 0]}>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Right Lower Leg */}
      <mesh position={[0.2, -0.85, 0]}>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Left Foot */}
      <BodyPart id="left-foot" position={[-0.2, -1.3, 0.05]} args={[0.15, 0.1, 0.25]} />
      {/* Right Foot */}
      <BodyPart id="right-foot" position={[0.2, -1.3, 0.05]} args={[0.15, 0.1, 0.25]} />

      {/* Label for hovered area */}
      {hovered && (
        <Html position={[0, 3.3, 0]} center>
          <div className="bg-background/90 backdrop-blur border border-border rounded-lg px-3 py-1 text-sm font-medium whitespace-nowrap shadow-lg">
            {bodyPainAreas.find(a => a.id === hovered)?.name || hovered}
          </div>
        </Html>
      )}
    </group>
  );
}

const BodyModel3D = ({ onAreaClick, selectedArea }: BodyModel3DProps) => {
  return (
    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-b from-muted/30 to-muted/10 border border-border">
      <Canvas camera={{ position: [0, 0.5, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        <Suspense fallback={
          <Html center>
            <div className="text-muted-foreground text-sm">Loading 3D Model...</div>
          </Html>
        }>
          <HumanBody onAreaClick={onAreaClick} selectedArea={selectedArea} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI * 3 / 4} />
      </Canvas>
      <p className="text-xs text-center text-muted-foreground py-1">🖱️ Drag to rotate • Click body part to analyze</p>
    </div>
  );
};

export default BodyModel3D;
