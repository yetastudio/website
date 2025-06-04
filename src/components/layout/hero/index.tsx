//! Components
import Image from "next/image";
import { Button } from "@/components/ui";

//! Styles
import styles from "./styles.module.css";
import { HighlightVector, StrokeVector } from "../../ui/svgs";

function Hero() {
  return (
    <div className={styles.hero}>
      <div
        className={styles.heroContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            Yeta
          </h1>
          <div className={styles.logoWrapper}>
            <Image
              className={styles.logo}
              src={"https://res.cloudinary.com/doowhwdzj/image/upload/v1745707536/Variant_Dark_wcqmcg.svg"}
              alt={"Yeta Studio Logo Mark"}
              fill
              priority
              quality={100}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h1 className={styles.title}>
            Studio
          </h1>
        </div>
        <div className={styles.sloganContainer}>
          <HighlightVector />
          <StrokeVector />
          <h2 className={styles.slogan}>
            ‘Cause <del>great</del> brands
            aren’t built on <del>luck</del>.
          </h2>
        </div>
        <div className={styles.heroCTAs}>
          <Button title="Why choose Yeta Studio" radius="rounded" isFullWidth />
          <Button title="Let's build something" radius="rounded" isFullWidth />
        </div>
      </div>
    </div>
  )
}

export default Hero;