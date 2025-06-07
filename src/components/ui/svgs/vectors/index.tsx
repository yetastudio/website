//! Styles
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

export const TopLeftSummaryVector = () => (<div
  className={styles.topLeftSummaryVectorBox}
>
  <svg
    className={styles.topLeftSummaryVector}
    xmlns="http://www.w3.org/2000/svg"
    width={85}
    height={79}
    fill="none"
  >
    <path
      stroke="#E4E5E0"
      strokeWidth={6.545}
      d="m10.427-9.756 13.8 39.964m0 0-.997 39.184m.997-39.184L-20 60.425m44.227-30.217 43.063 2.73m-43.063-2.73L48.17-31.2M24.227 30.208l59.191 31.971m-59.19-31.971L.782 72.12m23.444-41.913L-17.839-7.027m42.066 37.235L64.63 1.356M24.227 30.208l-36.412-3.314m36.412 3.314L48.17 76.8"
    />
    <path
      stroke="#0A0B04"
      strokeOpacity={0.2}
      strokeWidth={6.545}
      d="m10.427-9.756 13.8 39.964m0 0-.997 39.184m.997-39.184L-20 60.425m44.227-30.217 43.063 2.73m-43.063-2.73L48.17-31.2M24.227 30.208l59.191 31.971m-59.19-31.971L.782 72.12m23.444-41.913L-17.839-7.027m42.066 37.235L64.63 1.356M24.227 30.208l-36.412-3.314m36.412 3.314L48.17 76.8"
    />
    <path
      stroke="url(#top-left-summary-gradient)"
      strokeWidth={6.545}
      d="m10.427-9.756 13.8 39.964m0 0-.997 39.184m.997-39.184L-20 60.425m44.227-30.217 43.063 2.73m-43.063-2.73L48.17-31.2M24.227 30.208l59.191 31.971m-59.19-31.971L.782 72.12m23.444-41.913L-17.839-7.027m42.066 37.235L64.63 1.356M24.227 30.208l-36.412-3.314m36.412 3.314L48.17 76.8"
    />
    <defs>
      <linearGradient
        id="top-left-summary-gradient"
        x1={55}
        x2={-10.5}
        y1={90.3}
        y2={-22.2}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={"#C5C7BC"} />
        <stop offset={1} stopColor={"#60615C"} />
      </linearGradient>
    </defs>
  </svg>
</div>)


export const TopRightSummaryVector = () => (
  <div className={styles.topRightSummaryVectorBox}>
    <svg
      className={styles.topRightSummaryVector}
      xmlns="http://www.w3.org/2000/svg"
      width={102}
      height={89}
      fill="none"
    >
      <path
        stroke="#E4E5E0"
        strokeWidth={7}
        d="M84.096-14.963 94.46 5.998 62.933-4.247l43.67 37.85L47.166 4.905l48.16 32.019-69.06-26.3 112.61 73.441L1.998 22.824 89.943 80.62 33.984 56.27 51.87 86.252"
      />
      <path
        stroke="#0A0B04"
        strokeOpacity={0.2}
        strokeWidth={7}
        d="M84.096-14.963 94.46 5.998 62.933-4.247l43.67 37.85L47.166 4.905l48.16 32.019-69.06-26.3 112.61 73.441L1.998 22.824 89.943 80.62 33.984 56.27 51.87 86.252"
      />
      <path
        stroke="url(#top-right-summary-gradient)"
        strokeWidth={7}
        d="M84.096-14.963 94.46 5.998 62.933-4.247l43.67 37.85L47.166 4.905l48.16 32.019-69.06-26.3 112.61 73.441L1.998 22.824 89.943 80.62 33.984 56.27 51.87 86.252"
      />
      <defs>
        <linearGradient
          id="top-right-summary-gradient"
          x1={103.473}
          x2={51.588}
          y1={-3.776}
          y2={86.091}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={"#60615C"} />
          <stop offset={1} stopColor={"#C5C7BC"} />
        </linearGradient>
      </defs>
    </svg>
  </div>
)


export const BottomLeftSummaryVector = () => (
  <div className={styles.bottomLeftSummaryVectorBox}>
    <svg
      className={styles.bottomLeftSummaryVector}
      xmlns="http://www.w3.org/2000/svg"
      width={124}
      height={97}
      fill="none"
    >
      <path
        stroke="#E4E5E0"
        strokeWidth={8}
        d="m6.223 3.745 66.213 45.514L9.58 26.989l63.524 43.65-100.518-42.462 148.88 91.249L-56.98 41.282l139.907 80.594-101.686-33.807 86.58 54.869-77.364-30.565 56.744 67.32"
      />
      <path
        stroke="#0A0B04"
        strokeOpacity={0.2}
        strokeWidth={8}
        d="m6.223 3.745 66.213 45.514L9.58 26.989l63.524 43.65-100.518-42.462 148.88 91.249L-56.98 41.282l139.907 80.594-101.686-33.807 86.58 54.869-77.364-30.565 56.744 67.32"
      />
      <path
        stroke="url(#bottom-left-summary-gradient)"
        strokeWidth={8}
        d="m6.223 3.745 66.213 45.514L9.58 26.989l63.524 43.65-100.518-42.462 148.88 91.249L-56.98 41.282l139.907 80.594-101.686-33.807 86.58 54.869-77.364-30.565 56.744 67.32"
      />
      <defs>
        <linearGradient
          id="bottom-left-summary-gradient"
          x1={46.609}
          x2={20.869}
          y1={179.779}
          y2={1.629}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={"#60615C"} />
          <stop offset={1} stopColor={"#C5C7BC"} />
        </linearGradient>
      </defs>
    </svg>
  </div>
)


export const BottomRightSummaryVector = () => (
  <div className={styles.bottomRightSummaryVectorBox}>
    <svg
      className={styles.bottomRightSummaryVector}
      xmlns="http://www.w3.org/2000/svg"
      width={98}
      height={85}
      fill="none"
    >
      <path
        stroke="#E4E5E0"
        strokeWidth={8}
        d="M43.317 26.419 66.66 56.157m0 0 25.702 27.076M66.66 56.157l32.67-28.304M66.66 56.157 39.486 90.689M66.66 56.157.82 51.447m65.84 4.71 12.607 66.163M66.66 56.157l45.32 8.252m-45.32-8.252L68.89.877"
      />
      <path
        stroke="#0A0B04"
        strokeOpacity={0.2}
        strokeWidth={8}
        d="M43.317 26.419 66.66 56.157m0 0 25.702 27.076M66.66 56.157l32.67-28.304M66.66 56.157 39.486 90.689M66.66 56.157.82 51.447m65.84 4.71 12.607 66.163M66.66 56.157l45.32 8.252m-45.32-8.252L68.89.877"
      />
      <path
        stroke="url(#bottom-right-summary-gradient)"
        strokeWidth={8}
        d="M43.317 26.419 66.66 56.157m0 0 25.702 27.076M66.66 56.157l32.67-28.304M66.66 56.157 39.486 90.689M66.66 56.157.82 51.447m65.84 4.71 12.607 66.163M66.66 56.157l45.32 8.252m-45.32-8.252L68.89.877"
      />
      <defs>
        <linearGradient
          id="bottom-right-summary-gradient"
          x1={36.844}
          x2={100.785}
          y1={10.794}
          y2={99.8}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={"#C5C7BC"} />
          <stop offset={1} stopColor={"#60615C"} />
        </linearGradient>
      </defs>
    </svg>
  </div>
)


export const MiddleLeftSummaryVector = () => (
  <div className={styles.middleLeftSummaryVectorBox}>
    <svg
      className={styles.middleLeftSummaryVector}
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={39}
      fill="none"
    >
      <path
        stroke="#E4E5E0"
        strokeWidth={2.368}
        d="M25.027 12.718 12.497 8.98m11.056 11.213L1 18.226m22.553 9L10.58 30.472m16.116 4.033L18.492 37.8m8.205-32.557L19.82 1.8"
      />
      <path
        stroke="#0A0B04"
        strokeOpacity={0.2}
        strokeWidth={2.368}
        d="M25.027 12.718 12.497 8.98m11.056 11.213L1 18.226m22.553 9L10.58 30.472m16.116 4.033L18.492 37.8m8.205-32.557L19.82 1.8"
      />
      <path
        stroke="url(#middle-left-gradient)"
        strokeWidth={2.368}
        d="M25.027 12.718 12.497 8.98m11.056 11.213L1 18.226m22.553 9L10.58 30.472m16.116 4.033L18.492 37.8m8.205-32.557L19.82 1.8"
      />
      <defs>
        <linearGradient
          id="middle-left-gradient"
          x1={1}
          x2={26.697}
          y1={19.8}
          y2={19.8}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={"#60615C"} />
          <stop offset={1} stopColor={"#C5C7BC"} />
        </linearGradient>
      </defs>
    </svg>
  </div>
)


export const MiddleRightSummaryVector = () => (
  <div className={styles.middleRightSummaryVectorBox}>
    <svg
      className={styles.middleRightSummaryVector}
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={39}
      fill="none"
    >
      <path
        stroke="#E4E5E0"
        strokeWidth={2.368}
        d="M2.67 12.718 15.2 8.98M4.145 20.193l22.552-1.967m-22.552 9 12.971 3.246M1 34.505 9.205 37.8M1 5.243 7.879 1.8"
      />
      <path
        stroke="#0A0B04"
        strokeOpacity={0.2}
        strokeWidth={2.368}
        d="M2.67 12.718 15.2 8.98M4.145 20.193l22.552-1.967m-22.552 9 12.971 3.246M1 34.505 9.205 37.8M1 5.243 7.879 1.8"
      />
      <path
        stroke="url(#middle-right-gradient)"
        strokeWidth={2.368}
        d="M2.67 12.718 15.2 8.98M4.145 20.193l22.552-1.967m-22.552 9 12.971 3.246M1 34.505 9.205 37.8M1 5.243 7.879 1.8"
      />
      <defs>
        <linearGradient
          id="middle-right-gradient"
          x1={26.697}
          x2={1}
          y1={19.8}
          y2={19.8}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={"#60615C"} />
          <stop offset={1} stopColor={"#C5C7BC"} />
        </linearGradient>
      </defs>
    </svg>
  </div>
)
