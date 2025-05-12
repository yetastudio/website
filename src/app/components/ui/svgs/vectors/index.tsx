import styles from './styles.module.css'

export const HighlightVector = () => (
  <svg
    className={styles.highlightVector}
    xmlns="http://www.w3.org/2000/svg"
    width={47}
    height={17}
    fill="none"
  >
    <path
      stroke="var(--foreground)"
      strokeWidth={2.074}
      d="M14.648 15.025 9.975 7.71m14.017 6.453L21.532 1m11.25 13.164 4.058-7.571M41.881 16 46 11.21M5.303 16 1 11.985"
    />
  </svg>
)

export const StrokeVector = () => (
  <svg
    className={styles.strokeVector}
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={15}
    fill="none"
  >
    <path
      stroke="var(--foreground)"
      d="m1 6.337 12.114 4.638L6.22 6.337l11.62 4.45-12.534-7.34L30.105 14 7.248 1l22.171 9.975-10.667-7.528 14.82 6.117L24.39 3.89 41 7.547"
    />
  </svg>
)
