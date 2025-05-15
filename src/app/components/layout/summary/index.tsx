// "use client"

//! React Core
// import { useEffect, useState } from 'react';

//! Components
import Image from "next/image";
import { BlueSummaryVector, OrangeSummaryVector, PinkSummaryVector, VioletSummaryVector } from "../../ui/svgs";

//! Styles
import styles from "./styles.module.css";

function Summary() {
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   setIsDarkMode(darkModeMediaQuery.matches);

  //   const handler = (e: any) => setIsDarkMode(e.matches);
  //   darkModeMediaQuery.addEventListener('change', handler);

  //   return () => darkModeMediaQuery.removeEventListener('change', handler);
  // }, []);

  return (
    <div className={styles.summary}>
      {/* <BlueSummaryVector />
      <OrangeSummaryVector />
      <PinkSummaryVector />
      <VioletSummaryVector /> */}
      <div className={styles.summaryContent}>
        <div className={styles.summmaryHead}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>Yeta</h3>
            <div className={styles.logoBox}>
              <Image
                className={styles.logo}
                src={"https://res.cloudinary.com/doowhwdzj/image/upload/v1747237025/Variant_Dark_Style_Transparent_p5qq52.svg"}
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