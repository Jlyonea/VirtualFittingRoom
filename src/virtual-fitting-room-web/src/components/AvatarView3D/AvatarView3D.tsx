import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { BodyMeasurements } from '../../types/avatar';
import type { Outfit } from '../../types/outfit';
import { AvatarPartMesh } from './AvatarPartMesh';
import { buildAvatarParts, calculateBodyLayout, type Vector3Tuple } from './avatarGeometry';
import styles from './AvatarView3D.module.css';

const SKIN_COLOR_VARIABLE = '--color-skin';
const CAMERA_DISTANCE = 4;
const CAMERA_FIELD_OF_VIEW = 35;
const AMBIENT_LIGHT_INTENSITY = 0.8;
const KEY_LIGHT_INTENSITY = 1;
const KEY_LIGHT_POSITION: Vector3Tuple = [2, 4, 3];

interface AvatarView3DProps {
  measurements: BodyMeasurements;
  outfit: Outfit;
}

function readCssVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function AvatarView3D({ measurements, outfit }: AvatarView3DProps) {
  const layout = calculateBodyLayout(measurements);
  const parts = buildAvatarParts(layout, outfit, readCssVariable(SKIN_COLOR_VARIABLE));
  const target: Vector3Tuple = [0, layout.height / 2, 0];

  return (
	<div className={styles.canvas} role="img" aria-label="Avatar preview">
	  <Canvas camera={{ position: [0, target[1], CAMERA_DISTANCE], fov: CAMERA_FIELD_OF_VIEW }}>
		<ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
		<directionalLight position={KEY_LIGHT_POSITION} intensity={KEY_LIGHT_INTENSITY} />
		{parts.map((part) => (
		  <AvatarPartMesh key={part.id} part={part} />
		))}
		<OrbitControls target={target} enablePan={false} enableZoom={false} />
	  </Canvas>
	</div>
  );
}
