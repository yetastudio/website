"use client"

//! Hooks
import { useTheme } from "@/hooks/useTheme";

//! Components
import Image from "next/image";
import Chip from "@/components/ui/chip";
import {
  TopLeftSummaryVector,
  TopRightSummaryVector,
  BottomLeftSummaryVector,
  BottomRightSummaryVector,
  MiddleLeftSummaryVector,
  MiddleRightSummaryVector,
} from "../../ui/svgs";

//! Styles
import styles from "./styles.module.css";

function Summary() {
  const { isDarkMode } = useTheme()

  return (
    <div className={styles.summary}>
      <TopLeftSummaryVector />
      <TopRightSummaryVector />
      <BottomLeftSummaryVector />
      <BottomRightSummaryVector />
      <MiddleLeftSummaryVector />
      <MiddleRightSummaryVector />
      <div className={styles.summaryContent}>
        <div className={styles.summmaryHead}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>Yeta</h3>
            <div className={styles.logoBox}>
              <Image
                className={styles.logo}
                src={isDarkMode ?
                  "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/light-logo-mark_iza4vx.svg" :
                  "https://res.cloudinary.com/doowhwdzj/image/upload/v1749262439/dark-logo-mark_a77ofi.svg"
                }
                alt={"Yeta Studio Logo Mark"}
                fill
                priority
                quality={100}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h3 className={styles.title}>Studio</h3>
          </div>
          <h4 className={styles.subtitle}>in a nutshell</h4>
        </div>
        <Chip children={"Working with worldwide visionary brands"} isInverted />
        <p className={styles.description}>
          We craft <span>pixel-perfect</span> websites for brands that value <span>visual excellence</span> and <span>meaningful</span> user experiences.
        </p>

        <p className={styles.quote}>
          We <span>design</span> and <span>develop</span> with <u className={styles.italic}>purpose</u>
        </p>

        <p className={styles.description}>
          From user-centered <span>design</span> to robust <span>development</span>.
          <br />
          Every pixel and every <span> line of code</span> is built with intention.
        </p>
      </div>
    </div>
  )
}

export default Summary;