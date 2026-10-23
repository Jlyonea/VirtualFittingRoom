import type { BodyMeasurements } from '../../types/avatar';
import type { Outfit } from '../../types/outfit';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CENTER_X,
  buildLegPoints,
  buildNeckPoints,
  buildPantsPoints,
  buildShirtPoints,
  buildTorsoPoints,
  calculateBodyLayout,
  toPointsString,
} from './avatarGeometry';
import styles from './AvatarView2D.module.css';

interface AvatarView2DProps {
  measurements: BodyMeasurements;
  outfit: Outfit;
}

export function AvatarView2D({ measurements, outfit }: AvatarView2DProps) {
  const layout = calculateBodyLayout(measurements);

  return (
    <svg
      className={styles.canvas}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      role="img"
      aria-label="Avatar preview"
    >
      <g className={styles.body}>
        <circle cx={CENTER_X} cy={layout.headCenterY} r={layout.headRadius} />
        <polygon points={toPointsString(buildNeckPoints(layout))} />
        <polygon points={toPointsString(buildTorsoPoints(layout))} />
        {buildLegPoints(layout).map((legPoints, index) => (
          <polygon key={index} points={toPointsString(legPoints)} />
        ))}
      </g>
      {outfit.pants && (
        <polygon
          className={styles.garment}
          data-testid="pants-layer"
          fill={outfit.pants.color}
          points={toPointsString(buildPantsPoints(layout, outfit.pants.measurements))}
        />
      )}
      {outfit.shirt && (
        <polygon
          className={styles.garment}
          data-testid="shirt-layer"
          fill={outfit.shirt.color}
          points={toPointsString(buildShirtPoints(layout, outfit.shirt.measurements))}
        />
      )}
    </svg>
  );
}
