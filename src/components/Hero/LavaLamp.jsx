import styles from './LavaLamp.module.css';

// Glass body: trapezoid, 110×210 px coordinate space.
// Top neck x 27–83 (56 px). Bottom x 5–105 (100 px).
// clip-path in CSS and SVG d attribute must stay identical.
const GLASS_PATH = 'M 27,0 L 83,0 L 105,210 L 5,210 Z';

// Base spool path — also used for the base SVG outline clip.
const BASE_PATH =
  'M 5,0 L 105,0 C 108,12 86,18 83,29 C 86,40 108,46 105,58 ' +
  'L 5,58 C 2,46 24,40 27,29 C 24,18 2,12 5,0 Z';

export default function LavaLamp() {
  return (
    <div className={styles.lamp} aria-hidden="true">
      <div className={styles.lampBody}>

        {/* Cap — upside-down trapezoid continuing glass wall angle */}
        <div className={styles.capSection}>
          <div className={styles.topCap} />
          <svg className={styles.capOutline} viewBox="0 0 110 26">
            <path className={styles.metalRim} d="M 30,0 L 80,0 L 83,26 L 27,26 Z" />
          </svg>
        </div>

        {/* Glass body with inside-stroke SVG outline */}
        <div className={styles.glassOuter}>
          <div className={styles.glass}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
            <div className={styles.blob4} />
          </div>
          <svg className={styles.glassOutline} viewBox="0 0 110 210">
            <path className={styles.rimPath} d={GLASS_PATH} />
          </svg>
        </div>

        {/* Base spool with inside-stroke SVG outline */}
        <div className={styles.baseSection}>
          <div className={styles.base} />
          <svg className={styles.baseOutline} viewBox="0 0 110 58">
            <path className={styles.metalRim} d={BASE_PATH} />
          </svg>
        </div>

      </div>
    </div>
  );
}
