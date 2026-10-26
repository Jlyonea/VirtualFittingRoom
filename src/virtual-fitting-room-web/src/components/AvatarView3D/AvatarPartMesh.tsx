import type { AvatarPart } from './avatarGeometry';

const RADIAL_SEGMENTS = 32;

interface AvatarPartMeshProps {
  part: AvatarPart;
}

export function AvatarPartMesh({ part }: AvatarPartMeshProps) {
  return (
	<mesh position={part.position} scale={[1, 1, part.depthScale]}>
	  {part.shape === 'sphere' ? (
		<sphereGeometry args={[part.radius, RADIAL_SEGMENTS, RADIAL_SEGMENTS]} />
	  ) : (
		<cylinderGeometry args={[part.radiusTop, part.radiusBottom, part.height, RADIAL_SEGMENTS]} />
	  )}
	  <meshStandardMaterial color={part.color} />
	</mesh>
  );
}
